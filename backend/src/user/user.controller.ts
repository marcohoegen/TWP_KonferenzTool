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
import { JwtUserAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const createUser = await this.userService.create(createUserDto);

    return new User({
      id: createUser.id,
      email: createUser.email,
      code: createUser.code,
      conferenceId: createUser.conferenceId,
    });
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
  async findAll(): Promise<User[]> {
    const users = await this.userService.findAll();
    return users.map(
      (user) =>
        new User({
          id: user.id,
          email: user.email,
          code: user.code,
          conferenceId: user.conferenceId,
        }),
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.userService.findOne(id);
    return new User(user);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.userService.update(id, updateUserDto);
    return new User({
      id: updatedUser.id,
      email: updatedUser.email,
      code: updatedUser.code,
      conferenceId: updatedUser.conferenceId,
    });
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.userService.remove(id);
  }
}
