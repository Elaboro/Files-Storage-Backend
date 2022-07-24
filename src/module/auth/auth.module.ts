import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import cfg from 'src/config/app.config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    JwtModule.register({
      secret: cfg.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: '2h',
      },
    }),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
