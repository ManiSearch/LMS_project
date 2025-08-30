import { User } from "@/contexts/AuthContext";

/**
 * Authentication fix utilities to help debug and resolve login issues
 */

// Quick login function that forces authentication
export const forceLogin = (
  role: "super-admin" | "admin" | "faculty" | "student" = "super-admin",
): User => {
  const users = {
    "super-admin": {
      id: "1",
      name: "System Administrator",
      email: "superadmin@edu.com",
      role: "super-admin" as const,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      loginTime: new Date().toISOString(),
      sessionId: `session_${Date.now()}`,
    },
    admin: {
      id: "2",
      name: "Dr.Manikandan",
      email: "admin@edu.com",
      role: "admin" as const,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100&h=100&fit=crop&crop=face",
      loginTime: new Date().toISOString(),
      sessionId: `session_${Date.now()}`,
    },
    faculty: {
      id: "6",
      name: "Prof.Madhan",
      email: "faculty@edu.com",
      role: "faculty" as const,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      loginTime: new Date().toISOString(),
      sessionId: `session_${Date.now()}`,
    },
    student: {
      id: "8",
      name: "Christy",
      email: "student@edu.com",
      role: "student" as const,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      loginTime: new Date().toISOString(),
      sessionId: `session_${Date.now()}`,
    },
  };

  const user = users[role];

  // Store in session storage directly
  const sessionData = {
    user,
    loginTime: user.loginTime,
    sessionId: user.sessionId,
    lastActivity: new Date().toISOString(),
  };

  sessionStorage.setItem("erpUser", JSON.stringify(sessionData));

  console.log(`🚀 Force login successful as ${role}:`, user);
  return user;
};

// Function to check current auth state
export const checkAuthState = () => {
  try {
    const sessionStr = sessionStorage.getItem("erpUser");
    if (!sessionStr) {
      console.log("❌ No session found in storage");
      return null;
    }

    const sessionData = JSON.parse(sessionStr);
    console.log("✅ Current session:", sessionData);
    return sessionData.user;
  } catch (error) {
    console.error("❌ Error checking auth state:", error);
    return null;
  }
};

// Function to clear auth state
export const clearAuthState = () => {
  sessionStorage.clear();
  console.log("🧹 Auth state cleared");
};

// Function to diagnose auth issues
export const diagnoseAuth = () => {
  console.log("🔍 AUTH DIAGNOSIS:");
  console.log("1. Session Storage:", sessionStorage.getItem("erpUser"));
  console.log("2. Local Storage:", localStorage.getItem("erpUser"));
  console.log("3. Current URL:", window.location.href);
  console.log("4. User Agent:", navigator.userAgent);

  const user = checkAuthState();
  if (user) {
    console.log("5. Current User:", user);
    console.log("6. User Role:", user.role);
  } else {
    console.log("5. No user found");
  }
};

// Add these functions to window for easy debugging
if (typeof window !== "undefined") {
  (window as any).authFix = {
    forceLogin,
    checkAuthState,
    clearAuthState,
    diagnoseAuth,
  };

  console.log("🛠️ Auth fix utilities available at window.authFix");
  console.log("Available commands:");
  console.log('- window.authFix.forceLogin("super-admin")');
  console.log("- window.authFix.checkAuthState()");
  console.log("- window.authFix.clearAuthState()");
  console.log("- window.authFix.diagnoseAuth()");
}
