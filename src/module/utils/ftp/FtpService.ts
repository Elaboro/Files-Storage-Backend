import Client from 'ftp';
import {
  FtpConfig,
} from './type/Type';

export class FtpService {

  private config: FtpConfig;
  private remote_path_root: string;

  constructor(config: FtpConfig) {
    this.config = config;
    this.remote_path_root = config.remote_path_root || "/";
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
