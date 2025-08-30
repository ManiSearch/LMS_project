import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, Calendar, Clock, Users, BookOpen, Plus, Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SessionPlan {
  session_plan_id: number;
  session_number: number;
  topic: string;
  teaching_aids: string;
  teaching_method: string;
  hours_allocated: number;
  assessment_activity: string;
  session_outcome: string;
}

interface LessonPlanUnit {
  lesson_plan_id: number;
  unit_number: number;
  unit_title: string;
  hours_allotted: number;
  learning_outcomes: string;
  teaching_method: string;
  assessment_method: string;
  reference_materials: string;
  session_plans: SessionPlan[];
}

interface Course {
  course_id: number;
  course_code: string;
  course_title: string;
  semester: number;
  academic_year: string;
  department: string;
  faculty_name: string;
  course_category: string;
  course_type: string;
  l_t_p: string;
  credits: number;
  periods_per_week: number;
  prerequisites: string;
  end_exam: string;
  reference_books: string[];
  lesson_plans: LessonPlanUnit[];
}

interface LessonPlan {
  id: string;
  title: string;
  code: string;
  subject: string;
  grade: string;
  teacher: string;
  duration: string;
  scheduledDate: string;
  learningObjectives: number;
  units: number;
  status: "Published" | "Draft" | "Under Review";
  category: string;
  type: string;
  credit: number;
  totalHours: number;
  course?: Course;
}

const digitalLogicDesignCourse: Course = {
  course_id: 1,
  course_code: "1052233110",
  course_title: "Digital Logic Design",
  semester: 3,
  academic_year: "2023-2024",
  department: "Computer Engineering",
  faculty_name: "Dr.Anjali",
  course_category: "Core",
  course_type: "Theory",
  l_t_p: "3-0-0",
  credits: 3,
  periods_per_week: 3,
  prerequisites: "Basic Electrical Engineering",
  end_exam: "Written",
  reference_books: [
    "M. Morris Mano, Digital Logic and Computer Design",
    "R.P. Jain, Modern Digital Electronics"
  ],
  lesson_plans: [
    {
      lesson_plan_id: 1,
      unit_number: 1,
      unit_title: "Number Systems and Boolean Algebra",
      hours_allotted: 8,
      learning_outcomes: "Understand number systems, conversions, Boolean algebra.",
      teaching_method: "Lecture + Problem Solving",
      assessment_method: "Quiz + Tutorial",
      reference_materials: "Textbook Chapters 1 & 2",
      session_plans: [
        { session_plan_id: 1, session_number: 1, topic: "Introduction to Number Systems", teaching_aids: "PPT, Blackboard", teaching_method: "Lecture", hours_allocated: 2, assessment_activity: "Quiz", session_outcome: "Identify and represent numbers in different systems" },
        { session_plan_id: 2, session_number: 2, topic: "Conversions between Number Systems", teaching_aids: "Examples, Blackboard", teaching_method: "Problem Solving", hours_allocated: 2, assessment_activity: "In-class problems", session_outcome: "Convert between binary, decimal, octal, and hexadecimal" },
        { session_plan_id: 3, session_number: 3, topic: "Binary Arithmetic", teaching_aids: "Worked Examples", teaching_method: "Lecture + Practice", hours_allocated: 2, assessment_activity: "Tutorial Sheet", session_outcome: "Perform binary addition, subtraction, multiplication, and division" },
        { session_plan_id: 4, session_number: 4, topic: "Boolean Algebra Basics", teaching_aids: "Chalk and Talk", teaching_method: "Lecture", hours_allocated: 2, assessment_activity: "Short Quiz", session_outcome: "Apply Boolean laws to simplify expressions" }
      ]
    },
    {
      lesson_plan_id: 2,
      unit_number: 2,
      unit_title: "Combinational Logic Circuits",
      hours_allotted: 10,
      learning_outcomes: "Design and analyze combinational logic circuits.",
      teaching_method: "Lecture + Chalk and Talk",
      assessment_method: "Tutorial + Assignment",
      reference_materials: "Textbook Chapter 3",
      session_plans: [
        { session_plan_id: 5, session_number: 5, topic: "Boolean Laws & Theorems", teaching_aids: "Board Work", teaching_method: "Lecture", hours_allocated: 2, assessment_activity: "Tutorial", session_outcome: "Simplify expressions using Boolean laws" },
        { session_plan_id: 6, session_number: 6, topic: "K-map Simplification", teaching_aids: "K-map Charts", teaching_method: "Problem Solving", hours_allocated: 2, assessment_activity: "Quiz", session_outcome: "Minimize logic functions using K-map" },
        { session_plan_id: 7, session_number: 7, topic: "Design of Half Adder and Full Adder", teaching_aids: "Logic Kits", teaching_method: "Lecture + Demo", hours_allocated: 2, assessment_activity: "Assignment", session_outcome: "Design and implement adders" },
        { session_plan_id: 8, session_number: 8, topic: "Design of Multiplexers and Demultiplexers", teaching_aids: "Simulation Tools", teaching_method: "Lecture + Lab", hours_allocated: 2, assessment_activity: "In-class problems", session_outcome: "Design and verify MUX/DEMUX" },
        { session_plan_id: 9, session_number: 9, topic: "Design of Encoders and Decoders", teaching_aids: "PPT + Kits", teaching_method: "Lecture + Lab", hours_allocated: 2, assessment_activity: "Quiz", session_outcome: "Design encoders and decoders" }
      ]
    },
    {
      lesson_plan_id: 3,
      unit_number: 3,
      unit_title: "Sequential Logic Circuits",
      hours_allotted: 10,
      learning_outcomes: "Understand flip-flops and design sequential circuits.",
      teaching_method: "Lecture + Tutorial",
      assessment_method: "Quiz + Assignment",
      reference_materials: "Textbook Chapter 4",
      session_plans: [
        { session_plan_id: 10, session_number: 10, topic: "SR, JK, D, T Flip-Flops", teaching_aids: "Flip-Flop Kits", teaching_method: "Lecture + Demo", hours_allocated: 2, assessment_activity: "Assignment", session_outcome: "Explain and use flip-flops" },
        { session_plan_id: 11, session_number: 11, topic: "Registers", teaching_aids: "Board + Kits", teaching_method: "Lecture + Lab", hours_allocated: 2, assessment_activity: "Quiz", session_outcome: "Design and apply registers" },
        { session_plan_id: 12, session_number: 12, topic: "Counters", teaching_aids: "Simulation Tools", teaching_method: "Lecture + Lab", hours_allocated: 3, assessment_activity: "Tutorial", session_outcome: "Design and implement counters" },
        { session_plan_id: 13, session_number: 13, topic: "Shift Registers", teaching_aids: "Digital Kits", teaching_method: "Lecture + Demo", hours_allocated: 3, assessment_activity: "Quiz", session_outcome: "Design and apply shift registers" }
      ]
    },
    {
      lesson_plan_id: 4,
      unit_number: 4,
      unit_title: "Synchronous and Asynchronous Circuits",
      hours_allotted: 8,
      learning_outcomes: "Design synchronous and asynchronous sequential circuits.",
      teaching_method: "Lecture + Chalk and Talk",
      assessment_method: "Quiz + Tutorial",
      reference_materials: "Textbook Chapter 5",
      session_plans: [
        { session_plan_id: 14, session_number: 14, topic: "Synchronous Sequential Circuits", teaching_aids: "Board + Simulation", teaching_method: "Lecture", hours_allocated: 2, assessment_activity: "Tutorial", session_outcome: "Design synchronous sequential circuits" },
        { session_plan_id: 15, session_number: 15, topic: "Asynchronous Sequential Circuits", teaching_aids: "PPT + Simulation", teaching_method: "Lecture", hours_allocated: 3, assessment_activity: "Quiz", session_outcome: "Analyze asynchronous circuits" },
        { session_plan_id: 16, session_number: 16, topic: "Hazards and Races", teaching_aids: "Examples", teaching_method: "Lecture + Problem Solving", hours_allocated: 3, assessment_activity: "Assignment", session_outcome: "Identify hazards and race conditions in circuits" }
      ]
    },
    {
      lesson_plan_id: 5,
      unit_number: 5,
      unit_title: "Memory and Programmable Logic Devices",
      hours_allotted: 9,
      learning_outcomes: "Understand memory devices and PLDs.",
      teaching_method: "Lecture + Tutorial",
      assessment_method: "Assignment + Quiz",
      reference_materials: "Textbook Chapter 6",
      session_plans: [
        { session_plan_id: 17, session_number: 17, topic: "ROM, RAM", teaching_aids: "Memory Kits", teaching_method: "Lecture + Demo", hours_allocated: 3, assessment_activity: "Quiz", session_outcome: "Differentiate ROM and RAM" },
        { session_plan_id: 18, session_number: 18, topic: "PLDs (PLA, PAL, FPGA)", teaching_aids: "PPT + Simulation", teaching_method: "Lecture", hours_allocated: 3, assessment_activity: "Assignment", session_outcome: "Explain PLDs and applications" },
        { session_plan_id: 19, session_number: 19, topic: "Design Examples with PLDs", teaching_aids: "Simulation Software", teaching_method: "Lecture + Lab", hours_allocated: 3, assessment_activity: "Problem Solving", session_outcome: "Design circuits using PLDs" }
      ]
    }
  ]
};

