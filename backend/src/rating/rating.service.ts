import { Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RatingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRatingDto: CreateRatingDto) {
    return await this.prisma.rating.create({
      data: {
        ...createRatingDto,
      },
    });
  }

  async findAll() {
    return await this.prisma.rating.findMany({
      select: {
        id: true,
        rating: true,
        userId: true,
        presentationId: true,
      },
    });
  }

  async findOne(id: number) {
    const rating = await this.prisma.rating.findUnique({
      where: { id },
      select: {
        id: true,
        rating: true,
        userId: true,
        presentationId: true,
      },
    });

    if (!rating) {
      throw new Error(`Rating with ID ${id} not found`);
    }
    return rating;
  }

  async update(id: number, updateRatingDto: UpdateRatingDto) {
    const ratingExists = await this.prisma.rating.findUnique({
      where: { id },
    });
    if (!ratingExists) {
      throw new Error(`Rating with ID ${id} not found`);
    }
    const data = { ...updateRatingDto };

    return this.prisma.rating.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const ratingExists = await this.prisma.rating.findUnique({
      where: { id },
    });
    if (!ratingExists) {
      throw new Error(`Rating with ID ${id} not found`);
    }

    await this.prisma.rating.delete({ where: { id } });
    return { message: `Rating with ID ${id} deleted.` };
  }
}
