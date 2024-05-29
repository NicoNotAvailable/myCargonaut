import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDTO } from './DTO/CreateUserDTO';
import { OkDTO } from '../serverDTO/OkDTO';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /*
   * uses the userService to create a new user with the given values that are needed in order to create a new user
   * @Param body CreateUserDTO, username, firstname, lastname, password
   * @Return OkDTO if the user was succesfully created
   * @Error if the input values do not meet the given requirements
   * @Error if the user could not be created
   */
  @ApiResponse({ type: OkDTO, description: 'creates a new user' })
  @Post()
  async createUser(@Body() body: CreateUserDTO) {
    if (body.agb == false) {
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
    if (body.password != body.password) {
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
    if (!isUserAdult(body.birthday)) {
      throw new BadRequestException(
        'Du musst mindestens 18 Jahre alt sein, um dich zu registrieren',
      );
    }
    try {
      await this.userService.createUser(
        body.firstName,
        body.lastName,
        body.email,
        body.password,
        body.birthday,
      );
      return new OkDTO(true, 'User was created');
    } catch (err) {
      throw new BadRequestException('E-Mail gibt es schon');
    }
  }
}

function isUserAdult(birthday: Date): boolean {
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // Adjust age if the birth month hasn't been reached yet this year
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= 18;
}
