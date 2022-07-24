import { Injectable } from '@nestjs/common';
import path from 'path';
import fs from 'fs';

@Injectable()
export class FilesService {
  async getStreamFile(file_path: string, file_name: string) {
    const stream_file: fs.ReadStream = fs.createReadStream(
      path.join(file_path, file_name),
    );
    return stream_file;
  }

  async saveFile(file_path: string, file_name: string, data): Promise<boolean> {
    try {
      if (!fs.existsSync(file_path)) {
        fs.mkdirSync(file_path, { recursive: true });
      }
      const writable: fs.WriteStream = fs.createWriteStream(
        path.join(file_path, file_name),
      );
      data.pipe(writable);
      return true;
    } catch (e) {
      throw new Error('File not created.');
    }
  }

  async deleteFile(file_path: string, file_name: string): Promise<void> {
    fs.unlinkSync(path.join(file_path, file_name));
  }
}
