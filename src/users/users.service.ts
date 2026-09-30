import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { HashingService } from '../hashing/hashing.service';
import { Role } from './enum/role.enum';

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
    return this.saveAndSanitize(user);

  }

  findOneById(id: number) {
    return this.usersRepository.findOne({
      where: { id }
    })
  }

  findOneByEmail(email: string)
  {
    return this.usersRepository.findOne({where: { email }});
  }

  findOneByEmailWithPassword(email: string)
  {
    return this.usersRepository.findOne({
      where: {email},
      select: { id: true, email: true, name: true, password: true, role: true}
    })
  }

  async update(id: number, updateUserDto: UpdateUserDto, currentUser: User) {
    const isSelf = currentUser.id == id;
    const isAdmin = currentUser.role === Role.ADMIN;
    
    const fetchedUser = await this.usersRepository.findOne({
      where : {id}
    })
    
    if (!fetchedUser) { throw new NotFoundException('User not found'); }
    if (!isSelf && !isAdmin) { throw new ForbiddenException('You can only modidy your own profile'); }
    if (updateUserDto.role !== undefined && !isAdmin) { throw new ForbiddenException('Only an admin can chage a role')}
    
    if (updateUserDto.password){ 
      updateUserDto.password = await this.hashingService.hash(updateUserDto.password)
    }

    Object.assign(fetchedUser, updateUserDto);
    return this.saveAndSanitize(fetchedUser); 
  }

  private async saveAndSanitize(user: User)
  {
    const savedUser = await this.usersRepository.save(user);
    const {password, ...result} = savedUser;
    return result;
  }
}
