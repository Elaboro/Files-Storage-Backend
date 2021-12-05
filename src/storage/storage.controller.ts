import { Controller, Post, Body, Get, UploadedFiles, UseInterceptors, Delete, Param} from '@nestjs/common';
import { StorageService } from './storage.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UploadFilesDto } from './dto/upload-files.dto';
import { DeleteFileDto } from './dto/delete-file.dto';

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

    @Delete(":id")
    async delete(@Param() dto: DeleteFileDto)
    {
        return await this.storageService.delete(dto);
    }
}
