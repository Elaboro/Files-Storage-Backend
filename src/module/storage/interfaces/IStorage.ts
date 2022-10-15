import { Readable } from "stream";

export interface IStorage {
  save(
    file_name: string,
    data: NodeJS.ReadableStream | Buffer | string
  ): Promise<any>;
  getFileStream(file_name: string): Promise<Readable>;
  delete(file_name: string): Promise<any>;
}
