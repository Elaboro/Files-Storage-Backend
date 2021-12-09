import fetch from 'node-fetch';
import { ExtractFile } from './ExtractFile';

export class StorageCDN implements IStorage
{
    private url_domain: string;

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

    save()
    {}

    delete()
    {}
}