import { Test, TestingModule } from '@nestjs/testing';
import { DriveService } from './drive.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriveDB, OfferDB, RequestDB } from '../database/DriveDB';
import { UserDB } from '../database/UserDB';
import { CarDB } from '../database/CarDB';
import { TrailerDB } from '../database/TrailerDB';
import { CargoDB } from '../database/CargoDB';
import { LocationDB } from '../database/LocationDB';
import {
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { CreateOfferDTO } from './DTO/CreateOfferDTO';
import { StatusEnum } from '../database/enums/StatusEnum';
import { CreateLocationDTO } from '../location/DTO/CreateLocationDTO';
import { ReviewService } from '../review/review.service';

describe('DriveService', () => {
  let service: DriveService;
  let driveRepository: Repository<DriveDB>;
  let offerRepository: Repository<OfferDB>;
  let requestRepository: Repository<RequestDB>;
  let cargoRepository: Repository<CargoDB>;
  let locationRepository: Repository<LocationDB>;
  let reviewService: ReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DriveService,
        {
          provide: getRepositoryToken(DriveDB),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(OfferDB),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(RequestDB),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CargoDB),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(LocationDB),
          useClass: Repository,
        },
        {
          provide: ReviewService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<DriveService>(DriveService);
    driveRepository = module.get<Repository<DriveDB>>(
      getRepositoryToken(DriveDB),
    );
    offerRepository = module.get<Repository<OfferDB>>(
      getRepositoryToken(OfferDB),
    );
    requestRepository = module.get<Repository<RequestDB>>(
      getRepositoryToken(RequestDB),
    );
    cargoRepository = module.get<Repository<CargoDB>>(
      getRepositoryToken(CargoDB),
    );
    locationRepository = module.get<Repository<LocationDB>>(
      getRepositoryToken(LocationDB),
    );
    reviewService = module.get<ReviewService>(ReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOffer', () => {
    it('should create an offer successfully', async () => {
      const user = new UserDB();
      user.id = 1;
      const car = new CarDB();
      const trailer = new TrailerDB();
      const createOfferDto: CreateOfferDTO = {
        name: 'Test Offer',
        date: new Date(),
        price: 100,
        seats: 4,
        animalsAllowed: true,
        smokingAllowed: false,
        info: 2,
        priceType: 1,
        maxCWeight: 1000,
        maxCWidth: 2,
        maxCHeight: 3,
        maxCLength: 4,
        maxTWeight: 500,
        maxTWidth: 2,
        maxTLength: 4,
        carID: car.id,
        location: [
          { city: 'City1', stopNr: 1 } as CreateLocationDTO,
          { city: 'City2', stopNr: 2 } as CreateLocationDTO,
        ],
      };

      jest.spyOn(offerRepository, 'create').mockReturnValue({} as OfferDB);
      jest.spyOn(offerRepository, 'save').mockResolvedValue({} as OfferDB);
      jest
        .spyOn(locationRepository, 'create')
        .mockReturnValue({} as LocationDB);
      jest.spyOn(locationRepository, 'insert').mockResolvedValue(undefined);

      const result = await service.createOffer(
        user,
        car,
        trailer,
        createOfferDto,
      );

      expect(result).toBeDefined();
      expect(offerRepository.save).toHaveBeenCalled();
      expect(locationRepository.insert).toHaveBeenCalledTimes(2);
    });
  });

  describe('getOfferById', () => {
    it('should return an offer by ID', async () => {
      const offer = new OfferDB();
      offer.id = 1;
      jest.spyOn(offerRepository, 'findOne').mockResolvedValue(offer);

      const result = await service.getOfferById(1);

      expect(result).toBe(offer);
    });

    it('should throw NotFoundException if offer not found', async () => {
      jest.spyOn(offerRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getOfferById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateOffer', () => {
    it('should update an offer successfully', async () => {
      const offer = new OfferDB();
      offer.id = 1;
      offer.user = { id: 1 } as UserDB;

      const updateData: CreateOfferDTO = {
        name: 'Updated Offer',
        date: new Date(),
        price: 200,
        seats: 4,
        animalsAllowed: true,
        smokingAllowed: false,
        info: 1,
        priceType: 2,
        maxCWeight: 1500,
        maxCWidth: 2,
        maxCHeight: 3,
        maxCLength: 4,
        maxTWeight: 500,
        maxTWidth: 2,
        maxTLength: 4,
        location: [],
        carID: 1,
      };

      jest.spyOn(offerRepository, 'findOne').mockResolvedValue(offer);
      jest.spyOn(offerRepository, 'save').mockResolvedValue(offer);

      const result = await service.updateOffer(1, 1, updateData);

      expect(result).toBe(offer);
      expect(offerRepository.save).toHaveBeenCalledWith(offer);
    });

    it('should throw UnauthorizedException if user is not the owner', async () => {
      const offer = new OfferDB();
      offer.id = 1;
      offer.user = { id: 2 } as UserDB;

      jest.spyOn(offerRepository, 'findOne').mockResolvedValue(offer);

      await expect(
        service.updateOffer(1, 1, {} as CreateOfferDTO),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw NotFoundException if offer not found', async () => {
      jest.spyOn(offerRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateOffer(1, 1, {} as CreateOfferDTO),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteDrive', () => {
    it('should delete a drive successfully', async () => {
      const drive = new DriveDB();
      drive.id = 1;
      drive.user = { id: 1 } as UserDB;
      drive.status = StatusEnum.created;

      jest.spyOn(driveRepository, 'findOne').mockResolvedValue(drive);
      jest.spyOn(driveRepository, 'remove').mockResolvedValue({} as DriveDB);

      await service.deleteDrive(1, 1);

      expect(driveRepository.remove).toHaveBeenCalledWith(drive);
    });

    it('should throw BadRequestException if drive is not in created status', async () => {
      const drive = new DriveDB();
      drive.id = 1;
      drive.user = { id: 1 } as UserDB;
      drive.status = StatusEnum.finished;

      jest.spyOn(driveRepository, 'findOne').mockResolvedValue(drive);

      await expect(service.deleteDrive(1, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw UnauthorizedException if user is not the owner', async () => {
      const drive = new DriveDB();
      drive.id = 1;
      drive.user = { id: 2 } as UserDB;

      jest.spyOn(driveRepository, 'findOne').mockResolvedValue(drive);

      await expect(service.deleteDrive(1, 1)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw NotFoundException if drive not found', async () => {
      jest.spyOn(driveRepository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteDrive(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
