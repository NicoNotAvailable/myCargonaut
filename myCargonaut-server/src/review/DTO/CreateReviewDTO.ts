import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateReviewDTO {
  @ApiProperty({ description: 'the id of the trip', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  tripID: number;


  @ApiProperty({ description: 'was the user punctual?', example: 2 })
  @IsNumber()
  @IsNotEmpty()
  punctuality: number;

  @ApiProperty({ description: 'was the ride comfortable?', example: 3 })
  @IsNumber()
  @IsNotEmpty()
  comfort: number;

  @ApiProperty({ description: 'was the user reliable?', example: 2 })
  @IsNumber()
  @IsNotEmpty()
  reliability: number;

  @ApiProperty({ description: 'did the cargo receive any damage?', example: 5 })
  @IsNumber()
  damage: number;

  @ApiProperty({ description: 'optional description', example: "der Fahrer hat komische Musik gehört :/" })
  @IsNumber()
  text: string;
}
