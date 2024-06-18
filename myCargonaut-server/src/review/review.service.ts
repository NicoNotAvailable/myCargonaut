import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDB } from '../database/UserDB';
import { TripDB } from '../database/TripDB';
import { ReviewDB } from '../database/ReviewDB';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDTO } from './DTO/CreateReviewDTO';
import { OfferTripDB } from '../database/OfferTripDB';
import { RequestTripDB } from '../database/RequestTripDB';
import { DriveDB } from '../database/DriveDB';
import { StatusEnum } from '../database/enums/StatusEnum';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(TripDB)
        private tripRepository: Repository<TripDB>,
        @InjectRepository(ReviewDB)
        private reviewRepository: Repository<ReviewDB>,
        @InjectRepository(DriveDB)
        private driveRepository: Repository<DriveDB>,
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
        let otherPerson: UserDB | undefined;
        if (trip instanceof OfferTripDB) {
            const drive = await this.driveRepository.findOne({
                where: { id: trip.drive.id },
                relations: ['user'],
            });
            if (!drive) {
                throw new Error('Offer drive not found');
            }
            if (drive.user.id !== user.id && trip.requesting.id !== user.id) {
                throw new Error(
                    'User is not authorized to write a review for this offer trip',
                );
            } else if (drive.status !== StatusEnum.finished) {
                throw new BadRequestException('ride is not finished yet!');
            }
            otherPerson = drive.user.id === user.id ? trip.requesting : drive.user;
        } else if (trip instanceof RequestTripDB) {
            const drive = await this.driveRepository.findOne({
                where: { id: trip.drive.id },
                relations: ['user'],
            });
            if (!drive) {
                throw new Error('Request drive not found');
            }
            if (drive.user.id !== user.id && trip.requesting.id !== user.id) {
                throw new Error(
                    'User is not authorized to write a review for this request trip',
                );
            } else if (drive.status !== StatusEnum.finished) {
                throw new BadRequestException('ride is not finished yet!');
            }
            otherPerson = drive.user.id === user.id ? trip.requesting : drive.user;
        } else {
            throw new Error('Invalid trip type');
        }
        newReview.rating = body.rating;
        newReview.text = body.text;
        newReview.trip = trip;
        newReview.about = otherPerson;
        try {
            return await this.reviewRepository.save(newReview);
        } catch (error) {
            throw new Error('An error occurred while saving the review');
        }
    }
}
