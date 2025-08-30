import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { downloadReport, generateReport, exportAllModuleReports, type ReportItem } from '@/utils/reportUtilits';
import {
  ArrowLeft,
  Search,
  Download,
  FileText,
  BarChart3,
  TrendingUp,
  Users,
  UserCheck,
  GraduationCap,
  Clock,
  Activity,
  Shield,
  Filter,
  SortAsc,
  Eye,
  LogIn,
  Loader2
} from 'lucide-react';

interface UserReportItem extends ReportItem {
  icon: React.ComponentType<any>;
}

const userReports: UserReportItem[] = [
  // Admins Reports
  { 
    id: 'admin-activity', 
    name: 'Admin Activity Report', 
    description: 'Administrative user activity and system access patterns',
    category: 'Admins',
    icon: Shield,
    lastGenerated: '1 hour ago',
    generatedBy: 'System Security',
    downloadCount: 45,
    size: '2.1 MB',
    format: 'Excel'
  },
  { 
    id: 'admin-permissions', 
    name: 'Admin Permissions Audit', 
    description: 'Audit of administrative permissions and access levels',
    category: 'Admins',
    icon: UserCheck,
    lastGenerated: '3 hours ago',
    generatedBy: 'Security Manager',
    downloadCount: 34,
    size: '1.8 MB',
    format: 'PDF'
  },
  { 
    id: 'admin-login-history', 
    name: 'Admin Login History', 
    description: 'Login history and session tracking for administrative users',
    category: 'Admins',
    icon: LogIn,
    lastGenerated: '6 hours ago',
    generatedBy: 'IT Security',
    downloadCount: 28,
    size: '1.5 MB',
    format: 'Excel'
  },
  { 
    id: 'system-changes-log', 
    name: 'System Changes Log', 
    description: 'Log of system modifications made by administrative users',
    category: 'Admins',
    icon: Activity,
    lastGenerated: '12 hours ago',
    generatedBy: 'System Admin',
    downloadCount: 52,
    size: '3.2 MB',
    format: 'PDF'
  },

  // Faculty Reports
  { 
    id: 'faculty-engagement', 
    name: 'Faculty System Engagement', 
    description: 'Faculty engagement with the learning management system',
    category: 'Faculty',
    icon: GraduationCap,
    lastGenerated: '2 hours ago',
    generatedBy: 'Faculty Analytics',
    downloadCount: 89,
    size: '4.1 MB',
    format: 'Excel'
  },
  { 
    id: 'faculty-usage-patterns', 
    name: 'Faculty Usage Patterns', 
    description: 'Analysis of faculty system usage patterns and preferences',
    category: 'Faculty',
    icon: BarChart3,
    lastGenerated: '4 hours ago',
    generatedBy: 'Usage Analytics',
    downloadCount: 67,
    size: '3.7 MB',
    format: 'PDF'
  },
  { 
    id: 'faculty-login-stats', 
    name: 'Faculty Login Statistics', 
    description: 'Login frequency and duration statistics for faculty members',
    category: 'Faculty',
    icon: Clock,
    lastGenerated: '8 hours ago',
    generatedBy: 'System Analytics',
    downloadCount: 56,
    size: '2.3 MB',
    format: 'Excel'
  },
  { 
    id: 'faculty-feature-usage', 
    name: 'Faculty Feature Usage Report', 
    description: 'Feature adoption and usage metrics among faculty',
    category: 'Faculty',
    icon: TrendingUp,
    lastGenerated: '1 day ago',
    generatedBy: 'Product Analytics',
    downloadCount: 43,
    size: '2.9 MB',
    format: 'PDF'
  },
  { 
    id: 'faculty-content-creation', 
    name: 'Faculty Content Creation Report', 
    description: 'Report on content creation and course development activities',
    category: 'Faculty',
    icon: FileText,
    lastGenerated: '2 days ago',
    generatedBy: 'Content Manager',
    downloadCount: 38,
    size: '3.5 MB',
    format: 'Excel'
  },
  { 
    id: 'faculty-collaboration', 
    name: 'Faculty Collaboration Metrics', 
    description: 'Metrics on faculty collaboration and resource sharing',
    category: 'Faculty',
    icon: Users,
    lastGenerated: '3 days ago',
    generatedBy: 'Collaboration Team',
    downloadCount: 29,
    size: '2.1 MB',
    format: 'PDF'
  },

  // Students Reports
  { 
    id: 'student-activity-overview', 
    name: 'Student Activity Overview', 
    description: 'Comprehensive overview of student system activity',
    category: 'Students',
    icon: Activity,
    lastGenerated: '1 hour ago',
    generatedBy: 'Student Analytics',
    downloadCount: 156,
    size: '5.2 MB',
    format: 'Excel'
  },
  { 
    id: 'student-engagement-trends', 
    name: 'Student Engagement Trends', 
    description: 'Analysis of student engagement trends over time',
    category: 'Students',
    icon: TrendingUp,
    lastGenerated: '2 hours ago',
    generatedBy: 'Engagement Team',
    downloadCount: 134,
    size: '4.8 MB',
    format: 'PDF'
  },
  { 
    id: 'student-login-patterns', 
    name: 'Student Login Patterns', 
    description: 'Student login frequency, timing, and duration analysis',
    category: 'Students',
    icon: LogIn,
    lastGenerated: '3 hours ago',
    generatedBy: 'Usage Analytics',
    downloadCount: 127,
    size: '4.1 MB',
    format: 'Excel'
  },
  { 
    id: 'student-device-usage', 
    name: 'Student Device Usage Report', 
    description: 'Analysis of device preferences and platform usage',
    category: 'Students',
    icon: Eye,
    lastGenerated: '5 hours ago',
    generatedBy: 'Technical Team',
    downloadCount: 98,
    size: '3.3 MB',
    format: 'PDF'
  },
  { 
    id: 'student-support-requests', 
    name: 'Student Support Requests', 
    description: 'Analysis of student support tickets and help requests',
    category: 'Students',
    icon: Users,
    lastGenerated: '8 hours ago',
    generatedBy: 'Support Team',
    downloadCount: 87,
    size: '2.7 MB',
    format: 'Excel'
  },
  { 
    id: 'student-feature-adoption', 
    name: 'Student Feature Adoption', 
    description: 'Feature adoption rates and usage preferences among students',
    category: 'Students',
    icon: BarChart3,
    lastGenerated: '12 hours ago',
    generatedBy: 'Product Team',
    downloadCount: 76,
    size: '3.6 MB',
    format: 'PDF'
  },
  { 
    id: 'student-performance-correlation', 
    name: 'System Usage vs Performance', 
    description: 'Correlation between system usage and academic performance',
    category: 'Students',
    icon: TrendingUp,
    lastGenerated: '1 day ago',
    generatedBy: 'Research Team',
    downloadCount: 112,
    size: '4.9 MB',
    format: 'Excel'
  }
];

