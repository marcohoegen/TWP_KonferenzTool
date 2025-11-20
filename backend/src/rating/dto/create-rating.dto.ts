import { Max, Min } from 'class-validator';

export class CreateRatingDto {
  @Min(1)
  @Max(5)
  contentsRating: number;

  @Min(1)
  @Max(5)
  styleRating: number;

  @Min(1)
  @Max(5)
  slidesRating: number;

  userId: number;
  presentationId: number;
}
