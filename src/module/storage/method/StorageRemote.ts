import fetch from 'node-fetch';
import cfg from '../../../config/app.config';
import { IStorage } from '../interfaces/IStorage';
import { FtpService } from '../../utils/ftp/FtpService';

export class StorageRemote implements IStorage {

  constructor(
    private readonly ftpService: FtpService
  ){}

  private url_domain: string = cfg.CDN_URL;

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
    return this.ftpService.save(file_name, data);
  }

  async delete(file_name: string) {
    return this.ftpService.delete(file_name);
  }
}
