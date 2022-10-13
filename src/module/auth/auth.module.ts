import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import cfg from './../../config/app.config';
import { UserRepo } from './repository/UserRepo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.model';
import { Storage } from '../storage/entity/storage.model';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserRepo],
  imports: [
    TypeOrmModule.forFeature([ User, Storage]),
    JwtModule.register({
      secret: cfg.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: cfg.JWT_EXPIRATION_TIME,
      },
    }),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
