import {
  Presentation as PrismaPresentation,
  PresentationStatus,
} from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Conference } from 'src/conference/entities/conference.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { User } from 'src/user/entities/user.entity';

export class Presentation implements PrismaPresentation {
  id: number;
  title: string;
  agendaPosition: number;
  conferenceId: number;
  sessionId: number;

  @ApiProperty({
    enum: PresentationStatus,
    description: 'Presentation status',
    example: PresentationStatus.ACTIVE,
  })
  status: PresentationStatus;

  createdAt: Date;
  conference?: Conference;
  presenters?: User[];
  ratings?: Rating[];

  constructor(partial: Partial<Presentation>) {
    Object.assign(this, partial);
  }
}
