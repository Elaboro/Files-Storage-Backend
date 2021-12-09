interface IStorage
{
    save(): void;
    extract(file_name: string): IExtractFile | Promise<IExtractFile>;
    delete(): void;
}