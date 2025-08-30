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
  BookOpen,
  Video,
  ClipboardList,
  Users,
  Award,
  MessageSquare,
  Filter,
  SortAsc,
  PlayCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface LMSReportItem extends ReportItem {
  icon: React.ComponentType<any>;
}

const lmsReports: LMSReportItem[] = [
  // Courses Reports
  { 
    id: 'course-enrollment', 
    name: 'Course Enrollment Analytics', 
    description: 'Detailed enrollment statistics and trends across all courses',
    category: 'Courses',
    icon: BookOpen,
    lastGenerated: '1 hour ago',
    generatedBy: 'LMS Administrator',
    downloadCount: 78,
    size: '3.2 MB',
    format: 'Excel'
  },
  { 
    id: 'course-completion', 
    name: 'Course Completion Report', 
    description: 'Completion rates and student progress tracking',
    category: 'Courses',
    icon: CheckCircle,
    lastGenerated: '3 hours ago',
    generatedBy: 'Course Coordinator',
    downloadCount: 65,
    size: '2.8 MB',
    format: 'PDF'
  },
  { 
    id: 'course-performance', 
    name: 'Course Performance Metrics', 
    description: 'Student performance and engagement metrics per course',
    category: 'Courses',
    icon: TrendingUp,
    lastGenerated: '6 hours ago',
    generatedBy: 'Data Analyst',
    downloadCount: 42,
    size: '4.1 MB',
    format: 'Excel'
  },

  // Lessons Reports
  { 
    id: 'lesson-engagement', 
    name: 'Lesson Engagement Analysis', 
    description: 'Student engagement metrics for individual lessons',
    category: 'Lessons',
    icon: Video,
    lastGenerated: '2 hours ago',
    generatedBy: 'Content Manager',
    downloadCount: 58,
    size: '2.5 MB',
    format: 'PDF'
  },
  { 
    id: 'lesson-completion', 
    name: 'Lesson Completion Tracking', 
    description: 'Detailed tracking of lesson completion across all courses',
    category: 'Lessons',
    icon: PlayCircle,
    lastGenerated: '4 hours ago',
    generatedBy: 'LMS Administrator',
    downloadCount: 71,
    size: '3.7 MB',
    format: 'Excel'
  },
  { 
    id: 'video-analytics', 
    name: 'Video Content Analytics', 
    description: 'Video lesson viewing patterns and engagement statistics',
    category: 'Lessons',
    icon: BarChart3,
    lastGenerated: '1 day ago',
    generatedBy: 'Media Manager',
    downloadCount: 34,
    size: '5.2 MB',
    format: 'PDF'
  },

  // Assessments Reports
  { 
    id: 'assessment-results', 
    name: 'Assessment Results Summary', 
    description: 'Comprehensive results analysis for all online assessments',
    category: 'Assessments',
    icon: FileText,
    lastGenerated: '30 minutes ago',
    generatedBy: 'Assessment Coordinator',
    downloadCount: 89,
    size: '2.9 MB',
    format: 'Excel'
  },
  { 
    id: 'quiz-performance', 
    name: 'Quiz Performance Analytics', 
    description: 'Student performance trends in quizzes and tests',
    category: 'Assessments',
    icon: TrendingUp,
    lastGenerated: '2 hours ago',
    generatedBy: 'Faculty Lead',
    downloadCount: 67,
    size: '3.4 MB',
    format: 'PDF'
  },
  { 
    id: 'assessment-validity', 
    name: 'Assessment Validity Report', 
    description: 'Statistical analysis of assessment quality and reliability',
    category: 'Assessments',
    icon: BarChart3,
    lastGenerated: '1 day ago',
    generatedBy: 'Quality Assurance',
    downloadCount: 23,
    size: '1.8 MB',
    format: 'PDF'
  },

  // Assignments Reports
  { 
    id: 'assignment-submissions', 
    name: 'Assignment Submission Report', 
    description: 'Tracking of assignment submissions and deadlines',
    category: 'Assignments',
    icon: ClipboardList,
    lastGenerated: '1 hour ago',
    generatedBy: 'Faculty Coordinator',
    downloadCount: 76,
    size: '2.7 MB',
    format: 'Excel'
  },
  { 
    id: 'assignment-grading', 
    name: 'Assignment Grading Analytics', 
    description: 'Grading patterns and feedback quality analysis',
    category: 'Assignments',
    icon: TrendingUp,
    lastGenerated: '4 hours ago',
    generatedBy: 'Academic Head',
    downloadCount: 45,
    size: '3.1 MB',
    format: 'PDF'
  },
  { 
    id: 'plagiarism-report', 
    name: 'Plagiarism Detection Report', 
    description: 'Plagiarism detection results for submitted assignments',
    category: 'Assignments',
    icon: FileText,
    lastGenerated: '8 hours ago',
    generatedBy: 'Academic Integrity',
    downloadCount: 38,
    size: '1.6 MB',
    format: 'Excel'
  },

  // Cohorts Reports
  { 
    id: 'cohort-performance', 
    name: 'Cohort Performance Analysis', 
    description: 'Comparative performance analysis across student cohorts',
    category: 'Cohorts',
    icon: Users,
    lastGenerated: '5 hours ago',
    generatedBy: 'Student Affairs',
    downloadCount: 52,
    size: '4.3 MB',
    format: 'PDF'
  },
  { 
    id: 'cohort-engagement', 
    name: 'Cohort Engagement Metrics', 
    description: 'Engagement and participation metrics by cohort',
    category: 'Cohorts',
    icon: BarChart3,
    lastGenerated: '1 day ago',
    generatedBy: 'Community Manager',
    downloadCount: 31,
    size: '2.4 MB',
    format: 'Excel'
  },

  // Certificates Reports
  { 
    id: 'certificate-issued', 
    name: 'Certificates Issued Report', 
    description: 'Report of all certificates issued and completion milestones',
    category: 'Certificates',
    icon: Award,
    lastGenerated: '3 hours ago',
    generatedBy: 'Certification Office',
    downloadCount: 64,
    size: '1.9 MB',
    format: 'PDF'
  },
  { 
    id: 'certificate-verification', 
    name: 'Certificate Verification Log', 
    description: 'Log of certificate verification requests and status',
    category: 'Certificates',
    icon: CheckCircle,
    lastGenerated: '6 hours ago',
    generatedBy: 'Verification Team',
    downloadCount: 29,
    size: '1.2 MB',
    format: 'Excel'
  }
];

