import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as fsm from 'fs-meta';
import * as _7z from '7zip-min';
import * as crypto from 'crypto';
import { Cipher, Decipher } from 'crypto';
import { IEncrypt } from './IEncrypt';
import { Readable } from 'stream';
import * as zlib from 'zlib';  
import { Gzip, Gunzip } from 'zlib';

@Injectable()
export class UtilsService
{
    async createFile(file_name: string, data: any, file_path: string): Promise<string>
    {
        try
        {
            const absolute_path: string = path.join(file_path, file_name);

            if(!fs.existsSync(file_path))
            {
                fs.mkdirSync(file_path, { recursive: true })
            }
            fs.writeFileSync(absolute_path, data)
            return absolute_path;
        } catch (e)
        {
            throw new Error("File not created.");
        }
    }

    async getMetaArrayByFilePath(file_path: string): Promise<Array<any>>
    {
        let meta: Array<any>;
        try
        {
            meta = await fsm.getMeta(file_path);
        } catch (e)
        {
            throw new Error("Not can get metadata.");
        }
        return meta;
    }

    createReadableStreamByBuffer(buffer: Buffer): Readable
    {
        return new Readable({
            read() {
                this.push(buffer);
                this.push(null);
            }
        });
    }

    getEncrypt(key: string): IEncrypt
    {
        let algorithm: string = 'aes-256-ctr';
        let iv: Buffer = crypto.randomBytes(16);
        let cipher: Cipher = crypto.createCipheriv(algorithm, key, iv);

        return { cipher: cipher, iv: iv };
    }

    getDecrypt(key: string, iv: Buffer): Decipher
    {
        let algorithm: string = 'aes-256-ctr';
        let deciper = crypto.createDecipheriv(algorithm, key, iv);
        return deciper;
    }

    createPack(): Gzip
    {
        return zlib.createGzip({
            level: zlib.constants.Z_BEST_COMPRESSION
        }); 
    }

    createUnpack(): Gunzip
    {
        return zlib.createGunzip();
    }
}