const cProgrammingCourse: Course = {
  course_id: 2,
  course_code: "1052233440",
  course_title: "C Programming",
  semester: 3,
  academic_year: "2023-2024",
  department: "Computer Engineering",
  faculty_name: "Dr. Ramesh",
  course_category: "Core",
  course_type: "Theory + Lab",
  l_t_p: "3-0-2",
  credits: 4,
  periods_per_week: 5,
  prerequisites: "Basic Knowledge of Programming Concepts",
  end_exam: "Written + Lab Evaluation",
  reference_books: [
    "E. Balagurusamy, Programming in ANSI C",
    "Kernighan & Ritchie, The C Programming Language",
    "Yashavant Kanetkar, Let Us C"
  ],
  lesson_plans: [
    {
      lesson_plan_id: 1,
      unit_number: 1,
      unit_title: "Introduction to C Programming",
      hours_allotted: 8,
      learning_outcomes: "Understand structure of C programs, data types, operators, and expressions.",
      teaching_method: "Lecture + Demo",
      assessment_method: "Quiz + Assignment",
      reference_materials: "Textbook Chapters 1 & 2",
      session_plans: [
        { session_plan_id: 1, session_number: 1, topic: "Overview of C Programming Language", teaching_aids: "PPT, Blackboard", teaching_method: "Lecture", hours_allocated: 2, assessment_activity: "Quiz", session_outcome: "Explain C language history, features, and applications" },
        { session_plan_id: 2, session_number: 2, topic: "C Program Structure and Compilation", teaching_aids: "IDE, Demo Programs", teaching_method: "Lecture + Lab Demo", hours_allocated: 2, assessment_activity: "In-class Problem Solving", session_outcome: "Write and execute simple C programs" },
        { session_plan_id: 3, session_number: 3, topic: "Data Types, Constants, and Variables", teaching_aids: "Code Examples", teaching_method: "Lecture + Practice", hours_allocated: 2, assessment_activity: "Assignment", session_outcome: "Use variables, constants, and data types effectively in programs" },
        { session_plan_id: 4, session_number: 4, topic: "Operators and Expressions", teaching_aids: "Examples, Blackboard", teaching_method: "Lecture + Practice", hours_allocated: 2, assessment_activity: "Quiz", session_outcome: "Apply arithmetic, logical, and relational operators" }
      ]
    },
    {
      lesson_plan_id: 2,
      unit_number: 2,
      unit_title: "Control Structures and Functions",
      hours_allotted: 10,
      learning_outcomes: "Apply decision-making, looping constructs, and functions in C.",
      teaching_method: "Lecture + Lab Practice",
      assessment_method: "Quiz + Assignment",
      reference_materials: "Textbook Chapter 3 & 4",
      session_plans: [
        { session_plan_id: 5, session_number: 5, topic: "Decision Making (if, switch)", teaching_aids: "Examples + IDE", teaching_method: "Lecture + Demo", hours_allocated: 3, assessment_activity: "Assignment", session_outcome: "Use decision-making statements effectively" },
        { session_plan_id: 6, session_number: 6, topic: "Looping Constructs (for, while, do-while)", teaching_aids: "Code Examples", teaching_method: "Lecture + Practice", hours_allocated: 3, assessment_activity: "Quiz", session_outcome: "Implement iterative solutions using loops" },
        { session_plan_id: 7, session_number: 7, topic: "User-defined Functions", teaching_aids: "Blackboard, IDE", teaching_method: "Lecture + Lab", hours_allocated: 2, assessment_activity: "In-class problems", session_outcome: "Define and call functions with parameters and return values" },
        { session_plan_id: 8, session_number: 8, topic: "Recursion in Functions", teaching_aids: "Examples, PPT", teaching_method: "Lecture + Problem Solving", hours_allocated: 2, assessment_activity: "Assignment", session_outcome: "Apply recursion in solving problems" }
      ]
    },
    {
      lesson_plan_id: 3,
      unit_number: 3,
      unit_title: "Arrays and Functions",
      hours_allotted: 15,
      learning_outcomes: "Use arrays and functions to solve computational problems.",
      teaching_method: "Lecture + Hands-on Practice",
      assessment_method: "Tutorials + Assignments",
      reference_materials: "Unit III syllabus",
      session_plans: [
        { session_plan_id: 9, session_number: 9, topic: "1D Arrays: Declaration, Traversal, Sum, Average", teaching_aids: "Board + IDE", teaching_method: "Practice + Walkthrough", hours_allocated: 4, assessment_activity: "Coding Tasks", session_outcome: "Process data using 1D arrays" },
        { session_plan_id: 10, session_number: 10, topic: "2D Arrays & Matrix Operations", teaching_aids: "Matrix Examples, IDE", teaching_method: "Live Coding + Group Activity", hours_allocated: 4, assessment_activity: "Assignment", session_outcome: "Perform operations on 2D arrays" },
        { session_plan_id: 11, session_number: 11, topic: "User-Defined Functions (Call by Value/Reference)", teaching_aids: "IDE, Flowcharts", teaching_method: "Lecture + Demo", hours_allocated: 4, assessment_activity: "Coding Problems", session_outcome: "Implement modular code with functions" },
        { session_plan_id: 12, session_number: 12, topic: "Recursion (Factorial, Fibonacci, Array Operations)", teaching_aids: "IDE, Trace Tables", teaching_method: "Guided Coding", hours_allocated: 3, assessment_activity: "Tutorial + Quiz", session_outcome: "Solve problems using recursion" }
      ]
    },
    {
      lesson_plan_id: 4,
      unit_number: 4,
      unit_title: "Strings and Pointers",
      hours_allotted: 15,
      learning_outcomes: "Apply string functions and pointers for problem solving.",
      teaching_method: "Lecture + Demo + Practice",
      assessment_method: "Assignments + Peer Debugging",
      reference_materials: "Unit IV syllabus",
      session_plans: [
        { session_plan_id: 13, session_number: 13, topic: "String Basics & Functions (strlen, strcpy, strcat, strcmp)", teaching_aids: "IDE", teaching_method: "Demo + Practice", hours_allocated: 4, assessment_activity: "Lab Exercises", session_outcome: "Use string functions effectively" },
        { session_plan_id: 14, session_number: 14, topic: "String Manipulation using Pointers", teaching_aids: "IDE, Examples", teaching_method: "Hands-on + Debugging", hours_allocated: 4, assessment_activity: "Coding Task", session_outcome: "Manipulate strings using pointer logic" },
        { session_plan_id: 15, session_number: 15, topic: "Pointer Basics, Arithmetic, Array Traversal", teaching_aids: "IDE", teaching_method: "Practice + Debugging", hours_allocated: 4, assessment_activity: "Tutorial", session_outcome: "Apply pointer arithmetic in array/string processing" },
        { session_plan_id: 16, session_number: 16, topic: "Dynamic Memory Allocation (malloc, free) + Mini Project", teaching_aids: "IDE, Projects", teaching_method: "Project Based + Team Activity", hours_allocated: 3, assessment_activity: "Mini Project", session_outcome: "Implement dynamic memory allocation in applications" }
      ]
    },
    {
      lesson_plan_id: 5,
      unit_number: 5,
      unit_title: "Structures and File Management",
      hours_allotted: 15,
      learning_outcomes: "Use structures, unions, and file handling for real-world applications.",
      teaching_method: "Lecture + Hands-on + Project",
      assessment_method: "Assignments + Mini Project",
      reference_materials: "Unit V syllabus",
      session_plans: [
        { session_plan_id: 17, session_number: 17, topic: "Structures in C (Nested, Arrays of Structures)", teaching_aids: "IDE", teaching_method: "Lecture + Practice", hours_allocated: 4, assessment_activity: "Lab Tasks", session_outcome: "Apply structures for compound data modeling" },
        { session_plan_id: 18, session_number: 18, topic: "Unions, Typedef, Constants", teaching_aids: "IDE + Examples", teaching_method: "Demo + Practice", hours_allocated: 4, assessment_activity: "Assignment", session_outcome: "Differentiate between structures and unions; apply typedef" },
        { session_plan_id: 19, session_number: 19, topic: "File Handling (I/O, Text/Binary, Error Handling)", teaching_aids: "IDE, Sample Files", teaching_method: "Live Coding + Debugging", hours_allocated: 4, assessment_activity: "Lab Exercises", session_outcome: "Develop file handling programs for persistence" },
        { session_plan_id: 20, session_number: 20, topic: "Mini Projects (Report Generator, Payroll, Library, Inventory)", teaching_aids: "IDE + Project Files", teaching_method: "Project Based Learning", hours_allocated: 3, assessment_activity: "Mini Project Evaluation", session_outcome: "Integrate structures and file handling into applications" }
      ]
    },
    
  ]
};

