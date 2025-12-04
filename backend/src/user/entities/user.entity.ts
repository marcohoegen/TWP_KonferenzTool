import { User as PrismaUser } from '@prisma/client';
import { Conference } from 'src/conference/entities/conference.entity';
import { Presentation } from 'src/presentation/entities/presentation.entity';
import { Rating } from 'src/rating/entities/rating.entity';

export class User implements PrismaUser {
  id: number;
  email: string;
  name: string;
  code: string;
  conferenceComment: string | null;
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
