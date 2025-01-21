import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './Entity/user.entity';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [
    //adding entities
    TypeOrmModule.forFeature([User])
],
})
export class UsersModule {}
