import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  IsArray,
  IsOptional,
} from 'class-validator';

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
}
