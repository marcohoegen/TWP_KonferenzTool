import { Test, TestingModule } from '@nestjs/testing';
import { RatingService } from './rating.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

describe('RatingService', () => {
  let service: RatingService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrismaService = {
      rating: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<RatingService>(RatingService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Tests for create rating

  describe('create()', () => {
    it('should create an rating (normal case)', async () => {
      const dto: CreateRatingDto = {
        rating: 1,
        userId: 2,
        presentationId: 3,
      };
      const mockRating = { id: 1, ...dto };

      (prisma.rating.create as jest.Mock).mockResolvedValue(mockRating);

      const result = await service.create(dto);

      expect(result).toEqual(mockRating);
      expect(prisma.rating.create).toHaveBeenCalledWith({
        data: dto,
      });
    });

    it('should create an rating with minimal valid data (edge case)', async () => {
      const dto: CreateRatingDto = {
        rating: 1,
        userId: 2,
        presentationId: 3,
      };
      const mockRating = { id: 2, ...dto };

      (prisma.rating.create as jest.Mock).mockResolvedValue(mockRating);

      const result = await service.create(dto);

      expect(result).toEqual(mockRating);
    });

    it('should throw if prisma.create fails (error case)', async () => {
      const dto: CreateRatingDto = {
        rating: 1,
        userId: 2,
        presentationId: 3,
      };
      (prisma.rating.create as jest.Mock).mockRejectedValue(
        new Error('DB error'),
      );

      await expect(service.create(dto)).rejects.toThrow('DB error');
    });
  });

  // Tests for find all ratings

  describe('findAll()', () => {
    it('should return all ratings (normal case)', async () => {
      const mockRatings = [
        { id: 1, name: 'Torsten', email: 'torsten@test.com' },
        { id: 2, name: 'Anna', email: 'anna@test.com' },
      ];
      (prisma.rating.findMany as jest.Mock).mockResolvedValue(mockRatings);

      const result = await service.findAll();

      expect(result).toEqual(mockRatings);
      expect(prisma.rating.findMany).toHaveBeenCalled();
    });

    it('should return empty array if no ratings found (edge case)', async () => {
      (prisma.rating.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('should throw if prisma.findMany fails (error case)', async () => {
      (prisma.rating.findMany as jest.Mock).mockRejectedValue(
        new Error('DB connection error'),
      );

      await expect(service.findAll()).rejects.toThrow('DB connection error');
    });
  });

  // Tests for find one rating

  describe('findOne()', () => {
    it('should return an rating by id (normal case)', async () => {
      const mockRating = { id: 1, name: 'Torsten', email: 'torsten@test.com' };
      (prisma.rating.findUnique as jest.Mock).mockResolvedValue(mockRating);

      const result = await service.findOne(1);

      expect(result).toEqual(mockRating);
    });

    it('should throw NotFoundException if rating not found (edge case)', async () => {
      (prisma.rating.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(
        new Error('Rating with ID 99 not found'),
      );
    });

    it('should throw if prisma.findUnique fails (error case)', async () => {
      (prisma.rating.findUnique as jest.Mock).mockRejectedValue(
        new Error('DB error'),
      );

      await expect(service.findOne(1)).rejects.toThrow('DB error');
    });
  });

  // Tests for update rating

  describe('update()', () => {
    it('should update an existing rating (normal case)', async () => {
      const dto: UpdateRatingDto = { rating: 3 };
      const mockRating = { id: 1, name: 'Sven', email: 'a@b.c' };

      (prisma.rating.findUnique as jest.Mock).mockResolvedValue(mockRating);
      (prisma.rating.update as jest.Mock).mockResolvedValue(mockRating);

      const result = await service.update(1, dto);

      expect(result).toEqual(mockRating);
      expect(prisma.rating.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: dto,
      });
    });

    it('should throw NotFoundException if rating does not exist (edge case)', async () => {
      (prisma.rating.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update(99, { rating: 1 })).rejects.toThrow(
        new Error('Rating with ID 99 not found'),
      );
    });

    it('should throw if prisma.update fails (error case)', async () => {
      (prisma.rating.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (prisma.rating.update as jest.Mock).mockRejectedValue(
        new Error('DB error'),
      );

      await expect(service.update(1, { rating: 1 })).rejects.toThrow(
        'DB error',
      );
    });
  });

  // Tests for remove rating

  describe('remove()', () => {
    it('should delete an rating (normal case)', async () => {
      (prisma.rating.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (prisma.rating.delete as jest.Mock).mockResolvedValue({});

      const result = await service.remove(1);

      expect(result).toEqual({ message: 'Rating with ID 1 deleted.' });
      expect(prisma.rating.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if rating not found (edge case)', async () => {
      (prisma.rating.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(
        new Error('Rating with ID 99 not found'),
      );
    });

    it('should throw if prisma.delete fails (error case)', async () => {
      (prisma.rating.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (prisma.rating.delete as jest.Mock).mockRejectedValue(
        new Error('DB error'),
      );

      await expect(service.remove(1)).rejects.toThrow('DB error');
    });
  });
});