const electronicDevicesAndCircuitsCourse: Course = {
  course_id: 3,
  course_code: "1040233110",
  course_title: "Electronic Devices and Circuits",
  semester: 3,
  academic_year: "2023-2024",
  department: "Electronics and Communication Engineering",
  faculty_name: "To be Assigned",
  course_category: "Core",
  course_type: "Theory",
  l_t_p: "3-0-0",
  credits: 3,
  periods_per_week: 3,
  prerequisites: "Basic Electrical Engineering",
  end_exam: "Written",
  reference_books: [
    "J. Millman, C.C. Halkias, Electronic Devices and Circuits",
    "Robert L. Boylestad, Louis Nashelsky, Electronic Devices and Circuit Theory"
  ],
  lesson_plans: [
    // ---------------- UNIT I ----------------
    {
      lesson_plan_id: 1,
      unit_number: 1,
      unit_title: "Diode Circuits",
      hours_allotted: 12,
      learning_outcomes: "Analyze rectifiers, clippers, clampers, and optoelectronic devices.",
      teaching_method: "Lecture + PPT + Group Discussion",
      assessment_method: "Quiz + Debate + Assignment",
      reference_materials: "Unit I syllabus",
      session_plans: [
        { session_plan_id: 1, session_number: 1, topic: "Half Wave Rectifier – Definition", teaching_aids: "PPT, Charts", teaching_method: "Lecture + Group Interaction", hours_allocated: 1, assessment_activity: "Quiz", session_outcome: "Analyze the need and function of rectifiers" },
        { session_plan_id: 2, session_number: 2, topic: "Half Wave Rectifier – Operation", teaching_aids: "PPT, Animation Video", teaching_method: "Lecture + Problem Solving", hours_allocated: 1, assessment_activity: "Cause and Effect Chart", session_outcome: "Construct and analyze HWR circuit" },
        { session_plan_id: 3, session_number: 3, topic: "Full Wave Rectifier – Definition & Operation", teaching_aids: "PPT, Group Discussion", teaching_method: "Flipped Class + Debate", hours_allocated: 1, assessment_activity: "Mini Debate", session_outcome: "Compare HWR vs FWR" },
        { session_plan_id: 4, session_number: 4, topic: "Bridge Rectifier – Definition & Operation", teaching_aids: "PPT, Animation Video", teaching_method: "Lecture + Problem Solving", hours_allocated: 1, assessment_activity: "Quiz", session_outcome: "Construct and analyze Bridge Rectifier" },
        { session_plan_id: 5, session_number: 5, topic: "Positive Clipper", teaching_aids: "PPT, Animation Video", teaching_method: "Lecture + Brainstorming", hours_allocated: 1, assessment_activity: "Case Study", session_outcome: "Construct and analyze Positive Clipper" },
        { session_plan_id: 6, session_number: 6, topic: "Negative Clipper", teaching_aids: "PPT, Animation Video", teaching_method: "Flipped Class + Role Play", hours_allocated: 1, assessment_activity: "Quiz", session_outcome: "Distinguish Positive vs Negative Clipper" },
        { session_plan_id: 7, session_number: 7, topic: "Biased Clipper", teaching_aids: "PPT, Simulation", teaching_method: "Case Study + Demo", hours_allocated: 1, assessment_activity: "Simulation Comparison", session_outcome: "Analyze biased vs unbiased clippers" },
        { session_plan_id: 8, session_number: 8, topic: "Positive Clamper", teaching_aids: "PPT, Photo Frame Analogy", teaching_method: "Lecture + Demo", hours_allocated: 1, assessment_activity: "Quiz", session_outcome: "Construct and analyze Positive Clamper" },
        { session_plan_id: 9, session_number: 9, topic: "Negative Clamper", teaching_aids: "PPT, Animation Video", teaching_method: "Flipped Class + Discussion", hours_allocated: 1, assessment_activity: "Quiz", session_outcome: "Construct and analyze Negative Clamper" },
        { session_plan_id: 10, session_number: 10, topic: "LED – Definition, Symbol, Working", teaching_aids: "PPT, LED Demo", teaching_method: "Lecture + Show-and-Tell", hours_allocated: 1, assessment_activity: "KWL Chart", session_outcome: "Construct LED circuit and applications" },
        { session_plan_id: 11, session_number: 11, topic: "LED – Characteristics & Applications", teaching_aids: "Demo + Pictures", teaching_method: "Lecture + Activity", hours_allocated: 1, assessment_activity: "Show-and-Tell", session_outcome: "Analyze LED characteristics and uses" },
        { session_plan_id: 12, session_number: 12, topic: "Photo-Diode – Definition, Symbol, Working", teaching_aids: "PPT, Devices", teaching_method: "Lecture + Demo", hours_allocated: 1, assessment_activity: "Tech Detective Activity", session_outcome: "Construct Photo-Diode circuit & applications" }
      ]
    },
    // ---------------- UNIT II ----------------
    {
      lesson_plan_id: 2,
      unit_number: 2,
      unit_title: "Bipolar Junction Transistor",
      hours_allotted: 12,
      learning_outcomes: "Understand BJT operation, configurations, and biasing techniques.",
      teaching_method: "Lecture + PPT + Group Interaction",
      assessment_method: "Quiz + Assignment",
      reference_materials: "Unit II syllabus",
      session_plans: [
        { session_plan_id: 13, session_number: 13, topic: "NPN Transistor – Construction & Working", teaching_aids: "PPT, Symbols", teaching_method: "Lecture + Sketching", hours_allocated: 1, assessment_activity: "Draw & Pass", session_outcome: "Analyze NPN transistor operation" },
        { session_plan_id: 14, session_number: 14, topic: "BJT Modes – Active, Saturation, Cutoff", teaching_aids: "PPT, Animation", teaching_method: "Lecture + Quiz", hours_allocated: 1, assessment_activity: "Exit Ticket", session_outcome: "Identify transistor operating modes" },
        { session_plan_id: 15, session_number: 15, topic: "PNP Transistor – Construction & Working", teaching_aids: "PPT, Seminar", teaching_method: "Lecture + Debate", hours_allocated: 1, assessment_activity: "Seminar", session_outcome: "Analyze PNP transistor operation" },
        { session_plan_id: 16, session_number: 16, topic: "CE Configuration", teaching_aids: "PPT", teaching_method: "Lecture + Circuit Completion", hours_allocated: 1, assessment_activity: "Problem Solving", session_outcome: "Construct CE circuit" },
        { session_plan_id: 17, session_number: 17, topic: "CE Configuration I/O Characteristics", teaching_aids: "PPT, Group Activity", teaching_method: "Lecture + Graph Plotting", hours_allocated: 1, assessment_activity: "Graph Plotting", session_outcome: "Sketch CE characteristics" },
        { session_plan_id: 18, session_number: 18, topic: "CB Configuration & Characteristics", teaching_aids: "PPT", teaching_method: "Lecture + Graph Plotting", hours_allocated: 2, assessment_activity: "Quiz", session_outcome: "Sketch CB characteristics" },
        { session_plan_id: 19, session_number: 19, topic: "CC Configuration & Characteristics", teaching_aids: "PPT, Group Activity", teaching_method: "Lecture + Graph Plotting", hours_allocated: 2, assessment_activity: "Problem Solving", session_outcome: "Sketch CC characteristics" },
        { session_plan_id: 20, session_number: 20, topic: "Transistor Biasing – Need & Stability Factor", teaching_aids: "PPT", teaching_method: "Lecture + Socratic Method", hours_allocated: 1, assessment_activity: "Quiz", session_outcome: "Analyze transistor biasing need" },
        { session_plan_id: 21, session_number: 21, topic: "Biasing Types – Fixed Bias", teaching_aids: "PPT, Group Interaction", teaching_method: "Lecture", hours_allocated: 1, assessment_activity: "Exit Ticket", session_outcome: "Construct Fixed Bias circuit" },
        { session_plan_id: 22, session_number: 22, topic: "Collector-to-Base Bias", teaching_aids: "PPT, Group Activity", teaching_method: "Lecture", hours_allocated: 1, assessment_activity: "Problem Solving", session_outcome: "Construct Collector-to-Base Bias circuit" },
        { session_plan_id: 23, session_number: 23, topic: "Voltage Divider Bias", teaching_aids: "PPT, Group Activity", teaching_method: "Lecture", hours_allocated: 1, assessment_activity: "Quiz", session_outcome: "Construct Voltage Divider Bias circuit" }
      ]
    },
    // ---------------- UNIT III ----------------
    {
      lesson_plan_id: 3,
      unit_number: 3,
      unit_title: "Field Effect Transistors (FET)",
      hours_allotted: 10,
      learning_outcomes: "Explain JFET and MOSFET operation, characteristics and biasing.",
      teaching_method: "Lecture + PPT + Problem Solving",
      assessment_method: "Quiz + Assignment",
      reference_materials: "Unit III syllabus",
      session_plans: [
        { session_plan_id: 24, session_number: 24, topic: "JFET Construction and Operation", teaching_aids: "PPT, Diagram", teaching_method: "Lecture + Problem Solving", hours_allocated: 2, assessment_activity: "Quiz", session_outcome: "Explain JFET operation" },
        { session_plan_id: 25, session_number: 25, topic: "JFET Characteristics", teaching_aids: "Graph Sheets", teaching_method: "Lecture + Graph Plotting", hours_allocated: 2, assessment_activity: "Assignment", session_outcome: "Sketch JFET I-V characteristics" },
        { session_plan_id: 26, session_number: 26, topic: "MOSFET – Enhancement & Depletion Types", teaching_aids: "Charts + PPT", teaching_method: "Lecture + Demo", hours_allocated: 3, assessment_activity: "Quiz", session_outcome: "Differentiate enhancement vs depletion MOSFETs" },
        { session_plan_id: 27, session_number: 27, topic: "MOSFET Characteristics", teaching_aids: "Graph Sheets", teaching_method: "Lecture + Graph Plotting", hours_allocated: 3, assessment_activity: "Assignment", session_outcome: "Sketch MOSFET I-V characteristics" }
      ]
    },
    // ---------------- UNIT IV ----------------
    {
      lesson_plan_id: 4,
      unit_number: 4,
      unit_title: "Amplifiers and Oscillators",
      hours_allotted: 10,
      learning_outcomes: "Analyze amplifier configurations, frequency response, and oscillator principles.",
      teaching_method: "Lecture + PPT + Simulation",
      assessment_method: "Quiz + Tutorial",
      reference_materials: "Unit IV syllabus",
      session_plans: [
        { session_plan_id: 28, session_number: 28, topic: "Small Signal Amplifiers – CE, CB, CC", teaching_aids: "Simulation Tools", teaching_method: "Lecture + Problem Solving", hours_allocated: 3, assessment_activity: "Assignment", session_outcome: "Analyze amplifier configurations" },
        { session_plan_id: 29, session_number: 29, topic: "Frequency Response of CE Amplifier", teaching_aids: "Graph Sheets + Tools", teaching_method: "Lecture + Simulation", hours_allocated: 3, assessment_activity: "Tutorial", session_outcome: "Sketch CE frequency response" },
        { session_plan_id: 30, session_number: 30, topic: "Oscillator Principles – RC, LC, Crystal", teaching_aids: "Charts + PPT", teaching_method: "Lecture + Group Activity", hours_allocated: 4, assessment_activity: "Quiz", session_outcome: "Explain working of different oscillators" }
      ]
    },
    // ---------------- UNIT V ----------------
    {
      lesson_plan_id: 5,
      unit_number: 5,
      unit_title: "UJT and Power Devices",
      hours_allotted: 8,
      learning_outcomes: "Understand UJT characteristics, SCR and TRIAC operation and applications.",
      teaching_method: "Lecture + PPT + Demo",
      assessment_method: "Quiz + Assignment",
      reference_materials: "Unit V syllabus",
      session_plans: [
        { session_plan_id: 31, session_number: 31, topic: "UJT Construction and Characteristics", teaching_aids: "PPT + Device Kits", teaching_method: "Lecture + Demo", hours_allocated: 3, assessment_activity: "Graph Plotting", session_outcome: "Explain UJT operation & characteristics" },
        { session_plan_id: 32, session_number: 32, topic: "SCR Operation and Applications", teaching_aids: "PPT + Kits", teaching_method: "Lecture + Problem Solving", hours_allocated: 3, assessment_activity: "Assignment", session_outcome: "Analyze SCR working and uses" },
        { session_plan_id: 33, session_number: 33, topic: "TRIAC Operation and Applications", teaching_aids: "PPT + Kits", teaching_method: "Lecture + Demo", hours_allocated: 2, assessment_activity: "Quiz", session_outcome: "Analyze TRIAC working and uses" }
      ]
    }
  ]
};

