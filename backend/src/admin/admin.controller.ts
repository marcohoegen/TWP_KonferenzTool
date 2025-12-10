import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Res,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import { AuthService } from 'src/auth/auth.service';
import { LoginAdminDto } from './dto/login-admin.dto';
import express from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    return (await this.authService.register(createAdminDto)) as Admin;
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginAdminDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const admin: Admin = {
      ...(await this.authService.validateUser(loginDto)),
      password: '',
    };

    const { access_token } = await this.authService.login(admin);

    res.cookie('jwt', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: express.Request) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie('jwt');
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Admin> {
    const admin = await this.adminService.findOne(id);
    return new Admin(admin);
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.adminService.remove(id);
  }
}
