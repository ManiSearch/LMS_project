import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/contexts/AuthContext";
import { PermissionGuard, usePermissions } from "@/components/PermissionGuard";
import {
  fileUploadService,
  UploadProgress,
  UploadResult,
} from "@/services/fileUploadService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import CourseContentView from "./CourseContentView";
import { toast } from "react-hot-toast";
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
  Monitor,
  Shield,
  QrCode,
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
  Speaker,
  Smartphone,
  Wifi,
  Archive,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Maximize,
  Minimize,
} from "lucide-react";

interface ContentItem {
  id: string;
  topicId: string;
  type:
  | "video"
  | "audio"
  | "ppt"
  | "pdf"
  | "youtube"
  | "vimeo"
  | "recording"
  | "screen-recording"
  | "docx"
  | "scorm"
  | "lti"
  | "quiz"
  | "image"
  | "animation";
  title: string;
  description?: string;
  url?: string;
  filePath?: string;
  fileName?: string;
  fileSize?: number;
  duration?: number;
  uploadDate: string;
  uploadedBy: string;
  isPublished: boolean;
  downloadEnabled?: boolean;
  scormConfig?: {
    launchUrl: string;
    manifestUrl: string;
    version: string;
  };
  ltiConfig?: {
    launchUrl: string;
    consumerKey: string;
    sharedSecret: string;
    customParams?: Record<string, string>;
  };
  quizConfig?: {
    questions: Array<{
      id: string;
      type: "multiple-choice" | "true-false" | "short-answer" | "essay";
      question: string;
      options?: string[];
      correctAnswer?: string | number;
      points: number;
    }>;
    timeLimit?: number;
    attempts: number;
    passingScore: number;
  };
}

interface Topic {
  id: string;
  unitId: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  isPublished: boolean;
  content: ContentItem[];
  createdBy: string;
  createdDate: string;
  lastModified: string;
  hasDiscussion: boolean;
  hasAssessment: boolean;
  hasAssignment: boolean;
}

interface Unit {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  isPublished: boolean;
  topics: Topic[];
  createdBy: string;
  createdDate: string;
  lastModified: string;
}

