import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThemeService } from './theme.service';
import { ThemeController } from './theme.controller';
import { Template } from '../template/entity/template.entity';
import { Theme } from './entity/theme.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Theme, Template])],
  controllers: [ThemeController],
  providers: [ThemeService],
  exports: [ThemeService],
})
export class ThemeModule {}
