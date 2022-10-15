import fetch, { Response } from 'node-fetch';
import cfg from '../../../../config/app.config';
import { IStorage } from '../../interfaces/IStorage';
import { FtpService } from '../../../utils/ftp/FtpService';
import { Readable } from 'stream';

export class StorageRemote implements IStorage {

  constructor(
    private readonly ftpService: FtpService
  ) {}

  private url_domain: string = cfg.CDN_URL;

  async getFileStream(file_name: string): Promise<Readable> {
    const url: URL = new URL(file_name, this.url_domain);

    const body: Readable = await fetch(url.href)
      .then((res: Response) => {
        if (res.status >= 400) {
          throw new Error('Bad response from server');
        }
        return Readable.from(res.body);
      })
      .catch((e) => {
        throw e;
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
