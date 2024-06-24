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
import { CarDB } from '../database/CarDB';
import { GetCarDTO } from '../vehicle/DTO/GetCarDTO';
import { TrailerDB } from '../database/TrailerDB';
import { GetTrailerDTO } from '../vehicle/DTO/GetTrailerDTO';
import { OfferTripDB } from '../database/OfferTripDB';
import { GetOfferTripDTO } from '../trip/DTO/GetOfferTripDTO';
import { GetReviewDTO } from '../review/DTO/GetReviewDTO';
import { ReviewDB } from '../database/ReviewDB';
import { ReviewService } from '../review/review.service';

@ApiTags('trip')
@Controller('trip')
export class UtilsService {
  constructor(private readonly reviewService: ReviewService) {}

  async transformRequestTripDBToGetRequestTripDTO(
    request: RequestTripDB,
  ): Promise<GetRequestTripDTO> {
    const dto = new GetRequestTripDTO();
    dto.id = request.id;
    dto.requesting = await this.transformUserToGetOtherUserDTO(
      request.requesting,
    );
    dto.car = this.transformCarDBtoGetCarDTO(request.car);
    if (request.trailer) {
      dto.trailer = this.transformTrailerDBtoGetTrailerDTO(request.trailer);
    }
    return dto;
  }

  async transformOfferTripDBToGetOfferTripDTO(
    offer: OfferTripDB,
  ): Promise<GetOfferTripDTO> {
    const dto = new GetOfferTripDTO();
    dto.id = offer.id;
    dto.requesting = await this.transformUserToGetOtherUserDTO(
      offer.requesting,
    );
    dto.usedSeats = offer.usedSeats;
    dto.startLocation = this.transformLocationDBToCreateLocationDTO(
      offer.startLocation,
    );
    dto.endLocation = this.transformLocationDBToCreateLocationDTO(
      offer.endLocation,
    );
    const cargo = await offer.cargo;
    dto.cargo = cargo.map(this.transformCargoDBToCreateCargoDTO);
    return dto;
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

  async transformUserToGetOtherUserDTO(user: UserDB): Promise<GetOtherUserDTO> {
    const dto = new GetOtherUserDTO();
    dto.id = user.id;
    dto.profilePic = user.profilePic;
    dto.firstName = user.firstName.charAt(0).toUpperCase() + '.';
    dto.lastName = user.lastName.charAt(0).toUpperCase() + '.';
    dto.languages = user.languages;
    dto.profileText = user.profileText;
    dto.birthyear = user.birthday.getFullYear();
    dto.isSmoker = user.isSmoker;
    dto.rating = await this.reviewService.getRating(user.id);
    return dto;
  }

  async transformOfferDBtoGetOfferDTO(offer: OfferDB): Promise<GetOfferDTO> {
    const dto = new GetOfferDTO();
    dto.id = offer.id;
    dto.user = await this.transformUserToGetOtherUserDTO(offer.user);
    dto.carID = offer.car.id;
    dto.carPicture = offer.car.carPicture;
    dto.name = offer.name;
    dto.date = offer.date;
    dto.price = offer.price;
    dto.seats = offer.seats;
    dto.animalsAllowed = offer.animalsAllowed;
    dto.smokingAllowed = offer.smokingAllowed;
    dto.status = offer.status;
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
    dto.user = await this.transformUserToGetOtherUserDTO(request.user);
    dto.name = request.name;
    dto.date = request.date;
    dto.price = request.price;
    dto.seats = request.seats;
    dto.animalsAllowed = request.animalsAllowed;
    dto.smokingAllowed = request.smokingAllowed;
    dto.status = request.status;
    dto.info = request.info;
    const locations = await request.location;
    dto.locations = locations.map(this.transformLocationDBToCreateLocationDTO);
    const cargo = await request.cargo;
    dto.cargo = cargo.map(this.transformCargoDBToCreateCargoDTO);
    return dto;
  }

  async transformReviewDBToGetReviewDTO(
    review: ReviewDB,
  ): Promise<GetReviewDTO> {
    const dto = new GetReviewDTO();
    dto.writer = await this.transformUserToGetOtherUserDTO(review.writer);
    dto.rating = review.rating;
    dto.text = review.text;
    return dto;
  }
}
