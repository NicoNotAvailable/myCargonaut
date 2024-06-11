import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditEmailDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    newEmail: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    newEmailConfirm: string;
}
