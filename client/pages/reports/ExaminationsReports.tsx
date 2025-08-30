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
  Calendar,
  BookOpen,
  UserCheck,
  Users,
  CheckCircle,
  AlertCircle,
  Filter,
  SortAsc,
  PieChart,
  Target,
  Loader2
} from 'lucide-react';

interface ExaminationReportItem extends ReportItem {
  icon: React.ComponentType<any>;
}

const examinationReports: ExaminationReportItem[] = [
  // Planning Reports
  { 
    id: 'exam-schedule', 
    name: 'Examination Schedule Report', 
    description: 'Complete examination timetable and scheduling information',
    category: 'Planning',
    icon: Calendar,
    lastGenerated: '2 hours ago',
    generatedBy: 'Exam Controller',
    downloadCount: 124,
    size: '2.8 MB',
    format: 'PDF'
  },
  { 
    id: 'exam-center-allocation', 
    name: 'Exam Center Allocation', 
    description: 'Allocation of examination centers and room arrangements',
    category: 'Planning',
    icon: Target,
    lastGenerated: '4 hours ago',
    generatedBy: 'Admin Office',
    downloadCount: 87,
    size: '3.5 MB',
    format: 'Excel'
  },
  { 
    id: 'exam-calendar', 
    name: 'Examination Calendar Report', 
    description: 'Academic year examination calendar with important dates',
    category: 'Planning',
    icon: Calendar,
    lastGenerated: '1 day ago',
    generatedBy: 'Academic Office',
    downloadCount: 156,
    size: '1.9 MB',
    format: 'PDF'
  },

  // Question Bank Reports
  { 
    id: 'question-bank-summary', 
    name: 'Question Bank Summary', 
    description: 'Comprehensive overview of question bank content and coverage',
    category: 'Question Bank',
    icon: BookOpen,
    lastGenerated: '1 hour ago',
    generatedBy: 'Question Bank Manager',
    downloadCount: 73,
    size: '4.2 MB',
    format: 'Excel'
  },
  { 
    id: 'question-difficulty-analysis', 
    name: 'Question Difficulty Analysis', 
    description: 'Analysis of question difficulty levels and distribution',
    category: 'Question Bank',
    icon: BarChart3,
    lastGenerated: '3 hours ago',
    generatedBy: 'Assessment Team',
    downloadCount: 45,
    size: '2.7 MB',
    format: 'PDF'
  },
  { 
    id: 'subject-wise-questions', 
    name: 'Subject-wise Question Distribution', 
    description: 'Distribution of questions across subjects and topics',
    category: 'Question Bank',
    icon: PieChart,
    lastGenerated: '6 hours ago',
    generatedBy: 'Curriculum Head',
    downloadCount: 58,
    size: '3.1 MB',
    format: 'Excel'
  },

  // Paper Generation Reports
  { 
    id: 'paper-generation-log', 
    name: 'Paper Generation Activity Log', 
    description: 'Log of all generated question papers and their specifications',
    category: 'Paper Generation',
    icon: FileText,
    lastGenerated: '30 minutes ago',
    generatedBy: 'System Administrator',
    downloadCount: 92,
    size: '2.4 MB',
    format: 'Excel'
  },
  { 
    id: 'paper-difficulty-report', 
    name: 'Paper Difficulty Assessment', 
    description: 'Assessment of generated paper difficulty and balance',
    category: 'Paper Generation',
    icon: TrendingUp,
    lastGenerated: '2 hours ago',
    generatedBy: 'Quality Assurance',
    downloadCount: 34,
    size: '1.8 MB',
    format: 'PDF'
  },
  { 
    id: 'paper-blueprint-compliance', 
    name: 'Blueprint Compliance Report', 
    description: 'Compliance of generated papers with curriculum blueprints',
    category: 'Paper Generation',
    icon: CheckCircle,
    lastGenerated: '5 hours ago',
    generatedBy: 'Academic Coordinator',
    downloadCount: 67,
    size: '3.3 MB',
    format: 'PDF'
  },

  // Hall Tickets Reports
  { 
    id: 'hall-ticket-generation', 
    name: 'Hall Ticket Generation Report', 
    description: 'Report of all generated hall tickets and student eligibility',
    category: 'Hall Tickets',
    icon: UserCheck,
    lastGenerated: '1 hour ago',
    generatedBy: 'Exam Office',
    downloadCount: 145,
    size: '5.1 MB',
    format: 'Excel'
  },
  { 
    id: 'student-eligibility', 
    name: 'Student Eligibility Analysis', 
    description: 'Analysis of student eligibility criteria and compliance',
    category: 'Hall Tickets',
    icon: AlertCircle,
    lastGenerated: '3 hours ago',
    generatedBy: 'Registrar Office',
    downloadCount: 78,
    size: '2.9 MB',
    format: 'PDF'
  },

  // Invigilators Reports
  { 
    id: 'invigilation-duty-roster', 
    name: 'Invigilation Duty Roster', 
    description: 'Complete duty roster for examination invigilation',
    category: 'Invigilators',
    icon: Users,
    lastGenerated: '4 hours ago',
    generatedBy: 'HR Department',
    downloadCount: 98,
    size: '3.7 MB',
    format: 'Excel'
  },
  { 
    id: 'invigilation-workload', 
    name: 'Invigilation Workload Analysis', 
    description: 'Analysis of invigilation workload distribution among faculty',
    category: 'Invigilators',
    icon: BarChart3,
    lastGenerated: '1 day ago',
    generatedBy: 'Faculty Coordinator',
    downloadCount: 52,
    size: '2.2 MB',
    format: 'PDF'
  },

  // Evaluation Reports
  { 
    id: 'evaluation-progress', 
    name: 'Evaluation Progress Report', 
    description: 'Progress tracking of answer sheet evaluation process',
    category: 'Evaluation',
    icon: TrendingUp,
    lastGenerated: '45 minutes ago',
    generatedBy: 'Evaluation Head',
    downloadCount: 89,
    size: '2.6 MB',
    format: 'Excel'
  },
  { 
    id: 'evaluator-performance', 
    name: 'Evaluator Performance Analysis', 
    description: 'Performance analysis of answer sheet evaluators',
    category: 'Evaluation',
    icon: BarChart3,
    lastGenerated: '2 hours ago',
    generatedBy: 'Quality Control',
    downloadCount: 43,
    size: '3.8 MB',
    format: 'PDF'
  },
  { 
    id: 'evaluation-quality', 
    name: 'Evaluation Quality Report', 
    description: 'Quality assurance report for evaluation process',
    category: 'Evaluation',
    icon: CheckCircle,
    lastGenerated: '6 hours ago',
    generatedBy: 'QA Team',
    downloadCount: 61,
    size: '2.3 MB',
    format: 'PDF'
  },

  // Results Reports
  { 
    id: 'result-summary', 
    name: 'Examination Results Summary', 
    description: 'Comprehensive summary of examination results and statistics',
    category: 'Results',
    icon: BarChart3,
    lastGenerated: '1 hour ago',
    generatedBy: 'Result Office',
    downloadCount: 234,
    size: '4.9 MB',
    format: 'Excel'
  },
  { 
    id: 'pass-fail-analysis', 
    name: 'Pass/Fail Analysis Report', 
    description: 'Detailed analysis of pass/fail rates across subjects',
    category: 'Results',
    icon: PieChart,
    lastGenerated: '3 hours ago',
    generatedBy: 'Data Analyst',
    downloadCount: 167,
    size: '3.4 MB',
    format: 'PDF'
  },
  { 
    id: 'grade-distribution', 
    name: 'Grade Distribution Report', 
    description: 'Distribution of grades across all subjects and departments',
    category: 'Results',
    icon: TrendingUp,
    lastGenerated: '5 hours ago',
    generatedBy: 'Academic Office',
    downloadCount: 198,
    size: '4.1 MB',
    format: 'Excel'
  }
];

