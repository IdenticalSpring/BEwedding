import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestListService } from 'src/models/guest/guest.service'; 
import { AdminGuestListController } from './guest.controller';
import { GuestList } from 'src/models/guest/entity/guest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GuestList])],
  controllers: [AdminGuestListController],
  providers: [GuestListService],
})
export class AdminGuestListModule {}
