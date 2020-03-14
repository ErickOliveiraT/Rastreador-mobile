const mysql = require('mysql')
const cred = require('./credencials')

module.exports = {
    // Store a generated token on database
    storeNewToken(user, token) {
        var con = mysql.createConnection({
            host: cred.host,
            user: cred.user,
            password: cred.password,
            database: cred.database
        });
        
        con.connect(function(err) {
            if (err) throw err;
            //console.log("Connected!");
            var sql = `UPDATE users SET token = '${token}' where login = '${user}'`;
            con.query(sql, function (err, result) {
                if (err) throw err;
                //console.log("1 record inserted");
            });
        });
    },

    // Generate a new token for an user
    getNewToken(user) {
        const pos = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let shuffled = pos.split('').sort(function() {return 0.5-Math.random()} ).join('');
        var token = '';
        for (let i = 0; i < 32; i++) {
            let rd = Math.floor(pos.length * Math.random());
            token += shuffled[rd];
        }
        this.storeNewToken(user, token);
        return token;
    },

    // Get the real token of an user
    checkToken(user, token) {
        return new Promise((resolve, reject) => {
            var con = mysql.createConnection({
                host: cred.host,
                user: cred.user,
                password: cred.password,
                database: cred.database
            });
            
            con.connect(function(err) {
                if (err) throw err;
                let qry = `SELECT token FROM users WHERE login = '${user}'`
                con.query(qry, function (err, result, fields) {
                  if (err) throw err;
                  resolve(result[0].token == token);
                });
            });
        });
    },
}