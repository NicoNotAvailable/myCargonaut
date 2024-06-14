import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { DriveService } from '../drive/drive.service';
import { UserService } from '../user/user.service';
import { VehicleService } from '../vehicle/vehicle.service';
import { TripService } from './trip.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OkDTO } from '../serverDTO/OkDTO';
import { IsLoggedInGuard } from '../session/is-logged-in.guard';
import { SessionData } from 'express-session';
import { CreateOfferTripDTO } from './DTO/CreateOfferTripDTO';
import { LocationService } from '../location/location.service';
import { CreateRequestTripDTO } from './DTO/CreateRequestTripDTO';
import { UtilsService } from '../utils/utils.service';

@ApiTags('trip')
@Controller('trip')
export class TripController {
  constructor(
    private readonly driveService: DriveService,
    private readonly userService: UserService,
    private readonly vehicleService: VehicleService,
    private readonly tripService: TripService,
    private readonly locationService: LocationService,
    private readonly utilsService: UtilsService,
  ) {}
  @ApiResponse({
    type: OkDTO,
    description: 'Posts a trip for an offer into the database',
  })
  @Post('/offer')
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  async createOfferTrip(
    @Body() body: CreateOfferTripDTO,
    @Session() session: SessionData,
  ) {
    const user = await this.userService.getUserById(session.currentUser);
    if (!user) {
      throw new BadRequestException('User was not found');
    }
    if (user.profilePic === 'empty.png') {
      throw new BadRequestException(
        'You need a profile pic to request an offer',
      );
    }
    if (!user.phoneNumber) {
      throw new BadRequestException('You need a phone number');
    }
    const offer = await this.driveService.getOfferById(body.driveID);
    const startLocation = await this.locationService.getLocationById(
      body.startLocationID,
    );
    const endLocation = await this.locationService.getLocationById(
      body.endLocationID,
    );
    try {
      await this.tripService.createOfferTrip(
        user,
        offer,
        body,
        startLocation,
        endLocation,
      );
      return new OkDTO(true, 'Request for the offer was created');
    } catch (err) {
      throw new BadRequestException('An error occurred: ' + err.message);
    }
  }
  @ApiResponse({
    type: OkDTO,
    description: 'Posts a trip for a request into the database',
  })
  @Post('/request')
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  async createRequestTrip(
    @Body() body: CreateRequestTripDTO,
    @Session() session: SessionData,
  ) {
    const user = await this.userService.getUserById(session.currentUser);
    if (!user) {
      throw new BadRequestException('User was not found');
    }
    if (user.profilePic === 'empty.png') {
      throw new BadRequestException(
        'You need a profile pic to request an offer',
      );
    }
    if (!user.phoneNumber) {
      throw new BadRequestException('You need a phone number');
    }
    const request = await this.driveService.getRequestById(body.driveID);
    const car = await this.vehicleService.getCarById(body.carID);
    const trailer = await this.vehicleService.getTrailerById(body.trailerID);
    try {
      await this.tripService.createRequestTrip(user, request, car, trailer);
      return new OkDTO(true, 'Request for the offer was created');
    } catch (err) {
      throw new BadRequestException('An error occurred: ' + err.message);
    }
  }

  /* @ApiResponse({
    type: [GetRequestTripDTO],
    description: 'gets all trips for a specific request',
  })
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  @Get('/requests/:id')
  async getRequestTrips(@Param('id', ParseIntPipe) id: number) {
    const request = id;
    try {
      const requestTrips = await this.tripService.getAllRequestTrips(request);
      return await Promise.all(
        requestTrips.map(async (requestTrip) => {
          return transformRequestTripToGetRequestTripDTO(requestTrip);
        }),
      );
    } catch (err) {
      throw new BadRequestException('An error occurred: ' + err.message);
    }
  } */
}
