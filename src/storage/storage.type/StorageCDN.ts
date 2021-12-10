import fetch from 'node-fetch';
import * as Client from 'ftp';
import { IStorage } from '../interfaces/IStorage';

export class StorageCDN implements IStorage {
  private url_domain: string;

  private remote_path_root = '/storage/';

  private ftp_config = {
    host: process.env.FTP_HOST,
    port: Number(process.env.FTP_PORT),
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
  };

  constructor(url_domain: string) {
    this.url_domain = url_domain;
  }

  async extract(file_name: string): Promise<any> {
    const url: URL = new URL(file_name, this.url_domain);

    const body: any = await fetch(url.href)
      .then((res) => {
        if (res.status >= 400) {
          throw new Error('Bad response from server');
        }
        return res.body;
      })
      .catch((e) => {
        console.log(e);
      });

    return body;
  }

  async save(file_name: string, data) {
    try {
      const remote_path = this.remote_path_root + file_name;

      const remote_storage = new Client();
      remote_storage.on('ready', () => {
        remote_storage.put(data, remote_path, () => {
          remote_storage.end();
        });
      });
      remote_storage.connect(this.ftp_config);
      return true;
    } catch (e) {
      console.error(e);
    }
  }

  async delete(file_name: string) {
    const remote_path = this.remote_path_root + file_name;

    const remote_storage = new Client();
    remote_storage.on('ready', () => {
      remote_storage.delete(remote_path, () => {
        remote_storage.end();
      });
    });
    remote_storage.connect(this.ftp_config);
  }
}
