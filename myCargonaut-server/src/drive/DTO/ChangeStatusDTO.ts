import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { StatusEnum } from '../../database/enums/StatusEnum';

export class ChangeStatusDTO {
  @ApiProperty({ description: 'the new status of the offer', example: 1 })
  @IsNotEmpty()
  newStatus: StatusEnum;
}
