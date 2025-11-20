import { Test, TestingModule } from '@nestjs/testing';
import { PresentationController } from './presentation.controller';
import { PresentationService } from './presentation.service';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { UpdatePresentationDto } from './dto/update-presentation.dto';
import { Presentation } from './entities/presentation.entity';
import { PresentationStatus } from '@prisma/client';

// Helper factory to always provide required fields
const makePresentation = (partial: Partial<Presentation> = {}) =>
  new Presentation({
    id: 1,
    title: 'Default Title',
    agendaPosition: 1,
    conferenceId: 1,
    userId: 1,
    status: PresentationStatus.ACTIVE,
    createdAt: undefined,
    ratings: undefined,
    ...partial,
  });

describe('PresentationController', () => {
  let controller: PresentationController;
  let service: PresentationService;

  beforeEach(async () => {
    const mockPresentationService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresentationController],
      providers: [
        {
          provide: PresentationService,
          useValue: mockPresentationService,
        },
      ],
    }).compile();

    controller = module.get<PresentationController>(PresentationController);
    service = module.get<PresentationService>(PresentationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ---------- CREATE ----------
  describe('create()', () => {
    it('should create a new presentation (normal case)', async () => {
      const dto: CreatePresentationDto = {
        title: 'Keynote',
        agendaPosition: 1,
        conferenceId: 10,
        userId: 5,
      };

      const mockCreated = makePresentation({
        id: 1,
        ...dto,
      });

      jest.spyOn(service, 'create').mockResolvedValue(mockCreated);

      const result = await controller.create(dto);

      expect(result).toEqual(mockCreated);
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should create presentation with minimal valid data (edge case)', async () => {
      const dto: CreatePresentationDto = {
        title: 'A',
        agendaPosition: 0,
        conferenceId: 1,
        userId: 1,
      };

      const mockCreated = makePresentation({
        id: 2,
        ...dto,
      });

      jest.spyOn(service, 'create').mockResolvedValue(mockCreated);

      const result = await controller.create(dto);
      expect(result).toEqual(mockCreated);
    });

    it('should handle service error when creating presentation (error case)', async () => {
      const dto: CreatePresentationDto = {
        title: '',
        agendaPosition: -1,
        conferenceId: 1,
        userId: 1,
      };

      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new Error('Invalid presentation data'));

      await expect(controller.create(dto)).rejects.toThrow(
        'Invalid presentation data',
      );
    });
  });

  // ---------- FIND ALL ----------
  describe('findAll()', () => {
    it('should return all presentations (normal case)', async () => {
      const mockPresentations = [
        makePresentation({ id: 1, title: 'Talk 1', agendaPosition: 1, userId: 1 }),
        makePresentation({ id: 2, title: 'Talk 2', agendaPosition: 2, userId: 2 }),
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(mockPresentations);

      const result = await controller.findAll();
      expect(result).toEqual(mockPresentations);
    });

    it('should return empty list if no presentations (edge case)', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([]);

      const result = await controller.findAll();
      expect(result).toEqual([]);
    });

    it('should handle service error on findAll (error case)', async () => {
      jest.spyOn(service, 'findAll').mockRejectedValue(new Error('DB Error'));

      await expect(controller.findAll()).rejects.toThrow('DB Error');
    });
  });

  // ---------- FIND ONE ----------
  describe('findOne()', () => {
    it('should return a presentation by id (normal case)', async () => {
      const mockPresentation = makePresentation({
        id: 1,
        title: 'Keynote',
        agendaPosition: 1,
        conferenceId: 10,
        userId: 5,
      });

      jest.spyOn(service, 'findOne').mockResolvedValue(mockPresentation);

      const result = await controller.findOne(1);
      expect(result).toEqual(mockPresentation);
    });

    it('should return minimal presentation (edge case)', async () => {
      const mockPresentation = makePresentation({
        id: 2,
        title: 'A',
        agendaPosition: 0,
        conferenceId: 1,
        userId: 1,
      });

      jest.spyOn(service, 'findOne').mockResolvedValue(mockPresentation);

      const result = await controller.findOne(2);
      expect(result).toEqual(mockPresentation);
    });

    it('should handle service error on findOne (error case)', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new Error('Not found'));

      await expect(controller.findOne(99)).rejects.toThrow('Not found');
    });
  });

  // ---------- UPDATE ----------
  describe('update()', () => {
    it('should update a presentation (normal case)', async () => {
      const dto: UpdatePresentationDto = { title: 'Updated Title' };

      const mockUpdated = makePresentation({
        id: 1,
        title: 'Updated Title',
      });

      jest.spyOn(service, 'update').mockResolvedValue(mockUpdated);

      const result = await controller.update(1, dto);
      expect(result).toEqual(mockUpdated);
    });

    it('should handle partial update (edge case)', async () => {
      const dto: UpdatePresentationDto = { agendaPosition: 2 };

      const mockUpdated = makePresentation({
        id: 2,
        title: 'Partial',
        agendaPosition: 3,
      });

      jest.spyOn(service, 'update').mockResolvedValue(mockUpdated);

      const result = await controller.update(2, dto);
      expect(result).toEqual(mockUpdated);
    });

    it('should handle service error on update (error case)', async () => {
      const dto: UpdatePresentationDto = { title: 'Fail' };

      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new Error('Update failed'));

      await expect(controller.update(99, dto)).rejects.toThrow('Update failed');
    });
  });

  // ---------- REMOVE ----------
  describe('remove()', () => {
    it('should remove a presentation (normal case)', async () => {
      jest
        .spyOn(service, 'remove')
        .mockResolvedValue({ message: 'Presentation with ID 1 deleted' });

      const result = await controller.remove(1);

      expect(result).toEqual({ message: 'Presentation with ID 1 deleted' });
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should handle deletion of last presentation (edge case)', async () => {
      jest
        .spyOn(service, 'remove')
        .mockResolvedValue({ message: 'Presentation with ID 10 deleted' });

      const result = await controller.remove(10);
      expect(result.message).toContain('deleted');
    });

    it('should handle deletion of non-existing presentation (error case)', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new Error('Not found'));

      await expect(controller.remove(99)).rejects.toThrow('Not found');
    });
  });
});