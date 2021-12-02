import { Controller, Post, Body, Get, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController
{
    constructor(private filesService: FilesService) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    upload(@UploadedFile() file)
    {
        return this.filesService.upload(file);
    }

    @Get()
    download(@Body() body: {stub: string})
    {
        return this.filesService.download();
    }

    @Post()
    delete(@Body() body: {stub: string})
    {
        return this.filesService.delete();
    }
}
