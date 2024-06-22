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
import { CreateCarDTO } from './DTO/CreateCarDTO';
import { CreateTrailerDTO } from './DTO/CreateTrailerDTO';

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

  async createCar(owner: UserDB, body: CreateCarDTO): Promise<CarDB> {
    const newCar: CarDB = this.carRepository.create();
    if (owner instanceof UserDB) {
      newCar.owner = owner;
    } else {
      throw new Error('Invalid owner type');
    }
    // Set the values for the new car
    newCar.name = body.name.trim();
    newCar.weight = body.weight;
    newCar.length = body.length;
    newCar.height = body.height;
    newCar.width = body.width;
    newCar.seats = body.seats;
    newCar.hasAC = body.hasAC;
    newCar.hasTelevision = body.hasTelevision;

    try {
      // Save the new car
      const savedCar = await this.carRepository.save(newCar);
      return savedCar;
    } catch (error) {
      console.log('Error saving CarDB:', error);
      throw new Error('An error occurred while saving the car');
    }
  }

  async createTrailer(
    owner: UserDB,
    body: CreateTrailerDTO,
  ): Promise<TrailerDB> {
    const newTrailer: TrailerDB = this.trailerRepository.create();

    newTrailer.owner = owner;
    newTrailer.name = body.name.trim();
    newTrailer.weight = body.weight;
    newTrailer.length = body.length;
    newTrailer.height = body.height;
    newTrailer.width = body.width;
    newTrailer.isCooled = body.isCooled;
    newTrailer.isEnclosed = body.isEnclosed;

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

  async getCarById(carId: number): Promise<CarDB> {
    const car = await this.carRepository.findOne({
      where: { id: carId },
    });
    if (!car) {
      throw new NotFoundException('Car not found');
    }
    return car;
  }

  async getTrailerById(trailerId: number): Promise<TrailerDB> {
    const trailer = await this.trailerRepository.findOne({
      where: { id: trailerId },
    });
    if (!trailer) {
      throw new NotFoundException('Trailer not found');
    }
    return trailer;
  }

  async updateCar(carData: CarDB): Promise<CarDB> {
    return this.carRepository.save(carData);
  }

  async updateTrailer(trailerData: TrailerDB): Promise<TrailerDB> {
    return this.trailerRepository.save(trailerData);
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
