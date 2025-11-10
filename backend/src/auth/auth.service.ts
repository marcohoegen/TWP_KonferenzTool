import { Injectable } from '@nestjs/common';
import { AdminService } from '../admin/admin.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import { LoginAdminDto } from 'src/admin/dto/login-admin.dto';
import { Admin } from 'src/admin/entities/admin.entity';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  async register(createAdminDto: CreateAdminDto) {
    const existing = await this.adminService.findByEmail(createAdminDto.email);
    if (existing) {
      throw new Error('Email already in use');
    }

    const admin = await this.adminService.create(createAdminDto);
    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
    };
  }

  async validateUser(loginDto: LoginAdminDto) {
    const admin = await this.adminService.findByEmail(loginDto.email);
    if (!admin) {
      throw new Error('Invalid credentials');
    }

    const match = await bcrypt.compare(loginDto.password, admin.password);
    if (!match) {
      throw new Error('Invalid credentials');
    }

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    };
  }

  async login(admin: Admin) {
    const payload = { sub: admin.id, email: admin.email, name: admin.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
