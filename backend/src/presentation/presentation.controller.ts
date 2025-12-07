import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PresentationService } from './presentation.service';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { UpdatePresentationDto } from './dto/update-presentation.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Presentation } from './entities/presentation.entity';
import { JwtAuthGuard, JwtEitherAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('presentation')
export class PresentationController {
  constructor(private readonly presentationService: PresentationService) {}

  @UseGuards(JwtAuthGuard)
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
      status: createPresentation.status,
    });
  }

  @UseGuards(JwtEitherAuthGuard)
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
          status: presentation.status,
        }),
    );
  }

  @UseGuards(JwtEitherAuthGuard)
  @Get('conference/:conferenceId')
  async findPresentationsByConferenceId(
    @Param('conferenceId', ParseIntPipe) conferenceId: number,
  ): Promise<Presentation[]> {
    return (
      await this.presentationService.findPresentationsByConferenceId(
        conferenceId,
      )
    ).map(
      (presentation) =>
        new Presentation({
          id: presentation.id,
          title: presentation.title,
          agendaPosition: presentation.agendaPosition,
          presenters: presentation.presenters ?? [],
          conferenceId: presentation.conferenceId,
          status: presentation.status,
        }),
    );
  }

  @UseGuards(JwtEitherAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.presentationService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
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
      status: updatedPresentation.status,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('status/:id')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<Presentation> {
    const updatedPresentation = await this.presentationService.updateStatus(
      id,
      updateStatusDto.status,
    );
    return new Presentation({
      id: updatedPresentation.id,
      title: updatedPresentation.title,
      agendaPosition: updatedPresentation.agendaPosition,
      conferenceId: updatedPresentation.conferenceId,
      status: updatedPresentation.status,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.presentationService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':presentationId/presenter/:userId')
  async addPresenter(
    @Param('presentationId', ParseIntPipe) presentationId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return await this.presentationService.addPresenter(presentationId, userId);
  }

  @UseGuards(JwtAuthGuard)
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
