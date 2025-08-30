import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { PermissionGuard } from '@/components/PermissionGuard';
import { 
  Plus, Search, Filter, Edit, Trash2, Eye, FileText, Users, BookOpen, 
  Target, CheckCircle, AlertCircle, Clock, Settings, Download
} from 'lucide-react';

interface BlueprintSection {
  id: string;
  sectionName: string;
  questionType: 'Long Answer' | 'Short Answer' | 'Multiple Choice' | 'True/False' | 'Fill in Blanks' | 'Match Following';
  numberOfQuestions: number;
  marksPerQuestion: number;
  totalMarks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  chapter: string;
  learningOutcome: string;
}

interface QuestionPaperBlueprint {
  id: string;
  blueprintName: string;
  subject: string;
  subjectCode: string;
  program: string;
  semester: string;
  examType: 'Regular' | 'Supplementary' | 'Backlog';
  academicYear: string;
  totalMarks: number;
  passMarks: number;
  duration: number;
  sections: BlueprintSection[];
  status: 'Draft' | 'Active' | 'Archived';
  createdBy: string;
  createdDate: string;
  approvedBy?: string;
  approvedDate?: string;
}

const initialBlueprints: QuestionPaperBlueprint[] = [
  {
    id: 'BP001',
    blueprintName: 'Composite Materials - End Semester',
    subject: 'Composite Materials',
    subjectCode: 'ME305',
    program: 'B.E Mechanical Engineering',
    semester: 'V',
    examType: 'Regular',
    academicYear: '2023-24',
    totalMarks: 100,
    passMarks: 50,
    duration: 180,
    sections: [
      {
        id: 'SEC001',
        sectionName: 'Section A - Theory',
        questionType: 'Long Answer',
        numberOfQuestions: 5,
        marksPerQuestion: 15,
        totalMarks: 75,
        difficulty: 'Medium',
        chapter: 'All Chapters',
        learningOutcome: 'Understand and analyze composite material concepts'
      },
      {
        id: 'SEC002',
        sectionName: 'Section B - Applications',
        questionType: 'Short Answer',
        numberOfQuestions: 5,
        marksPerQuestion: 5,
        totalMarks: 25,
        difficulty: 'Easy',
        chapter: 'Applications',
        learningOutcome: 'Apply knowledge to real-world scenarios'
      }
    ],
    status: 'Active',
    createdBy: 'Dr. Kumar',
    createdDate: '2024-01-15',
    approvedBy: 'Prof. Sharma',
    approvedDate: '2024-01-20'
  },
  {
    id: 'BP002',
    blueprintName: 'Data Structures - Mid Semester',
    subject: 'Data Structures',
    subjectCode: 'CS201',
    program: 'B.E Computer Science Engineering',
    semester: 'III',
    examType: 'Regular',
    academicYear: '2023-24',
    totalMarks: 50,
    passMarks: 25,
    duration: 90,
    sections: [
      {
        id: 'SEC003',
        sectionName: 'Section A - MCQ',
        questionType: 'Multiple Choice',
        numberOfQuestions: 10,
        marksPerQuestion: 2,
        totalMarks: 20,
        difficulty: 'Easy',
        chapter: 'Arrays and Linked Lists',
        learningOutcome: 'Basic understanding of data structures'
      },
      {
        id: 'SEC004',
        sectionName: 'Section B - Programming',
        questionType: 'Long Answer',
        numberOfQuestions: 2,
        marksPerQuestion: 15,
        totalMarks: 30,
        difficulty: 'Hard',
        chapter: 'Trees and Graphs',
        learningOutcome: 'Implement and analyze complex data structures'
      }
    ],
    status: 'Draft',
    createdBy: 'Dr. Singh',
    createdDate: '2024-02-01'
  }
];

