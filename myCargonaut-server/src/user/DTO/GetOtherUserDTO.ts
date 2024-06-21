import {
  IsBoolean,
  IsNotEmpty, IsNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetOtherUserDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  profilePic: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.charAt(0) + '.')
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.charAt(0) + '.')
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  languages: string;

  @ApiProperty()
  @IsString()
  profileText: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isSmoker: boolean;

  @ApiProperty()
  @IsNumber()
  rating: number;
}
