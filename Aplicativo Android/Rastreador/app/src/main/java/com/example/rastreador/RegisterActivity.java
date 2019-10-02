package com.example.rastreador;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
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

public class RegisterActivity extends AppCompatActivity {

    private EditText name, login, password;
    private Button btn_regist;
    //private static String URL_REGIST = "http://192.168.0.103/register.php";
    //private static String URL_REGIST = "http://projeto-rastreador.000webhostapp.com/register.php";
    private static String URL_REGIST = "http://rastreador-com241.000webhostapp.com/register.php";

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
                    Regist();
                    Intent intent = new Intent(getApplicationContext(), MainActivity.class);
                    startActivity(intent);
                } else {
                    name.setError("Insira seu nome");
                    login.setError("Insira um login");
                    password.setError("Insira uma senha");
                }
            }
        });
    }

    private void Regist() {
        btn_regist.setVisibility(View.GONE);

        final String name = this.name.getText().toString().trim();
        final String login = this.login.getText().toString().trim();
        final String password = this.password.getText().toString().trim();

        StringRequest stringRequest = new StringRequest(Request.Method.POST, URL_REGIST,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONObject jsonObject = new JSONObject(response);
                            String success = jsonObject.getString("success");

                            if (success.equals("1")) {
                                Toast.makeText(getApplicationContext(),"Registrado com Sucesso!", Toast.LENGTH_SHORT).show();
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                            Toast.makeText(getApplicationContext(),"Erro 1: " + e.toString(), Toast.LENGTH_SHORT).show();
                            btn_regist.setVisibility(View.VISIBLE);
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Toast.makeText(getApplicationContext(),"Erro 2: " + error.toString(), Toast.LENGTH_SHORT).show();
                        btn_regist.setVisibility(View.VISIBLE);
                    }
                })
        {
            @Override
            protected Map<String, String> getParams() throws AuthFailureError {
                Map<String, String> params = new HashMap<>();
                params.put("name",name);
                params.put("login",login);
                params.put("password",password);
                return params;
            }
        };

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        requestQueue.add(stringRequest);
    }
}
