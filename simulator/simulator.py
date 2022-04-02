#Virtual simulador of tracking device

from datetime import datetime, timedelta
from dotenv import load_dotenv
from random import randint
import requests
import calendar
import time
import sys
import os

load_dotenv('C:\\Users\\Érick\\Desktop\\Projetos\\Rastreador\\simulator\\.env')
input_file = sys.argv[1]
api_url = os.environ['API_URL_DEV']
token = False
start_at = datetime(2022, 4, 2, 16, 54, 0)
queue_chance = 0.1

def auth():
    data = {'login': os.environ['LOGIN'], 'password': os.environ['PASSWORD']}
    res = requests.post(api_url + '/auth', json = data)
    if res.status_code == 200:
        return res.json()['token']
    return False

def post_coordinate(coord, current_date):
    coord['datetime'] = current_date.strftime("%Y-%m-%d %H:%M:%S")
    coord['timestamp'] = str(calendar.timegm(current_date.utctimetuple())) #Timestamp from current_date
    #coord['timestamp'] = str(time.time()).split('.')[0] #Actual timestamp
    coord['login'] = os.environ['LOGIN']
    coord['api_key'] = os.environ['API_KEY']
    coord['type'] = 'point'
    print(coord)
    res = requests.post(api_url + '/addcoordinate', json = coord)
    print(res)

def post_queue(points):
    data = {'login': os.environ['LOGIN'], 'api_key': os.environ['API_KEY'], 'type': 'queue'}
    data['points'] = points
    print(data)
    res = requests.post(api_url + '/addcoordinate', json = data)
    print(res)

def is_queue():
    rd = randint(1,100)
    return rd <= queue_chance*100

def simulate():
    token = auth()
    if not token:
        print('Error during login')
        sys.exit(0)
    print('token:', token)
    
    with open(input_file) as file:
        current_date = start_at
        #coords = file.readlines()[::-1]
        coords = file.readlines()
        to_skip = 0
        points_counter = 0
        for i in range(0,len(coords)):
            if to_skip > 0:
                to_skip -= 1
                continue
            print('\n{} of {}:'.format(i+1,len(coords)))
            if is_queue(): #Queue of points
                points = []
                qnt_points = randint(2,4)
                to_skip = qnt_points-1
                print('Queue with {} points'.format(qnt_points))
                for j in range(0, qnt_points):
                    point = {}
                    point['timestamp'] = str(calendar.timegm(current_date.utctimetuple())) #Timestamp from current_date
                    point['latitude'] = float(coords[i+j].split(',')[1].split('\n')[0])
                    point['longitude'] = float(coords[i+j].split(',')[0])
                    points.append(point)
                    points_counter += 1
                    current_date += timedelta(seconds=randint(5,15))
                post_queue(points)
            else: #Single points
                longitude = coords[i].split(',')[0]
                latitude = coords[i].split(',')[1].split('\n')[0]
                coord = {'latitude': float(latitude), 'longitude': float(longitude)}
                post_coordinate(coord, current_date)
                current_date += timedelta(seconds=randint(5,15))
                points_counter += 1
    print('\nTotal of points: {}'.format(points_counter))

simulate()

#python simulator.py coords_rota_parque.dat