import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { LoyaltyService } from './../src/loyalty.service';
import { createTestApp } from './setup';

describe('LoyaltyController (e2e)', () => {
  let app: INestApplication;
  let loyaltyService: LoyaltyService;

  beforeEach(async () => {
    app = await createTestApp();
    loyaltyService = app.get<LoyaltyService>(LoyaltyService);
  });

  it('/login (POST)', async () => {
    const customer = { customer_id: '1' };
    jest
      .spyOn(loyaltyService, 'findCustomerById')
      .mockResolvedValueOnce(customer as any);

    await request(app.getHttpServer())
      .post('/login')
      .send({ customer_id: '1' })
      .expect(201)
      .expect({ success: true });
  });

  it('/logout (GET)', async () => {
    await request(app.getHttpServer())
      .get('/logout')
      .expect(200)
      .expect({ success: true });
  });

  it('/checkout (POST)', async () => {
    const body = { product_ids: [1, 2] };
    const result = {
      total_points_earned: 100,
      invalid_products: [],
      products_missing_category: [],
      point_earning_rules_missing: [],
    };

    jest.spyOn(loyaltyService, 'checkout').mockResolvedValueOnce(result as any);

    await request(app.getHttpServer())
      .post('/checkout')
      .send(body)
      .set('Cookie', 'customer_id=1')
      .expect(201)
      .expect(result);
  });

  afterEach(async () => {
    await app.close();
  });
});
