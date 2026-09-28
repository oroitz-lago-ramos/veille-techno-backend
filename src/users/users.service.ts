import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { HashingService } from '../hashing/hashing.service';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (await this.findOneByEmail(createUserDto.email)) {
      throw new ConflictException("Email already in use");
    }
    const user = new User();
    user.email = createUserDto.email;
    user.name = createUserDto.name;
    const hashedPassword = await this.hashingService.hash(createUserDto.password)
    user.password = hashedPassword; 
    const savedUser = await this.usersRepository.save(user);
    const { password, ...result } = savedUser;
    return result;

  }

  findOneByEmail(email: string)
  {
    return this.usersRepository.findOne({where: { email }});
  }

  findOneByEmailWithPassword(email: string)
  {
    return this.usersRepository.findOne({
      where: {email},
      select: { id: true, email: true, name: true, password: true}
    })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
