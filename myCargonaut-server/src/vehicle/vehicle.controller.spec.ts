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
import { CreateUserDTO } from '../user/DTO/CreateUserDTO';

jest.setTimeout(30000);

describe('VehicleController', () => {
    let module: TestingModule;
    let userService: UserService;
    let userRepository: Repository<UserDB>;
    let vehicleController: VehicleController;

    const userId = 1;
    const mockUser: CreateUserDTO = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        emailConfirm: 'john.doe@example.com',
        password: 'securepassword',
        passwordConfirm: 'securepassword',
        agb: true,
        birthday: new Date('2000-01-01'),
        phoneNumber: '0800555555',
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
        currentUser: userId,
    };

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                databaseTest('./testDatabase/dbTest.sqlite'),
                TypeOrmModule.forFeature(tables),
            ],
            controllers: [VehicleController],
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
        // vehicleService = module.get<VehicleService>(VehicleService);
        vehicleController = module.get<VehicleController>(VehicleController);
        userRepository = module.get<Repository<UserDB>>(
            getRepositoryToken(UserDB),
        );

        jest.spyOn(userRepository, 'findOne').mockResolvedValue(
            mockUser as unknown as UserDB,
        );
        jest.spyOn(userService, 'getUserById').mockResolvedValue(
            mockUser as unknown as UserDB,
        );
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

    it('should create a car successfully', async () => {
        const carBody: CreateCarDTO = {
            name: 'auto',
            weight: 200,
            height: 200,
            length: 200,
            width: 200,
            seats: 3,
            hasTelevision: true,
            hasAC: false,
        };

        const carResponse = await vehicleController.createCar(
            carBody,
            mockSession,
        );

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
