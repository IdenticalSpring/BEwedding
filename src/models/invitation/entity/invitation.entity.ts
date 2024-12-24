import { templateUser } from "src/models/template-user/entity/template-user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('invitation')
export class Invitation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    message: string;

    @Column({ type: 'varchar', nullable: true })
    audience: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => templateUser, (templateUser) => templateUser.invitation, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'template_userId' })
    templateUser: templateUser;

    @Column({ type: 'uuid', nullable: true })
    template_userId: string;

    @Column({ type: 'json', nullable: true })
    metadata: Record<string, any>;
}
