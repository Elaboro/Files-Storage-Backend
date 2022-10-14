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
  }: FileData) {
    // todo later

    const storage: Storage = this.storageRepo.create();

    storage.iv = iv;
    storage.file_name = originalname;
    storage.user = user;

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
        'storages.file_name AS file_name',
        'user.username AS username',
      ])
      .orderBy('user.id', 'ASC')
      .getRawMany<Storage>();
  }
}