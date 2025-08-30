import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Define types locally until permissions system is properly implemented
type ResourceType = 'students' | 'courses' | 'faculty' | 'exams' | 'users' | 'settings';
type CRUDOperation = 'create' | 'read' | 'update' | 'delete';

// Simple permission check function - can be enhanced later
const hasPermission = (userRole: string, resource: ResourceType, operation: CRUDOperation): boolean => {
  // Super admin has all permissions
  if (userRole === 'super-admin') return true;

  // Admin has most permissions except some critical operations
  if (userRole === 'admin') {
    return true; // For now, admin has all permissions
  }

  // Principal has permissions for academic operations
  if (userRole === 'principal') {
    return ['students', 'courses', 'faculty', 'exams'].includes(resource);
  }

  // Faculty has limited permissions
  if (userRole === 'faculty') {
    if (resource === 'students') return ['read', 'update'].includes(operation);
    if (resource === 'courses') return ['read', 'update'].includes(operation);
    return false;
  }

  // Students have very limited permissions
  if (userRole === 'student') {
    if (resource === 'courses') return operation === 'read';
    return false;
  }

  // Default deny
  return false;
};

interface PermissionGuardProps {
  resource?: ResourceType;
  operation?: CRUDOperation;
  permission?: string; // Support legacy permission prop
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * PermissionGuard component that conditionally renders children based on user permissions
 * Usage: <PermissionGuard resource="students" operation="create">
 *          <Button>Add Student</Button>
 *        </PermissionGuard>
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  resource,
  operation,
  permission,
  children,
  fallback = null
}) => {
  const { user } = useAuth();

  if (!user) {
    return <>{fallback}</>;
  }

  let hasAccess = false;

  if (permission) {
    // Legacy permission string support - for now, just return true
    // This would need proper implementation based on your permission system
    hasAccess = true;
  } else if (resource && operation) {
    hasAccess = hasPermission(user.role, resource, operation);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

interface CRUDButtonsProps {
  resource: ResourceType;
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

/**
 * CRUDButtons component that automatically shows/hides CRUD buttons based on permissions
 */
export const CRUDButtons: React.FC<CRUDButtonsProps> = ({
  resource,
  onAdd,
  onEdit,
  onDelete,
  onView,
  className = '',
  size = 'sm'
}) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <PermissionGuard resource={resource} operation="read">
        {onView && (
          <button
            onClick={onView}
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View
          </button>
        )}
      </PermissionGuard>

      <PermissionGuard resource={resource} operation="create">
        {onAdd && (
          <button
            onClick={onAdd}
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 border border-transparent rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Add
          </button>
        )}
      </PermissionGuard>

      <PermissionGuard resource={resource} operation="update">
        {onEdit && (
          <button
            onClick={onEdit}
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 border border-transparent rounded-md hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Edit
          </button>
        )}
      </PermissionGuard>

      <PermissionGuard resource={resource} operation="delete">
        {onDelete && (
          <button
            onClick={onDelete}
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        )}
      </PermissionGuard>
    </div>
  );
};

interface RoleBasedContentProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * RoleBasedContent component for role-based content rendering
 */
export const RoleBasedContent: React.FC<RoleBasedContentProps> = ({
  allowedRoles,
  children,
  fallback = null
}) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Export utility hooks for components
export const usePermissions = () => {
  const { user } = useAuth();

  const checkPermission = (resource: ResourceType, operation: CRUDOperation) => {
    if (!user) return false;
    return hasPermission(user.role, resource, operation);
  };

  const canCreate = (resource: ResourceType) => checkPermission(resource, 'create');
  const canRead = (resource: ResourceType) => checkPermission(resource, 'read');
  const canUpdate = (resource: ResourceType) => checkPermission(resource, 'update');
  const canDelete = (resource: ResourceType) => checkPermission(resource, 'delete');

  return {
    checkPermission,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    userRole: user?.role
  };
};

export default PermissionGuard;
