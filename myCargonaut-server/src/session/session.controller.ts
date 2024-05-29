import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDB } from '../database/UserDB';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@ApiTags('session')
@Controller('session')
export class SessionController {
  constructor(
    @InjectRepository(UserDB)
    private readonly userRepo: Repository<UserDB>,
  ) {}
}
