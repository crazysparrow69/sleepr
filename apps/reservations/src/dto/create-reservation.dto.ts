import { Type } from 'class-transformer';
import { IsDate, ValidateNested } from 'class-validator';
import { CreateChargeDto } from '@app/common';

export class CreateReservationDto {
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ValidateNested()
  @Type(() => CreateChargeDto)
  charge: CreateChargeDto;
}
