import { Controller, Post, Body, Get, UploadedFiles, UseInterceptors} from '@nestjs/common';
import { StorageService } from './storage.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UploadFilesDto } from './dto/upload-files.dto';

@Controller('storage')
export class StorageController
{
    constructor(private storageService: StorageService) {}

    @Post()
    @UseInterceptors(AnyFilesInterceptor())
    async upload(@Body() dto: UploadFilesDto,
        @UploadedFiles() files: Array<Express.Multer.File>)
    {
        return await this.storageService.save(dto, files);
    }

    @Get()
    download(@Body() body: {stub: string})
    {
        return this.storageService.choose();
    }

    @Post()
    delete(@Body() body: {stub: string})
    {
        return this.storageService.delete();
    }
}
