import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleDB } from '../database/VehicleDB';
import { CarDB } from '../database/CarDB';
import { TrailerDB } from '../database/TrailerDB';
import { UserDB } from '../database/UserDB';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(VehicleDB)
    private vehicleRepository: Repository<VehicleDB>,
    @InjectRepository(CarDB)
    private carRepository: Repository<CarDB>,
    @InjectRepository(TrailerDB)
    private trailerRepository: Repository<TrailerDB>,
  ) {}

  async createCar(
    owner: UserDB,
    name: string,
    weight: number,
    length: number,
    height: number,
    width: number,
    seats: number,
    hasAC: boolean,
    hasTelevision: boolean,
  ): Promise<CarDB> {
    const newCar: CarDB = this.carRepository.create();

    newCar.owner = owner;
    newCar.name = name;
    newCar.weight = weight;
    newCar.length = length;
    newCar.height = height;
    newCar.width = width;
    newCar.seats = seats;
    newCar.hasAC = hasAC;
    newCar.hasTelevision = hasTelevision;

    return this.carRepository.save(newCar);
  }

  async createTrailer(
    owner: UserDB,
    name: string,
    weight: number,
    length: number,
    height: number,
    width: number,
    isCooled: boolean,
    isEnclosed: boolean,
  ): Promise<TrailerDB> {
    const newTrailer: TrailerDB = this.trailerRepository.create();

    newTrailer.owner = owner;
    newTrailer.name = name;
    newTrailer.weight = weight;
    newTrailer.length = length;
    newTrailer.height = height;
    newTrailer.width = width;
    newTrailer.isCooled = isCooled;
    newTrailer.isEnclosed = isEnclosed;

    return this.trailerRepository.save(newTrailer);
  }

  async getAllCarsForUser(userId: number): Promise<CarDB[]> {
    return this.carRepository.find({
      where: { owner: { id: userId } },
      relations: ['owner'],
    });
  }

  async getAllTrailersForUser(userId: number): Promise<TrailerDB[]> {
    return this.trailerRepository.find({
      where: { owner: { id: userId } },
      relations: ['owner'],
    });
  }

  async getVehicleById(vehicleId: number): Promise<VehicleDB> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: vehicleId },
    });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    return vehicle;
  }

  async updateCar(carData: CarDB): Promise<CarDB> {
    return await this.carRepository.save(carData);
  }

  async deleteVehicle(vehicleId: number, userId: number) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: vehicleId },
      relations: ['owner'],
    });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    if (vehicle.owner.id !== userId) {
      throw new UnauthorizedException('Vehicle is not yours!');
    }
    // TODO: check if theres an active trip with the car
    await this.vehicleRepository.remove(vehicle);
  }
}
