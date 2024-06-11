import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TripInfoEnum } from '../../database/enums/TripInfoEnum';
import { PriceTypeEnum } from '../../database/enums/PriceTypeEnum';

export class CreateOfferDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  carID: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  trailerID?: number;

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
  @IsOptional()
  maxTLength?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  maxTWeight?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  maxTHeight?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  maxTWidth?: number;

  @ApiProperty()
  @IsNotEmpty()
  priceType: PriceTypeEnum;
}
