import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestList } from './entity/guest.entity';
import { GuestListController } from './guest.controller';
import { GuestListService } from './guest.service';

@Module({
  imports: [TypeOrmModule.forFeature([GuestList])],
  controllers: [GuestListController],
  providers: [GuestListService],
  exports: [GuestListService],
})
export class GuestListModule {}
