import { IsEmail, IsString, IsNotEmpty, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'test@gmail.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'John' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'min 8 characters' })
    @IsString()
    @MinLength(8)
    password: string;
}
