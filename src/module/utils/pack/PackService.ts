import { Injectable } from '@nestjs/common';
import zlib,
{
  Gzip,
  Gunzip,
} from 'zlib';

@Injectable()
export class PackService {

  pack(): Gzip {
    return zlib.createGzip({
      level: zlib.constants.Z_BEST_COMPRESSION,
    });
  }

  unpack(): Gunzip  {
    return zlib.createGunzip();
  }
}
