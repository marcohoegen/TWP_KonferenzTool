import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConferenceDto } from './dto/create-conference.dto';
import { UpdateConferenceDto } from './dto/update-conference.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConferenceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createConferenceDto: CreateConferenceDto) {
    const conference = await this.prisma.conference.create({
      data: {
        ...createConferenceDto,
        sessions: {
          create: {
            sessionNumber: 0,
            sessionName: 'presentations',
          },
        },
      },
      include: {
        sessions: true,
      },
    });
    return conference;
  }

  async findAll() {
    return await this.prisma.conference.findMany({
      select: {
        id: true,
        name: true,
        location: true,
        startDate: true,
        endDate: true,
      },
    });
  }

  async findOne(id: number) {
    const conference = await this.prisma.conference.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        location: true,
        startDate: true,
        endDate: true,
      },
    });

    if (!conference) {
      throw new NotFoundException(`Conference with ID ${id} not found`);
    }
    return conference;
  }

  async update(id: number, updateConferenceDto: UpdateConferenceDto) {
    const conferenceExists = await this.prisma.conference.findUnique({
      where: { id },
    });
    if (!conferenceExists) {
      throw new NotFoundException(`Conference with ID ${id} not found`);
    }
    const data = { ...updateConferenceDto };

    return this.prisma.conference.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const conferenceExists = await this.prisma.conference.findUnique({
      where: { id },
    });
    if (!conferenceExists) {
      throw new NotFoundException(`Conference with ID ${id} not found`);
    }

    await this.prisma.conference.delete({ where: { id } });
    return { message: `Conference with ID ${id} deleted` };
  }
}
