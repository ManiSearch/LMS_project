// Shared service to provide academics course data
// This data is duplicated from CoursesAcademic.tsx to ensure consistency

interface Unit {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  isPublished: boolean;
  topics: any[];
  createdBy: string;
  createdDate: string;
  lastModified: string;
}

export interface AcademicsCourse {
  id: string;
  name: string;
  code: string;
  category: string;
  subcategory: string;
  type: "Mandatory" | "Elective";
  credits: number;
  learningHours: number;
  practicalHours: number;
  startDate: string;
  endDate: string;
  description: string;
  outcomes: string[];
  department: string;
  assignedDepartments: string[];
  assignedFaculty: string[];
  assignedHODs: string[];
  visibility: "Active" | "Inactive";
  status: "Draft" | "Active" | "Published" | "Completed" | "Archived";
  students: number;
  completion: number;
  rating: number | null;
  enrolled: number;
  maxCapacity: number;
  prerequisites: string[];
  badges: string[];
  certificates: string[];
  enrollmentMode: "manual" | "self" | "api" | "bulk";
  proctoring: boolean;
  adaptiveLearning: boolean;
  virtualClassroom: boolean;
  collaborationTools: string[];
  contentTypes: string[];
  assignments: number;
  assessments: number;
  discussions: number;
  lessonPlans: number;
  gamificationEnabled: boolean;
  certificatesGenerated: number;
  notifications: string[];
  integrations: string[];
  units: Unit[];
  canEdit?: boolean;
  canDelete?: boolean;
  createdBy: string;
  createdDate: string;
  lastModified: string;
}

