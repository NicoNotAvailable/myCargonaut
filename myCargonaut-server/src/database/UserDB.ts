import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    Index,
    BeforeUpdate,
    BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { VehicleDB } from './VehicleDB';
import { TripDB } from './TripDB';
import { ReviewDB } from './ReviewDB';
import { IsEmail, IsPhoneNumber } from 'class-validator';
import { ChatDB } from './ChatDB';

@Entity()
export class UserDB {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: true })
    @IsEmail()
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    birthday: Date;

    @Column({ nullable: true })
    @IsPhoneNumber()
    phoneNumber: string;

    @Column({ default: 'empty.png' })
    profilePic: string;

    @Column({ nullable: true })
    profileText: string;

    @OneToMany(() => VehicleDB, (car) => car.owner)
    cars: Promise<VehicleDB[]>;

    @OneToMany(() => TripDB, (trip) => trip.offering)
    offers: Promise<TripDB[]>;

    @OneToMany(() => TripDB, (trip) => trip.requesting)
    requests: Promise<TripDB[]>;

    @OneToMany(() => ReviewDB, (review) => review.writer)
    writtenReviews: Promise<ReviewDB[]>;

    @OneToMany(() => ChatDB, (chat) => chat.writer)
    writtenChats: Promise<ChatDB[]>;

    @OneToMany(() => ChatDB, (chat) => chat.receiver)
    receivedChats: Promise<ChatDB[]>;
}
