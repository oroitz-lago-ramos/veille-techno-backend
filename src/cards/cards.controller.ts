import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { UseGuards, HttpCode } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Cards')
@Controller()
export class CardsController {
  constructor(private readonly cardsService: CardsService) { }

  @Post('lists/:listId/cards')
  @HttpCode(201)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new card in a list' })
  @ApiResponse({ status: 201, description: 'Card created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input - title is required' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the owner of the list' })
  @ApiResponse({ status: 404, description: 'List not found' })
  @ApiBearerAuth()
  create(@Body() createCardDto: CreateCardDto,@Param('listId') listId: string,@GetUser() user: User) {
    return this.cardsService.create(createCardDto, +listId, user);
  }

  @Get('lists/:listId/cards')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'List all cards in a list' })
  @ApiResponse({ status: 200, description: 'Cards retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the owner of the list' })
  @ApiResponse({ status: 404, description: 'List not found' })
  @ApiBearerAuth()
  findAllFromList(@Param('listId') listId: string, @GetUser() user: User) {
    return this.cardsService.findAllFromList(+listId, user);
  }

  @Get('cards/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get a card if you own its parent list' })
  @ApiResponse({ status: 200, description: 'Card retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the owner of the list' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  @ApiBearerAuth()
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.cardsService.findOne(+id, user);
  }

  @Patch('cards/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a card (title, description, position, or move to another list)' })
  @ApiResponse({ status: 200, description: 'Card updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid payload' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the owner of the card or target list' })
  @ApiResponse({ status: 404, description: 'Card or target list not found' })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto, @GetUser() user: User) {
    return this.cardsService.update(+id, updateCardDto, user);
  }

  @Delete('cards/:id')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a card if you own its parent list' })
  @ApiResponse({ status: 204, description: 'Card deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the owner of the list' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  @ApiBearerAuth()
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.cardsService.remove(+id, user);
  }
}
