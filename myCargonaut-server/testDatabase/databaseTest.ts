import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { UserDB } from '../src/database/UserDB';
import { CarDB } from '../src/database/CarDB';
import { LocationDB } from '../src/database/LocationDB';
import { ReviewDB } from '../src/database/ReviewDB';
import { TrailerDB } from '../src/database/TrailerDB';
import { TripDB } from '../src/database/TripDB';
import { VehicleDB } from '../src/database/VehicleDB';
import { ChatDB } from '../src/database/ChatDB';
import { RequestDB } from '../src/database/RequestDB';

export const tables: EntityClassOrSchema[] = [
  UserDB,
  CarDB,
  LocationDB,
  ReviewDB,
  TrailerDB,
  TripDB,
  VehicleDB,
  ChatDB,
  RequestDB,
];

export const databaseTest = (path: string) => {
  return TypeOrmModule.forRoot({
    type: 'sqlite',
    database: path,
    entities: tables,
    synchronize: true,
  });
};
