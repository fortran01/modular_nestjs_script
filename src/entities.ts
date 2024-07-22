import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

/**
 * Represents a customer in the loyalty program.
 */
@Entity()
export class Customer {
  /**
   * The primary key for the customer.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The name of the customer.
   */
  @Column()
  name: string;

  /**
   * The email of the customer.
   */
  @Column()
  email: string;

  /**
   * The loyalty accounts associated with the customer.
   */
  @OneToMany(() => LoyaltyAccount, (account) => account.customer)
  loyaltyAccounts: LoyaltyAccount[];
}

/**
 * Represents a loyalty account in the loyalty program.
 */
@Entity()
export class LoyaltyAccount {
  /**
   * The primary key for the loyalty account.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The customer associated with the loyalty account.
   */
  @ManyToOne(() => Customer, (customer) => customer.loyaltyAccounts)
  customer: Customer;

  /**
   * The points accumulated in the loyalty account.
   */
  @Column({ default: 0 })
  points: number;

  /**
   * The point transactions associated with the loyalty account.
   */
  @OneToMany(
    () => PointTransaction,
    (transaction) => transaction.loyaltyAccount,
  )
  pointTransactions: PointTransaction[];
}

/**
 * Represents a category in the loyalty program.
 */
@Entity()
export class Category {
  /**
   * The primary key for the category.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The name of the category.
   */
  @Column()
  name: string;

  /**
   * The products associated with the category.
   */
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  /**
   * The point earning rules associated with the category.
   */
  @OneToMany(() => PointEarningRule, (rule) => rule.category)
  pointEarningRules: PointEarningRule[];
}

/**
 * Represents a product in the loyalty program.
 */
@Entity()
export class Product {
  /**
   * The primary key for the product.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The name of the product.
   */
  @Column()
  name: string;

  /**
   * The price of the product.
   */
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  /**
   * The category associated with the product.
   */
  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  /**
   * The image URL of the product.
   */
  @Column()
  image_url: string;

  /**
   * The point transactions associated with the product.
   */
  @OneToMany(() => PointTransaction, (transaction) => transaction.product)
  pointTransactions: PointTransaction[];
}

/**
 * Represents a point transaction in the loyalty program.
 */
@Entity()
export class PointTransaction {
  /**
   * The primary key for the point transaction.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The loyalty account associated with the point transaction.
   */
  @ManyToOne(() => LoyaltyAccount, (account) => account.pointTransactions)
  loyaltyAccount: LoyaltyAccount;

  /**
   * The product associated with the point transaction.
   */
  @ManyToOne(() => Product, (product) => product.pointTransactions)
  product: Product;

  /**
   * The points earned in the transaction.
   */
  @Column()
  pointsEarned: number;

  /**
   * The date of the transaction.
   */
  @Column()
  transactionDate: Date;
}

/**
 * Represents a point earning rule in the loyalty program.
 */
@Entity()
export class PointEarningRule {
  /**
   * The primary key for the point earning rule.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The category associated with the point earning rule.
   */
  @ManyToOne(() => Category, (category) => category.pointEarningRules)
  category: Category;

  /**
   * The points earned per dollar spent.
   */
  @Column()
  pointsPerDollar: number;

  /**
   * The start date of the point earning rule.
   */
  @Column()
  startDate: Date;

  /**
   * The end date of the point earning rule.
   */
  @Column()
  endDate: Date;
}
