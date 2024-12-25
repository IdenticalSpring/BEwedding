import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Invitation } from './entity/invitation.entity';
import { InvitationService } from './invitation.service';



@Module({
    imports: [TypeOrmModule.forFeature([Invitation])],
    providers: [InvitationService],
    exports: [InvitationService]
})
export class InvitationModule { }
