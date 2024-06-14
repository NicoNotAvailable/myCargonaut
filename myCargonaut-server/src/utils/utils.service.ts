import { RequestTripDB } from '../database/RequestTripDB';
import { GetRequestTripDTO } from '../trip/DTO/GetRequestTripDTO';
import { LocationDB } from '../database/LocationDB';
import { CreateLocationDTO } from '../location/DTO/CreateLocationDTO';
import { CargoDB } from '../database/CargoDB';
import { CreateCargoDTO } from '../cargo/DTO/CreateCargoDTO';
import { UserDB } from '../database/UserDB';
import { GetOtherUserDTO } from '../user/DTO/GetOtherUserDTO';
import { OfferDB, RequestDB } from '../database/DriveDB';
import { GetOfferDTO } from '../drive/DTO/GetOfferDTO';
import { GetRequestDTO } from '../drive/DTO/GetRequestDTO';
import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { DriveService } from '../drive/drive.service';
import { UserService } from '../user/user.service';
import { VehicleService } from '../vehicle/vehicle.service';
import { TripService } from '../trip/trip.service';
import { LocationService } from '../location/location.service';

@ApiTags('trip')
@Controller('trip')
export class UtilsService {
  constructor(
    private readonly driveService: DriveService,
    private readonly userService: UserService,
    private readonly vehicleService: VehicleService,
    private readonly tripService: TripService,
    private readonly locationService: LocationService,
  ) {}
  transformRequestTripToGetRequestTripDTO(request: RequestTripDB): string {
    const dto = new GetRequestTripDTO();
    dto.id = request.id;
    dto.requesting = this.transformUserToGetOtherUserDTO(request.requesting);
    return 're';
  }
  transformLocationDBToCreateLocationDTO(
    location: LocationDB,
  ): CreateLocationDTO {
    const dto = new CreateLocationDTO();
    dto.stopNr = location.stopNr;
    dto.country = location.country;
    dto.zipCode = location.zipCode;
    dto.city = location.city;
    return dto;
  }
  transformCargoDBToCreateCargoDTO(cargo: CargoDB): CreateCargoDTO {
    const dto = new CreateCargoDTO();
    dto.weight = cargo.weight;
    dto.length = cargo.length;
    dto.height = cargo.height;
    dto.width = cargo.width;
    dto.description = cargo.description;
    return dto;
  }
  transformUserToGetOtherUserDTO(user: UserDB): GetOtherUserDTO {
    const dto = new GetOtherUserDTO();
    dto.id = user.id;
    dto.profilePic = user.profilePic;
    dto.firstName = user.firstName;
    dto.lastName = user.lastName;
    dto.languages = user.languages;
    dto.profileText = user.profileText;
    dto.isSmoker = user.isSmoker;
    return dto;
  }
  async transformOfferDBtoGetOfferDTO(offer: OfferDB): Promise<GetOfferDTO> {
    const dto = new GetOfferDTO();
    dto.id = offer.id;
    dto.user = this.transformUserToGetOtherUserDTO(offer.user);
    dto.carID = offer.car.id;
    dto.carPicture = offer.car.carPicture;
    dto.name = offer.name;
    dto.date = offer.date;
    dto.price = offer.price;
    dto.seats = offer.seats;
    dto.animalsAllowed = offer.animalsAllowed;
    dto.smokingAllowed = offer.smokingAllowed;
    dto.info = offer.info;
    dto.maxCWeight = offer.maxCWeight;
    dto.maxCLength = offer.maxCLength;
    dto.maxCHeight = offer.maxCHeight;
    dto.maxCWidth = offer.maxCWidth;
    if (offer.trailer) {
      dto.trailerID = offer.trailer.id;
      dto.maxTLength = offer.maxTLength;
      dto.maxTWeight = offer.maxTWeight;
      dto.maxTHeight = offer.maxTHeight;
      dto.maxTWidth = offer.maxTWidth;
    }
    dto.priceType = offer.priceType;
    const locations = await offer.location;
    dto.locations = locations.map(this.transformLocationDBToCreateLocationDTO);
    return dto;
  }

  async transformRequestDBtoGetRequestDTO(
    request: RequestDB,
  ): Promise<GetRequestDTO> {
    const dto = new GetRequestDTO();
    dto.id = request.id;
    dto.user = this.transformUserToGetOtherUserDTO(request.user);
    dto.name = request.name;
    dto.date = request.date;
    dto.price = request.price;
    dto.seats = request.seats;
    dto.animalsAllowed = request.animalsAllowed;
    dto.smokingAllowed = request.smokingAllowed;
    dto.info = request.info;
    const locations = await request.location;
    dto.locations = locations.map(this.transformLocationDBToCreateLocationDTO);
    const cargo = await request.cargo;
    dto.cargo = cargo.map(this.transformCargoDBToCreateCargoDTO);
    return dto;
  }
}
