import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Network, Plus, Edit3, Trash2, BookOpen, Code, Calculator, Beaker, Building, Users, Clock, Link, Eye, Search, Filter, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface Program {
  id: string;
  name: string;
  code: string;
  level: string;
  type: string;
  department: string;
  duration: number;
  totalCredits: number;
  totalStudents: number;
  description: string;
  status: string;
  specializations: string[];
  created_at: string;
  updated_at: string;
}

interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  type: 'T' | 'P' | 'L' | 'PR';
  description?: string;
  status: 'active' | 'inactive';
  lectureHours?: number;
  tutorialHours?: number;
  practicalHours?: number;
  courseName: string;
  courseCode: string;
  semester: number;
  regulationYear: string;
}

interface ProgramCourseMapping {
  id: string;
  programId: string;
  courseId: string;
  semester: number;
  isCompulsory: boolean;
  prerequisites?: string[];
  createdDate: string;
}

export default function StreamCourseMappingSetup() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [mappings, setMappings] = useState<ProgramCourseMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [activeTab, setActiveTab] = useState('programs');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Pagination states
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [programsCurrentPage, setProgramsCurrentPage] = useState(1);
  const [coursesCurrentPage, setCoursesCurrentPage] = useState(1);

  // Dialog states
  const [isCreateMappingDialogOpen, setIsCreateMappingDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'map-course'>('main');
  const [selectedProgramForMapping, setSelectedProgramForMapping] = useState<string>('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Selected items
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [deleteType, setDeleteType] = useState<'program' | 'course' | 'mapping'>('mapping');

  // Form states
  const [mappingForm, setMappingForm] = useState({
    programId: '',
    courseId: '',
    semester: '',
    isCompulsory: 'true',
    prerequisites: ''
  });

  // Mock subjects data filtered from SubjectMasterSetup based on program codes 1010, 1012, 1040, and 1052
  const mockCourses: Course[] = [
    {
      id: '1',
      code: '105223110',
      name: 'DIGITAL LOGIC DESIGN',
      courseName: 'COMPUTER ENGINEERING (FULL TIME)',
      courseCode: '1052',
      credits: 3,
      lectureHours: 3,
      tutorialHours: 0,
      practicalHours: 0,
      semester: 3,
      regulationYear: 'R2023',
      type: 'T',
      description: 'Fundamentals of digital logic design, Boolean algebra, and combinational circuits',
      status: 'active'
    },
    {
      id: '2',
      code: '105223230',
      name: 'RDBMS',
      courseName: 'COMPUTER ENGINEERING (FULL TIME)',
      courseCode: '1052',
      credits: 4,
      lectureHours: 3,
      tutorialHours: 0,
      practicalHours: 2,
      semester: 3,
      regulationYear: 'R2023',
      type: 'P',
      description: 'Relational Database Management Systems with practical implementation',
      status: 'active'
    },
    {
      id: '3',
      code: '105223320',
      name: 'DIGITAL LOGIC DESIGN LAB',
      courseName: 'COMPUTER ENGINEERING (FULL TIME)',
      courseCode: '1052',
      credits: 2,
      lectureHours: 0,
      tutorialHours: 0,
      practicalHours: 4,
      semester: 3,
      regulationYear: 'R2023',
      type: 'L',
      description: 'Laboratory experiments for digital logic design and circuit implementation',
      status: 'active'
    },
    {
      id: '4',
      code: '105223140',
      name: 'C PROGRAMMING',
      courseName: 'COMPUTER ENGINEERING (FULL TIME)',
      courseCode: '1052',
      credits: 3,
      lectureHours: 1,
      tutorialHours: 0,
      practicalHours: 4,
      semester: 3,
      regulationYear: 'R2023',
      type: 'P',
      description: 'Programming fundamentals using C language with practical implementation',
      status: 'active'
    },
    {
      id: '5',
      code: '105223550',
      name: 'WEB DESIGNING',
      courseName: 'COMPUTER ENGINEERING (FULL TIME)',
      courseCode: '1052',
      credits: 3,
      lectureHours: 1,
      tutorialHours: 0,
      practicalHours: 4,
      semester: 3,
      regulationYear: 'R2023',
      type: 'P',
      description: 'Web development using HTML, CSS, and JavaScript with practical projects',
      status: 'active'
    },
    {
      id: '6',
      code: '105223640',
      name: 'OPERATING SYSTEMS',
      courseName: 'COMPUTER ENGINEERING (FULL TIME)',
      courseCode: '1052',
      credits: 2,
      lectureHours: 1,
      tutorialHours: 0,
      practicalHours: 2,
      semester: 3,
      regulationYear: 'R2023',
      type: 'P',
      description: 'Operating systems concepts with practical implementation and lab exercises',
      status: 'active'
    },
    // Electronics and Communication Engineering (1040) Courses
    {
      id: '7',
      code: '1040233110',
      name: 'ELECTRONIC DEVICES AND CIRCUITS',
      courseName: 'ELECTRONICS AND COMMUNICATION ENGINEERING (FULL TIME)',
      courseCode: '1040',
      credits: 4,
      lectureHours: 4,
      tutorialHours: 0,
      practicalHours: 0,
      semester: 3,
      regulationYear: 'R2023',
      type: 'T',
      description: 'Electronic devices, semiconductor theory, and circuit analysis',
      status: 'active'
    },
    {
      id: '8',
      code: '1040233210',
      name: 'DIGITAL ELECTRONICS',
      courseName: 'ELECTRONICS AND COMMUNICATION ENGINEERING (FULL TIME)',
      courseCode: '1040',
      credits: 4,
      lectureHours: 4,
      tutorialHours: 0,
      practicalHours: 0,
      semester: 3,
      regulationYear: 'R2023',
      type: 'T',
      description: 'Digital logic design, Boolean algebra, and digital systems',
      status: 'active'
    },
    {
      id: '9',
      code: '1040233320',
      name: 'ELECTRONIC DEVICES AND CIRCUITS PRACTICAL',
      courseName: 'ELECTRONICS AND COMMUNICATION ENGINEERING (FULL TIME)',
      courseCode: '1040',
      credits: 2,
      lectureHours: 0,
      tutorialHours: 0,
      practicalHours: 4,
      semester: 3,
      regulationYear: 'R2023',
      type: 'P',
      description: 'Practical experiments on electronic devices and circuit implementation',
      status: 'active'
    }
  ];

  // Sample mappings data
  const sampleMappings: ProgramCourseMapping[] = [
    // Civil Engineering mappings
    { id: '1', programId: '1010', courseId: '1', semester: 3, isCompulsory: true, createdDate: '2024-01-15' },
    { id: '2', programId: '1010', courseId: '2', semester: 3, isCompulsory: true, prerequisites: ['1'], createdDate: '2024-01-15' },

    // Architecture mappings
    { id: '3', programId: '1012', courseId: '3', semester: 3, isCompulsory: true, createdDate: '2024-01-15' },
    { id: '4', programId: '1012', courseId: '4', semester: 3, isCompulsory: true, createdDate: '2024-01-15' },
    { id: '5', programId: '2102', courseId: '5', semester: 3, isCompulsory: true, createdDate: '2024-01-15' },

    // Computer Engineering mappings
    { id: '6', programId: '1052', courseId: '6', semester: 3, isCompulsory: true, createdDate: '2024-01-15' },
    { id: '7', programId: '1052', courseId: '7', semester: 3, isCompulsory: true, prerequisites: ['6'], createdDate: '2024-01-15' },
    { id: '8', programId: '1052', courseId: '8', semester: 3, isCompulsory: true, prerequisites: ['6'], createdDate: '2024-01-15' },
    { id: '9', programId: '1052', courseId: '9', semester: 3, isCompulsory: true, createdDate: '2024-01-15' },
    { id: '10', programId: '1052', courseId: '10', semester: 3, isCompulsory: false, prerequisites: ['9'], createdDate: '2024-01-15' },
    { id: '11', programId: '1052', courseId: '11', semester: 3, isCompulsory: true, prerequisites: ['9'], createdDate: '2024-01-15' },

    // Electronics and Communication Engineering mappings
    { id: '12', programId: '1040', courseId: '7', semester: 3, isCompulsory: true, createdDate: '2024-01-15' },
    { id: '13', programId: '1040', courseId: '8', semester: 3, isCompulsory: true, createdDate: '2024-01-15' },
    { id: '14', programId: '1040', courseId: '9', semester: 3, isCompulsory: true, prerequisites: ['7'], createdDate: '2024-01-15' },
  ];

  // Load data on component mount
  useEffect(() => {
    loadProgramData();
    setCourses(mockCourses);
    setMappings(sampleMappings);
  }, []);

  const loadProgramData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/program.json');
      const data = await response.json();

      // Clean program data - remove git conflict markers and filter for codes 1010, 1012, 1040, and 1052
      const cleanData = data.filter((program: any) =>
        program &&
        typeof program === 'object' &&
        program.id &&
        program.name &&
        !program.id.includes('<<<<<<<') &&
        !program.id.includes('>>>>>>>') &&
        (program.code === '1010' || program.code === '1012' || program.code === '1040' || program.code === '1052')
      );

      setPrograms(cleanData);
      if (cleanData.length > 0) {
        setSelectedProgram(cleanData[0].id);
      }
    } catch (err) {
      console.error('Error loading program data:', err);
      setError('Failed to load program data');
      // Fallback to sample data
      const fallbackPrograms: Program[] = [
        {
          id: '1010',
          name: 'CIVIL ENGINEERING (PART TIME)',
          code: '1010',
          level: 'UG',
          type: 'Part-time',
          department: 'Civil Engineering',
          duration: 4,
          totalCredits: 160,
          totalStudents: 300,
          description: 'Civil engineering program with infrastructure focus',
          status: 'active',
          specializations: [],
          created_at: '2024-01-15T00:00:00.000Z',
          updated_at: '2024-01-15T00:00:00.000Z'
        },
        {
          id: '1012',
          name: 'ARCHITECTURAL ASSISTANTSHIP (FULL TIME)',
          code: '1012',
          level: 'UG',
          type: 'Full-time',
          department: 'Architecture',
          duration: 4,
          totalCredits: 150,
          totalStudents: 200,
          description: 'Architectural assistantship program',
          status: 'active',
          specializations: [],
          created_at: '2024-01-15T00:00:00.000Z',
          updated_at: '2024-01-15T00:00:00.000Z'
        },
        {
          id: '1040',
          name: 'ELECTRONICS AND COMMUNICATION ENGINEERING (FULL TIME)',
          code: '1040',
          level: 'UG',
          type: 'Full-time',
          department: 'Electronics Engineering',
          duration: 4,
          totalCredits: 120,
          totalStudents: 1000,
          description: 'Electronics and communication engineering with digital systems focus',
          status: 'active',
          specializations: [],
          created_at: '2024-01-15T00:00:00.000Z',
          updated_at: '2024-01-15T00:00:00.000Z'
        },
        {
          id: '1052',
          name: 'COMPUTER ENGINEERING (FULL TIME)',
          code: '1052',
          level: 'UG',
          type: 'Full-time',
          department: 'Computer Science',
          duration: 4,
          totalCredits: 120,
          totalStudents: 900,
          description: 'Computer engineering with embedded systems and hardware focus',
          status: 'active',
          specializations: [],
          created_at: '2024-01-15T00:00:00.000Z',
          updated_at: '2024-01-15T00:00:00.000Z'
        }
      ];
      setPrograms(fallbackPrograms);
      if (fallbackPrograms.length > 0) {
        setSelectedProgram(fallbackPrograms[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  const getCourseTypeColor = (type: string) => {
    switch (type) {
      case 'T': return 'bg-blue-100 text-blue-800';
      case 'P': return 'bg-green-100 text-green-800';
      case 'L': return 'bg-purple-100 text-purple-800';
      case 'PR': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' || status === 'Active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const getProgramCourses = (programId: string) => {
    const programMappings = mappings.filter(m => m.programId === programId);
    return programMappings.map(mapping => {
      const course = courses.find(c => c.id === mapping.courseId);
      return { ...mapping, course };
    }).filter(item => item.course);
  };

  const groupCoursesBySemester = (programId: string) => {
    const programCourses = getProgramCourses(programId);
    const grouped: Record<number, any[]> = {};

    programCourses.forEach(item => {
      if (!grouped[item.semester]) {
        grouped[item.semester] = [];
      }
      grouped[item.semester].push(item);
    });

    return grouped;
  };

  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || course.type === filterType;
    return matchesSearch && matchesType;
  });

  // Pagination calculations
  const totalPrograms = filteredPrograms.length;
  const totalProgramPages = Math.ceil(totalPrograms / itemsPerPage);
  const programStartIndex = (programsCurrentPage - 1) * itemsPerPage;
  const paginatedPrograms = filteredPrograms.slice(programStartIndex, programStartIndex + itemsPerPage);

  const totalCourses = filteredCourses.length;
  const totalCoursePages = Math.ceil(totalCourses / itemsPerPage);
  const courseStartIndex = (coursesCurrentPage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(courseStartIndex, courseStartIndex + itemsPerPage);

  // Reset pagination when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setProgramsCurrentPage(1);
    setCoursesCurrentPage(1);
  };

  // Pagination component
  const PaginationControls = ({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage,
    onItemsPerPageChange
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemsPerPage: number;
    onItemsPerPageChange: (items: number) => void;
  }) => {
    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(totalPages, start + maxVisible - 1);

      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    };

    return (
      <div className="flex items-center justify-between px-2 py-4 border-t">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{' '}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
          </span>
          <Select value={itemsPerPage.toString()} onValueChange={(value) => onItemsPerPageChange(Number(value))}>
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">per page</span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {getPageNumbers().map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className="w-8"
            >
              {page}
            </Button>
          ))}

          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <MoreHorizontal className="h-4 w-4" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(totalPages)}
                className="w-8"
              >
                {totalPages}
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const handleCreateMapping = () => {
    const newMapping: ProgramCourseMapping = {
      id: Date.now().toString(),
      programId: mappingForm.programId,
      courseId: mappingForm.courseId,
      semester: parseInt(mappingForm.semester),
      isCompulsory: mappingForm.isCompulsory === 'true',
      prerequisites: mappingForm.prerequisites ? mappingForm.prerequisites.split(',').map(p => p.trim()) : [],
      createdDate: new Date().toISOString().split('T')[0]
    };

    setMappings([...mappings, newMapping]);
    setMappingForm({ programId: '', courseId: '', semester: '', isCompulsory: 'true', prerequisites: '' });
    setIsCreateMappingDialogOpen(false);
  };

  const handleMapCourseNavigation = () => {
    setCurrentView('map-course');
  };

  const goBackToMain = () => {
    setCurrentView('main');
  };

  const renderMapCoursePage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={goBackToMain} className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Mapping
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Map Course to Program</h1>
            <p className="text-muted-foreground mt-2">
              Create detailed course mappings with prerequisites and requirements
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Course Mapping Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Program Selection */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-xl flex items-center gap-2">
              <Network className="h-6 w-6 text-blue-600" />
              Select Program
            </CardTitle>
            <CardDescription>
              Choose a program to map courses to
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {programs.map((program) => (
                <Card
                  key={program.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${selectedProgramForMapping === program.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                  onClick={() => setSelectedProgramForMapping(program.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{program.name}</h3>
                        <p className="text-sm text-muted-foreground">{program.code} • {program.level}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {program.duration} years
                          </span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {program.totalCredits} credits
                          </span>
                        </div>
                      </div>
                      <div className="p-2 rounded bg-blue-100 text-blue-600">
                        <BookOpen className="h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Panel - Course Mapping Form */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="text-xl flex items-center gap-2">
              <Plus className="h-6 w-6 text-green-600" />
              Course Mapping Details
            </CardTitle>
            <CardDescription>
              Configure course details and requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {selectedProgramForMapping ? (
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-800">Selected Program</p>
                  <p className="text-lg font-semibold text-blue-900">
                    {programs.find(p => p.id === selectedProgramForMapping)?.name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="course-select">Course</Label>
                    <Select value={mappingForm.courseId} onValueChange={(value) => setMappingForm({ ...mappingForm, courseId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            <div className="flex items-center gap-2">
                              <span>{course.name}</span>
                              <Badge className={getCourseTypeColor(course.type)}>
                                {course.type}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="semester-select">Semester</Label>
                    <Select value={mappingForm.semester} onValueChange={(value) => setMappingForm({ ...mappingForm, semester: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                          <SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Course Type</Label>
                    <Select value={mappingForm.isCompulsory} onValueChange={(value) => setMappingForm({ ...mappingForm, isCompulsory: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Compulsory</SelectItem>
                        <SelectItem value="false">Elective</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Input placeholder="Computer Science" disabled />
                  </div>
                </div>

                <div>
                  <Label htmlFor="prerequisites">Prerequisites</Label>
                  <Textarea
                    id="prerequisites"
                    value={mappingForm.prerequisites}
                    onChange={(e) => setMappingForm({ ...mappingForm, prerequisites: e.target.value })}
                    placeholder="Enter course codes separated by commas (e.g., CS101, CS102)"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Academic Year</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="2024-25" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-25">2024-25</SelectItem>
                        <SelectItem value="2023-24">2023-24</SelectItem>
                        <SelectItem value="2022-23">2022-23</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Regulation</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="R2023" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="R2023">R2023</SelectItem>
                        <SelectItem value="R2021">R2021</SelectItem>
                        <SelectItem value="R2019">R2019</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={goBackToMain}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        setMappingForm({ ...mappingForm, programId: selectedProgramForMapping });
                        handleCreateMapping();
                        goBackToMain();
                      }}
                      disabled={!mappingForm.courseId || !mappingForm.semester}
                      className="bg-gradient-to-r from-green-600 to-emerald-600"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Mapping
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a program from the left panel to start mapping courses</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      {selectedProgramForMapping && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Eye className="h-6 w-6" />
              Current Course Mappings
            </CardTitle>
            <CardDescription>
              Existing mappings for {programs.find(p => p.id === selectedProgramForMapping)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(groupCoursesBySemester(selectedProgramForMapping))
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([semester, semesterCourses]) => (
                  <div key={semester} className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Semester {semester}
                    </h4>
                    <div className="grid gap-2">
                      {semesterCourses.map((mapping: any) => (
                        <div key={mapping.id} className="flex items-center justify-between p-2 bg-white rounded border text-sm">
                          <span className="font-medium">{mapping.course.name}</span>
                          <div className="flex items-center gap-2">
                            <Badge className={getCourseTypeColor(mapping.course.type)}>
                              {mapping.course.type}
                            </Badge>
                            <Badge variant={mapping.isCompulsory ? "default" : "outline"}>
                              {mapping.isCompulsory ? 'Compulsory' : 'Elective'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const handleDelete = (type: 'program' | 'course' | 'mapping', item: any) => {
    setSelectedItem(item);
    setDeleteType(type);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteType === 'mapping') {
      setMappings(mappings.filter(m => m.id !== selectedItem.id));
    }
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  const stats = {
    totalPrograms: programs.length,
    totalCourses: courses.length,
    totalMappings: mappings.length,
    activePrograms: programs.filter(p => p.status === 'active' || p.status === 'Active').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading program data...</p>
        </div>
      </div>
    );
  }

  // Render based on current view
  if (currentView === 'map-course') {
    return renderMapCoursePage();
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Program & Course Mapping</h1>
          <p className="text-muted-foreground mt-2">
            Manage programs, courses, and their mappings to define curriculum structure
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateMappingDialogOpen} onOpenChange={setIsCreateMappingDialogOpen}>
            <Button
              onClick={handleMapCourseNavigation}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              <Link className="h-4 w-4 mr-2" />
              Map Course
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Map Course to Program</DialogTitle>
                <DialogDescription>Assign a course to a program and semester.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mapping-program">Program</Label>
                    <Select value={mappingForm.programId} onValueChange={(value) => setMappingForm({ ...mappingForm, programId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        {programs.map((program) => (
                          <SelectItem key={program.id} value={program.id}>
                            {program.name} ({program.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="mapping-course">Course</Label>
                    <Select value={mappingForm.courseId} onValueChange={(value) => setMappingForm({ ...mappingForm, courseId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name} ({course.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mapping-semester">Semester</Label>
                    <Input
                      id="mapping-semester"
                      type="number"
                      value={mappingForm.semester}
                      onChange={(e) => setMappingForm({ ...mappingForm, semester: e.target.value })}
                      placeholder="5"
                      min="1"
                      max="8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mapping-type">Type</Label>
                    <Select value={mappingForm.isCompulsory} onValueChange={(value) => setMappingForm({ ...mappingForm, isCompulsory: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Compulsory</SelectItem>
                        <SelectItem value="false">Elective</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="mapping-prerequisites">Prerequisites (comma-separated course IDs)</Label>
                  <Input
                    id="mapping-prerequisites"
                    value={mappingForm.prerequisites}
                    onChange={(e) => setMappingForm({ ...mappingForm, prerequisites: e.target.value })}
                    placeholder="1, 2"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateMappingDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateMapping} disabled={!mappingForm.programId || !mappingForm.courseId || !mappingForm.semester}>
                    Create Mapping
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">{error}</p>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Programs</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalPrograms}</p>
              </div>
              <Network className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Courses</p>
                <p className="text-3xl font-bold text-green-900">{stats.totalCourses}</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Mappings</p>
                <p className="text-3xl font-bold text-purple-900">{stats.totalMappings}</p>
              </div>
              <Link className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Active Programs</p>
                <p className="text-3xl font-bold text-orange-900">{stats.activePrograms}</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search programs or courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="T">Theory (T)</SelectItem>
            <SelectItem value="P">Practical (P)</SelectItem>
            <SelectItem value="L">Lab (L)</SelectItem>
            <SelectItem value="PR">Project (PR)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="mapping">Course Mapping</TabsTrigger>
        </TabsList>

        {/* Programs Tab */}
        <TabsContent value="programs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Academic Programs</CardTitle>
              <CardDescription>Programs loaded from program.json</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {paginatedPrograms.map((program) => (
                  <div key={program.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <Network className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{program.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{program.code}</span>
                          <span>•</span>
                          <span>{program.level}</span>
                          <span>•</span>
                          <span>{program.department}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{program.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge variant="outline" className={getStatusColor(program.status)}>
                            {program.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{program.duration} years</span>
                          <span className="text-xs text-gray-500">{program.totalCredits} credits</span>
                          <span className="text-xs text-gray-500">{program.totalStudents} students</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProgram(program.id);
                          setActiveTab('mapping');
                        }}
                        title="View program mapping"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <PaginationControls
                currentPage={programsCurrentPage}
                totalPages={totalProgramPages}
                onPageChange={setProgramsCurrentPage}
                totalItems={totalPrograms}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={(items) => {
                  setItemsPerPage(items);
                  setProgramsCurrentPage(1);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Catalog</CardTitle>
              <CardDescription>Courses from Course Master with detailed information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {paginatedCourses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <BookOpen className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{course.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{course.code}</span>
                          <span>•</span>
                          <span>{course.credits} credits</span>
                          {course.lectureHours !== undefined && (
                            <>
                              <span>•</span>
                              <span>L:{course.lectureHours} T:{course.tutorialHours} P:{course.practicalHours}</span>
                            </>
                          )}
                        </div>
                        {course.description && (
                          <p className="text-sm text-gray-500 mt-1">{course.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          <Badge variant="outline" className={getCourseTypeColor(course.type)}>
                            {course.type}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(course.status)}>
                            {course.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Switch to mapping tab and filter by this course's program
                          setActiveTab('mapping');
                          setSelectedProgram(course.courseCode);
                        }}
                        title="View course in mapping"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <PaginationControls
                currentPage={coursesCurrentPage}
                totalPages={totalCoursePages}
                onPageChange={setCoursesCurrentPage}
                totalItems={totalCourses}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={(items) => {
                  setItemsPerPage(items);
                  setCoursesCurrentPage(1);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Course Mapping Tab */}
        <TabsContent value="mapping" className="mt-6">
          {/* Program Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Select Program
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {programs.map((program) => (
                  <Card
                    key={program.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${selectedProgram === program.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                      }`}
                    onClick={() => setSelectedProgram(program.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-sm">{program.name}</h3>
                          <p className="text-xs text-muted-foreground">{program.code} • {program.level}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {getProgramCourses(program.id).length} courses
                            </span>
                          </div>
                        </div>
                        <div className="p-2 rounded bg-blue-100 text-blue-600">
                          <BookOpen className="h-4 w-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Course Mapping Display */}
          {selectedProgram ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {programs.find(p => p.id === selectedProgram)?.name} - Course Structure
                </CardTitle>
                <CardDescription>
                  Semester-wise course mapping for the selected program
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(groupCoursesBySemester(selectedProgram)).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No courses mapped to this program yet. Use the "Map Course" button to add courses.
                    </div>
                  ) : (
                    Object.entries(groupCoursesBySemester(selectedProgram))
                      .sort(([a], [b]) => parseInt(a) - parseInt(b))
                      .map(([semester, semesterCourses]) => (
                        <div key={semester} className="border rounded-lg p-4 bg-gray-50">
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Semester {semester}
                          </h3>
                          <div className="grid gap-3">
                            {semesterCourses.map((mapping: any) => (
                              <div
                                key={mapping.id}
                                className="flex items-center justify-between p-3 bg-white rounded border"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded bg-blue-100 text-blue-600">
                                    <BookOpen className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{mapping.course.name}</h4>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <span>{mapping.course.code}</span>
                                      <span>•</span>
                                      <span>{mapping.course.credits} credits</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={getCourseTypeColor(mapping.course.type)}>
                                    {mapping.course.type}
                                  </Badge>
                                  <Badge variant={mapping.isCompulsory ? "default" : "outline"}>
                                    {mapping.isCompulsory ? 'Compulsory' : 'Elective'}
                                  </Badge>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete('mapping', mapping)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Select a Program</CardTitle>
                <CardDescription>
                  Choose a program from above to view its course structure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Please select a program to view the course mapping details.
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {deleteType}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
