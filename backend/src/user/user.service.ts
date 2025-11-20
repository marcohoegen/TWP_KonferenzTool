import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { conferenceId, ...userData } = createUserDto;

    return await this.prisma.user.create({
      data: {
        ...userData,
        conference: {
          connect: { id: conferenceId },
        },
      },
      include: {
        presentations: {
          select: {
            id: true,
            title: true,
            agendaPosition: true,
            conferenceId: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        code: true,
        conferenceId: true,
        createdAt: true,
        presentations: {
          select: {
            id: true,
            title: true,
            agendaPosition: true,
            conferenceId: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        code: true,
        conferenceId: true,
        createdAt: true,
        presentations: {
          select: {
            id: true,
            title: true,
            agendaPosition: true,
            conferenceId: true,
            createdAt: true,
          },
        },
      },
    });
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!userExists) {
      throw new Error(`User with ID ${id} not found`);
    }
    const data = { ...updateUserDto };
    return this.prisma.user.update({
      where: { id },
      data,
      include: {
        presentations: {
          select: {
            id: true,
            title: true,
            agendaPosition: true,
            conferenceId: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const userExists = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!userExists) {
      throw new Error(`User with ID ${id} not found`);
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: `User with ID ${id} deleted.` };
  }

  // Zusätzliche Hilfsmethoden für die n:m-Beziehung
  async addPresentation(userId: number, presentationId: number) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        presentations: {
          connect: { id: presentationId },
        },
      },
      include: {
        presentations: {
          select: {
            id: true,
            title: true,
            agendaPosition: true,
            conferenceId: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async removePresentation(userId: number, presentationId: number) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        presentations: {
          disconnect: { id: presentationId },
        },
      },
      include: {
        presentations: {
          select: {
            id: true,
            title: true,
            agendaPosition: true,
            conferenceId: true,
            createdAt: true,
          },
        },
      },
    });
  }
}
