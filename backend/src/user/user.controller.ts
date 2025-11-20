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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOne(id);
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
}
