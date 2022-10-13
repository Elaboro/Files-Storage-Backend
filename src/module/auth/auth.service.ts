import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  LoginUserDto,
  RegisterUserDto,
} from './dto/user.dto';
import { User } from './entity/user.model';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRepo } from './repository/UserRepo';
import { UserData } from './type/Type';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,

    private readonly userRepo: UserRepo,
  ) {}

  async register(dto: RegisterUserDto): Promise<any> {
    const {
      username,
      password,
      email,
    } = dto;

    try {
      const password_hash: string = bcrypt.hashSync(password, 10);

      const user_data: UserData = {
        username,
        password: password_hash,
        email,
      };

      const user: User = await this.userRepo.createUser(user_data);

      return this.generateToken(user);
    } catch (e) {
      throw new HttpException('User is not created', HttpStatus.BAD_REQUEST);
    }
  }

  async login(dto: LoginUserDto): Promise<object> {
    try {
      const user: User = await this.userRepo.getUser(<UserData>dto);
      if (!user) {
        throw new HttpException(
          'Invalid username or email',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const is_password_equals: boolean = bcrypt.compareSync(
        dto.password,
        user.password,
      );
      delete user.password;
      if (!is_password_equals) {
        throw new HttpException(
          'Invalid username or email',
          HttpStatus.UNAUTHORIZED,
        );
      }

      return this.generateToken(user);
    } catch (e) {
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  generateToken(user: User): object {
    const payload: object = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
