import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { DriveService } from './drive.service';
import { OkDTO } from '../serverDTO/OkDTO';
import { IsLoggedInGuard } from '../session/is-logged-in.guard';
import { SessionData } from 'express-session';
import { CreateOfferDTO } from './DTO/CreateOfferDTO';
import { VehicleService } from '../vehicle/vehicle.service';
import { CreateRequestDTO } from './DTO/CreateRequestDTO';
import { GetOfferDTO } from './DTO/GetOfferDTO';
import { GetRequestDTO } from './DTO/GetRequestDTO';
import { UtilsService } from '../utils/utils.service';

@ApiTags('drive')
@Controller('drive')
export class DriveController {
  constructor(
    private readonly driveService: DriveService,
    private readonly userService: UserService,
    private readonly vehicleService: VehicleService,
    private readonly utilsService: UtilsService,
  ) {}

  private async validateUser(session: SessionData) {
    const user = await this.userService.getUserById(session.currentUser);
    if (!user) {
      throw new BadRequestException('User was not found');
    }
    if (user.profilePic === 'empty.png') {
      throw new BadRequestException(
        'You need a profile pic to upload an offer/request',
      );
    }
    if (!user.phoneNumber) {
      throw new BadRequestException('You need a phone number');
    }
    return user;
  }

  private validateOfferInput(body: CreateOfferDTO) {
    const errors = [];

    if (!body.name?.trim()) errors.push('Offer name cannot be empty');
    if (!body.price) errors.push('Price cannot be empty');
    if (!body.info) errors.push('Info cannot be empty');
    if (body.seats !== undefined && body.seats > 10)
      errors.push('Too many seats');
    if (body.smokingAllowed === undefined)
      errors.push('Smoking allowed must be specified');
    if (body.animalsAllowed === undefined)
      errors.push('Animals allowed must be specified');
    if (body.maxCWeight < 1 || body.maxCWeight > 1000)
      errors.push('Max car weight must be between 1 and 1000');
    if (body.maxCLength < 1 || body.maxCLength > 1000)
      errors.push('Max car length must be between 1 and 1000');
    if (body.maxCHeight < 1 || body.maxCHeight > 1000)
      errors.push('Max car height must be between 1 and 1000');
    if (body.maxCWidth < 1 || body.maxCWidth > 1000)
      errors.push('Max car width must be between 1 and 1000');
    if (
      body.maxTLength !== undefined &&
      (body.maxTLength < 1 || body.maxTLength > 1000)
    )
      errors.push('Max trailer length must be between 1 and 1000');
    if (
      body.maxTWeight !== undefined &&
      (body.maxTWeight < 1 || body.maxTWeight > 1000)
    )
      errors.push('Max trailer weight must be between 1 and 1000');
    if (
      body.maxTHeight !== undefined &&
      (body.maxTHeight < 1 || body.maxTHeight > 1000)
    )
      errors.push('Max trailer height must be between 1 and 1000');
    if (
      body.maxTWidth !== undefined &&
      (body.maxTWidth < 1 || body.maxTWidth > 1000)
    )
      errors.push('Max trailer width must be between 1 and 1000');

    if (errors.length) {
      throw new BadRequestException(errors.join(', '));
    }
  }

  private validateRequestInput(body: CreateRequestDTO) {
    const errors = [];

    if (!body.name?.trim()) errors.push('Request name cannot be empty');
    if (!body.date) errors.push('Date cannot be empty');
    if (!body.price) errors.push('Price cannot be empty');
    if (body.seats !== undefined && body.seats > 10)
      errors.push('Too many seats');
    if (body.smokingAllowed === undefined)
      errors.push('Smoking allowed must be specified');
    if (body.animalsAllowed === undefined)
      errors.push('Animals allowed must be specified');
    body.cargo.forEach((cargo) => {
      if (!cargo.description?.trim())
        errors.push('Cargo description cannot be empty');
      if (cargo.weight < 1 || cargo.weight > 1000)
        errors.push('Cargo weight must be between 1 and 1000');
      if (cargo.length < 1 || cargo.length > 1000)
        errors.push('Cargo length must be between 1 and 1000');
      if (cargo.height < 1 || cargo.height > 1000)
        errors.push('Cargo height must be between 1 and 1000');
      if (cargo.width < 1 || cargo.width > 1000)
        errors.push('Cargo width must be between 1 and 1000');
    });

    if (errors.length) {
      throw new BadRequestException(errors.join(', '));
    }
  }

