import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FormField, FileUploadField } from '@/components/forms/FormField';
import { useFormHandler, useAcademicHandlers, useFileHandlers } from '@/hooks/useFormHandlers';
import { validationRules, formatHelpers } from '@/utils/formUtils';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Edit, 
  Trash2, 
  Eye,
  Save,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  GraduationCap
} from 'lucide-react';

// Initial student data
const initialStudents = [
  {
    id: 'ST001',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@school.edu',
    phone: '1234567890',
    class: 'Grade 10-A',
    rollNo: '001',
    dateOfBirth: '2008-05-15',
    address: '123 Main St, City, State',
    guardian: 'John Johnson',
    guardianPhone: '1234567891',
    admissionDate: '2023-06-01',
    status: 'Active',
    gpa: 3.8
  },
  {
    id: 'ST002',
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.smith@school.edu',
    phone: '1234567892',
    class: 'Grade 11-B',
    rollNo: '015',
    dateOfBirth: '2007-08-22',
    address: '456 Oak Ave, City, State',
    guardian: 'Sarah Smith',
    guardianPhone: '1234567893',
    admissionDate: '2022-06-01',
    status: 'Active',
    gpa: 3.6
  },
  {
    id: 'ST003',
    firstName: 'Carol',
    lastName: 'Davis',
    email: 'carol.davis@school.edu',
    phone: '1234567894',
    class: 'Grade 9-C',
    rollNo: '008',
    dateOfBirth: '2009-03-10',
    address: '789 Pine St, City, State',
    guardian: 'David Davis',
    guardianPhone: '1234567895',
    admissionDate: '2024-06-01',
    status: 'Active',
    gpa: 3.9
  }
];

