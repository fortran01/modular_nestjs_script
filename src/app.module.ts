import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LoyaltyController } from './loyalty.controller';
import { LoyaltyService } from './loyalty.service';
import { AuthGuard } from './auth.guard';
import {
  Customer,
  LoyaltyAccount,
  PointTransaction,
  Product,
  Category,
  PointEarningRule,
} from './entities';

/**
 * Main application module configuration.
 */
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'loyalty_program.db',
      entities: [
        Customer,
        LoyaltyAccount,
        PointTransaction,
        Product,
        Category,
        PointEarningRule,
      ],
      synchronize: true,
    } as TypeOrmModuleOptions),
    TypeOrmModule.forFeature([
      Customer,
      LoyaltyAccount,
      PointTransaction,
      Product,
      Category,
      PointEarningRule,
    ]),
  ],
  controllers: [LoyaltyController],
  providers: [LoyaltyService, AuthGuard],
})
export class AppModule {}
