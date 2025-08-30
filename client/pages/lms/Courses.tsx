import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { PermissionGuard, usePermissions } from "@/components/PermissionGuard";
import { hasModuleAccess } from "@/utils/modulePermissions";
import { hasPermission } from "@/utils/permissions";
import { AuthDebugPanel } from "@/components/DebugLoginButton";
import {
  BookOpen,
  Plus,
  Search,
  Users,
  Calendar,
  Star,
  TrendingUp,
  PlayCircle,
  FileText,
  MoreVertical,
  Edit3,
  Eye,
  Copy,
  Trash2,
  Award,
  BarChart3,
  Filter,
  Upload,
  Download,
  Settings,
  Target,
  Trophy,
  Users2,
  BookOpenCheck,
  Zap,
  AlertTriangle,
  MessageSquare,
  Video,
  Globe,
  Bookmark,
  Clock,
  CheckCircle,
  XCircle,
  UserPlus,
  UserMinus,
  Mail,
  Bell,
  Camera,
  Mic,
  Screen,
  Shield,
  QrCode,
  ArrowLeft,
  FileCheck,
  Brain,
  Gamepad2,
  MessageCircle,
  ThumbsUp,
  Share2,
  Lightbulb,
  GraduationCap,
  PieChart,
  LineChart,
  Activity,
  Notification,
  Speaker,
  Smartphone,
  Wifi,
  Archive,
  Crown,
} from "lucide-react";

interface Course {
  id: string;
  name: string;
  code: string;
  category: string;
  subcategory: string;
  credits: number;
  learningHours: number;
  practicalHours: number;
  department: string;
  faculty: string;
  students: number;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  type: "Mandatory" | "Elective";
  completion: number;
  rating: number;
  outcomes: string[];
  competencyScale: string;
  activities: string[];
  cohorts: string[];
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
}

interface Enrollment {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  enrollmentDate: string;
  status: "pending" | "enrolled" | "completed" | "withdrawn";
  progress: number;
  lastActivity: string;
  grade: string;
  enrollmentType: "manual" | "self" | "api" | "bulk";
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  courses: string[];
  sequencing: "linear" | "adaptive" | "flexible";
  restrictions: string[];
  prerequisites: string[];
  estimatedDuration: number;
}

interface VirtualSession {
  id: string;
  courseId: string;
  title: string;
  platform: "zoom" | "teams" | "meet" | "webex";
  scheduledDate: string;
  duration: number;
  attendees: number;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  recordingAvailable: boolean;
}

interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  maxPoints: number;
  submissions: number;
  plagiarismCheck: boolean;
  autoGrading: boolean;
  status: "active" | "closed" | "draft";
}

interface Assessment {
  id: string;
  courseId: string;
  title: string;
  type: "quiz" | "exam" | "survey" | "assignment";
  questions: number;
  duration: number;
  attempts: number;
  autoGrade: boolean;
  proctored: boolean;
  status: "active" | "closed" | "draft";
}

interface Certificate {
  id: string;
  courseId: string;
  studentId: string;
  template: string;
  issueDate: string;
  qrCode: string;
  verificationUrl: string;
  status: "issued" | "revoked" | "expired";
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: "email" | "sms" | "push" | "in-app";
  trigger: string;
  subject: string;
  content: string;
  active: boolean;
}

const initialCourses: Course[] = [
  // Faculty Teaching Portfolio - 50 Comprehensive Course Datasets
  {
    id: "FC001",
    name: "Digital Logic Design",
    code: "1052233110",
    category: "Computer Engineering",
    subcategory: "Computer Science",
    credits: 3,
    learningHours: 45,
    practicalHours: 15,
    department: "Computer Science",
    faculty: "Dr. A. Kumar",
    students: 40,
    description:
      "Introduces Boolean algebra, combinational and sequential circuits, digital interfacing, memories, and programmable logic devices.",
    status: "Active",
    startDate: "2025-01-15",
    endDate: "2025-05-15",
    type: "Mandatory",
    completion: 0,
    rating: 4.7,
    outcomes: [
      "Understand fundamentals of digital systems",
      "Apply Boolean algebra in circuit simplification",
      "Design combinational and sequential circuits",
      "Implement ADC/DAC converters",
      "Analyze memory and PLDs",
    ],
    competencyScale: "Intermediate",
    activities: [
      "Boolean algebra problem solving",
      "Logic circuit design",
      "K-map simplification",
      "Flip-flop design",
      "Memory analysis",
    ],
    cohorts: ["Diploma CE 2024", "Diploma CE 2025"],
    enrolled: 40,
    maxCapacity: 45,
    prerequisites: ["Basic Mathematics"],
    badges: ["Logic Designer", "Circuit Analyst", "Problem Solver"],
    certificates: ["Digital Logic Design Certificate"],
    enrollmentMode: "manual",
    proctoring: true,
    adaptiveLearning: true,
    virtualClassroom: true,
    collaborationTools: ["Forums", "Project Teams"],
    contentTypes: ["Video Lectures", "Simulations", "Case Studies"],
    assignments: 10,
    assessments: 12,
    discussions: 15,
    lessonPlans: 25,
    gamificationEnabled: true,
    certificatesGenerated: 0,
    notifications: ["Email", "Push"],
    integrations: ["Logisim", "Proteus"],
  },

  {
    id: "FC002",
    name: "C Programming",
    code: "1052233440",
    category: "Computer Engineering",
    subcategory: "Programming",
    credits: 3,
    learningHours: 45,
    practicalHours: 30,
    department: "Computer Science",
    faculty: "Dr. Priya",
    students: 42,
    description:
      "Introduces structured programming concepts using C language including data types, control structures, arrays, functions, pointers, structures, and file management.",
    status: "Active",
    startDate: "2025-01-15",
    endDate: "2025-05-15",
    type: "Mandatory",
    completion: 0,
    rating: 4.8,
    outcomes: [
      "Write basic C programs",
      "Apply arrays, functions, and structures",
      "Use pointers effectively",
      "Implement file operations",
      "Solve computational problems",
    ],
    competencyScale: "Intermediate",
    activities: [
      "Problem solving with C",
      "Array manipulation",
      "Function development",
      "Pointer programming",
      "File handling tasks",
    ],
    cohorts: ["Diploma CE 2024", "Diploma CE 2025"],
    enrolled: 42,
    maxCapacity: 50,
    prerequisites: ["Computer Science Fundamentals"],
    badges: ["C Coder", "Problem Solver"],
    certificates: ["C Programming Certificate"],
    enrollmentMode: "manual",
    proctoring: true,
    adaptiveLearning: true,
    virtualClassroom: true,
    collaborationTools: ["Forums", "Code Collaboration"],
    contentTypes: ["Video Lectures", "Labs", "Assignments"],
    assignments: 12,
    assessments: 15,
    discussions: 10,
    lessonPlans: 20,
    gamificationEnabled: true,
    certificatesGenerated: 0,
    notifications: ["Email", "Push"],
    integrations: ["Turbo C", "Code Blocks"],
  },
  {
    id: "FC003",
    name: "Electric Vehicle Technology",
    code: "EE305",
    category: "Electrical and Electronics Engineering",
    subcategory: "Automotive & Energy Systems",
    credits: 3,
    learningHours: 45,
    practicalHours: 0,
    department: "Electrical and Electronics Engineering",
    faculty: "To be Assigned",
    students: 0,
    description:
      "This course introduces the fundamentals of electric and hybrid vehicle technologies, including vehicle layouts, batteries, charging methods, motors and drives, electronics, hybrid architectures, regenerative braking, and fuel cells. Students gain knowledge of EV systems, safety, and sustainable energy solutions.",
    status: "Active",
    startDate: "2024-01-15",
    endDate: "2024-05-15",
    type: "Mandatory",
    completion: 0,
    rating: null,
    outcomes: [
      "Evaluate electric vehicle architectures, battery technologies, and charging standards",
      "Analyze electric motor drives and hybrid drive trains for performance optimization",
      "Design converters and sensor-less control systems with high-voltage safety protocols",
      "Compare hybrid vehicle layouts and regenerative braking for energy efficiency",
      "Assess fuel cell technologies and analyze societal and environmental impacts of EVs",
    ],
    competencyScale: "Advanced",
    activities: [
      "Case studies on EV technologies",
      "Motor drive simulations",
      "Battery analysis tasks",
      "Converter and inverter experiments",
      "Hybrid vehicle design projects",
    ],
    cohorts: ["B.Tech EEE 2024", "B.Tech EEE 2025"],
    enrolled: 0,
    maxCapacity: 60,
    prerequisites: ["Basics of Science and Engineering"],
    badges: ["EV Analyst", "Hybrid Systems Designer", "Fuel Cell Specialist"],
    certificates: ["Electric Vehicle Technology Certificate"],
    enrollmentMode: "manual",
    proctoring: false,
    adaptiveLearning: false,
    virtualClassroom: true,
    collaborationTools: [
      "Seminars",
      "Quizzes",
      "Mini Projects",
      "Discussion Forums",
    ],
    contentTypes: ["Lectures", "Seminars", "Case Studies", "Mini Projects"],
    assignments: 3,
    assessments: 4,
    discussions: 5,
    lessonPlans: 5,
    gamificationEnabled: false,
    certificatesGenerated: 0,
    notifications: ["Email", "In-App"],
    integrations: ["None"],
  },
  {
    id: "FC004",
    name: "Electronics Devices and Circuits",
    code: "ECE203",
    category: "Electronics and Communication Engineering",
    subcategory: "Analog Electronics",
    credits: 3,
    learningHours: 45,
    practicalHours: 15,
    department: "Electronics and Communication Engineering",
    faculty: "To be Assigned",
    students: 0,
    description:
      "This course introduces electronic devices such as diodes, transistors, and FETs along with their characteristics and applications. It covers biasing, amplifiers, oscillators, feedback circuits, and frequency response analysis for analog electronic systems.",
    status: "Active",
    startDate: "2024-01-15",
    endDate: "2024-05-15",
    type: "Mandatory",
    completion: 0,
    rating: null,
    outcomes: [
      "Understand characteristics and applications of diodes, BJTs, and FETs",
      "Analyze biasing techniques and stability of transistor circuits",
      "Design and evaluate small-signal amplifiers with frequency response",
      "Explain the working of oscillators and feedback amplifiers",
      "Apply analog electronics concepts in real-world circuit design",
    ],
    competencyScale: "Intermediate",
    activities: [
      "Device characteristic experiments",
      "Biasing circuit design",
      "Amplifier simulation and lab testing",
      "Oscillator design projects",
      "Feedback analysis exercises",
    ],
    cohorts: ["B.Tech ECE 2024", "B.Tech ECE 2025"],
    enrolled: 0,
    maxCapacity: 60,
    prerequisites: ["Basic Electrical Engineering", "Physics Fundamentals"],
    badges: [
      "Analog Circuit Designer",
      "Amplifier Expert",
      "Oscillator Builder",
    ],
    certificates: ["Electronics Devices and Circuits Certificate"],
    enrollmentMode: "manual",
    proctoring: false,
    adaptiveLearning: false,
    virtualClassroom: true,
    collaborationTools: [
      "Labs",
      "Assignments",
      "Tutorials",
      "Discussion Forums",
    ],
    contentTypes: ["Lectures", "Lab Sessions", "Case Studies", "Assignments"],
    assignments: 4,
    assessments: 5,
    discussions: 5,
    lessonPlans: 5,
    gamificationEnabled: false,
    certificatesGenerated: 0,
    notifications: ["Email", "In-App"],
    integrations: ["Multisim", "Proteus", "LTSpice"],
  },
];
const courseTypes = ["Mandatory", "Elective"];
const competencyScales = ["Beginner", "Intermediate", "Advanced", "Expert"];
const activityTypes = [
  "Lessons",
  "Assignments",
  "Assessments",
  "Discussion Forum",
  "Virtual Classroom",
  "Chat",
  "Feedback",
  "Attendance",
  "Documents",
  "Videos",
  "Peer Review",
  "Group Projects",
  "Case Studies",
  "Simulations",
];
const enrollmentModes = ["manual", "self", "api", "bulk"];
const collaborationTools = [
  "Discussion Forums",
  "Chat",
  "Peer Review",
  "Study Groups",
  "Blogging",
  "Collaborative Coding",
  "Video Calls",
  "Screen Sharing",
];
const contentTypes = [
  "Video Lectures",
  "Interactive Simulations",
  "Code Examples",
  "SCORM Packages",
  "Case Studies",
  "Jupyter Notebooks",
  "Datasets",
  "Interactive Tools",
  "Research Papers",
];
const integrationOptions = [
  "GitHub",
  "Google Analytics",
  "Moodle",
  "Canvas",
  "Blackboard",
  "Zoom",
  "Teams",
  "Google Meet",
  "Slack",
  "Microsoft 365",
];
const notificationTypes = ["Email", "SMS", "Push", "In-App"];

const categories = [
  "Computer Science",
  "Business",
  "Computer Engineering",
  "Mathematics",
  "Science",
  "Arts",
  "Medicine",
  "Civil Engineering",
  "Architecture",
  "Animation & Graphics",
  "Mechanical Engineering",
];

const subcategories = [
  "Programming",
  "Marketing",
  "Artificial Intelligence",
  "Data Science",
  "Web Development",
  "Mobile Development",
  "Cybersecurity",
  "Civil Engineering",
  "Architectural Design",
  "3D Animation",
  "HVAC Systems and Thermal Energy Applications",
];

