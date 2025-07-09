import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { ConfigService } from '@nestjs/config'; // Make sure to import ConfigService
import { UsersService } from './users.service';
import { CreateUserDTO } from './DTO/user.create.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  // Mock user service
  const mockUserService = {
    createUser: jest.fn().mockImplementation((dto: CreateUserDTO) => {
      // Simulate finding existing user
      if (dto.email === 'test-user-exist@test.test') {
        throw new HttpException('User already exists.', HttpStatus.FOUND);
      }

      // Simulate successful creation
      return Promise.resolve({
        id: Date.now(),
        ...dto,
      });
    }),
    getAllUsers: jest.fn().mockImplementation(() => {
      // Return mock array of users
      return Promise.resolve([
        {
          id: Date.now(),
          ...userMock_exist,
        },
      ]);
    }),
  };

  // Mock ConfigService
  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'DB_USERNAME') {
        return 'oussama';
      }
      return null;
    }),
  };

  // Mock a user (new : not added in database yet)
  const userMock_new: CreateUserDTO = {
    username: 'test-user-new',
    email: 'test-user-new@test.test',
    password: 'test-password',
  };
  // Mock a user (exist : already added in database)
  const userMock_exist: CreateUserDTO = {
    username: 'test-user-exist',
    email: 'test-user-exist@test.test',
    password: 'test-password',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: ConfigService, // Add ConfigService to providers
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('CreateUser', () => {
    it('Should throw conflict exception when email exists', async () => {
      // Used rejects.toThrow() to properly test the thrown exception
      // Matched the exact expected exception with message and status code
      await expect(controller.CreateUser(userMock_exist)).rejects.toThrow(
        new HttpException('User already exists.', HttpStatus.FOUND),
      );
    });

    it('Should create a user and return url', async () => {
      const result = await controller.CreateUser(userMock_new);

      expect(result).toEqual({
        url: `/success?username=${userMock_new.username}`,
      });
    });
  });
  describe('GetAllUsers', () => {
    it('Should return list of users', async () => {
      // execute GetAllUsers function from the controller
      // the controller will use the mock service
      const result = await controller.GetAllUsers();
      // should track outputs from controller by using mock service
      expect(usersService.getAllUsers).toHaveBeenCalledWith();
      expect(result).toEqual({
        users: [
          {
            id: expect.any(Number),
            ...userMock_exist,
          },
        ],
        pod_name: expect.any(String),
      });
    });
  });
});
