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
import { PresentationService } from './presentation.service';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { UpdatePresentationDto } from './dto/update-presentation.dto';
import { Presentation } from './entities/presentation.entity';

@Controller('presentation')
export class PresentationController {
  constructor(private readonly presentationService: PresentationService) {}

  @Post()
  async create(
    @Body() createPresentationDto: CreatePresentationDto,
  ): Promise<Presentation> {
    return await this.presentationService.create(createPresentationDto);
  }

  @Get()
  async findAll() {
    return await this.presentationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.presentationService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePresentationDto: UpdatePresentationDto,
  ) {
    return await this.presentationService.update(id, updatePresentationDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.presentationService.remove(id);
  }

  @Post(':presentationId/presenter/:userId')
  async addPresenter(
    @Param('presentationId', ParseIntPipe) presentationId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return await this.presentationService.addPresenter(presentationId, userId);
  }

  @Delete(':presentationId/presenter/:userId')
  async removePresenter(
    @Param('presentationId', ParseIntPipe) presentationId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return await this.presentationService.removePresenter(
      presentationId,
      userId,
    );
  }
}
