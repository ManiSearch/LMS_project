// Mock data for Educational ERP System

export interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  institution: string;
  program: string;
  year: number;
  semester: number;
  status: "active" | "inactive" | "graduated";
  avatar?: string;
  parentId?: string;
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
  subjects: string[];
  avatar?: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  hours: number;
  department: string;
  faculty: string;
  students: number;
  description: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  date: string;
  duration: number;
  totalMarks: number;
  program: string;
  semester: number;
}

export interface Attendance {
  id: string;
  studentId: string;
  courseId: string;
  date: string;
  status: "present" | "absent" | "late";
}

export const mockStudents: Student[] = [
  {
    id: "S001",
    name: "Manikandan",
    email: "mani.selvam@gmail.com",
    rollNumber: "CS2023001",
    institution: "Coimbatore Arts College",
    program: "Computer Science",
    year: 2,
    semester: 4,
    status: "active",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    parentId: "P001",
    educationalAuthority: "BHARATHIAR UNIVERSITY",
  },
  {
    id: "S002",
    name: "Sowmya Raj",
    email: "sowmya.raj@gmail.com",
    rollNumber: "EE2023005",
    institution: "Anna University - Guindy",
    program: "Electrical Engineering",
    year: 1,
    semester: 2,
    status: "active",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    parentId: "P002",
    educationalAuthority: "ANNA UNIVERSITY",
  },
  {
    id: "S003",
    name: "Praveen Kumar",
    email: "praveen.k@gmail.com",
    rollNumber: "ME2022003",
    institution: "Chennai Institute of Technology",
    program: "Mechanical Engineering",
    year: 3,
    semester: 5,
    status: "active",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    parentId: "P003",
    educationalAuthority: "ANNA UNIVERSITY",
  },
  {
    id: "S004",
    name: "Divya S",
    email: "divya.s@gmail.com",
    rollNumber: "BC2023007",
    institution: "Government Polytechnic College - Madurai",
    program: "Civil Engineering",
    year: 2,
    semester: 3,
    status: "active",
    avatar: "https://randomuser.me/api/portraits/women/82.jpg",
    parentId: "P004",
    educationalAuthority: "DOTE",
  },
  {
    id: "S005",
    name: "Arun Ramesh",
    email: "arun.ramesh@gmail.com",
    rollNumber: "BA2023009",
    institution: "PSG College of Arts and Science",
    program: "Business Administration",
    year: 1,
    semester: 1,
    status: "active",
    avatar: "https://randomuser.me/api/portraits/men/61.jpg",
    parentId: "P005",
    educationalAuthority: "DOCE",
  },
  {
    id: "S006",
    name: "Karthika Devi",
    email: "karthika.devi@gmail.com",
    rollNumber: "IT2023010",
    institution: "Kongu Engineering College",
    program: "Information Technology",
    year: 4,
    semester: 8,
    status: "active",
    avatar: "https://randomuser.me/api/portraits/women/61.jpg",
    parentId: "P006",
    educationalAuthority: "ANNA UNIVERSITY",
  },
  {
    id: "S007",
    name: "Ragul V",
    email: "ragul.v@gmail.com",
    rollNumber: "MECH2022004",
    institution: "Thiagarajar Polytechnic College",
    program: "Mechanical Engineering",
    year: 2,
    semester: 4,
    status: "active",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    parentId: "P007",
    educationalAuthority: "DOTE",
  },
  {
    id: "S008",
    name: "Sangeetha S",
    email: "sangeetha.s@gmail.com",
    rollNumber: "BA2023011",
    institution: "Sri Krishna Arts and Science College",
    program: "Business Administration",
    year: 3,
    semester: 6,
    status: "active",
    avatar: "https://randomuser.me/api/portraits/women/53.jpg",
    parentId: "P008",
    educationalAuthority: "BHARATHIAR UNIVERSITY",
  },
  {
    id: "S009",
    name: "Sundar Raj",
    email: "sundar.raj@gmail.com",
    rollNumber: "CSE2022006",
    institution: "Velammal Engineering College",
    program: "Computer Science",
    year: 2,
    semester: 3,
    status: "active",
    avatar: "https://randomuser.me/api/portraits/men/39.jpg",
    parentId: "P009",
    educationalAuthority: "ANNA UNIVERSITY",
  },
  {
    id: "S010",
    name: "Lavanya M",
    email: "lavanya.m@gmail.com",
    rollNumber: "BCA2023012",
    institution: "Government Arts College – Salem",
    program: "Computer Applications",
    year: 1,
    semester: 2,
    status: "active",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    parentId: "P010",
    educationalAuthority: "DOCE",
  },
  {
    id: "S011",
    name: "Vignesh R",
    email: "vignesh.r@gmail.com",
    rollNumber: "CS2023013",
    institution: "Government Engineering College - Tirunelveli",
    program: "Computer Science",
    year: 2,
    semester: 3,
    status: "active",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    parentId: "P011",
    educationalAuthority: "ANNA UNIVERSITY",
  },
  {
    id: "S012",
    name: "Meena Lakshmi",
    email: "meenalakshmi@gmail.com",
    rollNumber: "BA2023014",
    institution: "Queen Mary’s College - Chennai",
    program: "Economics",
    year: 3,
    semester: 6,
    status: "active",
    avatar: "https://randomuser.me/api/portraits/women/56.jpg",
    parentId: "P012",
    educationalAuthority: "DOCE",
  },
  {
    id: "S013",
    name: "Aravind Krishna",
    email: "aravind.krishna@gmail.com",
    rollNumber: "EEE2023015",
    institution: "PSNA College of Engineering and Technology",
    program: "Electrical and Electronics Engineering",
    year: 4,
    semester: 8,
    status: "active",
    avatar: "https://randomuser.me/api/portraits/men/40.jpg",
    parentId: "P013",
    educationalAuthority: "ANNA UNIVERSITY",
  },
  {
    id: "S014",
    name: "Revathi B",
    email: "revathi.b@gmail.com",
    rollNumber: "BSC2023016",
    institution: "Nehru Arts and Science College",
    program: "Biotechnology",
    year: 1,
    semester: 2,
    status: "active",
    avatar: "https://randomuser.me/api/portraits/women/66.jpg",
    parentId: "P014",
    educationalAuthority: "BHARATHIAR UNIVERSITY",
  },
  {
    id: "S015",
    name: "Dinesh Kumar",
    email: "dinesh.kumar@gmail.com",
    rollNumber: "CIV2023017",
    institution: "Murugappa Polytechnic College",
    program: "Civil Engineering",
    year: 2,
    semester: 4,
    status: "active",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    parentId: "P015",
    educationalAuthority: "DOTE",
  },
  {
    id: "S016",
    name: "Kavitha Raj",
    email: "kavitha.raj@gmail.com",
    rollNumber: "ECE2023018",
    institution: "Government Polytechnic College - Coimbatore",
    program: "Electronics and Communication Engineering",
    year: 3,
    semester: 6,
    status: "active",
    avatar: "https://randomuser.me/api/portraits/women/48.jpg",
    parentId: "P016",
    educationalAuthority: "DOTE",
  },
  {
    id: "S017",
    name: "Pradeep R",
    email: "pradeep.r@gmail.com",
    rollNumber: "CS2023019",
    institution: "PSG College of Technology",
    program: "Computer Science",
    year: 1,
    semester: 2,
    status: "active",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    parentId: "P017",
    educationalAuthority: "ANNA UNIVERSITY",
  },
  {
    id: "S018",
    name: "Divya S",
    email: "divya.s@gmail.com",
    rollNumber: "BSC2023020",
    institution:
      "Avinashilingam Institute for Home Science and Higher Education",
    program: "Physics",
    year: 2,
    semester: 4,
    status: "active",
    avatar: "https://randomuser.me/api/portraits/women/27.jpg",
    parentId: "P018",
    educationalAuthority: "BHARATHIAR UNIVERSITY",
  },
  {
    id: "S019",
    name: "Senthil Kumar",
    email: "senthil.kumar@gmail.com",
    rollNumber: "MECH2023021",
    institution: "Sri Krishna Polytechnic College",
    program: "Mechanical Engineering",
    year: 3,
    semester: 6,
    status: "active",
    avatar: "https://randomuser.me/api/portraits/men/18.jpg",
    parentId: "P019",
    educationalAuthority: "DOTE",
  },
  {
    id: "S020",
    name: "Nivetha Lakshmi",
    email: "nivetha.lakshmi@gmail.com",
    rollNumber: "BBA2023022",
    institution: "Chennai National Arts and Science College",
    program: "Business Administration",
    year: 1,
    semester: 2,
    status: "active",
    avatar: "https://randomuser.me/api/portraits/women/23.jpg",
    parentId: "P020",
    educationalAuthority: "DOCE",
  }
];

