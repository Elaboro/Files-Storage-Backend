import { Controller, Post, Body, Get, UploadedFiles, UseInterceptors} from '@nestjs/common';
import { StorageService } from './storage.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('storage')
export class StorageController
{
    constructor(private storageService: StorageService) {}

    @Post()
    @UseInterceptors(AnyFilesInterceptor())
    upload(@UploadedFiles() files: Array<Express.Multer.File>)
    {
        return this.storageService.save(files);
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
