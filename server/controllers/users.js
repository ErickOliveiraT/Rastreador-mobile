const database = require('./database');
const token = require('./token');

function storeUser(user) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();
        const api_key = token.getToken();
        
        con.connect(function(err) {
            if (err) reject({stored: false, error: err});
            var sql = `INSERT INTO users(name, login, password, email, api_key) VALUES('${user.name}','${user.login}','${user.password}','${user.email}','${api_key}')`;
            con.query(sql, function (err, result) {
                if (err) {
                    let error = err;
                    if (err.code == 'ER_DUP_ENTRY') error = 'Esse usuário já existe';
                    return reject({stored: false, error: error});
                }
                resolve({stored: true, api_key: api_key});
            });
        });
    });
}

function auth(user) {
    return new Promise(async (resolve) => {
        let con = await database.getConnection();
        
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

//Change password of an user
function changePassword(login, password_hash) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();
        
        con.connect(function(err) {
            if (err) reject({changed: false, error: err})
            var sql = `UPDATE users SET password = '${password_hash}' WHERE login = '${login}'`;
            con.query(sql, function (err, result) {
                if (err) reject({changed: false, error: err})
                resolve({changed: true});
            });
        });
    });
}

//Get email of an user
function getEmail(login) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();
        
        con.connect(function(err) {
            if (err) reject(err);
            var sql = `SELECT email from users WHERE login = '${login}'`;
            con.query(sql, function (err, result) {
                if (err) reject(err);
                resolve(result[0].email);
            });
        });
    });
}

module.exports = {storeUser, auth, changePassword, getEmail}