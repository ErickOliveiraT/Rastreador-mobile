const express = require('express')
const mysql = require('mysql')
const md5 = require('md5')
const spawn = require('child_process').spawn
const cred = require('./credencials')
const token = require('./token')
const esp = require('./esp8266')
const geolocation = require('./geolocation')

const app = express();         
const port = 4000;

const router = express.Router();
app.use(express.json())
app.use('/', router);

//Operações do Banco de Dados:
function execSQLQuery(sqlQry, res) {
    const connection = mysql.createConnection({
        host: cred.host,
        port: cred.port,
        user: cred.user,
        password: cred.password,
        database: cred.database
    });
   
    connection.query(sqlQry, function(error, results, fields){
        if(error) 
          res.json(error);
        else
          res.json(results);
        connection.end();
    });
}

//Definindo as rotas
router.get('/', (req, res) => res.sendStatus(200)); //Indica de a API está online

router.get('/users', (req, res) => { //Consulta todos os usuários
    execSQLQuery('SELECT * FROM users', res);
})

router.get('/coordenadas', (req, res) => { //Consulta todas coordenadas
    execSQLQuery('SELECT * FROM coordenadas', res);
})

router.get('/users/:login?', (req, res) => { //Consulta Usuário por login
    let filter = ''
    if(req.params.login) filter = `WHERE login = '${req.params.login}'`
    execSQLQuery('SELECT * FROM users ' + filter, res);
})

router.post('/adduser', (req, res) => { //Adiciona um novo usuário
    const name = req.body.name
    const login = req.body.login
    const email = req.body.email
    const password = md5(req.body.password)
    execSQLQuery(`INSERT INTO users(name, login, password, email) VALUES('${name}','${login}','${password}','${email}')`, res);
});

router.post('/addcoordenada', (req, res) => { //Adiciona uma nova coordenada
    const login = req.body.login
    const latitude = req.body.latitude
    const longitude = req.body.longitude    
    
    geolocation.getAddress(latitude, longitude, login)
    .then( 
        (address) => {
            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date+' '+time;

            if (!address) var sql = `INSERT INTO coordenadas(login,latitude,longitude,hour) VALUES('${login}','${latitude}','${longitude}','${dateTime}')`;
            else {
                let road = address.road;
                let country = address.country;
                let neighbourhood = address.neighbourhood;
                let city = address.city;
                let state = address.state;
                let suburb = address.suburb;
                if (road == undefined) var sql = `INSERT INTO coordenadas(login,latitude,longitude,hour,neighbourhood,suburb,city,state,country) VALUES('${login}','${latitude}','${longitude}','${dateTime}','${neighbourhood}','${suburb}','${city}','${state}','${country}')`;
                else var sql = `INSERT INTO coordenadas(login,latitude,longitude,hour,road,neighbourhood,suburb,city,state,country) VALUES('${login}','${latitude}','${longitude}','${dateTime}','${road}','${neighbourhood}','${suburb}','${city}','${state}','${country}')`;
            }
            
            execSQLQuery(sql, res);
        }
    ).catch(
        (error) => res.send(error)
    );
});

router.post('/autenticate', (req,res) => { //Autentica um usuário
    const login = req.body.login
    const password = req.body.password
    let password_hash = md5(password)
    const sqlQry = `SELECT password,name FROM users WHERE login = '${login}'`

    const connection = mysql.createConnection({
        host: cred.host,
        port: cred.port,
        user: cred.user,
        password: cred.password,
        database: cred.database
    });
   
    connection.query(sqlQry, function(error, results, fields) {
        if(error) //Erro na consulta
            res.json({"valid":false,"error":error})
        else {
          if (results[0] == undefined || results[0] === undefined) { //Usuário não existe
            res.json({"valid":false,"error":"Usuário não existe"})
          }
          else { //Usuário existe
            if (results[0].password === password_hash) { //Senha certa
                let tk = token.getNewToken(login)
                res.json({"valid":true,"name":results[0].name,"token":tk})
            } else { //Senha errada
                res.json({"valid":false,"error":"Senha incorreta"})
            }
          } 
        }
        connection.end();
    });
});

