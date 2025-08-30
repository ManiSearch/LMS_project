import { UserRole } from "@/contexts/AuthContext";

export interface FilteredDataContext {
  userId: string;
  role: UserRole;
  institution?: string;
  institutionId?: string;
  institutionCode?: string;
  department?: string;
  studentId?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  institution: string;
  institutionId?: string;
  institutionCode?: string;
  program: string;
  year: number;
  semester: number;
  status: "active" | "inactive" | "graduated";
  avatar?: string;
  parentId?: string;
  department: string;
  facultyAdvisor?: string;
  assignedFaculty?: string[];
  grades?: Grade[];
  enrolledSubjects?: string[];
  educationalAuthority:
    | "DOTE"
    | "DOCE"
    | "ANNA UNIVERSITY"
    | "BHARATHIAR UNIVERSITY";
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  institution: string;
  institutionId?: string;
  institutionCode?: string;
  subjects: string[];
  assignedStudents?: string[];
  assignedCourses?: string[];
  avatar?: string;
  role: "faculty" | "hod" | "assistant_professor" | "professor";
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  hours: number;
  department: string;
  institution: string;
  institutionId?: string;
  institutionCode?: string;
  faculty: string;
  enrolledStudents: string[];
  semester: number;
  year: number;
  description: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  hours: number;
  department: string;
  institution: string;
  institutionId?: string;
  institutionCode?: string;
  faculty: string;
  students: number;
  enrolledStudents: string[];
  description: string;
  semester: number;
  year: number;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  courseId?: string;
  facultyId: string;
  examType: "midterm" | "final" | "assignment" | "quiz";
  marks: number;
  totalMarks: number;
  grade: string;
  semester: number;
  year: number;
  institution: string;
  institutionId?: string;
  institutionCode?: string;
}

// Mock data for testing with new institution structure
export const mockStudents: Student[] = [
  // Hindustan Institute of Technology and Science Students
  {
    id: "HINST_STU_001",
    name: "Alex Kumar",
    email: "student@hindustanuniv.ac.in",
    rollNumber: "HINST2024001",
    institution: "INST1001",
    institutionId: "INST1001",
    institutionCode: "TN068",
    program: "Computer Science",
    year: 2024,
    semester: 1,
    status: "active",
    department: "Computer Science",
    facultyAdvisor: "HINST_FAC_001",
    assignedFaculty: ["HINST_FAC_001"],
    enrolledSubjects: ["sub1", "sub2", "sub3"],
    educationalAuthority: "ANNA UNIVERSITY",
  },
  {
    id: "HINST_STU_002",
    name: "Priya Sharma",
    email: "priya.sharma@hindustanuniv.ac.in",
    rollNumber: "HINST2024002",
    institution: "INST1001",
    institutionId: "INST1001",
    institutionCode: "TN068",
    program: "Mechanical Engineering",
    year: 2024,
    semester: 1,
    status: "active",
    department: "Mechanical Engineering",
    facultyAdvisor: "HINST_FAC_002",
    assignedFaculty: ["HINST_FAC_002"],
    enrolledSubjects: ["sub4", "sub5", "sub6"],
    educationalAuthority: "ANNA UNIVERSITY",
  },

  // Anna University Students
  {
    id: "ANNA_STU_001",
    name: "Rahul Patel",
    email: "student@annauniv.edu",
    rollNumber: "ANNA2024001",
    institution: "INST1002",
    institutionId: "INST1002",
    institutionCode: "TN001",
    program: "Electronics Engineering",
    year: 2024,
    semester: 1,
    status: "active",
    department: "Electronics Engineering",
    facultyAdvisor: "ANNA_FAC_001",
    assignedFaculty: ["ANNA_FAC_001"],
    enrolledSubjects: ["sub7", "sub8", "sub9"],
    educationalAuthority: "ANNA UNIVERSITY",
  },

  // PSG College Students
  {
    id: "PSG_STU_001",
    name: "Li Ming",
    email: "student@psgtech.edu",
    rollNumber: "PSG2024001",
    institution: "INST1004",
    institutionId: "INST1004",
    institutionCode: "TN003",
    program: "Information Technology",
    year: 2024,
    semester: 1,
    status: "active",
    department: "Information Technology",
    facultyAdvisor: "PSG_FAC_001",
    assignedFaculty: ["PSG_FAC_001"],
    enrolledSubjects: ["sub10", "sub11"],
    educationalAuthority: "ANNA UNIVERSITY",
  },

  // Central Polytechnic College Students
  {
    id: "CPC_STU_001",
    name: "Anand Kumar",
    email: "student@iitd.ac.in",
    rollNumber: "CPC2024001",
    institution: "101",
    institutionId: "101",
    institutionCode: "IIT-D",
    program: "Civil Engineering",
    year: 2024,
    semester: 1,
    status: "active",
    department: "Civil Engineering",
    facultyAdvisor: "CPC_FAC_001",
    assignedFaculty: ["CPC_FAC_001"],
    enrolledSubjects: ["sub12", "sub13"],
    educationalAuthority: "ANNA UNIVERSITY",
  },
];

