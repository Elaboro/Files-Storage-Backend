import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsEmail, Length } from 'class-validator';

@Entity({ name: "Users" })
export class Users extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "text", unique: true})
    @Length(3, 20)
    username: string;

    @Column({type: "text", unique: true})
    password: string;

    @Column({type: "text", unique: true})
    @IsEmail()
    email: string;
}