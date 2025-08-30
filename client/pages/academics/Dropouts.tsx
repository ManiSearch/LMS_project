import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Pagination, usePagination } from '@/components/ui/pagination';
import { FormField } from '@/components/forms/FormField';
import { useFormHandler } from '@/hooks/useFormHandlers';
import { Users, Search, AlertTriangle, TrendingDown, Calendar, Phone, Plus, Filter, Download, FileText, Eye, Edit, Trash2, MessageSquare, UserPlus, UserCheck, Mail } from 'lucide-react';

const initialDropoutData = [
  { id: 'ST045', name: 'Manikandan', grade: '11', reason: 'Family relocation', date: '2024-01-10', contact: '+91 9123456706', status: 'Transferred', email: 'manikandan@gmail.com', guardian: 'Mrs.Priya', interventions: [] },
  { id: 'ST098', name: 'Kumar', grade: '10', reason: 'Financial difficulties', date: '2023-12-15', contact: '+91 9123456704', status: 'At Risk', email: 'kumar@gmail.com', guardian: 'Mr.Suresh', interventions: ['Financial counseling', 'Scholarship application'] },
  { id: 'ST156', name: 'Ravishankar', grade: '12', reason: 'Career opportunity', date: '2023-11-20', contact: '+91 9856435211', status: 'Dropped Out', email: 'ravishankar@gmail.com', guardian: 'Mrs.Punitha', interventions: [] },
  { id: 'ST203', name: 'Sathis', grade: '9', reason: 'Academic struggles', date: '2023-10-05', contact: '+91 9865341243', status: 'Intervention', email: 'sathis@gmail.com', guardian: 'Mr.Prakash', interventions: ['Tutoring program', 'Academic mentoring'] },
  { id: 'ST204', name: 'Pooja', grade: '10', reason: 'Health issues', date: '2023-09-15', contact: '+91 9087341256', status: 'At Risk', email: 'pooja@gmail.com', guardian: 'Mrs.Pooja', interventions: ['Health support'] },
  { id: 'ST205', name: 'Lakshime', grade: '11', reason: 'Family issues', date: '2023-08-20', contact: '+91 9463176432', status: 'Intervention', email: 'lakshime@gmail.com', guardian: 'Mr.Andamuthu', interventions: ['Family counseling'] },
  { id: 'ST206', name: 'Suba', grade: '12', reason: 'Job opportunity', date: '2023-07-10', contact: '+91 9076532134', status: 'Dropped Out', email: 'suba212@gmail.com', guardian: 'Mrs.Mathu', interventions: [] },
  { id: 'ST207', name: 'Jennifer', grade: '9', reason: 'Moving abroad', date: '2023-06-25', contact: '+91 9087342156', status: 'Transferred', email: 'jennifer66@gmail.com', guardian: 'Mr.Kumar', interventions: [] },
  { id: 'ST208', name: 'Christopher', grade: '11', reason: 'Financial difficulties', date: '2023-05-30', contact: '+91 9873124576', status: 'At Risk', email: 'christopher432@gmail.com', guardian: 'Mrs.Suba', interventions: ['Financial aid application'] },
  { id: 'ST209', name: 'Ambiak', grade: '10', reason: 'Academic struggles', date: '2023-04-12', contact: '+91 9832458764', status: 'Intervention', email: 'ambika443@gmail.com', guardian: 'Mr.Joshua', interventions: ['Study skills workshop', 'Peer tutoring'] }
];

