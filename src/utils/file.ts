import * as path from 'path';
import * as fs from 'fs';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as fsm from 'fs-meta';
import * as _7z from '7zip-min';
import * as crypto from 'crypto';

export class File
{
    async create(file): Promise<any>
    {
        try
        {
            let file_name = file.originalname;
            const file_path = path.resolve(__dirname, '..', 'uploaded_files');
            if(!fs.existsSync(file_path))
            {
                fs.mkdirSync(file_path, { recursive: true })
            }
            fs.writeFileSync(path.join(file_path, file_name), file.buffer)
        } catch (e)
        {
            console.log(e);
            throw new HttpException("File not loaded.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    createMetaFile(file): void
    {
        try
        {
            const file_name = path.parse(file.originalname).name;
            const file_path = path.resolve(__dirname, '..', 'uploaded_files');

            fsm.getMeta(file_path).then((done) => {
                let json = JSON.stringify(done);
                fs.writeFileSync(path.join(file_path, file_name + ".json"), json);
            });
        } catch (e)
        {
            console.log(e);
            throw new HttpException("Meta file not create.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
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