import { useState } from 'react';
import { useFormHandler } from '@/hooks/useFormHandlers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Plus, Edit3, Trash2, Calculator, Clock, Award, Code, Beaker, Building, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';
import { FormField } from '@/components/forms/FormField';

interface Subject {
  id: string;
  code: string; // SUBCODECODE in JSON
  name: string; // SUBJECT_NAME in JSON
  courseName: string; // COURSE_NAME in JSON
  courseCode: string; // Course code for the program
  department: string;
  departmentCode: string;
  type: 'T' | 'P' | 'L' | 'PR'; // SUBTYPE - T(Theory), P(Practical), L(Lab), PR(Project)
  credits: number;
  lectureHours: number;
  tutorialHours: number;
  practicalHours: number;
  semester: number;
  regulationYear: string; // New field for regulation year (e.g., "R2023")
  prerequisites?: string[];
  description: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
}

// Department mapping based on ProgramSetup.tsx
const departmentOptions = [
  { name: 'Computer Science', code: 'CS' },
  { name: 'Business Administration', code: 'BA' },
  { name: 'Mechanical Engineering', code: 'ME' },
  { name: 'Electronics', code: 'EC' },
  { name: 'Civil Engineering', code: 'CE' },
  { name: 'Information Technology', code: 'IT' },
  { name: 'Electrical Engineering', code: 'EE' },
  { name: 'Mathematics', code: 'MA' },
  { name: 'Physics', code: 'PH' },
  { name: 'Chemistry', code: 'CH' },
  { name: 'Commerce', code: 'CO' },
  { name: 'Biotechnology', code: 'BT' },
  { name: 'Management', code: 'MG' },
  { name: 'Marketing', code: 'MK' },
  { name: 'Energy Engineering', code: 'EN' },
  { name: 'Cosmetology', code: 'CM' },
  { name: 'Culinary Arts', code: 'CA' },
  { name: 'Fashion Design', code: 'FD' },
  { name: 'Visual Arts', code: 'VA' },
  { name: 'Food Science', code: 'FS' },
  { name: 'Language', code: 'LG' },
  { name: 'Physical Education', code: 'PE' },
  { name: 'Textile Engineering', code: 'TE' },
  { name: 'Architecture', code: 'AR' },
  { name: 'Hospitality', code: 'HM' },
  { name: 'Communication', code: 'CM' },
  { name: 'Agricultural Sciences', code: 'AG' }
];

