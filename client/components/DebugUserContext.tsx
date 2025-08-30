import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  getRoleDisplayName, 
  getRoleAccessDescription,
  canManageCurriculum,
  isReadOnlyAccess
} from '@/utils/institutionAccess';

export default function DebugUserContext() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Card className="mb-4 border-red-200">
        <CardContent className="p-4">
          <p className="text-red-600">No user authenticated</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 border-blue-200">
      <CardHeader>
        <CardTitle className="text-sm">Debug: Current User Context</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {getRoleDisplayName(user.role)}</p>
            <p><strong>Access Level:</strong> {getRoleAccessDescription(user)}</p>
          </div>
          <div>
            <p><strong>Institution ID:</strong> {user.institutionId || 'None'}</p>
            <p><strong>Institution Code:</strong> {user.institutionCode || 'None'}</p>
            <p><strong>Institution Name:</strong> {user.institution || 'None'}</p>
            <p><strong>Department:</strong> {user.department || 'None'}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <Badge variant={canManageCurriculum(user) ? 'default' : 'secondary'}>
            {canManageCurriculum(user) ? 'Can Manage' : 'Cannot Manage'} Curriculum
          </Badge>
          {isReadOnlyAccess(user) && (
            <Badge variant="outline">Read Only Access</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
