import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { User } from '../../../users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  validate(login: string, password: string): Promise<User> {
    const validationResult = this.authService.validatePassword(login, password);
    if (!validationResult) {
      throw new UnauthorizedException();
    }
    return validationResult;
  }
}
