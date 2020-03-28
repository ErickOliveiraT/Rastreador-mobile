const sgMail = require('@sendgrid/mail');
const cred = require('./credencials');

sgMail.setApiKey(cred.sg_api_key);

module.exports = {

  sendToken(token, email) {
    return new Promise((resolve, reject) => {
      const msg = {
        from: 'projetorastreadorcom241@gmail.com',
        to: email,
        subject: 'Seu Token de Recuperação de Senha',
        text: `Utilize o código ${token} para redefinir sua senha do Rastreador-Mobile`,
      };
      try {
        sgMail.send(msg);
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }
}