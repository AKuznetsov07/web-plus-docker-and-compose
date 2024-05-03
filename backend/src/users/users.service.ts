import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const searchOptions = {
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    };
    const exsistingUser = await this.userRepository.findOne(searchOptions);
    if (exsistingUser) {
      throw new Error('User with such name or email already exists');
    }

    return this.userRepository.save(createUserDto);
  }

  async findMany(options): Promise<User[]> {
    return this.userRepository.find(options);
  }

  async findOne(options): Promise<User> {
    return this.userRepository.findOne(options);
  }

  async update(options, updateUser: User) {
    const searchOptions = {
      where: [
        {
          id: Not(updateUser.id),
          username: updateUser.username,
        },
        {
          id: Not(updateUser.id),
          email: updateUser.email,
        },
      ],
    };
    const exsistingUser = await this.userRepository.findOne(searchOptions);
    if (exsistingUser) {
      throw new Error('User with such name or email already exists');
    }
    return this.userRepository.save(updateUser, options);
  }

  async remove(options) {
    return this.userRepository.delete(options);
  }
}
