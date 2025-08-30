import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, User, LogOut } from "lucide-react";

interface DebugLoginButtonProps {
  className?: string;
  size?: "sm" | "default" | "lg";
}

export default function DebugLoginButton({
  className = "",
  size = "sm",
}: DebugLoginButtonProps) {
  const navigate = useNavigate();
  const { login, logout, user } = useAuth();

  const handleSuperAdminLogin = async () => {
    try {
      console.log("🚀 Attempting super-admin login...");
      const success = await login("superadmin@edu.com", "password");

      if (success) {
        console.log("✅ Super-admin login successful");
        // Force page refresh to ensure all components re-render with new auth state
        window.location.reload();
      } else {
        console.error("❌ Super-admin login failed");
        alert("Login failed");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      alert("Login error occurred");
    }
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  if (user) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge variant="secondary" className="text-xs">
          <User className="h-3 w-3 mr-1" />
          {user.role}: {user.name}
        </Badge>
        <Button
          onClick={handleLogout}
          variant="outline"
          size={size}
          className="text-red-600 border-red-300 hover:bg-red-50"
        >
          <LogOut className="h-3 w-3 mr-1" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleSuperAdminLogin}
      variant="outline"
      size={size}
      className={`bg-red-50 text-red-600 border-red-300 hover:bg-red-100 ${className}`}
    >
      <Shield className="h-3 w-3 mr-1" />
      Login as Super-Admin (Courses Access)
    </Button>
  );
}

// Component that can be used to debug auth issues on any page
export function AuthDebugPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const goToCourses = () => {
    navigate("/lms/courses");
  };

  const goToQuickLogin = () => {
    navigate("/quick-login");
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
      <h3 className="font-semibold text-sm mb-3 text-gray-900">
        Auth Debug Panel
      </h3>

      <div className="space-y-2">
        <DebugLoginButton className="w-full" />

        {user && (
          <>
            <Button
              onClick={goToCourses}
              variant="outline"
              size="sm"
              className="w-full text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              Test Courses Access
            </Button>

            <Button
              onClick={goToQuickLogin}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Quick Login Page
            </Button>
          </>
        )}

        <div className="text-xs text-gray-500 mt-2">
          <p>
            Current: {user ? `${user.role} (${user.name})` : "Not logged in"}
          </p>
        </div>
      </div>
    </div>
  );
}
