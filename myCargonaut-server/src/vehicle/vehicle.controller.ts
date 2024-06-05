import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { UserService } from '../user/user.service';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OkDTO } from '../serverDTO/OkDTO';
import { IsLoggedInGuard } from '../session/is-logged-in.guard';
import { CreateCarDTO } from './DTO/CreateCarDTO';
import { SessionData } from 'express-session';
import { CreateTrailerDTO } from './DTO/CreateTrailerDTO';
import { CarDB } from '../database/CarDB';
import { GetCarDTO } from './DTO/GetCarDTO';
import { GetTrailerDTO } from './DTO/GetTrailerDTO';
import { TrailerDB } from '../database/TrailerDB';

@ApiTags('vehicle')
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
  async createCar(@Body() body: CreateCarDTO, @Session() session: SessionData) {
    const owner = await this.userService.getUserById(session.currentUser);

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

  @ApiResponse({
    type: OkDTO,
    description: 'posts a trailer into the database',
  })
  @Post('/trailer')
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  async createTrailer(
    @Body() body: CreateTrailerDTO,
    @Session() session: SessionData,
  ) {
    const owner = await this.userService.getUserById(session.currentUser);

    try {
      await this.vehicleService.createTrailer(
        owner,
        body.name.trim(),
        body.weight,
        body.length,
        body.height,
        body.width,
        body.isCooled,
        body.isEnclosed,
      );
      return new OkDTO(true, 'Trailer was created');
    } catch (err) {
      throw err;
    }
  }

  @ApiResponse({
    type: [GetCarDTO],
    description: 'gets all cars from a specific user',
  })
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  @Get('/cars')
  async getAllCarsForUser(@Session() session: SessionData) {
    const cars = await this.vehicleService.getAllCarsForUser(
      session.currentUser,
    );
    return cars.map((car) => {
      return this.transformCarDBtoGetCarDTO(car);
    });
  }

  @ApiResponse({
    type: [GetTrailerDTO],
    description: 'gets all trailers from a specific user',
  })
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  @Get('/trailers')
  async getAllTrailersForUser(@Session() session: SessionData) {
    const trailers = await this.vehicleService.getAllTrailersForUser(
      session.currentUser,
    );
    return trailers.map((trailer) => {
      return this.transformTrailerDBtoGetTrailerDTO(trailer);
    });
  }

  @ApiResponse({
    type: OkDTO,
    description: 'removes a vehicle from the database',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the vehicle to be deleted',
  })
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  async deleteVehicle(
    @Param('id', ParseIntPipe) id: number,
    @Session() session: SessionData,
  ): Promise<OkDTO> {
    try {
      await this.vehicleService.deleteVehicle(id, session.currentUser);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
    return new OkDTO(true, 'Trailer was created');
  }

  transformCarDBtoGetCarDTO(car: CarDB): GetCarDTO {
    const dto = new GetCarDTO();
    dto.id = car.id;
    dto.name = car.name;
    dto.weight = car.weight;
    dto.length = car.length;
    dto.height = car.height;
    dto.width = car.width;
    dto.seats = car.seats;
    dto.hasAC = car.hasAC;
    dto.hasTelevision = car.hasTelevision;
    dto.carPicture = car.carPicture;
    return dto;
  }

  transformTrailerDBtoGetTrailerDTO(trailer: TrailerDB): GetTrailerDTO {
    const dto = new GetTrailerDTO();
    dto.id = trailer.id;
    dto.name = trailer.name;
    dto.weight = trailer.weight;
    dto.length = trailer.length;
    dto.height = trailer.height;
    dto.width = trailer.width;
    dto.isCooled = trailer.isCooled;
    dto.isEnclosed = trailer.isEnclosed;
    return dto;
  }
}
