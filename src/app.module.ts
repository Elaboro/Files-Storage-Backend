import { Module } from '@nestjs/common';
import { StorageModule } from './module/storage/storage.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Storage } from './module/entity/storage.model';
import { AuthModule } from './module/auth/auth.module';
import { Users } from './module/entity/users.model';
import cfg from './config/app.config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: cfg.POSTGRES_HOST,
      port: cfg.POSTGRES_PORT,
      username: cfg.POSTGRES_USERNAME,
      password: cfg.POSTGRES_PASSWORD,
      database: cfg.POSTGRES_DATABASE,
      entities: [Storage, Users],
      synchronize: false,
    }),
    StorageModule,
    AuthModule,
  ],
})
export class AppModule {}
