import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionService } from 'src/models/section/section.service'; 
import { Section } from 'src/models/section/entity/section.entity'; 
import { AdminSectionController } from './section.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Section])],
  controllers: [AdminSectionController],
  providers: [SectionService],
})
export class AdminSectionModule {}
