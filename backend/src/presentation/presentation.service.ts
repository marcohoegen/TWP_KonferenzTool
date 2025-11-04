import { Injectable } from '@nestjs/common';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { UpdatePresentationDto } from './dto/update-presentation.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PresentationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPresentationDto: CreatePresentationDto) {
    return await this.prisma.presentation.create({
      data: {
        ...createPresentationDto,
      },
    });
  }

  async findAll() {
    return await this.prisma.presentation.findMany({
      select: {
        id: true,
        title: true,
        agendaPosition: true,
        conferenceId: true,
        userId: true,
        ratings: true,
      },
    });
  }

  async findOne(id: number) {
    const presentation = await this.prisma.presentation.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        agendaPosition: true,
        conferenceId: true,
        userId: true,
        ratings: true,
      },
    });

    if (!presentation) {
      throw new Error(`Presentation with ID ${id} not found`);
    }
    return presentation;
  }

  async update(id: number, updatePresentationDto: UpdatePresentationDto) {
    const presentationExists = await this.prisma.presentation.findUnique({
      where: { id },
    });
    if (!presentationExists) {
      throw new Error(`Presentation with ID ${id} not found`);
    }
    const data = { ...updatePresentationDto };

    return this.prisma.presentation.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const presentationExists = await this.prisma.presentation.findUnique({
      where: { id },
    });
    if (!presentationExists) {
      throw new Error(`Presentation with ID ${id} not found`);
    }

    await this.prisma.presentation.delete({ where: { id } });
    return { message: `Presentation with ID ${id} deleted` };
  }
}
