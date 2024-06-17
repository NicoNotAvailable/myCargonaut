import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationDB } from '../database/LocationDB';

@Injectable()
export class LocationService {
    constructor(
        @InjectRepository(LocationDB)
        private locationRepository: Repository<LocationDB>,
    ) {}

    async getLocationById(locationID: number): Promise<LocationDB> {
        const location = await this.locationRepository.findOne({
            where: { id: locationID },
        });
        if (!location) {
            throw new NotFoundException('Location not found');
        }
        return location;
    }
}
