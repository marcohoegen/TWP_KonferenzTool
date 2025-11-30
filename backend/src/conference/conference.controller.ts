import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ConferenceService } from './conference.service';
import { CreateConferenceDto } from './dto/create-conference.dto';
import { UpdateConferenceDto } from './dto/update-conference.dto';
import { Conference } from './entities/conference.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('conference')
export class ConferenceController {
  constructor(private readonly conferenceService: ConferenceService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createConferenceDto: CreateConferenceDto,
  ): Promise<Conference> {
    const createConference =
      await this.conferenceService.create(createConferenceDto);

    return new Conference({
      id: createConference.id,
      name: createConference.name,
      location: createConference.location,
      startDate: createConference.startDate,
      endDate: createConference.endDate,
    });
  }

  @Get()
  async findAll(): Promise<Conference[]> {
    const conferences = await this.conferenceService.findAll();
    return conferences.map(
      (conference) =>
        new Conference({
          id: conference.id,
          name: conference.name,
          location: conference.location,
          startDate: conference.startDate,
          endDate: conference.endDate,
        }),
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Conference> {
    const conference = await this.conferenceService.findOne(id);
    return new Conference(conference);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateConferenceDto: UpdateConferenceDto,
  ): Promise<Conference> {
    const updatedConference = await this.conferenceService.update(
      id,
      updateConferenceDto,
    );
    return new Conference({
      id: updatedConference.id,
      name: updatedConference.name,
      location: updatedConference.location,
      startDate: updatedConference.startDate,
      endDate: updatedConference.endDate,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.conferenceService.remove(id);
  }
}
