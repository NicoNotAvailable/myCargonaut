import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({
    description: 'E-Mail of the user that wants to log in',
    example: 'test@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'password of the user that wants to log in',
    example: 'Passwort1234',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
