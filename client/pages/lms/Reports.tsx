import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  BarChart3, Download, Filter, FileText, Calendar, Users, GraduationCap,
  Clock, TrendingUp, Award, BookOpen, UserCheck, AlertCircle, CheckCircle,
  Eye, Plus, Search, Settings, FileSpreadsheet, FileImage, Archive,
  Target, PieChart, LineChart, Activity, School, MapPin, Phone, Mail, Shield,
  MoreHorizontal, DollarSign, ChartBar, Database, PlayCircle, Pause,
  RefreshCw, Bell, BellRing, Globe, ExternalLink
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'

// Mock data for system reports
const systemReports = [
  {
    id: 'user-activity',
    title: 'User Activity Report',
    category: 'Users',
    description: 'Detailed user login and activity data',
    lastGenerated: '2024-02-14',
    status: 'Ready',
    size: '2.4 MB',
    icon: Users,
    color: 'blue'
  },
  {
    id: 'course-performance',
    title: 'Course Performance Report',
    category: 'Courses',
    description: 'Course completion and performance metrics',
    lastGenerated: '2024-02-13',
    status: 'Ready',
    size: '1.8 MB',
    icon: GraduationCap,
    color: 'green'
  },
  {
    id: 'enrollment-statistics',
    title: 'Enrollment Statistics',
    category: 'Enrollment',
    description: 'Student enrollment trends and statistics',
    lastGenerated: '2024-02-12',
    status: 'Ready',
    size: '1.2 MB',
    icon: TrendingUp,
    color: 'purple'
  },
  {
    id: 'system-usage',
    title: 'System Usage Report',
    category: 'System',
    description: 'System resource usage and performance',
    lastGenerated: '2024-02-11',
    status: 'Ready',
    size: '3.1 MB',
    icon: Activity,
    color: 'orange'
  },
  {
    id: 'assessment-analytics',
    title: 'Assessment Analytics',
    category: 'Assessments',
    description: 'Assessment results and grade distribution',
    lastGenerated: '2024-02-10',
    status: 'Generating',
    size: '2.7 MB',
    icon: BarChart3,
    color: 'indigo'
  },
  {
    id: 'financial-report',
    title: 'Financial Report',
    category: 'Finance',
    description: 'Revenue and payment processing data',
    lastGenerated: '2024-02-09',
    status: 'Ready',
    size: '4.2 MB',
    icon: DollarSign,
    color: 'emerald'
  }
];

const reportTemplates = [
  {
    id: 'weekly-summary',
    name: 'Weekly Summary Report',
    description: 'Automated weekly performance summary',
    schedule: 'Weekly',
    lastRun: '2024-02-12',
    nextRun: '2024-02-19',
    status: 'Active'
  },
  {
    id: 'monthly-analytics',
    name: 'Monthly Analytics Report',
    description: 'Comprehensive monthly analytics dashboard',
    schedule: 'Monthly',
    lastRun: '2024-02-01',
    nextRun: '2024-03-01',
    status: 'Active'
  },
  {
    id: 'quarterly-review',
    name: 'Quarterly Review Report',
    description: 'Quarterly performance and trends analysis',
    schedule: 'Quarterly',
    lastRun: '2024-01-01',
    nextRun: '2024-04-01',
    status: 'Paused'
  }
];

const notifications = [
  {
    id: 1,
    title: 'Weekly Report Generated',
    message: 'Your weekly user activity report is ready for download',
    time: '2 hours ago',
    read: false,
    type: 'report'
  },
  {
    id: 2,
    title: 'System Alert',
    message: 'High server usage detected in assessment module',
    time: '5 hours ago',
    read: true,
    type: 'alert'
  },
  {
    id: 3,
    title: 'Export Complete',
    message: 'Student enrollment data export completed successfully',
    time: '1 day ago',
    read: false,
    type: 'export'
  }
];

