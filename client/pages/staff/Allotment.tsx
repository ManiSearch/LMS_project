import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Search, Calendar, Clock, MapPin, Plus, Edit, Trash2, Eye, Filter, User, BookOpen, Building, Award, GraduationCap, UsersIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface Faculty {
  faculty_id: number;
  employee_number: number;
  designation: string;
  department: string;
  specialization: string;
  employment_status: string;
  personal_info: {
    full_name: string;
  };
  contact_info: {
    email: string;
    phone_number: string;
  };
  institution_code: number;
  institution_name: string;
  department_id: number;
}

interface Student {
  student_id: number;
  registration_number: number;
  status: string;
  personal_info: {
    full_name: string;
    gender: string;
  };
  contact_info: {
    email: string;
    phone_number: string;
  };
  academic_info: {
    institution: string;
    institution_code: number;
    program: string;
    year: number;
    semester: number;
  };
  department_id: number;
}

interface FacultyStudentAssignment {
  id: string;
  facultyId: number;
  studentIds: number[];
  className: string;
  section: string;
  academicYear: string;
  semester: number;
  departmentId: number;
  assignmentType: 'class_teacher' | 'advisor' | 'mentor' | 'subject_guide';
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
  createdDate: string;
  notes: string;
}

export default function FacultyStudentAllotment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<FacultyStudentAssignment[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAssignmentType, setFilterAssignmentType] = useState('all');
  const [activeTab, setActiveTab] = useState('assignments');

  // Load faculty and student data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      // Fallback data - Get faculty from fakeAuth.js credentials (moved outside try block)
        const fallbackFaculty: Faculty[] = [
          {
            faculty_id: 102001,
            employee_number: 102001,
            designation: "Assistant Professor",
            department: "Computer Science and Engineering",
            specialization: "Artificial Intelligence",
            employment_status: "Active",
            personal_info: {
              full_name: "Dr. Arun"
            },
            contact_info: {
              email: "arun@gmail.com",
              phone_number: "+919812345678"
            },
            institution_code: user?.institutionCode ? parseInt(user.institutionCode) : 102,
            institution_name: user?.institution || "Sample Institution",
            department_id: 101
          },
          {
            faculty_id: 32142001,
            employee_number: 32142001,
            designation: "Associate Professor",
            department: "Computer Engineering",
            specialization: "Database Management Systems",
            employment_status: "Active",
            personal_info: {
              full_name: "GANESAN"
            },
            contact_info: {
              email: "ganesanmepgdmm@gmail.com",
              phone_number: "+919876543211"
            },
            institution_code: user?.institutionCode ? parseInt(user.institutionCode) : 101,
            institution_name: user?.institution || "CENTRAL POLYTECHNIC COLLEGE",
            department_id: 101
          },
          {
            faculty_id: 11011001,
            employee_number: 11011001,
            designation: "Assistant Professor",
            department: "Electronics and Communication Engineering",
            specialization: "Digital Electronics",
            employment_status: "Active",
            personal_info: {
              full_name: "DHARANIPATHI"
            },
            contact_info: {
              email: "og.dharani@gmail.com",
              phone_number: "+919876543212"
            },
            institution_code: user?.institutionCode ? parseInt(user.institutionCode) : 101,
            institution_name: user?.institution || "CENTRAL POLYTECHNIC COLLEGE",
            department_id: 102
          }
        ];

        const fallbackStudents: Student[] = [
          {
            student_id: 22405531,
            registration_number: 22405531,
            status: "Active",
            personal_info: {
              full_name: "ARUN KUMAR S",
              gender: "Male"
            },
            contact_info: {
              email: "arun.kumar@institute.edu",
              phone_number: "+919876543210"
            },
            academic_info: {
              institution: user?.institution || "CENTRAL POLYTECHNIC COLLEGE",
              institution_code: user?.institutionCode ? parseInt(user.institutionCode) : 101,
              program: "Computer Engineering",
              year: 2,
              semester: 3
            },
            department_id: 101
          },
          {
            student_id: 22405547,
            registration_number: 22405547,
            status: "Active",
            personal_info: {
              full_name: "PRIYA R",
              gender: "Female"
            },
            contact_info: {
              email: "priya.r@institute.edu",
              phone_number: "+919876543211"
            },
            academic_info: {
              institution: user?.institution || "CENTRAL POLYTECHNIC COLLEGE",
              institution_code: user?.institutionCode ? parseInt(user.institutionCode) : 101,
              program: "Computer Engineering",
              year: 2,
              semester: 3
            },
            department_id: 101
          },
          {
            student_id: 23101223,
            registration_number: 23101223,
            status: "Active",
            personal_info: {
              full_name: "KARTHIK RAJA M",
              gender: "Male"
            },
            contact_info: {
              email: "karthik.raja@institute.edu",
              phone_number: "+919876543212"
            },
            academic_info: {
              institution: user?.institution || "CENTRAL POLYTECHNIC COLLEGE",
              institution_code: user?.institutionCode ? parseInt(user.institutionCode) : 101,
              program: "Electronics and Communication Engineering",
              year: 2,
              semester: 3
            },
            department_id: 102
          },
          {
            student_id: 23202735,
            registration_number: 23202735,
            status: "Active",
            personal_info: {
              full_name: "DIVYA SRI K",
              gender: "Female"
            },
            contact_info: {
              email: "divya.sri@institute.edu",
              phone_number: "+919876543213"
            },
            academic_info: {
              institution: user?.institution || "CENTRAL POLYTECHNIC COLLEGE",
              institution_code: user?.institutionCode ? parseInt(user.institutionCode) : 101,
              program: "Electronics and Communication Engineering",
              year: 2,
              semester: 3
            },
            department_id: 102
          },
          // Add more students for realistic class sizes
          ...Array.from({ length: 16 }, (_, i) => ({
            student_id: 22400000 + i + 1,
            registration_number: 22400000 + i + 1,
            status: "Active" as const,
            personal_info: {
              full_name: `Student ${i + 1}`,
              gender: i % 2 === 0 ? "Male" : "Female" as "Male" | "Female"
            },
            contact_info: {
              email: `student${i + 1}@institute.edu`,
              phone_number: `+9198765432${(20 + i).toString().padStart(2, '0')}`
            },
            academic_info: {
              institution: user?.institution || "CENTRAL POLYTECHNIC COLLEGE",
              institution_code: user?.institutionCode ? parseInt(user.institutionCode) : 101,
              program: i % 2 === 0 ? "Computer Engineering" : "Electronics and Communication Engineering",
              year: 2,
              semester: 3
            },
            department_id: i % 2 === 0 ? 101 : 102
          }))
        ];

        let facultyData: Faculty[] = fallbackFaculty;
        let studentData: Student[] = fallbackStudents;

      try {
        try {
          // Load faculty data
          const facultyResponse = await fetch('/faculty.json');
          if (facultyResponse.ok) {
            const rawFaculty = await facultyResponse.json();
            const userInstitutionCode = user?.institutionCode || user?.selectedInstitutionCode;

            if (Array.isArray(rawFaculty) && rawFaculty.length > 0 && userInstitutionCode) {
              // Transform the raw faculty data to match our interface
              const transformedFaculty = rawFaculty
                .filter(f =>
                  f.institution_code === parseInt(userInstitutionCode) &&
                  (f.employment_status === 'Active' || f.status === 'Active')
                )
                .map(f => ({
                  faculty_id: f.faculty_id,
                  employee_number: f.employee_number,
                  designation: f.designation,
                  department: f.department,
                  specialization: f.specialization || 'General',
                  employment_status: f.employment_status || f.status || 'Active',
                  personal_info: {
                    full_name: f.personal_info?.full_name || `${f.personal_info?.first_name || ''} ${f.personal_info?.last_name || ''}`.trim() || `Faculty ${f.faculty_id}`
                  },
                  contact_info: {
                    email: f.contact_info?.email || f.email || `faculty${f.faculty_id}@institution.edu`,
                    phone_number: f.contact_info?.phone_number || f.phone || '+919999999999'
                  },
                  institution_code: f.institution_code,
                  institution_name: f.institution_name || user?.institution || 'Institution',
                  department_id: f.department_id || 101
                }));

              if (transformedFaculty.length > 0) {
                facultyData = transformedFaculty;
              }
            }
          }
        } catch (facultyError) {
          console.warn('Could not load faculty data, using fallback:', facultyError);
          // Ensure fallback data is used
          facultyData = fallbackFaculty;
        }

        try {
          // Load student data
          const studentResponse = await fetch('/students.json');
          if (studentResponse.ok) {
            const rawStudents = await studentResponse.json();
            const userInstitutionCode = user?.institutionCode || user?.selectedInstitutionCode;

            if (Array.isArray(rawStudents) && rawStudents.length > 0 && userInstitutionCode) {
              // Transform the raw student data to match our interface
              const transformedStudents = rawStudents
                .filter(s =>
                  s.academic_info?.institution_code === parseInt(userInstitutionCode) &&
                  s.status === 'Active'
                )
                .map(s => ({
                  student_id: s.student_id,
                  registration_number: s.registration_number,
                  status: s.status,
                  personal_info: {
                    full_name: s.personal_info?.full_name || `${s.personal_info?.first_name || ''} ${s.personal_info?.last_name || ''}`.trim() || `Student ${s.student_id}`,
                    gender: s.personal_info?.gender || 'Not Specified'
                  },
                  contact_info: {
                    email: s.contact_info?.email || `student${s.student_id}@institution.edu`,
                    phone_number: s.contact_info?.phone_number || '+919999999999'
                  },
                  academic_info: {
                    institution: s.academic_info?.institution || user?.institution || 'Institution',
                    institution_code: s.academic_info?.institution_code,
                    program: s.academic_info?.program || 'General Program',
                    year: s.academic_info?.year || 1,
                    semester: s.academic_info?.semester || 1
                  },
                  department_id: s.department_id || 101
                }));

              if (transformedStudents.length > 0) {
                studentData = transformedStudents;
              }
            }
          }
        } catch (studentError) {
          console.warn('Could not load student data, using fallback:', studentError);
          // Ensure fallback data is used
          studentData = fallbackStudents;
        }

        setFaculty(facultyData);
        setStudents(studentData);

        // Mock assignments - in real app this would come from API
        const mockAssignments: FacultyStudentAssignment[] = [];

        // Only create assignments if we have faculty and students data
        if (facultyData.length > 0 && studentData.length > 0) {
          // Assignment 1: First faculty member
          if (facultyData[0]) {
            mockAssignments.push({
              id: '1',
              facultyId: facultyData[0].faculty_id,
              studentIds: studentData.slice(0, Math.min(15, studentData.length)).map(s => s.student_id),
              className: 'Computer Science Batch A',
              section: 'A',
              academicYear: '2024-2025',
              semester: 3,
              departmentId: 101,
              assignmentType: 'class_teacher',
              startDate: '2024-06-01',
              endDate: '2024-11-30',
              status: 'active',
              createdDate: '2024-05-15',
              notes: 'Computer science students - Class teacher assignment'
            });
          }

          // Assignment 2: GANESAN if available
          const ganesanFaculty = facultyData.find(f => f.faculty_id === 32142001) || facultyData[1];
          if (ganesanFaculty) {
            mockAssignments.push({
              id: '2',
              facultyId: ganesanFaculty.faculty_id,
              studentIds: studentData.slice(0, Math.min(20, studentData.length)).map(s => s.student_id),
              className: 'Computer Engineering Batch B',
              section: 'B',
              academicYear: '2024-2025',
              semester: 3,
              departmentId: 101,
              assignmentType: 'advisor',
              startDate: '2024-06-01',
              endDate: '2024-11-30',
              status: 'active',
              createdDate: '2024-05-10',
              notes: 'Computer engineering students - Academic advisor'
            });
          }

          // Assignment 3: DHARANIPATHI if available
          const dharaniFaculty = facultyData.find(f => f.faculty_id === 11011001) || facultyData[2];
          if (dharaniFaculty) {
            mockAssignments.push({
              id: '3',
              facultyId: dharaniFaculty.faculty_id,
              studentIds: studentData.slice(0, Math.min(18, studentData.length)).map(s => s.student_id),
              className: 'Electronics Communication Batch A',
              section: 'A',
              academicYear: '2024-2025',
              semester: 3,
              departmentId: 102,
              assignmentType: 'mentor',
              startDate: '2024-06-01',
              endDate: '2024-11-30',
              status: 'active',
              createdDate: '2024-05-12',
              notes: 'Electronics and Communication Engineering students - Mentor assignment'
            });
          }
        }

        setAssignments(mockAssignments);

      } catch (error) {
        console.error('Error loading data:', error);
        // Ensure we have at least fallback data even if everything fails
        setFaculty(fallbackFaculty);
        setStudents(fallbackStudents);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssignmentTypeColor = (type: string) => {
    switch (type) {
      case 'class_teacher': return 'bg-blue-100 text-blue-800';
      case 'advisor': return 'bg-green-100 text-green-800';
      case 'mentor': return 'bg-purple-100 text-purple-800';
      case 'subject_guide': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFacultyName = (facultyId: number) => {
    return faculty.find(f => f.faculty_id === facultyId)?.personal_info.full_name || 'Unknown Faculty';
  };

  const getFacultyInfo = (facultyId: number) => {
    return faculty.find(f => f.faculty_id === facultyId);
  };

  const getStudentsByIds = (studentIds: number[]) => {
    return students.filter(s => studentIds.includes(s.student_id));
  };

  const getDepartments = () => {
    const departments = [...new Set(faculty.map(f => f.department))];
    return departments;
  };

  const getStudentsByDepartment = (departmentId: number) => {
    return students.filter(s => s.department_id === departmentId);
  };

  const filteredAssignments = assignments.filter(assignment => {
    const facultyInfo = getFacultyInfo(assignment.facultyId);
    const assignedStudents = getStudentsByIds(assignment.studentIds);
    
    const matchesSearch = 
      getFacultyName(assignment.facultyId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.section.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = filterDepartment === 'all' || 
      facultyInfo?.department === filterDepartment;

    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    const matchesAssignmentType = filterAssignmentType === 'all' || assignment.assignmentType === filterAssignmentType;

    return matchesSearch && matchesDepartment && matchesStatus && matchesAssignmentType;
  });

  const handleDeleteAssignment = (assignmentId: string) => {
    if (window.confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) {
      setAssignments(assignments.filter(a => a.id !== assignmentId));
    }
  };

  const stats = {
    totalAssignments: assignments.length,
    activeAssignments: assignments.filter(a => a.status === 'active').length,
    totalStudentsAssigned: assignments.reduce((sum, a) => sum + a.studentIds.length, 0),
    facultyWithAssignments: new Set(assignments.map(a => a.facultyId)).size
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center p-8">
          <div className="text-lg">Loading faculty and student data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Faculty-Student Assignments</h1>
          <p className="text-muted-foreground mt-2">
            Manage faculty assignments to student classes and mentorship roles.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            onClick={() => navigate('/staff/allotment/create')}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Assignment
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Assignments</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalAssignments}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Assignments</p>
                <p className="text-3xl font-bold text-green-900">{stats.activeAssignments}</p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Students Assigned</p>
                <p className="text-3xl font-bold text-purple-900">{stats.totalStudentsAssigned}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Faculty Involved</p>
                <p className="text-3xl font-bold text-orange-900">{stats.facultyWithAssignments}</p>
              </div>
              <Building className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search assignments by faculty, class, or section..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterDepartment} onValueChange={setFilterDepartment}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {getDepartments().map((dept) => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterAssignmentType} onValueChange={setFilterAssignmentType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Assignment type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="class_teacher">Class Teacher</SelectItem>
            <SelectItem value="advisor">Advisor</SelectItem>
            <SelectItem value="mentor">Mentor</SelectItem>
            <SelectItem value="subject_guide">Subject Guide</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="faculty">Faculty Overview</TabsTrigger>
          <TabsTrigger value="students">Student Overview</TabsTrigger>
        </TabsList>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-4 font-medium">Faculty & Assignment</th>
                      <th className="text-left p-4 font-medium">Class Details</th>
                      <th className="text-left p-4 font-medium">Students</th>
                      <th className="text-left p-4 font-medium">Duration</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssignments.map((assignment) => {
                      const facultyInfo = getFacultyInfo(assignment.facultyId);
                      const assignedStudents = getStudentsByIds(assignment.studentIds);

                      return (
                        <tr key={assignment.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 rounded-lg">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium">{getFacultyName(assignment.facultyId)}</div>
                                <div className="text-sm text-gray-500">
                                  {facultyInfo?.designation} - {facultyInfo?.department}
                                </div>
                                <Badge variant="outline" className={getAssignmentTypeColor(assignment.assignmentType)}>
                                  {assignment.assignmentType.replace('_', ' ').toUpperCase()}
                                </Badge>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">
                              <div className="font-medium">{assignment.className}</div>
                              <div className="text-gray-500">Section {assignment.section}</div>
                              <div className="text-gray-400">Semester {assignment.semester} - {assignment.academicYear}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">
                              <div className="flex items-center gap-1 mb-1">
                                <UsersIcon className="h-3 w-3 text-gray-400" />
                                <span className="font-medium">{assignedStudents.length} students</span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {assignedStudents.slice(0, 3).map(s => s.personal_info.full_name).join(', ')}
                                {assignedStudents.length > 3 && ` +${assignedStudents.length - 3} more`}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">
                              <div className="flex items-center gap-1 mb-1">
                                <Calendar className="h-3 w-3 text-gray-400" />
                                <span>{assignment.startDate}</span>
                              </div>
                              <div className="text-gray-500">to {assignment.endDate}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className={getStatusColor(assignment.status)}>
                              {assignment.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/staff/allotment/${assignment.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/staff/allotment/${assignment.id}/edit`)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteAssignment(assignment.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredAssignments.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Faculty Overview Tab */}
        <TabsContent value="faculty" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Faculty Members</CardTitle>
              <CardDescription>Available faculty for student assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {faculty.map((member) => {
                  const memberAssignments = assignments.filter(a => a.facultyId === member.faculty_id);
                  const totalStudents = memberAssignments.reduce((sum, a) => sum + a.studentIds.length, 0);

                  return (
                    <div key={member.faculty_id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <GraduationCap className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{member.personal_info.full_name}</h3>
                          <p className="text-sm text-gray-500">{member.designation} - {member.department}</p>
                          <p className="text-xs text-gray-400">Employee ID: {member.employee_number}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <p className="text-sm font-medium">{memberAssignments.length} assignments</p>
                          <p className="text-xs text-gray-500">{totalStudents} students</p>
                        </div>
                        <Badge variant="outline" className={getStatusColor(member.employment_status.toLowerCase())}>
                          {member.employment_status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Students Overview Tab */}
        <TabsContent value="students" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Overview</CardTitle>
              <CardDescription>Students available for faculty assignment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {getDepartments().map((department) => {
                  const deptStudents = getStudentsByDepartment(
                    faculty.find(f => f.department === department)?.department_id || 0
                  );
                  const assignedStudents = assignments.reduce((acc, assignment) => {
                    return acc.concat(assignment.studentIds);
                  }, [] as number[]);
                  const unassignedCount = deptStudents.filter(s => !assignedStudents.includes(s.student_id)).length;

                  return (
                    <div key={department} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{department}</h3>
                          <p className="text-sm text-gray-500">{deptStudents.length} total students</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">
                            {deptStudents.length - unassignedCount} assigned
                          </p>
                          <p className="text-sm text-orange-600">
                            {unassignedCount} unassigned
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
