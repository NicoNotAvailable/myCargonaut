import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TripInfoEnum } from '../../database/enums/TripInfoEnum';
import { PriceTypeEnum } from '../../database/enums/PriceTypeEnum';
import { CreateLocationDTO } from '../../location/DTO/CreateLocationDTO';
import { Type } from 'class-transformer';
import { GetOtherUserDTO } from '../../user/DTO/GetOtherUserDTO';
import { CreateCargoDTO } from '../../cargo/DTO/CreateCargoDTO';
import {StatusEnum} from "../../database/enums/StatusEnum";

export class GetRequestDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user: GetOtherUserDTO;

  @ApiProperty()
  name: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  price: number;

  @ApiProperty()
  seats: number;

  @ApiProperty()
  animalsAllowed: boolean;

  @ApiProperty()
  smokingAllowed: boolean;

  @ApiProperty()
  info: TripInfoEnum;

  @ApiProperty()
  priceType: PriceTypeEnum;

  @ApiProperty()
  status: StatusEnum;

  @ApiProperty({ type: [CreateLocationDTO] })
  @ValidateNested({ each: true })
  @Type(() => CreateLocationDTO)
  locations: CreateLocationDTO[];

  @ApiProperty({ type: [CreateCargoDTO] })
  @ValidateNested({ each: true })
  @Type(() => CreateCargoDTO)
  cargo: CreateCargoDTO[];
}
