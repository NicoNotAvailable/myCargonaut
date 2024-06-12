import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLocationDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    country: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    zipCode: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    city: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    stop: number;
}
