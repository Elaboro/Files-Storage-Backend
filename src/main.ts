import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  OpenAPIObject,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import cfg from './config/app.config';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);

  const config: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle("Files Storage API")
    .setDescription("Demo access: user user")
    .addBearerAuth()
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/api/docs", app, document);

  app.enableCors();

  const PORT: string = cfg.PORT;
  await app.listen(PORT);
}
bootstrap();
