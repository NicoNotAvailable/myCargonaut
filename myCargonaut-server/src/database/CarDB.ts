import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { TypeEnum } from './enums/TypeEnum';
import { UserDB } from './UserDB';

@Entity()
export class CarDB {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserDB)
  owner: UserDB;

  @Column()
  type: TypeEnum;

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
