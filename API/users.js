const cred = require('./credencials')
const mysql = require('mysql')
const token = require('./token')

module.exports = {

    storeUser(user) {
        return new Promise((resolve, reject) => {
            var con = mysql.createConnection({
                host: cred.host,
                user: cred.user,
                password: cred.password,
                database: cred.database
            });
            
            con.connect(function(err) {
                if (err) reject(err);
                var sql = `INSERT INTO users(name, login, password, email) VALUES('${user.name}','${user.login}','${user.password}','${user.email}')`;
                con.query(sql, function (err, result) {
                    if (err) reject(err);
                    resolve(result);
                });
            });
        });
    },

    autenticate(user) {
        return new Promise((resolve) => {
            var con = mysql.createConnection({
                host: cred.host,
                user: cred.user,
                password: cred.password,
                database: cred.database
            });
            
            con.connect(function(err) {
                if (err) resolve({valid:false,error:err});
                var sql = `SELECT password,name FROM users WHERE login = '${user.login}'`
                con.query(sql, async function (err, result) {
                    if (err) resolve({valid:false,error:err});
                    if (result[0] == undefined || result[0] === undefined) resolve({valid:false,error:"Usuário não existe"});
                    else {
                        if (result[0].password === user.password_hash) { //Senha certa
                            //const tk = await token.getToken(user.login);
                            const tk = token.getJWT(user.login);
                            resolve({valid:true,name:result[0].name,token:tk});
                        } else { //Senha errada
                            resolve({valid:false,error:"Senha incorreta"})
                        }
                    }
                });
            });
        });
    }
}