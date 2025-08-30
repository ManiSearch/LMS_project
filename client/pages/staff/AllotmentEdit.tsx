import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, X } from 'lucide-react';

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

export default function StaffAllotmentEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [originalAllotment, setOriginalAllotment] = useState<Allotment | null>(null);

  // Form state
  const [allotmentForm, setAllotmentForm] = useState({
    staffId: '',
    subjectId: '',
    className: '',
    section: '',
    semester: '',
    academicYear: '2024-2025',
    room: '',
    timeSlot: '',
    days: [] as string[],
    startDate: '',
    endDate: '',
    workload: ''
  });

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

  // Load external JSON data and populate form
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

        // Find and populate the allotment data
        const foundAllotment = mockAllotments.find(a => a.id === id);
        if (foundAllotment) {
          setOriginalAllotment(foundAllotment);
          setAllotmentForm({
            staffId: foundAllotment.staffId,
            subjectId: foundAllotment.subjectId,
            className: foundAllotment.className,
            section: foundAllotment.section,
            semester: foundAllotment.semester.toString(),
            academicYear: foundAllotment.academicYear,
            room: foundAllotment.room,
            timeSlot: foundAllotment.timeSlot,
            days: [...foundAllotment.days],
            startDate: foundAllotment.startDate,
            endDate: foundAllotment.endDate,
            workload: foundAllotment.workload.toString()
          });
        }

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
        // Find and populate the allotment data
        const foundAllotment = mockAllotments.find(a => a.id === id);
        if (foundAllotment) {
          setOriginalAllotment(foundAllotment);
          setAllotmentForm({
            staffId: foundAllotment.staffId,
            subjectId: foundAllotment.subjectId,
            className: foundAllotment.className,
            section: foundAllotment.section,
            semester: foundAllotment.semester.toString(),
            academicYear: foundAllotment.academicYear,
            room: foundAllotment.room,
            timeSlot: foundAllotment.timeSlot,
            days: [...foundAllotment.days],
            startDate: foundAllotment.startDate,
            endDate: foundAllotment.endDate,
            workload: foundAllotment.workload.toString()
          });
        }
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleUpdateAllotment = () => {
    // Validate required fields
    if (!allotmentForm.staffId || !allotmentForm.subjectId || !allotmentForm.className || !allotmentForm.section) {
      alert('Please fill in all required fields');
      return;
    }

    // In a real application, this would make an API call
    console.log('Updating allotment:', {
      id,
      ...allotmentForm,
      semester: parseInt(allotmentForm.semester),
      workload: parseInt(allotmentForm.workload)
    });
    
    // Navigate back to view page
    navigate(`/staff/allotment/${id}`);
  };

  const toggleDay = (day: string) => {
    setAllotmentForm(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center p-8">
          <div className="text-lg">Loading allotment data...</div>
        </div>
      </div>
    );
  }

  if (!originalAllotment) {
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/staff/allotment/${id}`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to View
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Staff Allotment</h1>
          <p className="text-muted-foreground mt-2">
            Update allotment details and schedule.
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Allotment Details</CardTitle>
          <CardDescription>Update the details for this staff allotment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="staff">Staff Member *</Label>
              <Select value={allotmentForm.staffId} onValueChange={(value) => setAllotmentForm({ ...allotmentForm, staffId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {staff.filter(s => s.status === 'active').map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.employeeId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Select value={allotmentForm.subjectId} onValueChange={(value) => setAllotmentForm({ ...allotmentForm, subjectId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.code} - {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="className">Class Name *</Label>
              <Input
                id="className"
                value={allotmentForm.className}
                onChange={(e) => setAllotmentForm({ ...allotmentForm, className: e.target.value })}
                placeholder="B.Tech CSE"
              />
            </div>
            <div>
              <Label htmlFor="section">Section *</Label>
              <Input
                id="section"
                value={allotmentForm.section}
                onChange={(e) => setAllotmentForm({ ...allotmentForm, section: e.target.value })}
                placeholder="A"
              />
            </div>
            <div>
              <Label htmlFor="semester">Semester</Label>
              <Select value={allotmentForm.semester} onValueChange={(value) => setAllotmentForm({ ...allotmentForm, semester: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <SelectItem key={sem} value={sem.toString()}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="academicYear">Academic Year</Label>
              <Input
                id="academicYear"
                value={allotmentForm.academicYear}
                onChange={(e) => setAllotmentForm({ ...allotmentForm, academicYear: e.target.value })}
                placeholder="2024-2025"
              />
            </div>
            <div>
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                value={allotmentForm.room}
                onChange={(e) => setAllotmentForm({ ...allotmentForm, room: e.target.value })}
                placeholder="Room 101"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timeSlot">Time Slot</Label>
              <Input
                id="timeSlot"
                value={allotmentForm.timeSlot}
                onChange={(e) => setAllotmentForm({ ...allotmentForm, timeSlot: e.target.value })}
                placeholder="9:00 AM - 10:00 AM"
              />
            </div>
            <div>
              <Label htmlFor="workload">Workload (hours/week)</Label>
              <Input
                id="workload"
                type="number"
                value={allotmentForm.workload}
                onChange={(e) => setAllotmentForm({ ...allotmentForm, workload: e.target.value })}
                placeholder="3"
              />
            </div>
          </div>

          <div>
            <Label>Days of Week</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {weekDays.map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-${day}`}
                    checked={allotmentForm.days.includes(day)}
                    onCheckedChange={() => toggleDay(day)}
                  />
                  <Label htmlFor={`edit-${day}`} className="text-sm">
                    {day}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={allotmentForm.startDate}
                onChange={(e) => setAllotmentForm({ ...allotmentForm, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={allotmentForm.endDate}
                onChange={(e) => setAllotmentForm({ ...allotmentForm, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/staff/allotment/${id}`)}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateAllotment} 
              disabled={!allotmentForm.staffId || !allotmentForm.subjectId || !allotmentForm.className || !allotmentForm.section}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Update Allotment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
