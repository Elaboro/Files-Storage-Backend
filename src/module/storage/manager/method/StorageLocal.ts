import path from 'path';
import { IStorage } from '../../interfaces/IStorage';
import { FileSystemService } from '../../../utils/filesystem/FileSystemService';
import { Readable } from 'stream';

export class StorageLocal implements IStorage {
  private UPLOADED_FILES_PATH: string = path.resolve(
    __dirname,
    '../..',
    'uploaded_files',
  );


  constructor(
    private readonly fileSystemService: FileSystemService,
  ) {}

  async getFileStream(file_name: string): Promise<Readable> {
    return this.fileSystemService.get(this.UPLOADED_FILES_PATH, file_name);
  }

  async save(file_name: string, data): Promise<void> {
    return this.fileSystemService.save(
      this.UPLOADED_FILES_PATH,
      file_name,
      data,
    );
  }

  async delete(file_name: string): Promise<void> {
    return this.fileSystemService.delete(this.UPLOADED_FILES_PATH, file_name);
  }
}
