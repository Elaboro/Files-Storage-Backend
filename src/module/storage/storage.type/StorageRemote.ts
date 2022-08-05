import fetch from 'node-fetch';
import cfg from '../../../config/app.config';
import { FtpConfig } from '../../../lib/ftp/type/Type';
import { IStorage } from '../interfaces/IStorage';
import { FtpService } from './../../../lib/ftp/FtpService';

export class StorageRemote implements IStorage {
  private url_domain: string = cfg.CDN_URL;

  private ftp_config: FtpConfig = {
    options: {
      host: cfg.FTP_HOST,
      port: cfg.FTP_PORT,
      user: cfg.FTP_USER,
      password: cfg.FTP_PASSWORD,
    },
    remote_path_root: '/storage/',
  };
  private FtpService = new FtpService(this.ftp_config);

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
    return this.FtpService.save(file_name, data);
  }

  async delete(file_name: string) {
    return this.FtpService.delete(file_name);
  }
}
