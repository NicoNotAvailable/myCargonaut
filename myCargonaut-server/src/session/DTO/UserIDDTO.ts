import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserIDDTO {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    id: number;

    constructor(number: number) {
        this.id = number;
    }
}
