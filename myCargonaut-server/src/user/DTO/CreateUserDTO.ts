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
    @ApiProperty({
        description: 'Check if AGB ist True',
    })
    @IsBoolean()
    agb: boolean;

    @ApiProperty({
        description: 'The email of the user',
        example: 'test@gmail.com',
    })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Approve of the email of the user',
        example: 'test@gmail.com',
    })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    emailConfirm: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'Passwort1234',
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        description: 'Approve the password of the user',
        example: 'Passwort1234',
    })
    @IsString()
    @IsNotEmpty()
    passwordConfirm: string;

    @ApiProperty({
        description: 'The firstname of the user',
        example: 'firstName',
    })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({
        description: 'The lastName of the user',
        example: 'lastName',
    })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({
        description: 'The birthday of the user',
        example: '2000-06-10T13:04:55.023Z',
    })
    @IsDate()
    @IsNotEmpty()
    birthday: Date;

    @ApiProperty({
        description: 'The birthday of the user',
        example: '1234567890',
    })
    @IsString()
    @Matches(/^[+]?\d{1,3}?[-\s.]?\d{3,14}[-\s.]?\d{3,14}$/, {
        message: 'Invalid phone number',
    })
    phoneNumber: string;
}
