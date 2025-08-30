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
  ClipboardList,
  Award,
  Clock,
  Target,
  Filter,
  SortAsc,
  Loader2
} from 'lucide-react';

interface StaffReportItem extends ReportItem {
  icon: React.ComponentType<any>;
}

const staffReports: StaffReportItem[] = [
  // Allotment Reports
  { 
    id: 'subject-allotment', 
    name: 'Subject Allotment Report', 
    description: 'Faculty-wise subject allocation and teaching assignments',
    category: 'Allotment',
    icon: ClipboardList,
    lastGenerated: '2 hours ago',
    generatedBy: 'Academic Head',
    downloadCount: 89,
    size: '3.2 MB',
    format: 'Excel'
  },
  { 
    id: 'workload-distribution', 
    name: 'Workload Distribution Analysis', 
    description: 'Analysis of teaching load distribution across faculty',
    category: 'Allotment',
    icon: BarChart3,
    lastGenerated: '4 hours ago',
    generatedBy: 'HR Manager',
    downloadCount: 67,
    size: '2.8 MB',
    format: 'PDF'
  },
  { 
    id: 'department-allocation', 
    name: 'Department-wise Allocation', 
    description: 'Faculty allocation across different departments',
    category: 'Allotment',
    icon: Target,
    lastGenerated: '1 day ago',
    generatedBy: 'Department Head',
    downloadCount: 45,
    size: '2.1 MB',
    format: 'Excel'
  },

  // Roles Reports
  { 
    id: 'role-assignments', 
    name: 'Role Assignment Report', 
    description: 'Current role assignments and access permissions',
    category: 'Roles',
    icon: UserCheck,
    lastGenerated: '1 hour ago',
    generatedBy: 'System Admin',
    downloadCount: 78,
    size: '1.9 MB',
    format: 'PDF'
  },
  { 
    id: 'permission-audit', 
    name: 'Permission Audit Report', 
    description: 'Audit of user permissions and access control',
    category: 'Roles',
    icon: FileText,
    lastGenerated: '6 hours ago',
    generatedBy: 'Security Team',
    downloadCount: 34,
    size: '2.5 MB',
    format: 'Excel'
  },
  { 
    id: 'role-hierarchy', 
    name: 'Role Hierarchy Analysis', 
    description: 'Analysis of organizational role hierarchy and structure',
    category: 'Roles',
    icon: TrendingUp,
    lastGenerated: '2 days ago',
    generatedBy: 'HR Director',
    downloadCount: 23,
    size: '1.7 MB',
    format: 'PDF'
  },

  // Performance Reports
  { 
    id: 'faculty-performance', 
    name: 'Faculty Performance Report', 
    description: 'Comprehensive faculty performance evaluation and metrics',
    category: 'Performance',
    icon: Award,
    lastGenerated: '3 hours ago',
    generatedBy: 'Performance Manager',
    downloadCount: 92,
    size: '4.1 MB',
    format: 'Excel'
  },
  { 
    id: 'teaching-effectiveness', 
    name: 'Teaching Effectiveness Analysis', 
    description: 'Analysis of teaching effectiveness and student feedback',
    category: 'Performance',
    icon: TrendingUp,
    lastGenerated: '5 hours ago',
    generatedBy: 'Quality Assurance',
    downloadCount: 56,
    size: '3.3 MB',
    format: 'PDF'
  },
  { 
    id: 'research-publications', 
    name: 'Research & Publications Report', 
    description: 'Faculty research output and publication metrics',
    category: 'Performance',
    icon: BarChart3,
    lastGenerated: '1 week ago',
    generatedBy: 'Research Office',
    downloadCount: 41,
    size: '2.9 MB',
    format: 'Excel'
  },

  // Workload Reports
  { 
    id: 'teaching-hours', 
    name: 'Teaching Hours Report', 
    description: 'Faculty teaching hours and time allocation tracking',
    category: 'Workload',
    icon: Clock,
    lastGenerated: '1 hour ago',
    generatedBy: 'Timetable Office',
    downloadCount: 87,
    size: '2.7 MB',
    format: 'Excel'
  },
  { 
    id: 'overtime-analysis', 
    name: 'Overtime Analysis Report', 
    description: 'Analysis of faculty overtime and additional duties',
    category: 'Workload',
    icon: TrendingUp,
    lastGenerated: '8 hours ago',
    generatedBy: 'HR Analytics',
    downloadCount: 38,
    size: '1.8 MB',
    format: 'PDF'
  },
  { 
    id: 'workload-balance', 
    name: 'Workload Balance Assessment', 
    description: 'Assessment of workload balance across faculty members',
    category: 'Workload',
    icon: BarChart3,
    lastGenerated: '12 hours ago',
    generatedBy: 'Faculty Coordinator',
    downloadCount: 52,
    size: '2.4 MB',
    format: 'Excel'
  }
];

export default function StaffReports() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isExporting, setIsExporting] = useState(false);
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({});

  const categories = ['All', ...Array.from(new Set(staffReports.map(report => report.category)))];

  const filteredReports = staffReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || report.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBackToDashboard = () => {
    navigate('/reports');
  };

  const handleDownload = async (report: StaffReportItem) => {
    setLoadingStates(prev => ({ ...prev, [`download-${report.id}`]: true }));
    try {
      await downloadReport(report);
    } finally {
      setLoadingStates(prev => ({ ...prev, [`download-${report.id}`]: false }));
    }
  };

  const handleGenerate = async (report: StaffReportItem) => {
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
      await exportAllModuleReports('Staff Management', staffReports);
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
            <h1 className="text-3xl font-bold tracking-tight">Staff Management Reports</h1>
            <p className="text-muted-foreground mt-1">
              Faculty and staff analytics, performance metrics, and resource allocation
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {filteredReports.length} Reports Available
          </Badge>
          <Button
            className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
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
      <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff reports..."
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.slice(1).map(category => {
          const categoryReports = staffReports.filter(report => report.category === category);
          return (
            <Card key={category} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedCategory(category)}>
              <CardContent className="p-4 text-center">
                <p className="text-sm font-medium text-muted-foreground">{category}</p>
                <p className="text-2xl font-bold text-orange-700">{categoryReports.length}</p>
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
            <Card key={report.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-orange-600" />
                    <div>
                      <span className="text-sm">{report.name}</span>
                      <Badge variant="secondary" className="ml-2 text-xs bg-orange-100 text-orange-800">
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
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
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
            <h3 className="text-lg font-medium mb-2">No staff reports found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find the reports you're looking for.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
