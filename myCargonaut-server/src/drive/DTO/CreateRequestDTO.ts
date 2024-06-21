import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TripInfoEnum } from '../../database/enums/TripInfoEnum';
import { CreateCargoDTO } from '../../cargo/DTO/CreateCargoDTO';
import { CreateLocationDTO } from '../../location/DTO/CreateLocationDTO';

export class CreateRequestDTO {
  @ApiProperty({
    description: 'the date of the drive',
    example: '2024-06-13T18:21:15.068Z',
  })
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({
    description: 'the name of the request',
    example: 'Fahr mich bitte nach Gießen <3',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'the offered price for the request',
    example: 42,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'the required seats for the drive',
    example: 3,
  })
  @IsNumber()
  @IsOptional()
  seats?: number;

  @ApiProperty({
    description: 'the desired vibe for the drive',
    example: TripInfoEnum.adapting,
  })
  @IsNotEmpty()
  info: TripInfoEnum;

  @ApiProperty({
    description: 'is smoking desired?',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  smokingAllowed: boolean;

  @ApiProperty({
    description: 'are animals on board?',
    example: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  animalsAllowed: boolean;

  @ApiProperty({
    type: [CreateCargoDTO],
    description: 'the cargo thats taken on the drive',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCargoDTO)
  cargo: CreateCargoDTO[];

  @ApiProperty({
    type: [CreateLocationDTO],
    description: 'the locations for the drive',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLocationDTO)
  location: CreateLocationDTO[];
}
