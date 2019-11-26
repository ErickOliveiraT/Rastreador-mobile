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

public class TokenActivity extends AppCompatActivity {

    private TextView text;
    private Button botao;
    private EditText token;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_token);

        token = findViewById(R.id.campoToken);
        text = findViewById(R.id.textView);
        botao = findViewById(R.id.btn_recuperar3);

        Intent it = getIntent();
        final String mLogin = it.getStringExtra("login");
        final String email = it.getStringExtra("email");
        text.setText("Digite o código de recuperação que enviamos para " + email);

        botao.setOnClickListener(new View.OnClickListener() { //Chama Função de Login
            @Override
            public void onClick(View v) {
                String mToken = token.getText().toString().trim();

                if (!mToken.isEmpty()) {
                    validarToken(mToken, mLogin);
                } else {
                    token.setError("Insira o código");
                }
            }
        });
    }

    public void validarToken(String token, final String login) {

        JsonObject json = new JsonObject();
        json.addProperty("login", login);
        json.addProperty("token", token);

        Ion.with(this).load("http://200.235.90.248:4000/validarectoken")
                .setJsonObjectBody(json)
                .asJsonObject().setCallback(new FutureCallback<JsonObject>() {
            @Override
            public void onCompleted(Exception e, JsonObject result) {
                if(e != null) { //Erro na requisição
                    Toast.makeText(getApplicationContext(),"Erro: " + e.toString(), Toast.LENGTH_LONG).show();
                } else if (result.get("valid").getAsBoolean()) { //Token Correto
                    Intent intent = new Intent(getApplicationContext(), TrocarSenhaActivity.class);
                    intent.putExtra("login", login);
                    startActivity(intent);
                    finish();
                } else if (!result.get("valid").getAsBoolean()) { //Token Incorreto
                    Toast.makeText(getApplicationContext(),"Erro: " + result.get("error").getAsString(), Toast.LENGTH_LONG).show();
                }
            }
        });
    }
}
