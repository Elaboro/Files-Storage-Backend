import path from 'path';
import fs, { ReadStream } from 'fs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileSystemService {

  get(file_path: string, file_name: string): ReadStream {
    const dest = path.join(file_path, file_name);
    return fs.createReadStream(dest);
  }

  save(file_path: string, file_name: string, data) {
    try {
      if (!fs.existsSync(file_path)) {
        fs.mkdirSync(file_path, { recursive: true });
      }
      const writable: fs.WriteStream = fs.createWriteStream(
        path.join(file_path, file_name),
      );
      data.pipe(writable);
    } catch (e) {
      throw new Error('File not created.');
    }
  }

  delete(file_path: string, file_name: string) {
    fs.unlinkSync(path.join(file_path, file_name));
  }
}
