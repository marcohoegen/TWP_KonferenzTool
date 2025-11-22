import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAdminDto: CreateAdminDto) {
    const hashed = await bcrypt.hash(createAdminDto.password, 10);
    return await this.prisma.admin.create({
      data: {
        ...createAdminDto,
        password: hashed,
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

    const hashed = await bcrypt.hash(updateAdminDto.password as string, 10);

    return this.prisma.admin.update({
      where: { id },
      data: { ...updateAdminDto, password: hashed },
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

  async findByEmail(email: string) {
    return await this.prisma.admin.findUnique({ where: { email } });
  }
}
