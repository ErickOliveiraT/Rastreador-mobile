#Virtual simulador of tracking device

from math import cos, asin, sqrt, pi
from datetime import datetime, timedelta
from dotenv import load_dotenv
from random import randint
import requests
import calendar
import sys
import os

load_dotenv('C:\\Users\\Érick\\Desktop\\Projetos\\Rastreador\\tester\\.env')
input_file = sys.argv[1]
api_url = os.environ['API_URL_PROD']
token = False
start_at = datetime(2022, 4, 22, 6, 0, 0)
current_speed = 0
all_points = []

#Linear Interpolation Reference Points
x1 = 25
y1 = 10
x2 = 50
y2 = 50

#Speed Reference
min_speed = 90
max_speed = 115

def calc_distance(lat1, lon1, lat2, lon2):
    p = pi/180
    a = 0.5 - cos((lat2-lat1)*p)/2 + cos(lat1*p) * cos(lat2*p) * (1-cos((lon2-lon1)*p))/2
    return 12742 * asin(sqrt(a)) * 1000

def get_send_after_distance(speed):
    if speed <= x1:
        return y2
    return ((x2-speed)/(x2-x1))*y1 + ((x1-speed)/(x1-x2))*y2

def auth():
    data = {'login': os.environ['LOGIN'], 'password': os.environ['PASSWORD']}
    res = requests.post(api_url + '/auth', json = data)
    if res.status_code == 200:
        return res.json()['token']
    return False

def post_coordinate(coord, current_date):
    coord['datetime'] = current_date.strftime("%Y-%m-%d %H:%M:%S")
    coord['login'] = os.environ['LOGIN']
    coord['api_key'] = os.environ['API_KEY']
    coord['type'] = 'point'
    print(coord)
    res = requests.post(api_url + '/addcoordinate', json = coord)
    print(res)

def simulate():
    token = auth()
    if not token:
        print('Error during login')
        sys.exit(0)
    print('token:', token)
    
    with open(input_file) as file:
        current_date = start_at
        coords = file.readlines()
        points_counter = 0
        points_sent = 0
        distance_after_last_post = 0
        send_after_distance = 10
        for i in range(0,len(coords)):
            current_speed = randint(min_speed, max_speed)
            longitude = coords[i].split(',')[0]
            latitude = coords[i].split(',')[1].split('\n')[0]
            timestamp = calendar.timegm(current_date.utctimetuple())
            current_point = {'latitude': float(latitude), 'longitude': float(longitude), 'timestamp': str(timestamp)}
            if i == 0:
                all_points.append(current_point)
                continue
            print('\n{} of {}:'.format(i+1,len(coords)))
            distance = calc_distance(all_points[i-1]['latitude'], all_points[i-1]['longitude'], current_point['latitude'], current_point['longitude'])
            distance_after_last_post += distance
            print('Distance after last point: {}\nDistance after last post: {}\nCurrent Speed: {}\n'.format(distance,distance_after_last_post,current_speed))
            if distance_after_last_post >= send_after_distance:
                send_after_distance = get_send_after_distance(current_speed)
                post_coordinate(current_point, current_date)
                distance_after_last_post = 0
                points_sent += 1
            current_date += timedelta(seconds=randint(0,1))
            points_counter += 1
            all_points.append(current_point)
    print('\nTotal of points: {}'.format(points_counter))
    print('Points sent: {}'.format(points_sent))

simulate()

#python simulator.py coords_rota_parque.dat