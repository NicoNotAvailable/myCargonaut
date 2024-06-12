import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLocationDTO {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    stopNr: number;

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
}
