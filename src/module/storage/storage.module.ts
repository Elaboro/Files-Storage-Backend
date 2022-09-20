import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { AuthModule } from '../auth/auth.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  providers: [StorageService],
  controllers: [StorageController],
  imports: [
    AuthModule,
    UtilsModule
  ],
})
export class StorageModule {}
