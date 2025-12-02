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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import express from 'express';
import { JwtAuthGuard, JwtUserAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtUserAuthGuard)
  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie('userjwt');
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('conference/:conferenceId')
  async findUsersByConferenceId(
    @Param('conferenceId', ParseIntPipe) conferenceId: number,
  ): Promise<User[]> {
    return (await this.userService.findUsersByConferenceId(conferenceId)).map(
      (user) => new User(user),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.userService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':userId/presentation/:presentationId')
  async addPresentation(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('presentationId', ParseIntPipe) presentationId: number,
  ) {
    return await this.userService.addPresentation(userId, presentationId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userId/presentation/:presentationId')
  async removePresentation(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('presentationId', ParseIntPipe) presentationId: number,
  ) {
    return await this.userService.removePresentation(userId, presentationId);
  }
}
