import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ListsModule } from './lists/lists.module';
import { CardsModule } from './cards/cards.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HashingModule } from './hashing/hashing.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [],
      // entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.SYNCHRONIZE === 'true',
      autoLoadEntities: true,
    }),
    UsersModule,
    ListsModule,
    CardsModule,
    AuthModule,
    HashingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

