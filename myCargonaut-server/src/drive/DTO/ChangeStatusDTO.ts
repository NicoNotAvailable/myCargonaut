import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { StatusEnum } from '../../database/enums/StatusEnum';

export class ChangeStatusDTO {
  @ApiProperty({ description: 'the new status of the offer', example: 1 })
  @IsNotEmpty()
  newStatus: StatusEnum;
}
