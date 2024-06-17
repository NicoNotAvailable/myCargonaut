import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { GetTrailerDTO } from '../../vehicle/DTO/GetTrailerDTO';
import { GetCarDTO } from '../../vehicle/DTO/GetCarDTO';
import { GetOtherUserDTO } from '../../user/DTO/GetOtherUserDTO';

export class GetRequestTripDTO {
  @ApiProperty({ description: 'the ID of the request trip', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ description: 'the required seats', example: 2 })
  @IsNumber()
  @IsNotEmpty()
  driveID: number;

  @ApiProperty({ description: 'the car that should be taken', example: 1 })
  @IsNotEmpty()
  car: GetCarDTO;

  @ApiProperty({
    description: 'the trailer that should be taken',
  })
  @IsOptional()
  trailer: GetTrailerDTO;

  @ApiProperty({
    description: 'the user thats requesting the trip',
  })
  requesting: GetOtherUserDTO;
}
