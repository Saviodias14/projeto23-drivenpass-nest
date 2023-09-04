import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { cleanDb } from './utils';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt'
import { SignupFactory } from './factories/signUp-factory';
import { SignInFactory } from './factories/signIn-factory';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PostCredential } from './factories/postCredentials-factory';
import { response } from 'express';
import Cryptr from 'cryptr';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService
    let jwtService: JwtService
    let cryptr: Cryptr

    beforeEach(async () => {
        await cleanDb()

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, PrismaModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();

        prisma = new PrismaService();
        jwtService = new JwtService()
        const Cryptr = require('cryptr')
        cryptr = new Cryptr("Projeto23-drivenpass")
    });

    it('/credentials (POST) - Should return 400 if the body is wrong', async () => {
        const email = faker.internet.email()
        const password = faker.internet.password({ length: 12, prefix: '@Aa1' })
        await new SignupFactory(prisma).createSignup(email, password)
        const login = await new SignInFactory(prisma, jwtService).getToken(email, password)
        const customHeaders = { Authorization: `Bearer ${login.token}` }
        return request(app.getHttpServer())
            .post('/credentials')
            .set(customHeaders)
            .send({ url: '', title: '', username: '', password: '' })
            .expect(400)
    });

    it('/credentials (POST) - Should return 401 if there is no token', async () => {
        return request(app.getHttpServer())
            .post('/credentials')
            .send({ url: faker.internet.url(), title: faker.lorem.word(), username: faker.internet.userName(), password: faker.internet.password() })
            .expect(401)
    });

    it('/credentials (POST) - Should return 409 if repeat the title', async () => {
        const email = faker.internet.email()
        const password = faker.internet.password({ length: 12, prefix: '@Aa1' })
        const title = faker.word.noun()
        const user = await new SignupFactory(prisma).createSignup(email, password)
        const login = await new SignInFactory(prisma, jwtService).getToken(email, password)
        const customHeaders = { Authorization: `Bearer ${login.token}` }
        await new PostCredential(prisma).postCredential(faker.internet.url(), title, faker.internet.userName(), faker.internet.password(), user.id)

        return request(app.getHttpServer())
            .post('/credentials')
            .set(customHeaders)
            .send({ url: faker.internet.url(), title, username: faker.internet.userName(), password: faker.internet.password() })
            .expect(409)
    });

    it('/credentials (POST) - Should return 201', async () => {
        const email = faker.internet.email()
        const password = faker.internet.password({ length: 12, prefix: '@Aa1' })
        await new SignupFactory(prisma).createSignup(email, password)
        const login = await new SignInFactory(prisma, jwtService).getToken(email, password)
        const customHeaders = { Authorization: `Bearer ${login.token}` }

        return request(app.getHttpServer())
            .post('/credentials')
            .set(customHeaders)
            .send({ url: faker.internet.url(), title: faker.word.noun(), username: faker.internet.userName(), password: faker.internet.password() })
            .expect(201)
    });
    it('/credentials (GET) - Should return 200 with data', async () => {
        const email = faker.internet.email()
        const password = faker.internet.password({ length: 12, prefix: '@Aa1' })
        const user = await new SignupFactory(prisma).createSignup(email, password)
        const login = await new SignInFactory(prisma, jwtService).getToken(email, password)
        const customHeaders = { Authorization: `Bearer ${login.token}` }
        for (let i = 0; i < 5; i++) {
            await new PostCredential(prisma).postCredential(faker.internet.url(), faker.word.noun(), faker.internet.userName(), faker.internet.password(), user.id)
        }

        let response = await request(app.getHttpServer()).get('/credentials').set(customHeaders)
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(5)
    });

    it('/credentials/:id (GET) - Should return 200 with data', async () => {
        const email = faker.internet.email()
        const password = faker.internet.password({ length: 12, prefix: '@Aa1' })
        const user = await new SignupFactory(prisma).createSignup(email, password)
        const login = await new SignInFactory(prisma, jwtService).getToken(email, password)
        const customHeaders = { Authorization: `Bearer ${login.token}` }
        const url = faker.internet.url()
        const title = faker.word.noun()
        const username = faker.internet.userName()
        const passwordCredential = faker.internet.password()

        const credential = await new PostCredential(prisma).postCredential(url, title, username, passwordCredential, user.id)

        let response = await request(app.getHttpServer()).get('/credentials/'+credential.id).set('Authorization', `Bearer ${login.token}`)
    
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            id: credential.id,
            userId: user.id,
            url,
            title,
            username,
            password: expect.any(String)
        })
    });

    it('/credentials/:id (DELETE) - Should return 200 with data', async () => {
        const email = faker.internet.email()
        const password = faker.internet.password({ length: 12, prefix: '@Aa1' })
        const user = await new SignupFactory(prisma).createSignup(email, password)
        const login = await new SignInFactory(prisma, jwtService).getToken(email, password)
        const customHeaders = { Authorization: `Bearer ${login.token}` }
        const url = faker.internet.url()
        const title = faker.word.noun()
        const username = faker.internet.userName()
        const passwordCredential = faker.internet.password()

        const credential = await new PostCredential(prisma).postCredential(url, title, username, passwordCredential, user.id)

        let response = await request(app.getHttpServer()).delete('/credentials/'+credential.id).set('Authorization', `Bearer ${login.token}`)
      
        expect(response.statusCode).toBe(200);
    });
});