export default function Courses() {
  const { user } = useAuth();

  // Debug logging for troubleshooting (keeping minimal logging)
  console.log("🔍 Courses Component Loaded:", {
    userRole: user?.role,
    userName: user?.name,
    department: user?.department,
    institutionCode: user?.institutionCode,
    baseUrl: typeof window !== "undefined" ? window.location.origin : "SSR",
    pathname: typeof window !== "undefined" ? window.location.pathname : "SSR",
    timestamp: new Date().toISOString(),
  });
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();

  // Add states for faculty and student data
  const [faculty, setFaculty] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLoadError, setDataLoadError] = useState<string | null>(null);

  // Add state for different views
  const [currentView, setCurrentView] = useState<'courses' | 'learning' | 'discussion' | 'lesson'>('courses');
  const [selectedCourseForView, setSelectedCourseForView] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [lessonMode, setLessonMode] = useState<'continue' | 'review'>('continue');

  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => {
    // Role-specific enrollment data to demonstrate different access levels
    switch (user?.role) {
      case "student":
        return [
          {
            id: "E001",
            courseId: "C001",
            studentId: user?.id || "student-1",
            studentName: user?.name || "Student User",
            enrollmentDate: "2024-01-15",
            status: "enrolled",
            progress: 75,
            lastActivity: new Date().toISOString(),
            grade: "A-",
            enrollmentType: "self",
          },
          {
            id: "E002",
            courseId: "C002",
            studentId: user?.id || "student-1",
            studentName: user?.name || "Student User",
            enrollmentDate: "2024-02-01",
            status: "enrolled",
            progress: 60,
            lastActivity: new Date().toISOString(),
            grade: "B+",
            enrollmentType: "self",
          },
          {
            id: "E003",
            courseId: "C004",
            studentId: user?.id || "student-1",
            studentName: user?.name || "Student User",
            enrollmentDate: "2024-01-10",
            status: "completed",
            progress: 100,
            lastActivity: "2024-01-20T10:30:00Z",
            grade: "A",
            enrollmentType: "self",
          },
        ];

      case "faculty":
      case "hod":
        return [
          // Faculty can see all enrollments for courses they teach
          {
            id: "E001",
            courseId: "C001",
            studentId: "S001",
            studentName: "Dinesh",
            enrollmentDate: "2024-01-15",
            status: "enrolled",
            progress: 75,
            lastActivity: new Date().toISOString(),
            grade: "A-",
            enrollmentType: "manual",
          },
          {
            id: "E002",
            courseId: "C001",
            studentId: "S002",
            studentName: "Kumar",
            enrollmentDate: "2024-01-16",
            status: "enrolled",
            progress: 82,
            lastActivity: new Date().toISOString(),
            grade: "A",
            enrollmentType: "manual",
          },
          {
            id: "E003",
            courseId: "C002",
            studentId: "S003",
            studentName: "Joshua",
            enrollmentDate: "2024-02-01",
            status: "enrolled",
            progress: 45,
            lastActivity: new Date().toISOString(),
            grade: "B",
            enrollmentType: "self",
          },
          {
            id: "E004",
            courseId: "C003",
            studentId: "S004",
            studentName: "Sarasvathi",
            enrollmentDate: "2024-01-20",
            status: "completed",
            progress: 100,
            lastActivity: "2024-01-25T14:20:00Z",
            grade: "A+",
            enrollmentType: "api",
          },
          {
            id: "E005",
            courseId: "C001",
            studentId: "S005",
            studentName: "Divya",
            enrollmentDate: "2024-01-18",
            status: "withdrawn",
            progress: 25,
            lastActivity: "2024-01-22T09:15:00Z",
            grade: "F",
            enrollmentType: "manual",
          },
        ];

      case "staff":
        return [
          // Staff has limited view - only enrolled courses they can monitor
          {
            id: "E001",
            courseId: "C002",
            studentId: user?.id || "staff-1",
            studentName: user?.name || "Staff User",
            enrollmentDate: "2024-02-01",
            status: "enrolled",
            progress: 30,
            lastActivity: new Date().toISOString(),
            grade: "B",
            enrollmentType: "manual",
          },
        ];

      case "parent":
        return [
          // Parent can only see their child's enrollments
          {
            id: "E001",
            courseId: "C001",
            studentId: "child-1",
            studentName: "Child Name",
            enrollmentDate: "2024-01-15",
            status: "enrolled",
            progress: 78,
            lastActivity: new Date().toISOString(),
            grade: "A-",
            enrollmentType: "manual",
          },
          {
            id: "E002",
            courseId: "C004",
            studentId: "child-1",
            studentName: "Child Name",
            enrollmentDate: "2024-01-10",
            status: "enrolled",
            progress: 65,
            lastActivity: new Date().toISOString(),
            grade: "B+",
            enrollmentType: "manual",
          },
        ];

      case "super-admin":
      case "admin":
      case "institution":
      case "principal":
        return [
          // Admin roles see comprehensive enrollment data across all courses
          {
            id: "E001",
            courseId: "C001",
            studentId: "S001",
            studentName: "Deepak",
            enrollmentDate: "2024-01-15",
            status: "enrolled",
            progress: 75,
            lastActivity: new Date().toISOString(),
            grade: "A-",
            enrollmentType: "manual",
          },
          {
            id: "E002",
            courseId: "C001",
            studentId: "S002",
            studentName: "Sankar",
            enrollmentDate: "2024-01-16",
            status: "enrolled",
            progress: 82,
            lastActivity: new Date().toISOString(),
            grade: "A",
            enrollmentType: "manual",
          },
          {
            id: "E003",
            courseId: "C002",
            studentId: "S003",
            studentName: "Malathika",
            enrollmentDate: "2024-02-01",
            status: "enrolled",
            progress: 45,
            lastActivity: new Date().toISOString(),
            grade: "B",
            enrollmentType: "self",
          },
          {
            id: "E004",
            courseId: "C003",
            studentId: "S004",
            studentName: "Suresh",
            enrollmentDate: "2024-01-20",
            status: "completed",
            progress: 100,
            lastActivity: "2024-01-25T14:20:00Z",
            grade: "A+",
            enrollmentType: "api",
          },
          {
            id: "E005",
            courseId: "C001",
            studentId: "S005",
            studentName: "Deevakar",
            enrollmentDate: "2024-01-18",
            status: "withdrawn",
            progress: 25,
            lastActivity: "2024-01-22T09:15:00Z",
            grade: "F",
            enrollmentType: "manual",
          },
          {
            id: "E006",
            courseId: "C002",
            studentId: "S006",
            studentName: "Madhan",
            enrollmentDate: "2024-02-02",
            status: "pending",
            progress: 0,
            lastActivity: new Date().toISOString(),
            grade: "N/A",
            enrollmentType: "bulk",
          },
          {
            id: "E007",
            courseId: "C004",
            studentId: "S007",
            studentName: "Ravishankar",
            enrollmentDate: "2024-01-12",
            status: "enrolled",
            progress: 88,
            lastActivity: new Date().toISOString(),
            grade: "A",
            enrollmentType: "self",
          },
          {
            id: "E008",
            courseId: "C005",
            studentId: "S008",
            studentName: "Vijay",
            enrollmentDate: "2024-01-25",
            status: "enrolled",
            progress: 92,
            lastActivity: new Date().toISOString(),
            grade: "A+",
            enrollmentType: "api",
          },
        ];

      default:
        return [];
    }
  });
  const [virtualSessions, setVirtualSessions] = useState<VirtualSession[]>([
    {
      id: "VS001",
      courseId: "C001",
      title: "Data Structures - Live Coding Session",
      platform: "zoom",
      scheduledDate: "2024-02-15T10:00:00Z",
      duration: 90,
      attendees: 42,
      status: "completed",
      recordingAvailable: true,
    },
    {
      id: "VS002",
      courseId: "C002",
      title: "Digital Marketing Strategy Workshop",
      platform: "teams",
      scheduledDate: "2024-02-20T14:00:00Z",
      duration: 120,
      attendees: 28,
      status: "scheduled",
      recordingAvailable: false,
    },
    {
      id: "VS003",
      courseId: "C003",
      title: "Machine Learning Lab Session",
      platform: "meet",
      scheduledDate: "2024-02-18T16:00:00Z",
      duration: 180,
      attendees: 25,
      status: "ongoing",
      recordingAvailable: false,
    },
    {
      id: "VS004",
      courseId: "C004",
      title: "Physics Problem Solving Session",
      platform: "zoom",
      scheduledDate: "2024-02-22T15:00:00Z",
      duration: 90,
      attendees: 35,
      status: "completed",
      recordingAvailable: true,
    },
    {
      id: "VS005",
      courseId: "C005",
      title: "Advanced Calculus Workshop",
      platform: "teams",
      scheduledDate: "2024-02-25T11:00:00Z",
      duration: 120,
      attendees: 22,
      status: "scheduled",
      recordingAvailable: false,
    },
    {
      id: "VS006",
      courseId: "C006",
      title: "React Development Live Coding",
      platform: "meet",
      scheduledDate: "2024-02-28T14:00:00Z",
      duration: 180,
      attendees: 40,
      status: "scheduled",
      recordingAvailable: false,
    },
    {
      id: "VS007",
      courseId: "C008",
      title: "Cybersecurity Lab Session",
      platform: "zoom",
      scheduledDate: "2024-03-01T16:00:00Z",
      duration: 150,
      attendees: 26,
      status: "scheduled",
      recordingAvailable: true,
    },
  ]);
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: "A001",
      courseId: "C001",
      title: "Implement Binary Search Tree",
      description:
        "Create a complete BST implementation with insertion, deletion, and traversal methods",
      dueDate: "2024-02-25",
      maxPoints: 100,
      submissions: 38,
      plagiarismCheck: true,
      autoGrading: false,
      status: "active",
    },
    {
      id: "A002",
      courseId: "C002",
      title: "Digital Campaign Analysis",
      description:
        "Analyze a real digital marketing campaign and present findings",
      dueDate: "2024-02-28",
      maxPoints: 80,
      submissions: 25,
      plagiarismCheck: true,
      autoGrading: false,
      status: "active",
    },
    {
      id: "A003",
      courseId: "C003",
      title: "ML Model Training Project",
      description:
        "Train and evaluate a machine learning model on provided dataset",
      dueDate: "2024-03-05",
      maxPoints: 120,
      submissions: 15,
      plagiarismCheck: true,
      autoGrading: true,
      status: "active",
    },
    {
      id: "A004",
      courseId: "C001",
      title: "Algorithm Complexity Analysis",
      description:
        "Analyze time and space complexity of various sorting algorithms",
      dueDate: "2024-03-10",
      maxPoints: 90,
      submissions: 0,
      plagiarismCheck: true,
      autoGrading: false,
      status: "draft",
    },
    {
      id: "A005",
      courseId: "C004",
      title: "Physics Problem Set 1",
      description:
        "Solve mechanics problems involving force, motion, and energy",
      dueDate: "2024-03-15",
      maxPoints: 75,
      submissions: 28,
      plagiarismCheck: false,
      autoGrading: true,
      status: "active",
    },
    {
      id: "A006",
      courseId: "C005",
      title: "Differential Equations Project",
      description: "Model a real-world system using differential equations",
      dueDate: "2024-03-20",
      maxPoints: 150,
      submissions: 18,
      plagiarismCheck: true,
      autoGrading: false,
      status: "active",
    },
    {
      id: "A007",
      courseId: "C006",
      title: "Portfolio Website Development",
      description:
        "Create a personal portfolio website using React and modern web technologies",
      dueDate: "2024-03-25",
      maxPoints: 200,
      submissions: 35,
      plagiarismCheck: true,
      autoGrading: false,
      status: "active",
    },
    {
      id: "A008",
      courseId: "C007",
      title: "Business Case Analysis",
      description:
        "Analyze a business scenario using statistical methods and analytics tools",
      dueDate: "2024-03-18",
      maxPoints: 100,
      submissions: 22,
      plagiarismCheck: true,
      autoGrading: false,
      status: "active",
    },
    {
      id: "A009",
      courseId: "C008",
      title: "Penetration Testing Report",
      description:
        "Conduct a security assessment and write a comprehensive report",
      dueDate: "2024-03-30",
      maxPoints: 180,
      submissions: 8,
      plagiarismCheck: true,
      autoGrading: false,
      status: "active",
    },
  ]);
  const [assessments, setAssessments] = useState<Assessment[]>([
    {
      id: "AS001",
      courseId: "C001",
      title: "Midterm Examination - Data Structures",
      type: "exam",
      questions: 50,
      duration: 120,
      attempts: 1,
      autoGrade: true,
      proctored: true,
      status: "active",
    },
    {
      id: "AS002",
      courseId: "C002",
      title: "Digital Marketing Quiz",
      type: "quiz",
      questions: 25,
      duration: 45,
      attempts: 2,
      autoGrade: true,
      proctored: false,
      status: "active",
    },
    {
      id: "AS003",
      courseId: "C003",
      title: "ML Concepts Assessment",
      type: "assignment",
      questions: 15,
      duration: 90,
      attempts: 1,
      autoGrade: false,
      proctored: true,
      status: "active",
    },
    {
      id: "AS004",
      courseId: "C001",
      title: "Weekly Progress Survey",
      type: "survey",
      questions: 10,
      duration: 15,
      attempts: 1,
      autoGrade: true,
      proctored: false,
      status: "active",
    },
    {
      id: "AS005",
      courseId: "C002",
      title: "Final Project Assessment",
      type: "exam",
      questions: 35,
      duration: 180,
      attempts: 1,
      autoGrade: false,
      proctored: true,
      status: "draft",
    },
    {
      id: "AS006",
      courseId: "C004",
      title: "Physics Midterm Exam",
      type: "exam",
      questions: 40,
      duration: 120,
      attempts: 1,
      autoGrade: true,
      proctored: true,
      status: "active",
    },
    {
      id: "AS007",
      courseId: "C005",
      title: "Calculus Competency Test",
      type: "exam",
      questions: 30,
      duration: 90,
      attempts: 2,
      autoGrade: true,
      proctored: true,
      status: "active",
    },
    {
      id: "AS008",
      courseId: "C006",
      title: "JavaScript Fundamentals Quiz",
      type: "quiz",
      questions: 20,
      duration: 30,
      attempts: 3,
      autoGrade: true,
      proctored: false,
      status: "active",
    },
    {
      id: "AS009",
      courseId: "C007",
      title: "Analytics Tools Assessment",
      type: "assignment",
      questions: 15,
      duration: 60,
      attempts: 1,
      autoGrade: false,
      proctored: false,
      status: "active",
    },
    {
      id: "AS010",
      courseId: "C008",
      title: "Security Concepts Exam",
      type: "exam",
      questions: 45,
      duration: 150,
      attempts: 1,
      autoGrade: true,
      proctored: true,
      status: "active",
    },
    {
      id: "AS011",
      courseId: "C009",
      title: "Creative Writing Portfolio Review",
      type: "assignment",
      questions: 5,
      duration: 120,
      attempts: 1,
      autoGrade: false,
      proctored: false,
      status: "active",
    },
    {
      id: "AS012",
      courseId: "C010",
      title: "Environmental Impact Assessment",
      type: "assignment",
      questions: 12,
      duration: 90,
      attempts: 1,
      autoGrade: false,
      proctored: false,
      status: "active",
    },
  ]);
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    // Add mock certificates for student demo
    if (user?.role === "student") {
      return [
        {
          id: "CERT001",
          courseId: "C001",
          studentId: user?.id || "student-1",
          template: "completion",
          issueDate: "2024-01-20",
          qrCode: "QR12345",
          verificationUrl: "https://verify.lms.edu/cert/CERT001",
          status: "issued",
        },
      ];
    }
    return [];
  });
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([
    {
      id: "LP001",
      name: "Computer Science Fundamentals",
      description: "Complete learning path for CS fundamentals",
      courses: ["C001", "C003"],
      sequencing: "linear",
      restrictions: ["Prerequisites must be completed"],
      prerequisites: ["Programming Fundamentals"],
      estimatedDuration: 16,
    },
    {
      id: "LP002",
      name: "Digital Marketing Specialization",
      description: "Comprehensive digital marketing track",
      courses: ["C002"],
      sequencing: "flexible",
      restrictions: [],
      prerequisites: ["Marketing Fundamentals"],
      estimatedDuration: 12,
    },
    {
      id: "LP003",
      name: "AI & Machine Learning Track",
      description: "Advanced AI and ML specialization path",
      courses: ["C001", "C003"],
      sequencing: "adaptive",
      restrictions: ["Math proficiency required"],
      prerequisites: ["Statistics", "Linear Algebra", "Programming"],
      estimatedDuration: 20,
    },
  ]);
  const [notificationTemplates, setNotificationTemplates] = useState<
    NotificationTemplate[]
  >([
    {
      id: "NT001",
      name: "Course Enrollment Confirmation",
      type: "email",
      trigger: "enrollment",
      subject: "Welcome to {course_name}",
      content:
        "You have been successfully enrolled in {course_name}. Start date: {start_date}",
      active: true,
    },
    {
      id: "NT002",
      name: "Assignment Due Reminder",
      type: "push",
      trigger: "assignment_due",
      subject: "Assignment Due Soon",
      content: 'Your assignment "{assignment_title}" is due on {due_date}',
      active: true,
    },
    {
      id: "NT003",
      name: "Grade Published",
      type: "in-app",
      trigger: "grade_published",
      subject: "New Grade Available",
      content: "Your grade for {assessment_title} has been published",
      active: true,
    },
    {
      id: "NT004",
      name: "Virtual Class Reminder",
      type: "sms",
      trigger: "virtual_class",
      subject: "Virtual Class Starting Soon",
      content: "Your virtual class for {course_name} starts in 15 minutes",
      active: true,
    },
    {
      id: "NT005",
      name: "Course Completion",
      type: "email",
      trigger: "course_completion",
      subject: "Congratulations! Course Completed",
      content:
        "You have successfully completed {course_name}. Your certificate is being processed.",
      active: true,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [activeView, setActiveView] = useState("courses");

  // Set default view based on user role
  useEffect(() => {
    if (user?.role === "student") {
      setActiveView("enrolled");
    }
  }, [user?.role]);
  const [courseView, setCourseView] = useState("list"); // list, details
  // contentView removed - content management moved to Academic module
  const [enrollmentView, setEnrollmentView] = useState("management"); // management, details

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEnrollmentDialogOpen, setIsEnrollmentDialogOpen] = useState(false);
  const [isViewEnrollmentDialogOpen, setIsViewEnrollmentDialogOpen] =
    useState(false);
  const [isBulkEnrollmentDialogOpen, setIsBulkEnrollmentDialogOpen] =
    useState(false);
  const [isVirtualClassroomDialogOpen, setIsVirtualClassroomDialogOpen] =
    useState(false);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false);
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] =
    useState(false);
  const [isLearningPathDialogOpen, setIsLearningPathDialogOpen] =
    useState(false);
  const [isProctoringDialogOpen, setIsProctoringDialogOpen] = useState(false);
  const [isCreateLearningPathDialogOpen, setIsCreateLearningPathDialogOpen] =
    useState(false);
  const [isEditLearningPathDialogOpen, setIsEditLearningPathDialogOpen] =
    useState(false);
  const [isCreateNotificationDialogOpen, setIsCreateNotificationDialogOpen] =
    useState(false);
  const [isEditNotificationDialogOpen, setIsEditNotificationDialogOpen] =
    useState(false);
  const [
    isCreateVirtualSessionDialogOpen,
    setIsCreateVirtualSessionDialogOpen,
  ] = useState(false);
  const [isEditVirtualSessionDialogOpen, setIsEditVirtualSessionDialogOpen] =
    useState(false);
  const [isCreateAssignmentDialogOpen, setIsCreateAssignmentDialogOpen] =
    useState(false);
  const [isEditAssignmentDialogOpen, setIsEditAssignmentDialogOpen] =
    useState(false);
  const [isCreateAssessmentDialogOpen, setIsCreateAssessmentDialogOpen] =
    useState(false);
  const [isEditAssessmentDialogOpen, setIsEditAssessmentDialogOpen] =
    useState(false);
  const [isCreateCertificateDialogOpen, setIsCreateCertificateDialogOpen] =
    useState(false);
  const [isEditCertificateDialogOpen, setIsEditCertificateDialogOpen] =
    useState(false);

  // Advanced functionality states
  const [isBulkOperationsDialogOpen, setIsBulkOperationsDialogOpen] =
    useState(false);
  const [isTemplatesDialogOpen, setIsTemplatesDialogOpen] = useState(false);
  const [isIntegrationsDialogOpen, setIsIntegrationsDialogOpen] =
    useState(false);
  const [isAdvancedCourseDialogOpen, setIsAdvancedCourseDialogOpen] =
    useState(false);
  const [isExportOptionsDialogOpen, setIsExportOptionsDialogOpen] =
    useState(false);
  const [isQuestionBankDialogOpen, setIsQuestionBankDialogOpen] =
    useState(false);
  const [isCreateQuestionDialogOpen, setIsCreateQuestionDialogOpen] =
    useState(false);
  const [isBulkImportDialogOpen, setIsBulkImportDialogOpen] = useState(false);
  const [isAdvancedFilterDialogOpen, setIsAdvancedFilterDialogOpen] =
    useState(false);
  const [isQuickAnalyticsDialogOpen, setIsQuickAnalyticsDialogOpen] =
    useState(false);
  const [isGradingInterfaceDialogOpen, setIsGradingInterfaceDialogOpen] =
    useState(false);

  // Selection states
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedAssignments, setSelectedAssignments] = useState<string[]>([]);
  const [selectedAssessments, setSelectedAssessments] = useState<string[]>([]);
  const [bulkImportFile, setBulkImportFile] = useState<File | null>(null);

  // Role-specific activities and capabilities mock data
  const roleCapabilities = {
    "super-admin": {
      canCreateCourses: true,
      canDeleteCourses: true,
      canBulkImport: true,
      canManageUsers: true,
      canViewReports: true,
      canManageSettings: true,
      canAccessAnalytics: true,
      operations: [
        "Create",
        "Read",
        "Update",
        "Delete",
        "Bulk Import",
        "Export",
        "Analytics",
        "System Management",
      ],
    },
    admin: {
      canCreateCourses: true,
      canDeleteCourses: true,
      canBulkImport: true,
      canManageUsers: true,
      canViewReports: true,
      canManageSettings: false,
      canAccessAnalytics: true,
      operations: [
        "Create",
        "Read",
        "Update",
        "Delete",
        "Bulk Import",
        "Export",
        "Analytics",
        "User Management",
      ],
    },
    institution: {
      canCreateCourses: true,
      canDeleteCourses: true,
      canBulkImport: true,
      canManageUsers: true,
      canViewReports: true,
      canManageSettings: false,
      canAccessAnalytics: true,
      operations: [
        "Create",
        "Read",
        "Update",
        "Delete",
        "Bulk Import",
        "Export",
        "Analytics",
        "Institution Management",
      ],
    },
    principal: {
      canCreateCourses: true,
      canDeleteCourses: true,
      canBulkImport: true,
      canManageUsers: true,
      canViewReports: true,
      canManageSettings: false,
      canAccessAnalytics: true,
      operations: [
        "Create",
        "Read",
        "Update",
        "Delete",
        "Bulk Import",
        "Export",
        "Analytics",
        "Academic Management",
      ],
    },
    hod: {
      canCreateCourses: true,
      canDeleteCourses: false,
      canBulkImport: true,
      canManageUsers: false,
      canViewReports: true,
      canManageSettings: false,
      canAccessAnalytics: true,
      operations: [
        "Create",
        "Read",
        "Update",
        "Bulk Import",
        "Export",
        "Department Analytics",
        "Faculty Management",
      ],
    },
    faculty: {
      canCreateCourses: true,
      canDeleteCourses: false,
      canBulkImport: false,
      canManageUsers: false,
      canViewReports: true,
      canManageSettings: false,
      canAccessAnalytics: true,
      operations: [
        "Create",
        "Read",
        "Update",
        "Grade",
        "Attendance",
        "Assignments",
        "Content Management",
        "Class Analytics",
      ],
    },
    staff: {
      canCreateCourses: false,
      canDeleteCourses: false,
      canBulkImport: false,
      canManageUsers: false,
      canViewReports: false,
      canManageSettings: false,
      canAccessAnalytics: false,
      operations: ["Read", "View Schedule", "Monitor Attendance"],
    },
    student: {
      canCreateCourses: false,
      canDeleteCourses: false,
      canBulkImport: false,
      canManageUsers: false,
      canViewReports: false,
      canManageSettings: false,
      canAccessAnalytics: false,
      operations: [
        "Read",
        "Enroll",
        "Submit Assignments",
        "Take Assessments",
        "View Progress",
        "Join Virtual Classes",
      ],
    },
    parent: {
      canCreateCourses: false,
      canDeleteCourses: false,
      canBulkImport: false,
      canManageUsers: false,
      canViewReports: false,
      canManageSettings: false,
      canAccessAnalytics: false,
      operations: [
        "Read",
        "View Child Progress",
        "View Grades",
        "View Schedule",
      ],
    },
  };

  // Helper function to fetch data with retry
  const fetchWithRetry = async (
    url: string,
    maxRetries: number = 3
  ): Promise<Response> => {
    // Ensure we're in browser environment
    if (typeof window === "undefined") {
      throw new Error("Fetch not available in server environment");
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Fetch attempt ${attempt}/${maxRetries} for ${url}`);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });
        return response;
      } catch (error) {
        console.warn(`❌ Attempt ${attempt} failed for ${url}:`, error);
        if (attempt === maxRetries) {
          throw error;
        }
        // Wait briefly before retry
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    throw new Error(`Failed to fetch ${url} after ${maxRetries} attempts`);
  };

  // Load faculty and student data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setDataLoadError(null);
        console.log("🚀 Loading faculty and student data for courses...");
        console.log(
          "🌐 Current base URL:",
          typeof window !== "undefined" ? window.location.origin : "SSR"
        );

        let facultyData: any[] = [];
        let studentData: any[] = [];
        let errors: string[] = [];

        // Load faculty data with retry mechanism
        try {
          const facultyResponse = await fetchWithRetry("/faculty.json");

          if (facultyResponse.ok) {
            const allFaculty = await facultyResponse.json();
            const userInstitutionCode =
              user?.institutionCode || user?.selectedInstitutionCode;

            if (userInstitutionCode) {
              facultyData = allFaculty.filter(
                (f: any) =>
                  f.institution_code === parseInt(userInstitutionCode) &&
                  f.employment_status === "Active"
              );
            } else {
              facultyData = allFaculty.filter(
                (f: any) => f.employment_status === "Active"
              );
            }
            console.log(`✅ Loaded ${facultyData.length} faculty members`);
          } else {
            const errorMsg = `Faculty fetch failed with status: ${facultyResponse.status}`;
            console.warn(`❌ ${errorMsg}`);
            errors.push(errorMsg);
          }
        } catch (error) {
          const errorMsg = `Could not load faculty data: ${error}`;
          console.warn(`❌ ${errorMsg}`);
          errors.push(errorMsg);

          // Create minimal fallback faculty data based on user
          if (user?.role === "faculty") {
            facultyData = [
              {
                faculty_id: user.faculty_id || 1,
                personal_info: { full_name: user.name },
                department: user.department,
                department_id: user.department_id || 101,
                employment_status: "Active",
                institution_code: parseInt(user.institutionCode || "101"),
              },
            ];
            console.log("🔄 Using minimal faculty data for current user");
          }
        }

        // Load student data with retry mechanism
        try {
          const studentResponse = await fetchWithRetry("/students.json");

          if (studentResponse.ok) {
            const allStudents = await studentResponse.json();
            const userInstitutionCode =
              user?.institutionCode || user?.selectedInstitutionCode;

            if (userInstitutionCode) {
              studentData = allStudents.filter(
                (s: any) =>
                  s.academic_info?.institution_code ===
                    parseInt(userInstitutionCode) && s.status === "Active"
              );
            } else {
              studentData = allStudents.filter(
                (s: any) => s.status === "Active"
              );
            }
            console.log(`✅ Loaded ${studentData.length} students`);
          } else {
            const errorMsg = `Student fetch failed with status: ${studentResponse.status}`;
            console.warn(`❌ ${errorMsg}`);
            errors.push(errorMsg);
          }
        } catch (error) {
          const errorMsg = `Could not load student data: ${error}`;
          console.warn(`�� ${errorMsg}`);
          errors.push(errorMsg);
          studentData = [];
          console.log("🔄 Using empty student data as fallback");
        }

        // Set error state if there were issues
        if (errors.length > 0) {
          setDataLoadError(errors.join("; "));
        }

        setFaculty(facultyData);
        setStudents(studentData);

        // Filter courses based on user role and department
        const filteredCourses = getFilteredCoursesForUser(
          initialCourses,
          user,
          facultyData,
          studentData
        );
        setCourses(filteredCourses);

        console.log(
          `📚 Showing ${filteredCourses.length} courses for ${user?.role}: ${user?.name}`
        );
        setLoading(false);
      } catch (error) {
        console.error("💥 Critical error loading data:", error);
        setDataLoadError(`Critical error: ${error}`);
        // Ensure we always have some courses to show
        setCourses(initialCourses);
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Function to filter courses based on user role and department
  const getFilteredCoursesForUser = (
    allCourses: Course[],
    currentUser: any,
    facultyData: any[],
    studentData: any[]
  ) => {
    if (!currentUser) return [];

    console.log("🔍 Filtering courses for user:", {
      role: currentUser.role,
      name: currentUser.name,
      department: currentUser.department,
      faculty_id: currentUser.faculty_id,
    });

    switch (currentUser.role) {
      case "faculty":
        // For faculty, show courses they teach based on their department
        const currentFaculty = facultyData.find(
          (f) =>
            f.personal_info?.full_name === currentUser.name ||
            f.faculty_id === currentUser.faculty_id ||
            f.contact_info?.email === currentUser.email
        );

        if (currentFaculty) {
          console.log("✅ Found faculty in data:", {
            name: currentFaculty.personal_info?.full_name,
            department: currentFaculty.department,
            department_id: currentFaculty.department_id,
          });

          // Create courses for this faculty's department
          const facultyCourses = createCoursesForFaculty(
            currentFaculty,
            studentData
          );
          console.log(
            `📚 Created ${facultyCourses.length} courses for faculty ${currentFaculty.personal_info?.full_name}`
          );
          return facultyCourses;
        } else {
          console.log("⚠️ Faculty not found in data, creating sample courses");
          // Create sample courses for unknown faculty
          return createSampleCoursesForUser(currentUser, studentData);
        }

      case "student":
        // For students, create courses based on their department and enrollment
        console.log("🎓 Creating courses for student:", {
          name: currentUser.name,
          department: currentUser.department,
          student_id: currentUser.student_id,
          totalStudentsInData: studentData.length,
          totalFacultyInData: facultyData.length,
        });

        // Try different ways to find the current student in studentData
        const currentStudent = studentData.find((s) => {
          if (!s || !s.personal_info) return false;

          const nameMatch = s.personal_info.full_name === currentUser.name;
          const idMatch = s.student_id === currentUser.student_id;
          const regMatch =
            s.registration_number === currentUser.registration_number;

          return nameMatch || idMatch || regMatch;
        });

        if (currentStudent) {
          console.log("✅ Found student in data:", {
            name: currentStudent.personal_info?.full_name,
            department: currentStudent.academic_info?.department,
            department_id: currentStudent.department_id,
            student_id: currentStudent.student_id,
          });

          // Create courses for this student's department
          const studentCourses = createCoursesForStudent(
            currentStudent,
            facultyData
          );
          console.log(
            `📚 Created ${studentCourses.length} courses for student ${currentStudent.personal_info?.full_name}`
          );
          return studentCourses;
        } else {
          console.log(
            "⚠️ Student not found in data, creating sample courses based on user info"
          );
          console.log(
            "Available students in data:",
            studentData.slice(0, 3).map((s) => ({
              name: s?.personal_info?.full_name,
              id: s?.student_id,
            }))
          );

          // Create sample courses for unknown student
          const sampleCourses = createSampleCoursesForStudent(
            currentUser,
            facultyData
          );
          console.log(
            `📚 Created ${sampleCourses.length} sample courses for student`
          );
          return sampleCourses;
        }

      case "admin":
      case "principal":
      case "super-admin":
      case "institution":
        // Admins can see all courses
        return allCourses;

      default:
        return allCourses.slice(0, 3); // Default limited view
    }
  };

  // Function to create courses for a specific faculty member
  const createCoursesForFaculty = (facultyMember: any, studentData: any[]) => {
    // Safety checks for faculty data
    if (!facultyMember) {
      console.warn("⚠️ No faculty member provided to createCoursesForFaculty");
      return [];
    }

    // Ensure we have valid department data
    const facultyDepartment = facultyMember.department || "General";
    const facultyDepartmentId = facultyMember.department_id || 101;

    // Filter students by department with safety checks
    const departmentStudents = Array.isArray(studentData)
      ? studentData.filter((s) => s && s.department_id === facultyDepartmentId)
      : [];
    const studentCount = departmentStudents.length;

    const courseTemplates = [
      {
        nameTemplate: "Digital Logic Design",
        codeTemplate: "1052233110",
        categoryTemplate: "Computer Engineering",
        description:
          "Introduces Boolean algebra, combinational and sequential circuits, digital interfacing, memories, and programmable logic devices.",
      },
      {
        nameTemplate: "Fundamentals of {department}",
        codeTemplate: "1020{deptId}102",
        categoryTemplate: "{department}",
        description:
          "Basic principles and core concepts in {department} designed for beginners and intermediate students.",
      },
      {
        nameTemplate: "{department} Laboratory",
        codeTemplate: "1020{deptId}103",
        categoryTemplate: "{department}",
        description:
          "Hands-on laboratory sessions and practical experiments in {department}.",
      },
    ];

    return courseTemplates.map((template, index) => ({
      id: `FC${facultyMember.faculty_id || "unknown"}_${index + 1}`,
      name: template.nameTemplate.replace("{department}", facultyDepartment),
      code: template.codeTemplate.replace(
        "{deptId}",
        facultyDepartmentId.toString().padStart(3, "0")
      ),
      category: template.categoryTemplate.replace(
        "{department}",
        facultyDepartment
      ),
      subcategory: facultyMember.specialization || facultyDepartment,
      credits: 3 + index,
      learningHours: 45 + index * 15,
      practicalHours: 30 + index * 10,
      department: facultyDepartment,
      faculty: facultyMember.personal_info?.full_name || "Faculty Member",
      students: Math.min(studentCount, 45 - index * 5),
      description: template.description.replace(
        "{department}",
        facultyDepartment
      ),
      status: "Active",
      startDate: "2024-01-15",
      endDate: "2024-12-15",
      type: index === 0 ? "Mandatory" : "Elective",
      completion: 65 + index * 10,
      rating: 4.2 + index * 0.2,
      outcomes: [
        `${facultyDepartment} competency`,
        "Problem solving",
        "Technical skills",
      ],
      competencyScale: index === 0 ? "Advanced" : "Intermediate",
      activities: ["Lectures", "Assignments", "Lab sessions", "Projects"],
      cohorts: [`${facultyDepartment} 2024`],
      enrolled: Math.min(studentCount, 40 - index * 5),
      maxCapacity: 50,
      prerequisites: index === 0 ? [`Basic ${facultyDepartment}`] : [],
      badges: ["Course Completion", "Excellence Badge"],
      certificates: [`${facultyDepartment} Certificate`],
      enrollmentMode: "manual" as const,
      proctoring: true,
      adaptiveLearning: true,
      virtualClassroom: true,
      collaborationTools: ["Discussion Forums", "Chat", "Video Calls"],
      contentTypes: [
        "Video Lectures",
        "Interactive Simulations",
        "Case Studies",
      ],
      assignments: 8 + index,
      assessments: 4 + index,
      discussions: 15 + index * 5,
      lessonPlans: 20 + index * 5,
      gamificationEnabled: true,
      certificatesGenerated: Math.min(studentCount, 30),
      notifications: ["Email", "Push"],
      integrations: ["LMS", "Video Platform"],
    }));
  };

  // Function to create courses for a specific student
  const createCoursesForStudent = (studentMember: any, facultyData: any[]) => {
    // Safety checks for student data
    if (!studentMember) {
      console.warn("⚠️ No student member provided to createCoursesForStudent");
      return [];
    }

    // Get student's department info
    const studentDepartment =
      studentMember.academic_info?.department || "General Studies";
    const studentDepartmentId = studentMember.department_id || 101;

    // Find faculty teaching in this department
    const departmentFaculty = Array.isArray(facultyData)
      ? facultyData.filter((f) => f && f.department_id === studentDepartmentId)
      : [];

    const courseTemplates = [
      {
        nameTemplate: "Digital Logic Design",
        codeTemplate: "1020{deptId}001",
        description:
          "This course covers the principles of Boolean algebra, logic circuits, and sequential system design for developing digital systems.",
      },
      {
        nameTemplate: "C Programming",
        codeTemplate: "1020{deptId}002",
        description:
          "This course introduces problem-solving through structured programming concepts in C, covering data types, control structures, functions, arrays, pointers, and file handling..",
      },
      // {
      //   nameTemplate: "{department} Laboratory",
      //   codeTemplate: "1020{deptId}003",
      //   description:
      //     "Hands-on practical sessions and laboratory work in {department}.",
      // },
      // {
      //   nameTemplate: "{department} Project Work",
      //   codeTemplate: "1020{deptId}004",
      //   description:
      //     "Real-world project implementation and research work in {department}.",
      // },
    ];

    return courseTemplates.map((template, index) => {
      const assignedFaculty =
        departmentFaculty[index % departmentFaculty.length];

      return {
        id: `STU${studentMember.student_id}_${index + 1}`,
        name: template.nameTemplate.replace("{department}", studentDepartment),
        code: template.codeTemplate.replace(
          "{deptId}",
          studentDepartmentId.toString().padStart(3, "0")
        ),
        category: studentDepartment,
        subcategory:
          index === 0
            ? "Fundamentals"
            : index === 1
            ? "Advanced"
            : index === 2
            ? "Practical"
            : "Project",
        credits: 3 + Math.floor(index / 2),
        learningHours: 45 + index * 15,
        practicalHours: 30 + index * 5,
        department: studentDepartment,
        faculty: assignedFaculty?.personal_info?.full_name || "Faculty Member",
        students: 25 + index * 5,
        description: template.description.replace(
          "{department}",
          studentDepartment
        ),
        status: "Active",
        startDate: "2024-01-15",
        endDate: "2024-12-15",
        type: index < 2 ? "Mandatory" : ("Elective" as const),
        completion: 60 + index * 10,
        rating: 4.0 + index * 0.3,
        outcomes: [
          `${studentDepartment} fundamentals`,
          "Problem solving",
          "Technical skills",
        ],
        competencyScale:
          index === 0 ? "Beginner" : index === 1 ? "Intermediate" : "Advanced",
        activities: ["Video Lectures", "Assignments", "Quizzes", "Projects"],
        cohorts: [`${studentDepartment} Students 2024`],
        enrolled: 20 + index * 3,
        maxCapacity: 40,
        prerequisites: index === 0 ? [] : [`Basic ${studentDepartment}`],
        badges: ["Student Achievement", "Course Completion"],
        certificates: [`${studentDepartment} Course Certificate`],
        enrollmentMode: "self" as const,
        proctoring: false,
        adaptiveLearning: true,
        virtualClassroom: true,
        collaborationTools: [
          "Discussion Forums",
          "Study Groups",
          "Peer Review",
        ],
        contentTypes: [
          "Video Lectures",
          "Reading Materials",
          "Interactive Exercises",
        ],
        assignments: 5 + index,
        assessments: 3 + index,
        discussions: 10 + index * 3,
        lessonPlans: 15 + index * 3,
        gamificationEnabled: true,
        certificatesGenerated: 15 + index,
        notifications: ["Email", "In-App"],
        integrations: ["LMS", "Library"],
      };
    });
  };

  // Function to create sample courses for unknown student
  const createSampleCoursesForStudent = (
    currentUser: any,
    facultyData: any[]
  ) => {
    const department = currentUser.department || "Computer Science";

    const sampleCourses = [
      {
        id: "STUDENT_SAMPLE_001",
        name: `Introduction to ${department}`,
        code: "1020000001",
        category: department,
        subcategory: "Fundamentals",
        credits: 3,
        learningHours: 45,
        practicalHours: 15,
        department: department,
        faculty: "Dr. Sarah Johnson",
        students: 30,
        description: `Introduction to key concepts and principles in ${department.toLowerCase()}.`,
        status: "Active",
        startDate: "2024-01-15",
        endDate: "2024-12-15",
        type: "Mandatory" as const,
        completion: 75,
        rating: 4.2,
        outcomes: [`${department} fundamentals`, "Basic understanding"],
        competencyScale: "Beginner",
        activities: ["Video Lectures", "Assignments"],
        cohorts: [`${department} 2024`],
        enrolled: 25,
        maxCapacity: 40,
        prerequisites: [],
        badges: ["Course Completion"],
        certificates: [`${department} Certificate`],
        enrollmentMode: "self" as const,
        proctoring: false,
        adaptiveLearning: true,
        virtualClassroom: true,
        collaborationTools: ["Discussion Forums"],
        contentTypes: ["Video Lectures", "Reading Materials"],
        assignments: 5,
        assessments: 3,
        discussions: 10,
        lessonPlans: 15,
        gamificationEnabled: true,
        certificatesGenerated: 20,
        notifications: ["Email"],
        integrations: ["LMS"],
      },
      {
        id: "STUDENT_SAMPLE_002",
        name: `Advanced ${department}`,
        code: "1020000002",
        category: department,
        subcategory: "Advanced",
        credits: 4,
        learningHours: 60,
        practicalHours: 30,
        department: department,
        faculty: "Dr. Michael Chen",
        students: 25,
        description: `Advanced topics and practical applications in ${department.toLowerCase()}.`,
        status: "Active",
        startDate: "2024-01-15",
        endDate: "2024-12-15",
        type: "Elective" as const,
        completion: 60,
        rating: 4.5,
        outcomes: [`Advanced ${department} skills`, "Problem solving"],
        competencyScale: "Advanced",
        activities: ["Projects", "Case Studies"],
        cohorts: [`${department} Advanced 2024`],
        enrolled: 20,
        maxCapacity: 30,
        prerequisites: [`Basic ${department}`],
        badges: ["Advanced Achievement"],
        certificates: [`Advanced ${department} Certificate`],
        enrollmentMode: "self" as const,
        proctoring: true,
        adaptiveLearning: true,
        virtualClassroom: true,
        collaborationTools: ["Discussion Forums", "Group Projects"],
        contentTypes: ["Video Lectures", "Interactive Labs"],
        assignments: 8,
        assessments: 5,
        discussions: 15,
        lessonPlans: 20,
        gamificationEnabled: true,
        certificatesGenerated: 15,
        notifications: ["Email", "Push"],
        integrations: ["LMS", "GitHub"],
      },
      {
        id: "STUDENT_SAMPLE_003",
        name: `${department} Project Workshop`,
        code: "1020000003",
        category: department,
        subcategory: "Practical",
        credits: 2,
        learningHours: 30,
        practicalHours: 45,
        department: department,
        faculty: "Prof. Emily Rodriguez",
        students: 35,
        description: `Hands-on project work and real-world applications in ${department.toLowerCase()}.`,
        status: "Active",
        startDate: "2024-01-15",
        endDate: "2024-12-15",
        type: "Elective" as const,
        completion: 85,
        rating: 4.7,
        outcomes: [
          "Project management",
          "Team collaboration",
          "Technical skills",
        ],
        competencyScale: "Intermediate",
        activities: ["Group Projects", "Presentations"],
        cohorts: [`${department} Workshop 2024`],
        enrolled: 32,
        maxCapacity: 40,
        prerequisites: [],
        badges: ["Project Master", "Team Player"],
        certificates: [`${department} Project Certificate`],
        enrollmentMode: "self" as const,
        proctoring: false,
        adaptiveLearning: true,
        virtualClassroom: true,
        collaborationTools: ["Discussion Forums", "Collaboration Tools"],
        contentTypes: ["Project Guides", "Video Tutorials"],
        assignments: 3,
        assessments: 2,
        discussions: 20,
        lessonPlans: 12,
        gamificationEnabled: true,
        certificatesGenerated: 28,
        notifications: ["Email"],
        integrations: ["LMS", "Project Tools"],
      },
    ];

    return sampleCourses;
  };

  // Function to create sample courses for unknown users
  const createSampleCoursesForUser = (currentUser: any, studentData: any[]) => {
    return [
      {
        id: "SAMPLE_001",
        name: `Introduction to ${currentUser.department || "General Studies"}`,
        code: "1020000001",
        category: currentUser.department || "General",
        subcategory: "Fundamentals",
        credits: 3,
        learningHours: 45,
        practicalHours: 15,
        department: currentUser.department || "General",
        faculty: currentUser.name || "Faculty Member",
        students: Math.min(studentData.length, 30),
        description: `Introduction to key concepts and principles in ${
          currentUser.department || "general studies"
        }.`,
        status: "Active",
        startDate: "2024-01-15",
        endDate: "2024-12-15",
        type: "Mandatory" as const,
        completion: 0,
        rating: 4.0,
        outcomes: ["Basic understanding", "Problem solving"],
        competencyScale: "Beginner",
        activities: ["Lectures", "Assignments"],
        cohorts: [`${currentUser.department || "General"} 2024`],
        enrolled: Math.min(studentData.length, 25),
        maxCapacity: 40,
        prerequisites: [],
        badges: ["Getting Started"],
        certificates: ["Course Completion"],
        enrollmentMode: "manual" as const,
        proctoring: false,
        adaptiveLearning: false,
        virtualClassroom: true,
        collaborationTools: ["Discussion Forums"],
        contentTypes: ["Video Lectures"],
        assignments: 5,
        assessments: 3,
        discussions: 10,
        lessonPlans: 15,
        gamificationEnabled: false,
        certificatesGenerated: 0,
        notifications: ["Email"],
        integrations: ["LMS"],
      },
    ];
  };

  // Get current user capabilities
  const currentCapabilities =
    roleCapabilities[user?.role as keyof typeof roleCapabilities] ||
    roleCapabilities["student"];

  // Role-specific recent activities mock data
  const roleActivities = {
    "super-admin": [
      {
        action: "System Backup",
        course: "System",
        time: "10 minutes ago",
        type: "system",
      },
      {
        action: "Created new course",
        course: "Advanced AI",
        time: "1 hour ago",
        type: "create",
      },
      {
        action: "Updated user permissions",
        course: "System",
        time: "2 hours ago",
        type: "update",
      },
      {
        action: "Generated analytics report",
        course: "All Courses",
        time: "3 hours ago",
        type: "report",
      },
      {
        action: "Bulk imported students",
        course: "Multiple",
        time: "1 day ago",
        type: "import",
      },
    ],
    admin: [
      {
        action: "Approved new enrollment",
        course: "Machine Learning",
        time: "30 minutes ago",
        type: "approve",
      },
      {
        action: "Updated course content",
        course: "Data Structures",
        time: "2 hours ago",
        type: "update",
      },
      {
        action: "Generated progress report",
        course: "All Active",
        time: "4 hours ago",
        type: "report",
      },
      {
        action: "Added new faculty",
        course: "System",
        time: "1 day ago",
        type: "create",
      },
      {
        action: "Exported student data",
        course: "CS Department",
        time: "2 days ago",
        type: "export",
      },
    ],
    faculty: [
      {
        action: "Graded assignments",
        course: "Data Structures",
        time: "15 minutes ago",
        type: "grade",
      },
      {
        action: "Updated lesson plan",
        course: "Machine Learning",
        time: "1 hour ago",
        type: "update",
      },
      {
        action: "Posted new announcement",
        course: "Data Structures",
        time: "3 hours ago",
        type: "announce",
      },
      {
        action: "Scheduled virtual class",
        course: "ML Fundamentals",
        time: "5 hours ago",
        type: "schedule",
      },
      {
        action: "Created new assignment",
        course: "Data Structures",
        time: "1 day ago",
        type: "create",
      },
    ],
    student: [
      {
        action: "Submitted assignment",
        course: "Data Structures",
        time: "1 hour ago",
        type: "submit",
      },
      {
        action: "Completed quiz",
        course: "Digital Marketing",
        time: "3 hours ago",
        type: "complete",
      },
      {
        action: "Joined virtual class",
        course: "Machine Learning",
        time: "1 day ago",
        type: "attend",
      },
      {
        action: "Enrolled in course",
        course: "Physics 101",
        time: "2 days ago",
        type: "enroll",
      },
      {
        action: "Downloaded materials",
        course: "Data Structures",
        time: "3 days ago",
        type: "download",
      },
    ],
    parent: [
      {
        action: "Viewed child's progress",
        course: "Data Structures",
        time: "2 hours ago",
        type: "view",
      },
      {
        action: "Checked assignment grades",
        course: "Physics 101",
        time: "1 day ago",
        type: "view",
      },
      {
        action: "Reviewed attendance",
        course: "All Courses",
        time: "2 days ago",
        type: "view",
      },
      {
        action: "Downloaded progress report",
        course: "Semester Report",
        time: "1 week ago",
        type: "download",
      },
    ],
  };

  const currentActivities =
    roleActivities[user?.role as keyof typeof roleActivities] ||
    roleActivities["student"];

  // Role-specific dashboard statistics
  const roleStats = {
    "super-admin": {
      totalCourses: 85,
      activeCourses: 42,
      totalStudents: 2847,
      totalFaculty: 156,
      completionRate: 87,
      avgRating: 4.6,
      systemHealth: 98,
      pendingApprovals: 12,
      metrics: [
        { label: "Total Courses", value: "85", change: "+12%" },
        { label: "Active Students", value: "2,847", change: "+8%" },
        { label: "System Uptime", value: "99.9%", change: "+0.1%" },
        { label: "Storage Used", value: "1.2TB", change: "+15%" },
      ],
    },
    admin: {
      totalCourses: 42,
      activeCourses: 38,
      totalStudents: 1286,
      totalFaculty: 89,
      completionRate: 85,
      avgRating: 4.5,
      pendingApprovals: 8,
      metrics: [
        { label: "Managed Courses", value: "42", change: "+5%" },
        { label: "Student Enrollments", value: "1,286", change: "+12%" },
        { label: "Completion Rate", value: "85%", change: "+3%" },
        { label: "Faculty Members", value: "89", change: "+2%" },
      ],
    },
    faculty: {
      totalCourses: 4,
      activeCourses: 3,
      totalStudents: 124,
      assignmentsPending: 18,
      completionRate: 78,
      avgRating: 4.7,
      metrics: [
        { label: "Teaching Courses", value: "4", change: "+1" },
        { label: "Total Students", value: "124", change: "+8%" },
        { label: "Pending Grades", value: "18", change: "-5%" },
        { label: "Course Rating", value: "4.7���", change: "+0.2" },
      ],
    },
    student: {
      enrolledCourses: 3,
      completedCourses: 1,
      inProgressCourses: 2,
      avgGrade: "A-",
      completionRate: 75,
      studyHours: 28,
      metrics: [
        { label: "Enrolled Courses", value: "3", change: "+1" },
        { label: "Completion Rate", value: "75%", change: "+5%" },
        { label: "Average Grade", value: "A-", change: "+0.3" },
        { label: "Study Hours", value: "28h", change: "+4h" },
      ],
    },
    parent: {
      childrenCount: 1,
      activeCourses: 2,
      avgGrade: "B+",
      attendanceRate: 92,
      metrics: [
        { label: "Child's Courses", value: "2", change: "0" },
        { label: "Average Grade", value: "B+", change: "+0.5" },
        { label: "Attendance", value: "92%", change: "+2%" },
        { label: "Assignments On Time", value: "85%", change: "+10%" },
      ],
    },
  };

  const currentStats =
    roleStats[user?.role as keyof typeof roleStats] || roleStats["student"];

  // Role-specific notifications
  const roleNotifications = {
    "super-admin": [
      {
        id: 1,
        message: "System backup completed successfully",
        type: "success",
        time: "5 min ago",
      },
      {
        id: 2,
        message: "New course approval request pending",
        type: "warning",
        time: "1 hour ago",
      },
      {
        id: 3,
        message: "Monthly analytics report generated",
        type: "info",
        time: "2 hours ago",
      },
      {
        id: 4,
        message: "User permission update required",
        type: "error",
        time: "3 hours ago",
      },
    ],
    admin: [
      {
        id: 1,
        message: "5 new student enrollment requests",
        type: "info",
        time: "30 min ago",
      },
      {
        id: 2,
        message: "Course completion rate improved by 5%",
        type: "success",
        time: "2 hours ago",
      },
      {
        id: 3,
        message: "Faculty meeting scheduled for tomorrow",
        type: "warning",
        time: "4 hours ago",
      },
    ],
    faculty: [
      {
        id: 1,
        message: "18 assignments pending grading",
        type: "warning",
        time: "1 hour ago",
      },
      {
        id: 2,
        message: "Virtual class starting in 30 minutes",
        type: "info",
        time: "30 min ago",
      },
      {
        id: 3,
        message: "New student question in discussion forum",
        type: "info",
        time: "2 hours ago",
      },
    ],
    student: [
      {
        id: 1,
        message: "Assignment due tomorrow in Data Structures",
        type: "warning",
        time: "2 hours ago",
      },
      {
        id: 2,
        message: "New grade posted for ML Quiz",
        type: "success",
        time: "4 hours ago",
      },
      {
        id: 3,
        message: "Virtual class reminder: Physics 101",
        type: "info",
        time: "1 day ago",
      },
    ],
    parent: [
      {
        id: 1,
        message: "Child scored A in recent quiz",
        type: "success",
        time: "1 day ago",
      },
      {
        id: 2,
        message: "Parent-teacher meeting scheduled",
        type: "info",
        time: "2 days ago",
      },
      {
        id: 3,
        message: "Monthly progress report available",
        type: "info",
        time: "1 week ago",
      },
    ],
  };

  const currentNotifications =
    roleNotifications[user?.role as keyof typeof roleNotifications] ||
    roleNotifications["student"];

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLearningPath, setSelectedLearningPath] =
    useState<LearningPath | null>(null);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationTemplate | null>(null);
  const [selectedVirtualSession, setSelectedVirtualSession] =
    useState<VirtualSession | null>(null);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<Enrollment | null>(null);
  const [bulkEnrollmentFile, setBulkEnrollmentFile] = useState<File | null>(
    null
  );
  const [enrollmentData, setEnrollmentData] = useState({
    courseId: "",
    studentId: "",
    enrollmentType: "manual" as "manual" | "self" | "api" | "bulk",
    notes: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "",
    subcategory: "",
    credits: 0,
    learningHours: 0,
    practicalHours: 0,
    department: "",
    faculty: "",
    description: "",
    status: "Draft",
    startDate: "",
    endDate: "",
    type: "Mandatory" as "Mandatory" | "Elective",
    maxCapacity: 0,
    outcomes: [] as string[],
    competencyScale: "",
    activities: [] as string[],
    prerequisites: [] as string[],
    badges: [] as string[],
    certificates: [] as string[],
    enrollmentMode: "manual" as "manual" | "self" | "api" | "bulk",
    proctoring: false,
    adaptiveLearning: false,
    virtualClassroom: false,
    collaborationTools: [] as string[],
    contentTypes: [] as string[],
    gamificationEnabled: false,
    notifications: [] as string[],
    integrations: [] as string[],
  });

  // Form data for other entities
  const [learningPathFormData, setLearningPathFormData] = useState({
    name: "",
    description: "",
    courses: [] as string[],
    sequencing: "linear" as "linear" | "adaptive" | "flexible",
    restrictions: [] as string[],
    prerequisites: [] as string[],
    estimatedDuration: 0,
  });

  const [notificationFormData, setNotificationFormData] = useState({
    name: "",
    type: "email" as "email" | "sms" | "push" | "in-app",
    trigger: "",
    subject: "",
    content: "",
    active: true,
  });

  const [virtualSessionFormData, setVirtualSessionFormData] = useState({
    courseId: "",
    title: "",
    platform: "zoom" as "zoom" | "teams" | "meet" | "webex",
    scheduledDate: "",
    duration: 60,
    attendees: 0,
    status: "scheduled" as "scheduled" | "ongoing" | "completed" | "cancelled",
    recordingAvailable: false,
  });

  const [assignmentFormData, setAssignmentFormData] = useState({
    courseId: "",
    title: "",
    description: "",
    dueDate: "",
    maxPoints: 100,
    submissions: 0,
    plagiarismCheck: true,
    autoGrading: false,
    status: "draft" as "active" | "closed" | "draft",
  });

  const [assessmentFormData, setAssessmentFormData] = useState({
    courseId: "",
    title: "",
    type: "quiz" as "quiz" | "exam" | "survey" | "assignment",
    questions: 10,
    duration: 30,
    attempts: 1,
    autoGrade: true,
    proctored: false,
    status: "draft" as "active" | "closed" | "draft",
  });

  const [certificateFormData, setCertificateFormData] = useState({
    courseId: "",
    studentId: "",
    template: "completion",
    issueDate: "",
    qrCode: "",
    verificationUrl: "",
    status: "issued" as "issued" | "revoked" | "expired",
  });

  // Selected items state - some already declared above

  // Additional form data - already declared above

  console.log(user?.role);

  const filteredCourses = (courses || []).filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.faculty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || course.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || course.status.toLowerCase() === statusFilter;
    const matchesType =
      typeFilter === "all" || course.type.toLowerCase() === typeFilter;

    const hasAccess =
      user?.role === "super-admin" ||
      user?.role === "admin" ||
      user?.role === "faculty" ||
      (user?.role === "student" &&
        (course.status === "Published" || course.status === "Active")) ||
      (user?.role === "parent" &&
        (course.status === "Published" || course.status === "Active"));

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus &&
      matchesType &&
      hasAccess
    );
  });

  const stats = {
    total: courses.length,
    active: courses.filter((c) => c.status === "Active").length,
    enrolled: courses.reduce((sum, c) => sum + c.enrolled, 0),
    avgCompletion: Math.round(
      courses.reduce((sum, c) => sum + c.completion, 0) / courses.length
    ),
    categories: new Set(courses.map((c) => c.category)).size,
    totalCapacity: courses.reduce((sum, c) => sum + c.maxCapacity, 0),
    certificatesIssued: courses.reduce(
      (sum, c) => sum + c.certificatesGenerated,
      0
    ),
    virtualSessions: virtualSessions.length,
    totalAssignments: courses.reduce((sum, c) => sum + c.assignments, 0),
    totalAssessments: courses.reduce((sum, c) => sum + c.assessments, 0),
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      category: "",
      subcategory: "",
      credits: 0,
      learningHours: 0,
      practicalHours: 0,
      department: "",
      faculty: "",
      description: "",
      status: "Draft",
      startDate: "",
      endDate: "",
      type: "Mandatory",
      maxCapacity: 0,
      outcomes: [],
      competencyScale: "",
      activities: [],
      prerequisites: [],
      badges: [],
      certificates: [],
      enrollmentMode: "manual",
      proctoring: false,
      adaptiveLearning: false,
      virtualClassroom: false,
      collaborationTools: [],
      contentTypes: [],
      gamificationEnabled: false,
      notifications: [],
      integrations: [],
    });
  };

  const handleCreate = () => {
    const newCourse: Course = {
      id: `C${String(courses.length + 1).padStart(3, "0")}`,
      ...formData,
      students: 0,
      completion: 0,
      rating: 0,
      enrolled: 0,
      cohorts: [],
      assignments: 0,
      assessments: 0,
      discussions: 0,
      lessonPlans: 0,
      certificatesGenerated: 0,
    };
    setCourses([...courses, newCourse]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (selectedCourse) {
      setCourses(
        courses.map((course) =>
          course.id === selectedCourse.id ? { ...course, ...formData } : course
        )
      );
      setIsEditDialogOpen(false);
      setSelectedCourse(null);
      resetForm();
    }
  };

  const handleDelete = (courseId: string) => {
    setCourses(courses.filter((course) => course.id !== courseId));
  };

  const handleDuplicate = (course: Course) => {
    const duplicatedCourse: Course = {
      ...course,
      id: `C${String(courses.length + 1).padStart(3, "0")}`,
      name: `${course.name} (Copy)`,
      code: `${course.code}_COPY`,
      status: "Draft",
      students: 0,
      enrolled: 0,
      completion: 0,
    };
    setCourses([...courses, duplicatedCourse]);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      name: course.name,
      code: course.code,
      category: course.category,
      subcategory: course.subcategory,
      credits: course.credits,
      learningHours: course.learningHours,
      practicalHours: course.practicalHours,
      department: course.department,
      faculty: course.faculty,
      description: course.description,
      status: course.status,
      startDate: course.startDate,
      endDate: course.endDate,
      type: course.type,
      maxCapacity: course.maxCapacity,
      outcomes: course.outcomes,
      competencyScale: course.competencyScale,
      activities: course.activities,
      prerequisites: course.prerequisites,
      badges: course.badges,
      certificates: course.certificates,
      enrollmentMode: course.enrollmentMode,
      proctoring: course.proctoring,
      adaptiveLearning: course.adaptiveLearning,
      virtualClassroom: course.virtualClassroom,
      collaborationTools: course.collaborationTools,
      contentTypes: course.contentTypes,
      gamificationEnabled: course.gamificationEnabled,
      notifications: course.notifications,
      integrations: course.integrations,
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (course: Course) => {
    setSelectedCourse(course);
    setIsViewDialogOpen(true);
  };

  // Edit dialog openers for other entities
  const openEditLearningPathDialog = (path: LearningPath) => {
    setSelectedLearningPath(path);
    setLearningPathFormData({
      name: path.name,
      description: path.description,
      courses: path.courses,
      sequencing: path.sequencing,
      restrictions: path.restrictions,
      prerequisites: path.prerequisites,
      estimatedDuration: path.estimatedDuration,
    });
    setIsEditLearningPathDialogOpen(true);
  };

  const openEditNotificationDialog = (notification: NotificationTemplate) => {
    setSelectedNotification(notification);
    setNotificationFormData({
      name: notification.name,
      type: notification.type,
      trigger: notification.trigger,
      subject: notification.subject,
      content: notification.content,
      active: notification.active,
    });
    setIsEditNotificationDialogOpen(true);
  };

  const openEditVirtualSessionDialog = (session: VirtualSession) => {
    setSelectedVirtualSession(session);
    setVirtualSessionFormData({
      courseId: session.courseId,
      title: session.title,
      platform: session.platform,
      scheduledDate: session.scheduledDate,
      duration: session.duration,
      attendees: session.attendees,
      status: session.status,
      recordingAvailable: session.recordingAvailable,
    });
    setIsEditVirtualSessionDialogOpen(true);
  };

  const openEditAssignmentDialog = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setAssignmentFormData({
      courseId: assignment.courseId,
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      maxPoints: assignment.maxPoints,
      submissions: assignment.submissions,
      plagiarismCheck: assignment.plagiarismCheck,
      autoGrading: assignment.autoGrading,
      status: assignment.status,
    });
    setIsEditAssignmentDialogOpen(true);
  };

  const openEditAssessmentDialog = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setAssessmentFormData({
      courseId: assessment.courseId,
      title: assessment.title,
      type: assessment.type,
      questions: assessment.questions,
      duration: assessment.duration,
      attempts: assessment.attempts,
      autoGrade: assessment.autoGrade,
      proctored: assessment.proctored,
      status: assessment.status,
    });
    setIsEditAssessmentDialogOpen(true);
  };

  const openEditCertificateDialog = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setCertificateFormData({
      courseId: certificate.courseId,
      studentId: certificate.studentId,
      template: certificate.template,
      issueDate: certificate.issueDate,
      qrCode: certificate.qrCode,
      verificationUrl: certificate.verificationUrl,
      status: certificate.status,
    });
    setIsEditCertificateDialogOpen(true);
  };

  const openViewEnrollmentDialog = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsViewEnrollmentDialogOpen(true);
  };

  const openEditEnrollmentDialog = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setEnrollmentData({
      courseId: enrollment.courseId,
      studentId: enrollment.studentId,
      enrollmentType: enrollment.enrollmentType,
      notes: "",
    });
    setIsEnrollmentDialogOpen(true);
  };

  const handleArrayFieldChange = (
    field: keyof typeof formData,
    value: string,
    checked: boolean
  ) => {
    if (Array.isArray(formData[field])) {
      setFormData((prev) => ({
        ...prev,
        [field]: checked
          ? [...(prev[field] as string[]), value]
          : (prev[field] as string[]).filter((item) => item !== value),
      }));
    }
  };

  const handleEnrollStudent = () => {
    const newEnrollment: Enrollment = {
      id: `E${String(enrollments.length + 1).padStart(3, "0")}`,
      courseId: enrollmentData.courseId,
      studentId: enrollmentData.studentId,
      studentName: `Student ${enrollmentData.studentId}`,
      enrollmentDate: new Date().toISOString().split("T")[0],
      status: "enrolled",
      progress: 0,
      lastActivity: new Date().toISOString(),
      grade: "",
      enrollmentType: enrollmentData.enrollmentType,
    };
    setEnrollments([...enrollments, newEnrollment]);

    setCourses(
      courses.map((course) =>
        course.id === enrollmentData.courseId
          ? { ...course, enrolled: course.enrolled + 1 }
          : course
      )
    );

    setIsEnrollmentDialogOpen(false);
    setEnrollmentData({
      courseId: "",
      studentId: "",
      enrollmentType: "manual",
      notes: "",
    });
  };

  const handleBulkEnrollmentFromFile = () => {
    if (bulkEnrollmentFile) {
      setIsBulkEnrollmentDialogOpen(false);
      setBulkEnrollmentFile(null);
    }
  };

  const handleCreateVirtualSession = (courseId: string) => {
    const newSession: VirtualSession = {
      id: `VS${String(virtualSessions.length + 1).padStart(3, "0")}`,
      courseId,
      title: `Virtual Session for ${
        courses.find((c) => c.id === courseId)?.name
      }`,
      platform: "zoom",
      scheduledDate: new Date().toISOString(),
      duration: 60,
      attendees: 0,
      status: "scheduled",
      recordingAvailable: false,
    };
    setVirtualSessions([...virtualSessions, newSession]);
  };

  const handleCreateAssignment = (courseId: string) => {
    const newAssignment: Assignment = {
      id: `A${String(assignments.length + 1).padStart(3, "0")}`,
      courseId,
      title: "New Assignment",
      description: "Assignment description",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      maxPoints: 100,
      submissions: 0,
      plagiarismCheck: true,
      autoGrading: false,
      status: "draft",
    };
    setAssignments([...assignments, newAssignment]);

    setCourses(
      courses.map((course) =>
        course.id === courseId
          ? { ...course, assignments: course.assignments + 1 }
          : course
      )
    );
  };

  const handleCreateAssessment = (courseId: string) => {
    const newAssessment: Assessment = {
      id: `AS${String(assessments.length + 1).padStart(3, "0")}`,
      courseId,
      title: "New Assessment",
      type: "quiz",
      questions: 10,
      duration: 30,
      attempts: 1,
      autoGrade: true,
      proctored: false,
      status: "draft",
    };
    setAssessments([...assessments, newAssessment]);

    setCourses(
      courses.map((course) =>
        course.id === courseId
          ? { ...course, assessments: course.assessments + 1 }
          : course
      )
    );
  };

  const handleGenerateCertificate = (courseId: string, studentId: string) => {
    const newCertificate: Certificate = {
      id: `CERT${String(certificates.length + 1).padStart(3, "0")}`,
      courseId,
      studentId,
      template: "default",
      issueDate: new Date().toISOString().split("T")[0],
      qrCode: `QR${Math.random().toString(36).substring(7)}`,
      verificationUrl: `https://verify.lms.edu/cert/${certificates.length + 1}`,
      status: "issued",
    };
    setCertificates([...certificates, newCertificate]);

    setCourses(
      courses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              certificatesGenerated: course.certificatesGenerated + 1,
            }
          : course
      )
    );
  };

  // CRUD Operations for Learning Paths
  const handleCreateLearningPath = () => {
    const newLearningPath: LearningPath = {
      id: `LP${String(learningPaths.length + 1).padStart(3, "0")}`,
      ...learningPathFormData,
    };
    setLearningPaths([...learningPaths, newLearningPath]);
    setIsCreateLearningPathDialogOpen(false);
    resetLearningPathForm();
  };

  const handleUpdateLearningPath = () => {
    if (selectedLearningPath) {
      setLearningPaths(
        learningPaths.map((path) =>
          path.id === selectedLearningPath.id
            ? { ...path, ...learningPathFormData }
            : path
        )
      );
      setIsEditLearningPathDialogOpen(false);
      setSelectedLearningPath(null);
      resetLearningPathForm();
    }
  };

  const handleDeleteLearningPath = (pathId: string) => {
    setLearningPaths(learningPaths.filter((path) => path.id !== pathId));
  };

  const resetLearningPathForm = () => {
    setLearningPathFormData({
      name: "",
      description: "",
      courses: [],
      sequencing: "linear",
      restrictions: [],
      prerequisites: [],
      estimatedDuration: 0,
    });
  };

  // CRUD Operations for Notifications
  const handleCreateNotification = () => {
    const newNotification: NotificationTemplate = {
      id: `NT${String(notificationTemplates.length + 1).padStart(3, "0")}`,
      ...notificationFormData,
    };
    setNotificationTemplates([...notificationTemplates, newNotification]);
    setIsCreateNotificationDialogOpen(false);
    resetNotificationForm();
  };

  const handleUpdateNotification = () => {
    if (selectedNotification) {
      setNotificationTemplates(
        notificationTemplates.map((template) =>
          template.id === selectedNotification.id
            ? { ...template, ...notificationFormData }
            : template
        )
      );
      setIsEditNotificationDialogOpen(false);
      setSelectedNotification(null);
      resetNotificationForm();
    }
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotificationTemplates(
      notificationTemplates.filter((template) => template.id !== notificationId)
    );
  };

  const resetNotificationForm = () => {
    setNotificationFormData({
      name: "",
      type: "email",
      trigger: "",
      subject: "",
      content: "",
      active: true,
    });
  };

  // CRUD Operations for Virtual Sessions
  const handleCreateVirtualSessionComplete = () => {
    const newSession: VirtualSession = {
      id: `VS${String(virtualSessions.length + 1).padStart(3, "0")}`,
      ...virtualSessionFormData,
    };
    setVirtualSessions([...virtualSessions, newSession]);
    setIsCreateVirtualSessionDialogOpen(false);
    resetVirtualSessionForm();
  };

  const handleUpdateVirtualSession = () => {
    if (selectedVirtualSession) {
      setVirtualSessions(
        virtualSessions.map((session) =>
          session.id === selectedVirtualSession.id
            ? { ...session, ...virtualSessionFormData }
            : session
        )
      );
      setIsEditVirtualSessionDialogOpen(false);
      setSelectedVirtualSession(null);
      resetVirtualSessionForm();
    }
  };

  const handleDeleteVirtualSession = (sessionId: string) => {
    setVirtualSessions(
      virtualSessions.filter((session) => session.id !== sessionId)
    );
  };

  const resetVirtualSessionForm = () => {
    setVirtualSessionFormData({
      courseId: "",
      title: "",
      platform: "zoom",
      scheduledDate: "",
      duration: 60,
      attendees: 0,
      status: "scheduled",
      recordingAvailable: false,
    });
  };

  // CRUD Operations for Assignments
  const handleCreateAssignmentComplete = () => {
    const newAssignment: Assignment = {
      id: `A${String(assignments.length + 1).padStart(3, "0")}`,
      ...assignmentFormData,
    };
    setAssignments([...assignments, newAssignment]);
    setIsCreateAssignmentDialogOpen(false);
    resetAssignmentForm();
  };

  const handleUpdateAssignment = () => {
    if (selectedAssignment) {
      setAssignments(
        assignments.map((assignment) =>
          assignment.id === selectedAssignment.id
            ? { ...assignment, ...assignmentFormData }
            : assignment
        )
      );
      setIsEditAssignmentDialogOpen(false);
      setSelectedAssignment(null);
      resetAssignmentForm();
    }
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    setAssignments(
      assignments.filter((assignment) => assignment.id !== assignmentId)
    );
  };

  const resetAssignmentForm = () => {
    setAssignmentFormData({
      courseId: "",
      title: "",
      description: "",
      dueDate: "",
      maxPoints: 100,
      submissions: 0,
      plagiarismCheck: true,
      autoGrading: false,
      status: "draft",
    });
  };

  // CRUD Operations for Assessments
  const handleCreateAssessmentComplete = () => {
    const newAssessment: Assessment = {
      id: `AS${String(assessments.length + 1).padStart(3, "0")}`,
      ...assessmentFormData,
    };
    setAssessments([...assessments, newAssessment]);
    setIsCreateAssessmentDialogOpen(false);
    resetAssessmentForm();
  };

  const handleUpdateAssessment = () => {
    if (selectedAssessment) {
      setAssessments(
        assessments.map((assessment) =>
          assessment.id === selectedAssessment.id
            ? { ...assessment, ...assessmentFormData }
            : assessment
        )
      );
      setIsEditAssessmentDialogOpen(false);
      setSelectedAssessment(null);
      resetAssessmentForm();
    }
  };

  const handleDeleteAssessment = (assessmentId: string) => {
    setAssessments(
      assessments.filter((assessment) => assessment.id !== assessmentId)
    );
  };

  const resetAssessmentForm = () => {
    setAssessmentFormData({
      courseId: "",
      title: "",
      type: "quiz",
      questions: 10,
      duration: 30,
      attempts: 1,
      autoGrade: true,
      proctored: false,
      status: "draft",
    });
  };

  // CRUD Operations for Certificates
  const handleCreateCertificateComplete = () => {
    const newCertificate: Certificate = {
      id: `CERT${String(certificates.length + 1).padStart(3, "0")}`,
      ...certificateFormData,
      qrCode: `QR${Math.random().toString(36).substring(7)}`,
      verificationUrl: `https://verify.lms.edu/cert/${certificates.length + 1}`,
    };
    setCertificates([...certificates, newCertificate]);
    setIsCreateCertificateDialogOpen(false);
    resetCertificateForm();
  };

  const handleUpdateCertificate = () => {
    if (selectedCertificate) {
      setCertificates(
        certificates.map((certificate) =>
          certificate.id === selectedCertificate.id
            ? { ...certificate, ...certificateFormData }
            : certificate
        )
      );
      setIsEditCertificateDialogOpen(false);
      setSelectedCertificate(null);
      resetCertificateForm();
    }
  };

  const handleDeleteCertificate = (certificateId: string) => {
    setCertificates(
      certificates.filter((certificate) => certificate.id !== certificateId)
    );
  };

  const resetCertificateForm = () => {
    setCertificateFormData({
      courseId: "",
      studentId: "",
      template: "completion",
      issueDate: "",
      qrCode: "",
      verificationUrl: "",
      status: "issued",
    });
  };

  // CRUD Operations for Enrollments
  const handleUpdateEnrollment = () => {
    if (selectedEnrollment) {
      setEnrollments(
        enrollments.map((enrollment) =>
          enrollment.id === selectedEnrollment.id
            ? { ...enrollment, ...enrollmentData }
            : enrollment
        )
      );
      setIsEnrollmentDialogOpen(false);
      setSelectedEnrollment(null);
      setEnrollmentData({
        courseId: "",
        studentId: "",
        enrollmentType: "manual",
        notes: "",
      });
    }
  };

  const handleDeleteEnrollment = (enrollmentId: string) => {
    setEnrollments(
      enrollments.filter((enrollment) => enrollment.id !== enrollmentId)
    );
  };

  // Advanced Course Management Functions
  const handleBulkDuplicate = () => {
    const duplicatedCourses = selectedCourses
      .map((courseId) => {
        const course = courses.find((c) => c.id === courseId);
        if (course) {
          return {
            ...course,
            id: `C${String(
              courses.length + selectedCourses.indexOf(courseId) + 1
            ).padStart(3, "0")}`,
            name: `${course.name} (Copy)`,
            code: `${course.code}_COPY`,
            status: "Draft",
            enrolled: 0,
            completion: 0,
          };
        }
        return null;
      })
      .filter(Boolean) as Course[];

    setCourses([...courses, ...duplicatedCourses]);
    setSelectedCourses([]);
    setIsBulkOperationsDialogOpen(false);
  };

  const handleBulkArchive = () => {
    setCourses(
      courses.map((course) =>
        selectedCourses.includes(course.id)
          ? { ...course, status: "Archived" }
          : course
      )
    );
    setSelectedCourses([]);
    setIsBulkOperationsDialogOpen(false);
  };

  const handleBulkEnrollment = () => {
    // Implementation for bulk enrollment
    alert("Bulk enrollment functionality executed for selected courses");
    setSelectedCourses([]);
    setIsBulkOperationsDialogOpen(false);
  };

  const handleBulkGenerateCertificates = () => {
    selectedCourses.forEach((courseId) => {
      const course = courses.find((c) => c.id === courseId);
      if (course) {
        // Generate certificates for all enrolled students in selected courses
        const enrolledStudents = enrollments.filter(
          (e) => e.courseId === courseId
        );
        enrolledStudents.forEach((enrollment) => {
          const newCertificate: Certificate = {
            id: `CERT${String(certificates.length + 1).padStart(3, "0")}`,
            courseId,
            studentId: enrollment.studentId,
            template: "completion",
            issueDate: new Date().toISOString().split("T")[0],
            qrCode: `QR${Math.random().toString(36).substring(7)}`,
            verificationUrl: `https://verify.lms.edu/cert/${
              certificates.length + 1
            }`,
            status: "issued",
          };
          setCertificates((prev) => [...prev, newCertificate]);
        });
      }
    });
    setSelectedCourses([]);
    setIsBulkOperationsDialogOpen(false);
  };

  // Template Functions
  const handleApplyTemplate = (templateType: string) => {
    if (selectedCourses.length === 0) return;

    const templateConfigs = {
      "computer-science": {
        category: "Computer Science",
        contentTypes: ["Video Lectures", "Code Examples", "Interactive Labs"],
        activities: ["Assignments", "Assessments", "Peer Review"],
        integrations: ["GitHub", "Stack Overflow"],
      },
      engineering: {
        category: "Computer Engineering",
        contentTypes: ["Video Lectures", "Simulations", "CAD Files"],
        activities: ["Projects", "Lab Work", "Design Reviews"],
        integrations: ["AutoCAD", "MATLAB"],
      },
      business: {
        category: "Business",
        contentTypes: ["Case Studies", "Video Lectures", "Interactive Tools"],
        activities: ["Case Analysis", "Group Projects", "Presentations"],
        integrations: ["LinkedIn Learning", "Salesforce"],
      },
    };

    const config =
      templateConfigs[templateType as keyof typeof templateConfigs];
    if (config) {
      setCourses(
        courses.map((course) =>
          selectedCourses.includes(course.id)
            ? { ...course, ...config }
            : course
        )
      );
    }
    setSelectedCourses([]);
    setIsTemplatesDialogOpen(false);
  };

  // Integration Functions
  const handleLTIIntegration = () => {
    alert("LTI Integration configured for selected courses");
    setIsIntegrationsDialogOpen(false);
  };

  const handleMoodleSync = () => {
    alert("Moodle synchronization initiated");
    setIsIntegrationsDialogOpen(false);
  };

  const handleCanvasConnect = () => {
    alert("Canvas connection established");
    setIsIntegrationsDialogOpen(false);
  };

  const handleBlackboardLink = () => {
    alert("Blackboard link configured");
    setIsIntegrationsDialogOpen(false);
  };

  // Export Functions
  const handleExportCSV = () => {
    alert("Exporting data as CSV...");
    setIsExportOptionsDialogOpen(false);
  };

  const handleExportExcel = () => {
    alert("Exporting data as Excel...");
    setIsExportOptionsDialogOpen(false);
  };

  const handleExportGrades = () => {
    alert("Exporting grades...");
    setIsExportOptionsDialogOpen(false);
  };

  const handleExportAnalytics = () => {
    alert("Exporting analytics...");
    setIsExportOptionsDialogOpen(false);
  };

  // Question Bank Functions
  const handleCreateQuestionBank = () => {
    alert("Creating new question bank...");
    setIsQuestionBankDialogOpen(false);
  };

  const handleViewQuestionBank = () => {
    alert("Opening question bank view...");
  };

  const handleEditQuestionBank = () => {
    alert("Opening question bank editor...");
  };

  const handleSaveDraft = () => {
    alert("Question saved as draft");
    setIsCreateQuestionDialogOpen(false);
  };

  const handleAddQuestion = () => {
    alert("Question added successfully");
    setIsCreateQuestionDialogOpen(false);
  };

  // Parent CRUD Operations
  const handleCreateEnrollmentRequest = () => {
    const newRequest = {
      id: `REQ${Date.now()}`,
      studentId: user?.id || "child-id",
      courseId: selectedCourse?.id || "",
      parentId: user?.id || "",
      reason: "",
      status: "pending",
      createdDate: new Date().toISOString().split("T")[0],
      requestType: "enrollment",
    };
    alert(`Enrollment request created for course: ${selectedCourse?.name}`);
    setIsCreateCourseDialogOpen(false);
  };

  const handleCreateParentMessage = () => {
    const newMessage = {
      id: `MSG${Date.now()}`,
      from: user?.id || "",
      to: "",
      subject: "",
      message: "",
      courseId: "",
      priority: "normal",
      status: "sent",
      createdDate: new Date().toISOString(),
    };
    alert("Message sent to teacher successfully");
  };

  const handleUpdateNotificationPreferences = (preferences: any) => {
    const updatedPreferences = {
      userId: user?.id,
      emailNotifications: preferences.emailNotifications,
      smsNotifications: preferences.smsNotifications,
      assignmentReminders: preferences.assignmentReminders,
      gradeUpdates: preferences.gradeUpdates,
      teacherMessages: preferences.teacherMessages,
      weeklyReports: preferences.weeklyReports,
    };
    alert("Notification preferences updated successfully");
  };

  const handleDeleteParentData = (dataType: string, id: string) => {
    if (window.confirm(`Are you sure you want to delete this ${dataType}?`)) {
      alert(`${dataType} deleted successfully`);
    }
  };

  const handleCreateProgressReport = () => {
    const newReport = {
      id: `RPT${Date.now()}`,
      studentId: user?.id || "child-id",
      parentId: user?.id || "",
      reportType: "progress",
      startDate: "",
      endDate: "",
      courses: [],
      generatedDate: new Date().toISOString(),
      status: "generated",
    };
    alert("Progress report generated successfully");
  };

  const handleUpdateParentSettings = (settings: any) => {
    const updatedSettings = {
      ...settings,
      userId: user?.id,
      lastUpdated: new Date().toISOString(),
    };
    alert("Parent settings updated successfully");
  };

  // Student CRUD Operations
  const handleCreateStudentSubmission = (assignmentId: string) => {
    const newSubmission = {
      id: `SUB${Date.now()}`,
      assignmentId,
      studentId: user?.id || "",
      content: "",
      files: [],
      submittedDate: new Date().toISOString(),
      status: "submitted",
      grade: null,
    };
    alert("Assignment submitted successfully");
  };

  const handleUpdateStudentSubmission = (submissionId: string) => {
    alert("Submission updated successfully");
  };

  const handleDeleteStudentSubmission = (submissionId: string) => {
    if (window.confirm("Are you sure you want to withdraw this submission?")) {
      alert("Submission withdrawn successfully");
    }
  };

  const handleCreateDiscussionPost = (topicId: string) => {
    const newPost = {
      id: `POST${Date.now()}`,
      topicId,
      authorId: user?.id || "",
      content: "",
      attachments: [],
      createdDate: new Date().toISOString(),
      likes: 0,
      replies: [],
    };
    alert("Discussion post created successfully");
  };

  const handleUpdateDiscussionPost = (postId: string) => {
    alert("Discussion post updated successfully");
  };

  const handleDeleteDiscussionPost = (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      alert("Discussion post deleted successfully");
    }
  };

  // Add handlers for new functionality
  const handleContinueLearning = (course: Course) => {
    setSelectedCourseForView(course);
    setCurrentView('learning');
  };

  const handleOpenDiscussion = (course: Course) => {
    setSelectedCourseForView(course);
    setCurrentView('discussion');
  };

  const handleBackToCourses = () => {
    setCurrentView('courses');
    setSelectedCourseForView(null);
    setSelectedLesson(null);
  };

  // Handle lesson actions
  const handleLessonAction = (lesson: any, action: 'continue' | 'review') => {
    setSelectedLesson(lesson);
    setLessonMode(action);
    setCurrentView('lesson');

    if (action === 'continue') {
      toast.success(`Starting lesson: ${lesson.title}`);
    } else if (action === 'review') {
      toast.success(`Opening lesson for review: ${lesson.title}`);
    }
  };

  const handleBackToLearning = () => {
    setCurrentView('learning');
    setSelectedLesson(null);
  };

  // Render learning view for continuing course
  const renderLearningView = () => {
    if (!selectedCourseForView) return null;

    return (
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBackToCourses}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{selectedCourseForView.name}</h1>
            <p className="text-muted-foreground">Continue Learning</p>
          </div>
        </div>

        {/* Course Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Course Progress</CardTitle>
            <CardDescription>Your learning journey in this course</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Overall Progress</span>
                <span className="font-semibold">{selectedCourseForView.completion}%</span>
              </div>
              <Progress value={selectedCourseForView.completion} className="w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Course Content */}
        <Card>
          <CardHeader>
            <CardTitle>Course Content</CardTitle>
            <CardDescription>Continue from where you left off</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Introduction to Course", status: "completed", duration: "15 min" },
                { title: "Module 1: Basic Concepts", status: "completed", duration: "45 min" },
                { title: "Module 2: Advanced Topics", status: "current", duration: "60 min" },
                { title: "Module 3: Practical Applications", status: "locked", duration: "50 min" },
                { title: "Final Assessment", status: "locked", duration: "30 min" }
              ].map((lesson, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {lesson.status === "completed" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : lesson.status === "current" ? (
                      <PlayCircle className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                      <h4 className="font-medium">{lesson.title}</h4>
                      <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={lesson.status === "current" ? "default" : lesson.status === "completed" ? "outline" : "ghost"}
                    disabled={lesson.status === "locked"}
                    onClick={() => {
                      if (lesson.status === "current") {
                        handleLessonAction(lesson, 'continue');
                      } else if (lesson.status === "completed") {
                        handleLessonAction(lesson, 'review');
                      }
                    }}
                  >
                    {lesson.status === "completed" ? "Review" : lesson.status === "current" ? "Continue" : "Locked"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Study Materials */}
        <Card>
          <CardHeader>
            <CardTitle>Study Materials</CardTitle>
            <CardDescription>Additional resources for this course</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <FileText className="h-5 w-5 text-blue-500" />
                <div>
                  <h4 className="font-medium">Course Notes</h4>
                  <p className="text-sm text-muted-foreground">PDF • 24 pages</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Video className="h-5 w-5 text-purple-500" />
                <div>
                  <h4 className="font-medium">Video Lectures</h4>
                  <p className="text-sm text-muted-foreground">MP4 • 12 videos</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render discussion view for course discussions
  const renderDiscussionView = () => {
    if (!selectedCourseForView) return null;

    return (
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBackToCourses}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{selectedCourseForView.name}</h1>
            <p className="text-muted-foreground">Course Discussion</p>
          </div>
        </div>

        {/* Discussion Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{selectedCourseForView.discussions}</p>
                  <p className="text-sm text-muted-foreground">Total Discussions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{selectedCourseForView.students}</p>
                  <p className="text-sm text-muted-foreground">Active Participants</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">24h</p>
                  <p className="text-sm text-muted-foreground">Last Activity</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create New Discussion */}
        <Card>
          <CardHeader>
            <CardTitle>Start New Discussion</CardTitle>
            <CardDescription>Ask a question or start a topic</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input placeholder="Discussion topic..." />
              <Textarea placeholder="Your question or topic details..." rows={3} />
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Discussion
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Discussions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Discussions</CardTitle>
            <CardDescription>Latest topics and questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Understanding Module 2 Concepts",
                  author: "John Doe",
                  replies: 5,
                  lastReply: "2 hours ago",
                  solved: false
                },
                {
                  title: "Assignment 1 Submission Guidelines",
                  author: "Jane Smith",
                  replies: 12,
                  lastReply: "5 hours ago",
                  solved: true
                },
                {
                  title: "Group Project Formation",
                  author: "Mike Johnson",
                  replies: 8,
                  lastReply: "1 day ago",
                  solved: false
                }
              ].map((discussion, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{discussion.title}</h4>
                      {discussion.solved && (
                        <Badge variant="default" className="text-xs">Solved</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      by {discussion.author} • {discussion.replies} replies • {discussion.lastReply}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render lesson view for individual lesson content
  const renderLessonView = () => {
    if (!selectedLesson || !selectedCourseForView) return null;

    return (
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBackToLearning}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{selectedLesson.title}</h1>
            <p className="text-muted-foreground">
              {lessonMode === 'review' ? 'Review Mode' : 'Learning Mode'} • {selectedCourseForView.name}
            </p>
          </div>
        </div>

        {/* Lesson Progress (for continue mode) */}
        {lessonMode === 'continue' && (
          <Card>
            <CardHeader>
              <CardTitle>Lesson Progress</CardTitle>
              <CardDescription>Pick up where you left off</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Progress in this lesson</span>
                  <span className="font-semibold">65%</span>
                </div>
                <Progress value={65} className="w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lesson Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lesson Content</CardTitle>
                <CardDescription>
                  Duration: {selectedLesson.duration} •
                  {lessonMode === 'review' ? ' Reviewing completed lesson' : ' Continue from last position'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Video Player Placeholder */}
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-center">
                    <Video className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Video content would load here</p>
                    <p className="text-sm text-gray-500">Duration: {selectedLesson.duration}</p>
                  </div>
                </div>

                {/* Lesson Actions */}
                <div className="flex gap-4">
                  <Button className="flex-1">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    {lessonMode === 'review' ? 'Rewatch Lesson' : 'Continue Playing'}
                  </Button>
                  {selectedLesson.status === 'completed' && (
                    <Button variant="outline">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Lesson Materials */}
            <Card>
              <CardHeader>
                <CardTitle>Lesson Materials</CardTitle>
                <CardDescription>Download and study materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <h4 className="font-medium">Lesson Notes</h4>
                        <p className="text-sm text-muted-foreground">PDF • 8 pages</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-green-500" />
                      <div>
                        <h4 className="font-medium">Practice Exercises</h4>
                        <p className="text-sm text-muted-foreground">Interactive • 12 questions</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Open
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Bookmark Lesson
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Take Notes
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Ask Question
                </Button>
              </CardContent>
            </Card>

            {/* Lesson Navigation */}
            <Card>
              <CardHeader>
                <CardTitle>Lesson Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start text-sm" disabled>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous: Module 1
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Next: Module 3
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Review Notes (for review mode) */}
            {lessonMode === 'review' && (
              <Card>
                <CardHeader>
                  <CardTitle>Previous Notes</CardTitle>
                  <CardDescription>Your notes from when you first completed this lesson</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    <p>• Key concept: Boolean algebra fundamentals</p>
                    <p>• Remember: K-map simplification rules</p>
                    <p>• Practice: More flip-flop examples needed</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  };

  const handleCreateStudentNote = (courseId: string) => {
    const newNote = {
      id: `NOTE${Date.now()}`,
      courseId,
      studentId: user?.id || "",
      title: "",
      content: "",
      tags: [],
      createdDate: new Date().toISOString(),
      isPrivate: true,
    };
    alert("Note created successfully");
  };

  const handleUpdateStudentNote = (noteId: string) => {
    alert("Note updated successfully");
  };

  const handleDeleteStudentNote = (noteId: string) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      alert("Note deleted successfully");
    }
  };

  const handleCreateStudentBookmark = (
    resourceId: string,
    resourceType: string
  ) => {
    const newBookmark = {
      id: `BM${Date.now()}`,
      studentId: user?.id || "",
      resourceId,
      resourceType,
      title: "",
      createdDate: new Date().toISOString(),
      tags: [],
    };
    alert("Resource bookmarked successfully");
  };

  const handleDeleteStudentBookmark = (bookmarkId: string) => {
    alert("Bookmark removed successfully");
  };

  // Faculty CRUD Operations Enhancement
  const handleCreateFacultyCourse = () => {
    const newCourse = {
      id: `FC${String(courses.length + 1).padStart(3, "0")}`,
      name: "",
      description: "",
      faculty: user?.name || "",
      credits: 3,
      duration: "16 weeks",
      level: "Intermediate",
      enrolled: 0,
      maxStudents: 100,
      startDate: new Date().toISOString().split("T")[0],
      status: "draft",
      category: "General",
      rating: 0,
      completion: 0,
    };
    setCourses([...courses, newCourse]);
    alert("Course created successfully");
    setIsCreateCourseDialogOpen(false);
  };

  const handleUpdateFacultyCourse = () => {
    if (selectedCourse) {
      const updatedCourses = courses.map((course) =>
        course.id === selectedCourse.id
          ? { ...course, ...selectedCourse }
          : course
      );
      setCourses(updatedCourses);
      alert("Course updated successfully");
      setIsEditCourseDialogOpen(false);
    }
  };

  const handleDeleteFacultyCourse = (courseId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    ) {
      setCourses(courses.filter((course) => course.id !== courseId));
      alert("Course deleted successfully");
    }
  };

  const handleCreateFacultyAssignment = (courseId: string) => {
    const newAssignment = {
      id: `FA${Date.now()}`,
      courseId,
      title: "",
      description: "",
      dueDate: "",
      maxPoints: 100,
      instructions: "",
      allowedFileTypes: ["pdf", "doc", "docx"],
      isGroupAssignment: false,
      createdBy: user?.id || "",
      createdDate: new Date().toISOString(),
      status: "draft",
    };
    setAssignments([...assignments, newAssignment]);
    alert("Assignment created successfully");
  };

  const handleUpdateFacultyAssignment = (assignmentId: string) => {
    alert("Assignment updated successfully");
  };

  const handleDeleteFacultyAssignment = (assignmentId: string) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      setAssignments(assignments.filter((a) => a.id !== assignmentId));
      alert("Assignment deleted successfully");
    }
  };

  const handleGradeSubmission = (
    submissionId: string,
    grade: number,
    feedback: string
  ) => {
    alert(`Submission graded: ${grade}/100. Feedback: ${feedback}`);
  };

  const handleCreateFacultyAnnouncement = (courseId: string) => {
    const newAnnouncement = {
      id: `ANN${Date.now()}`,
      courseId,
      title: "",
      content: "",
      priority: "normal",
      publishDate: new Date().toISOString(),
      authorId: user?.id || "",
      status: "published",
    };
    alert("Announcement created successfully");
  };

  // Admin CRUD Operations
  const handleCreateUser = (userData: any) => {
    const newUser = {
      id: `USR${Date.now()}`,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      status: "active",
      createdDate: new Date().toISOString(),
      lastLogin: null,
      permissions: [],
    };
    alert(
      `User ${userData.firstName} ${userData.lastName} created successfully`
    );
  };

  const handleUpdateUser = (userId: string, userData: any) => {
    alert(
      `User ${userData.firstName} ${userData.lastName} updated successfully`
    );
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete user ${userName}? This action cannot be undone.`
      )
    ) {
      alert(`User ${userName} deleted successfully`);
    }
  };

  const handleBulkImportUsers = (file: File) => {
    alert(
      `Bulk import started for ${file.name}. Users will be processed in the background.`
    );
  };

  const handleExportUsers = (format: string) => {
    alert(`Exporting users in ${format} format...`);
  };

  const handleCreateSystemReport = (reportType: string) => {
    const newReport = {
      id: `RPT${Date.now()}`,
      type: reportType,
      title: `${reportType} Report`,
      description: `Automated ${reportType.toLowerCase()} report`,
      generatedBy: user?.id || "",
      generatedDate: new Date().toISOString(),
      status: "generating",
      format: "pdf",
    };
    alert(
      `${reportType} report generation started. You will be notified when complete.`
    );
  };

  const handleUpdateSystemSettings = (settings: any) => {
    const updatedSettings = {
      ...settings,
      lastModifiedBy: user?.id,
      lastModifiedDate: new Date().toISOString(),
    };
    alert("System settings updated successfully");
  };

  const handleCreateSecurityAlert = (alertData: any) => {
    const newAlert = {
      id: `ALERT${Date.now()}`,
      type: alertData.type,
      severity: alertData.severity,
      message: alertData.message,
      userId: alertData.userId,
      ipAddress: alertData.ipAddress,
      timestamp: new Date().toISOString(),
      status: "active",
    };
    alert("Security alert logged successfully");
  };

  const handleUpdateSecuritySettings = (securitySettings: any) => {
    alert("Security settings updated successfully");
  };

  const handleCreatePermissionGroup = (groupData: any) => {
    const newGroup = {
      id: `GRP${Date.now()}`,
      name: groupData.name,
      description: groupData.description,
      permissions: groupData.permissions,
      roles: groupData.roles,
      createdBy: user?.id || "",
      createdDate: new Date().toISOString(),
    };
    alert(`Permission group "${groupData.name}" created successfully`);
  };

  const handleUpdatePermissionGroup = (groupId: string, groupData: any) => {
    alert(`Permission group "${groupData.name}" updated successfully`);
  };

  const handleDeletePermissionGroup = (groupId: string, groupName: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete permission group "${groupName}"?`
      )
    ) {
      alert(`Permission group "${groupName}" deleted successfully`);
    }
  };

  const handleCreateBackup = () => {
    const backup = {
      id: `BKP${Date.now()}`,
      type: "full",
      initiatedBy: user?.id || "",
      startTime: new Date().toISOString(),
      status: "in_progress",
    };
    alert("System backup started. This may take several minutes to complete.");
  };

  const handleRestoreBackup = (backupId: string) => {
    if (
      window.confirm(
        "Are you sure you want to restore from this backup? This will overwrite current data."
      )
    ) {
      alert(
        "Backup restoration started. System will be temporarily unavailable."
      );
    }
  };

  const handleCreateAuditLog = (action: string, details: any) => {
    const auditEntry = {
      id: `AUDIT${Date.now()}`,
      action,
      userId: user?.id || "",
      userRole: user?.role || "",
      timestamp: new Date().toISOString(),
      details,
      ipAddress: "0.0.0.0", // Would be actual IP in real implementation
      userAgent: navigator.userAgent,
    };
    // In real implementation, this would be logged automatically
    console.log("Audit log created:", auditEntry);
  };

  // Bulk Import Functions
  const handleChooseFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx,.xls,.csv,.xml,.zip";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setBulkImportFile(file);
      }
    };
    input.click();
  };

  const handleDownloadTemplate = () => {
    alert("Downloading import template...");
  };

  const handleImportQuestions = () => {
    if (bulkImportFile) {
      alert(`Importing questions from ${bulkImportFile.name}...`);
      setBulkImportFile(null);
      setIsBulkImportDialogOpen(false);
    }
  };

  const handleImportAssessment = () => {
    if (bulkImportFile) {
      alert(`Importing assessment from ${bulkImportFile.name}...`);
      setBulkImportFile(null);
      setIsBulkImportDialogOpen(false);
    }
  };

  const handleImportQTI = () => {
    if (bulkImportFile) {
      alert(`Importing QTI package from ${bulkImportFile.name}...`);
      setBulkImportFile(null);
      setIsBulkImportDialogOpen(false);
    }
  };

  // Filter Functions
  const handleResetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setTypeFilter("all");
    alert("Filters reset successfully");
  };

  const handleApplyFilters = () => {
    alert("Advanced filters applied");
    setIsAdvancedFilterDialogOpen(false);
  };

  // Analytics Functions
  const handleViewPerformance = () => {
    alert("Opening performance analytics...");
    setIsQuickAnalyticsDialogOpen(false);
  };

  const handleAnalyseQuestions = () => {
    alert("Analyzing question performance...");
    setIsQuickAnalyticsDialogOpen(false);
  };

  const handleTimePatterns = () => {
    alert("Analyzing time patterns...");
    setIsQuickAnalyticsDialogOpen(false);
  };

  const handleCheckAnomalies = () => {
    alert("Checking for anomalies...");
    setIsQuickAnalyticsDialogOpen(false);
  };

  // Assessment Export Functions
  const handleExportResults = () => {
    alert("Exporting assessment results...");
  };

  const handleExportQuestions = () => {
    alert("Exporting questions...");
  };

  const handleExportResponses = () => {
    alert("Exporting student responses...");
  };

  // Grading Functions
  const handleOpenGradingInterface = () => {
    alert("Opening grading interface...");
    setIsGradingInterfaceDialogOpen(true);
  };

  const handleContinueManualInterface = () => {
    alert("Continuing with manual grading interface...");
    setIsGradingInterfaceDialogOpen(false);
  };

  const handleStudentEnrollment = (courseId: string) => {
    if (!user?.id) return;

    const newEnrollment: Enrollment = {
      id: `E${String(enrollments.length + 1).padStart(3, "0")}`,
      courseId,
      studentId: user.id,
      studentName: user.name || "Student",
      enrollmentDate: new Date().toISOString().split("T")[0],
      status: "enrolled",
      progress: 0,
      lastActivity: new Date().toISOString(),
      grade: "",
      enrollmentType: "self",
    };

    setEnrollments([...enrollments, newEnrollment]);

    setCourses(
      courses.map((course) =>
        course.id === courseId
          ? { ...course, enrolled: course.enrolled + 1 }
          : course
      )
    );
  };

  const renderRoleBasedView = () => {
    // Handle different views based on currentView state
    if (currentView === 'learning' && selectedCourseForView) {
      return renderLearningView();
    }

    if (currentView === 'discussion' && selectedCourseForView) {
      return renderDiscussionView();
    }

    if (currentView === 'lesson' && selectedLesson && selectedCourseForView) {
      return renderLessonView();
    }

    // Show loading state while data is being fetched
    if (loading) {
      return (
        <div className="space-y-8">
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <div className="text-lg font-medium">Loading Courses...</div>
              <div className="text-sm text-gray-500 mt-2">
                Fetching course data for {user?.role}: {user?.name}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Department: {user?.department} | Institution:{" "}
                {user?.institutionCode}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Show data loading errors if any (but still show courses)
    if (dataLoadError) {
      console.warn("🚨 Data loading errors detected:", dataLoadError);
    }

    switch (user?.role) {
      case "super-admin":
        return renderAdminView(); // Super-admin gets same view as admin with full access
      case "admin":
        return renderAdminView();
      case "institution":
        return renderAdminView(); // Institution head gets admin-level access
      case "principal":
        return renderAdminView(); // Principal gets admin-level access
      case "hod":
        return renderFacultyView(); // HOD gets faculty-level access
      case "faculty":
        return renderFacultyView();
      case "staff":
        return renderStudentView(); // Staff gets student-level access (view courses)
      case "student":
        return renderStudentView();
      case "parent":
        return renderParentView();
      default:
        return renderGuestView();
    }
  };

  const renderAdminView = () => (
    <div className="space-y-8">
      {/* Role-specific Dashboard */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                {user?.role === "super-admin"
                  ? "Super Administrator"
                  : user?.role === "admin"
                    ? "Administrator"
                    : user?.role === "institution"
                      ? "Institution Head"
                      : "Principal"}{" "}
                Dashboard
              </CardTitle>
              <CardDescription>
                Role: {user?.role} | Available Operations:{" "}
                {currentCapabilities.operations.join(", ")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentStats.metrics?.map((metric, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="text-2xl font-bold text-blue-600">
                      {metric.value}
                    </div>
                    <div className="text-sm text-gray-600">{metric.label}</div>
                    <div
                      className={`text-xs ${metric.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                    >
                      {metric.change}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {currentActivities.slice(0, 4).map((activity, index) => (
                <div key={index} className="text-xs">
                  <div className="font-medium">{activity.action}</div>
                  <div className="text-gray-500">{activity.course}</div>
                  <div className="text-gray-400">{activity.time}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {currentNotifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.id}
                  className={`text-xs p-2 rounded ${
                    notification.type === "success"
                      ? "bg-green-50 text-green-700"
                      : notification.type === "warning"
                        ? "bg-yellow-50 text-yellow-700"
                        : notification.type === "error"
                          ? "bg-red-50 text-red-700"
                          : "bg-blue-50 text-blue-700"
                  }`}
                >
                  <div className="font-medium">{notification.message}</div>
                  <div className="text-gray-500">{notification.time}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div> */}

      <div className="page-header flex-col items-center">
        <div className="w-full text-left mx-4">
          <h1 className="text-3xl font-bold tracking-tight">
            LMS Administration
          </h1>
          <p className="text-muted-foreground mt-2">
            Complete learning management system with enrollment, content design,
            adaptive learning, and analytics
          </p>
        </div>
        <div className="flex mx-8 mt-5 w-full items-center gap-3">
          {/* Bulk Import button removed as requested */}

          {/* Learning Paths button removed as requested */}

          {/* Notifications button removed as requested */}

          {/* Analytics button removed as requested */}

          {/* <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                System Config
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>System Configuration</DialogTitle>
                <DialogDescription>
                  Configure LMS settings and integrations
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="integrations">Integrations</TabsTrigger>
                  <TabsTrigger value="proctoring">Proctoring</TabsTrigger>
                  <TabsTrigger value="gamification">Gamification</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="self-enrollment" defaultChecked />
                      <Label htmlFor="self-enrollment">
                        Allow self-enrollment
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="adaptive-learning" defaultChecked />
                      <Label htmlFor="adaptive-learning">
                        Enable adaptive learning
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="virtual-classrooms" defaultChecked />
                      <Label htmlFor="virtual-classrooms">
                        Virtual classrooms
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="collaboration-tools" defaultChecked />
                      <Label htmlFor="collaboration-tools">
                        Collaboration tools
                      </Label>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="notifications" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Send notifications via email
                        </p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Send notifications via SMS
                        </p>
                      </div>
                      <Checkbox />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Send push notifications
                        </p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>In-App Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Show in-app notifications
                        </p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="integrations" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Google Workspace</h4>
                            <p className="text-sm text-muted-foreground">
                              Calendar, Meet, Drive
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Microsoft 365</h4>
                            <p className="text-sm text-muted-foreground">
                              Teams, SharePoint
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Zoom</h4>
                            <p className="text-sm text-muted-foreground">
                              Video conferencing
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Canvas LTI</h4>
                            <p className="text-sm text-muted-foreground">
                              External tools
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="proctoring" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable Proctoring</Label>
                        <p className="text-sm text-muted-foreground">
                          Remote proctoring for assessments
                        </p>
                      </div>
                      <Checkbox />
                    </div>
                    <div>
                      <Label>Proctoring Provider</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="proctorio">Proctorio</SelectItem>
                          <SelectItem value="respondus">
                            Respondus Monitor
                          </SelectItem>
                          <SelectItem value="examity">Examity</SelectItem>
                          <SelectItem value="honorlock">Honorlock</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="gamification" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable Gamification</Label>
                        <p className="text-sm text-muted-foreground">
                          Points, badges, and leaderboards
                        </p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Digital Badges</Label>
                        <p className="text-sm text-muted-foreground">
                          Award badges for achievements
                        </p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Leaderboards</Label>
                        <p className="text-sm text-muted-foreground">
                          Show student rankings
                        </p>
                      </div>
                      <Checkbox />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Progress Tracking</Label>
                        <p className="text-sm text-muted-foreground">
                          Visual progress indicators
                        </p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog> */}

          {/* Advanced Course Management Buttons */}
          {/*<Button variant="outline" onClick={() => setIsAdvancedCourseDialogOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Advanced Course
          </Button>

          <Button variant="outline" onClick={() => setIsBulkOperationsDialogOpen(true)}>
            <Users className="h-4 w-4 mr-2" />
            Bulk Operations
          </Button>

          <Button variant="outline" onClick={() => setIsTemplatesDialogOpen(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </Button>

          <Button variant="outline" onClick={() => setIsIntegrationsDialogOpen(true)}>
            <Zap className="h-4 w-4 mr-2" />
            Integrations
          </Button>*/}

          {/* Create Course button removed as requested */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Courses</p>
              <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              <p className="text-xs text-blue-600">{stats.active} active</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Enrolled</p>
              <p className="text-3xl font-bold text-green-900">
                {stats.enrolled}
              </p>
              <p className="text-xs text-green-600">learners</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Completion</p>
              <p className="text-3xl font-bold text-purple-900">
                {stats.avgCompletion}%
              </p>
              <p className="text-xs text-purple-600">average</p>
            </div>
            <Trophy className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Utilization</p>
              <p className="text-3xl font-bold text-yellow-900">
                {Math.round((stats.enrolled / stats.totalCapacity) * 100)}%
              </p>
              <p className="text-xs text-yellow-600">capacity</p>
            </div>
            <BarChart3 className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          {courseView === "list" ? renderCoursesTable() : renderCourseDetails()}
        </TabsContent>

        <TabsContent value="enrollment">
          {enrollmentView === "management"
            ? renderEnrollmentManagement()
            : renderEnrollmentDetails()}
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage users, roles, and permissions across the system
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
                      <DialogDescription>
                        Add a new user to the system with appropriate role and
                        permissions
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>First Name</Label>
                          <Input placeholder="Enter first name" />
                        </div>
                        <div>
                          <Label>Last Name</Label>
                          <Input placeholder="Enter last name" />
                        </div>
                      </div>
                      <div>
                        <Label>Email Address</Label>
                        <Input type="email" placeholder="user@domain.com" />
                      </div>
                      <div>
                        <Label>Role</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select user role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="super-admin">
                              Super Admin
                            </SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="faculty">Faculty</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="parent">Parent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Department</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cs">Computer Science</SelectItem>
                            <SelectItem value="math">Mathematics</SelectItem>
                            <SelectItem value="physics">Physics</SelectItem>
                            <SelectItem value="chemistry">Chemistry</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button>Create User</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button size="sm" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Import
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Users
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input placeholder="Search users..." className="max-w-sm" />
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="faculty">Faculty</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        name: "Dr.Manikandan",
                        email: "manikandan@gmail.com",
                        role: "Faculty",
                        dept: "Computer Science",
                        status: "Active",
                        lastLogin: "2024-02-14",
                      },
                      {
                        name: "Prof.Kumaresan",
                        email: "kumaresan@gmail.com",
                        role: "Faculty",
                        dept: "Digital Marketing",
                        status: "Active",
                        lastLogin: "2024-02-13",
                      },
                      {
                        name: "Hari",
                        email: "hari@gmail.edu",
                        role: "Student",
                        dept: "Computer Science",
                        status: "Active",
                        lastLogin: "2024-02-14",
                      },
                      {
                        name: "Christy",
                        email: "christy@gmail.com",
                        role: "Parent",
                        dept: "N/A",
                        status: "Active",
                        lastLogin: "2024-02-12",
                      },
                    ].map((user, index) => (
                      <TableRow key={index}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>{user.dept}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === "Active" ? "default" : "secondary"
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>System Analytics & Insights</CardTitle>
              <CardDescription>
                Comprehensive analytics and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="stat-card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                  <div className="text-center">
                    <p className="text-sm font-medium text-blue-600">
                      Total Users
                    </p>
                    <p className="text-3xl font-bold text-blue-900">2,847</p>
                    <p className="text-xs text-blue-600">+12% this month</p>
                  </div>
                </div>
                <div className="stat-card bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                  <div className="text-center">
                    <p className="text-sm font-medium text-green-600">
                      Active Courses
                    </p>
                    <p className="text-3xl font-bold text-green-900">156</p>
                    <p className="text-xs text-green-600">+8% this month</p>
                  </div>
                </div>
                <div className="stat-card bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                  <div className="text-center">
                    <p className="text-sm font-medium text-purple-600">
                      Total Enrollments
                    </p>
                    <p className="text-3xl font-bold text-purple-900">12,394</p>
                    <p className="text-xs text-purple-600">+15% this month</p>
                  </div>
                </div>
                <div className="stat-card bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
                  <div className="text-center">
                    <p className="text-sm font-medium text-orange-600">
                      Completion Rate
                    </p>
                    <p className="text-3xl font-bold text-orange-900">87%</p>
                    <p className="text-xs text-orange-600">+5% this month</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Course Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {courses.slice(0, 5).map((course) => (
                        <div
                          key={course.id}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium">{course.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {course.enrolled} students
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{course.completion}%</p>
                            <Progress
                              value={course.completion}
                              className="w-20 h-2"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">User Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          role: "Students",
                          count: "2,156",
                          active: "1,847",
                          percentage: 86,
                        },
                        {
                          role: "Faculty",
                          count: "156",
                          active: "142",
                          percentage: 91,
                        },
                        {
                          role: "Parents",
                          count: "987",
                          active: "756",
                          percentage: 77,
                        },
                        {
                          role: "Admins",
                          count: "12",
                          active: "11",
                          percentage: 92,
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium">{item.role}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.active} of {item.count} active
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{item.percentage}%</p>
                            <Progress
                              value={item.percentage}
                              className="w-20 h-2"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration & Settings</CardTitle>
              <CardDescription>
                Configure system-wide settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">General Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>System Name</Label>
                      <Input defaultValue="Search First Learning Management System" />
                    </div>
                    <div>
                      <Label>Default Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English US</SelectItem>
                          <SelectItem value="es">English UK</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Security Settings</h4>
                  <div className="space-y-3">
                    {[
                      {
                        label: "Enable Two-Factor Authentication",
                        checked: true,
                      },
                      { label: "Require Password Complexity", checked: true },
                      { label: "Enable Session Timeout", checked: true },
                      { label: "Allow Password Reset", checked: true },
                      { label: "Enable Account Lockout", checked: false },
                    ].map((setting, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <Label className="font-medium">{setting.label}</Label>
                        <Checkbox defaultChecked={setting.checked} />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Email Configuration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>SMTP Server</Label>
                      <Input placeholder="smtp.university.com" />
                    </div>
                    <div>
                      <Label>SMTP Port</Label>
                      <Input placeholder="587" />
                    </div>
                    <div>
                      <Label>From Email</Label>
                      <Input placeholder="noreply@gmail.edu" />
                    </div>
                    <div>
                      <Label>From Name</Label>
                      <Input placeholder="University LMS" />
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex gap-2">
                    <Button>Save Changes</Button>
                    <Button variant="outline">Reset to Default</Button>
                    <Button variant="outline">Test Configuration</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>System Reports & Data Export</CardTitle>
                <CardDescription>
                  Generate comprehensive reports and export system data
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Report
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "User Activity Report",
                    desc: "Detailed user login and activity data",
                    type: "Users",
                    date: "2024-02-14",
                  },
                  {
                    title: "Course Performance Report",
                    desc: "Course completion and performance metrics",
                    type: "Courses",
                    date: "2024-02-13",
                  },
                  {
                    title: "Enrollment Statistics",
                    desc: "Student enrollment trends and statistics",
                    type: "Enrollment",
                    date: "2024-02-12",
                  },
                  {
                    title: "System Usage Report",
                    desc: "System resource usage and performance",
                    type: "System",
                    date: "2024-02-11",
                  },
                  {
                    title: "Assessment Analytics",
                    desc: "Assessment results and grade distribution",
                    type: "Assessments",
                    date: "2024-02-10",
                  },
                  {
                    title: "Financial Report",
                    desc: "Revenue and payment processing data",
                    type: "Finance",
                    date: "2024-02-09",
                  },
                ].map((report, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">
                            {report.title}
                          </CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {report.type}
                          </Badge>
                        </div>
                        <BarChart3 className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3">
                        {report.desc}
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        Last generated: {report.date}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3 mr-1" />
                          Config
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security & Audit Management</CardTitle>
              <CardDescription>
                Monitor security events and manage access controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Security Overview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="stat-card bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                      <div className="text-center">
                        <Shield className="h-8 w-8 mx-auto text-green-600 mb-2" />
                        <p className="text-sm font-medium text-green-600">
                          Security Score
                        </p>
                        <p className="text-2xl font-bold text-green-900">
                          94/100
                        </p>
                      </div>
                    </div>
                    <div className="stat-card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                      <div className="text-center">
                        <Eye className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                        <p className="text-sm font-medium text-blue-600">
                          Active Sessions
                        </p>
                        <p className="text-2xl font-bold text-blue-900">
                          1,247
                        </p>
                      </div>
                    </div>
                    <div className="stat-card bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
                      <div className="text-center">
                        <AlertTriangle className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
                        <p className="text-sm font-medium text-yellow-600">
                          Security Alerts
                        </p>
                        <p className="text-2xl font-bold text-yellow-900">3</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Recent Security Events</h4>
                  <div className="space-y-3">
                    {[
                      {
                        event: "Failed login attempt",
                        user: "unknown@domain.com",
                        time: "2 minutes ago",
                        severity: "Medium",
                      },
                      {
                        event: "Successful admin login",
                        user: "admin@university.edu",
                        time: "1 hour ago",
                        severity: "Info",
                      },
                      {
                        event: "Password reset request",
                        user: "student@university.edu",
                        time: "3 hours ago",
                        severity: "Low",
                      },
                      {
                        event: "Multiple failed logins",
                        user: "suspicious@domain.com",
                        time: "5 hours ago",
                        severity: "High",
                      },
                    ].map((event, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{event.event}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.user} • {event.time}
                          </p>
                        </div>
                        <Badge
                          variant={
                            event.severity === "High"
                              ? "destructive"
                              : event.severity === "Medium"
                              ? "default"
                              : event.severity === "Low"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {event.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Access Control</h4>
                  <div className="space-y-3">
                    {[
                      {
                        permission: "Course Creation",
                        roles: "Admin, Faculty",
                        enabled: true,
                      },
                      {
                        permission: "User Management",
                        roles: "Super Admin, Admin",
                        enabled: true,
                      },
                      {
                        permission: "Grade Override",
                        roles: "Admin, Faculty",
                        enabled: true,
                      },
                      {
                        permission: "System Settings",
                        roles: "Super Admin",
                        enabled: true,
                      },
                      {
                        permission: "Data Export",
                        roles: "Admin",
                        enabled: false,
                      },
                    ].map((perm, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{perm.permission}</p>
                          <p className="text-sm text-muted-foreground">
                            Allowed for: {perm.roles}
                          </p>
                        </div>
                        <Checkbox defaultChecked={perm.enabled} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderFacultyView = () => (
    <div className="space-y-8">
      <div className="page-header">
        <h1 className="text-3xl font-bold tracking-tight">Faculty Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage your courses, students, and teaching activities
        </p>
        {/* Debug info */}
        <div className="flex gap-2 mt-2">
          <Badge variant="outline" className="text-xs">
            Total Courses: {courses.length}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Faculty: {faculty.length}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Students: {students.length}
          </Badge>
          {user?.faculty_id && (
            <Badge variant="secondary" className="text-xs">
              Faculty ID: {user.faculty_id}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">My Courses</p>
              <p className="text-3xl font-bold text-blue-900">
                {
                  courses.filter(
                    (c) =>
                      c.faculty.includes(user?.name || "") ||
                      c.faculty === user?.name ||
                      (user?.faculty_id &&
                        c.id.includes(`FC${user.faculty_id}`))
                  ).length
                }
              </p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Students</p>
              <p className="text-3xl font-bold text-green-900">
                {courses
                  .filter(
                    (c) =>
                      c.faculty.includes(user?.name || "") ||
                      c.faculty === user?.name ||
                      (user?.faculty_id &&
                        c.id.includes(`FC${user.faculty_id}`))
                  )
                  .reduce((sum, c) => sum + c.enrolled, 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Assignments</p>
              <p className="text-3xl font-bold text-purple-900">
                {
                  assignments.filter((a) =>
                    courses.find(
                      (c) =>
                        c.id === a.courseId &&
                        (c.faculty.includes(user?.name || "") ||
                          c.faculty === user?.name ||
                          (user?.faculty_id &&
                            c.id.includes(`FC${user.faculty_id}`)))
                    )
                  ).length
                }
              </p>
            </div>
            <FileText className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">
                Virtual Sessions
              </p>
              <p className="text-3xl font-bold text-orange-900">
                {
                  virtualSessions.filter((v) =>
                    courses.find(
                      (c) =>
                        c.id === v.courseId &&
                        (c.faculty.includes(user?.name || "") ||
                          c.faculty === user?.name ||
                          (user?.faculty_id &&
                            c.id.includes(`FC${user.faculty_id}`)))
                    )
                  ).length
                }
              </p>
            </div>
            <Video className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList>
          <TabsTrigger value="my-courses">My Courses</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          {/* <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="virtual">Virtual Classes</TabsTrigger>
          <TabsTrigger value="grading">Grading</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger> */}
        </TabsList>

        <TabsContent value="my-courses">
          {renderCoursesTable(
            courses.filter(
              (c) =>
                c.faculty.includes(user?.name || "") ||
                c.faculty === user?.name ||
                (user?.faculty_id && c.id.includes(`FC${user.faculty_id}`))
            )
          )}
        </TabsContent>

        <TabsContent value="students">
          {renderEnrollmentManagement()}
        </TabsContent>

        <TabsContent value="assignments">
          {renderAssignmentManagement()}
        </TabsContent>

        <TabsContent value="assessments">
          {renderAssessmentManagement()}
        </TabsContent>

        <TabsContent value="virtual">{renderVirtualClassrooms()}</TabsContent>

        <TabsContent value="grading">
          {renderAssessmentManagement()}
        </TabsContent>

        <TabsContent value="certificates">
          {renderCertificateManagement()}
        </TabsContent>

        <TabsContent value="analytics">{renderAdvancedAnalytics()}</TabsContent>
      </Tabs>
    </div>
  );

  const renderStudentView = () => (
    <div className="space-y-8">
      <div className="page-header">
        <h1 className="text-3xl font-bold tracking-tight">
          My Learning Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Track your progress and engage with course content
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat-card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">
                Enrolled Courses
              </p>
              <p className="text-3xl font-bold text-blue-900">
                {courses.length}
              </p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">
                Overall Progress
              </p>
              <p className="text-3xl font-bold text-green-900">
                {courses.length > 0
                  ? Math.round(
                      courses.reduce((sum, c) => sum + c.completion, 0) /
                        courses.length
                    )
                  : 0}
                %
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">
                Available Courses
              </p>
              <p className="text-3xl font-bold text-purple-900">
                {courses.filter((c) => c.status === "Active").length}
              </p>
            </div>
            <Star className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList>
          <TabsTrigger value="enrolled">My Courses</TabsTrigger>
          <TabsTrigger value="available">Available Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled">{renderStudentCourses()}</TabsContent>

        <TabsContent value="available">{renderAvailableCourses()}</TabsContent>
      </Tabs>
    </div>
  );

  const renderParentView = () => (
    <div className="space-y-8">
      <div className="page-header">
        <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your child's learning progress and activities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">
                Enrolled Courses
              </p>
              <p className="text-3xl font-bold text-blue-900">5</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">
                Overall Progress
              </p>
              <p className="text-3xl font-bold text-green-900">78%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">
                Assignments Due
              </p>
              <p className="text-3xl font-bold text-purple-900">3</p>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">
                Certificates
              </p>
              <p className="text-3xl font-bold text-orange-900">2</p>
            </div>
            <Award className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Child's Courses</TabsTrigger>
          <TabsTrigger value="progress">Progress Reports</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="assessments">Assessment Results</TabsTrigger>
          <TabsTrigger value="communication">Teacher Communication</TabsTrigger>
          <TabsTrigger value="certificates">Achievements</TabsTrigger>
          <TabsTrigger value="settings">Parent Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Child's Learning Overview</CardTitle>
              <CardDescription>
                Comprehensive view of your child's academic progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.slice(0, 5).map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{course.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Instructor: {course.faculty}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last Activity: 2 hours ago
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {course.completion}% Complete
                      </p>
                      <Progress
                        value={course.completion}
                        className="w-24 h-2 mt-1"
                      />
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Child's Enrolled Courses</CardTitle>
                <CardDescription>
                  Monitor course enrollment and academic performance
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Request Enrollment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Request Course Enrollment</DialogTitle>
                      <DialogDescription>
                        Submit a request for your child to enroll in a new
                        course
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Course Selection</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a course" />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map((course) => (
                              <SelectItem key={course.id} value={course.id}>
                                {course.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Reason for Enrollment</Label>
                        <Textarea placeholder="Please provide a reason for this enrollment request..." />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button>Submit Request</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{course.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Instructor: {course.faculty}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Enrolled: {course.startDate} | Duration:{" "}
                        {course.duration}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {course.completion}% Complete
                      </p>
                      <Progress
                        value={course.completion}
                        className="w-24 h-2 mt-1"
                      />
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Contact Teacher
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Progress Reports & Analytics</CardTitle>
                <CardDescription>
                  Detailed academic progress and performance analytics
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                <Button size="sm" variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter by Date
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Weekly Progress</h4>
                  {courses.slice(0, 4).map((course) => (
                    <div key={course.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">
                          {course.name}
                        </span>
                        <span className="text-sm text-green-600">
                          +{Math.floor(Math.random() * 15 + 5)}%
                        </span>
                      </div>
                      <Progress value={course.completion} className="h-2" />
                      <div className="mt-2 text-xs text-muted-foreground">
                        Last week:{" "}
                        {course.completion - Math.floor(Math.random() * 15 + 5)}
                        %
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Recent Achievements</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Trophy className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">
                          Assignment Excellence
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Scored 95% in Data Structures
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Award className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">
                          Perfect Attendance
                        </p>
                        <p className="text-xs text-muted-foreground">
                          100% attendance this month
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Star className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium">Course Completion</p>
                        <p className="text-xs text-muted-foreground">
                          Completed Digital Marketing
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Assignment Tracking</CardTitle>
                <CardDescription>
                  Monitor assignment submissions and grades
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  Set Reminders
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Data Structures Implementation",
                    course: "Computer Science",
                    dueDate: "2024-02-15",
                    status: "Submitted",
                    grade: "A",
                    submitted: true,
                  },
                  {
                    title: "Marketing Strategy Analysis",
                    course: "Digital Marketing",
                    dueDate: "2024-02-20",
                    status: "In Progress",
                    grade: null,
                    submitted: false,
                  },
                  {
                    title: "Machine Learning Project",
                    course: "AI/ML",
                    dueDate: "2024-02-25",
                    status: "Not Started",
                    grade: null,
                    submitted: false,
                  },
                  {
                    title: "Database Design",
                    course: "Database Systems",
                    dueDate: "2024-03-01",
                    status: "Planning",
                    grade: null,
                    submitted: false,
                  },
                ].map((assignment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{assignment.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {assignment.course}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Due: {assignment.dueDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={assignment.submitted ? "default" : "secondary"}
                      >
                        {assignment.status}
                      </Badge>
                      {assignment.grade && (
                        <p className="text-sm font-medium mt-1">
                          Grade: {assignment.grade}
                        </p>
                      )}
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-3 w-3 mr-1" />
                          Contact Teacher
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Results & Performance</CardTitle>
              <CardDescription>
                View test scores, quiz results, and performance trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Midterm Examination",
                    course: "Computer Science",
                    date: "2024-02-10",
                    score: "92%",
                    grade: "A",
                    maxScore: "100%",
                  },
                  {
                    title: "Quiz - Marketing Fundamentals",
                    course: "Digital Marketing",
                    date: "2024-02-12",
                    score: "88%",
                    grade: "B+",
                    maxScore: "100%",
                  },
                  {
                    title: "Programming Assignment",
                    course: "Software Engineering",
                    date: "2024-02-08",
                    score: "95%",
                    grade: "A",
                    maxScore: "100%",
                  },
                  {
                    title: "Database Quiz",
                    course: "Database Systems",
                    date: "2024-02-05",
                    score: "85%",
                    grade: "B",
                    maxScore: "100%",
                  },
                ].map((assessment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{assessment.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {assessment.course}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Date: {assessment.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        {assessment.score}
                      </p>
                      <p className="text-sm">Grade: {assessment.grade}</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View Report
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Teacher Communication</CardTitle>
                <CardDescription>
                  Messages, feedback, and communication with teachers
                </CardDescription>
              </div>
              <div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Message
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Message to Teacher</DialogTitle>
                      <DialogDescription>
                        Compose a message to your child's teacher
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Select Teacher</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose teacher" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="teacher1">
                              Dr.manikandan - Computer Science
                            </SelectItem>
                            <SelectItem value="teacher2">
                              Prof. Malar - Digital Marketing
                            </SelectItem>
                            <SelectItem value="teacher3">
                              Dr. Eshwar - Mathematics
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Subject</Label>
                        <Input placeholder="Message subject" />
                      </div>
                      <div>
                        <Label>Message</Label>
                        <Textarea placeholder="Type your message here..." />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button>Send Message</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    teacher: "Dr. Senthil",
                    subject: "Assignment Feedback",
                    date: "2024-02-14",
                    message:
                      "Excellent work on the data structures assignment. Your implementation was clean and efficient.",
                    unread: false,
                  },
                  {
                    teacher: "Prof. Kumar",
                    subject: "Course Progress Update",
                    date: "2024-02-13",
                    message:
                      "Your child is performing exceptionally well in the digital marketing course. Keep up the great work!",
                    unread: true,
                  },
                  {
                    teacher: "Dr. Amirtha",
                    subject: "Quiz Results",
                    date: "2024-02-12",
                    message:
                      "The recent mathematics quiz results show good understanding of the concepts. Some areas for improvement noted.",
                    unread: false,
                  },
                  {
                    teacher: "Dr. Mahalakshmi",
                    subject: "Upcoming Project",
                    date: "2024-02-10",
                    message:
                      "Reminder about the upcoming group project. Please ensure your child is prepared for the team formation session.",
                    unread: false,
                  },
                ].map((message, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg ${
                      message.unread ? "bg-blue-50 border-blue-200" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{message.teacher}</h4>
                          {message.unread && (
                            <Badge variant="secondary" className="text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium text-blue-600">
                          {message.subject}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {message.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Received: {message.date}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          Read
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates">
          <Card>
            <CardHeader>
              <CardTitle>Achievements & Certificates</CardTitle>
              <CardDescription>
                View earned certificates, badges, and academic achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Digital Marketing Specialist",
                    course: "Digital Marketing",
                    date: "2024-02-01",
                    type: "Certificate",
                    verified: true,
                  },
                  {
                    title: "Programming Excellence",
                    course: "Computer Science",
                    date: "2024-01-15",
                    type: "Badge",
                    verified: true,
                  },
                  {
                    title: "Perfect Attendance",
                    course: "All Courses",
                    date: "2024-01-31",
                    type: "Achievement",
                    verified: true,
                  },
                  {
                    title: "Mathematics Proficiency",
                    course: "Mathematics",
                    date: "2024-01-20",
                    type: "Certificate",
                    verified: false,
                  },
                ].map((certificate, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-yellow-500" />
                        <Badge
                          variant={
                            certificate.verified ? "default" : "secondary"
                          }
                        >
                          {certificate.verified ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {certificate.type}
                      </div>
                    </div>
                    <h4 className="font-medium">{certificate.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {certificate.course}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Earned: {certificate.date}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <Globe className="h-3 w-3 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Parent Settings & Preferences</CardTitle>
              <CardDescription>
                Manage notification preferences and account settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Notification Preferences</h4>
                  <div className="space-y-3">
                    {[
                      { label: "Assignment Due Reminders", checked: true },
                      { label: "Grade Updates", checked: true },
                      { label: "Teacher Messages", checked: true },
                      { label: "Course Announcements", checked: false },
                      { label: "Weekly Progress Reports", checked: true },
                      { label: "Achievement Notifications", checked: true },
                    ].map((setting, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <Label className="font-medium">{setting.label}</Label>
                          <p className="text-xs text-muted-foreground">
                            Receive notifications for{" "}
                            {setting.label.toLowerCase()}
                          </p>
                        </div>
                        <Checkbox defaultChecked={setting.checked} />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Communication Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <Label>Preferred Contact Method</Label>
                      <Select defaultValue="email">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="both">Email & SMS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Report Frequency</Label>
                      <Select defaultValue="weekly">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Privacy Settings</h4>
                  <div className="space-y-3">
                    {[
                      {
                        label: "Share Progress with Extended Family",
                        checked: false,
                      },
                      { label: "Allow Teacher Direct Contact", checked: true },
                      {
                        label: "Share Achievement on Social Media",
                        checked: false,
                      },
                    ].map((setting, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <Label className="font-medium">{setting.label}</Label>
                        <Checkbox defaultChecked={setting.checked} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex gap-2">
                    <Button>Save Changes</Button>
                    <Button variant="outline">Reset to Default</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderGuestView = () => (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">Access Required</h3>
        <p className="text-muted-foreground">
          Please log in to access the learning management system.
        </p>
      </div>
    </div>
  );

  const renderCourseDetails = () => (
    <Card className="section-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCourseView("list")}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Course Details</CardTitle>
              <CardDescription className="mt-1">
                {selectedCourse?.name}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {selectedCourse && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Course Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Course Name
                    </Label>
                    <p className="text-sm">{selectedCourse.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Course Code
                    </Label>
                    <p className="text-sm">{selectedCourse.code}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Description
                    </Label>
                    <p className="text-sm">{selectedCourse.description}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Faculty
                    </Label>
                    <p className="text-sm">{selectedCourse.faculty}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Category
                    </Label>
                    <Badge variant="outline" className="text-xs">
                      {selectedCourse.category}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Type
                    </Label>
                    <Badge
                      variant={
                        selectedCourse.type === "Mandatory"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {selectedCourse.type}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Status
                    </Label>
                    <Badge
                      variant={
                        selectedCourse.status === "Active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {selectedCourse.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Enrollment & Progress
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Enrolled Students
                    </Label>
                    <p className="text-sm">
                      {selectedCourse.enrolled} / {selectedCourse.maxCapacity}
                    </p>
                    <Progress
                      value={
                        (selectedCourse.enrolled / selectedCourse.maxCapacity) *
                        100
                      }
                      className="w-full h-2 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Duration
                    </Label>
                    <p className="text-sm">{selectedCourse.duration} hours</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Start Date
                    </Label>
                    <p className="text-sm">{selectedCourse.startDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      End Date
                    </Label>
                    <p className="text-sm">{selectedCourse.endDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Prerequisites
                    </Label>
                    <p className="text-sm">
                      {selectedCourse.prerequisites || "None"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Language
                    </Label>
                    <p className="text-sm">{selectedCourse.language}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">
                Features & Capabilities
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedCourse.virtualClassroom && (
                  <Badge variant="outline" className="text-xs">
                    <Video className="h-3 w-3 mr-1" />
                    Virtual Classroom
                  </Badge>
                )}
                {selectedCourse.aiAdaptive && (
                  <Badge variant="outline" className="text-xs">
                    <Zap className="h-3 w-3 mr-1" />
                    AI Adaptive
                  </Badge>
                )}
                {selectedCourse.proctoring && (
                  <Badge variant="outline" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Proctored
                  </Badge>
                )}
                {selectedCourse.gamificationEnabled && (
                  <Badge variant="outline" className="text-xs">
                    <Trophy className="h-3 w-3 mr-1" />
                    Gamified
                  </Badge>
                )}
              </div>
            </div>

            {selectedCourse.contentTypes &&
              selectedCourse.contentTypes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Content Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCourse.contentTypes.map((type, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-center">
                  <FileText className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                  <div className="text-2xl font-bold">
                    {selectedCourse.assignments}
                  </div>
                  <div className="text-sm text-gray-600">Assignments</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  <div className="text-2xl font-bold">
                    {selectedCourse.assessments}
                  </div>
                  <div className="text-sm text-gray-600">Assessments</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <MessageSquare className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                  <div className="text-2xl font-bold">
                    {selectedCourse.discussions}
                  </div>
                  <div className="text-sm text-gray-600">Discussions</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <Award className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
                  <div className="text-2xl font-bold">
                    {selectedCourse.certificatesGenerated}
                  </div>
                  <div className="text-sm text-gray-600">Certificates</div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderContentDetails = () => {
    const renderBackButton = () => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setContentView("management")}
        className="mr-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Content Management
      </Button>
    );

    switch (contentView) {
      case "lesson":
        return (
          <Card className="section-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                {renderBackButton()}
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Create New Lesson</CardTitle>
                  <CardDescription>
                    Design structured learning content with interactive elements
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Lesson Title</Label>
                    <Input placeholder="Enter lesson title" />
                  </div>
                  <div>
                    <Label>Course</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Lesson Objectives</Label>
                  <Textarea placeholder="Define what students will learn in this lesson" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Duration (minutes)</Label>
                    <Input type="number" placeholder="60" />
                  </div>
                  <div>
                    <Label>Difficulty Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Lesson Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lecture">Lecture</SelectItem>
                        <SelectItem value="tutorial">Tutorial</SelectItem>
                        <SelectItem value="lab">Lab Exercise</SelectItem>
                        <SelectItem value="discussion">Discussion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Lesson Content</Label>
                  <Textarea
                    placeholder="Add lesson content, instructions, and materials"
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex gap-4 justify-end">
                  <Button variant="outline">Save as Draft</Button>
                  <Button>Create Lesson</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "scorm":
        return (
          <Card className="section-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                {renderBackButton()}
                <div className="p-2 rounded-lg bg-green-50 text-green-600">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Upload SCORM Package</CardTitle>
                  <CardDescription>
                    Upload and configure SCORM content packages
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>SCORM Package</Label>
                  <Input type="file" accept=".zip" />
                </div>
                <div>
                  <Label>Package Name</Label>
                  <Input placeholder="Enter package name" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea placeholder="Describe the SCORM content" />
                </div>
                <div className="flex gap-4 justify-end">
                  <Button variant="outline">Cancel</Button>
                  <Button>Upload SCORM</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "lti":
        return (
          <Card className="section-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                {renderBackButton()}
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Add LTI Tool</CardTitle>
                  <CardDescription>
                    Configure Learning Tools Interoperability
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Tool Name</Label>
                  <Input placeholder="Enter tool name" />
                </div>
                <div>
                  <Label>LTI URL</Label>
                  <Input placeholder="https://example.com/lti" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Consumer Key</Label>
                    <Input placeholder="Enter consumer key" />
                  </div>
                  <div>
                    <Label>Shared Secret</Label>
                    <Input type="password" placeholder="Enter shared secret" />
                  </div>
                </div>
                <div className="flex gap-4 justify-end">
                  <Button variant="outline">Cancel</Button>
                  <Button>Add LTI Tool</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "outcomes":
        return (
          <Card className="section-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                {renderBackButton()}
                <div className="p-2 rounded-lg bg-yellow-50 text-yellow-600">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Manage Learning Outcomes</CardTitle>
                  <CardDescription>
                    Define and track learning objectives
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Outcome Title</Label>
                  <Input placeholder="Enter learning outcome" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea placeholder="Describe the learning outcome" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="knowledge">Knowledge</SelectItem>
                        <SelectItem value="skills">Skills</SelectItem>
                        <SelectItem value="competency">Competency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-4 justify-end">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Outcome</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "rules":
        return (
          <Card className="section-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                {renderBackButton()}
                <div className="p-2 rounded-lg bg-red-50 text-red-600">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Configure Rules</CardTitle>
                  <CardDescription>
                    Set up course and content rules
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Rule Name</Label>
                  <Input placeholder="Enter rule name" />
                </div>
                <div>
                  <Label>Rule Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rule type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prerequisite">Prerequisite</SelectItem>
                      <SelectItem value="completion">Completion</SelectItem>
                      <SelectItem value="access">Access Control</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Rule Description</Label>
                  <Textarea placeholder="Describe the rule" />
                </div>
                <div className="flex gap-4 justify-end">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Rule</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "analytics":
        return (
          <Card className="section-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                {renderBackButton()}
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>View Analytics</CardTitle>
                  <CardDescription>
                    Content performance and usage analytics
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <div className="text-center">
                    <Eye className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                    <div className="text-2xl font-bold">1,234</div>
                    <div className="text-sm text-gray-600">Total Views</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <Users className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <div className="text-2xl font-bold">567</div>
                    <div className="text-sm text-gray-600">Active Users</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <Clock className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                    <div className="text-2xl font-bold">45m</div>
                    <div className="text-sm text-gray-600">Avg. Duration</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                    <div className="text-2xl font-bold">89%</div>
                    <div className="text-sm text-gray-600">Completion Rate</div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        );

      case "banks":
        return (
          <Card className="section-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                {renderBackButton()}
                <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
                  <Bookmark className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Manage Question Banks</CardTitle>
                  <CardDescription>
                    Create and organize question banks
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Bank Name</Label>
                  <Input placeholder="Enter question bank name" />
                </div>
                <div>
                  <Label>Subject Area</Label>
                  <Input placeholder="Enter subject area" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea placeholder="Describe the question bank" />
                </div>
                <div className="flex gap-4 justify-end">
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Bank</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "quickAnalytics":
        return (
          <Card className="section-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                {renderBackButton()}
                <div className="p-2 rounded-lg bg-pink-50 text-pink-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Quick Analytics</CardTitle>
                  <CardDescription>
                    Fast overview of key metrics
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                    <div className="text-xl font-bold">156</div>
                    <div className="text-sm text-gray-600">Active Learners</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <BookOpen className="h-6 w-6 mx-auto text-green-600 mb-2" />
                    <div className="text-xl font-bold">23</div>
                    <div className="text-sm text-gray-600">Lessons</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <Trophy className="h-6 w-6 mx-auto text-yellow-600 mb-2" />
                    <div className="text-xl font-bold">78%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const renderEnrollmentDetails = () => (
    <Card className="section-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEnrollmentView("management")}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Enrollment Management
            </Button>
            <div className="p-2 rounded-lg bg-green-50 text-green-600">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Enrollment Details</CardTitle>
              <CardDescription className="mt-1">
                {selectedEnrollment?.studentName} -{" "}
                {selectedEnrollment
                  ? courses.find((c) => c.id === selectedEnrollment.courseId)
                      ?.name
                  : ""}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {selectedEnrollment && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Student Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Student Name
                    </Label>
                    <p className="text-sm">{selectedEnrollment.studentName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Student ID
                    </Label>
                    <p className="text-sm">{selectedEnrollment.studentId}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Enrollment ID
                    </Label>
                    <p className="text-sm">{selectedEnrollment.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Enrollment Date
                    </Label>
                    <p className="text-sm">
                      {selectedEnrollment.enrollmentDate}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Enrollment Type
                    </Label>
                    <Badge variant="outline" className="text-xs">
                      {selectedEnrollment.enrollmentType}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Status
                    </Label>
                    <Badge
                      variant={
                        selectedEnrollment.status === "enrolled"
                          ? "default"
                          : selectedEnrollment.status === "completed"
                          ? "secondary"
                          : selectedEnrollment.status === "pending"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {selectedEnrollment.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Course Progress</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Course Name
                    </Label>
                    <p className="text-sm">
                      {
                        courses.find(
                          (c) => c.id === selectedEnrollment.courseId
                        )?.name
                      }
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Progress
                    </Label>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={selectedEnrollment.progress}
                        className="w-full h-2"
                      />
                      <span className="text-sm font-medium">
                        {selectedEnrollment.progress}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Current Grade
                    </Label>
                    <p className="text-sm font-medium">
                      {selectedEnrollment.grade}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Last Activity
                    </Label>
                    <p className="text-sm">
                      {new Date(
                        selectedEnrollment.lastActivity
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Course Information</h3>
              {(() => {
                const course = courses.find(
                  (c) => c.id === selectedEnrollment.courseId
                );
                return course ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Faculty
                      </Label>
                      <p className="text-sm">{course.faculty}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Duration
                      </Label>
                      <p className="text-sm">{course.duration} hours</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Category
                      </Label>
                      <Badge variant="outline" className="text-xs">
                        {course.category}
                      </Badge>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                  <div className="text-2xl font-bold">
                    {Math.floor(
                      (Date.now() -
                        new Date(selectedEnrollment.enrollmentDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Days Enrolled</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <BookOpen className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  <div className="text-2xl font-bold">
                    {selectedEnrollment.progress}%
                  </div>
                  <div className="text-sm text-gray-600">Completion</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <Award className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
                  <div className="text-2xl font-bold">
                    {selectedEnrollment.grade}
                  </div>
                  <div className="text-sm text-gray-600">Grade</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                  <div className="text-2xl font-bold">
                    {selectedEnrollment.status === "completed" ? "Yes" : "No"}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderCoursesTable = (coursesToShow = filteredCourses || []) => (
    <Card className="section-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <BookOpen className="h-5 w-5" />
          </div>
          Course Management
        </CardTitle>
        <CardDescription>
          Comprehensive course directory with enrollment, content design, and
          learning analytics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setIsAdvancedFilterDialogOpen(true)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Advanced
          </Button>

          <Button variant="outline" onClick={handleResetFilters}>
            <XCircle className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>

          <Button variant="outline" onClick={handleApplyFilters}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsExportOptionsDialogOpen(true)}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Options
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    selectedCourses.length === coursesToShow.length &&
                    coursesToShow.length > 0
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCourses(
                        (coursesToShow || []).map((c) => c.id)
                      );
                    } else {
                      setSelectedCourses([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Enrollment</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Features</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(coursesToShow || []).map((course) => (
              <TableRow key={course.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedCourses.includes(course.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCourses([...selectedCourses, course.id]);
                      } else {
                        setSelectedCourses(
                          selectedCourses.filter((id) => id !== course.id)
                        );
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{course.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {course.code} • {course.faculty}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {course.category}
                      </Badge>
                      <Badge
                        variant={
                          course.type === "Mandatory" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {course.type}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">
                      {course.enrolled}/{course.maxCapacity}
                    </div>
                    <Progress
                      value={(course.enrolled / course.maxCapacity) * 100}
                      className="w-16 h-2"
                    />
                    <div className="text-xs text-muted-foreground">
                      {Math.round((course.enrolled / course.maxCapacity) * 100)}
                      % full
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">{course.completion}%</div>
                    <Progress value={course.completion} className="w-16 h-2" />
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      {course.rating}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {course.virtualClassroom && (
                      <Badge variant="outline" className="text-xs">
                        <Video className="h-3 w-3 mr-1" />
                        Virtual
                      </Badge>
                    )}
                    {course.adaptiveLearning && (
                      <Badge variant="outline" className="text-xs">
                        <Brain className="h-3 w-3 mr-1" />
                        Adaptive
                      </Badge>
                    )}
                    {course.proctoring && (
                      <Badge variant="outline" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Proctored
                      </Badge>
                    )}
                    {course.gamificationEnabled && (
                      <Badge variant="outline" className="text-xs">
                        <Gamepad2 className="h-3 w-3 mr-1" />
                        Gamified
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      course.status === "Active"
                        ? "default"
                        : course.status === "Draft"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {course.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCourse(course);
                        setCourseView("details");
                      }}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {user?.role === "student" &&
                      course.enrollmentMode === "self" && (
                        <Button
                          size="sm"
                          onClick={() => handleStudentEnrollment(course.id)}
                          disabled={enrollments.some(
                            (e) =>
                              e.courseId === course.id &&
                              e.studentId === user?.id
                          )}
                          title={
                            enrollments.some(
                              (e) =>
                                e.courseId === course.id &&
                                e.studentId === user?.id
                            )
                              ? "Already Enrolled"
                              : "Enroll in Course"
                          }
                        >
                          {enrollments.some(
                            (e) =>
                              e.courseId === course.id &&
                              e.studentId === user?.id
                          ) ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <UserPlus className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderEnrollmentManagement = () => {
    // Get current faculty's department info
    const currentFaculty = faculty.find(
      (f) =>
        f.personal_info?.full_name === user?.name ||
        f.faculty_id === user?.faculty_id ||
        f.contact_info?.email === user?.email
    );

    // Filter students based on faculty's institution and department
    const getFilteredStudents = () => {
      if (!currentFaculty) {
        // Fallback: use user's information
        const userInstitutionCode =
          user?.institutionCode || user?.selectedInstitutionCode;
        const userDepartmentId = user?.department_id;

        return students.filter((student) => {
          const matchesInstitution = userInstitutionCode
            ? student.academic_info?.institution_code ===
              parseInt(userInstitutionCode)
            : true;
          const matchesDepartment = userDepartmentId
            ? student.department_id === userDepartmentId
            : true;
          return (
            matchesInstitution &&
            matchesDepartment &&
            student.status === "Active"
          );
        });
      }

      // Filter by faculty's institution and department
      return students.filter((student) => {
        const matchesInstitution =
          student.academic_info?.institution_code ===
          currentFaculty.institution_code;
        const matchesDepartment =
          student.department_id === currentFaculty.department_id;
        return (
          matchesInstitution && matchesDepartment && student.status === "Active"
        );
      });
    };

    const filteredStudents = getFilteredStudents();

    return (
      <Card className="section-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-green-50 text-green-600">
              <Users className="h-5 w-5" />
            </div>
            My Students
          </CardTitle>
          <CardDescription>
            Students from your department:{" "}
            {currentFaculty?.department || user?.department || "N/A"}
            {currentFaculty &&
              ` (${
                currentFaculty.academic_info?.institution ||
                currentFaculty.institution ||
                "N/A"
              })`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-3 py-1">
                <Users className="h-3 w-3 mr-1" />
                {filteredStudents.length} Students
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                Institution Code:{" "}
                {currentFaculty?.institution_code ||
                  user?.institutionCode ||
                  "N/A"}
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                Department ID:{" "}
                {currentFaculty?.department_id || user?.department_id || "N/A"}
              </Badge>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading students data...
            </div>
          ) : dataLoadError ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Data Load Error</h3>
              <p className="text-muted-foreground">{dataLoadError}</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No students found for your department.</p>
              <p className="text-sm mt-2">
                Department:{" "}
                {currentFaculty?.department ||
                  user?.department ||
                  "Not specified"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Details</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Academic Info</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.student_id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {student.personal_info?.full_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {student.student_id}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Roll: {student.roll_number}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {student.academic_info?.program}
                        </div>
                        <div className="text-muted-foreground">
                          Year {student.academic_info?.year}, Sem{" "}
                          {student.academic_info?.semester}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{student.contact_info?.email}</div>
                        <div className="text-muted-foreground">
                          {student.contact_info?.phone_number}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          Admitted:{" "}
                          {
                            student.academic_info?.date_of_admission?.split(
                              "T"
                            )[0]
                          }
                        </div>
                        <div className="text-muted-foreground">
                          NCNO: {student.academic_info?.ncno}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          student.status === "Active"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="View Student Details"
                          onClick={() => {
                            alert(
                              `Student Details:\n\nName: ${student.personal_info?.full_name}\nID: ${student.student_id}\nProgram: ${student.academic_info?.program}\nYear: ${student.academic_info?.year}\nSemester: ${student.academic_info?.semester}\nEmail: ${student.contact_info?.email}\nPhone: ${student.contact_info?.phone_number}\nGuardian: ${student.contact_info?.guardian_name}\nGuardian Contact: ${student.contact_info?.guardian_contact}`
                            );
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Send Message"
                          onClick={() => {
                            window.open(
                              `mailto:${student.contact_info?.email}?subject=Message from Faculty - ${user?.name}&body=Dear ${student.personal_info?.full_name},%0D%0A%0D%0A`
                            );
                          }}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderContentManagement = () => (
    <Card className="section-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
            <FileText className="h-5 w-5" />
          </div>
          Content Design & Management
        </CardTitle>
        <CardDescription>
          Manage learning content, SCORM packages, LTI tools, and learning
          outcomes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Lesson Design</h4>
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Create structured learning lessons
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() => setContentView("lesson")}
                  >
                    Create Lesson
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Create New Lesson</DialogTitle>
                    <DialogDescription>
                      Design structured learning content with interactive
                      elements
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Lesson Title</Label>
                        <Input placeholder="Enter lesson title" />
                      </div>
                      <div>
                        <Label>Course</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select course" />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map((course) => (
                              <SelectItem key={course.id} value={course.id}>
                                {course.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Lesson Objectives</Label>
                      <Textarea placeholder="Define what students will learn in this lesson" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Duration (minutes)</Label>
                        <Input type="number" placeholder="60" />
                      </div>
                      <div>
                        <Label>Difficulty Level</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">
                              Intermediate
                            </SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Lesson Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lecture">Lecture</SelectItem>
                            <SelectItem value="tutorial">Tutorial</SelectItem>
                            <SelectItem value="lab">Lab Exercise</SelectItem>
                            <SelectItem value="discussion">
                              Discussion
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Content Structure</Label>
                      <div className="space-y-2 mt-2">
                        {[
                          {
                            type: "Introduction",
                            icon: "📝",
                            desc: "Lesson overview and objectives",
                          },
                          {
                            type: "Main Content",
                            icon: "📚",
                            desc: "Core learning material",
                          },
                          {
                            type: "Interactive Elements",
                            icon: "🎮",
                            desc: "Quizzes, exercises, multimedia",
                          },
                          {
                            type: "Assessment",
                            icon: "��",
                            desc: "Knowledge check activities",
                          },
                          {
                            type: "Summary",
                            icon: "📋",
                            desc: "Key takeaways and next steps",
                          },
                        ].map((section, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{section.icon}</span>
                              <div>
                                <p className="font-medium">{section.type}</p>
                                <p className="text-sm text-muted-foreground">
                                  {section.desc}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                Configure
                              </Button>
                              <Checkbox />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Prerequisites</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Checkbox id="require-prev" />
                        <Label htmlFor="require-prev">
                          Require previous lesson completion
                        </Label>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Save as Draft</Button>
                    <Button>Create Lesson</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">SCORM Content</h4>
                <Upload className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Upload SCORM packages
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-full"
                    size="sm"
                    variant="outline"
                    onClick={() => setContentView("scorm")}
                  >
                    Upload SCORM
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Upload SCORM Package</DialogTitle>
                    <DialogDescription>
                      Upload SCORM 1.2 or SCORM 2004 compliant content packages
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Course Assignment</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select target course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h4 className="font-medium mb-2">
                        Drop SCORM package here
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Or click to browse files (ZIP format only)
                      </p>
                      <div className="flex justify-center">
                        <Button>Choose SCORM File</Button>
                      </div>
                    </div>
                    <div>
                      <Label>Package Information</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <Label className="text-sm">SCORM Version</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Auto-detect" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="auto">Auto-detect</SelectItem>
                              <SelectItem value="scorm12">SCORM 1.2</SelectItem>
                              <SelectItem value="scorm2004">
                                SCORM 2004
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm">Content Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="course">
                                Full Course
                              </SelectItem>
                              <SelectItem value="lesson">
                                Individual Lesson
                              </SelectItem>
                              <SelectItem value="assessment">
                                Assessment
                              </SelectItem>
                              <SelectItem value="simulation">
                                Simulation
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Upload Settings</Label>
                      <div className="space-y-3 mt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="validate-package" defaultChecked />
                          <Label htmlFor="validate-package">
                            Validate SCORM package
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="extract-manifest" defaultChecked />
                          <Label htmlFor="extract-manifest">
                            Extract manifest information
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="enable-tracking" defaultChecked />
                          <Label htmlFor="enable-tracking">
                            Enable completion tracking
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="auto-publish" />
                          <Label htmlFor="auto-publish">
                            Publish immediately after upload
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Upload Package</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">LTI Integration</h4>
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Connect external tools
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-full"
                    size="sm"
                    variant="outline"
                    onClick={() => setContentView("lti")}
                  >
                    Add LTI Tool
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Configure LTI Integration</DialogTitle>
                    <DialogDescription>
                      Connect external learning tools using Learning Tools
                      Interoperability (LTI)
                    </DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="basic">
                        Basic Configuration
                      </TabsTrigger>
                      <TabsTrigger value="advanced">
                        Advanced Settings
                      </TabsTrigger>
                      <TabsTrigger value="security">
                        Security & Privacy
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="basic" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Tool Name</Label>
                          <Input placeholder="Enter tool name" />
                        </div>
                        <div>
                          <Label>Tool URL</Label>
                          <Input placeholder="https://tool.example.com/lti" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Consumer Key</Label>
                          <Input placeholder="Enter consumer key" />
                        </div>
                        <div>
                          <Label>Shared Secret</Label>
                          <Input
                            type="password"
                            placeholder="Enter shared secret"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Tool Description</Label>
                        <Textarea placeholder="Describe what this tool does..." />
                      </div>
                      <div>
                        <Label>Course Integration</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select target course" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Courses</SelectItem>
                            {courses.map((course) => (
                              <SelectItem key={course.id} value={course.id}>
                                {course.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>
                    <TabsContent value="advanced" className="space-y-4">
                      <div>
                        <Label>LTI Version</Label>
                        <Select defaultValue="lti1p1">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lti1p0">LTI 1.0</SelectItem>
                            <SelectItem value="lti1p1">LTI 1.1</SelectItem>
                            <SelectItem value="lti1p3">LTI 1.3</SelectItem>
                            <SelectItem value="lti2p0">LTI 2.0</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Launch Parameters</Label>
                        <div className="space-y-2 mt-2">
                          {[
                            { param: "User ID", key: "user_id", enabled: true },
                            {
                              param: "User Email",
                              key: "lis_person_contact_email_primary",
                              enabled: true,
                            },
                            { param: "User Role", key: "roles", enabled: true },
                            {
                              param: "Course ID",
                              key: "context_id",
                              enabled: true,
                            },
                            {
                              param: "Course Title",
                              key: "context_title",
                              enabled: false,
                            },
                            {
                              param: "User Name",
                              key: "lis_person_name_full",
                              enabled: false,
                            },
                          ].map((param, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 border rounded"
                            >
                              <div>
                                <p className="font-medium text-sm">
                                  {param.param}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {param.key}
                                </p>
                              </div>
                              <Checkbox defaultChecked={param.enabled} />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Launch Presentation</Label>
                          <Select defaultValue="iframe">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="iframe">
                                Embedded (iframe)
                              </SelectItem>
                              <SelectItem value="window">New Window</SelectItem>
                              <SelectItem value="popup">
                                Popup Window
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Grade Passback</Label>
                          <Select defaultValue="enabled">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="enabled">
                                Enable Grade Passback
                              </SelectItem>
                              <SelectItem value="disabled">
                                Disable Grade Passback
                              </SelectItem>
                              <SelectItem value="manual">
                                Manual Grade Entry
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="security" className="space-y-4">
                      <div>
                        <Label>Authentication Method</Label>
                        <Select defaultValue="oauth">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="oauth">OAuth 1.0a</SelectItem>
                            <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                            <SelectItem value="basic">
                              Basic Authentication
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Privacy Settings</Label>
                        <div className="space-y-3 mt-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Share User Personal Information</Label>
                              <p className="text-sm text-muted-foreground">
                                Include name, email in launch data
                              </p>
                            </div>
                            <Checkbox defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Share User Role Information</Label>
                              <p className="text-sm text-muted-foreground">
                                Include user roles and permissions
                              </p>
                            </div>
                            <Checkbox defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Allow Tool to Access Gradebook</Label>
                              <p className="text-sm text-muted-foreground">
                                Enable grade reading and writing
                              </p>
                            </div>
                            <Checkbox />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label>SSL/TLS Requirements</Label>
                        <div className="flex items-center space-x-2 mt-2">
                          <Checkbox id="require-ssl" defaultChecked />
                          <Label htmlFor="require-ssl">
                            Require SSL/TLS for all communications
                          </Label>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  <DialogFooter>
                    <Button variant="outline">Test Connection</Button>
                    <Button variant="outline">Save as Draft</Button>
                    <Button>Configure Tool</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Learning Outcomes</h4>
                <Target className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Define learning objectives
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-full"
                    size="sm"
                    variant="outline"
                    onClick={() => setContentView("outcomes")}
                  >
                    Manage Outcomes
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl">
                  <DialogHeader>
                    <DialogTitle>Learning Outcomes Management</DialogTitle>
                    <DialogDescription>
                      Define, organize, and track learning objectives and
                      competencies
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                        <Input
                          placeholder="Search outcomes..."
                          className="w-64"
                        />
                        <Select defaultValue="all">
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Courses</SelectItem>
                            {courses.map((course) => (
                              <SelectItem key={course.id} value={course.id}>
                                {course.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select defaultValue="all-levels">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all-levels">
                              All Levels
                            </SelectItem>
                            <SelectItem value="remember">Remember</SelectItem>
                            <SelectItem value="understand">
                              Understand
                            </SelectItem>
                            <SelectItem value="apply">Apply</SelectItem>
                            <SelectItem value="analyze">Analyze</SelectItem>
                            <SelectItem value="evaluate">Evaluate</SelectItem>
                            <SelectItem value="create">Create</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Outcome
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        {
                          id: "LO001",
                          title: "Analyze algorithmic complexity",
                          description:
                            "Students will be able to determine time and space complexity of algorithms",
                          level: "Analyze",
                          domain: "Cognitive",
                          course: "Data Structures",
                          assessments: 3,
                          status: "active",
                        },
                        {
                          id: "LO002",
                          title: "Design database schemas",
                          description:
                            "Students will design normalized database schemas for real-world applications",
                          level: "Create",
                          domain: "Cognitive",
                          course: "Database Systems",
                          assessments: 2,
                          status: "active",
                        },
                        {
                          id: "LO003",
                          title: "Implement data structures",
                          description:
                            "Students will implement various data structures from scratch",
                          level: "Apply",
                          domain: "Psychomotor",
                          course: "Data Structures",
                          assessments: 5,
                          status: "draft",
                        },
                      ].map((outcome, index) => (
                        <Card key={outcome.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-medium">{outcome.title}</h4>
                                <Badge variant="outline">{outcome.level}</Badge>
                                <Badge variant="secondary">
                                  {outcome.domain}
                                </Badge>
                                <Badge
                                  variant={
                                    outcome.status === "active"
                                      ? "default"
                                      : "outline"
                                  }
                                >
                                  {outcome.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {outcome.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>ID: {outcome.id}</span>
                                <span>Course: {outcome.course}</span>
                                <span>Assessments: {outcome.assessments}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Edit3 className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Target className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                    <div className="border rounded-lg p-4 bg-muted/50">
                      <h4 className="font-medium mb-3">
                        Create New Learning Outcome
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Outcome Title</Label>
                          <Input placeholder="Enter learning outcome title" />
                        </div>
                        <div>
                          <Label>Bloom's Taxonomy Level</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select cognitive level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="remember">
                                Remember (Knowledge)
                              </SelectItem>
                              <SelectItem value="understand">
                                Understand (Comprehension)
                              </SelectItem>
                              <SelectItem value="apply">
                                Apply (Application)
                              </SelectItem>
                              <SelectItem value="analyze">
                                Analyze (Analysis)
                              </SelectItem>
                              <SelectItem value="evaluate">
                                Evaluate (Synthesis)
                              </SelectItem>
                              <SelectItem value="create">
                                Create (Evaluation)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Label>Detailed Description</Label>
                        <Textarea placeholder="Describe what students will be able to do..." />
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <Label>Domain</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Learning domain" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cognitive">
                                Cognitive
                              </SelectItem>
                              <SelectItem value="affective">
                                Affective
                              </SelectItem>
                              <SelectItem value="psychomotor">
                                Psychomotor
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Assessment Method</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="How to assess" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="exam">Written Exam</SelectItem>
                              <SelectItem value="project">
                                Project Work
                              </SelectItem>
                              <SelectItem value="presentation">
                                Presentation
                              </SelectItem>
                              <SelectItem value="practical">
                                Practical Assessment
                              </SelectItem>
                              <SelectItem value="portfolio">
                                Portfolio
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Priority Level</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="essential">
                                Essential
                              </SelectItem>
                              <SelectItem value="important">
                                Important
                              </SelectItem>
                              <SelectItem value="desirable">
                                Desirable
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          Clear
                        </Button>
                        <Button size="sm">Add Outcome</Button>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Export Outcomes</Button>
                    <Button variant="outline">Import from Template</Button>
                    <Button>Save All Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Completion Rules</h4>
                <CheckCircle className="h-5 w-5 text-teal-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Set completion criteria
              </p>
              <Button
                className="w-full"
                size="sm"
                variant="outline"
                onClick={() => setContentView("rules")}
              >
                Configure Rules
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Progress Tracking</h4>
                <Activity className="h-5 w-5 text-indigo-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Monitor learning progress
              </p>
              <Button
                className="w-full"
                size="sm"
                variant="outline"
                onClick={() => setContentView("analytics")}
              >
                View Analytics
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Question Banks</h4>
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Manage assessment questions
              </p>
              <Button
                className="w-full"
                size="sm"
                onClick={() => setContentView("banks")}
              >
                Manage Banks
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Assessment Tools</h4>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Advanced assessment features
              </p>
              <Button
                className="w-full"
                size="sm"
                variant="outline"
                onClick={() => setContentView("quickAnalytics")}
              >
                Quick Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  const renderVirtualClassrooms = () => (
    <Card className="section-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
            <Video className="h-5 w-5" />
          </div>
          Virtual Classroom Integration
        </CardTitle>
        <CardDescription>
          Manage virtual sessions with Zoom, Teams, Google Meet integration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={() => setIsCreateVirtualSessionDialogOpen(true)}>
            <Video className="h-4 w-4 mr-2" />
            Schedule Session
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Calendar Sync
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Calendar Integration</DialogTitle>
                <DialogDescription>
                  Sync virtual sessions with your calendar applications
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Calendar Platform</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      { platform: "Google Calendar", connected: true },
                      { platform: "Microsoft Outlook", connected: false },
                      { platform: "Apple iCal", connected: false },
                      { platform: "Institution Calendar", connected: true },
                    ].map((cal, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              cal.connected ? "bg-green-500" : "bg-gray-300"
                            }`}
                          ></div>
                          <span>{cal.platform}</span>
                        </div>
                        <Button
                          size="sm"
                          variant={cal.connected ? "outline" : "default"}
                        >
                          {cal.connected ? "Disconnect" : "Connect"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Sync Settings</Label>
                  <div className="space-y-3 mt-2">
                    <div className="flex items-center justify-between">
                      <Label>Auto-sync new sessions</Label>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Send calendar invites to students</Label>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Include meeting links in invites</Label>
                      <Checkbox defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button>Save Settings</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Platform Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Virtual Platform Configuration</DialogTitle>
                <DialogDescription>
                  Configure your preferred virtual meeting platforms
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Default Platform</Label>
                  <Select defaultValue="zoom">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zoom">Zoom</SelectItem>
                      <SelectItem value="teams">Microsoft Teams</SelectItem>
                      <SelectItem value="meet">Google Meet</SelectItem>
                      <SelectItem value="webex">Cisco Webex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Platform Credentials</Label>
                  <div className="space-y-3 mt-2">
                    <div>
                      <Label className="text-sm">Zoom API Key</Label>
                      <Input
                        type="password"
                        placeholder="Enter your Zoom API key"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Zoom API Secret</Label>
                      <Input
                        type="password"
                        placeholder="Enter your Zoom API secret"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Session Defaults</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label className="text-sm">
                        Default Duration (minutes)
                      </Label>
                      <Input defaultValue="60" />
                    </div>
                    <div>
                      <Label className="text-sm">Join Before Host</Label>
                      <Select defaultValue="false">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Enabled</SelectItem>
                          <SelectItem value="false">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Security Settings</Label>
                  <div className="space-y-3 mt-2">
                    <div className="flex items-center justify-between">
                      <Label>Require password for meetings</Label>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Enable waiting room</Label>
                      <Checkbox />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Record sessions automatically</Label>
                      <Checkbox />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Test Connection</Button>
                <Button>Save Configuration</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Session</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Scheduled</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Attendees</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {virtualSessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{session.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {session.id}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {courses.find((c) => c.id === session.courseId)?.name}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {session.platform === "zoom" && (
                      <Video className="h-4 w-4" />
                    )}
                    {session.platform === "teams" && (
                      <Users className="h-4 w-4" />
                    )}
                    {session.platform === "meet" && (
                      <Video className="h-4 w-4" />
                    )}
                    <span className="capitalize">{session.platform}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(session.scheduledDate).toLocaleString()}
                </TableCell>
                <TableCell>{session.duration} min</TableCell>
                <TableCell>{session.attendees}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      session.status === "scheduled"
                        ? "outline"
                        : session.status === "ongoing"
                        ? "default"
                        : session.status === "completed"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {session.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    {session.recordingAvailable && (
                      <Button variant="ghost" size="sm">
                        <PlayCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderAssignmentManagement = () => (
    <div className="space-y-6">
      {/* Assignment Creation & Configuration */}
      <Card className="section-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <FileText className="h-5 w-5" />
            </div>
            Assignment Creation & Management System
          </CardTitle>
          <CardDescription>
            Create assignments with configurable grading methods, plagiarism
            detection, and annotation tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="p-4 border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors">
              <div className="text-center">
                <Plus className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <h4 className="font-medium mb-2">Create New Assignment</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Design assignments with detailed requirements
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Assignment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Assignment</DialogTitle>
                      <DialogDescription>
                        Create a new assignment with detailed requirements and
                        grading criteria
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Assignment Title</Label>
                          <Input placeholder="Enter assignment title" />
                        </div>
                        <div>
                          <Label>Course</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select course" />
                            </SelectTrigger>
                            <SelectContent>
                              {courses
                                .filter((c) =>
                                  c.faculty.includes(user?.name || "")
                                )
                                .map((course) => (
                                  <SelectItem key={course.id} value={course.id}>
                                    {course.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          placeholder="Provide detailed assignment description and requirements"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Due Date</Label>
                          <Input type="date" />
                        </div>
                        <div>
                          <Label>Max Points</Label>
                          <Input type="number" placeholder="100" />
                        </div>
                        <div>
                          <Label>Assignment Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="individual">
                                Individual
                              </SelectItem>
                              <SelectItem value="group">
                                Group Project
                              </SelectItem>
                              <SelectItem value="presentation">
                                Presentation
                              </SelectItem>
                              <SelectItem value="research">
                                Research Paper
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Submission Guidelines</Label>
                        <Textarea
                          placeholder="Specify file formats, submission instructions, etc."
                          rows={2}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="plagiarism" />
                        <Label htmlFor="plagiarism">
                          Enable plagiarism detection
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="peer-review" />
                        <Label htmlFor="peer-review">Enable peer review</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Save as Draft</Button>
                      <Button onClick={() => handleCreateFacultyAssignment("")}>
                        Create Assignment
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>

            <Card className="p-4 border-2 border-dashed border-green-200 hover:border-green-400 transition-colors">
              <div className="text-center">
                <Settings className="h-8 w-8 mx-auto mb-3 text-green-600" />
                <h4 className="font-medium mb-2">Grading Configuration</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Set up manual and rubrics-based grading
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Grading
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Grading Configuration</DialogTitle>
                      <DialogDescription>
                        Set up grading criteria, rubrics, and evaluation methods
                      </DialogDescription>
                    </DialogHeader>
                    <Tabs defaultValue="criteria">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="criteria">
                          Grading Criteria
                        </TabsTrigger>
                        <TabsTrigger value="rubric">Rubric Builder</TabsTrigger>
                        <TabsTrigger value="settings">
                          Grading Settings
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="criteria" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Grading Scale</Label>
                            <Select defaultValue="percentage">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percentage">
                                  Percentage (0-100)
                                </SelectItem>
                                <SelectItem value="points">
                                  Points Based
                                </SelectItem>
                                <SelectItem value="letter">
                                  Letter Grade (A-F)
                                </SelectItem>
                                <SelectItem value="pass-fail">
                                  Pass/Fail
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Passing Grade</Label>
                            <Input placeholder="60" />
                          </div>
                        </div>
                        <div>
                          <Label>Grade Categories</Label>
                          <div className="space-y-2 mt-2">
                            {[
                              { category: "Content Quality", weight: "40%" },
                              { category: "Organization", weight: "20%" },
                              { category: "Grammar & Style", weight: "20%" },
                              {
                                category: "Citations & References",
                                weight: "20%",
                              },
                            ].map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 border rounded-lg"
                              >
                                <Input
                                  defaultValue={item.category}
                                  className="border-0 font-medium"
                                />
                                <Input
                                  defaultValue={item.weight}
                                  className="w-20 text-center"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="rubric" className="space-y-4">
                        <div className="grid grid-cols-4 gap-2 text-center font-medium">
                          <div>Criteria</div>
                          <div>Excellent (4)</div>
                          <div>Good (3)</div>
                          <div>Needs Improvement (2)</div>
                        </div>
                        {[
                          "Content Knowledge",
                          "Organization",
                          "Writing Quality",
                        ].map((criteria, index) => (
                          <div key={index} className="grid grid-cols-4 gap-2">
                            <Input
                              defaultValue={criteria}
                              className="font-medium"
                            />
                            <Textarea
                              placeholder="Excellent performance description"
                              rows={2}
                            />
                            <Textarea
                              placeholder="Good performance description"
                              rows={2}
                            />
                            <Textarea
                              placeholder="Needs improvement description"
                              rows={2}
                            />
                          </div>
                        ))}
                        <Button variant="outline" className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Criteria
                        </Button>
                      </TabsContent>
                      <TabsContent value="settings" className="space-y-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Enable Late Submissions</Label>
                              <p className="text-sm text-muted-foreground">
                                Allow submissions after due date
                              </p>
                            </div>
                            <Checkbox defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Automatic Grade Release</Label>
                              <p className="text-sm text-muted-foreground">
                                Release grades automatically after grading
                              </p>
                            </div>
                            <Checkbox />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Anonymous Grading</Label>
                              <p className="text-sm text-muted-foreground">
                                Hide student names during grading
                              </p>
                            </div>
                            <Checkbox />
                          </div>
                          <div>
                            <Label>Late Penalty</Label>
                            <div className="flex gap-2 mt-1">
                              <Input placeholder="10" className="w-20" />
                              <Select defaultValue="percent">
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="percent">
                                    % per day
                                  </SelectItem>
                                  <SelectItem value="points">
                                    Points per day
                                  </SelectItem>
                                  <SelectItem value="fixed">
                                    Fixed penalty
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button>Save Configuration</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>

            <Card className="p-4 border-2 border-dashed border-purple-200 hover:border-purple-400 transition-colors">
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                <h4 className="font-medium mb-2">Plagiarism Detection</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure anti-plagiarism tools
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Shield className="h-4 w-4 mr-2" />
                      Setup Detection
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Plagiarism Detection Configuration
                      </DialogTitle>
                      <DialogDescription>
                        Configure anti-plagiarism tools and detection settings
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Enable Plagiarism Detection</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically scan submissions
                          </p>
                        </div>
                        <Checkbox defaultChecked />
                      </div>
                      <div>
                        <Label>Detection Sensitivity</Label>
                        <Select defaultValue="medium">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">
                              Low - 80%+ similarity
                            </SelectItem>
                            <SelectItem value="medium">
                              Medium - 60%+ similarity
                            </SelectItem>
                            <SelectItem value="high">
                              High - 40%+ similarity
                            </SelectItem>
                            <SelectItem value="strict">
                              Strict - 20%+ similarity
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Check Against</Label>
                        <div className="space-y-2 mt-2">
                          {[
                            { label: "Internet Sources", checked: true },
                            { label: "Academic Databases", checked: true },
                            {
                              label: "Student Papers Repository",
                              checked: true,
                            },
                            { label: "Published Works", checked: false },
                          ].map((source, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox defaultChecked={source.checked} />
                              <Label>{source.label}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label>Exclusions</Label>
                        <Textarea placeholder="Enter text to exclude from plagiarism checking (quotes, references, etc.)" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Generate Similarity Reports</Label>
                          <p className="text-sm text-muted-foreground">
                            Create detailed similarity reports
                          </p>
                        </div>
                        <Checkbox defaultChecked />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button>Save Settings</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          </div>

          {/* Assignment List & Management */}
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">My Assignments</CardTitle>
                <CardDescription>
                  Manage and track all your course assignments
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export List
                </Button>
                <Button size="sm" variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input
                    placeholder="Search assignments..."
                    className="max-w-sm"
                  />
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {courses
                        .filter((c) => c.faculty.includes(user?.name || ""))
                        .map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all-status">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-status">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assignment Title</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Submissions</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        id: "A001",
                        title: "Data Structures Implementation",
                        course: "Computer Science",
                        dueDate: "2024-02-20",
                        points: 100,
                        submissions: "25/30",
                        status: "Published",
                      },
                      {
                        id: "A002",
                        title: "Algorithm Analysis Report",
                        course: "Computer Science",
                        dueDate: "2024-02-25",
                        points: 80,
                        submissions: "12/30",
                        status: "Published",
                      },
                      {
                        id: "A003",
                        title: "Database Design Project",
                        course: "Database Systems",
                        dueDate: "2024-03-01",
                        points: 120,
                        submissions: "0/25",
                        status: "Draft",
                      },
                      {
                        id: "A004",
                        title: "Web Development Portfolio",
                        course: "Web Development",
                        dueDate: "2024-03-05",
                        points: 150,
                        submissions: "8/28",
                        status: "Published",
                      },
                    ].map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{assignment.title}</p>
                            <p className="text-sm text-muted-foreground">
                              ID: {assignment.id}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{assignment.course}</TableCell>
                        <TableCell>{assignment.dueDate}</TableCell>
                        <TableCell>{assignment.points}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{assignment.submissions}</span>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              assignment.status === "Published"
                                ? "default"
                                : assignment.status === "Draft"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {assignment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>
                                    {assignment.title} - Submissions
                                  </DialogTitle>
                                  <DialogDescription>
                                    Review and grade student submissions
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-4 gap-4 text-sm font-medium">
                                    <div>Student</div>
                                    <div>Submitted</div>
                                    <div>Grade</div>
                                    <div>Actions</div>
                                  </div>
                                  {[
                                    {
                                      student: "Manikandan",
                                      submitted: "2024-02-19",
                                      grade: "85/100",
                                      status: "graded",
                                    },
                                    {
                                      student: "Joshua",
                                      submitted: "2024-02-20",
                                      grade: "Not graded",
                                      status: "pending",
                                    },
                                    {
                                      student: "Malar",
                                      submitted: "2024-02-18",
                                      grade: "92/100",
                                      status: "graded",
                                    },
                                    {
                                      student: "Sarasvathi",
                                      submitted: "Not submitted",
                                      grade: "-",
                                      status: "missing",
                                    },
                                  ].map((submission, index) => (
                                    <div
                                      key={index}
                                      className="grid grid-cols-4 gap-4 items-center py-2 border-b"
                                    >
                                      <div>{submission.student}</div>
                                      <div>{submission.submitted}</div>
                                      <div>
                                        {submission.status === "pending" ? (
                                          <Input
                                            placeholder="Enter grade"
                                            className="w-20"
                                          />
                                        ) : (
                                          submission.grade
                                        )}
                                      </div>
                                      <div>
                                        {submission.status === "pending" ? (
                                          <Button
                                            size="sm"
                                            onClick={() =>
                                              handleGradeSubmission(
                                                assignment.id,
                                                85,
                                                "Good work!"
                                              )
                                            }
                                          >
                                            Grade
                                          </Button>
                                        ) : submission.status === "graded" ? (
                                          <Button size="sm" variant="outline">
                                            <Eye className="h-3 w-3" />
                                          </Button>
                                        ) : (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            disabled
                                          >
                                            Missing
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <DialogFooter>
                                  <Button variant="outline">
                                    Download All
                                  </Button>
                                  <Button>Save Grades</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <Edit3 className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Assignment</DialogTitle>
                                  <DialogDescription>
                                    Modify assignment details and settings
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label>Assignment Title</Label>
                                    <Input defaultValue={assignment.title} />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Due Date</Label>
                                      <Input
                                        type="date"
                                        defaultValue={assignment.dueDate}
                                      />
                                    </div>
                                    <div>
                                      <Label>Points</Label>
                                      <Input
                                        type="number"
                                        defaultValue={assignment.points}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Status</Label>
                                    <Select
                                      defaultValue={assignment.status.toLowerCase()}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="draft">
                                          Draft
                                        </SelectItem>
                                        <SelectItem value="published">
                                          Published
                                        </SelectItem>
                                        <SelectItem value="closed">
                                          Closed
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline">Cancel</Button>
                                  <Button
                                    onClick={() =>
                                      handleUpdateFacultyAssignment(
                                        assignment.id
                                      )
                                    }
                                  >
                                    Save Changes
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Assignment
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "
                                    {assignment.title}"? This action cannot be
                                    undone and will remove all student
                                    submissions.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteFacultyAssignment(
                                        assignment.id
                                      )
                                    }
                                  >
                                    Delete Assignment
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Grading Methods Configuration */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                Grading Methods & Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">Manual Grading</TabsTrigger>
                  <TabsTrigger value="rubrics">
                    Rubrics-Based Grading
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="manual" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">
                        Manual Grading Features
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Faculty annotation tools
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Custom point allocation
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Feedback comments
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Grade modification history
                        </li>
                      </ul>
                    </Card>
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Annotation Tools</h4>
                      <div className="space-y-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Text Annotations
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Comment Bubbles
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Target className="h-4 w-4 mr-2" />
                          Highlight & Mark
                        </Button>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="rubrics" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Rubrics Features</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Customizable criteria
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Performance levels
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Weighted scoring
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Automated calculations
                        </li>
                      </ul>
                    </Card>
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Sample Rubric</h4>
                      <div className="text-xs">
                        <div className="grid grid-cols-3 gap-1 border rounded">
                          <div className="p-2 bg-muted font-medium">
                            Criteria
                          </div>
                          <div className="p-2 bg-muted font-medium">Weight</div>
                          <div className="p-2 bg-muted font-medium">Points</div>
                          <div className="p-1">Content Quality</div>
                          <div className="p-1">40%</div>
                          <div className="p-1">0-40</div>
                          <div className="p-1">Organization</div>
                          <div className="p-1">30%</div>
                          <div className="p-1">0-30</div>
                          <div className="p-1">Grammar</div>
                          <div className="p-1">30%</div>
                          <div className="p-1">0-30</div>
                        </div>
                      </div>
                    </Card>
                  </div>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Custom Rubric
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Plagiarism Detection Integration */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                Plagiarism Detection Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                  <Shield className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                  <h4 className="font-medium mb-2">Turnitin Integration</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Industry-standard plagiarism detection
                  </p>
                  <Badge variant="outline">Connected</Badge>
                </Card>
                <Card className="p-4 text-center">
                  <Shield className="h-8 w-8 mx-auto mb-3 text-green-600" />
                  <h4 className="font-medium mb-2">Grammarly Business</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Grammar and plagiarism checking
                  </p>
                  <Badge variant="outline">Available</Badge>
                </Card>
                <Card className="p-4 text-center">
                  <Shield className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                  <h4 className="font-medium mb-2">Custom Detection</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Internal plagiarism engine
                  </p>
                  <Badge variant="outline">Active</Badge>
                </Card>
              </div>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h5 className="font-medium mb-2">Detection Settings</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Similarity Threshold</span>
                    <span className="font-medium">15%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Auto-flagging</span>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Reference Checking</span>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Internet Search</span>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Submission Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Student Submission & Faculty Evaluation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="submission" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="submission">
                    Student Submission
                  </TabsTrigger>
                  <TabsTrigger value="evaluation">
                    Faculty Evaluation
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="submission" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">
                        Text Editor Submission
                      </h4>
                      <div className="border-2 border-dashed border-gray-300 rounded p-4 mb-3">
                        <div className="text-sm text-muted-foreground">
                          Rich text editor with:
                        </div>
                        <ul className="text-xs space-y-1 mt-2">
                          <li>• Mathematical symbols support</li>
                          <li>• Code syntax highlighting</li>
                          <li>• Image insertion</li>
                          <li>• Citation tools</li>
                        </ul>
                      </div>
                      <Button size="sm" className="w-full">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Open Text Editor
                      </Button>
                    </Card>
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">
                        File Upload Submission
                      </h4>
                      <div className="border-2 border-dashed border-gray-300 rounded p-4 mb-3">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <div className="text-center text-sm text-muted-foreground">
                          Supported formats: PDF, DOC, DOCX, TXT
                          <br />
                          Max size: 50MB
                        </div>
                      </div>
                      <Button size="sm" className="w-full" variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                      </Button>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="evaluation" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Annotation Workspace</h4>
                      <div className="border rounded p-3 mb-3">
                        <div className="text-sm mb-2">Annotation Tools:</div>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline">
                            <Edit3 className="h-3 w-3 mr-1" />
                            Text
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Comment
                          </Button>
                          <Button size="sm" variant="outline">
                            <Target className="h-3 w-3 mr-1" />
                            Highlight
                          </Button>
                          <Button size="sm" variant="outline">
                            <XCircle className="h-3 w-3 mr-1" />
                            Error
                          </Button>
                        </div>
                      </div>
                      <Button size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        Open Annotation View
                      </Button>
                    </Card>
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Grading Interface</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Score</Label>
                          <div className="flex items-center gap-2">
                            <Input className="w-16 h-8" placeholder="85" />
                            <span className="text-sm text-muted-foreground">
                              / 100
                            </span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm">Feedback</Label>
                          <Textarea
                            className="mt-1 h-20"
                            placeholder="Provide detailed feedback..."
                          />
                        </div>
                        <Button size="sm" className="w-full">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Submit Grade
                        </Button>
                      </div>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );

  const renderAssessmentManagement = () => (
    <div className="space-y-6">
      {/* Question Bank & Assessment Creation */}
      <Card className="section-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-pink-50 text-pink-600">
              <CheckCircle className="h-5 w-5" />
            </div>
            Advanced Assessment & Question Bank System
          </CardTitle>
          <CardDescription>
            Create various question types, manage question banks, configure
            assessments, and handle evaluation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="p-4 border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors">
              <div className="text-center">
                <FileText className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <h4 className="font-medium mb-2">Question Bank</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Create and manage question repository
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Manage Questions
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl">
                    <DialogHeader>
                      <DialogTitle>Question Bank Management</DialogTitle>
                      <DialogDescription>
                        Create, edit, and organize your questions for
                        assessments
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                          <Input
                            placeholder="Search questions..."
                            className="w-64"
                          />
                          <Select defaultValue="all">
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Types</SelectItem>
                              <SelectItem value="mcq">
                                Multiple Choice
                              </SelectItem>
                              <SelectItem value="short">
                                Short Answer
                              </SelectItem>
                              <SelectItem value="long">Long Answer</SelectItem>
                              <SelectItem value="numerical">
                                Numerical
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Select defaultValue="all-difficulty">
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all-difficulty">
                                All Levels
                              </SelectItem>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Question
                        </Button>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Question</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Difficulty</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Points</TableHead>
                            <TableHead>Usage</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[
                            {
                              id: "Q001",
                              question:
                                "What is the time complexity of binary search?",
                              type: "MCQ",
                              difficulty: "Medium",
                              subject: "Data Structures",
                              points: 2,
                              usage: 15,
                            },
                            {
                              id: "Q002",
                              question:
                                "Explain the concept of polymorphism in OOP",
                              type: "Long Answer",
                              difficulty: "Hard",
                              subject: "OOP",
                              points: 5,
                              usage: 8,
                            },
                            {
                              id: "Q003",
                              question: "Calculate the derivative of f(x) = x²",
                              type: "Numerical",
                              difficulty: "Easy",
                              subject: "Mathematics",
                              points: 3,
                              usage: 22,
                            },
                            {
                              id: "Q004",
                              question: "What is the capital of France?",
                              type: "Short Answer",
                              difficulty: "Easy",
                              subject: "Geography",
                              points: 1,
                              usage: 5,
                            },
                          ].map((question) => (
                            <TableRow key={question.id}>
                              <TableCell>
                                <div className="max-w-xs">
                                  <p className="truncate font-medium">
                                    {question.question}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    ID: {question.id}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{question.type}</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    question.difficulty === "Easy"
                                      ? "secondary"
                                      : question.difficulty === "Medium"
                                      ? "default"
                                      : "destructive"
                                  }
                                >
                                  {question.difficulty}
                                </Badge>
                              </TableCell>
                              <TableCell>{question.subject}</TableCell>
                              <TableCell>{question.points}</TableCell>
                              <TableCell>{question.usage} times</TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button size="sm" variant="ghost">
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <Edit3 className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Export Questions</Button>
                      <Button>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>

            <Card className="p-4 border-2 border-dashed border-green-200 hover:border-green-400 transition-colors">
              <div className="text-center">
                <Upload className="h-8 w-8 mx-auto mb-3 text-green-600" />
                <h4 className="font-medium mb-2">Bulk Upload</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Import questions from files
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Bulk Import
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Bulk Import Questions</DialogTitle>
                      <DialogDescription>
                        Upload questions from Excel, CSV, or QTI files
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h4 className="font-medium mb-2">
                          Drag & Drop Files Here
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Supported formats: .xlsx, .csv, .qti, .xml
                        </p>
                        <Button onClick={handleChooseFile}>Choose Files</Button>
                      </div>
                      <div>
                        <Label>Import Template</Label>
                        <div className="mt-2 space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Excel Template
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download CSV Template
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label>Import Settings</Label>
                        <div className="space-y-3 mt-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="skip-duplicates" defaultChecked />
                            <Label htmlFor="skip-duplicates">
                              Skip duplicate questions
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="validate-format" defaultChecked />
                            <Label htmlFor="validate-format">
                              Validate question format
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="auto-categorize" />
                            <Label htmlFor="auto-categorize">
                              Auto-categorize by subject
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button>Start Import</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>

            <Card className="p-4 border-2 border-dashed border-purple-200 hover:border-purple-400 transition-colors">
              <div className="text-center">
                <Calendar className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                <h4 className="font-medium mb-2">Create Assessment</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure and schedule assessments
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      New Assessment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Create New Assessment</DialogTitle>
                      <DialogDescription>
                        Set up a new quiz, test, or examination with questions
                        from your bank
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Assessment Title</Label>
                          <Input placeholder="Enter assessment title" />
                        </div>
                        <div>
                          <Label>Course</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select course" />
                            </SelectTrigger>
                            <SelectContent>
                              {courses
                                .filter((c) =>
                                  c.faculty.includes(user?.name || "")
                                )
                                .map((course) => (
                                  <SelectItem key={course.id} value={course.id}>
                                    {course.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Assessment Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="quiz">Quiz</SelectItem>
                              <SelectItem value="midterm">
                                Midterm Exam
                              </SelectItem>
                              <SelectItem value="final">Final Exam</SelectItem>
                              <SelectItem value="assignment">
                                Assignment Test
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Duration (minutes)</Label>
                          <Input type="number" placeholder="60" />
                        </div>
                        <div>
                          <Label>Total Points</Label>
                          <Input type="number" placeholder="100" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Start Date & Time</Label>
                          <Input type="datetime-local" />
                        </div>
                        <div>
                          <Label>End Date & Time</Label>
                          <Input type="datetime-local" />
                        </div>
                      </div>
                      <div>
                        <Label>Instructions</Label>
                        <Textarea
                          placeholder="Enter assessment instructions for students..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>Assessment Settings</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="shuffle-questions" />
                              <Label htmlFor="shuffle-questions">
                                Shuffle questions
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="show-results" defaultChecked />
                              <Label htmlFor="show-results">
                                Show results immediately
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="multiple-attempts" />
                              <Label htmlFor="multiple-attempts">
                                Allow multiple attempts
                              </Label>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="time-limit" defaultChecked />
                              <Label htmlFor="time-limit">
                                Enable time limit
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="proctoring" />
                              <Label htmlFor="proctoring">
                                Enable proctoring
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="auto-submit" defaultChecked />
                              <Label htmlFor="auto-submit">
                                Auto-submit on time expire
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label>Select Questions</Label>
                        <div className="mt-2 space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                          {[
                            {
                              id: "Q001",
                              question:
                                "What is the time complexity of binary search?",
                              type: "MCQ",
                              points: 2,
                            },
                            {
                              id: "Q002",
                              question: "Explain polymorphism in OOP",
                              type: "Long Answer",
                              points: 5,
                            },
                            {
                              id: "Q003",
                              question: "Calculate derivative of f(x) = x²",
                              type: "Numerical",
                              points: 3,
                            },
                            {
                              id: "Q004",
                              question: "What is encapsulation?",
                              type: "Short Answer",
                              points: 2,
                            },
                          ].map((q) => (
                            <div
                              key={q.id}
                              className="flex items-center justify-between p-2 border rounded"
                            >
                              <div className="flex items-center space-x-2">
                                <Checkbox id={q.id} />
                                <div>
                                  <p className="font-medium text-sm">
                                    {q.question}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {q.type} • {q.points} points
                                  </p>
                                </div>
                              </div>
                              <Badge variant="outline">{q.points}pts</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Save as Draft</Button>
                      <Button onClick={() => handleCreateAssessmentComplete()}>
                        Create Assessment
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          </div>

          {/* Question Types */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                Question Types & Creation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="mcq" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="mcq">MCQ</TabsTrigger>
                  <TabsTrigger value="short">Short Answer</TabsTrigger>
                  <TabsTrigger value="long">Long Answer</TabsTrigger>
                  <TabsTrigger value="match">Match Following</TabsTrigger>
                  <TabsTrigger value="numerical">Numerical</TabsTrigger>
                </TabsList>

                <TabsContent value="mcq" className="space-y-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">
                      Multiple Choice Questions
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm">Question</Label>
                        <Textarea
                          placeholder="Enter your question..."
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-sm">Option A</Label>
                          <Input placeholder="Option A" className="mt-1" />
                        </div>
                        <div>
                          <Label className="text-sm">Option B</Label>
                          <Input placeholder="Option B" className="mt-1" />
                        </div>
                        <div>
                          <Label className="text-sm">Option C</Label>
                          <Input placeholder="Option C" className="mt-1" />
                        </div>
                        <div>
                          <Label className="text-sm">Option D</Label>
                          <Input placeholder="Option D" className="mt-1" />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Label className="text-sm">Correct Answer:</Label>
                        <RadioGroup defaultValue="a" className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="a" id="a" />
                            <Label htmlFor="a">A</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="b" id="b" />
                            <Label htmlFor="b">B</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="c" id="c" />
                            <Label htmlFor="c">C</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="d" id="d" />
                            <Label htmlFor="d">D</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">Points:</Label>
                          <Input className="w-20" placeholder="10" />
                        </div>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Question
                        </Button>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="short" className="space-y-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Short Answer Questions</h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm">Question</Label>
                        <Textarea
                          placeholder="Enter your question..."
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">
                          Expected Answer (for auto-grading)
                        </Label>
                        <Input
                          placeholder="Expected answer keywords..."
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-sm">Max Length (words)</Label>
                          <Input placeholder="100" className="mt-1" />
                        </div>
                        <div>
                          <Label className="text-sm">Points</Label>
                          <Input placeholder="15" className="mt-1" />
                        </div>
                      </div>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Question
                      </Button>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="long" className="space-y-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Long Answer Questions</h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm">Question</Label>
                        <Textarea
                          placeholder="Enter your essay question..."
                          className="mt-1 h-20"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Grading Rubric</Label>
                        <Textarea
                          placeholder="Define grading criteria..."
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-sm">Min Length (words)</Label>
                          <Input placeholder="200" className="mt-1" />
                        </div>
                        <div>
                          <Label className="text-sm">Max Length (words)</Label>
                          <Input placeholder="500" className="mt-1" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">Points:</Label>
                          <Input className="w-20" placeholder="25" />
                        </div>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Question
                        </Button>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="match" className="space-y-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Match the Following</h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm">Instructions</Label>
                        <Input
                          placeholder="Match items from Column A with Column B"
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm">Column A</Label>
                          <div className="space-y-2 mt-1">
                            <Input placeholder="Item 1" />
                            <Input placeholder="Item 2" />
                            <Input placeholder="Item 3" />
                            <Input placeholder="Item 4" />
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm">Column B</Label>
                          <div className="space-y-2 mt-1">
                            <Input placeholder="Match 1" />
                            <Input placeholder="Match 2" />
                            <Input placeholder="Match 3" />
                            <Input placeholder="Match 4" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">Points per match:</Label>
                          <Input className="w-20" placeholder="2" />
                        </div>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Question
                        </Button>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="numerical" className="space-y-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Numerical Questions</h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm">Question</Label>
                        <Textarea
                          placeholder="Enter numerical problem..."
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label className="text-sm">Correct Answer</Label>
                          <Input placeholder="42.5" className="mt-1" />
                        </div>
                        <div>
                          <Label className="text-sm">Tolerance (±)</Label>
                          <Input placeholder="0.1" className="mt-1" />
                        </div>
                        <div>
                          <Label className="text-sm">Unit</Label>
                          <Input placeholder="meters" className="mt-1" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="formulas" />
                        <Label htmlFor="formulas" className="text-sm">
                          Allow mathematical formulas
                        </Label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">Points:</Label>
                          <Input className="w-20" placeholder="10" />
                        </div>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Question
                        </Button>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Assessment Configuration */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                Assessment Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h4 className="font-medium mb-3">Assessment Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm">Assessment Title</Label>
                      <Input
                        placeholder="Midterm Examination"
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">Start Date</Label>
                        <Input type="datetime-local" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-sm">End Date</Label>
                        <Input type="datetime-local" className="mt-1" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">Duration (minutes)</Label>
                        <Input placeholder="120" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-sm">Attempts Allowed</Label>
                        <Input placeholder="1" className="mt-1" />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-3">Grading Configuration</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">Total Marks</Label>
                        <Input placeholder="100" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-sm">Passing Marks</Label>
                        <Input placeholder="60" className="mt-1" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">Grading Method</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select grading method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">
                            Automatic Grading
                          </SelectItem>
                          <SelectItem value="manual">Manual Grading</SelectItem>
                          <SelectItem value="hybrid">
                            Hybrid (Auto + Manual)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="randomize" />
                      <Label htmlFor="randomize" className="text-sm">
                        Randomize question order
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="feedback" />
                      <Label htmlFor="feedback" className="text-sm">
                        Instant feedback
                      </Label>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Evaluation & Re-grading */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Evaluation & Re-grading System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="evaluation" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="evaluation">Auto Evaluation</TabsTrigger>
                  <TabsTrigger value="manual">Manual Review</TabsTrigger>
                  <TabsTrigger value="regrade">Re-grading</TabsTrigger>
                </TabsList>

                <TabsContent value="evaluation" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Automated Evaluation</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          MCQ automatic scoring
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Numerical answer validation
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Match following auto-check
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Keyword matching for short answers
                        </li>
                      </ul>
                      <Button className="w-full mt-3">
                        <Zap className="h-4 w-4 mr-2" />
                        Run Auto Evaluation
                      </Button>
                    </Card>
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Evaluation Status</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>Total Submissions</span>
                          <Badge variant="secondary">45</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Auto-graded</span>
                          <Badge variant="default">40</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Manual Review Required</span>
                          <Badge variant="destructive">5</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Completion Rate</span>
                          <Badge variant="outline">89%</Badge>
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="manual" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Manual Review Queue</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Student:manikandan</span>
                          <Button size="sm" variant="outline">
                            Review
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Student: rahual</span>
                          <Button size="sm" variant="outline">
                            Review
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Student: Malar</span>
                          <Button size="sm" variant="outline">
                            Review
                          </Button>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Review Interface</h4>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm">Question Review</Label>
                          <div className="border rounded p-2 text-sm bg-muted">
                            Long answer review interface with annotation tools
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Input placeholder="Score" className="w-20" />
                          <span className="text-sm self-center">/ 25</span>
                        </div>
                        <Button size="sm" className="w-full">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Submit Grade
                        </Button>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="regrade" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">
                        Individual Re-grading
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm">Student ID/Name</Label>
                          <Input
                            placeholder="Enter student ID or name"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">New Score</Label>
                          <div className="flex gap-2 mt-1">
                            <Input placeholder="85" className="w-20" />
                            <span className="text-sm self-center">/ 100</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm">Reason for Change</Label>
                          <Textarea
                            placeholder="Explain reason for re-grading..."
                            className="mt-1"
                          />
                        </div>
                        <Button className="w-full">
                          <Edit3 className="h-4 w-4 mr-2" />
                          Update Grade
                        </Button>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Bulk Re-grading</h4>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm">Select Students</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Choose group" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Students</SelectItem>
                              <SelectItem value="failed">
                                Failed Students
                              </SelectItem>
                              <SelectItem value="custom">
                                Custom Selection
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm">Adjustment Type</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select adjustment" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="add">Add Points</SelectItem>
                              <SelectItem value="multiply">
                                Multiply by Factor
                              </SelectItem>
                              <SelectItem value="curve">Apply Curve</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm">Value</Label>
                          <Input placeholder="5" className="mt-1" />
                        </div>
                        <Button className="w-full" variant="outline">
                          <Users className="h-4 w-4 mr-2" />
                          Apply Bulk Changes
                        </Button>
                      </div>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );

  const renderCertificateManagement = () => (
    <Card className="section-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-yellow-50 text-yellow-600">
            <Award className="h-5 w-5" />
          </div>
          Certificate & Transcript Management
        </CardTitle>
        <CardDescription>
          Generate certificates with QR verification and transcript access
          control
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={() => setIsCertificateDialogOpen(true)}>
            <Award className="h-4 w-4 mr-2" />
            Generate Certificate
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <QrCode className="h-4 w-4 mr-2" />
                QR Verification
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>QR Code Verification</DialogTitle>
                <DialogDescription>
                  Verify certificate authenticity using QR codes
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Verification Method</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="scan-qr"
                        name="verify-method"
                        defaultChecked
                      />
                      <Label htmlFor="scan-qr">Scan QR Code</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="enter-code"
                        name="verify-method"
                      />
                      <Label htmlFor="enter-code">Enter Certificate Code</Label>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Certificate Code</Label>
                  <Input placeholder="Enter certificate verification code" />
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <QrCode className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm text-muted-foreground">
                    Position QR code within the frame to scan
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Clear</Button>
                <Button>Verify Certificate</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Transcript Access
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Transcript Access Control</DialogTitle>
                <DialogDescription>
                  Manage student transcript access permissions and sharing
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Select Student</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose student" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deepak">deepak</SelectItem>
                      <SelectItem value="dinesh">dinesh</SelectItem>
                      <SelectItem value="ranjith">ranjith</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Access Level</Label>
                  <div className="space-y-2 mt-2">
                    {[
                      {
                        level: "Full Access",
                        desc: "Complete academic record",
                      },
                      { level: "Grades Only", desc: "Course grades and GPA" },
                      { level: "Courses Only", desc: "Enrolled courses list" },
                      {
                        level: "Certificates Only",
                        desc: "Earned certificates",
                      },
                    ].map((access, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{access.level}</p>
                          <p className="text-sm text-muted-foreground">
                            {access.desc}
                          </p>
                        </div>
                        <Checkbox />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Sharing Options</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label className="text-sm">Valid Until</Label>
                      <Input type="date" />
                    </div>
                    <div>
                      <Label className="text-sm">Password Protection</Label>
                      <Input type="password" placeholder="Optional password" />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Generate Access Link</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Templates
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Certificate Templates</DialogTitle>
                <DialogDescription>
                  Create and manage certificate templates for different courses
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Available Templates</h4>
                    <p className="text-sm text-muted-foreground">
                      Choose or create certificate templates
                    </p>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Template
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      id: "template1",
                      name: "Standard Certificate",
                      preview:
                        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
                    },
                    {
                      id: "template2",
                      name: "Academic Excellence",
                      preview:
                        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
                    },
                    {
                      id: "template3",
                      name: "Course Completion",
                      preview:
                        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
                    },
                    {
                      id: "template4",
                      name: "Professional Training",
                      preview:
                        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
                    },
                  ].map((template) => (
                    <Card
                      key={template.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <img
                          src={template.preview}
                          alt={template.name}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                        <h5 className="font-medium">{template.name}</h5>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            Preview
                          </Button>
                          <Button size="sm" variant="outline">
                            Use
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Import Template</Button>
                <Button>Save Templates</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Certificate</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>QR Code</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certificates.map((certificate) => (
              <TableRow key={certificate.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{certificate.id}</div>
                    <div className="text-sm text-muted-foreground">
                      {certificate.template}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{certificate.studentId}</TableCell>
                <TableCell>
                  {courses.find((c) => c.id === certificate.courseId)?.name}
                </TableCell>
                <TableCell>{certificate.issueDate}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <QrCode className="h-4 w-4" />
                    <span className="text-sm font-mono">
                      {certificate.qrCode}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <a
                    href={certificate.verificationUrl}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Verify Certificate
                  </a>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      certificate.status === "issued"
                        ? "default"
                        : certificate.status === "revoked"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {certificate.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <QrCode className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderAdvancedAnalytics = () => (
    <Card className="section-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-red-50 text-red-600">
            <BarChart3 className="h-5 w-5" />
          </div>
          Advanced Analytics & Reports
        </CardTitle>
        <CardDescription>
          Comprehensive learning analytics and performance tracking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Learning Analytics</h4>
                <PieChart className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Student engagement and progress
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full" size="sm">
                    View Analytics
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl">
                  <DialogHeader>
                    <DialogTitle>Learning Analytics Dashboard</DialogTitle>
                    <DialogDescription>
                      Comprehensive analytics for student engagement and
                      learning progress
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="stat-card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                        <div className="text-center">
                          <p className="text-sm font-medium text-blue-600">
                            Total Students
                          </p>
                          <p className="text-2xl font-bold text-blue-900">
                            156
                          </p>
                          <p className="text-xs text-blue-600">
                            +12% this month
                          </p>
                        </div>
                      </div>
                      <div className="stat-card bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                        <div className="text-center">
                          <p className="text-sm font-medium text-green-600">
                            Avg. Engagement
                          </p>
                          <p className="text-2xl font-bold text-green-900">
                            87%
                          </p>
                          <p className="text-xs text-green-600">
                            +5% this week
                          </p>
                        </div>
                      </div>
                      <div className="stat-card bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                        <div className="text-center">
                          <p className="text-sm font-medium text-purple-600">
                            Completion Rate
                          </p>
                          <p className="text-2xl font-bold text-purple-900">
                            92%
                          </p>
                          <p className="text-xs text-purple-600">
                            +3% this month
                          </p>
                        </div>
                      </div>
                      <div className="stat-card bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
                        <div className="text-center">
                          <p className="text-sm font-medium text-orange-600">
                            Avg. Score
                          </p>
                          <p className="text-2xl font-bold text-orange-900">
                            84.5
                          </p>
                          <p className="text-xs text-orange-600">
                            +2.1 this month
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Student Engagement Trends
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {courses
                              .filter((c) =>
                                c.faculty.includes(user?.name || "")
                              )
                              .slice(0, 4)
                              .map((course) => (
                                <div
                                  key={course.id}
                                  className="flex items-center justify-between"
                                >
                                  <div>
                                    <p className="font-medium">{course.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {course.enrolled} students
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">
                                      {course.completion}%
                                    </p>
                                    <Progress
                                      value={course.completion}
                                      className="w-20 h-2"
                                    />
                                  </div>
                                </div>
                              ))}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Recent Activity
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {[
                              {
                                student: "manikandan",
                                action: "Completed Assignment",
                                course: "Data Structures",
                                time: "2 hours ago",
                              },
                              {
                                student: "kiruba",
                                action: "Started Quiz",
                                course: "Algorithms",
                                time: "4 hours ago",
                              },
                              {
                                student: "Karthick",
                                action: "Watched Video",
                                course: "Database Design",
                                time: "6 hours ago",
                              },
                              {
                                student: "Sarasvathi",
                                action: "Posted Discussion",
                                course: "Web Development",
                                time: "8 hours ago",
                              },
                            ].map((activity, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 border-b"
                              >
                                <div>
                                  <p className="font-medium text-sm">
                                    {activity.student}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {activity.action} in {activity.course}
                                  </p>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {activity.time}
                                </p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Export Data</Button>
                    <Button>Generate Report</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Performance Reports</h4>
                <LineChart className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Course and student performance
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full" size="sm" variant="outline">
                    Generate Report
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Generate Performance Report</DialogTitle>
                    <DialogDescription>
                      Create detailed performance reports for courses and
                      students
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Report Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="course-performance">
                            Course Performance
                          </SelectItem>
                          <SelectItem value="student-progress">
                            Student Progress
                          </SelectItem>
                          <SelectItem value="assignment-analysis">
                            Assignment Analysis
                          </SelectItem>
                          <SelectItem value="engagement-metrics">
                            Engagement Metrics
                          </SelectItem>
                          <SelectItem value="grade-distribution">
                            Grade Distribution
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Select Course</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose course" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Courses</SelectItem>
                          {courses
                            .filter((c) => c.faculty.includes(user?.name || ""))
                            .map((course) => (
                              <SelectItem key={course.id} value={course.id}>
                                {course.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Start Date</Label>
                        <Input type="date" />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input type="date" />
                      </div>
                    </div>
                    <div>
                      <Label>Report Filters</Label>
                      <div className="space-y-2 mt-2">
                        {[
                          { filter: "Include Grade Trends", checked: true },
                          { filter: "Include Attendance Data", checked: true },
                          {
                            filter: "Include Assignment Scores",
                            checked: true,
                          },
                          {
                            filter: "Include Discussion Participation",
                            checked: false,
                          },
                          {
                            filter: "Include Time Spent Analysis",
                            checked: false,
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox defaultChecked={item.checked} />
                            <Label>{item.filter}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Output Format</Label>
                      <Select defaultValue="pdf">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF Report</SelectItem>
                          <SelectItem value="excel">
                            Excel Spreadsheet
                          </SelectItem>
                          <SelectItem value="csv">CSV Data</SelectItem>
                          <SelectItem value="email">Email Summary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Save as Template</Button>
                    <Button
                      onClick={() => handleCreateSystemReport("Performance")}
                    >
                      Generate Report
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Custom Dashboards</h4>
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Role-based dashboards
              </p>
              <Button className="w-full" size="sm" variant="outline">
                Customize
              </Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  const renderStudentCourses = () => (
    <Card className="section-card">
      <CardHeader>
        <CardTitle>My Enrolled Courses</CardTitle>
        <CardDescription>
          Track your progress and access course materials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.slice(0, 4).map((course) => (
            <Card key={course.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-medium">{course.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {course.faculty}
                    </p>
                  </div>
                  <Badge
                    variant={course.status === "Active" ? "default" : "outline"}
                  >
                    {course.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{course.completion}%</span>
                  </div>
                  <Progress value={course.completion} className="w-full h-2" />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Button size="sm" onClick={() => handleContinueLearning(course)}>Continue Learning</Button>
                  <Button size="sm" variant="outline" onClick={() => handleOpenDiscussion(course)}>
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Discuss
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderAvailableCourses = () => (
    <Card className="section-card">
      <CardHeader>
        <CardTitle>Available Courses</CardTitle>
        <CardDescription>Discover and enroll in new courses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses
            .filter((c) => c.enrollmentMode === "self")
            .map((course) => (
              <Card key={course.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-medium">{course.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {course.faculty}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm">{course.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm">
                      <span className="font-medium">{course.enrolled}</span>{" "}
                      enrolled
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{course.credits}</span>{" "}
                      credits
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleStudentEnrollment(course.id)}
                    disabled={enrollments.some(
                      (e) =>
                        e.courseId === course.id && e.studentId === user?.id
                    )}
                  >
                    {enrollments.some(
                      (e) =>
                        e.courseId === course.id && e.studentId === user?.id
                    )
                      ? "Already Enrolled"
                      : "Enroll Now"}
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderStudentAssignments = () => {
    const studentCourses = courses.filter((c) =>
      enrollments.some((e) => e.courseId === c.id && e.studentId === user?.id)
    );

    const mockAssignments = [
      {
        id: "A001",
        courseId: "C001",
        title: "Data Structures Implementation",
        description:
          "Implement basic data structures in your preferred programming language",
        dueDate: "2024-02-15",
        maxPoints: 100,
        status: "submitted",
        grade: 85,
        submittedDate: "2024-02-14",
      },
      {
        id: "A002",
        courseId: "C002",
        title: "Digital Marketing Strategy Analysis",
        description: "Analyze a real-world digital marketing campaign",
        dueDate: "2024-02-20",
        maxPoints: 80,
        status: "pending",
        grade: null,
        submittedDate: null,
      },
      {
        id: "A003",
        courseId: "C003",
        title: "Machine Learning Model Training",
        description: "Train and evaluate a machine learning model",
        dueDate: "2024-02-25",
        maxPoints: 120,
        status: "not_submitted",
        grade: null,
        submittedDate: null,
      },
    ];

    return (
      <Card className="section-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <FileText className="h-5 w-5" />
            </div>
            My Assignments
          </CardTitle>
          <CardDescription>
            View and manage your course assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6">
            {mockAssignments.map((assignment) => {
              const course = courses.find((c) => c.id === assignment.courseId);
              if (
                !course ||
                !enrollments.some(
                  (e) => e.courseId === course.id && e.studentId === user?.id
                )
              )
                return null;

              return (
                <Card key={assignment.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium">{assignment.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {course.name}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {assignment.description}
                      </p>
                    </div>
                    <Badge
                      variant={
                        assignment.status === "submitted"
                          ? "default"
                          : assignment.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {assignment.status === "submitted"
                        ? "Submitted"
                        : assignment.status === "pending"
                        ? "Pending Review"
                        : "Not Submitted"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">
                        Due Date
                      </Label>
                      <p className="font-medium">{assignment.dueDate}</p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">
                        Max Points
                      </Label>
                      <p className="font-medium">{assignment.maxPoints}</p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">
                        Grade
                      </Label>
                      <p className="font-medium">
                        {assignment.grade
                          ? `${assignment.grade}/${assignment.maxPoints}`
                          : "Not graded"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">
                        Submitted
                      </Label>
                      <p className="font-medium">
                        {assignment.submittedDate || "Not submitted"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {assignment.status === "not_submitted" && (
                      <Button size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Submit Assignment
                      </Button>
                    )}
                    {assignment.grade && (
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download Feedback
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderStudentProgress = () => {
    const studentEnrollments = enrollments.filter(
      (e) => e.studentId === user?.id
    );

    return (
      <Card className="section-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-green-50 text-green-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            Learning Progress
          </CardTitle>
          <CardDescription>
            Track your academic progress across all enrolled courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Overall Progress</h4>
                <Badge variant="secondary">
                  {Math.round(
                    studentEnrollments.reduce((sum, e) => sum + e.progress, 0) /
                      studentEnrollments.length || 0
                  )}
                  %
                </Badge>
              </div>
              <Progress
                value={
                  studentEnrollments.reduce((sum, e) => sum + e.progress, 0) /
                    studentEnrollments.length || 0
                }
                className="w-full h-3"
              />
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Courses Completed</h4>
                <Badge variant="default">
                  {
                    studentEnrollments.filter((e) => e.status === "completed")
                      .length
                  }
                  /{studentEnrollments.length}
                </Badge>
              </div>
              <Progress
                value={
                  (studentEnrollments.filter((e) => e.status === "completed")
                    .length /
                    studentEnrollments.length) *
                    100 || 0
                }
                className="w-full h-3"
              />
            </Card>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Course Progress Details</h4>
            {studentEnrollments.map((enrollment) => {
              const course = courses.find((c) => c.id === enrollment.courseId);
              if (!course) return null;

              return (
                <Card key={enrollment.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h5 className="font-medium">{course.name}</h5>
                      <p className="text-sm text-muted-foreground">
                        {course.faculty} • {course.credits} credits
                      </p>
                    </div>
                    <Badge
                      variant={
                        enrollment.status === "completed"
                          ? "default"
                          : enrollment.status === "enrolled"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {enrollment.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{enrollment.progress}%</span>
                    </div>
                    <Progress
                      value={enrollment.progress}
                      className="w-full h-2"
                    />
                    <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground">
                          Last Activity
                        </Label>
                        <p className="text-sm">
                          {new Date(
                            enrollment.lastActivity
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground">
                          Current Grade
                        </Label>
                        <p className="text-sm">
                          {enrollment.grade || "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderStudentCertificates = () => {
    const studentCertificates = certificates.filter(
      (c) => c.studentId === user?.id
    );

    return (
      <Card className="section-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-yellow-50 text-yellow-600">
              <Award className="h-5 w-5" />
            </div>
            My Certificates
          </CardTitle>
          <CardDescription>
            View and download your earned certificates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {studentCertificates.length === 0 ? (
            <div className="text-center py-8">
              <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Certificates Yet</h3>
              <p className="text-muted-foreground">
                Complete courses to earn certificates
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studentCertificates.map((certificate) => {
                const course = courses.find(
                  (c) => c.id === certificate.courseId
                );
                if (!course) return null;

                return (
                  <Card key={certificate.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium">{course.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {course.faculty}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Certificate ID: {certificate.id}
                        </p>
                      </div>
                      <Badge
                        variant={
                          certificate.status === "issued"
                            ? "default"
                            : certificate.status === "revoked"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {certificate.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground">
                          Issue Date
                        </Label>
                        <p className="font-medium">{certificate.issueDate}</p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground">
                          Template
                        </Label>
                        <p className="font-medium capitalize">
                          {certificate.template}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button size="sm" variant="outline">
                        <QrCode className="h-4 w-4 mr-2" />
                        Verify
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Sample certificates for demo */}
          {studentCertificates.length === 0 && (
            <div className="mt-8">
              <h4 className="font-medium mb-4">Sample Certificates (Demo)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4 border-dashed">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium">
                        Course Completion Certificate
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Available after course completion
                      </p>
                    </div>
                    <Badge variant="outline">Sample</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Complete any enrolled course to earn your first certificate
                  </div>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderStudentAssessments = () => {
    const studentCourses = courses.filter((c) =>
      enrollments.some((e) => e.courseId === c.id && e.studentId === user?.id)
    );

    const studentAssessments = assessments.filter((a) =>
      studentCourses.some((c) => c.id === a.courseId)
    );

    return (
      <Card className="section-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-pink-50 text-pink-600">
              <CheckCircle className="h-5 w-5" />
            </div>
            My Assessments
          </CardTitle>
          <CardDescription>
            View and take your course assessments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {studentAssessments.map((assessment) => {
              const course = courses.find((c) => c.id === assessment.courseId);
              if (!course) return null;

              return (
                <Card key={assessment.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium">{assessment.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {course.name}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span>Questions: {assessment.questions}</span>
                        <span>Duration: {assessment.duration} min</span>
                        <span>Attempts: {assessment.attempts}</span>
                        <Badge variant="outline" className="capitalize">
                          {assessment.type}
                        </Badge>
                        {assessment.proctored && (
                          <Badge variant="secondary">Proctored</Badge>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant={
                        assessment.status === "active"
                          ? "default"
                          : assessment.status === "closed"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {assessment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" disabled={assessment.status !== "active"}>
                      <PlayCircle className="h-4 w-4 mr-2" />
                      {assessment.status === "active"
                        ? "Start Assessment"
                        : "Assessment Closed"}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {assessment.type === "survey" && (
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Give Feedback
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderStudentVirtualClasses = () => {
    const studentCourses = courses.filter((c) =>
      enrollments.some((e) => e.courseId === c.id && e.studentId === user?.id)
    );

    const studentSessions = virtualSessions.filter((v) =>
      studentCourses.some((c) => c.id === v.courseId)
    );

    return (
      <Card className="section-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
              <Video className="h-5 w-5" />
            </div>
            My Virtual Classes
          </CardTitle>
          <CardDescription>
            Join live classes and access recordings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {studentSessions.map((session) => {
              const course = courses.find((c) => c.id === session.courseId);
              if (!course) return null;

              const sessionDate = new Date(session.scheduledDate);
              const isUpcoming = sessionDate > new Date();
              const isOngoing = session.status === "ongoing";

              return (
                <Card key={session.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium">{session.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {course.name}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span>Date: {sessionDate.toLocaleDateString()}</span>
                        <span>Time: {sessionDate.toLocaleTimeString()}</span>
                        <span>Duration: {session.duration} min</span>
                        <Badge variant="outline" className="capitalize">
                          {session.platform}
                        </Badge>
                      </div>
                    </div>
                    <Badge
                      variant={
                        session.status === "ongoing"
                          ? "default"
                          : session.status === "completed"
                          ? "secondary"
                          : session.status === "scheduled"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {session.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {isOngoing && (
                      <Button size="sm">
                        <Video className="h-4 w-4 mr-2" />
                        Join Now
                      </Button>
                    )}
                    {isUpcoming && (
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Add to Calendar
                      </Button>
                    )}
                    {session.recordingAvailable && (
                      <Button size="sm" variant="outline">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Watch Recording
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Class Chat
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderStudentDiscussions = () => {
    const studentCourses = courses.filter((c) =>
      enrollments.some((e) => e.courseId === c.id && e.studentId === user?.id)
    );

    const mockDiscussions = [
      {
        id: "D001",
        courseId: "C001",
        title: "Data Structures Implementation Discussion",
        description:
          "Discuss best practices for implementing various data structures",
        posts: 45,
        lastActivity: "2024-02-15T10:30:00Z",
        isParticipating: true,
      },
      {
        id: "D002",
        courseId: "C002",
        title: "Digital Marketing Case Studies",
        description: "Share and analyze real-world digital marketing campaigns",
        posts: 28,
        lastActivity: "2024-02-14T16:45:00Z",
        isParticipating: false,
      },
      {
        id: "D003",
        courseId: "C003",
        title: "ML Algorithm Performance",
        description:
          "Compare different machine learning algorithms and their performance",
        posts: 67,
        lastActivity: "2024-02-16T09:15:00Z",
        isParticipating: true,
      },
    ];

    const studentDiscussions = mockDiscussions.filter((d) =>
      studentCourses.some((c) => c.id === d.courseId)
    );

    return (
      <Card className="section-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <MessageCircle className="h-5 w-5" />
            </div>
            Course Discussions
          </CardTitle>
          <CardDescription>
            Participate in course discussions and forums
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {studentDiscussions.map((discussion) => {
              const course = courses.find((c) => c.id === discussion.courseId);
              if (!course) return null;

              return (
                <Card key={discussion.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium">{discussion.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {course.name}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {discussion.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span>Posts: {discussion.posts}</span>
                        <span>
                          Last activity:{" "}
                          {new Date(
                            discussion.lastActivity
                          ).toLocaleDateString()}
                        </span>
                        {discussion.isParticipating && (
                          <Badge variant="default" className="text-xs">
                            Participating
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {discussion.isParticipating
                        ? "Continue Discussion"
                        : "Join Discussion"}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View All Posts
                    </Button>
                    <Button size="sm" variant="outline">
                      <Bell className="h-4 w-4 mr-2" />
                      Subscribe
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {renderRoleBasedView()}

      {/* Create Course Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
            <DialogDescription>
              Set up a comprehensive course with all LMS features including
              enrollment, content design, and analytics.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="learning">Learning Setup</TabsTrigger>
              <TabsTrigger value="features">LMS Features</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Course Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter course name"
                  />
                </div>
                <div>
                  <Label htmlFor="code">Course Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder="e.g., CS301"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select
                    value={formData.subcategory}
                    onValueChange={(value) =>
                      setFormData({ ...formData, subcategory: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((subcategory) => (
                        <SelectItem key={subcategory} value={subcategory}>
                          {subcategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="credits">Credit Points</Label>
                  <Input
                    id="credits"
                    type="number"
                    value={formData.credits}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        credits: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Credits"
                  />
                </div>
                <div>
                  <Label htmlFor="learningHours">Learning Hours</Label>
                  <Input
                    id="learningHours"
                    type="number"
                    value={formData.learningHours}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        learningHours: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Hours"
                  />
                </div>
                <div>
                  <Label htmlFor="practicalHours">Practical Hours</Label>
                  <Input
                    id="practicalHours"
                    type="number"
                    value={formData.practicalHours}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        practicalHours: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Hours"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    placeholder="Department name"
                  />
                </div>
                <div>
                  <Label htmlFor="faculty">Faculty</Label>
                  <Input
                    id="faculty"
                    value={formData.faculty}
                    onChange={(e) =>
                      setFormData({ ...formData, faculty: e.target.value })
                    }
                    placeholder="Faculty name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Course Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the course content and objectives"
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="learning" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Course Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "Mandatory" | "Elective") =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {courseTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="maxCapacity">Max Capacity</Label>
                  <Input
                    id="maxCapacity"
                    type="number"
                    value={formData.maxCapacity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxCapacity: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Maximum students"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="competencyScale">Competency Scale</Label>
                <Select
                  value={formData.competencyScale}
                  onValueChange={(value) =>
                    setFormData({ ...formData, competencyScale: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select competency level" />
                  </SelectTrigger>
                  <SelectContent>
                    {competencyScales.map((scale) => (
                      <SelectItem key={scale} value={scale}>
                        {scale}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Learning Outcomes</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    "Algorithm Design",
                    "Problem Solving",
                    "Critical Thinking",
                    "Technical Writing",
                    "Team Collaboration",
                    "Project Management",
                    "Data Analysis",
                    "System Design",
                  ].map((outcome) => (
                    <div key={outcome} className="flex items-center space-x-2">
                      <Checkbox
                        id={`outcome-${outcome}`}
                        checked={formData.outcomes.includes(outcome)}
                        onCheckedChange={(checked) =>
                          handleArrayFieldChange(
                            "outcomes",
                            outcome,
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor={`outcome-${outcome}`} className="text-sm">
                        {outcome}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Prerequisites</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    "Programming Fundamentals",
                    "Mathematics",
                    "Statistics",
                    "Data Structures",
                    "Database Systems",
                    "Web Development",
                    "Linear Algebra",
                    "Discrete Mathematics",
                  ].map((prereq) => (
                    <div key={prereq} className="flex items-center space-x-2">
                      <Checkbox
                        id={`prereq-${prereq}`}
                        checked={formData.prerequisites.includes(prereq)}
                        onCheckedChange={(checked) =>
                          handleArrayFieldChange(
                            "prerequisites",
                            prereq,
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor={`prereq-${prereq}`} className="text-sm">
                        {prereq}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <div>
                <Label>Enrollment Mode</Label>
                <RadioGroup
                  value={formData.enrollmentMode}
                  onValueChange={(value: "manual" | "self" | "api" | "bulk") =>
                    setFormData({ ...formData, enrollmentMode: value })
                  }
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="manual" id="manual" />
                    <Label htmlFor="manual">
                      Manual Enrollment (Admin/Faculty controlled)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="self" id="self" />
                    <Label htmlFor="self">
                      Self Enrollment (Students can join)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="api" id="api" />
                    <Label htmlFor="api">
                      API Integration (External system)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bulk" id="bulk" />
                    <Label htmlFor="bulk">
                      Bulk Enrollment (CSV/Excel upload)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="virtualClassroom"
                    checked={formData.virtualClassroom}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        virtualClassroom: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="virtualClassroom">
                    Enable Virtual Classroom (Zoom, Teams, Google Meet)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="adaptiveLearning"
                    checked={formData.adaptiveLearning}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        adaptiveLearning: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="adaptiveLearning">
                    Adaptive Learning (Personalized learning paths)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="proctoring"
                    checked={formData.proctoring}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        proctoring: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="proctoring">
                    Enable Proctoring for Assessments
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="gamificationEnabled"
                    checked={formData.gamificationEnabled}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        gamificationEnabled: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="gamificationEnabled">
                    Gamification (Badges, Points, Leaderboards)
                  </Label>
                </div>
              </div>

              <div>
                <Label>Collaboration Tools</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {collaborationTools.map((tool) => (
                    <div key={tool} className="flex items-center space-x-2">
                      <Checkbox
                        id={`collab-${tool}`}
                        checked={formData.collaborationTools.includes(tool)}
                        onCheckedChange={(checked) =>
                          handleArrayFieldChange(
                            "collaborationTools",
                            tool,
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor={`collab-${tool}`} className="text-sm">
                        {tool}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div>
                <Label htmlFor="status">Course Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Notification Settings</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {notificationTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`notification-${type}`}
                        checked={formData.notifications.includes(type)}
                        onCheckedChange={(checked) =>
                          handleArrayFieldChange(
                            "notifications",
                            type,
                            checked as boolean
                          )
                        }
                      />
                      <Label
                        htmlFor={`notification-${type}`}
                        className="text-sm"
                      >
                        {type} Notifications
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Digital Badges</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    "Course Completion",
                    "Excellence Award",
                    "Top Performer",
                    "Quick Learner",
                    "Collaborative Student",
                    "Innovation Award",
                    "Perfect Attendance",
                    "Assignment Master",
                  ].map((badge) => (
                    <div key={badge} className="flex items-center space-x-2">
                      <Checkbox
                        id={`badge-${badge}`}
                        checked={formData.badges.includes(badge)}
                        onCheckedChange={(checked) =>
                          handleArrayFieldChange(
                            "badges",
                            badge,
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor={`badge-${badge}`} className="text-sm">
                        {badge}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Certificates</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    "Course Completion Certificate",
                    "Participation Certificate",
                    "Excellence Certificate",
                    "Advanced Certificate",
                    "Specialization Certificate",
                    "Professional Certificate",
                  ].map((certificate) => (
                    <div
                      key={certificate}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`cert-${certificate}`}
                        checked={formData.certificates.includes(certificate)}
                        onCheckedChange={(checked) =>
                          handleArrayFieldChange(
                            "certificates",
                            certificate,
                            checked as boolean
                          )
                        }
                      />
                      <Label
                        htmlFor={`cert-${certificate}`}
                        className="text-sm"
                      >
                        {certificate}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Course</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Enrollment Dialog */}
      <Dialog
        open={isViewEnrollmentDialogOpen}
        onOpenChange={setIsViewEnrollmentDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Enrollment Details</DialogTitle>
            <DialogDescription>
              View detailed information about this enrollment
            </DialogDescription>
          </DialogHeader>
          {selectedEnrollment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Enrollment ID</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedEnrollment.id}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Student Name</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedEnrollment.studentName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Student ID</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedEnrollment.studentId}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Course ID</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedEnrollment.courseId}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Enrollment Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedEnrollment.enrollmentDate}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge
                    variant={
                      selectedEnrollment.status === "enrolled"
                        ? "default"
                        : selectedEnrollment.status === "completed"
                        ? "secondary"
                        : selectedEnrollment.status === "pending"
                        ? "outline"
                        : "destructive"
                    }
                  >
                    {selectedEnrollment.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Progress</Label>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={selectedEnrollment.progress}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">
                      {selectedEnrollment.progress}%
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Grade</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedEnrollment.grade || "Not yet graded"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Enrollment Type</Label>
                  <Badge variant="outline" className="capitalize">
                    {selectedEnrollment.enrollmentType}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Activity</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedEnrollment.lastActivity}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewEnrollmentDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setIsViewEnrollmentDialogOpen(false);
                if (selectedEnrollment) {
                  openEditEnrollmentDialog(selectedEnrollment);
                }
              }}
            >
              Edit Enrollment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manual Enrollment Dialog */}
      <Dialog
        open={isEnrollmentDialogOpen}
        onOpenChange={setIsEnrollmentDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manual Student Enrollment</DialogTitle>
            <DialogDescription>
              Enroll a student in a course manually
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="enrollment-course">Course</Label>
              <Select
                value={enrollmentData.courseId}
                onValueChange={(value) =>
                  setEnrollmentData({ ...enrollmentData, courseId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="enrollment-student">Student ID</Label>
              <Input
                id="enrollment-student"
                value={enrollmentData.studentId}
                onChange={(e) =>
                  setEnrollmentData({
                    ...enrollmentData,
                    studentId: e.target.value,
                  })
                }
                placeholder="Enter student ID"
              />
            </div>
            <div>
              <Label htmlFor="enrollment-notes">Notes (Optional)</Label>
              <Textarea
                id="enrollment-notes"
                value={enrollmentData.notes}
                onChange={(e) =>
                  setEnrollmentData({
                    ...enrollmentData,
                    notes: e.target.value,
                  })
                }
                placeholder="Additional notes"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEnrollmentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEnrollStudent}>Enroll Student</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Enrollment Dialog */}
      <Dialog
        open={isBulkEnrollmentDialogOpen}
        onOpenChange={setIsBulkEnrollmentDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Student Enrollment</DialogTitle>
            <DialogDescription>
              Upload CSV or Excel file to enroll multiple students
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bulk-file">Select File</Label>
              <Input
                id="bulk-file"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) =>
                  setBulkEnrollmentFile(e.target.files?.[0] || null)
                }
              />
              <div className="text-sm text-muted-foreground mt-2">
                Supported formats: CSV, Excel (.xlsx, .xls)
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">File Format Requirements:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>��� Column 1: Student ID</li>
                <li>���� Column 2: Course Code</li>
                <li>• Column 3: Enrollment Date (optional)</li>
                <li>• Column 4: Notes (optional)</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBulkEnrollmentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkEnrollmentFromFile}
              disabled={!bulkEnrollmentFile}
            >
              Process Enrollment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Update course information and LMS features.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="learning">Learning Setup</TabsTrigger>
              <TabsTrigger value="features">LMS Features</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Course Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter course name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-code">Course Code</Label>
                  <Input
                    id="edit-code"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder="e.g., CS301"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-subcategory">Subcategory</Label>
                  <Select
                    value={formData.subcategory}
                    onValueChange={(value) =>
                      setFormData({ ...formData, subcategory: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((subcategory) => (
                        <SelectItem key={subcategory} value={subcategory}>
                          {subcategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-description">Course Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the course content and objectives"
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="learning" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-credits">Credit Points</Label>
                  <Input
                    id="edit-credits"
                    type="number"
                    value={formData.credits}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        credits: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Credits"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-learningHours">Learning Hours</Label>
                  <Input
                    id="edit-learningHours"
                    type="number"
                    value={formData.learningHours}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        learningHours: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Hours"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-maxCapacity">Max Capacity</Label>
                  <Input
                    id="edit-maxCapacity"
                    type="number"
                    value={formData.maxCapacity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxCapacity: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Maximum students"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-virtualClassroom"
                    checked={formData.virtualClassroom}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        virtualClassroom: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="edit-virtualClassroom">
                    Enable Virtual Classroom
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-adaptiveLearning"
                    checked={formData.adaptiveLearning}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        adaptiveLearning: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="edit-adaptiveLearning">
                    Adaptive Learning
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-proctoring"
                    checked={formData.proctoring}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        proctoring: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="edit-proctoring">Enable Proctoring</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-gamificationEnabled"
                    checked={formData.gamificationEnabled}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        gamificationEnabled: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="edit-gamificationEnabled">Gamification</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <div>
                <Label>Content Types</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {contentTypes.slice(0, 6).map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-content-${type}`}
                        checked={formData.contentTypes.includes(type)}
                        onCheckedChange={(checked) =>
                          handleArrayFieldChange(
                            "contentTypes",
                            type,
                            checked as boolean
                          )
                        }
                      />
                      <Label
                        htmlFor={`edit-content-${type}`}
                        className="text-sm"
                      >
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div>
                <Label htmlFor="edit-status">Course Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit}>Update Course</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Course View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Course Details</DialogTitle>
            <DialogDescription>
              Complete course information and LMS features
            </DialogDescription>
          </DialogHeader>

          {selectedCourse && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                  <BookOpenCheck className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {selectedCourse.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedCourse.code} • {selectedCourse.category}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant={
                        selectedCourse.type === "Mandatory"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {selectedCourse.type}
                    </Badge>
                    <Badge
                      variant={
                        selectedCourse.status === "Active"
                          ? "default"
                          : "outline"
                      }
                    >
                      {selectedCourse.status}
                    </Badge>
                    <Badge variant="outline">
                      {selectedCourse.competencyScale}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {selectedCourse.enrollmentMode}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">
                      COURSE STRUCTURE
                    </Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Credits:</span>
                        <span className="text-sm font-medium">
                          {selectedCourse.credits}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Learning Hours:</span>
                        <span className="text-sm font-medium">
                          {selectedCourse.learningHours}h
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Practical Hours:</span>
                        <span className="text-sm font-medium">
                          {selectedCourse.practicalHours}h
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">
                      ENROLLMENT
                    </Label>
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Capacity</span>
                        <span className="text-sm">
                          {selectedCourse.enrolled}/{selectedCourse.maxCapacity}
                        </span>
                      </div>
                      <Progress
                        value={
                          (selectedCourse.enrolled /
                            selectedCourse.maxCapacity) *
                          100
                        }
                        className="w-full h-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">
                      LMS FEATURES
                    </Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Virtual Classroom:</span>
                        <span className="text-sm">
                          {selectedCourse.virtualClassroom
                            ? "✓ Enabled"
                            : "�� Disabled"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Adaptive Learning:</span>
                        <span className="text-sm">
                          {selectedCourse.adaptiveLearning
                            ? "✓ Enabled"
                            : "✗ Disabled"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Proctoring:</span>
                        <span className="text-sm">
                          {selectedCourse.proctoring
                            ? "✓ Enabled"
                            : "✗ Disabled"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Gamification:</span>
                        <span className="text-sm">
                          {selectedCourse.gamificationEnabled
                            ? "✓ Enabled"
                            : "✗ Disabled"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">
                      SCHEDULE
                    </Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Start Date:</span>
                        <span className="text-sm font-medium">
                          {selectedCourse.startDate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">End Date:</span>
                        <span className="text-sm font-medium">
                          {selectedCourse.endDate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Faculty:</span>
                        <span className="text-sm font-medium">
                          {selectedCourse.faculty}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">
                      PERFORMANCE
                    </Label>
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Progress</span>
                        <span className="text-sm">
                          {selectedCourse.completion}%
                        </span>
                      </div>
                      <Progress
                        value={selectedCourse.completion}
                        className="w-full h-2"
                      />
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">
                          {selectedCourse.rating}/5.0 rating
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">
                      CONTENT STATISTICS
                    </Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Assignments:</span>
                        <span className="text-sm font-medium">
                          {selectedCourse.assignments}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Assessments:</span>
                        <span className="text-sm font-medium">
                          {selectedCourse.assessments}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Discussions:</span>
                        <span className="text-sm font-medium">
                          {selectedCourse.discussions}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Certificates:</span>
                        <span className="text-sm font-medium">
                          {selectedCourse.certificatesGenerated}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium text-muted-foreground">
                  DESCRIPTION
                </Label>
                <p className="text-sm mt-2 p-3 bg-muted rounded-md">
                  {selectedCourse.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    LEARNING OUTCOMES
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCourse.outcomes.map((outcome) => (
                      <Badge
                        key={outcome}
                        variant="outline"
                        className="text-xs"
                      >
                        {outcome}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    ACTIVITIES
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCourse.activities.map((activity) => (
                      <Badge
                        key={activity}
                        variant="secondary"
                        className="text-xs"
                      >
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    COLLABORATION TOOLS
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCourse.collaborationTools.map((tool) => (
                      <Badge key={tool} variant="outline" className="text-xs">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    CONTENT TYPES
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCourse.contentTypes.map((type) => (
                      <Badge key={type} variant="outline" className="text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    INTEGRATIONS
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCourse.integrations.map((integration) => (
                      <Badge
                        key={integration}
                        variant="outline"
                        className="text-xs"
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        {integration}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    NOTIFICATIONS
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCourse.notifications.map((notification) => (
                      <Badge
                        key={notification}
                        variant="outline"
                        className="text-xs"
                      >
                        <Bell className="h-3 w-3 mr-1" />
                        {notification}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {selectedCourse.prerequisites.length > 0 && (
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    PREREQUISITES
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCourse.prerequisites.map((prereq) => (
                      <Badge key={prereq} variant="outline" className="text-xs">
                        {prereq}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    DIGITAL BADGES
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCourse.badges.map((badge) => (
                      <Badge key={badge} variant="default" className="text-xs">
                        <Trophy className="h-3 w-3 mr-1" />
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    CERTIFICATES
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCourse.certificates.map((cert) => (
                      <Badge key={cert} variant="default" className="text-xs">
                        <Award className="h-3 w-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
            {user?.role === "admin" && (
              <Button
                onClick={() => {
                  setIsViewDialogOpen(false);
                  if (selectedCourse) openEditDialog(selectedCourse);
                }}
              >
                Edit Course
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Learning Path Dialog */}
      <Dialog
        open={isCreateLearningPathDialogOpen}
        onOpenChange={setIsCreateLearningPathDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Learning Path</DialogTitle>
            <DialogDescription>
              Create a structured learning pathway
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="path-name">Path Name</Label>
              <Input
                id="path-name"
                value={learningPathFormData.name}
                onChange={(e) =>
                  setLearningPathFormData({
                    ...learningPathFormData,
                    name: e.target.value,
                  })
                }
                placeholder="Enter path name"
              />
            </div>
            <div>
              <Label htmlFor="path-description">Description</Label>
              <Textarea
                id="path-description"
                value={learningPathFormData.description}
                onChange={(e) =>
                  setLearningPathFormData({
                    ...learningPathFormData,
                    description: e.target.value,
                  })
                }
                placeholder="Describe the learning path"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="path-sequencing">Sequencing</Label>
                <Select
                  value={learningPathFormData.sequencing}
                  onValueChange={(value: "linear" | "adaptive" | "flexible") =>
                    setLearningPathFormData({
                      ...learningPathFormData,
                      sequencing: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sequencing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="adaptive">Adaptive</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="path-duration">Duration (weeks)</Label>
                <Input
                  id="path-duration"
                  type="number"
                  value={learningPathFormData.estimatedDuration}
                  onChange={(e) =>
                    setLearningPathFormData({
                      ...learningPathFormData,
                      estimatedDuration: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="Duration"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateLearningPathDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateLearningPath}>Create Path</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Learning Path Dialog */}
      <Dialog
        open={isEditLearningPathDialogOpen}
        onOpenChange={setIsEditLearningPathDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Learning Path</DialogTitle>
            <DialogDescription>
              Update learning path information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-path-name">Path Name</Label>
              <Input
                id="edit-path-name"
                value={learningPathFormData.name}
                onChange={(e) =>
                  setLearningPathFormData({
                    ...learningPathFormData,
                    name: e.target.value,
                  })
                }
                placeholder="Enter path name"
              />
            </div>
            <div>
              <Label htmlFor="edit-path-description">Description</Label>
              <Textarea
                id="edit-path-description"
                value={learningPathFormData.description}
                onChange={(e) =>
                  setLearningPathFormData({
                    ...learningPathFormData,
                    description: e.target.value,
                  })
                }
                placeholder="Describe the learning path"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-path-sequencing">Sequencing</Label>
                <Select
                  value={learningPathFormData.sequencing}
                  onValueChange={(value: "linear" | "adaptive" | "flexible") =>
                    setLearningPathFormData({
                      ...learningPathFormData,
                      sequencing: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sequencing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="adaptive">Adaptive</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-path-duration">Duration (weeks)</Label>
                <Input
                  id="edit-path-duration"
                  type="number"
                  value={learningPathFormData.estimatedDuration}
                  onChange={(e) =>
                    setLearningPathFormData({
                      ...learningPathFormData,
                      estimatedDuration: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="Duration"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditLearningPathDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateLearningPath}>Update Path</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Notification Template Dialog */}
      <Dialog
        open={isCreateNotificationDialogOpen}
        onOpenChange={setIsCreateNotificationDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Notification Template</DialogTitle>
            <DialogDescription>
              Create a new notification template
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="notif-name">Template Name</Label>
              <Input
                id="notif-name"
                value={notificationFormData.name}
                onChange={(e) =>
                  setNotificationFormData({
                    ...notificationFormData,
                    name: e.target.value,
                  })
                }
                placeholder="Enter template name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="notif-type">Type</Label>
                <Select
                  value={notificationFormData.type}
                  onValueChange={(value: "email" | "sms" | "push" | "in-app") =>
                    setNotificationFormData({
                      ...notificationFormData,
                      type: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="push">Push</SelectItem>
                    <SelectItem value="in-app">In-App</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notif-trigger">Trigger</Label>
                <Input
                  id="notif-trigger"
                  value={notificationFormData.trigger}
                  onChange={(e) =>
                    setNotificationFormData({
                      ...notificationFormData,
                      trigger: e.target.value,
                    })
                  }
                  placeholder="Event trigger"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notif-subject">Subject</Label>
              <Input
                id="notif-subject"
                value={notificationFormData.subject}
                onChange={(e) =>
                  setNotificationFormData({
                    ...notificationFormData,
                    subject: e.target.value,
                  })
                }
                placeholder="Notification subject"
              />
            </div>
            <div>
              <Label htmlFor="notif-content">Content</Label>
              <Textarea
                id="notif-content"
                value={notificationFormData.content}
                onChange={(e) =>
                  setNotificationFormData({
                    ...notificationFormData,
                    content: e.target.value,
                  })
                }
                placeholder="Notification content"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notif-active"
                checked={notificationFormData.active}
                onCheckedChange={(checked) =>
                  setNotificationFormData({
                    ...notificationFormData,
                    active: checked as boolean,
                  })
                }
              />
              <Label htmlFor="notif-active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateNotificationDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateNotification}>Create Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Notification Template Dialog */}
      <Dialog
        open={isEditNotificationDialogOpen}
        onOpenChange={setIsEditNotificationDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Notification Template</DialogTitle>
            <DialogDescription>Update notification template</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-notif-name">Template Name</Label>
              <Input
                id="edit-notif-name"
                value={notificationFormData.name}
                onChange={(e) =>
                  setNotificationFormData({
                    ...notificationFormData,
                    name: e.target.value,
                  })
                }
                placeholder="Enter template name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-notif-type">Type</Label>
                <Select
                  value={notificationFormData.type}
                  onValueChange={(value: "email" | "sms" | "push" | "in-app") =>
                    setNotificationFormData({
                      ...notificationFormData,
                      type: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="push">Push</SelectItem>
                    <SelectItem value="in-app">In-App</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-notif-trigger">Trigger</Label>
                <Input
                  id="edit-notif-trigger"
                  value={notificationFormData.trigger}
                  onChange={(e) =>
                    setNotificationFormData({
                      ...notificationFormData,
                      trigger: e.target.value,
                    })
                  }
                  placeholder="Event trigger"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-notif-subject">Subject</Label>
              <Input
                id="edit-notif-subject"
                value={notificationFormData.subject}
                onChange={(e) =>
                  setNotificationFormData({
                    ...notificationFormData,
                    subject: e.target.value,
                  })
                }
                placeholder="Notification subject"
              />
            </div>
            <div>
              <Label htmlFor="edit-notif-content">Content</Label>
              <Textarea
                id="edit-notif-content"
                value={notificationFormData.content}
                onChange={(e) =>
                  setNotificationFormData({
                    ...notificationFormData,
                    content: e.target.value,
                  })
                }
                placeholder="Notification content"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-notif-active"
                checked={notificationFormData.active}
                onCheckedChange={(checked) =>
                  setNotificationFormData({
                    ...notificationFormData,
                    active: checked as boolean,
                  })
                }
              />
              <Label htmlFor="edit-notif-active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditNotificationDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateNotification}>Update Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Virtual Session Dialog */}
      <Dialog
        open={isCreateVirtualSessionDialogOpen}
        onOpenChange={setIsCreateVirtualSessionDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Virtual Session</DialogTitle>
            <DialogDescription>
              Schedule a new virtual class session
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="session-course">Course</Label>
              <Select
                value={virtualSessionFormData.courseId}
                onValueChange={(value) =>
                  setVirtualSessionFormData({
                    ...virtualSessionFormData,
                    courseId: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="session-title">Session Title</Label>
              <Input
                id="session-title"
                value={virtualSessionFormData.title}
                onChange={(e) =>
                  setVirtualSessionFormData({
                    ...virtualSessionFormData,
                    title: e.target.value,
                  })
                }
                placeholder="Enter session title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="session-platform">Platform</Label>
                <Select
                  value={virtualSessionFormData.platform}
                  onValueChange={(value: "zoom" | "teams" | "meet" | "webex") =>
                    setVirtualSessionFormData({
                      ...virtualSessionFormData,
                      platform: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zoom">Zoom</SelectItem>
                    <SelectItem value="teams">Teams</SelectItem>
                    <SelectItem value="meet">Google Meet</SelectItem>
                    <SelectItem value="webex">WebEx</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="session-duration">Duration (minutes)</Label>
                <Input
                  id="session-duration"
                  type="number"
                  value={virtualSessionFormData.duration}
                  onChange={(e) =>
                    setVirtualSessionFormData({
                      ...virtualSessionFormData,
                      duration: parseInt(e.target.value) || 60,
                    })
                  }
                  placeholder="Duration"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="session-date">Scheduled Date & Time</Label>
              <Input
                id="session-date"
                type="datetime-local"
                value={virtualSessionFormData.scheduledDate}
                onChange={(e) =>
                  setVirtualSessionFormData({
                    ...virtualSessionFormData,
                    scheduledDate: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateVirtualSessionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateVirtualSessionComplete}>
              Create Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Assignment Dialog */}
      <Dialog
        open={isCreateAssignmentDialogOpen}
        onOpenChange={setIsCreateAssignmentDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Assignment</DialogTitle>
            <DialogDescription>
              Create a new course assignment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="assignment-course">Course</Label>
              <Select
                value={assignmentFormData.courseId}
                onValueChange={(value) =>
                  setAssignmentFormData({
                    ...assignmentFormData,
                    courseId: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="assignment-title">Assignment Title</Label>
              <Input
                id="assignment-title"
                value={assignmentFormData.title}
                onChange={(e) =>
                  setAssignmentFormData({
                    ...assignmentFormData,
                    title: e.target.value,
                  })
                }
                placeholder="Enter assignment title"
              />
            </div>
            <div>
              <Label htmlFor="assignment-description">Description</Label>
              <Textarea
                id="assignment-description"
                value={assignmentFormData.description}
                onChange={(e) =>
                  setAssignmentFormData({
                    ...assignmentFormData,
                    description: e.target.value,
                  })
                }
                placeholder="Assignment description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assignment-due">Due Date</Label>
                <Input
                  id="assignment-due"
                  type="date"
                  value={assignmentFormData.dueDate}
                  onChange={(e) =>
                    setAssignmentFormData({
                      ...assignmentFormData,
                      dueDate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="assignment-points">Max Points</Label>
                <Input
                  id="assignment-points"
                  type="number"
                  value={assignmentFormData.maxPoints}
                  onChange={(e) =>
                    setAssignmentFormData({
                      ...assignmentFormData,
                      maxPoints: parseInt(e.target.value) || 100,
                    })
                  }
                  placeholder="Max points"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="assignment-plagiarism"
                  checked={assignmentFormData.plagiarismCheck}
                  onCheckedChange={(checked) =>
                    setAssignmentFormData({
                      ...assignmentFormData,
                      plagiarismCheck: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="assignment-plagiarism">
                  Enable Plagiarism Check
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="assignment-autograde"
                  checked={assignmentFormData.autoGrading}
                  onCheckedChange={(checked) =>
                    setAssignmentFormData({
                      ...assignmentFormData,
                      autoGrading: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="assignment-autograde">Auto Grading</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateAssignmentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateAssignmentComplete}>
              Create Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Assessment Dialog */}
      <Dialog
        open={isCreateAssessmentDialogOpen}
        onOpenChange={setIsCreateAssessmentDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Assessment</DialogTitle>
            <DialogDescription>
              Create a new course assessment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="assessment-course">Course</Label>
              <Select
                value={assessmentFormData.courseId}
                onValueChange={(value) =>
                  setAssessmentFormData({
                    ...assessmentFormData,
                    courseId: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="assessment-title">Assessment Title</Label>
              <Input
                id="assessment-title"
                value={assessmentFormData.title}
                onChange={(e) =>
                  setAssessmentFormData({
                    ...assessmentFormData,
                    title: e.target.value,
                  })
                }
                placeholder="Enter assessment title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assessment-type">Type</Label>
                <Select
                  value={assessmentFormData.type}
                  onValueChange={(
                    value: "quiz" | "exam" | "survey" | "assignment"
                  ) =>
                    setAssessmentFormData({
                      ...assessmentFormData,
                      type: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="exam">Exam</SelectItem>
                    <SelectItem value="survey">Survey</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="assessment-questions">
                  Number of Questions
                </Label>
                <Input
                  id="assessment-questions"
                  type="number"
                  value={assessmentFormData.questions}
                  onChange={(e) =>
                    setAssessmentFormData({
                      ...assessmentFormData,
                      questions: parseInt(e.target.value) || 10,
                    })
                  }
                  placeholder="Questions"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assessment-duration">Duration (minutes)</Label>
                <Input
                  id="assessment-duration"
                  type="number"
                  value={assessmentFormData.duration}
                  onChange={(e) =>
                    setAssessmentFormData({
                      ...assessmentFormData,
                      duration: parseInt(e.target.value) || 30,
                    })
                  }
                  placeholder="Duration"
                />
              </div>
              <div>
                <Label htmlFor="assessment-attempts">Attempts Allowed</Label>
                <Input
                  id="assessment-attempts"
                  type="number"
                  value={assessmentFormData.attempts}
                  onChange={(e) =>
                    setAssessmentFormData({
                      ...assessmentFormData,
                      attempts: parseInt(e.target.value) || 1,
                    })
                  }
                  placeholder="Attempts"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="assessment-autograde"
                  checked={assessmentFormData.autoGrade}
                  onCheckedChange={(checked) =>
                    setAssessmentFormData({
                      ...assessmentFormData,
                      autoGrade: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="assessment-autograde">Auto Grade</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="assessment-proctor"
                  checked={assessmentFormData.proctored}
                  onCheckedChange={(checked) =>
                    setAssessmentFormData({
                      ...assessmentFormData,
                      proctored: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="assessment-proctor">Proctored</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateAssessmentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateAssessmentComplete}>
              Create Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Advanced Course Management Dialog */}
      <Dialog
        open={isAdvancedCourseDialogOpen}
        onOpenChange={setIsAdvancedCourseDialogOpen}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Advanced Course Management</DialogTitle>
            <DialogDescription>
              Advanced tools for course management and configuration
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="bulk" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>

            <TabsContent value="bulk" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => setIsBulkOperationsDialogOpen(true)}
                  className="h-20 flex-col"
                >
                  <Copy className="h-8 w-8 mb-2" />
                  Bulk Operations
                </Button>
                <Button
                  onClick={() => setIsExportOptionsDialogOpen(true)}
                  variant="outline"
                  className="h-20 flex-col"
                >
                  <Download className="h-8 w-8 mb-2" />
                  Export Options
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Button
                  onClick={() => handleApplyTemplate("computer-science")}
                  variant="outline"
                  className="h-20 flex-col"
                >
                  <FileText className="h-8 w-8 mb-2" />
                  Computer Science
                </Button>
                <Button
                  onClick={() => handleApplyTemplate("Computer Engineering")}
                  variant="outline"
                  className="h-20 flex-col"
                >
                  <Settings className="h-8 w-8 mb-2" />
                  Engineering
                </Button>
                <Button
                  onClick={() => handleApplyTemplate("business")}
                  variant="outline"
                  className="h-20 flex-col"
                >
                  <TrendingUp className="h-8 w-8 mb-2" />
                  Business
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleLTIIntegration}
                  variant="outline"
                  className="h-20 flex-col"
                >
                  <Zap className="h-8 w-8 mb-2" />
                  LTI Integration
                </Button>
                <Button
                  onClick={handleMoodleSync}
                  variant="outline"
                  className="h-20 flex-col"
                >
                  <Globe className="h-8 w-8 mb-2" />
                  Moodle Sync
                </Button>
                <Button
                  onClick={handleCanvasConnect}
                  variant="outline"
                  className="h-20 flex-col"
                >
                  <BookOpen className="h-8 w-8 mb-2" />
                  Canvas Connect
                </Button>
                <Button
                  onClick={handleBlackboardLink}
                  variant="outline"
                  className="h-20 flex-col"
                >
                  <Users className="h-8 w-8 mb-2" />
                  Blackboard Link
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Bulk Operations Dialog */}
      <Dialog
        open={isBulkOperationsDialogOpen}
        onOpenChange={setIsBulkOperationsDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Operations</DialogTitle>
            <DialogDescription>
              Perform bulk operations on {selectedCourses.length} selected
              course(s)
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handleBulkDuplicate}
              disabled={selectedCourses.length === 0}
            >
              <Copy className="h-4 w-4 mr-2" />
              Duplicate Selected
            </Button>
            <Button
              onClick={handleBulkArchive}
              disabled={selectedCourses.length === 0}
              variant="outline"
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive Selected
            </Button>
            <Button
              onClick={handleBulkEnrollment}
              disabled={selectedCourses.length === 0}
              variant="outline"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Bulk Enrollment
            </Button>
            <Button
              onClick={handleBulkGenerateCertificates}
              disabled={selectedCourses.length === 0}
              variant="outline"
            >
              <Award className="h-4 w-4 mr-2" />
              Generate Certificates
            </Button>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBulkOperationsDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Options Dialog */}
      <Dialog
        open={isExportOptionsDialogOpen}
        onOpenChange={setIsExportOptionsDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Options</DialogTitle>
            <DialogDescription>
              Choose export format and data type
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={handleExportCSV}>
              <FileText className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
            <Button onClick={handleExportExcel} variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export as Excel
            </Button>
            <Button onClick={handleExportGrades} variant="outline">
              <Award className="h-4 w-4 mr-2" />
              Export Grades
            </Button>
            <Button onClick={handleExportAnalytics} variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Export Analytics
            </Button>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsExportOptionsDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Question Bank Dialog */}
      <Dialog
        open={isQuestionBankDialogOpen}
        onOpenChange={setIsQuestionBankDialogOpen}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Question Bank Management</DialogTitle>
            <DialogDescription>
              Manage your question banks and assessment tools
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex gap-4">
              <Button onClick={handleCreateQuestionBank}>
                <Plus className="h-4 w-4 mr-2" />
                New Bank
              </Button>
              <Button onClick={handleViewQuestionBank} variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button onClick={handleEditQuestionBank} variant="outline">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={() => setIsCreateQuestionDialogOpen(true)}
                variant="outline"
              >
                <FileText className="h-4 w-4 mr-2" />
                Create Questions
              </Button>
              <Button
                onClick={() => setIsBulkImportDialogOpen(true)}
                variant="outline"
              >
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </Button>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-4">Quick Analytics</h4>
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={handleViewPerformance} variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Performance
                </Button>
                <Button onClick={handleAnalyseQuestions} variant="outline">
                  <Brain className="h-4 w-4 mr-2" />
                  Analyse Questions
                </Button>
                <Button onClick={handleTimePatterns} variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Time Patterns
                </Button>
                <Button onClick={handleCheckAnomalies} variant="outline">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Check Anomalies
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-4">Export Options</h4>
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={handleExportResults} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
                <Button onClick={handleExportQuestions} variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Export Questions
                </Button>
                <Button
                  onClick={() => handleExportAnalytics()}
                  variant="outline"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Export Analytics
                </Button>
                <Button onClick={handleExportResponses} variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Export Responses
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-4">Assessment Grading</h4>
              <div className="flex gap-4">
                <Button onClick={handleOpenGradingInterface}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Open Grading Interface
                </Button>
                <Button
                  onClick={handleContinueManualInterface}
                  variant="outline"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Continue Manual Interface
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Question Dialog */}
      <Dialog
        open={isCreateQuestionDialogOpen}
        onOpenChange={setIsCreateQuestionDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Question</DialogTitle>
            <DialogDescription>
              Add a new question to the question bank
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Question Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mcq">Multiple Choice</SelectItem>
                  <SelectItem value="short">Short Answer</SelectItem>
                  <SelectItem value="long">Long Answer</SelectItem>
                  <SelectItem value="numerical">Numerical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Question Text</Label>
              <Textarea placeholder="Enter your question..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleSaveDraft}>
              <FileText className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={handleAddQuestion}>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Import Dialog */}
      <Dialog
        open={isBulkImportDialogOpen}
        onOpenChange={setIsBulkImportDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Import</DialogTitle>
            <DialogDescription>
              Import questions, assessments, or QTI packages
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={handleChooseFile} variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
              <Button onClick={handleDownloadTemplate} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>

            {bulkImportFile && (
              <div className="p-4 border rounded-lg bg-muted">
                <p className="text-sm">Selected file: {bulkImportFile.name}</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <Button
                onClick={handleImportQuestions}
                disabled={!bulkImportFile}
              >
                <FileText className="h-4 w-4 mr-2" />
                Import Questions
              </Button>
              <Button
                onClick={handleImportAssessment}
                disabled={!bulkImportFile}
                variant="outline"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Import Assessment
              </Button>
              <Button
                onClick={handleImportQTI}
                disabled={!bulkImportFile}
                variant="outline"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import QTI Package
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBulkImportDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Advanced Filter Dialog */}
      <Dialog
        open={isAdvancedFilterDialogOpen}
        onOpenChange={setIsAdvancedFilterDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Advanced Filters</DialogTitle>
            <DialogDescription>
              Apply advanced filtering options
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date Range</Label>
                <Input type="date" />
              </div>
              <div>
                <Label>Instructor</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select instructor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Instructors</SelectItem>
                    <SelectItem value="manikandan">Dr.Manikandan</SelectItem>
                    <SelectItem value="revathi">Dr.Revathi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Enrollment Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="full">Full</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Credit Hours</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select credits" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Credits</SelectItem>
                    <SelectItem value="1-2">1-2 Credits</SelectItem>
                    <SelectItem value="3-4">3-4 Credits</SelectItem>
                    <SelectItem value="5+">5+ Credits</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleResetFilters}>
              <XCircle className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
            <Button onClick={handleApplyFilters}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Analytics Dialog */}
      <Dialog
        open={isQuickAnalyticsDialogOpen}
        onOpenChange={setIsQuickAnalyticsDialogOpen}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Quick Analytics</DialogTitle>
            <DialogDescription>
              Analyze performance and patterns
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-4">
              <h4 className="font-medium mb-4">Performance Analytics</h4>
              <div className="space-y-2">
                <Button
                  onClick={handleViewPerformance}
                  className="w-full justify-start"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Performance
                </Button>
                <Button
                  onClick={handleAnalyseQuestions}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Analyse Questions
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-4">Pattern Analysis</h4>
              <div className="space-y-2">
                <Button
                  onClick={handleTimePatterns}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Time Patterns
                </Button>
                <Button
                  onClick={handleCheckAnomalies}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Check Anomalies
                </Button>
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Grading Interface Dialog */}
      <Dialog
        open={isGradingInterfaceDialogOpen}
        onOpenChange={setIsGradingInterfaceDialogOpen}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Assessment Grading Interface</DialogTitle>
            <DialogDescription>
              Grade assessments and manage scoring
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="font-medium mb-2">Auto Grading</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Automatically grade multiple choice and numerical questions
                </p>
                <Button className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  Start Auto Grading
                </Button>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-2">Manual Grading</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Manually review and grade essay questions
                </p>
                <Button
                  onClick={handleContinueManualInterface}
                  variant="outline"
                  className="w-full"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Continue Manual Grading
                </Button>
              </Card>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-4">Grading Statistics</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">45</p>
                  <p className="text-sm text-muted-foreground">
                    Total Submissions
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold">38</p>
                  <p className="text-sm text-muted-foreground">Auto Graded</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">7</p>
                  <p className="text-sm text-muted-foreground">
                    Pending Review
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsGradingInterfaceDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
