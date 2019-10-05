# API Node.js para o Rastreador

Essa API forcece todas as operações úteis para as entidades 'Coordenada' e 'Usuário' por meio dos métodos GET e POST, transportando dados no formato JSON.

## Funcionalidades
#
| Operação | Método | Endereço |
| ------ | ------ | ------ |
| Cadastrar Usuário | POST | host/adduser - (Parâmetros: name, login, password, email) |
| Consultar Usuário Único | GET | host/users/{login} |
| Consultar Todos Usuários| GET | host/users |
| Autenticar Usuário | POST | host/autenticate - (Parâmetros: login, password)|
| Adicionar Coordenadas | POST | host/addcoordenada - (Parâmetros: login, latitude, longitude) |
| Consultar Todas Coordenadas | GET | host/coordenadas |
| Consultar Coordenadas por Dia por Usuário | GET | host/coordenadas/{dia}/{mes}/{ano}/{login} |

