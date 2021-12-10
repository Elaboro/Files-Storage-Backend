import { Stream } from 'stream';

export interface IStorageFile {
  name: string;
  data: Stream;
}
