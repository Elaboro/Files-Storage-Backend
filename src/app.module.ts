import { Module } from '@nestjs/common';
import { FilesModule } from './files/files.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [FilesModule, UtilsModule]
})
export class AppModule
{}