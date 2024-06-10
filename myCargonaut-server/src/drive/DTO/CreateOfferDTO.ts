import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TripInfoEnum } from '../../database/enums/TripInfoEnum';
import { PriceTypeEnum } from '../../database/enums/PriceTypeEnum';

export class CreateOfferDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  seats: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  animalsAllowed: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  smokingAllowed: boolean;

  @ApiProperty()
  @IsNotEmpty()
  info: TripInfoEnum;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  maxCWeight: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  maxCLength: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  maxCHeight: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  maxCWidth: number;

  @ApiProperty()
  @IsNumber()
  maxTLength: number;

  @ApiProperty()
  @IsNumber()
  maxTWeight: number;

  @ApiProperty()
  @IsNumber()
  maxTHeight: number;

  @ApiProperty()
  @IsNumber()
  maxTWidth: number;

  @ApiProperty()
  @IsNotEmpty()
  priceType: PriceTypeEnum;
}
