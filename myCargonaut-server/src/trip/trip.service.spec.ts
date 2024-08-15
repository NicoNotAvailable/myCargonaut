import { Test, TestingModule } from '@nestjs/testing';
import { TripService } from './trip.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripDB } from '../database/TripDB';
import { OfferTripDB } from '../database/OfferTripDB';
import { RequestTripDB } from '../database/RequestTripDB';
import { CargoDB } from '../database/CargoDB';
import { DriveDB } from '../database/DriveDB';

describe('TripService', () => {
  let service: TripService;

  // Mock repository objects
  const mockTripRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };

  const mockOfferTripRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockRequestTripRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockCargoRepository = {
    create: jest.fn(),
    insert: jest.fn(),
  };

  const mockDriveRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripService,
        { provide: getRepositoryToken(TripDB), useValue: mockTripRepository },
        {
          provide: getRepositoryToken(OfferTripDB),
          useValue: mockOfferTripRepository,
        },
        {
          provide: getRepositoryToken(RequestTripDB),
          useValue: mockRequestTripRepository,
        },
        { provide: getRepositoryToken(CargoDB), useValue: mockCargoRepository },
        { provide: getRepositoryToken(DriveDB), useValue: mockDriveRepository },
      ],
    }).compile();

    service = module.get<TripService>(TripService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
