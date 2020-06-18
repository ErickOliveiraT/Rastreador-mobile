#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <SoftwareSerial.h>
#include <TinyGPS.h>

#define LED_WIFI D2
#define LED_TRACKING D1
#define LED_POWER D3
#define LED_POST LED_BUILTIN
#define RX D7
#define TX D8

const char* ssid = "Tracker_ESP8266_SN01";
const char* password = "";

int wifiStatus;
SoftwareSerial serial1(RX, TX);
TinyGPS gps1;

void setup() {
  pinMode(LED_POST, OUTPUT);
  pinMode(LED_WIFI, OUTPUT);
  pinMode(LED_TRACKING, OUTPUT);
  pinMode(LED_POWER, OUTPUT);
  digitalWrite(LED_WIFI, LOW);
  digitalWrite(LED_TRACKING, LOW);
  digitalWrite(LED_POWER, HIGH);
  digitalWrite(LED_POST, HIGH);
  
  serial1.begin(9600);
  Serial.begin(9600);
  delay(200);

  //Connecting to Wifi 
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
 
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  digitalWrite(LED_WIFI, HIGH);
  Serial.println("\nWifi connected");
}

void loop() {
  bool recebido = false;
  digitalWrite(LED_TRACKING, LOW);

  while (serial1.available()) {
     char cIn = serial1.read();
     recebido = gps1.encode(cIn);
  }

  if (recebido) {
     digitalWrite(LED_TRACKING, HIGH);
 
     long latitude, longitude;
     gps1.get_position(&latitude, &longitude);     

     if (latitude != TinyGPS::GPS_INVALID_F_ANGLE) {
        Serial.print("Latitude: ");
        Serial.println(float(latitude) / 100000, 6);
     }

     if (longitude != TinyGPS::GPS_INVALID_F_ANGLE) {
        Serial.print("Longitude: ");
        Serial.println(float(longitude) / 100000, 6);
        Serial.println();
     }

     if (WiFi.status() != WL_CONNECTED) {
        digitalWrite(LED_WIFI, LOW);
        Serial.println("No wifi");
     } 
     else {
      digitalWrite(LED_POST, LOW);
    
      DynamicJsonDocument doc(2048);
      doc["login"] = "bargrall";
      doc["latitude"] = (float(latitude)/100000);
      doc["longitude"] = (float(longitude)/100000);
      
      // Serialize JSON document
      String json;
      serializeJson(doc, json);
      //Serial.println(json);
      
      HTTPClient http;
      
      // Send request
      http.begin("http://rastreador-mobile.herokuapp.com/addcoordenada");
      http.addHeader("Content-Type", "application/json");
      http.POST(json);
      
      //Serial.print(http.getString()); //Response message
      
      http.end();
      digitalWrite(LED_POST, HIGH);
     }

     digitalWrite(LED_TRACKING, LOW);
     delay(10000);
  }
}
