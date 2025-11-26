import { User as PrismaUser } from '@prisma/client';
import { Conference } from 'src/conference/entities/conference.entity';
import { Presentation } from 'src/presentation/entities/presentation.entity';
import { Rating } from 'src/rating/entities/rating.entity';

export class User implements PrismaUser {
  id: number;
  email: string;
  code: string;
  conferenceId: number;
  createdAt: Date;
  codeSentAt: Date | null;
  confernce?: Conference;
  presentations?: Presentation[];
  ratings?: Rating[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
