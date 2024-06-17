import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCargoDTO {
    @ApiProperty({
        description: 'the name of the cargo',
        example: 'Mein fettes Klavier',
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: 'the weight of the cargo', example: 300 })
    @IsNumber()
    @IsNotEmpty()
    weight: number;

    @ApiProperty({ description: 'the length of the cargo', example: 232 })
    @IsNumber()
    @IsNotEmpty()
    length: number;

    @ApiProperty({ description: 'the height of the cargo', example: 123 })
    @IsNumber()
    @IsNotEmpty()
    height: number;

    @ApiProperty({ description: 'the width of the cargo', example: 65 })
    @IsNumber()
    @IsNotEmpty()
    width: number;
}
