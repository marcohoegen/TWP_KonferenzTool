import { Test, TestingModule } from '@nestjs/testing';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { Rating } from './entities/rating.entity';

describe('RatingController', () => {
  let controller: RatingController;
  let service: RatingService;

  beforeEach(async () => {
    const mockRatingService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatingController],
      providers: [
        {
          provide: RatingService,
          useValue: mockRatingService,
        },
      ],
    }).compile();

    controller = module.get<RatingController>(RatingController);
    service = module.get<RatingService>(RatingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new rating (normal case)', async () => {
    const dto: CreateRatingDto = {
      contentsRating: 1,
      styleRating: 1,
      slidesRating: 1,
      userId: 2,
      presentationId: 3,
    };
    const mockCreatedRating = new Rating({ id: 1, ...dto });
    jest.spyOn(service, 'create').mockResolvedValue(mockCreatedRating);

    const result = await controller.create(dto);

    expect(result).toEqual(mockCreatedRating);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should create a new rating (edge case with minimal valid data)', async () => {
    const dto: CreateRatingDto = {
      contentsRating: 1,
      styleRating: 1,
      slidesRating: 1,
      userId: 2,
      presentationId: 3,
    };
    const mockCreatedRating = new Rating({ id: 2, ...dto });
    jest.spyOn(service, 'create').mockResolvedValue(mockCreatedRating);

    const result = await controller.create(dto);

    expect(result).toEqual(mockCreatedRating);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should handle error when creating a new rating (error case)', async () => {
    const dto: CreateRatingDto = {
      contentsRating: 7, //out of range
      styleRating: 1,
      slidesRating: 1,
      userId: 2,
      presentationId: 3,
    };
    const errorMessage = 'Invalid rating value';
    jest.spyOn(service, 'create').mockRejectedValue(new Error(errorMessage));

    await expect(controller.create(dto)).rejects.toThrow(errorMessage);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  //Tests for findAll()

  describe('findAll()', () => {
    it('should return a list of ratings (normal case)', async () => {
      const mockRatings = [
        new Rating({
          id: 1,
          contentsRating: 1,
          styleRating: 1,
          slidesRating: 1,
          userId: 2,
          presentationId: 3,
        }),
        new Rating({
          id: 2,
          contentsRating: 4,
          styleRating: 4,
          slidesRating: 3,
          userId: 4,
          presentationId: 3,
        }),
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockRatings);

      const result = await controller.findAll();

      expect(result).toEqual(mockRatings);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return an empty array when there are no ratings (edge case)', async () => {
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
    it('should return one rating by id (normal case)', async () => {
      const mockRating = new Rating({
        id: 1,
        contentsRating: 1,
        styleRating: 1,
        slidesRating: 1,
        userId: 2,
        presentationId: 3,
      });
      jest.spyOn(service, 'findOne').mockResolvedValue(mockRating);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockRating);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should handle case where rating is not found (edge case)', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null as any);

      const result = await controller.findOne(999);

      expect(result).toEqual(new Rating(null as any));
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
    it('should update an rating successfully (normal case)', async () => {
      const id = 1;
      const updateDto = {
        contentsRating: 5,
        styleRating: 5,
        slidesRating: 5,
        userId: 2,
        presentationId: 3,
      };
      const mockUpdatedRating = new Rating({
        id,
        contentsRating: 5,
        styleRating: 5,
        slidesRating: 5,
        userId: 2,
        presentationId: 3,
      });

      jest.spyOn(service, 'update').mockResolvedValue(mockUpdatedRating);

      const result = await controller.update(id, updateDto);

      expect(result).toEqual(mockUpdatedRating);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });

    it('should handle partial update (edge case)', async () => {
      const id = 2;
      const updateDto = { contentsRating: 2 }; // minimal gültiges DTO
      const mockUpdatedRating = new Rating({
        id,
        contentsRating: 2,
        styleRating: 4,
        slidesRating: 3,
        userId: 4,
        presentationId: 3,
      });

      jest.spyOn(service, 'update').mockResolvedValue(mockUpdatedRating);

      const result = await controller.update(id, updateDto);

      expect(result).toEqual(mockUpdatedRating);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });

    it('should handle error when updating rating (error case)', async () => {
      const id = 3;
      const updateDto = { contentsRating: 10 }; // invalid rating
      const errorMessage = 'Invalid rating value';

      jest.spyOn(service, 'update').mockRejectedValue(new Error(errorMessage));

      await expect(controller.update(id, updateDto)).rejects.toThrow(
        errorMessage,
      );
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });
  });

  //Tests for remove()

  describe('remove()', () => {
    it('should remove an rating successfully (normal case)', async () => {
      const id = 1;
      const mockResponse = { message: 'Rating removed successfully' };

      jest.spyOn(service, 'remove').mockResolvedValue(mockResponse);

      const result = await controller.remove(id);

      expect(result).toEqual(mockResponse);
      expect(service.remove).toHaveBeenCalledWith(id);
    });

    it('should return a message when trying to remove a non-existing rating (edge case)', async () => {
      const id = 999;
      const mockResponse = { message: 'Rating not found, nothing deleted' };

      jest.spyOn(service, 'remove').mockResolvedValue(mockResponse);

      const result = await controller.remove(id);

      expect(result).toEqual(mockResponse);
      expect(service.remove).toHaveBeenCalledWith(id);
    });

    it('should handle error when removing an rating (error case)', async () => {
      const id = 2;
      const errorMessage = 'Database connection error';

      jest.spyOn(service, 'remove').mockRejectedValue(new Error(errorMessage));

      await expect(controller.remove(id)).rejects.toThrow(errorMessage);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
