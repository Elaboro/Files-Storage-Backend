import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController
{
    constructor(private authService: AuthService)
    {}

    @Post("register")
    register(@Body() dto: CreateUserDto): Promise<object>
    {
        return this.authService.register(dto);
    }

    @Post("login")
    login(@Body() dto: CreateUserDto): Promise<object>
    {
        return this.authService.login(dto);
    }
}
