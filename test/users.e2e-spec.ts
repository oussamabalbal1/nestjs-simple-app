import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

describe('UserController E2E TEST', () => {
  let app: NestExpressApplication;

  const userMock = {
    username: 'test-testf2ss',
    email: 'test-testf3wd354223f@test.test',
    password: 'testf0-password',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Enable DTO validation in tests
    app.useGlobalPipes(new ValidationPipe());

    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.setViewEngine('hbs');

    await app.init();
  });

  describe('CreateUser method : /users (POST)', () => {
    it('Should create a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userMock);
      expect(response.status).toBe(302); // Expect redirect
      expect(response.headers.location).toBe(
        `/success?username=${userMock.username}`,
      );
    });
    it('Should not create the same user twice', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userMock);

      expect(response.status).toBe(302); // Expect user found
      const responsetext = JSON.parse(response.text); // Parse stringified JSON
      expect(responsetext).toEqual({
        statusCode: 302,
        message: 'User already exists.',
      });
    });

    describe('Should not create a user due to', () => {
      it('Username is too short (less than 8 characters)', async () => {
        const response = await request(app.getHttpServer())
          .post('/users')
          .send({
            username: 'test', // username less than 8
            password: userMock.password,
            email: userMock.email,
          });
        expect(response.status).toBe(400); // Expect Bad Request
        expect(response.body.message).toContain(
          'username must be longer than or equal to 8 characters',
        );
      });
      it('Password is too short (less than 8 characters)', async () => {
        userMock.username = 'test';
        const response = await request(app.getHttpServer())
          .post('/users')
          .send({
            username: userMock.username,
            password: 'test', //password less than 8
            email: userMock.email,
          });
        expect(response.status).toBe(400); // Expect Bad Request
        expect(response.body.message).toContain(
          'password must be longer than or equal to 8 characters',
        );
      });
      it('Email is not an email', async () => {
        const response = await request(app.getHttpServer())
          .post('/users')
          .send({
            username: userMock.username,
            password: userMock.password,
            email: 'test', // email not an email
          });
        expect(response.status).toBe(400); // Expect Bad Request
        expect(response.body.message).toContain('email must be an email');
      });
    });
  });
  describe('GetAllUsers method : /users (GET)', () => {
    it('Should render an HTML page with list of users stored in database and pod name', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      // For @Render(), response.text will be HTML
      expect(response.text).toContain('Pod Name:'); // check if pod_name is rendered
      expect(response.text).toContain(userMock.email); // check if user email is rendered
      expect(response.text).toContain('<html>'); // basic HTML check

      // Optionally check content from users list if known
      // expect(response.text).toContain('some_username');
    });
  }),
    afterEach(async () => {
      await app.close();
    });
});