export const mockFaculty: Faculty[] = [
  // Hindustan Institute Faculty
  {
    id: "HINST_FAC_001",
    name: "Prof. Sarah Johnson",
    email: "faculty@hindustanuniv.ac.in",
    department: "Computer Science",
    institution: "INST1001",
    institutionId: "INST1001",
    institutionCode: "TN068",
    subjects: ["sub1", "sub2"],
    assignedStudents: ["HINST_STU_001"],
    assignedCourses: ["course1", "course2"],
    role: "professor",
  },
  {
    id: "HINST_FAC_002",
    name: "Dr. Michael Chen",
    email: "michael.chen@hindustanuniv.ac.in",
    department: "Mechanical Engineering",
    institution: "INST1001",
    institutionId: "INST1001",
    institutionCode: "TN068",
    subjects: ["sub4", "sub5"],
    assignedStudents: ["HINST_STU_002"],
    assignedCourses: ["course4", "course5"],
    role: "assistant_professor",
  },

  // Anna University Faculty
  {
    id: "ANNA_FAC_001",
    name: "Prof. Rajesh Kumar",
    email: "faculty@annauniv.edu",
    department: "Electronics Engineering",
    institution: "INST1002",
    institutionId: "INST1002",
    institutionCode: "TN001",
    subjects: ["sub7", "sub8"],
    assignedStudents: ["ANNA_STU_001"],
    assignedCourses: ["course7", "course8"],
    role: "professor",
  },

  // PSG College Faculty
  {
    id: "PSG_FAC_001",
    name: "Prof. Chen Wei",
    email: "faculty@psgtech.edu",
    department: "Information Technology",
    institution: "INST1004",
    institutionId: "INST1004",
    institutionCode: "TN003",
    subjects: ["sub10", "sub11"],
    assignedStudents: ["PSG_STU_001"],
    assignedCourses: ["course10", "course11"],
    role: "professor",
  },

  // Central Polytechnic College Faculty
  {
    id: "CPC_FAC_001",
    name: "Prof. Kavitha Nair",
    email: "faculty@iitd.ac.in",
    department: "Civil Engineering",
    institution: "101",
    institutionId: "101",
    institutionCode: "IIT-D",
    subjects: ["sub12", "sub13"],
    assignedStudents: ["CPC_STU_001"],
    assignedCourses: ["course12", "course13"],
    role: "professor",
  },
];

