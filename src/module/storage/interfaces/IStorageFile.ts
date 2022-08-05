import { Stream } from 'stream';

export interface IStorageFile {
  name: string;
  stream: Stream;
}