const mockSubjects: Subject[] = [
  // Computer Engineering (1052) Courses
  {
    id: '1',
    code: '105223110',
    name: 'DIGITAL LOGIC DESIGN',
    courseName: 'COMPUTER ENGINEERING (FULL TIME)',
    courseCode: '1052',
    department: 'Computer Science',
    departmentCode: 'CS',
    type: 'T',
    credits: 3,
    lectureHours: 3,
    tutorialHours: 0,
    practicalHours: 0,
    semester: 3,
    regulationYear: 'R2023',
    description: 'Fundamentals of digital logic design, Boolean algebra, and combinational circuits',
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    code: '105223230',
    name: 'RDBMS',
    courseName: 'COMPUTER ENGINEERING (FULL TIME)',
    courseCode: '1052',
    department: 'Computer Science',
    departmentCode: 'CS',
    type: 'P',
    credits: 4,
    lectureHours: 3,
    tutorialHours: 0,
    practicalHours: 2,
    semester: 3,
    regulationYear: 'R2023',
    description: 'Relational Database Management Systems with practical implementation',
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: '3',
    code: '105223320',
    name: 'DIGITAL LOGIC DESIGN LAB',
    courseName: 'COMPUTER ENGINEERING (FULL TIME)',
    courseCode: '1052',
    department: 'Computer Science',
    departmentCode: 'CS',
    type: 'L',
    credits: 2,
    lectureHours: 0,
    tutorialHours: 0,
    practicalHours: 4,
    semester: 3,
    regulationYear: 'R2023',
    description: 'Laboratory experiments for digital logic design and circuit implementation',
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: '4',
    code: '105223140',
    name: 'C PROGRAMMING',
    courseName: 'COMPUTER ENGINEERING (FULL TIME)',
    courseCode: '1052',
    department: 'Computer Science',
    departmentCode: 'CS',
    type: 'P',
    credits: 3,
    lectureHours: 1,
    tutorialHours: 0,
    practicalHours: 4,
    semester: 3,
    regulationYear: 'R2023',
    description: 'Programming fundamentals using C language with practical implementation',
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: '5',
    code: '105223550',
    name: 'WEB DESIGNING',
    courseName: 'COMPUTER ENGINEERING (FULL TIME)',
    courseCode: '1052',
    department: 'Computer Science',
    departmentCode: 'CS',
    type: 'P',
    credits: 3,
    lectureHours: 1,
    tutorialHours: 0,
    practicalHours: 4,
    semester: 3,
    regulationYear: 'R2023',
    description: 'Web development using HTML, CSS, and JavaScript with practical projects',
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: '6',
    code: '105223640',
    name: 'OPERATING SYSTEMS',
    courseName: 'COMPUTER ENGINEERING (FULL TIME)',
    courseCode: '1052',
    department: 'Computer Science',
    departmentCode: 'CS',
    type: 'P',
    credits: 2,
    lectureHours: 1,
    tutorialHours: 0,
    practicalHours: 2,
    semester: 3,
    regulationYear: 'R2023',
    description: 'Operating systems concepts with practical implementation and lab exercises',
    status: 'active',
    createdAt: '2024-01-01'
  },
  // Electronics and Communication Engineering (1040) Courses
  {
    id: '7',
    code: '1040233110',
    name: 'ELECTRONIC DEVICES AND CIRCUITS',
    courseName: 'ELECTRONICS AND COMMUNICATION ENGINEERING (FULL TIME)',
    courseCode: '1040',
    department: 'Electronics',
    departmentCode: 'EC',
    type: 'T',
    credits: 4,
    lectureHours: 4,
    tutorialHours: 0,
    practicalHours: 0,
    semester: 3,
    regulationYear: 'R2023',
    description: 'Electronic devices, semiconductor theory, and circuit analysis',
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: '8',
    code: '1040233210',
    name: 'DIGITAL ELECTRONICS',
    courseName: 'ELECTRONICS AND COMMUNICATION ENGINEERING (FULL TIME)',
    courseCode: '1040',
    department: 'Electronics',
    departmentCode: 'EC',
    type: 'T',
    credits: 4,
    lectureHours: 4,
    tutorialHours: 0,
    practicalHours: 0,
    semester: 3,
    regulationYear: 'R2023',
    description: 'Digital logic design, Boolean algebra, and digital systems',
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: '9',
    code: '1040233320',
    name: 'ELECTRONIC DEVICES AND CIRCUITS PRACTICAL',
    courseName: 'ELECTRONICS AND COMMUNICATION ENGINEERING (FULL TIME)',
    courseCode: '1040',
    department: 'Electronics',
    departmentCode: 'EC',
    type: 'P',
    credits: 2,
    lectureHours: 0,
    tutorialHours: 0,
    practicalHours: 4,
    semester: 3,
    regulationYear: 'R2023',
    description: 'Practical experiments on electronic devices and circuit implementation',
    status: 'active',
    createdAt: '2024-01-01'
  }
];

const departmentIcons: Record<string, any> = {
  'Computer Science': Code,
  'Mathematics': Calculator,
  'Physics': Beaker,
  'Mechanical Engineering': Building,
  'Electronics': Building,
  'Civil Engineering': Building
};

