import * as path from 'path';
import { IStorage } from '../interfaces/IStorage';
import { FilesService } from 'src/files/files.service';

export class StorageLocal implements IStorage {
  private UPLOADED_FILES_PATH: string = path.resolve(
    __dirname,
    '../..',
    'uploaded_files',
  );

  constructor(private filesService: FilesService) {}

  extract(file_name: string): any {
    return this.filesService.getStreamFile(this.UPLOADED_FILES_PATH, file_name);
  }

  async save(file_name: string, data): Promise<boolean> {
    return this.filesService.saveFile(
      this.UPLOADED_FILES_PATH,
      file_name,
      data,
    );
  }

  async delete(file_name: string): Promise<void> {
    return this.filesService.deleteFile(this.UPLOADED_FILES_PATH, file_name);
  }
}
