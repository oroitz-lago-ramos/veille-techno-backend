import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCardDto {
    @ApiProperty({ description: "The title of the card"})
    @IsString()
    @IsNotEmpty()
    title: string

    @ApiProperty({ required : false, description: "The description of the card, optional"})
    @IsString()
    @IsOptional()
    description?: string
}
