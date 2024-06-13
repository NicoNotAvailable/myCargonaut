import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateRequestTripDTO {
    @ApiProperty({ description: 'the required seats', example: 2 })
    @IsNumber()
    @IsNotEmpty()
    driveID: number;

    @ApiProperty({ description: 'the car that should be taken', example: 1 })
    @IsNotEmpty()
    @IsNumber()
    carID: number;

    @ApiProperty({
        description: 'the trailer that should be taken',
        example: 2,
    })
    @IsOptional()
    @IsNumber()
    trailerID: number;
}
