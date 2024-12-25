import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invitation } from 'src/models/invitation/entity/invitation.entity';
import { InvitationAdminController } from './invitation.controller'; 
import { InvitationService } from 'src/models/invitation/invitation.service';

@Module({
    imports: [TypeOrmModule.forFeature([Invitation])],
    providers: [InvitationService],
    controllers: [InvitationAdminController],
})
export class InvitationAdminModule { }
