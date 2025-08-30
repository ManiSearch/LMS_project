import { useEffect, useState } from 'react';
// import { useAuth, isSessionValid } from '@/contexts/AuthContext';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function AutoLogin() {
  const { login, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const role = searchParams.get('role') || 'admin';

  const credentials = {
    admin: { email: 'superadmin@gmail.com', password: 'admin123' },
    faculty: { email: 'faculty@centralpolytech.com', password: 'faculty123' },
    student: { email: 'student@centralpolytech.com', password: 'student123' },
    parent: { email: 'parent@edu.com', password: 'parent123' }
  };

  useEffect(() => {
    const autoLogin = async () => {
      try {
        // Check if there's already a valid session
        if (isSessionValid()) {
          console.log('Valid session exists, skipping auto-login');
          setIsLoading(false);
          return;
        }

        const cred = credentials[role as keyof typeof credentials];
        if (cred) {
          console.log(`Attempting auto-login for role: ${role}`);
          const success = await login(cred.email, cred.password);

          if (success) {
            console.log(`Auto-login successful for ${role}`);
          } else {
            setError(`Auto-login failed for ${role}`);
          }
        } else {
          setError(`Invalid role: ${role}`);
        }
      } catch (err) {
        console.error('Auto-login error:', err);
        setError('An error occurred during auto-login');
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(autoLogin, 1000);
    return () => clearTimeout(timer);
  }, [login, role]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!isLoading && error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Auto-Login Failed</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <a href="/login" className="text-blue-600 hover:underline">
              Go to Login Page
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Logging in as {role}...
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Authenticating with demo credentials
          </p>
          <p className="text-xs text-gray-400">
            Creating session for {role} user
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
