import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from './location.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LocationDB } from '../database/LocationDB';
import { NotFoundException } from '@nestjs/common';

describe('LocationService', () => {
  let service: LocationService;
  let repository: Repository<LocationDB>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: getRepositoryToken(LocationDB),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
    repository = module.get<Repository<LocationDB>>(
      getRepositoryToken(LocationDB),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a location by ID', async () => {
    const location = { id: 1 } as LocationDB;
    jest.spyOn(repository, 'findOne').mockResolvedValue(location);

    const result = await service.getLocationById(1);
    expect(result).toEqual(location);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should throw NotFoundException if location is not found by ID', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(service.getLocationById(1)).rejects.toThrow(NotFoundException);
  });

  it('should return a location of a drive', async () => {
    const location = { id: 1, stopNr: 1, drive: { id: 1 } } as LocationDB;
    jest.spyOn(repository, 'findOne').mockResolvedValue(location);

    const result = await service.getLocationsOfDrive(1, 1);
    expect(result).toEqual(location);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { stopNr: 1, drive: { id: 1 } },
    });
  });

  it('should throw NotFoundException if location is not found for a drive', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(service.getLocationsOfDrive(1, 1)).rejects.toThrow(
      NotFoundException,
    );
  });
});
