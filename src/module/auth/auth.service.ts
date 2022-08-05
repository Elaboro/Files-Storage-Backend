import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  LoginUserDto,
  RegisterUserDto,
} from './dto/user.dto';
import { Users } from './entity/users.model';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(dto: RegisterUserDto): Promise<object> {
    try {
      const hash_password: string = bcrypt.hashSync(dto.password, 10);
      const user: Users = new Users();
      user.username = dto.username;
      user.password = hash_password;
      user.email = dto.email;
      await user.save();

      return this.generateToken(user);
    } catch (e) {
      throw new HttpException('User is not created', HttpStatus.BAD_REQUEST);
    }
  }

  async login(dto: LoginUserDto): Promise<object> {
    try {
      const username: string = dto.username;
      const email: string = dto.email;
      const password: string = dto.password;

      const user: Users = await Users.findOne({
        where: [{ username: username }, { email: email }],
      });
      if (!user) {
        throw new HttpException(
          'Invalid username or email',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const is_password_equals: boolean = bcrypt.compareSync(
        password,
        user.password,
      );
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

  generateToken(user: Users): object {
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
