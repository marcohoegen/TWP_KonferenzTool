import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSessionDto: CreateSessionDto) {
    const { conferenceId, ...sessionData } = createSessionDto;
    return await this.prisma.session.create({
      data: {
        ...sessionData,
        conference: { connect: { id: conferenceId } },
      },
    });
  }

  async findAll() {
    return await this.prisma.session.findMany();
  }

  async findSessionsByConferenceId(conferenceId: number) {
    const sessions = await this.prisma.session.findMany({
      where: { conferenceId },
    });

    if (sessions.length === 0) {
      throw new NotFoundException(
        `No sessions found for conference ID ${conferenceId}`,
      );
    }
    return sessions;
  }

  async findOne(id: number) {
    const session = await this.prisma.session.findUnique({
      where: { id },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }
    return session;
  }

  // Update session without being able to change conferenceId
  async update(id: number, updateSessionDto: UpdateSessionDto) {
    const sessionExists = await this.prisma.session.findUnique({
      where: { id },
    });

    if (!sessionExists) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }
    const { conferenceId, ...updateData } = updateSessionDto;
    return await this.prisma.session.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    const sessionExists = await this.prisma.session.findUnique({
      where: { id },
    });

    if (!sessionExists) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    // Get or create default session for this conference
    let defaultSession = await this.prisma.session.findFirst({
      where: {
        conferenceId: sessionExists.conferenceId,
        sessionName: 'presentations',
      },
    });

    if (!defaultSession) {
      defaultSession = await this.prisma.session.create({
        data: {
          sessionName: 'presentations',
          sessionNumber: 0,
          conference: { connect: { id: sessionExists.conferenceId } },
        },
      });
    }

    // Move all presentations from deleted session to default session
    await this.prisma.presentation.updateMany({
      where: { sessionId: id },
      data: { sessionId: defaultSession.id },
    });

    return await this.prisma.session.delete({
      where: { id },
    });
  }
}
