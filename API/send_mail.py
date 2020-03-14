from random import randint
import requests
import smtplib
import string
import sys

#Gerar código de recuperação de senha
pos = string.digits
code = ''
for i in range(0,5):
    rd = randint(0,5)
    code += pos[rd]

#Salvar code no banco de dados (rota POST)
login = sys.argv[1]
res = requests.post('http://localhost:3000/addrectoken', json={"login": login,"token": code})

#Enviar email com código de recuperação
target = sys.argv[2]
EMAIL_DEST = target
EMAIL_ADDRESS = 'projetorastreadorcom241@gmail.com'
PASSWORD = 'rastreador-admin'
subject = 'Recupere sua senha'
msg = 'Use o codigo ' + code + ' para criar uma nova senha do Rastreador Mobile'

try:
    server = smtplib.SMTP('smtp.gmail.com:587')
    server.ehlo()
    server.starttls()
    server.login(EMAIL_ADDRESS, PASSWORD)
    message = 'Subject: {}\n\n{}'.format(subject, msg)
    server.sendmail(EMAIL_ADDRESS, EMAIL_DEST, message)
    server.quit()
    print('Email enviado', end='')
except:
    print('Falha ao enviar email', end='')