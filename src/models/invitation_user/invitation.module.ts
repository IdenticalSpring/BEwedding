import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Invitation_User } from './entity/invitation.entity';
import { InvitationUserService } from './invitation.service';
import { InvitationUserController } from './invitation.controller';


@Module({
    imports: [TypeOrmModule.forFeature([Invitation_User])],
    providers: [InvitationUserService],
    controllers: [InvitationUserController],
})
export class InvitationUserModule { }
