import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { List } from './entities/list.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ListsService {

  constructor(
    @InjectRepository(List)
    private listsRepository: Repository<List>
  ) { }

  async create(createListDto: CreateListDto, user: User) {
    const list = new List();
    list.title = createListDto.title;
    list.owner = user;
    try {
      return await this.listsRepository.save(list);
    } catch (error) {
      throw new BadRequestException('Failed to create list');
    }
  }

  findAllFromUser(user: User) {
    return this.listsRepository.find({
      where: { owner: user }
    });
  }

  update(id: number, updateListDto: UpdateListDto) {
    return `This action updates a #${id} list`;
  }

  async remove(id: number, user: User) {
    const list = await this.listsRepository.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (!list) { throw new NotFoundException; }
    if (list.owner.id !== user.id) { throw new ForbiddenException('You are nto the owner of this list'); }
    await this.listsRepository.remove(list);
  }
}
