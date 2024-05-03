import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersModule } from '../../users/users.module';
import { HashModule } from '../hash/hash.module';
import { jwtConfig } from '../../common/jwtRegisterConfig';
import { JwtStrategy } from './localPassportStrategy/JwtStrategy';
import { LocalStrategy } from './localPassportStrategy/LocalStrategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync(jwtConfig),
    UsersModule,
    HashModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
