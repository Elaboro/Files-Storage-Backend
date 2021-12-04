import { Injectable } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import { UploadFilesDto } from './dto/upload-files.dto';

@Injectable()
export class StorageService
{
    constructor(private utilsService: UtilsService) {}

    async save(dto: UploadFilesDto, files: Array<Express.Multer.File>): Promise<number>
    {
        files.forEach(file => {
            this.utilsService.createFile(file);
            this.utilsService.createMetaFile(file);
            this.utilsService.createZipFile(file);
            this.utilsService.encryptFile(dto.key, file);
        });
        return 10;
    }

    async choose()
    {}

    async delete()
    {}
}
