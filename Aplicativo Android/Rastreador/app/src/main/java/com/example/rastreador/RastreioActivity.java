package com.example.rastreador;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.view.View;
import android.widget.Button;
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
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class RastreioActivity extends AppCompatActivity {

    private Button button;
    private TextView text;
    private LocationManager locationManager;
    private LocationListener locationListener;
    //private static String URL_REGIST = "http://192.168.0.103/coordenadas.php";
    //private static String URL_REGIST = "http://projeto-rastreador.000webhostapp.com/coordenadas.php";
    private static String URL_REGIST = "http://rastreador-com241.000webhostapp.com/coordenadas.php";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_rastreio);

        button = (Button) findViewById(R.id.button);
        text = (TextView) findViewById(R.id.text);
        final int[] cont = {0};

        Intent it = getIntent();
        final String login = it.getStringExtra("login").toString();
        text.setText("Olá "+login+", Pressione o botão abaixo para iniciar o rastreamento");

        locationManager = (LocationManager) getSystemService(LOCATION_SERVICE);
        locationListener = new LocationListener() {

            @Override
            public void onLocationChanged(Location location) {
                cont[0]++;
                Date currentTime = Calendar.getInstance().getTime();
                final String hora = currentTime.toString();
                final String lat = String.valueOf(location.getLatitude());
                final String lon = String.valueOf(location.getLongitude());
                text.setText("Lat: " + lat + "\nLong: " + lon + "\nHora: " + hora + "\nCaptura: #" + cont[0]);
                salvarCoordenadas(login,lat,lon,hora);
            }

            @Override
            public void onStatusChanged(String s, int i, Bundle bundle) {

            }

            @Override
            public void onProviderEnabled(String s) {

            }

            @Override
            public void onProviderDisabled(String s) { //GPS desativado -- manda para as configurações
                Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                startActivity(intent);
            }
        };

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.ACCESS_COARSE_LOCATION,
                        Manifest.permission.INTERNET}, 10);
                return;
            }
        } else {
            configureButton();
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        switch(requestCode){
            case 10:
                if (grantResults.length>0 && grantResults[0] == PackageManager.PERMISSION_GRANTED){
                    configureButton();
                }
                return;
        }
    }

    private void configureButton() {
        button.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
                button.setEnabled(false);
                text.setText("Obtendo sinal GPS...");
                locationManager.requestLocationUpdates("gps", 20000, 0, locationListener);
                //provider - minTime(ms) - minDistance - listener
            }
        });
    }

    private void salvarCoordenadas(String pLogin, String pLatitude, String pLongitude, String pHora) {

        final String login = pLogin.trim();
        final String latitude = pLatitude.trim();
        final String longitude = pLongitude.trim();
        final String hora = pHora.trim();

        StringRequest stringRequest = new StringRequest(Request.Method.POST, URL_REGIST,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONObject jsonObject = new JSONObject(response);
                            String success = jsonObject.getString("success");

                            if (success.equals("1")) {
                                Toast.makeText(getApplicationContext(),"Coordenadas atuais enviadas ao banco de dados!", Toast.LENGTH_SHORT).show();
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                            Toast.makeText(getApplicationContext(),"Erro 1: " + e.toString(), Toast.LENGTH_SHORT).show();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Toast.makeText(getApplicationContext(),"Erro 2: " + error.toString(), Toast.LENGTH_SHORT).show();
                    }
                })
        {
            @Override
            protected Map<String, String> getParams() throws AuthFailureError {
                Map<String, String> params = new HashMap<>();
                params.put("login", login);
                params.put("latitude", latitude);
                params.put("longitude",longitude);
                params.put("hora", hora);
                return params;
            }
        };

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        requestQueue.add(stringRequest);
    }
}