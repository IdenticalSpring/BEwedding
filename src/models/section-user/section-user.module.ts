import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionUserService } from './section-user.service';
import { SectionUserController } from './section-user.controller';
import { SectionUser } from './entity/section-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SectionUser])],
  controllers: [SectionUserController],
  providers: [SectionUserService],
})
export class SectionUserModule {}
