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

  async findOne(id: number) {
    return await this.prisma.session.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateSessionDto: UpdateSessionDto) {
    return await this.prisma.session.update({
      where: { id },
      data: updateSessionDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.session.delete({
      where: { id },
    });
  }
}
