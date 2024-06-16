import { ApiProperty } from '@nestjs/swagger';

export class GetMessageDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  writerId: number;

  @ApiProperty()
  tripId: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  read: boolean;

  @ApiProperty()
  timestamp: string;
}
