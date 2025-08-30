import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { useDashboard } from "@/hooks/useDashboard";
import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  mockStats,
  mockStudents,
  mockCourses,
  mockExams,
  mockAttendanceData,
  mockExamResults,
} from "@/mock/data";
import {
  hasModuleAccess,
  getAccessibleModules,
  ModuleType,
} from "@/utils/modulePermissions";
import {
  Users,
  BookOpen,
  GraduationCap,
  FileText,
  TrendingUp,
  Calendar,
  Clock,
  Award,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  Settings,
  Grid3X3,
  ChevronRight,
  Activity,
  Target,
  Zap,
  Star,
  Globe,
  Shield,
  Brain,
  Database,
  Map,
  Bookmark,
  Layers,
  Monitor,
  UserCheck,
  ClipboardList,
  FileQuestion,
  MapPin,
  Trophy,
  Video,
  MessageSquare,
  Upload,
  Download,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Filter,
  Archive,
  Bell,
  Mail,
  Phone,
  Building,
  School,
  BookOpenCheck,
  Calculator,
  Clipboard,
  FileSpreadsheet,
  Library,
  Microscope,
  Beaker,
  Palette,
  Music,
  Camera,
  Gamepad2,
  Headphones,
  Wifi,
  Smartphone,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart as RechartsPieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import WaveProgress from "@/components/ui/wave-progress";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "hsl(var(--muted))",
];

interface CourseJourneyData {
  id: number;
  title: string;
  totalCourses: number;
  courses: CourseNode[];
}

// Mock data for course journeys
const journeyData: CourseJourneyData[] = [
  {
    id: 1,
    title: "Programming Fundamentals Track",
    totalCourses: 4,
    courses: [
      {
        id: "prog-basics",
        title: "Programming Basics",
        subtitle: "Fundamentals",
        progress: 100,
        status: "completed",
        startDate: "Jan 2024",
        endDate: "Feb 2024",
        rating: 5
      },
      {
        id: "web-dev-intro",
        title: "Web Development In...",
        subtitle: "HTML, CSS & JS",
        progress: 100,
        status: "completed",
        startDate: "Feb 2024",
        endDate: "Mar 2024",
        rating: 4
      },
      {
        id: "advanced-js",
        title: "Advanced JavaScript",
        subtitle: "ES6+ Features",
        progress: 65,
        status: "current",
        startDate: "Apr 2024",
        endDate: "May 2024"
      },
      {
        id: "react-modern",
        title: "React & Modern Fr...",
        subtitle: "Component-based",
        progress: 40,
        status: "upcoming",
        startDate: "May 2024",
        endDate: "Jun 2024"
      }
    ]
  },
  {
    id: 2,
    title: "Data Science & Analytics Track",
    totalCourses: 3,
    courses: [
      {
        id: "python-basics",
        title: "Python Fundamentals",
        subtitle: "Data Structures",
        progress: 100,
        status: "completed",
        startDate: "Mar 2024",
        endDate: "Apr 2024",
        rating: 5
      },
      {
        id: "data-analysis",
        title: "Data Analysis",
        subtitle: "Pandas & NumPy",
        progress: 75,
        status: "current",
        startDate: "Apr 2024",
        endDate: "May 2024"
      },
      {
        id: "machine-learning",
        title: "Machine Learning",
        subtitle: "Algorithms & Models",
        progress: 0,
        status: "upcoming",
        startDate: "May 2024",
        endDate: "Jul 2024"
      }
    ]
  },
  {
    id: 3,
    title: "Mobile Development Track",
    totalCourses: 4,
    courses: [
      {
        id: "flutter-basics",
        title: "Flutter Basics",
        subtitle: "Cross-platform",
        progress: 90,
        status: "current",
        startDate: "Mar 2024",
        endDate: "Apr 2024"
      },
      {
        id: "firebase-integration",
        title: "Firebase Integration",
        subtitle: "Backend Services",
        progress: 0,
        status: "upcoming",
        startDate: "Apr 2024",
        endDate: "May 2024"
      },
      {
        id: "app-deployment",
        title: "App Deployment",
        subtitle: "Store Publishing",
        progress: 0,
        status: "locked",
        startDate: "May 2024",
        endDate: "Jun 2024"
      },
      {
        id: "advanced-ui",
        title: "Advanced UI/UX",
        subtitle: "Animations",
        progress: 0,
        status: "locked",
        startDate: "Jun 2024",
        endDate: "Jul 2024"
      }
    ]
  }
];

