import { Test, TestingModule } from '@nestjs/testing';
import { SessionController } from './session.controller';
import { databaseTest, tables } from '../../testDatabase/databaseTest';
import { TypeOrmModule } from '@nestjs/typeorm';
import fs from 'fs/promises';

describe('SessionController', () => {
  let controller: SessionController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        databaseTest('./testDatabase/dbTest.sqlite'),
        TypeOrmModule.forFeature(tables),
      ],
      controllers: [SessionController],
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
});
