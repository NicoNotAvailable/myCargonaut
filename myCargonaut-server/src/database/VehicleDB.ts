import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  TableInheritance,
} from 'typeorm';
import { UserDB } from './UserDB';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class VehicleDB {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserDB)
  owner: UserDB;

  @Column()
  carPicture: string;

  @Column()
  seats: number;

  @Column()
  weight: number;

  @Column()
  length: number;

  @Column()
  height: number;

  @Column()
  width: number;
}
