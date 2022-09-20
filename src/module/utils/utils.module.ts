import { Module } from '@nestjs/common';
import { CryptoService } from './crypto/CryptoService';
import { FileSystemService } from './filesystem/FileSystemService';
import { FtpService } from './ftp/FtpService';
import { PackService } from './pack/PackService';

@Module({
  providers: [
    PackService,
    CryptoService,
    FtpService,
    FileSystemService,
  ],
  controllers: [],
  imports: [],
  exports: [
    PackService,
    CryptoService,
    FtpService,
    FileSystemService,
  ]
})
export class UtilsModule {}
