import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDB } from '../database/UserDB';
import { MessageDB } from '../database/MessageDB';
import { TripDB } from '../database/TripDB';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(MessageDB)
    private readonly messageRepository: Repository<MessageDB>,
    @InjectRepository(UserDB)
    private readonly userRepository: Repository<UserDB>,
    @InjectRepository(TripDB)
    private readonly tripRepository: Repository<TripDB>,
  ) {}

  async createMessage(
    userId: number,
    tripId: number,
    message: string,
  ): Promise<MessageDB> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const trip = await this.tripRepository.findOne({ where: { id: tripId } });

    if (!user || !trip) {
      throw new NotFoundException('Nutzer oder Trip nicht gefunden.');
    }

    const newMessage = this.messageRepository.create({
      writer: user,
      trip: trip,
      message: message,
      read: false,
      timestamp: new Date().toISOString(),
    });

    return this.messageRepository.save(newMessage);
  }

  async getMessages(
    userId: number,
    targetUserId: number,
    tripId: number,
  ): Promise<MessageDB[]> {
    const messages = await this.messageRepository.find({
      where: [
        { writer: { id: userId }, trip: { id: tripId } },
        { writer: { id: targetUserId }, trip: { id: tripId } },
      ],
      order: { timestamp: 'ASC' },
      relations: ['writer', 'trip'],
    });

    if (!messages) {
      throw new NotFoundException('Messages not found');
    }
    return messages;
  }

  async markMessageAsRead(
    messageId: number,
    read: boolean,
  ): Promise<MessageDB | undefined> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
    });
    if (!message) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }
    message.read = read;
    await this.messageRepository.save(message);
    return message;
  }
}
