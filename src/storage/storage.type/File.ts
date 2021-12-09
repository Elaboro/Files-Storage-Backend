import { IStorageFile } from "../interfaces/IStorageFile";
import { Stream } from "stream";

export class File implements IStorageFile
{
    public name: string;
    public data: Stream;

    constructor(name, data)
    {
        this.name = name;
        this.data = data;
    }
}