// Academics course data - this should match the data from CoursesAcademic.tsx
export const academicsCoursesData: AcademicsCourse[] = [
  {
    id: "1",
    name: "Digital Logic Design",
    code: "1052233110",
    category: "Computer Engineering",
    subcategory: "Digital Systems",
    type: "Mandatory",
    credits: 3,
    learningHours: 45,
    practicalHours: 0,
    startDate: "2024-01-15",
    endDate: "2024-05-15",
    description:
      "This subject introduces students to the fundamental concepts and techniques for designing and analyzing digital circuits, covering number systems, Boolean algebra, combinational and sequential circuits, digital interfacing, memory, and programmable logic devices.",
    outcomes: [
      "Explain number systems, logic gates, Boolean algebra, combinational and sequential circuits, interfacing, memory, and data converters",
      "Apply digital logic concepts to solve engineering problems involving circuits, ADC/DAC, memory, and interfacing",
      "Analyze combinational and sequential circuits using truth tables, Boolean algebra, and Karnaugh maps",
    ],
    department: "Computer Engineering",
    assignedDepartments: [
      "Computer Engineering",
      "Computer Engineering",
    ],
    assignedFaculty: ["BALAMURUGAN"],
    assignedHODs: ["To be Assigned"],
    visibility: "Active",
    status: "Active",
    students: 0,
    completion: 0,
    rating: null,
    enrolled: 0,
    maxCapacity: 60,
    prerequisites: [],
    badges: [
      "Digital Circuit Designer",
      "Logic Simplifier",
      "Memory Architect",
    ],
    certificates: ["Digital Logic Design Certificate"],
    enrollmentMode: "manual",
    proctoring: false,
    adaptiveLearning: false,
    virtualClassroom: true,
    collaborationTools: [
      "Discussion Forums",
      "Seminars",
      "Problem-Solving Sessions",
      "Group Projects",
    ],
    contentTypes: ["Lectures", "Case Studies", "Seminars", "Design Projects"],
    assignments: 3,
    assessments: 4,
    discussions: 5,
    lessonPlans: 5,
    gamificationEnabled: false,
    certificatesGenerated: 0,
    notifications: ["Email", "In-App"],
    integrations: ["None"],
    units: [
      {
        id: "U201",
        courseId: "1",
        title: "Foundations of Digital Logic",
        description:
          "Number systems, binary arithmetic, code standards, logic gates, universal gate realization.",
        order: 1,
        duration: 9,
        isPublished: true,
        createdBy: "Faculty",
        createdDate: "2024-01-15",
        lastModified: "2024-01-15",
        topics: [],
      },
      {
        id: "U202",
        courseId: "1",
        title: "Combinational Logic Design",
        description:
          "Boolean algebra, K-map simplification, adders, subtractors, comparators, MUX, DEMUX, encoders.",
        order: 2,
        duration: 9,
        isPublished: true,
        createdBy: "Faculty",
        createdDate: "2024-01-15",
        lastModified: "2024-01-15",
        topics: [],
      },
      {
        id: "U203",
        courseId: "1",
        title: "Sequential Logic Design",
        description:
          "Flip-flops, registers, converters, counters and applications.",
        order: 3,
        duration: 9,
        isPublished: true,
        createdBy: "Faculty",
        createdDate: "2024-01-15",
        lastModified: "2024-01-15",
        topics: [],
      },
      {
        id: "U204",
        courseId: "1",
        title: "Digital Interfacing, ADC and DAC",
        description:
          "Digital interfacing concepts, sensor types, TTL/CMOS interface, ADC and DAC techniques.",
        order: 4,
        duration: 9,
        isPublished: true,
        createdBy: "Faculty",
        createdDate: "2024-01-15",
        lastModified: "2024-01-15",
        topics: [],
      },
      {
        id: "U205",
        courseId: "1",
        title: "Memories and Programmable Logic Devices",
        description:
          "ROM, RAM, flash, NVRAM, memory hierarchy, storage devices, PLA architecture.",
        order: 5,
        duration: 9,
        isPublished: true,
        createdBy: "Faculty",
        createdDate: "2024-01-15",
        lastModified: "2024-01-15",
        topics: [],
      },
    ],
    canEdit: true,
    canDelete: true,
    createdBy: "Faculty",
    createdDate: "2024-01-10",
    lastModified: "2024-01-15",
  },
  {
    id: "2",
    name: "C Programming",
    code: "1052233440",
    category: "Computer Engineering",
    subcategory: "Programming Fundamentals",
    type: "Mandatory",
    credits: 3,
    learningHours: 75,
    practicalHours: 60,
    startDate: "2024-01-15",
    endDate: "2024-05-15",
    description:
      "This course introduces students to the fundamentals of C programming, covering tokens, variables, data types, control structures, arrays, functions, pointers, structures, and file concepts. Students gain hands-on experience to write efficient programs and solve computational problems.",
    outcomes: [
      "Apply C programming constructs to solve computational problems involving I/O, control structures, arrays, functions, strings, and pointers",
      "Analyze program logic and develop modular solutions using user-defined functions, recursion, and structured programming principles",
      "Design and implement structured C programs with proper use of data structures, file handling, and memory management",
      "Use IDEs or modern compilers/debuggers to write, test, and debug C programs effectively",
      "Collaborate in teams to develop mini-projects demonstrating problem-solving, documentation, and communication skills",
    ],
    department: "Computer Engineering",
    assignedDepartments: [
      "Computer Science and Engineering",
      "Information Technology",
    ],
    assignedFaculty: ["BALAMURUGAN"],
    assignedHODs: ["To be Assigned"],
    visibility: "Active",
    status: "Active",
    students: 0,
    completion: 0,
    rating: null,
    enrolled: 0,
    maxCapacity: 60,
    prerequisites: [],
    badges: ["C Programmer", "Problem Solver", "Code Debugger"],
    certificates: ["C Programming Certificate"],
    enrollmentMode: "manual",
    proctoring: false,
    adaptiveLearning: false,
    virtualClassroom: true,
    collaborationTools: [
      "Discussion Forums",
      "Programming Assignments",
      "Quizzes",
      "Mini Projects",
    ],
    contentTypes: [
      "Lectures",
      "Hands-on Exercises",
      "Practical Tests",
      "Mini Projects",
    ],
    assignments: 4,
    assessments: 5,
    discussions: 6,
    lessonPlans: 5,
    gamificationEnabled: false,
    certificatesGenerated: 0,
    notifications: ["Email", "In-App"],
    integrations: ["None"],
    units: [
      {
        id: "U301",
        courseId: "2",
        title: "Introduction to C",
        description:
          "Overview of C, compiling and executing, tokens, variables, data types, operators, input/output.",
        order: 1,
        duration: 15,
        isPublished: true,
        createdBy: "Faculty",
        createdDate: "2024-01-15",
        lastModified: "2024-01-15",
        topics: [],
      },
      {
        id: "U302",
        courseId: "2",
        title: "Control Structures and Looping",
        description:
          "Decision making (if, switch), looping (while, for, do-while), break, continue, goto.",
        order: 2,
        duration: 15,
        isPublished: true,
        createdBy: "Faculty",
        createdDate: "2024-01-15",
        lastModified: "2024-01-15",
        topics: [],
      },
      {
        id: "U303",
        courseId: "2",
        title: "Arrays and Functions",
        description:
          "Arrays (single, multi-dimensional), user-defined functions, scope, recursion.",
        order: 3,
        duration: 15,
        isPublished: true,
        createdBy: "Faculty",
        createdDate: "2024-01-15",
        lastModified: "2024-01-15",
        topics: [],
      },
      {
        id: "U304",
        courseId: "2",
        title: "Pointers and Structures",
        description:
          "Pointers, pointer arithmetic, structures, unions, file handling.",
        order: 4,
        duration: 15,
        isPublished: true,
        createdBy: "Faculty",
        createdDate: "2024-01-15",
        lastModified: "2024-01-15",
        topics: [],
      },
      {
        id: "U305",
        courseId: "2",
        title: "Advanced Concepts",
        description:
          "Dynamic memory allocation, file operations, preprocessor directives.",
        order: 5,
        duration: 15,
        isPublished: true,
        createdBy: "Faculty",
        createdDate: "2024-01-15",
        lastModified: "2024-01-15",
        topics: [],
      },
    ],
    canEdit: true,
    canDelete: true,
    createdBy: "Faculty",
    createdDate: "2024-01-10",
    lastModified: "2024-01-15",
  },
  {
    id: "3",
    name: "Engineering Graphics",
    code: "1052233350",
    category: "Computer Engineering",
    subcategory: "Engineering Design",
    type: "Mandatory",
    credits: 3,
    learningHours: 45,
    practicalHours: 60,
    startDate: "2024-01-15",
    endDate: "2024-05-15",
    description:
      "This course covers the fundamentals of engineering graphics, including geometrical drawing, projections, views, sectional views, and computer-aided design (CAD) applications.",
    outcomes: [
      "Apply engineering graphics principles to create technical drawings",
      "Analyze geometric constructions and projection methods",
      "Design detailed drawings using CAD software",
    ],
    department: "Computer Engineering",
    assignedDepartments: [
      "Mechanical Engineering",
      "Computer Engineering",
    ],
    assignedFaculty: ["BALAMURUGAN"],
    assignedHODs: ["To be Assigned"],
    visibility: "Active",
    status: "Active",
    students: 0,
    completion: 0,
    rating: null,
    enrolled: 0,
    maxCapacity: 60,
    prerequisites: [],
    badges: ["CAD Designer", "Technical Draftsman", "3D Modeler"],
    certificates: ["Engineering Graphics Certificate"],
    enrollmentMode: "manual",
    proctoring: false,
    adaptiveLearning: false,
    virtualClassroom: true,
    collaborationTools: [
      "Design Forums",
      "CAD Projects",
      "Peer Reviews",
      "Technical Presentations",
    ],
    contentTypes: [
      "Lectures",
      "CAD Tutorials",
      "Practical Sessions",
      "Design Projects",
    ],
    assignments: 5,
    assessments: 4,
    discussions: 3,
    lessonPlans: 5,
    gamificationEnabled: false,
    certificatesGenerated: 0,
    notifications: ["Email", "In-App"],
    integrations: ["AutoCAD", "SolidWorks"],
    units: [
      {
        id: "U401",
        courseId: "3",
        title: "Introduction to Engineering Graphics",
        description:
          "Basic principles of engineering graphics, drawing instruments, lettering.",
        order: 1,
        duration: 9,
        isPublished: true,
        createdBy: "Faculty",
        createdDate: "2024-01-15",
        lastModified: "2024-01-15",
        topics: [],
      },
      {
        id: "U402",
        courseId: "3",
        title: "Geometric Constructions",
        description:
          "Lines, angles, polygons, circles, ellipses, parabolas, hyperbolas.",
        order: 2,
        duration: 9,
        isPublished: true,
        createdBy: "Faculty",
        createdDate: "2024-01-15",
        lastModified: "2024-01-15",
        topics: [],
      },
      {
        id: "U403",
        courseId: "3",
        title: "Orthographic Projections",
        description:
          "Principal planes, projection of points, lines, and planes.",
        order: 3,
        duration: 9,
        isPublished: true,
        createdBy: "Faculty",
        createdDate: "2024-01-15",
        lastModified: "2024-01-15",
        topics: [],
      },
      {
        id: "U404",
        courseId: "3",
        title: "Sectional Views and Development",
        description:
          "Sectional views, auxiliary views, development of surfaces.",
        order: 4,
        duration: 9,
        isPublished: true,
        createdBy: "Faculty",
        createdDate: "2024-01-15",
        lastModified: "2024-01-15",
        topics: [],
      },
      {
        id: "U405",
        courseId: "3",
        title: "Computer-Aided Design",
        description:
          "Introduction to CAD, 2D and 3D modeling, rendering techniques.",
        order: 5,
        duration: 9,
        isPublished: true,
        createdBy: "Faculty",
        createdDate: "2024-01-15",
        lastModified: "2024-01-15",
        topics: [],
      },
    ],
    canEdit: true,
    canDelete: true,
    createdBy: "Faculty",
    createdDate: "2024-01-10",
    lastModified: "2024-01-15",
  },
  {
    id: "4",
    name: "Engineering Mathematics II",
    code: "1052233220",
    category: "Computer Engineering",
    subcategory: "Mathematics",
    type: "Mandatory",
    credits: 4,
    learningHours: 60,
    practicalHours: 0,
    startDate: "2024-01-15",
    endDate: "2024-05-15",
    description:
      "This course covers advanced mathematical concepts including differential equations, Fourier series, Laplace transforms, and vector calculus essential for engineering applications.",
    outcomes: [
      "Apply differential equations to solve engineering problems",
      "Analyze periodic functions using Fourier series",
      "Use Laplace transforms in circuit analysis and control systems",
      "Apply vector calculus in electromagnetic field theory",
    ],
    department: "Computer Engineering",
    assignedDepartments: [
      "Computer Engineering",
      "Electronics Engineering",
      "Electrical Engineering",
    ],
    assignedFaculty: ["BALAMURUGAN"],
    assignedHODs: ["To be Assigned"],
    visibility: "Active",
    status: "Active",
    students: 0,
    completion: 0,
    rating: null,
    enrolled: 0,
    maxCapacity: 60,
    prerequisites: ["Engineering Mathematics I"],
    badges: ["Mathematical Modeler", "Problem Solver", "Analytical Thinker"],
    certificates: ["Engineering Mathematics II Certificate"],
    enrollmentMode: "manual",
    proctoring: true,
    adaptiveLearning: true,
    virtualClassroom: true,
    collaborationTools: [
      "Math Forums",
      "Problem Solving Sessions",
      "Peer Tutoring",
      "Study Groups",
    ],
    contentTypes: [
      "Lectures",
      "Mathematical Software",
      "Problem Sets",
      "Case Studies",
    ],
    assignments: 6,
    assessments: 4,
    discussions: 4,
    lessonPlans: 5,
    gamificationEnabled: true,
    certificatesGenerated: 0,
    notifications: ["Email", "In-App"],
    integrations: ["MATLAB", "Mathematica"],
    units: [
      {
        id: "U501",
        courseId: "4",
        title: "Differential Equations",
        description:
          "First and second order differential equations, applications in engineering.",
        order: 1,
        duration: 12,
        isPublished: true,
        createdBy: "Faculty",
        createdDate: "2024-01-15",
        lastModified: "2024-01-15",
        topics: [],
      },
      {
        id: "U502",
        courseId: "4",
        title: "Fourier Series and Transforms",
        description:
          "Fourier series, half range series, Fourier transforms, applications.",
        order: 2,
        duration: 12,
        isPublished: true,
        createdBy: "Faculty",
        createdDate: "2024-01-15",
        lastModified: "2024-01-15",
        topics: [],
      },
      {
        id: "U503",
        courseId: "4",
        title: "Laplace Transforms",
        description:
          "Laplace transforms, inverse transforms, applications to differential equations.",
        order: 3,
        duration: 12,
        isPublished: true,
        createdBy: "Faculty",
        createdDate: "2024-01-15",
        lastModified: "2024-01-15",
        topics: [],
      },
      {
        id: "U504",
        courseId: "4",
        title: "Vector Calculus",
        description:
          "Vector operations, line and surface integrals, Green's theorem, Stokes' theorem.",
        order: 4,
        duration: 12,
        isPublished: true,
        createdBy: "Faculty",
        createdDate: "2024-01-15",
        lastModified: "2024-01-15",
        topics: [],
      },
      {
        id: "U505",
        courseId: "4",
        title: "Complex Analysis",
        description:
          "Complex numbers, analytic functions, contour integration, residue theorem.",
        order: 5,
        duration: 12,
        isPublished: true,
        createdBy: "Faculty",
        createdDate: "2024-01-15",
        lastModified: "2024-01-15",
        topics: [],
      },
    ],
    canEdit: true,
    canDelete: true,
    createdBy: "Faculty",
    createdDate: "2024-01-10",
    lastModified: "2024-01-15",
  },
];

// Function to get courses for a specific faculty member
export const getCoursesForFaculty = (facultyName: string): AcademicsCourse[] => {
  return academicsCoursesData.filter(course => 
    course.assignedFaculty.includes(facultyName)
  );
};

// Function to get course by ID
export const getCourseById = (courseId: string): AcademicsCourse | undefined => {
  return academicsCoursesData.find(course => course.id === courseId);
};
