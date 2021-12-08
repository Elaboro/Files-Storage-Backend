import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { UtilsModule } from '../utils/utils.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [StorageService],
  controllers: [StorageController],
  imports: [
    UtilsModule,
    AuthModule
  ]
})
export class StorageModule {}
