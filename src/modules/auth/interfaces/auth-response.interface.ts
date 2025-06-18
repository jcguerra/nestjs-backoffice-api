import { UserRole } from '../../../common/enums/user-role.enum';

export interface PublicUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: PublicUser;
} 