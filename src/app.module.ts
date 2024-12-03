import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './auth/auth.module';
import { GlobalAuthGuard } from './auth/guards/global-auth.guard';
import { CloudinaryModule } from './models/cloudinary/cloudinary.module';
import { User } from './models/user/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { Template } from './models/template/entity/template.entity';
import { Theme } from './models/theme/entity/theme.enity';
import { TemplateModule } from './models/template/template.module';
import { ThemeModule } from './models/theme/theme.module';
import { EventDetail } from './models/event-details/entity/event-details.entity';
import { GallerySection } from './models/gallery-section/entity/gallery-section.entity';
import { GuestList } from './models/guest/entity/guest.entity';
import { GuestbookSection } from './models/guestbook-section/entity/guestbook-section.enity';
import { HeaderSection } from './models/header-section/entity/header-section.entity';
import { WeddingDetail } from './models/wedding-details/enitity/wedding-details.enity';
import { AboutSection } from './models/about-section/entity/about-section.entity';
import { EventDetailModule } from './models/event-details/event-details.module';
import { GallerySectionModule } from './models/gallery-section/gallery-section.module';
import { GuestListModule } from './models/guest/guest.module';
import { GuestbookSectionModule } from './models/guestbook-section/guestbook-section.module';
import { HeaderSectionsModule } from './models/header-section/header-section.module';
import { WeddingDetailModule } from './models/wedding-details/wedding-details.module';
import { AboutSectionModule } from './models/about-section/about-section.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        User,
        Template,
        Theme,
        EventDetail,
        GallerySection,
        GuestList,
        GuestbookSection,
        HeaderSection,
        WeddingDetail,
        AboutSection,
      ],
      synchronize: false,
    }),
    MulterModule.register({
      dest: './uploads',
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
    AuthModule,

    // Wedding template
    TemplateModule,
    ThemeModule,
    EventDetailModule,
    GallerySectionModule,
    AboutSectionModule,
    GuestListModule,
    GuestbookSectionModule,
    HeaderSectionsModule,
    WeddingDetailModule,
    // Cloudinary
    CloudinaryModule,

    //Module Admin
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GlobalAuthGuard,
    },
  ],
})
export class AppModule {}
