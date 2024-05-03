import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { HashService } from '../hash/hash.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/entities/user.entity';
import { CreateUserDto } from '../../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async signin(payload): Promise<{ access_token: string }> {
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      }),
    };
  }

  async signup(user: CreateUserDto) {
    return this.usersService.create(user);
  }

  async validatePassword(username: string, password: string): Promise<User> {
    const searchOptions = {
      where: { username },
    };
    const user = await this.usersService.findOne(searchOptions);
    if (user && this.hashService.verifyHash(password, user.password)) {
      return user;
    }

    return null;
  }
}