const eVehicleTechnologyCourse: Course = {
  course_id: 4,
  course_code: "1030235210",
  course_title: "Electric Vehicle Technology",
  semester: 3,
  academic_year: "2023-2024",
  department: "Electrical and Electronics Engineering",
  faculty_name: "To be Assigned",
  course_category: "Core",
  course_type: "Theory",
  l_t_p: "3-0-0",
  credits: 3,
  periods_per_week: 3,
  prerequisites: "Basic Electrical Engineering",
  end_exam: "Written",
  reference_books: [
    "James Larminie & John Lowry, Electric Vehicle Technology Explained",
    "Iqbal Husain, Electric and Hybrid Vehicles: Design Fundamentals",
    "Mehrdad Ehsani, Modern Electric, Hybrid Electric, and Fuel Cell Vehicles"
  ],
  lesson_plans: [
    {
      lesson_plan_id: 1,
      unit_number: 1,
      unit_title: "Introduction to Electric Vehicle",
      hours_allotted: 8,
      learning_outcomes: "Evaluate environmental impact of conventional vehicles, compare EV types, analyze energy sources.",
      teaching_method: "Lecture + Debate + Video + Group Discussion",
      assessment_method: "Quiz + Debate + Assignment",
      reference_materials: "Unit I syllabus",
      session_plans: [
        { session_plan_id: 1, session_number: 1, topic: "Environmental Impact of Conventional Vehicle", teaching_aids: "Debate, Charts", teaching_method: "Lecture + Debate", hours_allocated: 1, assessment_activity: "Quiz", session_outcome: "Explain pollution impact of conventional vehicles" },
        { session_plan_id: 2, session_number: 2, topic: "History of EV & HEV", teaching_aids: "Timeline, Storytelling", teaching_method: "Interactive Lecture", hours_allocated: 1, assessment_activity: "Discussion", session_outcome: "Relate historical EV innovations to modern EVs" },
        { session_plan_id: 3, session_number: 3, topic: "Components of Conventional Vehicle", teaching_aids: "Pictures, Diagrams", teaching_method: "Video + Map Activity", hours_allocated: 1, assessment_activity: "Assignment", session_outcome: "Identify pollution-causing components" },
        { session_plan_id: 4, session_number: 4, topic: "Compare Conventional Vehicle with EV, Types of EV", teaching_aids: "Charts, Discussion", teaching_method: "Group Discussion", hours_allocated: 3, assessment_activity: "Case Study", session_outcome: "Assess efficiency of EV types" },
        { session_plan_id: 5, session_number: 5, topic: "Alternative Energy Sources", teaching_aids: "Solar Panel Demo", teaching_method: "Video + Demonstration", hours_allocated: 2, assessment_activity: "Lab Measurement", session_outcome: "Analyze renewable sources and measure parameters" }
      ]
    },
    {
      lesson_plan_id: 2,
      unit_number: 2,
      unit_title: "Electric Vehicle Motors",
      hours_allotted: 10,
      learning_outcomes: "Understand EV motor types, control strategies, and selection criteria.",
      teaching_method: "Lecture + Video + Case Study",
      assessment_method: "Assignment + Problem Solving",
      reference_materials: "Unit II syllabus",
      session_plans: [
        { session_plan_id: 6, session_number: 6, topic: "BLDC Commutation", teaching_aids: "Animated Video", teaching_method: "Lecture + Demo", hours_allocated: 1, assessment_activity: "Diagram Drawing", session_outcome: "Draw commutation sequence" },
        { session_plan_id: 7, session_number: 7, topic: "Motor Selection", teaching_aids: "Case Study", teaching_method: "Lecture + Activity", hours_allocated: 2, assessment_activity: "Comparison Tree", session_outcome: "Select motors for applications" },
        { session_plan_id: 8, session_number: 8, topic: "DC Motor Types, Induction Motor Control", teaching_aids: "Video, Discussion", teaching_method: "Lecture + Lab", hours_allocated: 2, assessment_activity: "Quiz", session_outcome: "Compare speed control methods" },
        { session_plan_id: 9, session_number: 9, topic: "Series & Parallel HEDT", teaching_aids: "Charts, Lecture", teaching_method: "Comparison + Lecture", hours_allocated: 3, assessment_activity: "Tabulation", session_outcome: "Model power flow and compare couplings" },
        { session_plan_id: 10, session_number: 10, topic: "SRM Motor", teaching_aids: "Circuit Diagrams", teaching_method: "Lecture + Demo", hours_allocated: 2, assessment_activity: "Rotor Position Drawing", session_outcome: "Analyze rotor position vs pulses" }
      ]
    },
    {
      lesson_plan_id: 3,
      unit_number: 3,
      unit_title: "Electronics and Sensor-less Control in EV",
      hours_allotted: 8,
      learning_outcomes: "Analyze power devices, converters, and sensor-less control methods in EVs.",
      teaching_method: "Lecture + PPT + Lab",
      assessment_method: "Quiz + Assignment",
      reference_materials: "Unit III syllabus",
      session_plans: [
        { session_plan_id: 11, session_number: 11, topic: "Power Devices & Switching", teaching_aids: "PPT, IV Curve Charts", teaching_method: "Lecture + Graph Analysis", hours_allocated: 2, assessment_activity: "Plotting Graphs", session_outcome: "Compare conduction and switching characteristics" },
        { session_plan_id: 12, session_number: 12, topic: "Converters & Inverters", teaching_aids: "Animated PPT, Oscilloscope", teaching_method: "Lecture + Demo", hours_allocated: 2, assessment_activity: "Waveform Drawing", session_outcome: "Map PWM signals to output waveforms" },
        { session_plan_id: 13, session_number: 13, topic: "HV Safety & Hazards", teaching_aids: "Lecture Notes", teaching_method: "Lecture", hours_allocated: 1, assessment_activity: "Hazard Table", session_outcome: "Evaluate risk mitigation strategies" },
        { session_plan_id: 14, session_number: 14, topic: "Autonomous EV Sensors", teaching_aids: "PPT", teaching_method: "Lecture + Discussion", hours_allocated: 1, assessment_activity: "Performance Plot", session_outcome: "Evaluate EV sensors in self-driving" },
        { session_plan_id: 15, session_number: 15, topic: "Sensorless Control Methods", teaching_aids: "PPT + Charts", teaching_method: "Lecture + Problem Solving", hours_allocated: 2, assessment_activity: "Calculation + Graph", session_outcome: "Predict rotor position and calculate frequency" }
      ]
    },
    {
      lesson_plan_id: 4,
      unit_number: 4,
      unit_title: "Hybrid Vehicles",
      hours_allotted: 8,
      learning_outcomes: "Classify HEVs, analyze architectures, regenerative braking, and NVH issues.",
      teaching_method: "Lecture + Case Studies + Charts",
      assessment_method: "Quiz + Assignment",
      reference_materials: "Unit IV syllabus",
      session_plans: [
        { session_plan_id: 16, session_number: 16, topic: "Propulsion Components", teaching_aids: "Spec Sheets", teaching_method: "Lecture + Demo", hours_allocated: 1, assessment_activity: "Labeling Task", session_outcome: "Map components to energy paths" },
        { session_plan_id: 17, session_number: 17, topic: "HEV Classification", teaching_aids: "Charts, PPT", teaching_method: "Lecture + Group Task", hours_allocated: 2, assessment_activity: "Comparison Table", session_outcome: "Differentiate HEV types" },
        { session_plan_id: 18, session_number: 18, topic: "HEV Architectures", teaching_aids: "PPT, Diagrams", teaching_method: "Lecture + Problem Solving", hours_allocated: 2, assessment_activity: "Diagram Drawing", session_outcome: "Analyze HEV architectures" },
        { session_plan_id: 19, session_number: 19, topic: "Regenerative Braking", teaching_aids: "Equations + Lecture", teaching_method: "Lecture + Problem Solving", hours_allocated: 1, assessment_activity: "Graph Plotting", session_outcome: "Calculate energy recovery" },
        { session_plan_id: 20, session_number: 20, topic: "HEV System Analysis & Control", teaching_aids: "Flowcharts, State Machines", teaching_method: "Lecture + Simulation", hours_allocated: 2, assessment_activity: "Mode Transition Table", session_outcome: "Evaluate mode transitions & power split logic" }
      ]
    },
    {
      lesson_plan_id: 5,
      unit_number: 5,
      unit_title: "Fuel Cells for Electric Vehicles",
      hours_allotted: 9,
      learning_outcomes: "Understand fuel cell basics, operation, I-V characteristics, efficiency, and cost factors.",
      teaching_method: "Lecture + PPT + Demonstration",
      assessment_method: "Assignment + Quiz",
      reference_materials: "Unit V syllabus",
      session_plans: [
        { session_plan_id: 21, session_number: 21, topic: "Fuel Cell Basics & Operation", teaching_aids: "Video + Equations", teaching_method: "Lecture + Demo", hours_allocated: 2, assessment_activity: "Comparison Table", session_outcome: "Compare PEM, SOFC, DMFC technologies" },
        { session_plan_id: 22, session_number: 22, topic: "I-V Characteristics", teaching_aids: "Graphs + Datasheets", teaching_method: "Lecture + Problem Solving", hours_allocated: 2, assessment_activity: "Graph Plotting", session_outcome: "Analyze I-V curves of fuel cells" },
        { session_plan_id: 23, session_number: 23, topic: "Fuel Consumption", teaching_aids: "PPT + Formulas", teaching_method: "Lecture", hours_allocated: 1, assessment_activity: "Tabulation", session_outcome: "Calculate H₂ usage per km" },
        { session_plan_id: 24, session_number: 24, topic: "Efficiency Factors", teaching_aids: "Pie Charts", teaching_method: "Lecture + Discussion", hours_allocated: 1, assessment_activity: "Diagram Drawing", session_outcome: "Evaluate activation and ohmic losses" },
        { session_plan_id: 25, session_number: 25, topic: "Power System Design", teaching_aids: "Vehicle Specs", teaching_method: "Lecture + Problem Solving", hours_allocated: 2, assessment_activity: "Calculation", session_outcome: "Size fuel cell stack for EV" },
        { session_plan_id: 26, session_number: 26, topic: "Lifetime Cost Analysis", teaching_aids: "Cost Breakdown Charts", teaching_method: "Lecture + Activity", hours_allocated: 1, assessment_activity: "Cost Matrix", session_outcome: "Compare TCO of EVs with fuel cells" }
      ]
    }
  ]
};

