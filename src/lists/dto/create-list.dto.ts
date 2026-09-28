import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'

export class CreateListDto {
    @ApiProperty({ description: 'The title of the list' })
    @IsString()
    @IsNotEmpty()
    title: string;
}