import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './Entity/user.entity';
import { CreateUserDTO } from './DTO/user.create.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

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

  const mockUserRepository = {
    //mockImplementation: allows you to define custom logic for what the mock function should do.

    findOneBy: jest.fn().mockImplementation(({ email }) => {
      if (email === 'test-user-exist@test.test') {
        return Promise.resolve(userMock_exist);
      }
      return Promise.resolve(null);
    }),
    create: jest.fn().mockImplementation((user) => user), //create a user
    save: jest.fn().mockImplementation((user) => {
      return {
        id: Date.now(),
        ...user,
      };
    }),

    //This is a shortcut for mocking an async function that resolves to a specific value.
    //Use this when you're mocking a method that returns a Promise and you just want to return a fixed value.
    find: jest.fn().mockResolvedValue([{ id: Date.now(), ...userMock_exist }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should throw an error if user already exists', async () => {
      await expect(service.createUser(userMock_exist)).rejects.toThrow(
        new HttpException('User already exists.', HttpStatus.FOUND),
      );
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        email: userMock_exist.email,
      });
    });

    it('should create a new user if email does not exist', async () => {
      const result = await service.createUser(userMock_new);
      expect(result).toEqual({ id: expect.any(Number), ...userMock_new });
    });
  });

  describe('getAllUsers', () => {
    it('Should get all users', async () => {
      const result = await service.getAllUsers();

      expect(result).toEqual([
        {
          id: expect.any(Number),
          ...userMock_exist,
        },
      ]);
    });
  });
});
