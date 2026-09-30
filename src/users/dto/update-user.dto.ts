import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsOptional } from "class-validator";
import { Role } from '../enum/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
	@ApiProperty({ required: false, enum: Role, description: 'Admin only' })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
