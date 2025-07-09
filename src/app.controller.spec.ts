import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = app.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('showRegistrationForm', () => {
    it('should return pod name from environment', () => {
      process.env.POD_NAME = 'test-pod';
      const result = controller.showRegistrationForm();
      expect(result).toEqual({ pod_name: 'Pod Name: test-pod' });
    });

    it('should return default pod name if not set', () => {
      delete process.env.POD_NAME;
      const result = controller.showRegistrationForm();
      expect(result).toEqual({ pod_name: 'Pod Name: Pod name not available' });
    });
  });

  describe('showSuccessPage', () => {
    it('should return username in response', () => {
      const result = controller.showSuccessPage('oussama');
      expect(result).toEqual({ username: 'oussama' });
    });
  });

  describe('live', () => {
    it('should return live status', () => {
      expect(controller.live()).toEqual({ message: 'live' });
    });
  });
});
