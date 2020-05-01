const axios = require('axios')
const mysql = require('mysql')
const cred = require('./credencials')

module.exports = {

    degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    },

    calcDistance(lat1, lon1, lat2, lon2) {
        var earthRadiusKm = 6371;
      
        var dLat = this.degreesToRadians(lat2-lat1);
        var dLon = this.degreesToRadians(lon2-lon1);
        lat1 = this.degreesToRadians(lat1);
        lat2 = this.degreesToRadians(lat2);
      
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        return earthRadiusKm * c;
    },

    calcTotalDistance(coordinates) {
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
            distance += this.calcDistance(lat1, lon1, lat2, lon2);
        }
        return distance;
    },

    getAddress(latitude, longitude) {
        const url = 'http://my.locationiq.com/v2/reverse.php?'
        const query = `token=${cred.token}&lat=${latitude}&lon=${longitude}&format=json`
        const getUrl = url+query;
        
        return new Promise((resolve) => {
            axios.get(getUrl+query)
            .then(function (response) {
                let address = response.data.address;
                resolve(address);
            })
            .catch(function (error) {
                //console.log(error)
                resolve(false);
            });
        })
    },

    getCoordinates(login, day, month, year) {
        return new Promise((resolve, reject) => {
            var con = mysql.createConnection({
                host: cred.host,
                user: cred.user,
                password: cred.password,
                database: cred.database
            });
            
            let filter = year + '-' + month + '-' + day + `%' and login = '${login}';`;
            const sql = `SELECT * FROM coordenadas WHERE hour LIKE '${filter}`;
            
            con.connect(function(err) {
                if (err) reject(err);
                con.query(sql, function (err, result) {
                    if (err) reject(err);
                    resolve(result);
                });
            });
        });
    },

    storeCoordinates(login, latitude, longitude, address) {
        return new Promise((resolve, reject) => {
            var con = mysql.createConnection({
                host: cred.host,
                user: cred.user,
                password: cred.password,
                database: cred.database
            });

            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date+' '+time;

            if (!address || address == undefined) var sql = `INSERT INTO coordenadas(login,latitude,longitude,hour) VALUES('${login}','${latitude}','${longitude}','${dateTime}')`;
            else {
                let road = address.road;
                let country = address.country;
                let neighbourhood = address.neighbourhood;
                let city = address.city;
                let state = address.state;
                let suburb = address.suburb;
                var sql = `INSERT INTO coordenadas(login,latitude,longitude,hour,road,neighbourhood,suburb,city,state,country) VALUES('${login}','${latitude}','${longitude}','${dateTime}','${road}','${neighbourhood}','${suburb}','${city}','${state}','${country}')`;
            }
            
            con.connect(function(err) {
                if (err) reject(err);
                con.query(sql, function (err, result) {
                    if (err) reject(err);
                    resolve(result);
                });
            });
        });
    }
}