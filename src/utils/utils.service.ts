import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as fsm from 'fs-meta';
import * as _7z from '7zip-min';
import * as crypto from 'crypto';

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

    createZipFile(file): void
    {
        try
        {
            const file_name = file.originalname;
            const file_path = path.resolve(__dirname, '..', 'uploaded_files');
            _7z.pack(path.join(file_path, file_name), path.join(file_path, file_name + ".7z"), () => {});
        } catch (e)
        {
            console.log(e);
            throw new HttpException("Zip file not create.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    encryptFile(key, file): void
    {
        try
        {
            const file_name = file.originalname;
            const file_path = path.resolve(__dirname, '..', 'uploaded_files');

            const algorithm = 'aes-256-ctr';
            const secret_key = key;
            const bytes = crypto.randomBytes(16);

            const read_stream = fs.createReadStream(path.join(file_path, file_name));
            const encrypt = crypto.createCipheriv(algorithm, secret_key, bytes);
            const write_stream = fs.createWriteStream(path.join(file_path, file_name + ".crypt"));

            read_stream.pipe(encrypt).pipe(write_stream);
        } catch (e)
        {
            console.log(e);
            throw new HttpException("Encrypted file has not been created.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
