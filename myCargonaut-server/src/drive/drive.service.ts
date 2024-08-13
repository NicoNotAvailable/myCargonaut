import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { DriveDB, OfferDB, RequestDB } from '../database/DriveDB';
import { UserDB } from '../database/UserDB';
import { CreateOfferDTO } from './DTO/CreateOfferDTO';
import { CarDB } from '../database/CarDB';
import { TrailerDB } from '../database/TrailerDB';
import { CargoDB } from '../database/CargoDB';
import { CreateCargoDTO } from '../cargo/DTO/CreateCargoDTO';
import { CreateRequestDTO } from './DTO/CreateRequestDTO';
import { LocationDB } from '../database/LocationDB';
import { CreateLocationDTO } from '../location/DTO/CreateLocationDTO';
import { StatusEnum } from '../database/enums/StatusEnum';
import { ChangeStatusDTO } from './DTO/ChangeStatusDTO';
import { FilterDTO } from './DTO/FilterDTO';
import { ReviewService } from '../review/review.service';

@Injectable()
export class DriveService {
  constructor(
    @InjectRepository(DriveDB)
    private driveRepository: Repository<DriveDB>,
    @InjectRepository(OfferDB)
    private offerRepository: Repository<OfferDB>,
    @InjectRepository(RequestDB)
    private requestRepository: Repository<RequestDB>,
    @InjectRepository(CargoDB)
    private cargoRepository: Repository<CargoDB>,
    @InjectRepository(LocationDB)
    private locationRepository: Repository<LocationDB>,
    private readonly reviewService: ReviewService,
  ) {}

  async createOffer(
    user: UserDB,
    car: CarDB,
    trailer: TrailerDB | null,
    body: CreateOfferDTO,
  ): Promise<OfferDB> {
    const newOffer: OfferDB = this.offerRepository.create();
    if (user instanceof UserDB) {
      newOffer.user = user;
    } else {
      throw new Error('Invalid owner type');
    }
    if (car instanceof CarDB) {
      newOffer.car = car;
    } else {
      throw new Error('Invalid car type');
    }
    if (trailer === null || trailer instanceof TrailerDB) {
      newOffer.trailer = trailer;
    } else {
      throw new Error('Invalid trailer type');
    }
    newOffer.name = body.name.trim();
    newOffer.date = body.date;
    newOffer.price = body.price;
    newOffer.seats = body.seats;
    newOffer.animalsAllowed = body.animalsAllowed;
    newOffer.smokingAllowed = body.smokingAllowed;
    newOffer.info = body.info;
    newOffer.priceType = body.priceType;
    newOffer.maxCWeight = body.maxCWeight;
    newOffer.maxCWidth = body.maxCWidth;
    newOffer.maxCHeight = body.maxCHeight;
    newOffer.maxCLength = body.maxCLength;
    newOffer.maxTWeight = body.maxTWeight;
    newOffer.maxTWidth = body.maxTWidth;
    newOffer.maxTLength = body.maxTLength;
    try {
      const savedOffer = await this.offerRepository.save(newOffer);

      const locationPromises = body.location.map(
        (locationData: CreateLocationDTO, index: number) => {
          const newLocation = this.locationRepository.create(locationData);
          newLocation.drive = savedOffer;
          newLocation.stopNr =
            index === body.location.length - 1 ? 100 : locationData.stopNr;
          return this.locationRepository.insert(newLocation);
        },
      );

      await Promise.all(locationPromises);

      return savedOffer;
    } catch (error) {
      throw new Error('An error occurred while saving the offer');
    }
  }
  async createRequest(
    user: UserDB,
    body: CreateRequestDTO,
  ): Promise<RequestDB> {
    const newRequest = this.requestRepository.create();
    newRequest.user = user;
    newRequest.name = body.name;
    newRequest.date = body.date;
    newRequest.price = body.price;
    newRequest.seats = body.seats;
    newRequest.info = body.info;
    newRequest.smokingAllowed = body.smokingAllowed;
    newRequest.animalsAllowed = body.animalsAllowed;

    const savedRequest = await this.requestRepository.save(newRequest);

    if (body.cargo) {
      const cargoPromises = body.cargo.map((cargoData: CreateCargoDTO) => {
        const newCargo = this.cargoRepository.create(cargoData);
        newCargo.request = savedRequest;
        return this.cargoRepository.save(newCargo);
      });
      await Promise.all(cargoPromises);
    }
    const locationPromises = body.location.map(
      (locationData: CreateLocationDTO, index: number) => {
        const newLocation = this.locationRepository.create(locationData);
        newLocation.drive = savedRequest;
        newLocation.stopNr =
          index === body.location.length - 1 ? 100 : locationData.stopNr;
        return this.locationRepository.insert(newLocation);
      },
    );

    await Promise.all(locationPromises);

    return savedRequest;
  }
  async getOfferById(driveID: number): Promise<OfferDB> {
    const drive = await this.offerRepository.findOne({
      where: { id: driveID },
      relations: ['user', 'car', 'trailer', 'location'],
    });
    if (!drive) {
      throw new NotFoundException('Offer not found');
    }
    return drive;
  }
  async getRequestById(driveID: number): Promise<RequestDB> {
    const drive = await this.requestRepository.findOne({
      where: { id: driveID },
      relations: ['user', 'cargo', 'location'],
    });
    if (!drive) {
      throw new NotFoundException('Request not found');
    }
    return drive;
  }
  async getAllOffers(user?: UserDB): Promise<OfferDB[]> {
    const offers = await this.offerRepository.find({
      relations: ['user', 'car', 'trailer', 'location'],
    });
    if (!offers) {
      throw new NotFoundException('Offers not found');
    }
    if (user) {
      return offers.filter((offer) => offer.user.id !== user.id);
    }

    return offers;
  }
  async getOwnOffers(user: number): Promise<OfferDB[]> {
    const offers = await this.offerRepository.find({
      where: { user: { id: user } },
      relations: ['user', 'car', 'trailer', 'location'],
    });
    if (!offers) {
      throw new NotFoundException('Offers not found');
    }
    return offers;
  }

