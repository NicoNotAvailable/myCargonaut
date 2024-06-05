import {Body, Controller, Post, Session, UseGuards} from '@nestjs/common';
import {VehicleService} from "./vehicle.service";
import {UserService} from "../user/user.service";
import {ApiBearerAuth, ApiResponse} from "@nestjs/swagger";
import {OkDTO} from "../serverDTO/OkDTO";
import {IsLoggedInGuard} from "../session/is-logged-in.guard";
import {CreateCarDTO} from "./DTO/CreateCarDTO";
import {SessionData} from "express-session";

@Controller('vehicle')
export class VehicleController {
    constructor(
        private readonly vehicleService: VehicleService,
        private readonly userService: UserService,
    ) {}

    @ApiResponse({
        type: OkDTO,
        description: 'posts a car into the database',
    })
    @Post('/car')
    @ApiBearerAuth()
    @UseGuards(IsLoggedInGuard)
    async createGame(@Body() body: CreateCarDTO, @Session() session: SessionData) {
        const owner = await this.userService.getUserById(session.currentUser)

        try {
            await this.vehicleService.createCar(
                owner,
                body.name.trim(),
                body.weight,
                body.length,
                body.height,
                body.width,
                body.seats,
                body.hasAC,
                body.hasTelevision,
            );
            return new OkDTO(true, 'Car was created');
        } catch (err) {
            throw err;
        }
    }
}
