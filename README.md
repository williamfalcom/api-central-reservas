# API Central de Reservas

### Descrição

API para gestão de reservas de apartamentos com controle de check-in e check-out

### Para o Desenvolvimento.

#### Instalação

É necessário ter pré instalado [Docker](https://www.docker.com/get-started/) e [Docker-compose](https://docs.docker.com/compose/install/).
Faça clone do projeto:

```bash
# clonando o projeto
$ git clone https://github.com/williamfalcom/api-central-reservas.git

# entrando na pasta do projeto
$ cd api-central-reservas
```

Agora vamos subir os containers de MongoDB e NodeJS utilizando o Docker Compose:

```bash
# subindo containers
$ docker-compose up -d
...
# aguarde até que o docker compose suba os 4 containers necessários.
```

Em seguida precisamos executar alguns comandos para ativar o Replica Set do cluster MongoBD:

```bash
# dar permissão de execução para script de inicialização
$ docker-compose exec mongo1 /usr/bin/chmod +x /init_config_mongo.sh

# execute o script de inicialização do Replica Set
$ docker-compose exec mongo1 bash -c /init_config_mongo.sh
```

Agora vamos acessar o container app-dev e fazer a instalação dos pacotes do NodeJS

```bash
# acessando o bash do app-dev
$ docker exec -it app-dev bash

# é sempre bom atualizar o npm
$ npm install -g npm

# agora vamos instalar os pacotes do NodeJS
$ npm install

# em seguida precisamos rodar o generate do Prisma
$ npx prisma generate
```

Pronto, agora já podemos rodar os comando do Framework NestJS
**Testes**

```bash
# testes unitários
$ npm run test

# teste de cobertura
$ npm run test:cov
```

**Execução da aplicação**

```bash
# desenvolvimento
$ npm run start

# desenvolvimento em modo watch
$ npm run start:dev

# inicialização em modo de produção
$ npm run start:prod
```

Pronto, agora é só acessar a aplicação

URL de acesso da API: http://<seu_host>:3000

URL de acesso da documentação Swagger: http://<seu_host>:3000/doc

Utilize a rota /user (POST) para cadastrar um usuário e faça login em /login (POST) para gerar o token JWT.

### Para Produção.

#### Instalação

É necessário ter pré instalado [Docker](https://www.docker.com/get-started/) e [Docker-compose](https://docs.docker.com/compose/install/).
Processo para VPS ou Instancia de serviço em cloud.

Faça clone do projeto:

```bash
# clonando o projeto
$ git clone https://github.com/williamfalcom/api-central-reservas.git

# entrando na pasta do projeto
$ cd api-central-reservas
```

Agora vamos subir os containers de MongoDB e NodeJS utilizando o Docker Compose:

```bash
# subindo containers do MongoDB
$ docker-compose -f docker-compose-mongo.prod.yml up -d
...
# aguarde até que o docker compose suba os 3 containers do MongoDB.
```

Em seguida precisamos executar alguns comandos para ativar o Replica Set do cluster MongoBD:

```bash
# dar permissão de execução para script de inicialização
$ docker-compose exec mongo1 /usr/bin/chmod +x /init_config_mongo.sh

# execute o script de inicialização do Replica Set
$ docker-compose exec mongo1 bash -c /init_config_mongo.sh
```

Agora vamos subir o container da aplicação

```bash
# fazendo o build e subindo a aplicação em produção
$ docker-compose -f docker-compose.prod.yml up -d --build

```

Pronto, agora já podemos acessar a aplicação

URL de acesso da API: http://<seu_host>:3000

URL de acesso da documentação Swagger: http://<seu_host>:3000/doc

Utilize a rota /user (POST) para cadastrar um usuário e faça login em /login (POST) para gerar o token JWT.
