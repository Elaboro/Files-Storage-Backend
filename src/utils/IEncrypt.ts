import { Cipher } from 'crypto';

export interface IEncrypt {
  readonly cipher: Cipher;
  readonly iv: Buffer;
}
