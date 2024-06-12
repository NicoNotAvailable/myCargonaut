import { ApiProperty } from '@nestjs/swagger';
import {
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsArray,
    ValidateNested,
    IsBoolean,
    IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TripInfoEnum } from '../../database/enums/TripInfoEnum';
import { CreateCargoDTO } from '../../cargo/DTO/CreateCargoDTO';
import { CreateLocationDTO } from '../../location/DTO/CreateLocationDTO';

export class CreateRequestDTO {
    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    date: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    seats?: number;

    @ApiProperty()
    @IsNotEmpty()
    info: TripInfoEnum;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    smokingAllowed: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    animalsAllowed: boolean;

    @ApiProperty({ type: [CreateCargoDTO] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateCargoDTO)
    cargo: CreateCargoDTO[];

    @ApiProperty({ type: [CreateLocationDTO] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateLocationDTO)
    location: CreateLocationDTO[];
}
