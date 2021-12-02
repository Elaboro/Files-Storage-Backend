import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  providers: [FilesService],
  controllers: [FilesController],
  imports: [
    UtilsModule
  ]
})
export class FilesModule {}
