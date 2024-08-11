import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import { UtilsService } from '../utils/utils.service';
import { ReviewService } from '../review/review.service';
import { CreateUserDTO } from '../user/DTO/CreateUserDTO';
import { BadRequestException } from '@nestjs/common';
import { SessionData } from 'express-session';
import { GetOtherUserDTO } from '../user/DTO/GetOtherUserDTO';
import * as bcrypt from 'bcryptjs';
import { UserDB } from '../database/UserDB';
import { GetOwnUserDTO } from '../user/DTO/GetOwnUserDTO';

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

// Mock session with complete cookie property
const mockSession: SessionData = {
  currentUser: 1,
  cookie: {
    originalMaxAge: 3600000,
    expires: new Date(Date.now() + 3600000),
    maxAge: 3600000,
    httpOnly: true,
    secure: false,
    path: '/',
  },
};

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let reviewService: ReviewService;
  let utilsService: UtilsService;
  let session: SessionData;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            getUserByEmail: jest.fn(),
            getUserById: jest.fn(),
            updateUser: jest.fn(),
          },
        },
        {
          provide: UtilsService,
          useValue: {
            transformUserToGetOtherUserDTO: jest.fn(),
          },
        },
        {
          provide: ReviewService,
          useValue: {
            getRating: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    reviewService = module.get<ReviewService>(ReviewService);
    utilsService = module.get<UtilsService>(UtilsService);

    session = mockSession;
  });

  describe('createUser', () => {
    it('should create a new user and set session', async () => {
      const mockUserResponse: UserDB = {
        ...mockUser,
        id: 1,
      };

      const dto: CreateUserDTO = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        emailConfirm: 'test@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
        phoneNumber: '1234567890',
        birthday: new Date('2000-01-01'),
        agb: true,
      };

      jest.spyOn(userService, 'createUser').mockResolvedValue(mockUserResponse);
      jest
        .spyOn(userService, 'getUserByEmail')
        .mockResolvedValue(mockUserResponse);

      const result = await userController.createUser(dto, session);

      expect(userService.createUser).toHaveBeenCalledWith(
        'Test',
        'User',
        'test@example.com',
        'password123',
        new Date('2000-01-01'),
        '1234567890',
      );
      expect(userService.getUserByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(session.currentUser).toEqual(1);
      expect(result.ok).toBe(true);
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      const dto: CreateUserDTO = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        emailConfirm: 'test@example.com',
        password: 'password123',
        passwordConfirm: 'password124', // Different password
        phoneNumber: '1234567890',
        birthday: new Date('2000-01-01'),
        agb: true,
      };

      await expect(userController.createUser(dto, session)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getOtherUser', () => {
    it('should return transformed user data for valid user ID', async () => {
      const mockUserResponse: UserDB = {
        ...mockUser,
      };

      const mockGetOtherUserDTO: GetOtherUserDTO = {
        id: 1,
        firstName: 'Test',
        lastName: 'User',
        profilePic: 'pic.jpg',
        languages: 'English',
        profileText: 'Hello!',
        isSmoker: false,
        rating: 4.5,
        birthyear: 2000,
      };

      jest
        .spyOn(userService, 'getUserById')
        .mockResolvedValue(mockUserResponse);
      jest
        .spyOn(utilsService, 'transformUserToGetOtherUserDTO')
        .mockResolvedValue(mockGetOtherUserDTO);

      const result = await userController.getOtherUser(1);

      expect(userService.getUserById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockGetOtherUserDTO);
    });

    it('should handle errors in getOtherUser gracefully', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      jest
        .spyOn(userService, 'getUserById')
        .mockRejectedValue(new Error('User not found'));

      const result = await userController.getOtherUser(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));

      expect(result).toBeUndefined();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getUser', () => {
    it('should return own user data with rating', async () => {
      const mockRating = 4.5;
      const mockUserResponse = {
        id: 1,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
      } as UserDB;

      jest
        .spyOn(userService, 'getUserById')
        .mockResolvedValue(mockUserResponse);
      jest.spyOn(reviewService, 'getRating').mockResolvedValue(mockRating);

      session.currentUser = 1;
      const result = await userController.getUser(session);

      expect(userService.getUserById).toHaveBeenCalledWith(1);
      expect(reviewService.getRating).toHaveBeenCalledWith(1);
      expect(result).toEqual(
        expect.objectContaining({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          rating: mockRating,
        }),
      );
    });

    it('should handle errors in getUser gracefully', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      jest
        .spyOn(userService, 'getUserById')
        .mockRejectedValue(new Error('User not found'));
      jest
        .spyOn(reviewService, 'getRating')
        .mockRejectedValue(new Error('Rating service failed'));

      const result = await userController.getUser(session);

      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
      expect(consoleErrorSpy).toHaveBeenCalledWith(new Error('User not found'));
      expect(consoleErrorSpy).toHaveBeenCalledWith(new Error('User not found'));

      const expectedDto = new GetOwnUserDTO();
      expectedDto.lastName = '';
      expectedDto.firstName = '';
      expectedDto.email = '';
      expectedDto.profilePic = '';
      expectedDto.phoneNumber = '';
      expectedDto.birthday = new Date();
      expectedDto.isSmoker = false;
      expectedDto.profileText = '';
      expectedDto.languages = '';
      expectedDto.rating = 0;

      expect(result).toEqual(
        expect.objectContaining({
          birthday: expect.any(Date),
        }),
      );

      expect(result.lastName).toBe(expectedDto.lastName);
      expect(result.firstName).toBe(expectedDto.firstName);
      expect(result.email).toBe(expectedDto.email);
      expect(result.profilePic).toBe(expectedDto.profilePic);
      expect(result.phoneNumber).toBe(expectedDto.phoneNumber);
      expect(result.isSmoker).toBe(expectedDto.isSmoker);
      expect(result.profileText).toBe(expectedDto.profileText);
      expect(result.languages).toBe(expectedDto.languages);
      expect(result.rating).toBe(expectedDto.rating);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('updatePassword', () => {
    it('should update the password when current password matches', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUserResponse = { id: 1, password: hashedPassword } as UserDB;
      const body = {
        password: 'password123',
        newPassword: 'newpassword123',
        newPasswordConfirm: 'newpassword123',
      };

      jest
        .spyOn(userService, 'getUserById')
        .mockResolvedValue(mockUserResponse);
      jest.spyOn(userService, 'updateUser').mockResolvedValue(mockUserResponse);

      session.currentUser = 1;
      const result = await userController.updatePassword(session, body);

      expect(result.ok).toBe(true);
      expect(userService.updateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          password: expect.any(String),
        }),
      );
    });

    it('should throw BadRequestException if current password is incorrect', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUserResponse = { id: 1, password: hashedPassword } as UserDB;
      const body = {
        password: 'wrongpassword',
        newPassword: 'newpassword123',
        newPasswordConfirm: 'newpassword123',
      };

      jest
        .spyOn(userService, 'getUserById')
        .mockResolvedValue(mockUserResponse);

      session.currentUser = 1;
      await expect(
        userController.updatePassword(session, body),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
