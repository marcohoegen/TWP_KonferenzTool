import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserService', () => {
  let service: UserService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Tests for create user

  describe('create()', () => {
    it('should create a user with presentations (normal case)', async () => {
      const dto: CreateUserDto = {
        email: 'testMail@email.com',
        code: '12345',
        conferenceId: 1,
      };
      const mockUser = {
        id: 1,
        email: 'testMail@email.com',
        code: '12345',
        conferenceId: 1,
        createdAt: new Date(),
        presentations: [
          {
            id: 1,
            title: 'Talk 1',
            agendaPosition: 1,
            conferenceId: 1,
            createdAt: new Date(),
          },
        ],
      };

      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.create(dto);

      expect(result).toEqual(mockUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: dto.email,
          conference: {
            connect: { id: dto.conferenceId },
          },
        },
        include: {
          presentations: {
            select: {
              id: true,
              title: true,
              agendaPosition: 1,
              conferenceId: true,
              createdAt: true,
            },
          },
        },
      });
    });

    it('should create a user without presentations (edge case)', async () => {
      const dto: CreateUserDto = {
        email: 'testMail@email.com',
        code: '12345',
        conferenceId: 1,
      };
      const mockUser = {
        id: 2,
        email: 'testMail@email.com',
        code: '12345',
        conferenceId: 1,
        createdAt: new Date(),
        presentations: [],
      };

      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.create(dto);

      expect(result).toEqual(mockUser);
    });

    it('should throw if prisma.create fails (error case)', async () => {
      const dto: CreateUserDto = {
        email: 'testMail@email.com',
        code: '12345',
        conferenceId: 1,
      };
      (prisma.user.create as jest.Mock).mockRejectedValue(
        new Error('DB error'),
      );

      await expect(service.create(dto)).rejects.toThrow('DB error');
    });
  });

  // Tests for find all users

  describe('findAll()', () => {
    it('should return all users with presentations (normal case)', async () => {
      const mockUsers = [
        {
          id: 1,
          email: 'Test@1.de',
          code: 'abc12',
          conferenceId: 1,
          createdAt: new Date(),
          presentations: [
            {
              id: 1,
              title: 'Talk 1',
              agendaPosition: 1,
              conferenceId: 1,
              createdAt: new Date(),
            },
          ],
        },
        {
          id: 2,
          email: 'Test@2.de',
          code: 'dfc13',
          conferenceId: 1,
          createdAt: new Date(),
          presentations: [],
        },
      ];
      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toEqual(mockUsers);
      expect(prisma.user.findMany).toHaveBeenCalled();
    });

    it('should return empty array if no users found (edge case)', async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('should throw if prisma.findMany fails (error case)', async () => {
      (prisma.user.findMany as jest.Mock).mockRejectedValue(
        new Error('DB connection error'),
      );

      await expect(service.findAll()).rejects.toThrow('DB connection error');
    });
  });

  // Tests for find one user

  describe('findOne()', () => {
    it('should return a user with presentations by id (normal case)', async () => {
      const mockUser = {
        id: 1,
        email: 'Test@1.de',
        code: 'abc12',
        conferenceId: 1,
        createdAt: new Date(),
        presentations: [
          {
            id: 1,
            title: 'Talk 1',
            agendaPosition: 1,
            conferenceId: 1,
            createdAt: new Date(),
          },
          {
            id: 2,
            title: 'Talk 2',
            agendaPosition: 2,
            conferenceId: 1,
            createdAt: new Date(),
          },
        ],
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(result).toEqual(mockUser);
    });

    it('should throw Error if user not found (edge case)', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null as any);

      await expect(service.findOne(99)).rejects.toThrow(
        new Error('User with ID 99 not found'),
      );
    });

    it('should throw if prisma.findUnique fails (error case)', async () => {
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(
        new Error('DB error'),
      );

      await expect(service.findOne(1)).rejects.toThrow('DB error');
    });
  });

  // Tests for update user

  describe('update()', () => {
    it('should update an existing user with presentations (normal case)', async () => {
      const id = 1;
      const updateDto = {
        email: 'testMail@email.com',
        code: '12345',
        conferenceId: 1,
      };
      const mockUpdatedUser = {
        id: 1,
        email: 'testMail@email.com',
        code: '12345',
        conferenceId: 1,
        createdAt: new Date(),
        presentations: [
          {
            id: 1,
            title: 'Talk 1',
            agendaPosition: 1,
            conferenceId: 1,
            createdAt: new Date(),
          },
        ],
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUpdatedUser);

      const result = await service.update(id, updateDto);

      expect(result).toEqual(mockUpdatedUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDto,
        include: {
          presentations: {
            select: {
              id: true,
              title: true,
              agendaPosition: true,
              conferenceId: true,
              createdAt: true,
            },
          },
        },
      });
    });

    it('should throw Error if user does not exist (edge case)', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null as any);

      await expect(service.update(99, {} as any)).rejects.toThrow(
        new Error('User with ID 99 not found'),
      );
    });

    it('should throw if prisma.update fails (error case)', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (prisma.user.update as jest.Mock).mockRejectedValue(
        new Error('DB error'),
      );

      await expect(service.update(1, {} as any)).rejects.toThrow('DB error');
    });
  });

  // Tests for remove user

  describe('remove()', () => {
    it('should delete a user (normal case)', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (prisma.user.delete as jest.Mock).mockResolvedValue({});

      const result = await service.remove(1);

      expect(result).toEqual({ message: 'User with ID 1 deleted.' });
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw Error if user not found (edge case)', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(
        new Error('User with ID 99 not found'),
      );
    });

    it('should throw if prisma.delete fails (error case)', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (prisma.user.delete as jest.Mock).mockRejectedValue(
        new Error('DB error'),
      );

      await expect(service.remove(1)).rejects.toThrow('DB error');
    });
  });

  // Tests for addPresentation

  describe('addPresentation()', () => {
    it('should add a presentation to a user (normal case)', async () => {
      const mockUpdatedUser = {
        id: 1,
        email: 'Test@1.de',
        code: 'abc12',
        conferenceId: 1,
        createdAt: new Date(),
        presentations: [
          {
            id: 1,
            title: 'Talk 1',
            agendaPosition: 1,
            conferenceId: 1,
            createdAt: new Date(),
          },
          {
            id: 2,
            title: 'Talk 2',
            agendaPosition: 2,
            conferenceId: 1,
            createdAt: new Date(),
          },
        ],
      };
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUpdatedUser);

      const result = await service.addPresentation(1, 2);

      expect(result).toEqual(mockUpdatedUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          presentations: {
            connect: { id: 2 },
          },
        },
        include: {
          presentations: {
            select: {
              id: true,
              title: true,
              agendaPosition: true,
              conferenceId: true,
              createdAt: true,
            },
          },
        },
      });
    });

    it('should handle error when adding presentation (error case)', async () => {
      (prisma.user.update as jest.Mock).mockRejectedValue(
        new Error('Presentation not found'),
      );

      await expect(service.addPresentation(1, 999)).rejects.toThrow(
        'Presentation not found',
      );
    });
  });

  // Tests for removePresentation

  describe('removePresentation()', () => {
    it('should remove a presentation from a user (normal case)', async () => {
      const mockUpdatedUser = {
        id: 1,
        email: 'Test@1.de',
        code: 'abc12',
        conferenceId: 1,
        createdAt: new Date(),
        presentations: [
          {
            id: 1,
            title: 'Talk 1',
            agendaPosition: 1,
            conferenceId: 1,
            createdAt: new Date(),
          },
        ],
      };
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUpdatedUser);

      const result = await service.removePresentation(1, 2);

      expect(result).toEqual(mockUpdatedUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          presentations: {
            disconnect: { id: 2 },
          },
        },
        include: {
          presentations: {
            select: {
              id: true,
              title: true,
              agendaPosition: true,
              conferenceId: true,
              createdAt: true,
            },
          },
        },
      });
    });

    it('should handle error when removing presentation (error case)', async () => {
      (prisma.user.update as jest.Mock).mockRejectedValue(
        new Error('Presentation not found'),
      );

      await expect(service.removePresentation(1, 999)).rejects.toThrow(
        'Presentation not found',
      );
    });
  });
});
