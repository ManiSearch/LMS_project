import { User } from "@/contexts/AuthContext";

export interface SessionData {
  user: User;
  loginTime: string;
  sessionId: string;
  lastActivity: string;
}

export interface LoginActivity {
  userId: string;
  email: string;
  role: string;
  loginTime: string;
  sessionId: string;
  userAgent?: string;
  ipAddress?: string;
}

/**
 * Session Manager Utility Functions
 * Handles all session storage operations consistently
 */
export class SessionManager {
  private static readonly USER_KEY = "erpUser";
  private static readonly ACTIVITY_KEY = "loginActivity";
  private static readonly SESSION_TIMEOUT = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

  /**
   * Store user session data
   */
  static storeSession(user: User): void {
    const sessionData: SessionData = {
      user,
      loginTime: user.loginTime || new Date().toISOString(),
      sessionId: user.sessionId || this.generateSessionId(),
      lastActivity: new Date().toISOString(),
    };

    sessionStorage.setItem(this.USER_KEY, JSON.stringify(sessionData));

    // Store login activity separately
    const loginActivity: LoginActivity = {
      userId: user.id,
      email: user.email,
      role: user.role,
      loginTime: sessionData.loginTime,
      sessionId: sessionData.sessionId,
      userAgent: navigator.userAgent,
      ipAddress: "localhost", // In real app, this would come from backend
    };

    sessionStorage.setItem(this.ACTIVITY_KEY, JSON.stringify(loginActivity));
  }

  /**
   * Retrieve user session data
   */
  static getSession(): SessionData | null {
    try {
      const sessionStr = sessionStorage.getItem(this.USER_KEY);
      if (!sessionStr) return null;

      const sessionData: SessionData = JSON.parse(sessionStr);

      // Check if session is expired
      if (this.isSessionExpired(sessionData)) {
        this.clearSession();
        return null;
      }

      return sessionData;
    } catch (error) {
      console.error("Error retrieving session:", error);
      this.clearSession();
      return null;
    }
  }

  /**
   * Update last activity timestamp
   */
  static updateActivity(): void {
    const session = this.getSession();
    if (session) {
      session.lastActivity = new Date().toISOString();
      sessionStorage.setItem(this.USER_KEY, JSON.stringify(session));
    }
  }

  /**
   * Check if current session is valid
   */
  static isValidSession(): boolean {
    const session = this.getSession();
    return session !== null && !this.isSessionExpired(session);
  }

  /**
   * Check if session is expired
   */
  static isSessionExpired(sessionData: SessionData): boolean {
    const lastActivity = new Date(sessionData.lastActivity).getTime();
    const now = new Date().getTime();
    return now - lastActivity > this.SESSION_TIMEOUT;
  }

  /**
   * Get login activity
   */
  static getLoginActivity(): LoginActivity | null {
    try {
      const activityStr = sessionStorage.getItem(this.ACTIVITY_KEY);
      return activityStr ? JSON.parse(activityStr) : null;
    } catch (error) {
      console.error("Error retrieving login activity:", error);
      return null;
    }
  }

  /**
   * Clear all session data
   */
  static clearSession(): void {
    sessionStorage.removeItem(this.USER_KEY);
    sessionStorage.removeItem(this.ACTIVITY_KEY);
  }

  /**
   * Clear all session storage
   */
  static clearAllSessionData(): void {
    sessionStorage.clear();
  }

  /**
   * Generate unique session ID
   */
  static generateSessionId(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 9);
    return `session_${timestamp}_${randomStr}`;
  }

  /**
   * Get session info for debugging
   */
  static getSessionInfo(): {
    isValid: boolean;
    user: User | null;
    loginActivity: LoginActivity | null;
    timeRemaining: number;
  } {
    const session = this.getSession();
    const loginActivity = this.getLoginActivity();

    let timeRemaining = 0;
    if (session) {
      const lastActivity = new Date(session.lastActivity).getTime();
      const expiration = lastActivity + this.SESSION_TIMEOUT;
      timeRemaining = Math.max(0, expiration - Date.now());
    }

    return {
      isValid: this.isValidSession(),
      user: session?.user || null,
      loginActivity,
      timeRemaining,
    };
  }

  /**
   * Setup automatic session cleanup
   */
  static setupSessionMonitoring(): void {
    // Update activity on user interactions
    const updateActivity = () => this.updateActivity();

    ["click", "keypress", "scroll", "mousemove"].forEach((event) => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // Check session validity periodically but don't auto-redirect
    setInterval(() => {
      if (!this.isValidSession()) {
        console.log("Session expired, clearing session data");
        this.clearSession();
        // Let the AuthContext handle the redirect logic instead of forcing window.location
        // This prevents auto-reload issues
        const event = new CustomEvent('sessionExpired');
        window.dispatchEvent(event);
      }
    }, 60000); // Check every minute
  }
}

// Initialize session monitoring when module loads
// Temporarily disabled to prevent auto-reload issues
// if (typeof window !== "undefined") {
//   SessionManager.setupSessionMonitoring();
// }
