const nodemailer = require('nodemailer');
const cred = require('../credencials');

async function sendRecoveryToken(token, email) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: cred.email,
      pass: cred.email_password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: cred.email,
    to: email,
    subject: 'Seu Token de Recuperação de Senha',
    text: `Utilize o código ${token} para redefinir sua senha do Rastreador`
  };

  try {
    await transporter.sendMail(mailOptions);
    return {sent: true, sent_to: email};
  }
  catch (error) {
    return {sent: false, error: error};
  }
}

module.exports = { sendRecoveryToken }