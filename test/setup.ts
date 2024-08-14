import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as cookieParser from 'cookie-parser';
/**
 * Initializes a NestJS application for testing.
 * @returns A promise that resolves to the initialized NestJS application.
 */
async function createTestApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.use(cookieParser());
  await app.init();
  return app;
}

export { createTestApp };
