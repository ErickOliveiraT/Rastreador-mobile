#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>

#define LED_WIFI D2
#define LED_TRACKING D3
#define LED_POWER D1

const char* ssid = "Tracker_ESP8266_SN01";
const char* password = "";

int wifiStatus;

void setup() {
  pinMode(LED_WIFI, OUTPUT);
  pinMode(LED_TRACKING, OUTPUT);
  pinMode(LED_POWER, OUTPUT);
  digitalWrite(LED_WIFI, LOW);
  digitalWrite(LED_TRACKING, LOW);
  digitalWrite(LED_POWER, HIGH);
  
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
   Serial.print("Entrou no loop\n");
   delay(1000);
}
