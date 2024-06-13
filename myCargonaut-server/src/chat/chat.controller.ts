import { Controller, Post, Body, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateMessageDto } from './DTO/CreateMessageDTO';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}
}