import { Injectable } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import { UploadFilesDto } from './dto/upload-files.dto';
import * as path from 'path';
import { Readable } from 'stream';
import { Cipher } from 'crypto';
import * as fs from 'fs';
import { Gzip } from 'zlib';  
import { WriteStream } from 'fs';
import { IEncrypt } from '../utils/IEncrypt';

@Injectable()
export class StorageService
{
    constructor(private utilsService: UtilsService) {}

    async save(dto: UploadFilesDto, files: Array<Express.Multer.File>): Promise<number>
    {
        const file_path: string = path.resolve(__dirname, '..', 'uploaded_files');

        files.forEach(async file => {
            /* // pause
            let absolute_path: string = await this.utilsService.createFile(file.originalname, file.buffer, file_path);

            let meta: any = await this.utilsService.getMetaArrayByFilePath(absolute_path);
            const meta_name: string = meta.basename + ".meta.json";
            let meta_json: string = JSON.stringify(meta);
            this.utilsService.createFile(meta_name, meta_json, file_path);
            */

            let file_readable: Readable = this.utilsService.createReadableStreamByBuffer(file.buffer);
            let pack: Gzip = this.utilsService.createPack();
            let encrypt: IEncrypt = this.utilsService.getEncrypt(dto.key);
            let cipher: Cipher = encrypt.cipher;

            let write_file: WriteStream = fs.createWriteStream(path.join(file_path, file.originalname + ".crypt"));

            file_readable.pipe(pack).pipe(cipher).pipe(write_file);
        });
        return 10;
    }

    async choose()
    {}

    async delete()
    {}
}
