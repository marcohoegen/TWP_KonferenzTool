import { Session as PrismaSession } from '@prisma/client';
import { Presentation } from 'src/presentation/entities/presentation.entity';

export class Session implements PrismaSession {
  id: number;
  sessionNumber: number;
  sessionName: string;
  presentations?: Presentation[];
  conferenceId: number;

  constructor(partial: Partial<Session>) {
    Object.assign(this, partial);
  }
}
