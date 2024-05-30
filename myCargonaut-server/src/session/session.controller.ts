import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDB } from '../database/UserDB';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Session, SessionData } from 'express-session';
import { LoginUserDTO } from './DTO/LoginUserDTO';
import { OkDTO } from '../serverDTO/OkDTO';

@ApiTags('session')
@Controller('session')
export class SessionController {
  constructor(
    @InjectRepository(UserDB)
    private readonly userRepo: Repository<UserDB>,
  ) {} /*
  @Post('login')
  async loginUser(
    @Session() session: SessionData,
    @Body body: LoginUserDTO,
  ): Promise<OkDTO> {
    if (body.password === '' || body.email === '') {
      throw new UnauthorizedException();
    }
    const loggedUser: LoginUserDTO = await this.userRepo.findOneBy({
      email: body.email,
      password: body.password,
    });
  }*/
}
