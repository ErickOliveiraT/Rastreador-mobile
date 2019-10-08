const express = require("express");
const mysql = require("mysql");
const md5 = require("md5");
const cors = require("cors");

const app = express();
const port = 4000;

const router = express.Router();
app.use(cors());
app.use(express.json());
app.use("/", router);

//Operações do Banco de Dados:
function execSQLQuery(sqlQry, res) {
  const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "g9cr5kuj",
    database: "rastreador"
  });

  connection.query(sqlQry, function(error, results, fields) {
    if (error) res.json(error);
    else res.json(results);
    connection.end();
  });
}

//Token de autenticação
function getToken() {
  const pos = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyxz0123456789";
  var shuffled = pos
    .split("")
    .sort(() => {
      return 0.5 - Math.random();
    })
    .join("");
  let token = "";
  for (let i = 0; i < 32; i++) {
    let rd = Math.floor(Math.random() * pos.length);
    token += shuffled[rd];
  }
  return token;
}

//Definindo as rotas
router.get("/", (req, res) => res.json({ message: "Funcionando!" })); //Indica de a API está online

router.get("/users", (req, res) => {
  //Consulta todos os usuários
  execSQLQuery("SELECT * FROM users", res);
});

router.get("/coordenadas", (req, res) => {
  //Consulta todas coordenadas
  execSQLQuery("SELECT * FROM coordenadas", res);
});

router.get("/users/:login?", (req, res) => {
  //Consulta Usuário por login
  let filter = "";
  if (req.params.login) filter = `WHERE login = '${req.params.login}'`;
  execSQLQuery("SELECT * FROM users " + filter, res);
});

router.post("/adduser", (req, res) => {
  //Adiciona um novo usuário
  const name = req.body.name;
  const login = req.body.login;
  const password = md5(req.body.password);
  execSQLQuery(
    `INSERT INTO users(name, login, password) VALUES('${name}','${login}','${password}')`,
    res
  );
});

router.post("/addcoordenada", (req, res) => {
  //Adiciona uma nova coordenada
  const login = req.body.login;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;
  execSQLQuery(
    `INSERT INTO coordenadas(login,latitude,longitude,hour) VALUES('${login}','${latitude}','${longitude}','${dateTime}')`,
    res
  );
});

router.post("/autenticate", (req, res) => {
  //Autentica um usuário
  const login = req.body.login;
  const password = req.body.password;
  let password_hash = md5(password);
  const sqlQry = `SELECT password FROM users WHERE login = '${login}'`;

  const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "g9cr5kuj",
    database: "rastreador"
  });

  connection.query(sqlQry, function(error, results, fields) {
    if (error)
      //Erro na consulta
      res.json({ valid: false, error: error });
    else {
      if (results[0] == undefined || results[0] === undefined) {
        //Usuário não existe
        res.json({ valid: false, error: "Usuário não existe" });
      } else {
        //Usuário existe
        if (results[0].password === password_hash) {
          //Senha certa
          res.json({ valid: true });
        } else {
          //Senha errada
          res.json({ valid: false, error: "Senha incorreta" });
        }
      }
    }
    connection.end();
  });
});

router.get("/coordenadas/:dia?/:mes?/:ano?/:login?", (req, res) => {
  //Consulta as coordenadas do dia
  if (req.params.ano && req.params.ano && req.params.dia && req.params.login) {
    let filter =
      req.params.ano +
      "-" +
      req.params.mes +
      "-" +
      req.params.dia +
      `%' and login = '${req.params.login}';`;
    execSQLQuery(`SELECT * FROM coordenadas WHERE hour LIKE '${filter}`, res);
  } else {
    res.json({ erro: "Requisição Inválida" });
  }
});

router.get("/ultimacoordenada/:login?", (req, res) => {
  //Consulta as coordenadas do dia
  if (req.params.login) {
    let login = req.params.login;
    execSQLQuery(
      `SELECT latitude, longitude FROM coordenadas WHERE login = '${login}' order by id desc limit 1;`,
      res
    );
  } else {
    res.json({ erro: "Requisição Inválida" });
  }
});

app.listen(port);
