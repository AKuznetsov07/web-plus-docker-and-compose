import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { In } from 'typeorm';
import { WishlistsService } from './wishlists.service';
import { WishesService } from '../wishes/wishes.service';
import { UsersService } from '../users/users.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from '../utils/auth/gaurds/jwtguard';

@UseGuards(JwtGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(
    private readonly wishlistsService: WishlistsService,
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async getWishlists() {
    const searchWishlistsOptions = {
      relations: {
        owner: true,
        items: true,
      },
    };
    return this.wishlistsService.findAll(searchWishlistsOptions);
  }

  @Post()
  async postWishlists(@Request() { user }, @Body() dto: CreateWishlistDto) {
    const searchUserOptions = { where: { id: user.id } };
    const wishlistOwner = await this.usersService.findOne(searchUserOptions);
    if (!wishlistOwner) {
      throw new Error('You arent wishlist owner');
    }

    const searchWishesOptions = {
      where: { id: In(dto.itemsId) },
    };
    const wishes = await this.wishesService.findAll(searchWishesOptions);
    return this.wishlistsService.create(dto, wishlistOwner, wishes);
  }

  @Get(':id')
  async getWishlistsById(@Param('id') id: string) {
    const searchWishlistOptions = {
      where: { id },
      relations: {
        owner: true,
        items: true,
      },
    };
    return this.wishlistsService.findOne(searchWishlistOptions);
  }

  @Patch(':id')
  async patchWishlistsById(
    @Request() { user },
    @Param('id') id: string,
    @Body() dto: UpdateWishlistDto,
  ) {
    const searchWishlistOptions = {
      relations: { owner: true, items: true },
      where: { id },
    };
    const wishlist = await this.wishlistsService.findOne(searchWishlistOptions);
    if (wishlist.owner.id !== user.id) {
      throw new Error('You arent wishlist owner');
    }
    for (const key in dto) {
      wishlist[key] = dto[key];
    }

    const updateWishlistOptions = {
      where: { id },
    };
    return this.wishlistsService.update(updateWishlistOptions, wishlist);
  }

  @Delete(':id')
  async deleteWishlistsById(@Param('id') id: string, @Request() { user }) {
    const searchWishlistOptions = {
      where: { id },
      relations: { owner: true },
    };
    const deleteWishlist = await this.wishlistsService.findOne(
      searchWishlistOptions,
    );
    if (!deleteWishlist) {
      throw new Error('Cant find wishlist');
    }
    if (deleteWishlist.owner.id !== user.id) {
      throw new Error('You arent wishlist owner');
    }

    const deleteWishlistOptions = { where: { id: deleteWishlist.id } };
    await this.wishlistsService.remove(deleteWishlistOptions);
    return deleteWishlist;
  }
}
