import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const auth_header: string = req.headers.authorization;
      const bearer: string = auth_header.split(' ')[0];
      const token: string = auth_header.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new HttpException(
          'User is unauthorized',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const user: object = this.jwtService.verify(token);
      req.user = user;
      return true;
    } catch (e) {
      throw new HttpException('User is unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
