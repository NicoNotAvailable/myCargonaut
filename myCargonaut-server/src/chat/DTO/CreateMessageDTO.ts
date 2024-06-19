import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDTO {
  @ApiProperty({ description: 'trip', example: '1' })
  tripId: number;

  @ApiProperty({ description: 'message', example: 'hello, this is a message!' })
  message: string;

  @ApiProperty({ description: 'writer', example: '1' })
  writer: number;
}
