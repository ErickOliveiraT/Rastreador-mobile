# Cliente React para o Rastreador

## Instalação
No diretório client/ executar o comando abaixo:
```sh
yarn install
```

## Execução
Executa em modo desenvolvimento, consumindo api no endpoint: http://localhost:4000 
```sh
yarn run dev
```

Executa em modo produção, consumindo api no endpoint: https://rastreador-tfg.uc.r.appspot.com 
```sh
yarn run prod
```

Executa setando variáveis de ambiente no Windows (CMD)
```sh
set "REACT_APP_NOT_SECRET_CODE=abcdef" && npm start
```

Executa setando variáveis de ambiente no Windows (Powershell)
```sh
($env:REACT_APP_NOT_SECRET_CODE = "abcdef") -and (npm start)
```

## Build
Gerar build de produção da aplicação cliente
```sh
yarn build
```