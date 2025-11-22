import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  IsEnum,
  IsOptional,
  IsArray,
} from 'class-validator';
import { PresentationStatus } from '@prisma/client';

export class CreatePresentationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @Min(1)
  agendaPosition: number;

  @IsNotEmpty()
  @IsNumber()
  conferenceId: number;

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  presenterIds?: number[];

  @IsOptional()
  @IsEnum(PresentationStatus)
  status?: PresentationStatus;
}
