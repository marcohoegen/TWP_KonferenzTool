import { Presentation } from 'src/presentation/entities/presentation.entity';
import { User } from 'src/user/entities/user.entity';
import { Conference as PrismaConference } from '@prisma/client';

export class Conference implements PrismaConference {
  id: number;
  name: string;
  location: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  users?: User[];
  presentations?: Presentation[];

  constructor(partial: Partial<Conference>) {
    Object.assign(this, partial);
  }
}
