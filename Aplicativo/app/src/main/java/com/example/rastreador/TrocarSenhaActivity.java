package com.example.rastreador;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import com.google.gson.JsonObject;
import com.koushikdutta.async.future.FutureCallback;
import com.koushikdutta.ion.Ion;

public class TrocarSenhaActivity extends AppCompatActivity {

    private Button btn_salvar;
    private EditText etSenha1, etSenha2;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_trocar_senha);

        btn_salvar = findViewById(R.id.btn_mudar);
        etSenha1 = findViewById(R.id.novaSenha);
        etSenha2 = findViewById(R.id.novaSenha2);
        Intent it = getIntent();
        final String mLogin = it.getStringExtra("login");

        btn_salvar.setOnClickListener(new View.OnClickListener() { //Chama Função de Login
            @Override
            public void onClick(View v) {
                String mSenha1 = etSenha1.getText().toString().trim();
                String mSenha2 = etSenha2.getText().toString().trim();

                if (!mSenha1.equals(mSenha2)) { //Senhas Diferentes
                    Toast.makeText(getApplicationContext(),"As senhas não combinam", Toast.LENGTH_SHORT).show();
                } else { //Campos de senha iguais
                    if (!mSenha1.isEmpty() && !mSenha2.isEmpty()) {
                        mudarSenha(mLogin,mSenha1);
                    } else {
                        etSenha1.setError("Insira a nova Senha");
                        etSenha2.setError("Insira a nova Senha");
                    }
                }
            }
        });

    }

    public void mudarSenha(String login, String senha){

        JsonObject json = new JsonObject();
        json.addProperty("login", login);
        json.addProperty("password", senha);

        Ion.with(this).load("http://200.235.90.248:4000/trocarsenha")
                .setJsonObjectBody(json)
                .asJsonObject().setCallback(new FutureCallback<JsonObject>() {
            @Override
            public void onCompleted(Exception e, JsonObject result) {
                if(e != null) { //Erro na requisição
                    Toast.makeText(getApplicationContext(),"Erro: " + e.toString(), Toast.LENGTH_LONG).show();
                } else {
                    Toast.makeText(getApplicationContext(),"Alterações Salvas", Toast.LENGTH_LONG).show();
                    Intent intent = new Intent(getApplicationContext(), MainActivity.class);
                    startActivity(intent);
                    finish();
                }
            }
        });
    }
}
