import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  Session,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDB } from '../database/UserDB';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionData } from 'express-session';
import { LoginUserDTO } from './DTO/LoginUserDTO';
import { OkDTO } from '../serverDTO/OkDTO';
import { LoginDTO } from './DTO/LoginDTO';

@ApiTags('session')
@Controller('session')
export class SessionController {
  constructor(
    @InjectRepository(UserDB)
    private readonly userRepo: Repository<UserDB>,
  ) {}

  /*
   * sets the user, that logged in via the corresponding Login-Formular as the currentUser in the session
   * @Pre user has already a registered account
   * @Param username: the unique username that has been set when registering
   * @Param password: the password that matches with the password of the unique username in the Database
   * @Return LoginUserDTO which combines the important attributes when logging in an user
   * @Error if the password or email is empty
   * @Error if the password and username do not match
   */
  @Post('login')
  async loginUser(
    @Session() session: SessionData,
    @Body() body: LoginDTO,
  ): Promise<OkDTO> {
    if (body.password === '' || body.email === '') {
      throw new UnauthorizedException('Felder müssen ausgefüllt sein');
    }
    const loggedUser: LoginUserDTO = await this.userRepo.findOneBy({
      email: body.email,
      password: body.password,
    });
    if (loggedUser) {
      session.currentUser = loggedUser.id;
    } else {
      throw new UnauthorizedException('Passwort oder Email ist falsch');
    }
    return new OkDTO(true, 'User was logged in');
  }
}
