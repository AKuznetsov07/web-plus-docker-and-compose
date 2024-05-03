import { IsString, Length, IsUrl, IsArray } from 'class-validator';
export class CreateWishlistDto {
  @IsString()
  @Length(0, 250)
  name: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsArray()
  itemsId: number[];
}
