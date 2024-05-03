import { IsOptional, IsNumber, IsPositive, IsBoolean } from 'class-validator';
export class CreateOfferDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsBoolean()
  @IsOptional()
  hidden: boolean;

  @IsNumber()
  itemId: number;
}
