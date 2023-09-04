import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
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
import { PostNotes } from './factories/postNotes-factory';

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

    it('/notes (POST) - Should return 400 if the body is wrong', async () => {
        const email = faker.internet.email()
        const password = faker.internet.password({ length: 12, prefix: '@Aa1' })
        await new SignupFactory(prisma).createSignup(email, password)
        const login = await new SignInFactory(prisma, jwtService).getToken(email, password)
        const customHeaders = { Authorization: `Bearer ${login.token}` }
        return request(app.getHttpServer())
            .post('/notes')
            .set(customHeaders)
            .send({ text: "", title: '' })
            .expect(400)
    });

    it('/notes (POST) - Should return 401 if there is no token', async () => {
        return request(app.getHttpServer())
            .post('/notes')
            .send({ text: faker.lorem.sentences(), title: faker.word.noun() })
            .expect(401)
    });

    it('/notes (POST) - Should return 409 if repeat the title', async () => {
        const email = faker.internet.email()
        const password = faker.internet.password({ length: 12, prefix: '@Aa1' })
        const title = faker.word.noun()
        const user = await new SignupFactory(prisma).createSignup(email, password)
        const login = await new SignInFactory(prisma, jwtService).getToken(email, password)
        const customHeaders = { Authorization: `Bearer ${login.token}` }
        await new PostNotes(prisma).postNotes(faker.lorem.sentences(), title, user.id)

        return request(app.getHttpServer())
            .post('/notes')
            .set(customHeaders)
            .send({ text: faker.lorem.sentences(), title })
            .expect(409)
    });

    it('/notes (POST) - Should return 201', async () => {
        const email = faker.internet.email()
        const password = faker.internet.password({ length: 12, prefix: '@Aa1' })
        await new SignupFactory(prisma).createSignup(email, password)
        const login = await new SignInFactory(prisma, jwtService).getToken(email, password)
        const customHeaders = { Authorization: `Bearer ${login.token}` }

        return request(app.getHttpServer())
            .post('/notes')
            .set(customHeaders)
            .send({ title: faker.word.noun(), text: faker.lorem.sentences() })
            .expect(201)
    });
    it('/notes (GET) - Should return 200 with data', async () => {
        const email = faker.internet.email()
        const password = faker.internet.password({ length: 12, prefix: '@Aa1' })
        const user = await new SignupFactory(prisma).createSignup(email, password)
        const login = await new SignInFactory(prisma, jwtService).getToken(email, password)
        const customHeaders = { Authorization: `Bearer ${login.token}` }
        for (let i = 0; i < 5; i++) {
            await new PostNotes(prisma).postNotes(faker.lorem.sentences(), faker.word.noun(), user.id)
        }

        let response = await request(app.getHttpServer()).get('/notes').set(customHeaders)
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(5)
    });

    it('/notes/:id (GET) - Should return 200 with data', async () => {
        const email = faker.internet.email()
        const password = faker.internet.password({ length: 12, prefix: '@Aa1' })
        const user = await new SignupFactory(prisma).createSignup(email, password)
        const login = await new SignInFactory(prisma, jwtService).getToken(email, password)
        const customHeaders = { Authorization: `Bearer ${login.token}` }
        const text = faker.lorem.sentences()
        const title = faker.word.noun()
        const note = await new PostNotes(prisma).postNotes(text, title, user.id)

        let response = await request(app.getHttpServer()).get('/notes/' + note.id).set('Authorization', `Bearer ${login.token}`)

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            id: note.id,
            userId: user.id,
            title,
            text
        })
    });

    it('/notes/:id (DELETE) - Should return 200 with data', async () => {
        const email = faker.internet.email()
        const password = faker.internet.password({ length: 12, prefix: '@Aa1' })
        const user = await new SignupFactory(prisma).createSignup(email, password)
        const login = await new SignInFactory(prisma, jwtService).getToken(email, password)
        const customHeaders = { Authorization: `Bearer ${login.token}` }
        const text = faker.lorem.sentences()
        const title = faker.word.noun()

        const note = await new PostNotes(prisma).postNotes(text, title, user.id)

        let response = await request(app.getHttpServer()).delete('/notes/' + note.id).set('Authorization', `Bearer ${login.token}`)

        expect(response.statusCode).toBe(200);
    });
});
