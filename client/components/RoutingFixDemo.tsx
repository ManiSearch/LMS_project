import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, ArrowRight, Edit, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoutingFixDemo = () => {
  const navigate = useNavigate();

  const testRoutes = [
    {
      path: '/academics/curriculum/programs/C005',
      description: 'View Program C005',
      type: 'view',
      working: true
    },
    {
      path: '/academics/curriculum/programs/C005/edit',
      description: 'Edit Program C005',
      type: 'edit',
      working: true
    },
    {
      path: '/academics/curriculum/programs/create',
      description: 'Create New Program',
      type: 'create',
      working: true
    }
  ];

  return (
    <Card className="max-w-4xl mx-auto bg-green-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center text-green-800">
          <CheckCircle className="w-5 h-5 mr-2" />
          Routing Error Fixed: Programs CRUD Operations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-red-100 rounded-lg border border-red-200">
          <div className="flex items-center mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
            <span className="font-medium text-red-800">Original Error</span>
          </div>
          <p className="text-sm text-red-700 font-mono">
            404 Error: User attempted to access non-existent route: /academics/curriculum/programs/C005/edit
          </p>
        </div>

        <div className="p-4 bg-green-100 rounded-lg border border-green-200">
          <div className="flex items-center mb-2">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
            <span className="font-medium text-green-800">Solution Applied</span>
          </div>
          <ul className="text-sm text-green-700 space-y-1">
            <li>✅ Added missing route: <code>/academics/curriculum/programs/:id/edit</code></li>
            <li>✅ Added missing route: <code>/academics/curriculum/programs/create</code></li>
            <li>✅ Enhanced ProgramsPage component to handle view/edit/create modes</li>
            <li>✅ Added proper form validation and save functionality</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testRoutes.map((route, index) => (
            <Card key={index} className="border-2 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    {route.type === 'view' && <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />}
                    {route.type === 'edit' && <Edit className="w-4 h-4 text-orange-600 mr-2" />}
                    {route.type === 'create' && <Plus className="w-4 h-4 text-green-600 mr-2" />}
                    <span className="font-medium text-sm">{route.description}</span>
                  </div>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs text-gray-600 font-mono bg-gray-100 p-2 rounded">
                    {route.path}
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(route.path)}
                  >
                    Test Route <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="p-4 bg-blue-100 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-3">Routes Added to App.tsx</h4>
          <div className="space-y-2">
            <div className="bg-blue-50 p-3 rounded font-mono text-sm">
              <div className="text-blue-800 font-medium mb-1">Create Route:</div>
              <div className="text-blue-700">/academics/curriculum/programs/create</div>
            </div>
            <div className="bg-blue-50 p-3 rounded font-mono text-sm">
              <div className="text-blue-800 font-medium mb-1">Edit Route:</div>
              <div className="text-blue-700">/academics/curriculum/programs/:id/edit</div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-yellow-100 rounded-lg border border-yellow-200">
          <h4 className="font-medium text-yellow-800 mb-2">ProgramsPage Component Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
            <div>
              <h5 className="font-medium mb-1">View Mode:</h5>
              <ul className="space-y-1">
                <li>• Program statistics display</li>
                <li>• Semester structure overview</li>
                <li>• Quick action buttons</li>
                <li>• Edit/Create navigation</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-1">Edit/Create Mode:</h5>
              <ul className="space-y-1">
                <li>• Form-based editing interface</li>
                <li>• Field validation</li>
                <li>• Save/Cancel functionality</li>
                <li>• Success notifications</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-4 bg-purple-100 rounded-lg border border-purple-200">
          <h4 className="font-medium text-purple-800 mb-2">Testing Instructions</h4>
          <ol className="text-sm text-purple-700 space-y-1">
            <li>1. Navigate to: <strong>Academics → Curriculum → Programs</strong></li>
            <li>2. Click on any program to view details</li>
            <li>3. Use "Edit Program" button to test edit functionality</li>
            <li>4. Use "Create New Program" to test create functionality</li>
            <li>5. Verify forms work correctly with validation</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoutingFixDemo;
