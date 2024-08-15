import { Test, TestingModule } from '@nestjs/testing';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { UserService } from '../user/user.service'; // Adjust import as needed
import { UtilsService } from '../utils/utils.service';
import { TripService } from '../trip/trip.service';
import { DriveService } from '../drive/drive.service';

// Mock implementations
const mockReviewService = {
  // Add mocked methods here
};

const mockUserService = {
  // Add mocked methods here
};

const mockUtilsService = {
  // Add mocked methods here
};

const mockTripService = {
  // Add mocked methods here
};

const mockDriveService = {
  // Add mocked methods here
};

describe('ReviewController', () => {
  let controller: ReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [
        {
          provide: ReviewService,
          useValue: mockReviewService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: UtilsService,
          useValue: mockUtilsService,
        },
        {
          provide: TripService,
          useValue: mockTripService,
        },
        {
          provide: DriveService,
          useValue: mockDriveService,
        },
      ],
    }).compile();

    controller = module.get<ReviewController>(ReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
