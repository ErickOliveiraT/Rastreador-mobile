const express = require('express')
const mysql = require('mysql')
const md5 = require('md5')
const spawn = require('child_process').spawn

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
    });
}

//Token de autenticação
function getToken() {
    const pos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyxz0123456789'
    var shuffled = pos.split('').sort(() => {return 0.5-Math.random()}).join('')
    let token = ''
    for (let i = 0; i < 32; i++) {
        let rd = Math.floor((Math.random() * pos.length));
        token += shuffled[rd]
    }
    return token
}

//Definindo as rotas
router.get('/', (req, res) => res.json({ message: 'Funcionando!' })); //Indica de a API está online

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
    const sqlQry = `SELECT password,name FROM users WHERE login = '${login}'`

    const connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'rastreador'
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
              res.json({"valid":true,"name":results[0].name})
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

router.post('/addrectoken', (req, res) => { //Salva o token gerado no banco de dados
    const login = req.body.login
    const token = req.body.token
    execSQLQuery(`UPDATE users SET recToken = '${token}' where login = '${login}'`, res)
});

router.post('/solicitarectoken', (req, res) => { //Solicita um token para recuperação de senha
    const login = req.body.login
    const sqlQry = `SELECT email from users where login = '${login}'`

    const connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'rastreador'
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
                    console.log('Deu certo')
                    res.json({"valid":true})
                } else { //Email não enviado
                    res.json({"valid":false,"error":"Falha ao enviar o email de recuperação"})
                }
            });
          } 
        }
        connection.end();
    });
});
       
app.listen(port)