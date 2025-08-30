import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  ArrowLeft,
  Mail,
  Edit3,
  Download,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
} from "lucide-react";
import { Student, mockStudents } from "@/mock/data";
import { useAuth } from "@/contexts/AuthContext";

export default function StudentView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStudent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to load from JSON file first
        let studentsData: any[] = [];
        try {
          const response = await fetch('/students.json');
          if (response.ok) {
            studentsData = await response.json();
          } else {
            throw new Error('Failed to fetch students.json');
          }
        } catch (fetchError) {
          console.warn('Failed to fetch students.json, using mock data as fallback...', fetchError);
          // Use mock data as fallback
          studentsData = mockStudents.map(mockStudent => ({
            student_id: mockStudent.id,
            personal_info: {
              full_name: mockStudent.name,
            },
            contact_info: {
              email: mockStudent.email,
            },
            academic_info: {
              institution: mockStudent.institution,
              program: mockStudent.program,
              year: mockStudent.year,
              semester: mockStudent.semester,
            },
            roll_number: mockStudent.rollNumber,
            status: mockStudent.status,
          }));
        }

        // Filter students based on user access
        const filteredStudents = filterStudentsByUserAccess(studentsData, user);
        
        // Transform and find the specific student
        const transformedStudents = filteredStudents.map(transformStudentData);
        const foundStudent = transformedStudents.find(s => s.id === id);

        if (!foundStudent) {
          setError('Student not found');
          return;
        }

        setStudent(foundStudent);
      } catch (err) {
        console.error('Error loading student:', err);
        setError('Failed to load student data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadStudent();
    }
  }, [id, user]);

  // Filter students based on user's role and institution
  const filterStudentsByUserAccess = (studentsData: any[], currentUser: any) => {
    if (!currentUser) return [];

    // Super admin can see all students
    if (currentUser.role === 'super-admin') {
      return studentsData;
    }

    // Get user's institution info
    const userInstitutionCode = currentUser.institutionCode;

    return studentsData.filter(student => {
      if (!student.academic_info) return false;

      const studentInstitutionCode = student.academic_info.institution_code;
      const studentInstitution = student.academic_info.institution;

      // Match by institution code (primary method)
      if (userInstitutionCode && studentInstitutionCode) {
        return String(studentInstitutionCode) === String(userInstitutionCode);
      }

      // Fallback: Match by institution name
      if (studentInstitution && currentUser.institution) {
        const institutionNameMap = {
          '102': 'Institution of Printing Technology',
          '110': 'Government Polytechnic College, Krishnagiri',
          '214': 'E I T Polytecnic College',
          '215': 'Sakthi Polytechnic College'
        };

        const expectedInstitutionName = institutionNameMap[userInstitutionCode as keyof typeof institutionNameMap];

        if (expectedInstitutionName) {
          return studentInstitution.toLowerCase().includes(expectedInstitutionName.toLowerCase()) ||
                 expectedInstitutionName.toLowerCase().includes(studentInstitution.toLowerCase());
        }
      }

      return false;
    });
  };

  // Transform JSON student data to Student interface
  const transformStudentData = (jsonStudent: any): Student => {
    const personal = jsonStudent.personal_info || {};
    const academic = jsonStudent.academic_info || {};
    const contact = jsonStudent.contact_info || {};

    return {
      id: jsonStudent.student_id?.toString() || 'Unknown',
      name: personal.full_name || personal.last_name || 'Unknown Name',
      email: contact.email || '',
      rollNumber: jsonStudent.roll_number || jsonStudent.registration_number || '',
      institution: academic.institution || 'Unknown Institution',
      program: academic.program || 'Unknown Program',
      year: academic.year || 1,
      semester: academic.semester || 1,
      status: jsonStudent.status?.toLowerCase() === 'active' ? 'active' :
               jsonStudent.status?.toLowerCase() === 'graduated' ? 'graduated' : 'inactive',
      avatar: jsonStudent.documents?.profile_photo || undefined,
      parentId: undefined,
      educationalAuthority: academic.educational_authority as "DOTE" | "DOCE" | "ANNA UNIVERSITY" | "BHARATHIAR UNIVERSITY" || "ANNA UNIVERSITY"
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "graduated":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDownloadInfo = () => {
    if (!student) return;

    const studentData = [{
      Name: student.name,
      Email: student.email,
      "Roll Number": student.rollNumber,
      Institution: student.institution,
      Program: student.program,
      Year: student.year,
      Semester: student.semester,
      Status: student.status,
    }];

    const worksheet = XLSX.utils.json_to_sheet(studentData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Student Info");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, `${student.name.replace(/\s+/g, "_")}_info.xlsx`);
    toast.success("Student info downloaded!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading student details...</p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Details</h1>
            <p className="text-muted-foreground">View student information</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error || 'Student not found'}</p>
              <Button onClick={() => navigate('/academics/students')}>
                Return to Students List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Details</h1>
          <p className="text-muted-foreground">
            Complete information for {student.name}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Student Header */}
            <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
              <Avatar className="h-16 w-16">
                <AvatarImage src={student.avatar} />
                <AvatarFallback className="text-lg">
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{student.name}</h3>
                <p className="text-muted-foreground">{student.email}</p>
                <Badge
                  className={getStatusColor(student.status)}
                  variant="secondary"
                >
                  {student.status}
                </Badge>
              </div>
            </div>

            {/* Student Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Personal Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </label>
                    <p className="text-sm font-medium">{student.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Email Address
                    </label>
                    <p className="text-sm font-medium">{student.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Roll Number
                    </label>
                    <p className="text-sm font-medium font-mono">
                      {student.rollNumber}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Academic Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Institution
                    </label>
                    <p className="text-sm font-medium">{student.institution}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Educational Authority
                    </label>
                    <p className="text-sm font-medium">
                      {student.educationalAuthority || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Program
                    </label>
                    <p className="text-sm font-medium">{student.program}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Academic Year
                    </label>
                    <p className="text-sm font-medium">
                      Year {student.year}, Semester {student.semester}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Status
                    </label>
                    <p className="text-sm font-medium capitalize">
                      {student.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/academics/students/${id}/email`)}
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/academics/students/${id}/edit`)}
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Edit Student
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadInfo}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Info
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
