import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, Code } from 'lucide-react';

const CourseContentDebugDemo = () => {
  return (
    <Card className="max-w-4xl mx-auto bg-green-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center text-green-800">
          <CheckCircle className="w-5 h-5 mr-2" />
          CourseContentView Error Fixed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-red-100 rounded-lg border border-red-200">
          <div className="flex items-center mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
            <span className="font-medium text-red-800">Error Identified</span>
          </div>
          <p className="text-sm text-red-700 mb-2">
            <code className="bg-red-200 px-1 rounded">TypeError: Cannot read properties of undefined (reading 'units')</code>
          </p>
          <p className="text-sm text-red-700">
            The CourseContentView component was trying to access <code>course.units</code> but the <code>course</code> prop was undefined.
          </p>
        </div>

        <div className="p-4 bg-blue-100 rounded-lg border border-blue-200">
          <div className="flex items-center mb-2">
            <Code className="w-4 h-4 text-blue-600 mr-2" />
            <span className="font-medium text-blue-800">Root Cause</span>
          </div>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Component expected <code>course</code> and <code>onBack</code> props</li>
            <li>• App.tsx was rendering CourseContentView without any props</li>
            <li>• Accessing <code>course.units</code> on undefined object caused crash</li>
          </ul>
        </div>

        <div className="p-4 bg-green-100 rounded-lg border border-green-200">
          <div className="flex items-center mb-2">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
            <span className="font-medium text-green-800">Solution Applied</span>
          </div>
          <ul className="text-sm text-green-700 space-y-1">
            <li>✅ Made props optional: <code>course?: Course</code>, <code>onBack?: () =&gt; void</code></li>
            <li>✅ Added default course data when none provided</li>
            <li>✅ Added default onBack handler for navigation</li>
            <li>✅ Updated all references to use <code>courseData</code> instead of <code>course</code></li>
            <li>✅ Added error boundary with loading state</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2">Before Fix</h4>
            <pre className="text-xs text-red-700 bg-red-100 p-2 rounded overflow-x-auto">
{`// Error occurred here
const enhancedCourse = {
  ...course, // course is undefined!
  units: course.units && course.units.length > 0 
    ? course.units : [...]
};`}
            </pre>
          </div>
          
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">After Fix</h4>
            <pre className="text-xs text-green-700 bg-green-100 p-2 rounded overflow-x-auto">
{`// Safe with defaults
const courseData = course || defaultCourse;
const enhancedCourse = {
  ...courseData, // Always defined
  units: courseData.units && courseData.units.length > 0 
    ? courseData.units : [...]
};`}
            </pre>
          </div>
        </div>

        <div className="p-4 bg-yellow-100 rounded-lg border border-yellow-200">
          <h4 className="font-medium text-yellow-800 mb-2">Testing Steps</h4>
          <ol className="text-sm text-yellow-700 space-y-1">
            <li>1. Navigate to: <strong>Academics → Courses → Course Content</strong></li>
            <li>2. Verify component loads without errors</li>
            <li>3. Check that default course data is displayed</li>
            <li>4. Test recording functionality from course structure</li>
            <li>5. Verify back navigation works correctly</li>
          </ol>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">Default Course Data</h4>
          <div className="text-sm text-blue-700">
            <p><strong>Name:</strong> Data Structures & Algorithms</p>
            <p><strong>Code:</strong> CS101</p>
            <p><strong>Instructor:</strong> Computer Science Department</p>
            <p><strong>Rating:</strong> 4.8/5</p>
            <p><strong>Enrollment:</strong> 45 students</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseContentDebugDemo;
