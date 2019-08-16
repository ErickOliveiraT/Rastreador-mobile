package com.example.rastreador;

import androidx.appcompat.app.AppCompatActivity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity {

    private EditText login, password;
    private Button btn_login;
    private TextView link_regist;
    private static String URL_LOGIN = "http://192.168.0.103/login.php";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        login = findViewById(R.id.etLogin2);
        password = findViewById(R.id.etSenha2);
        btn_login = findViewById(R.id.btn_logar);
        link_regist = findViewById(R.id.link_regist);

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

                if (!mLogin.isEmpty() || !mPass.isEmpty()) {
                    Login(mLogin, mPass);
                } else {
                    login.setError("Insira seu login");
                    password.setError("Insira sua senha");
                }
            }
        });
    }

    private void Login(final String pLogin, final String pPassword) {

        StringRequest stringRequest = new StringRequest(Request.Method.POST, URL_LOGIN,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONObject jsonObject = new JSONObject(response);
                            String success = jsonObject.getString("success");

                            if (success.equals("1")) {
                                Toast.makeText(getApplicationContext(),"Usuário Logado", Toast.LENGTH_SHORT).show();
                                Intent intent = new Intent(getApplicationContext(), RastreioActivity.class);
                                intent.putExtra("login", pLogin);
                                startActivity(intent);
                                finish();
                            }

                        } catch (JSONException e) {
                            e.printStackTrace();
                            btn_login.setVisibility(View.VISIBLE);
                            Toast.makeText(MainActivity.this, "Erro 1 " + e.toString(), Toast.LENGTH_SHORT).show();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        btn_login.setVisibility(View.VISIBLE);
                        Toast.makeText(MainActivity.this, "Erro 2: " + error.toString(), Toast.LENGTH_SHORT).show();
                    }
                })
        {
            @Override
            protected Map<String, String> getParams() throws AuthFailureError {
                Map<String, String> params = new HashMap<>();
                params.put("email", pLogin);
                params.put("password", pPassword);
                return params;
            }
        };

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        requestQueue.add(stringRequest);
    }
}
