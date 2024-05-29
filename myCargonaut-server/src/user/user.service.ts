import { BadRequestException, Injectable } from '@nestjs/common';
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

  private isUserAdult(birthday: Date): boolean {
    const today = new Date();

    let age = today.getFullYear() - birthday.getFullYear();
    const monthDifference = today.getMonth() - birthday.getMonth();

    // Adjust age if the birth month hasn't been reached yet this year
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthday.getDate())
    ) {
      age--;
    }

    return age >= 18;
  }

  private isValidEmail(email: string): boolean {
    return validator.isEmail(email);
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
      throw new BadRequestException('Invalid email format');
    }

    // Check if email already exists
    const checkUser = await this.userRepository.findOne({ where: { email } });
    if (checkUser) {
      throw new BadRequestException('Email already exists');
    }

    // Validate phone number if provided
    if (phoneNumber && !this.isValidMobileNumber(phoneNumber)) {
      throw new BadRequestException('Invalid German mobile number');
    }

    // Validate password
    if (password.trim() === '' || password.trim().length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long and not empty');
    }

    // Validate user age
    if (!this.isUserAdult(birthday)) {
      throw new BadRequestException('You must be at least 18 years old to register');
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
}
