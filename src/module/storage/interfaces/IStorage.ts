export interface IStorage {
  save(
    file_name: string,
    data: NodeJS.ReadableStream | Buffer | string
  ): Promise<any>;
  extract(file_name: string): Promise<any>;
  delete(file_name: string): Promise<any>;
}
