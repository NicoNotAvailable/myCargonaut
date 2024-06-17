import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TripInfoEnum } from '../../database/enums/TripInfoEnum';
import { PriceTypeEnum } from '../../database/enums/PriceTypeEnum';
import { CreateLocationDTO } from '../../location/DTO/CreateLocationDTO';
import { Type } from 'class-transformer';

export class CreateOfferDTO {
  @ApiProperty({
    description: 'the name of the offer',
    example: 'Fahrt in meinem Tesla',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'the ID of the car that should be used',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  carID: number;

  @ApiProperty({
    description: 'the ID of the trailer that should be used (optional)',
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  trailerID?: number;

  @ApiProperty({
    description: 'the date the offer should take place',
    example: '2024-12-13T18:12:02.549Z',
  })
  @IsNotEmpty()
  date: Date;

  @ApiProperty({
    description: 'the price offered for the offer',
    example: 23,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'the available seats in the car',
    example: 3,
  })
  @IsNumber()
  @IsNotEmpty()
  seats: number;

  @ApiProperty({
    description: 'asks if animals are allowed',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  animalsAllowed: boolean;

  @ApiProperty({
    description: 'asks if smoking is allowed',
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  smokingAllowed: boolean;

  @ApiProperty({
    description: 'the desired vibe of the drive',
    example: TripInfoEnum.music,
  })
  @IsNotEmpty()
  info: TripInfoEnum;

  @ApiProperty({
    description: 'the maximum weight for the car',
    example: 234,
  })
  @IsNumber()
  @IsNotEmpty()
  maxCWeight: number;

  @ApiProperty({
    description: 'the maximum length for the car',
    example: 200,
  })
  @IsNumber()
  @IsNotEmpty()
  maxCLength: number;

  @ApiProperty({
    description: 'the maximum height for the car',
    example: 43,
  })
  @IsNumber()
  @IsNotEmpty()
  maxCHeight: number;

  @ApiProperty({
    description: 'the maximum width for the car',
    example: 142,
  })
  @IsNumber()
  @IsNotEmpty()
  maxCWidth: number;

  @ApiProperty({
    description: 'the maximum length for the trailer',
    example: 400,
  })
  @IsNumber()
  @IsOptional()
  maxTLength?: number;

  @ApiProperty({
    description: 'the maximum weight for the trailer in kg',
    example: 500,
  })
  @IsNumber()
  @IsOptional()
  maxTWeight?: number;

  @ApiProperty({
    description: 'the maximum height for the trailer',
    example: 200,
  })
  @IsNumber()
  @IsOptional()
  maxTHeight?: number;

  @ApiProperty({
    description: 'the maximum width for the trailer',
    example: 53,
  })
  @IsNumber()
  @IsOptional()
  maxTWidth?: number;

  @ApiProperty({
    description: 'determines how the offer is paid',
    example: 2,
  })
  @IsNotEmpty()
  priceType: PriceTypeEnum;

  @ApiProperty({
    type: [CreateLocationDTO],
    description: 'the locations of the drive',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLocationDTO)
  location: CreateLocationDTO[];
}
