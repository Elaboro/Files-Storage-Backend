import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { UploadFilesDto } from './dto/upload-files.dto';
import { Duplex, Readable } from 'stream';
import { Decipher } from 'crypto';
import { Gzip, Gunzip } from 'zlib';
import { Storage } from './entity/storage.model';
import { DeleteFileDto } from './dto/delete-file.dto';
import { DownloadFileDto } from './dto/download-file.dto';
import { User } from '../auth/entity/user.model';
import { CryptoService } from '../utils/crypto/CryptoService';
import { PackService } from '../utils/pack/PackService';
import { CryptInfo, IEncrypt } from '../utils/crypto/type/Type';
import { StorageRepo } from './repository/StorageRepo';
import { StorageManager } from './manager/StorageManager';
import { IStorageFile } from './manager/type/Type';

@Injectable()
export class StorageService {

  constructor(
    private readonly storageRepo: StorageRepo,

    @Inject(PackService)
    private readonly packService: PackService,

    @Inject(CryptoService)
    private readonly cryptoService: CryptoService,

    @Inject(StorageManager)
    private readonly storageManager: StorageManager,
  ) {}

  async save(
    { key }: UploadFilesDto,
    files: Array<Express.Multer.File>,
    user: User,
  ): Promise<Storage[]> {

    const storage_list: Promise<Storage
    >[] = files.map(async (file): Promise<Storage
    > => {
      let storage: Storage;
      try {
        storage = await this.storageRepo.createFile({ user });

        const fileStream: Readable = Readable.from(file.buffer);
        const packStream: Gzip = this.packService.createPackStream();
        const { cipherStream, iv }: IEncrypt = this.cryptoService.createEncryptByKey(key);

        const stream: Duplex = fileStream.pipe(packStream).pipe(cipherStream);
        this.storageManager.save(storage.uuid, stream);

        // fix https://github.com/expressjs/multer/pull/1102
        if (!/[^\u0000-\u00ff]/.test(file.originalname)) {
          file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
        }

        await this.storageRepo.changeFileById(storage.id, {
          iv,
          originalname: file.originalname,
        });
        await storage.reload();

        return storage;
      } catch (e) {
        this.storageManager.delete(storage.uuid);
        this.storageRepo.deleteFileById(storage.id);
      }
    });

    return Promise.all(storage_list);
  }

  async choose({ id, key }: DownloadFileDto): Promise<IStorageFile> {
    try {
      const storage: Storage = await this.storageRepo.getFileById(id);
      if (!storage) throw new Error("File not found");
      const { iv, filename, uuid }: Storage = storage;

      const crypt_info: CryptInfo = { key, iv };

      const fileStream: Readable = await this.storageManager.getFileStream(uuid);
      const decryptStream: Decipher = this.cryptoService.createDecryptStream(crypt_info);
      const unpackStream: Gunzip = this.packService.createUnpackStream();

      return {
        name: filename,
        stream: fileStream.pipe(decryptStream).pipe(unpackStream),
      };

    } catch (e) {
      throw new HttpException(
        'File has been not downloaded.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(dto: DeleteFileDto): Promise<Storage> {
    const storage: Storage = await this.storageRepo.getFileById(dto.id);
    if (!storage) throw new Error("File not found");

    this.storageManager.delete(storage.uuid);

    this.storageRepo.deleteFileById(dto.id);

    return storage;
  }

  async getFileList() {
    return this.storageRepo.getFileList();
  }
}
