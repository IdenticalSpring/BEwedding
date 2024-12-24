import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Invitation } from './entity/invitation.entity'; 

@Injectable()
export class InvitationService {
    private readonly logger = new Logger(InvitationService.name);
    constructor(
        @InjectRepository(Invitation)
        private readonly invitationRepository: Repository<Invitation>,
    ) { }

    async createInvitation(data: Partial<Invitation>): Promise<Invitation> {
        const invitation = this.invitationRepository.create(data);
        return await this.invitationRepository.save(invitation);
    }

    async updateInvitation(id: string, data: Partial<Invitation>): Promise<Invitation> {
        const invitation = await this.invitationRepository.findOne({ where: { id } });
        if (!invitation) {
            throw new Error('Invitation not found');
        }
        Object.assign(invitation, data);
        return await this.invitationRepository.save(invitation);
    }

    async deleteInvitationByTemplateUserId(templateUserId: string): Promise<void> {
        const result = await this.invitationRepository.delete({ template_userId: templateUserId });
        if (result.affected === 0) {
            throw new Error('Invitation not found or already deleted for the given template_userId');
        }
    }


    async getAllInvitations(): Promise<Invitation[]> {
        return await this.invitationRepository.find();
    }

    async getInvitationById(id: string): Promise<Invitation> {
        this.logger.log(`Fetching invitation with ID: ${id}`);
        const invitation = await this.invitationRepository.findOne({ where: { id } });

        if (!invitation) {
            this.logger.warn(`Invitation with ID ${id} not found`);
            throw new NotFoundException(`Invitation with ID "${id}" not found`);
        }

        this.logger.log(`Invitation found: ${JSON.stringify(invitation)}`);
        return invitation;
    }
}