export default function LMSReports() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isExporting, setIsExporting] = useState(false);
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({});

  const categories = ['All', ...Array.from(new Set(lmsReports.map(report => report.category)))];

  const filteredReports = lmsReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || report.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBackToDashboard = () => {
    navigate('/reports');
  };

  const handleDownload = async (report: LMSReportItem) => {
    setLoadingStates(prev => ({ ...prev, [`download-${report.id}`]: true }));
    try {
      await downloadReport(report);
    } finally {
      setLoadingStates(prev => ({ ...prev, [`download-${report.id}`]: false }));
    }
  };

  const handleGenerate = async (report: LMSReportItem) => {
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
      await exportAllModuleReports('Learning Management System', lmsReports);
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
            <h1 className="text-3xl font-bold tracking-tight">Learning Management System Reports</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive analytics for online learning and course management
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {filteredReports.length} Reports Available
          </Badge>
          <Button
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
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
      <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search LMS reports..."
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.slice(1).map(category => {
          const categoryReports = lmsReports.filter(report => report.category === category);
          return (
            <Card key={category} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedCategory(category)}>
              <CardContent className="p-4 text-center">
                <p className="text-sm font-medium text-muted-foreground">{category}</p>
                <p className="text-2xl font-bold text-green-700">{categoryReports.length}</p>
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
            <Card key={report.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-green-600" />
                    <div>
                      <span className="text-sm">{report.name}</span>
                      <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-800">
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
                    className="flex-1 bg-green-600 hover:bg-green-700"
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
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No LMS reports found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find the reports you're looking for.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
