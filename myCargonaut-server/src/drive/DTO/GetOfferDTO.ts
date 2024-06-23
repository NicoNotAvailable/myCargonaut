import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TripInfoEnum } from '../../database/enums/TripInfoEnum';
import { PriceTypeEnum } from '../../database/enums/PriceTypeEnum';
import { CreateLocationDTO } from '../../location/DTO/CreateLocationDTO';
import { Type } from 'class-transformer';
import { GetOtherUserDTO } from '../../user/DTO/GetOtherUserDTO';
import { StatusEnum } from '../../database/enums/StatusEnum';

export class GetOfferDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user: GetOtherUserDTO;

  @ApiProperty()
  carID: number;

  @ApiProperty()
  carPicture: string;

  @ApiProperty()
  trailerID?: number;

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
  maxCWeight: number;

  @ApiProperty()
  maxCLength: number;

  @ApiProperty()
  maxCHeight: number;

  @ApiProperty()
  maxCWidth: number;

  @ApiProperty()
  maxTLength?: number;

  @ApiProperty()
  maxTWeight?: number;

  @ApiProperty()
  maxTHeight?: number;

  @ApiProperty()
  maxTWidth?: number;

  @ApiProperty()
  priceType: PriceTypeEnum;

  @ApiProperty()
  status: StatusEnum;

  @ApiProperty({ type: [CreateLocationDTO] })
  @ValidateNested({ each: true })

  @Type(() => CreateLocationDTO)
  locations: CreateLocationDTO[];
}
