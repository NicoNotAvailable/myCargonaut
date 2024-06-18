import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetOwnUserDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  profilePic: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  birthday: Date;

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
  @IsString()
  @Matches(/^[+]?\d{1,3}?[-\s.]?\d{3,14}[-\s.]?\d{3,14}$/, {
    message: 'Invalid phone number',
  })
  phoneNumber: string;
}
