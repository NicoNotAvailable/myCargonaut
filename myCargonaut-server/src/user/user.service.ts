import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDB } from '../database/UserDB';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from '../session/DTO/LoginDTO';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserDB)
        private userRepository: Repository<UserDB>,
    ) {}

    // gets a single user from the database by their ID
    async getUserById(id: number): Promise<UserDB> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async getLoggingUser(body: LoginDTO): Promise<UserDB | null> {
        const user: UserDB | null = await this.userRepository.findOne({
            where: { email: body.email },
        });
        console.log(await this.userRepository.find());
        console.log(user);
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
        // Check if email already exists
        const checkUser = await this.userRepository.findOne({
            where: { email },
        });
        if (checkUser) {
            throw new BadRequestException(
                'Es exisitert bereits ein Nutzer mit dieser E-Mail-Adresse.',
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser: UserDB = this.userRepository.create();
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.email = email;
        newUser.password = hashedPassword;
        newUser.birthday = birthday;
        newUser.phoneNumber = phoneNumber;
        newUser.profilePic = profilePic;
        return this.userRepository.save(newUser);
    }

    async updateUser(userData: UserDB): Promise<UserDB> {
        return this.userRepository.save(userData);
    }

    async updatePassword(userData: UserDB): Promise<UserDB> {
        userData.password = await bcrypt.hash(userData.password, 10);
        return this.userRepository.save(userData);
    }
}
