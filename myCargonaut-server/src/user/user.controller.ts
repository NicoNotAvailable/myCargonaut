import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDTO } from './DTO/CreateUserDTO';
import { OkDTO } from '../serverDTO/OkDTO';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
    try {
      const profilePic = file ? file.filename : 'empty.png';
      await this.userService.createUser(
        body.firstName,
        body.lastName,
        body.email,
        body.password,
        body.birthday,
        body.phoneNumber,
        profilePic,
      );
      return new OkDTO(true, 'User was created');
    } catch (err) {
      throw new BadRequestException('Es ist ein Fehler aufgetreten');
    }
  }
}
