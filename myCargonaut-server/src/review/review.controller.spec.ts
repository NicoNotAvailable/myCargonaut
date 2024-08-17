import { Test, TestingModule } from '@nestjs/testing';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { UserService } from '../user/user.service';
import { UtilsService } from '../utils/utils.service';
import { TripService } from '../trip/trip.service';
import { DriveService } from '../drive/drive.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateReviewDTO } from './DTO/CreateReviewDTO';
import { SessionData } from 'express-session';
import { UserDB } from '../database/UserDB';
import { TripDB } from '../database/TripDB';
import { OkDTO } from '../serverDTO/OkDTO';

// Mock implementations
const mockReviewService = {
  createReview: jest.fn(),
  getReviews: jest.fn(),
};

const mockUserService = {
  getUserById: jest.fn(),
};

const mockUtilsService = {
  transformReviewDBToGetReviewDTO: jest.fn(),
};

const mockTripService = {
  getOfferTripById: jest.fn(),
  getRequestTripById: jest.fn(),
};

const mockDriveService = {
  // Add mocked methods here
};

describe('ReviewController', () => {
  let controller: ReviewController;

  beforeEach(async () => {
    jest.clearAllMocks();
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

  describe('createReview', () => {
    it('should create a review successfully', async () => {
      const mockUser = { id: 1 } as UserDB;
      const mockTrip = { id: 1 } as TripDB;
      const session = { currentUser: 1 } as SessionData;
      const createReviewDto: CreateReviewDTO = {
        tripID: 1,
        rating: 5,
        text: 'Great trip!',
      };

      mockUserService.getUserById.mockResolvedValue(mockUser);
      mockTripService.getOfferTripById.mockResolvedValue(mockTrip);
      mockReviewService.createReview.mockResolvedValue(undefined);

      const result = await controller.createReview(createReviewDto, session);

      expect(result).toEqual(new OkDTO(true, 'Review was created'));
      expect(mockUserService.getUserById).toHaveBeenCalledWith(
        session.currentUser,
      );
      expect(mockTripService.getOfferTripById).toHaveBeenCalledWith(
        createReviewDto.tripID,
      );
      expect(mockReviewService.createReview).toHaveBeenCalledWith(
        mockUser,
        mockTrip,
        createReviewDto,
      );
    });

    it('should throw BadRequestException if user is not found', async () => {
      const session = { currentUser: 1 } as SessionData;
      const createReviewDto: CreateReviewDTO = {
        tripID: 1,
        rating: 5,
        text: 'Great trip!',
      };

      mockUserService.getUserById.mockResolvedValue(null);

      await expect(
        controller.createReview(createReviewDto, session),
      ).rejects.toThrow('User was not found');
    });

    it('should throw BadRequestException if trip is not found', async () => {
      const mockUser = { id: 1 } as UserDB;
      const session = { currentUser: 1 } as SessionData;
      const createReviewDto: CreateReviewDTO = {
        tripID: 1,
        rating: 5,
        text: 'Great trip!',
      };

      // Mock user retrieval
      mockUserService.getUserById.mockResolvedValue(mockUser);

      // Mock trip retrievals to throw NotFoundException
      mockTripService.getOfferTripById.mockRejectedValue(
        new NotFoundException(),
      );
      mockTripService.getRequestTripById.mockRejectedValue(
        new NotFoundException(),
      );

      // Expect that createReview will throw a BadRequestException
      await expect(
        controller.createReview(createReviewDto, session),
      ).rejects.toThrow(BadRequestException);
      await expect(
        controller.createReview(createReviewDto, session),
      ).rejects.toThrow('Trip was not found');
    });
  });

  describe('getReviews', () => {
    it('should return the reviews for a user', async () => {
      const userId = 1;
      const mockReviews = [
        { id: 1, rating: 5, text: 'Great trip!' },
        { id: 2, rating: 4, text: 'Good experience.' },
      ];
      const mockReviewDTOs = [
        { id: 1, rating: 5, text: 'Great trip!' },
        { id: 2, rating: 4, text: 'Good experience.' },
      ];

      // Mocking review service and utils service methods
      mockReviewService.getReviews.mockResolvedValue(mockReviews);
      mockUtilsService.transformReviewDBToGetReviewDTO.mockImplementation(
        (reviewDB) => {
          return Promise.resolve(
            mockReviewDTOs.find((dto) => dto.id === reviewDB.id),
          );
        },
      );

      const result = await controller.getReviews(userId);

      expect(result).toEqual(mockReviewDTOs);
      expect(mockReviewService.getReviews).toHaveBeenCalledWith(userId);
      expect(
        mockUtilsService.transformReviewDBToGetReviewDTO,
      ).toHaveBeenCalledTimes(mockReviews.length);
    });

    it('should throw a BadRequestException if an error occurs', async () => {
      const userId = 1;

      mockReviewService.getReviews.mockRejectedValue(
        new Error('Something went wrong'),
      );

      await expect(controller.getReviews(userId)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockReviewService.getReviews).toHaveBeenCalledWith(userId);
    });
  });

  describe('getOwnReviews', () => {
    it('should return the reviews for the current user', async () => {
      const session = { currentUser: 1 } as SessionData;
      const mockReview = [
        { id: 1, rating: 5, text: 'Great trip!' },
        { id: 2, rating: 4, text: 'Good experience.' },
      ];
      const mockReviewDTOs = [
        { id: 1, rating: 5, text: 'Great trip!' },
        { id: 2, rating: 4, text: 'Good experience.' },
      ];

      // Mocking review service and utils service methods
      mockReviewService.getReviews.mockResolvedValue(mockReview);
      mockUtilsService.transformReviewDBToGetReviewDTO.mockImplementation(
        (reviewDB) => {
          return Promise.resolve(
            mockReviewDTOs.find((dto) => dto.id === reviewDB.id),
          );
        },
      );

      const result = await controller.getOwnReviews(session);

      expect(result).toEqual(mockReviewDTOs);
      expect(mockReviewService.getReviews).toHaveBeenCalledWith(
        session.currentUser,
      );
      expect(
        mockUtilsService.transformReviewDBToGetReviewDTO,
      ).toHaveBeenCalledTimes(mockReview.length);
    });

    it('should throw a BadRequestException if an error occurs', async () => {
      const session = { currentUser: 1 } as SessionData;

      mockReviewService.getReviews.mockRejectedValue(
        new Error('Something went wrong'),
      );

      await expect(controller.getOwnReviews(session)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockReviewService.getReviews).toHaveBeenCalledWith(
        session.currentUser,
      );
    });
  });
});
