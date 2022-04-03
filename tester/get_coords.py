#Get list of coordinates of kml file
import sys

with open(sys.argv[1]) as file:
    output = open('coords_{}.dat'.format(sys.argv[1].split('.')[0]), 'w')
    data = file.read()
    coords = data.split('<coordinates>')[1].split('</coordinates>')[0].split(' ')
    for loc in coords:
        if len(loc.split(',')) < 2:
            output.close()
            break
        longitude = loc.split(',')[0].strip()
        latitude = loc.split(',')[1].strip()
        output.write('{},{}\n'.format(longitude,latitude))

#python get_coords.py rota_parque.kml 