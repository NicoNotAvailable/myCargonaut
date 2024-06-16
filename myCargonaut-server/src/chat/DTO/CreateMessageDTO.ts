import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDTO {
  @ApiProperty({ description: 'user who receives message', example: '1' })
  targetUserId: number;

  @ApiProperty({ description: 'trip', example: '1' })
  tripId: number;

  @ApiProperty({ description: 'message', example: 'hello, this is a message!' })
  message: string;
}
