import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    TableInheritance,
} from 'typeorm';
import { UserDB } from './UserDB';
import { ReviewDB } from './ReviewDB';
import { MessageDB } from './MessageDB';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class TripDB {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserDB)
    requesting: UserDB;

    @OneToMany(() => ReviewDB, (review) => review.trip, { onDelete: 'CASCADE' })
    reviews: Promise<ReviewDB[]>;

    @OneToMany(() => MessageDB, (message) => message.trip ,{ onDelete: 'CASCADE' })
    messages: Promise<MessageDB[]>;
}
