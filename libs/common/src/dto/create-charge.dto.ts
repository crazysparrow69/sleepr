import {
  IsNumber,
  IsString,
  IsObject,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { CardDto } from './card.dto';
import { Type } from 'class-transformer';

export class CreateChargeDto {
  @ValidateIf((o: CreateChargeDto) => typeof o.card === 'string')
  @IsString()
  @ValidateIf((o: CreateChargeDto) => typeof o.card === 'object')
  @IsObject()
  @ValidateNested()
  @Type(() => CardDto)
  card: CardDto | string;

  @IsNumber()
  amount: number;
}
