import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { cleanDb } from './utils';
import { faker } from '@faker-js/faker';
import { SignupFactory } from './factories/signUp-factory';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService

  beforeEach(async () => {
    await cleanDb()

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = new PrismaService();
  });

  it('/auth/sign-up (Post) - Should return 400 if email or password are incorrect', () => {
    return request(app.getHttpServer())
      .post('/auth/sign-up').send({email: faker.string.sample(), password:'password'})
      .expect(400)
  });

  it('/auth/sign-up (Post) - Should return 409 if already exist this email', async()=>{
    const email = faker.internet.email()
    const signUp = await new SignupFactory(prisma).createSignup(email, '@A1b2C3d4E5')
    return request(app.getHttpServer())
    .post('/auth/sign-up')
    .send({email, password:'@A1b2C3d4E5'})
    .expect(409)
  })
  it('/auth/sign-up (POST) - Should return 201 (Created)', ()=>{
    const email = faker.internet.email()
    const password = faker.internet.password({length:12, prefix:'@1Aa'})
    return request(app.getHttpServer())
    .post('/auth/sign-up')
    .send({email, password})
    .expect(201)
  })
  it('auth/sign-in (POST) - Should return 401 if password or email are wrong', async()=>{
    const email = faker.internet.email()
    const password = faker.internet.password({length:12, prefix:'@1Aa'})
    const signUp = await new SignupFactory(prisma).createSignup(email, password)
    return request(app.getHttpServer())
    .post('/auth/sign-in')
    .send({email:faker.internet.email(), password:faker.internet.password({length:12, prefix:'@1Aa'})})
    .expect(401)
  })
  it('auth/sign-in (POST) - Should return 200', async()=>{
    const email = faker.internet.email()
    const password = faker.internet.password({length:12, prefix:'@1Aa'})
    const signUp = await request(app.getHttpServer()).post('/auth/sign-up').send({email, password})
    console.log(signUp)
    return request(app.getHttpServer())
    .post('/auth/sign-in')
    .send({email, password})
    .expect(200)
  })
});
