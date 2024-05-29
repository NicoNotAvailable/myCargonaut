import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { databaseTest, tables } from '../../utils/databaseTest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import fs from 'node:fs';

describe('UserController', () => {
  let controller: UserController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        databaseTest('./db/tmp.tester.user.service.sqlite'),
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
    fs.unlink('./db/tmp.tester.user.service.sqlite', (err) => {
      if (err) {
        throw err;
      }
    });
  });
});
