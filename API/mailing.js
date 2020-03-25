const nodemailer = require('nodemailer');
const cred = require('./credencials');

module.exports = {

    sendToken(token, email) {
        return new Promise((resolve, reject) => {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'projetorastreadorcom241@gmail.com',
                  pass: cred.email_password
                },
                tls: {rejectUnauthorized: false}
            });
              
            var mailOptions = {
                from: 'projetorastreadorcom241@gmail.com',
                to: email,
                subject: 'Seu Token para Recuperação de Senha',
                text: `Use esse código para recuperar sua senha do Rastreador-Mobile:\n\n${token}`
            };
              
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                  console.log(error);
                  reject(error);
                } else {
                  //console.log('Email sent: ' + info.response);
                  resolve(true);
                }
            });
        });
    }
}