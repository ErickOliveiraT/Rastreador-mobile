const moment = require('moment');
const database = require('./database');
const cred = require('../credencials');
const axios = require('axios');

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

function calcDistance(lat1, lon1, lat2, lon2) {
    var earthRadiusKm = 6371;
  
    var dLat = degreesToRadians(lat2-lat1);
    var dLon = degreesToRadians(lon2-lon1);
    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);
  
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 

    return earthRadiusKm * c;
}

function calcTotalDistance(coordinates) {
    let distance = 0;
    let lat1 = 0;
    let lat2 = 0;
    let lon1 = 0;
    let lon2 = 0; 

    for (let i = 1; i < coordinates.length; i++) {
        lat1 = coordinates[i-1].latitude;
        lat2 = coordinates[i].latitude;
        lon1 = coordinates[i-1].longitude;
        lon2 = coordinates[i].longitude;
        distance += calcDistance(lat1, lon1, lat2, lon2);
    }

    return distance;
}

async function getAddress(latitude, longitude) {
    const url = 'http://my.locationiq.com/v2/reverse.php?'
    const query = `token=${cred.token}&lat=${latitude}&lon=${longitude}&format=json`
    const getUrl = url+query;

    try {
        const response = await axios.get(getUrl);
        return response.data.address;
    } catch (err) {
        console.log(err);
        return false;
    }
}

function getCoordinates(login, year, month, day) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();
        
        let filter = `${year}-${month}-${day}%' and login = '${login}';`;
        const sql = `SELECT * FROM coordenadas WHERE hour LIKE '${filter}`;
        
        con.connect(function(err) {
            if (err) reject(err);
            con.query(sql, function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
        });
    });
}

function getLastCoordinate(login) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();
        
        const sql = `SELECT * FROM coordenadas WHERE login = '${login}' ORDER BY id DESC LIMIT 1`;
        con.connect(function(err) {
            if (err) {
                console.log(err);
                reject(null);
            }
            con.query(sql, function (err, result) {
                if (err) {
                    console.log(err);
                    reject(null);
                }
                if (result.length == 0) return resolve(null);
                resolve(result[0]);
            });
        });
    });
}

function storeCoordinate(login, latitude, longitude, address, timestamp, datetime) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();

        if (!datetime) datetime = moment().utcOffset(-3).format('YYYY-MM-DD HH:mm:ss');
        if (!timestamp) timestamp = null;

        if (!address) var sql = `INSERT INTO coordenadas(login,latitude,longitude,hour,timestamp) VALUES('${login}','${latitude}','${longitude}','${datetime}','${timestamp}')`;
        else {
            let road = address.road || null;
            let country = address.country || null;
            let neighbourhood = address.neighbourhood || null;
            let city = address.city || null;
            let state = address.state || null;
            let suburb = address.suburb || null;
            var sql = `INSERT INTO coordenadas(login,latitude,longitude,hour,road,neighbourhood,suburb,city,state,country,timestamp) VALUES('${login}','${latitude}','${longitude}','${datetime}','${road}','${neighbourhood}','${suburb}','${city}','${state}','${country}','${timestamp}')`;
        }
        
        con.connect(function(err) {
            if (err) reject(err);
            con.query(sql, function (err, result) {
                if (err) reject(err);
                resolve(true);
            });
        });
    });
}

module.exports = {storeCoordinate, getCoordinates, getAddress, calcTotalDistance, getLastCoordinate}