import fetch, { Response } from 'node-fetch';
import cfg from '../../../../config/app.config';
import { IStorage } from '../type/Type';
import { FtpService } from '../../../utils/ftp/FtpService';
import { Readable } from 'stream';

export class StorageRemote implements IStorage {

  constructor(
    private readonly ftpService: FtpService
  ) {}

  private url_domain: string = cfg.CDN_URL;

  async getFileStream(filename: string): Promise<Readable> {
    const url: URL = new URL(filename, this.url_domain);

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

  async save(filename: string, data) {
    return this.ftpService.save(filename, data);
  }

  async delete(filename: string) {
    return this.ftpService.delete(filename);
  }
}
