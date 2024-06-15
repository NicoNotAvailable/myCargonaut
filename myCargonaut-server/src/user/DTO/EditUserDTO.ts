import {
  IsBoolean,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditUserDTO {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsPhoneNumber()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  profileText: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  languages: string;

  @ApiProperty()
  @IsBoolean()
  isSmoker: boolean;
}