export const mockSubjects: Subject[] = [
  {
    id: "sub1",
    name: "Data Structures",
    code: "CS101",
    credits: 4,
    hours: 60,
    department: "Computer Science",
    institution: "INST1001",
    institutionId: "INST1001",
    institutionCode: "TN068",
    faculty: "faculty1",
    enrolledStudents: ["1"],
    semester: 1,
    year: 2024,
    description: "Introduction to data structures and algorithms",
  },
  {
    id: "sub2",
    name: "Programming in C",
    code: "CS102",
    credits: 3,
    hours: 45,
    department: "Computer Science",
    institution: "INST1001",
    institutionId: "INST1001",
    institutionCode: "TN068",
    faculty: "faculty1",
    enrolledStudents: ["1"],
    semester: 1,
    year: 2024,
    description: "Basic programming concepts using C language",
  },
  {
    id: "sub3",
    name: "Database Systems",
    code: "CS103",
    credits: 4,
    hours: 60,
    department: "Computer Science",
    institution: "INST1001",
    institutionId: "INST1001",
    institutionCode: "TN068",
    faculty: "faculty2",
    enrolledStudents: ["1"],
    semester: 1,
    year: 2024,
    description: "Introduction to database design and management",
  },
  {
    id: "sub4",
    name: "Thermodynamics",
    code: "ME101",
    credits: 4,
    hours: 60,
    department: "Mechanical Engineering",
    institution: "INST1001",
    institutionId: "INST1001",
    institutionCode: "TN068",
    faculty: "faculty3",
    enrolledStudents: ["2"],
    semester: 1,
    year: 2024,
    description: "Basic principles of thermodynamics",
  },
  {
    id: "sub5",
    name: "Fluid Mechanics",
    code: "ME102",
    credits: 4,
    hours: 60,
    department: "Mechanical Engineering",
    institution: "INST1001",
    institutionId: "INST1001",
    institutionCode: "TN068",
    faculty: "faculty3",
    enrolledStudents: ["2"],
    semester: 1,
    year: 2024,
    description: "Study of fluid behavior and properties",
  },
  {
    id: "sub6",
    name: "Machine Design",
    code: "ME103",
    credits: 3,
    hours: 45,
    department: "Mechanical Engineering",
    institution: "INST1001",
    institutionId: "INST1001",
    institutionCode: "TN068",
    faculty: "faculty4",
    enrolledStudents: ["2"],
    semester: 1,
    year: 2024,
    description: "Principles of machine component design",
  },
  {
    id: "sub7",
    name: "Circuit Analysis",
    code: "EC101",
    credits: 4,
    hours: 60,
    department: "Electronics Engineering",
    institution: "INST1002",
    institutionId: "INST1002",
    institutionCode: "TN001",
    faculty: "faculty5",
    enrolledStudents: ["3"],
    semester: 1,
    year: 2024,
    description: "Basic electrical circuit analysis",
  },
  {
    id: "sub8",
    name: "Digital Electronics",
    code: "EC102",
    credits: 4,
    hours: 60,
    department: "Electronics Engineering",
    institution: "INST1002",
    institutionId: "INST1002",
    institutionCode: "TN001",
    faculty: "faculty5",
    enrolledStudents: ["3"],
    semester: 1,
    year: 2024,
    description: "Digital logic and circuits",
  },
  {
    id: "sub9",
    name: "Microprocessors",
    code: "EC103",
    credits: 3,
    hours: 45,
    department: "Electronics Engineering",
    institution: "INST1002",
    institutionId: "INST1002",
    institutionCode: "TN001",
    faculty: "faculty6",
    enrolledStudents: ["3"],
    semester: 1,
    year: 2024,
    description: "Introduction to microprocessor architecture",
  },
  {
    id: "sub10",
    name: "Software Engineering",
    code: "CS201",
    credits: 4,
    hours: 60,
    department: "Computer Science",
    institution: "INST1004",
    institutionId: "INST1004",
    institutionCode: "TN003",
    faculty: "faculty7",
    enrolledStudents: ["4"],
    semester: 1,
    year: 2024,
    description: "Software development lifecycle and methodologies",
  },
  {
    id: "sub11",
    name: "Web Technologies",
    code: "CS202",
    credits: 3,
    hours: 45,
    department: "Computer Science",
    institution: "INST1004",
    institutionId: "INST1004",
    institutionCode: "TN003",
    faculty: "faculty7",
    enrolledStudents: ["4"],
    semester: 1,
    year: 2024,
    description: "Modern web development technologies",
  },
];