export default function PaperBlueprint() {
  const { user } = useAuth();
  const [blueprints, setBlueprints] = useState<QuestionPaperBlueprint[]>(initialBlueprints);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBlueprint, setSelectedBlueprint] = useState<QuestionPaperBlueprint | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [newBlueprint, setNewBlueprint] = useState({
    blueprintName: '',
    subject: '',
    subjectCode: '',
    program: '',
    semester: '',
    examType: 'Regular' as QuestionPaperBlueprint['examType'],
    academicYear: '',
    totalMarks: 100,
    passMarks: 50,
    duration: 180
  });

  const filteredBlueprints = blueprints.filter(blueprint => {
    const matchesSearch = blueprint.blueprintName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blueprint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blueprint.subjectCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || blueprint.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: blueprints.length,
    active: blueprints.filter(b => b.status === 'Active').length,
    draft: blueprints.filter(b => b.status === 'Draft').length,
    archived: blueprints.filter(b => b.status === 'Archived').length
  };

  const handleCreateBlueprint = () => {
    const blueprint: QuestionPaperBlueprint = {
      id: `BP${String(blueprints.length + 1).padStart(3, '0')}`,
      ...newBlueprint,
      sections: [],
      status: 'Draft',
      createdBy: user?.name || 'Current User',
      createdDate: new Date().toISOString().split('T')[0]
    };
    
    setBlueprints([...blueprints, blueprint]);
    setIsCreateDialogOpen(false);
    setNewBlueprint({
      blueprintName: '',
      subject: '',
      subjectCode: '',
      program: '',
      semester: '',
      examType: 'Regular',
      academicYear: '',
      totalMarks: 100,
      passMarks: 50,
      duration: 180
    });
  };

  const handleDeleteBlueprint = (blueprintId: string) => {
    setBlueprints(blueprints.filter(b => b.id !== blueprintId));
  };

  const handleApproveBlueprint = (blueprintId: string) => {
    setBlueprints(blueprints.map(b => 
      b.id === blueprintId 
        ? { ...b, status: 'Active' as const, approvedBy: user?.name, approvedDate: new Date().toISOString().split('T')[0] }
        : b
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Question Paper Blueprint</h1>
          <p className="text-muted-foreground">
            Create and manage question paper blueprints with section configuration and marking schemes
          </p>
        </div>
        <PermissionGuard resource="exam_blueprints" operation="create">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Blueprint
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Question Paper Blueprint</DialogTitle>
                <DialogDescription>
                  Set up a new blueprint for question paper generation
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="blueprintName">Blueprint Name</Label>
                  <Input
                    id="blueprintName"
                    value={newBlueprint.blueprintName}
                    onChange={(e) => setNewBlueprint({...newBlueprint, blueprintName: e.target.value})}
                    placeholder="Enter blueprint name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={newBlueprint.subject}
                    onChange={(e) => setNewBlueprint({...newBlueprint, subject: e.target.value})}
                    placeholder="Subject name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subjectCode">Subject Code</Label>
                  <Input
                    id="subjectCode"
                    value={newBlueprint.subjectCode}
                    onChange={(e) => setNewBlueprint({...newBlueprint, subjectCode: e.target.value})}
                    placeholder="e.g., ME305"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="program">Program</Label>
                  <Select value={newBlueprint.program} onValueChange={(value) => setNewBlueprint({...newBlueprint, program: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="B.E Computer Science Engineering">B.E Computer Science Engineering</SelectItem>
                      <SelectItem value="B.E Mechanical Engineering">B.E Mechanical Engineering</SelectItem>
                      <SelectItem value="B.E Electrical Engineering">B.E Electrical Engineering</SelectItem>
                      <SelectItem value="Diploma in Computer Engineering">Diploma in Computer Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Select value={newBlueprint.semester} onValueChange={(value) => setNewBlueprint({...newBlueprint, semester: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'].map(sem => (
                        <SelectItem key={sem} value={sem}>Semester {sem}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="examType">Exam Type</Label>
                  <Select value={newBlueprint.examType} onValueChange={(value: QuestionPaperBlueprint['examType']) => setNewBlueprint({...newBlueprint, examType: value})}>
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
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Input
                    id="academicYear"
                    value={newBlueprint.academicYear}
                    onChange={(e) => setNewBlueprint({...newBlueprint, academicYear: e.target.value})}
                    placeholder="e.g., 2023-24"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalMarks">Total Marks</Label>
                  <Input
                    id="totalMarks"
                    type="number"
                    value={newBlueprint.totalMarks}
                    onChange={(e) => setNewBlueprint({...newBlueprint, totalMarks: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passMarks">Pass Marks</Label>
                  <Input
                    id="passMarks"
                    type="number"
                    value={newBlueprint.passMarks}
                    onChange={(e) => setNewBlueprint({...newBlueprint, passMarks: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newBlueprint.duration}
                    onChange={(e) => setNewBlueprint({...newBlueprint, duration: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateBlueprint}>
                  Create Blueprint
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </PermissionGuard>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Blueprints</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Draft</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Archived</p>
                <p className="text-2xl font-bold text-gray-600">{stats.archived}</p>
              </div>
              <Target className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search blueprints..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
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
              <DialogTitle>Advanced Blueprint Filters</DialogTitle>
              <DialogDescription>
                Apply advanced filtering criteria to find specific blueprints
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Academic Year</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select academic year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-25">2024-25</SelectItem>
                    <SelectItem value="2023-24">2023-24</SelectItem>
                    <SelectItem value="2022-23">2022-23</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Created Date Range</Label>
                <Input type="date" placeholder="From date" />
              </div>
              <div className="space-y-2">
                <Label>Total Marks Range</Label>
                <div className="flex gap-2">
                  <Input type="number" placeholder="Min" />
                  <Input type="number" placeholder="Max" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Duration Range (minutes)</Label>
                <div className="flex gap-2">
                  <Input type="number" placeholder="Min" />
                  <Input type="number" placeholder="Max" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Created By</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select creator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Creators</SelectItem>
                    <SelectItem value="Dr. Kumar">Dr. Kumar</SelectItem>
                    <SelectItem value="Dr. Singh">Dr. Singh</SelectItem>
                    <SelectItem value="Prof. Sharma">Prof. Sharma</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Has Sections</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Section criteria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any sections</SelectItem>
                    <SelectItem value="none">No sections</SelectItem>
                    <SelectItem value="multiple">Multiple sections</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Additional Filters</Label>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="approved" />
                    <Label htmlFor="approved" className="text-sm">Approved only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="recent" />
                    <Label htmlFor="recent" className="text-sm">Last 30 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="active" />
                    <Label htmlFor="active" className="text-sm">Active status only</Label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  // Reset all form fields in the dialog
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

                    // Reset selects to default
                    selects.forEach(select => {
                      select.selectedIndex = 0;
                    });
                  }

                  alert('All blueprint filters have been reset to default values');
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
                    const minMarks = dialog.querySelector('input[placeholder="Min"]:first-of-type')?.value;
                    const maxMarks = dialog.querySelector('input[placeholder="Max"]:first-of-type')?.value;
                    const minDuration = dialog.querySelectorAll('input[placeholder="Min"]')[1]?.value;
                    const maxDuration = dialog.querySelectorAll('input[placeholder="Max"]')[1]?.value;
                    const approvedOnly = dialog.querySelector('input#approved')?.checked;
                    const recentOnly = dialog.querySelector('input#recent')?.checked;
                    const activeOnly = dialog.querySelector('input#active')?.checked;

                    const filters = {
                      dateRange: fromDate ? `From ${fromDate}` : null,
                      marksRange: minMarks && maxMarks ? `${minMarks} - ${maxMarks} marks` : null,
                      durationRange: minDuration && maxDuration ? `${minDuration} - ${maxDuration} minutes` : null,
                      approvedOnly,
                      recentOnly,
                      activeOnly
                    };

                    const activeFilters = Object.entries(filters)
                      .filter(([key, value]) => value)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(', ');

                    if (activeFilters) {
                      alert(`Blueprint filters applied successfully!\n\nActive filters: ${activeFilters}`);
                    } else {
                      alert('No filters selected. Showing all blueprints.');
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

      {/* Blueprints Table */}
      <Card>
        <CardHeader>
          <CardTitle>Question Paper Blueprints</CardTitle>
          <CardDescription>
            Manage blueprints for automated question paper generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Blueprint Details</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Exam Configuration</TableHead>
                <TableHead>Sections</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBlueprints.map((blueprint) => (
                <TableRow key={blueprint.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{blueprint.blueprintName}</div>
                      <div className="text-sm text-muted-foreground">{blueprint.program}</div>
                      <div className="text-sm text-muted-foreground">Semester {blueprint.semester}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{blueprint.subject}</div>
                      <div className="text-sm text-muted-foreground">{blueprint.subjectCode}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div><strong>Marks:</strong> {blueprint.totalMarks} (Pass: {blueprint.passMarks})</div>
                      <div><strong>Duration:</strong> {blueprint.duration} min</div>
                      <div><strong>Type:</strong> {blueprint.examType}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {blueprint.sections.length} sections
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(blueprint.status)}>
                      {blueprint.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{blueprint.createdBy}</div>
                      <div className="text-muted-foreground">{blueprint.createdDate}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedBlueprint(blueprint);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <PermissionGuard resource="exam_blueprints" operation="update">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </PermissionGuard>

                      {blueprint.status === 'Draft' && (
                        <PermissionGuard resource="exam_blueprints" operation="approve">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApproveBlueprint(blueprint.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </PermissionGuard>
                      )}

                      <PermissionGuard resource="exam_blueprints" operation="delete">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Blueprint</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this blueprint? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteBlueprint(blueprint.id)}>
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

      {/* View Blueprint Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Blueprint Details</DialogTitle>
            <DialogDescription>
              {selectedBlueprint?.blueprintName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedBlueprint && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>Subject:</strong> {selectedBlueprint.subject} ({selectedBlueprint.subjectCode})</div>
                    <div><strong>Program:</strong> {selectedBlueprint.program}</div>
                    <div><strong>Semester:</strong> {selectedBlueprint.semester}</div>
                    <div><strong>Exam Type:</strong> {selectedBlueprint.examType}</div>
                    <div><strong>Academic Year:</strong> {selectedBlueprint.academicYear}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Exam Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>Total Marks:</strong> {selectedBlueprint.totalMarks}</div>
                    <div><strong>Pass Marks:</strong> {selectedBlueprint.passMarks}</div>
                    <div><strong>Duration:</strong> {selectedBlueprint.duration} minutes</div>
                    <div><strong>Status:</strong> <Badge className={getStatusColor(selectedBlueprint.status)}>{selectedBlueprint.status}</Badge></div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Section Configuration</CardTitle>
                  <CardDescription>Question distribution and marking scheme</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Section</TableHead>
                        <TableHead>Question Type</TableHead>
                        <TableHead>No. of Questions</TableHead>
                        <TableHead>Marks/Question</TableHead>
                        <TableHead>Total Marks</TableHead>
                        <TableHead>Difficulty</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedBlueprint.sections.map((section) => (
                        <TableRow key={section.id}>
                          <TableCell>{section.sectionName}</TableCell>
                          <TableCell>{section.questionType}</TableCell>
                          <TableCell>{section.numberOfQuestions}</TableCell>
                          <TableCell>{section.marksPerQuestion}</TableCell>
                          <TableCell>{section.totalMarks}</TableCell>
                          <TableCell>
                            <Badge variant={
                              section.difficulty === 'Easy' ? 'secondary' :
                              section.difficulty === 'Medium' ? 'default' : 'destructive'
                            }>
                              {section.difficulty}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
