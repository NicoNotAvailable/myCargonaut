import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriveDB, OfferDB, RequestDB } from '../database/DriveDB';

@Injectable()
export class DriveService {
  constructor(
    @InjectRepository(DriveDB)
    private driveRepository: Repository<DriveDB>,
    @InjectRepository(OfferDB)
    private offerRepository: Repository<OfferDB>,
    @InjectRepository(RequestDB)
    private requestRepository: Repository<RequestDB>,
  ) {}


}
