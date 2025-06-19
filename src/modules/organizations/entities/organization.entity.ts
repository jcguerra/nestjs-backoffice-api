import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relación OneToMany con OrganizationOwner (tabla pivot)
  @OneToMany('OrganizationOwner', 'organization', {
    cascade: ['insert', 'update']
  })
  organizationOwners: any[];

  constructor(partial: Partial<Organization>) {
    Object.assign(this, partial);
  }
} 