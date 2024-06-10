import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { DriveService } from './drive.service';
import { OkDTO } from '../serverDTO/OkDTO';
import { IsLoggedInGuard } from '../session/is-logged-in.guard';
import { SessionData } from 'express-session';
import { CreateOfferDTO } from './DTO/CreateOfferDTO';
import { VehicleService } from '../vehicle/vehicle.service';

@ApiTags('drive')
@Controller('drive')
export class DriveController {
  constructor(
    private readonly driveService: DriveService,
    private readonly userService: UserService,
    private readonly vehicleService: VehicleService,
  ) {}
  @ApiResponse({
    type: OkDTO,
    description: 'posts an offer into the database',
  })
  @Post('/offer')
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  async createOffer(@Body() body: CreateOfferDTO, @Session() session: SessionData) {
    const user = await this.userService.getUserById(session.currentUser);
    if (!user) {
      throw new BadRequestException('User was not found');
    }
    const car = await this.vehicleService.getCarById(body.carID);
    if (!car) {
      throw new BadRequestException('Car was not found');
    }
    const trailer = await this.vehicleService.getTrailerById(body.trailerID);
    if (!trailer) {
      throw new BadRequestException('User was not found');
    }
    if (!body.name || body.name.trim().length === 0) {
      throw new BadRequestException('Offer name cannot be empty');
    }
    try {
      await this.driveService.createOffer(user, car, trailer, body);
      return new OkDTO(true, 'Offer was created');
    } catch (err) {
      throw new Error('An error occurred' + err);
    }
  }
}
