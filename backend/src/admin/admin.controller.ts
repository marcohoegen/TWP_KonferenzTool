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
import { Admin } from './entities/admin.entity';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async create(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    const createdAdmin = await this.adminService.create(createAdminDto);

    return new Admin({
      id: createdAdmin.id,
      name: createdAdmin.name,
      email: createdAdmin.email,
    });
  }

  @Get()
  async findAll(): Promise<Admin[]> {
    const admins = await this.adminService.findAll();
    return admins.map(
      (admin) =>
        new Admin({
          id: admin.id,
          name: admin.name,
          email: admin.email,
        }),
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Admin> {
    const admin = await this.adminService.findOne(id);
    return new Admin(admin);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<Admin> {
    const updatedAdmin = await this.adminService.update(id, updateAdminDto);
    return new Admin({
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