export default function SubjectMasterSetup() {
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit'>('list');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Drag and drop state
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [draggedOver, setDraggedOver] = useState<string | null>(null);

  const formHandler = useFormHandler(
    ['code', 'name', 'courseName', 'courseCode', 'department', 'departmentCode', 'type', 'credits', 'lectureHours', 'tutorialHours', 'practicalHours', 'semester', 'regulationYear', 'description', 'prerequisites'],
    {
      code: '',
      name: '',
      courseName: '',
      courseCode: '',
      department: '',
      departmentCode: '',
      type: 'T',
      credits: '',
      lectureHours: '',
      tutorialHours: '',
      practicalHours: '',
      semester: '',
      regulationYear: '',
      description: '',
      prerequisites: ''
    }
  );

  // Helper functions
  const getFormData = (handler: any) => {
    return Object.keys(handler.formState).reduce((acc, key) => {
      acc[key] = handler.formState[key].value;
      return acc;
    }, {} as Record<string, any>);
  };

  const getFormErrors = (handler: any) => {
    return Object.keys(handler.formState).reduce((acc, key) => {
      acc[key] = handler.formState[key].error;
      return acc;
    }, {} as Record<string, any>);
  };

  const handleInputChange = (handler: any) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    handler.updateField(name, value);
  };

  const handleSelectChange = (handler: any, fieldName: string) => (value: string) => {
    handler.updateField(fieldName, value);

    // Auto-populate department code when department is selected
    if (fieldName === 'department') {
      const selectedDepartment = departmentOptions.find(dept => dept.name === value);
      if (selectedDepartment) {
        handler.updateField('departmentCode', selectedDepartment.code);
      }
    }
  };

  const handleSubmit = (handler: any, onSubmit: (data: any) => Promise<void>) => (e: React.FormEvent) => {
    e.preventDefault();
    handler.submitForm(onSubmit);
  };

  const onCreateSubject = async (data: any) => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      code: data.code,
      name: data.name,
      courseName: data.courseName,
      courseCode: data.courseCode,
      department: data.department,
      departmentCode: data.departmentCode,
      type: data.type as Subject['type'],
      credits: parseInt(data.credits),
      lectureHours: parseInt(data.lectureHours),
      tutorialHours: parseInt(data.tutorialHours),
      practicalHours: parseInt(data.practicalHours),
      semester: parseInt(data.semester),
      regulationYear: data.regulationYear,
      prerequisites: data.prerequisites ? data.prerequisites.split(',').map((p: string) => p.trim()) : [],
      description: data.description,
      status: 'draft',
      createdAt: new Date().toISOString()
    };

    setSubjects(prev => [newSubject, ...prev]);
    setCurrentView('list');
    formHandler.resetForm();
  };

  const handleEditSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    formHandler.updateFields({
      code: subject.code,
      name: subject.name,
      courseName: subject.courseName || '',
      courseCode: subject.courseCode || '',
      department: subject.department,
      departmentCode: subject.departmentCode,
      type: subject.type,
      credits: subject.credits.toString(),
      lectureHours: subject.lectureHours.toString(),
      tutorialHours: subject.tutorialHours.toString(),
      practicalHours: subject.practicalHours.toString(),
      semester: subject.semester.toString(),
      regulationYear: subject.regulationYear || '',
      description: subject.description,
      prerequisites: subject.prerequisites?.join(', ') || ''
    });
    setCurrentView('edit');
  };

  const onUpdateSubject = async (data: any) => {
    if (!selectedSubject) return;

    const updatedSubject: Subject = {
      ...selectedSubject,
      code: data.code,
      name: data.name,
      courseName: data.courseName,
      courseCode: data.courseCode,
      department: data.department,
      departmentCode: data.departmentCode,
      type: data.type as Subject['type'],
      credits: parseInt(data.credits),
      lectureHours: parseInt(data.lectureHours),
      tutorialHours: parseInt(data.tutorialHours),
      practicalHours: parseInt(data.practicalHours),
      semester: parseInt(data.semester),
      regulationYear: data.regulationYear,
      prerequisites: data.prerequisites ? data.prerequisites.split(',').map((p: string) => p.trim()) : [],
      description: data.description
    };

    setSubjects(prev => prev.map(s => s.id === selectedSubject.id ? updatedSubject : s));
    setCurrentView('list');
    setSelectedSubject(null);
    formHandler.resetForm();
  };

  const handleDeleteSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteSubject = () => {
    if (!selectedSubject) return;
    setSubjects(prev => prev.filter(s => s.id !== selectedSubject.id));
    setIsDeleteModalOpen(false);
    setSelectedSubject(null);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'T':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'P':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'L':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'PR':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredSubjects = subjects.filter(subject => {
    const departmentMatch = selectedDepartment === 'all' || subject.department === selectedDepartment;
    const semesterMatch = selectedSemester === 'all' || subject.semester.toString() === selectedSemester;
    return departmentMatch && semesterMatch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSubjects = filteredSubjects.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, subjectId: string) => {
    setDraggedItem(subjectId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', subjectId);
  };

  const handleDragOver = (e: React.DragEvent, subjectId: string) => {
    e.preventDefault();
    setDraggedOver(subjectId);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragLeave = () => {
    setDraggedOver(null);
  };

  const handleDrop = (e: React.DragEvent, targetSubjectId: string) => {
    e.preventDefault();

    if (!draggedItem || draggedItem === targetSubjectId) {
      setDraggedItem(null);
      setDraggedOver(null);
      return;
    }

    // Find the indices of the dragged and target items
    const draggedIndex = subjects.findIndex(s => s.id === draggedItem);
    const targetIndex = subjects.findIndex(s => s.id === targetSubjectId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Create a new array with reordered items
    const newSubjects = [...subjects];
    const [draggedSubject] = newSubjects.splice(draggedIndex, 1);
    newSubjects.splice(targetIndex, 0, draggedSubject);

    setSubjects(newSubjects);
    setDraggedItem(null);
    setDraggedOver(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDraggedOver(null);
  };

  const departments = Array.from(new Set(subjects.map(s => s.department)));
  const semesters = Array.from(new Set(subjects.map(s => s.semester))).sort((a, b) => a - b);

  const stats = {
    total: subjects.length,
    active: subjects.filter(s => s.status === 'active').length,
    totalCredits: subjects.reduce((sum, s) => sum + s.credits, 0),
    departments: departments.length
  };

  // Render Add Subject Form
  if (currentView === 'add') {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Course</h1>
            <p className="text-muted-foreground mt-2">
              Create a new Course with detailed information
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setCurrentView('list');
              formHandler.resetForm();
            }}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Course Information
            </CardTitle>
            <CardDescription>
              Fill in the details for the new Course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(formHandler, onCreateSubject)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Subject Code"
                  name="code"
                  value={getFormData(formHandler).code}
                  onChange={handleInputChange(formHandler)}
                  error={getFormErrors(formHandler).code}
                  placeholder="1010233210"
                  required
                />
                <FormField
                  label="Subject Name"
                  name="name"
                  value={getFormData(formHandler).name}
                  onChange={handleInputChange(formHandler)}
                  error={getFormErrors(formHandler).name}
                  placeholder="CONSTRUCTION MATERIALS"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  label="Course Name"
                  name="courseName"
                  value={getFormData(formHandler).courseName}
                  onChange={handleInputChange(formHandler)}
                  error={getFormErrors(formHandler).courseName}
                  placeholder="CIVIL ENGINEERING (PART TIME)"
                  required
                />
                <FormField
                  label="Course Code"
                  name="courseCode"
                  value={getFormData(formHandler).courseCode}
                  onChange={handleInputChange(formHandler)}
                  error={getFormErrors(formHandler).courseCode}
                  placeholder="3010"
                  required
                />
                <FormField
                  label="Regulation Year"
                  name="regulationYear"
                  value={getFormData(formHandler).regulationYear}
                  onChange={handleInputChange(formHandler)}
                  error={getFormErrors(formHandler).regulationYear}
                  placeholder="R2023"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  label="Department"
                  name="department"
                  type="select"
                  value={getFormData(formHandler).department}
                  onChange={handleSelectChange(formHandler, 'department')}
                  error={getFormErrors(formHandler).department}
                  placeholder="Select Department"
                  options={departmentOptions.map(dept => ({
                    label: dept.name,
                    value: dept.name
                  }))}
                  required
                />
                <FormField
                  label="Department Code"
                  name="departmentCode"
                  value={getFormData(formHandler).departmentCode}
                  onChange={handleInputChange(formHandler)}
                  error={getFormErrors(formHandler).departmentCode}
                  placeholder="Auto-generated"
                  disabled
                  className="bg-gray-50"
                />
                <FormField
                  label="Subject Type"
                  name="type"
                  type="select"
                  value={getFormData(formHandler).type}
                  onChange={handleSelectChange(formHandler, 'type')}
                  error={getFormErrors(formHandler).type}
                  options={[
                    { label: 'Theory (T)', value: 'T' },
                    { label: 'Practical (P)', value: 'P' },
                    { label: 'Lab (L)', value: 'L' },
                    { label: 'Project (PR)', value: 'PR' }
                  ]}
                  required
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <FormField
                  label="Credits"
                  name="credits"
                  type="number"
                  value={getFormData(formHandler).credits}
                  onChange={handleInputChange(formHandler)}
                  error={getFormErrors(formHandler).credits}
                  placeholder="4"
                  required
                />
                <FormField
                  label="Lecture Hours"
                  name="lectureHours"
                  type="number"
                  value={getFormData(formHandler).lectureHours}
                  onChange={handleInputChange(formHandler)}
                  error={getFormErrors(formHandler).lectureHours}
                  placeholder="3"
                  required
                />
                <FormField
                  label="Tutorial Hours"
                  name="tutorialHours"
                  type="number"
                  value={getFormData(formHandler).tutorialHours}
                  onChange={handleInputChange(formHandler)}
                  error={getFormErrors(formHandler).tutorialHours}
                  placeholder="1"
                  required
                />
                <FormField
                  label="Practical Hours"
                  name="practicalHours"
                  type="number"
                  value={getFormData(formHandler).practicalHours}
                  onChange={handleInputChange(formHandler)}
                  error={getFormErrors(formHandler).practicalHours}
                  placeholder="2"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Semester"
                  name="semester"
                  type="number"
                  value={getFormData(formHandler).semester}
                  onChange={handleInputChange(formHandler)}
                  error={getFormErrors(formHandler).semester}
                  placeholder="1"
                  required
                />
                <FormField
                  label="Prerequisites (comma-separated IDs)"
                  name="prerequisites"
                  value={getFormData(formHandler).prerequisites}
                  onChange={handleInputChange(formHandler)}
                  error={getFormErrors(formHandler).prerequisites}
                  placeholder="1, 2"
                />
              </div>
              <FormField
                label="Description"
                name="description"
                type="textarea"
                value={getFormData(formHandler).description}
                onChange={handleInputChange(formHandler)}
                error={getFormErrors(formHandler).description}
                placeholder="Course description and learning objectives..."
                rows={3}
                required
              />
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCurrentView('list');
                    formHandler.resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={formHandler.isSubmitting}>
                  {formHandler.isSubmitting ? 'Creating...' : 'Create Course'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render Edit Subject Form
  if (currentView === 'edit') {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Course</h1>
            <p className="text-muted-foreground mt-2">
              Update Course information
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setCurrentView('list');
              setSelectedSubject(null);
              formHandler.resetForm();
            }}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Course Information
            </CardTitle>
            <CardDescription>
              Update the Course details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(formHandler, onUpdateSubject)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Subject Code"
                  name="code"
                  value={getFormData(formHandler).code}
                  onChange={handleInputChange(formHandler)}
                  error={getFormErrors(formHandler).code}
                  placeholder="1010233210"
                  required
                />
                <FormField
                  label="Subject Name"
                  name="name"
                  value={getFormData(formHandler).name}
                  onChange={handleInputChange(formHandler)}
                  error={getFormErrors(formHandler).name}
                  placeholder="CONSTRUCTION MATERIALS"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  label="Course Name"
                  name="courseName"
                  value={getFormData(formHandler).courseName}
                  onChange={handleInputChange(formHandler)}
                  error={getFormErrors(formHandler).courseName}
                  placeholder="CIVIL ENGINEERING (PART TIME)"
                  required
                />
                <FormField
                  label="Course Code"
                  name="courseCode"
                  value={getFormData(formHandler).courseCode}
                  onChange={handleInputChange(formHandler)}
                  error={getFormErrors(formHandler).courseCode}
                  placeholder="3010"
                  required
                />
                <FormField
                  label="Regulation Year"
                  name="regulationYear"
                  value={getFormData(formHandler).regulationYear}
                  onChange={handleInputChange(formHandler)}
                  error={getFormErrors(formHandler).regulationYear}
                  placeholder="R2023"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  label="Department"
                  name="department"
                  type="select"
                  value={getFormData(formHandler).department}
                  onChange={handleSelectChange(formHandler, 'department')}
                  error={getFormErrors(formHandler).department}
                  placeholder="Select Department"
                  options={departmentOptions.map(dept => ({
                    label: dept.name,
                    value: dept.name
                  }))}
                  required
                />
                <FormField
                  label="Department Code"
                  name="departmentCode"
                  value={getFormData(formHandler).departmentCode}
                  onChange={handleInputChange(formHandler)}
                  error={getFormErrors(formHandler).departmentCode}
                  placeholder="Auto-generated"
                  disabled
                  className="bg-gray-50"
                />
                <FormField
                  label="Subject Type"
                  name="type"
                  type="select"
                  value={getFormData(formHandler).type}
                  onChange={handleSelectChange(formHandler, 'type')}
                  error={getFormErrors(formHandler).type}
                  options={[
                    { label: 'Theory (T)', value: 'T' },
                    { label: 'Practical (P)', value: 'P' },
                    { label: 'Lab (L)', value: 'L' },
                    { label: 'Project (PR)', value: 'PR' }
                  ]}
                  required
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <FormField
                  label="Credits"
                  name="credits"
                  type="number"
                  value={getFormData(formHandler).credits}
                  onChange={handleInputChange(formHandler)}
                  error={getFormErrors(formHandler).credits}
                  placeholder="4"
                  required
                />
                <FormField
                  label="Lecture Hours"
                  name="lectureHours"
                  type="number"
                  value={getFormData(formHandler).lectureHours}
                  onChange={handleInputChange(formHandler)}
                  error={getFormErrors(formHandler).lectureHours}
                  placeholder="3"
                  required
                />
                <FormField
                  label="Tutorial Hours"
                  name="tutorialHours"
                  type="number"
                  value={getFormData(formHandler).tutorialHours}
                  onChange={handleInputChange(formHandler)}
                  error={getFormErrors(formHandler).tutorialHours}
                  placeholder="1"
                  required
                />
                <FormField
                  label="Practical Hours"
                  name="practicalHours"
                  type="number"
                  value={getFormData(formHandler).practicalHours}
                  onChange={handleInputChange(formHandler)}
                  error={getFormErrors(formHandler).practicalHours}
                  placeholder="2"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Semester"
                  name="semester"
                  type="number"
                  value={getFormData(formHandler).semester}
                  onChange={handleInputChange(formHandler)}
                  error={getFormErrors(formHandler).semester}
                  placeholder="1"
                  required
                />
                <FormField
                  label="Prerequisites (comma-separated IDs)"
                  name="prerequisites"
                  value={getFormData(formHandler).prerequisites}
                  onChange={handleInputChange(formHandler)}
                  error={getFormErrors(formHandler).prerequisites}
                  placeholder="1, 2"
                />
              </div>
              <FormField
                label="Description"
                name="description"
                type="textarea"
                value={getFormData(formHandler).description}
                onChange={handleInputChange(formHandler)}
                error={getFormErrors(formHandler).description}
                placeholder="Course description and learning objectives..."
                rows={3}
                required
              />
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCurrentView('list');
                    setSelectedSubject(null);
                    formHandler.resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={formHandler.isSubmitting}>
                  {formHandler.isSubmitting ? 'Updating...' : 'Update Course'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Master</h1>
          <p className="text-muted-foreground mt-2">
            Manage Course with code, name, LTP (Lecture-Tutorial-Practical), and credits
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          onClick={() => setCurrentView('add')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Course</p>
                <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Course</p>
                <p className="text-3xl font-bold text-green-900">{stats.active}</p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Credits</p>
                <p className="text-3xl font-bold text-purple-900">{stats.totalCredits}</p>
              </div>
              <Calculator className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Departments</p>
                <p className="text-3xl font-bold text-orange-900">{stats.departments}</p>
              </div>
              <Building className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Department</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setCurrentPage(1); // Reset to first page when filtering
                }}
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Semester</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={selectedSemester}
                onChange={(e) => {
                  setSelectedSemester(e.target.value);
                  setCurrentPage(1); // Reset to first page when filtering
                }}
              >
                <option value="all">All Semesters</option>
                {semesters.map(sem => (
                  <option key={sem} value={sem.toString()}>Semester {sem}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Items per page</label>
              <select
                className="w-full p-2 border rounded-md"
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pagination Info */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredSubjects.length)} of {filteredSubjects.length} subjects
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="w-10"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Subjects List */}
      <div className="grid gap-6">
        {paginatedSubjects.map((subject) => {
          const IconComponent = departmentIcons[subject.department] || BookOpen;
          
          return (
            <Card
              key={subject.id}
              className={`hover:shadow-lg transition-all duration-300 group cursor-move ${
                draggedItem === subject.id ? 'opacity-50 scale-95' : ''
              } ${
                draggedOver === subject.id ? 'border-blue-500 bg-blue-50' : ''
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, subject.id)}
              onDragOver={(e) => handleDragOver(e, subject.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, subject.id)}
              onDragEnd={handleDragEnd}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-2 flex-1">
                    <div className="flex items-center justify-center p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                      <GripVertical className="h-5 w-5" />
                    </div>
                    <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-green-50 text-blue-600 group-hover:from-blue-100 group-hover:to-green-100 transition-colors">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{subject.name}</h3>
                        <Badge className={getTypeColor(subject.type)}>{subject.type}</Badge>
                        <Badge className={getStatusColor(subject.status)}>{subject.status}</Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="font-medium text-blue-600">{subject.code}</span>
                        <span>•</span>
                        <span>{subject.department} {subject.departmentCode ? `(${subject.departmentCode})` : ''}</span>
                        <span>��</span>
                        <span>Semester {subject.semester}</span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">
                        {subject.description}
                      </p>
                      
                      <div className="grid grid-cols-4 gap-4 mb-3">
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <div className="text-lg font-bold text-blue-900">{subject.credits}</div>
                          <div className="text-xs text-blue-600">Credits</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="text-lg font-bold text-green-900">{subject.lectureHours}</div>
                          <div className="text-xs text-green-600">Lecture</div>
                        </div>
                        <div className="text-center p-2 bg-purple-50 rounded">
                          <div className="text-lg font-bold text-purple-900">{subject.tutorialHours}</div>
                          <div className="text-xs text-purple-600">Tutorial</div>
                        </div>
                        <div className="text-center p-2 bg-orange-50 rounded">
                          <div className="text-lg font-bold text-orange-900">{subject.practicalHours}</div>
                          <div className="text-xs text-orange-600">Practical</div>
                        </div>
                      </div>

                      {subject.prerequisites && subject.prerequisites.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Prerequisites:</span>
                          <div className="flex gap-1">
                            {subject.prerequisites.map((prereq, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {subjects.find(s => s.id === prereq)?.code || prereq}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditSubject(subject)}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteSubject(subject)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>


      {/* Delete Subject Confirmation */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedSubject?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteSubject} className="bg-red-600 hover:bg-red-700">
              Delete Course
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
