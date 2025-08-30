import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  hasModuleAccess,
  ModuleType,
  isValidModuleId,
} from "@/utils/modulePermissions";
import AccessDenied from "./AccessDenied";

interface ModuleScopeProtectedRouteProps {
  children: React.ReactNode;
  requiredModule: ModuleType;
}

export default function ModuleScopeProtectedRoute({
  children,
  requiredModule,
}: ModuleScopeProtectedRouteProps) {
  const { user } = useAuth();
  const location = useLocation();

  // Get scoping information from location state
  const scopedToModule = location.state?.scopedToModule;
  const selectedModule = location.state?.selectedModule;

  // Debug logging
  console.log("🔍 ModuleScopeProtectedRoute Debug:", {
    user: user,
    userRole: user?.role,
    requiredModule,
    hasModuleAccess: user
      ? hasModuleAccess(user.role, requiredModule)
      : "no user",
    scopedToModule,
    selectedModule,
    pathname: location.pathname,
  });

  // If not authenticated, redirect to login
  if (!user) {
    console.log("❌ No user authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has access to the required module
  const hasAccess = hasModuleAccess(user.role, requiredModule);
  if (!hasAccess) {
    console.log(
      `❌ User ${user.role} does not have access to module: ${requiredModule}`,
    );
    return (
      <AccessDenied
        message={`You don't have permission to access the ${requiredModule} module.`}
      />
    );
  }

  console.log(`✅ User ${user.role} has access to module: ${requiredModule}`);

  // Super-admin should have unrestricted access to all modules
  if (user.role === "super-admin") {
    console.log("✅ Super-admin detected, granting full access");
    return <>{children}</>;
  }

  // If we're in scoped mode, check if the current page's module matches the selected module
  if (scopedToModule && selectedModule && isValidModuleId(selectedModule)) {
    // Special case: if selected module is master-setup and user is super-admin, allow access to all modules
    if (selectedModule === "master-setup" && user.role === "super-admin") {
      console.log("✅ Super-admin accessing via master-setup scope");
      return <>{children}</>;
    }

    // Otherwise, only allow access to the selected module
    if (requiredModule !== selectedModule) {
      console.log(
        `❌ Module mismatch: required ${requiredModule}, selected ${selectedModule}`,
      );
      return (
        <Navigate
          to="/dashboard"
          state={{
            selectedModule: selectedModule,
            scopedToModule: true,
            moduleData: location.state?.moduleData,
          }}
          replace
        />
      );
    }
  }

  console.log("✅ All checks passed, rendering children");
  return <>{children}</>;
}
