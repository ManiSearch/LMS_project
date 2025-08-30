import { User } from '@/contexts/AuthContext';

export interface Institution {
  id: number;
  name: string;
  code: string;
  type: string;
  educationalAuthority: string;
  programs_offered: string[];
  district: string;
  state: string;
  established_year: number;
  accreditation: string;
  status: string;
}

/**
 * Filters institutions based on user role and permissions
 * Super Admin can see all institutions
 * All other roles can only see their own institution
 */
export function filterInstitutionsByRole(
  institutions: Institution[],
  user: User | null
): Institution[] {
  if (!user) {
    return [];
  }

  // Super Admin can see all institutions
  if (user.role === 'super-admin') {
    return institutions;
  }

  // All other roles can only see their own institution
  const userInstitutionCode = user.institutionCode || user.institutionId || user.institution;
  
  if (!userInstitutionCode) {
    return [];
  }

  return institutions.filter((institution) => 
    institution.code === userInstitutionCode || 
    institution.id.toString() === userInstitutionCode
  );
}

/**
 * Checks if a user can access a specific institution
 */
export function canAccessInstitution(
  institutionCode: string,
  user: User | null
): boolean {
  if (!user) {
    return false;
  }

  // Super Admin can access any institution
  if (user.role === 'super-admin') {
    return true;
  }

  // Other roles can only access their own institution
  const userInstitutionCode = user.institutionCode || user.institutionId || user.institution;
  return userInstitutionCode === institutionCode;
}

/**
 * Gets the role-based access level description
 */
export function getRoleAccessDescription(user: User | null): string {
  if (!user) {
    return 'No access';
  }

  switch (user.role) {
    case 'super-admin':
      return 'All Institutions';
    case 'admin':
    case 'principal':
    case 'institution':
    case 'hod':
    case 'faculty':
    case 'student':
    case 'parent':
      return user.institution || 'Institution Not Assigned';
    default:
      return 'Limited Access';
  }
}

/**
 * Gets user-friendly role display name
 */
export function getRoleDisplayName(role: string): string {
  switch (role) {
    case 'super-admin':
      return 'Super Administrator';
    case 'admin':
      return 'Administrator';
    case 'principal':
      return 'Principal';
    case 'institution':
      return 'Institution Admin';
    case 'hod':
      return 'Head of Department';
    case 'faculty':
      return 'Faculty';
    case 'student':
      return 'Student';
    case 'parent':
      return 'Parent';
    default:
      return 'User';
  }
}

/**
 * Checks if user has institution management permissions
 */
export function hasInstitutionManagementAccess(user: User | null): boolean {
  if (!user) {
    return false;
  }

  return ['super-admin', 'admin', 'principal', 'institution'].includes(user.role);
}

/**
 * Checks if user can create/edit curriculum content
 */
export function canManageCurriculum(user: User | null): boolean {
  if (!user) {
    return false;
  }

  return ['super-admin', 'admin', 'principal', 'institution', 'hod', 'faculty'].includes(user.role);
}

/**
 * Checks if user can only view curriculum content (read-only)
 */
export function isReadOnlyAccess(user: User | null): boolean {
  if (!user) {
    return true;
  }

  return ['student', 'parent'].includes(user.role);
}
