import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThemeService } from './theme.service';
import { ThemeController } from './theme.controller';
import { Template } from '../template/entity/template.entity';
import { Theme } from './entity/theme.enity';

@Module({
  imports: [TypeOrmModule.forFeature([Theme, Template])],
  controllers: [ThemeController],
  providers: [ThemeService],
})
export class ThemeModule {}
