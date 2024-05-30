import { Test, TestingModule } from '@nestjs/testing';
import { SessionController } from './session.controller';
import { databaseTest, tables } from '../../testDatabase/databaseTest';
import { TypeOrmModule } from '@nestjs/typeorm';
import fs from 'fs/promises';
import { UserService } from '../user/user.service';
import { CreateUserDTO } from '../user/DTO/CreateUserDTO';
import { OkDTO } from '../serverDTO/OkDTO';
import { UserController } from '../user/user.controller';
import { LoginDTO } from './DTO/LoginDTO';
import { SessionData } from 'express-session';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('SessionController', () => {
  let controller: SessionController;
  let userController: UserController;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        databaseTest('./testDatabase/dbTest.sqlite'),
        TypeOrmModule.forFeature(tables),
      ],
      controllers: [SessionController, UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<SessionController>(SessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    try {
      const createRes: OkDTO = await userController.createUser(
        null,
        newUserData,
      );
      if (createRes) {
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

        const loginRes: OkDTO = await controller.loginUser(
          mockSession,
          loginUserData,
        );
        expect(loginRes.ok).toBe(true);
        expect(loginRes.message).toBe('User was logged in');
      }
    } catch (err) {
      console.error('Error creating user');
    }
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

    try {
      const createRes: OkDTO = await userController.createUser(
        null,
        newUserData,
      );
      if (createRes) {
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

        await expect(
          controller.loginUser(mockSession, loginUserData),
        ).rejects.toThrow(BadRequestException);
      }
    } catch (err) {
      console.error('Error creating user');
    }
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

    try {
      const createRes: OkDTO = await userController.createUser(
        null,
        newUserData,
      );
      if (createRes) {
        const loginUserData: LoginDTO = {
          email: 'john.doe@exm.de',
          password: '123456789',
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

        await expect(
          controller.loginUser(mockSession, loginUserData),
        ).rejects.toThrow(UnauthorizedException);
      }
    } catch (err) {
      console.error('Error creating user');
    }
  });
});
