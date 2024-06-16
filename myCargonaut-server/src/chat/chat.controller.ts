import {
  Controller,
  Post,
  Body,
  ParseIntPipe,
  NotFoundException,
  Session,
  BadRequestException,
  Get,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateMessageDTO } from './DTO/CreateMessageDTO';
import { SessionData } from 'express-session';
import { OkDTO } from '../serverDTO/OkDTO';
import { GetMessageDTO } from './DTO/GetMessageDTO';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Post('join')
  @ApiOperation({ summary: 'Join a chat room' })
  @ApiResponse({
    type: OkDTO,
    description: 'Joined the chat room successfully.',
  })
  async joinRoom(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('targetUserId', ParseIntPipe) targetUserId: number,
  ): Promise<OkDTO> {
    const roomName = this.chatGateway.getRoomName(userId, targetUserId);
    const socket =
      this.chatGateway.server.sockets.sockets.get('user_${userId}');

    if (!socket) {
      throw new NotFoundException('Socket not found for the user.');
    }

    try {
      socket.join(roomName);
      this.chatGateway.server
        .to(roomName)
        .emit('message', 'User ${userId} joined room ${roomName}');
      return new OkDTO(true, 'User joined room');
    } catch (err) {
      throw new Error(err);
    }
  }

  @Post('message')
  @ApiOperation({ summary: 'Send a message to a chat room and database' })
  @ApiResponse({
    type: CreateMessageDTO,
    description: 'Message sent successfully.',
  })
  async sendMessage(
    @Body() body: CreateMessageDTO,
    @Session() session: SessionData,
  ): Promise<CreateMessageDTO> {
    const dto = new CreateMessageDTO();
    const userId = session.currentUser;

    if (!userId) {
      throw new BadRequestException('User not logged in.');
    }

    dto.targetUserId = body.targetUserId;
    dto.tripId = body.tripId;
    dto.message = body.message;
    const roomName = this.chatGateway.getRoomName(userId, body.targetUserId);
    try {
      await this.chatService.createMessage(userId, body.tripId, body.message);
      this.chatGateway.server.to(roomName).emit('message', body.message);
      return dto;
    } catch (err) {
      throw new Error(err);
    }
  }

  @Get('messages')
  @ApiOperation({ summary: 'Get all messages between users for a trip' })
  @ApiResponse({
    type: [GetMessageDTO],
    description: 'Messages retrieved successfully.',
  })
  async getMessages(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('targetUserId', ParseIntPipe) targetUserId: number,
    @Query('tripId', ParseIntPipe) tripId: number,
    @Session() session: SessionData,
  ): Promise<GetMessageDTO[]> {
    const sessionUserId = session.currentUser;

    if (!sessionUserId) {
      throw new BadRequestException('User not logged in.');
    }

    if (sessionUserId !== userId) {
      throw new BadRequestException('Invalid user ID.');
    }

    try {
      const messages = await this.chatService.getMessages(
        userId,
        targetUserId,
        tripId,
      );
      return messages.map((msg) => {
        const dto = new GetMessageDTO();
        dto.id = msg.id;
        dto.writerId = msg.writer.id;
        dto.tripId = msg.trip.id;
        dto.message = msg.message;
        dto.read = msg.read;
        dto.timestamp = msg.timestamp;
        return dto;
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}