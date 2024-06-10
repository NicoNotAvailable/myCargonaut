import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { RequestDB } from './RequestDB';
import { OfferTripDB } from './OfferTripDB';

@Entity()
export class CargoDB {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RequestDB, (request) => request.cargo, { nullable: true })
  request: RequestDB;

  @ManyToOne(() => OfferTripDB, (offerTrip) => offerTrip.cargo, {
    nullable: true,
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
