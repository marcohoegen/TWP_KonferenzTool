import { Injectable } from '@nestjs/common';
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
    return await this.prisma.session.findMany({
      where: { conferenceId },
    });
  }

  async findOne(id: number) {
    return await this.prisma.session.findUnique({
      where: { id },
    });
  }

  // Update session without being able to change conferenceId
  async update(id: number, updateSessionDto: UpdateSessionDto) {
    const { conferenceId, ...updateData } = updateSessionDto;
    return await this.prisma.session.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    return await this.prisma.session.delete({
      where: { id },
    });
  }
}
