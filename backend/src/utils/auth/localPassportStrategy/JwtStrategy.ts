import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { User } from '../../../users/entities/user.entity';
import { UsersService } from '../../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.get<string>('jwtSecret'),
      ignoreExpiration: false,
    });
  }

  async validate(payload): Promise<User> {
    const searchOptions = {
      where: { id: payload.id, username: payload.username },
    };

    const user = this.usersService.findOne(searchOptions);
    if (!user) {
      throw new Error('auth payload isnt valid.');
    }

    return user;
  }
}
