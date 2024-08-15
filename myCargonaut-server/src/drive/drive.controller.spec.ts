import { Test, TestingModule } from '@nestjs/testing';
import { DriveController } from './drive.controller';
import { DriveService } from '../drive/drive.service';
import { UserService } from '../user/user.service';
import { VehicleService } from '../vehicle/vehicle.service';
import { UtilsService } from '../utils/utils.service';
import { SessionData } from 'express-session';
import { OkDTO } from '../serverDTO/OkDTO';
import { CreateOfferDTO } from './DTO/CreateOfferDTO';
import { TripInfoEnum } from '../database/enums/TripInfoEnum';
import { PriceTypeEnum } from '../database/enums/PriceTypeEnum';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { GetOfferDTO } from './DTO/GetOfferDTO';
import { ChangeStatusDTO } from './DTO/ChangeStatusDTO';
import { GetRequestDTO } from './DTO/GetRequestDTO';

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
  let utilsService: UtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriveController],
      providers: [
        {
          provide: DriveService,
          useValue: {
            mockDriveService,
            createOffer: jest.fn(),
            createRequest: jest.fn(),
            getAllOffers: jest.fn(),
            getOwnOffers: jest.fn(),
            getOfferById: jest.fn(),
            getAllRequests: jest.fn(),
            getOwnRequests: jest.fn(),
            getRequestById: jest.fn(),
            updateOffer: jest.fn(),
            updateRequest: jest.fn(),
            updateStatus: jest.fn(),
            deleteDrive: jest.fn(),
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
          useValue: {
            mockUtilsService,
            transformUserToGetOtherUserDTO: jest.fn(),
            transformOfferDBtoGetOfferDTO: jest.fn(),
            transformRequestDBtoGetRequestDTO: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DriveController>(DriveController);
    service = module.get<DriveService>(DriveService);
    userService = module.get<UserService>(UserService);
    vehicleService = module.get<VehicleService>(VehicleService);
    utilsService = module.get<UtilsService>(UtilsService);
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

    it('should create a offer without trailer successfully', async () => {
      const body = {
        name: 'Fahrt in meinem Tesla mit Anhänger',
        carID: 1,
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

      // Mock the service methods
      jest.spyOn(userService, 'getUserById').mockResolvedValue(mockUser);
      jest.spyOn(vehicleService, 'getCarById').mockResolvedValue(mockCar);
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
      expect(service.createOffer).toHaveBeenCalledWith(
        mockUser,
        mockCar,
        null,
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
      jest.spyOn(vehicleService, 'getCarById').mockResolvedValue(null);

      await expect(
        controller.createOffer(body, mockSession as SessionData),
      ).rejects.toThrow(new BadRequestException('Car was not found'));
    });

    it('should throw an error if carLength > 1000 and carWidth > 1000', async () => {
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
        maxCLength: 1200, // CarLength is > 1000
        maxCHeight: 43,
        maxCWidth: 1142, // CarWidth is > 1000
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

      await expect(
        controller.createOffer(body, mockSession as SessionData),
      ).rejects.toThrow(
        new BadRequestException(
          'Max car length must be between 1 and 1000, ' +
            'Max car width must be between 1 and 1000',
        ),
      );

      expect(userService.getUserById).toHaveBeenCalledWith(
        mockSession.currentUser,
      );
      expect(vehicleService.getCarById).toHaveBeenCalledWith(body.carID);
      expect(vehicleService.getTrailerById).toHaveBeenCalledWith(
        body.trailerID,
      );
    });
  });

  describe('createRequest', () => {
    it('should create a request successfully', async () => {
      const body = {
        date: new Date('2024-12-13T18:12:02.549Z'),
        name: 'Fahr mich bitte nach Gießen <3',
        price: 42,
        seats: 3,
        info: 3,
        smokingAllowed: true,
        animalsAllowed: false,
        cargo: [
          {
            description: 'Mein fettes Klavier',
            weight: 300,
            length: 232,
            height: 123,
            width: 65,
          },
        ],
        location: [
          {
            stopNr: 1,
            country: 'Gondor',
            zipCode: 973162,
            city: 'Minas Tirith',
          },
        ],
      };

      const mockUser = {
        id: 1,
        profilePic: 'userpic.png',
        phoneNumber: '123456789',
      } as any;

      // Mock the service methods
      jest.spyOn(userService, 'getUserById').mockResolvedValue(mockUser);
      jest.spyOn(service, 'createRequest').mockResolvedValue(undefined);

      const result = await controller.createRequest(
        body,
        mockSession as SessionData,
      );

      expect(result).toEqual(new OkDTO(true, 'Request was created'));
      expect(userService.getUserById).toHaveBeenCalledWith(
        mockSession.currentUser,
      );

      expect(service.createRequest).toHaveBeenCalledWith(mockUser, body);
    });

    it('should fail if cargoWeight > 1000, additionally cargoHeight > 1000', async () => {
      const body = {
        date: new Date('2024-12-13T18:12:02.549Z'),
        name: 'Fahr mich bitte nach Gießen <3',
        price: 42,
        seats: 3,
        info: 3,
        smokingAllowed: true,
        animalsAllowed: false,
        cargo: [
          {
            description: 'Mein fettes Klavier',
            weight: 1300, // cargo weight is > 1000
            length: 232,
            height: 1123, // cargo height is > 1000
            width: 65,
          },
        ],
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

      // Mock the service methods
      jest.spyOn(userService, 'getUserById').mockResolvedValue(mockUser);
      jest.spyOn(service, 'createRequest').mockResolvedValue(undefined);

      await expect(
        controller.createRequest(body, mockSession as SessionData),
      ).rejects.toThrow(BadRequestException);

      expect(userService.getUserById).toHaveBeenCalledWith(
        mockSession.currentUser,
      );
      expect(service.createRequest).not.toHaveBeenCalled();
    });
  });

  describe('getAllOffers', () => {});

  describe('getOwnOffers', () => {
    it('should retrieve and transform own offers successfully', async () => {
      const mockUser = { id: 1 } as any;
      const mockOffers = [
        {
          id: 1,
          user: { id: 1 },
          car: { id: 1, carPicture: 'carpic.png' },
          name: 'Offer 1',
          date: new Date('2024-12-13T18:12:02.549Z'),
          price: 100,
          seats: 4,
          animalsAllowed: true,
          smokingAllowed: false,
          status: 'active',
          info: 'Info 1',
          maxCWeight: 500,
          maxCLength: 300,
          maxCHeight: 150,
          maxCWidth: 200,
          trailer: { id: 1 },
          maxTLength: 300,
          maxTWeight: 500,
          maxTHeight: 150,
          maxTWidth: 200,
          priceType: 'fixed',
          location: [
            {
              stopNr: 1,
              country: 'Gondor',
              city: 'Minas Tirith',
              zipCode: '12345',
            },
            {
              stopNr: 100,
              country: 'Mordor',
              zipCode: 12345,
              city: 'Schicksalsberg',
            },
          ],
        },
      ] as any;
      const transformedOffers = [
        {
          id: 1,
          user: {
            id: 1,
            username: 'testuser',
            profilePic: 'userpic.png',
            firstName: 'John',
            lastName: 'Doe',
            languages: 'German',
            profileText: "Just testin'",
            isSmoker: true,
            rating: 4.5,
            birthyear: 2002,
          },
          carID: 1,
          carPicture: 'carpic.png',
          name: 'Offer 1',
          date: new Date('2024-12-13T18:12:02.549Z'),
          price: 100,
          seats: 4,
          animalsAllowed: true,
          smokingAllowed: false,
          status: 'active',
          info: 'Info 1',
          maxCWeight: 500,
          maxCLength: 300,
          maxCHeight: 150,
          maxCWidth: 200,
          trailerID: 1,
          maxTLength: 300,
          maxTWeight: 500,
          maxTHeight: 150,
          maxTWidth: 200,
          priceType: 'fixed',
          locations: [
            {
              stopNr: 1,
              country: 'Gondor',
              city: 'Minas Tirith',
              zipCode: '12345',
            },
            {
              stopNr: 100,
              country: 'Mordor',
              zipCode: 12345,
              city: 'Schicksalsberg',
            },
          ],
        },
      ];

      // Mock-Implementations
      jest.spyOn(service, 'getOwnOffers').mockResolvedValue(mockOffers);
      jest
        .spyOn(utilsService, 'transformOfferDBtoGetOfferDTO')
        .mockImplementation(async (offer) => {
          return {
            id: offer.id,
            user: {
              id: 1,
              username: 'testuser',
              profilePic: 'userpic.png',
              firstName: 'John',
              lastName: 'Doe',
              languages: 'German',
              profileText: "Just testin'",
              isSmoker: true,
              rating: 4.5,
              birthyear: 2002,
            },
            carID: offer.car.id,
            carPicture: offer.car.carPicture,
            name: offer.name,
            date: offer.date,
            price: offer.price,
            seats: offer.seats,
            animalsAllowed: offer.animalsAllowed,
            smokingAllowed: offer.smokingAllowed,
            status: offer.status,
            info: offer.info,
            maxCWeight: offer.maxCWeight,
            maxCLength: offer.maxCLength,
            maxCHeight: offer.maxCHeight,
            maxCWidth: offer.maxCWidth,
            trailerID: offer.trailer ? offer.trailer.id : undefined,
            maxTLength: offer.maxTLength,
            maxTWeight: offer.maxTWeight,
            maxTHeight: offer.maxTHeight,
            maxTWidth: offer.maxTWidth,
            priceType: offer.priceType,
            locations: (await offer.location).map((loc) => ({
              stopNr: loc.stopNr,
              country: loc.country,
              city: loc.city,
              zipCode: loc.zipCode,
            })),
          } as GetOfferDTO;
        });

      const result = await controller.getOwnOffers({
        currentUser: mockUser,
      } as any);

      expect(service.getOwnOffers).toHaveBeenCalledWith(mockUser);
      expect(utilsService.transformOfferDBtoGetOfferDTO).toHaveBeenCalledTimes(
        1,
      );

      expect(result).toEqual(transformedOffers);
    });

    it('should throw a BadRequestException if an error occurs', async () => {
      // Mock-Fehler
      jest
        .spyOn(service, 'getOwnOffers')
        .mockRejectedValue(new NotFoundException('Offer not found'));

      await expect(
        controller.getOwnOffers({ currentUser: { id: 1 } } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getOfferByID', () => {
    it('should retrieve and transform specific offer successfully', async () => {
      const mockOfferId: number = 1;
      const mockOffer = {
        id: 1,
        user: {
          id: 1,
          profilePic: 'userpic.png',
          firstName: 'John',
          lastName: 'Doe',
          languages: 'German',
          profileText: "Just testin'",
          isSmoker: true,
          rating: 4.5,
          birthyear: 2002,
        },
        car: { id: 1, carPicture: 'carpic.png' },
        name: 'Offer 1',
        date: new Date('2024-12-13T18:12:02.549Z'),
        price: 100,
        seats: 4,
        animalsAllowed: true,
        smokingAllowed: false,
        status: 'active',
        info: 'Info 1',
        maxCWeight: 500,
        maxCLength: 300,
        maxCHeight: 150,
        maxCWidth: 200,
        trailer: { id: 1 },
        maxTLength: 300,
        maxTWeight: 500,
        maxTHeight: 150,
        maxTWidth: 200,
        priceType: 1,
        location: [
          {
            stopNr: 1,
            country: 'Gondor',
            city: 'Minas Tirith',
            zipCode: '12345',
          },
          {
            stopNr: 100,
            country: 'Mordor',
            zipCode: 12345,
            city: 'Schicksalsberg',
          },
        ],
      } as any;
      const transformedOffer = {
        id: 1,
        user: {
          id: 1,
          username: 'testuser',
          profilePic: 'userpic.png',
          firstName: 'John',
          lastName: 'Doe',
          languages: 'German',
          profileText: "Just testin'",
          isSmoker: true,
          rating: 4.5,
          birthyear: 2002,
        },
        carID: 1,
        carPicture: 'carpic.png',
        name: 'Offer 1',
        date: new Date('2024-12-13T18:12:02.549Z'),
        price: 100,
        seats: 4,
        animalsAllowed: true,
        smokingAllowed: false,
        status: 'active',
        info: 'Info 1',
        maxCWeight: 500,
        maxCLength: 300,
        maxCHeight: 150,
        maxCWidth: 200,
        trailerID: 1,
        maxTLength: 300,
        maxTWeight: 500,
        maxTHeight: 150,
        maxTWidth: 200,
        priceType: 1,
        locations: [
          {
            stopNr: 1,
            country: 'Gondor',
            city: 'Minas Tirith',
            zipCode: '12345',
          },
          {
            stopNr: 100,
            country: 'Mordor',
            zipCode: 12345,
            city: 'Schicksalsberg',
          },
        ],
      };

      // Mock-Implementations
      jest.spyOn(service, 'getOfferById').mockResolvedValue(mockOffer);
      jest
        .spyOn(utilsService, 'transformOfferDBtoGetOfferDTO')
        .mockImplementation(async (offer) => {
          return {
            id: offer.id,
            user: {
              id: 1,
              username: 'testuser',
              profilePic: 'userpic.png',
              firstName: 'John',
              lastName: 'Doe',
              languages: 'German',
              profileText: "Just testin'",
              isSmoker: true,
              rating: 4.5,
              birthyear: 2002,
            },
            carID: offer.car?.id,
            carPicture: offer.car?.carPicture,
            name: offer.name,
            date: offer.date,
            price: offer.price,
            seats: offer.seats,
            animalsAllowed: offer.animalsAllowed,
            smokingAllowed: offer.smokingAllowed,
            status: offer.status,
            info: offer.info,
            maxCWeight: offer.maxCWeight,
            maxCLength: offer.maxCLength,
            maxCHeight: offer.maxCHeight,
            maxCWidth: offer.maxCWidth,
            trailerID: offer.trailer ? offer.trailer.id : undefined,
            maxTLength: offer.maxTLength,
            maxTWeight: offer.maxTWeight,
            maxTHeight: offer.maxTHeight,
            maxTWidth: offer.maxTWidth,
            priceType: offer.priceType,
            locations: ((await offer.location) || []).map((loc) => ({
              stopNr: loc.stopNr,
              country: loc.country,
              city: loc.city,
              zipCode: loc.zipCode,
            })),
          } as GetOfferDTO;
        });

      const result = await controller.getOfferByID(mockOfferId);

      expect(service.getOfferById).toHaveBeenCalledWith(mockOfferId);
      expect(utilsService.transformOfferDBtoGetOfferDTO).toHaveBeenCalledWith(
        mockOffer,
      );
      expect(result).toEqual(transformedOffer);
    });

    it('should throw BadRequestsException when offer is not found', async () => {
      jest
        .spyOn(service, 'getOfferById')
        .mockRejectedValue(new NotFoundException('Offer not found'));

      await expect(controller.getOfferByID(1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when an error occurs', async () => {
      jest
        .spyOn(service, 'getOfferById')
        .mockRejectedValue(new Error('Some error'));

      await expect(controller.getOfferByID(1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getAllRequests', () => {});

  describe('getOwnRequests', () => {
    it('should retrieve and transform own requests successfully', async () => {
      const mockUser = { id: 1 } as any;
      const mockRequests = [
        {
          id: 1,
          user: { id: 1 },
          name: 'Request 1',
          date: new Date('2024-12-13T18:12:02.549Z'),
          price: 100,
          seats: 4,
          animalsAllowed: true,
          smokingAllowed: false,
          status: 'active',
          info: 'Info 1',
          priceType: 'fixed',
          location: [
            {
              stopNr: 1,
              country: 'Gondor',
              city: 'Minas Tirith',
              zipCode: '12345',
            },
            {
              stopNr: 100,
              country: 'Mordor',
              zipCode: 12345,
              city: 'Schicksalsberg',
            },
          ],
          cargo: [
            {
              description: 'Mein fettes Klavier',
              weight: 300,
              length: 232,
              height: 123,
              width: 65,
            },
          ],
        },
      ] as any;

      const transformedRequests = [
        {
          id: 1,
          user: {
            id: 1,
            profilePic: 'userpic.png',
            firstName: 'John',
            lastName: 'Doe',
            languages: 'German',
            profileText: "Just testin'",
            isSmoker: true,
            rating: 4.5,
            birthyear: 2002,
          },
          name: 'Request 1',
          date: new Date('2024-12-13T18:12:02.549Z'),
          price: 100,
          seats: 4,
          animalsAllowed: true,
          smokingAllowed: false,
          status: 'active',
          info: 'Info 1',
          locations: [
            {
              stopNr: 1,
              country: 'Gondor',
              city: 'Minas Tirith',
              zipCode: '12345',
            },
            {
              stopNr: 100,
              country: 'Mordor',
              zipCode: 12345,
              city: 'Schicksalsberg',
            },
          ],
          cargo: [
            {
              description: 'Mein fettes Klavier',
              weight: 300,
              length: 232,
              height: 123,
              width: 65,
            },
          ],
        },
      ];
      jest.spyOn(service, 'getOwnRequests').mockResolvedValue(mockRequests);
      jest
        .spyOn(utilsService, 'transformRequestDBtoGetRequestDTO')
        .mockImplementation(async (request) => {
          return {
            id: request.id,
            user: {
              id: 1,
              profilePic: 'userpic.png',
              firstName: 'John',
              lastName: 'Doe',
              languages: 'German',
              profileText: "Just testin'",
              isSmoker: true,
              rating: 4.5,
              birthyear: 2002,
            },
            name: request.name,
            date: request.date,
            price: request.price,
            seats: request.seats,
            animalsAllowed: request.animalsAllowed,
            smokingAllowed: request.smokingAllowed,
            status: request.status,
            info: request.info,
            locations: ((await request.location) || []).map((loc) => ({
              stopNr: loc.stopNr,
              country: loc.country,
              city: loc.city,
              zipCode: loc.zipCode,
            })),
            cargo: ((await request.cargo) || []).map((cargo) => ({
              description: cargo.description,
              weight: cargo.weight,
              length: cargo.length,
              height: cargo.height,
              width: cargo.width,
            })),
          } as GetRequestDTO;
        });

      const result = await controller.getOwnRequests({
        currentUser: mockUser,
      } as any);

      expect(service.getOwnRequests).toHaveBeenCalledWith(mockUser);
      expect(
        utilsService.transformRequestDBtoGetRequestDTO,
      ).toHaveBeenCalledTimes(1);

      expect(result).toEqual(transformedRequests);
    });

    it('should throw a BadRequestException if an error occurs', async () => {
      // Mock-Fehler
      jest
        .spyOn(service, 'getOwnRequests')
        .mockRejectedValue(new NotFoundException('Requests not found'));

      await expect(
        controller.getOwnRequests({ currentUser: { id: 1 } } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getRequestByID', () => {
    it('should retrieve and transform specific request successfully', async () => {
      const mockRequestId: number = 1;
      const mockRequest = {
        id: 1,
        user: { id: 1 },
        name: 'Request 1',
        date: new Date('2024-12-13T18:12:02.549Z'),
        price: 100,
        seats: 4,
        animalsAllowed: true,
        smokingAllowed: false,
        status: 'active',
        info: 'Info 1',
        priceType: 'fixed',
        location: [
          {
            stopNr: 1,
            country: 'Gondor',
            city: 'Minas Tirith',
            zipCode: '12345',
          },
          {
            stopNr: 100,
            country: 'Mordor',
            zipCode: 12345,
            city: 'Schicksalsberg',
          },
        ],
        cargo: [
          {
            description: 'Mein fettes Klavier',
            weight: 300,
            length: 232,
            height: 123,
            width: 65,
          },
        ],
      } as any;
      const transformedRequest = {
        id: 1,
        user: {
          id: 1,
          profilePic: 'userpic.png',
          firstName: 'John',
          lastName: 'Doe',
          languages: 'German',
          profileText: "Just testin'",
          isSmoker: true,
          rating: 4.5,
          birthyear: 2002,
        },
        name: 'Request 1',
        date: new Date('2024-12-13T18:12:02.549Z'),
        price: 100,
        seats: 4,
        animalsAllowed: true,
        smokingAllowed: false,
        status: 'active',
        info: 'Info 1',
        locations: [
          {
            stopNr: 1,
            country: 'Gondor',
            city: 'Minas Tirith',
            zipCode: '12345',
          },
          {
            stopNr: 100,
            country: 'Mordor',
            zipCode: 12345,
            city: 'Schicksalsberg',
          },
        ],
        cargo: [
          {
            description: 'Mein fettes Klavier',
            weight: 300,
            length: 232,
            height: 123,
            width: 65,
          },
        ],
      };

      jest.spyOn(service, 'getRequestById').mockResolvedValue(mockRequest);
      jest
        .spyOn(utilsService, 'transformRequestDBtoGetRequestDTO')
        .mockImplementation(async (request) => {
          return {
            id: request.id,
            user: {
              id: 1,
              profilePic: 'userpic.png',
              firstName: 'John',
              lastName: 'Doe',
              languages: 'German',
              profileText: "Just testin'",
              isSmoker: true,
              rating: 4.5,
              birthyear: 2002,
            },
            name: request.name,
            date: request.date,
            price: request.price,
            seats: request.seats,
            animalsAllowed: request.animalsAllowed,
            smokingAllowed: request.smokingAllowed,
            status: request.status,
            info: request.info,
            locations: ((await request.location) || []).map((loc) => ({
              stopNr: loc.stopNr,
              country: loc.country,
              city: loc.city,
              zipCode: loc.zipCode,
            })),
            cargo: ((await request.cargo) || []).map((cargo) => ({
              description: cargo.description,
              weight: cargo.weight,
              length: cargo.length,
              height: cargo.height,
              width: cargo.width,
            })),
          } as GetRequestDTO;
        });

      const result = await controller.getRequestByID(mockRequestId);

      expect(service.getRequestById).toHaveBeenCalledWith(mockRequestId);
      expect(
        utilsService.transformRequestDBtoGetRequestDTO,
      ).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(transformedRequest);
    });

    it('should throw BadRequestsException when offer is not found', async () => {
      jest
        .spyOn(service, 'getRequestById')
        .mockRejectedValue(new NotFoundException('Offer not found'));

      await expect(controller.getRequestByID(1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when an error occurs', async () => {
      jest
        .spyOn(service, 'getRequestById')
        .mockRejectedValue(new Error('Some error'));

      await expect(controller.getRequestByID(1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateOffer', () => {
    it('should update an offer successfully', async () => {
      const body = {
        name: 'Updated Offer',
        carID: 1,
        trailerID: 2,
        date: new Date('2024-12-13T18:12:02.549Z'),
        price: 42,
        seats: 3,
        animalsAllowed: true,
        smokingAllowed: false,
        info: 1,
        maxCWeight: 500,
        maxCLength: 300,
        maxCHeight: 150,
        maxCWidth: 200,
        maxTLength: 300,
        maxTWeight: 500,
        maxTHeight: 150,
        maxTWidth: 200,
        priceType: 1,
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

      const mockCar = { id: 1 } as any;
      const mockTrailer = { id: 2 } as any;

      // Mock the service methods
      jest.spyOn(vehicleService, 'getCarById').mockResolvedValue(mockCar);
      jest
        .spyOn(vehicleService, 'getTrailerById')
        .mockResolvedValue(mockTrailer);
      jest.spyOn(service, 'updateOffer').mockResolvedValue(undefined);

      const result = await controller.updateOffer(
        1,
        body,
        mockSession as SessionData,
      );

      expect(result).toEqual(new OkDTO(true, 'offer was updated'));
      expect(vehicleService.getCarById).toHaveBeenCalledWith(body.carID);
      expect(vehicleService.getTrailerById).toHaveBeenCalledWith(
        body.trailerID,
      );
      expect(service.updateOffer).toHaveBeenCalledWith(
        1,
        mockSession.currentUser,
        body,
      );
    });

    it('should throw BadRequestException if car not found', async () => {
      const body = {
        name: 'Updated Offer',
        carID: 1,
        trailerID: 2,
        date: new Date('2024-12-13T18:12:02.549Z'),
        price: 42,
        seats: 3,
        animalsAllowed: true,
        smokingAllowed: false,
        info: 1,
        maxCWeight: 500,
        maxCLength: 300,
        maxCHeight: 150,
        maxCWidth: 200,
        maxTLength: 300,
        maxTWeight: 500,
        maxTHeight: 150,
        maxTWidth: 200,
        priceType: 1,
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

      const mockSession = { currentUser: 1 } as SessionData;

      jest.spyOn(vehicleService, 'getCarById').mockResolvedValue(null);

      await expect(
        controller.updateOffer(1, body, mockSession),
      ).rejects.toThrow(new BadRequestException('Car was not found'));
    });

    it('should throw BadRequestException if trailer not found', async () => {
      const body = {
        name: 'Updated Offer',
        carID: 1,
        trailerID: 2,
        date: new Date('2024-12-13T18:12:02.549Z'),
        price: 42,
        seats: 3,
        animalsAllowed: true,
        smokingAllowed: false,
        info: 1,
        maxCWeight: 500,
        maxCLength: 300,
        maxCHeight: 150,
        maxCWidth: 200,
        maxTLength: 300,
        maxTWeight: 500,
        maxTHeight: 150,
        maxTWidth: 200,
        priceType: 1,
        location: [],
      };

      const mockCar = { id: 1 } as any;
      const mockSession = { currentUser: 1 } as SessionData;

      jest.spyOn(vehicleService, 'getCarById').mockResolvedValue(mockCar);
      jest.spyOn(vehicleService, 'getTrailerById').mockResolvedValue(null);
      await expect(
        controller.updateOffer(1, body, mockSession),
      ).rejects.toThrow(new BadRequestException('Trailer was not found'));
    });

    it('should throw an error if user is not creator of request', async () => {
      const body = {
        name: 'Updated Offer',
        carID: 1,
        trailerID: 2,
        date: new Date('2024-12-13T18:12:02.549Z'),
        price: 42,
        seats: 3,
        animalsAllowed: true,
        smokingAllowed: false,
        info: 1,
        maxCWeight: 500,
        maxCLength: 300,
        maxCHeight: 150,
        maxCWidth: 200,
        maxTLength: 300,
        maxTWeight: 500,
        maxTHeight: 150,
        maxTWidth: 200,
        priceType: 1,
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

      const mockCar = { id: 1 } as any;
      const mockTrailer = { id: 2 } as any;

      const mockSession = { currentUser: 3 } as SessionData;

      // Mock the service methods
      jest.spyOn(vehicleService, 'getCarById').mockResolvedValue(mockCar);
      jest
        .spyOn(vehicleService, 'getTrailerById')
        .mockResolvedValue(mockTrailer);
      jest
        .spyOn(service, 'updateOffer')
        .mockRejectedValue(
          new UnauthorizedException('You are not the owner of this offer'),
        );

      await expect(
        controller.updateOffer(1, body, mockSession),
      ).rejects.toThrow(
        new NotFoundException('You are not the owner of this offer'),
      );
    });

    it('should throw an error if driveService.updateOffer fails', async () => {
      const body = {
        name: 'Updated Offer',
        carID: 1,
        trailerID: 2,
        date: new Date('2024-12-13T18:12:02.549Z'),
        price: 42,
        seats: 3,
        animalsAllowed: true,
        smokingAllowed: false,
        info: 1,
        maxCWeight: 500,
        maxCLength: 300,
        maxCHeight: 150,
        maxCWidth: 200,
        maxTLength: 300,
        maxTWeight: 500,
        maxTHeight: 150,
        maxTWidth: 200,
        priceType: 1,
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

      const mockCar = { id: 1 } as any;
      const mockTrailer = { id: 2 } as any;
      const mockSession = { currentUser: 1 } as SessionData;

      jest.spyOn(vehicleService, 'getCarById').mockResolvedValue(mockCar);
      jest
        .spyOn(vehicleService, 'getTrailerById')
        .mockResolvedValue(mockTrailer);
      jest
        .spyOn(service, 'updateOffer')
        .mockRejectedValue(
          new Error('An error occurred while updating the offer'),
        );

      await expect(
        controller.updateOffer(1, body, mockSession),
      ).rejects.toThrow(
        new Error('An error occurred while updating the offer'),
      );
    });
  });

  describe('updateRequest', () => {
    it('should update an request successfully', async () => {
      const body = {
        name: 'Updated Request',
        date: new Date('2024-12-13T18:12:02.549Z'),
        price: 42,
        seats: 3,
        info: 3,
        smokingAllowed: true,
        animalsAllowed: false,
        cargo: [
          {
            description: 'Mein fettes Klavier',
            weight: 300,
            length: 232,
            height: 123,
            width: 65,
          },
        ],
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

      // Mock the service methods
      jest.spyOn(service, 'updateRequest').mockResolvedValue(undefined);

      const result = await controller.updateRequest(
        1,
        mockSession as SessionData,
        body,
      );

      expect(result).toEqual(new OkDTO(true, 'request was updated'));
      expect(service.updateRequest).toHaveBeenCalledWith(
        1,
        mockSession.currentUser,
        body,
      );
    });

    it('should throw an error if driveService.updateRequest fails', async () => {
      const body = {
        name: 'Updated Request',
        date: new Date('2024-12-13T18:12:02.549Z'),
        price: 42,
        seats: 3,
        info: 3,
        smokingAllowed: true,
        animalsAllowed: false,
        cargo: [
          {
            description: 'Mein fettes Klavier',
            weight: 300,
            length: 232,
            height: 123,
            width: 65,
          },
        ],
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

      const mockSession = { currentUser: 1 } as SessionData;

      jest
        .spyOn(service, 'updateRequest')
        .mockRejectedValue(
          new Error('An error occurred while updating the request'),
        );

      await expect(
        controller.updateRequest(1, mockSession, body),
      ).rejects.toThrow(
        new Error('An error occurred while updating the request'),
      );
    });

    it('should throw an error if user is not creator of request', async () => {
      const body = {
        name: 'Updated Request',
        date: new Date('2024-12-13T18:12:02.549Z'),
        price: 42,
        seats: 3,
        info: 3,
        smokingAllowed: true,
        animalsAllowed: false,
        cargo: [
          {
            description: 'Mein fettes Klavier',
            weight: 300,
            length: 232,
            height: 123,
            width: 65,
          },
        ],
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

      const mockSession = { currentUser: 3 } as SessionData;

      jest
        .spyOn(service, 'updateRequest')
        .mockRejectedValue(
          new UnauthorizedException('You are not the owner of this request'),
        );

      await expect(
        controller.updateRequest(1, mockSession, body),
      ).rejects.toThrow(
        new NotFoundException('You are not the owner of this request'),
      );
    });
  });

  describe('updateStatus', () => {
    it('should update the status of a drive successfully', async () => {
      const body: ChangeStatusDTO = {
        newStatus: 2,
      };
      const mockDrive = { id: 1 } as any;

      // Mock the service methods
      jest.spyOn(service, 'updateStatus').mockResolvedValue(undefined);

      const result = await controller.updateStatus(
        mockDrive.id,
        mockSession as SessionData,
        body,
      );

      expect(result).toEqual(new OkDTO(true, 'request was updated'));

      expect(service.updateStatus).toHaveBeenCalledWith(
        mockDrive.id,
        mockSession.currentUser,
        body,
      );
    });

    it('should throw an error if offer was not found', async () => {
      const body: ChangeStatusDTO = {
        newStatus: 2,
      };
      const mockDrive = { id: 1 } as any;

      // Mock the service methods
      jest
        .spyOn(service, 'updateStatus')
        .mockRejectedValue(new NotFoundException('Offer not found'));

      await expect(
        controller.updateStatus(mockDrive.id, mockSession as SessionData, body),
      ).rejects.toThrow(new NotFoundException('Offer not found'));
    });

    it('should throw an error if user is not authorized', async () => {
      const body: ChangeStatusDTO = {
        newStatus: 2,
      };
      const mockDrive = { id: 1 } as any;

      // Mock the service methods
      jest
        .spyOn(service, 'updateStatus')
        .mockRejectedValue(
          new UnauthorizedException('You are not the owner of this offer'),
        );

      await expect(
        controller.updateStatus(mockDrive.id, mockSession as SessionData, body),
      ).rejects.toThrow(
        new UnauthorizedException('You are not the owner of this offer'),
      );
    });
  });

  describe('deleteDrive', () => {
    it('should delete a drive successfully', async () => {
      const mockDrive = { id: 1 } as any;

      // Mock the service methods
      jest.spyOn(service, 'deleteDrive').mockResolvedValue(undefined);

      const result = await controller.deleteDrive(
        mockDrive.id,
        mockSession as SessionData,
      );

      expect(result).toEqual(new OkDTO(true, 'drive was deleted'));

      expect(service.deleteDrive).toHaveBeenCalledWith(
        mockDrive.id,
        mockSession.currentUser,
      );
    });

    it('should throw NotFoundException if drive to delete was not found', async () => {
      const mockDrive = { id: 1 } as any;

      jest
        .spyOn(service, 'deleteDrive')
        .mockRejectedValue(new NotFoundException('Drive not found'));

      await expect(
        controller.deleteDrive(mockDrive.id, mockSession as SessionData),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException when drive does not belong to user', async () => {
      const mockDrive = { id: 1 } as any;

      jest
        .spyOn(service, 'deleteDrive')
        .mockRejectedValue(
          new UnauthorizedException('You are not the owner of this offer'),
        );

      await expect(
        controller.deleteDrive(mockDrive.id, mockSession as SessionData),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw BadRequestException when drive status is not created', async () => {
      const mockDrive = { id: 1 } as any;

      jest
        .spyOn(service, 'deleteDrive')
        .mockRejectedValue(
          new BadRequestException(
            'Drive cannot be deleted because it is not in the created status',
          ),
        );

      await expect(
        controller.deleteDrive(mockDrive.id, mockSession as SessionData),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle unexpected errors', async () => {
      const mockDrive = { id: 1 } as any;

      jest
        .spyOn(service, 'deleteDrive')
        .mockRejectedValue(new BadRequestException('Drive not found'));

      await expect(
        controller.deleteDrive(mockDrive.id, mockSession as SessionData),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
