import { Test, TestingModule } from '@nestjs/testing';
import { databaseTest, tables } from '../../testDatabase/databaseTest';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs/promises';
import { UserService } from '../user/user.service';
import { SessionData } from 'express-session';
import { Repository } from 'typeorm';
import { UserDB } from '../database/UserDB';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { CreateCarDTO } from './DTO/CreateCarDTO';
import { CreateTrailerDTO } from './DTO/CreateTrailerDTO';
import { UserController } from '../user/user.controller';
import { CarDB } from '../database/CarDB';

jest.setTimeout(30000);

describe('VehicleController', () => {
  let module: TestingModule;
  let userService: UserService;
  let userRepository: Repository<UserDB>;
  let vehicleController: VehicleController;
  let vehicleService: VehicleService;

  const mockUser: UserDB = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'securepassword',
    birthday: new Date('2000-01-01'),
    phoneNumber: '0800555555',
    profileText: '',
    profilePic: '',
    offers: undefined,
    requests: undefined,
    writtenChats: undefined,
    writtenReviews: undefined,
    cars: undefined,
    receivedChats: undefined,
  };

  const mockSession: SessionData = {
    cookie: {
      originalMaxAge: null,
      expires: null,
      secure: false,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
    },
    currentUser: 1,
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        databaseTest('./testDatabase/dbTest.sqlite'),
        TypeOrmModule.forFeature(tables),
      ],
      controllers: [VehicleController, UserController],
      providers: [
        VehicleService,
        UserService,
        {
          provide: getRepositoryToken(UserDB),
          useClass: Repository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    vehicleController = module.get<VehicleController>(VehicleController);
    userRepository = module.get<Repository<UserDB>>(getRepositoryToken(UserDB));

    // Mocking repository methods
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    jest
      .spyOn(userRepository, 'create')
      .mockReturnValue(mockUser as unknown as UserDB);
    jest
      .spyOn(userRepository, 'save')
      .mockResolvedValue(mockUser as unknown as UserDB);

    jest.spyOn(userService, 'createUser').mockImplementation(async () => {
      return mockUser as unknown as UserDB;
    });

    jest
      .spyOn(userService, 'getUserById')
      .mockResolvedValue(mockUser as unknown as UserDB);
  });

  afterAll(async () => {
    await module.close();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      await fs.unlink('./testDatabase/dbTest.sqlite');
      console.log('Test database file removed');
    } catch (err) {
      console.error('Error removing test database file:', err);
    }
  });

  it('should be defined', async () => {
    expect(vehicleController).toBeDefined();
  });

  it('should create a car successfully', async () => {
    const mockCar: CreateCarDTO = {
      name: 'auto',
      weight: 200,
      height: 200,
      length: 200,
      width: 200,
      seats: 3,
      hasTelevision: true,
      hasAC: false,
    };

    jest.spyOn(vehicleService, 'createCar').mockImplementation(async () => {
      return mockCar as unknown as CarDB;
    });

    const carResponse = await vehicleController.createCar(mockCar, mockSession);

    expect(carResponse.ok).toBe(true);
    expect(carResponse.message).toBe('Car was created');
  });

  it('should create a trailer successfully', async () => {
    const trailerBody: CreateTrailerDTO = {
      name: 'trailer',
      weight: 300,
      height: 250,
      length: 300,
      width: 250,
      isCooled: true,
      isEnclosed: true,
    };

    const trailerResponse = await vehicleController.createTrailer(
      trailerBody,
      mockSession,
    );

    expect(trailerResponse.ok).toBe(true);
    expect(trailerResponse.message).toBe('Trailer was created');
  });
});
