import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { GetOtherUserDTO } from '../../user/DTO/GetOtherUserDTO';

export class GetReviewDTO {

  @ApiProperty({ description: 'the rating of the review', example: 2 })
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @ApiProperty()
  writer: GetOtherUserDTO;

  @ApiProperty({ description: 'optional description', example: "der Fahrer hat komische Musik gehört :/" })
  @IsNumber()
  text: string;
}