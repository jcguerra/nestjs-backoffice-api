import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { User } from '../../users/entities/user.entity';

@Entity('organization_owners')
export class OrganizationOwner {
  @PrimaryColumn({ name: 'organization_id' })
  organizationId: string;

  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @Column({ default: 'OWNER' })
  role: string;

  @CreateDateColumn({ name: 'assigned_at' })
  assignedAt: Date;

  @Column({ name: 'assigned_by', nullable: true })
  assignedBy: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  // Relación ManyToOne con Organization
  @ManyToOne(() => Organization, organization => organization.organizationOwners, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  // Relación ManyToOne con User
  @ManyToOne(() => User, user => user.organizationOwnerships, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Relación ManyToOne con User para assignedBy
  @ManyToOne(() => User, user => user.id, {
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'assigned_by' })
  assignedByUser: User;

  constructor(partial: Partial<OrganizationOwner>) {
    Object.assign(this, partial);
  }
} 