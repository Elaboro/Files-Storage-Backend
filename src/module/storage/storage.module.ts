import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { AuthModule } from '../auth/auth.module';
import { UtilsModule } from '../utils/utils.module';
import { StorageRepo } from './repository/StorageRepo';
import { Storage } from './entity/storage.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageManager } from './manager/StorageManager';

@Module({
  providers: [StorageService, StorageRepo, StorageManager],
  controllers: [StorageController],
  imports: [
    TypeOrmModule.forFeature([Storage]),
    AuthModule,
    UtilsModule
  ],
})
export class StorageModule {}
