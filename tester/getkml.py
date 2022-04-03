import sys
import os

def formatCoordinates(file):
	with open(sys.argv[1], 'r') as reader:
	  row = reader.read().split()
	for r in row:
	  line = str(r)+',0\n'
	  file.write(line)

def getKml(map_name):
	kml = open(map_name+'.kml', 'w')
	kml.write('<?xml version="1.0" encoding="UTF-8"?>')
	kml.write('<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">')
	kml.write('<Document>\n<name>'+map_name+'.kml</name>')
	with open('kml_header.dat', 'r') as reader:
	  data = reader.read()
	  kml.write(data)
	  kml.write('<name>'+map_name+'</name>')
	  kml.write('<styleUrl>#m_ylw-pushpin</styleUrl>\n<LineString>\n<tessellate>1</tessellate>\n<coordinates>')
	formatCoordinates(kml)
	kml.write('</coordinates>\n</LineString>\n</Placemark>\n</Document>\n</kml>')

if len(sys.argv[2].split('.kml')) > 1:
	getKml(sys.argv[2].split('.kml')[0])
	os.system(sys.argv[2])
else:
	getKml(sys.argv[2])
	os.system(sys.argv[2]+'.kml')

#python getkml.py coords.dat map