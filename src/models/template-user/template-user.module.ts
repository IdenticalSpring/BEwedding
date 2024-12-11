// src/template/template.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateUserService } from './template-user.service';
import { TemplateController } from './template-user.controller';
import { templateUser } from './entity/template-user.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([templateUser]), CloudinaryModule],
  controllers: [TemplateController],
  providers: [TemplateUserService],
  exports: [TemplateUserService],
})
export class TemplateUserModule {}
