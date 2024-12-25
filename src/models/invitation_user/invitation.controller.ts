import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { InvitationUserService } from './invitation.service'; 

import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserInvitationDto } from './dto/create_invitation.dto';
import { UpdateUserInvitationDto } from './dto/update_invitation.dto';
import { Invitation_User } from './entity/invitation.entity'; 

@ApiTags('Invitations_user')
@Controller('invitations_user')
@ApiBearerAuth('JWT')
export class InvitationUserController {
    constructor(private readonly invitationUserService: InvitationUserService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new public invitation' })
    async create(@Body() createDto: CreateUserInvitationDto) {
        return await this.invitationUserService.createInvitation(createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all public invitations' })
    async findAll() {
        return await this.invitationUserService.getAllInvitations();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a public invitation by ID' })
    async findOne(@Param('id') id: string) {
        return await this.invitationUserService.getInvitationById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a public invitation by ID' })
    async update(@Param('id') id: string, @Body() updateDto: UpdateUserInvitationDto) {
        return await this.invitationUserService.updateInvitation(id, updateDto);
    }

    @Delete('by-template/:templateUserId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete an invitation by template_userId' })
    async deleteByTemplateUserId(@Param('templateUserId') templateUserId: string): Promise<void> {
        await this.invitationUserService.deleteInvitationByTemplateUserId(templateUserId);
    }

}