export default function Dropouts() {
  const [dropoutData, setDropoutData] = useState(initialDropoutData);
  const [filteredData, setFilteredData] = useState(initialDropoutData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddInterventionOpen, setIsAddInterventionOpen] = useState(false);
  const [isViewStudentOpen, setIsViewStudentOpen] = useState(false);
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [filterCriteria, setFilterCriteria] = useState({
    status: 'all',
    grade: 'all',
    reason: 'all'
  });

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    handlePageChange,
    totalItems,
    pageSize
  } = usePagination(filteredData, 5);

  // Form handlers
  const interventionFormHandler = useFormHandler(
    ['type', 'description', 'assignedTo', 'dueDate', 'priority'],
    {
      type: '',
      description: '',
      assignedTo: '',
      dueDate: '',
      priority: 'Medium'
    }
  );

  const studentFormHandler = useFormHandler(
    ['name', 'grade', 'reason', 'contact', 'email', 'guardian'],
    {
      name: '',
      grade: '',
      reason: '',
      contact: '',
      email: '',
      guardian: ''
    }
  );

  const getFormData = (handler: any) => {
    return Object.keys(handler.formState).reduce((acc, key) => {
      acc[key] = handler.formState[key].value;
      return acc;
    }, {} as Record<string, any>);
  };

  const handleInputChange = (handler: any) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    handler.updateField(e.target.name, e.target.value);
  };

  const handleSubmit = (handler: any, onSubmit: (data: any) => Promise<void>) => (e: React.FormEvent) => {
    e.preventDefault();
    handler.submitForm(onSubmit);
  };

  // Search and filter functionality
  useEffect(() => {
    let filtered = dropoutData.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.status.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterCriteria.status === 'all' || student.status === filterCriteria.status;
      const matchesGrade = filterCriteria.grade === 'all' || student.grade === filterCriteria.grade;
      
      const matchesReason = filterCriteria.reason === 'all' ||
        (filterCriteria.reason === 'academic' && student.reason.toLowerCase().includes('academic')) ||
        (filterCriteria.reason === 'financial' && student.reason.toLowerCase().includes('financial')) ||
        (filterCriteria.reason === 'family' && (student.reason.toLowerCase().includes('family') || student.reason.toLowerCase().includes('relocation'))) ||
        (filterCriteria.reason === 'health' && student.reason.toLowerCase().includes('health')) ||
        (filterCriteria.reason === 'career' && (student.reason.toLowerCase().includes('career') || student.reason.toLowerCase().includes('job')));

      return matchesSearch && matchesStatus && matchesGrade && matchesReason;
    });
    setFilteredData(filtered);
  }, [searchTerm, dropoutData, filterCriteria]);

  // Add intervention
  const onAddIntervention = async (data: any) => {
    if (!selectedStudent) return;

    const newIntervention = {
      id: Date.now(),
      type: data.type,
      description: data.description,
      assignedTo: data.assignedTo,
      dueDate: data.dueDate,
      priority: data.priority,
      status: 'Active',
      createdDate: new Date().toISOString().split('T')[0]
    };

    setDropoutData(prev => prev.map(student =>
      student.id === selectedStudent.id
        ? { 
            ...student, 
            interventions: [...(student.interventions || []), newIntervention],
            status: student.status === 'At Risk' ? 'Intervention' : student.status
          }
        : student
    ));

    setIsAddInterventionOpen(false);
    setSelectedStudent(null);
    interventionFormHandler.resetForm();
    alert('Intervention added successfully!');
  };

  // View student details
  const handleViewStudent = (student: any) => {
    setSelectedStudent(student);
    setIsViewStudentOpen(true);
  };

  // Edit student
  const handleEditStudent = (student: any) => {
    setSelectedStudent(student);
    studentFormHandler.updateField('name', student.name);
    studentFormHandler.updateField('grade', student.grade);
    studentFormHandler.updateField('reason', student.reason);
    studentFormHandler.updateField('contact', student.contact);
    studentFormHandler.updateField('email', student.email || '');
    studentFormHandler.updateField('guardian', student.guardian || '');
    setIsEditStudentOpen(true);
  };

  // Update student
  const onUpdateStudent = async (data: any) => {
    if (!selectedStudent) return;

    setDropoutData(prev => prev.map(student =>
      student.id === selectedStudent.id
        ? {
            ...student,
            name: data.name,
            grade: data.grade,
            reason: data.reason,
            contact: data.contact,
            email: data.email,
            guardian: data.guardian
          }
        : student
    ));

    setIsEditStudentOpen(false);
    setSelectedStudent(null);
    studentFormHandler.resetForm();
    alert('Student information updated successfully!');
  };

  // Delete student
  const handleDeleteStudent = (student: any) => {
    setSelectedStudent(student);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteStudent = () => {
    if (!selectedStudent) return;

    setDropoutData(prev => prev.filter(student => student.id !== selectedStudent.id));
    setIsDeleteDialogOpen(false);
    setSelectedStudent(null);
    alert('Student record deleted successfully!');
  };

  // Contact student/guardian
  const handleContactStudent = (student: any) => {
    setSelectedStudent(student);
    setIsContactDialogOpen(true);
  };

  const handlePhoneCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleEmail = (email: string, subject: string = '') => {
    const defaultSubject = `Regarding ${selectedStudent?.name}'s Academic Status - ${selectedStudent?.id}`;
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject || defaultSubject)}`;
    window.open(mailtoLink, '_self');
  };

  const handleSMS = (phone: string, message: string = '') => {
    const defaultMessage = `Hello ${selectedStudent?.guardian || selectedStudent?.name}, this is regarding ${selectedStudent?.name}'s academic status. Please contact the school administration.`;
    const smsLink = `sms:${phone}${message ? `?body=${encodeURIComponent(message)}` : `?body=${encodeURIComponent(defaultMessage)}`}`;
    window.open(smsLink, '_self');
  };

  // Export functionality
  const handleExportReport = (format: 'csv' | 'excel' | 'pdf') => {
    if (format === 'csv') {
      const csvContent = [
        ['Student ID', 'Name', 'Grade', 'Reason', 'Date', 'Status', 'Contact', 'Guardian', 'Interventions'].join(','),
        ...filteredData.map(student => [
          student.id,
          student.name,
          student.grade,
          `"${student.reason}"`,
          student.date,
          student.status,
          student.contact,
          student.guardian || '',
          `"${(student.interventions || []).join('; ')}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `dropout_report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else if (format === 'pdf') {
      alert('PDF export would be implemented with a library like jsPDF or server-side generation');
    } else {
      alert('Excel export would be implemented with a library like xlsx');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'At Risk':
        return 'destructive';
      case 'Intervention':
        return 'secondary';
      case 'Transferred':
        return 'default';
      case 'Dropped Out':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const stats = {
    atRisk: dropoutData.filter(s => s.status === 'At Risk').length,
    dropoutRate: '2.1%',
    interventions: dropoutData.filter(s => s.status === 'Intervention').length,
    successRate: '67%'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dropout Management</h1>
          <p className="text-muted-foreground mt-2">
            Track at-risk students, dropouts, and intervention programs.
          </p>
        </div>
        <Dialog open={isAddInterventionOpen} onOpenChange={setIsAddInterventionOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Add Intervention
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Student Intervention</DialogTitle>
              <DialogDescription>
                Create an intervention plan for an at-risk student
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(interventionFormHandler, onAddIntervention)} className="space-y-4">
              <FormField
                label="Student"
                name="student"
                type="select"
                value={selectedStudent?.id || ''}
                onChange={(e) => {
                  const student = dropoutData.find(s => s.id === e.target.value);
                  setSelectedStudent(student);
                }}
                options={dropoutData.filter(s => ['At Risk', 'Intervention'].includes(s.status)).map(s => ({
                  label: `${s.name} (${s.id})`,
                  value: s.id
                }))}
                required
              />
              
              <FormField
                label="Intervention Type"
                name="type"
                type="select"
                value={getFormData(interventionFormHandler).type}
                onChange={handleInputChange(interventionFormHandler)}
                options={[
                  { label: 'Academic Support', value: 'Academic Support' },
                  { label: 'Financial Counseling', value: 'Financial Counseling' },
                  { label: 'Family Support', value: 'Family Support' },
                  { label: 'Career Guidance', value: 'Career Guidance' },
                  { label: 'Health Support', value: 'Health Support' },
                  { label: 'Mentoring Program', value: 'Mentoring Program' }
                ]}
                required
              />
              
              <FormField
                label="Description"
                name="description"
                type="textarea"
                value={getFormData(interventionFormHandler).description}
                onChange={handleInputChange(interventionFormHandler)}
                placeholder="Detailed description of the intervention plan"
                rows={3}
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Assigned To"
                  name="assignedTo"
                  value={getFormData(interventionFormHandler).assignedTo}
                  onChange={handleInputChange(interventionFormHandler)}
                  placeholder="Staff member or counselor"
                  required
                />
                <FormField
                  label="Due Date"
                  name="dueDate"
                  type="date"
                  value={getFormData(interventionFormHandler).dueDate}
                  onChange={handleInputChange(interventionFormHandler)}
                  required
                />
              </div>
              
              <FormField
                label="Priority"
                name="priority"
                type="select"
                value={getFormData(interventionFormHandler).priority}
                onChange={handleInputChange(interventionFormHandler)}
                options={[
                  { label: 'Low', value: 'Low' },
                  { label: 'Medium', value: 'Medium' },
                  { label: 'High', value: 'High' },
                  { label: 'Critical', value: 'Critical' }
                ]}
                required
              />

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsAddInterventionOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={interventionFormHandler.isSubmitting}>
                  Add Intervention
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">At Risk Students</p>
              <p className="text-3xl font-bold text-orange-900">{stats.atRisk}</p>
              <p className="text-xs text-orange-600">Need intervention</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Dropout Rate</p>
              <p className="text-3xl font-bold text-red-900">{stats.dropoutRate}</p>
              <p className="text-xs text-red-600">This academic year</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Interventions</p>
              <p className="text-3xl font-bold text-blue-900">{stats.interventions}</p>
              <p className="text-xs text-blue-600">Active programs</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Success Rate</p>
              <p className="text-3xl font-bold text-green-900">{stats.successRate}</p>
              <p className="text-xs text-green-600">Intervention success</p>
            </div>
            <UserCheck className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      <Card className="section-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
            Student Records
          </CardTitle>
          <CardDescription>
            Track students who have dropped out or are at risk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search students..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter by Status
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Filter Students</DialogTitle>
                  <DialogDescription>
                    Apply filters to narrow down the student list
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select value={filterCriteria.status} onValueChange={(value) => setFilterCriteria({...filterCriteria, status: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="At Risk">At Risk</SelectItem>
                        <SelectItem value="Intervention">Intervention</SelectItem>
                        <SelectItem value="Transferred">Transferred</SelectItem>
                        <SelectItem value="Dropped Out">Dropped Out</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Grade</label>
                    <Select value={filterCriteria.grade} onValueChange={(value) => setFilterCriteria({...filterCriteria, grade: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Grades</SelectItem>
                        <SelectItem value="9">Grade 9</SelectItem>
                        <SelectItem value="10">Grade 10</SelectItem>
                        <SelectItem value="11">Grade 11</SelectItem>
                        <SelectItem value="12">Grade 12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Reason Category</label>
                    <Select value={filterCriteria.reason} onValueChange={(value) => setFilterCriteria({...filterCriteria, reason: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Reasons</SelectItem>
                        <SelectItem value="academic">Academic Issues</SelectItem>
                        <SelectItem value="financial">Financial Difficulties</SelectItem>
                        <SelectItem value="family">Family/Relocation</SelectItem>
                        <SelectItem value="health">Health Issues</SelectItem>
                        <SelectItem value="career">Career/Job Opportunity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => {
                    setFilterCriteria({ status: 'all', grade: 'all', reason: 'all' });
                  }}>
                    Reset
                  </Button>
                  <Button onClick={() => setIsFilterDialogOpen(false)}>
                    Apply Filters
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[350px]">
                <DialogHeader>
                  <DialogTitle>Export Dropout Report</DialogTitle>
                  <DialogDescription>
                    Choose export format for the dropout analysis report
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline" onClick={() => handleExportReport('csv')} className="h-20 flex flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">CSV</span>
                  </Button>
                  <Button variant="outline" onClick={() => handleExportReport('excel')} className="h-20 flex flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">Excel</span>
                  </Button>
                  <Button variant="outline" onClick={() => handleExportReport('pdf')} className="h-20 flex flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">PDF</span>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">ID: {student.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Grade {student.grade}</Badge>
                  </TableCell>
                  <TableCell>{student.reason}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {student.date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {student.contact}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(student.status)}>
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewStudent(student)}
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditStudent(student)}
                        title="Edit student"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleContactStudent(student)}
                        title="Contact student/guardian"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteStudent(student)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No students found matching your criteria.
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            pageSize={pageSize}
          />
        </CardContent>
      </Card>

      {/* View Student Modal */}
      <Dialog open={isViewStudentOpen} onOpenChange={setIsViewStudentOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>
              Complete student information and intervention history
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Student Name</label>
                  <div className="font-medium mt-1">{selectedStudent.name}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Student ID</label>
                  <div className="font-medium mt-1">{selectedStudent.id}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Grade</label>
                  <div className="mt-1">
                    <Badge variant="outline">Grade {selectedStudent.grade}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge variant={getStatusColor(selectedStudent.status)}>
                      {selectedStudent.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                  <div className="font-medium mt-1">{selectedStudent.date}</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Reason</label>
                <div className="mt-1 p-3 bg-muted rounded-lg">{selectedStudent.reason}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Contact</label>
                  <div className="font-medium mt-1">{selectedStudent.contact}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="font-medium mt-1">{selectedStudent.email || 'N/A'}</div>
                </div>
              </div>

              {selectedStudent.guardian && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Guardian</label>
                  <div className="font-medium mt-1">{selectedStudent.guardian}</div>
                </div>
              )}

              {selectedStudent.interventions && selectedStudent.interventions.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Interventions</label>
                  <div className="mt-1 space-y-2">
                    {selectedStudent.interventions.map((intervention: any, index: number) => (
                      <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                        {typeof intervention === 'string' ? intervention : intervention.description || intervention.type}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsViewStudentOpen(false)}>
              Close
            </Button>
            {selectedStudent && ['At Risk', 'Intervention'].includes(selectedStudent.status) && (
              <Button onClick={() => {
                setIsViewStudentOpen(false);
                setIsAddInterventionOpen(true);
              }}>
                Add Intervention
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Student Modal */}
      <Dialog open={isEditStudentOpen} onOpenChange={setIsEditStudentOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Student Information</DialogTitle>
            <DialogDescription>
              Update student details and contact information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(studentFormHandler, onUpdateStudent)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Student Name"
                name="name"
                value={getFormData(studentFormHandler).name}
                onChange={handleInputChange(studentFormHandler)}
                required
              />
              <FormField
                label="Grade"
                name="grade"
                type="select"
                value={getFormData(studentFormHandler).grade}
                onChange={handleInputChange(studentFormHandler)}
                options={[
                  { label: 'Grade 9', value: '9' },
                  { label: 'Grade 10', value: '10' },
                  { label: 'Grade 11', value: '11' },
                  { label: 'Grade 12', value: '12' }
                ]}
                required
              />
            </div>
            
            <FormField
              label="Reason"
              name="reason"
              value={getFormData(studentFormHandler).reason}
              onChange={handleInputChange(studentFormHandler)}
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Contact Number"
                name="contact"
                value={getFormData(studentFormHandler).contact}
                onChange={handleInputChange(studentFormHandler)}
                required
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                value={getFormData(studentFormHandler).email}
                onChange={handleInputChange(studentFormHandler)}
              />
            </div>
            
            <FormField
              label="Guardian Name"
              name="guardian"
              value={getFormData(studentFormHandler).guardian}
              onChange={handleInputChange(studentFormHandler)}
            />

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsEditStudentOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={studentFormHandler.isSubmitting}>
                Update Student
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this student record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {selectedStudent && (
            <div className="px-6 pb-4">
              <div className="p-3 bg-muted rounded-lg text-sm">
                <div><strong>Student:</strong> {selectedStudent.name}</div>
                <div><strong>ID:</strong> {selectedStudent.id}</div>
                <div><strong>Status:</strong> {selectedStudent.status}</div>
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteStudent} className="bg-red-600 hover:bg-red-700">
              Delete Record
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="section-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <Users className="h-5 w-5" />
              </div>
              Intervention Programs
            </CardTitle>
            <CardDescription>
              Active programs to help at-risk students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg hover:shadow-md transition-all duration-200">
                <h4 className="font-medium">Academic Support Program</h4>
                <p className="text-sm text-muted-foreground mb-2">Extra tutoring and mentoring for struggling students</p>
                <Badge variant="default">8 students enrolled</Badge>
              </div>
              <div className="p-4 border rounded-lg hover:shadow-md transition-all duration-200">
                <h4 className="font-medium">Financial Aid Counseling</h4>
                <p className="text-sm text-muted-foreground mb-2">Help students find financial assistance options</p>
                <Badge variant="default">5 students enrolled</Badge>
              </div>
              <div className="p-4 border rounded-lg hover:shadow-md transition-all duration-200">
                <h4 className="font-medium">Career Guidance</h4>
                <p className="text-sm text-muted-foreground mb-2">Alternative career path counseling and planning</p>
                <Badge variant="default">10 students enrolled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="section-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <TrendingDown className="h-5 w-5" />
              </div>
              Dropout Analytics
            </CardTitle>
            <CardDescription>
              Insights into dropout patterns and trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Financial reasons</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full w-2/5"></div>
                  </div>
                  <span className="text-sm">40%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Academic struggles</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full w-1/3"></div>
                  </div>
                  <span className="text-sm">30%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Family relocation</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-1/5"></div>
                  </div>
                  <span className="text-sm">20%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Other reasons</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-600 h-2 rounded-full w-1/10"></div>
                  </div>
                  <span className="text-sm">10%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Student/Guardian Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Contact Student/Guardian</DialogTitle>
            <DialogDescription>
              Choose how you would like to contact the student or guardian
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium">{selectedStudent.name} ({selectedStudent.id})</h4>
                <p className="text-sm text-muted-foreground">
                  Guardian: {selectedStudent.guardian || 'Not specified'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Status: {selectedStudent.status}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {selectedStudent.contact && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">Phone Call</div>
                        <div className="text-sm text-muted-foreground">{selectedStudent.contact}</div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handlePhoneCall(selectedStudent.contact)}
                    >
                      Call
                    </Button>
                  </div>
                )}

                {selectedStudent.contact && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Send SMS</div>
                        <div className="text-sm text-muted-foreground">{selectedStudent.contact}</div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSMS(selectedStudent.contact)}
                    >
                      SMS
                    </Button>
                  </div>
                )}

                {selectedStudent.email && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="font-medium">Send Email</div>
                        <div className="text-sm text-muted-foreground">{selectedStudent.email}</div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEmail(selectedStudent.email)}
                    >
                      Email
                    </Button>
                  </div>
                )}

                {selectedStudent.guardian && (
                  <div className="p-3 border rounded-lg bg-blue-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Guardian Information</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Primary contact: {selectedStudent.guardian}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      All communications will reference the student's academic status and current situation.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsContactDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              if (selectedStudent?.contact) {
                handlePhoneCall(selectedStudent.contact);
              }
            }}>
              Quick Call
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
