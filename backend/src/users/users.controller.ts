import {
  Controller,
  Get,
  Post,
  Request,
  Patch,
  Param,
  Body,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { HashService } from '../utils/hash/hash.service';
import { JwtGuard } from '../utils/auth/gaurds/jwtguard';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
  ) {}

  @Get('me')
  async getMe(@Request() { user }): Promise<User> {
    const searchOptions = { where: { id: user.id } };
    return this.usersService.findOne(searchOptions);
  }

  @Patch('me')
  async updateMe(@Request() { user }, @Body() dto: UpdateUserDto) {
    const searchMeOptions = { where: { id: user.id } };
    const userMe = await this.usersService.findOne(searchMeOptions);
    if (!userMe) {
      throw new NotFoundException();
    }

    for (const key in dto) {
      userMe[key] = dto[key];
    }

    if (dto.password) {
      const passwordHash = await this.hashService.hashData(dto.password);
      userMe.password = passwordHash;
    }
    return this.usersService.update(searchMeOptions, userMe);
  }

  @Get('me/wishes')
  async getMyWishes(@Request() { user }): Promise<Wish[]> {
    const searchOptions = {
      select: { wishes: true },
      where: { id: user.id },
      relations: { wishes: true },
    };
    const { wishes } = await this.usersService.findOne(searchOptions);
    return wishes;
  }
  @Get(':username')
  async getUser(@Param('username') username: string) {
    const searchOptions = {
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { username },
    };
    return this.usersService.findOne(searchOptions);
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string) {
    const searchOptions = {
      select: { wishes: true },
      where: { username },
      relations: { wishes: true },
    };
    const { wishes } = await this.usersService.findOne(searchOptions);
    return wishes;
  }

  @Post('find')
  async find(@Body() query: string) {
    const searchOptions = {
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
      where: [{ username: query }, { email: query }],
    };
    return this.usersService.findMany(searchOptions);
  }
}
