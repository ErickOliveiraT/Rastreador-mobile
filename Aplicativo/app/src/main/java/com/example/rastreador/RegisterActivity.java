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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegisterActivity extends AppCompatActivity {

    private EditText name, login, password, email;
    private Button btn_regist;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        name = findViewById(R.id.etNome);
        login = findViewById(R.id.etLogin);
        password = findViewById(R.id.etSenha);
        email = findViewById(R.id.etEmail);
        btn_regist = findViewById(R.id.btn_regist);

        btn_regist.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String mNome = name.getText().toString().trim();
                String mLogin = login.getText().toString().trim();
                String mSenha = password.getText().toString().trim();
                String mEmail = email.getText().toString().trim();

                if(isValidEmailAddressRegex(mEmail)) {
                    if (!mNome.isEmpty() && !mLogin.isEmpty() && !mSenha.isEmpty()) {
                        Cadastrar(mLogin,mSenha,mNome,mEmail);
                    } else {
                        name.setError("Insira seu nome");
                        login.setError("Insira um login");
                        password.setError("Insira uma senha");
                    }
                } else {
                    email.setError("Insira um email válido");
                }
            }
        });
    }

    public void Cadastrar(String login, String senha, String nome, String email) {

        JsonObject json = new JsonObject();
        json.addProperty("name", nome);
        json.addProperty("login", login);
        json.addProperty("password", senha);
        json.addProperty("email", email);

        Ion.with(this).load("http://192.168.0.101:3000/adduser")
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

    public static boolean isValidEmailAddressRegex(String email) {
        boolean isEmailIdValid = false;
        if (email != null && email.length() > 0) {
            String expression = "^[\\w\\.-]+@([\\w\\-]+\\.)+[A-Z]{2,4}$";
            Pattern pattern = Pattern.compile(expression, Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(email);
            if (matcher.matches()) {
                isEmailIdValid = true;
            }
        }
        return isEmailIdValid;
    }
}
