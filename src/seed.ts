import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from './app.module';
import {
  Customer,
  Category,
  Product,
  LoyaltyAccount,
  PointEarningRule,
} from './entities';
import { Repository } from 'typeorm';
import { INestApplication } from '@nestjs/common';

/**
 * Seeds the database with initial data.
 * This function creates sample customers, categories, products, loyalty accounts, and point earning rules.
 * @returns {Promise<void>}
 */
export async function seed(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);
  const customerRepo: Repository<Customer> = app.get<Repository<Customer>>(
    getRepositoryToken(Customer),
  );
  const categoryRepo: Repository<Category> = app.get<Repository<Category>>(
    getRepositoryToken(Category),
  );
  const productRepo: Repository<Product> = app.get<Repository<Product>>(
    getRepositoryToken(Product),
  );
  const loyaltyAccountRepo: Repository<LoyaltyAccount> = app.get<
    Repository<LoyaltyAccount>
  >(getRepositoryToken(LoyaltyAccount));
  const pointEarningRuleRepo: Repository<PointEarningRule> = app.get<
    Repository<PointEarningRule>
  >(getRepositoryToken(PointEarningRule));

  // Adding sample customers
  const customer1: Customer = customerRepo.create({
    name: 'John Doe',
    email: 'john.doe@example.com',
  });
  const customer2: Customer = customerRepo.create({
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
  });
  await customerRepo.save([customer1, customer2]);

  // Adding sample categories
  const category1: Category = categoryRepo.create({ name: 'Electronics' });
  const category2: Category = categoryRepo.create({ name: 'Books' });

  // Check if default category already exists
  const existingDefaultCategory = await categoryRepo.findOne({
    where: { id: 0 },
  });
  let defaultCategory: Category;
  if (!existingDefaultCategory) {
    defaultCategory = categoryRepo.create({ id: 0, name: 'Default' });
    await categoryRepo.save(defaultCategory);
  } else {
    defaultCategory = existingDefaultCategory;
  }

  await categoryRepo.save([category1, category2]);

  // Adding sample products
  const product1: Product = productRepo.create({
    name: 'Laptop',
    price: 1200.0,
    category: category1,
    image_url:
      'https://upload.wikimedia.org/wikipedia/commons/e/e9/Apple-desk-laptop-macbook-pro_%2823699397893%29.jpg',
  });
  const product2: Product = productRepo.create({
    name: 'Science Fiction Book',
    price: 15.99,
    category: category2,
    image_url:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Eric_Frank_Russell_-_Die_Gro%C3%9Fe_Explosion_-_Cover.jpg/770px-Eric_Frank_Russell_-_Die_Gro%C3%9Fe_Explosion_-_Cover.jpg?20130713192345',
  });
  await productRepo.save([product1, product2]);

  // Adding sample loyalty accounts
  const loyaltyAccount1: LoyaltyAccount = loyaltyAccountRepo.create({
    customer: customer1,
    points: 100,
  });
  const loyaltyAccount2: LoyaltyAccount = loyaltyAccountRepo.create({
    customer: customer2,
    points: 200,
  });
  await loyaltyAccountRepo.save([loyaltyAccount1, loyaltyAccount2]);

  // Adding point earning rules
  const defaultRule: PointEarningRule = pointEarningRuleRepo.create({
    category: defaultCategory,
    pointsPerDollar: 1,
    startDate: new Date(1900, 0, 1),
    endDate: new Date(2099, 11, 31),
  });
  const rule1: PointEarningRule = pointEarningRuleRepo.create({
    category: category1,
    pointsPerDollar: 2,
    startDate: new Date(2023, 0, 1),
    endDate: new Date(2023, 11, 31),
  });
  const rule2: PointEarningRule = pointEarningRuleRepo.create({
    category: category2,
    pointsPerDollar: 1,
    startDate: new Date(2023, 0, 1),
    endDate: new Date(2023, 11, 31),
  });
  await pointEarningRuleRepo.save([defaultRule, rule1, rule2]);

  console.log('Database seeded successfully');
  await app.close();
}

seed().catch((error: Error) => console.error(error));
