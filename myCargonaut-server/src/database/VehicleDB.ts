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
  name: string;

  @Column()
  weight: number;

  @Column()
  length: number;

  @Column()
  height: number;

  @Column()
  width: number;
}
