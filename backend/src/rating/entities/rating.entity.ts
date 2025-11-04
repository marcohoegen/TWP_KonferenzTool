import { Rating as PrismaRating } from '@prisma/client';
import { Presentation } from 'src/presentation/entities/presentation.entity';
import { User } from 'src/user/entities/user.entity';

export class Rating implements PrismaRating {
  id: number;
  rating: number;
  userId: number;
  presentationId: number;
  createdAt: Date;
  user?: User;
  presentation?: Presentation;

  constructor(partial: Partial<Rating>) {
    Object.assign(this, partial);
  }
}
