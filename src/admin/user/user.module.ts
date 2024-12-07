import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/models/user/user.service'; 
import { User } from 'src/models/user/entity/user.entity';
import { AdminUserController } from './user.controller';


@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [AdminUserController],
  exports: [UserService, TypeOrmModule],
})
export class AdminUserModule {}
