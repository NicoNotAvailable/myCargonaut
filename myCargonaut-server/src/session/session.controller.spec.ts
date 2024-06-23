/*

import { Test, TestingModule } from '@nestjs/testing';
import { SessionController } from './session.controller';
import { databaseTest, tables } from '../../testDatabase/databaseTest';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs/promises';
import { UserService } from '../user/user.service';
import { CreateUserDTO } from '../user/DTO/CreateUserDTO';
import { OkDTO } from '../serverDTO/OkDTO';
import { UserController } from '../user/user.controller';
import { LoginDTO } from './DTO/LoginDTO';
import { SessionData } from 'express-session';
import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserDB } from '../database/UserDB';

jest.setTimeout(30000);

describe('SessionController', () => {
  let controller: SessionController;
  let userController: UserController;
  let userService: UserService;
  let userRepository: Repository<UserDB>;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        databaseTest('./testDatabase/dbTest.sqlite'),
        TypeOrmModule.forFeature(tables),
      ],
      controllers: [SessionController, UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserDB),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<SessionController>(SessionController);
    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserDB>>(getRepositoryToken(UserDB));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  afterAll(async () => {
    await module.close();

    // Add delay to ensure all operations are complete
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Delete the test database file
    try {
      await fs.unlink('./testDatabase/dbTest.sqlite');
      console.log('Test database file removed');
    } catch (err) {
      console.error('Error removing test database file:', err);
    }
  });

  it('should login an user succesfully', async () => {
    const newUserData: CreateUserDTO = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      emailConfirm: 'john.doe@example.com',
      password: 'securepassword',
      passwordConfirm: 'securepassword',
      agb: true,
      birthday: new Date('2000-01-01'),
      phoneNumber: '0800555555',
    };

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    jest
      .spyOn(userRepository, 'create')
      .mockReturnValue(newUserData as unknown as UserDB);
    jest
      .spyOn(userRepository, 'save')
      .mockResolvedValue(newUserData as unknown as UserDB);
    jest.spyOn(userService, 'createUser').mockImplementation(async () => {
      return newUserData as unknown as UserDB;
    });

    const createRes: OkDTO = await userController.createUser(newUserData);
    expect(createRes.ok).toBe(true);

    const loginUserData: LoginDTO = {
      email: newUserData.email,
      password: newUserData.password,
    };
    const mockSession: SessionData = {
      cookie: {
        originalMaxAge: null,
        expires: null,
        secure: false,
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
      },
      currentUser: null,
    };

    jest.spyOn(userService, 'getLoggingUser').mockImplementation(async () => {
      return newUserData as unknown as UserDB;
    });
    const loginRes: OkDTO = await controller.loginUser(
      mockSession,
      loginUserData,
    );

    expect(loginRes.ok).toBe(true);
    expect(loginRes.message).toBe('User was logged in');
  });

  it('should throw an error for blank inputs', async () => {
    const newUserData: CreateUserDTO = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      emailConfirm: 'john.doe@example.com',
      password: 'securepassword',
      passwordConfirm: 'securepassword',
      agb: true,
      birthday: new Date('2000-01-01'),
      phoneNumber: '0800555555',
    };

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    jest
      .spyOn(userRepository, 'create')
      .mockReturnValue(newUserData as unknown as UserDB);
    jest
      .spyOn(userRepository, 'save')
      .mockResolvedValue(newUserData as unknown as UserDB);
    jest.spyOn(userService, 'createUser').mockImplementation(async () => {
      return newUserData as unknown as UserDB;
    });

    const createRes: OkDTO = await userController.createUser(newUserData);
    expect(createRes.ok).toBe(true);

    const loginUserData: LoginDTO = {
      email: '',
      password: '',
    };
    const mockSession: SessionData = {
      cookie: {
        originalMaxAge: null,
        expires: null,
        secure: false,
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
      },
      currentUser: null,
    };

    jest.spyOn(userService, 'getLoggingUser').mockImplementation(async () => {
      return newUserData as unknown as UserDB;
    });
    await expect(
      controller.loginUser(mockSession, loginUserData),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw an error for mismatching data', async () => {
    const newUserData: CreateUserDTO = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      emailConfirm: 'john.doe@example.com',
      password: 'securepassword',
      passwordConfirm: 'securepassword',
      agb: true,
      birthday: new Date('2000-01-01'),
      phoneNumber: '0800555555',
    };

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    jest
      .spyOn(userRepository, 'create')
      .mockReturnValue(newUserData as unknown as UserDB);
    jest
      .spyOn(userRepository, 'save')
      .mockResolvedValue(newUserData as unknown as UserDB);
    jest.spyOn(userService, 'createUser').mockImplementation(async () => {
      return newUserData as unknown as UserDB;
    });

    const createRes: OkDTO = await userController.createUser(newUserData);
    expect(createRes.ok).toBe(true);

    const loginUserData: LoginDTO = {
      email: 'aghdsah@gmaol.com',
      password: 'fadasd',
    };
    const mockSession: SessionData = {
      cookie: {
        originalMaxAge: null,
        expires: null,
        secure: false,
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
      },
      currentUser: null,
    };

    jest.spyOn(userService, 'getLoggingUser').mockImplementation(async () => {
      return loginUserData as unknown as UserDB;
    });
    await controller.loginUser(mockSession, loginUserData);

    expect(mockSession.currentUser).toBe(undefined);
  });
});

*/


import { Test, TestingModule } from '@nestjs/testing';
import { SessionController } from './session.controller';

describe('VehicleService', () => {
  let provider: SessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionController],
    }).compile();

    provider = module.get<SessionController>(SessionController);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
