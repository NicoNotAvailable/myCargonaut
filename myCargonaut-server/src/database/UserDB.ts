import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { VehicleDB } from './VehicleDB';
import { TripDB } from './TripDB';
import { ReviewDB } from './ReviewDB';
import { IsEmail, IsPhoneNumber } from 'class-validator';
import { MessageDB } from './MessageDB';
import { DriveDB } from './DriveDB';

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

    @Column({ nullable: true })
    languages: string;

    @Column({ default: false })
    isSmoker: boolean;

    @OneToMany(() => VehicleDB, (vehicle) => vehicle.owner)
    vehicles: Promise<VehicleDB[]>;

    @OneToMany(() => TripDB, (trip) => trip.requesting)
    trips: Promise<TripDB[]>;

    @OneToMany(() => DriveDB, (drive) => drive.user)
    drives: DriveDB[];

    @OneToMany(() => ReviewDB, (review) => review.writer)
    writtenReviews: Promise<ReviewDB[]>;

    @OneToMany(() => MessageDB, (message) => message.writer)
    writtenMessages: Promise<MessageDB[]>;
}
