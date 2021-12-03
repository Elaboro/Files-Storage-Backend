import { Injectable } from '@nestjs/common';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class FilesService
{
    constructor(private utilsService: UtilsService)
    {}

    upload(file: any)
    {
        this.utilsService.createFile(file);
        this.utilsService.createMetaFile(file);
        this.utilsService.createZipFile(file);
        this.utilsService.encryptFile(file);
    }

    download()
    {}

    delete()
    {}
}
