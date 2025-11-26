import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { UpdatePresentationDto } from './dto/update-presentation.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PresentationStatus, User } from '.prisma/client/default.js';

@Injectable()
export class PresentationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPresentationDto: CreatePresentationDto) {
    const { conferenceId, presenterIds, ...presentationData } =
      createPresentationDto;

    const Presentation = await this.prisma.presentation.create({
      data: {
        ...presentationData,
        presenters: presenterIds?.length
          ? {
              connect: presenterIds.map((id) => ({ id })),
            }
          : undefined,
        conference: { connect: { id: conferenceId } },
      },
      include: {
        presenters: {
          select: {
            id: true,
            email: true,
            code: true,
            conferenceId: true,
            createdAt: true,
          },
        },
        ratings: true,
      },
    });

    Presentation.presenters.map((presenter) => {
      (presenter as User).code = '';
    });

    return Presentation;
  }

  async findAll() {
    return await this.prisma.presentation.findMany({
      select: {
        id: true,
        title: true,
        agendaPosition: true,
        conferenceId: true,
        presenters: {
          select: {
            id: true,
            email: true,
            conferenceId: true,
          },
        },
        status: true,
        ratings: true,
      },
      orderBy: { agendaPosition: 'asc' },
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
        presenters: {
          select: {
            id: true,
            email: true,
            conferenceId: true,
          },
        },
        status: true,
        ratings: true,
      },
    });

    if (!presentation) {
      throw new NotFoundException(`Presentation with ID ${id} not found`);
    }
    return presentation;
  }

  async findPresentationsByConferenceId(conferenceId: number) {
    return await this.prisma.presentation.findMany({
      where: { conferenceId },
      select: {
        id: true,
        title: true,
        agendaPosition: true,
        conferenceId: true,
        status: true,
      },
      orderBy: { agendaPosition: 'asc' },
    });
  }

  async update(id: number, updatePresentationDto: UpdatePresentationDto) {
    const presentationExists = await this.prisma.presentation.findUnique({
      where: { id },
    });
    if (!presentationExists) {
      throw new NotFoundException(`Presentation with ID ${id} not found`);
    }

    const { presenterIds, ...presentationData } = updatePresentationDto;

    // Build update data object properly typed
    const updateData: {
      title?: string;
      agendaPosition?: number;
      conferenceId?: number;
      presenters?: { set: { id: number }[] };
    } = { ...presentationData };

    if (presenterIds !== undefined) {
      updateData.presenters = {
        set: presenterIds.map((id) => ({ id })),
      };
    }

    return this.prisma.presentation.update({
      where: { id },
      data: updateData,
      include: {
        presenters: {
          select: {
            id: true,
            email: true,
            conferenceId: true,
            createdAt: true,
          },
        },
        ratings: true,
      },
    });
  }

  async updateStatus(id: number, status: PresentationStatus) {
    const presentation = await this.prisma.presentation.findUnique({
      where: { id },
      select: { id: true, conferenceId: true, status: true },
    });

    if (!presentation) {
      throw new NotFoundException(`Presentation with ID ${id} not found`);
    }

    const newStatus = status;

    // If activating, deactivate all other presentations in the same conference
    if (newStatus === PresentationStatus.ACTIVE) {
      const results = await this.prisma.$transaction([
        this.prisma.presentation.updateMany({
          where: {
            conferenceId: presentation.conferenceId,
            id: { not: id },
            status: PresentationStatus.ACTIVE,
          },
          data: { status: PresentationStatus.INACTIVE },
        }),
        this.prisma.presentation.update({
          where: { id },
          data: { status: newStatus },
          select: {
            id: true,
            title: true,
            agendaPosition: true,
            conferenceId: true,
            status: true,
          },
        }),
      ]);
      return results[1];
    }

    // If deactivating, just update this presentation
    return await this.prisma.presentation.update({
      where: { id },
      data: { status: newStatus },
      select: {
        id: true,
        title: true,
        agendaPosition: true,
        conferenceId: true,
        status: true,
      },
    });
  }

  async remove(id: number) {
    const presentationExists = await this.prisma.presentation.findUnique({
      where: { id },
    });
    if (!presentationExists) {
      throw new NotFoundException(`Presentation with ID ${id} not found`);
    }

    await this.prisma.presentation.delete({ where: { id } });
    return { message: `Presentation with ID ${id} deleted` };
  }

  // Zusätzliche Hilfsmethoden für die n:m-Beziehung
  async addPresenter(presentationId: number, userId: number) {
    return await this.prisma.presentation.update({
      where: { id: presentationId },
      data: {
        presenters: {
          connect: { id: userId },
        },
      },
      include: {
        presenters: {
          select: {
            id: true,
            email: true,
            conferenceId: true,
            createdAt: true,
          },
        },
        ratings: true,
      },
    });
  }

  async removePresenter(presentationId: number, userId: number) {
    return await this.prisma.presentation.update({
      where: { id: presentationId },
      data: {
        presenters: {
          disconnect: { id: userId },
        },
      },
      include: {
        presenters: {
          select: {
            id: true,
            email: true,
            conferenceId: true,
            createdAt: true,
          },
        },
        ratings: true,
      },
    });
  }
}
