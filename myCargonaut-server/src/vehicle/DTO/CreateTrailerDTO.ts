import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrailerDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  weight: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  length: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  height: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  width: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isCooled: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isEnclosed: boolean;
}
