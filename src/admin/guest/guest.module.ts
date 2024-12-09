import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestListService } from 'src/models/guest/guest.service'; 
import { AdminGuestListController } from './guest.controller';
import { GuestList } from 'src/models/guest/entity/guest.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([GuestList]), AuthModule],
  controllers: [AdminGuestListController],
  providers: [GuestListService],
})
export class AdminGuestListModule {}
