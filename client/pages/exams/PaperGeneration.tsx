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
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { PermissionGuard } from '@/components/PermissionGuard';
import { 
  Plus, Search, Filter, Edit, Trash2, Eye, FileText, Users, BookOpen, 
  Target, CheckCircle, AlertCircle, Clock, Settings, Download, RefreshCw,
  Shuffle, CheckSquare, AlertTriangle
} from 'lucide-react';

interface GeneratedPaper {
  id: string;
  paperCode: string;
  subject: string;
  subjectCode: string;
  blueprintName: string;
  examType: 'Regular' | 'Supplementary' | 'Backlog';
  totalMarks: number;
  duration: number;
  questionsCount: number;
  generatedDate: string;
  generatedBy: string;
  status: 'Generated' | 'Reviewed' | 'Approved' | 'Published';
  reviewedBy?: string;
  approvedBy?: string;
  isAnswerKeyGenerated: boolean;
  previousYearExcluded: boolean;
  similarQuestionsChecked: boolean;
  duplicateAlerts: number;
}

const initialPapers: GeneratedPaper[] = [
  {
    id: 'QP001',
    paperCode: 'ME305-ESE-2024-A',
    subject: 'Composite Materials',
    subjectCode: 'ME305',
    blueprintName: 'Composite Materials - End Semester',
    examType: 'Regular',
    totalMarks: 100,
    duration: 180,
    questionsCount: 10,
    generatedDate: '2024-02-15',
    generatedBy: 'Dr. Kumar',
    status: 'Approved',
    reviewedBy: 'Prof. Sharma',
    approvedBy: 'HOD Mechanical',
    isAnswerKeyGenerated: true,
    previousYearExcluded: true,
    similarQuestionsChecked: true,
    duplicateAlerts: 0
  },
  {
    id: 'QP002',
    paperCode: 'CS201-MSE-2024-B',
    subject: 'Data Structures',
    subjectCode: 'CS201',
    blueprintName: 'Data Structures - Mid Semester',
    examType: 'Regular',
    totalMarks: 50,
    duration: 90,
    questionsCount: 12,
    generatedDate: '2024-02-18',
    generatedBy: 'Dr. Singham',
    status: 'Generated',
    isAnswerKeyGenerated: false,
    previousYearExcluded: true,
    similarQuestionsChecked: false,
    duplicateAlerts: 2
  },
  {
    id: 'QP003',
    paperCode: 'ME305-SUP-2024-A',
    subject: 'Composite Materials',
    subjectCode: 'ME305',
    blueprintName: 'Composite Materials - Supplementary',
    examType: 'Supplementary',
    totalMarks: 100,
    duration: 180,
    questionsCount: 10,
    generatedDate: '2024-02-20',
    generatedBy: 'Dr. Kumar',
    status: 'Reviewed',
    reviewedBy: 'Prof. Sharma',
    isAnswerKeyGenerated: true,
    previousYearExcluded: false,
    similarQuestionsChecked: true,
    duplicateAlerts: 1
  }
];

const availableBlueprints = [
  { id: 'BP001', name: 'Composite Materials - End Semester', subject: 'ME305' },
  { id: 'BP002', name: 'Data Structures - Mid Semester', subject: 'CS201' },
  { id: 'BP003', name: 'Digital Electronics - Final', subject: 'EE203' },
  { id: 'BP004', name: 'Software Engineering - Mid Term', subject: 'CS301' }
];

