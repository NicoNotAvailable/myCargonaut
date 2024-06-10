import { ApiProperty } from '@nestjs/swagger';

export class GetTrailerDTO {
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
    isCooled: boolean;

    @ApiProperty()
    isEnclosed: boolean;
}
