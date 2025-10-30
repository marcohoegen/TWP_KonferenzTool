import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAdminDto: CreateAdminDto) {
    return await this.prisma.admin.create({
      data: {
        ...createAdminDto,
      },
    });
  }

  async findAll() {
    return await this.prisma.admin.findMany({
      select: { id: true, name: true, email: true },
    });
  }

  async findOne(id: number) {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
    });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return admin;
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const adminExists = await this.prisma.admin.findUnique({ where: { id } });
    if (!adminExists) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    const data = { ...updateAdminDto };

    return this.prisma.admin.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const adminExists = await this.prisma.admin.findUnique({ where: { id } });
    if (!adminExists) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    await this.prisma.admin.delete({ where: { id } });
    return { message: `Admin with ID ${id} deleted` };
  }
}
