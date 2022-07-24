import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import cfg from './config/app.config';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);
  const PORT: string = cfg.PORT;
  await app.listen(PORT);
}
bootstrap();
