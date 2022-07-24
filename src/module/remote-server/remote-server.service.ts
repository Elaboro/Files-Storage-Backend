import { Injectable } from '@nestjs/common';
import Client from 'ftp';
import cfg from 'src/config/app.config';

@Injectable()
export class RemoteServerService {
  private ftp_config = {
    host: cfg.FTP_HOST,
    port: cfg.FTP_PORT,
    user: cfg.FTP_USER,
    password: cfg.FTP_PASSWORD,
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
