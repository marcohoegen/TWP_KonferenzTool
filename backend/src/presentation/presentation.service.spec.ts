import { Test, TestingModule } from '@nestjs/testing';
import { PresentationService } from './presentation.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { UpdatePresentationDto } from './dto/update-presentation.dto';

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
    it('should create a presentation with presenters (normal case)', async () => {
      const dto: CreatePresentationDto = {
        title: 'Keynote',
        agendaPosition: 1,
        conferenceId: 10,
        presenterIds: [5, 6],
      };
      const mockCreated = {
        id: 1,
        title: 'Keynote',
        agendaPosition: 1,
        conferenceId: 10,
        createdAt: new Date(),
        presenters: [
          {
            id: 5,
            email: 'user5@test.com',
            code: '12345',
            conferenceId: 10,
            createdAt: new Date(),
          },
          {
            id: 6,
            email: 'user6@test.com',
            code: '67890',
            conferenceId: 10,
            createdAt: new Date(),
          },
        ],
        ratings: [],
      };

      jest.spyOn(prisma.presentation, 'create').mockResolvedValue(mockCreated);

      const result = await service.create(dto);
      expect(result).toEqual(mockCreated);
      expect(prisma.presentation.create).toHaveBeenCalledWith({
        data: {
          title: 'Keynote',
          agendaPosition: 1,
          conferenceId: 10,
          presenters: {
            connect: [{ id: 5 }, { id: 6 }],
          },
        },
        include: {
          presenters: {
            select: {
              id: true,
              email: true,
              code: true,
              conferenceId: true,
              createdAt: true,
            },
          },
          ratings: true,
        },
      });
    });

    it('should create a presentation without presenters (edge case)', async () => {
      const dto: CreatePresentationDto = {
        title: 'A',
        agendaPosition: 0,
        conferenceId: 1,
      };
      const mockCreated = {
        id: 2,
        title: 'A',
        agendaPosition: 0,
        conferenceId: 1,
        createdAt: new Date(),
        presenters: [],
        ratings: [],
      };
      jest.spyOn(prisma.presentation, 'create').mockResolvedValue(mockCreated);

      const result = await service.create(dto);
      expect(result).toEqual(mockCreated);
    });

    it('should handle error during creation (error case)', async () => {
      const dto: CreatePresentationDto = {
        title: '',
        agendaPosition: -1,
        conferenceId: 1,
      };
      jest
        .spyOn(prisma.presentation, 'create')
        .mockRejectedValue(new Error('Invalid data'));

      await expect(service.create(dto)).rejects.toThrow('Invalid data');
    });
  });

  // ---------- FIND ALL ----------
  describe('findAll()', () => {
    it('should return all presentations with presenters (normal case)', async () => {
      const mockData = [
        {
          id: 1,
          title: 'Talk 1',
          agendaPosition: 1,
          conferenceId: 1,
          createdAt: new Date(),
          presenters: [
            {
              id: 1,
              email: 'user1@test.com',
              code: '12345',
              conferenceId: 1,
              createdAt: new Date(),
            },
          ],
          ratings: [],
        },
        {
          id: 2,
          title: 'Talk 2',
          agendaPosition: 2,
          conferenceId: 1,
          createdAt: new Date(),
          presenters: [
            {
              id: 2,
              email: 'user2@test.com',
              code: '67890',
              conferenceId: 1,
              createdAt: new Date(),
            },
          ],
          ratings: [],
        },
      ];
      jest.spyOn(prisma.presentation, 'findMany').mockResolvedValue(mockData);

      const result = await service.findAll();
      expect(result).toEqual(mockData);
      expect(prisma.presentation.findMany).toHaveBeenCalled();
    });

    it('should return empty list if no presentations (edge case)', async () => {
      jest.spyOn(prisma.presentation, 'findMany').mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });

    it('should handle prisma error (error case)', async () => {
      jest
        .spyOn(prisma.presentation, 'findMany')
        .mockRejectedValue(new Error('DB Error'));
      await expect(service.findAll()).rejects.toThrow('DB Error');
    });
  });

  // ---------- FIND ONE ----------
  describe('findOne()', () => {
    it('should return a presentation with presenters by id (normal case)', async () => {
      const mockPresentation = {
        id: 1,
        title: 'Keynote',
        agendaPosition: 1,
        conferenceId: 10,
        createdAt: new Date(),
        presenters: [
          {
            id: 5,
            email: 'user5@test.com',
            code: '12345',
            conferenceId: 10,
            createdAt: new Date(),
          },
        ],
        ratings: [],
      };
      jest
        .spyOn(prisma.presentation, 'findUnique')
        .mockResolvedValue(mockPresentation);

      const result = await service.findOne(1);
      expect(result).toEqual(mockPresentation);
    });

    it('should throw NotFoundException if presentation not found (edge case)', async () => {
      jest.spyOn(prisma.presentation, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });

    it('should handle prisma error (error case)', async () => {
      jest
        .spyOn(prisma.presentation, 'findUnique')
        .mockRejectedValue(new Error('DB Error'));
      await expect(service.findOne(1)).rejects.toThrow('DB Error');
    });
  });

  // ---------- UPDATE ----------
  describe('update()', () => {
    it('should update a presentation with new presenters (normal case)', async () => {
      const dto: UpdatePresentationDto = {
        title: 'Updated Title',
        presenterIds: [3, 4],
      };
      const mockExisting = {
        id: 1,
        title: 'Old',
        agendaPosition: 1,
        conferenceId: 10,
        createdAt: new Date(),
      };
      const mockUpdated = {
        id: 1,
        title: 'Updated Title',
        agendaPosition: 1,
        conferenceId: 10,
        createdAt: new Date(),
        presenters: [
          {
            id: 3,
            email: 'user3@test.com',
            code: '11111',
            conferenceId: 10,
            createdAt: new Date(),
          },
          {
            id: 4,
            email: 'user4@test.com',
            code: '22222',
            conferenceId: 10,
            createdAt: new Date(),
          },
        ],
        ratings: [],
      };

      jest
        .spyOn(prisma.presentation, 'findUnique')
        .mockResolvedValue(mockExisting as any);
      jest.spyOn(prisma.presentation, 'update').mockResolvedValue(mockUpdated);

      const result = await service.update(1, dto);
      expect(result).toEqual(mockUpdated);
      expect(prisma.presentation.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          title: 'Updated Title',
          presenters: {
            set: [{ id: 3 }, { id: 4 }],
          },
        },
        include: {
          presenters: {
            select: {
              id: true,
              email: true,
              code: true,
              conferenceId: true,
              createdAt: true,
            },
          },
          ratings: true,
        },
      });
    });

    it('should throw NotFoundException if presentation does not exist (edge case)', async () => {
      jest.spyOn(prisma.presentation, 'findUnique').mockResolvedValue(null);
      const dto: UpdatePresentationDto = { title: 'New Title' };

      await expect(service.update(99, dto)).rejects.toThrow(NotFoundException);
    });

    it('should handle prisma error during update (error case)', async () => {
      const dto: UpdatePresentationDto = { title: 'Error' };
      jest
        .spyOn(prisma.presentation, 'findUnique')
        .mockResolvedValue({ id: 1 } as any);
      jest
        .spyOn(prisma.presentation, 'update')
        .mockRejectedValue(new Error('Update failed'));

      await expect(service.update(1, dto)).rejects.toThrow('Update failed');
    });
  });

  // ---------- REMOVE ----------
  describe('remove()', () => {
    it('should delete a presentation (normal case)', async () => {
      const mockExisting = { id: 1 };
      jest
        .spyOn(prisma.presentation, 'findUnique')
        .mockResolvedValue(mockExisting as any);
      jest.spyOn(prisma.presentation, 'delete').mockResolvedValue(mockExisting);

      const result = await service.remove(1);
      expect(result).toEqual({ message: 'Presentation with ID 1 deleted' });
    });

    it('should throw NotFoundException if not found (edge case)', async () => {
      jest.spyOn(prisma.presentation, 'findUnique').mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });

    it('should handle prisma error during deletion (error case)', async () => {
      jest
        .spyOn(prisma.presentation, 'findUnique')
        .mockResolvedValue({ id: 1 });
      jest
        .spyOn(prisma.presentation, 'delete')
        .mockRejectedValue(new Error('DB Error'));

      await expect(service.remove(1)).rejects.toThrow('DB Error');
    });
  });

  // ---------- ADD PRESENTER ----------
  describe('addPresenter()', () => {
    it('should add a presenter to a presentation (normal case)', async () => {
      const mockUpdated = {
        id: 1,
        title: 'Keynote',
        agendaPosition: 1,
        conferenceId: 10,
        createdAt: new Date(),
        presenters: [
          {
            id: 5,
            email: 'user5@test.com',
            code: '12345',
            conferenceId: 10,
            createdAt: new Date(),
          },
          {
            id: 6,
            email: 'user6@test.com',
            code: '67890',
            conferenceId: 10,
            createdAt: new Date(),
          },
        ],
        ratings: [],
      };
      jest.spyOn(prisma.presentation, 'update').mockResolvedValue(mockUpdated);

      const result = await service.addPresenter(1, 6);

      expect(result).toEqual(mockUpdated);
      expect(prisma.presentation.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          presenters: {
            connect: { id: 6 },
          },
        },
        include: {
          presenters: {
            select: {
              id: true,
              email: true,
              code: true,
              conferenceId: true,
              createdAt: true,
            },
          },
          ratings: true,
        },
      });
    });

    it('should handle error when adding presenter (error case)', async () => {
      jest
        .spyOn(prisma.presentation, 'update')
        .mockRejectedValue(new Error('User not found'));

      await expect(service.addPresenter(1, 999)).rejects.toThrow(
        'User not found',
      );
    });
  });

  // ---------- REMOVE PRESENTER ----------
  describe('removePresenter()', () => {
    it('should remove a presenter from a presentation (normal case)', async () => {
      const mockUpdated = {
        id: 1,
        title: 'Keynote',
        agendaPosition: 1,
        conferenceId: 10,
        createdAt: new Date(),
        presenters: [
          {
            id: 5,
            email: 'user5@test.com',
            code: '12345',
            conferenceId: 10,
            createdAt: new Date(),
          },
        ],
        ratings: [],
      };
      jest.spyOn(prisma.presentation, 'update').mockResolvedValue(mockUpdated);

      const result = await service.removePresenter(1, 6);

      expect(result).toEqual(mockUpdated);
      expect(prisma.presentation.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          presenters: {
            disconnect: { id: 6 },
          },
        },
        include: {
          presenters: {
            select: {
              id: true,
              email: true,
              code: true,
              conferenceId: true,
              createdAt: true,
            },
          },
          ratings: true,
        },
      });
    });

    it('should handle error when removing presenter (error case)', async () => {
      jest
        .spyOn(prisma.presentation, 'update')
        .mockRejectedValue(new Error('User not found'));

      await expect(service.removePresenter(1, 999)).rejects.toThrow(
        'User not found',
      );
    });
  });
});
