import { Injectable } from '@nestjs/common';
import prisma from '../prisma/prisma';

@Injectable()
export class AdminService {
  findAll() {
    return prisma.admin.findMany();
  }

  findOne(id: number) {
    return prisma.admin.findUnique({ where: { id } });
  }

  create(data: { name: string; email: string; password: string }) {
    return prisma.admin.create({ data });
  }

  update(
    id: number,
    data: { name?: string; email?: string; password?: string },
  ) {
    return prisma.admin.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return prisma.admin.delete({ where: { id } });
  }
}
