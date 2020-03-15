#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>

#define LED_WIFI D2
#define LED_TRACKING D1
#define LED_POWER D3
#define LED_POST LED_BUILTIN

const char* ssid = "";
const char* password = "";     
 
int wifiStatus;

void setup() {
  pinMode(LED_POST, OUTPUT);
  pinMode(LED_WIFI, OUTPUT);
  pinMode(LED_TRACKING, OUTPUT);
  pinMode(LED_POWER, OUTPUT);
  digitalWrite(LED_WIFI, LOW);
  digitalWrite(LED_TRACKING, LOW);
  digitalWrite(LED_POWER, HIGH);
  digitalWrite(LED_POST, HIGH);
  
  Serial.begin(9600);
  delay(200);
 
  //Connecting to Wifi 
  Serial.println();
  Serial.println();
  Serial.print("A ligar à rede ");
  Serial.println(ssid);
 
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
}
 
void loop() {
  wifiStatus = WiFi.status();
  
  if(wifiStatus == WL_CONNECTED){ //Connected
    digitalWrite(LED_WIFI, HIGH);
    Serial.println("");
    Serial.println("Wifi ligado!");  

    digitalWrite(LED_POST, LOW);
    
    DynamicJsonDocument doc(2048);
    doc["login"] = "bargrall";
    doc["latitude"] = "-22.41905901577895";
    doc["longitude"] = "-45.45496811285084";
    
    // Serialize JSON document
    String json;
    serializeJson(doc, json);
    //Serial.println(json);
    
    HTTPClient http;
    
    // Send request
    http.begin("http://192.168.0.108:4000/addcoordenada");
    http.addHeader("Content-Type", "application/json");
    http.POST(json);
    
    //Serial.print(http.getString()); //Response message
    
    http.end();
    digitalWrite(LED_POST, HIGH);
  }  
  else { //Disconnected
    digitalWrite(LED_WIFI, LOW);
    Serial.println("");
    Serial.println("Sem conexão wifi");
  }
  
  delay(5000);
}
