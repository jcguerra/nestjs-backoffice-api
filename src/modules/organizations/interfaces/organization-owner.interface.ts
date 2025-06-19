export interface IOrganizationOwner {
  organizationId: string;
  userId: string;
  role: string;
  assignedAt: Date;
  assignedBy: string | null;
  isActive: boolean;
} 