const lessonPlans: LessonPlan[] = [
  {
    id: "1",
    title: digitalLogicDesignCourse.course_title,
    code: digitalLogicDesignCourse.course_code,
    subject: digitalLogicDesignCourse.department,
    grade: `Semester ${digitalLogicDesignCourse.semester}`,
    teacher: digitalLogicDesignCourse.faculty_name,
    duration: `${digitalLogicDesignCourse.lesson_plans.reduce((total, unit) => total + unit.hours_allotted, 0)} hours`,
    scheduledDate: "2024-01-15",
    learningObjectives: digitalLogicDesignCourse.lesson_plans.reduce((total, unit) => total + unit.session_plans.length, 0),
    units: digitalLogicDesignCourse.lesson_plans.length,
    status: "Published",
    category: digitalLogicDesignCourse.course_category,
    type: digitalLogicDesignCourse.course_type,
    credit: digitalLogicDesignCourse.credits,
    totalHours: digitalLogicDesignCourse.lesson_plans.reduce((total, unit) => total + unit.hours_allotted, 0),
    course: digitalLogicDesignCourse
  },
  {
    id: "2",
    title: cProgrammingCourse.course_title,
    code: cProgrammingCourse.course_code,
    subject: cProgrammingCourse.department,
    grade: `Semester ${cProgrammingCourse.semester}`,
    teacher: cProgrammingCourse.faculty_name,
    duration: `${cProgrammingCourse.lesson_plans.reduce((total, unit) => total + unit.hours_allotted, 0)} hours`,
    scheduledDate: "2024-01-20",
    learningObjectives: cProgrammingCourse.lesson_plans.reduce((total, unit) => total + unit.session_plans.length, 0),
    units: cProgrammingCourse.lesson_plans.length,
    status: "Published",
    category: cProgrammingCourse.course_category,
    type: cProgrammingCourse.course_type,
    credit: cProgrammingCourse.credits,
    totalHours: cProgrammingCourse.lesson_plans.reduce((total, unit) => total + unit.hours_allotted, 0),
    course: cProgrammingCourse
  },
  {
    id: "3",
    title: electronicDevicesAndCircuitsCourse.course_title,
    code: electronicDevicesAndCircuitsCourse.course_code,
    subject: electronicDevicesAndCircuitsCourse.department,
    grade: `Semester ${electronicDevicesAndCircuitsCourse.semester}`,
    teacher: electronicDevicesAndCircuitsCourse.faculty_name,
    duration: `${electronicDevicesAndCircuitsCourse.lesson_plans.reduce((total, unit) => total + unit.hours_allotted, 0)} hours`,
    scheduledDate: "2024-01-25",
    learningObjectives: electronicDevicesAndCircuitsCourse.lesson_plans.reduce((total, unit) => total + unit.session_plans.length, 0),
    units: electronicDevicesAndCircuitsCourse.lesson_plans.length,
    status: "Published",
    category: electronicDevicesAndCircuitsCourse.course_category,
    type: electronicDevicesAndCircuitsCourse.course_type,
    credit: electronicDevicesAndCircuitsCourse.credits,
    totalHours: electronicDevicesAndCircuitsCourse.lesson_plans.reduce((total, unit) => total + unit.hours_allotted, 0),
    course: electronicDevicesAndCircuitsCourse
  },
  {
    id: "4",
    title: eVehicleTechnologyCourse.course_title,
    code: eVehicleTechnologyCourse.course_code,
    subject: eVehicleTechnologyCourse.department,
    grade: `Semester ${eVehicleTechnologyCourse.semester}`,
    teacher: eVehicleTechnologyCourse.faculty_name,
    duration: `${eVehicleTechnologyCourse.lesson_plans.reduce((total, unit) => total + unit.hours_allotted, 0)} hours`,
    scheduledDate: "2024-01-30",
    learningObjectives: eVehicleTechnologyCourse.lesson_plans.reduce((total, unit) => total + unit.session_plans.length, 0),
    units: eVehicleTechnologyCourse.lesson_plans.length,
    status: "Published",
    category: eVehicleTechnologyCourse.course_category,
    type: eVehicleTechnologyCourse.course_type,
    credit: eVehicleTechnologyCourse.credits,
    totalHours: eVehicleTechnologyCourse.lesson_plans.reduce((total, unit) => total + unit.hours_allotted, 0),
    course: eVehicleTechnologyCourse
  }
];

