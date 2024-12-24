import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Invitation } from './entity/invitation.entity'; 

@Injectable()
export class InvitationService {
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

    async deleteInvitation(id: string): Promise<void> {
        const result = await this.invitationRepository.delete(id);
        if (result.affected === 0) {
            throw new Error('Invitation not found or already deleted');
        }
    }

    async getAllInvitations(): Promise<Invitation[]> {
        return await this.invitationRepository.find();
    }

    async getInvitationById(id: string): Promise<Invitation> {
        const invitation = await this.invitationRepository.findOne({ where: { id } });
        if (!invitation) {
            throw new Error('Invitation not found');
        }
        return invitation;
    }
}