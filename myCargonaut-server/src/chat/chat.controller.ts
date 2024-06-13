import {
  Controller,
  Post,
  Body,
  ParseIntPipe,
  NotFoundException,
  Session,
  BadRequestException,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateMessageDTO } from './DTO/CreateMessageDTO';
import { SessionData } from 'express-session';

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
    status: 200,
    description: 'Joined the chat room successfully.',
  })
  async joinRoom(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('targetUserId', ParseIntPipe) targetUserId: number,
  ): Promise<void> {
    const roomName = this.chatGateway.getRoomName(userId, targetUserId);
    const socket =
      this.chatGateway.server.sockets.sockets.get('user_${userId}');

    if (!socket) {
      throw new NotFoundException('Socket not found for the user.');
    }

    socket.join(roomName);
    this.chatGateway.server
      .to(roomName)
      .emit('message', 'User ${userId} joined room ${roomName}');
  }

  @Post('message')
  @ApiOperation({ summary: 'Send a message to a chat room and database' })
  @ApiResponse({ status: 200, description: 'Message sent successfully.' })
  async sendMessage(
    @Body() body: CreateMessageDTO,
    @Session() session: SessionData,
  ): Promise<void> {
    const dto = new CreateMessageDTO();
    const userId = session.currentUser;

    if (!userId) {
      throw new BadRequestException('User not logged in.');
    }

    dto.targetUserId = body.targetUserId;
    dto.tripId = body.tripId;
    dto.message = body.message;
    const roomName = this.chatGateway.getRoomName(userId, body.targetUserId);
    await this.chatService.createMessage(userId, body.tripId, body.message);
    this.chatGateway.server.to(roomName).emit('message', body.message);
  }
}
