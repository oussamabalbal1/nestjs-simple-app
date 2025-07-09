import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

describe('UserController E2E TEST', () => {
  let app: NestExpressApplication;

  const userMock = {
    username: 'test-testf2ss',
    email: 'test-testf3wd32@test.test',
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

  describe('showRegistrationForm method : / (GET)', () => {
    it('Should render an HTML page where users can register', async () => {
      const response = await request(app.getHttpServer()).get('/').expect(200);
      // For @Render(), response.text will be HTML
      expect(response.text).toContain('Register New User');
      expect(response.text).toContain('Pod Name:'); // check if pod_name is rendered
      expect(response.text).toContain('<html>'); // basic HTML check
    });
  }),
    describe('showSuccessPage method : /success (GET)', () => {
      it('Should render a success HTML page when a user registered successfully', async () => {
        const response = await request(app.getHttpServer())
          .get('/success')
          .query({ username: userMock.username })
          .expect(200);
        // For @Render(), response.text will be HTML
        expect(response.text).toContain(userMock.username);
        expect(response.text).toContain('Registration Successful');
        expect(response.text).toContain('<body>'); // basic HTML check
      });
    }),
    describe('live method : /live (GET)', () => {
      it('Should return 200 status code and a message {message: live}', async () => {
        const response = await request(app.getHttpServer())
          .get('/live')
          .expect(200);
        const responsetext = JSON.parse(response.text); // Parse stringified JSON
        expect(responsetext).toEqual({ message: 'live' });
      });
    }),
    afterEach(async () => {
      await app.close();
    });
});
