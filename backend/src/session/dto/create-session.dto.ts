import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsNumber()
  @IsNotEmpty()
  conferenceId: number;

  @IsNumber()
  @IsNotEmpty()
  sessionNumber: number;

  @IsString()
  @IsNotEmpty()
  sessionName: string;
}
