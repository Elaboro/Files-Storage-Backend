import { Module } from '@nestjs/common';
import { StorageModule } from './module/storage/storage.module';
import { AuthModule } from './module/auth/auth.module';

@Module({
  imports: [
    StorageModule,
    AuthModule,
  ],
})
export class AppModule {}
