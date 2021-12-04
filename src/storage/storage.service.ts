import { Injectable } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import { UploadFilesDto } from './dto/upload-files.dto';
import * as path from 'path';

@Injectable()
export class StorageService
{
    constructor(private utilsService: UtilsService) {}

    async save(dto: UploadFilesDto, files: Array<Express.Multer.File>): Promise<number>
    {
        const file_path: string = path.resolve(__dirname, '..', 'uploaded_files');

        files.forEach(async file => {
            let absolute_path: string = await this.utilsService.createFile(file.originalname, file.buffer, file_path);

            let meta: any = await this.utilsService.getMetaArrayByFilePath(absolute_path);
            const meta_name: string = meta.basename + ".meta.json";
            let meta_json: string = JSON.stringify(meta);
            this.utilsService.createFile(meta_name, meta_json, file_path);

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
