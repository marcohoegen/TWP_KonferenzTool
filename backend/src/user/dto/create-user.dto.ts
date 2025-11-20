import { IsEmail, IsNotEmpty, IsNumber, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(5, 5)
  code: string;

  @IsNotEmpty()
  @IsNumber()
  conferenceId: number;
}
