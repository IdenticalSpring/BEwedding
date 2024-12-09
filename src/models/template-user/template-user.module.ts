// src/template/template.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateUserService } from './template-user.service';
import { TemplateUserController } from './template-user.controller';
import { TemplateUser } from './entity/template-user.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([TemplateUser]), CloudinaryModule],
  controllers: [TemplateUserController],
  providers: [TemplateUserService],
})
export class TemplateUserModule {}
