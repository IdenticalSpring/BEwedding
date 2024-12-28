// src/template/template.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateUserService } from './template-user.service';
import { TemplateController } from './template-user.controller';
import { templateUser } from './entity/template-user.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Template } from '../template/entity/template.entity';
import { Invitation_User } from '../invitation_user/entity/invitation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([templateUser,Template,Invitation_User]), CloudinaryModule],
  controllers: [TemplateController],
  providers: [TemplateUserService],
  exports: [TemplateUserService],
})
export class TemplateUserModule {}
