// src/template/template.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { Template } from './entity/template.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { AdminGuard } from 'src/guards/admin.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Template]), CloudinaryModule],
  controllers: [TemplateController],
  providers: [TemplateService, AdminGuard],
})
export class TemplateModule {}
