import { ApiProperty } from '@nestjs/swagger';
import { UserDB } from '../../database/UserDB';
import { TripDB } from '../../database/TripDB';

export class GetMessageDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  writer: UserDB;

  @ApiProperty()
  trip: TripDB;

  @ApiProperty()
  message: string;

  @ApiProperty()
  read: boolean;

  @ApiProperty()
  timestamp: string;
}
