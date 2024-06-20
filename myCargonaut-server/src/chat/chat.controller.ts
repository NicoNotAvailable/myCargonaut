import {
  Controller,
  Post,
  Body,
  ParseIntPipe,
  Session,
  BadRequestException,
  Get,
  Query,
  Put,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { SocketGateway } from '../socket.gateway';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { CreateMessageDTO } from './DTO/CreateMessageDTO';
import { SessionData } from 'express-session';
import { GetMessageDTO } from './DTO/GetMessageDTO';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly socketGateway: SocketGateway,
  ) {}

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

    dto.tripId = body.tripId;
    dto.message = body.message;
    try {
      await this.chatService.createMessage(userId, body.tripId, body.message);
      return dto;
    } catch (err) {
      throw new Error(err);
    }
  }

  @Get('messages/:tripId')
  @ApiOperation({ summary: 'Get all messages between users for a trip' })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully.',
    type: 'object',
  })
  async getMessages(
    @Session() session: SessionData,
    @Param('tripId', ParseIntPipe) tripId: number,
  ): Promise<GetMessageDTO[]> {
    const sessionUserId = session.currentUser;

    if (!sessionUserId) {
      throw new BadRequestException('User not logged in.');
    }

    console.log('HALLOOOOOOOOOOOOOOOO');

    try {
      const messages = await this.chatService.getMessages(tripId);
      return messages.map((msg) => {
        const dto = new GetMessageDTO();
        dto.id = msg.id;
        dto.writer = msg.writer;
        dto.trip = msg.trip;
        dto.message = msg.message;
        dto.read = msg.read;
        dto.timestamp = msg.timestamp;
        return dto;
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  @Put('message/:id')
  @ApiOperation({ summary: 'Mark a message as read' })
  @ApiParam({ name: 'id', description: 'Message ID' })
  @ApiBody({ description: 'Set read status', type: Boolean })
  async markMessageAsRead(
    @Param('id') messageId: number,
    @Body() updateMessageDto: { read: boolean },
  ): Promise<void> {
    const message = await this.chatService.markMessageAsRead(
      messageId,
      updateMessageDto.read,
    );
    if (!message) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }
  }
}