  async getAllRequests(
    user?: UserDB,
    filters?: FilterDTO,
    sort?: {
      rating?: 'ASC' | 'DESC';
    },
  ): Promise<RequestDB[]> {
    const queryBuilder = this.requestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.user', 'user')
      .leftJoinAndSelect('request.cargo', 'cargo')
      .leftJoinAndSelect('request.location', 'locations');

    if (user) {
      queryBuilder.andWhere('request.user.id != :userId', { userId: user.id });
    }

    this.applyDateFilter(queryBuilder, filters?.date);
    this.applyReqLocationFilters(
      queryBuilder,
      filters?.startLocation,
      filters?.endLocation,
    );
    this.applyRequestSizeFilters(queryBuilder, filters);

    queryBuilder.orderBy('request.timestamp', 'DESC');

    const drives = await queryBuilder.getMany();

    if (!drives.length) {
      throw new NotFoundException('Requests not found');
    }

    let filteredDrives = await this.filterByRating(drives, filters?.minRating);

    if (sort?.rating) {
      filteredDrives = await this.sortByRating(filteredDrives, sort.rating);
    }

    return filteredDrives;
  }

  async getOwnRequests(user: number): Promise<RequestDB[]> {
    const requests = await this.requestRepository.find({
      where: { user: { id: user } },
      relations: ['user', 'cargo', 'location'],
    });
    if (!requests) {
      throw new NotFoundException('Requests not found');
    }
    return requests;
  }
  async updateOffer(
    offerId: number,
    userId: number,
    updateData: CreateOfferDTO,
  ): Promise<OfferDB> {
    const offer = await this.offerRepository.findOne({
      where: { id: offerId },
      relations: ['user'],
    });
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }
    if (offer.user.id !== userId) {
      throw new UnauthorizedException('You are not the owner of this offer');
    }

    Object.assign(offer, updateData);

