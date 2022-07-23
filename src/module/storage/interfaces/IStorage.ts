export interface IStorage {
  save(file_name: string, data): Promise<boolean>;
  extract(file_name: string): Promise<any>;
  delete(file_name: string): Promise<void>;
}
