import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    weight: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    length: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    height: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    width: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    seats: number;

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    hasAC: boolean;

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    hasTelevision: boolean;
}
