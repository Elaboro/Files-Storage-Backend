import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { Users } from '../entity/users.model';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService
{
    constructor(private jwtService: JwtService)
    {}

    async register(dto: CreateUserDto): Promise<object>
    {
        try
        {
            let hash_password: string = bcrypt.hashSync(dto.password, 10);
            let user: Users = new Users();
            user.username = dto.username;
            user.password = hash_password;
            user.email = dto.email;
            await user.save();

            return this.generateToken(user);
        } catch (e)
        {
            throw new HttpException("User is not created", HttpStatus.BAD_REQUEST);
        }
    }

    async login(dto: CreateUserDto): Promise<object>
    {
        try
        {
            let username: string = dto.username;
            let email: string = dto.email;
            let password: string = dto.password;

            let user: Users = await Users.findOne({where: [
                {username: username},
                {email: email}
            ]});
            if(!user)
            {
                throw new HttpException("Invalid username or email", HttpStatus.UNAUTHORIZED);
            }

            let is_password_equals: boolean = bcrypt.compareSync(password, user.password);
            if(!is_password_equals)
            {
                throw new HttpException("Invalid username or email", HttpStatus.UNAUTHORIZED);
            }

            return this.generateToken(user);
        } catch (e)
        {
            throw new HttpException("Invalid username or password", HttpStatus.UNAUTHORIZED);
        }
    }

    generateToken(user: Users): object
    {
        let payload: object = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        return {
            token: this.jwtService.sign(payload)
        };
    }
}
