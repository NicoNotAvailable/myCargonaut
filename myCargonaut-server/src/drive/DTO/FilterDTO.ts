import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SortingEnum } from '../../database/enums/SortingEnum';

export class FilterDTO {
  @ApiPropertyOptional({
    description: 'the date of the drive',
    example: '2024-06-13T18:21:15.068Z',
  })
  @IsOptional()
  @IsDateString()
  date?: Date;

  @ApiPropertyOptional({
    description: 'the start location',
    example: 'Hamburg',
  })
  @IsOptional()
  @IsString()
  startLocation?: string;

  @ApiPropertyOptional({
    description: 'the end location',
    example: 'Stuttgart',
  })
  @IsOptional()
  @IsString()
  endLocation?: string;

  @ApiPropertyOptional({
    description: 'filter by min rating',
    example: '3',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minRating?: number;

  @ApiPropertyOptional({
    description: 'decide if you want to sort by rating, time or money',
    example: '1',
  })
  @IsOptional()
  @IsEnum(['timeAsc', 'timeDesc', 'rating', 'price'])
  sort?: SortingEnum;

  @ApiPropertyOptional({
    description: 'number of seats that are required',
    example: '2',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  seats?: number;

  @ApiPropertyOptional({
    description: 'min weight that is required',
    example: '20',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({
    description: 'min height that is required',
    example: '20',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  height?: number;

  @ApiPropertyOptional({
    description: 'min length that is required',
    example: '20',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  length?: number;

  @ApiPropertyOptional({
    description: 'min width that is required',
    example: '20',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  width?: number;
}