export const mockGrades: Grade[] = [
  {
    id: "grade1",
    studentId: "1",
    subjectId: "sub1",
    facultyId: "faculty1",
    examType: "midterm",
    marks: 85,
    totalMarks: 100,
    grade: "A",
    semester: 1,
    year: 2024,
    institution: "INST1001",
    institutionId: "INST1001",
    institutionCode: "TN068",
  },
  {
    id: "grade2",
    studentId: "1",
    subjectId: "sub2",
    facultyId: "faculty1",
    examType: "final",
    marks: 92,
    totalMarks: 100,
    grade: "A+",
    semester: 1,
    year: 2024,
    institution: "INST1001",
    institutionId: "INST1001",
    institutionCode: "TN068",
  },
  {
    id: "grade3",
    studentId: "1",
    subjectId: "sub3",
    facultyId: "faculty2",
    examType: "midterm",
    marks: 78,
    totalMarks: 100,
    grade: "B+",
    semester: 1,
    year: 2024,
    institution: "INST1001",
    institutionId: "INST1001",
    institutionCode: "TN068",
  },
  {
    id: "grade4",
    studentId: "2",
    subjectId: "sub4",
    facultyId: "faculty3",
    examType: "final",
    marks: 88,
    totalMarks: 100,
    grade: "A",
    semester: 1,
    year: 2024,
    institution: "INST1001",
    institutionId: "INST1001",
    institutionCode: "TN068",
  },
  {
    id: "grade5",
    studentId: "3",
    subjectId: "sub7",
    facultyId: "faculty5",
    examType: "midterm",
    marks: 81,
    totalMarks: 100,
    grade: "A-",
    semester: 1,
    year: 2024,
    institution: "INST1002",
    institutionId: "INST1002",
    institutionCode: "TN001",
  },
];

export class DataFilterService {
  /**
   * Filter students based on user role and context
   */
  static getFilteredStudents(context: FilteredDataContext): Student[] {
    const {
      role,
      institution,
      institutionId,
      institutionCode,
      department,
      userId,
    } = context;

    switch (role) {
      case "super-admin":
        return mockStudents; // Super admin sees all students

      case "admin":
        return mockStudents; // Admin sees all students

      case "principal":
        // Principal sees only students from their institution
        return mockStudents.filter(
          (student) =>
            student.institutionId === institutionId ||
            student.institution === institution,
        );

      case "faculty":
      case "staff":
        // Faculty sees only their assigned students
        const faculty = mockFaculty.find((f) => f.id === userId);
        if (!faculty) return [];

        return mockStudents.filter(
          (student) =>
            faculty.assignedStudents?.includes(student.id) ||
            student.assignedFaculty?.includes(userId) ||
            (student.department === faculty.department &&
              (student.institutionId === faculty.institutionId ||
                student.institution === faculty.institution)),
        );

      case "student":
        // Student sees only their own data
        return mockStudents.filter((student) => student.id === userId);

      default:
        return [];
    }
  }

  /**
   * Filter faculty based on user role and context
   */
  static getFilteredFaculty(context: FilteredDataContext): Faculty[] {
    const {
      role,
      institution,
      institutionId,
      institutionCode,
      department,
      userId,
    } = context;

    switch (role) {
      case "super-admin":
        return mockFaculty; // Super admin sees all faculty

      case "admin":
        return mockFaculty; // Admin sees all faculty

      case "principal":
        // Principal sees only faculty from their institution
        return mockFaculty.filter(
          (faculty) =>
            faculty.institutionId === institutionId ||
            faculty.institution === institution,
        );

      case "faculty":
      case "staff":
        // Faculty sees other faculty in their department/institution
        return mockFaculty.filter(
          (faculty) =>
            (faculty.institutionId === institutionId ||
              faculty.institution === institution) &&
            (faculty.department === department || faculty.id === userId),
        );

      case "student":
        // Student sees only their assigned faculty
        const student = mockStudents.find((s) => s.id === userId);
        if (!student) return [];

        return mockFaculty.filter(
          (faculty) =>
            student.assignedFaculty?.includes(faculty.id) ||
            faculty.assignedStudents?.includes(userId),
        );

      default:
        return [];
    }
  }

