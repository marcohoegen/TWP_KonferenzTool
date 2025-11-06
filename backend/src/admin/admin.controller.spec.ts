import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Admin } from './entities/admin.entity';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  beforeEach(async () => {
    const mockAdminService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new admin (normal case)', async () => {
    const dto: CreateAdminDto = {
      name: 'Torsten',
      email: 'torsten@test.com',
      password: 'PW1234',
    };
    const mockCreatedAdmin = { id: 1, ...dto };
    jest.spyOn(service, 'create').mockResolvedValue(mockCreatedAdmin);

    const result = await controller.create(dto);

    expect(result).toEqual(new Admin({ ...dto, password: 'PW1234' }));
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should create a new admin (edge case with minimal valid data)', async () => {
    const dto: CreateAdminDto = {
      name: 'Torsten',
      email: 'a@b.c',
      password: 'PW1234',
    };
    const mockCreatedAdmin = new Admin({ id: 2, ...dto });
    jest.spyOn(service, 'create').mockResolvedValue(mockCreatedAdmin);

    const result = await controller.create(dto);

    expect(result).toEqual(mockCreatedAdmin);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should handle error when creating a new admin (error case)', async () => {
    const dto: CreateAdminDto = {
      name: 'Torsten',
      email: '@@test.com',
      password: 'PW1234',
    };
    const errorMessage = 'Invalid email format';
    jest.spyOn(service, 'create').mockRejectedValue(new Error(errorMessage));

    await expect(controller.create(dto)).rejects.toThrow(errorMessage);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  //Tests for findAll()

  describe('findAll()', () => {
    it('should return a list of admins (normal case)', async () => {
      const mockAdmins = [
        new Admin({
          id: 1,
          name: 'Torsten',
          email: 'torsten@test.com',
          password: 'PW1234',
        }),
        new Admin({
          id: 2,
          name: 'Anna',
          email: 'anna@test.com',
          password: 'PW12345',
        }),
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockAdmins);

      const result = await controller.findAll();

      expect(result).toEqual([
        new Admin({ id: 1, name: 'Torsten', email: 'torsten@test.com' }),
        new Admin({ id: 2, name: 'Anna', email: 'anna@test.com' }),
      ]);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return an empty array when there are no admins (edge case)', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should handle errors from the service (error case)', async () => {
      const errorMessage = 'Database connection failed';
      jest.spyOn(service, 'findAll').mockRejectedValue(new Error(errorMessage));

      await expect(controller.findAll()).rejects.toThrow(errorMessage);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  //Tests for findOne()

  describe('findOne()', () => {
    it('should return one admin by id (normal case)', async () => {
      const mockAdmin = {
        id: 1,
        name: 'Torsten',
        email: 'torsten@test.com',
        password: 'PW1234',
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockAdmin);

      const result = await controller.findOne(1);

      expect(result).toEqual(
        new Admin({ id: 1, name: 'Torsten', email: 'torsten@test.com' }),
      );
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should handle case where admin is not found (edge case)', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null as any);

      const result = await controller.findOne(999);

      // Der Controller macht new Admin(null), daher prüfen wir das Ergebnis
      expect(result).toEqual(new Admin(null as any));
      expect(service.findOne).toHaveBeenCalledWith(999);
    });

    it('should handle service errors (error case)', async () => {
      const errorMessage = 'Service error';
      jest.spyOn(service, 'findOne').mockRejectedValue(new Error(errorMessage));

      await expect(controller.findOne(1)).rejects.toThrow(errorMessage);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  //Tests for update()

  describe('update()', () => {
    it('should update an admin successfully (normal case)', async () => {
      const id = 1;
      const updateDto = {
        name: 'Torsten Updated',
        email: 'torsten.new@test.com',
        password: 'NewPW1233',
      };
      const mockUpdatedAdmin = new Admin({
        id,
        name: updateDto.name,
        email: updateDto.email,
      });

      jest.spyOn(service, 'update').mockResolvedValue(mockUpdatedAdmin);

      const result = await controller.update(id, updateDto);

      expect(result).toEqual(mockUpdatedAdmin);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });

    it('should handle partial update (edge case)', async () => {
      const id = 2;
      const updateDto = { name: 'OnlyNameChanged' }; // minimal gültiges DTO
      const mockUpdatedAdmin = new Admin({
        id,
        name: 'OnlyNameChanged',
        email: 'old@mail.com',
      });

      jest.spyOn(service, 'update').mockResolvedValue(mockUpdatedAdmin);

      const result = await controller.update(id, updateDto);

      expect(result).toEqual(mockUpdatedAdmin);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });

    it('should handle error when updating admin (error case)', async () => {
      const id = 3;
      const updateDto = { email: 'invalid-email' };
      const errorMessage = 'Invalid email format';

      jest.spyOn(service, 'update').mockRejectedValue(new Error(errorMessage));

      await expect(controller.update(id, updateDto)).rejects.toThrow(
        errorMessage,
      );
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });
  });

  //Tests for remove()

  describe('remove()', () => {
    it('should remove an admin successfully (normal case)', async () => {
      const id = 1;
      const mockResponse = { message: 'Admin removed successfully' };

      jest.spyOn(service, 'remove').mockResolvedValue(mockResponse);

      const result = await controller.remove(id);

      expect(result).toEqual(mockResponse);
      expect(service.remove).toHaveBeenCalledWith(id);
    });

    it('should return a message when trying to remove a non-existing admin (edge case)', async () => {
      const id = 999;
      const mockResponse = { message: 'Admin not found, nothing deleted' };

      jest.spyOn(service, 'remove').mockResolvedValue(mockResponse);

      const result = await controller.remove(id);

      expect(result).toEqual(mockResponse);
      expect(service.remove).toHaveBeenCalledWith(id);
    });

    it('should handle error when removing an admin (error case)', async () => {
      const id = 2;
      const errorMessage = 'Database connection error';

      jest.spyOn(service, 'remove').mockRejectedValue(new Error(errorMessage));

      await expect(controller.remove(id)).rejects.toThrow(errorMessage);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
