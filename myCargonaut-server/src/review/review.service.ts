import { Injectable } from '@nestjs/common';
import { UserDB } from '../database/UserDB';
import { OfferDB } from '../database/DriveDB';
import { OfferTripDB } from '../database/OfferTripDB';
import { CreateCargoDTO } from '../cargo/DTO/CreateCargoDTO';
import { TripDB } from '../database/TripDB';
import { ReviewDB } from '../database/ReviewDB';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestTripDB } from '../database/RequestTripDB';
import { CargoDB } from '../database/CargoDB';
import { CreateReviewDTO } from './DTO/CreateReviewDTO';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(TripDB)
    private tripRepository: Repository<TripDB>,
    @InjectRepository(OfferTripDB)
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
    newReview.punctuality = body.punctuality;
    newReview.comfort = body.comfort;
    newReview.damage = body.damage;
    newReview.reliability = body.reliability;
    newReview.text = body.text;
    try {
      const savedReview = await this.reviewRepository.save(newReview);
      return newReview;
    } catch (error) {
      throw new Error('An error occurred while saving the review');
    }
  }
}
