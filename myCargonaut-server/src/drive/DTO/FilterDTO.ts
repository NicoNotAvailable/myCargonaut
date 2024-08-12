import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterDTO {
  @ApiProperty({
    description: 'the date of the drive',
    example: '2024-06-13T18:21:15.068Z',
  })
  @IsOptional()
  @IsDateString()
  date?: Date;

  @ApiProperty({
    description: 'the start location',
    example: 'Hamburg',
  })
  @IsOptional()
  @IsString()
  startLocation?: string;

  @ApiProperty({
    description: 'the end location',
    example: 'Stuttgart',
  })
  @IsOptional()
  @IsString()
  endLocation?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minRating?: number;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortRating?: 'ASC' | 'DESC';

  @IsOptional()
  @IsNumber()
  @Min(0)
  seats?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  height?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  length?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  width?: number;
}
