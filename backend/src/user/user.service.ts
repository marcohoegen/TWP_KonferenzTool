import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // Generates a random alphanumeric code of specified length
  private generatePersonCode(length = 5): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join('');
  }

  async create(createUserDto: CreateUserDto) {
    let personCode: string = '';
    let isUnique = false;

    // Ensure the generated code is unique
    while (!isUnique) {
      personCode = this.generatePersonCode();
      const existingUser = await this.prisma.user.findUnique({
        where: { code: personCode },
      });
      if (!existingUser) {
        isUnique = true;
      }
    }

    const data = {
      ...createUserDto,
      code: personCode,
    };

    return await this.prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        code: true,
        conferenceId: true,
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
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, code: true, conferenceId: true },
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
}
