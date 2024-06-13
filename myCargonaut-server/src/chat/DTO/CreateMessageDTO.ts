import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  targetUserId: number;

  @ApiProperty()
  tripId: number;

  @ApiProperty()
  message: string;
}