import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { UtilsModule } from '../utils/utils.module';
import { AuthModule } from '../auth/auth.module';
import { RemoteServerModule } from '../remote-server/remote-server.module';
import { FilesModule } from '../files/files.module';

@Module({
  providers: [StorageService],
  controllers: [StorageController],
  imports: [UtilsModule, AuthModule, RemoteServerModule, FilesModule],
})
export class StorageModule {}
