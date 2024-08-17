import { Test, TestingModule } from '@nestjs/testing';
import { TripController } from './trip.controller';
import { UserService } from '../user/user.service';
import { VehicleService } from '../vehicle/vehicle.service';
import { TripService } from './trip.service';
import { LocationService } from '../location/location.service';
import { UtilsService } from '../utils/utils.service';
import { DriveService } from '../drive/drive.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OkDTO } from '../serverDTO/OkDTO';
import { CreateRequestTripDTO } from './DTO/CreateRequestTripDTO';
import { CreateOfferTripDTO } from './DTO/CreateOfferTripDTO';

// Mock implementations
const mockUserService = {
  getUserById: jest.fn(),
};

const mockVehicleService = {
  getCarById: jest.fn(),
  getTrailerById: jest.fn(),
};

const mockTripService = {
  getOwnOfferTrips: jest.fn(),
  getAllOfferTrips: jest.fn(),
  getOfferTripById: jest.fn(),
  createRequestTrip: jest.fn(),
  createOfferTrip: jest.fn(),
  getOwnRequestTrips: jest.fn(),
  getAllRequestTrips: jest.fn(),
  getRequestTripById: jest.fn(),
  getUserTrips: jest.fn(),
  setOfferStatusPaid: jest.fn(),
  setRequestStatusPaid: jest.fn(),
  acceptTrip: jest.fn(),
  deleteTrip: jest.fn(),
};

const mockLocationService = {
  getLocationsOfDrive: jest.fn(),
  getLocationByID: jest.fn(),
};

const mockUtilsService = {
  transformOfferTripDBToGetOfferTripDTO: jest.fn(),
  transformRequestTripDBToGetRequestTripDTO: jest.fn(),
};

const mockDriveService = {
  getOfferById: jest.fn(),
  getRequestById: jest.fn(),
};

