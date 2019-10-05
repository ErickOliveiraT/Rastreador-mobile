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

public class MainActivity extends AppCompatActivity {

    private EditText login, password;
    private Button btn_login;
    private Button link_regist;
    private Button btn_esqueci;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        login = findViewById(R.id.etLogin2);
        password = findViewById(R.id.etSenha2);
        btn_login = findViewById(R.id.btn_logar);
        link_regist = findViewById(R.id.btn_registrar);

        link_regist.setOnClickListener(new View.OnClickListener() { //Vai para a Activity de Cadastro
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(getApplicationContext(), RegisterActivity.class);
                startActivity(intent);
            }
        });

        btn_login.setOnClickListener(new View.OnClickListener() { //Chama Função de Login
            @Override
            public void onClick(View v) {
                String mLogin = login.getText().toString().trim();
                String mPass = password.getText().toString().trim();

                if (!mLogin.isEmpty() && !mPass.isEmpty()) {
                    Login(mLogin,mPass);
                } else {
                    login.setError("Insira seu login");
                    password.setError("Insira sua senha");
                }
            }
        });
    }

    public void Login(final String login, String senha){

        JsonObject json = new JsonObject();
        json.addProperty("login", login);
        json.addProperty("password", senha);

        Ion.with(this).load("http://192.168.0.107:3000/autenticate")
                .setJsonObjectBody(json)
                .asJsonObject().setCallback(new FutureCallback<JsonObject>() {
            @Override
            public void onCompleted(Exception e, JsonObject result) {
                if(e != null) { //Erro na requisição
                    Toast.makeText(getApplicationContext(),"Erro: " + e.toString(), Toast.LENGTH_LONG).show();
                } else if (result.get("valid").getAsBoolean()) { //Login Efetuado
                    Toast.makeText(getApplicationContext(),"Usuário Logado", Toast.LENGTH_SHORT).show();
                    Intent intent = new Intent(getApplicationContext(), RastreioActivity.class);
                    intent.putExtra("login", login);
                    startActivity(intent);
                    finish();
                } else if (!result.get("valid").getAsBoolean()) { //Login não efetuado
                    Toast.makeText(getApplicationContext(),"Usuário e/ou senha incorreto(s)", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }
}
