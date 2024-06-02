import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
  Put,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
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

@ApiTags('user')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

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

  @ApiResponse({ type: OkDTO, description: 'creates a new user' })
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: './uploads/profilePictures',
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
    if (body.password.trim() === '' || body.password.trim().length == 0) {
      throw new BadRequestException('Passwort darf nicht leer sein');
    }
    if (body.password.trim().length < 8) {
      throw new BadRequestException(
        'Passwort muss mindestens 8 Zeichen lang sein',
      );
    }
    if (body.password != body.passwordConfirm) {
      throw new BadRequestException('Passwort muss übereinstimmen');
    }
    if (body.email.trim().length == 0 || body.email.trim() === '') {
      throw new BadRequestException('Email darf nicht leer sein');
    }
    if (body.email != body.emailConfirm) {
      throw new BadRequestException('Email muss übereinstimmen');
    }
    if (body.firstName.trim().length == 0 || body.firstName.trim() === '') {
      throw new BadRequestException('Vorname darf nicht leer sein');
    }
    if (body.lastName.trim().length == 0 || body.lastName.trim() === '') {
      throw new BadRequestException('Nachname darf nicht leer sein');
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

      throw new BadRequestException('Es ist ein Fehler aufgetreten');
    }
  }

  @ApiResponse({
    type: OkDTO,
    description: 'updates a specifics user password by their id',
  })
  @Put()
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  async updatePassword(
    @Session() session: SessionData,
    @Body() body: EditPasswordDTO,
  ): Promise<OkDTO> {
    const id = session.currentUser;
    const user = await this.userService.getUserById(id);
    if (body.password.trim() != user.password.trim()) {
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
    await this.userService.updateUser(user);
    return new OkDTO(true, 'User was updated');
  }

  @ApiResponse({
    type: OkDTO,
    description: 'updates a specifics user email by their id',
  })
  @Put()
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  async updateEmail(
    @Session() session: SessionData,
    @Body() body: EditEmailDTO,
  ): Promise<OkDTO> {
    const id = session.currentUser;
    const user = await this.userService.getUserById(id);
    if (body.password.trim() != user.password.trim()) {
      throw new BadRequestException('Aktuelles Passwort ist falsch');
    }
    if (body.Email.trim().length == 0 || body.Email.trim() === '') {
      throw new BadRequestException('Email darf nicht leer sein');
    }
    if (body.Email != body.EmailConfirm) {
      throw new BadRequestException('Email muss übereinstimmen');
    }
    await this.userService.updateUser(user);
    return new OkDTO(true, 'User was updated');
  }
}
