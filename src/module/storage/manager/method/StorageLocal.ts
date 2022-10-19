import { IStorage } from '../type/Type';
import { FileSystemService } from '../../../utils/filesystem/FileSystemService';
import { Readable } from 'stream';
import cfg from '../../../../config/app.config';

export class StorageLocal implements IStorage {
  private UPLOADED_FILES_PATH: string = cfg.DIR_STORAGE_ENCRYPTED;


  constructor(
    private readonly fileSystemService: FileSystemService,
  ) {}

  async getFileStream(filename: string): Promise<Readable> {
    return this.fileSystemService.get(this.UPLOADED_FILES_PATH, filename);
  }

  async save(filename: string, data): Promise<void> {
    return this.fileSystemService.save(
      this.UPLOADED_FILES_PATH,
      filename,
      data,
    );
  }

  async delete(filename: string): Promise<void> {
    return this.fileSystemService.delete(this.UPLOADED_FILES_PATH, filename);
  }
}
