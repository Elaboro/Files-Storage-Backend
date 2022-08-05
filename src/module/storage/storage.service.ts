import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UploadFilesDto } from './dto/upload-files.dto';
import { Readable, Stream } from 'stream';
import { Cipher, Decipher } from 'crypto';
import { Gzip, Gunzip } from 'zlib';
import { Storage } from './entity/storage.model';
import { DeleteFileDto } from './dto/delete-file.dto';
import { DownloadFileDto } from './dto/download-file.dto';
import { Users } from '../auth/entity/users.model';
import { File } from './storage.type/File';
import { StorageLocal } from './storage.type/StorageLocal';
import { StorageRemote } from './storage.type/StorageRemote';
import { IStorage } from './interfaces/IStorage';
import { FtpService } from './../../lib/ftp/FtpService';
import cfg from './../../config/app.config';
import { CryptoService } from './../../lib/crypto/CryptoService';
import { PackService } from './../../lib/pack/PackService';
import { IEncrypt } from './../../lib/crypto/type/Type';
import { FtpConfig } from '../../lib/ftp/type/Type';

@Injectable()
export class StorageService {
  private storage_manager: IStorage;
  private cryptoService = new CryptoService();
  private packService = new PackService();

  private ftp_config: FtpConfig = {
    options: {
      host: cfg.FTP_HOST,
      port: cfg.FTP_PORT,
      user: cfg.FTP_USER,
      password: cfg.FTP_PASSWORD,
    },
    remote_path_root: '/storage/',
  };
  private FtpService = new FtpService(this.ftp_config);

  constructor() {
    this.storage_manager =
      cfg.STORAGE_LOCAL === 'true'
        ? new StorageLocal()
        : new StorageRemote(this.FtpService, cfg.CDN_URL);
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
          this.createReadableStreamByBuffer(file.buffer);
        const pack: Gzip = this.packService.pack();
        const encrypt: IEncrypt = this.cryptoService.encrypt(dto.key);
        const cipher: Cipher = encrypt.cipher;
        const stream: any = file_readable.pipe(pack).pipe(cipher);
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

  createReadableStreamByBuffer(buffer: Buffer): Readable {
    return new Readable({
      read() {
        this.push(buffer);
        this.push(null);
      },
    });
  }

  async choose(dto: DownloadFileDto) {
    try {
      const id: number = dto.id;
      const key: string = dto.key;

      const [storage]: Storage[] = await Storage.findBy<Storage>({ id });
      if (typeof storage === 'undefined') return;

      const stream: Stream = await this.storage_manager.extract(storage.uuid);
      const decrypt: Decipher = this.cryptoService.decrypt(key, storage.iv);
      const unpack: Gunzip = this.packService.unpack();

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
      const [storage]: Storage[] = await Storage.findBy<Storage>({ id });
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
