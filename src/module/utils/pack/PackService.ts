import { Injectable } from '@nestjs/common';
import zlib,
{
  Gzip,
  Gunzip,
} from 'zlib';

@Injectable()
export class PackService {

  createPackStream(): Gzip {
    return zlib.createGzip({
      level: zlib.constants.Z_BEST_COMPRESSION,
    });
  }

  createUnpackStream(): Gunzip  {
    return zlib.createGunzip();
  }
}
