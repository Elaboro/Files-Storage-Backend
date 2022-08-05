import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [StorageService],
  controllers: [StorageController],
  imports: [
    AuthModule,
  ],
})
export class StorageModule {}