interface Course {
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
  rating: number;
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

const initialCourses: Course[] = [
  {
    id: "1",
    name: "Digital Logic Design",
    code: "1052233110",
    category: "Computer Engineering",
    subcategory: "Digital Systems",
    type: "Theory",
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
    type: "Practicum",
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
        topics: [
          "Simple and Compound Interest Program",
          "Area Calculation Program",
        ],
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
        topics: ["Largest of Three Numbers Program", "Prime Number Generator"],
      },
      {
        id: "U303",
        courseId: "2",
        title: "Arrays and Functions",
        description:
          "1D and 2D arrays, user-defined functions, call by value/reference, recursion, passing arrays.",
        order: 3,
        duration: 15,
        isPublished: true,
        createdBy: "Faculty",
        createdDate: "2024-01-15",
        lastModified: "2024-01-15",
        topics: ["Matrix Addition and Transpose", "Factorial using Recursion"],
      },
      {
        id: "U304",
        courseId: "2",
        title: "Strings and Pointers",
        description:
          "Strings, built-in functions, pointers, pointer arithmetic, pointer to array, pointer to pointer.",
        order: 4,
        duration: 15,
        isPublished: true,
        createdBy: "Faculty",
        createdDate: "2024-01-15",
        lastModified: "2024-01-15",
        topics: [
          "String Length and Reverse using Pointers",
          "Linear Search using Pointers",
        ],
      },
      {
        id: "U305",
        courseId: "2",
        title: "Structures and File Management",
        description:
          "Structures, arrays of structures, unions, file types, modes, operations on files.",
        order: 5,
        duration: 15,
        isPublished: true,
        createdBy: "Faculty",
        createdDate: "2024-01-15",
        lastModified: "2024-01-15",
        topics: ["Student Record Program", "File Character/Word/Line Count"],
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
    name: "Electric Vehicle Technology",
    code: "1030235210",
    category: "Electronics & Communication Engineering",
    subcategory: "Automotive & Energy Systems",
    type: "Theory",
    credits: 3,
    learningHours: 45,
    practicalHours: 0,
    startDate: "2024-01-15",
    endDate: "2024-05-15",
    description:
      "This course introduces the fundamentals of electric and hybrid vehicle technologies, including vehicle layouts, batteries, charging methods, motors and drives, electronics, hybrid architectures, regenerative braking, and fuel cells. Students gain knowledge of EV systems, safety, and sustainable energy solutions.",
    outcomes: [
      "Evaluate electric vehicle architectures, battery technologies, and charging standards",
      "Analyze electric motor drives and hybrid drive trains for performance optimization",
      "Design converters and sensor-less control systems with high-voltage safety protocols",
      "Compare hybrid vehicle layouts and regenerative braking for energy efficiency",
      "Assess fuel cell technologies and analyze societal and environmental impacts of EVs",
    ],
    department: "Electronics & Communication Engineering",
    assignedDepartments: [
      "Electronics & Communication Engineering",
      "Automobile Engineering",
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
    units: [
      {
        id: "U401",
        courseId: "4",
        title: "Introduction to Electric Vehicles",
        description:
          "Need, types, costs, emissions, layouts, components, batteries, charging methods, and alternate charging sources like solar and wireless.",
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
        courseId: "4",
        title: "Electric Vehicle Motors",
        description:
          "Types, construction and control of motors (DC, Induction, BLDC, SRM), drive trains, power rating design, and torque-speed coupling.",
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
        courseId: "4",
        title: "Electronics and Sensor-less Control",
        description:
          "Basic electronic devices, converters, inverters, high-voltage safety, hazard management, sensors for autonomous EVs, and sensor-less control methods.",
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
        courseId: "4",
        title: "Hybrid Vehicles",
        description:
          "Classification of hybrid EVs, architectures (series, parallel, series-parallel), regenerative braking, economy, vibration and noise reduction.",
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
        courseId: "4",
        title: "Fuel Cells for Electric Vehicles",
        description:
          "Fuel cell technologies, principles, efficiency, durability, design factors, cost, components, and maintenance for EV applications.",
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
    id: "5",
    name: "Electronic Devices and Circuits",
    code: "1040233110",
    category: "Electronics and Communication Engineering",
    subcategory: "Circuits and Devices",
    type: "Theory",
    credits: 4,
    learningHours: 60,
    practicalHours: 0,
    startDate: "2024-01-15",
    endDate: "2024-05-15",
    description:
      "This course provides fundamental knowledge on rectifiers, transistors, amplifiers, feedback systems, and oscillators. It equips students with essential skills in circuit design, analysis, and troubleshooting, preparing them for careers in electronics and communication engineering.",
    outcomes: [
      "Analyze functionalities of basic electronic components and devices",
      "Design circuits using basic electronic components and analyze their applications",
      "Evaluate and analyze the parameters and characteristics of BJTs, FETs, and UJTs",
      "Simulate and test the performance of waveshaping circuits",
      "Demonstrate practical understanding of electronic devices and circuits through seminars/assignments",
    ],
    department: "Electronics and Communication Engineering",
    assignedDepartments: [
      "Electronics and Communication Engineering",
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
    prerequisites: [],
    badges: ["Circuit Designer", "Amplifier Specialist", "Oscillator Builder"],
    certificates: ["Electronic Devices and Circuits Certificate"],
    enrollmentMode: "manual",
    proctoring: false,
    adaptiveLearning: false,
    virtualClassroom: true,
    collaborationTools: [
      "Seminars",
      "Assignments",
      "Discussion Forums",
      "Simulation Projects",
    ],
    contentTypes: [
      "Lectures",
      "Hands-on Experiments",
      "Simulations",
      "Case Studies",
    ],
    assignments: 4,
    assessments: 4,
    discussions: 5,
    lessonPlans: 6,
    gamificationEnabled: false,
    certificatesGenerated: 0,
    notifications: ["Email", "In-App"],
    integrations: ["Tinkercad", "Multisim", "NPTEL"],
    units: [
      {
        id: "U501",
        courseId: "5",
        title: "Diode Circuits",
        description:
          "Rectifiers, clippers, clampers, LED, and photo-diode: working principles and applications.",
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
        courseId: "5",
        title: "Bipolar Junction Transistor",
        description:
          "Construction, working principles of BJT (NPN, PNP), configurations, and transistor biasing techniques.",
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
        courseId: "5",
        title: "Amplifiers",
        description:
          "Single stage, power, and multistage amplifiers; RC coupled, push-pull, cascade, cascode, Darlington pair, and differential amplifiers.",
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
        courseId: "5",
        title: "Feedback Amplifiers and Oscillators",
        description:
          "Feedback concepts, negative feedback amplifiers, oscillation theory, Barkhausen criterion, and oscillators like Hartley, Colpitts, Wien Bridge, RC Phase Shift, and Crystal.",
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
        courseId: "5",
        title: "Field Effect Transistors & Uni Junction Transistor",
        description:
          "FETs, MOSFETs, comparison with BJTs, JFET operation and characteristics, UJT construction and relaxation oscillator applications.",
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

const contentLibrary = [
  // Videos
  {
    id: "LIB001",
    type: "video",
    title: "Introduction to Arrays - Comprehensive Guide",
    description: "Detailed explanation of array data structures with examples",
    duration: 1800,
    uploadDate: "2024-01-15",
    uploadedBy: "Dr.Manikandan",
    category: "Video Content",
  },
  {
    id: "LIB002",
    type: "video",
    title: "Binary Tree Traversal Algorithms",
    description:
      "In-depth coverage of pre-order, in-order, and post-order traversals",
    duration: 1500,
    uploadDate: "2024-01-16",
    uploadedBy: "Prof.Deepak",
    category: "Video Content",
  },
  {
    id: "LIB003",
    type: "video",
    title: "Sorting Algorithms Comparison",
    description: "Visual comparison of different sorting algorithms",
    duration: 2100,
    uploadDate: "2024-01-17",
    uploadedBy: "Dr.Suresh",
    category: "Video Content",
  },
  {
    id: "LIB004",
    type: "video",
    title: "Graph Theory Fundamentals",
    description:
      "Introduction to graphs, vertices, edges, and basic algorithms",
    duration: 1680,
    uploadDate: "2024-01-18",
    uploadedBy: "Prof.Lavanya",
    category: "Video Content",
  },
  {
    id: "LIB005",
    type: "video",
    title: "Dynamic Programming Concepts",
    description: "Understanding memoization and tabulation techniques",
    duration: 1920,
    uploadDate: "2024-01-19",
    uploadedBy: "Dr.Rajeswari",
    category: "Video Content",
  },
  // Audio Content
  {
    id: "LIB006",
    type: "audio",
    title: "Array Fundamentals - Audio Lecture",
    description: "Comprehensive audio explanation of array concepts",
    duration: 1200,
    uploadDate: "2024-01-15",
    uploadedBy: "Dr.Gayathri",
    category: "Audio Content",
  },
  {
    id: "LIB007",
    type: "audio",
    title: "Queue Concepts - Podcast Style",
    description:
      "Queue implementation and applications explained in podcast format",
    duration: 1500,
    uploadDate: "2024-01-16",
    uploadedBy: "Prof.Karthik",
    category: "Audio Content",
  },
  {
    id: "LIB008",
    type: "audio",
    title: "Stack Operations - Audio Guide",
    description: "Step-by-step audio guide for stack operations",
    duration: 1620,
    uploadDate: "2024-01-17",
    uploadedBy: "Dr.Priya",
    category: "Audio Content",
  },
  // Presentations
  {
    id: "LIB009",
    type: "ppt",
    title: "Data Structures Overview - Master Slides",
    description:
      "Comprehensive presentation covering all major data structures",
    pages: 45,
    uploadDate: "2024-01-15",
    uploadedBy: "Dr.Kumar",
    category: "Presentations",
  },
  {
    id: "LIB010",
    type: "ppt",
    title: "Algorithm Analysis Techniques",
    description: "Slides on time and space complexity analysis",
    pages: 32,
    uploadDate: "2024-01-16",
    uploadedBy: "Prof.Meera",
    category: "Presentations",
  },
  {
    id: "LIB011",
    type: "pdf",
    title: "Advanced Data Structures Handbook",
    description: "Complete reference guide for advanced data structures",
    pages: 120,
    uploadDate: "2024-01-17",
    uploadedBy: "Dr.Rajesh",
    category: "Presentations",
  },
  {
    id: "LIB012",
    type: "ppt",
    title: "Programming Best Practices",
    description: "Guidelines and best practices for efficient programming",
    pages: 28,
    uploadDate: "2024-01-18",
    uploadedBy: "Prof.Srinivas",
    category: "Presentations",
  },
];

const categories = [
  "Computer Science",
  "Business",
  "Engineering",
  "Mathematics",
  "Science",
  "Arts",
  "Medicine",
];
const subcategories = [
  "Programming",
  "Marketing",
  "Artificial Intelligence",
  "Data Science",
  "Web Development",
  "Mobile Development",
  "Cybersecurity",
];
const courseTypes = ["Mandatory", "Elective"];
const departments = [
  "Computer Science",
  "Information Technology",
  "Business Administration",
  "Marketing",
  "Engineering",
  "Mathematics",
  "Science",
];

// Role-based permission helpers
const canCreateCourse = (userRole: string | undefined): boolean => {
  return ["super-admin", "admin", "institution", "principal"].includes(
    userRole || ""
  );
};

const canEditCourse = (userRole: string | undefined): boolean => {
  return ["super-admin", "admin", "institution", "principal"].includes(
    userRole || ""
  );
};

const canDeleteCourse = (userRole: string | undefined): boolean => {
  return ["super-admin", "admin", "institution", "principal"].includes(
    userRole || ""
  );
};

const canManageUnitsTopics = (userRole: string | undefined): boolean => {
  return [
    "super-admin",
    "admin",
    "institution",
    "principal",
    "faculty",
    "hod",
  ].includes(userRole || "");
};

const canUploadContent = (userRole: string | undefined): boolean => {
  return [
    "super-admin",
    "admin",
    "institution",
    "principal",
    "faculty",
    "hod",
  ].includes(userRole || "");
};

export default function Courses() {
  const { user } = useAuth();
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();

  // Current view state - determines which page is shown
  const [currentView, setCurrentView] = useState<
    "list" | "create" | "edit" | "view" | "manage" | "content-view"
  >("list");

  // Only show the 3 required courses: Civil Engineering, Architecture (Full Time), and 3D Animation & Graphics
  const [courses, setCourses] = useState<Course[]>(() => {
    // Clear any existing localStorage data to ensure only filtered courses are shown
    localStorage.removeItem("coursesData");
    return initialCourses;
  });

  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => {
    const baseEnrollments = [
      {
        id: "E001",
        courseId: "C001",
        studentId: "student-1",
        studentName: "Joshua",
        enrollmentDate: "2024-01-15",
        status: "enrolled" as const,
        progress: 75,
        lastActivity: new Date().toISOString(),
        grade: "A-",
        enrollmentType: "manual" as const,
      },
    ];

    if (user?.role === "student") {
      const userEnrollments = baseEnrollments
        .filter((e) => e.studentId === "student-1")
        .map((e) => ({
          ...e,
          studentId: user?.id || "student-1",
          studentName: user?.name || "Student",
        }));
      return [
        ...baseEnrollments,
        ...userEnrollments.map((e) => ({ ...e, id: `${e.id}_USER` })),
      ];
    }

    return baseEnrollments;
  });

  // Save courses to localStorage whenever courses state changes
  useEffect(() => {
    try {
      localStorage.setItem("coursesData", JSON.stringify(courses));
    } catch (error) {
      console.error("Error saving courses to localStorage:", error);
    }
  }, [courses]);

  // Selected items for editing/viewing
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedContentItem, setSelectedContentItem] =
    useState<ContentItem | null>(null);

  // Form data for course creation/editing
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "",
    subcategory: "",
    type: "Mandatory" as "Mandatory" | "Elective",
    credits: 0,
    learningHours: 0,
    practicalHours: 0,
    startDate: "",
    endDate: "",
    description: "",
    outcomes: [] as string[],
    department: "",
    assignedDepartments: [] as string[],
    assignedFaculty: [] as string[],
    assignedHODs: [] as string[],
    visibility: "Active" as "Active" | "Inactive",
    status: "Draft" as
      | "Draft"
      | "Active"
      | "Published"
      | "Completed"
      | "Archived",
  });

  // Form data for units and topics
  const [unitFormData, setUnitFormData] = useState({
    title: "",
    description: "",
    order: 1,
    duration: 0,
    isPublished: false,
  });

  const [topicFormData, setTopicFormData] = useState({
    title: "",
    description: "",
    order: 1,
    duration: 0,
    isPublished: false,
    hasDiscussion: false,
    hasAssessment: false,
    hasAssignment: false,
  });

  const [contentFormData, setContentFormData] = useState({
    type: "video" as ContentItem["type"],
    title: "",
    description: "",
    url: "",
    file: null as File | null,
    isPublished: false,
    downloadEnabled: true,
  });

  // Upload states
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  // Media player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [activeView, setActiveView] = useState("courses");

  // Content management system state
  const [contentView, setContentView] = useState<
    "list" | "create" | "edit" | "view"
  >("list");
  const [selectedContentType, setSelectedContentType] = useState<string>("all");
  const [contentSearchTerm, setContentSearchTerm] = useState("");
  const [selectedContentId, setSelectedContentId] = useState<string | null>(
    null
  );

  // Content data structure
  interface ContentLibraryItem {
    id: string;
    type:
    | "lesson"
    | "scorm"
    | "lti"
    | "outcome"
    | "rule"
    | "quiz"
    | "video"
    | "document"
    | "interactive";
    title: string;
    description: string;
    category: string;
    status: "draft" | "published" | "archived";
    createdBy: string;
    createdDate: string;
    lastModified: string;
    fileUrl?: string;
    fileSize?: number;
    duration?: number;
    tags: string[];
    metadata?: any;
  }

  const [contentItems, setContentItems] = useState<ContentLibraryItem[]>([
    {
      id: "CNT001",
      type: "lesson",
      title: "Foundations of Digital Logic",
      description:
        "Introduction to digital systems, number systems, binary arithmetic, logic gates, and universal gate realization.",
      category: "Digital Logic Design",
      status: "published",
      createdBy: "Faculty",
      createdDate: "2024-01-15",
      lastModified: "2024-01-20",
      duration: 45,
      tags: ["digital", "logic", "foundations", "binary", "gates"],
      metadata: {
        objectives: [
          "Understand number systems and binary arithmetic",
          "Learn about logic gates and their realizations",
          "Familiarize with digital code standards such as ASCII and BCD",
        ],
        difficulty: "Beginner",
      },
    },
    {
      id: "CNT002",
      type: "lesson",
      title: "Introduction to C",
      description:
        "Overview of C language, program structure, compilation, tokens, variables, data types, operators, and basic input/output.",
      category: "C Programming",
      status: "published",
      createdBy: "Faculty",
      createdDate: "2024-01-15",
      lastModified: "2024-01-20",
      duration: 45,
      tags: ["c", "programming", "introduction", "tokens", "variables"],
      metadata: {
        objectives: [
          "Understand the structure of a C program",
          "Learn about constants, variables, operators, and data types",
          "Perform formatted and unformatted input/output operations",
        ],
        difficulty: "Beginner",
      },
    },
  ]);

  const [newContentFormData, setNewContentFormData] = useState({
    type: "lesson" as ContentLibraryItem["type"],
    title: "",
    description: "",
    category: "",
    tags: [] as string[],
    status: "draft" as ContentLibraryItem["status"],
    file: null as File | null,
    metadata: {},
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const itemsPerPageOptions = [5, 10, 25, 50, 100];

  // Filter courses first
  const allFilteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(course.assignedFaculty) &&
        course.assignedFaculty.some((f) =>
          f.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    const matchesCategory =
      categoryFilter === "all" || course.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || course.status.toLowerCase() === statusFilter;
    const matchesType =
      typeFilter === "all" || course.type.toLowerCase() === typeFilter;

    // Role-based access control
    let hasAccess = false;

    if (
      user?.role === "super-admin" ||
      user?.role === "admin" ||
      user?.role === "institution" ||
      user?.role === "principal"
    ) {
      hasAccess = true;
    } else if (user?.role === "hod" || user?.role === "faculty") {
      const userFacultyNames = [
        "Dr. kiruba",
        "Prof. Sarasvathi",
        "Dr.Kumar",
        "Prof.Deepak",
        "Dr.Manikandan",
        "BALAMURUGAN", // Add current faculty user
      ];
      const currentUserFacultyName = user?.name || userFacultyNames[0];

      if (user?.role === "hod") {
        // HODs can see all courses in their institution
        hasAccess = true;
      } else if (user?.role === "faculty") {
        // Faculty can ONLY see courses they are specifically assigned to
        hasAccess =
          (Array.isArray(course.assignedFaculty) &&
            course.assignedFaculty.includes(currentUserFacultyName)) ||
          (Array.isArray(course.assignedHODs) &&
            course.assignedHODs.includes(currentUserFacultyName));
      }
    } else if (user?.role === "student") {
      hasAccess =
        course.status === "Published" ||
        course.status === "Active" ||
        enrollments.some(
          (e) =>
            e.courseId === course.id &&
            e.studentId === (user?.id || "student-1")
        );
    } else if (user?.role === "parent") {
      hasAccess = course.status === "Published" || course.status === "Active";
    }

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus &&
      matchesType &&
      hasAccess
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(allFilteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredCourses = allFilteredCourses.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, statusFilter, typeFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const getPaginationRange = () => {
    const range = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

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
    imported: courses.length - initialCourses.length,
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      category: "",
      subcategory: "",
      type: "Mandatory",
      credits: 0,
      learningHours: 0,
      practicalHours: 0,
      startDate: "",
      endDate: "",
      description: "",
      outcomes: [],
      department: "",
      assignedDepartments: [],
      assignedFaculty: [],
      assignedHODs: [],
      visibility: "Active",
      status: "Draft",
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
      maxCapacity: 50,
      prerequisites: [],
      badges: [],
      certificates: [],
      enrollmentMode: "manual",
      proctoring: false,
      adaptiveLearning: false,
      virtualClassroom: false,
      collaborationTools: [],
      contentTypes: [],
      assignments: 0,
      assessments: 0,
      discussions: 0,
      lessonPlans: 0,
      gamificationEnabled: false,
      certificatesGenerated: 0,
      notifications: [],
      integrations: [],
      units: [],
      canEdit: true,
      canDelete: true,
      createdBy: user?.name || "Unknown",
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    setCourses([...courses, newCourse]);
    setCurrentView("list");
    resetForm();
    toast.success("Course created successfully!");
  };

  const handleEdit = () => {
    if (selectedCourse) {
      setCourses(
        courses.map((course) =>
          course.id === selectedCourse.id
            ? { ...course, ...formData, lastModified: new Date().toISOString() }
            : course
        )
      );
      setCurrentView("list");
      setSelectedCourse(null);
      resetForm();
      toast.success("Course updated successfully!");
    }
  };

  const handleDelete = (courseId: string) => {
    setCourses(courses.filter((course) => course.id !== courseId));
    toast.success("Course deleted successfully!");
  };

  const openCreatePage = () => {
    resetForm();
    setCurrentView("create");
  };

  const openEditPage = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      name: course.name,
      code: course.code,
      category: course.category,
      subcategory: course.subcategory,
      type: course.type,
      credits: course.credits,
      learningHours: course.learningHours,
      practicalHours: course.practicalHours,
      startDate: course.startDate,
      endDate: course.endDate,
      description: course.description,
      outcomes: course.outcomes,
      department: course.department,
      assignedDepartments: course.assignedDepartments,
      assignedFaculty: course.assignedFaculty,
      assignedHODs: course.assignedHODs,
      visibility: course.visibility,
      status: course.status,
    });
    setCurrentView("edit");
  };

  const openViewPage = (course: Course) => {
    setSelectedCourse(course);
    setCurrentView("view");
  };

  const openManagePage = (course: Course) => {
    setSelectedCourse(course);
    setCurrentView("manage");
  };

  const openContentViewPage = (course: Course) => {
    setSelectedCourse(course);
    setCurrentView("content-view");
  };

  const backToList = () => {
    setCurrentView("list");
    setSelectedCourse(null);
    setSelectedUnit(null);
    setSelectedTopic(null);
    resetForm();
  };

  // Import/Export Functions
  const handleImportCourses = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,.csv";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            let importedData;
            if (
              file.type === "application/json" ||
              file.name.endsWith(".json")
            ) {
              importedData = JSON.parse(event.target?.result as string);
            } else if (file.type === "text/csv" || file.name.endsWith(".csv")) {
              // Parse CSV to JSON
              const csv = event.target?.result as string;
              importedData = parseCSVToJSON(csv);
            }

            if (importedData && Array.isArray(importedData)) {
              const newCourses = importedData.map(
                (courseData: any, index: number) => ({
                  id:
                    courseData.id ||
                    `IMP${String(Date.now() + index).slice(-3)}${Math.random()
                      .toString(36)
                      .substr(2, 3)}`,
                  ...courseData,
                  // Ensure array fields are always arrays
                  outcomes: Array.isArray(courseData.outcomes)
                    ? courseData.outcomes
                    : [],
                  assignedDepartments: Array.isArray(
                    courseData.assignedDepartments
                  )
                    ? courseData.assignedDepartments
                    : [],
                  assignedFaculty: Array.isArray(courseData.assignedFaculty)
                    ? courseData.assignedFaculty
                    : [],
                  assignedHODs: Array.isArray(courseData.assignedHODs)
                    ? courseData.assignedHODs
                    : [],
                  prerequisites: Array.isArray(courseData.prerequisites)
                    ? courseData.prerequisites
                    : [],
                  badges: Array.isArray(courseData.badges)
                    ? courseData.badges
                    : [],
                  certificates: Array.isArray(courseData.certificates)
                    ? courseData.certificates
                    : [],
                  collaborationTools: Array.isArray(
                    courseData.collaborationTools
                  )
                    ? courseData.collaborationTools
                    : [],
                  contentTypes: Array.isArray(courseData.contentTypes)
                    ? courseData.contentTypes
                    : [],
                  notifications: Array.isArray(courseData.notifications)
                    ? courseData.notifications
                    : [],
                  integrations: Array.isArray(courseData.integrations)
                    ? courseData.integrations
                    : [],
                  units: Array.isArray(courseData.units)
                    ? courseData.units
                    : [],
                  // Ensure numeric fields have defaults
                  students: courseData.students || 0,
                  completion: courseData.completion || 0,
                  rating: courseData.rating || 0,
                  enrolled: courseData.enrolled || 0,
                  assignments: courseData.assignments || 0,
                  assessments: courseData.assessments || 0,
                  discussions: courseData.discussions || 0,
                  lessonPlans: courseData.lessonPlans || 0,
                  certificatesGenerated: courseData.certificatesGenerated || 0,
                  // Ensure boolean fields have defaults
                  proctoring: courseData.proctoring || false,
                  adaptiveLearning: courseData.adaptiveLearning || false,
                  virtualClassroom: courseData.virtualClassroom || false,
                  gamificationEnabled: courseData.gamificationEnabled || false,
                  canEdit: true,
                  canDelete: true,
                  createdBy: user?.name || "Imported",
                  createdDate: new Date().toISOString(),
                  lastModified: new Date().toISOString(),
                })
              );

              setCourses((prevCourses) => {
                // Remove any existing courses with the same IDs to prevent duplicates
                const existingIds = new Set(prevCourses.map((c) => c.id));
                const uniqueNewCourses = newCourses.filter(
                  (course) => !existingIds.has(course.id)
                );
                return [...prevCourses, ...uniqueNewCourses];
              });
              toast.success(
                `Successfully imported ${newCourses.length} courses!`
              );
            } else {
              toast.error(
                "Invalid file format. Please upload a valid JSON or CSV file."
              );
            }
          } catch (error) {
            console.error("Error importing courses:", error);
            toast.error(
              "Error importing courses. Please check the file format."
            );
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExportCourses = () => {
    try {
      const exportData = courses.map((course) => ({
        id: course.id,
        name: course.name,
        code: course.code,
        category: course.category,
        subcategory: course.subcategory,
        type: course.type,
        credits: course.credits,
        learningHours: course.learningHours,
        practicalHours: course.practicalHours,
        startDate: course.startDate,
        endDate: course.endDate,
        description: course.description,
        outcomes: course.outcomes,
        department: course.department,
        assignedDepartments: course.assignedDepartments,
        assignedFaculty: course.assignedFaculty,
        assignedHODs: course.assignedHODs,
        visibility: course.visibility,
        status: course.status,
        maxCapacity: course.maxCapacity,
        prerequisites: course.prerequisites,
        enrollmentMode: course.enrollmentMode,
        units: course.units,
      }));

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      saveAs(
        blob,
        `courses-export-${new Date().toISOString().split("T")[0]}.json`
      );
      toast.success("Courses exported successfully!");
    } catch (error) {
      console.error("Error exporting courses:", error);
      toast.error("Error exporting courses.");
    }
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        name: "Sample Course Name",
        code: "SAMPLE001",
        category: "Computer Science",
        subcategory: "Programming",
        type: "Mandatory",
        credits: 4,
        learningHours: 60,
        practicalHours: 30,
        startDate: "2024-01-15",
        endDate: "2024-05-15",
        description: "Sample course description",
        outcomes: ["Outcome 1", "Outcome 2"],
        department: "Computer Science",
        assignedDepartments: ["Computer Science"],
        assignedFaculty: ["Dr. Sample"],
        assignedHODs: ["Dr. Sample HOD"],
        visibility: "Active",
        status: "Draft",
        maxCapacity: 50,
        prerequisites: ["Prerequisite 1"],
        enrollmentMode: "manual",
      },
    ];

    // Create CSV template
    const headers = Object.keys(templateData[0]);
    const csvContent = [
      headers.join(","),
      templateData
        .map((row) =>
          headers
            .map((header) => {
              const value = (row as any)[header];
              if (Array.isArray(value)) {
                return `"${value.join(";")}"`;
              }
              return `"${value}"`;
            })
            .join(",")
        )
        .join("\n"),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    saveAs(blob, "course-template.csv");
    toast.success("Template downloaded successfully!");
  };

  // Content management helper functions
  const handleCreateContent = () => {
    const newContent: ContentLibraryItem = {
      id: `CNT${String(contentItems.length + 1).padStart(3, "0")}`,
      ...newContentFormData,
      createdBy: user?.name || "Unknown",
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    setContentItems([...contentItems, newContent]);
    setContentView("list");
    resetContentForm();
    toast.success("Content created successfully!");
  };

  const handleUpdateContent = () => {
    if (selectedContentId) {
      setContentItems(
        contentItems.map((item) =>
          item.id === selectedContentId
            ? {
              ...item,
              ...newContentFormData,
              lastModified: new Date().toISOString(),
            }
            : item
        )
      );
      setContentView("list");
      setSelectedContentId(null);
      resetContentForm();
      toast.success("Content updated successfully!");
    }
  };

  const handleDeleteContent = (id: string) => {
    setContentItems(contentItems.filter((item) => item.id !== id));
    toast.success("Content deleted successfully!");
  };

  const resetContentForm = () => {
    setNewContentFormData({
      type: "lesson",
      title: "",
      description: "",
      category: "",
      tags: [],
      status: "draft",
      file: null,
      metadata: {},
    });
  };

  const renderContentForm = () => {
    const isEditing = contentView === "edit";

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setContentView("list")}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  {isEditing ? "Edit Content" : "Create New Content"}
                </CardTitle>
                <CardDescription>
                  {isEditing
                    ? "Update content information and settings"
                    : "Add new educational content to the library"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="content-type">Content Type</Label>
                  <Select
                    value={newContentFormData.type}
                    onValueChange={(value) =>
                      setNewContentFormData({
                        ...newContentFormData,
                        type: value as ContentLibraryItem["type"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lesson">📚 Lesson</SelectItem>
                      <SelectItem value="video">🎥 Video</SelectItem>
                      <SelectItem value="scorm">📦 SCORM Package</SelectItem>
                      <SelectItem value="quiz">❓ Quiz</SelectItem>
                      <SelectItem value="document">📄 Document</SelectItem>
                      <SelectItem value="lti">🔗 LTI Tool</SelectItem>
                      <SelectItem value="interactive">
                        🎮 Interactive
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="content-title">Title</Label>
                  <Input
                    id="content-title"
                    value={newContentFormData.title}
                    onChange={(e) =>
                      setNewContentFormData({
                        ...newContentFormData,
                        title: e.target.value,
                      })
                    }
                    placeholder="Enter content title"
                  />
                </div>

                <div>
                  <Label htmlFor="content-category">Category</Label>
                  <Select
                    value={newContentFormData.category}
                    onValueChange={(value) =>
                      setNewContentFormData({
                        ...newContentFormData,
                        category: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Civil Engineering">
                        Civil Engineering
                      </SelectItem>
                      <SelectItem value="Architecture">Architecture</SelectItem>
                      <SelectItem value="Animation & Graphics">
                        Animation & Graphics
                      </SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="content-status">Status</Label>
                  <Select
                    value={newContentFormData.status}
                    onValueChange={(value) =>
                      setNewContentFormData({
                        ...newContentFormData,
                        status: value as ContentLibraryItem["status"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="content-description">Description</Label>
                  <Textarea
                    id="content-description"
                    value={newContentFormData.description}
                    onChange={(e) =>
                      setNewContentFormData({
                        ...newContentFormData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter content description"
                    rows={6}
                  />
                </div>

                <div>
                  <Label htmlFor="content-tags">Tags (comma separated)</Label>
                  <Input
                    id="content-tags"
                    value={newContentFormData.tags.join(", ")}
                    onChange={(e) =>
                      setNewContentFormData({
                        ...newContentFormData,
                        tags: e.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter((tag) => tag),
                      })
                    }
                    placeholder="e.g. fundamentals, introduction, beginner"
                  />
                </div>

                {(newContentFormData.type === "video" ||
                  newContentFormData.type === "document" ||
                  newContentFormData.type === "scorm") && (
                    <div>
                      <Label htmlFor="content-file">Upload File</Label>
                      <Input
                        id="content-file"
                        type="file"
                        onChange={(e) =>
                          setNewContentFormData({
                            ...newContentFormData,
                            file: e.target.files?.[0] || null,
                          })
                        }
                        accept={
                          newContentFormData.type === "video"
                            ? "video/*"
                            : newContentFormData.type === "document"
                              ? ".pdf,.doc,.docx,.ppt,.pptx"
                              : ".zip"
                        }
                      />
                    </div>
                  )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setContentView("list")}>
                Cancel
              </Button>
              <Button
                onClick={isEditing ? handleUpdateContent : handleCreateContent}
                disabled={
                  !newContentFormData.title || !newContentFormData.category
                }
              >
                {isEditing ? "Update Content" : "Create Content"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderContentDetail = () => {
    const content = contentItems.find((item) => item.id === selectedContentId);
    if (!content) return null;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setContentView("list")}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  {content.title}
                </CardTitle>
                <CardDescription>{content.description}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewContentFormData({
                      type: content.type,
                      title: content.title,
                      description: content.description,
                      category: content.category,
                      tags: content.tags,
                      status: content.status,
                      file: null,
                      metadata: content.metadata || {},
                    });
                    setContentView("edit");
                  }}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDeleteContent(content.id);
                    setContentView("list");
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Type
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    {content.type === "lesson" && (
                      <BookOpen className="h-4 w-4 text-blue-600" />
                    )}
                    {content.type === "video" && (
                      <Video className="h-4 w-4 text-red-600" />
                    )}
                    {content.type === "scorm" && (
                      <Archive className="h-4 w-4 text-green-600" />
                    )}
                    {content.type === "quiz" && (
                      <Brain className="h-4 w-4 text-purple-600" />
                    )}
                    {content.type === "document" && (
                      <FileText className="h-4 w-4 text-gray-600" />
                    )}
                    {content.type === "lti" && (
                      <Zap className="h-4 w-4 text-orange-600" />
                    )}
                    <span className="capitalize">{content.type}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Status
                  </Label>
                  <div className="mt-1">
                    <Badge
                      variant={
                        content.status === "published" ? "default" : "secondary"
                      }
                    >
                      {content.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Category
                  </Label>
                  <p className="mt-1">{content.category}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Created By
                  </Label>
                  <p className="mt-1">{content.createdBy}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Tags
                  </Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {content.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Created Date
                  </Label>
                  <p className="mt-1">
                    {new Date(content.createdDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Last Modified
                  </Label>
                  <p className="mt-1">
                    {new Date(content.lastModified).toLocaleDateString()}
                  </p>
                </div>

                {content.duration && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Duration
                    </Label>
                    <p className="mt-1">{content.duration} minutes</p>
                  </div>
                )}
              </div>
            </div>

            {content.metadata && Object.keys(content.metadata).length > 0 && (
              <div className="mt-6">
                <Label className="text-sm font-medium text-muted-foreground">
                  Additional Information
                </Label>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <pre className="text-sm">
                    {JSON.stringify(content.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const parseCSVToJSON = (csv: string) => {
    const lines = csv.split("\n");
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i]
          .split(",")
          .map((v) => v.replace(/"/g, "").trim());
        const obj: any = {};

        headers.forEach((header, index) => {
          let value = values[index] || "";

          // Handle array fields (semicolon separated)
          if (
            [
              "outcomes",
              "assignedDepartments",
              "assignedFaculty",
              "assignedHODs",
              "prerequisites",
              "badges",
              "certificates",
              "collaborationTools",
              "contentTypes",
              "notifications",
              "integrations",
            ].includes(header)
          ) {
            obj[header] = value
              ? value
                .split(";")
                .map((v) => v.trim())
                .filter((v) => v)
              : [];
          }
          // Handle numeric fields
          else if (
            [
              "credits",
              "learningHours",
              "practicalHours",
              "maxCapacity",
              "students",
              "completion",
              "rating",
              "enrolled",
              "assignments",
              "assessments",
              "discussions",
              "lessonPlans",
              "certificatesGenerated",
            ].includes(header)
          ) {
            obj[header] = parseInt(value) || 0;
          }
          // Handle boolean fields
          else if (
            [
              "proctoring",
              "adaptiveLearning",
              "virtualClassroom",
              "gamificationEnabled",
            ].includes(header)
          ) {
            obj[header] = value.toLowerCase() === "true" || value === "1";
          } else {
            obj[header] = value;
          }
        });

        data.push(obj);
      }
    }

    return data;
  };

  const handleTestCRUD = () => {
    toast.success("CRUD operations tested successfully!");
  };

  const handleClearData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all imported course data? This will reset to the 3 filtered courses only."
      )
    ) {
      setCourses(initialCourses);
      localStorage.removeItem("coursesData");
      toast.success(
        "Course data cleared successfully! Displaying only the 3 required courses."
      );
    }
  };

  const removeDuplicateCourses = () => {
    const uniqueCourses = courses.filter(
      (course, index, self) =>
        index === self.findIndex((c) => c.id === course.id)
    );
    if (uniqueCourses.length !== courses.length) {
      setCourses(uniqueCourses);
      toast.success(
        `Removed ${courses.length - uniqueCourses.length} duplicate courses!`
      );
    } else {
      toast.info("No duplicate courses found.");
    }
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

  // Unit Management Functions
  const handleCreateUnit = () => {
    if (!canManageUnitsTopics(user?.role) || !selectedCourse) return;

    const newUnit: Unit = {
      id: `U${String(Date.now()).slice(-3)}`,
      courseId: selectedCourse.id,
      title: unitFormData.title,
      description: unitFormData.description,
      order: unitFormData.order,
      duration: unitFormData.duration,
      isPublished: unitFormData.isPublished,
      topics: [],
      createdBy: user?.name || "Unknown",
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    setCourses(
      courses.map((course) =>
        course.id === selectedCourse.id
          ? {
            ...course,
            units: [...course.units, newUnit],
            lastModified: new Date().toISOString(),
          }
          : course
      )
    );

    setUnitFormData({
      title: "",
      description: "",
      order: 1,
      duration: 0,
      isPublished: false,
    });

    toast.success("Unit created successfully!");
  };

  const handleCreateTopic = (unitId: string) => {
    if (!canManageUnitsTopics(user?.role) || !selectedCourse) return;

    const newTopic: Topic = {
      id: `T${String(Date.now()).slice(-3)}`,
      unitId,
      title: topicFormData.title,
      description: topicFormData.description,
      order: topicFormData.order,
      duration: topicFormData.duration,
      isPublished: topicFormData.isPublished,
      hasDiscussion: topicFormData.hasDiscussion,
      hasAssessment: topicFormData.hasAssessment,
      hasAssignment: topicFormData.hasAssignment,
      content: [],
      createdBy: user?.name || "Unknown",
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    setCourses(
      courses.map((course) =>
        course.id === selectedCourse.id
          ? {
            ...course,
            units: course.units.map((unit) =>
              unit.id === unitId
                ? {
                  ...unit,
                  topics: [...(unit.topics || []), newTopic],
                  lastModified: new Date().toISOString(),
                }
                : unit
            ),
            lastModified: new Date().toISOString(),
          }
          : course
      )
    );

    setTopicFormData({
      title: "",
      description: "",
      order: 1,
      duration: 0,
      isPublished: false,
      hasDiscussion: false,
      hasAssessment: false,
      hasAssignment: false,
    });

    toast.success("Topic created successfully!");
  };

  // Media Player Functions
  const togglePlayPause = () => {
    if (selectedContentItem?.type === "video") {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    } else if (selectedContentItem?.type === "audio") {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    }
  };

  const MediaPlayer = ({ content }: { content: ContentItem }) => {
    return (
      <div className="space-y-4">
        {content.type === "video" && (
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <video
              ref={videoRef}
              className="w-full h-full"
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            >
              <source src={content.url || content.filePath} type="video/mp4" />
            </video>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center gap-4">
                <Button
                  size="sm"
                  onClick={togglePlayPause}
                  className="bg-white/20 hover:bg-white/30"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <div className="flex-1">
                  <Progress
                    value={(currentTime / duration) * 100}
                    className="w-full h-2"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                  className="bg-white/20 hover:bg-white/30"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {content.type === "audio" && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border">
            <audio
              ref={audioRef}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            >
              <source src={content.url || content.filePath} type="audio/mpeg" />
            </audio>
            <div className="flex items-center gap-4">
              <Button
                onClick={togglePlayPause}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    {Math.floor(currentTime / 60)}:
                    {Math.floor(currentTime % 60)
                      .toString()
                      .padStart(2, "0")}
                  </span>
                  <span>
                    {Math.floor(duration / 60)}:
                    {Math.floor(duration % 60)
                      .toString()
                      .padStart(2, "0")}
                  </span>
                </div>
                <Progress
                  value={(currentTime / duration) * 100}
                  className="w-full h-2"
                />
              </div>
              <Button
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                variant="outline"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}

        {content.type === "ppt" && (
          <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-200">
            <div className="text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-orange-600" />
              <h3 className="text-lg font-medium text-orange-900 mb-2">
                PowerPoint Presentation
              </h3>
              <p className="text-orange-700 mb-4">{content.description}</p>
              <div className="flex justify-center gap-3">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Eye className="h-4 w-4 mr-2" />
                  View Slides
                </Button>
                {content.downloadEnabled && (
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const UnitAccordion = ({ course }: { course: Course }) => {
    return (
      <Accordion type="multiple" className="w-full space-y-4">
        {course.units.map((unit) => (
          <AccordionItem
            key={unit.id}
            value={unit.id}
            className="border rounded-lg"
          >
            <div className="flex items-center justify-between p-4">
              <AccordionTrigger className="flex-1 py-0 hover:no-underline [&>svg]:ml-auto">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">
                      Unit {unit.order}: {unit.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {unit.description}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {unit.duration}h • {unit.topics?.length || 0} topics
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <div className="flex items-center gap-2 ml-4">
                <Badge variant={unit.isPublished ? "default" : "secondary"}>
                  {unit.isPublished ? "Published" : "Draft"}
                </Badge>
                {canManageUnitsTopics(user?.role) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      // Add topic functionality
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Topic
                  </Button>
                )}
              </div>
            </div>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3">
                {(unit.topics || []).map((topic) => (
                  <Card key={topic.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">
                            Topic {topic.order}: {topic.title}
                          </h4>
                          <Badge
                            variant={
                              topic.isPublished ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {topic.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {topic.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {topic.duration} min
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Content: {topic.content?.length || 0}
                          </span>
                          {[
                            topic.hasDiscussion && { key: 'discussion', label: 'Discussion' },
                            topic.hasAssessment && { key: 'assessment', label: 'Assessment' },
                            topic.hasAssignment && { key: 'assignment', label: 'Assignment' }
                          ].filter(Boolean).map((badge) => (
                            <Badge key={badge.key} variant="outline" className="text-xs">
                              {badge.label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {canUploadContent(user?.role) && (
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Upload className="h-4 w-4 mr-1" />
                            Upload Content
                          </Button>
                          <Button size="sm" variant="outline">
                            <Camera className="h-4 w-4 mr-1" />
                            Record Content
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Content Items */}
                    {(topic.content?.length || 0) > 0 && (
                      <div className="space-y-2 pt-3 border-t">
                        <h5 className="text-sm font-medium">Content Items:</h5>
                        <div className="grid grid-cols-1 gap-2">
                          {(topic.content || []).map((contentItem) => (
                            <div
                              key={contentItem.id}
                              className="flex items-center justify-between p-3 bg-muted rounded border"
                            >
                              <div className="flex items-center gap-3">
                                {contentItem.type === "video" && (
                                  <Video className="h-5 w-5 text-blue-600" />
                                )}
                                {contentItem.type === "audio" && (
                                  <Mic className="h-5 w-5 text-green-600" />
                                )}
                                {contentItem.type === "ppt" && (
                                  <FileText className="h-5 w-5 text-orange-600" />
                                )}
                                <div>
                                  <div className="font-medium text-sm">
                                    {contentItem.title}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {contentItem.type.toUpperCase()} •{" "}
                                    {contentItem.uploadedBy}
                                    {contentItem.duration &&
                                      ` • ${Math.round(
                                        contentItem.duration / 60
                                      )} min`}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    contentItem.isPublished
                                      ? "default"
                                      : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {contentItem.isPublished
                                    ? "Published"
                                    : "Draft"}
                                </Badge>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedContentItem(contentItem);
                                    // This would open content in new view
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}

                {(unit.topics?.length || 0) === 0 && (
                  <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No topics added yet</p>
                    {canManageUnitsTopics(user?.role) && (
                      <Button size="sm" className="mt-2">
                        <Plus className="h-4 w-4 mr-1" />
                        Add First Topic
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}

        {course.units.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No units created yet</p>
            {canManageUnitsTopics(user?.role) && (
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add First Unit
              </Button>
            )}
          </div>
        )}
      </Accordion>
    );
  };

  // Render functions for different views
  const renderCourseList = () => (
    <div className="space-y-8">
      <Card className="section-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <BookOpen className="h-5 w-5" />
            </div>
            Course Directory
          </CardTitle>
          <CardDescription>
            Comprehensive course directory with role-based access control
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
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Type & Credits</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Enrollment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{course.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {course.code} • {course.category}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {course.department}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge
                        variant={
                          course.type === "Mandatory" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {course.type}
                      </Badge>
                      <div className="text-sm">{course.credits} Credits</div>
                      <div className="text-xs text-muted-foreground">
                        {course.learningHours}h Theory + {course.practicalHours}
                        h Practical
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Faculty:</div>
                      {Array.isArray(course.assignedFaculty) &&
                        course.assignedFaculty.slice(0, 2).map((faculty) => (
                          <div
                            key={faculty}
                            className="text-xs text-muted-foreground"
                          >
                            • {faculty}
                          </div>
                        ))}
                      {Array.isArray(course.assignedFaculty) &&
                        course.assignedFaculty.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{course.assignedFaculty.length - 2} more
                          </div>
                        )}
                      {!Array.isArray(course.assignedFaculty) && (
                        <div className="text-xs text-muted-foreground">
                          No faculty assigned
                        </div>
                      )}
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
                        {Math.round(
                          (course.enrolled / course.maxCapacity) * 100
                        )}
                        % full
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge
                        variant={
                          course.status === "Active"
                            ? "default"
                            : course.status === "Published"
                              ? "default"
                              : course.status === "Draft"
                                ? "secondary"
                                : "outline"
                        }
                      >
                        {course.status}
                      </Badge>
                      <Badge
                        variant={
                          course.visibility === "Active"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {course.visibility}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openViewPage(course)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {canManageUnitsTopics(user?.role) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openManagePage(course)}
                          title="Manage Course Content"
                        >
                          <BookOpenCheck className="h-4 w-4" />
                        </Button>
                      )}

                      {canEditCourse(user?.role) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditPage(course)}
                          title="Edit Course"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      )}

                      {user?.role === "student" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openContentViewPage(course)}
                          title="Learn Course"
                        >
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

        {/* Pagination */}
        {allFilteredCourses.length > 0 && (
          <div className="px-6 py-4 border-t bg-gray-50">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, allFilteredCourses.length)} of{" "}
                  {allFilteredCourses.length} courses
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Rows per page:
                  </span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) =>
                      handleItemsPerPageChange(Number(value))
                    }
                  >
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {itemsPerPageOptions.map((option) => (
                        <SelectItem key={option} value={option.toString()}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {getPaginationRange().map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );

  const renderCourseForm = () => (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={backToList}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {selectedCourse ? "Edit Course" : "Create New Course"}
          </h1>
          <p className="text-muted-foreground">
            {selectedCourse
              ? "Update course information and settings"
              : "Create a comprehensive course with all required details"}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="assignments">
                Assignments & Outcomes
              </TabsTrigger>
              <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-6">
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
                  rows={4}
                />
              </div>
            </TabsContent>

            <TabsContent value="assignments" className="space-y-4 mt-6">
              <div>
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) =>
                    setFormData({ ...formData, department: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Assigned Departments</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {departments.map((dept) => (
                    <div key={dept} className="flex items-center space-x-2">
                      <Checkbox
                        id={`dept-${dept}`}
                        checked={formData.assignedDepartments.includes(dept)}
                        onCheckedChange={(checked) =>
                          handleArrayFieldChange(
                            "assignedDepartments",
                            dept,
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor={`dept-${dept}`} className="text-sm">
                        {dept}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Assigned Faculty</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {[
                    "Dr. kiruba",
                    "Prof. Sarasvathi",
                    "Dr.Kumar",
                    "Prof.Deepak",
                    "Dr.Manikandan",
                  ].map((faculty) => (
                    <div key={faculty} className="flex items-center space-x-2">
                      <Checkbox
                        id={`faculty-${faculty}`}
                        checked={formData.assignedFaculty.includes(faculty)}
                        onCheckedChange={(checked) =>
                          handleArrayFieldChange(
                            "assignedFaculty",
                            faculty,
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor={`faculty-${faculty}`} className="text-sm">
                        {faculty}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Course Outcomes</Label>
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
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select
                    value={formData.visibility}
                    onValueChange={(value: "Active" | "Inactive") =>
                      setFormData({ ...formData, visibility: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Course Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(
                      value:
                        | "Draft"
                        | "Active"
                        | "Published"
                        | "Completed"
                        | "Archived"
                    ) => setFormData({ ...formData, status: value })}
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
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
            <Button variant="outline" onClick={backToList}>
              Cancel
            </Button>
            <Button onClick={selectedCourse ? handleEdit : handleCreate}>
              {selectedCourse ? "Update Course" : "Create Course"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCourseView = () => (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={backToList}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {selectedCourse?.name}
          </h1>
          <p className="text-muted-foreground">
            Course Details and Information
          </p>
        </div>
      </div>

      {selectedCourse && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Course Code
                    </Label>
                    <p className="text-sm">{selectedCourse.code}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Category
                    </Label>
                    <p className="text-sm">
                      {selectedCourse.category} - {selectedCourse.subcategory}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Type
                    </Label>
                    <Badge
                      variant={
                        selectedCourse.type === "Mandatory"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {selectedCourse.type}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Credits
                    </Label>
                    <p className="text-sm">{selectedCourse.credits}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Description
                  </Label>
                  <p className="text-sm mt-1">{selectedCourse.description}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Course Outcomes
                  </Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedCourse.outcomes.map((outcome) => (
                      <Badge
                        key={outcome}
                        variant="secondary"
                        className="text-xs"
                      >
                        {outcome}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Structure</CardTitle>
                <CardDescription>
                  Units, topics, and content overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {selectedCourse.units.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Units</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {selectedCourse.units.reduce(
                          (total, unit) => total + (unit.topics?.length || 0),
                          0
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Topics
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {selectedCourse.units.reduce(
                          (total, unit) =>
                            total +
                            (unit.topics || []).reduce(
                              (topicTotal, topic) =>
                                topicTotal + (topic.content?.length || 0),
                              0
                            ),
                          0
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Content Items
                      </div>
                    </div>
                  </div>

                  {selectedCourse.units.length > 0 ? (
                    <UnitAccordion course={selectedCourse} />
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No course structure created yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Status</span>
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
                <div className="flex justify-between">
                  <span className="text-sm">Enrolled</span>
                  <span className="text-sm font-medium">
                    {selectedCourse.enrolled}/{selectedCourse.maxCapacity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Progress</span>
                  <span className="text-sm font-medium">
                    {selectedCourse.completion}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm">{selectedCourse.rating}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assigned Faculty</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedCourse.assignedFaculty.map((faculty) => (
                    <div key={faculty} className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm">{faculty}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {canEditCourse(user?.role) && (
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={() => openEditPage(selectedCourse)}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Course
                  </Button>
                  {canManageUnitsTopics(user?.role) && (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => openManagePage(selectedCourse)}
                    >
                      <BookOpenCheck className="h-4 w-4 mr-2" />
                      Manage Content
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderCourseManagement = () => {
    if (!selectedCourse) return null;

    return (
      <CourseContentView
        course={{
          ...selectedCourse,
          rating: selectedCourse.rating || 4.8,
          enrollmentCount: selectedCourse.enrollmentCount || 45,
          completionRate: selectedCourse.completionRate || 75,
        }}
        onBack={backToList}
      />
    );
  };

  const renderContentViewPage = () => (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={backToList}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Learning Interface
          </h1>
          <p className="text-muted-foreground">
            Access course materials for {selectedCourse?.name}
          </p>
        </div>
      </div>

      {selectedCourse && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{selectedCourse.name}</CardTitle>
                <CardDescription>{selectedCourse.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Code: {selectedCourse.code}</span>
                  <span>Credits: {selectedCourse.credits}</span>
                  <span>Instructor: {selectedCourse.assignedFaculty[0]}</span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Course Progress</span>
                    <span>
                      {enrollments.find(
                        (e) =>
                          e.courseId === selectedCourse.id &&
                          e.studentId === user?.id
                      )?.progress || 0}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      enrollments.find(
                        (e) =>
                          e.courseId === selectedCourse.id &&
                          e.studentId === user?.id
                      )?.progress || 0
                    }
                    className="w-full h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>
                  Study materials and learning resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedCourse.units
                    .filter((unit) => unit.isPublished)
                    .map((unit) => (
                      <Accordion
                        key={unit.id}
                        type="multiple"
                        className="w-full"
                      >
                        <AccordionItem
                          value={unit.id}
                          className="border rounded-lg"
                        >
                          <AccordionTrigger className="px-4 py-3 hover:no-underline">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="text-left">
                                <div className="font-medium">
                                  Unit {unit.order}: {unit.title}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {unit.description}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {unit.duration}h •{" "}
                                  {
                                    (unit.topics || []).filter(
                                      (t) => t.isPublished
                                    ).length
                                  }{" "}
                                  topics
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <div className="space-y-3">
                              {unit.topics
                                .filter((topic) => topic.isPublished)
                                .map((topic) => (
                                  <Card
                                    key={topic.id}
                                    className="p-4 border-l-4 border-blue-200"
                                  >
                                    <div className="mb-3">
                                      <h4 className="font-medium">
                                        Topic {topic.order}: {topic.title}
                                      </h4>
                                      <p className="text-sm text-muted-foreground">
                                        {topic.description}
                                      </p>
                                      <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs text-muted-foreground">
                                          {topic.duration} minutes
                                        </span>
                                        {[
                                          topic.hasDiscussion && { key: 'discussion', label: 'Discussion' },
                                          topic.hasAssessment && { key: 'assessment', label: 'Assessment' },
                                          topic.hasAssignment && { key: 'assignment', label: 'Assignment' }
                                        ].filter(Boolean).map((badge) => (
                                          <Badge key={badge.key} variant="outline" className="text-xs">
                                            {badge.label}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>

                                    {(topic.content || []).filter(
                                      (content) => content.isPublished
                                    ).length > 0 && (
                                        <div className="space-y-3">
                                          <h5 className="text-sm font-medium">
                                            Learning Materials:
                                          </h5>
                                          <div className="grid gap-3">
                                            {topic.content
                                              .filter(
                                                (content) => content.isPublished
                                              )
                                              .map((content) => (
                                                <div
                                                  key={content.id}
                                                  className="flex items-center justify-between p-3 bg-background rounded border"
                                                >
                                                  <div className="flex items-center gap-3">
                                                    {content.type === "video" && (
                                                      <Video className="h-5 w-5 text-blue-600" />
                                                    )}
                                                    {content.type === "audio" && (
                                                      <Mic className="h-5 w-5 text-green-600" />
                                                    )}
                                                    {content.type === "ppt" && (
                                                      <FileText className="h-5 w-5 text-orange-600" />
                                                    )}
                                                    <div>
                                                      <div className="font-medium text-sm">
                                                        {content.title}
                                                      </div>
                                                      <div className="text-xs text-muted-foreground">
                                                        {content.type.toUpperCase()}
                                                        {content.duration &&
                                                          ` • ${Math.round(
                                                            content.duration / 60
                                                          )} min`}
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    <Button
                                                      size="sm"
                                                      onClick={() =>
                                                        setSelectedContentItem(
                                                          content
                                                        )
                                                      }
                                                    >
                                                      {content.type ===
                                                        "video" ? (
                                                        <>
                                                          <PlayCircle className="h-4 w-4 mr-1" />
                                                          Watch
                                                        </>
                                                      ) : content.type ===
                                                        "audio" ? (
                                                        <>
                                                          <PlayCircle className="h-4 w-4 mr-1" />
                                                          Listen
                                                        </>
                                                      ) : (
                                                        <>
                                                          <Eye className="h-4 w-4 mr-1" />
                                                          View
                                                        </>
                                                      )}
                                                    </Button>
                                                    {content.downloadEnabled && (
                                                      <Button
                                                        size="sm"
                                                        variant="outline"
                                                      >
                                                        <Download className="h-4 w-4 mr-1" />
                                                        Download
                                                      </Button>
                                                    )}
                                                  </div>
                                                </div>
                                              ))}
                                          </div>
                                        </div>
                                      )}
                                  </Card>
                                ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ))}
                </div>
              </CardContent>
            </Card>

            {selectedContentItem && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {selectedContentItem.title}
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedContentItem(null)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    {selectedContentItem.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MediaPlayer content={selectedContentItem} />
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {enrollments.find(
                      (e) =>
                        e.courseId === selectedCourse.id &&
                        e.studentId === user?.id
                    )?.progress || 0}
                    %
                  </div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
                <Progress
                  value={
                    enrollments.find(
                      (e) =>
                        e.courseId === selectedCourse.id &&
                        e.studentId === user?.id
                    )?.progress || 0
                  }
                  className="w-full h-2"
                />
                <div className="text-xs text-center text-muted-foreground">
                  Keep learning to improve your progress!
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Discussion Forum
                </Button>
                <Button className="w-full" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Assignments
                </Button>
                <Button className="w-full" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Assessments
                </Button>
                <Button className="w-full" variant="outline">
                  <Award className="h-4 w-4 mr-2" />
                  Certificates
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { id: 'activity-1', color: 'bg-green-500', text: 'Completed Array Basics' },
                  { id: 'activity-2', color: 'bg-blue-500', text: 'Watched Stack Tutorial' },
                  { id: 'activity-3', color: 'bg-orange-500', text: 'Downloaded PPT Slides' }
                ].map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 text-sm">
                    <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
                    <span>{activity.text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );

  // Content management function with full CRUD
  const renderContentManagement = () => {
    const filteredContent = contentItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(contentSearchTerm.toLowerCase()) ||
        item.description
          .toLowerCase()
          .includes(contentSearchTerm.toLowerCase()) ||
        item.tags.some((tag) =>
          tag.toLowerCase().includes(contentSearchTerm.toLowerCase())
        );
      const matchesType =
        selectedContentType === "all" || item.type === selectedContentType;
      return matchesSearch && matchesType;
    });

    // Content List View
    if (contentView === "list") {
      return (
        <div className="space-y-6">
          {/* Header with hero image */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets%2Fea5579e3714a41dba1ca3fac42375eb5%2F5023535518f5493a9ec63f308fa242ed?format=webp&width=80"
                      alt="Content Management"
                      className="w-16 h-16 rounded-lg object-cover shadow-lg"
                    />
                    <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {contentItems.length}
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Content Design & Management
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Create, manage, and organize educational content with
                      advanced tools
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setContentView("create")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Content
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Content
                    </p>
                    <p className="text-2xl font-bold">{contentItems.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Published
                    </p>
                    <p className="text-2xl font-bold">
                      {
                        contentItems.filter((c) => c.status === "published")
                          .length
                      }
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Draft
                    </p>
                    <p className="text-2xl font-bold">
                      {contentItems.filter((c) => c.status === "draft").length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Categories
                    </p>
                    <p className="text-2xl font-bold">
                      {new Set(contentItems.map((c) => c.category)).size}
                    </p>
                  </div>
                  <BookOpen className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search content by title, description, or tags..."
                      value={contentSearchTerm}
                      onChange={(e) => setContentSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select
                  value={selectedContentType}
                  onValueChange={setSelectedContentType}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="lesson">Lessons</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="scorm">SCORM Packages</SelectItem>
                    <SelectItem value="quiz">Quizzes</SelectItem>
                    <SelectItem value="document">Documents</SelectItem>
                    <SelectItem value="lti">LTI Tools</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {item.type === "lesson" && (
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      )}
                      {item.type === "video" && (
                        <Video className="h-5 w-5 text-red-600" />
                      )}
                      {item.type === "scorm" && (
                        <Archive className="h-5 w-5 text-green-600" />
                      )}
                      {item.type === "quiz" && (
                        <Brain className="h-5 w-5 text-purple-600" />
                      )}
                      {item.type === "document" && (
                        <FileText className="h-5 w-5 text-gray-600" />
                      )}
                      {item.type === "lti" && (
                        <Zap className="h-5 w-5 text-orange-600" />
                      )}
                      <Badge
                        variant={
                          item.status === "published" ? "default" : "secondary"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedContentId(item.id);
                          setContentView("view");
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedContentId(item.id);
                          setNewContentFormData({
                            type: item.type,
                            title: item.title,
                            description: item.description,
                            category: item.category,
                            tags: item.tags,
                            status: item.status,
                            file: null,
                            metadata: item.metadata || {},
                          });
                          setContentView("edit");
                        }}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteContent(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{item.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{item.category}</span>
                    <span>
                      {new Date(item.lastModified).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredContent.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No content found</h3>
                <p className="text-muted-foreground mb-4">
                  {contentSearchTerm || selectedContentType !== "all"
                    ? "Try adjusting your search or filters"
                    : "Get started by creating your first content item"}
                </p>
                <Button onClick={() => setContentView("create")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Content
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      );
    }

    // Create/Edit Content Form
    if (contentView === "create" || contentView === "edit") {
      return renderContentForm();
    }

    // Content Detail View
    if (contentView === "view") {
      return renderContentDetail();
    }

    return null;
  };

  // Main render function with tabs structure
  if (currentView === "create" || currentView === "edit") {
    return renderCourseForm();
  }

  if (currentView === "view") {
    return renderCourseView();
  }

  if (currentView === "manage") {
    return renderCourseManagement();
  }

  if (currentView === "content-view") {
    return renderContentViewPage();
  }

  // Main tabs view
  return (
    <div className="space-y-8">
      <div className="page-header flex-col items-center">
        <div className="flex mx-8 mt-5 w-full items-center gap-3">
          {canCreateCourse(user?.role) && (
            <Button onClick={openCreatePage}>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          )}

          {canCreateCourse(user?.role) && (
            <Button variant="outline" onClick={handleImportCourses}>
              <Upload className="h-4 w-4 mr-2" />
              Import Courses
            </Button>
          )}

          {canCreateCourse(user?.role) && (
            <Button variant="outline" onClick={handleExportCourses}>
              <Download className="h-4 w-4 mr-2" />
              Export Courses
            </Button>
          )}

          <Button variant="outline" onClick={handleTestCRUD}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Test CRUD
          </Button>

          <Button variant="outline" onClick={handleDownloadTemplate}>
            <FileText className="h-4 w-4 mr-2" />
            Template CSV
          </Button>

          <Button
            variant="outline"
            onClick={removeDuplicateCourses}
            className="text-blue-600 hover:text-blue-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Remove Duplicates
          </Button>

          {canCreateCourse(user?.role) && (
            <Button
              variant="outline"
              onClick={handleClearData}
              className="text-red-600 hover:text-red-700"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Clear Data
            </Button>
          )}
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
              <p className="text-sm font-medium text-green-600">
                Enrolled Students
              </p>
              <p className="text-3xl font-bold text-green-900">
                {stats.enrolled}
              </p>
              <p className="text-xs text-green-600">across all courses</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">
                Avg Completion
              </p>
              <p className="text-3xl font-bold text-purple-900">
                {stats.avgCompletion}%
              </p>
              <p className="text-xs text-purple-600">student progress</p>
            </div>
            <Trophy className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">
                Certificates
              </p>
              <p className="text-3xl font-bold text-yellow-900">
                {stats.certificatesIssued}
              </p>
              <p className="text-xs text-yellow-600">issued</p>
            </div>
            <Award className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>
      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="courses">Course Directory</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">{renderCourseList()}</TabsContent>

        <TabsContent value="content">{renderContentManagement()}</TabsContent>

        <TabsContent value="units">
          <Card>
            <CardHeader>
              <CardTitle>Units & Topics Management</CardTitle>
              <CardDescription>
                Create and organize course units and topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Units & Topics</h3>
                <p className="text-muted-foreground mb-4">
                  Select a course from the Course Directory to manage its units
                  and topics.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setActiveView("courses")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go to Course Directory
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Academic Analytics</CardTitle>
              <CardDescription>
                Course performance and academic insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">
                  Analytics Dashboard
                </h3>
                <p className="text-muted-foreground">
                  Comprehensive analytics and reporting for academic courses.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
