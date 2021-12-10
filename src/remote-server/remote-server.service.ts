import { Injectable } from '@nestjs/common';
import * as Client from 'ftp';

@Injectable()
export class RemoteServerService {
  private ftp_config = {
    host: process.env.FTP_HOST,
    port: Number(process.env.FTP_PORT),
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
  };

  private remote_path_root = '/storage/';

  async saveFile(file_name: string, data) {
    try {
      const remote_path: string = this.remote_path_root + file_name;

      const client = new Client();
      client.on('ready', () => {
        client.put(data, remote_path, () => {
          client.end();
        });
      });
      client.connect(this.ftp_config);
      return true;
    } catch (e) {
      console.error(e);
    }
  }

  async deleteFile(file_name: string) {
    try {
      const remote_path: string = this.remote_path_root + file_name;

      const client = new Client();
      client.on('ready', () => {
        client.delete(remote_path, () => {
          client.end();
        });
      });
      client.connect(this.ftp_config);
    } catch (e) {
      console.error(e);
    }
  }
}
