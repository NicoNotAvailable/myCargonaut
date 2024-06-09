import {
    IsBoolean,
    IsDate,
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
    @ApiProperty()
    @IsBoolean()
    agb: boolean;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    emailConfirm: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    passwordConfirm: string;

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
    @Matches(/^[+]?\d{1,3}?[-\s.]?\d{3,14}[-\s.]?\d{3,14}$/, {
        message: 'Invalid phone number',
    })
    phoneNumber: string;
}
