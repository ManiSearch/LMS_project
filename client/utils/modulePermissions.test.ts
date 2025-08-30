import { hasModuleAccess, getAccessibleModules, validateModuleRoute } from './modulePermissions';
import { UserRole } from '@/contexts/AuthContext';

// Test suite for module permissions
describe('Module Permission System', () => {
  // Test super-admin access
  test('super-admin should have access to all modules including master-setup', () => {
    const role: UserRole = 'super-admin';
    expect(hasModuleAccess(role, 'master-setup')).toBe(true);
    expect(hasModuleAccess(role, 'academic-operation')).toBe(true);
    expect(hasModuleAccess(role, 'lms')).toBe(true);
    expect(hasModuleAccess(role, 'examination')).toBe(true);
    
    const accessibleModules = getAccessibleModules(role);
    expect(accessibleModules).toContain('master-setup');
    expect(accessibleModules.length).toBeGreaterThan(10);
  });

  // Test admin access
  test('admin should have access to basic modules but NOT master-setup', () => {
    const role: UserRole = 'admin';
    expect(hasModuleAccess(role, 'master-setup')).toBe(false);
    expect(hasModuleAccess(role, 'academic-operation')).toBe(true);
    expect(hasModuleAccess(role, 'lms')).toBe(true);
    expect(hasModuleAccess(role, 'examination')).toBe(true);
    
    const accessibleModules = getAccessibleModules(role);
    expect(accessibleModules).not.toContain('master-setup');
  });

  // Test student access
  test('student should have limited access to academic modules', () => {
    const role: UserRole = 'student';
    expect(hasModuleAccess(role, 'master-setup')).toBe(false);
    expect(hasModuleAccess(role, 'academic-operation')).toBe(true);
    expect(hasModuleAccess(role, 'lms')).toBe(true);
    expect(hasModuleAccess(role, 'examination')).toBe(true);
    
    const accessibleModules = getAccessibleModules(role);
    expect(accessibleModules).not.toContain('master-setup');
    expect(accessibleModules).toEqual(['academic-operation', 'lms', 'examination']);
  });

  // Test faculty access
  test('faculty should have access to academic modules but not master-setup', () => {
    const role: UserRole = 'faculty';
    expect(hasModuleAccess(role, 'master-setup')).toBe(false);
    expect(hasModuleAccess(role, 'academic-operation')).toBe(true);
    expect(hasModuleAccess(role, 'lms')).toBe(true);
    expect(hasModuleAccess(role, 'examination')).toBe(true);
  });

  // Test institution/principal access
  test('institution and principal should have same access as faculty', () => {
    const institutionRole: UserRole = 'institution';
    const principalRole: UserRole = 'principal';
    
    expect(hasModuleAccess(institutionRole, 'master-setup')).toBe(false);
    expect(hasModuleAccess(principalRole, 'master-setup')).toBe(false);
    
    expect(hasModuleAccess(institutionRole, 'academic-operation')).toBe(true);
    expect(hasModuleAccess(principalRole, 'academic-operation')).toBe(true);
  });

  // Test staff access (dynamic/configurable)
  test('staff should have basic academic access', () => {
    const role: UserRole = 'staff';
    expect(hasModuleAccess(role, 'master-setup')).toBe(false);
    expect(hasModuleAccess(role, 'academic-operation')).toBe(true);
    expect(hasModuleAccess(role, 'lms')).toBe(true);
    expect(hasModuleAccess(role, 'examination')).toBe(true);
  });

  // Test route validation
  test('validateModuleRoute should correctly validate access', () => {
    const superAdminValidation = validateModuleRoute('super-admin', 'master-setup');
    expect(superAdminValidation.hasAccess).toBe(true);
    expect(superAdminValidation.error).toBeUndefined();

    const studentValidation = validateModuleRoute('student', 'master-setup');
    expect(studentValidation.hasAccess).toBe(false);
    expect(studentValidation.error).toContain('Access denied');
  });

  // Test invalid module ID
  test('should handle invalid module IDs gracefully', () => {
    const validation = validateModuleRoute('admin', 'invalid-module');
    expect(validation.hasAccess).toBe(false);
    expect(validation.moduleType).toBe(null);
    expect(validation.error).toContain('Invalid module ID');
  });

  // Test role hierarchy implementation
  test('role hierarchy should be properly implemented', () => {
    // Super admin should have most access
    const superAdminModules = getAccessibleModules('super-admin');
    const adminModules = getAccessibleModules('admin');
    const studentModules = getAccessibleModules('student');
    
    expect(superAdminModules.length).toBeGreaterThan(adminModules.length);
    expect(adminModules.length).toBeGreaterThanOrEqual(studentModules.length);
    
    // Master setup should only be accessible to super-admin
    expect(superAdminModules).toContain('master-setup');
    expect(adminModules).not.toContain('master-setup');
    expect(studentModules).not.toContain('master-setup');
  });
});

// Manual test helper functions that can be used for debugging
export const runManualTests = () => {
  console.log('=== Manual Module Access Tests ===');
  
  const roles: UserRole[] = ['super-admin', 'admin', 'faculty', 'student', 'staff'];
  const criticalModules = ['master-setup', 'academic-operation', 'lms', 'examination'];
  
  roles.forEach(role => {
    console.log(`\n${role.toUpperCase()} Access:`);
    criticalModules.forEach(module => {
      const hasAccess = hasModuleAccess(role, module as any);
      console.log(`  ${module}: ${hasAccess ? '✅' : '❌'}`);
    });
    
    const totalModules = getAccessibleModules(role).length;
    console.log(`  Total accessible modules: ${totalModules}`);
  });
  
  console.log('\n=== Master Setup Restriction Test ===');
  roles.forEach(role => {
    const canAccessMaster = hasModuleAccess(role, 'master-setup');
    console.log(`${role}: Master Setup access = ${canAccessMaster ? 'GRANTED ✅' : 'DENIED ❌'}`);
  });
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testModulePermissions = runManualTests;
}
