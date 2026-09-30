import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Repository } from 'typeorm';
import { ListsService } from '../lists/lists.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CardsService {

  constructor(
    @InjectRepository(Card)
    private cardsRepository: Repository<Card>,
    private listService: ListsService,
  ) { }

  async create(createCardDto: CreateCardDto, listId: number, user: User) {
    const list = await this.listService.findOneOrThrow(listId, user);

    const card = new Card();
    card.title = createCardDto.title;
    card.description = createCardDto.description;
    card.list = list;

    return this.cardsRepository.save(card);
  }

  async findAllFromList(listId: number, user: User) {
    await this.listService.findOneOrThrow(listId, user)
    const cards = this.cardsRepository.find({
      where: { list: { id: listId } }
    })
    return cards;
  }

  findOne(id: number, user: User) {
    return this.findOneOrThrow(id, user);
  }

  async remove(id: number, user: User) {
    const card = await  this.findOneOrThrow(id, user);
    return await this.cardsRepository.remove(card);
  }

  async update(id: number, updateCardDto: UpdateCardDto, user: User)
  {
    const { listId, ...rest} = updateCardDto;
    const card = await this.findOneOrThrow(id, user)

    if (listId !== undefined && listId !== card.list.id)
    {
      card.list = await this.listService.findOneOrThrow(listId, user);
    }

    Object.assign(card, rest);
    return this.cardsRepository.save(card)
  }

  async findOneOrThrow(id: number, user: User): Promise<Card> {
    const card = await this.cardsRepository.findOne({
      where: { id },
      relations: { list: { owner: true } },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }
    if (card.list.owner.id !== user.id) {
      throw new ForbiddenException("You are not the owner of this card's list");
    }

    return card;
  }
}
