const database = require('./database');
const cred = require('../credencials');
const jwt = require('jsonwebtoken');
const nanoid = require('nanoid');

// Check if a token is valid
function checkToken(user, token) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();
        
        con.connect(function(err) {
            if (err) reject(err);
            let qry = `SELECT token FROM users WHERE login = '${user}'`
            con.query(qry, function (err, result, fields) {
              if (err) reject(err);
              resolve(result[0].token == token);
            });
        });
    });
}

//Generate a Json Web Token
function getJWT(login) {
    const token = jwt.sign({login: login}, cred.secret, {expiresIn: 86400});
    return token;
}

//Get owner of a Json Web Token
function getJWTOwner(token) {
    let owner = null;
    jwt.verify(token, cred.secret, (err, dec) => {
        if (err) return err;
        owner = dec.login;
    });
    return owner;
}

//Check if a JWT belongs to an user
async function checkJWT(user, token) {
    try {
        const owner = await getJWTOwner(token);
        if (!owner || owner == null || owner == undefined || owner === undefined) return false;
        return (owner==user);
    } catch {
        return false;
    }
}

//Get password recovery token
async function getRecToken(firebase, uid) {
    const pos = "0123456789";
    let shuffled = pos.split('').sort(function() {return 0.5-Math.random()} ).join('');
    var token = 'TR-';
    for (let i = 0; i < 5; i++) {
        let rd = Math.floor(pos.length * Math.random());
        token += shuffled[rd];
    }
    try {
        await firebase.firestore().collection('users').doc(uid).update({
            recToken: token,
            updated_at: new Date()
        });
        return token;
    } catch(err) {
        return {error: err};
    }
}

// Check if a recToken is valid
async function checkRecToken(firebase, uid, token) {
    let valid_recToken = (await firebase.firestore().collection('users').doc(uid).get()).data().recToken;
    return valid_recToken === token;
}

// Check API Key
async function checkAPIKey(firebase, uid, api_key) {
    let user = (await firebase.firestore().collection('users').doc(uid).get()).data();
    return user.api_key === api_key;
}

// Generate API Key
function generateAPIKey(firebase, uid) {
    firebase.firestore().collection('users').doc(uid).update({
        api_key: nanoid.nanoid(16),
        updated_at: new Date()
    });
}

module.exports = {checkAPIKey, checkRecToken, getRecToken, checkJWT, getJWTOwner, getJWT, checkToken, generateAPIKey}