import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { LocalGuard } from './gaurds/LocalGuard';
import { User } from '../../users/entities/user.entity';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: CreateUserDto): Promise<User> {
    return this.authService.signup(dto);
  }

  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Request() req: { user: User }): Promise<{ access_token: string }> {
    const payload = { id: req.user.id, username: req.user.username };
    return this.authService.signin(payload);
  }
}
