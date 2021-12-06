import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import { UploadFilesDto } from './dto/upload-files.dto';
import * as path from 'path';
import { Readable } from 'stream';
import { Cipher, Decipher } from 'crypto';
import * as fs from 'fs';
import { Gzip, Gunzip } from 'zlib';  
import { WriteStream } from 'fs';
import { IEncrypt } from '../utils/IEncrypt';
import { Storage } from '../entity/storage.model';
import { DeleteFileDto } from './dto/delete-file.dto';
import { DownloadFileDto } from './dto/download-file.dto';

@Injectable()
export class StorageService
{
    public UPLOADED_FILES_PATH: string = path.resolve(__dirname, '..', 'uploaded_files');

    constructor(private utilsService: UtilsService) {}

    async save(dto: UploadFilesDto, files: Array<Express.Multer.File>): Promise<number[]>
    {
        let ids: number[] = await Promise.all(files.map(async (file): Promise<number>=> {
            let storage: Storage = new Storage();
            await storage.save();
            let file_path: string = path.join(this.UPLOADED_FILES_PATH, storage.uuid);

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

            storage.iv = encrypt.iv;
            storage.file_name = file.originalname;
            await storage.save();

            let write_file: WriteStream = fs.createWriteStream(file_path);
            await file_readable.pipe(pack).pipe(cipher).pipe(write_file);
            return storage.id;
        }));

        return ids;
    }

    async choose(dto: DownloadFileDto)
    {
        try
        {
            let id: number = dto.id;
            let key: string = dto.key;

            let storage: Storage = await Storage.findOne<Storage>({ id });
            if(typeof storage === "undefined") return;

            let file_path: string = path.join(this.UPLOADED_FILES_PATH, storage.uuid);
            let file_readable: Readable = fs.createReadStream(file_path);
            let decrypt: Decipher = this.utilsService.getDecrypt(key, storage.iv);
            let unpack: Gunzip = this.utilsService.createUnpack();

            //for test
            //let write_file: WriteStream = fs.createWriteStream(path.join(this.UPLOADED_FILES_PATH, storage.file_name));
            //file_readable.pipe(decrypt).pipe(unpack).pipe(write_file);
        } catch (e)
        {
            throw new HttpException("File has been not downloaded.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async delete(dto: DeleteFileDto): Promise<any>
    {
        try
        {
            let id: number = dto.id;
            let storage: Storage = await Storage.findOne<Storage>({ id });
            if(typeof storage === "undefined") return;

            let file_path: string = path.join(this.UPLOADED_FILES_PATH, storage.uuid);
            fs.unlinkSync(file_path);

            Storage.delete({ id });
        } catch (e)
        {
            throw new HttpException("Error deleting a file.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
