import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination, usePagination } from "@/components/ui/pagination";
import { toast } from "sonner";
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Download,
  Upload,
  MoreVertical,
  Edit3,
  Eye,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  TrendingUp,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { Student, mockStudents } from "@/mock/data";
import { useAuth } from "@/contexts/AuthContext";


export default function Students() {
  // State management for students from JSON
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load students data from JSON file and filter based on user institution
  useEffect(() => {
    const loadStudents = async () => {
      let studentsData = [];

      try {
        setLoading(true);
        setError(null);

        // Try to fetch from JSON file, but always have a fallback
        try {
          console.log('🔄 Attempting to fetch /students.json...');
          const response = await fetch('/students.json');
          console.log('📡 Fetch response status:', response.status, response.statusText);

          if (response.ok) {
            const jsonData = await response.json();
            console.log('📊 Raw JSON data loaded, length:', jsonData?.length, 'isArray:', Array.isArray(jsonData));

            if (Array.isArray(jsonData) && jsonData.length > 0) {
              studentsData = jsonData;
              console.log('✅ Successfully loaded students.json with', jsonData.length, 'students');

              // Log a few sample students for debugging
              console.log('📋 Sample students from JSON:');
              jsonData.slice(0, 3).forEach((student, index) => {
                console.log(`Student ${index + 1}:`, {
                  id: student.student_id,
                  name: student.personal_info?.full_name,
                  institution: student.academic_info?.institution,
                  institution_code: student.academic_info?.institution_code
                });
              });
            } else {
              throw new Error('Invalid JSON data format or empty array');
            }
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        } catch (fetchError) {
          console.error('��� Failed to fetch/parse students.json, using mock data fallback...', fetchError);
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

        // Always set the loaded data (either from JSON or mock)
        setAllStudents(studentsData);

        // Filter students based on logged-in user's role and institution
        let filteredStudents;
        if (user?.role === 'faculty') {
          // For faculty, filter by department
          filteredStudents = filterStudentsByFacultyDepartment(studentsData, user);
        } else {
          // For other roles, use regular filtering
          filteredStudents = filterStudentsByUserAccess(studentsData, user);
        }

        // Transform JSON data to Student interface format
        const transformedStudents = filteredStudents.map(transformStudentData);

        setStudents(transformedStudents);

        console.log(`📊 Students loaded:`, {
          total: studentsData.length,
          filtered: filteredStudents.length,
          transformed: transformedStudents.length,
          user: user?.name,
          role: user?.role,
          institutionCode: user?.institutionCode
        });

        // Additional debugging for empty results
        if (filteredStudents.length === 0 && studentsData.length > 0) {
          console.error('🚨 PROBLEM: No students passed filtering despite having', studentsData.length, 'total students');
          console.log('🔍 User details for debugging:', {
            role: user?.role,
            institutionCode: user?.institutionCode,
            institutionId: user?.institutionId,
            institution: user?.institution
          });

          // Show institution codes from first few students
          console.log('🏫 Institution codes in student data:');
          const institutionCodes = [...new Set(studentsData.map(s => s.academic_info?.institution_code).filter(Boolean))];
          console.log('Available institution codes:', institutionCodes);
        }

      } catch (err) {
        console.error('Unexpected error in loadStudents:', err);

        // Final fallback - this should rarely happen now
        setError('An unexpected error occurred. Please refresh the page.');

        // Use mock data as absolute final fallback
        const filteredMockStudents = user?.role === 'super-admin' ? mockStudents :
          mockStudents.filter(student => {
            if (user?.institutionCode) {
              const institutionCodeMap = {
                '102': ['Institution of Printing Technology', 'DOTE'],
                '110': ['Government Polytechnic College', 'DOTE'],
                '214': ['E I T Polytecnic College', 'DOTE'],
                '215': ['Sakthi Polytechnic College', 'DOTE']
              };

              const [expectedInstitution, expectedAuthority] = institutionCodeMap[user.institutionCode as keyof typeof institutionCodeMap] || [];
              return student.institution.includes(expectedInstitution) ||
                     student.educationalAuthority === expectedAuthority;
            }
            return student.institution === user?.institution;
          });

        setStudents(filteredMockStudents);
      } finally {
        setLoading(false);
      }
    };

    // Only load students if we have a user object
    if (user) {
      loadStudents();
    } else {
      setLoading(false);
    }
  }, [user]);

  /**
   * Filter students based on user's role and institution
   *
   * IMPORTANT: Filtering is based ONLY on institution codes, not on student names,
   * institution names, or other attributes, as students can have the same names
   * across different institutions.
   *
   * Institution code is the unique identifier that ensures proper data separation.
   */
  const filterStudentsByUserAccess = (studentsData: any[], currentUser: any) => {
    if (!currentUser) return [];

    // Super admin can see all students
    if (currentUser.role === 'super-admin') {
      return studentsData;
    }

    // For faculty users, filter by department (which also includes institution filtering)
    if (currentUser.role === 'faculty') {
      return filterStudentsByFacultyDepartment(studentsData, currentUser);
    }

    console.log('🔍 Filtering students by INSTITUTION CODE ONLY for user:', {
      name: currentUser.name,
      role: currentUser.role,
      institutionCode: currentUser.institutionCode,
      institutionId: currentUser.institutionId,
      totalStudents: studentsData.length
    });

    // Get the primary institution code for filtering
    const userInstitutionCode = currentUser.institutionCode || currentUser.institutionId;
    console.log('🎯 User institution code for filtering:', userInstitutionCode);

    if (!userInstitutionCode) {
      console.error('❌ No institution code found for user - cannot filter students');
      return [];
    }

    // STRICT INSTITUTION CODE FILTERING:
    // Only match students with exact institution code - ignore names or other attributes
    const correctStudents = studentsData.filter(student => {
      if (!student.academic_info) {
        return false;
      }

      const studentInstitutionCode = student.academic_info.institution_code;

      // ONLY compare institution codes as strings
      const exactInstitutionMatch = String(studentInstitutionCode) === String(userInstitutionCode);

      if (exactInstitutionMatch) {
        console.log(`✅ INSTITUTION CODE MATCH: ${student.personal_info?.full_name} (code: ${studentInstitutionCode})`);
      }

      return exactInstitutionMatch;
    });

    console.log(`🎯 INSTITUTION FILTERING RESULT: ${correctStudents.length} students matched code ${userInstitutionCode}`);

    if (correctStudents.length === 0) {
      console.error('🚨 NO STUDENTS FOUND FOR INSTITUTION CODE', userInstitutionCode);

      // Detailed analysis of available data
      const availableCodes = [...new Set(studentsData.map(s => s.academic_info?.institution_code).filter(Boolean))];
      console.log('📊 Available institution codes in data:', availableCodes);
      console.log('📊 Available codes with types:', availableCodes.map(code => ({ code, type: typeof code })));

      // Show first few students for debugging
      console.log('📋 Sample of student data:');
      studentsData.slice(0, 5).forEach((student, index) => {
        console.log(`Student ${index + 1}: ${student.personal_info?.full_name}`, {
          institution_code: student.academic_info?.institution_code,
          institution_code_type: typeof student.academic_info?.institution_code,
          institution_name: student.academic_info?.institution,
          matches_user_code: String(student.academic_info?.institution_code) === String(userInstitutionCode)
        });
      });

      // Check if there are any students that would match with different comparisons
      const numberMatchStudents = studentsData.filter(s => s.academic_info?.institution_code === Number(userInstitutionCode));
      const stringMatchStudents = studentsData.filter(s => String(s.academic_info?.institution_code) === userInstitutionCode);

      console.log('🔍 Debug matching attempts:');
      console.log(`- Number match (${Number(userInstitutionCode)}):`, numberMatchStudents.length, 'students');
      console.log(`- String match ("${userInstitutionCode}"):`, stringMatchStudents.length, 'students');

      // If we find matches with number comparison, use those temporarily
      if (numberMatchStudents.length > 0 && stringMatchStudents.length === 0) {
        console.log('🚑 EMERGENCY FIX: Found students with number comparison, using those');
        return numberMatchStudents;
      }
    }

    return correctStudents;
  };

  /**
   * Filter students for faculty based on department matching
   *
   * IMPORTANT: Faculty filtering uses TWO-STEP filtering:
   * 1. FIRST: Filter by institution code (mandatory - ensures data separation)
   * 2. SECOND: Filter by department within the same institution
   *
   * This ensures faculty only see students from their own institution and department.
   */
  const filterStudentsByFacultyDepartment = (studentsData: any[], facultyUser: any) => {
    console.log('🎓 Faculty filtering - institution code FIRST, then department...', {
      facultyId: facultyUser.faculty_id,
      department: facultyUser.department,
      institutionCode: facultyUser.institutionCode
    });

    // Department mapping based on common engineering departments
    const departmentToIdMap: Record<string, number> = {
      "Computer Science and Engineering": 101,
      "Mechanical Engineering": 102,
      "Electronics and Communication Engineering": 103,
      "Civil Engineering": 104,
      "Information Technology": 105,
      "Chemical Engineering": 106,
      "Leather Technology": 107,
      "Textile Engineering": 108,
      "Commerce": 109,
      "Economics": 110,
      "Electrical and Electronics Engineering": 111
    };

    // Get department_id from mapping or use fallback
    const facultyDepartmentId = departmentToIdMap[facultyUser.department] || 101;

    console.log('✅ Faculty department mapping:', {
      faculty: facultyUser.name,
      department: facultyUser.department,
      departmentId: facultyDepartmentId,
      institutionCode: facultyUser.institutionCode
    });

    // Filter students by faculty's department_id and institution
    const filteredStudents = studentsData.filter(student => {
      if (!student.academic_info) {
        return false;
      }

      const studentInstitutionCode = student.academic_info.institution_code;
      const studentDepartmentId = student.department_id;

      // CRITICAL: Must match institution code first - this is mandatory for data security
      const institutionMatch = String(studentInstitutionCode) === String(facultyUser.institutionCode);

      if (!institutionMatch) {
        // Student is from different institution - reject immediately
        console.log(`❌ INSTITUTION MISMATCH: ${student.personal_info?.full_name} (student: ${studentInstitutionCode}, faculty: ${facultyUser.institutionCode})`);
        return false;
      }

      // If department_id is available for student, match by department
      if (studentDepartmentId !== undefined && studentDepartmentId !== null) {
        const departmentMatch = studentDepartmentId === facultyDepartmentId;

        if (departmentMatch) {
          console.log('✅ Student matches faculty department:', {
            student: student.personal_info?.full_name,
            studentDeptId: studentDepartmentId,
            facultyDeptId: facultyDepartmentId,
            department: facultyUser.department
          });
          return true;
        } else {
          console.log('⚠️ Student in same institution but different department:', {
            student: student.personal_info?.full_name,
            studentDeptId: studentDepartmentId,
            facultyDeptId: facultyDepartmentId,
            studentProgram: student.academic_info?.program
          });
          return false;
        }
      }

      // Fallback: if no department_id available, try to match by program/department name
      const studentProgram = student.academic_info?.program?.toLowerCase() || '';
      const facultyDepartment = facultyUser.department?.toLowerCase() || '';

      // Simple program-to-department matching for common cases
      const programMatches = (
        (facultyDepartment.includes('computer') && studentProgram.includes('basic engineering')) ||
        (facultyDepartment.includes('mechanical') && studentProgram.includes('mechanical')) ||
        (facultyDepartment.includes('electronics') && studentProgram.includes('electronics')) ||
        (facultyDepartment.includes('civil') && studentProgram.includes('civil')) ||
        (facultyDepartment.includes('information') && studentProgram.includes('information')) ||
        (facultyDepartment.includes('chemical') && studentProgram.includes('chemical'))
      );

      if (programMatches) {
        console.log('✅ Student matches faculty by program name:', {
          student: student.personal_info?.full_name,
          studentProgram: studentProgram,
          facultyDepartment: facultyDepartment
        });
        return true;
      }

      return false;
    });

    console.log(`🎯 Faculty ${facultyUser.name} has ${filteredStudents.length} students in ${facultyUser.department} department`);

    return filteredStudents;
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

  // Mock API functions
  const apiCreateStudent = async (studentData: StudentFormData) => {
    setLoading(true);
    try {
      const newStudent: Student = {
        ...studentData,
        id: `S${String(students.length + 1).padStart(3, '0')}`,
        institution: studentData.institution || 'MIT'
      };
      setStudents(prev => [...prev, newStudent]);
      toast.success('Student added successfully!');
    } catch (err) {
      setError('Failed to add student');
      toast.error('Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  const apiUpdateStudent = async (id: string, studentData: StudentFormData) => {
    setLoading(true);
    try {
      setStudents(prev => prev.map(s => s.id === id ? { ...s, ...studentData } : s));
      toast.success('Student updated successfully!');
    } catch (err) {
      setError('Failed to update student');
      toast.error('Failed to update student');
    } finally {
      setLoading(false);
    }
  };

  const apiDeleteStudent = async (id: string) => {
    setLoading(true);
    try {
      setStudents(prev => prev.filter(s => s.id !== id));
      toast.success('Student removed successfully!');
    } catch (err) {
      setError('Failed to remove student');
      toast.error('Failed to remove student');
    } finally {
      setLoading(false);
    }
  };

  const apiBulkImport = async (studentsData: StudentFormData[]) => {
    setLoading(true);
    try {
      const newStudents: Student[] = studentsData.map((data, index) => ({
        ...data,
        id: `S${String(students.length + index + 1).padStart(3, '0')}`,
        institution: data.institution || 'MIT'
      }));
      setStudents(prev => [...prev, ...newStudents]);
      toast.success(`${newStudents.length} students imported successfully!`);
    } catch (err) {
      setError('Failed to import students');
      toast.error('Failed to import students');
    } finally {
      setLoading(false);
    }
  };

  const apiExport = async () => {
    try {
      const dataStr = JSON.stringify(students, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      saveAs(dataBlob, `students_export_${new Date().toISOString().split('T')[0]}.json`);
      toast.success('Students data exported successfully!');
    } catch (err) {
      toast.error('Failed to export students');
    }
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedInstitution, setSelectedInstitution] = useState("all");
  const [selectedEducationalAuthority, setSelectedEducationalAuthority] = useState("all");
  const [importProgress, setImportProgress] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  // Calculate dynamic stats
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === "active").length;
  const graduatedStudents = students.filter(
    (s) => s.status === "graduated",
  ).length;
  const inactiveStudents = students.filter(
    (s) => s.status === "inactive",
  ).length;

  const stats = [
    {
      title: "Total Students",
      value: totalStudents.toString(),
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Students",
      value: activeStudents.toString(),
      change: "+8%",
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      title: "Graduated",
      value: graduatedStudents.toString(),
      change: "+25%",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Inactive",
      value: inactiveStudents.toString(),
      change: "-5%",
      icon: AlertCircle,
      color: "text-orange-600",
    },
  ];

  const institutions = [
    "Institution of Printing Technology",
    "Government Polytechnic College, Krishnagiri",
    "E I T Polytecnic College",
    "Sakthi Polytechnic College"
  ];
  const programs = [
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electronics",
    "Printing Technology",
    "Graphic Design",
    "Digital Media",
    "Publishing",
    "Textile Engineering",
    "Fashion Technology",
    "Garment Technology",
    "Fabric Science"
  ];
  const statuses = ["active", "inactive", "graduated"];

  // Educational authorities
  const educationalAuthorities = [
    "DOTE",
    "DOCE",
    "ANNA UNIVERSITY",
    "BHARATHIAR UNIVERSITY"
  ];

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram =
      selectedProgram === "all" || student.program === selectedProgram;
    const matchesStatus =
      selectedStatus === "all" || student.status === selectedStatus;
    const matchesInstitution =
      user?.role !== 'super-admin' ||
      selectedInstitution === "all" ||
      student.institution === selectedInstitution;
    const matchesEducationalAuthority =
      user?.role !== 'super-admin' ||
      selectedEducationalAuthority === "all" ||
      student.educationalAuthority === selectedEducationalAuthority;

    return (
      matchesSearch && matchesProgram && matchesStatus && matchesInstitution && matchesEducationalAuthority
    );
  });

  // Use pagination hook
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedStudents,
    handlePageChange,
    totalItems,
    pageSize
  } = usePagination(filteredStudents, itemsPerPage);



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


  const handleDeleteStudent = async (studentId: string) => {
    try {
      await apiDeleteStudent(studentId);
    } catch (error) {
      // Error handling is done in the hook
    }
  };


  // Excel Export Functions
  const exportToExcel = () => {
    const exportData = students.map((student) => ({
      Name: student.name,
      Email: student.email,
      "Roll Number": student.rollNumber,
      Institution: student.institution,
      "Educational Authority": student.educationalAuthority || "",
      Program: student.program,
      Year: student.year,
      Semester: student.semester,
      Status: student.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(
      data,
      `students_export_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
    toast.success("Students data exported successfully!");
  };

  // JSON Export using API
  const exportToJSON = async () => {
    try {
      await apiExport();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const exportStudentProgress = () => {
    const progressData = students.map((student) => ({
      Name: student.name,
      "Roll Number": student.rollNumber,
      Institution: student.institution,
      Program: student.program,
      "Current Year": student.year,
      "Current Semester": student.semester,
      Status: student.status,
      Progress: `${(((student.year - 1) * 2 + student.semester) / 8) * 100}%`,
      "Expected Graduation": `${new Date().getFullYear() + (4 - student.year)}`,
      "Credits Completed": `${(student.year - 1) * 30 + student.semester * 15}`,
      GPA: (Math.random() * 1.5 + 2.5).toFixed(2), // Mock GPA
    }));

    const worksheet = XLSX.utils.json_to_sheet(progressData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Student Progress");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(
      data,
      `student_progress_report_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
    toast.success("Student progress report exported successfully!");
  };

  const generateReports = (reportType: string) => {
    let reportData: any[] = [];
    let fileName = "";
    let sheetName = "";

    switch (reportType) {
      case "enrollment":
        const enrollmentByInstitution = institutions.map((institution) => {
          const institutionStudents = students.filter(
            (s) => s.institution === institution,
          );
          return {
            Institution: institution,
            "Total Students": institutionStudents.length,
            Active: institutionStudents.filter((s) => s.status === "active")
              .length,
            Inactive: institutionStudents.filter((s) => s.status === "inactive")
              .length,
            Graduated: institutionStudents.filter(
              (s) => s.status === "graduated",
            ).length,
            "Programs Offered": getAvailablePrograms(institution).length,
          };
        });
        reportData = enrollmentByInstitution;
        fileName = "enrollment_report";
        sheetName = "Enrollment by Institution";
        break;

      case "program":
        const programStats = programs.map((program) => {
          const programStudents = students.filter((s) => s.program === program);
          return {
            Program: program,
            "Total Students": programStudents.length,
            "Year 1": programStudents.filter((s) => s.year === 1).length,
            "Year 2": programStudents.filter((s) => s.year === 2).length,
            "Year 3": programStudents.filter((s) => s.year === 3).length,
            "Year 4": programStudents.filter((s) => s.year === 4).length,
            Active: programStudents.filter((s) => s.status === "active").length,
          };
        });
        reportData = programStats;
        fileName = "program_report";
        sheetName = "Program Statistics";
        break;

      case "detailed":
        reportData = students.map((student) => ({
          Name: student.name,
          Email: student.email,
          "Roll Number": student.rollNumber,
          Institution: student.institution,
          Program: student.program,
          Year: student.year,
          Semester: student.semester,
          Status: student.status,
          "Enrollment Date": new Date(
            2020 + student.year,
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28),
          ).toLocaleDateString(),
          Contact: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          Address: `${Math.floor(Math.random() * 999) + 1} Main St, City, State`,
        }));
        fileName = "detailed_student_report";
        sheetName = "Detailed Student Info";
        break;
    }

    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, `${fileName}_${new Date().toISOString().split("T")[0]}.xlsx`);
    toast.success(`${sheetName} exported successfully!`);
  };

  // Excel Import Functions
  const handleFileImport = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        setImportProgress("Processing file...");

        let jsonData: any[];

        if (file.name.endsWith(".json")) {
          // Handle JSON import
          const text = e.target?.result as string;
          jsonData = JSON.parse(text);
        } else {
          // Handle Excel import
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];
        }

        const importedStudents = jsonData
          .map((row) => ({
            name: row["Name"] || row["name"] || "",
            email: row["Email"] || row["email"] || "",
            rollNumber:
              row["Roll Number"] ||
              row["rollNumber"] ||
              row["roll_number"] ||
              "",
            institution: row["Institution"] || row["institution"] || "",
            program: row["Program"] || row["program"] || "",
            year: Number(row["Year"] || row["year"]) || 1,
            semester: Number(row["Semester"] || row["semester"]) || 1,
            status: (row["Status"] || row["status"] || "active") as
              | "active"
              | "inactive"
              | "graduated",
          }))
          .filter((student) => student.name && student.email); // Filter out invalid entries

        setImportProgress(`Importing ${importedStudents.length} students...`);

        await apiBulkImport(importedStudents);
        setImportProgress(
          `Successfully imported ${importedStudents.length} students`,
        );
      } catch (error) {
        toast.error("Error importing file. Please check the file format.");
        setImportProgress("Import failed. Please check file format.");
      }
    };

    if (file.name.endsWith(".json")) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        Name: "Manikandan",
        Email: "mani.selvan@example.com",
        "Roll Number": "CS2024001",
        Institution: "MIT",
        Program: "Computer Science",
        Year: 1,
        Semester: 1,
        Status: "active",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Student Template");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "student_import_template.xlsx");
    toast.success("Template downloaded successfully!");
  };

  // Get institution display name based on user's institution code
  const getInstitutionDisplayName = (user: any) => {
    const institutionNameMap = {
      '102': 'Institution of Printing Technology',
      '110': 'Government Polytechnic College, Krishnagiri',
      '214': 'E I T Polytecnic College',
      '215': 'Sakthi Polytechnic College'
    };

    return institutionNameMap[user?.institutionCode as keyof typeof institutionNameMap] || user?.institution || 'Unknown Institution';
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            {user?.role === 'faculty'
              ? 'View and export student information from your department'
              : 'Manage student information, enrollment, and academic records'
            }
          </p>
          {user && (
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {user.role === 'student' && `Viewing: Your personal data`}
                {user.role === 'faculty' && `Viewing: Students from your department (${user.department})`}
                {user.role === 'principal' && `Viewing: Students from your institution`}
                {user.role === 'admin' && `Viewing: ${getInstitutionDisplayName(user)} students`}
                {user.role === 'super-admin' && `Viewing: All students (${students.length} total)`}
              </Badge>
              {user.institutionCode && user.role !== 'super-admin' && (
                <Badge variant="secondary" className="text-xs ml-2">
                  Code: {user.institutionCode}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs ml-2">
                {students.length} students found
              </Badge>
              {user.role === 'faculty' && (
                <Badge variant="secondary" className="text-xs ml-2">
                  📖 Read-only access
                </Badge>
              )}
              {error && (
                <Badge variant="destructive" className="text-xs ml-2">
                  ⚠️ Using fallback data
                </Badge>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportToExcel}>
                <Download className="mr-2 h-4 w-4" />
                Export to Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToJSON}>
                <Download className="mr-2 h-4 w-4" />
                Export to JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {user?.role !== 'faculty' && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={downloadTemplate}>
                <Download className="mr-2 h-4 w-4" />
                Template
              </Button>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.json"
                  onChange={handleFileImport}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <span className="ml-2 text-sm text-green-600">
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card className="">
        <CardHeader>
          <CardTitle>Student Directory</CardTitle>
          <CardDescription>
            {user?.role === 'super-admin'
              ? 'Search and filter students by program, status, institution, and other criteria'
              : 'Search and filter students by program and status'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Show:</label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">per page</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {user?.role === 'super-admin' && (
              <Select
                value={selectedInstitution}
                onValueChange={setSelectedInstitution}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Institution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Institutions</SelectItem>
                  {institutions.map((institution) => (
                    <SelectItem key={institution} value={institution}>
                      {institution}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {user?.role === 'super-admin' && (
              <Select
                value={selectedEducationalAuthority}
                onValueChange={setSelectedEducationalAuthority}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Educational Authority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Authorities</SelectItem>
                  {educationalAuthorities.map((authority) => (
                    <SelectItem key={authority} value={authority}>
                      {authority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                {programs.map((program) => (
                  <SelectItem key={program} value={program}>
                    {program}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map((status) => (
                  <SelectItem
                    key={status}
                    value={status}
                    className="capitalize"
                  >
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Students Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Educational Authority</TableHead>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Year/Semester</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback>
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {student.institution}
                    </TableCell>
                    <TableCell className="text-sm">
                      <Badge variant="outline">
                        {student.educationalAuthority || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {student.rollNumber}
                    </TableCell>
                    <TableCell>{student.program}</TableCell>
                    <TableCell>
                      Year {student.year}, Sem {student.semester}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusColor(student.status)}
                        variant="secondary"
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu
                        open={openDropdownId === student.id}
                        onOpenChange={(open) => setOpenDropdownId(open ? student.id : null)}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/academics/students/${student.id}`);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {user?.role !== 'faculty' && (
                            <>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/academics/students/${student.id}/edit`);
                                }}
                              >
                                <Edit3 className="mr-2 h-4 w-4" />
                                Edit Student
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/academics/students/${student.id}/email`);
                                }}
                              >
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`Are you sure you want to remove ${student.name} from the system? This action cannot be undone.`)) {
                                    handleDeleteStudent(student.id);
                                  }
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove Student
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            showPageInfo={true}
            pageSize={pageSize}
            totalItems={totalItems}
          />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className={`grid grid-cols-1 gap-6 ${user?.role === 'faculty' ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
        {user?.role !== 'faculty' && (
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <UserPlus className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="font-semibold mb-2">Bulk Enrollment</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload Excel or JSON file to enroll multiple students at once
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={downloadTemplate}>
                  Download Template
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload File
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h3 className="font-semibold mb-2">Student Progress</h3>
            <p className="text-sm text-muted-foreground mb-4">
              View detailed academic progress and performance reports
            </p>
            <Button onClick={exportStudentProgress} size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Progress
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Download className="h-12 w-12 mx-auto mb-4 text-purple-600" />
            <h3 className="font-semibold mb-2">Generate Reports</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create detailed student reports and analytics
            </p>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => generateReports("enrollment")}
                size="sm"
                variant="outline"
              >
                Enrollment Report
              </Button>
              <Button
                onClick={() => generateReports("program")}
                size="sm"
                variant="outline"
              >
                Program Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading students...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}
    </div>
  );
}
