import { Injectable } from '@nestjs/common';
import Client from 'ftp';
import cfg from '../../../config/app.config';
import {
  FtpConfig,
} from './type/Type';

@Injectable()
export class FtpService {

  private config: FtpConfig;
  private remote_path_root: string;

  constructor() {
    const ftp_config: FtpConfig = {
      options: {
        host: cfg.FTP_HOST,
        port: cfg.FTP_PORT,
        user: cfg.FTP_USER,
        password: cfg.FTP_PASSWORD,
      },
      remote_path_root: '/storage/',
    };
    this.config = ftp_config;
    this.remote_path_root = ftp_config.remote_path_root || "/";
  }

  async save(
    file_name: string,
    data: NodeJS.ReadableStream | Buffer | string
  ): Promise<void> {
    const remote_path: string = this.remote_path_root + file_name;

    const client: Client = new Client();
    client.on('ready', () => {
      client.put(data, remote_path, (error: Error) => {
        client.end();
        if (error) {
          throw error;
        }
      });
    });
    client.connect(this.config.options);
  }

  async delete(file_name: string): Promise<void> {
    const remote_path: string = this.remote_path_root + file_name;

    const client: Client = new Client();
    client.on('ready', () => {
      client.delete(remote_path, (error: Error) => {
        client.end();
        if (error) {
          throw error;
        }
      });
    });
    client.connect(this.config.options);
  }
}