router.get('/coordenadas/:dia?/:mes?/:ano?/:login?', (req, res) => { //Consulta as coordenadas do dia
    if(req.params.ano && req.params.ano && req.params.dia && req.params.login) {
        let filter = req.params.ano + '-' + req.params.mes + '-' + req.params.dia + `%' and login = '${req.params.login}';`
        execSQLQuery(`SELECT * FROM coordenadas WHERE hour LIKE '${filter}`, res);
    } else {
        res.json({"erro":"Requisição Inválida"})
    }
})

router.post('/addrectoken', (req, res) => { //Salva o recToken gerado no banco de dados
    const login = req.body.login
    const token = req.body.token
    execSQLQuery(`UPDATE users SET recToken = '${token}' where login = '${login}'`, res)
});

router.post('/solicitarectoken', (req, res) => { //Solicita um token para recuperação de senha
    const login = req.body.login
    const sqlQry = `SELECT email from users where login = '${login}'`

    const connection = mysql.createConnection({
        host: cred.host,
        port: cred.port,
        user: cred.user,
        password: cred.password,
        database: cred.database
    });
   
    connection.query(sqlQry, function(error, results, fields) {
        if(error) //Erro na consulta
            res.json({"valid":false,"error":error})
        else {
          if (results[0] == undefined || results[0] === undefined) { //Usuário não existe
            res.json({"valid":false,"error":"Usuário não existe"})
          }
          else { //Usuário existe - Python manda o email
            let email = results[0].email
            const pythonProcess = spawn('python',["send_mail.py", login, email]);
            pythonProcess.stdout.on('data', function(data) {
                let msg = data.toString()
                console.log(msg)
                if (msg == 'Email enviado') { //Email enviado
                    res.json({"valid":true,"mail":email})
                } else { //Email não enviado
                    res.json({"valid":false,"error":"Falha ao enviar o email de recuperação"})
                }
            });
          } 
        }
        connection.end();
    });
});

router.post('/validarectoken', (req, res) => { //Valida um token para recuperação de senha
    const login = req.body.login
    const token = req.body.token
    const sqlQry = `SELECT recToken from users where login = '${login}'`

    const connection = mysql.createConnection({
        host: cred.host,
        port: cred.port,
        user: cred.user,
        password: cred.password,
        database: cred.database
    });
   
    connection.query(sqlQry, function(error, results, fields) {
        if(error) //Erro na consulta
            res.json({"valid":false,"error":error})
        else {
            if (results[0].recToken == token) { //Token válido
                res.json({"valid":true})
            } else { //Token inválido
                res.json({"valid":false,"error":"Token inválido"})
            }
        }
        connection.end();
    });
});

router.post('/trocarsenha', (req, res) => { //Troca a senha de um usuário
    const login = req.body.login
    const password = md5(req.body.password)
    execSQLQuery(`UPDATE users SET password = '${password}' where login = '${login}'`, res)
});

router.post('/autorizar', (req, res) => { //Autoriza um usuário ver as localizações
    const master = req.body.master
    const slave = req.body.slave
    execSQLQuery(`INSERT INTO autorizados(master_id,slave_id) VALUES((SELECT id FROM users WHERE login = '${master}'), (SELECT id FROM users WHERE login = '${slave}'));`, res)
});

app.listen(port)
console.log("Listening on port " + port)

/* token.checkToken('bargrall','avgPRAY9v7G8k005REPde1LZKHBi9l9q').then((result) => {
    console.log(result);
}); */

/* esp.getUserbySN(1).then((result) => {
    console.log(result);
}); */

/* esp.updateUserbySN(1, 'teste').then((result) => {
    console.log(result);
}); */

//esp.updateUserbySN(1,'teste');

//geolocation.getAddress('-22.32858','-46.9281').then((address) => console.log(address));