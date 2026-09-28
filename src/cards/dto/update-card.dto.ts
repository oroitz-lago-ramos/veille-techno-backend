import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { CreateCardDto } from './create-card.dto';

export class UpdateCardDto extends PartialType(CreateCardDto) {
  @ApiProperty({ required: false, description: 'Move the card to a different list' })
  @IsInt()
  @IsOptional()
  listId?: number;

  @ApiProperty({ required: false, description: 'The position of the card within the list' })
  @IsInt()
  @IsOptional()
  position?: number;
}