// Role-based module access configuration
const roleModuleAccess = {
  "super-admin": [
    "academics",
    "lms",
    "exams",
    "master",
    "users",
    "staff",
    "settings",
  ],
  admin: ["academics", "lms", "exams", "master", "users", "staff"],
  institution: ["academics", "lms", "exams", "users", "staff"],
  principal: ["academics", "lms", "exams", "users", "staff"],
  hod: ["academics", "lms", "exams"],
  faculty: ["academics", "lms"],
  staff: ["academics"],
  student: ["lms", "academics"],
  parent: ["academics"],
};

// Module configuration with icons, colors, quick actions, and role-based filtering
const moduleConfig = {
  academics: {
    title: "Academic Management",
    icon: GraduationCap,
    color: "from-blue-500 to-blue-600",
    description: "Comprehensive academic administration and student management",
    allowedRoles: [
      "super-admin",
      "admin",
      "institution",
      "principal",
      "hod",
      "faculty",
      "staff",
      "student",
      "parent",
    ],
    quickActions: [
      {
        title: "Students",
        icon: Users,
        href: "/academics/students",
        description: "Manage student records and profiles",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
        ],
      },
      {
        title: "Curriculum",
        icon: BookOpen,
        href: "/academics/curriculum",
        description: "Design and manage curriculum",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
        ],
      },
      {
        title: "Timetable",
        icon: Calendar,
        href: "/academics/timetable",
        description: "Schedule management and planning",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
          "parent",
        ],
      },
      {
        title: "Attendance",
        icon: CheckCircle,
        href: "/academics/attendance",
        description: "Track student attendance",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
        ],
      },
      {
        title: "Lesson Plans",
        icon: FileText,
        href: "/academics/lesson-plans",
        description: "Create and manage lesson plans",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
        ],
      },
      {
        title: "Feedback",
        icon: MessageSquare,
        href: "/academics/feedback",
        description: "Student and course feedback",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Scholarships",
        icon: Award,
        href: "/academics/scholarships",
        description: "Scholarship programs and awards",
        roles: ["super-admin", "admin", "institution", "principal", "student"],
      },
      {
        title: "Calendar",
        icon: Calendar,
        href: "/academics/calendar",
        description: "Academic calendar and events",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
          "parent",
        ],
      },
      {
        title: "Notifications",
        icon: Bell,
        href: "/academics/notifications",
        description: "System notifications and alerts",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
        ],
      },
      {
        title: "Reports",
        icon: BarChart3,
        href: "/academics/reports",
        description: "Academic performance reports",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
        ],
      },
    ],
  },
  lms: {
    title: "Learning Management System",
    icon: Monitor,
    color: "from-green-500 to-green-600",
    description: "Complete learning management system with courses and content",
    allowedRoles: [
      "super-admin",
      "admin",
      "institution",
      "principal",
      "hod",
      "faculty",
      "student",
    ],
    quickActions: [
      {
        title: "Courses",
        icon: BookOpenCheck,
        href: "/lms/courses",
        description: "Create and manage courses",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Assignments",
        icon: ClipboardList,
        href: "/lms/assignments",
        description: "Course assignments and submissions",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Assessments",
        icon: FileQuestion,
        href: "/lms/assessments",
        description: "Quizzes and examinations",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Progress",
        icon: TrendingUp,
        href: "/lms/progress",
        description: "Student learning progress tracking",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Lessons",
        icon: BookOpen,
        href: "/lms/lessons",
        description: "Interactive lesson content",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Cohorts",
        icon: Users,
        href: "/lms/cohorts",
        description: "Student groups and batches",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
        ],
      },
      {
        title: "Discussion Forums",
        icon: MessageSquare,
        href: "/lms/discussion-forums",
        description: "Course discussions and Q&A",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Certificates",
        icon: Award,
        href: "/lms/certificates",
        description: "Digital certificates and badges",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Virtual Classroom",
        icon: Video,
        href: "/lms/virtual-classroom",
        description: "Online classes and meetings",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Proctoring",
        icon: Shield,
        href: "/lms/proctoring",
        description: "Online exam supervision",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
        ],
      },
      {
        title: "Reports",
        icon: BarChart3,
        href: "/lms/reports",
        description: "Learning analytics and reports",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
        ],
      },
    ],
  },
  exams: {
    title: "Examination System",
    icon: ClipboardList,
    color: "from-purple-500 to-purple-600",
    description: "Comprehensive examination management and evaluation",
    allowedRoles: [
      "super-admin",
      "admin",
      "institution",
      "principal",
      "hod",
      "faculty",
      "student",
    ],
    quickActions: [
      {
        title: "Planning",
        icon: Calendar,
        href: "/exams/planning",
        description: "Exam schedule and planning",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
        ],
      },
      {
        title: "Eligibility",
        icon: UserCheck,
        href: "/exams/eligibility",
        description: "Student exam eligibility",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Hall Tickets",
        icon: FileText,
        href: "/exams/halltickets",
        description: "Generate and manage hall tickets",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Question Bank",
        icon: FileQuestion,
        href: "/exams/question-bank",
        description: "Question repository management",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
        ],
      },
      {
        title: "Paper Blueprint",
        icon: ClipboardList,
        href: "/exams/paper-blueprint",
        description: "Exam paper structure and design",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
        ],
      },
      {
        title: "Paper Generation",
        icon: FileText,
        href: "/exams/paper-generation",
        description: "Automated paper generation",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
        ],
      },
      {
        title: "Invigilators",
        icon: Users,
        href: "/exams/invigilators",
        description: "Exam supervision management",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
        ],
      },
      {
        title: "Seating Plan",
        icon: MapPin,
        href: "/exams/seating-plan",
        description: "Exam seating arrangements",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
        ],
      },
      {
        title: "Evaluation",
        icon: ClipboardList,
        href: "/exams/evaluation",
        description: "Answer sheet evaluation",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
        ],
      },
      {
        title: "Results",
        icon: BarChart3,
        href: "/exams/results",
        description: "Exam results and analytics",
        roles: [
          "super-admin",
          "admin",
          "institution",
          "principal",
          "hod",
          "faculty",
          "student",
        ],
      },
      {
        title: "Revaluation",
        icon: RefreshCw,
        href: "/exams/revaluation",
        description: "Result revaluation process",
        roles: ["super-admin", "admin", "institution", "principal", "student"],
      },
      {
        title: "Transcripts",
        icon: Trophy,
        href: "/exams/transcripts",
        description: "Official academic transcripts",
        roles: ["super-admin", "admin", "institution", "principal", "student"],
      },
    ],
  },
  master: {
    title: "Master Setup & Configuration",
    icon: Settings,
    color: "from-orange-500 to-orange-600",
    description:
      "Complete system configuration and master data management - Foundation of the entire ERP system",
    allowedRoles: ["super-admin", "admin", "institution", "principal"],
    isSpecial: true, // Special handling for master setup
    quickActions: [
      {
        title: "Entity Setup",
        icon: Building,
        href: "/master/entity-setup",
        description: "Organization structure and institutional setup",
        roles: ["super-admin", "admin", "institution", "principal"],
      },
      {
        title: "Academic Year Setup",
        icon: Calendar,
        href: "/master/academic-year-setup",
        description: "Academic year configuration and management",
        roles: ["super-admin", "admin", "institution", "principal"],
      },
      {
        title: "Program Setup",
        icon: GraduationCap,
        href: "/master/program-setup",
        description: "Academic programs, degrees, and courses",
        roles: ["super-admin", "admin", "institution", "principal"],
      },
      {
        title: "Stream Course Mapping",
        icon: Map,
        href: "/master/stream-course-mapping",
        description: "Course and stream relationships mapping",
        roles: ["super-admin", "admin", "institution", "principal"],
      },
      {
        title: "Term/Semester Setup",
        icon: Layers,
        href: "/master/term-semester-setup",
        description: "Academic term and semester configuration",
        roles: ["super-admin", "admin", "institution", "principal"],
      },
      {
        title: "Subject Master Setup",
        icon: BookOpen,
        href: "/master/subject-master-setup",
        description: "Subject and curriculum master data",
        roles: ["super-admin", "admin", "institution", "principal"],
      },
      {
        title: "Registration Form Setup",
        icon: FileText,
        href: "/master/registration-form-setup",
        description: "Student registration forms and fields",
        roles: ["super-admin", "admin", "institution", "principal"],
      },
      {
        title: "User Role Permissions",
        icon: Shield,
        href: "/master/user-role-permissions-setup",
        description: "Role-based access control and permissions",
        roles: ["super-admin", "admin"],
      },
    ],
  },
  users: {
    title: "User Management",
    icon: Users,
    color: "from-cyan-500 to-cyan-600",
    description: "Comprehensive user administration and access control",
    allowedRoles: ["super-admin", "admin", "institution", "principal"],
    quickActions: [
      {
        title: "Administrators",
        icon: Shield,
        href: "/users/admins",
        description: "System administrators management",
        roles: ["super-admin", "admin"],
      },
      {
        title: "Faculty",
        icon: School,
        href: "/users/faculty",
        description: "Faculty members and teaching staff",
        roles: ["super-admin", "admin", "institution", "principal"],
      },
      {
        title: "Students",
        icon: GraduationCap,
        href: "/users/students",
        description: "Student accounts and profiles",
        roles: ["super-admin", "admin", "institution", "principal"],
      },
    ],
  },
  staff: {
    title: "Staff Management",
    icon: UserCheck,
    color: "from-indigo-500 to-indigo-600",
    description: "Staff roles, assignments, and workforce management",
    allowedRoles: ["super-admin", "admin", "institution", "principal"],
    quickActions: [
      {
        title: "Staff Roles",
        icon: Shield,
        href: "/staff/roles",
        description: "Staff roles and responsibilities definition",
        roles: ["super-admin", "admin", "institution", "principal"],
      },
      {
        title: "Staff Allotment",
        icon: Calendar,
        href: "/staff/allotment",
        description: "Staff assignments and scheduling",
        roles: ["super-admin", "admin", "institution", "principal"],
      },
    ],
  },
  settings: {
    title: "System Settings",
    icon: Settings,
    color: "from-gray-500 to-gray-600",
    description: "System-wide configuration and advanced settings",
    allowedRoles: ["super-admin"],
    quickActions: [
      {
        title: "System Permissions",
        icon: Shield,
        href: "/settings/permissions",
        description: "Global permission management",
        roles: ["super-admin"],
      },
      {
        title: "System Configuration",
        icon: Settings,
        href: "/settings/config",
        description: "Global system settings",
        roles: ["super-admin"],
      },
    ],
  },
};

