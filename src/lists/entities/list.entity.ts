import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../../users/entities/user.entity'

@Entity("lists")
export class List {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 200 })
    title: string;

    @Column({ default: 0})
    position: number

    // @Column({ default: () => 'CURRENT_TIMESTAMP' })
    // @Column({ default: () => new Date() )
    @CreateDateColumn()
    createdAt: Date

    @ManyToOne(() => User)
    @JoinColumn({ name: 'ownerId' })
    owner: User;
}
