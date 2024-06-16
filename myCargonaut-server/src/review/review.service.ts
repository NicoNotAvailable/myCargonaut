import { Injectable } from '@nestjs/common';
import { UserDB } from '../database/UserDB';
import { TripDB } from '../database/TripDB';
import { ReviewDB } from '../database/ReviewDB';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDTO } from './DTO/CreateReviewDTO';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(TripDB)
    private tripRepository: Repository<TripDB>,
    @InjectRepository(ReviewDB)
    private reviewRepository: Repository<ReviewDB>,
  ) {}

  async createReview(
    user: UserDB,
    trip: TripDB,
    body: CreateReviewDTO,
  ): Promise<ReviewDB> {
    const newReview: ReviewDB = this.reviewRepository.create();
    if (user instanceof UserDB) {
      newReview.writer = user;
    } else {
      throw new Error('Invalid owner type');
    }
    if (trip instanceof TripDB) {
      newReview.trip = trip;
    } else {
      throw new Error('Invalid trip type');
    }
    newReview.rating = body.rating;
    newReview.text = body.text;
    try {
      return await this.reviewRepository.save(newReview);
    } catch (error) {
      throw new Error('An error occurred while saving the review');
    }
  }
}