  @ApiResponse({
    type: OkDTO,
    description: 'Posts an offer into the database',
  })
  @Post('/offer')
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  async createOffer(
    @Body() body: CreateOfferDTO,
    @Session() session: SessionData,
  ) {
    const user = await this.validateUser(session);
    const car = await this.vehicleService.getCarById(body.carID);
    if (!car) {
      throw new BadRequestException('Car was not found');
    }
    const trailer = body.trailerID
      ? await this.vehicleService.getTrailerById(body.trailerID)
      : null;
    if (body.trailerID && !trailer) {
      throw new BadRequestException('Trailer was not found');
    }
    this.validateOfferInput(body);

    try {
      await this.driveService.createOffer(user, car, trailer, body);
      return new OkDTO(true, 'Offer was created');
    } catch (err) {
      throw new Error('An error occurred: ' + err.message);
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
    const user = await this.validateUser(session);
    this.validateRequestInput(body);

    try {
      await this.driveService.createRequest(user, body);
      return new OkDTO(true, 'Request was created');
    } catch (err) {
      throw new BadRequestException('An error occurred: ' + err.message);
    }
  }

  @ApiResponse({
    type: [GetOfferDTO],
    description: 'gets all offers',
  })
  @Get('/all/offers')
  async getAllOffers() {
    try {
      const offers = await this.driveService.getAllOffers();
      return await Promise.all(
        offers.map(async (offer) => {
          return this.utilsService.transformOfferDBtoGetOfferDTO(offer);
        }),
      );
    } catch (err) {
      throw new BadRequestException('An error occurred: ' + err.message);
    }
  }

  @ApiResponse({
    type: [GetOfferDTO],
    description: 'gets all own offers',
  })
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  @Get('/user/offers')
  async getOwnOffers(@Session() session: SessionData) {
    const user = session.currentUser;
    try {
      const offers = await this.driveService.getOwnOffers(user);
      return await Promise.all(
        offers.map(async (offer) => {
          return this.utilsService.transformOfferDBtoGetOfferDTO(offer);
        }),
      );
    } catch (err) {
      throw new BadRequestException('An error occurred: ' + err.message);
    }
  }
  @ApiResponse({
    type: GetRequestDTO,
    description: 'gets an offer by its ID',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the offer to get',
  })
  @Get('/offer/:id')
  async getOfferByID(@Param('id', ParseIntPipe) id: number) {
    try {
      const offer = await this.driveService.getOfferById(id);
      return this.utilsService.transformOfferDBtoGetOfferDTO(offer);
    } catch (err) {
      throw new BadRequestException('An error occurred: ' + err.message);
    }
  }

  @ApiResponse({
    type: [GetRequestDTO],
    description: 'gets all requests',
  })
  @Get('/all/requests')
  async getAllRequests() {
    try {
      const requests = await this.driveService.getAllRequests();
      return await Promise.all(
        requests.map(async (request) => {
          return this.utilsService.transformRequestDBtoGetRequestDTO(request);
        }),
      );
    } catch (err) {
      throw new BadRequestException('An error occurred: ' + err.message);
    }
  }

  @ApiResponse({
    type: [GetRequestDTO],
    description: 'gets all own requests',
  })
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  @Get('/user/requests')
  async getOwnRequests(@Session() session: SessionData) {
    const user = session.currentUser;
    try {
      const offers = await this.driveService.getOwnRequests(user);
      return await Promise.all(
        offers.map(async (request) => {
          return this.utilsService.transformRequestDBtoGetRequestDTO(request);
        }),
      );
    } catch (err) {
      throw new BadRequestException('An error occurred: ' + err.message);
    }
  }

  @ApiResponse({
    type: GetRequestDTO,
    description: 'gets a request by its ID',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the request to get',
  })
  @Get('/request/:id')
  async getRequestByID(@Param('id', ParseIntPipe) id: number) {
    try {
      const request = await this.driveService.getRequestById(id);
      return this.utilsService.transformRequestDBtoGetRequestDTO(request);
    } catch (err) {
      throw new BadRequestException('An error occurred: ' + err.message);
    }
  }
}
