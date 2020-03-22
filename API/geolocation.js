const axios = require('axios');
const mysql = require('mysql')
const cred = require('./credencials')

module.exports = {

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