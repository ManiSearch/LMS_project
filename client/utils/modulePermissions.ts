import { UserRole } from '@/contexts/AuthContext';

// Define all available modules in the system
export type ModuleType = 
  | 'core-setup'
  | 'academic-operation'
  | 'admission'
  | 'student-support'
  | 'lms'
  | 'examination'
  | 'alumni-management'
  | 'hostel'
  | 'library'
  | 'procurement'
  | 'asset-management'
  | 'finance-management'
  | 'hrms'
  | 'payroll'
  | 'affiliation'
  | 'gte'
  | 'research'
  | 'master-setup';

// Module access matrix based on role hierarchy
export const moduleAccessMatrix: Record<UserRole, ModuleType[]> = {
  'super-admin': [
    // Super admin has access to ALL modules
    'academic-operation',
    'admission',
    'student-support',
    'lms',
    'examination',
    'alumni-management',
    'hostel',
    'library',
    'procurement',
    'asset-management',
    'finance-management',
    'hrms',
    'payroll',
    'affiliation',
    'gte',
    'research',
    'master-setup'
  ],
  
  admin: [
    // Admin has access to core academic modules
    'academic-operation',
    'lms',
    'examination'
  ],
  
  institution: [
    // Institution head has access to academic modules
    'academic-operation',
    'lms',
    'examination'
  ],
  
  principal: [
    // Principal has access to academic modules
    'academic-operation',
    'lms',
    'examination'
  ],
  
  hod: [
    // Head of Department has access to academic modules
    'academic-operation',
    'lms',
    'examination'
  ],
  
  faculty: [
    // Faculty has access to academic modules
    'academic-operation',
    'lms',
    'examination'
  ],
  
  student: [
    // Students have access to academic modules
    'academic-operation',
    'lms',
    'examination'
  ],
  
  staff: [
    // Staff access is dynamic and configurable
    // For now, giving basic academic access
    'academic-operation',
    'lms',
    'examination'
  ],
  
  parent: [
    // Parents have limited access for monitoring
    'academic-operation',
    'lms',
    'examination'
  ]
};

// Special module configurations
export const specialModuleConfig = {
  'master-setup': {
    // Master Setup is only accessible to super-admin
    allowedRoles: ['super-admin'] as UserRole[],
    description: 'Master Setup provides access to all system modules and configurations',
    requiresSpecialPermission: true,
    // When accessing master-setup, only super-admin can see all modules
    allowsUniversalAccess: (userRole: UserRole) => userRole === 'super-admin'
  }
};

// Check if a user in a specific module context can access other modules
export const canAccessAllModulesInContext = (userRole: UserRole, currentModule: ModuleType): boolean => {
  if (currentModule === 'master-setup') {
    return specialModuleConfig['master-setup'].allowsUniversalAccess(userRole);
  }
  return false;
};

// Core function to check if a role has access to a specific module
export const hasModuleAccess = (userRole: UserRole, moduleId: ModuleType): boolean => {
  // Check if user role exists in the matrix
  if (!moduleAccessMatrix[userRole]) {
    console.warn(`No module access defined for role: ${userRole}`);
    return false;
  }

  // Special handling for Master Setup
  if (moduleId === 'master-setup') {
    return specialModuleConfig['master-setup'].allowedRoles.includes(userRole);
  }

  // Check if the module is in the user's allowed modules
  return moduleAccessMatrix[userRole].includes(moduleId);
};

// Get all accessible modules for a role
export const getAccessibleModules = (userRole: UserRole): ModuleType[] => {
  if (!moduleAccessMatrix[userRole]) {
    console.warn(`No module access defined for role: ${userRole}`);
    return [];
  }
  
  return moduleAccessMatrix[userRole];
};

