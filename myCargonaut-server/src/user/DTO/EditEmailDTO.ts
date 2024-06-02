import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditEmailDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  Email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  EmailConfirm: string;
}
