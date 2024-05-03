import {
  Request,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { UsersService } from '../users/users.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { JwtGuard } from '../utils/auth/gaurds/jwtguard';

@Controller('wishes')
export class WishesController {
  constructor(
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  async postWish(@Request() { user }, @Body() dto: CreateWishDto) {
    const searchUserOptions = { where: { id: user.id } };
    const wishOwner = await this.usersService.findOne(searchUserOptions);
    return this.wishesService.create(dto, wishOwner);
  }

  @Get('last')
  async getLastWish() {
    const searchOptions = {
      relations: {
        owner: true,
        offers: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    };
    return this.wishesService.findAll(searchOptions);
  }

  @Get('top')
  async getTopWish() {
    const searchOptions = {
      relations: {
        owner: true,
        offers: true,
      },
      order: {
        copied: 'DESC',
      },
      take: 20,
    };
    return this.wishesService.findAll(searchOptions);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getWishById(@Param('id') id: string) {
    const searchOptions = {
      relations: {
        offers: {
          user: true,
        },
        owner: true,
      },
      where: {
        id,
      },
    };
    return this.wishesService.findOne(searchOptions);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateWishById(
    @Request() { user },
    @Param('id') id: string,
    @Body() dto: UpdateWishDto,
  ) {
    const searchWishOptions = {
      relations: {
        offers: true,
        owner: true,
      },
      where: { id },
    };
    const wish = await this.wishesService.findOne(searchWishOptions);
    if (!wish) {
      throw new NotFoundException();
    }

    if (wish.owner.id !== user.id) {
      throw new Error('You cant update not your wishes.');
    }

    if (dto.price && wish.raised > 0) {
      throw new ForbiddenException(
        'Вы не можете изменять стоимость подарка, если уже есть желающие скинуться',
      );
    }

    if (!wish.offers.length) {
      for (const key in dto) {
        wish[key] = dto[key];
      }
      return this.wishesService.update(searchWishOptions, wish);
    }

    return wish;
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteWishById(@Param('id') id: string, @Request() { user }) {
    const searchWishOptions = {
      relations: {
        offers: true,
        owner: true,
      },
      where: { id },
    };
    const wish = await this.wishesService.findOne(searchWishOptions);
    if (!wish) {
      throw new NotFoundException();
    }
    if (wish.offers.length) {
      throw new Error('You cant delete wishes with offers.');
    }
    if (wish.owner.id !== user.id) {
      throw new Error('You cant delete not your wishes.');
    }
    const deleteWishOptions = { where: { id: wish.id } };
    return this.wishesService.remove(deleteWishOptions);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWishById(
    @Param('id') id: string,
    @Request() { user },
  ): Promise<Wish> {
    const searchWishOptions = {
      relations: {
        offers: true,
        owner: true,
      },
      where: { id },
    };
    const wish = await this.wishesService.findOne(searchWishOptions);
    if (!wish) {
      throw new NotFoundException();
    }

    const searchOwnerOptions = {
      where: { id: user.id },
    };

    const newOwner = await this.usersService.findOne(searchOwnerOptions);
    const copiedWish = await this.wishesService.create(
      {
        name: wish.name,
        link: wish.link,
        image: wish.image,
        price: wish.price,
        description: wish.description,
      },
      newOwner,
    );

    const updateWishOptions = {
      relations: {
        offers: true,
        owner: true,
      },
      where: { id },
    };
    await this.wishesService.update(updateWishOptions, {
      ...wish,
      copied: wish.copied + 1,
    });

    return copiedWish;
  }
}
