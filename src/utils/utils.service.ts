import { Injectable } from '@nestjs/common';
import { File } from './file';

@Injectable()
export class UtilsService
{
    private File: File;
    constructor()
    {
        this.File = new File();
    }

    createFile(file)
    {
        return this.File.create(file);
    }

    createMetaFile(file)
    {
        return this.File.createMetaFile(file);
    }
}
