import { Test, TestingModule } from '@nestjs/testing';
import { DriveController } from './drive.controller';
import { DriveService } from '../drive/drive.service';
import { UserService } from '../user/user.service';
import { VehicleService } from '../vehicle/vehicle.service';
import { UtilsService } from '../utils/utils.service';

// Mock implementations
const mockDriveService = {};
const mockUserService = {};
const mockVehicleService = {};
const mockUtilsService = {};

describe('DriveController', () => {
  let controller: DriveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriveController],
      providers: [
        {
          provide: DriveService,
          useValue: mockDriveService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: VehicleService,
          useValue: mockVehicleService,
        },
        {
          provide: UtilsService,
          useValue: mockUtilsService,
        },
      ],
    }).compile();

    controller = module.get<DriveController>(DriveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
