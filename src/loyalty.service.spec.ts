import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoyaltyService } from './loyalty.service';
import {
  Customer,
  LoyaltyAccount,
  PointTransaction,
  Product,
  Category,
  PointEarningRule,
} from './entities';

describe('LoyaltyService', () => {
  let service: LoyaltyService;
  let customerRepository: Repository<Customer>;
  let loyaltyAccountRepository: Repository<LoyaltyAccount>;
  let pointTransactionRepository: Repository<PointTransaction>;
  let productRepository: Repository<Product>;
  let pointEarningRuleRepository: Repository<PointEarningRule>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoyaltyService,
        {
          provide: getRepositoryToken(Customer),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(LoyaltyAccount),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(PointTransaction),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(PointEarningRule),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<LoyaltyService>(LoyaltyService);
    customerRepository = module.get<Repository<Customer>>(
      getRepositoryToken(Customer),
    );
    loyaltyAccountRepository = module.get<Repository<LoyaltyAccount>>(
      getRepositoryToken(LoyaltyAccount),
    );
    pointTransactionRepository = module.get<Repository<PointTransaction>>(
      getRepositoryToken(PointTransaction),
    );
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    pointEarningRuleRepository = module.get<Repository<PointEarningRule>>(
      getRepositoryToken(PointEarningRule),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkout', () => {
    it('should process checkout successfully', async () => {
      const mockLoyaltyAccount = { id: 1, points: 0 };
      const mockProduct = { id: 1, price: 100, category: { id: 1 } };
      const mockPointEarningRule = { pointsPerDollar: 1 };

      jest
        .spyOn(loyaltyAccountRepository, 'findOne')
        .mockResolvedValue(mockLoyaltyAccount as any);
      jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(mockProduct as any);
      jest
        .spyOn(pointEarningRuleRepository, 'findOne')
        .mockResolvedValue(mockPointEarningRule as any);
      jest
        .spyOn(pointTransactionRepository, 'create')
        .mockReturnValue({} as any);
      jest
        .spyOn(pointTransactionRepository, 'save')
        .mockResolvedValue({} as any);
      jest.spyOn(loyaltyAccountRepository, 'save').mockResolvedValue({} as any);

      const result = await service.checkout(1, [1]);

      expect(result).toEqual({
        total_points_earned: 100,
        invalid_products: [],
        products_missing_category: [],
        point_earning_rules_missing: [],
      });
    });

    it('should handle invalid products', async () => {
      jest
        .spyOn(loyaltyAccountRepository, 'findOne')
        .mockResolvedValue({} as any);
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(loyaltyAccountRepository, 'save').mockResolvedValue({} as any);

      const result = await service.checkout(1, [999]);

      expect(result).toEqual({
        total_points_earned: 0,
        invalid_products: [999],
        products_missing_category: [],
        point_earning_rules_missing: [],
      });
    });

    it('should throw error when loyalty account not found', async () => {
      jest.spyOn(loyaltyAccountRepository, 'findOne').mockResolvedValue(null);

      await expect(service.checkout(1, [1])).rejects.toThrow(
        'Loyalty account not found',
      );
    });
  });

  describe('findCustomerById', () => {
    it('should find a customer by id', async () => {
      const mockCustomer = { id: 1, name: 'Test Customer' };
      jest
        .spyOn(customerRepository, 'findOne')
        .mockResolvedValue(mockCustomer as Customer);

      const result = await service.findCustomerById('1');

      expect(result).toEqual(mockCustomer);
    });

    it('should return undefined when customer not found', async () => {
      jest.spyOn(customerRepository, 'findOne').mockResolvedValue(undefined);

      const result = await service.findCustomerById('999');

      expect(result).toBeUndefined();
    });
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
      ];
      jest
        .spyOn(productRepository, 'find')
        .mockResolvedValue(mockProducts as Product[]);

      const result = await service.getAllProducts();

      expect(result).toEqual(mockProducts);
    });
  });
});
