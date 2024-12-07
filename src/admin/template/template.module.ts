import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from 'src/models/cloudinary/cloudinary.module';
import { AdminTemplateController } from './template.controller';
import { TemplateService } from 'src/models/template/template.service';
import { Template } from 'src/models/template/entity/template.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Template]), CloudinaryModule],
  controllers: [AdminTemplateController],
  providers: [TemplateService],
})
export class AdminTemplateModule {}