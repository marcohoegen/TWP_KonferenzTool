import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreatePresentationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @Min(1)
  agendaPosition: number;

  conferenceId: number;
  userId: number;
}
