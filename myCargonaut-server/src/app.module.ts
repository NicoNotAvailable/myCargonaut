import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserDB } from './database/UserDB';
import { LocationDB } from './database/LocationDB';
import { ReviewDB } from './database/ReviewDB';
import { CarDB } from './database/CarDB';
import { TrailerDB } from './database/TrailerDB';
import { TripDB } from './database/TripDB';
import { VehicleDB } from './database/VehicleDB';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { SessionController } from './session/session.controller';
import { MessageDB } from './database/MessageDB';
import { VehicleService } from './vehicle/vehicle.service';
import { VehicleController } from './vehicle/vehicle.controller';
import { CargoDB } from './database/CargoDB';
import { DriveDB, OfferDB, RequestDB } from './database/DriveDB';
import { OfferTripDB } from './database/OfferTripDB';
import { RequestTripDB } from './database/RequestTripDB';
import { DriveService } from './drive/drive.service';
import { DriveController } from './drive/drive.controller';
import { TripService } from './trip/trip.service';
import { TripController } from './trip/trip.controller';
import { LocationService } from './location/location.service';
import { UtilsService } from './utils/utils.service';
import { ReviewService } from './review/review.service';
import { ReviewController } from './review/review.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './db.sqlite',
      entities: [
        UserDB,
        DriveDB,
        CarDB,
        LocationDB,
        ReviewDB,
        TrailerDB,
        TripDB,
        VehicleDB,
        MessageDB,
        RequestDB,
        CargoDB,
        OfferDB,
        OfferTripDB,
        RequestTripDB,
      ],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      UserDB,
      DriveDB,
      CarDB,
      LocationDB,
      ReviewDB,
      TrailerDB,
      TripDB,
      VehicleDB,
      MessageDB,
      RequestDB,
      CargoDB,
      OfferDB,
      OfferTripDB,
      RequestTripDB,
    ]),
  ],
  controllers: [
    AppController,
    UserController,
    SessionController,
    VehicleController,
    DriveController,
    TripController,
    ReviewController,
  ],
  providers: [
    AppService,
    UserService,
    VehicleService,
    DriveService,
    TripService,
    LocationService,
    UtilsService,
    ReviewService,
  ],
})
export class AppModule {}
