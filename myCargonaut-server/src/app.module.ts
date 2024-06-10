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
import { RequestDB } from './database/RequestDB';
import { VehicleService } from './vehicle/vehicle.service';
import { VehicleController } from './vehicle/vehicle.controller';
import { CargoDB } from './database/CargoDB';
import { DriveDB } from './database/DriveDB';
import { OfferDB } from './database/OfferDB';
import { OfferTripDB } from './database/OfferTripDB';
import { RequestTripDB } from './database/RequestTripDB';

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
  ],
  providers: [AppService, UserService, VehicleService],
})
export class AppModule {}
