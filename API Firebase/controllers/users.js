const database = require('./database');
const token = require('./token');
const md5 = require('md5');

async function auth(firebase, user) {
    let userRecord = (await firebase.firestore().collection('users').doc(user.uid).get()).data();
    if (!userRecord) return ({ valid: false, error: 'User not found' });
    if (userRecord.password === user.password_hash) {
        delete userRecord.password;
        let jwt = token.getJWT(user.uid);
        return { valid: true, user: userRecord, token: jwt };
    }
    else return { valid: false, error: 'Email or password incorrect' };
}

//Change password of an user
async function changePassword(firebase, uid, password) {
    try {
        await firebase.auth().updateUser(uid, { password: password });
        await firebase.firestore().collection('users').doc(uid).update({
            password: md5(password),
            updated_at: new Date(),
            recToken: firebase.firestore.FieldValue.delete()
        })
        return true;
    }
    catch (error) {
        return { error: error };
    }
}

//Get email of an user
async function getEmail(firebase, uid) {
    return (await firebase.firestore().collection('users').doc(uid).get()).data().email;
}

async function createUser(firebase, user) {
    try {
        await firebase.firestore().collection('users').doc(user.uid).set({
            name: user.displayName,
            uid: user.uid,
            email: user.email,
            phone: user.phoneNumber,
            password: md5(user.password),
            created_at: new Date()
        });
        delete user.phoneNumber;
        let userRecord = await firebase.auth().createUser(user);
        token.generateAPIKey(firebase, user.uid);
        return { created: true, userRecord: userRecord };
    }
    catch (error) {
        return { created: false, error: error };
    }
}

module.exports = { createUser, auth, changePassword, getEmail }