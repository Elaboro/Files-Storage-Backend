import * as zlib from 'zlib';
import { Gzip, Gunzip } from 'zlib';

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
