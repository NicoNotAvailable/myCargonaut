import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { databaseTest, tables } from '../../testDatabase/databaseTest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import * as fs from 'fs/promises';
import { BadRequestException } from '@nestjs/common';
import { SessionData } from 'express-session';
import { EditUserDTO } from './DTO/EditUserDTO';
import { CreateUserDTO } from './DTO/CreateUserDTO';
import { EditPasswordDTO } from './DTO/EditPasswordDTO';
import { EditEmailDTO } from './DTO/EditEmailDTO';
import { UserDB } from '../database/UserDB';

describe('UserController', () => {
  let controller: UserController;
  let module: TestingModule;
  let service: UserService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        databaseTest('./testDatabase/dbTest.sqlite'),
        TypeOrmModule.forFeature(tables),
      ],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
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

  it('should create a user successfully', async () => {
    const body: CreateUserDTO = {
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

    const response = await controller.createUser(null, body);
    expect(response.ok).toBe(true);
    expect(response.message).toBe('User was created');
  });

  it('should throw an error for an existing email', async () => {
    const body: CreateUserDTO = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      emailConfirm: 'john.doe@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
      birthday: new Date('1990-01-01'),
      agb: true,
      phoneNumber: '0800555555',
    };
    await expect(controller.createUser(null, body)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw an error for a password shorter than 8 characters', async () => {
    const body: CreateUserDTO = {
      firstName: 'Phil',
      lastName: 'Doe',
      email: 'phil.doe@example.com',
      emailConfirm: 'phil.doe@example.com',
      password: 'short',
      passwordConfirm: 'short',
      birthday: new Date('1990-01-01'),
      agb: true,
      phoneNumber: '08005555555',
    };
    await expect(controller.createUser(null, body)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw an error for an invalid phone number', async () => {
    const body: CreateUserDTO = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      emailConfirm: 'jane.doe@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
      birthday: new Date('1990-01-01'),
      phoneNumber: '12345',
      agb: true,
    };
    await expect(controller.createUser(null, body)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw an error for an underage user', async () => {
    const body: CreateUserDTO = {
      firstName: 'Mark',
      lastName: 'Doe',
      email: 'mark.doe@example.com',
      emailConfirm: 'mark.doe@example.com',
      password: 'securepassword',
      passwordConfirm: 'securepassword',
      agb: true,
      birthday: new Date('2010-01-01'),
      phoneNumber: '0800555555',
    };

    await expect(controller.createUser(null, body)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update a users info successfully', async () => {
    const userBody: EditUserDTO = {
      firstName: 'Maximilian',
      lastName: 'Doe',
      phoneNumber: '015298273928',
      profileText: null,
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
      currentUser: 1,
    };

    // Mock the request object
    const req: any = {
      session: mockSession,
    };

    const response = await controller.updateUser(req, userBody);
    expect(response.ok).toBe(true);
    expect(response.message).toBe('User was updated');

    const updatedUser = await module
      .get<UserService>(UserService)
      .getUserById(mockSession.currentUser);

    expect(updatedUser.firstName).toBe('Maximilian');
    expect(updatedUser.phoneNumber).toBe('015298273928');
    expect(updatedUser.profileText).toBe(null);
  });

  it('should update user email successfully', async () => {
    const emailBody: EditEmailDTO = {
      newEmail: 'max.doe@example.com',
      newEmailConfirm: 'max.doe@example.com',
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
      currentUser: 1,
    };

    // Mock the request object
    const req: any = {
      session: mockSession,
    };

    const response = await controller.updateEmail(req, emailBody);
    expect(response.ok).toBe(true);
    expect(response.message).toBe('User was updated');

    const updatedUser: UserDB = await module
      .get<UserService>(UserService)
      .getUserById(mockSession.currentUser);

    expect(updatedUser.email).toBe('max.doe@example.com');
  });

  it('should throw an error for mismatched email confirmation', async () => {
    const emailBody: EditEmailDTO = {
      newEmail: 'new.doe@example.com',
      newEmailConfirm: 'mismatch.doe@example.com',
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
      currentUser: 1,
    };

    // Mock the request object
    const req: any = {
      session: mockSession,
    };

    await expect(controller.updateEmail(req, emailBody)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update user password successfully', async () => {
    const passwordBody: EditPasswordDTO = {
      password: 'securepassword',
      newPassword: 'newsecurepassword',
      newPasswordConfirm: 'newsecurepassword',
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
      currentUser: 1,
    };

    // Mock the request object
    const req: any = {
      session: mockSession,
    };

    const testUser = await module
      .get<UserService>(UserService)
      .getUserById(mockSession.currentUser);
    console.log(testUser.password);
    const response = await controller.updatePassword(req, passwordBody);
    expect(response.ok).toBe(true);
    expect(response.message).toBe('User was updated');
    expect(testUser.password).toBe('newsecurepassword');
  });

  it('should throw an error for mismatched password confirmation', async () => {
    const passwordBody: EditPasswordDTO = {
      password: 'newsecurepassword',
      newPassword: 'newNewsecurepassword',
      newPasswordConfirm: 'mismatchpassword',
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
      currentUser: 1,
    };

    // Mock the request object
    const req: any = {
      session: mockSession,
    };

    await expect(controller.updatePassword(req, passwordBody)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw an error for incorrect current password', async () => {
    const passwordBody: EditPasswordDTO = {
      password: 'wrongpassword',
      newPassword: 'newsecurepassword',
      newPasswordConfirm: 'newsecurepassword',
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
      currentUser: 1,
    };

    // Mock the request object
    const req: any = {
      session: mockSession,
    };

    await expect(controller.updatePassword(req, passwordBody)).rejects.toThrow(
      BadRequestException,
    );
  });
});
