import { 
    Injectable,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import { UploadFilesDto } from './dto/upload-files.dto';
import { Readable } from 'stream';
import { Cipher, Decipher } from 'crypto';
import { Gzip, Gunzip } from 'zlib';  
import { IEncrypt } from '../utils/IEncrypt';
import { Storage } from '../entity/storage.model';
import { DeleteFileDto } from './dto/delete-file.dto';
import { DownloadFileDto } from './dto/download-file.dto';
import { Users } from '../entity/users.model';
import { File } from './storage.type/File';
import { StorageLocal } from './storage.type/StorageLocal';
import { StorageCDN } from './storage.type/StorageCDN';

@Injectable()
export class StorageService
{
    private storage_manager: IStorage;

    constructor(private utilsService: UtilsService)
    {
        this.storage_manager = process.env.STORAGE_LOCAL === "true" ? new StorageLocal() : new StorageCDN(process.env.CDN_URL);
    }

    async save(dto: UploadFilesDto, files: Array<Express.Multer.File>, user: Users): Promise<number[]>
    {
        let ids: number[] = await Promise.all(files.map(async (file): Promise<number>=> {
            let storage: Storage = new Storage();
            await storage.save();

            let file_info = {...file, buffer: null};
            delete file_info.buffer;
            delete file_info.fieldname;

            let file_info_json = JSON.stringify(file_info);

            let meta_stream = new Readable();
            meta_stream._read = () => {};
            meta_stream.push(file_info_json);
            meta_stream.push(null);
            this.storage_manager.save(storage.uuid + ".meta.json", meta_stream);      

            let file_readable: Readable = this.utilsService.createReadableStreamByBuffer(file.buffer);
            let pack: Gzip = this.utilsService.createPack();
            let encrypt: IEncrypt = this.utilsService.getEncrypt(dto.key);
            let cipher: Cipher = encrypt.cipher;
            let stream = file_readable.pipe(pack).pipe(cipher)
            this.storage_manager.save(storage.uuid, stream);

            storage.iv = encrypt.iv;
            storage.file_name = file.originalname;
            storage.user = user;
            await storage.save();
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

            let stream = await this.storage_manager.extract(storage.uuid);
            let decrypt: Decipher = this.utilsService.getDecrypt(key, storage.iv);
            let unpack: Gunzip = this.utilsService.createUnpack();

            let file = new File(
                storage.file_name,
                stream.pipe(decrypt).pipe(unpack)
            );

            return file;
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

            this.storage_manager.delete(storage.uuid);
            this.storage_manager.delete(storage.uuid + ".meta.json");

            Storage.delete({ id });
        } catch (e)
        {
            throw new HttpException("Error deleting a file.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getInformation()
    {
        try
        {
            let storage_info: any = await Storage.createQueryBuilder("storages")
                .leftJoinAndSelect("storages.users", "users")
                .select([
                    "storages.id AS id",
                    "storages.file_name AS file_name",
                    "users.username AS username"
                ])
                .orderBy("users.id", "ASC")
                .getRawMany();
            return storage_info;
        } catch (e)
        {
            throw new HttpException("Error searching  storage users.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
