import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ConferenceService } from './conference.service';
import { Conference } from '@prisma/client';

@Controller('conference')
export class ConferenceController {
  constructor(private readonly conferenceService: ConferenceService) {}

  @Get()
  findAll() {
    return this.conferenceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conferenceService.findOne(+id);
  }

  @Post()
  create(
    @Body()
    body: {
      name: string;
      location: string;
      startDate: string;
      endDate: string;
    },
  ) {
    return this.conferenceService.create({
      name: body.name,
      location: body.location,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<Conference>) {
    return this.conferenceService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conferenceService.remove(+id);
  }
}
