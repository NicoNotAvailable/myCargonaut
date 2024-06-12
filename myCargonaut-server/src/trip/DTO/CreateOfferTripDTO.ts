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
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    driveID: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    startLocationID: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    endLocationID: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    usedSeats: number;

    @ApiProperty({ type: [CreateCargoDTO] })
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateCargoDTO)
    cargo: CreateCargoDTO[];
}
