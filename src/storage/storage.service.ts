import { Injectable } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class StorageService
{
    constructor(private utilsService: UtilsService) {}

    async save(files: Array<Express.Multer.File>): Promise<any>
    {
        files.forEach(file => {
            this.utilsService.createFile(file);
            this.utilsService.createMetaFile(file);
            this.utilsService.createZipFile(file);
            this.utilsService.encryptFile(file);
        });
    }

    async choose()
    {}

    async delete()
    {}
}
