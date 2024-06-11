import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Put,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDTO } from './DTO/CreateUserDTO';
import { OkDTO } from '../serverDTO/OkDTO';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { EditPasswordDTO } from './DTO/EditPasswordDTO';
import { EditEmailDTO } from './DTO/EditEmailDTO';
import { SessionData } from 'express-session';
import { IsLoggedInGuard } from '../session/is-logged-in.guard';
import { EditUserDTO } from './DTO/EditUserDTO';
import * as validator from 'validator';
import * as bcrypt from 'bcryptjs';
import { UserDB } from '../database/UserDB';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  private readonly logger = new Logger(UserController.name);

  private validateNonEmptyString(value: string, errorMessage: string): void {
    if (!value?.trim()) {
      throw new BadRequestException(errorMessage);
    }
  }

  private isValidMobileNumber(phoneNumber: string): boolean {
    // Regular expression for validating mobile numbers
    const mobileNumberRegex = /^[+]?\d{1,3}?[-\s.]?\d{3,14}[-\s.]?\d{3,14}$/;
    return mobileNumberRegex.test(phoneNumber);
  }

  private isValidEmail(email: string): boolean {
    return validator.isEmail(email);
  }

  private isUserAdult(birthday: Date): boolean {
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDifference = today.getMonth() - birthday.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthday.getDate())
    ) {
      age--;
    }

    return age >= 18;
  }

  @ApiResponse({ type: OkDTO, description: 'gets the current user' })
  @ApiBearerAuth()
  @Get()
  async getUser(@Session() session: SessionData): Promise<UserDB> {
    if (!session.currentUser) {
      throw new BadRequestException('No user session found');
    }
    const user = await this.userService.getUserById(session.currentUser);
    return user;
  }

  @ApiResponse({ type: OkDTO, description: 'creates a new user' })
  @Post()
  async createUser(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateUserDTO,
  ) {
    if (!body.agb) {
      throw new BadRequestException(
        'Du musst die AGB akzeptieren, um dich zu registrieren',
      );
    }
    this.validateNonEmptyString(body.password, 'Passwort darf nicht leer sein');
    if (body.password.trim().length < 8) {
      throw new BadRequestException(
        'Passwort muss mindestens 8 Zeichen lang sein',
      );
    }
    if (body.password != body.passwordConfirm) {
      throw new BadRequestException('Passwort muss übereinstimmen');
    }
    this.validateNonEmptyString(body.email, 'Email darf nicht leer sein');
    if (!this.isValidEmail(body.email)) {
      throw new BadRequestException('Ungültiges E-Mail-Format');
    }
    if (body.email != body.emailConfirm) {
      throw new BadRequestException('Email muss übereinstimmen');
    }
    this.validateNonEmptyString(body.firstName, 'Vorname darf nicht leer sein');
    this.validateNonEmptyString(body.lastName, 'Nachname darf nicht leer sein');
    if (body.phoneNumber && !this.isValidMobileNumber(body.phoneNumber)) {
      throw new BadRequestException('Ungültige Telefon-Nummer');
    }
    const birthday = new Date(body.birthday);
    if (!this.isUserAdult(birthday)) {
      throw new BadRequestException(
        'Sie müssen mindestens 18 Jahre alt sein, um sich zu registrieren.',
      );
    }
    try {
      const profilePic = file ? file.filename : 'empty.png';
      await this.userService.createUser(
        body.firstName,
        body.lastName,
        body.email.trim(),
        body.password.trim(),
        birthday,
        body.phoneNumber,
        profilePic,
      );
      return new OkDTO(true, 'User was created');
    } catch (err) {
      throw err;
    }
  }

  /*
   * uses the userService to update the profile picture of the current user
   * @Pre the user is currently logged in as the currentUser
   * @Param a file as the profile picture image
   * @Return an OkDTO if it was succesful
   */
  @ApiResponse({
    type: OkDTO,
    description: 'posts a profile picture for a specific user',
  })
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  @Post('upload-profile-picture')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profilepictures',
        filename: (req: any, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Session() session: SessionData,
  ) {
    const id = session.currentUser;
    const user = await this.userService.getUserById(id);
    user.profilePic = file.filename;
    try {
      await this.userService.updateUser(user);

      return new OkDTO(true, 'Profile Picture Upload successfull');
    } catch (err) {
      throw err;
    }
  }

  @ApiResponse({
    type: OkDTO,
    description: 'updates a specifics user password by their id',
  })
  @Put('editPassword')
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  async updatePassword(
    @Session() session: SessionData,
    @Body() body: EditPasswordDTO,
  ): Promise<OkDTO> {
    const id = session.currentUser;
    const user = await this.userService.getUserById(id);
    this.logger.log(user.password);
    this.logger.log(body.password);
    const passwordMatch = await bcrypt.compare(
      body.password.trim(),
      user.password,
    );
    if (!passwordMatch) {
      throw new BadRequestException('Aktuelles Passwort ist falsch');
    }
    if (body.newPassword.trim() === '' || body.newPassword.trim().length == 0) {
      throw new BadRequestException('Neues Passwort darf nicht leer sein');
    }
    if (body.newPassword.trim().length < 8) {
      throw new BadRequestException(
        'Neues Passwort muss mindestens 8 Zeichen lang sein',
      );
    }
    if (body.newPassword != body.newPasswordConfirm) {
      throw new BadRequestException('Neues Passwort muss übereinstimmen');
    }
    user.password = body.newPassword;
    try {
      await this.userService.updateUser(user);
      return new OkDTO(true, 'User was updated');
    } catch (err) {
      throw err;
    }
  }

  @ApiResponse({
    type: OkDTO,
    description: 'updates a specifics user email by their id',
  })
  @Put('editEmail')
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  async updateEmail(
    @Session() session: SessionData,
    @Body() body: EditEmailDTO,
  ): Promise<OkDTO> {
    const id = session.currentUser;
    const user = await this.userService.getUserById(id);
    if (body.newEmail.trim().length == 0 || body.newEmail.trim() === '') {
      throw new BadRequestException('Email darf nicht leer sein');
    }
    if (body.newEmail != body.newEmailConfirm) {
      throw new BadRequestException('Email muss übereinstimmen');
    }
    user.email = body.newEmail;
    try {
      await this.userService.updateUser(user);
      return new OkDTO(true, 'User was updated');
    } catch (err) {
      throw err;
    }
  }

  @ApiResponse({
    type: OkDTO,
    description: 'updates a specifics user details',
  })
  @Put()
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  async updateUser(
    @Session() session: SessionData,
    @Body() body: EditUserDTO,
  ): Promise<OkDTO> {
    const id = session.currentUser;
    const user = await this.userService.getUserById(id);
    if (
      body.phoneNumber != user.phoneNumber &&
      !this.isValidMobileNumber(body.phoneNumber)
    ) {
      throw new BadRequestException('Ungültige Telefon-Nummer');
    }
    user.phoneNumber = body.phoneNumber;
    if (body.firstName) {
      this.validateNonEmptyString(
        body.firstName,
        'Vorname darf nicht leer sein',
      );
      user.firstName = body.firstName;
    }
    if (body.lastName) {
      this.validateNonEmptyString(
        body.lastName,
        'Nachname darf nicht leer sein',
      );
      user.lastName = body.lastName;
    }
    if (body.profileText) user.profileText = body.profileText;
    try {
      await this.userService.updateUser(user);
      return new OkDTO(true, 'User was updated');
    } catch (err) {
      throw err;
    }
  }

  @ApiResponse({
    type: OkDTO,
    description: '"deletes" a spefics user by only keeping its id',
  })
  @Put('delete')
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  async deleteUser(@Session() session: SessionData): Promise<OkDTO> {
    const id = session.currentUser;
    const user = await this.userService.getUserById(id);
    user.email = null;
    user.firstName = '';
    user.lastName = '';
    user.password = null;
    user.birthday = new Date('2000-01-01');
    user.profileText = 'Dieser Nutzer hat sein konto deaktiviert.';
    user.profilePic = 'empty.png';
    user.phoneNumber = null;
    try {
      await this.userService.updateUser(user);
      return new OkDTO(true, 'User was deleted');
    } catch (err) {
      throw new BadRequestException('User could not be deleted');
    }
  }
}
