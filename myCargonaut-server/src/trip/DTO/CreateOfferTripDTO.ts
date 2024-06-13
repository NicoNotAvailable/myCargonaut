import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    ValidateNested,
} from 'class-validator';
import { CreateCargoDTO } from '../../cargo/DTO/CreateCargoDTO';
import { Type } from 'class-transformer';

export class CreateOfferTripDTO {
    @ApiProperty({ description: 'the id of the desired offer', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    driveID: number;

    @ApiProperty({
        description: 'the id of the desired start location',
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    startLocationID: number;

    @ApiProperty({
        description: 'the id of the desired end location',
        example: 2,
    })
    @IsNotEmpty()
    @IsNumber()
    endLocationID: number;

    @ApiProperty({ description: 'the required seats', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    usedSeats: number;

    @ApiProperty({
        type: [CreateCargoDTO],
        description: 'the cargo thats to be taken',
    })
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateCargoDTO)
    cargo: CreateCargoDTO[];
}
