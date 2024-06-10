import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { UserDB } from '../src/database/UserDB';
import { CarDB } from '../src/database/CarDB';
import { LocationDB } from '../src/database/LocationDB';
import { ReviewDB } from '../src/database/ReviewDB';
import { TrailerDB } from '../src/database/TrailerDB';
import { TripDB } from '../src/database/TripDB';
import { VehicleDB } from '../src/database/VehicleDB';
import { MessageDB } from '../src/database/MessageDB';
import { CargoDB } from '../src/database/CargoDB';
import { DriveDB, OfferDB, RequestDB } from '../src/database/DriveDB';
import { OfferTripDB } from '../src/database/OfferTripDB';
import { RequestTripDB } from '../src/database/RequestTripDB';

export const tables: EntityClassOrSchema[] = [
  UserDB,
  CarDB,
  LocationDB,
  ReviewDB,
  TrailerDB,
  TripDB,
  VehicleDB,
  MessageDB,
  RequestDB,
  CargoDB,
  DriveDB,
  OfferDB,
  OfferTripDB,
  RequestTripDB,
];

export const databaseTest = (path: string) => {
  return TypeOrmModule.forRoot({
    type: 'sqlite',
    database: path,
    entities: tables,
    synchronize: true,
  });
};
