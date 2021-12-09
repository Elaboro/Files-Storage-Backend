import fetch from 'node-fetch';
import { ExtractFile } from './ExtractFile';
import * as Client from 'ftp';

export class StorageCDN implements IStorage
{
    private url_domain: string;

    private remote_path_root = "/storage/";

    private ftp_config = {
        host: process.env.FTP_HOST,
        port: Number(process.env.FTP_PORT),
        user: process.env.FTP_USER,
        password: process.env.FTP_PASSWORD,
    };

    constructor(url_domain: string)
    {
        this.url_domain = url_domain;
    }

    async extract(file_name: string): Promise<ExtractFile>
    {
        let extract_file: ExtractFile = new ExtractFile();

        let url: URL = new URL(file_name, this.url_domain);

        await fetch(url.href)
            .then((res => {
                if (res.status >= 400) {
                    throw new Error("Bad response from server");
                }
                extract_file.originalfile = res.body;
            }).bind(extract_file))
            .catch(e => {
                console.log(e);
            });

        return extract_file;
    }

    save(file_name: string, data)
    {
        try{
            let remote_path = this.remote_path_root + file_name;

            let remote_storage = new Client();
            remote_storage.on("ready", ()=> {
                remote_storage.put(data, remote_path, ()=> {
                    remote_storage.end();
                });
            });
            remote_storage.connect(this.ftp_config);
        } catch (e)
        {
            console.error(e);
        }
    }

    delete(file_name: string)
    {
        let remote_path = this.remote_path_root + file_name;

        let remote_storage = new Client();
        remote_storage.on("ready", ()=> {
            remote_storage.delete(remote_path, ()=> {
                remote_storage.end();
            });
        });
        remote_storage.connect(this.ftp_config);
    }
}