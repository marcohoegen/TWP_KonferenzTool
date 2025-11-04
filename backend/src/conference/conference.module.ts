import { Module } from '@nestjs/common';
import { ConferenceService } from './conference.service';
import { ConferenceController } from './conference.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ConferenceController],
  providers: [ConferenceService],
})
export class ConferenceModule {}
