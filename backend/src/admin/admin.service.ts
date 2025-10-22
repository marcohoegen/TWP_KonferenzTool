import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.admin.findMany();
  }

  findOne(id: number) {
    return this.prisma.admin.findUnique({ where: { id } });
  }

  create(data: { name: string; email: string; password: string }) {
    return this.prisma.admin.create({ data });
  }

  update(id: number, data: { name?: string; email?: string; password?: string }) {
    return this.prisma.admin.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.admin.delete({ where: { id } });
  }
}
