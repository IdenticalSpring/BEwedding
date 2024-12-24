import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { InvitationService } from './invitation.service'; 

import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateInvitationDto } from './dto/create_invitation.dto';
import { UpdateInvitationDto } from './dto/update_invitation.dto';

@ApiTags('Invitations')
@Controller('invitations')
@ApiBearerAuth('JWT')
export class InvitationController {
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

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a public invitation by ID' })
    async remove(@Param('id') id: string) {
        return await this.invitationService.deleteInvitation(id);
    }
}
