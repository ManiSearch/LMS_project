import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function RoleTest() {
  const { user, switchRole } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Auto-switch role based on URL parameter for demo
    const params = new URLSearchParams(location.search);
    const demoRole = params.get('role');
    if (demoRole && ['admin', 'faculty', 'student', 'parent'].includes(demoRole)) {
      switchRole(demoRole as any);
    }
  }, [location.search, switchRole]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Role Testing Page</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Current User</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          <p><strong>Email:</strong> {user?.email}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Switch Role</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button onClick={() => switchRole('admin')} variant="outline">
            Switch to Admin
          </Button>
          <Button onClick={() => switchRole('faculty')} variant="outline">
            Switch to Faculty
          </Button>
          <Button onClick={() => switchRole('student')} variant="outline">
            Switch to Student
          </Button>
          <Button onClick={() => switchRole('parent')} variant="outline">
            Switch to Parent
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
