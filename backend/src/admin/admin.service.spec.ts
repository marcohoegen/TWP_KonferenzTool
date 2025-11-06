import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

describe('AdminService', () => {
  let service: AdminService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrismaService = {
      admin: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Tests for create admin

  describe('create()', () => {
    it('should create an admin (normal case)', async () => {
      const dto: CreateAdminDto = {
        name: 'Torsten',
        email: 'torsten@test.com',
        password: 'PW1234',
      };
      const mockAdmin = { id: 1, ...dto };

      prisma.admin.create.mockResolvedValue(mockAdmin);

      const result = await service.create(dto);

      expect(result).toEqual(mockAdmin);
      expect(prisma.admin.create).toHaveBeenCalledWith({ data: dto });
    });

    it('should create an admin with minimal valid data (edge case)', async () => {
      const dto: CreateAdminDto = {
        name: 'A',
        email: 'a@b.c',
        password: '123456',
      };
      const mockAdmin = { id: 2, ...dto };

      prisma.admin.create.mockResolvedValue(mockAdmin);

      const result = await service.create(dto);

      expect(result).toEqual(mockAdmin);
    });

    it('should throw if prisma.create fails (error case)', async () => {
      const dto: CreateAdminDto = {
        name: 'X',
        email: 'x@test.com',
        password: '123456',
      };
      prisma.admin.create.mockRejectedValue(new Error('DB error'));

      await expect(service.create(dto)).rejects.toThrow('DB error');
    });
  });

  // Tests for find all admins

  describe('findAll()', () => {
    it('should return all admins (normal case)', async () => {
      const mockAdmins = [
        { id: 1, name: 'Torsten', email: 'torsten@test.com' },
        { id: 2, name: 'Anna', email: 'anna@test.com' },
      ];
      prisma.admin.findMany.mockResolvedValue(mockAdmins);

      const result = await service.findAll();

      expect(result).toEqual(mockAdmins);
      expect(prisma.admin.findMany).toHaveBeenCalled();
    });

    it('should return empty array if no admins found (edge case)', async () => {
      prisma.admin.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('should throw if prisma.findMany fails (error case)', async () => {
      prisma.admin.findMany.mockRejectedValue(new Error('DB connection error'));

      await expect(service.findAll()).rejects.toThrow('DB connection error');
    });
  });

  // Tests for find one admin

  describe('findOne()', () => {
    it('should return an admin by id (normal case)', async () => {
      const mockAdmin = { id: 1, name: 'Torsten', email: 'torsten@test.com' };
      prisma.admin.findUnique.mockResolvedValue(mockAdmin);

      const result = await service.findOne(1);

      expect(result).toEqual(mockAdmin);
    });

    it('should throw NotFoundException if admin not found (edge case)', async () => {
      prisma.admin.findUnique.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });

    it('should throw if prisma.findUnique fails (error case)', async () => {
      prisma.admin.findUnique.mockRejectedValue(new Error('DB error'));

      await expect(service.findOne(1)).rejects.toThrow('DB error');
    });
  });

  // Tests for update admin

  describe('update()', () => {
    it('should update an existing admin (normal case)', async () => {
      const dto: UpdateAdminDto = { name: 'Updated' };
      const mockAdmin = { id: 1, name: 'Sven', email: 'a@b.c' };

      prisma.admin.findUnique.mockResolvedValue(mockAdmin);
      prisma.admin.update.mockResolvedValue(mockAdmin);

      const result = await service.update(1, dto);

      expect(result).toEqual(mockAdmin);
      expect(prisma.admin.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: dto,
      });
    });

    it('should throw NotFoundException if admin does not exist (edge case)', async () => {
      prisma.admin.findUnique.mockResolvedValue(null);

      await expect(service.update(99, { name: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw if prisma.update fails (error case)', async () => {
      prisma.admin.findUnique.mockResolvedValue({ id: 1 });
      prisma.admin.update.mockRejectedValue(new Error('DB error'));

      await expect(service.update(1, { name: 'X' })).rejects.toThrow(
        'DB error',
      );
    });
  });

  // Tests for remove admin

  describe('remove()', () => {
    it('should delete an admin (normal case)', async () => {
      prisma.admin.findUnique.mockResolvedValue({ id: 1 });
      prisma.admin.delete.mockResolvedValue({});

      const result = await service.remove(1);

      expect(result).toEqual({ message: 'Admin with ID 1 deleted' });
      expect(prisma.admin.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if admin not found (edge case)', async () => {
      prisma.admin.findUnique.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });

    it('should throw if prisma.delete fails (error case)', async () => {
      prisma.admin.findUnique.mockResolvedValue({ id: 1 });
      prisma.admin.delete.mockRejectedValue(new Error('DB error'));

      await expect(service.remove(1)).rejects.toThrow('DB error');
    });
  });
});
