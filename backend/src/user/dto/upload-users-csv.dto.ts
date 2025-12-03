import { IsNumber } from 'class-validator';

export class UploadUsersCsvDto {
  @IsNumber()
  conferenceId: number;
}
