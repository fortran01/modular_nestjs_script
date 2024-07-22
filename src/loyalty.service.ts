import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Customer,
  LoyaltyAccount,
  PointTransaction,
  Product,
  Category,
  PointEarningRule,
} from './entities';

/**
 * Service handling loyalty-related operations.
 */
@Injectable()
export class LoyaltyService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(LoyaltyAccount)
    private loyaltyAccountRepository: Repository<LoyaltyAccount>,
    @InjectRepository(PointTransaction)
    private pointTransactionRepository: Repository<PointTransaction>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(PointEarningRule)
    private pointEarningRuleRepository: Repository<PointEarningRule>,
  ) {}

  /**
   * Processes a checkout operation, calculating loyalty points based on purchased products.
   * @param customerId The ID of the customer making the purchase.
   * @param productIds An array of product IDs being purchased.
   * @returns A promise resolving to an object detailing the transaction results.
   */
  async checkout(
    customerId: number,
    productIds: number[],
  ): Promise<{
    total_points_earned: number;
    invalid_products: number[];
    products_missing_category: number[];
    point_earning_rules_missing: number[];
  }> {
    const loyaltyAccount: LoyaltyAccount | null =
      await this.loyaltyAccountRepository.findOne({
        where: { customer: { id: customerId } },
      });
    if (!loyaltyAccount) {
      throw new Error('Loyalty account not found');
    }

    let totalPointsEarned: number = 0;
    const invalidProducts: number[] = [];
    const productsMissingCategory: number[] = [];
    const pointEarningRulesMissing: number[] = [];

    for (const productId of productIds) {
      const product: Product | null = await this.productRepository.findOne({
        where: { id: productId },
        relations: ['category'],
      });
      if (!product) {
        invalidProducts.push(productId);
        continue;
      }

      if (!product.category) {
        productsMissingCategory.push(productId);
        continue;
      }

      let defaultRule: PointEarningRule | null = null;

      const pointEarningRule: PointEarningRule | null =
        await this.pointEarningRuleRepository.findOne({
          where: { category: { id: product.category.id } },
          order: { startDate: 'DESC' },
        });

      if (!pointEarningRule) {
        defaultRule = await this.pointEarningRuleRepository.findOne({
          where: { category: { id: 0 } },
          order: { startDate: 'DESC' },
        });

        if (!defaultRule) {
          pointEarningRulesMissing.push(productId);
          continue;
        }
      }

      const rule: PointEarningRule = pointEarningRule || defaultRule!;
      const pointsEarned: number = Math.floor(
        product.price * rule.pointsPerDollar,
      );

      const pointTransaction: PointTransaction =
        this.pointTransactionRepository.create({
          loyaltyAccount,
          product,
          pointsEarned,
          transactionDate: new Date(),
        });
      await this.pointTransactionRepository.save(pointTransaction);

      totalPointsEarned += pointsEarned;
    }

    loyaltyAccount.points += totalPointsEarned;
    await this.loyaltyAccountRepository.save(loyaltyAccount);

    return {
      total_points_earned: totalPointsEarned,
      invalid_products: invalidProducts,
      products_missing_category: productsMissingCategory,
      point_earning_rules_missing: pointEarningRulesMissing,
    };
  }

  /**
   * Finds a customer by their ID.
   * @param customerId The ID of the customer as a string.
   * @returns A promise that resolves to the customer if found, otherwise undefined.
   */
  async findCustomerById(customerId: string): Promise<Customer | undefined> {
    return this.customerRepository.findOne({
      where: { id: parseInt(customerId) },
    });
  }

  /**
   * Fetches all products from the repository.
   * @returns A promise resolving to an array of Product entities.
   */
  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.find();
  }
}
