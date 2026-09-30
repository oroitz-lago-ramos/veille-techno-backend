import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HttpCode } from '@nestjs/common';

@ApiTags('Lists')
@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new list' })
  @ApiResponse({ status: 201, description: 'List created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input - title is required' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  create(@Body() createListDto: CreateListDto, @GetUser() user: User) {
    return this.listsService.create(createListDto, user);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all the lists from the user authentified' })
  @ApiResponse({ status: 200, description: 'Lists retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  findAll(@GetUser() user : User) {
    return this.listsService.findAllFromUser(user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a list if you are the owner' })
  @ApiResponse({ status: 200, description: 'List updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid payload' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the owner' })
  @ApiResponse({ status: 404, description: 'List not found' })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateListDto: UpdateListDto, @GetUser() user: User) {
    return this.listsService.update(+id, updateListDto, user);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete the list by id if you are the owner' })
  @ApiResponse({ status: 204, description: 'List deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the owner' })
  @ApiResponse({ status: 404, description: 'List not found' })
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.listsService.remove(+id, user);
  }
}
