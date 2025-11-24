import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

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
      addPresentation: jest.fn(),
      removePresentation: jest.fn(),
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

  it('should create a new user with presentations (normal case)', async () => {
    const dto: CreateUserDto = {
      email: 'testMail@email.com',
      code: '12345',
      conferenceId: 1,
    };
    const mockCreatedUser = {
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
    jest.spyOn(service, 'create').mockResolvedValue(mockCreatedUser as any);

    const result = await controller.create(dto);

    expect(result).toEqual(mockCreatedUser);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should create a new user without presentations (edge case)', async () => {
    const dto: CreateUserDto = {
      email: 'testMail2@email.com',
      code: '12445',
      conferenceId: 1,
    };
    const mockCreatedUser = {
      id: 2,
      email: 'testMail2@email.com',
      code: '12445',
      conferenceId: 1,
      createdAt: new Date(),
      presentations: [],
    };
    jest.spyOn(service, 'create').mockResolvedValue(mockCreatedUser as any);

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
    it('should return a list of users with presentations (normal case)', async () => {
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
      jest.spyOn(service, 'findAll').mockResolvedValue(mockUsers as any);

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
    it('should return one user with presentations by id (normal case)', async () => {
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
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser as any);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should handle case where user is not found (edge case)', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null as any);

      const result = await controller.findOne(999);

      expect(result).toEqual(null);
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

      jest.spyOn(service, 'update').mockResolvedValue(mockUpdatedUser as any);

      const result = await controller.update(id, updateDto);

      expect(result).toEqual(mockUpdatedUser);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });

    it('should handle partial update (edge case)', async () => {
      const id = 2;
      const updateDto = { conferenceId: 2 };
      const mockUpdatedUser = {
        id: 1,
        email: 'testMail@email.com',
        code: '12345',
        conferenceId: 2,
        createdAt: new Date(),
        presentations: [],
      };

      jest.spyOn(service, 'update').mockResolvedValue(mockUpdatedUser as any);

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

  //Tests for addPresentation()

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
      jest
        .spyOn(service, 'addPresentation')
        .mockResolvedValue(mockUpdatedUser as any);

      const result = await controller.addPresentation(1, 2);

      expect(result).toEqual(mockUpdatedUser);
      expect(service.addPresentation).toHaveBeenCalledWith(1, 2);
    });

    it('should handle error when adding presentation (error case)', async () => {
      const errorMessage = 'Presentation not found';
      jest
        .spyOn(service, 'addPresentation')
        .mockRejectedValue(new Error(errorMessage));

      await expect(controller.addPresentation(1, 999)).rejects.toThrow(
        errorMessage,
      );
      expect(service.addPresentation).toHaveBeenCalledWith(1, 999);
    });
  });

  //Tests for removePresentation()

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
      jest
        .spyOn(service, 'removePresentation')
        .mockResolvedValue(mockUpdatedUser as any);

      const result = await controller.removePresentation(1, 2);

      expect(result).toEqual(mockUpdatedUser);
      expect(service.removePresentation).toHaveBeenCalledWith(1, 2);
    });

    it('should handle error when removing presentation (error case)', async () => {
      const errorMessage = 'Presentation not found';
      jest
        .spyOn(service, 'removePresentation')
        .mockRejectedValue(new Error(errorMessage));

      await expect(controller.removePresentation(1, 999)).rejects.toThrow(
        errorMessage,
      );
      expect(service.removePresentation).toHaveBeenCalledWith(1, 999);
    });
  });
});
