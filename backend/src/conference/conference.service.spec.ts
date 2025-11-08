import { Test, TestingModule } from '@nestjs/testing';
import { ConferenceService } from './conference.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateConferenceDto } from './dto/create-conference.dto';
import { UpdateConferenceDto } from './dto/update-conference.dto';

describe('ConferenceService', () => {
  let service: ConferenceService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrismaService = {
      conference: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConferenceService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ConferenceService>(ConferenceService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ---------- CREATE ----------

  describe('create()', () => {
    it('should create a new conference (normal case)', async () => {
      const dto: CreateConferenceDto = {
        name: 'NestJS Conf',
        location: 'Berlin',
        startDate: new Date('2025-05-10'),
        endDate: new Date('2025-05-12'),
      };
      const mockConference = { id: 1, ...dto };
      prisma.conference.create.mockResolvedValue(mockConference);

      const result = await service.create(dto);

      expect(result).toEqual(mockConference);
      expect(prisma.conference.create).toHaveBeenCalledWith({ data: dto });
    });

    it('should create a conference with minimal valid data (edge case)', async () => {
      const dto: CreateConferenceDto = {
        name: 'A',
        location: 'X',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-02'),
      };
      const mockConference = { id: 2, ...dto };
      prisma.conference.create.mockResolvedValue(mockConference);

      const result = await service.create(dto);

      expect(result).toEqual(mockConference);
    });

    it('should throw error when create fails (negative case)', async () => {
      const dto: CreateConferenceDto = {
        name: '',
        location: 'Nowhere',
        startDate: new Date(),
        endDate: new Date(),
      };
      prisma.conference.create.mockRejectedValue(new Error('Invalid data'));

      await expect(service.create(dto)).rejects.toThrow('Invalid data');
    });
  });

  // ---------- FIND ALL ----------

  describe('findAll()', () => {
    it('should return all conferences (normal case)', async () => {
      const mockConferences = [
        {
          id: 1,
          name: 'Conf A',
          location: 'Berlin',
          startDate: new Date(),
          endDate: new Date(),
        },
        {
          id: 2,
          name: 'Conf B',
          location: 'Paris',
          startDate: new Date(),
          endDate: new Date(),
        },
      ];
      prisma.conference.findMany.mockResolvedValue(mockConferences);

      const result = await service.findAll();

      expect(result).toEqual(mockConferences);
      expect(prisma.conference.findMany).toHaveBeenCalled();
    });

    it('should return empty array if no conferences exist (edge case)', async () => {
      prisma.conference.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('should handle error from prisma (negative case)', async () => {
      prisma.conference.findMany.mockRejectedValue(new Error('DB Error'));

      await expect(service.findAll()).rejects.toThrow('DB Error');
    });
  });
  // ---------- FIND ONE ----------

  describe('findOne()', () => {
    it('should return a conference by id (normal case)', async () => {
      const mockConference = {
        id: 1,
        name: 'Conf X',
        location: 'Rome',
        startDate: new Date(),
        endDate: new Date(),
      };
      prisma.conference.findUnique.mockResolvedValue(mockConference);

      const result = await service.findOne(1);

      expect(result).toEqual(mockConference);
    });

    it('should throw NotFoundException if conference not found (negative case)', async () => {
      prisma.conference.findUnique.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });

    it('should return a minimal valid conference (edge case)', async () => {
      const mockConference = {
        id: 2,
        name: 'C',
        location: 'D',
        startDate: new Date(),
        endDate: new Date(),
      };
      prisma.conference.findUnique.mockResolvedValue(mockConference);

      const result = await service.findOne(2);

      expect(result).toEqual(mockConference);
    });
  });

  // ---------- UPDATE ----------

  describe('update()', () => {
    it('should update an existing conference (normal case)', async () => {
      const dto: UpdateConferenceDto = { name: 'Updated Conf' };
      const mockConference = {
        id: 1,
        ...dto,
        location: 'Berlin',
        startDate: new Date(),
        endDate: new Date(),
      };

      prisma.conference.findUnique.mockResolvedValue(mockConference);
      prisma.conference.update.mockResolvedValue(mockConference);

      const result = await service.update(1, dto);

      expect(result).toEqual(mockConference);
      expect(prisma.conference.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: dto,
      });
    });

    it('should throw NotFoundException when updating non-existing conference', async () => {
      prisma.conference.findUnique.mockResolvedValue(null);

      await expect(service.update(99, { name: 'New' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle partial update (edge case)', async () => {
      const dto: UpdateConferenceDto = { location: 'Online' };
      const mockConference = {
        id: 2,
        name: 'EdgeConf',
        location: 'Online',
        startDate: new Date(),
        endDate: new Date(),
      };

      prisma.conference.findUnique.mockResolvedValue(mockConference);
      prisma.conference.update.mockResolvedValue(mockConference);

      const result = await service.update(2, dto);
      expect(result.location).toBe('Online');
    });
  });

  // ---------- REMOVE ----------

  describe('remove()', () => {
    it('should remove an existing conference (normal case)', async () => {
      const mockConference = { id: 1 };
      prisma.conference.findUnique.mockResolvedValue(mockConference);
      prisma.conference.delete.mockResolvedValue(undefined);

      const result = await service.remove(1);

      expect(result).toEqual({ message: 'Conference with ID 1 deleted' });
      expect(prisma.conference.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if conference not found (negative case)', async () => {
      prisma.conference.findUnique.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });

    it('should handle deletion of last conference (edge case)', async () => {
      const mockConference = { id: 10 };
      prisma.conference.findUnique.mockResolvedValue(mockConference);
      prisma.conference.delete.mockResolvedValue(undefined);

      const result = await service.remove(10);
      expect(result.message).toContain('deleted');
    });
  });
});
