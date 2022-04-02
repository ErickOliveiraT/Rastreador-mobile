# API Node.js para o Rastreador

Essa API forcece todas as operações úteis para as entidades 'Coordenada' e 'Usuário' por meio dos métodos GET e POST, transportando dados no formato JSON.

## Funcionalidades
#
| Operação | Método | Endereço |
| ------ | ------ | ------ |
| Cadastrar Usuário | POST | host/adduser - (Parâmetros: name, login, password, email) |
| Autenticar Usuário | POST | host/auth - (Parâmetros: login, password) |
| Adicionar Coordenadas | POST | host/addcoordinate - (Parâmetros: login, latitude, longitude, timestamp, api_key, type, points?) |
| Consultar Coordenadas por Dia por Usuário | GET | host/coordinates/{ano}/{mes}/{dia}/{login} |
| Consultar Última Coordenada de um Usuário | GET | host/lastcoordinate/{login} |
| Solicitar Token para Recuperar Senha | GET | host/getrectoken/{login} |
| Trocar Senha de um Usuário | POST | host/setpassword - (Parâmetros: login, password, recToken) |
