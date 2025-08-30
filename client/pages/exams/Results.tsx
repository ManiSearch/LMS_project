import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { PermissionGuard } from '@/components/PermissionGuard';
import { 
  BarChart3, Download, Search, TrendingUp, Award, Users, Eye, Edit, 
  FileText, CheckCircle, AlertCircle, Send, Upload, Filter, 
  Calculator, PieChart, Target, Trophy, Clock, Bell
} from 'lucide-react';

interface SubjectResult {
  subjectCode: string;
  subjectName: string;
  maxMarks: number;
  obtainedMarks: number;
  grade: string;
  gradePoints: number;
  credits: number;
  status: 'Pass' | 'Fail' | 'Absent';
}

interface StudentResult {
  id: string;
  studentId: string;
  rollNumber: string;
  name: string;
  program: string;
  semester: string;
  examType: 'Regular' | 'Supplementary' | 'Improvement';
  subjects: SubjectResult[];
  totalMaxMarks: number;
  totalObtainedMarks: number;
  percentage: number;
  cgpa: number;
  sgpa: number;
  overallGrade: string;
  rank: number;
  result: 'Pass' | 'Fail' | 'Pass with Grace' | 'Withheld';
  status: 'Draft' | 'Published' | 'Verified' | 'Withheld';
  publishedDate?: string;
  remarks?: string;
}

interface ResultAnalytics {
  totalStudents: number;
  passCount: number;
  failCount: number;
  passPercentage: number;
  averageCGPA: number;
  highestCGPA: number;
  lowestCGPA: number;
  subjectWisePass: { [key: string]: number };
  gradeDistribution: { [key: string]: number };
}

const initialResults: StudentResult[] = [
  {
    id: 'RES001',
    studentId: 'ST001',
    rollNumber: '2024CSE001',
    name: 'Aaron',
    program: 'B.Tech Computer Science',
    semester: '3rd',
    examType: 'Regular',
    subjects: [
      {
        subjectCode: 'MA301',
        subjectName: 'Engineering Mathematics-III',
        maxMarks: 100,
        obtainedMarks: 85,
        grade: 'A',
        gradePoints: 9.0,
        credits: 4,
        status: 'Pass'
      },
      {
        subjectCode: 'CS302',
        subjectName: 'Data Structures',
        maxMarks: 100,
        obtainedMarks: 92,
        grade: 'A+',
        gradePoints: 10.0,
        credits: 4,
        status: 'Pass'
      },
      {
        subjectCode: 'CS303',
        subjectName: 'Computer Organization',
        maxMarks: 100,
        obtainedMarks: 78,
        grade: 'B+',
        gradePoints: 8.0,
        credits: 3,
        status: 'Pass'
      }
    ],
    totalMaxMarks: 300,
    totalObtainedMarks: 255,
    percentage: 85.0,
    cgpa: 8.9,
    sgpa: 8.8,
    overallGrade: 'A',
    rank: 5,
    result: 'Pass',
    status: 'Published',
    publishedDate: '2024-01-15',
    remarks: 'Excellent performance'
  },
  {
    id: 'RES002',
    studentId: 'ST002',
    rollNumber: '2024CSE002',
    name: 'Balu',
    program: 'B.Tech Computer Science',
    semester: '3rd',
    examType: 'Regular',
    subjects: [
      {
        subjectCode: 'MA301',
        subjectName: 'Engineering Mathematics-III',
        maxMarks: 100,
        obtainedMarks: 95,
        grade: 'A+',
        gradePoints: 10.0,
        credits: 4,
        status: 'Pass'
      },
      {
        subjectCode: 'CS302',
        subjectName: 'Data Structures',
        maxMarks: 100,
        obtainedMarks: 88,
        grade: 'A',
        gradePoints: 9.0,
        credits: 4,
        status: 'Pass'
      },
      {
        subjectCode: 'CS303',
        subjectName: 'Computer Organization',
        maxMarks: 100,
        obtainedMarks: 91,
        grade: 'A+',
        gradePoints: 10.0,
        credits: 3,
        status: 'Pass'
      }
    ],
    totalMaxMarks: 300,
    totalObtainedMarks: 274,
    percentage: 91.3,
    cgpa: 9.5,
    sgpa: 9.6,
    overallGrade: 'A+',
    rank: 2,
    result: 'Pass',
    status: 'Published',
    publishedDate: '2024-01-15'
  },
  {
    id: 'RES003',
    studentId: 'ST003',
    rollNumber: '2024CSE003',
    name: 'Dhoni',
    program: 'B.Tech Computer Science',
    semester: '3rd',
    examType: 'Regular',
    subjects: [
      {
        subjectCode: 'MA301',
        subjectName: 'Engineering Mathematics-III',
        maxMarks: 100,
        obtainedMarks: 42,
        grade: 'F',
        gradePoints: 0.0,
        credits: 4,
        status: 'Fail'
      },
      {
        subjectCode: 'CS302',
        subjectName: 'Data Structures',
        maxMarks: 100,
        obtainedMarks: 65,
        grade: 'B',
        gradePoints: 7.0,
        credits: 4,
        status: 'Pass'
      },
      {
        subjectCode: 'CS303',
        subjectName: 'Computer Organization',
        maxMarks: 100,
        obtainedMarks: 58,
        grade: 'C+',
        gradePoints: 6.0,
        credits: 3,
        status: 'Pass'
      }
    ],
    totalMaxMarks: 300,
    totalObtainedMarks: 165,
    percentage: 55.0,
    cgpa: 6.2,
    sgpa: 4.8,
    overallGrade: 'C',
    rank: 12,
    result: 'Fail',
    status: 'Draft',
    remarks: 'Need improvement in Mathematics'
  }
];

