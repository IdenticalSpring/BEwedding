import { Template } from 'src/models/template/entity/template.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('invitation')
export class Invitation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Thay đổi từ templateUser sang Template
    @OneToOne(() => Template, (template) => template.invitation, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'templateId' }) // Khóa ngoại kết nối với Template
    template: Template;

    @Column({ type: 'uuid', nullable: true })
    templateId: string;

    @Column({ type: 'json', nullable: true })
    metadata: Record<string, any>;
}
