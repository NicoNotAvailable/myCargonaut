import { Test, TestingModule } from '@nestjs/testing';
import { DriveController } from './drive.controller';
import { DriveService } from '../drive/drive.service';
import { UserService } from '../user/user.service';
import { VehicleService } from '../vehicle/vehicle.service';
import { UtilsService } from '../utils/utils.service';
import { SessionData } from 'express-session';
import { UserDB } from '../database/UserDB';
import { OkDTO } from '../serverDTO/OkDTO';
import { CreateOfferDTO } from './DTO/CreateOfferDTO';
import { TripInfoEnum } from '../database/enums/TripInfoEnum';
import { PriceTypeEnum } from '../database/enums/PriceTypeEnum';
import { BadRequestException } from '@nestjs/common';

// Mock session data with cookie properties
const mockSession: Partial<SessionData> = {
  currentUser: 1,
  cookie: {
    originalMaxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  },
};

// Mock implementations
const mockDriveService = {};
const mockUserService = {};
const mockVehicleService = {};
const mockUtilsService = {};

// Define mock request and response objects
jest.fn();
describe('DriveController', () => {
  let controller: DriveController;
  let service: DriveService;
  let userService: UserService;
  let vehicleService: VehicleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriveController],
      providers: [
        {
          provide: DriveService,
          useValue: {
            mockDriveService,
            createOffer: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            mockUserService,
            getUserById: jest.fn(),
          },
        },
        {
          provide: VehicleService,
          useValue: {
            mockVehicleService,
            getCarById: jest.fn(),
            getTrailerById: jest.fn(),
          },
        },
        {
          provide: UtilsService,
          useValue: mockUtilsService,
        },
      ],
    }).compile();

    controller = module.get<DriveController>(DriveController);
    service = module.get<DriveService>(DriveService);
    userService = module.get<UserService>(UserService);
    vehicleService = module.get<VehicleService>(VehicleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOffer', () => {
    it('should create a offer with trailer successfully', async () => {
      const body = {
        name: 'Fahrt in meinem Tesla mit Anhänger',
        carID: 1,
        trailerID: 2,
        date: new Date('2024-12-13T18:12:02.549Z'),
        price: 23,
        seats: 3,
        animalsAllowed: true,
        smokingAllowed: false,
        info: 1,
        maxCWeight: 234,
        maxCLength: 200,
        maxCHeight: 43,
        maxCWidth: 142,
        maxTLength: 400,
        maxTWeight: 500,
        maxTHeight: 200,
        maxTWidth: 53,
        priceType: 2,
        location: [
          {
            stopNr: 1,
            country: 'Gondor',
            zipCode: 973162,
            city: 'Minas Tirith',
          },
          {
            stopNr: 100,
            country: 'Mordor',
            zipCode: 12345,
            city: 'Schicksalsberg',
          },
        ],
      };

      const mockUser = {
        id: 1,
        profilePic: 'userpic.png',
        phoneNumber: '123456789',
      } as any;
      const mockCar = { id: 1 } as any;
      const mockTrailer = { id: 2 } as any;

      // Mock the service methods
      jest.spyOn(userService, 'getUserById').mockResolvedValue(mockUser);
      jest.spyOn(vehicleService, 'getCarById').mockResolvedValue(mockCar);
      jest
        .spyOn(vehicleService, 'getTrailerById')
        .mockResolvedValue(mockTrailer);
      jest.spyOn(service, 'createOffer').mockResolvedValue(undefined);

      const result = await controller.createOffer(
        body,
        mockSession as SessionData,
      );

      expect(result).toEqual(new OkDTO(true, 'Offer was created'));
      expect(userService.getUserById).toHaveBeenCalledWith(
        mockSession.currentUser,
      );
      expect(vehicleService.getCarById).toHaveBeenCalledWith(body.carID);
      expect(vehicleService.getTrailerById).toHaveBeenCalledWith(
        body.trailerID,
      );
      expect(service.createOffer).toHaveBeenCalledWith(
        mockUser,
        mockCar,
        mockTrailer,
        body,
      );
    });

    it('should throw an error if the car is not found', async () => {
      const body: CreateOfferDTO = {
        name: 'Fahrt in meinem Tesla',
        carID: 999, // Invalid ID to simulate not found
        date: new Date('2024-12-13T18:12:02.549Z'),
        price: 23,
        seats: 3,
        animalsAllowed: true,
        smokingAllowed: false,
        info: TripInfoEnum.music,
        maxCWeight: 234,
        maxCLength: 200,
        maxCHeight: 43,
        maxCWidth: 142,
        priceType: PriceTypeEnum.perTrip,
        location: [
          {
            stopNr: 1,
            country: 'Gondor',
            zipCode: 973162,
            city: 'Minas Tirith',
          },
          {
            stopNr: 100,
            country: 'Mordor',
            zipCode: 12345,
            city: 'Schicksalsberg',
          },
        ],
      };

      const mockUser = {
        id: 1,
        profilePic: 'userpic.png',
        phoneNumber: '123456789',
      } as any;

      jest.spyOn(userService, 'getUserById').mockResolvedValue(mockUser);
      jest.spyOn(vehicleService, 'getCarById').mockResolvedValue(null); // Simulate car not found

      await expect(
        controller.createOffer(body, mockSession as SessionData),
      ).rejects.toThrow(new BadRequestException('Car was not found'));
    });
  });
});
