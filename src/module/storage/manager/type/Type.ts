import { Stream, Readable } from "stream";

export interface IStorage {
  save(
    filename: string,
    data: NodeJS.ReadableStream | Buffer | string
  ): Promise<any>;
  getFileStream(filename: string): Promise<Readable>;
  delete(filename: string): Promise<any>;
}

export interface IStorageFile {
  name: string;
  stream: Stream;
}
