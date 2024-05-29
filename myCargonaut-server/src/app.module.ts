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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './db.sqlite',
      entities: [
        UserDB,
        CarDB,
        LocationDB,
        ReviewDB,
        TrailerDB,
        TripDB,
        VehicleDB,
      ],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      UserDB,
      CarDB,
      LocationDB,
      ReviewDB,
      TrailerDB,
      TripDB,
      VehicleDB,
    ]),
  ],
  controllers: [AppController, UserController, SessionController],
  providers: [AppService, UserService],
})
export class AppModule {}
