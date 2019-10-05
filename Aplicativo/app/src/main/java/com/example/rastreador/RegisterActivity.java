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

public class RegisterActivity extends AppCompatActivity {

    private EditText name, login, password;
    private Button btn_regist;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        name = findViewById(R.id.etNome);
        login = findViewById(R.id.etLogin);
        password = findViewById(R.id.etSenha);
        btn_regist = findViewById(R.id.btn_regist);

        btn_regist.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String mNome = name.getText().toString().trim();
                String mLogin = login.getText().toString().trim();
                String mSenha = password.getText().toString().trim();

                if (!mNome.isEmpty() || !mLogin.isEmpty() || !mSenha.isEmpty()) {
                    Cadastrar(mLogin,mSenha,mNome);
                } else {
                    name.setError("Insira seu nome");
                    login.setError("Insira um login");
                    password.setError("Insira uma senha");
                }
            }
        });
    }

    public void Cadastrar(String login, String senha, String nome){

        JsonObject json = new JsonObject();
        json.addProperty("name", nome);
        json.addProperty("login", login);
        json.addProperty("password", senha);

        Ion.with(this).load("http://192.168.0.103:3000/adduser")
                .setJsonObjectBody(json)
                .asJsonObject().setCallback(new FutureCallback<JsonObject>() {
            @Override
            public void onCompleted(Exception e, JsonObject result) {
                if(e != null) { //Erro no cadastro
                    Toast.makeText(getApplicationContext(), "Erro: " + e.toString(), Toast.LENGTH_LONG).show();
                } else { //Cadastro efetuado
                    Toast.makeText(getApplicationContext(), "Usuário Cadastrado", Toast.LENGTH_SHORT).show();
                    Intent intent = new Intent(getApplicationContext(), MainActivity.class);
                    startActivity(intent);
                    finish();
                }
            }
        });
    }
}
