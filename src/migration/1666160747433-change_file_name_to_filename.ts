import { MigrationInterface, QueryRunner } from "typeorm";

export class changeFileNameToFilename1666160747433 implements MigrationInterface {
    name = 'changeFileNameToFilename1666160747433'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "storage"
                RENAME COLUMN "file_name" TO "filename"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "storage"
                RENAME COLUMN "filename" TO "file_name"
        `);
    }

}
