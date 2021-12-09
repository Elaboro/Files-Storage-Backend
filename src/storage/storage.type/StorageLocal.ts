import * as path from 'path';
import * as fs from 'fs';

export class StorageLocal implements IStorage
{
    private UPLOADED_FILES_PATH: string = path.resolve(__dirname, '../..', 'uploaded_files');

    extract(file_name: string): any
    {
        let file_path: string = path.join(this.UPLOADED_FILES_PATH, file_name);
        let file_readable = fs.createReadStream(file_path);
        return file_readable;
    }

    async save(file_name: string, data)
    {
        try
        {
            let file_path: string = path.join(this.UPLOADED_FILES_PATH, file_name);

            if(!fs.existsSync(this.UPLOADED_FILES_PATH))
            {
                fs.mkdirSync(this.UPLOADED_FILES_PATH, { recursive: true })
            }
            let writable = fs.createWriteStream(file_path);
            data.pipe(writable);
            return true;
        } catch (e)
        {
            throw new Error("File not created.");
        }
    }

    async delete(file_name: string)
    {
        let file_path: string = path.join(this.UPLOADED_FILES_PATH, file_name);
        fs.unlinkSync(file_path);
    }
}