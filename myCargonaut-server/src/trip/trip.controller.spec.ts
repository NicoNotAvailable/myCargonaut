import { Test, TestingModule } from '@nestjs/testing';
import { TripController } from './trip.controller';
import { UserService } from '../user/user.service';
import { VehicleService } from '../vehicle/vehicle.service';
import { TripService } from './trip.service';
import { LocationService } from '../location/location.service';
import { UtilsService } from '../utils/utils.service';
import { DriveService } from '../drive/drive.service'; // Adjust import path

// Mock implementations
const mockUserService = {
  // Add mocked methods here
};

const mockVehicleService = {
  // Add mocked methods here
};

const mockTripService = {
  // Add mocked methods here
};

const mockLocationService = {
  // Add mocked methods here
};

const mockUtilsService = {
  // Add mocked methods here
};

const mockDriveService = {
  // Add mocked methods here
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
});
