import { Test, TestingModule } from '@nestjs/testing';
import { VehicleService } from './vehicle.service';

describe('VehicleService', () => {
    let provider: VehicleService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [VehicleService],
        }).compile();

        provider = module.get<VehicleService>(VehicleService);
    });

    it('should be defined', () => {
        expect(provider).toBeDefined();
    });
});
