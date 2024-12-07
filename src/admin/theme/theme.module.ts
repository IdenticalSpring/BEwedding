import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThemeService } from 'src/models/theme/theme.service'; 
import { AdminThemeController } from './theme.controller'; 
import { Template } from 'src/models/template/entity/template.entity';
import { Theme } from 'src/models/theme/entity/theme.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([Theme, Template])],
  controllers: [AdminThemeController],
  providers: [ThemeService],
})
export class AdminThemeModule {}
