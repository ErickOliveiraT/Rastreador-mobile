const mysql = require('mysql')
const cred = require('./credencials')
const jwt = require('jsonwebtoken')

module.exports = {
    // Store a generated token on database
    storeNewToken(user, token) {
        return new Promise((resolve, reject) => {
            var con = mysql.createConnection({
                host: cred.host,
                user: cred.user,
                password: cred.password,
                database: cred.database
            });
            
            con.connect(function(err) {
                if (err) reject(err);
                var sql = `UPDATE users SET token = '${token}' where login = '${user}'`;
                con.query(sql, function (err, result) {
                    if (err) reject(err);
                    resolve(true);
                });
            });
        });
    },

    // Generate a new token for an user
    async getToken(user) {
        const pos = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let shuffled = pos.split('').sort(function() {return 0.5-Math.random()} ).join('');
        var token = '';
        for (let i = 0; i < 32; i++) {
            let rd = Math.floor(pos.length * Math.random());
            token += shuffled[rd];
        }
        try {
            await this.storeNewToken(user, token);
            return token;
        } catch(err) {
            console.log(err);
            return false;
        }
        
    },

    // Check if a token is valid
    checkToken(user, token) {
        return new Promise((resolve, reject) => {
            var con = mysql.createConnection({
                host: cred.host,
                user: cred.user,
                password: cred.password,
                database: cred.database
            });
            
            con.connect(function(err) {
                if (err) reject(err);
                let qry = `SELECT token FROM users WHERE login = '${user}'`
                con.query(qry, function (err, result, fields) {
                  if (err) reject(err);
                  resolve(result[0].token == token);
                });
            });
        });
    },

    //Generate a Json Web Token
    getJWT(login) {
        const token = jwt.sign({login: login}, cred.secret, {expiresIn: 86400});
        return token;
    },

    //Get owner of a Json Web Token
    getJWTOwner(token) {
        let owner = null;
        jwt.verify(token, cred.secret, (err, dec) => {
            if (err) return err;
            owner = dec.login;
        });
        return owner;
    }
}