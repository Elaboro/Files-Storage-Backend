import { Module } from '@nestjs/common';
import { StorageModule } from './module/storage/storage.module';
import { AuthModule } from './module/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourcePostgres } from './config/datasource';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        autoLoadEntities: true
      }),
      dataSourceFactory: async () => dataSourcePostgres
    }),
    StorageModule,
    AuthModule,
  ],
})
export class AppModule {}
