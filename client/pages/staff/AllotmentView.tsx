import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Clock, MapPin, User, BookOpen, Calendar, Award, Trash2 } from 'lucide-react';

interface Allotment {
  id: string;
  staffId: string;
  subjectId: string;
  className: string;
  section: string;
  semester: number;
  academicYear: string;
  room: string;
  timeSlot: string;
  days: string[];
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
  workload: number;
  createdDate: string;
}

interface StaffMember {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  designation: string;
  email: string;
  phone: string;
  qualifications: string[];
  specializations: string[];
  status: 'active' | 'inactive' | 'on_leave';
}

interface Subject {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  type: 'theory' | 'practical' | 'lab' | 'project';
}

interface FacultyData {
  faculty_id: string;
  employee_number: string;
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
  qualification_info: {
    ug_degree?: string;
    pg_degree?: string;
    phd_subject?: string;
  };
}

interface ProgramData {
  id: string;
  name: string;
  code: string;
  department: string;
  totalCredits: number;
  type: string;
}

export default function StaffAllotmentView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [allotment, setAllotment] = useState<Allotment | null>(null);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock allotments data - in real app this would come from API
  const mockAllotments: Allotment[] = [
    {
      id: '1',
      staffId: 'F2025001',
      subjectId: 'C036',
      className: 'Mechanics of Materials',
      section: 'A',
      semester: 3,
      academicYear: '2024-2025',
      room: 'Room 101',
      timeSlot: '9:00 AM - 10:00 AM',
      days: ['Monday', 'Wednesday', 'Friday'],
      startDate: '2024-06-01',
      endDate: '2024-11-30',
      status: 'active',
      workload: 3,
      createdDate: '2024-05-15'
    },
    {
      id: '2',
      staffId: 'F2025002',
      subjectId: 'C012',
      className: 'Construction Materials',
      section: 'B',
      semester: 4,
      academicYear: '2024-2025',
      room: 'Lab 201',
      timeSlot: '10:00 AM - 11:00 AM',
      days: ['Tuesday', 'Thursday'],
      startDate: '2024-06-01',
      endDate: '2024-11-30',
      status: 'active',
      workload: 2,
      createdDate: '2024-05-16'
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fallback data in case fetch fails
        const fallbackStaff: StaffMember[] = [
          {
            id: 'F2025001',
            name: 'Dr. John Smith',
            employeeId: 'F2025001',
            department: 'Computer Science',
            designation: 'Professor',
            email: 'john.smith@university.edu',
            phone: '+1234567890',
            qualifications: ['Ph.D. Computer Science', 'M.Tech CSE'],
            specializations: ['Machine Learning', 'Data Structures'],
            status: 'active'
          },
          {
            id: 'F2025002',
            name: 'Dr. Jane Doe',
            employeeId: 'F2025002',
            department: 'Information Technology',
            designation: 'Associate Professor',
            email: 'jane.doe@university.edu',
            phone: '+1234567891',
            qualifications: ['Ph.D. Information Technology', 'M.Tech IT'],
            specializations: ['Database Systems', 'Software Engineering'],
            status: 'active'
          },
          {
            id: 'F2025003',
            name: 'Prof. Alice Johnson',
            employeeId: 'F2025003',
            department: 'Civil Engineering',
            designation: 'Professor',
            email: 'alice.johnson@university.edu',
            phone: '+1234567892',
            qualifications: ['Ph.D. Civil Engineering', 'M.Tech Civil'],
            specializations: ['Structural Engineering', 'Construction Management'],
            status: 'active'
          }
        ];

        const fallbackSubjects: Subject[] = [
          {
            id: 'C036',
            code: 'C036',
            name: 'Mechanics of Materials',
            department: 'Civil Engineering',
            credits: 4,
            type: 'theory'
          },
          {
            id: 'C012',
            code: 'C012',
            name: 'Construction Materials',
            department: 'Civil Engineering',
            credits: 3,
            type: 'practical'
          },
          {
            id: 'C009',
            code: 'C009',
            name: 'Building Materials',
            department: 'Civil Engineering',
            credits: 3,
            type: 'theory'
          },
          {
            id: 'C025',
            code: 'C025',
            name: 'Architectural Drawing',
            department: 'Civil Engineering',
            credits: 2,
            type: 'practical'
          },
          {
            id: 'C031',
            code: 'C031',
            name: 'History of Architecture',
            department: 'Civil Engineering',
            credits: 2,
            type: 'theory'
          }
        ];

        let mappedStaff: StaffMember[] = fallbackStaff;
        let mappedSubjects: Subject[] = fallbackSubjects;

        try {
          // Try to load faculty data
          const facultyResponse = await fetch('/faculty.json');
          if (facultyResponse.ok) {
            const facultyData: FacultyData[] = await facultyResponse.json();

            // Map faculty data to staff interface
            mappedStaff = facultyData.map(faculty => ({
              id: faculty.faculty_id,
              name: faculty.personal_info.full_name,
              employeeId: faculty.employee_number,
              department: faculty.department,
              designation: faculty.designation,
              email: faculty.contact_info.email,
              phone: faculty.contact_info.phone_number,
              qualifications: [
                faculty.qualification_info.ug_degree,
                faculty.qualification_info.pg_degree,
                faculty.qualification_info.phd_subject
              ].filter(Boolean),
              specializations: faculty.specialization ? [faculty.specialization] : [],
              status: faculty.employment_status === 'Active' ? 'active' : 'inactive'
            }));
          }
        } catch (facultyError) {
          console.warn('Could not load faculty data, using fallback:', facultyError);
        }

        try {
          // Try to load program data
          const programResponse = await fetch('/program.json');
          if (programResponse.ok) {
            const programData: ProgramData[] = await programResponse.json();

            // Map program data to subjects interface
            mappedSubjects = programData.map(program => ({
              id: program.id,
              code: program.code,
              name: program.name,
              department: program.department,
              credits: Math.floor(program.totalCredits / 30),
              type: program.type === 'Full-time' ? 'theory' : 'practical'
            }));
          }
        } catch (programError) {
          console.warn('Could not load program data, using fallback:', programError);
        }

        setStaff(mappedStaff);
        setSubjects(mappedSubjects);

        // Find the allotment by ID
        const foundAllotment = mockAllotments.find(a => a.id === id);
        setAllotment(foundAllotment || null);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        // Even if everything fails, provide minimal fallback data
        setStaff([
          {
            id: 'F2025001',
            name: 'Sample Staff Member',
            employeeId: 'F2025001',
            department: 'Computer Science',
            designation: 'Professor',
            email: 'staff@university.edu',
            phone: '+1234567890',
            qualifications: ['Ph.D.'],
            specializations: ['Teaching'],
            status: 'active'
          }
        ]);
        setSubjects([
          {
            id: 'SUB001',
            code: 'SUB001',
            name: 'Sample Subject',
            department: 'Computer Science',
            credits: 3,
            type: 'theory'
          }
        ]);
        // Find the allotment by ID
        const foundAllotment = mockAllotments.find(a => a.id === id);
        setAllotment(foundAllotment || null);
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStaffName = (staffId: string) => {
    return staff.find(s => s.id === staffId)?.name || 'Unknown Staff';
  };

  const getStaffInfo = (staffId: string) => {
    return staff.find(s => s.id === staffId);
  };

  const getSubjectInfo = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId) || { code: 'N/A', name: 'Unknown Subject' };
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this allotment? This action cannot be undone.')) {
      // In real app, make API call to delete
      console.log('Deleting allotment:', id);
      navigate('/staff/allotment');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center p-8">
          <div className="text-lg">Loading allotment details...</div>
        </div>
      </div>
    );
  }

  if (!allotment) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/staff/allotment')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Allotments
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Allotment Not Found</h1>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">The requested allotment could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const staffInfo = getStaffInfo(allotment.staffId);
  const subjectInfo = getSubjectInfo(allotment.subjectId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/staff/allotment')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Allotments
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Allotment Details</h1>
            <p className="text-muted-foreground mt-2">
              Complete information for this staff allotment
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => navigate(`/staff/allotment/${id}/edit`)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button 
            variant="outline"
            onClick={handleDelete}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Staff Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Staff Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Name</Label>
              <p className="text-sm font-medium">{getStaffName(allotment.staffId)}</p>
            </div>
            {staffInfo && (
              <>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Employee ID</Label>
                  <p className="text-sm">{staffInfo.employeeId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Designation</Label>
                  <p className="text-sm">{staffInfo.designation}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Department</Label>
                  <p className="text-sm">{staffInfo.department}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Email</Label>
                  <p className="text-sm">{staffInfo.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Phone</Label>
                  <p className="text-sm">{staffInfo.phone}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Subject Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Subject Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Subject Code</Label>
              <p className="text-sm font-medium">{subjectInfo.code}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Subject Name</Label>
              <p className="text-sm">{subjectInfo.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Department</Label>
              <p className="text-sm">{subjectInfo.department}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Credits</Label>
              <p className="text-sm">{subjectInfo.credits}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Type</Label>
              <Badge variant="outline" className="text-xs">
                {subjectInfo.type}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Allotment Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Status & Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Status</Label>
              <Badge className={getStatusColor(allotment.status)}>
                {allotment.status}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Workload</Label>
              <p className="text-sm">{allotment.workload} hours/week</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Created Date</Label>
              <p className="text-sm">{allotment.createdDate}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Academic Year</Label>
              <p className="text-sm">{allotment.academicYear}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Details */}
      <Card>
        <CardHeader>
          <CardTitle>Class Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-500">Class Name</Label>
              <p className="text-sm font-medium">{allotment.className}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Section</Label>
              <p className="text-sm">{allotment.section}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Semester</Label>
              <p className="text-sm">Semester {allotment.semester}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Academic Year</Label>
              <p className="text-sm">{allotment.academicYear}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Time Slot
              </Label>
              <p className="text-sm">{allotment.timeSlot}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Room
              </Label>
              <p className="text-sm">{allotment.room}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Start Date</Label>
              <p className="text-sm">{allotment.startDate}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">End Date</Label>
              <p className="text-sm">{allotment.endDate}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <Label className="text-sm font-medium text-gray-500">Days of Week</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {allotment.days.map((day) => (
                <Badge key={day} variant="outline" className="text-xs">
                  {day}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
