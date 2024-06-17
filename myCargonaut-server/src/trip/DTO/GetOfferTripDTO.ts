import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    ValidateNested,
} from 'class-validator';
import { GetOtherUserDTO } from '../../user/DTO/GetOtherUserDTO';
import { CreateCargoDTO } from '../../cargo/DTO/CreateCargoDTO';
import { Type } from 'class-transformer';
import { CreateLocationDTO } from '../../location/DTO/CreateLocationDTO';

export class GetOfferTripDTO {
    @ApiProperty({ description: 'the ID of the request trip', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @ApiProperty({ description: 'the required seats', example: 2 })
    @IsNumber()
    @IsNotEmpty()
    driveID: number;

    @ApiProperty({
        description: 'the user thats requesting the trip',
    })
    requesting: GetOtherUserDTO;

    @ApiProperty({
        description: 'the id of the desired start location',
    })
    @IsNotEmpty()
    startLocation: CreateLocationDTO;

    @ApiProperty({
        description: 'the id of the desired end location',
    })
    @IsNotEmpty()
    endLocation: CreateLocationDTO;

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