export default function Reports() {
  const { user } = useAuth();
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewReport, setViewReport] = useState<any>(null);
  const [configReport, setConfigReport] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showGlobalSettings, setShowGlobalSettings] = useState(false);

  // Filter reports based on search and category
  const filteredReports = systemReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || report.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Create Report function
  const createReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowCreateDialog(false);
      alert('Report created successfully!');
    }, 2000);
  };

  // Export All function
  const exportAll = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('All reports exported successfully!');
    }, 3000);
  };

  // Download Report function
  const downloadReport = (report: any, format: string = 'pdf') => {
    const blob = new Blob([`${report.title} - ${format.toUpperCase()} Report`], {
      type: format === 'pdf' ? 'application/pdf' :
        format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.id}-${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Run Report Template
  const runTemplate = (templateId: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert(`Template "${templateId}" executed successfully!`);
    }, 2000);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Reports & Data Export</h1>
          <p className="text-muted-foreground mt-2">
            Generate comprehensive reports and export system data
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportAll} disabled={isExporting} variant="outline">
            {isExporting ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Export All
          </Button>
          <Button onClick={() => setShowCreateDialog(true)} disabled={isGenerating}>
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Create Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="users">Users</SelectItem>
            <SelectItem value="courses">Courses</SelectItem>
            <SelectItem value="enrollment">Enrollment</SelectItem>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="assessments">Assessments</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Reports & Analytics Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => {
              const IconComponent = report.icon;
              return (
                <Card key={report.id} className="relative group hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-${report.color}-100`}>
                          <IconComponent className={`h-6 w-6 text-${report.color}-600`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{report.title}</CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            {report.category}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewReport(report)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => downloadReport(report, 'pdf')}>
                            <FileText className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => downloadReport(report, 'excel')}>
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Download Excel
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setConfigReport(report)}>
                            <Settings className="h-4 w-4 mr-2" />
                            Configure
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{report.description}</p>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last generated:</span>
                      <span className="font-medium">{report.lastGenerated}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">File size:</span>
                      <span className="font-medium">{report.size}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant={report.status === 'Ready' ? 'default' : 'secondary'}>
                        {report.status}
                      </Badge>
                      {report.status === 'Generating' && (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="text-xs text-muted-foreground">Generating...</span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => setViewReport(report)}
                        className="flex-1"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadReport(report)}
                        className="flex-1"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setConfigReport(report)}
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Export All Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5" />
                Export All Reports
              </CardTitle>
              <CardDescription>
                Export all system reports in various formats for backup or analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button onClick={() => exportAll()} disabled={isExporting}>
                  {isExporting ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  Export as PDF
                </Button>
                <Button variant="outline" onClick={() => exportAll()} disabled={isExporting}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export as Excel
                </Button>
                <Button variant="outline" onClick={() => exportAll()} disabled={isExporting}>
                  <Database className="h-4 w-4 mr-2" />
                  Export as CSV
                </Button>
                <Button variant="outline" onClick={() => setShowGlobalSettings(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Config
                </Button>
              </div>
              {isExporting && (
                <div className="space-y-2">
                  <Progress value={75} className="w-full" />
                  <p className="text-sm text-muted-foreground">Exporting reports... 75% complete</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Report Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="space-y-4">
            {reportTemplates.map((template) => (
              <Card key={template.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Schedule: {template.schedule}</span>
                        <span>Last run: {template.lastRun}</span>
                        <span>Next run: {template.nextRun}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={template.status === 'Active' ? 'default' : 'secondary'}>
                        {template.status}
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => runTemplate(template.id)}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <PlayCircle className="h-4 w-4 mr-1" />
                        )}
                        Run Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Notification Management</h2>
            <Button onClick={() => setShowGlobalSettings(true)}>
              <Globe className="h-4 w-4 mr-2" />
              Global Settings
            </Button>
          </div>

          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className={!notification.read ? 'border-l-4 border-l-blue-500' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${!notification.read ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        {notification.type === 'alert' ? (
                          <AlertCircle className={`h-4 w-4 ${!notification.read ? 'text-blue-600' : 'text-gray-600'}`} />
                        ) : notification.type === 'export' ? (
                          <Download className={`h-4 w-4 ${!notification.read ? 'text-blue-600' : 'text-gray-600'}`} />
                        ) : (
                          <FileText className={`h-4 w-4 ${!notification.read ? 'text-blue-600' : 'text-gray-600'}`} />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Report Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Report</DialogTitle>
            <DialogDescription>Configure a new custom report</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Report Name</Label>
                <Input placeholder="Enter report name" />
              </div>
              <div>
                <Label>Report Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user-activity">User Activity</SelectItem>
                    <SelectItem value="course-performance">Course Performance</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="system-usage">System Usage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Enter report description" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date Range From</Label>
                <Input type="date" />
              </div>
              <div>
                <Label>Date Range To</Label>
                <Input type="date" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createReport} disabled={isGenerating}>
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Create Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Report Dialog */}
      <Dialog open={!!viewReport} onOpenChange={() => setViewReport(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {viewReport?.icon && <viewReport.icon className="h-5 w-5" />}
              {viewReport?.title}
            </DialogTitle>
            <DialogDescription>{viewReport?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                <p className="font-semibold">{viewReport?.status}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                <p className="font-semibold">{viewReport?.category}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Last Generated</Label>
                <p className="font-semibold">{viewReport?.lastGenerated}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">File Size</Label>
                <p className="font-semibold">{viewReport?.size}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3">Report Preview</h4>
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">1,234</p>
                      <p className="text-sm text-muted-foreground">Total Records</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">89.5%</p>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">156</p>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                    </div>
                  </div>
                  <div className="h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded flex items-center justify-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => downloadReport(viewReport, 'pdf')}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={() => downloadReport(viewReport, 'excel')}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Download Excel
              </Button>
              <Button variant="outline" onClick={() => downloadReport(viewReport, 'csv')}>
                <FileText className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
              <Button variant="outline" onClick={() => setConfigReport(viewReport)}>
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Config Report Dialog */}
      <Dialog open={!!configReport} onOpenChange={() => setConfigReport(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Report Settings</DialogTitle>
            <DialogDescription>Customize report generation parameters for {configReport?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Auto-generation Schedule</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="manual">Manual Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Default Format</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="email-notifications" />
              <Label htmlFor="email-notifications">Send email notifications when ready</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="auto-archive" />
              <Label htmlFor="auto-archive">Auto-archive reports older than 90 days</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigReport(null)}>
              Cancel
            </Button>
            <Button onClick={() => setConfigReport(null)}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Global Settings Dialog */}
      <Dialog open={showGlobalSettings} onOpenChange={setShowGlobalSettings}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Global Settings</DialogTitle>
            <DialogDescription>Configure global report and notification settings</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="notifications" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="exports">Export Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="notifications" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email alerts for report completion</p>
                  </div>
                  <Checkbox />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Browser push notifications for real-time alerts</p>
                  </div>
                  <Checkbox />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">System Alerts</Label>
                    <p className="text-sm text-muted-foreground">Critical system and performance alerts</p>
                  </div>
                  <Checkbox defaultChecked />
                </div>
                <div>
                  <Label>Notification Frequency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="hourly">Hourly Digest</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="exports" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Default Export Format</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Compression Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select compression" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="maximum">Maximum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-metadata" defaultChecked />
                  <Label htmlFor="include-metadata">Include metadata in exports</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="watermark" />
                  <Label htmlFor="watermark">Add watermark to exported files</Label>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGlobalSettings(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowGlobalSettings(false)}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
