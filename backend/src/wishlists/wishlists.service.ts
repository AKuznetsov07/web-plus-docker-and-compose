import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishRepository: Repository<Wishlist>,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    wishlistOwner: User,
    wishes: Wish[],
  ): Promise<Wishlist> {
    return this.wishRepository.save({
      name: createWishlistDto.name,
      description: '',
      image: createWishlistDto.image,
      items: wishes,
      owner: wishlistOwner,
    });
  }

  async findAll(options): Promise<Wishlist[]> {
    return this.wishRepository.find(options);
  }

  async findOne(options): Promise<Wishlist> {
    return this.wishRepository.findOne(options);
  }

  async update(options, updateWishlistDto: Wishlist) {
    return this.wishRepository.update(updateWishlistDto, options);
  }

  async remove(options) {
    return this.wishRepository.delete(options);
  }
}
