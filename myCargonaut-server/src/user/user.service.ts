import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDB } from '../database/UserDB';
import * as validator from 'validator';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserDB)
    private userRepository: Repository<UserDB>,
  ) {}

  private isValidMobileNumber(phoneNumber: string): boolean {
    // Regular expression for validating mobile numbers
    const mobileNumberRegex = /^[+]?\d{1,3}?[-\s.]?\d{3,14}[-\s.]?\d{3,14}$/;
    return mobileNumberRegex.test(phoneNumber);
  }

  private isValidEmail(email: string): boolean {
    return validator.isEmail(email);
  }

  // gets a single user from the database by their ID
  async getUserById(id: number): Promise<UserDB> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    birthday: Date,
    phoneNumber?: string,
    profilePic?: string,
  ): Promise<UserDB> {
    // Validate email format
    if (!this.isValidEmail(email)) {
      throw new BadRequestException('Ungültiges E-Mail-Format');
    }

    // Check if email already exists
    const checkUser = await this.userRepository.findOne({ where: { email } });
    if (checkUser) {
      throw new BadRequestException(
        'Es exisitert bereits ein Nutzer mit dieser E-Mail-Adresse.',
      );
    }

    // Validate phone number if provided
    if (phoneNumber && !this.isValidMobileNumber(phoneNumber)) {
      throw new BadRequestException('Ungültige Telefon-Nummer');
    }

    // Validate password
    if (password.trim() === '' || password.trim().length < 8) {
      throw new BadRequestException(
        'Das Passwort muss mindestens 8 Zeichen lang und nicht leer sein.',
      );
    }

    const newUser: UserDB = this.userRepository.create();
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.email = email;
    newUser.password = password;
    newUser.birthday = birthday;
    newUser.phoneNumber = phoneNumber;
    newUser.profilePic = profilePic;
    return this.userRepository.save(newUser);
  }

  async updateUser(userData: UserDB): Promise<UserDB> {
    return this.userRepository.save(userData);
  }
}
