import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { hasModuleAccess, ModuleType, validateModuleRoute } from '@/utils/modulePermissions';
import { ModuleAccessDenied } from '@/components/AccessDenied';

interface ModuleProtectedRouteProps {
  children: React.ReactNode;
  moduleId: ModuleType;
  fallback?: React.ReactNode;
}

export default function ModuleProtectedRoute({
  children,
  moduleId,
  fallback
}: ModuleProtectedRouteProps) {
  const { user } = useAuth();

  // If no user, redirect to login (handled by parent ProtectedRoute)
  if (!user) {
    return null;
  }

  // Validate module access
  const validation = validateModuleRoute(user.role, moduleId);

  if (!validation.hasAccess) {
    // Show custom fallback or default access denied
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return <ModuleAccessDenied moduleId={moduleId} />;
  }

  // User has access, render children
  return <>{children}</>;
}

// Higher-order component for module protection
export function withModuleProtection<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  moduleId: ModuleType,
  fallback?: React.ReactNode
) {
  const ModuleProtectedComponent = (props: P) => {
    return (
      <ModuleProtectedRoute moduleId={moduleId} fallback={fallback}>
        <WrappedComponent {...props} />
      </ModuleProtectedRoute>
    );
  };

  ModuleProtectedComponent.displayName = `ModuleProtected(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return ModuleProtectedComponent;
}

// Hook for checking module access within components
export function useModuleAccess(moduleId: ModuleType) {
  const { user } = useAuth();
  
  if (!user) {
    return {
      hasAccess: false,
      user: null,
      validation: {
        hasAccess: false,
        moduleType: null,
        error: 'No user authenticated'
      }
    };
  }

  const validation = validateModuleRoute(user.role, moduleId);
  
  return {
    hasAccess: validation.hasAccess,
    user,
    validation
  };
}

// Component for conditional rendering based on module access
interface ModuleGuardProps {
  moduleId: ModuleType;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

export function ModuleGuard({ 
  moduleId, 
  children, 
  fallback = null, 
  showFallback = false 
}: ModuleGuardProps) {
  const { hasAccess } = useModuleAccess(moduleId);
  
  if (!hasAccess) {
    return showFallback ? <>{fallback}</> : null;
  }
  
  return <>{children}</>;
}

// Utility component for Master Setup specific protection
export function MasterSetupProtection({ children }: { children: React.ReactNode }) {
  return (
    <ModuleProtectedRoute moduleId="master-setup">
      {children}
    </ModuleProtectedRoute>
  );
}

// Multi-module protection (user must have access to ANY of the specified modules)
interface MultiModuleProtectedRouteProps {
  children: React.ReactNode;
  moduleIds: ModuleType[];
  requireAll?: boolean; // If true, user must have access to ALL modules
  fallback?: React.ReactNode;
}

export function MultiModuleProtectedRoute({
  children,
  moduleIds,
  requireAll = false,
  fallback
}: MultiModuleProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const hasAccess = requireAll
    ? moduleIds.every(moduleId => hasModuleAccess(user.role, moduleId))
    : moduleIds.some(moduleId => hasModuleAccess(user.role, moduleId));

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <ModuleAccessDenied 
        moduleId={moduleIds.length === 1 ? moduleIds[0] : `${moduleIds.length} modules`} 
      />
    );
  }

  return <>{children}</>;
}
