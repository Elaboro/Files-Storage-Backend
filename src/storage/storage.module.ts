import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { UtilsModule } from '../utils/utils.module';

@Module({
  providers: [StorageService],
  controllers: [StorageController],
  imports: [
    UtilsModule
  ]
})
export class StorageModule {}
