import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const mockUserService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new user (normal case)', async () => {
    const dto: CreateUserDto = {
      email: 'testMail@email.com',
      code: '12345',
      conferenceId: 1,
    };
    const mockCreatedUser = new User({ id: 1, ...dto });
    jest.spyOn(service, 'create').mockResolvedValue(mockCreatedUser);

    const result = await controller.create(dto);

    expect(result).toEqual(mockCreatedUser);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should create a new user (edge case with minimal valid data)', async () => {
    const dto: CreateUserDto = {
      email: 'testMail2@email.com',
      code: '12445',
      conferenceId: 1,
    };
    const mockCreatedUser = new User({ id: 2, ...dto });
    jest.spyOn(service, 'create').mockResolvedValue(mockCreatedUser);

    const result = await controller.create(dto);

    expect(result).toEqual(mockCreatedUser);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should handle error when creating a new user (error case)', async () => {
    const dto: CreateUserDto = {
      email: 'testMail@email.com',
      code: '123456', // invalid code length
      conferenceId: 1,
    };
    const errorMessage = 'Invalid user value';
    jest.spyOn(service, 'create').mockRejectedValue(new Error(errorMessage));

    await expect(controller.create(dto)).rejects.toThrow(errorMessage);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  //Tests for findAll()

  describe('findAll()', () => {
    it('should return a list of users (normal case)', async () => {
      const mockUsers = [
        new User({
          id: 1,
          email: 'Test@1.de',
          code: 'abc12',
          conferenceId: 1,
        }),
        new User({
          id: 2,
          email: 'Test@2.de',
          code: 'dfc13',
          conferenceId: 1,
        }),
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockUsers);

      const result = await controller.findAll();

      expect(result).toEqual(mockUsers);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return an empty array when there are no users (edge case)', async () => {
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
    it('should return one user by id (normal case)', async () => {
      const mockUser = new User({
        id: 1,
        email: 'Test@1.de',
        code: 'abc12',
        conferenceId: 1,
      });
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should handle case where user is not found (edge case)', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null as any);

      const result = await controller.findOne(999);

      expect(result).toEqual(new User(null as any));
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
    it('should update an user successfully (normal case)', async () => {
      const id = 1;
      const updateDto = {
        email: 'testMail@email.com',
        code: '12345',
        conferenceId: 1,
      };
      const mockUpdatedUser = new User({
        id: 1,
        email: 'testMail@email.com',
        code: '12345',
        conferenceId: 1,
      });

      jest.spyOn(service, 'update').mockResolvedValue(mockUpdatedUser);

      const result = await controller.update(id, updateDto);

      expect(result).toEqual(mockUpdatedUser);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });

    it('should handle partial update (edge case)', async () => {
      const id = 2;
      const updateDto = { conferenceId: 2 }; // minimal gültiges DTO
      const mockUpdatedUser = new User({
        id: 1,
        email: 'testMail@email.com',
        code: '12345',
        conferenceId: 2,
      });

      jest.spyOn(service, 'update').mockResolvedValue(mockUpdatedUser);

      const result = await controller.update(id, updateDto);

      expect(result).toEqual(mockUpdatedUser);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });

    it('should handle error when updating user (error case)', async () => {
      const id = 3;
      const updateDto = { code: '10fffffff' };
      const errorMessage = 'Invalid code length';

      jest.spyOn(service, 'update').mockRejectedValue(new Error(errorMessage));

      await expect(controller.update(id, updateDto)).rejects.toThrow(
        errorMessage,
      );
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });
  });

  //Tests for remove()

  describe('remove()', () => {
    it('should remove an user successfully (normal case)', async () => {
      const id = 1;
      const mockResponse = { message: 'User removed successfully' };

      jest.spyOn(service, 'remove').mockResolvedValue(mockResponse);

      const result = await controller.remove(id);

      expect(result).toEqual(mockResponse);
      expect(service.remove).toHaveBeenCalledWith(id);
    });

    it('should return a message when trying to remove a non-existing user (edge case)', async () => {
      const id = 999;
      const mockResponse = { message: 'User not found, nothing deleted' };

      jest.spyOn(service, 'remove').mockResolvedValue(mockResponse);

      const result = await controller.remove(id);

      expect(result).toEqual(mockResponse);
      expect(service.remove).toHaveBeenCalledWith(id);
    });

    it('should handle error when removing an user (error case)', async () => {
      const id = 2;
      const errorMessage = 'Database connection error';

      jest.spyOn(service, 'remove').mockRejectedValue(new Error(errorMessage));

      await expect(controller.remove(id)).rejects.toThrow(errorMessage);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
