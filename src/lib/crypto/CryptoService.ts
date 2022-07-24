import { IEncrypt } from "./type/Type";
import * as crypto from 'crypto';
import { Cipher, Decipher } from 'crypto';
import { Injectable } from "@nestjs/common";

@Injectable()
export class CryptoService {

  encrypt(key: string): IEncrypt {
    const algorithm = 'aes-256-ctr';
    const iv: Buffer = crypto.randomBytes(16);
    const cipher: Cipher = crypto.createCipheriv(algorithm, key, iv);

    return { cipher: cipher, iv: iv };
  }

  decrypt(key: string, iv: Buffer) {
    const algorithm = 'aes-256-ctr';
    const deciper: Decipher = crypto.createDecipheriv(algorithm, key, iv);
    return deciper;
  }
}
