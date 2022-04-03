const geolocation = require('./controllers/geolocation');
const users = require('./controllers/users');
const token = require('./controllers/token');
const mailing = require('./controllers/mailing');

const express = require('express');
const md5 = require('md5');
const cors = require('cors');
const moment = require('moment');

const app = express();
app.use(express.json());
app.use(cors());

//Definindo as rotas
app.get('/', (req, res) => res.sendStatus(200)); //Indica de a API está online

app.post('/adduser', (req, res) => { //Adiciona um novo usuário
    const user = {
        name: req.body.name,
        login: req.body.login,
        email: req.body.email,
        password: md5(req.body.password)
    };

    users.storeUser(user)
        .then((response) => {
            if (response.stored) return res.status(200).send(response);
            res.status(400).send(response);
        })
        .catch((error) => { res.status(400).send(error) });
});

app.post('/addcoordinate', async (req, res) => { //Adiciona uma nova coordenada
    const login = req.body.login;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const api_key = req.body.api_key;
    const timestamp = req.body.timestamp;
    const datetime = req.body.datetime || null;
    const points = req.body.points || null;
    const type = req.body.type ? req.body.type : 'point';

    if (type !== 'queue' && !timestamp) return res.status(400).send({ error: 'Parâmetro timestamp não fornecido' });
    if (type == 'queue' && !points) return res.status(400).send({ error: 'Parâmetro points não fornecido' });
    if (!api_key) return res.status(401).send('Chave da API não fornecida');
    const valid = await token.checkAPIKey(login, api_key);
    if (!valid) return res.status(401).send('Chave da API inválida');

    if (type == 'point') {
        try {
            const address = await geolocation.getAddress(latitude, longitude);
            geolocation.storeCoordinate(login, latitude, longitude, address, timestamp, datetime)
                .then(() => { res.sendStatus(200) })
                .catch((err) => { res.status(500).send(err) });
        } catch (error) {
            res.status(500).send(error);
        }
    }
    else if (type == 'queue') {
        if (!points) return res.status(400).send({ error: 'Parâmetro points não fornecido' });
        geolocation.getLastCoordinate(login)
            .then(async (last_coordinate) => {
                try {
                    let delta, corrected_datetime;
                    for (let i = 0; i < points.length; i++) {
                        delta = Number(points[i].timestamp) - Number(last_coordinate.timestamp);
                        corrected_datetime = moment(last_coordinate.hour).add(delta, 'seconds').format('YYYY-MM-DD HH:mm:ss');
                        let address = await geolocation.getAddress(points[i].latitude, points[i].longitude);
                        await geolocation.storeCoordinate(login, points[i].latitude, points[i].longitude, address, points[i].timestamp, corrected_datetime);
                        last_coordinate = {
                            ...points[i],
                            hour: corrected_datetime
                        }
                    }
                } catch (error) {
                    res.status(500).send(error);
                }
                return res.sendStatus(200);
            })
            .catch((error) => { res.status(500).send(error) });
    }
    else return res.status(400).send({ error: 'O parâmetro type deve ser point ou queue' });
});

app.post('/auth', (req, res) => { //Autentica um usuário
    const user = {
        login: req.body.login,
        password_hash: md5(req.body.password)
    };

    users.auth(user)
        .then((response) => {
            if (response.valid) return res.status(200).send(response);
            res.status(400).send(response);
        })
        .catch((error) => { res.status(500).send(error) });
});

app.get('/coordinates/:year?/:month?/:day?/:login?', async (req, res) => { //Consulta as coordenadas do dia
    if (!req.params.year || !req.params.month || !req.params.day || !req.params.login) return res.status(400).send('Parâmetros inválidos');

    const valid = await token.checkJWT(req.params.login, req.headers.token);
    if (!valid) return res.status(401).send('O usuário não está logado');

    geolocation.getCoordinates(req.params.login, req.params.year, req.params.month, req.params.day)
        .then((response) => {
            response.push({ total_distance: geolocation.calcTotalDistance(response) });
            res.status(200).send(response);
        })
        .catch((error) => { res.status(500).send(error) });
});

app.get('/lastcoordinate/:login?', async (req, res) => { //Consulta a última coordenada registrada
    if (!req.params.login) return res.status(400).send('Parâmetros inválidos');

    const valid = await token.checkJWT(req.params.login, req.headers.token);
    if (!valid) return res.status(401).send('O usuário não está logado');

    geolocation.getLastCoordinate(req.params.login)
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(500).send(error) });
});

app.get('/getrectoken/:login?', async (req, res) => { //Solicita um token de recuperação de senha
    if (!req.params.login) return res.status(400).send('Parâmetros inválidos');

    const valid = await token.checkJWT(req.params.login, req.headers.token);
    if (!valid) return res.status(401).send('O usuário não está logado');

    try {
        const tk = await token.getRecToken(req.params.login);
        const email = await users.getEmail(req.params.login);
        const response = await mailing.sendToken(tk, email);
        if (response.sent) res.status(200).send(response);
        else res.status(500).send(response);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/setpassword', async (req, res) => { //Muda a senha de um usuário
    const login = req.body.login;
    const logged = await token.checkJWT(login, req.headers.token);
    if (!logged) return res.status(401).send('O usuário não está logado');

    const recToken = req.body.recToken;
    if (!recToken) return res.status(400).send('Token de recuperação se senha não informado');
    const password = req.body.password;
    if (!password || password.length == 0) return res.status(400).send('Nova senha não informada ou vazia');
    const password_hash = md5(req.body.password);

    try {
        const valid = await token.checkRecToken(login, recToken);
        if (!valid) return res.status(401).send('Token de recuperação de senha inválido');
        users.changePassword(login, password_hash)
            .then((response) => {
                if (response.changed) {
                    token.resetRecToken(login);
                    return res.status(200).send(response);
                }
                res.status(500).send(response);
            })
            .catch((err) => { res.status(500).send(err) });
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(process.env.PORT || 4000);
console.log("Listening on port 4000...");