// Get modules that are restricted for a role
export const getRestrictedModules = (userRole: UserRole): ModuleType[] => {
  const allModules: ModuleType[] = [
    'core-setup',
    'academic-operation',
    'admission', 
    'student-support',
    'lms',
    'examination',
    'alumni-management',
    'hostel',
    'library',
    'procurement',
    'asset-management',
    'finance-management',
    'hrms',
    'payroll',
    'affiliation',
    'gte',
    'research',
    'master-setup'
  ];
  
  const accessibleModules = getAccessibleModules(userRole);
  return allModules.filter(module => !accessibleModules.includes(module));
};

// Check if role can access multiple modules
export const hasAccessToAnyModule = (userRole: UserRole, moduleIds: ModuleType[]): boolean => {
  return moduleIds.some(moduleId => hasModuleAccess(userRole, moduleId));
};

// Check if role can access all specified modules
export const hasAccessToAllModules = (userRole: UserRole, moduleIds: ModuleType[]): boolean => {
  return moduleIds.every(moduleId => hasModuleAccess(userRole, moduleId));
};

// Get module access summary for a role
export const getModuleAccessSummary = (userRole: UserRole) => {
  const accessible = getAccessibleModules(userRole);
  const restricted = getRestrictedModules(userRole);
  
  return {
    role: userRole,
    totalModules: accessible.length + restricted.length,
    accessibleModules: accessible,
    restrictedModules: restricted,
    accessPercentage: Math.round((accessible.length / (accessible.length + restricted.length)) * 100)
  };
};

// Helper function to validate module ID
export const isValidModuleId = (moduleId: string): moduleId is ModuleType => {
  const validModules: ModuleType[] = [
    'core-setup',
    'academic-operation',
    'admission',
    'student-support', 
    'lms',
    'examination',
    'alumni-management',
    'hostel',
    'library',
    'procurement',
    'asset-management',
    'finance-management',
    'hrms',
    'payroll',
    'affiliation',
    'gte',
    'research',
    'master-setup'
  ];
  
  return validModules.includes(moduleId as ModuleType);
};

// Get module priority/importance level for sorting
export const getModulePriority = (moduleId: ModuleType): number => {
  const priorityMap: Record<ModuleType, number> = {
    'master-setup': 1,           // Highest priority for admins
    'academic-operation': 2,      // Core academic module
    'lms': 3,                    // Learning management
    'examination': 4,            // Examination system
    'student-support': 5,        // Student services
    'admission': 6,              // Admission process
    'hrms': 7,                   // HR management
    'finance-management': 8,     // Financial operations
    'library': 9,                // Library services
    'hostel': 10,                // Hostel management
    'alumni-management': 11,     // Alumni services
    'procurement': 12,           // Procurement
    'asset-management': 13,      // Asset tracking
    'payroll': 14,               // Payroll processing
    'affiliation': 15,           // Affiliation management
    'gte': 16,                   // Government technical education
    'research': 17               // Research management
  };
  
  return priorityMap[moduleId] || 999;
};

// Sort modules by priority for a given role
export const sortModulesByPriority = (modules: ModuleType[]): ModuleType[] => {
  return modules.sort((a, b) => getModulePriority(a) - getModulePriority(b));
};

// Check if a module requires special permissions
export const requiresSpecialPermission = (moduleId: ModuleType): boolean => {
  if (moduleId === 'master-setup') {
    return specialModuleConfig['master-setup'].requiresSpecialPermission;
  }
  return false;
};

// Get module category for grouping
export const getModuleCategory = (moduleId: ModuleType): string => {
  const categoryMap: Record<ModuleType, string> = {
    'master-setup': 'System Administration',
    'academic-operation': 'Academic Management',
    'lms': 'Learning Management',
    'examination': 'Assessment & Evaluation',
    'student-support': 'Student Services',
    'admission': 'Enrollment & Registration',
    'hrms': 'Human Resources',
    'payroll': 'Finance & Payroll',
    'finance-management': 'Finance & Payroll',
    'library': 'Academic Resources',
    'hostel': 'Campus Services',
    'alumni-management': 'Community & Relations',
    'procurement': 'Operations & Procurement',
    'asset-management': 'Operations & Procurement',
    'affiliation': 'Institutional Management',
    'gte': 'Government Programs',
    'research': 'Research & Development'
  };
  
  return categoryMap[moduleId] || 'Other';
};

