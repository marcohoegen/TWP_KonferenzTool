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
        contentsRating: true,
        styleRating: true,
        slidesRating: true,
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
        contentsRating: true,
        styleRating: true,
        slidesRating: true,
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

  // Helper method to calculate statistics

  private calculateStatistics(values: number[]) {
    if (values.length === 0) {
      return {
        average: 0,
        min: 0,
        max: 0,
        median: 0,
        histogram: {},
      };
    }

    const sortedValues = [...values].sort((a, b) => a - b);

    const histogram = sortedValues.reduce(
      (acc, v) => {
        acc[v] = (acc[v] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>,
    );

    const min = sortedValues[0];
    const max = sortedValues[sortedValues.length - 1];
    const sum = sortedValues.reduce((a, b) => a + b, 0);
    const average = Number((sum / sortedValues.length).toFixed(2));

    let median: number;
    const mid = Math.floor(sortedValues.length / 2);
    if (sortedValues.length % 2 === 0) {
      median = (sortedValues[mid - 1] + sortedValues[mid]) / 2;
    } else {
      median = sortedValues[mid];
    }

    return {
      average,
      min,
      max,
      median,
      histogram,
    };
  }

  // Method to get statistics for a presentation

  async getStatisticsForPresentation(
    presentationId: number,
    minRatings: number = 0,
  ) {
    const ratings = await this.prisma.rating.findMany({
      where: { presentationId },
      select: {
        contentsRating: true,
        styleRating: true,
        slidesRating: true,
      },
    });

    const count = ratings.length;

    if (count < minRatings) {
      return {
        presentationId,
        count,
        excluded: true,
        reason: `Not enough ratings (minimum required is ${minRatings})`,
      };
    }

    const contentsRatings = ratings.map((r) => r.contentsRating);
    const styleRatings = ratings.map((r) => r.styleRating);
    const slidesRatings = ratings.map((r) => r.slidesRating);

    return {
      presentationId,
      count,
      excluded: false,
      contentsRatingStats: this.calculateStatistics(contentsRatings),
      styleRatingStats: this.calculateStatistics(styleRatings),
      slidesRatingStats: this.calculateStatistics(slidesRatings),
    };
  }

  // Method to get overall ranking for all presentations (optionally filtered by conference)

  async getRankingForPresentations(
    minRatings: number = 1,
    conferenceId?: number,
  ) {
    const presentations = await this.prisma.presentation.findMany({
      where: conferenceId ? { conferenceId } : undefined,
      include: { ratings: true, presenters: true },
    });

    const ranking: Array<{
      presentationId: number;
      title: string;
      presenters: Array<{ id: number; name: string }>;
      numberOfRatings: number;
      overallAverage: number;
      overallMedian: number;
      overallMin: number;
      overallMax: number;
      contentsRatingStats: {
        average: number;
        min: number;
        max: number;
        median: number;
        histogram: Record<number, number>;
      };
      styleRatingStats: {
        average: number;
        min: number;
        max: number;
        median: number;
        histogram: Record<number, number>;
      };
      slidesRatingStats: {
        average: number;
        min: number;
        max: number;
        median: number;
        histogram: Record<number, number>;
      };
    }> = [];

    for (const p of presentations) {
      if (p.ratings.length < minRatings) {
        continue;
      }

      const contentsRatings = p.ratings.map((r) => r.contentsRating);
      const styleRatings = p.ratings.map((r) => r.styleRating);
      const slidesRatings = p.ratings.map((r) => r.slidesRating);

      const contentStats = this.calculateStatistics(contentsRatings);
      const styleStats = this.calculateStatistics(styleRatings);
      const slidesStats = this.calculateStatistics(slidesRatings);

      const overallAverage = Number(
        (
          (contentStats.average + styleStats.average + slidesStats.average) /
          3
        ).toFixed(2),
      );

      // Calculate true overall median from all ratings combined
      const allRatings = [...contentsRatings, ...styleRatings, ...slidesRatings];
      const sortedAllRatings = allRatings.sort((a, b) => a - b);
      let overallMedian: number;
      const midIndex = Math.floor(sortedAllRatings.length / 2);
      if (sortedAllRatings.length % 2 === 0) {
        overallMedian = (sortedAllRatings[midIndex - 1] + sortedAllRatings[midIndex]) / 2;
      } else {
        overallMedian = sortedAllRatings[midIndex];
      }
      overallMedian = Number(overallMedian.toFixed(2));

      // Calculate overall min and max
      const overallMin = Math.min(contentStats.min, styleStats.min, slidesStats.min);
      const overallMax = Math.max(contentStats.max, styleStats.max, slidesStats.max);

      ranking.push({
        presentationId: p.id,
        title: p.title,
        presenters: p.presenters.map((pr) => ({
          id: Number(pr.id),
          name: String(pr.email), // Needs to be changed when name field is added!
        })),
        numberOfRatings: p.ratings.length,
        overallAverage,
        overallMedian,
        overallMin,
        overallMax,
        contentsRatingStats: contentStats,
        styleRatingStats: styleStats,
        slidesRatingStats: slidesStats,
      });
    }

    ranking.sort((a, b) => b.overallAverage - a.overallAverage);

    return ranking;
  }
}