export default function Results() {
  const { user } = useAuth();
  const [results, setResults] = useState<StudentResult[]>(initialResults);
  const [selectedResult, setSelectedResult] = useState<StudentResult | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState<string>('all');
  const [filterSemester, setFilterSemester] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterResult, setFilterResult] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('results');
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [publishingResults, setPublishingResults] = useState<string[]>([]);

  const filteredResults = results.filter(result => {
    const matchesSearch = result.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = filterProgram === 'all' || result.program === filterProgram;
    const matchesSemester = filterSemester === 'all' || result.semester === filterSemester;
    const matchesStatus = filterStatus === 'all' || result.status === filterStatus;
    const matchesResult = filterResult === 'all' || result.result === filterResult;
    
    return matchesSearch && matchesProgram && matchesSemester && matchesStatus && matchesResult;
  });

  const analytics: ResultAnalytics = {
    totalStudents: results.length,
    passCount: results.filter(r => r.result === 'Pass').length,
    failCount: results.filter(r => r.result === 'Fail').length,
    passPercentage: (results.filter(r => r.result === 'Pass').length / results.length) * 100,
    averageCGPA: results.reduce((sum, r) => sum + r.cgpa, 0) / results.length,
    highestCGPA: Math.max(...results.map(r => r.cgpa)),
    lowestCGPA: Math.min(...results.map(r => r.cgpa)),
    subjectWisePass: {},
    gradeDistribution: results.reduce((acc, result) => {
      acc[result.overallGrade] = (acc[result.overallGrade] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number })
  };

  const handlePublishResult = (resultId: string) => {
    setResults(results.map(r => 
      r.id === resultId 
        ? { ...r, status: 'Published' as const, publishedDate: new Date().toISOString().split('T')[0] }
        : r
    ));
  };

  const handleBulkPublish = () => {
    setResults(results.map(r => 
      publishingResults.includes(r.id)
        ? { ...r, status: 'Published' as const, publishedDate: new Date().toISOString().split('T')[0] }
        : r
    ));
    setPublishingResults([]);
    setShowPublishDialog(false);
  };

  const handleWithholdResult = (resultId: string, reason: string) => {
    setResults(results.map(r => 
      r.id === resultId 
        ? { ...r, status: 'Withheld' as const, result: 'Withheld' as const, remarks: reason }
        : r
    ));
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Published': 'bg-green-100 text-green-800',
      'Verified': 'bg-blue-100 text-blue-800',
      'Withheld': 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const getResultBadge = (result: string) => {
    const variants = {
      'Pass': 'bg-green-100 text-green-800',
      'Fail': 'bg-red-100 text-red-800',
      'Pass with Grace': 'bg-yellow-100 text-yellow-800',
      'Withheld': 'bg-gray-100 text-gray-800'
    };
    return variants[result as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const getGradeBadge = (grade: string) => {
    const variants = {
      'A+': 'bg-green-100 text-green-800',
      'A': 'bg-green-100 text-green-700',
      'B+': 'bg-blue-100 text-blue-800',
      'B': 'bg-blue-100 text-blue-700',
      'C+': 'bg-yellow-100 text-yellow-800',
      'C': 'bg-yellow-100 text-yellow-700',
      'D': 'bg-orange-100 text-orange-800',
      'F': 'bg-red-100 text-red-800'
    };
    return variants[grade as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exam Results Management</h1>
          <p className="text-muted-foreground">
            View, analyze, publish, and manage examination results and performance analytics.
          </p>
        </div>
        <div className="flex gap-2">
          <PermissionGuard permission="exams.results.export" fallback={null}>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
          </PermissionGuard>
          <PermissionGuard permission="exams.results.import" fallback={null}>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import Results
            </Button>
          </PermissionGuard>
          <PermissionGuard permission="exams.results.publish" fallback={null}>
            <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Bulk Publish
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk Publish Results</DialogTitle>
                  <DialogDescription>
                    Select results to publish. Published results will be visible to students.
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-60 overflow-y-auto">
                  {results.filter(r => r.status === 'Draft').map(result => (
                    <div key={result.id} className="flex items-center space-x-2 py-2">
                      <input
                        type="checkbox"
                        checked={publishingResults.includes(result.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPublishingResults([...publishingResults, result.id]);
                          } else {
                            setPublishingResults(publishingResults.filter(id => id !== result.id));
                          }
                        }}
                      />
                      <div>
                        <div className="font-medium">{result.name}</div>
                        <div className="text-sm text-muted-foreground">{result.rollNumber}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowPublishDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleBulkPublish} disabled={publishingResults.length === 0}>
                    Publish Selected ({publishingResults.length})
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </PermissionGuard>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="results">Student Results</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Results</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalStudents}</div>
                <p className="text-xs text-muted-foreground">
                  {results.filter(r => r.status === 'Published').length} published
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.passPercentage.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.passCount} out of {analytics.totalStudents} students
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average CGPA</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.averageCGPA.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Range: {analytics.lowestCGPA} - {analytics.highestCGPA}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {results.filter(r => r.status === 'Draft').length}
                </div>
                <p className="text-xs text-muted-foreground">Results to publish</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <Input
                placeholder="Search by name, roll number, or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={filterProgram} onValueChange={setFilterProgram}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                <SelectItem value="B.Tech Computer Science">B.Tech Computer Science</SelectItem>
                <SelectItem value="B.Tech Electronics">B.Tech Electronics</SelectItem>
                <SelectItem value="B.Tech Mechanical">B.Tech Mechanical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSemester} onValueChange={setFilterSemester}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="1st">1st</SelectItem>
                <SelectItem value="2nd">2nd</SelectItem>
                <SelectItem value="3rd">3rd</SelectItem>
                <SelectItem value="4th">4th</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
                <SelectItem value="Withheld">Withheld</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterResult} onValueChange={setFilterResult}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="Pass">Pass</SelectItem>
                <SelectItem value="Fail">Fail</SelectItem>
                <SelectItem value="Withheld">Withheld</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Table */}
          <Card>
            <CardHeader>
              <CardTitle>Student Results</CardTitle>
              <CardDescription>
                Detailed examination results for all students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Details</TableHead>
                    <TableHead>Program & Semester</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Grades & CGPA</TableHead>
                    <TableHead>Rank</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{result.name}</div>
                          <div className="text-sm text-muted-foreground">{result.rollNumber}</div>
                          <div className="text-xs text-muted-foreground">{result.studentId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium">{result.program}</div>
                          <div className="text-sm text-muted-foreground">{result.semester} Semester</div>
                          <Badge variant="outline" className="text-xs">{result.examType}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium">
                            {result.totalObtainedMarks}/{result.totalMaxMarks}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {result.percentage.toFixed(1)}%
                          </div>
                          <Progress value={result.percentage} className="h-2 w-20" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={getGradeBadge(result.overallGrade)}>
                            {result.overallGrade}
                          </Badge>
                          <div className="text-sm">CGPA: {result.cgpa}</div>
                          <div className="text-xs text-muted-foreground">SGPA: {result.sgpa}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4 text-yellow-600" />
                          <span className="font-medium">#{result.rank}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={getStatusBadge(result.status)}>
                            {result.status}
                          </Badge>
                          <Badge className={getResultBadge(result.result)}>
                            {result.result}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedResult(result);
                              setShowDetailDialog(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <PermissionGuard permission="exams.results.edit" fallback={null}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </PermissionGuard>
                          {result.status === 'Draft' && (
                            <PermissionGuard permission="exams.results.publish" fallback={null}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePublishResult(result.id)}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </PermissionGuard>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>
                  Overall grade distribution across all students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.gradeDistribution)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([grade, count]) => (
                    <div key={grade} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getGradeBadge(grade)}>{grade}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(count / analytics.totalStudents) * 100} 
                          className="w-24 h-2" 
                        />
                        <span className="text-sm font-medium w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Key performance indicators and statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{analytics.passCount}</div>
                      <div className="text-sm text-muted-foreground">Passed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{analytics.failCount}</div>
                      <div className="text-sm text-muted-foreground">Failed</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{analytics.highestCGPA}</div>
                      <div className="text-sm text-muted-foreground">Highest CGPA</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{analytics.averageCGPA.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">Average CGPA</div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {analytics.passPercentage.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Overall Pass Rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Performance</CardTitle>
              <CardDescription>
                Performance analysis by subject
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['MA301', 'CS302', 'CS303'].map(subjectCode => {
                  const subjectResults = results.flatMap(r => 
                    r.subjects.filter(s => s.subjectCode === subjectCode)
                  );
                  const passCount = subjectResults.filter(s => s.status === 'Pass').length;
                  const totalCount = subjectResults.length;
                  const passRate = totalCount > 0 ? (passCount / totalCount) * 100 : 0;
                  const avgMarks = totalCount > 0 
                    ? subjectResults.reduce((sum, s) => sum + s.obtainedMarks, 0) / totalCount 
                    : 0;

                  return (
                    <div key={subjectCode} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{subjectCode}</h4>
                          <p className="text-sm text-muted-foreground">
                            {subjectResults[0]?.subjectName || 'Subject Name'}
                          </p>
                        </div>
                        <Badge variant="outline">{totalCount} students</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="font-medium">{passRate.toFixed(1)}%</div>
                          <div className="text-muted-foreground">Pass Rate</div>
                        </div>
                        <div>
                          <div className="font-medium">{avgMarks.toFixed(1)}</div>
                          <div className="text-muted-foreground">Avg Marks</div>
                        </div>
                        <div>
                          <div className="font-medium">{passCount}/{totalCount}</div>
                          <div className="text-muted-foreground">Pass/Total</div>
                        </div>
                      </div>
                      <Progress value={passRate} className="mt-2 h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rankings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Rankings</CardTitle>
              <CardDescription>
                Merit list based on CGPA and overall performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>CGPA</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...results]
                    .filter(r => r.result === 'Pass')
                    .sort((a, b) => b.cgpa - a.cgpa)
                    .slice(0, 10)
                    .map((result, index) => (
                    <TableRow key={result.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {index < 3 && <Trophy className="h-4 w-4 text-yellow-600" />}
                          <span className="font-bold">#{index + 1}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{result.name}</div>
                          <div className="text-sm text-muted-foreground">{result.rollNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{result.program}</div>
                          <div className="text-xs text-muted-foreground">{result.semester} Semester</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-lg font-bold">{result.cgpa}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{result.percentage.toFixed(1)}%</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getGradeBadge(result.overallGrade)}>
                          {result.overallGrade}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-medium">Class Performance Report</h3>
                    <p className="text-sm text-muted-foreground">Detailed analysis by class</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-medium">Subject Analysis</h3>
                    <p className="text-sm text-muted-foreground">Subject-wise performance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Trophy className="h-8 w-8 text-yellow-600" />
                  <div>
                    <h3 className="font-medium">Merit List</h3>
                    <p className="text-sm text-muted-foreground">Top performers report</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                  <div>
                    <h3 className="font-medium">Failed Students</h3>
                    <p className="text-sm text-muted-foreground">Needs attention list</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <PieChart className="h-8 w-8 text-purple-600" />
                  <div>
                    <h3 className="font-medium">Statistical Summary</h3>
                    <p className="text-sm text-muted-foreground">Overall statistics</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Target className="h-8 w-8 text-indigo-600" />
                  <div>
                    <h3 className="font-medium">Grade Distribution</h3>
                    <p className="text-sm text-muted-foreground">Grade-wise breakdown</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Detailed Result Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detailed Result - {selectedResult?.name}</DialogTitle>
            <DialogDescription>
              Complete examination result details and subject-wise breakdown
            </DialogDescription>
          </DialogHeader>
          {selectedResult && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Student Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Name:</span>
                      <span className="font-medium">{selectedResult.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Roll Number:</span>
                      <span className="font-medium">{selectedResult.rollNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Program:</span>
                      <span className="font-medium">{selectedResult.program}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Semester:</span>
                      <span className="font-medium">{selectedResult.semester}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Overall Performance</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Marks:</span>
                      <span className="font-medium">
                        {selectedResult.totalObtainedMarks}/{selectedResult.totalMaxMarks}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Percentage:</span>
                      <span className="font-medium">{selectedResult.percentage.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CGPA:</span>
                      <span className="font-medium">{selectedResult.cgpa}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SGPA:</span>
                      <span className="font-medium">{selectedResult.sgpa}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Grade:</span>
                      <Badge className={getGradeBadge(selectedResult.overallGrade)}>
                        {selectedResult.overallGrade}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Result:</span>
                      <Badge className={getResultBadge(selectedResult.result)}>
                        {selectedResult.result}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Subject-wise Results</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedResult.subjects.map((subject, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{subject.subjectName}</TableCell>
                        <TableCell>{subject.subjectCode}</TableCell>
                        <TableCell>{subject.credits}</TableCell>
                        <TableCell>
                          {subject.obtainedMarks}/{subject.maxMarks}
                        </TableCell>
                        <TableCell>
                          <Badge className={getGradeBadge(subject.grade)}>
                            {subject.grade}
                          </Badge>
                        </TableCell>
                        <TableCell>{subject.gradePoints}</TableCell>
                        <TableCell>
                          <Badge 
                            className={subject.status === 'Pass' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                            }
                          >
                            {subject.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {selectedResult.remarks && (
                <div>
                  <h4 className="font-medium mb-2">Remarks</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                    {selectedResult.remarks}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
