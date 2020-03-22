const express = require('express')
const md5 = require('md5')
const geolocation = require('./geolocation')
const users = require('./users')

const app = express(); 
const router = express.Router();
app.use(express.json())
app.use('/', router);

//Definindo as rotas
router.get('/', (req, res) => res.sendStatus(200)); //Indica de a API está online

router.post('/adduser', (req, res) => { //Adiciona um novo usuário
    const user = {
        name: req.body.name,
        login: req.body.login,
        email: req.body.email,
        password: md5(req.body.password)
    };
    users.storeUser(user)
    .then((response) => {res.sendStatus(200)})
    .catch((error) => {res.status(400).send(error.code)});
});

router.post('/addcoordenada', (req, res) => { //Adiciona uma nova coordenada
    const login = req.body.login;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;    
    
    geolocation.getAddress(latitude, longitude)
    .then( 
        (address) => {  
            geolocation.storeCoordinates(login,latitude,longitude,address)
            .then((response) => {res.sendStatus(200)})
            .catch((error) => {res.status(400).send(error)});
        }
    ).catch((error) => res.status(400).send(error));
});

router.post('/autenticate', (req,res) => { //Autentica um usuário
    const user = {
        login: req.body.login,
        password_hash: md5(req.body.password)
    };

    users.autenticate(user)
    .then((response) => {res.send(JSON.stringify(response));})
    .catch((error) => {res.status(400).send(error)});
});

router.get('/coordenadas/:dia?/:mes?/:ano?/:login?', (req, res) => { //Consulta as coordenadas do dia
    if(req.params.ano && req.params.ano && req.params.dia && req.params.login) {
        geolocation.getCoordinates(req.params.login, req.params.dia, req.params.mes, req.params.ano)
        .then((response) => {res.send(response)})
        .catch((error) => res.status(400).send(error));
    } else res.sendStatus(400);
})

app.listen(process.env.PORT || 4000);
console.log("Listening on port 4000...");