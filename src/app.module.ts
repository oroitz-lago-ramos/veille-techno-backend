import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'veille_user',
      password: 'veille_password',
      database: 'veille_db',
      entities: [],
      synchronize: true,
    }),
  ],
})
export class AppModule {}

