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
  async getAllOffers(
    user?: UserDB,
    filters?: FilterDTO,
    sort?: {
      sort?: 'timeAsc' | 'timeDesc' | 'rating' | 'price';
    },
  ): Promise<OfferDB[]> {
    const queryBuilder = this.offerRepository
      .createQueryBuilder('offer')
      .leftJoinAndSelect('offer.user', 'user')
      .leftJoinAndSelect('offer.car', 'car')
      .leftJoinAndSelect('offer.trailer', 'trailer')
      .leftJoinAndSelect('offer.location', 'location');

    queryBuilder.andWhere('request.status = 0');

    if (user) {
      queryBuilder.andWhere('request.user.id != :userId', { userId: user.id });
    }

    this.applyDateFilter(queryBuilder, filters?.date);
    this.applyOfferLocationFilters(
      queryBuilder,
      filters?.startLocation,
      filters?.endLocation,
    );

    queryBuilder.orderBy('offer.timestamp', 'DESC');

    let offers = await queryBuilder.getMany();
    if (!offers.length) {
      throw new NotFoundException('Offers not found');
    }

    offers = await this.filterByRating(offers, filters?.minRating);

    if (sort?.sort) {
      offers = await this.sortOrder(offers, sort.sort);
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
      sort?: 'timeAsc' | 'timeDesc' | 'rating' | 'price';
    },
  ): Promise<RequestDB[]> {
    const queryBuilder = this.requestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.user', 'user')
      .leftJoinAndSelect('request.cargo', 'cargo')
      .leftJoinAndSelect('request.location', 'locations');

    queryBuilder.andWhere('request.status = 0');

    if (user) {
      queryBuilder.andWhere('request.user.id != :userId', { userId: user.id });
    }

    this.applyDateFilter(queryBuilder, filters?.date);
    this.applyReqLocationFilters(
      queryBuilder,
      filters?.startLocation,
      filters?.endLocation,
    );

    queryBuilder.orderBy('request.timestamp', 'DESC');

    const drives = await queryBuilder.getMany();

    if (!drives.length) {
      throw new NotFoundException('Requests not found');
    }

    let filteredDrives: RequestDB[] = await this.filterByRating(
      drives,
      filters?.minRating,
    );

    filteredDrives = await this.applyRequestSizeFilters(
      filteredDrives,
      filters,
    );

    if (sort?.sort) {
      filteredDrives = await this.sortOrder(filteredDrives, sort.sort);
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

  private applyDateFilter(queryBuilder: SelectQueryBuilder<any>, date?: Date) {
    if (date) {
      queryBuilder.andWhere('DATE(request.date) = DATE(:date)', { date });
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
          .select('loc.driveId')
          .from(LocationDB, 'loc')
          .where('loc.city LIKE :startLocation', {
            startLocation: `%${startLocation}%`,
          })
          .andWhere(
            'loc.driveId IN ' +
              qb
                .subQuery()
                .select('loc2.driveId')
                .from(LocationDB, 'loc2')
                .where('loc2.city LIKE :endLocation', {
                  endLocation: `%${endLocation}%`,
                })
                .andWhere('loc2.stopNr > loc.stopNr')
                .getQuery(),
          )
          .getQuery();

        return 'offer.id IN ' + subQuery;
      });
    } else if (startLocation) {
      queryBuilder.andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('loc.driveId')
          .from(LocationDB, 'loc')
          .where('loc.city LIKE :startLocation', {
            startLocation: `%${startLocation}%`,
          })
          .andWhere(
            'loc.driveId IN ' +
              qb
                .subQuery()
                .select('loc2.driveId')
                .from(LocationDB, 'loc2')
                .where('loc2.stopNr >= loc.stopNr')
                .getQuery(),
          )
          .getQuery();

        return 'offer.id IN ' + subQuery;
      });
    } else if (endLocation) {
      queryBuilder.andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('loc.driveId')
          .from(LocationDB, 'loc')
          .where('loc.city LIKE :endLocation', {
            endLocation: `%${endLocation}%`,
          })
          .andWhere(
            'loc.driveId IN ' +
              qb
                .subQuery()
                .select('loc2.driveId')
                .from(LocationDB, 'loc2')
                .where('loc2.stopNr < loc.stopNr')
                .getQuery(),
          )
          .getQuery();

        return 'offer.id IN ' + subQuery;
      });
    }
  }

  private async applyRequestSizeFilters(
    requests: RequestDB[],
    filters?: FilterDTO,
  ): Promise<RequestDB[]> {
    if (!filters) return requests;

    return requests.filter(async (request) => {
      const cargos = await request.cargo;

      const weight = cargos.reduce((sum, cargo) => sum + cargo.weight, 0);
      const maxHeight = Math.max(...cargos.map((cargo) => cargo.height), 0);
      const maxLength = Math.max(...cargos.map((cargo) => cargo.length), 0);
      const maxWidth = Math.max(...cargos.map((cargo) => cargo.width), 0);

      let isValid = true;

      if (filters.seats && request.seats < filters.seats) {
        isValid = false;
      }

      if (filters.weight && weight > filters.weight) {
        isValid = false;
      }

      if (filters.height && maxHeight > filters.height) {
        isValid = false;
      }

      if (filters.length && maxLength > filters.length) {
        isValid = false;
      }

      if (filters.width && maxWidth > filters.width) {
        isValid = false;
      }

      return isValid;
    });
  }

  private async filterByRating(
    drives: any[],
    minRating?: number,
  ): Promise<any[]> {
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

  private async sortOrder(
    drives: DriveDB[],
    sortOrder: 'timeAsc' | 'timeDesc' | 'rating' | 'price',
  ): Promise<any[]> {
    const drivesWithRatings = await Promise.all(
      drives.map(async (drive) => {
        const rating = await this.reviewService.getRating(drive.user.id);
        return { drive, rating };
      }),
    );
    drivesWithRatings.sort((a, b) => {
      switch (sortOrder) {
        case 'rating':
          return b.rating - a.rating;
        case 'timeAsc':
          return (
            new Date(a.drive.timestamp).getTime() -
            new Date(b.drive.timestamp).getTime()
          );
        case 'timeDesc':
          return (
            new Date(b.drive.timestamp).getTime() -
            new Date(a.drive.timestamp).getTime()
          );
        case 'price':
          return b.drive.price - a.drive.price;
      }
    });
    return drivesWithRatings.map((item) => item.drive);
  }
}
