import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { User } from "../../auth/entity/user.model";
import { Storage } from "../entity/storage.model";

interface FileData {
  readonly iv: Buffer;
  originalname: string;
  user: User;
}

@Injectable()
export class StorageRepo {

  constructor(
    @InjectRepository(Storage)
    private readonly storageRepo: Repository<Storage>,
  ) {}

  async createFile({
    iv,
    originalname,
    user
  }: FileData | Partial<FileData>) {
    const storage: Storage = this.storageRepo.create();

    storage.iv = iv;
    storage.filename = originalname;
    storage.user = user;

    return storage.save();
  }

  async changeFileById(id: number, file_data: FileData | Partial<FileData>) {
    const storage: Storage = await this.getFileById(id);

    storage.iv = file_data.iv;
    storage.filename = file_data.originalname;
    storage.user = file_data.user;

    return storage.save();
  }

  async getFileById(id: number): Promise<Storage> {
    const [ storage ]: Storage[] = await this.storageRepo.findBy({ id });
    return storage;
  }

  async deleteFileById(id: number): Promise<DeleteResult> {
    return this.storageRepo.delete({ id });
  }

  async getFileList(): Promise<Storage[]> {
    return this.storageRepo.createQueryBuilder("storages")
      .leftJoinAndSelect('storages.user', 'user')
      .select([
        'storages.id AS id',
        'storages.filename AS filename',
        'user.username AS username',
      ])
      .orderBy('storages.id', 'ASC')
      .getRawMany<Storage>();
  }
}