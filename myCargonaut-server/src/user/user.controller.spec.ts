import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UtilsService } from '../utils/utils.service';
import { ReviewService } from '../review/review.service';
import { BadRequestException } from '@nestjs/common';
import { OkDTO } from '../serverDTO/OkDTO';
import { EditPasswordDTO } from './DTO/EditPasswordDTO';
import { EditEmailDTO } from './DTO/EditEmailDTO';
import { EditUserDTO } from './DTO/EditUserDTO';
import { SessionData } from 'express-session';
import * as bcrypt from 'bcryptjs';

// Mock session data with cookie properties
const mockSession: Partial<SessionData> = {
  currentUser: 1,
  cookie: {
    originalMaxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  },
};

// Define mock request and response objects
jest.fn();
describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUserById: jest.fn(),
            getUserByEmail: jest.fn(),
            createUser: jest.fn(),
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

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const body = {
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

      jest.spyOn(userService, 'createUser').mockResolvedValue(undefined);
      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue({
        id: 1,
        ...body,
      } as any);

      const result = await controller.createUser(
        body,
        mockSession as SessionData,
      );

      expect(result).toEqual(new OkDTO(true, 'User was created'));
      expect(userService.createUser).toHaveBeenCalledWith(
        body.firstName,
        body.lastName,
        body.email.trim(),
        body.password.trim(),
        body.birthday,
        body.phoneNumber,
      );
    });

    it('should throw error for missing agb', async () => {
      const body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        emailConfirm: 'john.doe@example.com',
        password: 'securepassword',
        passwordConfirm: 'securepassword',
        agb: false,
        birthday: new Date('2000-01-01'),
        phoneNumber: '0800555555',
      };

      await expect(
        controller.createUser(body, mockSession as SessionData),
      ).rejects.toThrow(
        'Du musst die AGB akzeptieren, um dich zu registrieren',
      );
    });

    it('should throw error for invalid password confirmation', async () => {
      const body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        emailConfirm: 'john.doe@example.com',
        password: 'securepassword',
        passwordConfirm: 'wrongpassword',
        agb: true,
        birthday: new Date('2000-01-01'),
        phoneNumber: '0800555555',
      };

      await expect(
        controller.createUser(body, mockSession as SessionData),
      ).rejects.toThrow('Passwort muss übereinstimmen');
    });

    it('should throw error for invalid age', async () => {
      const body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        emailConfirm: 'john.doe@example.com',
        password: 'securepassword',
        passwordConfirm: 'securepassword',
        agb: true,
        birthday: new Date('2010-01-01'),
        phoneNumber: '0800555555',
      };

      await expect(
        controller.createUser(body, mockSession as SessionData),
      ).rejects.toThrow(
        'Sie müssen mindestens 18 Jahre alt sein, um sich zu registrieren.',
      );
    });

    it('should throw error for invalid password length', async () => {
      const body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        emailConfirm: 'john.doe@example.com',
        password: 'secure',
        passwordConfirm: 'secure',
        agb: true,
        birthday: new Date('2000-01-01'),
        phoneNumber: '0800555555',
      };

      await expect(
        controller.createUser(body, mockSession as SessionData),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error for empty firstName field', async () => {
      const body = {
        firstName: '',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        emailConfirm: 'john.doe@example.com',
        password: 'securepassword',
        passwordConfirm: 'securepassword',
        agb: true,
        birthday: new Date('2000-01-01'),
        phoneNumber: '0800555555',
      };

      await expect(
        controller.createUser(body, mockSession as SessionData),
      ).rejects.toThrow('Vorname darf nicht leer sein');
    });

    it('should throw error for empty lastName field', async () => {
      const body = {
        firstName: 'John',
        lastName: '',
        email: 'john.doe@example.com',
        emailConfirm: 'john.doe@example.com',
        password: 'securepassword',
        passwordConfirm: 'securepassword',
        agb: true,
        birthday: new Date('2000-01-01'),
        phoneNumber: '0800555555',
      };

      await expect(
        controller.createUser(body, mockSession as SessionData),
      ).rejects.toThrow('Nachname darf nicht leer sein');
    });

    it('should throw error for empty password field', async () => {
      const body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        emailConfirm: 'john.doe@example.com',
        password: '',
        passwordConfirm: '',
        agb: true,
        birthday: new Date('2000-01-01'),
        phoneNumber: '0800555555',
      };

      await expect(
        controller.createUser(body, mockSession as SessionData),
      ).rejects.toThrow('Passwort darf nicht leer sein');
    });

    it('should throw error for empty Email field', async () => {
      const body = {
        firstName: 'John',
        lastName: 'Doe',
        email: '',
        emailConfirm: '',
        password: 'securepassword',
        passwordConfirm: 'securepassword',
        agb: true,
        birthday: new Date('2010-01-01'),
        phoneNumber: '0800555555',
      };

      await expect(
        controller.createUser(body, mockSession as SessionData),
      ).rejects.toThrow('Email darf nicht leer sein');
    });
  });

  describe('updatePassword', () => {
    it('should update password successfully', async () => {
      const body: EditPasswordDTO = {
        password: 'currentpassword',
        newPassword: 'newsecurepassword',
        newPasswordConfirm: 'newsecurepassword',
      };

      const user = {
        password: await bcrypt.hash('currentpassword', 10),
      } as any;
      jest.spyOn(userService, 'getUserById').mockResolvedValue(user);
      jest.spyOn(userService, 'updateUser').mockResolvedValue(undefined);
      jest.spyOn(bcrypt, 'compare' as any).mockResolvedValue(true);

      const result = await controller.updatePassword(
        mockSession as SessionData,
        body,
      );

      expect(result).toEqual(new OkDTO(true, 'User was updated'));
    });

    it('should throw error for incorrect current password', async () => {
      const body: EditPasswordDTO = {
        password: 'wrongpassword',
        newPassword: 'newsecurepassword',
        newPasswordConfirm: 'newsecurepassword',
      };

      jest.spyOn(userService, 'getUserById').mockResolvedValue({
        password: await bcrypt.hash('currentpassword', 10),
      } as any);
      jest.spyOn(bcrypt, 'compare' as any).mockResolvedValue(false);

      await expect(
        controller.updatePassword(mockSession as SessionData, body),
      ).rejects.toThrow('Aktuelles Passwort ist falsch');
    });

    it('should throw error for incorrect new confirmed password', async () => {
      const body: EditPasswordDTO = {
        password: 'currentpassword',
        newPassword: 'newsecurepassword',
        newPasswordConfirm: 'newpassword',
      };

      jest.spyOn(userService, 'getUserById').mockResolvedValue({
        password: await bcrypt.hash('currentpassword', 10),
      } as any);
      jest.spyOn(bcrypt, 'compare' as any).mockResolvedValue(true);

      await expect(
        controller.updatePassword(mockSession as SessionData, body),
      ).rejects.toThrow('Neues Passwort muss übereinstimmen');
    });

    it('should throw error for empty new confirmed password', async () => {
      const body: EditPasswordDTO = {
        password: 'currentpassword',
        newPassword: '',
        newPasswordConfirm: '',
      };

      jest.spyOn(userService, 'getUserById').mockResolvedValue({
        password: await bcrypt.hash('currentpassword', 10),
      } as any);
      jest.spyOn(bcrypt, 'compare' as any).mockResolvedValue(true);

      await expect(
        controller.updatePassword(mockSession as SessionData, body),
      ).rejects.toThrow('Neues Passwort darf nicht leer sein');
    });
  });

  describe('updateEmail', () => {
    it('should update email successfully', async () => {
      const body: EditEmailDTO = {
        newEmail: 'new.email@example.com',
        newEmailConfirm: 'new.email@example.com',
      };

      const user = { email: 'old.email@example.com' } as any;
      jest.spyOn(userService, 'getUserById').mockResolvedValue(user);
      jest.spyOn(userService, 'updateUser').mockResolvedValue(undefined);

      const result = await controller.updateEmail(
        mockSession as SessionData,
        body,
      );

      expect(result).toEqual(new OkDTO(true, 'User was updated'));
      expect(userService.updateUser).toHaveBeenCalledWith({
        ...user,
        email: body.newEmail,
      });
    });

    it('should throw error for mismatched email confirmation', async () => {
      const body: EditEmailDTO = {
        newEmail: 'new.email@example.com',
        newEmailConfirm: 'mismatch.email@example.com',
      };

      await expect(
        controller.updateEmail(mockSession as SessionData, body),
      ).rejects.toThrow('Email muss übereinstimmen');
    });

    it('should throw error for empty email', async () => {
      const body: EditEmailDTO = {
        newEmail: '',
        newEmailConfirm: '',
      };

      await expect(
        controller.updateEmail(mockSession as SessionData, body),
      ).rejects.toThrow('Email darf nicht leer sein');
    });
  });

  describe('updateUser', () => {
    it('should update user profile successfully', async () => {
      const body: EditUserDTO = {
        firstName: 'Max',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        profileText: 'Updated profile',
        languages: '',
        isSmoker: false,
      };

      // Mock user service to return an initial user object
      const initialUser = {
        id: 1,
        phoneNumber: '1234567890',
        profileText: 'Old profile',
        languages: 'English',
        isSmoker: false,
        firstName: 'OldFirstName',
        lastName: 'OldLastName',
      };

      jest
        .spyOn(userService, 'getUserById')
        .mockResolvedValue(initialUser as any);
      jest.spyOn(userService, 'updateUser').mockResolvedValue(undefined);

      // Define the updated user object that will be passed to updateUser
      const updatedUser = {
        ...initialUser,
        ...body, // Merge the changes from the request body
      };

      const result = await controller.updateUser(
        mockSession as SessionData,
        body,
      );

      expect(result).toEqual(new OkDTO(true, 'User was updated'));
      expect(userService.updateUser).toHaveBeenCalledWith(updatedUser);
    });

    it('should throw error for invalid phone number', async () => {
      const body: EditUserDTO = {
        phoneNumber: 'invalid',
      } as EditUserDTO;

      const user = { phoneNumber: 'valid' } as any;
      jest.spyOn(userService, 'getUserById').mockResolvedValue(user);

      await expect(
        controller.updateUser(mockSession as SessionData, body),
      ).rejects.toThrow('Ungültige telefon-Nummer');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const user = { id: 1, email: 'email@example.com' } as any;
      jest.spyOn(userService, 'getUserById').mockResolvedValue(user);
      jest.spyOn(userService, 'updateUser').mockResolvedValue(undefined);

      const result = await controller.deleteUser(mockSession as SessionData);

      expect(result).toEqual(new OkDTO(true, 'User was deleted'));
      expect(userService.updateUser).toHaveBeenCalledWith({
        ...user,
        email: null,
        firstName: '',
        lastName: '',
        password: null,
        birthday: new Date('2000-01-01'),
        profileText: 'Dieser Nutzer hat sein konto deaktiviert.',
        profilePic: 'empty.png',
        phoneNumber: null,
      });
    });
  });
});
