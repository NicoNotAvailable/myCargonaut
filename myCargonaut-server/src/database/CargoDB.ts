import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { OfferTripDB } from './OfferTripDB';
import { RequestDB } from './DriveDB';

@Entity()
export class CargoDB {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RequestDB, (request) => request.cargo, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  request: RequestDB;

  @ManyToOne(() => OfferTripDB, (offerTrip) => offerTrip.cargo, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  offerTrip: OfferTripDB;
  @Column()
  description: string;

  @Column()
  weight: number;

  @Column()
  length: number;

  @Column()
  height: number;

  @Column()
  width: number;
}
