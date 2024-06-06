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
    Session,
    UploadedFile,
    UseGuards,
    UseInterceptors,
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
import { OkDTO } from '../serverDTO/OkDTO';
import { IsLoggedInGuard } from '../session/is-logged-in.guard';
import { CreateCarDTO } from './DTO/CreateCarDTO';
import { SessionData } from 'express-session';
import { CreateTrailerDTO } from './DTO/CreateTrailerDTO';
import { CarDB } from '../database/CarDB';
import { GetCarDTO } from './DTO/GetCarDTO';
import { GetTrailerDTO } from './DTO/GetTrailerDTO';
import { TrailerDB } from '../database/TrailerDB';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

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
    async createCar(
        @Body() body: CreateCarDTO,
        @Session() session: SessionData,
    ) {
        const owner = await this.userService.getUserById(session.currentUser);
        if (!owner) {
            throw new BadRequestException('User was not found');
        }
        if (!body.name || body.name.trim().length === 0) {
            throw new BadRequestException('Car name cannot be empty');
        }
        if (body.name.trim().length > 10) {
            throw new BadRequestException('Car name is too long');
        }
        if (!body.weight || body.weight <= 0) {
            throw new BadRequestException(
                'Car weight must be a positive number',
            );
        }
        if (!body.length || body.length <= 0 || body.length > 1000) {
            throw new BadRequestException(
                'Car length must be between 1 and 1000 cm',
            );
        }
        if (!body.height || body.height <= 0 || body.height > 1000) {
            throw new BadRequestException(
                'Car height must be between 1 and 1000 cm',
            );
        }
        if (!body.width || body.width <= 0 || body.width > 1000) {
            throw new BadRequestException(
                'Car width must be between 1 and 1000 cm',
            );
        }
        if (body.seats <= 0 || body.seats > 20) {
            throw new BadRequestException('Car seats must be between 1 and 20');
        }

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
            throw new Error('An error occurred');
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
            throw new BadRequestException('Trailer name cannot be empty');
        }
        if (body.name.trim().length > 10) {
            throw new BadRequestException('Trailer name is too long');
        }
        if (!body.weight || body.weight <= 0) {
            throw new BadRequestException(
                'Trailer weight must be a positive number',
            );
        }
        if (!body.length || body.length <= 0 || body.length > 1000) {
            throw new BadRequestException(
                'Trailer length must be between 1 and 1000 cm',
            );
        }
        if (!body.height || body.height <= 0 || body.height > 1000) {
            throw new BadRequestException(
                'Trailer height must be between 1 and 1000 cm',
            );
        }
        if (!body.width || body.width <= 0 || body.width > 1000) {
            throw new BadRequestException(
                'Trailer width must be between 1 and 1000 cm',
            );
        }

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
            throw new Error('An error occurred');
        }
    }

    @ApiResponse({
        type: OkDTO,
        description: 'posts a picture for a specific car',
    })
    @ApiBearerAuth()
    @UseGuards(IsLoggedInGuard)
    @Post('carPicture')
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
                    callback(
                        null,
                        `${randomName}${extname(file.originalname)}`,
                    );
                },
            }),
        }),
    )
    async uploadCarPicture(
        @UploadedFile() file: Express.Multer.File,
        @Session() session: SessionData,
    ) {
        const id = session.currentCar;
        const car = await this.vehicleService.getCarById(id);
        car.carPicture = file.filename;
        await this.vehicleService.updateCar(car);

        return new OkDTO(true, 'Profile Picture Upload successfull');
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
        type: GetCarDTO,
        description: 'gets a car by the specific ID from the database',
    })
    @ApiParam({
        name: 'id',
        type: 'number',
        description: 'ID of the car to get',
    })
    @Get('/car/:id')
    async getCarById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<GetCarDTO> {
        try {
            const car = await this.vehicleService.getCarById(id);
            return this.transformCarDBtoGetCarDTO(car);
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
            return this.transformTrailerDBtoGetTrailerDTO(trailer);
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
