import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateConferenceDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    location: string;

    @IsDate()
    startDate: Date;
    
    @IsDate()
    endDate: Date;
}
