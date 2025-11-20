import { IsNotEmpty, IsNumber, IsString, Min, IsEnum, IsOptional } from 'class-validator';
import { PresentationStatus } from '@prisma/client';

export class CreatePresentationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @Min(1)
  agendaPosition: number;

  conferenceId: number;
  userId: number;

  @IsOptional()
  @IsEnum(PresentationStatus)
  status?: PresentationStatus;
}
