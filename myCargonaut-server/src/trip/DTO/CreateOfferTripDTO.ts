import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateCargoDTO } from '../../cargo/DTO/CreateCargoDTO';
import { Type } from 'class-transformer';

export class CreateOfferTripDTO {
  @ApiProperty()
  @IsNotEmpty()
  startLocationID: number;

  @ApiProperty()
  @IsNotEmpty()
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
