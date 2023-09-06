# Drivenpass

This API was created for those who frequently forget passwords, card details, or need a secure space for storing notes. Drivenpass ensures your important data is stored securely and easily accessible. You just can't forget your mainly password to login Drivenpass :joy:. 

<p align="left"><a href="https://divenpass.onrender.com/" target="_blank">Here</a> is the deploy of this aplication</p>

## About

Drivenpass is an aplication where you can store lots of kind of data. This is a great idea, because nowadays we have lots of hard passwords and importants datas to remember, and we always forgot. Here is some features you can find in this aplication:

- Sign-up
- Login
- Add safe notes
- Add credentials (yous logins)
- Add card data
- Delete informations
- Delete account 

All the routes that envolves yous datas are crypted and must be autheticated with an user token. We use JWT Authentication to protect the access to your datas.
<p align="left">Click <a href="https://divenpass.onrender.com/api" target="_blank">here</a> to see all routes.</p>

## Technologies
The following tools and frameworks were used in the construction of the project:

- Prisma ORM
- Nest.js
- PostgreSQL
- JWT
- Swagger
- Cryptr and Bcrypt
- TypeScript

## Installation

```bash
$ npm install
```

## Running the app

1. Crie um `.env` e um `.env.test` to add the Enviroment Variables `DATABASE_URL`,  `JWT_SECRET` and `CRYPTR_SECRET`. The secrets can be any string and the database must be a postgreSQL url.
2. Run `npm run prisma:prod` to create the database.
3. Choose how to run the project:
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```