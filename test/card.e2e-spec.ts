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
import { PostCard } from './factories/postCards-factory';
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

    it('/cards (POST) - Should return 400 if the body is wrong', async () => {
        const email = faker.internet.email()
        const password = faker.internet.password({ length: 12, prefix: '@Aa1' })
        await new SignupFactory(prisma).createSignup(email, password)
        const login = await new SignInFactory(prisma, jwtService).getToken(email, password)
        const customHeaders = { Authorization: `Bearer ${login.token}` }
        return request(app.getHttpServer())
            .post('/cards')
            .set(customHeaders)
            .send({ cvv: '', expiration: '', name: '', number: '', type: '', virtual: '', title: '', password: '' })
            .expect(400)
    });

    it('/cards (POST) - Should return 401 if there is no token', async () => {
        return request(app.getHttpServer())
            .post('/cards')
            .send({
                cvv: faker.number.int({ min: 100, max: 999 }).toString(), expiration: faker.date.future(),
                name: faker.person.fullName(), number: faker.number.int({ min: 1000000000000000 }).toString(),
                type: 'CREDIT', virtual: true, title: faker.word.noun(), password: faker.internet.password()
            })
            .expect(401)
    });

    it('/cards (POST) - Should return 409 if repeat the title', async () => {
        const email = faker.internet.email()
        const password = faker.internet.password({ length: 12, prefix: '@Aa1' })
        const title = faker.word.noun()
        const user = await new SignupFactory(prisma).createSignup(email, password)
        const login = await new SignInFactory(prisma, jwtService).getToken(email, password)
        const customHeaders = { Authorization: `Bearer ${login.token}` }
        await new PostCard(prisma, cryptr).postCard(user.id, faker.date.future(), title,
            faker.number.int({ min: 1000000000000000 }).toString(), faker.number.int({ min: 100, max: 999 }).toString(),
            faker.person.fullName(), faker.internet.password(), 'CREDIT')

        return request(app.getHttpServer())
            .post('/cards')
            .set(customHeaders)
            .send({
                cvv: faker.number.int({ min: 100, max: 999 }).toString(), expiration: faker.date.future(),
                name: faker.person.fullName(), number: faker.number.int({ min: 1000000000000000 }).toString(),
                type: 'CREDIT', virtual: true, title, password: faker.internet.password()
            })
            .expect(409)
    });

    it('/cards (POST) - Should return 201', async () => {
        const email = faker.internet.email()
        const password = faker.internet.password({ length: 12, prefix: '@Aa1' })
        await new SignupFactory(prisma).createSignup(email, password)
        const login = await new SignInFactory(prisma, jwtService).getToken(email, password)
        const customHeaders = { Authorization: `Bearer ${login.token}` }

        return request(app.getHttpServer())
            .post('/cards')
            .set(customHeaders)
            .send({
                cvv: faker.number.int({ min: 100, max: 999 }).toString(), expiration: faker.date.future(),
                name: faker.person.fullName(), number: faker.number.int({ min: 1000000000000000 }).toString(),
                type: 'CREDIT', virtual: true, title: faker.word.noun(), password: faker.internet.password()
            })
            .expect(201)
    });
    it('/cards (GET) - Should return 200 with data', async () => {
        const email = faker.internet.email()
        const password = faker.internet.password({ length: 12, prefix: '@Aa1' })
        const user = await new SignupFactory(prisma).createSignup(email, password)
        const login = await new SignInFactory(prisma, jwtService).getToken(email, password)
        const customHeaders = { Authorization: `Bearer ${login.token}` }
        for (let i = 0; i < 5; i++) {
            await new PostCard(prisma, cryptr).postCard(user.id, faker.date.future(), faker.word.noun(),
                faker.number.int({ min: 1000000000000000 }).toString(), faker.number.int({ min: 100, max: 999 }).toString(),
                faker.person.fullName(), faker.internet.password(), 'CREDIT')
        }

        let response = await request(app.getHttpServer()).get('/cards').set(customHeaders)
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(5)
    });

    it('/cards/:id (GET) - Should return 200 with data', async () => {
        const email = faker.internet.email()
        const password = faker.internet.password({ length: 12, prefix: '@Aa1' })
        const user = await new SignupFactory(prisma).createSignup(email, password)
        const login = await new SignInFactory(prisma, jwtService).getToken(email, password)
        const customHeaders = { Authorization: `Bearer ${login.token}` }


        const cardPostCard = await new PostCard(prisma, cryptr).postCard(user.id, faker.date.future(), faker.word.noun(),
            faker.number.int({ min: 1000000000000000 }).toString(), faker.number.int({ min: 100, max: 999 }).toString(),
            faker.person.fullName(), faker.internet.password(), 'CREDIT')

        let response = await request(app.getHttpServer()).get('/cards/' + cardPostCard.id).set('Authorization', `Bearer ${login.token}`)

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            id: cardPostCard.id,
            userId: user.id,
            title: cardPostCard.title,
            number: cardPostCard.number,
            cvv: expect.any(String),
            name: cardPostCard.name,
            expiration: expect.any(Date),
            password: expect.any(String),
            virtual: false,
            type: cardPostCard.type
        })
    });

    it('/cards/:id (DELETE) - Should return 200 with data', async () => {
        const email = faker.internet.email()
        const password = faker.internet.password({ length: 12, prefix: '@Aa1' })
        const user = await new SignupFactory(prisma).createSignup(email, password)
        const login = await new SignInFactory(prisma, jwtService).getToken(email, password)

        const cardPostCard = await new PostCard(prisma, cryptr).postCard(user.id, faker.date.future(), faker.word.noun(),
            faker.number.int({ min: 1000000000000000 }).toString(), faker.number.int({ min: 100, max: 999 }).toString(),
            faker.person.fullName(), faker.internet.password(), 'CREDIT')

        let response = await request(app.getHttpServer()).delete('/cards/' + cardPostCard.id).set('Authorization', `Bearer ${login.token}`)

        expect(response.statusCode).toBe(200);
    });
});