export default function Index() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const {user} = useAuth()

  const stats = [
    {
      title: "Total Lessons",
      value: lessonPlans.length.toString(),
      icon: BookOpen,
      color: "bg-blue-500"
    },
    {
      title: "Published",
      value: "100%",
      subtitle: "completion rate",
      icon: Users,
      color: "bg-green-500"
    },
    {
      title: "This Week",
      value: "2",
      subtitle: "Scheduled lessons",
      icon: Calendar,
      color: "bg-orange-500"
    },
    {
      title: "Avg Duration",
      value: Math.round(lessonPlans.reduce((acc, plan) => acc + plan.totalHours, 0) / lessonPlans.length).toString(),
      subtitle: "Hours per lesson",
      icon: Clock,
      color: "bg-purple-500"
    }
  ];

  const filteredPlans = lessonPlans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || plan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lesson Plans</h1>
              <p className="text-gray-600 mt-1">Create, manage, and track detailed lesson plans for all subjects and grades.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    {stat.subtitle && (
                      <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Lesson Plans Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-semibold">Recent Lesson Plans</CardTitle>
                <p className="text-gray-600 text-sm mt-1">View and manage all lesson plans with detailed planning information</p>
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by course code, title, subject, or teacher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-gray-900">Lesson Title</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-900">Subject & Grade</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-900">Teacher</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-900">Duration</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-900">Scheduled Date</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-900">Learning Objectives</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-900">Units</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlans.map((plan) => (
                    <tr key={plan.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-2">
                        <Link to={`/lms/lesson/${plan.id}`} className="font-medium text-blue-600 hover:text-blue-800">
                          {plan.title}
                        </Link>
                        <div className="text-sm text-gray-500">Code: {plan.code}</div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="font-medium">{plan.subject}</div>
                        <div className="text-sm text-gray-500">{plan.grade}</div>
                      </td>
                      <td className="py-4 px-2 text-gray-900">{plan.teacher}</td>
                      <td className="py-4 px-2 text-gray-900">{plan.duration}</td>
                      <td className="py-4 px-2 text-gray-900">{plan.scheduledDate}</td>
                      <td className="py-4 px-2">
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          {plan.learningObjectives}
                        </div>
                      </td>
                      <td className="py-4 px-2 text-gray-900">{plan.units}</td>
                      <td className="py-4 px-2">
                        <Badge 
                          variant={plan.status === "Published" ? "default" : plan.status === "Draft" ? "secondary" : "outline"}
                          className={plan.status === "Published" ? "bg-green-100 text-green-800" : ""}
                        >
                          {plan.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filteredPlans.map((plan) => (
                <Card key={plan.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Link to={`/lms/lesson/${plan.id}`} className="font-medium text-blue-600 hover:text-blue-800">
                      {plan.title}
                    </Link>
                    <Badge 
                      variant={plan.status === "Published" ? "default" : plan.status === "Draft" ? "secondary" : "outline"}
                      className={plan.status === "Published" ? "bg-green-100 text-green-800" : ""}
                    >
                      {plan.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Code: {plan.code}</div>
                    <div>Subject: {plan.subject} • {plan.grade}</div>
                    <div>Teacher: {plan.teacher}</div>
                    <div>Duration: {plan.duration}</div>
                    <div>Learning Objectives: {plan.learningObjectives} • Units: {plan.units}</div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredPlans.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No lesson plans found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
