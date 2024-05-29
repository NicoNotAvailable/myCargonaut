import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDB } from '../database/UserDB';
import { DataSource, Repository } from 'typeorm';

@ApiTags('session')
@Controller('session')
export class SessionController {
  private readonly userRepo: Repository<UserDB>;

  constructor(private userSource: DataSource) {
    this.userRepo = userSource.getRepository(UserDB);
  }
}
