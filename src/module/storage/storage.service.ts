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
import { IStorageFile } from './interfaces/IStorageFile';
import { StorageRepo } from './repository/StorageRepo';
import { StorageManager } from './manager/StorageManager';

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
  ): Promise<number[]> {

    // todo later + with this.storageRepo.createFile

    const ids: number[] = await Promise.all(
      files.map(async (file): Promise<number> => {
        const storage: Storage = new Storage();
        await storage.save();

        const fileStream: Readable =
          this.createReadableStreamByBuffer(file.buffer);

        const packStream: Gzip = this.packService.createPackStream();

        const { cipherStream, iv }: IEncrypt = this.cryptoService.createEncryptByKey(key);
        
        const stream: Duplex = fileStream.pipe(packStream).pipe(cipherStream);
        this.storageManager.save(storage.uuid, stream);

        // example
        this.storageRepo.createFile({
          iv,
          originalname: file.originalname,
          user: user
        });

        storage.iv = iv;
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

  async choose({ id, key }: DownloadFileDto): Promise<IStorageFile> {
    try {
      const storage: Storage = await this.storageRepo.getFileById(id);
      if (!storage) throw new Error("File not found");
      const { iv, file_name, uuid }: Storage = storage;

      const crypt_info: CryptInfo = { key, iv };

      const fileStream: Readable = await this.storageManager.getFileStream(uuid);
      const decryptStream: Decipher = this.cryptoService.createDecryptStream(crypt_info);
      const unpackStream: Gunzip = this.packService.createUnpackStream();

      return {
        name: file_name,
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
