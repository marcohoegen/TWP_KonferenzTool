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
    const createPresentation = await this.presentationService.create(
      createPresentationDto,
    );

    return new Presentation({
      id: createPresentation.id,
      title: createPresentation.title,
      agendaPosition: createPresentation.agendaPosition,
      conferenceId: createPresentation.conferenceId,
      userId: createPresentation.userId,
    });
  }

  @Get()
  async findAll(): Promise<Presentation[]> {
    const presentations = await this.presentationService.findAll();
    return presentations.map(
      (presentation) =>
        new Presentation({
          id: presentation.id,
          title: presentation.title,
          agendaPosition: presentation.agendaPosition,
          conferenceId: presentation.conferenceId,
          userId: presentation.userId,
        }),
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Presentation> {
    const presentation = await this.presentationService.findOne(id);
    return new Presentation(presentation);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePresentationDto: UpdatePresentationDto,
  ): Promise<Presentation> {
    const updatedPresentation = await this.presentationService.update(
      id,
      updatePresentationDto,
    );
    return new Presentation({
      id: updatedPresentation.id,
      title: updatedPresentation.title,
      agendaPosition: updatedPresentation.agendaPosition,
      conferenceId: updatedPresentation.conferenceId,
      userId: updatedPresentation.userId,
    });
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.presentationService.remove(id);
  }
}
