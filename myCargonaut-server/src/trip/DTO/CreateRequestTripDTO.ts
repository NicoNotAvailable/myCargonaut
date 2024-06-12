import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';


export class CreateRequestTripDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  driveID: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  carID: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  trailerID: number;
}
