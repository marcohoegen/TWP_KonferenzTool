import { Test, TestingModule } from '@nestjs/testing';
import { ConferenceController } from './conference.controller';
import { ConferenceService } from './conference.service';
import { CreateConferenceDto } from './dto/create-conference.dto';
import { UpdateConferenceDto } from './dto/update-conference.dto';
import { Conference } from './entities/conference.entity';

describe('ConferenceController', () => {
  let controller: ConferenceController;
  let service: ConferenceService;

  beforeEach(async () => {
    const mockConferenceService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConferenceController],
      providers: [
        {
          provide: ConferenceService,
          useValue: mockConferenceService,
        },
      ],
    }).compile();

    controller = module.get<ConferenceController>(ConferenceController);
    service = module.get<ConferenceService>(ConferenceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  //Tests für Post / create

  describe('create()', () => {
    it('should create a new conference (normal case)', async () => {
      const dto: CreateConferenceDto = {
        name: 'DevConf 2026',
        location: 'Berlin',
        startDate: new Date('2026-03-10'),
        endDate: new Date('2026-03-12'),
      };
      const mockCreated = {
        id: 1,
        name: dto.name,
        location: dto.location,
        startDate: dto.startDate,
        endDate: dto.endDate,
        createdAt: new Date(),
      };
      jest.spyOn(service, 'create').mockResolvedValue(mockCreated);

      const result = await controller.create(dto);

      expect(result).toEqual(
        new Conference({
          id: mockCreated.id,
          name: mockCreated.name,
          location: mockCreated.location,
          startDate: mockCreated.startDate,
          endDate: mockCreated.endDate,
        }),
      );
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should create a conference with minimal valid data (positive edge case)', async () => {
      const dto: CreateConferenceDto = {
        name: 'C',
        location: 'X',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-01-01'),
      };
      const mockCreated = {
        id: 2,
        ...dto,
        createdAt: new Date(),
      };
      jest.spyOn(service, 'create').mockResolvedValue(mockCreated);

      const result = await controller.create(dto);

      expect(result).toEqual(
        new Conference({
          id: mockCreated.id,
          name: mockCreated.name,
          location: mockCreated.location,
          startDate: mockCreated.startDate,
          endDate: mockCreated.endDate,
        }),
      );
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should throw when service.create fails (error case)', async () => {
      const dto: CreateConferenceDto = {
        name: 'BadConf',
        location: 'Nowhere',
        startDate: new Date('invalid'),
        endDate: new Date('invalid'),
      } as any; // cast because Date invalid in TS typing
      const errorMessage = 'Invalid dates';
      jest.spyOn(service, 'create').mockRejectedValue(new Error(errorMessage));

      await expect(controller.create(dto)).rejects.toThrow(errorMessage);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  //Tests für findAll

  describe('findAll()', () => {
    it('should return a list of conferences (normal case)', async () => {
      const mockConfs = [
        {
          id: 1,
          name: 'DevConf',
          location: 'Berlin',
          startDate: new Date('2026-03-10'),
          endDate: new Date('2026-03-12'),
        },
        {
          id: 2,
          name: 'TechSummit',
          location: 'Hamburg',
          startDate: new Date('2026-06-05'),
          endDate: new Date('2026-06-06'),
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockConfs);

      const result = await controller.findAll();

      expect(result).toEqual([
        new Conference({
          id: mockConfs[0].id,
          name: mockConfs[0].name,
          location: mockConfs[0].location,
          startDate: mockConfs[0].startDate,
          endDate: mockConfs[0].endDate,
        }),
        new Conference({
          id: mockConfs[1].id,
          name: mockConfs[1].name,
          location: mockConfs[1].location,
          startDate: mockConfs[1].startDate,
          endDate: mockConfs[1].endDate,
        }),
      ]);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return an empty array when there are no conferences (edge case)', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should propagate errors from service.findAll (error case)', async () => {
      const errorMessage = 'DB connection failed';
      jest.spyOn(service, 'findAll').mockRejectedValue(new Error(errorMessage));

      await expect(controller.findAll()).rejects.toThrow(errorMessage);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  //findOne()

  describe('findOne()', () => {
    it('should return a conference by id (normal case)', async () => {
      const mockConf = {
        id: 1,
        name: 'DevConf',
        location: 'Berlin',
        startDate: new Date('2026-03-10'),
        endDate: new Date('2026-03-12'),
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockConf);

      const result = await controller.findOne(1);

      expect(result).toEqual(new Conference(mockConf));
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should handle not found (edge case) by returning new Conference(null)', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null as any);

      const result = await controller.findOne(999);

      expect(result).toEqual(new Conference(null));
      expect(service.findOne).toHaveBeenCalledWith(999);
    });

    it('should propagate errors from service.findOne (error case)', async () => {
      const errorMessage = 'DB error';
      jest.spyOn(service, 'findOne').mockRejectedValue(new Error(errorMessage));

      await expect(controller.findOne(1)).rejects.toThrow(errorMessage);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  //Tests für update()

  describe('update()', () => {
    it('should update a conference successfully (normal case)', async () => {
      const id = 1;
      const updateDto: UpdateConferenceDto = {
        name: 'DevConf Updated',
        location: 'Berlin',
        startDate: new Date('2026-03-11'),
        endDate: new Date('2026-03-13'),
      };
      const mockUpdated = {
        id,
        ...updateDto,
      };
      jest.spyOn(service, 'update').mockResolvedValue(mockUpdated);

      const result = await controller.update(id, updateDto);

      expect(result).toEqual(
        new Conference({
          id: mockUpdated.id,
          name: mockUpdated.name,
          location: mockUpdated.location,
          startDate: mockUpdated.startDate,
          endDate: mockUpdated.endDate,
        }),
      );
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });

    it('should handle partial update (edge case)', async () => {
      const id = 2;
      const updateDto: UpdateConferenceDto = { name: 'NameOnly' } as any;
      const mockUpdated = {
        id,
        name: 'Name',
        location: 'OldLocation',
        startDate: new Date('2026-04-01'),
        endDate: new Date('2026-04-02'),
      };
      jest.spyOn(service, 'update').mockResolvedValue(mockUpdated);

      const result = await controller.update(id, updateDto);

      expect(result).toEqual(new Conference(mockUpdated));
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });

    it('should propagate errors from service.update (error case)', async () => {
      const id = 3;
      const updateDto: UpdateConferenceDto = { name: 'Bad' } as any;
      const errorMessage = 'Update failed';
      jest.spyOn(service, 'update').mockRejectedValue(new Error(errorMessage));

      await expect(controller.update(id, updateDto)).rejects.toThrow(
        errorMessage,
      );
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });
  });

  //Tests für remove()

  describe('remove()', () => {
    it('should remove a conference successfully (normal case)', async () => {
      const id = 1;
      const mockResponse = { message: 'Conference removed successfully' };
      jest.spyOn(service, 'remove').mockResolvedValue(mockResponse);

      const result = await controller.remove(id);

      expect(result).toEqual(mockResponse);
      expect(service.remove).toHaveBeenCalledWith(id);
    });

    it('should return message when removing a non-existing conference (edge case)', async () => {
      const id = 999;
      const mockResponse = { message: 'Conference not found' };
      jest.spyOn(service, 'remove').mockResolvedValue(mockResponse);

      const result = await controller.remove(id);

      expect(result).toEqual(mockResponse);
      expect(service.remove).toHaveBeenCalledWith(id);
    });

    it('should propagate errors from service.remove (error case)', async () => {
      const id = 2;
      const errorMessage = 'Delete failed';
      jest.spyOn(service, 'remove').mockRejectedValue(new Error(errorMessage));

      await expect(controller.remove(id)).rejects.toThrow(errorMessage);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
