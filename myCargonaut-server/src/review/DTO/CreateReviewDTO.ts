import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsNumber, IsString} from 'class-validator';


export class CreateReviewDTO {
  @ApiProperty({ description: 'the id of the trip', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  tripID: number;

  @ApiProperty({ description: 'was the user punctual?', example: 2 })
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @ApiProperty({
    description: 'optional description',
    example: 'der Fahrer hat komische Musik gehört :/',
  })

  @IsString()
  text: string;
}
