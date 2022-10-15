import { Cipher } from 'crypto';

export interface IEncrypt {
  readonly cipherStream: Cipher;
  readonly iv: Buffer;
}

export interface CryptInfo {
  key: string;
  iv: Buffer;
}