export default function ExaminationsReports() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isExporting, setIsExporting] = useState(false);
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({});

  const categories = ['All', ...Array.from(new Set(examinationReports.map(report => report.category)))];

  const filteredReports = examinationReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || report.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBackToDashboard = () => {
    navigate('/reports');
  };

  const handleDownload = async (report: ExaminationReportItem) => {
    setLoadingStates(prev => ({ ...prev, [`download-${report.id}`]: true }));
    try {
      await downloadReport(report);
    } finally {
      setLoadingStates(prev => ({ ...prev, [`download-${report.id}`]: false }));
    }
  };

  const handleGenerate = async (report: ExaminationReportItem) => {
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
      await exportAllModuleReports('Examination System', examinationReports);
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
            <h1 className="text-3xl font-bold tracking-tight">Examination System Reports</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive examination management analytics and reports
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {filteredReports.length} Reports Available
          </Badge>
          <Button
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
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
      <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search examination reports..."
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {categories.slice(1).map(category => {
          const categoryReports = examinationReports.filter(report => report.category === category);
          return (
            <Card key={category} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedCategory(category)}>
              <CardContent className="p-4 text-center">
                <p className="text-sm font-medium text-muted-foreground">{category}</p>
                <p className="text-2xl font-bold text-purple-700">{categoryReports.length}</p>
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
            <Card key={report.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-purple-600" />
                    <div>
                      <span className="text-sm">{report.name}</span>
                      <Badge variant="secondary" className="ml-2 text-xs bg-purple-100 text-purple-800">
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
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
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
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No examination reports found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find the reports you're looking for.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
