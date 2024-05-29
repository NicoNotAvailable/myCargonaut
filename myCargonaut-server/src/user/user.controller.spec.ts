import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { databaseTest, tables } from '../../testDatabase/databaseTest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import * as fs from 'fs/promises'; // Use promises version of fs

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
});