export default function InteractiveStudents() {
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [viewingStudent, setViewingStudent] = useState<any>(null);

  const { studentHandlers } = useAcademicHandlers();
  const { handleFileUpload, handleFileDownload } = useFileHandlers();

  // Form handler for creating/editing students
  const {
    formState,
    updateField,
    submitForm,
    resetForm,
    isSubmitting,
    getFieldProps,
    updateFields
  } = useFormHandler(
    [
      'firstName', 'lastName', 'email', 'phone', 'class', 'rollNo', 
      'dateOfBirth', 'address', 'guardian', 'guardianPhone', 'admissionDate'
    ],
    {},
    {
      firstName: [validationRules.required, validationRules.minLength(2)],
      lastName: [validationRules.required, validationRules.minLength(2)],
      email: [validationRules.required, validationRules.email],
      phone: [validationRules.required, validationRules.phone],
      class: [validationRules.required],
      rollNo: [validationRules.required],
      dateOfBirth: [validationRules.required],
      address: [validationRules.required],
      guardian: [validationRules.required],
      guardianPhone: [validationRules.required, validationRules.phone],
      admissionDate: [validationRules.required]
    }
  );

  // Handle student creation
  const handleCreateStudent = async (formData: any) => {
    try {
      const result = await studentHandlers.create(formData);
      const newStudent = {
        ...result,
        ...formData,
        gpa: 0.0,
        status: 'Active'
      };
      setStudents(prev => [...prev, newStudent]);
      setShowCreateDialog(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create student:', error);
    }
  };

  // Handle student editing
  const handleEditStudent = (student: any) => {
    setEditingStudent(student);
    updateFields(student);
    setShowEditDialog(true);
  };

  // Handle student update
  const handleUpdateStudent = async (formData: any) => {
    if (!editingStudent) return;

    try {
      await studentHandlers.update(editingStudent.id, formData);
      setStudents(prev => prev.map(s => 
        s.id === editingStudent.id ? { ...s, ...formData } : s
      ));
      setShowEditDialog(false);
      setEditingStudent(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update student:', error);
    }
  };

  // Handle student deletion
  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      await studentHandlers.delete(studentId);
      setStudents(prev => prev.filter(s => s.id !== studentId));
    } catch (error) {
      console.error('Failed to delete student:', error);
    }
  };

  // Handle student view
  const handleViewStudent = (student: any) => {
    setViewingStudent(student);
    setShowViewDialog(true);
  };

  // Handle file import
  const handleImport = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    try {
      await handleFileUpload(files[0]);
      const result = await studentHandlers.bulkImport(files[0]);
      setShowImportDialog(false);
      // In real app, you'd refresh the student list here
    } catch (error) {
      console.error('Failed to import students:', error);
    }
  };

  // Handle export
  const handleExport = async (format: 'csv' | 'excel' = 'csv') => {
    try {
      const exportData = filteredStudents.map(student => ({
        ID: student.id,
        Name: `${student.firstName} ${student.lastName}`,
        Email: student.email,
        Phone: student.phone,
        Class: student.class,
        'Roll No': student.rollNo,
        'Date of Birth': student.dateOfBirth,
        Guardian: student.guardian,
        'Guardian Phone': student.guardianPhone,
        'Admission Date': student.admissionDate,
        Status: student.status,
        GPA: student.gpa
      }));

      await handleFileDownload(exportData, 'students', format);
    } catch (error) {
      console.error('Failed to export students:', error);
    }
  };

  // Filter students based on search and class
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = selectedClass === 'All' || student.class === selectedClass;
    
    return matchesSearch && matchesClass;
  });

  // Class options
  const classOptions = [
    { value: 'All', label: 'All Classes' },
    { value: 'Grade 9-A', label: 'Grade 9-A' },
    { value: 'Grade 9-B', label: 'Grade 9-B' },
    { value: 'Grade 9-C', label: 'Grade 9-C' },
    { value: 'Grade 10-A', label: 'Grade 10-A' },
    { value: 'Grade 10-B', label: 'Grade 10-B' },
    { value: 'Grade 11-A', label: 'Grade 11-A' },
    { value: 'Grade 11-B', label: 'Grade 11-B' },
    { value: 'Grade 12-A', label: 'Grade 12-A' },
    { value: 'Grade 12-B', label: 'Grade 12-B' }
  ];

  return (
    <>
      <Toaster />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Interactive Student Management</h1>
            <p className="text-muted-foreground">
              Manage student records with real-time CRUD operations and file handling.
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Students</DialogTitle>
                  <DialogDescription>
                    Upload a CSV or Excel file to import student data
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <FileUploadField
                    label="Select File"
                    name="studentFile"
                    accept=".csv,.xlsx,.xls"
                    onFileSelect={handleImport}
                  />
                  <div className="text-sm text-muted-foreground">
                    Required columns: firstName, lastName, email, phone, class, rollNo
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={() => handleExport('csv')}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>
                    Enter student information to create a new record
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  submitForm(handleCreateStudent);
                }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="First Name"
                      name="firstName"
                      {...getFieldProps('firstName')}
                      required
                    />
                    <FormField
                      label="Last Name"
                      name="lastName"
                      {...getFieldProps('lastName')}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Email"
                      name="email"
                      type="email"
                      {...getFieldProps('email')}
                      required
                    />
                    <FormField
                      label="Phone"
                      name="phone"
                      type="tel"
                      {...getFieldProps('phone')}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Class"
                      name="class"
                      type="select"
                      options={classOptions.filter(opt => opt.value !== 'All')}
                      {...getFieldProps('class')}
                      required
                    />
                    <FormField
                      label="Roll Number"
                      name="rollNo"
                      {...getFieldProps('rollNo')}
                      required
                    />
                  </div>

                  <FormField
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    {...getFieldProps('dateOfBirth')}
                    required
                  />

                  <FormField
                    label="Address"
                    name="address"
                    type="textarea"
                    {...getFieldProps('address')}
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Guardian Name"
                      name="guardian"
                      {...getFieldProps('guardian')}
                      required
                    />
                    <FormField
                      label="Guardian Phone"
                      name="guardianPhone"
                      type="tel"
                      {...getFieldProps('guardianPhone')}
                      required
                    />
                  </div>

                  <FormField
                    label="Admission Date"
                    name="admissionDate"
                    type="date"
                    {...getFieldProps('admissionDate')}
                    required
                  />

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      {isSubmitting ? 'Creating...' : 'Create Student'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowCreateDialog(false);
                        resetForm();
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-xs text-muted-foreground">
                {filteredStudents.length} filtered
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {students.filter(s => s.status === 'Active').length}
              </div>
              <p className="text-xs text-muted-foreground">Currently enrolled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average GPA</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">Overall performance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Classes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(students.map(s => s.class)).size}
              </div>
              <p className="text-xs text-muted-foreground">Across all grades</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or student ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="border rounded px-3 py-2 text-sm"
                >
                  {classOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <Button variant="outline" onClick={() => handleExport('excel')}>
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Records</CardTitle>
            <CardDescription>
              Showing {filteredStudents.length} of {students.length} students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Class & Roll</TableHead>
                  <TableHead>Guardian</TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {formatHelpers.formatName(student.firstName, student.lastName)}
                        </div>
                        <div className="text-sm text-muted-foreground">ID: {student.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {student.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {formatHelpers.formatPhone(student.phone)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="outline">{student.class}</Badge>
                        <div className="text-sm text-muted-foreground mt-1">
                          Roll: {student.rollNo}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{student.guardian}</div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {formatHelpers.formatPhone(student.guardianPhone)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{student.gpa.toFixed(1)}</span>
                        <div className={`w-2 h-2 rounded-full ${
                          student.gpa >= 3.5 ? 'bg-green-500' : 
                          student.gpa >= 3.0 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={student.status === 'Active' ? 'default' : 'secondary'}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewStudent(student)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditStudent(student)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* View Student Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Student Details</DialogTitle>
              <DialogDescription>
                Complete information for {viewingStudent?.firstName} {viewingStudent?.lastName}
              </DialogDescription>
            </DialogHeader>
            {viewingStudent && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Student ID</label>
                    <p className="text-sm text-muted-foreground">{viewingStudent.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <p className="text-sm text-muted-foreground">
                      {formatHelpers.formatName(viewingStudent.firstName, viewingStudent.lastName)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-muted-foreground">{viewingStudent.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p className="text-sm text-muted-foreground">
                      {formatHelpers.formatPhone(viewingStudent.phone)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Class</label>
                    <p className="text-sm text-muted-foreground">{viewingStudent.class}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Roll Number</label>
                    <p className="text-sm text-muted-foreground">{viewingStudent.rollNo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Date of Birth</label>
                    <p className="text-sm text-muted-foreground">
                      {formatHelpers.formatDate(viewingStudent.dateOfBirth)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">GPA</label>
                    <p className="text-sm text-muted-foreground">{viewingStudent.gpa.toFixed(1)}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Address</label>
                  <p className="text-sm text-muted-foreground">{viewingStudent.address}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Guardian Name</label>
                    <p className="text-sm text-muted-foreground">{viewingStudent.guardian}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Guardian Phone</label>
                    <p className="text-sm text-muted-foreground">
                      {formatHelpers.formatPhone(viewingStudent.guardianPhone)}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Admission Date</label>
                    <p className="text-sm text-muted-foreground">
                      {formatHelpers.formatDate(viewingStudent.admissionDate)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Badge variant={viewingStudent.status === 'Active' ? 'default' : 'secondary'}>
                      {viewingStudent.status}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Student Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
              <DialogDescription>
                Update student information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              submitForm(handleUpdateStudent);
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="First Name"
                  name="firstName"
                  {...getFieldProps('firstName')}
                  required
                />
                <FormField
                  label="Last Name"
                  name="lastName"
                  {...getFieldProps('lastName')}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  {...getFieldProps('email')}
                  required
                />
                <FormField
                  label="Phone"
                  name="phone"
                  type="tel"
                  {...getFieldProps('phone')}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Class"
                  name="class"
                  type="select"
                  options={classOptions.filter(opt => opt.value !== 'All')}
                  {...getFieldProps('class')}
                  required
                />
                <FormField
                  label="Roll Number"
                  name="rollNo"
                  {...getFieldProps('rollNo')}
                  required
                />
              </div>

              <FormField
                label="Address"
                name="address"
                type="textarea"
                {...getFieldProps('address')}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Guardian Name"
                  name="guardian"
                  {...getFieldProps('guardian')}
                  required
                />
                <FormField
                  label="Guardian Phone"
                  name="guardianPhone"
                  type="tel"
                  {...getFieldProps('guardianPhone')}
                  required
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Updating...' : 'Update Student'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowEditDialog(false);
                    setEditingStudent(null);
                    resetForm();
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
