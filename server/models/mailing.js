const sgMail = require('@sendgrid/mail');
const cred = require('../credencials');

sgMail.setApiKey(cred.sg_api_key);

async function sendToken(token, email) {
  const msg = {
    from: cred.email,
    to: email,
    subject: 'Seu Token de Recuperação de Senha',
    text: `Utilize o código ${token} para redefinir sua senha do Rastreador-Mobile`,
  };
  try {
    await sgMail.send(msg);
    return {sent: true, email: email};
  } catch (err) {
    console.log(err);
    return {sent: false, email: email, error: err};
  }
}

module.exports = {sendToken}