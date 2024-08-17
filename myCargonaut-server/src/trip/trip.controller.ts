import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Session,
  UseGuards,
} from '@nestjs/common';
import { DriveService } from '../drive/drive.service';
import { UserService } from '../user/user.service';
import { VehicleService } from '../vehicle/vehicle.service';
import { TripService } from './trip.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OkDTO } from '../serverDTO/OkDTO';
import { IsLoggedInGuard } from '../session/is-logged-in.guard';
import { SessionData } from 'express-session';
import { CreateOfferTripDTO } from './DTO/CreateOfferTripDTO';
import { LocationService } from '../location/location.service';
import { CreateRequestTripDTO } from './DTO/CreateRequestTripDTO';
import { UtilsService } from '../utils/utils.service';
import { GetRequestTripDTO } from './DTO/GetRequestTripDTO';
import { GetOfferTripDTO } from './DTO/GetOfferTripDTO';

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
    if (offer.user.id == user.id) {
      throw new BadRequestException('You cant request your own offer!');
    }

    const startLocation = await this.locationService.getLocationsOfDrive(
      body.startLocationID,
      body.driveID,
    );
    const endLocation = await this.locationService.getLocationsOfDrive(
      body.endLocationID,
      body.driveID,
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
    type: [GetOfferTripDTO],
    description: 'gets all offer trips for a specific user',
  })
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  @Get('/offer/user')
  async getOwnOfferTrips(@Session() session: SessionData) {
    try {
      const offerTrips = await this.tripService.getOwnOfferTrips(
        session.currentUser,
      );
      return await Promise.all(
        offerTrips.map(async (offerTrip) => {
          return this.utilsService.transformOfferTripDBToGetOfferTripDTO(
            offerTrip,
          );
        }),
      );
    } catch (err) {
      throw new BadRequestException('An error occurred: ' + err.message);
    }
  }
  @ApiResponse({
    type: [GetOfferTripDTO],
    description: 'gets all trips for a specific offer',
  })
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  @Get('/offer/offerTrips/:offerID')
  async getTripsForOffer(@Param('offerID', ParseIntPipe) id: number) {
    try {
      const offerTrips = await this.tripService.getAllOfferTrips(id);
      return await Promise.all(
        offerTrips.map(async (offerTrip) => {
          return this.utilsService.transformOfferTripDBToGetOfferTripDTO(
            offerTrip,
          );
        }),
      );
    } catch (err) {
      throw new BadRequestException('An error occurred: ' + err.message);
    }
  }
  @ApiResponse({
    type: GetOfferTripDTO,
    description: 'gets a single offer trip by its ID',
  })
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  @Get('/offer/:offerTripID')
  async getOfferTripById(@Param('offerID', ParseIntPipe) id: number) {
    try {
      const offerTrip = await this.tripService.getOfferTripById(id);
      return await this.utilsService.transformOfferTripDBToGetOfferTripDTO(
        offerTrip,
      );
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
    if (request.user.id == user.id) {
      throw new BadRequestException('You cant request your own offer!');
    }
    const car = await this.vehicleService.getCarById(body.carID);
    let trailer = null;
    if (body.trailerID != null && body.trailerID != 0) {
      trailer = await this.vehicleService.getTrailerById(body.trailerID);
    }
    try {
      await this.tripService.createRequestTrip(user, request, car, trailer);
      return new OkDTO(true, 'Request for the offer was created');
    } catch (err) {
      throw new BadRequestException('An error occurred: ' + err.message);
    }
  }
  @ApiResponse({
    type: [GetRequestTripDTO],
    description: 'gets all request trips for specific user',
  })
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  @Get('/request/user')
  async getOwnRequestTrips(@Session() session: SessionData) {
    try {
      const requestTrips = await this.tripService.getOwnRequestTrips(
        session.currentUser,
      );
      return await Promise.all(
        requestTrips.map(async (requestTrip) => {
          return this.utilsService.transformRequestTripDBToGetRequestTripDTO(
            requestTrip,
          );
        }),
      );
    } catch (err) {
      throw new BadRequestException('An error occurred: ' + err.message);
    }
  }
  @ApiResponse({
    type: [GetRequestTripDTO],
    description: 'gets all trips for a specific request',
  })
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  @Get('/request/requestTrips/:requestID')
  async getTripsForRequest(@Param('requestID', ParseIntPipe) id: number) {
    try {
      const requestTrips = await this.tripService.getAllRequestTrips(id);
      return await Promise.all(
        requestTrips.map(async (requestTrip) => {
          return this.utilsService.transformRequestTripDBToGetRequestTripDTO(
            requestTrip,
          );
        }),
      );
    } catch (err) {
      throw new BadRequestException('An error occurred: ' + err.message);
    }
  }
  @ApiResponse({
    type: GetRequestTripDTO,
    description: 'gets single request trip by its ID',
  })
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  @Get('/request/:requestTripID')
  async getRequestTripById(@Param('requestTripID', ParseIntPipe) id: number) {
    try {
      const requestTrip = await this.tripService.getRequestTripById(id);
      return this.utilsService.transformRequestTripDBToGetRequestTripDTO(
        requestTrip,
      );
    } catch (err) {
      throw new BadRequestException('An error occurred: ' + err.message);
    }
  }

  @ApiOperation({
    summary: 'Get user trips (offer/request trips, offer/request drive trips)',
  })
  @ApiResponse({
    status: 200,
    description: 'User trips retrieved successfully.',
    type: 'object',
  })
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  @Get('user-trips/:userId')
  async getUserTrips(@Param('userId', ParseIntPipe) userId: number): Promise<{
    offerTrips: any[];
    requestTrips: any[];
    offerDriveTrips: any[];
    requestDriveTrips: any[];
  }> {
    try {
      return await this.tripService.getUserTrips(userId);
    } catch (err) {
      throw new BadRequestException('An error occurred: ' + err.message);
    }
  }

  @ApiResponse({
    type: OkDTO,
    description:
      'By paying only the one who made a request to an offer can update the status of a drive to 2 (paid)',
  })
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  @Put('offer/:id/payment')
  async setOfferStatusPaid(
    @Param('id') driveId: number,
    @Session() session: SessionData,
  ): Promise<OkDTO> {
    const userId = session.currentUser;
    try {
      await this.tripService.setOfferStatusPaid(driveId, userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
    return new OkDTO(true, 'request was updated');
  }

  @ApiResponse({
    type: OkDTO,
    description:
      'Only the one who made a request to an offer can update the status of a drive to 2 (paid) by paying',
  })
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  @Put('request/:id/payment')
  async setRequestStatusPaid(
    @Param('id') driveId: number,
    @Session() session: SessionData,
  ): Promise<OkDTO> {
    const userId = session.currentUser;
    try {
      await this.tripService.setRequestStatusPaid(driveId, userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
    return new OkDTO(true, 'request was updated');
  }

  @ApiResponse({
    type: OkDTO,
    description: 'accepts a trip',
  })
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  @Put('accept/:id')
  async acceptTrip(
    @Session() session: SessionData,
    @Param('id', ParseIntPipe) tripId: number,
  ): Promise<OkDTO> {
    const userId = session.currentUser;
    try {
      await this.tripService.acceptTrip(tripId, userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
    return new OkDTO(true, 'trip was accepted');
  }
  @ApiResponse({
    type: OkDTO,
    description: 'removes a trip from the database',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the trip to be deleted',
  })
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  async deleteTrip(
    @Param('id', ParseIntPipe) id: number,
    @Session() session: SessionData,
  ): Promise<OkDTO> {
    try {
      await this.tripService.deleteTrip(id, session.currentUser);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
    return new OkDTO(true, 'trip was deleted');
  }
}
