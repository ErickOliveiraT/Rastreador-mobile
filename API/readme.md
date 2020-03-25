# API Node.js para o Rastreador

Essa API forcece todas as operações úteis para as entidades 'Coordenada','Usuário' e 'Autorizado' por meio dos métodos GET e POST, transportando dados no formato JSON.

## Funcionalidades
#
| Operação | Método | Endereço |
| ------ | ------ | ------ |
| Cadastrar Usuário | POST | host/adduser - (Parâmetros: name, login, password, email) |
| Autenticar Usuário | POST | host/autenticate - (Parâmetros: login, password)|
| Adicionar Coordenadas | POST | host/addcoordenada - (Parâmetros: login, latitude, longitude) |
| Consultar Coordenadas por Dia por Usuário | GET | host/coordenadas/{dia}/{mes}/{ano}/{login} |
| Solicitar Token para Recuperar Senha | GET | host/getrectoken/{login} |
| Trocar Senha de um Usuário | POST | host/setpassword - (Parâmetros: login, password, recToken) |
