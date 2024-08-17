import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OkDTO } from '../serverDTO/OkDTO';
import { IsLoggedInGuard } from '../session/is-logged-in.guard';
import { SessionData } from 'express-session';
import {UserService} from '../user/user.service';
import {UtilsService} from '../utils/utils.service';
import {ReviewService} from './review.service';
import {CreateReviewDTO} from './DTO/CreateReviewDTO';
import {TripService} from '../trip/trip.service';
import {TripDB} from 'src/database/TripDB';
import {DriveService} from '../drive/drive.service';
import {GetOwnUserDTO} from '../user/DTO/GetOwnUserDTO';
import {UserDB} from '../database/UserDB';
import {GetReviewDTO} from './DTO/GetReviewDTO';

@ApiTags('review')
@Controller('review')
export class ReviewController {
  constructor(
    private readonly userService: UserService,
    private readonly reviewService: ReviewService,
    private readonly utilsService: UtilsService,
    private readonly tripService: TripService,
    private readonly driveService: DriveService,
  ) {}

  @ApiResponse({
    type: OkDTO,
    description: 'Posts a review into the database',
  })
  @Post()
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  async createReview(
    @Body() body: CreateReviewDTO,
    @Session() session: SessionData,
  ) {
    const user = await this.userService.getUserById(session.currentUser);
    if (!user) {
      throw new BadRequestException('User was not found');
    }
    let trip: TripDB;
    try {
      trip = await this.tripService.getOfferTripById(body.tripID);
    } catch (err) {
      if (err instanceof NotFoundException) {
        try {
          trip = await this.tripService.getRequestTripById(
            body.tripID,
          );
        } catch (err) {
          if (err instanceof NotFoundException) {
            throw new BadRequestException('Trip was not found');
          } else {
            throw new BadRequestException(
              'An error occurred: ' + err.message,
            );
          }
        }
      } else {
        throw new BadRequestException(
          'An error occurred: ' + err.message,
        );
      }
    }

    try {
      await this.reviewService.createReview(user, trip, body);
      return new OkDTO(true, 'Review was created');
    } catch (err) {
      throw new BadRequestException('An error occurred: ' + err.message);
    }
  }

  @ApiResponse({
    type: [GetReviewDTO],
    description: 'gets the reviews for a user',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the user to get the reviews from',
  })
  @Get('/:id')
  async getReviews(
    @Param('id', ParseIntPipe) user: number,
  ): Promise<GetReviewDTO[]> {
    try {
      const reviews = await this.reviewService.getReviews(user);
      return await Promise.all(
        reviews.map(async (review) => {
          return this.utilsService.transformReviewDBToGetReviewDTO(
            review,
          );
        }),
      );
    } catch (err) {
      throw new BadRequestException('An error occurred: ' + err.message);
    }
  }

  @ApiResponse({
    type: [GetReviewDTO],
    description: 'gets the reviews for the own user',
  })
  @Get()
  async getOwnReviews(
    @Session() session: SessionData,
  ): Promise<GetReviewDTO[]> {
    try {
      const reviews = await this.reviewService.getReviews(
        session.currentUser,
      );
      return await Promise.all(
        reviews.map(async (review) => {
          return this.utilsService.transformReviewDBToGetReviewDTO(
            review,
          );
        }),
      );
    } catch (err) {
      throw new BadRequestException('An error occurred: ' + err.message);
    }
  }
}
