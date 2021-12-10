import * as path from 'path';
import * as fs from 'fs';
import { IStorage } from '../interfaces/IStorage';

export class StorageLocal implements IStorage {
  private UPLOADED_FILES_PATH: string = path.resolve(
    __dirname,
    '../..',
    'uploaded_files',
  );

  extract(file_name: string): any {
    const file_path: string = path.join(this.UPLOADED_FILES_PATH, file_name);
    const file_readable = fs.createReadStream(file_path);
    return file_readable;
  }

  async save(file_name: string, data) {
    try {
      const file_path: string = path.join(this.UPLOADED_FILES_PATH, file_name);

      if (!fs.existsSync(this.UPLOADED_FILES_PATH)) {
        fs.mkdirSync(this.UPLOADED_FILES_PATH, { recursive: true });
      }
      const writable = fs.createWriteStream(file_path);
      data.pipe(writable);
      return true;
    } catch (e) {
      throw new Error('File not created.');
    }
  }

  async delete(file_name: string) {
    const file_path: string = path.join(this.UPLOADED_FILES_PATH, file_name);
    fs.unlinkSync(file_path);
  }
}
