import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Session,
  UploadedFile,
  UseGuards,
  Res,
  UseInterceptors,
  Put,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { UserService } from '../user/user.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { OkDTO } from '../serverDTO/OkDTO';
import { IsLoggedInGuard } from '../session/is-logged-in.guard';
import { CreateCarDTO } from './DTO/CreateCarDTO';
import { SessionData } from 'express-session';
import { CreateTrailerDTO } from './DTO/CreateTrailerDTO';
import { GetCarDTO } from './DTO/GetCarDTO';
import { GetTrailerDTO } from './DTO/GetTrailerDTO';
import { extname, join } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { UtilsService } from '../utils/utils.service';

@ApiTags('vehicle')
@Controller('vehicle')
export class VehicleController {
  constructor(
    private readonly vehicleService: VehicleService,
    private readonly userService: UserService,
    private readonly utilsService: UtilsService,
  ) {}
  private readonly logger = new Logger(VehicleController.name);

  @ApiResponse({
    type: OkDTO,
    description: 'posts a car into the database',
  })
  @Post('/car')
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  async createCar(@Body() body: CreateCarDTO, @Session() session: SessionData) {
    const owner = await this.userService.getUserById(session.currentUser);
    console.log(session.currentUser);
    if (!owner) {
      throw new BadRequestException('User was not found');
    }
    if (!body.name || body.name.trim().length === 0) {
      throw new BadRequestException('Auto Name muss ausgefüllt sein');
    }
    if (body.name.trim().length > 20) {
      throw new BadRequestException('Auto Name ist zu lang');
    }
    if (!body.weight || body.weight <= 0) {
      throw new BadRequestException(
        'Maximal Gewicht muss eine positive Zahl sein',
      );
    }
    if (!body.length || body.length <= 0 || body.length > 100) {
      throw new BadRequestException(
        'Auto muss länger al 0m und kürzer als 100m sein',
      );
    }
    if (!body.height || body.height <= 0 || body.height > 100) {
      throw new BadRequestException(
        'Auto muss höher als 0m und kleiner als 100m sein',
      );
    }
    if (!body.width || body.width <= 0 || body.width > 100) {
      throw new BadRequestException(
        'Auto muss breiter als 0m und schmaler als 100m sein',
      );
    }
    if (body.seats <= 0 || body.seats > 20) {
      throw new BadRequestException('Sitzplätze nur zwischen 1 und 20');
    }

    try {
      await this.vehicleService.createCar(owner, body);
      return new OkDTO(true, 'Car was created');
    } catch (err) {
      throw new Error('An error occurred' + err);
    }
  }

  @ApiResponse({
    type: OkDTO,
    description: 'updates a car',
  })
  @Put('/updateCar/:id')
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  async updateCar(
    @Body() body: CreateCarDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const car = await this.vehicleService.getCarById(id);

    if (!car) {
      throw new BadRequestException('User was not found');
    }
    if (!body.name || body.name.trim().length === 0) {
      throw new BadRequestException('Auto Name muss ausgefüllt sein');
    }
    if (body.name.trim().length > 20) {
      throw new BadRequestException('Auto Name ist zu lang');
    }
    if (!body.weight || body.weight <= 0) {
      throw new BadRequestException(
        'Maximal Gewicht muss eine positive Zahl sein',
      );
    }
    if (!body.length || body.length <= 0 || body.length > 100) {
      throw new BadRequestException(
        'Auto muss länger al 0m und kürzer als 100m sein',
      );
    }
    if (!body.height || body.height <= 0 || body.height > 100) {
      throw new BadRequestException(
        'Auto muss höher als 0m und kleiner als 100m sein',
      );
    }
    if (!body.width || body.width <= 0 || body.width > 100) {
      throw new BadRequestException(
        'Auto muss breiter als 0m und schmaler als 100m sein',
      );
    }
    if (body.seats <= 0 || body.seats > 20) {
      throw new BadRequestException('Sitzplätze nur zwischen 1 und 20');
    }

    try {
      await this.vehicleService.updateCar(car);
      return new OkDTO(true, 'Car was updated');
    } catch (err) {
      throw new Error('An error occurred' + err);
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

    if (!body.name || body.name.trim().length === 0) {
      throw new BadRequestException('Trailer Name muss ausgefüllt sein');
    }
    if (body.name.trim().length > 20) {
      throw new BadRequestException('Trailer Name ist zu lang');
    }
    if (!body.weight || body.weight <= 0) {
      throw new BadRequestException('Trailer weight must be a positive number');
    }
    if (!body.length || body.length <= 0 || body.length > 100) {
      throw new BadRequestException(
        'Trailer muss länger als 0m und kürzer als 100m sein',
      );
    }
    if (!body.height || body.height <= 0 || body.height > 100) {
      throw new BadRequestException(
        'Trailer muss höher als 0m und kleiner als 100m sein',
      );
    }
    if (!body.width || body.width <= 0 || body.width > 100) {
      throw new BadRequestException(
        'Trailer muss breiter als 0m und dünner als 100m sein',
      );
    }

    try {
      await this.vehicleService.createTrailer(owner, body);
      return new OkDTO(true, 'Trailer was created');
    } catch (err) {
      throw new Error('An error occurred');
    }
  }

  @ApiResponse({
    type: OkDTO,
    description: 'posts a picture for a specific car',
  })
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  @Post('carPicture/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/carPictures',
        filename: (req: any, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadCarPicture(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (!file) {
      throw new BadRequestException();
    }
    const car = await this.vehicleService.getCarById(id);
    car.carPicture = file.filename;
    await this.vehicleService.updateCar(car);

    return new OkDTO(true, 'Profile Picture Upload successfull');
  }

  @ApiResponse({ description: 'Fetches the image of a vehicle' })
  @Get('image/:image')
  async getImage(@Param('image') image: string, @Res() res: Response) {
    try {
      const imgPath: string = join(
        process.cwd(),
        'uploads',
        'carPictures',
        image,
      );
      res.sendFile(imgPath);
    } catch (err) {
      throw new BadRequestException(err);
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
      return this.utilsService.transformCarDBtoGetCarDTO(car);
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
      return this.utilsService.transformTrailerDBtoGetTrailerDTO(trailer);
    });
  }

  @ApiResponse({
    type: GetCarDTO,
    description: 'gets a car by the specific ID from the database',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the car to get',
  })
  @Get('/car/:id')
  async getCarById(@Param('id', ParseIntPipe) id: number): Promise<GetCarDTO> {
    try {
      const car = await this.vehicleService.getCarById(id);
      return this.utilsService.transformCarDBtoGetCarDTO(car);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('An error occurred while retrieving the vehicle');
    }
  }

  @ApiResponse({
    type: GetTrailerDTO,
    description: 'gets a trailer by the specific ID from the database',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the trailer to get',
  })
  @Get('/trailer/:id')
  async getTrailerById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetTrailerDTO> {
    try {
      const trailer = await this.vehicleService.getTrailerById(id);
      return this.utilsService.transformTrailerDBtoGetTrailerDTO(trailer);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('An error occurred while retrieving the car');
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