export default function Dashboard() {
  const { user, switchRole } = useAuth();
  let appContext;
  try {
    appContext = useApp();
  } catch (error) {
    // Handle case where component is rendered outside AppProvider
    appContext = null;
  }
  const state = appContext?.state || {};
  const {
    dashboardStats,
    quickActions,
    recentActivities,
    loading,
    handleQuickAction,
    handleModuleClick,
    handleRefresh,
    isActionLoading,
  } = useDashboard();
  const location = useLocation();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  // Get module context from navigation state
  const selectedModule = location.state?.selectedModule;
  const isModuleView =
    selectedModule && location.pathname.includes(selectedModule);

  // Filter modules based on user role
  const accessibleModules = Object.entries(moduleConfig).filter(
    ([moduleKey, moduleData]) =>
      user?.role && moduleData.allowedRoles.includes(user.role),
  );

  // Filter quick actions based on user role for each module
  const getFilteredQuickActions = (
    quickActions: any[],
    userRole: string | undefined,
  ) => {
    if (!userRole) return [];
    return quickActions.filter((action) => action.roles.includes(userRole));
  };

  const refresh = async () => {
    setRefreshing(true);
    await handleRefresh();
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Role-based stats configuration
  const getRoleBasedStats = (userRole: string | undefined) => {
    const baseStats = {
      "super-admin": [
        {
          title: "Total Users",
          value: "2,847",
          change: "+125 this month",
          icon: Users,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
        {
          title: "System Modules",
          value: "7",
          change: "All modules active",
          icon: Grid3X3,
          color: "text-green-600",
          bgColor: "bg-green-50",
        },
        {
          title: "Database Size",
          value: "1.2TB",
          change: "+50GB this month",
          icon: Database,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        },
        {
          title: "System Uptime",
          value: "99.9%",
          change: "30 days stable",
          icon: Activity,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
        },
      ],
      admin: [
        {
          title: "Total Students",
          value: "1,250",
          change: "+12% from last month",
          icon: Users,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
        {
          title: "Faculty Members",
          value: "85",
          change: "+3 new this semester",
          icon: School,
          color: "text-green-600",
          bgColor: "bg-green-50",
        },
        {
          title: "Active Courses",
          value: "120",
          change: "+8 new programs",
          icon: BookOpenCheck,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        },
        {
          title: "Pass Rate",
          value: "92.3%",
          change: "+2.1% from last year",
          icon: TrendingUp,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
        },
      ],
      institution: [
        {
          title: "Total Students",
          value: "1,250",
          change: "+12% from last month",
          icon: Users,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
        {
          title: "Faculty Members",
          value: "85",
          change: "+3 new this semester",
          icon: School,
          color: "text-green-600",
          bgColor: "bg-green-50",
        },
        {
          title: "Active Programs",
          value: "45",
          change: "+5 new programs",
          icon: GraduationCap,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        },
        {
          title: "Graduation Rate",
          value: "94.2%",
          change: "+1.8% improvement",
          icon: Trophy,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
        },
      ],
      principal: [
        {
          title: "Total Students",
          value: "1,250",
          change: "+12% from last month",
          icon: Users,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
        {
          title: "Faculty Members",
          value: "85",
          change: "+3 new this semester",
          icon: School,
          color: "text-green-600",
          bgColor: "bg-green-50",
        },
        {
          title: "Academic Performance",
          value: "87.5%",
          change: "+3.2% improvement",
          icon: BarChart3,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        },
        {
          title: "Attendance Rate",
          value: "94.7%",
          change: "+2.1% this term",
          icon: CheckCircle,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
        },
      ],
      hod: [
        {
          title: "Department Students",
          value: "320",
          change: "+8% this semester",
          icon: Users,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
        {
          title: "Department Faculty",
          value: "18",
          change: "+2 new faculty",
          icon: School,
          color: "text-green-600",
          bgColor: "bg-green-50",
        },
        {
          title: "Active Courses",
          value: "28",
          change: "+3 new courses",
          icon: BookOpen,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        },
        {
          title: "Avg. Performance",
          value: "89.2%",
          change: "+4.1% improvement",
          icon: TrendingUp,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
        },
      ],
      faculty: [
        {
          title: "My Students",
          value: "85",
          change: "3 courses assigned",
          icon: Users,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
        {
          title: "Active Courses",
          value: "3",
          change: "Currently teaching",
          icon: BookOpen,
          color: "text-green-600",
          bgColor: "bg-green-50",
        },
        {
          title: "Assignments Pending",
          value: "12",
          change: "Need grading",
          icon: ClipboardList,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        },
        {
          title: "Class Average",
          value: "88.7%",
          change: "+2.3% this term",
          icon: BarChart3,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
        },
      ],
      student: [
        {
          title: "Enrolled Courses",
          value: "6",
          change: "Current semester",
          icon: BookOpen,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
        {
          title: "Assignments Due",
          value: "3",
          change: "This week",
          icon: Clock,
          color: "text-green-600",
          bgColor: "bg-green-50",
        },
        {
          title: "Current GPA",
          value: "3.7",
          change: "+0.2 improvement",
          icon: Star,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        },
        {
          title: "Attendance",
          value: "94%",
          change: "This semester",
          icon: CheckCircle,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
        },
      ],
      parent: [
        {
          title: "Child's Courses",
          value: "6",
          change: "Current semester",
          icon: BookOpen,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
        {
          title: "Attendance Rate",
          value: "96%",
          change: "This month",
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50",
        },
        {
          title: "Academic Grade",
          value: "A-",
          change: "Current average",
          icon: Star,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        },
        {
          title: "Upcoming Events",
          value: "2",
          change: "This week",
          icon: Calendar,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
        },
      ],
    };

    return baseStats[userRole as keyof typeof baseStats] || baseStats["admin"];
  };

  const overviewStats = getRoleBasedStats(user?.role);

  if (isModuleView) {
    // Render single module dashboard
    const moduleData =
      moduleConfig[selectedModule as keyof typeof moduleConfig];
    if (!moduleData) return <div>Module not found</div>;

    // Filter quick actions based on user role
    const filteredQuickActions = getFilteredQuickActions(
      moduleData.quickActions,
      user?.role,
    );

    return (
      <div className="space-y-6">
        {/* Module Header */}
        <div className="relative overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-r ${moduleData.color} opacity-10`}
          ></div>
          <Card className="relative border-none shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-4 rounded-xl bg-gradient-to-r ${moduleData.color} text-white shadow-lg`}
                  >
                    <moduleData.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">{moduleData.title}</h1>
                    <p className="text-muted-foreground mt-1">
                      {moduleData.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">Module Dashboard</Badge>
                      <Badge variant="outline">
                        {user?.role?.toUpperCase()} Access
                      </Badge>
                      {moduleData.isSpecial && (
                        <Badge variant="destructive">
                          Core System Configuration
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => navigate("/dashboard")}
                  variant="outline"
                >
                  <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
                  Back to Main Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Special handling for Master Setup */}
        {moduleData.isSpecial && (
          <Card className="border-orange-200 bg-orange-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-orange-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-orange-900">
                    System Foundation Module
                  </h3>
                  <p className="text-orange-800 mt-1">
                    This module contains the core configuration that affects the
                    entire ERP system. Changes here will impact all other
                    modules. Please proceed with caution and ensure proper
                    backup before making modifications.
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge
                      variant="outline"
                      className="border-orange-300 text-orange-700"
                    >
                      System Critical
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-orange-300 text-orange-700"
                    >
                      Requires Admin Access
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Role-based Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {user?.role === "student"
                ? "Available Features"
                : "Quick Actions"}
              <Badge variant="outline" className="ml-2">
                {filteredQuickActions.length} Available
              </Badge>
            </CardTitle>
            <CardDescription>
              {moduleData.isSpecial
                ? `Configure system-wide settings and master data for ${moduleData.title}`
                : `Access key features and tools for ${moduleData.title} based on your role (${user?.role})`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredQuickActions.length > 0 ? (
              <div
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${
                  moduleData.isSpecial ? "xl:grid-cols-2" : "xl:grid-cols-4"
                } gap-4`}
              >
                {filteredQuickActions.map((action, index) => (
                  <Link key={index} to={action.href}>
                    <Card
                      className={`group hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer border-2 hover:border-primary/20 ${
                        moduleData.isSpecial ? "min-h-[120px]" : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-lg bg-gradient-to-r ${moduleData.color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}
                          >
                            <action.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium group-hover:text-primary transition-colors">
                              {action.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                              {action.description}
                            </p>
                            {moduleData.isSpecial && (
                              <Badge variant="outline" className="mt-2 text-xs">
                                System Configuration
                              </Badge>
                            )}
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12 text-center">
                <div>
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No Actions Available</h3>
                  <p className="text-muted-foreground">
                    Your current role ({user?.role}) doesn't have access to any
                    actions in this module.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Module-specific analytics or additional info */}
        {selectedModule === "master" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  System Configuration Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      item: "Entity Structure",
                      status: "Configured",
                      color: "text-green-600",
                    },
                    {
                      item: "Academic Calendar",
                      status: "Active",
                      color: "text-green-600",
                    },
                    {
                      item: "User Roles",
                      status: "Configured",
                      color: "text-green-600",
                    },
                    {
                      item: "Programs & Streams",
                      status: "In Progress",
                      color: "text-orange-600",
                    },
                  ].map((config, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm">{config.item}</span>
                      <Badge variant="outline" className={config.color}>
                        {config.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security & Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      item: "Role-Based Access",
                      status: "Active",
                      users: "7 roles",
                    },
                    {
                      item: "Permission Matrix",
                      status: "Configured",
                      users: "247 permissions",
                    },
                    {
                      item: "Module Access",
                      status: "Secured",
                      users: "8 modules",
                    },
                    {
                      item: "Data Protection",
                      status: "Enabled",
                      users: "GDPR Compliant",
                    },
                  ].map((security, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <span className="text-sm font-medium">
                          {security.item}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {security.users}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-green-600">
                        {security.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // Render main dashboard with all modules
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name || "System Administrator"}!
          </h1>
          <p className="text-muted-foreground">
            Super Admin Dashboard • Comprehensive System Overview
          </p>
        </div>
        <Button onClick={refresh} disabled={refreshing} variant="outline">
          <RefreshCw
            className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")}
          />
          Refresh
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => (
          <Card
            key={index}
            className="relative overflow-hidden group hover:shadow-lg transition-all duration-200"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${
                  stat.color.includes("blue")
                    ? "from-blue-500 to-blue-600"
                    : stat.color.includes("green")
                      ? "from-green-500 to-green-600"
                      : stat.color.includes("orange")
                        ? "from-orange-500 to-orange-600"
                        : "from-purple-500 to-purple-600"
                } opacity-70`}
              ></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Course Progress Journey - Show for students and other learning-focused roles */}
      {user?.role &&
        ["student", "faculty", "hod", "principal"].includes(user.role) && (
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30">
              <CardContent className="p-6">
                <WaveProgress
                  courses={journeyData}
                  userProgress={{ currentCourseIndex: 1 }}
                />
              </CardContent>
            </Card>
          </div>
        )}

      {/* Modules Accordion */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="h-5 w-5" />
            System Modules & Quick Actions
          </CardTitle>
          <CardDescription>
            Access all system modules and their key features in an organized
            view
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full space-y-4">
            {accessibleModules.map(([moduleKey, moduleData], index) => (
              <AccordionItem
                key={moduleKey}
                value={moduleKey}
                className="border rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline p-6 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4 w-full">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${moduleData.color} text-white shadow-lg`}
                    >
                      <moduleData.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-semibold">
                        {moduleData.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {moduleData.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">
                          {
                            getFilteredQuickActions(
                              moduleData.quickActions,
                              user?.role,
                            ).length
                          }{" "}
                          of {moduleData.quickActions.length} Actions
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {user?.role} Access
                        </Badge>
                        {moduleData.isSpecial && (
                          <Badge variant="destructive" className="text-xs">
                            Core System
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0">
                  {(() => {
                    const filteredActions = getFilteredQuickActions(
                      moduleData.quickActions,
                      user?.role,
                    );

                    return (
                      <>
                        {filteredActions.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredActions.map((action, actionIndex) => (
                              <Link key={actionIndex} to={action.href}>
                                <Card className="group hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer border hover:border-primary/20">
                                  <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                      <div
                                        className={`p-2 rounded-lg bg-gradient-to-r ${moduleData.color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}
                                      >
                                        <action.icon className="h-4 w-4 text-primary" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-medium group-hover:text-primary transition-colors text-sm">
                                          {action.title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                          {action.description}
                                        </p>
                                      </div>
                                      <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                                    </div>
                                  </CardContent>
                                </Card>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center py-8 text-center">
                            <div>
                              <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                No actions available for your role in this
                                module.
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {filteredActions.length} of{" "}
                                {moduleData.quickActions.length} available
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {user?.role} access
                              </Badge>
                              {moduleData.isSpecial && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Core System
                                </Badge>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(`/dashboard`, {
                                  state: { selectedModule: moduleKey },
                                })
                              }
                            >
                              <Target className="h-4 w-4 mr-2" />
                              View {moduleData.title} Dashboard
                            </Button>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Recent Activity & Analytics Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "New student enrollment",
                  module: "Academics",
                  time: "2 minutes ago",
                  icon: Users,
                },
                {
                  action: "Course content updated",
                  module: "LMS",
                  time: "15 minutes ago",
                  icon: BookOpen,
                },
                {
                  action: "Exam schedule published",
                  module: "Examinations",
                  time: "1 hour ago",
                  icon: Calendar,
                },
                {
                  action: "Faculty assignment created",
                  module: "Staff",
                  time: "2 hours ago",
                  icon: UserCheck,
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <activity.icon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.module} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              System Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  module: "Learning Management",
                  usage: 85,
                  color: "bg-green-500",
                },
                {
                  module: "Academic Management",
                  usage: 72,
                  color: "bg-blue-500",
                },
                {
                  module: "Examination System",
                  usage: 68,
                  color: "bg-purple-500",
                },
                { module: "User Management", usage: 45, color: "bg-cyan-500" },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.module}</span>
                    <span className="text-muted-foreground">{item.usage}%</span>
                  </div>
                  <Progress value={item.usage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}