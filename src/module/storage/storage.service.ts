import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { UploadFilesDto } from './dto/upload-files.dto';
import { Readable, Stream } from 'stream';
import { Cipher, Decipher } from 'crypto';
import { Gzip, Gunzip } from 'zlib';
import { Storage } from './entity/storage.model';
import { DeleteFileDto } from './dto/delete-file.dto';
import { DownloadFileDto } from './dto/download-file.dto';
import { User } from '../auth/entity/user.model';
import { StorageLocal } from './method/StorageLocal';
import { StorageRemote } from './method/StorageRemote';
import { IStorage } from './interfaces/IStorage';
import cfg from './../../config/app.config';
import { CryptoService } from '../utils/crypto/CryptoService';
import { PackService } from '../utils/pack/PackService';
import { IEncrypt } from '../utils/crypto/type/Type';
import { IStorageFile } from './interfaces/IStorageFile';
import { FtpService } from '../utils/ftp/FtpService';
import { FileSystemService } from '../utils/filesystem/FileSystemService';
import { StorageRepo } from './repository/StorageRepo';

@Injectable()
export class StorageService {
  private storage_manager: IStorage;

  constructor(
    private readonly storageRepo: StorageRepo,

    @Inject(PackService)
    private readonly packService: PackService,

    @Inject(CryptoService)
    private readonly cryptoService: CryptoService,

    @Inject(FtpService)
    private readonly ftpService: FtpService,

    @Inject(FileSystemService)
    private readonly fileSystemService: FileSystemService,
  ) {
    const method: string = cfg.STORAGE_METHOD?.toLowerCase();

    switch(method) {
      case "local": this.storage_manager = new StorageLocal(this.fileSystemService);
      case "remote": this.storage_manager = new StorageRemote(this.ftpService);
    }
  }

  async save(
    dto: UploadFilesDto,
    files: Array<Express.Multer.File>,
    user: User,
  ): Promise<number[]> {

    // todo later + with this.storageRepo.createFile

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

        // example
        this.storageRepo.createFile({
          iv: encrypt.iv,
          originalname: file.originalname,
          user: user
        });

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

  async choose({ id, key }: DownloadFileDto): Promise<IStorageFile> {
    try {
      const storage: Storage = await this.storageRepo.getFileById(id);
      if (!storage) throw new Error("File not found");

      const stream: Stream = await this.storage_manager.extract(storage.uuid);
      const decrypt: Decipher = this.cryptoService.decrypt(key, storage.iv);
      const unpack: Gunzip = this.packService.unpack();

      return {
        name: storage.file_name,
        stream: stream.pipe(decrypt).pipe(unpack),
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

    this.storage_manager.delete(storage.uuid);
    this.storage_manager.delete(storage.uuid + '.meta.json');

    this.storageRepo.deleteFileById(dto.id);

    return storage;
  }

  async getFileList() {
    return this.storageRepo.getFileList();
  }
}
