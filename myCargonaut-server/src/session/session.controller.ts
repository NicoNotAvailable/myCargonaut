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
