import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDTO } from './DTO/CreateUserDTO';
import { OkDTO } from '../serverDTO/OkDTO';
import { extname, join } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { EditPasswordDTO } from './DTO/EditPasswordDTO';
import { EditEmailDTO } from './DTO/EditEmailDTO';
import { SessionData } from 'express-session';
import { IsLoggedInGuard } from '../session/is-logged-in.guard';
import { EditUserDTO } from './DTO/EditUserDTO';
import * as validator from 'validator';
import * as bcrypt from 'bcryptjs';
import { GetOwnUserDTO } from './DTO/GetOwnUserDTO';
import { UserDB } from '../database/UserDB';
import { Response } from 'express';
import { ReviewService } from '../review/review.service';
import { GetOtherUserDTO } from './DTO/GetOtherUserDTO';
import { UtilsService } from '../utils/utils.service';
import { UserStatsDTO } from './DTO/UserStatsDTO';
import { DriveService } from '../drive/drive.service';
import { OfferDB, RequestDB } from '../database/DriveDB';
import { CarDB } from '../database/CarDB';
import { VehicleService } from '../vehicle/vehicle.service';
import { TrailerDB } from '../database/TrailerDB';
import { TripService } from '../trip/trip.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    public readonly userService: UserService,
    public readonly utilsService: UtilsService,
    public readonly reviewService: ReviewService,
    public readonly vehicleService: VehicleService,
    public readonly driveService: DriveService,
    public readonly tripService: TripService,
  ) {}

  private readonly logger = new Logger(UserController.name);

  private validateNonEmptyString(value: string, errorMessage: string): void {
    if (!value?.trim()) {
      throw new BadRequestException(errorMessage);
    }
  }

  private isValidMobileNumber(phoneNumber: string): boolean {
    // Regular expression for validating mobile numbers
    const mobileNumberRegex = /^[+]?\d{1,3}?[-\s.]?\d{3,14}[-\s.]?\d{3,14}$/;
    return mobileNumberRegex.test(phoneNumber);
  }

  private isValidEmail(email: string): boolean {
    return validator.isEmail(email);
  }

  private isUserAdult(birthday: Date): boolean {
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDifference = today.getMonth() - birthday.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthday.getDate())
    ) {
      age--;
    }
    return age >= 18;
  }

  @ApiResponse({ type: GetOtherUserDTO, description: 'gets other user' })
  @Get('/:id')
  async getOtherUser(@Param('id', ParseIntPipe) id: number) {
    let user: UserDB;
    try {
      user = await this.userService.getUserById(id);
    } catch (err) {
      console.error(err);
    }
    return this.utilsService.transformUserToGetOtherUserDTO(user);
  }

  @ApiResponse({ type: GetOwnUserDTO, description: 'gets the own user' })
  @Get()
  async getUser(@Session() session: SessionData): Promise<GetOwnUserDTO> {
    let user: UserDB;
    let rating: number;
    try {
      user = await this.userService.getUserById(session.currentUser);
      rating = await this.reviewService.getRating(session.currentUser);
    } catch (err) {
      console.error(err);
      user = {} as UserDB;
      rating = 0;
    }
    const dto: GetOwnUserDTO = new GetOwnUserDTO();
    dto.lastName = user?.lastName || '';
    dto.firstName = user?.firstName || '';
    dto.email = user?.email || '';
    dto.profilePic = user?.profilePic || '';
    dto.phoneNumber = user?.phoneNumber || '';
    dto.birthday = user?.birthday || new Date();
    dto.isSmoker = user?.isSmoker || false;
    dto.profileText = user?.profileText || '';
    dto.languages = user?.languages || '';
    dto.rating = rating;
    return dto;
  }

  @ApiResponse({
    type: UserStatsDTO,
    description: 'Gets the Statistics of Users',
  })
  @Get('/statistics/:id')
  async getUserStats(
    @Session() session: SessionData,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserStatsDTO> {
    const dto: UserStatsDTO = new UserStatsDTO();
    let user: UserDB;
    try {
      user = await this.userService.getUserById(
        id == -1 ? session.currentUser : id,
      );

      const cars: CarDB[] = await this.vehicleService.getAllCarsForUser(
        user.id,
      );
      let carMaxWeight: number = 0;
      if (cars) {
        for (const car of cars) {
          if (car.weight > carMaxWeight) {
            carMaxWeight = car.weight;
          }
        }
      }

      const trailer: TrailerDB[] =
        await this.vehicleService.getAllTrailersForUser(user.id);
      let trailerMaxWeight: number = 0;
      if (trailer) {
        for (const trail of trailer) {
          if (trail.weight > trailerMaxWeight) {
            trailerMaxWeight = trail.weight;
          }
        }
      }

      const offeredDrives: OfferDB[] = await this.driveService.getOwnOffers(
        user.id,
      );
      let finishedOfferedDrives: OfferDB[];
      if (offeredDrives) {
        finishedOfferedDrives = offeredDrives.filter(
          (offeredDrive) =>
            offeredDrive.status === 4 || offeredDrive.status === 5,
        );
      }

      const requestedDrives: RequestDB[] =
        await this.driveService.getOwnRequests(user.id);
      let finishedRequestedDrives: RequestDB[];
      if (requestedDrives) {
        finishedRequestedDrives = requestedDrives.filter(
          (requestedDrive) =>
            requestedDrive.status === 4 || requestedDrive.status === 5,
        );
      }

      const allTrips = await this.tripService.getUserTrips(user.id);
      let totalSeats: number = 0;
      if (allTrips) {
        for (const offerTrip of allTrips.offerDriveTrips) {
          if (offerTrip.drive.status === 4 || offerTrip.drive.status === 5) {
            totalSeats += offerTrip.usedSeats;
          }
        }
        for (const requestTrip of allTrips.requestDriveTrips) {
          if (
            requestTrip.drive.status === 4 ||
            requestTrip.drive.status === 5
          ) {
            totalSeats += requestTrip.drive.seats;
          }
        }
      }

      dto.offeredDrives = offeredDrives == null ? 0 : offeredDrives.length;
      dto.takenDrives = requestedDrives == null ? 0 : requestedDrives.length;
      dto.totalDrives =
        finishedOfferedDrives == null || finishedRequestedDrives == null
          ? 0
          : finishedOfferedDrives.length + finishedRequestedDrives.length;
      dto.distanceDriven = dto.totalDrives * 100;
      dto.highestWeight = carMaxWeight + trailerMaxWeight;
      dto.totalPassengers = totalSeats;
    } catch (err) {
      console.error(err);
    }
    return dto;
  }

  @ApiResponse({ type: OkDTO, description: 'creates a new user' })
  @Post()
  async createUser(
    @Body() body: CreateUserDTO,
    @Session() session: SessionData,
  ) {
    if (!body.agb) {
      throw new BadRequestException(
        'Du musst die AGB akzeptieren, um dich zu registrieren',
      );
    }
    this.validateNonEmptyString(body.password, 'Passwort darf nicht leer sein');
    if (body.password.trim().length < 8) {
      throw new BadRequestException(
        'Passwort muss mindestens 8 Zeichen lang sein',
      );
    }
    if (body.password != body.passwordConfirm) {
      throw new BadRequestException('Passwort muss übereinstimmen');
    }
    this.validateNonEmptyString(body.email, 'Email darf nicht leer sein');
    if (!this.isValidEmail(body.email)) {
      throw new BadRequestException('Ungültiges E-Mail-Format');
    }
    if (body.email != body.emailConfirm) {
      throw new BadRequestException('Email muss übereinstimmen');
    }
    this.validateNonEmptyString(body.firstName, 'Vorname darf nicht leer sein');
    this.validateNonEmptyString(body.lastName, 'Nachname darf nicht leer sein');
    if (body.phoneNumber && !this.isValidMobileNumber(body.phoneNumber)) {
      throw new BadRequestException('Ungültige Telefon-Nummer');
    }
    const birthday = new Date(body.birthday);
    if (!this.isUserAdult(birthday)) {
      throw new BadRequestException(
        'Sie müssen mindestens 18 Jahre alt sein, um sich zu registrieren.',
      );
    }
    try {
      await this.userService.createUser(
        body.firstName,
        body.lastName,
        body.email.trim(),
        body.password.trim(),
        birthday,
        body.phoneNumber,
      );
      const user: UserDB = await this.userService.getUserByEmail(
        body.email.trim(),
      );
      session.currentUser = user.id;

      return new OkDTO(true, 'User was created');
    } catch (err) {
      throw err;
    }
  }

  /*
   * uses the userService to update the profile picture of the current user
   * @Pre the user is currently logged in as the currentUser
   * @Param a file as the profile picture image
   * @Return an OkDTO if it was succesful
   */
  @ApiResponse({
    type: OkDTO,
    description: 'posts a profile picture for a specific user',
  })
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  @Post('upload-profile-picture')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profilepictures',
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
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Session() session: SessionData,
  ) {
    const id = session.currentUser;
    const user = await this.userService.getUserById(id);
    user.profilePic = file.filename;
    try {
      await this.userService.updateUser(user);

      return new OkDTO(true, 'Profile Picture Upload successfull');
    } catch (err) {
      throw err;
    }
  }

  @ApiResponse({
    type: OkDTO,
    description: 'updates a specifics user password by their id',
  })
  @Put('/password')
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  async updatePassword(
    @Session() session: SessionData,
    @Body() body: EditPasswordDTO,
  ): Promise<OkDTO> {
    const id = session.currentUser;
    const user = await this.userService.getUserById(id);
    this.logger.log(user.password);
    this.logger.log(body.password);
    const passwordMatch = await bcrypt.compare(
      body.password.trim(),
      user.password,
    );
    if (!passwordMatch) {
      throw new BadRequestException('Aktuelles Passwort ist falsch');
    }
    if (body.newPassword.trim() === '' || body.newPassword.trim().length == 0) {
      throw new BadRequestException('Neues Passwort darf nicht leer sein');
    }
    if (body.newPassword.trim().length < 8) {
      throw new BadRequestException(
        'Neues Passwort muss mindestens 8 Zeichen lang sein',
      );
    }
    if (body.newPassword != body.newPasswordConfirm) {
      throw new BadRequestException('Neues Passwort muss übereinstimmen');
    }
    user.password = body.newPassword;
    try {
      await this.userService.updateUser(user);
      return new OkDTO(true, 'User was updated');
    } catch (err) {
      throw err;
    }
  }

  @ApiResponse({
    type: OkDTO,
    description: 'updates a specifics user email by their id',
  })
  @Put('/email')
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  async updateEmail(
    @Session() session: SessionData,
    @Body() body: EditEmailDTO,
  ): Promise<OkDTO> {
    const id = session.currentUser;
    const user = await this.userService.getUserById(id);
    if (body.newEmail.trim().length == 0 || body.newEmail.trim() === '') {
      throw new BadRequestException('Email darf nicht leer sein');
    }
    if (body.newEmail != body.newEmailConfirm) {
      throw new BadRequestException('Email muss übereinstimmen');
    }
    user.email = body.newEmail;
    try {
      await this.userService.updateUser(user);
      return new OkDTO(true, 'User was updated');
    } catch (err) {
      throw err;
    }
  }

  @ApiResponse({
    type: OkDTO,
    description: 'updates a specifics user details',
  })
  @Put('/profile')
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  async updateUser(
    @Session() session: SessionData,
    @Body() body: EditUserDTO,
  ): Promise<OkDTO> {
    const id = session.currentUser;
    const user = await this.userService.getUserById(id);
    if (
      body.phoneNumber != user.phoneNumber &&
      !this.isValidMobileNumber(body.phoneNumber)
    ) {
      throw new BadRequestException('Ungültige telefon-Nummer');
    }
    user.phoneNumber = body.phoneNumber;
    if (body.firstName) {
      this.validateNonEmptyString(
        body.firstName,
        'Vorname darf nicht leer sein',
      );
      user.firstName = body.firstName;
    }
    if (body.lastName) {
      this.validateNonEmptyString(
        body.lastName,
        'Nachname darf nicht leer sein',
      );
      user.lastName = body.lastName;
    }
    if (body.languages !== '' || body.languages !== undefined) {
      user.languages = body.languages;
    }
    if (body.isSmoker) user.isSmoker = body.isSmoker;
    if (body.profileText) user.profileText = body.profileText;
    try {
      await this.userService.updateUser(user);
      return new OkDTO(true, 'User was updated');
    } catch (err) {
      throw err;
    }
  }

  @ApiResponse({ description: 'Fetches the image of a vehicle' })
  @Get('image/:image')
  async getImage(@Param('image') image: string, @Res() res: Response) {
    try {
      const imgPath: string = join(
        process.cwd(),
        'uploads',
        'profilePictures',
        image,
      );
      res.sendFile(imgPath);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @ApiResponse({
    type: OkDTO,
    description: '"deletes" a spefics user by only keeping its id',
  })
  @Put('delete')
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  async deleteUser(@Session() session: SessionData): Promise<OkDTO> {
    const id = session.currentUser;
    const user = await this.userService.getUserById(id);
    user.email = null;
    user.firstName = '';
    user.lastName = '';
    user.password = null;
    user.birthday = new Date('2000-01-01');
    user.profileText = 'Dieser Nutzer hat sein konto deaktiviert.';
    user.profilePic = 'empty.png';
    user.phoneNumber = null;
    try {
      await this.userService.updateUser(user);
      return new OkDTO(true, 'User was deleted');
    } catch (err) {
      throw new BadRequestException('User could not be deleted');
    }
  }
}
/*
  @Get('/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the user to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully retrieved.',
    type: UserDB,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: number): Promise<UserDB> {
    try {
      const user = await this.userService.getUserById(id);
      console.log(user);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }
}
*/