export default function PaperGeneration() {
  const { user } = useAuth();
  const [papers, setPapers] = useState<GeneratedPaper[]>(initialPapers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPaper, setSelectedPaper] = useState<GeneratedPaper | null>(null);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const [generationConfig, setGenerationConfig] = useState({
    blueprintId: '',
    paperCount: 1,
    examType: 'Regular' as GeneratedPaper['examType'],
    excludePreviousYears: 2,
    checkSimilarQuestions: true,
    generateAnswerKey: true,
    randomizeQuestions: true
  });

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.paperCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.subjectCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || paper.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: papers.length,
    generated: papers.filter(p => p.status === 'Generated').length,
    reviewed: papers.filter(p => p.status === 'Reviewed').length,
    approved: papers.filter(p => p.status === 'Approved').length,
    published: papers.filter(p => p.status === 'Published').length
  };

  const handleGeneratePapers = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate paper generation process
    const intervals = [20, 40, 60, 80, 100];
    for (let i = 0; i < intervals.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setGenerationProgress(intervals[i]);
    }

    // Generate papers
    const selectedBlueprint = availableBlueprints.find(b => b.id === generationConfig.blueprintId);
    if (selectedBlueprint) {
      for (let i = 0; i < generationConfig.paperCount; i++) {
        const newPaper: GeneratedPaper = {
          id: `QP${String(papers.length + i + 1).padStart(3, '0')}`,
          paperCode: `${selectedBlueprint.subject}-${generationConfig.examType.toUpperCase()}-2024-${String.fromCharCode(65 + i)}`,
          subject: selectedBlueprint.name.split(' - ')[0],
          subjectCode: selectedBlueprint.subject,
          blueprintName: selectedBlueprint.name,
          examType: generationConfig.examType,
          totalMarks: 100,
          duration: 180,
          questionsCount: 10,
          generatedDate: new Date().toISOString().split('T')[0],
          generatedBy: user?.name || 'Current User',
          status: 'Generated',
          isAnswerKeyGenerated: generationConfig.generateAnswerKey,
          previousYearExcluded: generationConfig.excludePreviousYears > 0,
          similarQuestionsChecked: generationConfig.checkSimilarQuestions,
          duplicateAlerts: Math.floor(Math.random() * 3)
        };
        
        setPapers(prev => [...prev, newPaper]);
      }
    }

    setIsGenerating(false);
    setGenerationProgress(0);
    setIsGenerateDialogOpen(false);
    setGenerationConfig({
      blueprintId: '',
      paperCount: 1,
      examType: 'Regular',
      excludePreviousYears: 2,
      checkSimilarQuestions: true,
      generateAnswerKey: true,
      randomizeQuestions: true
    });
  };

  const handleStatusUpdate = (paperId: string, newStatus: GeneratedPaper['status']) => {
    setPapers(papers.map(p => 
      p.id === paperId 
        ? { 
            ...p, 
            status: newStatus,
            ...(newStatus === 'Reviewed' && { reviewedBy: user?.name }),
            ...(newStatus === 'Approved' && { approvedBy: user?.name })
          }
        : p
    ));
  };

  const handleDeletePaper = (paperId: string) => {
    setPapers(papers.filter(p => p.id !== paperId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Generated': return 'bg-blue-100 text-blue-800';
      case 'Reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Published': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Question Paper Generation</h1>
          <p className="text-muted-foreground">
            Generate multiple question papers using blueprints with duplicate detection and answer keys
          </p>
        </div>
        <PermissionGuard resource="exam_papers" operation="create">
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Generate Papers
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Generate Question Papers</DialogTitle>
                <DialogDescription>
                  Configure paper generation settings and options
                </DialogDescription>
              </DialogHeader>
              
              {isGenerating ? (
                <div className="space-y-4 py-6">
                  <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <h3 className="text-lg font-medium">Generating Question Papers</h3>
                    <p className="text-sm text-muted-foreground">Please wait while we create your papers...</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{generationProgress}%</span>
                    </div>
                    <Progress value={generationProgress} className="w-full" />
                  </div>
                  <div className="text-xs text-muted-foreground text-center">
                    {generationProgress < 40 && "Selecting questions from question bank..."}
                    {generationProgress >= 40 && generationProgress < 80 && "Checking for duplicates and similar questions..."}
                    {generationProgress >= 80 && "Generating answer keys and finalizing papers..."}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="blueprintId">Select Blueprint</Label>
                    <Select value={generationConfig.blueprintId} onValueChange={(value) => setGenerationConfig({...generationConfig, blueprintId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a blueprint" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBlueprints.map(blueprint => (
                          <SelectItem key={blueprint.id} value={blueprint.id}>
                            {blueprint.name} ({blueprint.subject})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="paperCount">Number of Papers</Label>
                      <Input
                        id="paperCount"
                        type="number"
                        min="1"
                        max="10"
                        value={generationConfig.paperCount}
                        onChange={(e) => setGenerationConfig({...generationConfig, paperCount: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="examType">Exam Type</Label>
                      <Select value={generationConfig.examType} onValueChange={(value: GeneratedPaper['examType']) => setGenerationConfig({...generationConfig, examType: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Regular">Regular</SelectItem>
                          <SelectItem value="Supplementary">Supplementary</SelectItem>
                          <SelectItem value="Backlog">Backlog</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="excludeYears">Exclude Previous Years</Label>
                    <Select value={String(generationConfig.excludePreviousYears)} onValueChange={(value) => setGenerationConfig({...generationConfig, excludePreviousYears: parseInt(value)})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Don't exclude</SelectItem>
                        <SelectItem value="1">Last 1 year</SelectItem>
                        <SelectItem value="2">Last 2 years</SelectItem>
                        <SelectItem value="3">Last 3 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="checkSimilar"
                        checked={generationConfig.checkSimilarQuestions}
                        onCheckedChange={(checked) => setGenerationConfig({...generationConfig, checkSimilarQuestions: checked as boolean})}
                      />
                      <Label htmlFor="checkSimilar">Check for similar questions</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="generateAnswers"
                        checked={generationConfig.generateAnswerKey}
                        onCheckedChange={(checked) => setGenerationConfig({...generationConfig, generateAnswerKey: checked as boolean})}
                      />
                      <Label htmlFor="generateAnswers">Generate answer keys</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="randomize"
                        checked={generationConfig.randomizeQuestions}
                        onCheckedChange={(checked) => setGenerationConfig({...generationConfig, randomizeQuestions: checked as boolean})}
                      />
                      <Label htmlFor="randomize">Randomize question order</Label>
                    </div>
                  </div>
                </div>
              )}
              
              {!isGenerating && (
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleGeneratePapers} disabled={!generationConfig.blueprintId}>
                    <Shuffle className="h-4 w-4 mr-2" />
                    Generate Papers
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </PermissionGuard>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Papers</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Generated</p>
                <p className="text-2xl font-bold text-blue-600">{stats.generated}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reviewed</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.reviewed}</p>
              </div>
              <Eye className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Published</p>
                <p className="text-2xl font-bold text-purple-600">{stats.published}</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search papers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="generated">Generated</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Advanced Paper Filters</DialogTitle>
              <DialogDescription>
                Apply advanced filtering criteria to find specific generated papers
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Generation Date Range</Label>
                <div className="flex gap-2">
                  <Input type="date" placeholder="From date" />
                  <Input type="date" placeholder="To date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Generated By</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select generator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Generators</SelectItem>
                    <SelectItem value="Dr. Kumar">Dr. Kumar</SelectItem>
                    <SelectItem value="Dr. Singh">Dr. Singh</SelectItem>
                    <SelectItem value="Prof. Wilson">Prof. Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quality Checks</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Quality criteria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Papers</SelectItem>
                    <SelectItem value="no-duplicates">No Duplicate Alerts</SelectItem>
                    <SelectItem value="previous-excluded">Previous Year Excluded</SelectItem>
                    <SelectItem value="similarity-checked">Similarity Checked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Answer Key Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Answer key criteria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Papers</SelectItem>
                    <SelectItem value="with-key">With Answer Key</SelectItem>
                    <SelectItem value="without-key">Without Answer Key</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Total Marks Range</Label>
                <div className="flex gap-2">
                  <Input type="number" placeholder="Min marks" />
                  <Input type="number" placeholder="Max marks" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Blueprint Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blueprint" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Blueprints</SelectItem>
                    <SelectItem value="end-semester">End Semester</SelectItem>
                    <SelectItem value="mid-semester">Mid Semester</SelectItem>
                    <SelectItem value="supplementary">Supplementary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Additional Filters</Label>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="reviewed" />
                    <Label htmlFor="reviewed" className="text-sm">Reviewed papers only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="approved" />
                    <Label htmlFor="approved" className="text-sm">Approved papers only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="published" />
                    <Label htmlFor="published" className="text-sm">Published papers only</Label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  // Reset all form fields to default values
                  const dialog = document.querySelector('[role="dialog"]');
                  if (dialog) {
                    const inputs = dialog.querySelectorAll('input');
                    const selects = dialog.querySelectorAll('select');
                    const checkboxes = dialog.querySelectorAll('input[type="checkbox"]');

                    inputs.forEach(input => {
                      if (input.type !== 'checkbox') {
                        input.value = '';
                      }
                    });

                    checkboxes.forEach(checkbox => {
                      checkbox.checked = false;
                    });

                    // Reset selects (this would need to be handled by state in a real app)
                    selects.forEach(select => {
                      select.selectedIndex = 0;
                    });
                  }

                  alert('All filters have been reset to default values');
                }}
              >
                Reset Filters
              </Button>
              <Button
                onClick={() => {
                  // Collect filter values
                  const dialog = document.querySelector('[role="dialog"]');
                  if (dialog) {
                    const fromDate = dialog.querySelector('input[placeholder="From date"]')?.value;
                    const toDate = dialog.querySelector('input[placeholder="To date"]')?.value;
                    const minMarks = dialog.querySelector('input[placeholder="Min marks"]')?.value;
                    const maxMarks = dialog.querySelector('input[placeholder="Max marks"]')?.value;
                    const reviewedOnly = dialog.querySelector('input#reviewed')?.checked;
                    const approvedOnly = dialog.querySelector('input#approved')?.checked;
                    const publishedOnly = dialog.querySelector('input#published')?.checked;

                    const filters = {
                      dateRange: fromDate && toDate ? `${fromDate} to ${toDate}` : null,
                      marksRange: minMarks && maxMarks ? `${minMarks} - ${maxMarks}` : null,
                      reviewedOnly,
                      approvedOnly,
                      publishedOnly
                    };

                    const activeFilters = Object.entries(filters)
                      .filter(([key, value]) => value)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(', ');

                    if (activeFilters) {
                      alert(`Filters applied successfully!\n\nActive filters: ${activeFilters}`);
                    } else {
                      alert('No filters selected. Showing all papers.');
                    }

                    // In a real app, this would trigger a data refresh with the applied filters
                  }
                }}
              >
                Apply Filters
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Papers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Question Papers</CardTitle>
          <CardDescription>
            Manage generated question papers and their approval workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paper Code</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Blueprint</TableHead>
                <TableHead>Configuration</TableHead>
                <TableHead>Quality Checks</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Generated By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPapers.map((paper) => (
                <TableRow key={paper.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{paper.paperCode}</div>
                      <div className="text-sm text-muted-foreground">{paper.examType}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{paper.subject}</div>
                      <div className="text-sm text-muted-foreground">{paper.subjectCode}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{paper.blueprintName}</div>
                      <div className="text-muted-foreground">{paper.questionsCount} questions</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div><strong>Marks:</strong> {paper.totalMarks}</div>
                      <div><strong>Duration:</strong> {paper.duration} min</div>
                      <div className="flex items-center gap-1 mt-1">
                        {paper.isAnswerKeyGenerated && <CheckSquare className="h-3 w-3 text-green-600" />}
                        <span className="text-xs">Answer Key</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs">
                        {paper.previousYearExcluded ? (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-yellow-600" />
                        )}
                        Previous Year Check
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        {paper.similarQuestionsChecked ? (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-yellow-600" />
                        )}
                        Similarity Check
                      </div>
                      {paper.duplicateAlerts > 0 && (
                        <div className="flex items-center gap-1 text-xs text-red-600">
                          <AlertTriangle className="h-3 w-3" />
                          {paper.duplicateAlerts} Alerts
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(paper.status)}>
                      {paper.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{paper.generatedBy}</div>
                      <div className="text-muted-foreground">{paper.generatedDate}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPaper(paper);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Download Paper - {paper.paperCode}</DialogTitle>
                            <DialogDescription>
                              Choose download format and options for the generated paper
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Download Format</Label>
                              <Select defaultValue="pdf">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pdf">PDF Document</SelectItem>
                                  <SelectItem value="docx">Word Document</SelectItem>
                                  <SelectItem value="txt">Plain Text</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Include Options</Label>
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <input type="checkbox" id="answer-key" defaultChecked={paper.isAnswerKeyGenerated} />
                                  <Label htmlFor="answer-key" className="text-sm">Include Answer Key</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input type="checkbox" id="marking-scheme" />
                                  <Label htmlFor="marking-scheme" className="text-sm">Include Marking Scheme</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input type="checkbox" id="instructions" defaultChecked />
                                  <Label htmlFor="instructions" className="text-sm">Include Instructions</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input type="checkbox" id="watermark" />
                                  <Label htmlFor="watermark" className="text-sm">Add Watermark</Label>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Paper Version</Label>
                              <Select defaultValue="student">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="student">Student Version</SelectItem>
                                  <SelectItem value="examiner">Examiner Version</SelectItem>
                                  <SelectItem value="invigilator">Invigilator Version</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex justify-end gap-3">
                            <Button
                              variant="outline"
                              onClick={() => {
                                // Close the dialog
                                const dialog = document.querySelector('[role="dialog"]');
                                const closeButton = dialog?.querySelector('[aria-label="Close"]');
                                if (closeButton) {
                                  closeButton.click();
                                } else {
                                  // Alternative method to close dialog
                                  const backdrop = document.querySelector('[data-radix-popper-content-wrapper]');
                                  if (backdrop?.parentElement) {
                                    backdrop.parentElement.style.display = 'none';
                                  }
                                }
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => {
                                // Get selected options
                                const format = document.querySelector('select')?.value || 'pdf';
                                const includeAnswerKey = document.querySelector('#answer-key')?.checked;
                                const includeMarkingScheme = document.querySelector('#marking-scheme')?.checked;
                                const includeInstructions = document.querySelector('#instructions')?.checked;
                                const addWatermark = document.querySelector('#watermark')?.checked;

                                // Generate download content
                                const downloadOptions = {
                                  paperCode: paper.paperCode,
                                  subject: paper.subject,
                                  format: format,
                                  options: {
                                    answerKey: includeAnswerKey,
                                    markingScheme: includeMarkingScheme,
                                    instructions: includeInstructions,
                                    watermark: addWatermark
                                  },
                                  timestamp: new Date().toISOString()
                                };

                                // Create and download file
                                const content = format === 'pdf'
                                  ? `PDF Document: ${paper.paperCode}\n\nSubject: ${paper.subject}\nTotal Marks: ${paper.totalMarks}\nDuration: ${paper.duration}\n\nOptions: ${JSON.stringify(downloadOptions.options, null, 2)}`
                                  : JSON.stringify(downloadOptions, null, 2);

                                const blob = new Blob([content], {
                                  type: format === 'pdf' ? 'application/pdf' : format === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'text/plain'
                                });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `${paper.paperCode}_${paper.subject.replace(' ', '_')}.${format}`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);

                                alert(`Download started: ${paper.paperCode} in ${format.toUpperCase()} format`);
                              }}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {paper.status === 'Generated' && (
                        <PermissionGuard resource="exam_papers" operation="review">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusUpdate(paper.id, 'Reviewed')}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </PermissionGuard>
                      )}

                      {paper.status === 'Reviewed' && (
                        <PermissionGuard resource="exam_papers" operation="approve">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusUpdate(paper.id, 'Approved')}
                          >
                            <CheckSquare className="h-4 w-4" />
                          </Button>
                        </PermissionGuard>
                      )}

                      <PermissionGuard resource="exam_papers" operation="delete">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Question Paper</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this generated paper? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeletePaper(paper.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </PermissionGuard>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Paper Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Question Paper Details</DialogTitle>
            <DialogDescription>
              {selectedPaper?.paperCode}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPaper && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Paper Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>Subject:</strong> {selectedPaper.subject} ({selectedPaper.subjectCode})</div>
                    <div><strong>Blueprint:</strong> {selectedPaper.blueprintName}</div>
                    <div><strong>Exam Type:</strong> {selectedPaper.examType}</div>
                    <div><strong>Total Marks:</strong> {selectedPaper.totalMarks}</div>
                    <div><strong>Duration:</strong> {selectedPaper.duration} minutes</div>
                    <div><strong>Questions:</strong> {selectedPaper.questionsCount}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Generation Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>Generated By:</strong> {selectedPaper.generatedBy}</div>
                    <div><strong>Generated On:</strong> {selectedPaper.generatedDate}</div>
                    <div><strong>Status:</strong> <Badge className={getStatusColor(selectedPaper.status)}>{selectedPaper.status}</Badge></div>
                    {selectedPaper.reviewedBy && <div><strong>Reviewed By:</strong> {selectedPaper.reviewedBy}</div>}
                    {selectedPaper.approvedBy && <div><strong>Approved By:</strong> {selectedPaper.approvedBy}</div>}
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quality Assurance</CardTitle>
                  <CardDescription>Automated checks and validations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      {selectedPaper.previousYearExcluded ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      )}
                      <span>Previous Year Questions Excluded</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedPaper.similarQuestionsChecked ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      )}
                      <span>Similar Questions Checked</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedPaper.isAnswerKeyGenerated ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      )}
                      <span>Answer Key Generated</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedPaper.duplicateAlerts === 0 ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                      <span>
                        {selectedPaper.duplicateAlerts === 0 
                          ? 'No Duplicate Alerts' 
                          : `${selectedPaper.duplicateAlerts} Duplicate Alerts`
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
