import { Storage } from "./../module/entity/storage.model";
import { Users } from "./../module/entity/users.model";
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
  entities: [Storage, Users],
  subscribers: ["src/subscriber/*.{ts, js}"],
  migrations: ["src/migration/*.{ts, js}"],
});
