import { Module } from '@nestjs/common';
import { StorageModule } from './module/storage/storage.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Storage } from './module/entity/storage.model';
import { AuthModule } from './module/auth/auth.module';
import { Users } from './module/entity/users.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [Storage, Users],
      synchronize: false,
    }),
    StorageModule,
    AuthModule,
  ],
})
export class AppModule {}
