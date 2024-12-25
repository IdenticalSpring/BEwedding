import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { InvitationService } from 'src/models/invitation/invitation.service'; 


import { CreateInvitationDto } from 'src/models/invitation/dto/create_invitation.dto'; 
import { UpdateInvitationDto } from 'src/models/invitation/dto/update_invitation.dto'; 

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('admin/Invitations')
@Controller('admin/invitations')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class InvitationAdminController {
    constructor(private readonly invitationService: InvitationService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new public invitation' })
    async create(@Body() createDto: CreateInvitationDto) {
        return await this.invitationService.createInvitation(createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all public invitations' })
    async findAll() {
        return await this.invitationService.getAllInvitations();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a public invitation by ID' })
    async findOne(@Param('id') id: string) {
        return await this.invitationService.getInvitationById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a public invitation by ID' })
    async update(@Param('id') id: string, @Body() updateDto: UpdateInvitationDto) {
        return await this.invitationService.updateInvitation(id, updateDto);
    }

    @Delete('by-template/:templateUserId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete an invitation by template_userId' })
    async deleteByTemplateUserId(@Param('templateUserId') templateUserId: string): Promise<void> {
        await this.invitationService.deleteInvitationByTemplateUserId(templateUserId);
    }

}
