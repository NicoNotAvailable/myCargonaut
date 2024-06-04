import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  Session,
  BadRequestException,
  UseGuards,
  Get,
  Injectable,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDB } from '../database/UserDB';
import { databaseTest } from '../../testDatabase/databaseTest';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionData } from 'express-session';
import { OkDTO } from '../serverDTO/OkDTO';
import { LoginDTO } from './DTO/LoginDTO';
import { IsLoggedInGuard } from './is-logged-in.guard';

@ApiTags('session')
@Controller('session')
@Injectable()
export class SessionController {
  constructor(
    @InjectRepository(UserDB)
    private userRepo: Repository<UserDB>,
  ) {}

  /*
   *checks if the active is logged in
   *@Return okdto, true if the user is logged in, false if not
   */

  @ApiResponse({
    type: OkDTO,
    description: 'checks if the user is logged in and returns a boolean',
  })
  @Get('checkLogin')
  checkLogin(@Session() session: SessionData): OkDTO {
    if (session.currentUser === undefined) {
      return new OkDTO(false, 'No user is currently logged in');
    } else {
      return new OkDTO(true, 'User was logged in');
    }
  }

  /*
   * sets the user, that logged in via the corresponding Login-Formular as the currentUser in the session
   * @Pre user has already a registered account
   * @Param username: the unique username that has been set when registering
   * @Param password: the password that matches with the password of the unique username in the Database
   * @Return LoginUserDTO which combines the important attributes when logging in an user
   * @Error if the password or email is empty
   * @Error if the password and username do not match
   */
  @ApiResponse({
    type: OkDTO,
    description:
      'logs in the user and pushes the important data in the session',
  })
  @Post('login')
  async loginUser(
    @Session() session: SessionData,
    @Body() body: LoginDTO,
  ): Promise<OkDTO> {
    if (body.password === '' || body.email === '') {
      throw new BadRequestException('Felder müssen ausgefüllt sein');
    }
    const loggedUser: UserDB = await this.userRepo.findOne({
      where: { email: body.email, password: body.password },
    });
    if (loggedUser) {
      session.currentUser = loggedUser.id;
    } else {
      throw new UnauthorizedException('Passwort oder Email ist falsch');
    }
    return new OkDTO(true, 'User was logged in');
  }

  /*
   * removes the currentUser from the session, cleares the session
   * @Pre the user is currently set as the active user
   * @Return okdto true if an user was successfully logged out
   * @Error if the user is not logged in
   */
  @ApiResponse({
    type: OkDTO,
    description: 'logs out the user and deletes the session data',
  })
  @Post('logout')
  @UseGuards(IsLoggedInGuard)
  logout(@Session() session: SessionData): OkDTO {
    if (session.currentUser !== undefined) {
      session.currentUser = undefined;
      return new OkDTO(true, 'user successfully logged out');
    } else {
      throw new BadRequestException();
    }
  }

  /*
   * gets the id of the user that is currently active and set in the session
   * @Return undefined if no user is logged in
   * @Return the id of the currentUser
   */
  @ApiResponse({ description: 'fetches the currently logged in users ID' })
  @Get('getSessionUser')
  @UseGuards(IsLoggedInGuard)
  getSessionUser(@Session() session: SessionData): number | undefined {
    return session.currentUser;
  }
}
