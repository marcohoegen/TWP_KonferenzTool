import { Module } from '@nestjs/common';
import { ConferenceService } from './conference.service';
import { ConferenceController } from './conference.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ConferenceController],
  providers: [ConferenceService, PrismaService],
})
export class ConferenceModule {}
