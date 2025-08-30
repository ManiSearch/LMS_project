import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, FileText, Download, TrendingUp, PieChart, Calendar } from 'lucide-react';

export default function ReportsPage() {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState('overview');
  const [timeRange, setTimeRange] = useState('current');

  const reportCategories = [
    {
      title: 'Curriculum Overview',
      description: 'Complete curriculum structure and progress',
      icon: BarChart3,
      type: 'overview'
    },
    {
      title: 'Syllabus Completion',
      description: 'Subject-wise syllabus tracking reports',
      icon: TrendingUp,
      type: 'completion'
    },
    {
      title: 'OBE Assessment',
      description: 'Outcome-based education analysis',
      icon: PieChart,
      type: 'obe'
    },
    {
      title: 'Credit Analysis',
      description: 'Credit distribution and CBCS reports',
      icon: FileText,
      type: 'credits'
    }
  ];

  const recentReports = [
    {
      name: 'Semester VI Progress Report',
      type: 'Syllabus Completion',
      date: '2024-01-15',
      status: 'Generated'
    },
    {
      name: 'CO-PLO Mapping Analysis',
      type: 'OBE Assessment',
      date: '2024-01-12',
      status: 'Generated'
    },
    {
      name: 'Credit Distribution Summary',
      type: 'Credit Analysis',
      date: '2024-01-10',
      status: 'Generated'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Curriculum Reports</h1>
          <p className="text-muted-foreground">Analytics and insights for curriculum management</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Semester</SelectItem>
              <SelectItem value="previous">Previous Semester</SelectItem>
              <SelectItem value="year">Academic Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Reports</p>
                <p className="text-3xl font-bold text-blue-900">24</p>
                <p className="text-xs text-blue-600">Generated this month</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Automated Reports</p>
                <p className="text-3xl font-bold text-green-900">18</p>
                <p className="text-xs text-green-600">Scheduled reports</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Custom Reports</p>
                <p className="text-3xl font-bold text-purple-900">6</p>
                <p className="text-xs text-purple-600">User generated</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Downloads</p>
                <p className="text-3xl font-bold text-orange-900">156</p>
                <p className="text-xs text-orange-600">This month</p>
              </div>
              <Download className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Report Categories</CardTitle>
            <CardDescription>Available curriculum reports and analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() => setReportType(category.type)}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                      <div>
                        <h4 className="font-medium">{category.title}</h4>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Generate
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Recently generated curriculum reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{report.name}</h4>
                    <p className="text-sm text-gray-600">{report.type} • {report.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">{report.status}</Badge>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Analytics</CardTitle>
          <CardDescription>Key curriculum metrics and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-600">87%</h3>
              <p className="text-sm text-blue-700">Overall Syllabus Completion</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="text-2xl font-bold text-green-600">94%</h3>
              <p className="text-sm text-green-700">CO-PLO Mapping Coverage</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h3 className="text-2xl font-bold text-purple-600">170</h3>
              <p className="text-sm text-purple-700">Total Credit Hours</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
