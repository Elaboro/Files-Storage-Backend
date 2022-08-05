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
  Request,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UploadFilesDto } from './dto/upload-files.dto';
import { DeleteFileDto } from './dto/delete-file.dto';
import { DownloadFileDto } from './dto/download-file.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Users } from '../auth/entity/users.model';
import { Response } from '@nestjs/common';
import { Response as Res } from 'express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { IStorageFile } from './interfaces/IStorageFile';

@ApiTags('Storage')
@Controller('storage')
export class StorageController {
  constructor(private storageService: StorageService) {}

  @ApiOperation({
    summary: "Upload file to storage.",
    description: `Upload files by transferring 32-byte key (aes-256-ctr) for encryption.
      Key is needed to decrypt and download files.
      Response contains an array of file IDs.
    `,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(AnyFilesInterceptor())
  async upload(
    @Body() dto: UploadFilesDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Request() request,
  ) {
    const user: Users = request.user;
    return await this.storageService.save(dto, files, user);
  }

  @ApiOperation({
    summary: "Download file from file storage.",
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('download/id/:id/key/:key')
  async download(@Param() dto: DownloadFileDto, @Response() res: Res) {
    const file: IStorageFile = await this.storageService.choose(dto);

    res.set({
      'Content-Type': 'application/force-download',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(
        file.name,
      )}"`,
    });

    file.stream.pipe(res);
  }

  @ApiOperation({
    summary: "Delete file from file storage."
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async delete(@Param() dto: DeleteFileDto) {
    return await this.storageService.delete(dto);
  }

  @ApiOperation({
    summary: "Get entire list of files from storage."
  })
  @Get()
  storageInformation() {
    return this.storageService.getInformation();
  }
}
