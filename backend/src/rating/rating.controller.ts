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
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Rating } from './entities/rating.entity';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  async create(@Body() createRatingDto: CreateRatingDto): Promise<Rating> {
    const createRating = await this.ratingService.create(createRatingDto);

    return new Rating({
      id: createRating.id,
      contentsRating: createRating.contentsRating,
      styleRating: createRating.styleRating,
      slidesRating: createRating.slidesRating,
      userId: createRating.userId,
      presentationId: createRating.presentationId,
    });
  }

  @Get()
  async findAll(): Promise<Rating[]> {
    const ratings = await this.ratingService.findAll();
    return ratings.map(
      (rating) =>
        new Rating({
          id: rating.id,
          contentsRating: rating.contentsRating,
          styleRating: rating.styleRating,
          slidesRating: rating.slidesRating,
          userId: rating.userId,
          presentationId: rating.presentationId,
        }),
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Rating> {
    const rating = await this.ratingService.findOne(id);
    return new Rating(rating);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRatingDto: UpdateRatingDto,
  ): Promise<Rating> {
    const updatedRating = await this.ratingService.update(id, updateRatingDto);
    return new Rating({
      id: updatedRating.id,
      contentsRating: updatedRating.contentsRating,
      styleRating: updatedRating.styleRating,
      slidesRating: updatedRating.slidesRating,
      userId: updatedRating.userId,
      presentationId: updatedRating.presentationId,
    });
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.ratingService.remove(id);
  }
}
