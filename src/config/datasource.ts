import { Storage } from "../module/storage/entity/storage.model";
import { User } from "../module/auth/entity/user.model";
import { DataSource } from "typeorm";
import cfg from "./app.config";

export default new DataSource({
  type: "postgres",
  host: cfg.POSTGRES_HOST,
  port: cfg.POSTGRES_PORT,
  username: cfg.POSTGRES_USERNAME,
  password: cfg.POSTGRES_PASSWORD,
  database: cfg.POSTGRES_DATABASE,
  synchronize: false,
  logging: (cfg.POSTGRES_LOGGING?.toLowerCase() === "true"),
  entities: [Storage, User],
  subscribers: ["src/subscriber/*.{ts, js}"],
  migrations: ["src/migration/*.{ts, js}"],
});
