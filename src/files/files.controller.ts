import { Controller, Post, Body, Get } from '@nestjs/common';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController
{
    constructor(private filesService: FilesService) {}

    @Post()
    upload(@Body() body: {stub: string})
    {
        return this.filesService.upload();
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
