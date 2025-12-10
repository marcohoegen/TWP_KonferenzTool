import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { UpdatePresentationDto } from './dto/update-presentation.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PresentationStatus, User } from '.prisma/client/default.js';

@Injectable()
export class PresentationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPresentationDto: CreatePresentationDto) {
    const { conferenceId, presenterIds, sessionId, ...presentationData } =
      createPresentationDto;

    let resolvedSessionId = sessionId;

    if (!resolvedSessionId) {
      const defaultSession = await this.prisma.session.findFirst({
        where: { conferenceId, sessionNumber: 0 },
      });
      if (!defaultSession) {
        throw new NotFoundException(
          `Default session for conference ID ${conferenceId} not found`,
        );
      }
      resolvedSessionId = defaultSession.id;
    }
    const Presentation = await this.prisma.presentation.create({
      data: {
        ...presentationData,
        presenters: presenterIds?.length
          ? {
              connect: presenterIds.map((id) => ({ id })),
            }
          : undefined,
        conference: { connect: { id: conferenceId } },
        session: { connect: { id: resolvedSessionId } },
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
        session: true,
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
        sessionId: true,
        presenters: {
          select: {
            id: true,
            name: true,
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
        sessionId: true,
        presenters: {
          select: {
            id: true,
            name: true,
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
        presenters: true,
        conferenceId: true,
        sessionId: true,
        status: true,
      },
      orderBy: { agendaPosition: 'asc' },
    });
  }

  async findPresentationsBySessionId(sessionId: number) {
    return await this.prisma.presentation.findMany({
      where: { sessionId },
      select: {
        id: true,
        title: true,
        agendaPosition: true,
        presenters: true,
        conferenceId: true,
        sessionId: true,
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

    return await this.prisma.presentation.update({
      where: { id },
      data: { status: status },
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

  async createManyFromCsv(
    presentations: Array<{
      title: string;
      presenterName: string;
      presenterEmail: string;
    }>,
    conferenceId: number,
  ) {
    const presentationMap = new Map<
      string,
      {
        agendaPosition: number;
        presenters: Array<{ name: string; email: string }>;
      }
    >();
    const uniquePresentations: string[] = [];

    // Group presenters by presentation title, maintaining order
    presentations.forEach(({ title, presenterName, presenterEmail }) => {
      if (!presentationMap.has(title)) {
        presentationMap.set(title, {
          agendaPosition: uniquePresentations.length + 1,
          presenters: [],
        });
        uniquePresentations.push(title);
      }

      const presentation = presentationMap.get(title)!;
      // Check for duplicate presenter in this presentation
      const isDuplicate = presentation.presenters.some(
        (p) => p.email === presenterEmail && p.name === presenterName,
      );

      if (!isDuplicate) {
        presentation.presenters.push({
          name: presenterName,
          email: presenterEmail,
        });
      }
    });

    // Get highest existing agenda position for this conference
    const maxAgendaPosition = await this.prisma.presentation.findFirst({
      where: { conferenceId },
      orderBy: { agendaPosition: 'desc' },
      select: { agendaPosition: true },
    });

    const startPosition = (maxAgendaPosition?.agendaPosition || 0) + 1;

    const createdPresentations: Array<{
      id: number;
      title: string;
      agendaPosition: number;
      status: PresentationStatus;
      conferenceId: number;
      createdAt: Date;
      presenters: Array<{
        id: number;
        name: string;
        email: string;
        conferenceId: number;
      }>;
    }> = [];

    for (const title of uniquePresentations) {
      const { agendaPosition, presenters } = presentationMap.get(title)!;
      const adjustedPosition = startPosition + agendaPosition - 1;

      // Process each presenter - find or create user
      const presenterIds: number[] = [];

      for (const presenter of presenters) {
        // Check if user exists by email in this conference
        let user = await this.prisma.user.findFirst({
          where: {
            email: presenter.email,
            conferenceId: conferenceId,
          },
        });

        // If user doesn't exist, create them
        if (!user) {
          // Generate unique code for new user
          let personCode = '';
          let isUnique = false;
          while (!isUnique) {
            personCode = this.generatePersonCode();
            const existingUser = await this.prisma.user.findUnique({
              where: { code: personCode },
            });
            if (!existingUser) {
              isUnique = true;
            }
          }

          user = await this.prisma.user.create({
            data: {
              name: presenter.name,
              email: presenter.email,
              code: personCode,
              conferenceId: conferenceId,
            },
          });
        }

        presenterIds.push(user.id);
      }

      // Create presentation with all presenters
      const presentation = await this.prisma.presentation.create({
        data: {
          title,
          agendaPosition: adjustedPosition,
          status: PresentationStatus.INACTIVE,
          conference: { connect: { id: conferenceId } },
          presenters: {
            connect: presenterIds.map((id) => ({ id })),
          },
        },
        include: {
          presenters: {
            select: {
              id: true,
              name: true,
              email: true,
              conferenceId: true,
            },
          },
        },
      });

      createdPresentations.push(presentation);
    }

    return createdPresentations;
  }

  // Helper method to generate unique person codes
  private generatePersonCode(length = 5): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join('');
  }
}
