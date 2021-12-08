import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate
{
    constructor(private jwtService: JwtService)
    {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>
    {
        let req = context.switchToHttp().getRequest();
        try
        {
            let auth_header = req.headers.authorization;
            let bearer = auth_header.split(" ")[0];
            let token = auth_header.split(" ")[1];

            if(bearer !== "Bearer" || !token)
            {
                throw new HttpException("User is unauthorized", HttpStatus.UNAUTHORIZED);
            }

            let user = this.jwtService.verify(token);
            req.user = user;
            return true;
        } catch (e)
        {
            throw new HttpException("User is unauthorized", HttpStatus.UNAUTHORIZED);
        }
    }
}