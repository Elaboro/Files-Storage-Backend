import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import { UploadFilesDto } from './dto/upload-files.dto';
import { Readable, Stream } from 'stream';
import { Cipher, Decipher } from 'crypto';
import { Gzip, Gunzip } from 'zlib';
import { IEncrypt } from '../utils/IEncrypt';
import { Storage } from '../entity/storage.model';
import { DeleteFileDto } from './dto/delete-file.dto';
import { DownloadFileDto } from './dto/download-file.dto';
import { Users } from '../entity/users.model';
import { File } from './storage.type/File';
import { StorageLocal } from './storage.type/StorageLocal';
import { StorageRemote } from './storage.type/StorageRemote';
import { IStorage } from './interfaces/IStorage';
import { RemoteServerService } from '../remote-server/remote-server.service';
import { FilesService } from '../files/files.service';
import cfg from 'src/config/app.config';

@Injectable()
export class StorageService {
  private storage_manager: IStorage;

  constructor(
    private utilsService: UtilsService,
    private remoteServerService: RemoteServerService,
    private filesService: FilesService,
  ) {
    this.storage_manager =
      cfg.STORAGE_LOCAL === 'true'
        ? new StorageLocal(this.filesService)
        : new StorageRemote(this.remoteServerService, cfg.CDN_URL);
  }

  async save(
    dto: UploadFilesDto,
    files: Array<Express.Multer.File>,
    user: Users,
  ): Promise<number[]> {
    const ids: number[] = await Promise.all(
      files.map(async (file): Promise<number> => {
        const storage: Storage = new Storage();
        await storage.save();

        const file_info: any = { ...file, buffer: null };
        delete file_info.buffer;
        delete file_info.fieldname;

        const file_info_json: string = JSON.stringify(file_info);

        const meta_stream: Readable = new Readable();
        meta_stream._read = () => {
          // do nothing.
        };
        meta_stream.push(file_info_json);
        meta_stream.push(null);
        this.storage_manager.save(storage.uuid + '.meta.json', meta_stream);

        const file_readable: Readable =
          this.utilsService.createReadableStreamByBuffer(file.buffer);
        const pack: Gzip = this.utilsService.createPack();
        const encrypt: IEncrypt = this.utilsService.getEncrypt(dto.key);
        const cipher: Cipher = encrypt.cipher;
        const stream: Stream = file_readable.pipe(pack).pipe(cipher);
        this.storage_manager.save(storage.uuid, stream);

        storage.iv = encrypt.iv;
        storage.file_name = file.originalname;
        storage.user = user;
        await storage.save();
        return storage.id;
      }),
    );

    return ids;
  }

  async choose(dto: DownloadFileDto) {
    try {
      const id: number = dto.id;
      const key: string = dto.key;

      const storage: Storage = await Storage.findOne<Storage>({ id });
      if (typeof storage === 'undefined') return;

      const stream: Stream = await this.storage_manager.extract(storage.uuid);
      const decrypt: Decipher = this.utilsService.getDecrypt(key, storage.iv);
      const unpack: Gunzip = this.utilsService.createUnpack();

      const file = new File(
        storage.file_name,
        stream.pipe(decrypt).pipe(unpack),
      );

      return file;
    } catch (e) {
      throw new HttpException(
        'File has been not downloaded.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(dto: DeleteFileDto): Promise<any> {
    try {
      const id: number = dto.id;
      const storage: Storage = await Storage.findOne<Storage>({ id });
      if (typeof storage === 'undefined') return;

      this.storage_manager.delete(storage.uuid);
      this.storage_manager.delete(storage.uuid + '.meta.json');

      Storage.delete({ id });
    } catch (e) {
      throw new HttpException(
        'Error deleting a file.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getInformation() {
    try {
      const storage_info: any = await Storage.createQueryBuilder('storages')
        .leftJoinAndSelect('storages.user', 'users')
        .select([
          'storages.id AS id',
          'storages.file_name AS file_name',
          'users.username AS username',
        ])
        .orderBy('users.id', 'ASC')
        .getRawMany();
      return storage_info;
    } catch (e) {
      throw new HttpException(
        'Error searching  storage users.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
