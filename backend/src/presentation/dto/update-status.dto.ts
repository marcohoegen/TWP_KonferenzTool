import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PresentationStatus } from '@prisma/client';

export class UpdateStatusDto {
  @ApiProperty({
    enum: PresentationStatus,
    description: 'Presentation status',
    example: PresentationStatus.ACTIVE,
  })
  @IsNotEmpty()
  @IsEnum(PresentationStatus)
  status: PresentationStatus;
}
