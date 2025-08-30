import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookMarked, BarChart3, FileText, Calendar, User } from 'lucide-react';

export default function TrackingPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Syllabus Tracking</h1>
          <p className="text-muted-foreground">Monitor teaching progress and syllabus completion</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Overall Progress</p>
                <p className="text-3xl font-bold text-blue-900">78%</p>
                <p className="text-xs text-blue-600">Syllabus covered</p>
              </div>
              <BookMarked className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">On Track</p>
                <p className="text-3xl font-bold text-green-900">12</p>
                <p className="text-xs text-green-600">Subjects</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Behind Schedule</p>
                <p className="text-3xl font-bold text-orange-900">3</p>
                <p className="text-xs text-orange-600">Subjects</p>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Active Faculty</p>
                <p className="text-3xl font-bold text-purple-900">18</p>
                <p className="text-xs text-purple-600">Teaching</p>
              </div>
              <User className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subject Progress Overview</CardTitle>
          <CardDescription>Current syllabus completion status by subject</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { subject: 'Data Structures & Algorithms', faculty: 'Dr.Manikandan', progress: 85, status: 'On Track' },
              { subject: 'Database Management Systems', faculty: 'Prof. Kumar', progress: 70, status: 'On Track' },
              { subject: 'Operating Systems', faculty: 'Dr. Meenakshi', progress: 45, status: 'Behind' },
              { subject: 'Computer Networks', faculty: 'Prof. Raj', progress: 92, status: 'Ahead' },
              { subject: 'Software Engineering', faculty: 'Dr. Priya', progress: 78, status: 'On Track' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{item.subject}</h4>
                  <p className="text-sm text-gray-600">Faculty: {item.faculty}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Progress value={item.progress} className="w-24" />
                    <span className="text-sm font-medium">{item.progress}%</span>
                  </div>
                  <Badge variant={
                    item.status === 'On Track' ? 'default' : 
                    item.status === 'Ahead' ? 'secondary' : 'destructive'
                  }>
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
