package com.example.rastreador;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;
import com.google.gson.JsonObject;
import com.koushikdutta.async.future.FutureCallback;
import com.koushikdutta.ion.Ion;

public class RecuperarActivity extends AppCompatActivity {

    private EditText campoLogin;
    private Button btn_recuperar;
    private ProgressBar progress;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_recuperar);

        btn_recuperar = findViewById(R.id.btn_recuperar2);
        campoLogin = findViewById(R.id.campoLogin);
        progress = findViewById(R.id.progressBar);
        progress.setVisibility(View.INVISIBLE);

        btn_recuperar.setOnClickListener(new View.OnClickListener() { //Chama Função de Login
            @Override
            public void onClick(View v) {
                String mLogin = campoLogin.getText().toString().trim();

                if (!mLogin.isEmpty()) {
                    progress.setVisibility(View.VISIBLE);
                    btn_recuperar.setClickable(false);
                    solicitaToken(mLogin);
                } else {
                    campoLogin.setError("Insira seu login");
                }
            }
        });
    }

    public void solicitaToken(final String login) {

        JsonObject json = new JsonObject();
        json.addProperty("login", login);

        Ion.with(this).load("http://192.168.0.103:3000/solicitarectoken")
                .setJsonObjectBody(json)
                .asJsonObject().setCallback(new FutureCallback<JsonObject>() {
            @Override
            public void onCompleted(Exception e, JsonObject result) {
                if(e != null) { //Erro na requisição
                    Toast.makeText(getApplicationContext(),"Erro: " + e.toString(), Toast.LENGTH_LONG).show();
                } else if (result.get("valid").getAsBoolean()) { //Email enviado
                    String email = result.get("mail").getAsString();
                    Intent intent = new Intent(getApplicationContext(), TokenActivity.class);
                    intent.putExtra("email", email);
                    intent.putExtra("login", login);
                    startActivity(intent);
                    finish();
                } else if (!result.get("valid").getAsBoolean()) { //Erro
                    Toast.makeText(getApplicationContext(),"Erro: " + result.get("error").getAsString(), Toast.LENGTH_LONG).show();
                }
            }
        });
    }
}
