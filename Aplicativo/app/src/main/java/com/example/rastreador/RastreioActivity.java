package com.example.rastreador;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
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
import com.google.gson.JsonObject;
import com.koushikdutta.async.future.FutureCallback;
import com.koushikdutta.ion.Ion;
import java.util.Calendar;
import java.util.Date;

public class RastreioActivity extends AppCompatActivity {

    private Button button;
    private Button btnaut;
    private TextView text;
    private LocationManager locationManager;
    private LocationListener locationListener;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_rastreio);

        button = (Button) findViewById(R.id.buttonLigar);
        btnaut = (Button) findViewById(R.id.btnAutorizar);
        text = (TextView) findViewById(R.id.text);
        final int[] cont = {0};

        configureButton();
        Intent it = getIntent();
        final String login = it.getStringExtra("login");
        String login2 = login;
        text.setText("Olá "+login+", Pressione o botão abaixo para iniciar o rastreamento");

        btnaut.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
                Intent intent = new Intent(getApplicationContext(), AutorizarActivity.class);
                Intent it = getIntent();
                final String login = it.getStringExtra("login");
                intent.putExtra("login", login);
                startActivity(intent);
                finish();
            }
        });

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
                salvarCoordenadas(login,lat,lon);
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
                text.setText("Obtendo sinal GPS...");
                configureButton2();
                locationManager.requestLocationUpdates("gps", 20000, 0, locationListener);
                //provider - minTime(ms) - minDistance - listener
            }
        });
    }

    private void configureButton2() {
        button.setText("Desligar Rastreador");
        button.setBackgroundColor(Color.RED);

        button.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
                Intent intent = new Intent(getApplicationContext(), RastreioActivity.class);
                Intent it = getIntent();
                final String login = it.getStringExtra("login");
                intent.putExtra("login", login);
                startActivity(intent);
                finish();
            }
        });
    }

    public void salvarCoordenadas(String login, String latitude, String longitude) {

        JsonObject json = new JsonObject();
        json.addProperty("login", login);
        json.addProperty("latitude", latitude);
        json.addProperty("longitude", longitude);

        Ion.with(this).load("http://200.235.90.248:4000/addcoordenada")
                .setJsonObjectBody(json)
                .asJsonObject().setCallback(new FutureCallback<JsonObject>() {
            @Override
            public void onCompleted(Exception e, JsonObject result) {
                if(e != null) { //Erro na requisição
                    Toast.makeText(getApplicationContext(), "Erro: " + e.toString(), Toast.LENGTH_LONG).show();
                } else { //Coordenadas salvas
                    Toast.makeText(getApplicationContext(), "Coordenadas enviadas ao servidor", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }
}