import { Controller, Post, Body, Get, UploadedFile, UseInterceptors } from '@nestjs/common';
import { StorageService } from './storage.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('storage')
export class StorageController
{
    constructor(private storageService: StorageService) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    upload(@UploadedFile() file)
    {
        return this.storageService.upload(file);
    }

    @Get()
    download(@Body() body: {stub: string})
    {
        return this.storageService.download();
    }

    @Post()
    delete(@Body() body: {stub: string})
    {
        return this.storageService.delete();
    }
}
