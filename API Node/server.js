const express = require('express');
const mysql = require('mysql')
const md5 = require('md5')

const app = express();         
const port = 3000;

const router = express.Router();
app.use(express.json())
app.use('/', router);

//Operações do Banco de Dados:
function execSQLQuery(sqlQry, res) {
    const connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'rastreador'
    });
   
    connection.query(sqlQry, function(error, results, fields){
        if(error) 
          res.json(error);
        else
          res.json(results);
        connection.end();
        console.log('Executou!');
    });
}

//Definindo as rotas
router.get('/', (req, res) => res.json({ message: 'Funcionando!' })); //Indica de a API está online

router.get('/users', (req, res) => { //Consulta todos os usuários
    execSQLQuery('SELECT * FROM users', res);
})

router.get('/users/:login?', (req, res) => { //Consulta Usuário por login
    let filter = ''
    if(req.params.login) filter = `WHERE login = '${req.params.login}'`
    execSQLQuery('SELECT * FROM users ' + filter, res);
    console.log(res.results)
})

router.post('/adduser', (req, res) => { //Adiciona um novo usuário
    const name = req.body.name
    const login = req.body.login
    const password = md5(req.body.password)
    execSQLQuery(`INSERT INTO users(name, login, password) VALUES('${name}','${login}','${password}')`, res);
});

router.post('/addcoordenada', (req, res) => { //Adiciona uma nova coordenada
    const login = req.body.login
    const latitude = req.body.latitude
    const longitude = req.body.longitude    
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    execSQLQuery(`INSERT INTO coordenadas(login,latitude,longitude,hour) VALUES('${login}','${latitude}','${longitude}','${dateTime}')`, res);
});

router.post('/autenticate', (req,res) => { //Autentica um usuário
    const login = req.body.login
    const password = req.body.password
    let password_hash = md5(password)
    execSQLQuery(`SELECT password FROM users WHERE login = '${login}'`, res);
    //Preciso pegar a resposta da consulta agora
});

app.listen(port)
console.log('API ligada')