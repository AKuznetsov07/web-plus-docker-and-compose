import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
  ) {}

  async create(
    createOfferDto: CreateOfferDto,
    offerOwner: User,
    offerWish: Wish,
  ): Promise<Offer> {
    return this.offerRepository.save({
      amount: createOfferDto.amount,
      hidden: createOfferDto.hidden,
      user: offerOwner,
      item: offerWish,
    });
  }

  async findAll(options): Promise<Offer[]> {
    return this.offerRepository.find(options);
  }

  async findOne(options): Promise<Offer> {
    return this.offerRepository.findOne(options);
  }

  async update(options, updateOfferDto: UpdateOfferDto) {
    return this.offerRepository.update(options, updateOfferDto);
  }

  async remove(options) {
    return this.offerRepository.delete(options);
  }
}
