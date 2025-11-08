import { Max, Min } from 'class-validator';

export class CreateRatingDto {
  @Min(0)
  @Max(5)
  rating: number;

  userId: number;
  presentationId: number;
}
