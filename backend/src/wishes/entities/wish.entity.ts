import { Entity, Column, ManyToMany, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/baseEntity';
import { Length } from 'class-validator';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wish extends BaseEntity {
  @Column()
  @Length(0, 250)
  name: string;

  @Column()
  link: string;

  @Column()
  image: string;

  @Column('numeric', {
    precision: 7,
    scale: 2,
  })
  price: number;

  @Column('numeric', {
    precision: 7,
    scale: 2,
  })
  @Column()
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column()
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlists: Wishlist[];

  @Column()
  copied: number;
}
