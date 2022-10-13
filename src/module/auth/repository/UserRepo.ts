import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entity/user.model";
import { Repository } from "typeorm";
import { UserData } from "../type/Type";

@Injectable()
export class UserRepo {

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createUser(user_data: UserData): Promise<User> {
    const user: User = this.userRepo.create();

    user.username = user_data.username;
    user.password = user_data.password;
    user.email = user_data.email;

    return user.save();
  }

  async getUser({ username, email }: UserData): Promise<User> {
    return this.userRepo.findOne({
      where: [
        { username },
        { email },
      ],
    });
  }
}
