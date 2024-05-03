import { Entity, Column, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/baseEntity';
import { Length } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wishlist extends BaseEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @Length(0, 1500)
  description: string;

  @Column()
  image: string;

  @ManyToMany(() => Wish, (wish) => wish.wishlists)
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
