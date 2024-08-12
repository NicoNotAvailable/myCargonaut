import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserDB } from '../database/UserDB'; // Adjust the import path as necessary
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Mock data
const mockUser = {
  id: 1,
  email: 'test@example.com',
  password: 'hashedpassword',
  firstName: 'Test',
  lastName: 'User',
  birthday: new Date('2000-01-01'),
  phoneNumber: '1234567890',
  profilePic: 'default.jpg',
  isSmoker: false,
  profileText: 'This is a test user',
  languages: 'English',
} as UserDB;

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<UserDB>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserDB),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            // Add other methods you use in UserService
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserDB>>(getRepositoryToken(UserDB));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
});
