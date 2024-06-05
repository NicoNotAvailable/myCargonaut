import {
  Body,
  Controller,
  Delete,
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
}
