import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TripDB } from '../database/TripDB';
import { ReviewDB } from '../database/ReviewDB';
import { DriveDB } from '../database/DriveDB';
import { UserDB } from '../database/UserDB';
import { OfferTripDB } from '../database/OfferTripDB';
import { RequestTripDB } from '../database/RequestTripDB';
import { CreateReviewDTO } from './DTO/CreateReviewDTO';
import { BadRequestException } from '@nestjs/common';
import { StatusEnum } from '../database/enums/StatusEnum';

describe('ReviewService', () => {
  let service: ReviewService;
  let tripRepository: Repository<TripDB>;
  let reviewRepository: Repository<ReviewDB>;
  let driveRepository: Repository<DriveDB>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: getRepositoryToken(TripDB),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ReviewDB),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(DriveDB),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
    tripRepository = module.get<Repository<TripDB>>(getRepositoryToken(TripDB));
    reviewRepository = module.get<Repository<ReviewDB>>(
      getRepositoryToken(ReviewDB),
    );
    driveRepository = module.get<Repository<DriveDB>>(
      getRepositoryToken(DriveDB),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
