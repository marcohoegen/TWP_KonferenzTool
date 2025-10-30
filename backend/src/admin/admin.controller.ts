import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminEntity } from './entities/admin.entity';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async create(@Body() createAdminDto: CreateAdminDto): Promise<AdminEntity> {
    const createdAdmin = await this.adminService.create(createAdminDto);

    return new AdminEntity({
      id: createdAdmin.id,
      name: createdAdmin.name,
      email: createdAdmin.email,
    });
  }

  @Get()
  async findAll(): Promise<AdminEntity[]> {
    const admins = await this.adminService.findAll();
    return admins.map(
      (admin) =>
        new AdminEntity({
          id: admin.id,
          name: admin.name,
          email: admin.email,
        }),
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<AdminEntity> {
    const admin = await this.adminService.findOne(id);
    return new AdminEntity(admin);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<AdminEntity> {
    const updatedAdmin = await this.adminService.update(id, updateAdminDto);
    return new AdminEntity({
      id: updatedAdmin.id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
    });
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.adminService.remove(id);
  }
}
