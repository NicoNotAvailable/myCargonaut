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
import { CreateRequestDTO } from './DTO/CreateRequestDTO';

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
  async createOffer(
    @Body() body: CreateOfferDTO,
    @Session() session: SessionData,
  ) {
    const user = await this.userService.getUserById(session.currentUser);
    if (!user) {
      throw new BadRequestException('User was not found');
    }
    if (user.profilePic == 'empty.png') {
      throw new BadRequestException(
        'You need a profile pic to upload an offer',
      );
    }
    if (!user.phoneNumber) {
      throw new BadRequestException('You need a phone number');
    }
    const car = await this.vehicleService.getCarById(body.carID);
    if (!car) {
      throw new BadRequestException('Car was not found');
    }
    let trailer = null;
    if (body.trailerID) {
      trailer = await this.vehicleService.getTrailerById(body.trailerID);
      if (!trailer) {
        throw new BadRequestException('Trailer was not found');
      }
    }
    if (!body.name || body.name.trim().length === 0) {
      throw new BadRequestException('Offer name cannot be empty');
    }
    if (body.maxCWeight < 1 || body.maxCWeight > 1000) {
      throw new BadRequestException(
        'Max car weight must be between 1 and 10000',
      );
    }
    if (body.maxCLength < 1 || body.maxCLength > 1000) {
      throw new BadRequestException(
        'Max car length must be between 1 and 1000',
      );
    }
    if (body.maxCHeight < 1 || body.maxCHeight > 1000) {
      throw new BadRequestException(
        'Max car height must be between 1 and 1000',
      );
    }
    if (body.maxCWidth < 1 || body.maxCWidth > 1000) {
      throw new BadRequestException('Max car width must be between 1 and 1000');
    }
    if (
      body.maxTLength !== undefined &&
      (body.maxTLength < 1 || body.maxTLength > 1000)
    ) {
      throw new BadRequestException(
        'Max trailer length must be between 1 and 1000',
      );
    }
    if (
      body.maxTWeight !== undefined &&
      (body.maxTWeight < 1 || body.maxTWeight > 1000)
    ) {
      throw new BadRequestException(
        'Max trailer weight must be between 1 and 10000',
      );
    }
    if (
      body.maxTHeight !== undefined &&
      (body.maxTHeight < 1 || body.maxTHeight > 1000)
    ) {
      throw new BadRequestException(
        'Max trailer height must be between 1 and 1000',
      );
    }
    if (
      body.maxTWidth !== undefined &&
      (body.maxTWidth < 1 || body.maxTWidth > 1000)
    ) {
      throw new BadRequestException(
        'Max trailer width must be between 1 and 1000',
      );
    }
    try {
      await this.driveService.createOffer(user, car, trailer, body);
      return new OkDTO(true, 'Offer was created');
    } catch (err) {
      throw new Error('An error occurred' + err);
    }
  }

  @ApiResponse({
    type: OkDTO,
    description: 'Posts a request into the database',
  })
  @Post('/request')
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  async createRequest(
    @Body() body: CreateRequestDTO,
    @Session() session: SessionData,
  ) {
    const user = await this.userService.getUserById(session.currentUser);
    if (!user) {
      throw new BadRequestException('User was not found');
    }
    if (user.profilePic === 'empty.png') {
      throw new BadRequestException(
        'You need a profile pic to upload a request',
      );
    }
    if (!user.phoneNumber) {
      throw new BadRequestException('You need a phone number');
    }

    try {
      await this.driveService.createRequest(user, body);
      return new OkDTO(true, 'Request was created');
    } catch (err) {
      throw new BadRequestException('An error occurred: ' + err.message);
    }
  }
}
