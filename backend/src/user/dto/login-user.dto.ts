import { IsString, Length } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @Length(5, 5)
  code: string;
}