export default function UsersReports() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isExporting, setIsExporting] = useState(false);
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({});

  const categories = ['All', ...Array.from(new Set(userReports.map(report => report.category)))];

  const filteredReports = userReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || report.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBackToDashboard = () => {
    navigate('/reports');
  };

  const handleDownload = async (report: UserReportItem) => {
    setLoadingStates(prev => ({ ...prev, [`download-${report.id}`]: true }));
    try {
      await downloadReport(report);
    } finally {
      setLoadingStates(prev => ({ ...prev, [`download-${report.id}`]: false }));
    }
  };

  const handleGenerate = async (report: UserReportItem) => {
    setLoadingStates(prev => ({ ...prev, [`generate-${report.id}`]: true }));
    try {
      await generateReport(report);
    } finally {
      setLoadingStates(prev => ({ ...prev, [`generate-${report.id}`]: false }));
    }
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      await exportAllModuleReports('User Management', userReports);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackToDashboard}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Reports
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management Reports</h1>
            <p className="text-muted-foreground mt-1">
              User activity analytics, engagement metrics, and system usage patterns
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {filteredReports.length} Reports Available
          </Badge>
          <Button
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
            onClick={handleExportAll}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {isExporting ? 'Exporting...' : 'Export All'}
          </Button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-lg">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search user reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <Button variant="outline" size="sm">
          <SortAsc className="h-4 w-4 mr-2" />
          Sort
        </Button>
      </div>

      {/* Category Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.slice(1).map(category => {
          const categoryReports = userReports.filter(report => report.category === category);
          return (
            <Card key={category} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedCategory(category)}>
              <CardContent className="p-4 text-center">
                <p className="text-sm font-medium text-muted-foreground">{category}</p>
                <p className="text-2xl font-bold text-indigo-700">{categoryReports.length}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => {
          const IconComponent = report.icon;
          return (
            <Card key={report.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-indigo-500">
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-indigo-600" />
                    <div>
                      <span className="text-sm">{report.name}</span>
                      <Badge variant="secondary" className="ml-2 text-xs bg-indigo-100 text-indigo-800">
                        {report.category}
                      </Badge>
                    </div>
                  </div>
                </CardTitle>
                <CardDescription className="text-sm">
                  {report.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div>
                    <p>Last Generated</p>
                    <p className="font-medium text-foreground">{report.lastGenerated}</p>
                  </div>
                  <div>
                    <p>Generated By</p>
                    <p className="font-medium text-foreground">{report.generatedBy}</p>
                  </div>
                  <div>
                    <p>Downloads</p>
                    <p className="font-medium text-foreground">{report.downloadCount}</p>
                  </div>
                  <div>
                    <p>Size & Format</p>
                    <p className="font-medium text-foreground">{report.size} • {report.format}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDownload(report)}
                    disabled={loadingStates[`download-${report.id}`]}
                  >
                    {loadingStates[`download-${report.id}`] ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    {loadingStates[`download-${report.id}`] ? 'Downloading...' : 'Download'}
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => handleGenerate(report)}
                    disabled={loadingStates[`generate-${report.id}`]}
                  >
                    {loadingStates[`generate-${report.id}`] ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <BarChart3 className="h-4 w-4 mr-2" />
                    )}
                    {loadingStates[`generate-${report.id}`] ? 'Generating...' : 'Generate'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredReports.length === 0 && (
        <Card className="p-8 text-center">
          <CardContent>
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No user reports found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find the reports you're looking for.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
