import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserDB } from './UserDB';
import { TripDB } from './TripDB';

@Entity()
export class ChatDB {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserDB)
    writer: UserDB;

    @ManyToOne(() => UserDB)
    receiver: UserDB;

    @ManyToOne(() => TripDB)
    trip: TripDB;

    @Column()
    message: string;

    @Column()
    read: boolean;

    @Column({ default: new Date().toISOString() })
    timestamp: string;
}
