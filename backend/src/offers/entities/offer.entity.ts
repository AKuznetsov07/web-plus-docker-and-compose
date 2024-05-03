import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/baseEntity';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Offer extends BaseEntity {
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column()
  @Column('numeric', {
    precision: 7,
    scale: 2,
  })
  amount: number;

  @Column({ default: false })
  hidden: boolean;
}
