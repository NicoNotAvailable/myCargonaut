import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { databaseTest, tables } from '../../testDatabase/databaseTest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import * as fs from 'fs/promises';
import { CreateUserDTO } from './DTO/CreateUserDTO';
import { BadRequestException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let module: TestingModule;

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
    const dto: CreateUserDTO = {
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

    const response = await controller.createUser(null, dto);
    expect(response.ok).toBe(true);
    expect(response.message).toBe('User was created');
  });

  it('should throw an error for an existing email', async () => {
    const body = {
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
    const body = {
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
    const body = {
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
    const dto: CreateUserDTO = {
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

    await expect(controller.createUser(null, dto)).rejects.toThrow(
      BadRequestException,
    );
  });
});
