interface IStorage
{
    save(file_name: string, data): void;
    extract(file_name: string): any | Promise<any>;
    delete(file_name: string): void;
}