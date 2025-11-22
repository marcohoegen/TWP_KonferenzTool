import { Test, TestingModule } from '@nestjs/testing';
import { PresentationService } from './presentation.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { UpdatePresentationDto } from './dto/update-presentation.dto';
import { PresentationStatus } from '@prisma/client';

describe('PresentationService', () => {
  let service: PresentationService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const mockPrismaService = {
      presentation: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PresentationService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PresentationService>(PresentationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ---------- CREATE ----------
  describe('create()', () => {
    it('should create a presentation (normal case)', async () => {
      const dto: CreatePresentationDto = {
        title: 'Keynote',
        agendaPosition: 1,
        conferenceId: 10,
        userId: 5,
      };

      const mockCreated = {
        id: 1,
        ...dto,
        status: PresentationStatus.ACTIVE,
        ratings: [],
        createdAt: new Date(),
      };

      jest.spyOn(prisma.presentation, 'create').mockResolvedValue(mockCreated);

      const result = await service.create(dto);
      expect(result).toEqual(mockCreated);
      expect(prisma.presentation.create).toHaveBeenCalledWith({
        data: { ...dto },
      });
    });

    it('should handle prisma error (error case)', async () => {
      const dto: CreatePresentationDto = {
        title: 'Bad',
        agendaPosition: -1,
        conferenceId: 1,
        userId: 1,
      };

      jest
        .spyOn(prisma.presentation, 'create')
        .mockRejectedValue(new Error('Invalid data'));

      await expect(service.create(dto)).rejects.toThrow('Invalid data');
    });
  });

  // ---------- FIND ALL ----------
  describe('findAll()', () => {
    it('should return all presentations', async () => {
      const mockList = [
        {
          id: 1,
          title: 'Talk 1',
          agendaPosition: 1,
          conferenceId: 1,
          userId: 1,
          status: PresentationStatus.ACTIVE,
          ratings: [],
          createdAt: new Date(),
        },
        {
          id: 2,
          title: 'Talk 2',
          agendaPosition: 2,
          conferenceId: 1,
          userId: 2,
          status: PresentationStatus.INACTIVE,
          ratings: [],
          createdAt: new Date(),
        },
      ];

      jest.spyOn(prisma.presentation, 'findMany').mockResolvedValue(mockList);

      const result = await service.findAll();
      expect(result).toEqual(mockList);
    });

    it('should return empty array on no results', async () => {
      jest.spyOn(prisma.presentation, 'findMany').mockResolvedValue([]);

      const result = await service.findAll();
      expect(result).toEqual([]);
    });

    it('should handle prisma errors', async () => {
      jest
        .spyOn(prisma.presentation, 'findMany')
        .mockRejectedValue(new Error('DB Error'));

      await expect(service.findAll()).rejects.toThrow('DB Error');
    });
  });

  // ---------- FIND ONE ----------
  describe('findOne()', () => {
    it('should return one presentation', async () => {
      const mockPres = {
        id: 1,
        title: 'Keynote',
        agendaPosition: 1,
        conferenceId: 10,
        userId: 5,
        status: PresentationStatus.ACTIVE,
        ratings: [],
        createdAt: new Date(),
      };

      jest.spyOn(prisma.presentation, 'findUnique').mockResolvedValue(mockPres);

      const result = await service.findOne(1);
      expect(result).toEqual(mockPres);
    });

    it('should throw NotFoundException if not found', async () => {
      jest.spyOn(prisma.presentation, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(123)).rejects.toThrow(NotFoundException);
    });

    it('should handle prisma error', async () => {
      jest
        .spyOn(prisma.presentation, 'findUnique')
        .mockRejectedValue(new Error('DB Error'));

      await expect(service.findOne(1)).rejects.toThrow('DB Error');
    });
  });

  // ---------- UPDATE ----------
  describe('update()', () => {
    it('should update a presentation', async () => {
      const dto: UpdatePresentationDto = { title: 'Updated Title' };

      const existing = {
        id: 1,
        title: 'Old',
        agendaPosition: 1,
        conferenceId: 10,
        userId: 5,
        status: PresentationStatus.ACTIVE,
        createdAt: new Date(),
        ratings: [],
      };

      const updated = {
        ...existing,
        ...dto,
      };

      jest.spyOn(prisma.presentation, 'findUnique').mockResolvedValue(existing);
      jest.spyOn(prisma.presentation, 'update').mockResolvedValue(updated);

      const result = await service.update(1, dto);
      expect(result).toEqual(updated);
    });

    it('should throw NotFound if not found', async () => {
      jest.spyOn(prisma.presentation, 'findUnique').mockResolvedValue(null);

      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });

    it('should handle prisma error', async () => {
      jest
        .spyOn(prisma.presentation, 'findUnique')
        .mockResolvedValue({ id: 1 });

      jest
        .spyOn(prisma.presentation, 'update')
        .mockRejectedValue(new Error('Update failed'));

      await expect(service.update(1, {})).rejects.toThrow('Update failed');
    });
  });

  // ---------- REMOVE ----------
  describe('remove()', () => {
    it('should delete a presentation', async () => {
      const mockExisting = {
        id: 1,
        title: 'Test',
        agendaPosition: 1,
        conferenceId: 1,
        userId: 1,
        status: PresentationStatus.ACTIVE,
        ratings: [],
        createdAt: new Date(),
      };

      jest
        .spyOn(prisma.presentation, 'findUnique')
        .mockResolvedValue(mockExisting);

      jest.spyOn(prisma.presentation, 'delete').mockResolvedValue(mockExisting);

      const result = await service.remove(1);
      expect(result).toEqual({ message: 'Presentation with ID 1 deleted' });
    });

    it('should throw if not found', async () => {
      jest.spyOn(prisma.presentation, 'findUnique').mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });

    it('should handle prisma delete errors', async () => {
      jest
        .spyOn(prisma.presentation, 'findUnique')
        .mockResolvedValue({ id: 1 });

      jest
        .spyOn(prisma.presentation, 'delete')
        .mockRejectedValue(new Error('DB Error'));

      await expect(service.remove(1)).rejects.toThrow('DB Error');
    });
  });
});