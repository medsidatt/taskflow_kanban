import { Role } from './role.model';

export interface User {
  id: string; // UUID
  username: string;
  email: string;
  active?: boolean;
  lastLogin?: string;
  roles?: Role[];
}

export interface UserSummaryDto {
  id: string;
  username: string;
  email: string;
}

export interface UserProfileDto extends UserSummaryDto {
  active: boolean;
  lastLogin?: string;
}

export interface UserCreateDto {
  username: string;
  email: string;
  password: string;
}

export interface UserUpdateDto {
  username?: string;
  email?: string;
}