export const mockFaculty: Faculty[] = [
  {
    id: "F001",
    name: "Dr. John Smith",
    email: "john.smith@email.com",
    department: "Computer Science",
    subjects: ["Data Structures", "Algorithms", "Programming"],
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "F002",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@email.com",
    department: "Mathematics",
    subjects: ["Calculus", "Linear Algebra", "Statistics"],
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "F003",
    name: "Dr. Michael Brown",
    email: "michael.brown@email.com",
    department: "Physics",
    subjects: ["Quantum Physics", "Thermodynamics", "Mechanics"],
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
];

export const mockCourses: Course[] = [
  {
    id: "C001",
    name: "Introduction to Computer Science",
    code: "CS101",
    credits: 3,
    hours: 45,
    department: "Computer Science",
    faculty: "Dr. John Smith",
    students: 45,
    description: "Basic concepts of computer science and programming",
  },
  {
    id: "C002",
    name: "Advanced Mathematics",
    code: "MATH201",
    credits: 4,
    hours: 60,
    department: "Mathematics",
    faculty: "Dr. Sarah Johnson",
    students: 32,
    description: "Advanced mathematical concepts for engineering",
  },
];

export const mockExams: Exam[] = [
  {
    id: "E001",
    title: "Midterm Examination",
    subject: "Computer Science",
    date: "2024-03-15",
    duration: 180,
    totalMarks: 100,
    program: "Computer Science",
    semester: 2,
  },
  {
    id: "E002",
    title: "Final Examination",
    subject: "Mathematics",
    date: "2024-04-20",
    duration: 180,
    totalMarks: 100,
    program: "Mathematics",
    semester: 2,
  },
];

export const mockStats = {
  totalStudents: 5,
  totalFaculty: 3,
  totalCourses: 2,
  passRate: 95,
};

export const mockAttendanceData = [
  {
    id: "A001",
    studentId: "S001",
    courseId: "C001",
    date: "2024-03-15",
    status: "present" as const,
  },
  {
    id: "A002",
    studentId: "S002",
    courseId: "C001",
    date: "2024-03-15",
    status: "present" as const,
  },
];

export const mockExamResults = [
  {
    id: "R001",
    examId: "E001",
    studentId: "S001",
    marks: 85,
    grade: "A",
  },
  {
    id: "R002",
    examId: "E001",
    studentId: "S002",
    marks: 78,
    grade: "B+",
  },
];
