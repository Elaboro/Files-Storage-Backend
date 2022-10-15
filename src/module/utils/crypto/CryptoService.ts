import { CryptInfo, IEncrypt } from "./type/Type";
import crypto,
{
  Cipher,
  Decipher,
}  from 'crypto';
import { Injectable } from "@nestjs/common";

@Injectable()
export class CryptoService {

  private settings = {
    algorithm: "aes-256-ctr",
    size_bytes_generate: 16,
  };

  createEncryptByKey(key: string): IEncrypt {
    const iv: Buffer = crypto.randomBytes(this.settings.size_bytes_generate);
    const cipherStream: Cipher = crypto.createCipheriv(this.settings.algorithm, key, iv);
    return { cipherStream, iv };
  }

  createDecryptStream({ key, iv }: CryptInfo): Decipher {
    return crypto.createDecipheriv(
      this.settings.algorithm,
      key,
      iv,
    );
  }
}
