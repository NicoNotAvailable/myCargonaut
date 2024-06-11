import { ApiProperty } from '@nestjs/swagger';

export class GetCarDTO {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    weight: number;

    @ApiProperty()
    length: number;

    @ApiProperty()
    height: number;

    @ApiProperty()
    width: number;

    @ApiProperty()
    seats: number;

    @ApiProperty()
    hasAC: boolean;

    @ApiProperty()
    hasTelevision: boolean;

    @ApiProperty()
    carPicture: string;
}
