import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import {
  LoginUserDto,
  RegisterUserDto,
} from './dto/user.dto';
import { AuthService } from './auth.service';
import {
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: "Account registration."
  })
  @Post('register')
  register(@Body() dto: RegisterUserDto): Promise<object> {
    return this.authService.register(dto);
  }

  @ApiOperation({
    summary: "Account authorization.",
    description: `You can login using password and your username or email.`,
  })
  @Post('login')
  login(@Body() dto: LoginUserDto): Promise<object> {
    return this.authService.login(dto);
  }
}