describe('TripController', () => {
  let controller: TripController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: VehicleService,
          useValue: mockVehicleService,
        },
        {
          provide: TripService,
          useValue: mockTripService,
        },
        {
          provide: LocationService,
          useValue: mockLocationService,
        },
        {
          provide: UtilsService,
          useValue: mockUtilsService,
        },
        {
          provide: DriveService,
          useValue: mockDriveService,
        },
      ],
    }).compile();

    controller = module.get<TripController>(TripController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOfferTrip', () => {
    it('should throw BadRequestException if user is not found', async () => {
      mockUserService.getUserById = jest.fn().mockResolvedValue(null);

      await expect(
        controller.createOfferTrip(
          {
            driveID: 1,
            startLocationID: 2,
            endLocationID: 3,
            usedSeats: 3,
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
          { currentUser: 1 } as any,
        ),
      ).rejects.toThrow('User was not found');
    });

    it('should throw BadRequestException if user has no profile picture', async () => {
      mockUserService.getUserById = jest
        .fn()
        .mockResolvedValue({ profilePic: 'empty.png' });

      await expect(
        controller.createOfferTrip(
          {
            driveID: 1,
            startLocationID: 2,
            endLocationID: 3,
            usedSeats: 3,
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
          { currentUser: 1 } as any,
        ),
      ).rejects.toThrow('You need a profile pic to request an offer');
    });

    it('should throw BadRequestException if user has no phone number', async () => {
      mockUserService.getUserById = jest
        .fn()
        .mockResolvedValue({ profilePic: 'not_empty.png', phoneNumber: null });

      await expect(
        controller.createOfferTrip(
          {
            driveID: 1,
            startLocationID: 2,
            endLocationID: 3,
            usedSeats: 3,
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
          { currentUser: 1 } as any,
        ),
      ).rejects.toThrow('You need a phone number');
    });

    it('should throw BadRequestException if user requests their own offer', async () => {
      mockUserService.getUserById = jest.fn().mockResolvedValue({
        id: 1,
        profilePic: 'not_empty.png',
        phoneNumber: '12345',
      });
      mockDriveService.getOfferById = jest
        .fn()
        .mockResolvedValue({ user: { id: 1 } });

      await expect(
        controller.createOfferTrip(
          {
            driveID: 1,
            startLocationID: 2,
            endLocationID: 3,
            usedSeats: 3,
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
          { currentUser: 1 } as any,
        ),
      ).rejects.toThrow('You cant request your own offer!');
    });

    it('should create a offer trip successfully', async () => {
      const user = { id: 1, profilePic: 'not_empty.png', phoneNumber: '12345' };
      const offer = { user: { id: 2 } };
      mockLocationService.getLocationsOfDrive({});
      mockUserService.getUserById.mockResolvedValue(user);
      mockDriveService.getOfferById.mockResolvedValue(offer);
      mockTripService.createOfferTrip.mockResolvedValue(undefined);

      const dto: CreateOfferTripDTO = {
        driveID: 1,
        startLocationID: 2,
        endLocationID: 3,
        usedSeats: 3,
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
      const session = { currentUser: 1 } as any;

      const result = await controller.createOfferTrip(dto, session);

      expect(result).toEqual(
        new OkDTO(true, 'Request for the offer was created'),
      );
    });
  });

  describe('getTripsForOffer', () => {
    it('should return all trips for a specific offer', async () => {
      const mockTrips = [{ id: 1 }, { id: 2 }];
      mockTripService.getAllOfferTrips.mockResolvedValue(mockTrips);
      mockUtilsService.transformOfferTripDBToGetOfferTripDTO.mockImplementation(
        (trip) => trip,
      );

      const result = await controller.getTripsForOffer(1);

      expect(mockTripService.getAllOfferTrips).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTrips);
    });

    it('should throw a BadRequestException on error', async () => {
      mockTripService.getAllOfferTrips.mockRejectedValue(
        new Error('some error'),
      );

      await expect(controller.getTripsForOffer(1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getOfferTripById', () => {
    it('should return a single offer trip by its ID', async () => {
      const mockTrip = { id: 1 };
      mockTripService.getOfferTripById.mockResolvedValue(mockTrip);
      mockUtilsService.transformOfferTripDBToGetOfferTripDTO.mockReturnValue(
        mockTrip,
      );

      const result = await controller.getOfferTripById(1);

      expect(mockTripService.getOfferTripById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTrip);
    });

    it('should throw a BadRequestException on error', async () => {
      mockTripService.getOfferTripById.mockRejectedValue(
        new Error('some error'),
      );

      await expect(controller.getOfferTripById(1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('createRequestTrip', () => {
    it('should create a request trip successfully', async () => {
      const user = { id: 1, profilePic: 'not_empty.png', phoneNumber: '12345' };
      const request = { user: { id: 2 } };
      const car = {};
      const trailer = {};
      mockUserService.getUserById.mockResolvedValue(user);
      mockDriveService.getRequestById.mockResolvedValue(request);
      mockVehicleService.getCarById.mockResolvedValue(car);
      mockVehicleService.getTrailerById.mockResolvedValue(trailer);
      mockTripService.createRequestTrip.mockResolvedValue(undefined);

      const dto: CreateRequestTripDTO = { driveID: 1, carID: 1, trailerID: 1 };
      const session = { currentUser: 1 } as any;

      const result = await controller.createRequestTrip(dto, session);

      expect(mockTripService.createRequestTrip).toHaveBeenCalledWith(
        user,
        request,
        car,
        trailer,
      );
      expect(result).toEqual(
        new OkDTO(true, 'Request for the offer was created'),
      );
    });

    it('should throw BadRequestException if user requests their own request', async () => {
      const user = { id: 1, profilePic: 'not_empty.png', phoneNumber: '12345' };
      const request = { user: { id: 1 } };
      const car = {};
      const trailer = {};
      mockUserService.getUserById.mockResolvedValue(user);
      mockDriveService.getRequestById.mockResolvedValue(request);
      mockVehicleService.getCarById.mockResolvedValue(car);
      mockVehicleService.getTrailerById.mockResolvedValue(trailer);
      mockTripService.createRequestTrip.mockResolvedValue(undefined);

      const dto: CreateRequestTripDTO = { driveID: 1, carID: 1, trailerID: 1 };
      const session = { currentUser: 1 } as any;

      await expect(controller.createRequestTrip(dto, session)).rejects.toThrow(
        'You cant request your own offer!',
      );
    });

    it('should throw a BadRequestException if user is not found', async () => {
      mockUserService.getUserById.mockResolvedValue(null);

      const dto: CreateRequestTripDTO = { driveID: 1, carID: 1, trailerID: 1 };
      const session = { currentUser: 1 } as any;

      await expect(controller.createRequestTrip(dto, session)).rejects.toThrow(
        'User was not found',
      );
    });

    it('should throw BadRequestException if user has no profile picture', async () => {
      mockUserService.getUserById = jest
        .fn()
        .mockResolvedValue({ profilePic: 'empty.png' });

      const dto: CreateRequestTripDTO = { driveID: 1, carID: 1, trailerID: 1 };
      const session = { currentUser: 1 } as any;

      await expect(controller.createRequestTrip(dto, session)).rejects.toThrow(
        'You need a profile pic to request an offer',
      );
    });

    it('should throw BadRequestException if user has no phone number', async () => {
      mockUserService.getUserById = jest
        .fn()
        .mockResolvedValue({ phoneNumber: '' });

      const dto: CreateRequestTripDTO = { driveID: 1, carID: 1, trailerID: 1 };
      const session = { currentUser: 1 } as any;

      await expect(controller.createRequestTrip(dto, session)).rejects.toThrow(
        'You need a phone number',
      );
    });
    // Additional cases for profilePic, phoneNumber, etc.
  });

  // Tests for getOwnRequestTrips
  describe('getOwnRequestTrips', () => {
    it('should return all request trips for a specific user', async () => {
      const mockTrips = [{ id: 1 }, { id: 2 }];
      mockTripService.getOwnRequestTrips.mockResolvedValue(mockTrips);
      mockUtilsService.transformRequestTripDBToGetRequestTripDTO.mockImplementation(
        (trip) => trip,
      );

      const result = await controller.getOwnRequestTrips({
        currentUser: 1,
      } as any);

      expect(mockTripService.getOwnRequestTrips).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTrips);
    });

    it('should throw a BadRequestException on error', async () => {
      mockTripService.getOwnRequestTrips.mockRejectedValue(
        new Error('some error'),
      );

      await expect(
        controller.getOwnRequestTrips({ currentUser: 1 } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // Tests for getTripsForRequest
  describe('getTripsForRequest', () => {
    it('should return all trips for a specific request', async () => {
      const mockTrips = [{ id: 1 }, { id: 2 }];
      mockTripService.getAllRequestTrips.mockResolvedValue(mockTrips);
      mockUtilsService.transformRequestTripDBToGetRequestTripDTO.mockImplementation(
        (trip) => trip,
      );

      const result = await controller.getTripsForRequest(1);

      expect(mockTripService.getAllRequestTrips).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTrips);
    });

    it('should throw a BadRequestException on error', async () => {
      mockTripService.getAllRequestTrips.mockRejectedValue(
        new Error('some error'),
      );

      await expect(controller.getTripsForRequest(1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // Tests for getRequestTripById
  describe('getRequestTripById', () => {
    it('should return a single request trip by its ID', async () => {
      const mockTrip = { id: 1 };
      mockTripService.getRequestTripById.mockResolvedValue(mockTrip);
      mockUtilsService.transformRequestTripDBToGetRequestTripDTO.mockReturnValue(
        mockTrip,
      );

      const result = await controller.getRequestTripById(1);

      expect(mockTripService.getRequestTripById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTrip);
    });

    it('should throw a BadRequestException on error', async () => {
      mockTripService.getRequestTripById.mockRejectedValue(
        new Error('some error'),
      );

      await expect(controller.getRequestTripById(1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // Tests for getUserTrips
  describe('getUserTrips', () => {
    it('should return user trips successfully', async () => {
      const mockTrips = {
        offerTrips: [{ id: 1 }],
        requestTrips: [{ id: 2 }],
        offerDriveTrips: [{ id: 3 }],
        requestDriveTrips: [{ id: 4 }],
      };
      mockTripService.getUserTrips.mockResolvedValue(mockTrips);

      const result = await controller.getUserTrips(1);

      expect(mockTripService.getUserTrips).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTrips);
    });

    it('should throw a BadRequestException on error', async () => {
      mockTripService.getUserTrips.mockRejectedValue(new Error('some error'));

      await expect(controller.getUserTrips(1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // Tests for setOfferStatusPaid
  describe('setOfferStatusPaid', () => {
    it('should update the offer status to paid', async () => {
      mockTripService.setOfferStatusPaid.mockResolvedValue(undefined);

      const result = await controller.setOfferStatusPaid(1, {
        currentUser: 1,
      } as any);

      expect(mockTripService.setOfferStatusPaid).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(new OkDTO(true, 'request was updated'));
    });

    it('should throw a NotFoundException if the offer is not found', async () => {
      mockTripService.setOfferStatusPaid.mockRejectedValue(
        new NotFoundException('Offer not found'),
      );

      await expect(
        controller.setOfferStatusPaid(1, { currentUser: 1 } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // Tests for setRequestStatusPaid
  describe('setRequestStatusPaid', () => {
    it('should update the request status to paid', async () => {
      mockTripService.setRequestStatusPaid.mockResolvedValue(undefined);

      const result = await controller.setRequestStatusPaid(1, {
        currentUser: 1,
      } as any);

      expect(mockTripService.setRequestStatusPaid).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(new OkDTO(true, 'request was updated'));
    });

    it('should throw a NotFoundException if the request is not found', async () => {
      mockTripService.setRequestStatusPaid.mockRejectedValue(
        new NotFoundException('Request not found'),
      );

      await expect(
        controller.setRequestStatusPaid(1, { currentUser: 1 } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // Tests for acceptTrip
  describe('acceptTrip', () => {
    it('should accept a trip successfully', async () => {
      mockTripService.acceptTrip.mockResolvedValue(undefined);

      const result = await controller.acceptTrip({ currentUser: 1 } as any, 1);

      expect(mockTripService.acceptTrip).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(new OkDTO(true, 'trip was accepted'));
    });

    it('should throw a NotFoundException if the trip is not found', async () => {
      mockTripService.acceptTrip.mockRejectedValue(
        new NotFoundException('Trip not found'),
      );

      await expect(
        controller.acceptTrip({ currentUser: 1 } as any, 1),
      ).rejects.toThrow('Trip not found');
    });

    it('should throw a BadRequestException on error', async () => {
      mockTripService.acceptTrip.mockRejectedValue(new BadRequestException());

      await expect(
        controller.acceptTrip({ currentUser: 1 } as any, 1),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // Tests for deleteTrip
  describe('deleteTrip', () => {
    it('should delete a trip successfully', async () => {
      mockTripService.deleteTrip.mockResolvedValue(undefined);

      const result = await controller.deleteTrip(1, { currentUser: 1 } as any);

      expect(mockTripService.deleteTrip).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(new OkDTO(true, 'trip was deleted'));
    });

    it('should throw a NotFoundException if the trip is not found', async () => {
      mockTripService.deleteTrip.mockRejectedValue(
        new NotFoundException('Trip not found'),
      );

      await expect(
        controller.deleteTrip(1, { currentUser: 1 } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
