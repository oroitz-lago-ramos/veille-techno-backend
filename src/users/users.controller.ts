import { Controller, Post, Body, Patch, Param, UseGuards, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from './entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get the currently authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Returns the current user (no password)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  getMe(@GetUser() user: User) {
    return this.usersService.findOneById(user.id);
  }
  
  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a user (self, or role change if admin)' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid payload (e.g. unrecognized role)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your own profile, or non-admin changing a role' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @GetUser() user: User) {
    return this.usersService.update(+id, updateUserDto, user);
  }
}