// Get all modules grouped by category for a role
export const getModulesByCategory = (userRole: UserRole): Record<string, ModuleType[]> => {
  const accessibleModules = getAccessibleModules(userRole);
  const grouped: Record<string, ModuleType[]> = {};
  
  accessibleModules.forEach(module => {
    const category = getModuleCategory(module);
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(module);
  });
  
  // Sort modules within each category
  Object.keys(grouped).forEach(category => {
    grouped[category] = sortModulesByPriority(grouped[category]);
  });
  
  return grouped;
};

// Validate module access for route protection
export const validateModuleRoute = (userRole: UserRole, moduleId: string): {
  hasAccess: boolean;
  moduleType: ModuleType | null;
  error?: string;
} => {
  // Validate module ID format
  if (!isValidModuleId(moduleId)) {
    return {
      hasAccess: false,
      moduleType: null,
      error: `Invalid module ID: ${moduleId}`
    };
  }

  // Check access
  const hasAccess = hasModuleAccess(userRole, moduleId);

  return {
    hasAccess,
    moduleType: moduleId,
    error: hasAccess ? undefined : `Access denied to module: ${moduleId} for role: ${userRole}`
  };
};

// Get display-friendly role name
export const getRoleDisplayName = (role: UserRole): string => {
  const roleDisplayNames: Record<UserRole, string> = {
    'super-admin': 'Super Administrator',
    'admin': 'Administrator',
    'institution': 'Institution Head',
    'principal': 'Principal',
    'hod': 'Head of Department',
    'faculty': 'Faculty Member',
    'staff': 'Staff Member',
    'student': 'Student',
    'parent': 'Parent'
  };

  return roleDisplayNames[role] || role;
};

// Get display-friendly module name
export const getModuleDisplayName = (moduleId: ModuleType): string => {
  const moduleDisplayNames: Record<ModuleType, string> = {
    'academic-operation': 'Academic Operations',
    'admission': 'Admission Management',
    'student-support': 'Student Support',
    'lms': 'Learning Management System',
    'examination': 'Examination System',
    'alumni-management': 'Alumni Management',
    'hostel': 'Hostel Management',
    'library': 'Library Management',
    'procurement': 'Procurement',
    'asset-management': 'Asset Management',
    'finance-management': 'Finance Management',
    'hrms': 'Human Resource Management',
    'payroll': 'Payroll Management',
    'affiliation': 'Affiliation Management',
    'gte': 'Government Technical Education',
    'research': 'Research Management',
    'master-setup': 'Master Setup'
  };

  return moduleDisplayNames[moduleId] || moduleId;
};

// Map module IDs from landing page to internal module types
export const mapModuleId = (landingPageModuleId: string): ModuleType | null => {
  const moduleIdMap: Record<string, ModuleType> = {
    'academics': 'academic-operation',
    'academic-operation': 'academic-operation',
    'admission': 'admission',
    'student-support': 'student-support',
    'lms': 'lms',
    'learning-management': 'lms',
    'examination': 'examination',
    'examinations': 'examination',
    'exams': 'examination',
    'alumni': 'alumni-management',
    'alumni-management': 'alumni-management',
    'hostel': 'hostel',
    'library': 'library',
    'procurement': 'procurement',
    'asset-management': 'asset-management',
    'finance': 'finance-management',
    'finance-management': 'finance-management',
    'hrms': 'hrms',
    'payroll': 'payroll',
    'affiliation': 'affiliation',
    'gte': 'gte',
    'research': 'research',
    'master-setup': 'master-setup',
    'core-system': 'master-setup'
  };

  return moduleIdMap[landingPageModuleId] || null;
};
