import { MigrationInterface, QueryRunner } from "typeorm";

export class userAndStorage1658954797903 implements MigrationInterface {
    name = 'userAndStorage1658954797903';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "username" text NOT NULL,
                "password" text NOT NULL,
                "email" text NOT NULL,
                CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"),
                CONSTRAINT "UQ_638bac731294171648258260ff2" UNIQUE ("password"),
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "storage" (
                "id" SERIAL NOT NULL,
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "iv" bytea,
                "file_name" text,
                "user_id" integer,
                CONSTRAINT "UQ_2b5734f284b208b1d7502f3baa3" UNIQUE ("uuid"),
                CONSTRAINT "PK_f9b67a9921474d86492aad2e027" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "storage"
            ADD CONSTRAINT "FK_25262aa2e3eaffb6dad4c153026" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "storage" DROP CONSTRAINT "FK_25262aa2e3eaffb6dad4c153026"
        `);
        await queryRunner.query(`
            DROP TABLE "storage"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            DROP EXTENSION IF EXISTS "uuid-ossp"
        `);
    }

}
