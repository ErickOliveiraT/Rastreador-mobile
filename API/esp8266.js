const mysql = require('mysql')
const cred = require('./credencials')

module.exports = {
    // Get user by serial number
    getUserbySN(serialNumber) {
        return new Promise((resolve, reject) => {
            var con = mysql.createConnection({
                host: cred.host,
                user: cred.user,
                password: cred.password,
                database: cred.database
            });
            
            con.connect(function(err) {
                if (err) throw err;
                let qry = `SELECT user FROM esp8266 WHERE serial_number = '${serialNumber}'`
                con.query(qry, function (err, result, fields) {
                  if (err) throw err;
                  resolve(result[0].user);
                });
            });
        });
    },

    // Update user by serial number
    updateUserbySN(serialNumber, user) {
        return new Promise((resolve, reject) => {
            var con = mysql.createConnection({
                host: cred.host,
                user: cred.user,
                password: cred.password,
                database: cred.database
            });
            
            con.connect(function(err) {
                if (err) throw err;
                let qry = `UPDATE esp8266 SET user = '${user}' WHERE serial_number = ${serialNumber}`
                con.query(qry, function (err, result, fields) {
                  if (err) throw err;
                  resolve(result);
                });
            });
        });
    }
}