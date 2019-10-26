package com.example.rastreador;

import androidx.appcompat.app.AppCompatActivity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import com.google.gson.JsonObject;
import com.koushikdutta.async.future.FutureCallback;
import com.koushikdutta.ion.Ion;

public class AutorizarActivity extends AppCompatActivity {

    private Button btn;
    private TextView text;
    private EditText campoLogin;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_autorizar);

        btn = (Button) findViewById(R.id.btnAutorizar1);
        text = (TextView) findViewById(R.id.text1);
        campoLogin = (EditText) findViewById(R.id.campoSlave);

        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String slave = campoLogin.getText().toString().trim();
                if (!slave.isEmpty()) {
                    Intent it = getIntent();
                    final String master = it.getStringExtra("login");
                    Autorizar(master,slave);
                } else {
                    campoLogin.setError("Insira um login");
                }
            }
        });
    }

    public void Autorizar(final String master, final String slave) {

        JsonObject json = new JsonObject();
        json.addProperty("master", master);
        json.addProperty("slave", slave);

        Ion.with(this).load("http://192.168.0.103:3000/autorizar")
                .setJsonObjectBody(json)
                .asJsonObject().setCallback(new FutureCallback<JsonObject>() {
            @Override
            public void onCompleted(Exception e, JsonObject result) {
                if(e != null) { //Erro na requisição
                    Toast.makeText(getApplicationContext(),"Erro: " + e.toString(), Toast.LENGTH_LONG).show();
                }
                String erro = "";
                try {
                    erro = result.get("code").getAsString();
                } catch (Exception ex) {
                    Toast.makeText(getApplicationContext(), "O usuário " + slave + " foi autorizado", Toast.LENGTH_LONG).show();
                }
                if (erro.equals("ER_DUP_ENTRY")) { //Caso o usuário já esteja autorizado
                    Toast.makeText(getApplicationContext(), "Esse usuário já foi autorizado anteriormente", Toast.LENGTH_LONG).show();
                } else if (erro.equals("ER_BAD_NULL_ERROR")) { //Caso o usuário slave não exista
                    Toast.makeText(getApplicationContext(), "O usuário " + slave + " não existe", Toast.LENGTH_LONG).show();
                }

                Intent intent = new Intent(getApplicationContext(), RastreioActivity.class);
                intent.putExtra("login", master);
                startActivity(intent);
                finish();
            }
        });
    }
}
