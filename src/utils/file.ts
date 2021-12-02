import * as path from 'path';
import * as fs from 'fs';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as fsm from 'fs-meta';

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
            const file_name = path.parse(file.originalname).name
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
}