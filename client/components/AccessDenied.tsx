import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, ArrowLeft, Home, HelpCircle } from 'lucide-react';

interface AccessDeniedProps {
  module?: string;
  requiredRoles?: string[];
  message?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
}

export default function AccessDenied({
  module,
  requiredRoles = [],
  message,
  showBackButton = true,
  showHomeButton = true
}: AccessDeniedProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const defaultMessage = module 
    ? `You don't have permission to access the ${module} module`
    : 'You don\'t have permission to access this resource';

  const displayMessage = message || defaultMessage;

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleContactSupport = () => {
    navigate('/help-support');
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Access Denied
          </CardTitle>
          <CardDescription className="text-gray-600">
            {displayMessage}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* User Info */}
          <Alert>
            <AlertDescription>
              <div className="space-y-1">
                <p><strong>Current User:</strong> {user?.name || 'Unknown'}</p>
                <p><strong>Your Role:</strong> <span className="capitalize">{user?.role || 'Unknown'}</span></p>
                {module && <p><strong>Requested Module:</strong> {module}</p>}
                {requiredRoles.length > 0 && (
                  <p><strong>Required Roles:</strong> {requiredRoles.join(', ')}</p>
                )}
              </div>
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {showHomeButton && (
              <Button 
                onClick={handleGoHome}
                className="w-full"
                variant="default"
              >
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            )}
            
            {showBackButton && (
              <Button 
                onClick={handleGoBack}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            )}
            
            <Button 
              onClick={handleContactSupport}
              variant="ghost"
              className="w-full"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>

          {/* Additional Help Text */}
          <div className="text-center text-sm text-gray-500 mt-4">
            <p>
              If you believe this is an error, please contact your system administrator 
              or use the support link above.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Component for module-specific access denied
export function ModuleAccessDenied({ moduleId }: { moduleId: string }) {
  const moduleNames: Record<string, string> = {
    'academic-operation': 'Academic Operation',
    'admission': 'Admission',
    'student-support': 'Student Support',
    'lms': 'Learning Management System',
    'examination': 'Examination',
    'alumni-management': 'Alumni Management',
    'hostel': 'Hostel Management',
    'library': 'Library',
    'procurement': 'Procurement',
    'asset-management': 'Asset Management',
    'finance-management': 'Finance Management',
    'hrms': 'Human Resource Management',
    'payroll': 'Payroll',
    'affiliation': 'Affiliation',
    'gte': 'Government Technical Education',
    'research': 'Research',
    'master-setup': 'Master Setup'
  };

  const moduleName = moduleNames[moduleId] || moduleId;
  
  return (
    <AccessDenied 
      module={moduleName}
      message={`Access to ${moduleName} module is restricted based on your current role`}
    />
  );
}

// Component for route-specific access denied
export function RouteAccessDenied({ route }: { route: string }) {
  return (
    <AccessDenied 
      message={`You don't have permission to access this page: ${route}`}
    />
  );
}

// Component for feature-specific access denied within modules
export function FeatureAccessDenied({ 
  feature, 
  module, 
  requiredRoles 
}: { 
  feature: string; 
  module?: string; 
  requiredRoles?: string[] 
}) {
  const message = module 
    ? `The ${feature} feature in ${module} module requires additional permissions`
    : `The ${feature} feature requires additional permissions`;
    
  return (
    <AccessDenied 
      message={message}
      requiredRoles={requiredRoles}
      showBackButton={false}
    />
  );
}
