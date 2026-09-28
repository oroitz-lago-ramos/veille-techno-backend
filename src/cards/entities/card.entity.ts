import { Column, CreateDateColumn, Entity, JoinColumn, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { List } from "../../lists/entities/list.entity";
@Entity('cards')
export class Card {
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    title: string

    @Column({ nullable: true })
    description?: string

    @Column({ default: 0})
    position: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => List)
    @JoinColumn({name: 'listId'})
    list: List;
}
