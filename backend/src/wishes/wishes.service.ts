import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(createdWish: CreateWishDto, wishOwner: User): Promise<Wish> {
    return this.wishRepository.save({
      ...createdWish,
      raised: 0,
      owner: wishOwner,
      offers: [],
      wishlists: [],
      copied: 0,
    });
  }

  async findAll(options): Promise<Wish[]> {
    return this.wishRepository.find(options);
  }

  async findOne(options): Promise<Wish> {
    return this.wishRepository.findOne(options);
  }

  async update(options, updateWish: Wish) {
    return this.wishRepository.update(options, updateWish);
  }

  async remove(options) {
    return this.wishRepository.delete(options);
  }
}