    try {
      return await this.offerRepository.save(offer);
    } catch (error) {
      throw new Error('An error occurred while updating the offer');
    }
  }

  async updateRequest(
    requestId: number,
    userId: number,
    updateData: CreateRequestDTO,
  ): Promise<RequestDB> {
    const request = await this.requestRepository.findOne({
      where: { id: requestId },
      relations: ['user'],
    });
    if (!request) {
      throw new NotFoundException('Request not found');
    }
    if (request.user.id !== userId) {
      throw new UnauthorizedException('You are not the owner of this request');
    }

    Object.assign(request, updateData);

    try {
      return await this.requestRepository.save(request);
    } catch (error) {
      throw new Error('An error occurred while updating the request');
    }
  }
  async updateStatus(
    offerId: number,
    userId: number,
    updateData: ChangeStatusDTO,
  ): Promise<DriveDB> {
    const drive = await this.driveRepository.findOne({
      where: { id: offerId },
      relations: ['user'],
    });
    if (!drive) {
      throw new NotFoundException('Offer not found');
    }
    if (drive.user.id !== userId) {
      throw new UnauthorizedException('You are not the owner of this offer');
    }

    drive.status = updateData.newStatus;

    try {
      return await this.driveRepository.save(drive);
    } catch (error) {
      throw new Error('An error occurred while updating the offer');
    }
  }
  async deleteDrive(driveId: number, userId: number) {
    const drive = await this.driveRepository.findOne({
      where: { id: driveId },
      relations: ['user'],
    });
    if (!drive) {
      throw new NotFoundException('Drive not found');
    }
    if (drive.user.id !== userId) {
      throw new UnauthorizedException('Drive is not yours!');
    }
    if (drive.status !== StatusEnum.created) {
      throw new BadRequestException(
        'Drive cannot be deleted because it is not in the created status',
      );
    }
    await this.driveRepository.remove(drive);
  }

  private applyDateFilter(
    queryBuilder: SelectQueryBuilder<RequestDB>,
    date?: Date,
  ) {
    if (date) {
      queryBuilder.andWhere('request.date = :date', { date });
    }
  }

  private applyReqLocationFilters(
    queryBuilder: SelectQueryBuilder<RequestDB>,
    startLocation?: string,
    endLocation?: string,
  ) {
    if (startLocation) {
      queryBuilder.andWhere(
        'locations.stopNr = 1 AND locations.city LIKE :startLocation',
        { startLocation: `%${startLocation}%` },
      );
    }

    if (endLocation) {
      queryBuilder.andWhere(
        'locations.stopNr = 100 AND locations.city LIKE :endLocation',
        { endLocation: `%${endLocation}%` },
      );
    }
  }

  private applyOfferLocationFilters(
    queryBuilder: SelectQueryBuilder<OfferDB>,
    startLocation?: string,
    endLocation?: string,
  ) {
    if (startLocation && endLocation) {
      queryBuilder.andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('loc1.driveId')
          .from(LocationDB, 'loc1')
          .leftJoin(LocationDB, 'loc2', 'loc1.driveId = loc2.driveId')
          .where('loc1.name LIKE :startLocation', {
            startLocation: `%${startLocation}%`,
          })
          .andWhere('loc2.name LIKE :endLocation', {
            endLocation: `%${endLocation}%`,
          })
          .andWhere('loc1.index < loc2.index')
          .getQuery();

        return 'request.id IN ' + subQuery;
      });
    } else if (startLocation) {
      queryBuilder.andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('loc.driveId')
          .from(LocationDB, 'loc')
          .where('loc.name LIKE :startLocation', {
            startLocation: `%${startLocation}%`,
          })
          .andWhere(
            'loc.index < (SELECT MAX(index) FROM LocationDB WHERE driveId = loc.driveId)',
          )
          .getQuery();

        return 'request.id IN ' + subQuery;
      });
    } else if (endLocation) {
      queryBuilder.andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('loc.driveId')
          .from(LocationDB, 'loc')
          .where('loc.name LIKE :endLocation', {
            endLocation: `%${endLocation}%`,
          })
          .andWhere('loc.index > 0')
          .getQuery();

        return 'request.id IN ' + subQuery;
      });
    }
  }

  private applyRequestSizeFilters(
    queryBuilder: SelectQueryBuilder<RequestDB>,
    filters?: FilterDTO,
  ) {
    if (filters?.seats) {
      queryBuilder.andWhere('request.seats >= :seats', {
        seats: filters.seats,
      });
    }

    if (filters?.weight) {
      queryBuilder.andWhere('request.weight >= :weight', {
        weight: filters.weight,
      });
    }

    if (filters?.height) {
      queryBuilder.andWhere('request.height >= :height', {
        height: filters.height,
      });
    }

    if (filters?.length) {
      queryBuilder.andWhere('request.length >= :length', {
        length: filters.length,
      });
    }

    if (filters?.width) {
      queryBuilder.andWhere('request.width >= :width', {
        width: filters.width,
      });
    }
  }

  private async filterByRating(
    drives: RequestDB[],
    minRating?: number,
  ): Promise<RequestDB[]> {
    if (!minRating) return drives;

    const filteredDrives = [];
    for (const drive of drives) {
      const rating = await this.reviewService.getRating(drive.user.id);
      if (rating >= minRating) {
        filteredDrives.push(drive);
      }
    }
    return filteredDrives;
  }

  private async sortByRating(
    drives: RequestDB[],
    sortOrder: 'ASC' | 'DESC',
  ): Promise<RequestDB[]> {
    const drivesWithRatings = await Promise.all(
      drives.map(async (drive) => {
        const rating = await this.reviewService.getRating(drive.user.id);
        return { drive, rating };
      }),
    );

    drivesWithRatings.sort((a, b) => {
      return sortOrder === 'ASC' ? a.rating - b.rating : b.rating - a.rating;
    });

    return drivesWithRatings.map((item) => item.drive);
  }
}
