import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Generated } from "typeorm";

@Entity({ name: "Storage" })
export class Storage extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "text", unique: true})
    @Generated("uuid")
    uuid: string;

    @Column({type: "bytea", nullable: true})
    iv: Buffer;

    @Column({type: "text", nullable: true})
    file_name: string;
}