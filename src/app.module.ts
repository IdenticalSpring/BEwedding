import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './auth/auth.module';
import { GlobalAuthGuard } from './auth/guards/global-auth.guard';
import { CloudinaryModule } from './models/cloudinary/cloudinary.module';
import { User } from './models/user/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { flatten, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { Template } from './models/template/entity/template.entity';
import { Theme } from './models/theme/entity/theme.entity';
import { TemplateModule } from './models/template/template.module';
import { ThemeModule } from './models/theme/theme.module';
import { EventDetail } from './models/event-details/entity/event-details.entity';
import { GallerySection } from './models/gallery-section/entity/gallery-section.entity';
import { GuestList } from './models/guest/entity/guest.entity';
import { GuestbookSection } from './models/guestbook-section/entity/guestbook-section.entity';
import { HeaderSection } from './models/header-section/entity/header-section.entity';
import { WeddingDetail } from './models/wedding-details/entity/wedding-details.entity';
import { AboutSection } from './models/about-section/entity/about-section.entity';
import { EventDetailModule } from './models/event-details/event-details.module';
import { GallerySectionModule } from './models/gallery-section/gallery-section.module';
import { GuestListModule } from './models/guest/guest.module';
import { GuestbookSectionModule } from './models/guestbook-section/guestbook-section.module';
import { HeaderSectionsModule } from './models/header-section/header-section.module';
import { WeddingDetailModule } from './models/wedding-details/wedding-details.module';
import { AboutSectionModule } from './models/about-section/about-section.module';
import { UserModule } from './models/user/user.module';
import { Section } from './models/section/entity/section.entity';
import { SectionModule } from './models/section/section.module';
import { AdminAboutSectionModule } from './admin/about-section/about-section.module';
import { AdminEventDetailModule } from './admin/event-details/event-details.module';
import { AdminGallerySectionModule } from './admin/gallery-section/gallery-section.module';
import { AdminGuestbookSectionModule } from './admin/guestbook-section/guestbook-section.module';
import { AdminSectionModule } from './admin/section/section.module';
import { AdminTemplateModule } from './admin/template/template.module';
import { AdminUserModule } from './admin/user/user.module';
import { AdminWeddingDetailModule } from './admin/wedding-details/wedding-details.module';
import { AdminThemeModule } from './admin/theme/theme.module';
import { AdminGuestListModule } from './admin/guest/guest.module';
import { SectionUser } from './models/section-user/entity/section-user.entity';
import { templateUser } from './models/template-user/entity/template-user.entity';
import { TemplateUserModule } from './models/template-user/template-user.module';
import { SectionUserModule } from './models/section-user/section-user.module';
import { SubscriptionPlanModule } from './models/subscription_plan/subscription-plan.module';
import { SubscriptionPlan } from './models/subscription_plan/entity/subscription-plan.entity';
import { Subscription } from './models/subscription/entity/subscription.entity';
import { SubscriptionModule } from './models/subscription/subscription.module';
import { PayOSModule } from './models/subscription/payos.module';
import { AdminSubscriptionModule } from './admin/supcription/subscription.module';
import { AdminSubscriptionPlanModule } from './admin/supcription_plan/subscription-plan.module';
import { InvitationModule } from './models/invitation/invitation.module';
import { Invitation } from './models/invitation/entity/invitation.entity';

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
        Section,
        SectionUser,
        templateUser,
        SubscriptionPlan,
        Subscription,
        Invitation,
      ],
      synchronize: false,
    }),
    MulterModule.register({
      dest: './uploads',
      limits: {
        fileSize: 1 * 1024 * 1024,
      },
    }),
    AuthModule,
    UserModule,
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
    SectionModule,
    TemplateUserModule,
    SectionUserModule,
    SubscriptionPlanModule,
    SubscriptionModule,
    PayOSModule,
    InvitationModule,
    // Cloudinary
    CloudinaryModule,

    //Module Admin
    AdminAboutSectionModule,
    AdminEventDetailModule,
    AdminGallerySectionModule,
    AdminGuestListModule,
    AdminGuestbookSectionModule,
    AdminSectionModule,
    AdminTemplateModule,
    AdminUserModule,
    AdminWeddingDetailModule,
    AdminThemeModule,
    AdminSubscriptionModule,
    AdminSubscriptionPlanModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GlobalAuthGuard,
    },
  ],
})
export class AppModule {}
