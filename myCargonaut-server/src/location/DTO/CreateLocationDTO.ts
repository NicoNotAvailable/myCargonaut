import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLocationDTO {
  @ApiProperty({ description: 'the stop of the location', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  stopNr: number;

  @ApiProperty({
    description: 'the country of the location',
    example: 'Gondor',
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    description: 'the zipcode of the location',
    example: 973162,
  })
  @IsNumber()
  @IsNotEmpty()
  zipCode: number;

  @ApiProperty({
    description: 'the city of the location',
    example: 'Minas Tirith',
  })
  @IsString()
  @IsNotEmpty()
  city: string;
}
