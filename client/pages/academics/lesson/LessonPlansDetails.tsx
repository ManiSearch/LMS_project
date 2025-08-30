import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, User, BookOpen, Target, Download, Edit } from "lucide-react";
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
  video_links?: string[];
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

const digitalLogicDesignCourse: Course = {
  course_id: 1,
  course_code: "1052233110",
  course_title: "Digital Logic Design",
  semester: 3,
  academic_year: "2023-2024",
  department: "Electronics and Communication Engineering",
  faculty_name: "Dr. XYZ",
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
        {
          session_plan_id: 1,
          session_number: 1,
          topic: "Overview of C Programming Language",
          teaching_aids: "PPT, Blackboard",
          teaching_method: "Lecture",
          hours_allocated: 2,
          assessment_activity: "Quiz",
          session_outcome: "Explain C language history, features, and applications"
        },
        {
          session_plan_id: 2,
          session_number: 2,
          topic: "C Program Structure and Compilation",
          teaching_aids: "IDE, Demo Programs",
          teaching_method: "Lecture + Lab Demo",
          hours_allocated: 2,
          assessment_activity: "In-class Problem Solving",
          session_outcome: "Write and execute simple C programs"
        },
        {
          session_plan_id: 3,
          session_number: 3,
          topic: "Data Types, Constants, and Variables",
          teaching_aids: "Code Examples",
          teaching_method: "Lecture + Practice",
          hours_allocated: 2,
          assessment_activity: "Assignment",
          session_outcome: "Use variables, constants, and data types effectively in programs"
        },
        {
          session_plan_id: 4,
          session_number: 4,
          topic: "Operators and Expressions",
          teaching_aids: "Examples, Blackboard",
          teaching_method: "Lecture + Practice",
          hours_allocated: 2,
          assessment_activity: "Quiz",
          session_outcome: "Apply arithmetic, logical, and relational operators"
        }
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
        {
          session_plan_id: 5,
          session_number: 5,
          topic: "Decision Making (if, switch)",
          teaching_aids: "Examples + IDE",
          teaching_method: "Lecture + Demo",
          hours_allocated: 3,
          assessment_activity: "Assignment",
          session_outcome: "Use decision-making statements effectively"
        },
        {
          session_plan_id: 6,
          session_number: 6,
          topic: "Looping Constructs (for, while, do-while)",
          teaching_aids: "Code Examples",
          teaching_method: "Lecture + Practice",
          hours_allocated: 3,
          assessment_activity: "Quiz",
          session_outcome: "Implement iterative solutions using loops"
        },
        {
          session_plan_id: 7,
          session_number: 7,
          topic: "User-defined Functions",
          teaching_aids: "Blackboard, IDE",
          teaching_method: "Lecture + Lab",
          hours_allocated: 2,
          assessment_activity: "In-class problems",
          session_outcome: "Define and call functions with parameters and return values"
        },
        {
          session_plan_id: 8,
          session_number: 8,
          topic: "Recursion in Functions",
          teaching_aids: "Examples, PPT",
          teaching_method: "Lecture + Problem Solving",
          hours_allocated: 2,
          assessment_activity: "Assignment",
          session_outcome: "Apply recursion in solving problems"
        }
      ]
    }
  ]
};

const electronicDevicesCourse: Course = {
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

export default function LessonDetails() {
  const { id } = useParams();
  const {user} = useAuth()

  // Get the correct course based on the ID parameter
  const getCourseById = (courseId: string | undefined) => {
    switch (courseId) {
      case "1":
        return digitalLogicDesignCourse;
      case "2":
        return cProgrammingCourse;
      case "3":
        return electronicDevicesCourse;
      case "4":
        return eVehicleTechnologyCourse;
      default:
        return digitalLogicDesignCourse;
    }
  };

  const currentCourse = getCourseById(id);

  const getTotalHours = () => {
    return currentCourse.lesson_plans.reduce((total, unit) =>
      total + unit.hours_allotted, 0
    );
  };

  const getTotalSessions = () => {
    return currentCourse.lesson_plans.reduce((total, unit) => total + unit.session_plans.length, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link to="/academics/lesson">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Lesson Plans
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{currentCourse.course_title}</h1>
                <p className="text-gray-600 mt-1">Course Code: {currentCourse.course_code} • Semester {currentCourse.semester} • {currentCourse.academic_year}</p>
              </div>
            </div>
            {/* {user?.role ==='super-admin' || user?.role === 'admin' ? (
              <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit Plan
              </Button>
            </div>
            ):''} */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Category</p>
                  <p className="text-gray-900">{currentCourse.course_category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Type</p>
                  <p className="text-gray-900">{currentCourse.course_type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">L-T-P</p>
                  <p className="text-gray-900">{currentCourse.l_t_p}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Department</p>
                  <p className="text-gray-900">{currentCourse.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Credit</p>
                  <p className="text-gray-900">{currentCourse.credits}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">End Exam</p>
                  <p className="text-gray-900">{currentCourse.end_exam}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Faculty</p>
                  <p className="text-gray-900">{currentCourse.faculty_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Prerequisites</p>
                  <p className="text-gray-900">{currentCourse.prerequisites}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Periods/Week</p>
                  <p className="text-gray-900">{currentCourse.periods_per_week}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="text-sm text-gray-600">Total Units</span>
                </div>
                <span className="font-semibold">{currentCourse.lesson_plans.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-2 text-green-500" />
                  <span className="text-sm text-gray-600">Total Sessions</span>
                </div>
                <span className="font-semibold">{getTotalSessions()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-orange-500" />
                  <span className="text-sm text-gray-600">Total Hours</span>
                </div>
                <span className="font-semibold">{getTotalHours()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-purple-500" />
                  <span className="text-sm text-gray-600">Status</span>
                </div>
                <Badge className="bg-green-100 text-green-800">Published</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Units Overview Table */}
        <Card>
          <CardHeader>
            <CardTitle>Course Units Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Unit</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Title</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Hours</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Teaching Method</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Assessment</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Session Topics</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Learning Outcomes</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Reference Materials</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCourse.lesson_plans.map((unit, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3">
                        <Badge variant="outline" className="font-medium">
                          Unit {unit.unit_number}
                        </Badge>
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        <div className="font-medium text-gray-900">{unit.unit_title}</div>
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        <span className="font-semibold text-blue-600">{unit.hours_allotted}h</span>
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        <span className="text-sm text-gray-600">{unit.teaching_method}</span>
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        <span className="text-sm text-gray-600">{unit.assessment_method}</span>
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        <div className="text-sm text-gray-600 max-w-sm">
                          <div className="max-h-32 overflow-y-auto">
                            {unit.session_plans?.map((session, sessionIndex) => (
                              <div key={sessionIndex} className="mb-1">
                                <span className="inline-block w-6 h-6 text-xs bg-blue-100 text-blue-800 rounded-full text-center leading-6 mr-2">
                                  {session.session_number}
                                </span>
                                <span className="text-xs">{session.topic}</span>
                              </div>
                            )) || <span className="text-gray-400">No sessions</span>}
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        <div className="text-sm text-gray-600 max-w-xs">
                          {unit.learning_outcomes}
                        </div>
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        <span className="text-sm text-gray-600">{unit.reference_materials}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>


        {/* Reference Books Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Reference Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {currentCourse.reference_books.map((book, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <BookOpen className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="text-gray-900">{book}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
