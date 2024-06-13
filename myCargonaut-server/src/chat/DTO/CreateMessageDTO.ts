import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDTO {
  @ApiProperty()
  targetUserId: number;

  @ApiProperty()
  tripId: number;

  @ApiProperty()
  message: string;
}
