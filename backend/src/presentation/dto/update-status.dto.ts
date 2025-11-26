import { IsEnum, IsNotEmpty } from 'class-validator';
import { PresentationStatus } from '@prisma/client';

export class UpdateStatusDto {
  @IsNotEmpty()
  @IsEnum(PresentationStatus)
  status: PresentationStatus;
}
