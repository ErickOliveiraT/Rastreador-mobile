const admin = require("firebase-admin");
const serviceAccount = require("./firebase/rastreador-ac613.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const geolocation = require('./controllers/geolocation');
const users = require('./controllers/users');
const token = require('./controllers/token');
const mailing = require('./controllers/mailing');

const express = require('express');
const md5 = require('md5');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

//Definindo as rotas
app.get('/', (req, res) => res.sendStatus(200)); //Indica de a API está online

app.post('/adduser', async (req, res) => { //Adiciona um novo usuário
    const user = {
        displayName: req.body.name,
        uid: req.body.login,
        email: req.body.email,
        password: req.body.password,
        phoneNumber: req.body.phone,
        emailVerified: false,
        disabled: false
    };

    let response = await users.createUser(admin, user);
    if (response.created) return res.status(200).send(JSON.stringify(response));
    else return res.status(400).send(JSON.stringify(response));
});

app.post('/auth', async (req, res) => { //Autentica um usuário
    const user = {
        uid: req.body.login,
        password_hash: md5(req.body.password)
    };

    let response = await users.auth(admin, user);
    if (!response.valid) return res.status(401).send(JSON.stringify(response));
    else return res.status(200).send(JSON.stringify(response));
});

app.post('/verifytoken', async (req, res) => { //Verifica um token de Autenticação
    const provided_token = req.body.token;
    const uid = req.body.login;

    let valid = await token.checkJWT(uid, provided_token);
    if (valid) return res.status(200).send(JSON.stringify({ valid: true }));
    else return res.status(200).send(JSON.stringify({ valid: false }));
});

app.get('/getrectoken/:login?', async (req, res) => { //Solicita um token de recuperação de senha
    if (!req.params.login) return res.status(400).send('Parâmetros inválidos');

    const valid = await token.checkJWT(req.params.login, req.headers.authorization);
    if (!valid) return res.status(401).send('O usuário não está logado');

    try {
        const tk = await token.getRecToken(admin, req.params.login);
        if (tk.error) return res.status(500).send(JSON.stringify({ error: tk.error }));
        const email = await users.getEmail(admin, req.params.login);
        const response = await mailing.sendRecoveryToken(tk, email);
        if (response.sent) res.status(200).send(JSON.stringify(response));
        else res.status(500).send(JSON.stringify(response));
    } catch (err) {
        res.status(500).send(JSON.stringify({ error: err }));
    }
});

app.post('/changepassword', async (req, res) => { //Muda a senha de um usuário
    const uid = req.body.login;
    const logged = await token.checkJWT(uid, req.headers.authorization);
    if (!logged) return res.status(401).send('O usuário não está logado');

    const recToken = req.body.recToken;
    if (!recToken) return res.status(400).send('Token de recuperação se senha não informado');
    const password = req.body.password;
    if (!password || password.length == 0) return res.status(400).send('Nova senha não informada ou vazia');

    try {
        const valid = await token.checkRecToken(admin, uid, recToken);
        if (!valid) return res.status(401).send('Token de recuperação de senha inválido');
        let response = await users.changePassword(admin, uid, password);
        if (response.error) return res.status(500).send(JSON.stringify({ error: response.error }));
        return res.sendStatus(200);
    } catch (err) {
        res.status(500).send(JSON.stringify({ error: err }));
    }
});

app.post('/addcoordenada', async (req, res) => { //Adiciona uma nova coordenada
    const uid = req.body.login;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const api_key = req.body.api_key;

    if (!api_key) return res.status(400).send('Chave da API não fornecida');
    const valid = await token.checkAPIKey(admin, uid, api_key);
    if (!valid) return res.status(401).send('Chave da API inválida');

    try {
        const address = await geolocation.getAddress(latitude, longitude);
        let response = await geolocation.storeCoordinates(admin, uid, latitude, longitude, address);
        if (response.stored) res.sendStatus(200)
        else res.status(500).send(JSON.stringify(response));
    } catch (error) {
        res.status(500).send(JSON.stringify({error: error}));
    }
});

app.get('/coordenadas/:dia?/:mes?/:ano?/:login?', async (req, res) => { //Consulta as coordenadas do dia
    if (!req.params.ano || !req.params.ano || !req.params.dia || !req.params.login) return res.status(400).send('Parâmetros inválidos');

    const valid = await token.checkJWT(req.params.login, req.headers.token);
    if (!valid) return res.status(401).send('O usuário não está logado');

    geolocation.getCoordinates(req.params.login, req.params.dia, req.params.mes, req.params.ano)
        .then((response) => {
            response.push({ total_distance: geolocation.calcTotalDistance(response) });
            res.status(200).send(response);
        })
        .catch((error) => { res.status(500).send(error) });
});

app.listen(process.env.PORT || 4000);
console.log("Listening on port 4000...");