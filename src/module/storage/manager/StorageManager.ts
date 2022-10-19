import { Inject, Injectable } from "@nestjs/common";
import { Readable } from "typeorm/platform/PlatformTools";
import cfg from "../../../config/app.config";
import { FileSystemService } from "../../utils/filesystem/FileSystemService";
import { FtpService } from "../../utils/ftp/FtpService";
import { IStorage } from "./type/Type";
import { StorageLocal } from "./method/StorageLocal";
import { StorageRemote } from "./method/StorageRemote";

export type StorageMethod = "local" | "remote";

@Injectable()
export class StorageManager implements IStorage{
  private storage_method: IStorage;

  constructor(
    @Inject(FileSystemService)
    private readonly fileSystemService: FileSystemService,

    @Inject(FtpService)
    private readonly ftpService: FtpService,
  ) {
    const method: StorageMethod = cfg.STORAGE_METHOD;
    if(method === "local") this.storage_method = new StorageLocal(this.fileSystemService);
    if(method === "remote") this.storage_method = new StorageRemote(this.ftpService);
  }

  async save(filename: string, data: string | NodeJS.ReadableStream | Buffer): Promise<any> {
    this.storage_method.save(filename, data);
  }
  async getFileStream(filename: string): Promise<Readable> {
    return this.storage_method.getFileStream(filename);
  }
  async delete(filename: string): Promise<any> {
    this.storage_method.delete(filename);
  }
}