import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDB } from '../database/UserDB';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserDB)
    private userRepository: Repository<UserDB>,
  ) {}

  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    birthday: Date,
    phoneNumber?: string,
    profilePic?: string,
  ): Promise<UserDB> {
    const newUser: UserDB = this.userRepository.create();
    const checkUser: UserDB = await this.userRepository.findOne({
      where: { email: email },
    });
    if (checkUser != null && email === checkUser.email) {
      throw new BadRequestException('email already exists');
    }
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.email = email;
    newUser.password = password;
    newUser.birthday = birthday;
    newUser.phoneNumber = phoneNumber;
    newUser.profilePic = profilePic;
    return await this.userRepository.save(newUser);
  }
}
