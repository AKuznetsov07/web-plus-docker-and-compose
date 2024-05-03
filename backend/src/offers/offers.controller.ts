import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { WishesService } from '../wishes/wishes.service';
import { UsersService } from '../users/users.service';
import { JwtGuard } from '../utils/auth/gaurds/jwtguard';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @Post()
  async postOffers(
    @Body() createOfferDto: CreateOfferDto,
    @Request() { user },
  ) {
    const searchWishOptions = {
      relations: {
        owner: true,
      },
      where: { id: createOfferDto.itemId },
    };
    const wish = await this.wishesService.findOne(searchWishOptions);

    if (wish.owner.id === user.id) {
      throw new Error('You cant change donate to yours wishes.');
    }

    if (wish.price - wish.raised < createOfferDto.amount) {
      throw new Error('You cant donate more than needed.');
    }

    const searchUserOptions = { where: { id: user.id } };
    const offerOwner = await this.usersService.findOne(searchUserOptions);
    const offer = await this.offersService.create(
      createOfferDto,
      offerOwner,
      wish,
    );

    const updateWishOptions = {
      where: { id: createOfferDto.itemId },
    };
    await this.wishesService.update(updateWishOptions, {
      ...wish,
      raised: wish.raised + createOfferDto.amount,
    });
    return offer;
  }
  @Get()
  async getOffers() {
    const searchOfferOptions = {
      relations: {
        user: true,
      },
    };
    return this.offersService.findAll(searchOfferOptions);
  }
  @Get(':id')
  async getOffersById(@Param('id') id: string) {
    const searchOfferOptions = {
      relations: {
        user: true,
      },
      where: {
        id,
      },
    };
    return this.offersService.findAll(searchOfferOptions);
  }
}
