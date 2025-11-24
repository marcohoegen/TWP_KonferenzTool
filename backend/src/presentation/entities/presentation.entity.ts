import {
  Presentation as PrismaPresentation,
  PresentationStatus,
} from '@prisma/client';
import { Conference } from 'src/conference/entities/conference.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { User } from 'src/user/entities/user.entity';

export class Presentation implements PrismaPresentation {
  id: number;
  title: string;
  agendaPosition: number;
  conferenceId: number;
  status: PresentationStatus;
  createdAt: Date;
  conference?: Conference;
  presenters?: User[];
  ratings?: Rating[];

  constructor(partial: Partial<Presentation>) {
    Object.assign(this, partial);
  }
}
