import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
} from 'typeorm';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Index({ unique: true })
  @Column({ length: 255 })
  email: string;

  @Column({ select: false })
  password: string;
}