  /**
   * Filter subjects based on user role and context
   */
  static getFilteredSubjects(context: FilteredDataContext): Subject[] {
    const {
      role,
      institution,
      institutionId,
      institutionCode,
      department,
      userId,
    } = context;

    switch (role) {
      case "super-admin":
        return mockSubjects; // Super admin sees all subjects

      case "admin":
        return mockSubjects; // Admin sees all subjects

      case "principal":
        // Principal sees only subjects from their institution
        return mockSubjects.filter(
          (subject) =>
            subject.institutionId === institutionId ||
            subject.institution === institution,
        );

      case "faculty":
      case "staff":
        // Faculty sees only their assigned subjects and subjects in their department
        const faculty = mockFaculty.find((f) => f.id === userId);
        if (!faculty) return [];

        return mockSubjects.filter(
          (subject) =>
            faculty.subjects.includes(subject.id) ||
            (subject.department === faculty.department &&
              (subject.institutionId === faculty.institutionId ||
                subject.institution === faculty.institution)),
        );

      case "student":
        // Student sees only their enrolled subjects
        const student = mockStudents.find((s) => s.id === userId);
        if (!student) return [];

        return mockSubjects.filter((subject) =>
          student.enrolledSubjects?.includes(subject.id),
        );

      default:
        return [];
    }
  }

  /**
   * Filter grades based on user role and context
   */
  static getFilteredGrades(context: FilteredDataContext): Grade[] {
    const {
      role,
      institution,
      institutionId,
      institutionCode,
      department,
      userId,
    } = context;

    switch (role) {
      case "super-admin":
        return mockGrades; // Super admin sees all grades

      case "admin":
        return mockGrades; // Admin sees all grades

      case "principal":
        // Principal sees only grades from their institution
        return mockGrades.filter(
          (grade) =>
            grade.institutionId === institutionId ||
            grade.institution === institution,
        );

      case "faculty":
      case "staff":
        // Faculty sees only grades for their assigned students/subjects
        const faculty = mockFaculty.find((f) => f.id === userId);
        if (!faculty) return [];

        return mockGrades.filter(
          (grade) =>
            grade.facultyId === userId ||
            faculty.assignedStudents?.includes(grade.studentId) ||
            faculty.subjects.includes(grade.subjectId),
        );

      case "student":
        // Student sees only their own grades
        return mockGrades.filter((grade) => grade.studentId === userId);

      default:
        return [];
    }
  }

  /**
   * Get dashboard statistics based on filtered data
   */
  static getDashboardStats(context: FilteredDataContext) {
    const students = this.getFilteredStudents(context);
    const faculty = this.getFilteredFaculty(context);
    const subjects = this.getFilteredSubjects(context);
    const grades = this.getFilteredGrades(context);

    return {
      totalStudents: students.length,
      activeStudents: students.filter((s) => s.status === "active").length,
      totalFaculty: faculty.length,
      totalSubjects: subjects.length,
      totalGrades: grades.length,
      averageGrade:
        grades.length > 0
          ? (
              grades.reduce(
                (sum, g) => sum + (g.marks / g.totalMarks) * 100,
                0,
              ) / grades.length
            ).toFixed(1)
          : "0",
      departmentBreakdown: this.getDepartmentBreakdown(students),
      recentGrades: grades.slice(0, 5),
    };
  }

  private static getDepartmentBreakdown(students: Student[]) {
    const breakdown: Record<string, number> = {};
    students.forEach((student) => {
      breakdown[student.department] = (breakdown[student.department] || 0) + 1;
    });
    return breakdown;
  }
}
