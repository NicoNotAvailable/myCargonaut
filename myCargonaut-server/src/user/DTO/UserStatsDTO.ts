import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserStatsDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  offeredDrives: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  takenDrives: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  totalDrives: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  distanceDriven: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  totalPassengers: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  highestWeight: number;
}
