import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  Res,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import express from 'express';
import { JwtAuthGuard, JwtUserAuthGuard } from 'src/auth/jwt-auth.guard';
import type { Multer } from 'multer';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const validated = await this.authService.validateUserCode(loginDto);
    const user = new User(validated);

    const { access_token } = await this.authService.loginUser(user);

    res.cookie('userjwt', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    return { success: true };
  }

  @UseGuards(JwtUserAuthGuard)
  @Get('me')
  me(@Req() req: express.Request) {
    return req.user;
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie('userjwt');
    return { success: true };
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('conference/:conferenceId')
  async findUsersByConferenceId(
    @Param('conferenceId', ParseIntPipe) conferenceId: number,
  ): Promise<User[]> {
    return (await this.userService.findUsersByConferenceId(conferenceId)).map(
      (user) => new User(user),
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  async updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body('conferenceComment') conferenceComment: string,
  ) {
    return await this.userService.updateComment(id, conferenceComment);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.userService.remove(id);
  }

  @Post(':userId/presentation/:presentationId')
  async addPresentation(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('presentationId', ParseIntPipe) presentationId: number,
  ) {
    return await this.userService.addPresentation(userId, presentationId);
  }

  @Delete(':userId/presentation/:presentationId')
  async removePresentation(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('presentationId', ParseIntPipe) presentationId: number,
  ) {
    return await this.userService.removePresentation(userId, presentationId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-csv/:conferenceId')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB limit
    }),
  )
  async uploadCsv(
    @Param('conferenceId', ParseIntPipe) conferenceId: number,
    @UploadedFile() file: Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (file.mimetype !== 'text/csv') {
      throw new BadRequestException(
        'Invalid file type. Please upload a CSV file',
      );
    }

    const csvContent = file.buffer.toString('utf-8');
    const lines = csvContent.split(/\r?\n/).filter((line) => line.trim());

    if (lines.length < 2) {
      throw new BadRequestException(
        'CSV file must have a header row and at least one data row',
      );
    }

    // Skip header row, parse remaining lines
    const users: CreateUserDto[] = lines.slice(1).map((line) => {
      const [name, email] = line.split(',').map((field) => field.trim());
      if (!name || !email) {
        throw new BadRequestException(
          `Invalid CSV format. Each row must have Name and Email: "${line}"`,
        );
      }
      return { name, email, conferenceId };
    });

    return await this.userService.createMany(users);
  }
}
