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

  //DOC: Here I have seen on a tutorial that we can do : 
  /* @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  } */
  // The @BeforeInsert() decorator is used to specify a method that should be called before
  //  an entity is inserted into the database. In this case, 
  // the hashPassword() method is called before the User entity is saved
  //  to the database. This method checks if 
  // the password property is set, and if so, it hashes the password 
  // using bcrypt and sets the hashed value back to the password property.
  //  This ensures that the password is stored securely in the database.
  // So in the users service we set the password to the user.password 
  // and then when we save it, the @BeforeInsert() decorator will call the
  //  hashPassword() method and hash the password before saving it to the 
  // repository.
}