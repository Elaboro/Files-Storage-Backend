import { 
    Controller, 
    Post, 
    Body, 
    Get, 
    UploadedFiles, 
    UseInterceptors, 
    Delete, 
    Param, 
    UseGuards,
    Request
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UploadFilesDto } from './dto/upload-files.dto';
import { DeleteFileDto } from './dto/delete-file.dto';
import { DownloadFileDto } from './dto/download-file.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Users } from '../entity/users.model';
import { Response } from '@nestjs/common';
import { Response as Res } from 'express';

@Controller('storage')
export class StorageController
{
    constructor(private storageService: StorageService) {}

    @UseGuards(JwtAuthGuard)
    @Post("upload")
    @UseInterceptors(AnyFilesInterceptor())
    async upload(
        @Body() dto: UploadFilesDto,
        @UploadedFiles() files: Array<Express.Multer.File>, 
        @Request() request
    ) {
        let user: Users = request.user;
        return await this.storageService.save(dto, files, user);
    }

    @UseGuards(JwtAuthGuard)
    @Get("download/id/:id/key/:key")
    async download(
        @Param() dto: DownloadFileDto, 
        @Response() res: Res
    ) {
        let file = await this.storageService.choose(dto);

        res.set({
            "Content-Type": "application/force-download",
            "Content-Disposition": `attachment; filename="${encodeURIComponent(file.name)}"`
        });

        file.data.pipe(res);
    }

    @UseGuards(JwtAuthGuard)
    @Delete("delete/:id")
    async delete(@Param() dto: DeleteFileDto)
    {
        return await this.storageService.delete(dto);
    }

    @Get()
    storageInformation()
    {
        return this.storageService.getInformation();
    }
}
