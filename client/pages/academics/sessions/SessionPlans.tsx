import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  BookOpen,
  Target,
  Download,
  Edit,
  Play,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  FileText,
  Image,
  Monitor,
  Calculator,
  Layers,
  Zap,
  PenTool,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ResourceItem {
  id: string;
  title: string;
  url?: string;
  type:
    | "pdf"
    | "image"
    | "document"
    | "interactive"
    | "content"
    | "presentation"
    | "example"
    | "whiteboard";
  description?: string;
  url?: string;
  embedUrl?: string;
}

interface ResourceSection {
  type: string;
  icon: string;
  color: string;
  items: ResourceItem[];
}

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
  resources?: Record<string, ResourceSection>;
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
  faculty_name: "Dr. Ramya",
  course_category: "Core",
  course_type: "Theory",
  l_t_p: "3-0-0",
  credits: 3,
  periods_per_week: 3,
  prerequisites: "Basic Electrical Engineering",
  end_exam: "Written",
  reference_books: [
    "M. Morris Mano, Digital Logic and Computer Design",
    "R.P. Jain, Modern Digital Electronics",
  ],
  lesson_plans: [
    {
      lesson_plan_id: 1,
      unit_number: 1,
      unit_title: "Number Systems and Boolean Algebra",
      hours_allotted: 8,
      learning_outcomes:
        "Understand number systems, conversions, Boolean algebra.",
      teaching_method: "Lecture + Problem Solving",
      assessment_method: "Quiz + Tutorial",
      reference_materials: "Textbook Chapters 1 & 2",
      session_plans: [
        {
          session_plan_id: 1,
          session_number: 1,
          topic: "Digital Systems and Their Importance",
          teaching_aids: "PPT, Blackboard, Digital Whiteboard",
          teaching_method: "Lecture",
          hours_allocated: 2,
          assessment_activity: "Quiz",
          session_outcome:
            "Understand the importance and applications of digital systems",
          video_links: [
            "https://www.youtube.com/watch?v=LnzuMJLZRdU",
            "https://www.youtube.com/watch?v=gI-qXk7XojA",
            "https://www.youtube.com/watch?v=M0mx8S05v60",
            "https://www.youtube.com/watch?v=VBDoT8o4q00",
          ],
        },
        {
          session_plan_id: 2,
          session_number: 2,
          topic: "Number Systems: Decimal, Binary, Octal, Hexadecimal",
          teaching_aids: "Examples, Blackboard, Digital Whiteboard",
          teaching_method: "Lecture + Problem Solving",
          hours_allocated: 2,
          assessment_activity: "In-class problems",
          session_outcome:
            "Understand different number systems and their representations",
          video_links: [
            "https://www.youtube.com/watch?v=aP_-P_Xi__k",
            "https://www.youtube.com/watch?v=SkF6NFVJ8no",
            "https://www.youtube.com/watch?v=qa_WgNPHHOI",
            "https://www.youtube.com/watch?v=QJW_-PDr0ao",
            "https://www.youtube.com/watch?v=FFDMzbrEXaE",
          ],
        },
        {
          session_plan_id: 3,
          session_number: 3,
          topic: "Number System Conversions",
          teaching_aids: "Worked Examples, Digital Whiteboard",
          teaching_method: "Lecture + Practice",
          hours_allocated: 2,
          assessment_activity: "Tutorial Sheet",
          session_outcome:
            "Convert between binary, decimal, octal, and hexadecimal",
          video_links: [
            "https://www.youtube.com/watch?v=VLflTjd3lWA",
            "https://www.youtube.com/watch?v=C5EkxfNEMjE",
            "https://www.youtube.com/watch?v=wvJc9CZcvBc",
            "https://www.youtube.com/watch?v=rsxT4FfRBaM",
            "https://www.youtube.com/watch?v=pg-HEGBpCQk",
          ],
        },
        {
          session_plan_id: 4,
          session_number: 4,
          topic: "Binary Arithmetic - Addition and Subtraction",
          teaching_aids: "Blackboard, Digital Whiteboard",
          teaching_method: "Lecture + Practice",
          hours_allocated: 2,
          assessment_activity: "Problem Solving",
          session_outcome: "Perform binary addition and subtraction operations",
          video_links: [
            "https://www.youtube.com/watch?v=C5EkxfNEMjE",
            "https://www.youtube.com/watch?v=wvJc9CZcvBc",
            "https://www.youtube.com/watch?v=VLflTjd3lWA",
          ],
        },
        {
          session_plan_id: 5,
          session_number: 5,
          topic: "1's and 2's Complement Arithmetic",
          teaching_aids: "Worked Examples, Digital Whiteboard",
          teaching_method: "Lecture + Practice",
          hours_allocated: 2,
          assessment_activity: "Tutorial",
          session_outcome:
            "Apply complement arithmetic for negative number representation",
          video_links: [
            "https://www.youtube.com/watch?v=4qH4unVtJkE",
            "https://www.youtube.com/watch?v=sJXTo3EZoxM",
            "https://www.youtube.com/watch?v=dHB7jFjESLY",
          ],
        },
        {
          session_plan_id: 6,
          session_number: 6,
          topic: "Binary Conversion Methods",
          teaching_aids: "Examples, Blackboard",
          teaching_method: "Problem Solving",
          hours_allocated: 2,
          assessment_activity: "Practice Problems",
          session_outcome: "Master various binary conversion techniques",
          video_links: [
            "https://www.youtube.com/watch?v=pg-HEGBpCQk",
            "https://www.youtube.com/watch?v=rsxT4FfRBaM",
            "https://www.youtube.com/watch?v=C5EkxfNEMjE",
          ],
        },
        {
          session_plan_id: 7,
          session_number: 7,
          topic: "Binary Code Standards - ASCII",
          teaching_aids: "PPT, Examples",
          teaching_method: "Lecture",
          hours_allocated: 1,
          assessment_activity: "Quiz",
          session_outcome:
            "Understand ASCII code standard and character representation",
          video_links: [
            "https://www.youtube.com/watch?v=MijmeoH9LT4",
            "https://www.youtube.com/watch?v=H4l42nbYmrU",
          ],
        },
        {
          session_plan_id: 8,
          session_number: 8,
          topic: "Binary Code Standards - BCD",
          teaching_aids: "Examples, Blackboard",
          teaching_method: "Lecture + Practice",
          hours_allocated: 1,
          assessment_activity: "Problem Solving",
          session_outcome: "Apply BCD code for decimal number representation",
          video_links: ["https://www.youtube.com/watch?v=pg-HEGBpCQk"],
        },
      ],
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
        {
          session_plan_id: 9,
          session_number: 9,
          topic: "Logic Gates - AND, OR, NOT",
          teaching_aids: "Logic Kits, Digital Whiteboard",
          teaching_method: "Lecture + Demo",
          hours_allocated: 2,
          assessment_activity: "Lab Exercise",
          session_outcome: "Understand basic logic gates and their operations",
          video_links: [
            "https://www.youtube.com/watch?v=gI-qXk7XojA",
            "https://www.youtube.com/watch?v=M0mx8S05v60",
            "https://www.youtube.com/watch?v=VBDoT8o4q00",
          ],
        },
        {
          session_plan_id: 10,
          session_number: 10,
          topic: "Logic Gates - NAND, NOR",
          teaching_aids: "Logic Kits, Simulation Tools",
          teaching_method: "Lecture + Lab",
          hours_allocated: 2,
          assessment_activity: "Circuit Design",
          session_outcome: "Design and implement NAND and NOR gates",
          video_links: [
            "https://www.youtube.com/watch?v=6JVqutwtzVQ",
            "https://www.youtube.com/watch?v=J3y6GPZYjvs",
            "https://www.youtube.com/watch?v=VPw9vPN-3ac",
          ],
        },
        {
          session_plan_id: 11,
          session_number: 11,
          topic: "Logic Gates - XOR and Logic Diagrams",
          teaching_aids: "PPT, Logic Kits",
          teaching_method: "Lecture + Practice",
          hours_allocated: 2,
          assessment_activity: "Logic Diagram Drawing",
          session_outcome: "Create logic diagrams for XOR operations",
          video_links: [
            "https://www.youtube.com/watch?v=6JVqutwtzVQ",
            "https://www.youtube.com/watch?v=IFfSDSAhqUQ",
          ],
        },
        {
          session_plan_id: 12,
          session_number: 12,
          topic: "Realization of Gates Using Universal Gates",
          teaching_aids: "Logic Kits, Digital Whiteboard",
          teaching_method: "Lecture + Demo",
          hours_allocated: 2,
          assessment_activity: "Circuit Implementation",
          session_outcome: "Implement any logic gate using NAND/NOR gates",
          video_links: [
            "https://www.youtube.com/watch?v=VPw9vPN-3ac",
            "https://www.youtube.com/watch?v=J3y6GPZYjvs",
          ],
        },
        {
          session_plan_id: 13,
          session_number: 13,
          topic: "Boolean Laws & Theorems",
          teaching_aids: "Board Work, Digital Whiteboard",
          teaching_method: "Lecture",
          hours_allocated: 2,
          assessment_activity: "Tutorial",
          session_outcome: "Simplify expressions using Boolean laws",
          video_links: [
            "https://www.youtube.com/watch?v=59BbvOo-6sg",
            "https://www.youtube.com/watch?v=gI-qXk7XojA",
            "https://www.youtube.com/watch?v=2zRJ8eVYmtA",
          ],
        },
        {
          session_plan_id: 14,
          session_number: 14,
          topic: "K-map Simplification",
          teaching_aids: "K-map Charts, Digital Whiteboard",
          teaching_method: "Problem Solving",
          hours_allocated: 2,
          assessment_activity: "Quiz",
          session_outcome: "Minimize logic functions using K-map",
          video_links: [
            "https://www.youtube.com/watch?v=RO5alU6PpSU",
            "https://www.youtube.com/watch?v=PA0kBrpHLM4",
            "https://www.youtube.com/watch?v=dw2YTfItWO0",
          ],
        },
        {
          session_plan_id: 15,
          session_number: 15,
          topic: "Design of Half Adder and Full Adder",
          teaching_aids: "Logic Kits",
          teaching_method: "Lecture + Demo",
          hours_allocated: 2,
          assessment_activity: "Assignment",
          session_outcome: "Design and implement adders",
          video_links: [
            "https://www.youtube.com/watch?v=gVUrDV4tZfY",
            "https://www.youtube.com/watch?v=mZ9VWA4cTbE",
            "https://www.youtube.com/watch?v=VBDoT8o4q00",
          ],
        },
        {
          session_plan_id: 16,
          session_number: 16,
          topic: "Design of Multiplexers and Demultiplexers",
          teaching_aids: "Simulation Tools",
          teaching_method: "Lecture + Lab",
          hours_allocated: 2,
          assessment_activity: "In-class problems",
          session_outcome: "Design and verify MUX/DEMUX",
          video_links: [
            "https://www.youtube.com/watch?v=I7vfbB0_kDg",
            "https://www.youtube.com/watch?v=6Q0tUrK0Cbo",
            "https://www.youtube.com/watch?v=UzQZjluDFKw",
          ],
        },
        {
          session_plan_id: 17,
          session_number: 17,
          topic: "Design of Encoders and Decoders",
          teaching_aids: "PPT + Kits",
          teaching_method: "Lecture + Lab",
          hours_allocated: 2,
          assessment_activity: "Quiz",
          session_outcome: "Design encoders and decoders",
          video_links: [
            "https://www.youtube.com/watch?v=7zffjsXqATg",
            "https://www.youtube.com/watch?v=QpOm_hZOLwQ",
            "https://www.youtube.com/watch?v=I7vfbB0_kDg",
          ],
        },
      ],
    },
    {
      lesson_plan_id: 3,
      unit_number: 3,
      unit_title: "Sequential Logic Circuits",
      hours_allotted: 10,
      learning_outcomes:
        "Understand flip-flops and design sequential circuits.",
      teaching_method: "Lecture + Tutorial",
      assessment_method: "Quiz + Assignment",
      reference_materials:
        "https://annamalaiuniversity.ac.in/studport/download/engg/math/resources/Dr%20ST-BS401-Numerical%20Methods-Module-4&5.pdf",
      session_plans: [
        {
          session_plan_id: 18,
          session_number: 18,
          topic: "SR, JK, D, T Flip-Flops",
          teaching_aids: "Flip-Flop Kits",
          teaching_method: "Lecture + Demo",
          hours_allocated: 2,
          assessment_activity: "Assignment",
          session_outcome: "Explain and use flip-flops",
          video_links: [
            "https://www.youtube.com/watch?v=A6_8TqIWuWw",
            "https://www.youtube.com/watch?v=uqY3FMuMuRo",
            "https://www.youtube.com/watch?v=6vNyGSJc6Z8",
          ],
        },
        {
          session_plan_id: 19,
          session_number: 19,
          topic: "Registers",
          teaching_aids: "Board + Kits",
          teaching_method: "Lecture + Lab",
          hours_allocated: 2,
          assessment_activity: "Quiz",
          session_outcome: "Design and apply registers",
          video_links: [
            "https://www.youtube.com/watch?v=1I5ZMmrOfnA",
            "https://www.youtube.com/watch?v=FPDxb8aKM8o",
            "https://www.youtube.com/watch?v=A6_8TqIWuWw",
          ],
        },
        {
          session_plan_id: 20,
          session_number: 20,
          topic: "Counters",
          teaching_aids: "Simulation Tools",
          teaching_method: "Lecture + Lab",
          hours_allocated: 3,
          assessment_activity: "Tutorial",
          session_outcome: "Design and implement counters",
          video_links: [
            "https://www.youtube.com/watch?v=aKqMcGZmW5s",
            "https://www.youtube.com/watch?v=VyUjZ9Hg-NY",
            "https://www.youtube.com/watch?v=7LumTxO5s4c",
          ],
        },
        {
          session_plan_id: 21,
          session_number: 21,
          topic: "Shift Registers",
          teaching_aids: "Digital Kits",
          teaching_method: "Lecture + Demo",
          hours_allocated: 3,
          assessment_activity: "Quiz",
          session_outcome: "Design and apply shift registers",
          video_links: [
            "https://www.youtube.com/watch?v=1mhXXSJr8AY",
            "https://www.youtube.com/watch?v=Ru1rQ0OiwQ8",
            "https://www.youtube.com/watch?v=YBYhT4AhKw8",
          ],
        },
      ],
    },
    {
      lesson_plan_id: 4,
      unit_number: 4,
      unit_title: "Synchronous and Asynchronous Circuits",
      hours_allotted: 8,
      learning_outcomes:
        "Design synchronous and asynchronous sequential circuits.",
      teaching_method: "Lecture + Chalk and Talk",
      assessment_method: "Quiz + Tutorial",
      reference_materials: "Textbook Chapter 5",
      session_plans: [
        {
          session_plan_id: 22,
          session_number: 22,
          topic: "Synchronous Sequential Circuits",
          teaching_aids: "Board + Simulation",
          teaching_method: "Lecture",
          hours_allocated: 2,
          assessment_activity: "Tutorial",
          session_outcome: "Design synchronous sequential circuits",
          video_links: [
            "https://www.youtube.com/watch?v=gq7VGxVZNv4",
            "https://www.youtube.com/watch?v=YR8yfCkLGk8",
            "https://www.youtube.com/watch?v=P7_g2VBPSs4",
          ],
        },
        {
          session_plan_id: 23,
          session_number: 23,
          topic: "Asynchronous Sequential Circuits",
          teaching_aids: "PPT + Simulation",
          teaching_method: "Lecture",
          hours_allocated: 3,
          assessment_activity: "Quiz",
          session_outcome: "Analyze asynchronous circuits",
          video_links: [
            "https://www.youtube.com/watch?v=sV-9LrZBJ0M",
            "https://www.youtube.com/watch?v=r8w3F6H-2j4",
            "https://www.youtube.com/watch?v=zA6_6_5hLrE",
          ],
        },
        {
          session_plan_id: 24,
          session_number: 24,
          topic: "Hazards and Races",
          teaching_aids: "Examples",
          teaching_method: "Lecture + Problem Solving",
          hours_allocated: 3,
          assessment_activity: "Assignment",
          session_outcome: "Identify hazards and race conditions in circuits",
          video_links: [
            "https://www.youtube.com/watch?v=TbQmKzqX8w0",
            "https://www.youtube.com/watch?v=QDx7YwqzfX4",
            "https://www.youtube.com/watch?v=w8BKLf9QRQY",
          ],
        },
      ],
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
        {
          session_plan_id: 25,
          session_number: 25,
          topic: "ROM, RAM",
          teaching_aids: "Memory Kits",
          teaching_method: "Lecture + Demo",
          hours_allocated: 3,
          assessment_activity: "Quiz",
          session_outcome: "Differentiate ROM and RAM",
          video_links: [
            "https://www.youtube.com/watch?v=PVad0c2cljo",
            "https://www.youtube.com/watch?v=fpnE6UAfbtU",
            "https://www.youtube.com/watch?v=7vAOxEJoZB8",
          ],
        },
        {
          session_plan_id: 26,
          session_number: 26,
          topic: "PLDs (PLA, PAL, FPGA)",
          teaching_aids: "PPT + Simulation",
          teaching_method: "Lecture",
          hours_allocated: 3,
          assessment_activity: "Assignment",
          session_outcome: "Explain PLDs and applications",
          video_links: [
            "https://www.youtube.com/watch?v=iHg0mmIg0UU",
            "https://www.youtube.com/watch?v=lLg1AgA2Xoo",
            "https://www.youtube.com/watch?v=fpnE6UAfbtU",
          ],
        },
        {
          session_plan_id: 27,
          session_number: 27,
          topic: "Design Examples with PLDs",
          teaching_aids: "Simulation Software",
          teaching_method: "Lecture + Lab",
          hours_allocated: 3,
          assessment_activity: "Problem Solving",
          session_outcome: "Design circuits using PLDs",
          video_links: [
            "https://www.youtube.com/watch?v=lLg1AgA2Xoo",
            "https://www.youtube.com/watch?v=iHg0mmIg0UU",
            "https://www.youtube.com/watch?v=fpnE6UAfbtU",
          ],
        },
      ],
    },
  ],
};

const cProgrammingCourse: Course = {
  course_id: 2,
  course_code: "1052233220",
  course_title: "C Programming",
  semester: 1,
  academic_year: "2023-2024",
  department: "Computer Science and Engineering",
  faculty_name: "Not Specified",
  course_category: "Core",
  course_type: "Theory + Lab",
  l_t_p: "3-0-2",
  credits: 4,
  periods_per_week: 5,
  prerequisites: "Basic knowledge of computers",
  end_exam: "Written + Practical",
  reference_books: [
    "E. Balagurusamy, Programming in ANSI C",
    "Byron Gottfried, Schaum's Outline of Programming with C",
  ],
  lesson_plans: [
    {
      lesson_plan_id: 1,
      unit_number: 1,
      unit_title: "Introduction to C Programming",
      hours_allotted: 10,
      learning_outcomes:
        "Understand the structure of C programs, identifiers, keywords, constants, variables, data types, and operators.",
      teaching_method: "Lecture + Hands-on Lab",
      assessment_method: "Quiz + Assignment + Lab",
      reference_materials: "PPT, Blackboard, Lab Sheets",
      session_plans: [
        {
          session_plan_id: 1,
          session_number: 1,
          topic: "Introduction to Programming and C Language Features",
          teaching_aids: "PPT, Blackboard",
          teaching_method: "Lecture + Demo",
          hours_allocated: 2,
          assessment_activity: "Quiz",
          session_outcome: "Explain features and applications of C language",
          video_links: ["https://www.youtube.com/watch?v=KJgsSFOSQv0"],
        },
        {
          session_plan_id: 2,
          session_number: 2,
          topic: "Identifiers, Keywords, Constants, Variables",
          teaching_aids: "Examples, Blackboard",
          teaching_method: "Lecture + Examples",
          hours_allocated: 2,
          assessment_activity: "Practice Problems",
          session_outcome: "Differentiate identifiers, keywords, and variables",
          video_links: ["https://www.youtube.com/watch?v=ZSPZob_1TOk"],
        },
        {
          session_plan_id: 3,
          session_number: 3,
          topic: "Data Types and Type Conversions",
          teaching_aids: "Examples, Lab Demo",
          teaching_method: "Lecture + Lab Demo",
          hours_allocated: 2,
          assessment_activity: "Assignment",
          session_outcome:
            "Understand data types and implicit/explicit conversions",
          video_links: ["https://www.youtube.com/watch?v=QjdUjl7BNt0"],
        },
        {
          session_plan_id: 4,
          session_number: 4,
          topic: "Operators and Expressions",
          teaching_aids: "PPT, Code Examples",
          teaching_method: "Lecture + Lab",
          hours_allocated: 2,
          assessment_activity: "Lab Exercise",
          session_outcome: "Apply various operators in C programming",
          video_links: ["https://www.youtube.com/watch?v=1uK2DPOhvRA"],
        },
        {
          session_plan_id: 5,
          session_number: 5,
          topic: "Input/Output Functions",
          teaching_aids: "Code Demo, Lab",
          teaching_method: "Hands-on Lab",
          hours_allocated: 2,
          assessment_activity: "Programming Assignment",
          session_outcome: "Use scanf and printf for input/output operations",
          video_links: ["https://www.youtube.com/watch?v=CQtNy_HfLZQ"],
        },
      ],
    },
  ],
};
const ElectronicDevices: Course = {
  course_id: 3,
  course_code: "1052234110",
  course_title: "Electronic Devices and Circuits (Practical)",
  semester: 3,
  academic_year: "2023-2024",
  department: "Electronics and Communication Engineering",
  faculty_name: "Not Specified",
  course_category: "Core",
  course_type: "Practical",
  l_t_p: "0-0-3",
  credits: 1.5,
  periods_per_week: 3,
  prerequisites: "Basic Electrical Engineering",
  end_exam: "Lab Examination",
  reference_books: [
    "J. Millman & C. Halkias, Integrated Electronics",
    "Boylestad & Nashelsky, Electronic Devices and Circuit Theory",
  ],
  lesson_plans: [
    {
      lesson_plan_id: 1,
      unit_number: 1,
      unit_title: "Electronic Devices Experiments",
      hours_allotted: 12,
      learning_outcomes:
        "Understand characteristics of diodes, rectifiers, and transistors.",
      teaching_method: "Lab Experiment + Demonstration",
      assessment_method: "Viva + Record Work",
      reference_materials: "Lab Manual, Datasheets",
      session_plans: [
        {
          session_plan_id: 1,
          session_number: 1,
          topic: "V-I Characteristics of PN Junction Diode",
          teaching_aids: "Diode, Resistors, DC Supply, Ammeter, Voltmeter",
          teaching_method: "Hands-on Lab",
          hours_allocated: 3,
          assessment_activity: "Observation + Viva",
          session_outcome:
            "Plot and analyze forward and reverse bias characteristics",
          video_links: ["https://youtu.be/u4md32GMX28?si=WBgwATDOZ0lE30Nd"],
        },
        {
          session_plan_id: 2,
          session_number: 2,
          topic: "Zener Diode Characteristics",
          teaching_aids: "Zener Diode, DC Supply, Ammeter, Voltmeter",
          teaching_method: "Hands-on Lab",
          hours_allocated: 3,
          assessment_activity: "Record Submission + Viva",
          session_outcome:
            "Understand breakdown characteristics of Zener diode",
          video_links: ["https://youtu.be/e7UtJDdgCwU?si=ftchT93SmBI1S2RL"],
        },
        {
          session_plan_id: 3,
          session_number: 3,
          topic: "Half-Wave Rectifier",
          teaching_aids: "Transformer, Diode, Resistors, Load",
          teaching_method: "Lab Experiment + Analysis",
          hours_allocated: 3,
          assessment_activity: "Problem Solving + Viva",
          session_outcome:
            "Analyze input-output waveform of half-wave rectifier",
          video_links: ["https://www.youtube.com/watch?v=hXGjcjQey2s"],
        },
      ],
    },
  ],
};
const eVehicle: Course = {
  course_id: 4,
  course_code: "EVT-501",
  course_title: "E-Vehicle Technology",
  semester: 5,
  academic_year: "2023-2024",
  department: "Automobile Engineering",
  faculty_name: "Not Specified",
  course_category: "Core",
  course_type: "Theory + Practical",
  l_t_p: "3-0-2",
  credits: 4,
  periods_per_week: 5,
  prerequisites: "Basic Electrical Engineering",
  end_exam: "Written + Practical",
  reference_books: [
    "James Larminie & John Lowry, Electric Vehicle Technology Explained",
    "Mehrdad Ehsani et al., Modern Electric, Hybrid Electric, and Fuel Cell Vehicles",
  ],
  lesson_plans: [
    {
      lesson_plan_id: 1,
      unit_number: 1,
      unit_title: "Environmental Impact & EV History",
      hours_allotted: 100,
      learning_outcomes:
        "Understand the environmental effects of vehicles and the evolution of EV/HEV.",
      teaching_method: "Lecture + Debate + Storytelling",
      assessment_method: "Quiz + Discussion + Reflection",
      reference_materials: "Air Pollution Reports, Petroleum Reserve Data",
      session_plans: [
        {
          session_plan_id: 1,
          session_number: 1,
          topic: "Environmental Impact of Conventional Vehicles",
          teaching_aids: "Discussion, Debate",
          teaching_method: "Brainstorming + Pre-Quiz + Debate",
          hours_allocated: 50,
          assessment_activity: "Quiz + Reflection",
          session_outcome:
            "Evaluate transportation-related air pollution and its health effects",
          video_links: ["https://youtu.be/kdjZn48Z2ZM?si=ak6q06GD_Ps6lgxJ"],
        },
        {
          session_plan_id: 2,
          session_number: 2,
          topic: "History of EV & HEV",
          teaching_aids: "Storytelling, Interactive Timeline",
          teaching_method: "Lecture + Timeline Discussion",
          hours_allocated: 50,
          assessment_activity: "Quiz + Reflection",
          session_outcome: "Analyze the evolution of EVs and HEVs over time",
          video_links: ["https://youtu.be/VPFp-zqjbMA?si=DZPLCW4-YQxE7Fti"],
        },
      ],
    },
    {
      lesson_plan_id: 2,
      unit_number: 2,
      unit_title: "Components of Vehicles",
      hours_allotted: 150,
      learning_outcomes:
        "Compare conventional vehicle systems with EV/HEV components.",
      teaching_method: "Lecture + AR + Video",
      assessment_method: "Quiz + Assignment",
      reference_materials: "AR apps, simulation tools",
      session_plans: [
        {
          session_plan_id: 3,
          session_number: 3,
          topic: "Components of Conventional Vehicles",
          teaching_aids: "AR Models, Simulation",
          teaching_method: "Lecture + Lab",
          hours_allocated: 50,
          assessment_activity: "Quiz + Reflection",
          session_outcome:
            "Identify major conventional vehicle components and their functions",
          video_links: ["https://youtu.be/h5ysddrlXLw?si=2bZE7UnuqyJ8022Y"],
        },

      ],
    },
  ],
};

// Course lookup function
const getCourseById = (courseId: string): Course | null => {
  const courses = {
    "1": digitalLogicDesignCourse,
    "2": cProgrammingCourse,
    "3": ElectronicDevices,
    "4": eVehicle,
  };
  return courses[courseId as keyof typeof courses] || null;
};

export default function SessionPlans() {
  const { id } = useParams();
  const { user } = useAuth();
  const [expandedSessions, setExpandedSessions] = useState<Set<number>>(
    new Set()
  );
  const [playingVideos, setPlayingVideos] = useState<
    Record<number, { videoIndex: number; videoId: string }>
  >({});
  const [expandedResources, setExpandedResources] = useState<Set<string>>(
    new Set()
  );
  const [playingResources, setPlayingResources] = useState<
    Record<string, ResourceItem>
  >({});

  // Get the current course based on the ID parameter
  const currentCourse = getCourseById(id || "1");

  // If course not found, show error
  if (!currentCourse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Course Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The requested course could not be found.
          </p>
          <Link to="/academics/session-plans">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Session Plans
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getTotalHours = () => {
    return currentCourse.lesson_plans.reduce(
      (total, unit) => total + unit.hours_allotted,
      0
    );
  };

  const getTotalSessions = () => {
    return currentCourse.lesson_plans.reduce(
      (total, unit) => total + unit.session_plans.length,
      0
    );
  };

  const toggleVideoSection = (sessionId: number) => {
    setExpandedSessions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sessionId)) {
        newSet.delete(sessionId);
      } else {
        newSet.add(sessionId);
      }
      return newSet;
    });
  };

  const extractYouTubeVideoId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const playVideo = (
    sessionId: number,
    videoIndex: number,
    videoUrl: string
  ) => {
    const videoId = extractYouTubeVideoId(videoUrl);
    if (videoId) {
      setPlayingVideos((prev) => ({
        ...prev,
        [sessionId]: { videoIndex, videoId },
      }));
      // Auto-expand the session if not already expanded
      if (!expandedSessions.has(sessionId)) {
        setExpandedSessions((prev) => new Set([...prev, sessionId]));
      }
    }
  };

  const stopVideo = (sessionId: number) => {
    setPlayingVideos((prev) => {
      const newState = { ...prev };
      delete newState[sessionId];
      return newState;
    });
  };

  const generateMockResources = (teachingAidType: string): ResourceItem[] => {
    // Generate course-specific PPT resources with inline content
    const getPPTResources = () => {
      if (currentCourse.course_title === "C Programming") {
        return [
          {
            id: "ppt1",
            title: "Introduction to C Programming",
            type: "presentation",
            description: "Comprehensive introduction to C programming language",
            url: "https://www.slideshare.net/slideshow/c-language-ppt/43165943",
            embedUrl:
              "https://www.slideshare.net/slideshow/embed_code/key/lpW9CzTaci7d8p?startSlide=1",
          },
          {
            id: "ppt2",
            title: "Data Types and Variables",
            type: "presentation",
            description: "Understanding C data types, variables and constants",
            url: "https://www.slideshare.net/slideshow/data-types-8302235/8302235",
            embedUrl:
              "https://www.slideshare.net/slideshow/embed_code/key/gpowRDfQhwn7PT?startSlide=1",
          },
          {
            id: "ppt3",
            title: "Operators and Expressions",
            type: "presentation",
            description: "Learn about different operators in C programming",
            url: "https://www.slideshare.net/slideshow/operators-in-c-programming/34939571",
            embedUrl:
              "https://www.slideshare.net/slideshow/embed_code/key/cJM8DVjRVfDDJA?startSlide=1",
          },
        ];
      } else {
        // Digital Logic Design resources
        return [
          {
            id: "ppt0",
            title: "Number Systems - SlideShare Presentation",
            type: "presentation",
            description:
              "Comprehensive SlideShare presentation on Number Systems",
            url: "https://www.slideshare.net/slideshow/number-systems-178512104/178512104",
            embedUrl:
              "https://www.slideshare.net/slideshow/embed_code/key/3P7wqEMx7pziPI?startSlide=1",
          },

          {
            id: "ppt1",
            title: "Logic Gates and Boolean Algebra",
            type: "presentation",
            description:
              "Comprehensive guide to logic gates and Boolean operations",
            url: "https://www.slideshare.net/slideshow/boolean-algebra-and-logic-gate/59657644",
            embedUrl:
              "https://www.slideshare.net/slideshow/embed_code/key/t4qajzhJzI99SQ?startSlide=1",
          },
          {
            id: "ppt2",
            title: "Sequential Circuits and Flip-Flops",
            type: "presentation",
            description: "Understanding sequential logic and memory elements",
            url: "https://www.slideshare.net/slideshow/sequential-circuits-flipflops-and-latches/250855956",
            embedUrl:
              "https://www.slideshare.net/slideshow/embed_code/key/2GmdkZfZncsSQx?startSlide=1",
          },
        ];
      }
    };

    const resourceTemplates: Record<string, ResourceItem[]> = {
      PPT: getPPTResources(),
      Blackboard: [
        {
          id: "bb1",
          title: "Written Notes",
          type: "content",
          description: "Key points and formulas written on blackboard",
          content: `
            <div class="space-y-4">
              <h3 class="text-lg font-semibold">Blackboard Notes</h3>
              <div class="space-y-3 text-gray-700 font-mono">
                <p>• Key formulas and equations</p>
                <p>• Step-by-step problem solving</p>
                <p>• Important definitions</p>
                <p>• Quick reference materials</p>
              </div>
            </div>
          `,
        },
        {
          id: "bb2",
          title: "Examples and Solutions",
          type: "example",
          description: "Worked examples demonstrating concepts",
          content: `
            <div class="space-y-4">
              <h3 class="text-lg font-semibold">Worked Examples</h3>
              <div class="space-y-3 text-gray-700">
                <p><strong>Problem:</strong> Apply the given concept</p>
                <p><strong>Solution:</strong> Step-by-step approach</p>
                <p><strong>Result:</strong> Final answer with explanation</p>
              </div>
            </div>
          `,
        },
        {
          id: "bb3",
          title: "Reference Materials",
          type: "pdf",
          description: "Supporting documents and worksheets",
          url: "https://annamalaiuniversity.ac.in/studport/download/engg/math/resources/Dr%20ST-BS401-Numerical%20Methods-Module-4&5.pdf",
        },
      ],
      "Digital Whiteboard": [
        {
          id: "dw1",
          title: "Interactive Drawing Board",
          type: "whiteboard",
          description: "Digital whiteboard for live drawing and explanation",
        },
        {
          id: "dw2",
          title: "Problem Solving Space",
          type: "whiteboard",
          description: "Collaborative space for working through problems",
        },
        {
          id: "dw3",
          title: "Concept Illustration Board",
          type: "whiteboard",
          description: "Visual space for illustrating complex concepts",
        },
      ],
      "Worked Examples": [
        {
          id: "we1",
          title: "Problem Solutions",
          type: "content",
          description: "Step-by-step worked examples",
          content: `
            <div class="space-y-4">
              <h3 class="text-lg font-semibold">Worked Examples</h3>
              <div class="space-y-3 text-gray-700">
                <div class="font-mono">
                  <p><strong>Example 1:</strong> Basic problem solving approach</p>
                  <p>Step 1: Identify given information</p>
                  <p>Step 2: Apply relevant formula/method</p>
                  <p>Step 3: Calculate result</p>
                  <p>Step 4: Verify answer</p>
                </div>
              </div>
            </div>
          `,
        },
        {
          id: "we2",
          title: "Practice Problems",
          type: "content",
          description: "Additional practice examples",
          content: `
            <div class="space-y-4">
              <h3 class="text-lg font-semibold">Practice Problems</h3>
              <div class="space-y-3 text-gray-700">
                <p>• Problem set with solutions</p>
                <p>• Varying difficulty levels</p>
                <p>• Concept reinforcement</p>
                <p>• Application-based questions</p>
              </div>
            </div>
          `,
        },
      ],
      "K-map Charts": [
        {
          id: "km1",
          title: "K-map Templates",
          type: "content",
          description: "Karnaugh map templates for simplification",
          content: `
            <div class="space-y-4">
              <h3 class="text-lg font-semibold">K-map Charts</h3>
              <div class="space-y-3 text-gray-700">
                <p>• 2-variable K-map template</p>
                <p>• 3-variable K-map template</p>
                <p>• 4-variable K-map template</p>
                <p>• Grouping guidelines and rules</p>
              </div>
            </div>
          `,
        },
        {
          id: "km2",
          title: "Simplification Examples",
          type: "content",
          description: "K-map simplification examples",
          content: `
            <div class="space-y-4">
              <h3 class="text-lg font-semibold">K-map Examples</h3>
              <div class="space-y-3 text-gray-700">
                <p>• Basic grouping techniques</p>
                <p>• Minimization strategies</p>
                <p>• Common patterns recognition</p>
                <p>• Don't care conditions</p>
              </div>
            </div>
          `,
        },
      ],
      "Simulation Tools": [
        {
          id: "sim1",
          title: "Digital Simulators",
          type: "content",
          description: "Software tools for circuit simulation",
          content: `
            <div class="space-y-4">
              <h3 class="text-lg font-semibold">Simulation Tools</h3>
              <div class="space-y-3 text-gray-700">
                <p>• Logic gate simulators</p>
                <p>• Truth table generators</p>
                <p>• Circuit design software</p>
                <p>• Timing diagram analyzers</p>
              </div>
            </div>
          `,
        },
        {
          id: "sim2",
          title: "Online Resources",
          type: "content",
          description: "Web-based simulation platforms",
          content: `
            <div class="space-y-4">
              <h3 class="text-lg font-semibold">Online Simulators</h3>
              <div class="space-y-3 text-gray-700">
                <p>�� Interactive circuit builders</p>
                <p>• Virtual lab environments</p>
                <p>�� Educational simulation platforms</p>
                <p>• Mobile-friendly tools</p>
              </div>
            </div>
          `,
        },
      ],
      "Logic Kits": [
        {
          id: "lk1",
          title: "Hardware Components",
          type: "content",
          description: "Physical logic components and ICs",
          content: `
            <div class="space-y-4">
              <h3 class="text-lg font-semibold">Logic Kits</h3>
              <div class="space-y-3 text-gray-700">
                <p>• Basic logic gate ICs (7408, 7432, 7404)</p>
                <p>• Flip-flop ICs (7476, 7474)</p>
                <p>• Counter ICs (7493, 74192)</p>
                <p>• Breadboards and connecting wires</p>
                <p>• LEDs and resistors for output display</p>
              </div>
            </div>
          `,
        },
        {
          id: "lk2",
          title: "Lab Experiments",
          type: "content",
          description: "Hands-on circuit building exercises",
          content: `
            <div class="space-y-4">
              <h3 class="text-lg font-semibold">Practical Exercises</h3>
              <div class="space-y-3 text-gray-700">
                <p>• Gate testing and truth table verification</p>
                <p>• Combinational circuit design</p>
                <p>• Sequential circuit implementation</p>
                <p>• Counter and register circuits</p>
                <p>• Troubleshooting and debugging</p>
              </div>
            </div>
          `,
        },
      ],
    };

    return resourceTemplates[teachingAidType] || [];
  };

  const parseTeachingAids = (
    teachingAids: string
  ): Record<string, ResourceSection> => {
    const aids = teachingAids.split(",").map((aid) => aid.trim());
    const resources: Record<string, ResourceSection> = {};

    const aidMappings = {
      PPT: { icon: "FileText", color: "blue" },
      Blackboard: { icon: "Monitor", color: "green" },
      "Digital Whiteboard": { icon: "PenTool", color: "indigo" },
      "Worked Examples": { icon: "Calculator", color: "purple" },
      "K-map Charts": { icon: "Layers", color: "orange" },
      "Simulation Tools": { icon: "Zap", color: "cyan" },
      "Logic Kits": { icon: "Target", color: "pink" },
    };

    aids.forEach((aid) => {
      // Check if aid contains any of our mapped teaching aids
      Object.keys(aidMappings).forEach((key) => {
        if (aid.includes(key)) {
          resources[key] = {
            type: key,
            icon: aidMappings[key].icon,
            color: aidMappings[key].color,
            items: generateMockResources(key),
          };
        }
      });
    });

    return resources;
  };

  const toggleResourceSection = (resourceKey: string) => {
    setExpandedResources((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(resourceKey)) {
        newSet.delete(resourceKey);
      } else {
        newSet.add(resourceKey);
      }
      return newSet;
    });
  };

  const playResource = (resourceKey: string, resource: ResourceItem) => {
    setPlayingResources((prev) => ({
      ...prev,
      [resourceKey]: resource,
    }));
  };

  const stopResource = (resourceKey: string) => {
    setPlayingResources((prev) => {
      const newState = { ...prev };
      delete newState[resourceKey];
      return newState;
    });
  };

  const getResourceIcon = (iconName: string) => {
    const icons = {
      FileText: FileText,
      Monitor: Monitor,
      PenTool: PenTool,
      Calculator: Calculator,
      Layers: Layers,
      Zap: Zap,
      Target: Target,
    };
    const IconComponent = icons[iconName as keyof typeof icons] || FileText;
    return IconComponent;
  };

  const getResourceColor = (color: string) => {
    const colors = {
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-700",
        icon: "text-blue-500",
      },
      green: {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-700",
        icon: "text-green-500",
      },
      indigo: {
        bg: "bg-indigo-50",
        border: "border-indigo-200",
        text: "text-indigo-700",
        icon: "text-indigo-500",
      },
      purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-700",
        icon: "text-purple-500",
      },
      orange: {
        bg: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-700",
        icon: "text-orange-500",
      },
      cyan: {
        bg: "bg-cyan-50",
        border: "border-cyan-200",
        text: "text-cyan-700",
        icon: "text-cyan-500",
      },
      pink: {
        bg: "bg-pink-50",
        border: "border-pink-200",
        text: "text-pink-700",
        icon: "text-pink-500",
      },
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const generateVideoQuestions = (
    topic: string,
    videoIndex: number
  ): string[] => {
    const questionTemplates: Record<string, string[][]> = {
      "Digital Systems and Their Importance": [
        [
          "What are the fundamental advantages of digital systems over analog systems?",
          "How do digital systems handle noise and signal degradation?",
          "What role do digital systems play in modern communication?",
          "Why is binary representation fundamental to digital systems?",
        ],
        [
          "What are the key characteristics that make digital systems reliable?",
          "How do digital systems contribute to data processing and storage?",
          "What are the economic benefits of implementing digital systems?",
          "How do digital systems enable complex computational tasks?",
        ],
      ],
      "Number Systems: Decimal, Binary, Octal, Hexadecimal": [
        [
          "Why do computers use binary number systems instead of decimal?",
          "What is the relationship between binary and hexadecimal systems?",
          "How does the position of a digit determine its value in different number systems?",
          "What are the practical applications of octal number systems?",
        ],
        [
          "How do you convert between different number systems efficiently?",
          "What patterns can you observe when converting decimal to binary?",
          "Why is hexadecimal notation commonly used in computer programming?",
          "How do number systems relate to digital circuit design?",
        ],
      ],
      "Number System Conversions": [
        [
          "What is the step-by-step process for converting decimal to binary?",
          "How do you verify the accuracy of your number system conversions?",
          "What shortcuts exist for converting between binary and hexadecimal?",
          "Why is understanding conversion methods crucial for digital design?",
        ],
        [
          "What common errors should you avoid during number conversions?",
          "How do conversion algorithms work in digital calculators?",
          "What is the mathematical foundation behind positional notation?",
          "How do you handle fractional numbers in different number systems?",
        ],
      ],
      "Binary Arithmetic - Addition and Subtraction": [
        [
          "What are the fundamental rules for binary addition?",
          "How do you handle carry operations in binary arithmetic?",
          "What is the process for binary subtraction using borrowing?",
          "How do overflow conditions occur in binary arithmetic?",
        ],
        [
          "Why is binary arithmetic essential for computer operations?",
          "How do you verify your binary arithmetic calculations?",
          "What patterns emerge when adding sequences of binary numbers?",
          "How does binary arithmetic relate to logic gate operations?",
        ],
      ],
      "1's and 2's Complement Arithmetic": [
        [
          "What is the purpose of complement arithmetic in digital systems?",
          "How do you calculate the 1's complement of a binary number?",
          "What is the step-by-step process for finding 2's complement?",
          "Why is 2's complement preferred for representing negative numbers?",
        ],
        [
          "How does complement arithmetic simplify subtraction operations?",
          "What advantages does 2's complement have over sign-magnitude representation?",
          "How do you detect overflow in complement arithmetic?",
          "What is the range of numbers representable in 2's complement form?",
        ],
      ],
      "Logic Gates - AND, OR, NOT": [
        [
          "What are the truth table outputs for AND, OR, and NOT gates?",
          "How do these basic gates form the foundation of digital circuits?",
          "What real-world analogies help explain gate operations?",
          "How do you implement these gates using transistors?",
        ],
        [
          "What happens when you cascade multiple logic gates?",
          "How do timing delays affect gate operations?",
          "What are the electrical characteristics of logic gates?",
          "How do you troubleshoot logic gate circuits?",
        ],
      ],
      "Logic Gates - NAND, NOR": [
        [
          "Why are NAND and NOR gates called 'universal gates'?",
          "How can you implement any Boolean function using only NAND gates?",
          "What are the truth tables for NAND and NOR operations?",
          "What practical advantages do universal gates offer in circuit design?",
        ],
        [
          "How do you convert AND/OR designs to NAND-only implementations?",
          "What cost benefits result from using universal gates?",
          "How do NAND and NOR gates simplify IC manufacturing?",
          "What design considerations apply when using universal gates?",
        ],
      ],
      "K-map Simplification": [
        [
          "What is the systematic approach to filling a K-map?",
          "How do you identify valid groupings in K-map simplification?",
          "What rules govern the formation of groups in K-maps?",
          "How does K-map simplification reduce circuit complexity?",
        ],
        [
          "What are the advantages of K-maps over algebraic simplification?",
          "How do you handle don't care conditions in K-maps?",
          "What limitations exist for K-map methods?",
          "How do you verify your K-map simplification results?",
        ],
      ],
      "Design of Half Adder and Full Adder": [
        [
          "What inputs and outputs define a half adder circuit?",
          "How does a full adder differ from a half adder?",
          "What logic gates are required to implement these adders?",
          "How do you derive the Boolean expressions for sum and carry?",
        ],
        [
          "How do you cascade adders to create multi-bit adders?",
          "What timing considerations affect adder circuit performance?",
          "How do adders form the basis for arithmetic logic units?",
          "What optimization techniques improve adder efficiency?",
        ],
      ],
      "Design of Multiplexers and Demultiplexers": [
        [
          "What is the fundamental function of a multiplexer?",
          "How does the select input control multiplexer operation?",
          "What is the relationship between multiplexers and demultiplexers?",
          "How do you determine the number of select lines needed?",
        ],
        [
          "What applications commonly use multiplexer/demultiplexer circuits?",
          "How can multiplexers implement Boolean functions?",
          "What timing issues affect MUX/DEMUX performance?",
          "How do you expand multiplexers for larger input counts?",
        ],
      ],
    };

    const defaultQuestions = [
      "What are the key concepts presented in this video?",
      "How does this topic relate to practical digital circuit design?",
      "What problem-solving approaches are demonstrated?",
      "How can you apply this knowledge to real-world scenarios?",
    ];

    return questionTemplates[topic]?.[videoIndex] || defaultQuestions;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link to="/academics/session-plans">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Session Plans
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Session Plans - {currentCourse.course_title}
                </h1>
                <p className="text-gray-600 mt-1">
                  Course Code: {currentCourse.course_code} • Semester{" "}
                  {currentCourse.semester} • {currentCourse.academic_year}
                </p>
              </div>
            </div>
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
                  <p className="text-gray-900">
                    {currentCourse.course_category}
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">
                    Department
                  </p>
                  <p className="text-gray-900">{currentCourse.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Credit</p>
                  <p className="text-gray-900">{currentCourse.credits}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Faculty</p>
                  <p className="text-gray-900">{currentCourse.faculty_name}</p>
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
                <span className="font-semibold">
                  {currentCourse.lesson_plans.length}
                </span>
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

        {/* Session Plans */}
        <Card>
          <CardHeader>
            <CardTitle>Session Plans</CardTitle>
            <p className="text-gray-600 text-sm mt-1">
              Detailed session-wise breakdown for all units
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {currentCourse.lesson_plans.map((unit, unitIndex) => (
                <div
                  key={unitIndex}
                  className="border-l-4 border-l-blue-500 pl-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Unit {unit.unit_number}: {unit.unit_title}
                  </h3>

                  <div className="space-y-4">
                    {unit.session_plans.map((session, sessionIndex) => (
                      <Card
                        key={sessionIndex}
                        className="border-l-2 border-l-green-300 bg-gray-50"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-800"
                              >
                                Session {session.session_number}
                              </Badge>
                              <span className="text-sm font-medium text-gray-500">
                                {session.hours_allocated} hours
                              </span>
                            </div>
                          </div>

                          <h4 className="font-semibold text-gray-900 mb-3">
                            {session.topic}
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <h5 className="font-medium text-gray-700 mb-1">
                                Teaching Method
                              </h5>
                              <p className="text-sm text-gray-600">
                                {session.teaching_method}
                              </p>
                            </div>

                            <div>
                              <h5 className="font-medium text-gray-700 mb-1">
                                Teaching Aids
                              </h5>
                              <p className="text-sm text-gray-600">
                                {session.teaching_aids}
                              </p>
                            </div>

                            <div>
                              <h5 className="font-medium text-gray-700 mb-1">
                                Assessment Activity
                              </h5>
                              <p className="text-sm text-gray-600">
                                {session.assessment_activity}
                              </p>
                            </div>

                            <div>
                              <h5 className="font-medium text-gray-700 mb-1">
                                Session Outcome
                              </h5>
                              <p className="text-sm text-gray-600">
                                {session.session_outcome}
                              </p>
                            </div>
                          </div>

                          {/* Video Links Section */}
                          {session.video_links &&
                            session.video_links.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <button
                                  onClick={() =>
                                    toggleVideoSection(session.session_plan_id)
                                  }
                                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                                >
                                  <h5 className="font-medium text-gray-700 flex items-center">
                                    <Play className="w-4 h-4 mr-2 text-red-500" />
                                    Video Resources (
                                    {session.video_links.length})
                                  </h5>
                                  {expandedSessions.has(
                                    session.session_plan_id
                                  ) ? (
                                    <ChevronUp className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
                                  )}
                                </button>

                                {expandedSessions.has(
                                  session.session_plan_id
                                ) && (
                                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 animate-in fade-in duration-200">
                                    {session.video_links.map(
                                      (link, linkIndex) => (
                                        <button
                                          key={linkIndex}
                                          onClick={() =>
                                            playVideo(
                                              session.session_plan_id,
                                              linkIndex,
                                              link
                                            )
                                          }
                                          className={`flex items-center gap-2 p-2 rounded-lg border transition-colors group text-left ${
                                            playingVideos[
                                              session.session_plan_id
                                            ]?.videoIndex === linkIndex
                                              ? "bg-red-100 border-red-300 text-red-800"
                                              : "bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                                          }`}
                                        >
                                          <Play className="w-3 h-3 text-red-600" />
                                          <span className="text-xs truncate flex-1">
                                            Video {linkIndex + 1}
                                            {playingVideos[
                                              session.session_plan_id
                                            ]?.videoIndex === linkIndex &&
                                              " (Playing)"}
                                          </span>
                                        </button>
                                      )
                                    )}
                                  </div>
                                )}

                                {/* Tabbed Video Player with Questions */}
                                {playingVideos[session.session_plan_id] && (
                                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                                    <div className="flex items-center justify-between mb-4">
                                      <h6 className="font-medium text-gray-800 flex items-center">
                                        <Play className="w-4 h-4 mr-2 text-red-500" />
                                        Video{" "}
                                        {playingVideos[session.session_plan_id]
                                          .videoIndex + 1}{" "}
                                        - {session.topic}
                                      </h6>
                                      <button
                                        onClick={() =>
                                          stopVideo(session.session_plan_id)
                                        }
                                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                      >
                                        <X className="w-4 h-4 text-gray-500" />
                                      </button>
                                    </div>

                                    <Tabs
                                      defaultValue="video"
                                      className="w-full"
                                    >
                                      <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger
                                          value="video"
                                          className="flex items-center gap-2"
                                        >
                                          <Play className="w-4 h-4" />
                                          Video
                                        </TabsTrigger>
                                        <TabsTrigger
                                          value="questions"
                                          className="flex items-center gap-2"
                                        >
                                          <BookOpen className="w-4 h-4" />
                                          Questions
                                        </TabsTrigger>
                                      </TabsList>

                                      <TabsContent
                                        value="video"
                                        className="mt-4"
                                      >
                                        <div
                                          className="relative w-full"
                                          style={{ paddingBottom: "56.25%" }}
                                        >
                                          <iframe
                                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                                            src={`https://www.youtube.com/embed/${
                                              playingVideos[
                                                session.session_plan_id
                                              ].videoId
                                            }?autoplay=1&rel=0`}
                                            title={`Video ${
                                              playingVideos[
                                                session.session_plan_id
                                              ].videoIndex + 1
                                            }`}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                          />
                                        </div>

                                        {/* Video Navigation */}
                                        {session.video_links &&
                                          session.video_links.length > 1 && (
                                            <div className="mt-4 flex justify-center gap-2">
                                              {session.video_links.map(
                                                (link, linkIndex) => (
                                                  <button
                                                    key={linkIndex}
                                                    onClick={() =>
                                                      playVideo(
                                                        session.session_plan_id,
                                                        linkIndex,
                                                        link
                                                      )
                                                    }
                                                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                                      playingVideos[
                                                        session.session_plan_id
                                                      ]?.videoIndex ===
                                                      linkIndex
                                                        ? "bg-red-500 text-white"
                                                        : "bg-white text-red-600 border border-red-300 hover:bg-red-50"
                                                    }`}
                                                  >
                                                    {linkIndex + 1}
                                                  </button>
                                                )
                                              )}
                                            </div>
                                          )}
                                      </TabsContent>

                                      <TabsContent
                                        value="questions"
                                        className="mt-4"
                                      >
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-2 mb-4">
                                            <Target className="w-5 h-5 text-blue-500" />
                                            <h3 className="text-lg font-semibold text-gray-800">
                                              Leading Questions to Simulate
                                              Reasoning
                                            </h3>
                                          </div>

                                          <div className="bg-white rounded-lg p-4 border border-blue-200">
                                            <p className="text-sm text-gray-600 mb-4">
                                              Use these questions to enhance
                                              your understanding of the video
                                              content and stimulate critical
                                              thinking:
                                            </p>

                                            <div className="space-y-3">
                                              {generateVideoQuestions(
                                                session.topic,
                                                playingVideos[
                                                  session.session_plan_id
                                                ].videoIndex
                                              ).map((question, qIndex) => (
                                                <div
                                                  key={qIndex}
                                                  className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                                                >
                                                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                                    {qIndex + 1}
                                                  </div>
                                                  <p className="text-gray-800 text-sm leading-relaxed">
                                                    {question}
                                                  </p>
                                                </div>
                                              ))}
                                            </div>

                                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                              <p className="text-xs text-gray-600">
                                                💡 <strong>Tip:</strong> Pause
                                                the video and reflect on these
                                                questions to deepen your
                                                understanding of the concepts.
                                              </p>
                                            </div>
                                          </div>

                                          {/* Question Navigation for Multiple Videos */}
                                          {session.video_links &&
                                            session.video_links.length > 1 && (
                                              <div className="mt-4">
                                                <p className="text-sm text-gray-600 mb-2">
                                                  View questions for other
                                                  videos:
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                  {session.video_links.map(
                                                    (link, linkIndex) => (
                                                      <button
                                                        key={linkIndex}
                                                        onClick={() =>
                                                          playVideo(
                                                            session.session_plan_id,
                                                            linkIndex,
                                                            link
                                                          )
                                                        }
                                                        className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                                                          playingVideos[
                                                            session
                                                              .session_plan_id
                                                          ]?.videoIndex ===
                                                          linkIndex
                                                            ? "bg-blue-500 text-white"
                                                            : "bg-white text-blue-600 border border-blue-300 hover:bg-blue-50"
                                                        }`}
                                                      >
                                                        Video {linkIndex + 1}{" "}
                                                        Questions
                                                      </button>
                                                    )
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                        </div>
                                      </TabsContent>
                                    </Tabs>
                                  </div>
                                )}
                              </div>
                            )}

                          {/* Auto-generated Resource Sections */}
                          {(() => {
                            const sessionResources = parseTeachingAids(
                              session.teaching_aids
                            );
                            return Object.entries(sessionResources).map(
                              ([resourceType, resourceSection]) => {
                                const resourceKey = `${session.session_plan_id}-${resourceType}`;
                                const IconComponent = getResourceIcon(
                                  resourceSection.icon
                                );
                                const colors = getResourceColor(
                                  resourceSection.color
                                );

                                return (
                                  <div
                                    key={resourceType}
                                    className="mt-4 pt-4 border-t border-gray-200"
                                  >
                                    <button
                                      onClick={() =>
                                        toggleResourceSection(resourceKey)
                                      }
                                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                                    >
                                      <h5 className="font-medium text-gray-700 flex items-center">
                                        <IconComponent
                                          className={`w-4 h-4 mr-2 ${colors.icon}`}
                                        />
                                        {resourceType} Resources (
                                        {resourceSection.items.length})
                                      </h5>
                                      {expandedResources.has(resourceKey) ? (
                                        <ChevronUp className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
                                      ) : (
                                        <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
                                      )}
                                    </button>

                                    {expandedResources.has(resourceKey) && (
                                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 animate-in fade-in duration-200">
                                        {resourceSection.items.map(
                                          (item, itemIndex) => (
                                            <button
                                              key={item.id}
                                              onClick={() =>
                                                playResource(resourceKey, item)
                                              }
                                              className={`flex items-center gap-2 p-2 rounded-lg border transition-colors group text-left ${
                                                playingResources[resourceKey]
                                                  ?.id === item.id
                                                  ? `${colors.bg} ${colors.border} ${colors.text} ring-2 ring-opacity-20`
                                                  : `${colors.bg} hover:brightness-95 ${colors.border} ${colors.text}`
                                              }`}
                                            >
                                              <IconComponent
                                                className={`w-3 h-3 ${colors.icon}`}
                                              />
                                              <div className="flex-1 min-w-0">
                                                <span className="text-xs font-medium truncate block">
                                                  {item.title}
                                                  {playingResources[resourceKey]
                                                    ?.id === item.id &&
                                                    " (Open)"}
                                                </span>
                                                {item.description && (
                                                  <span className="text-xs opacity-75 truncate block">
                                                    {item.description}
                                                  </span>
                                                )}
                                              </div>
                                            </button>
                                          )
                                        )}
                                      </div>
                                    )}

                                    {/* Inline Resource Viewer */}
                                    {playingResources[resourceKey] && (
                                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                                        <div className="flex items-center justify-between mb-3">
                                          <h6 className="font-medium text-gray-800 flex items-center">
                                            <IconComponent
                                              className={`w-4 h-4 mr-2 ${colors.icon}`}
                                            />
                                            {
                                              playingResources[resourceKey]
                                                .title
                                            }
                                          </h6>
                                          <button
                                            onClick={() =>
                                              stopResource(resourceKey)
                                            }
                                            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                          >
                                            <X className="w-4 h-4 text-gray-500" />
                                          </button>
                                        </div>

                                        {playingResources[resourceKey].type ===
                                          "example" && (
                                          <div
                                            className="relative w-full bg-white rounded-lg border"
                                            style={{ minHeight: "400px" }}
                                          >
                                            <div className="bg-gradient-to-r from-slate-600 to-gray-700 p-3 text-white rounded-t-lg">
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                  <Calculator className="w-5 h-5 mr-2" />
                                                  <span className="font-medium">
                                                    Step-by-Step Solution
                                                  </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                  <button className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm hover:bg-opacity-30 transition-colors">
                                                    Print Steps
                                                  </button>
                                                  <button className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm hover:bg-opacity-30 transition-colors">
                                                    Fullscreen
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                            <div
                                              className="p-4 h-full overflow-auto max-h-96"
                                              dangerouslySetInnerHTML={{
                                                __html:
                                                  playingResources[resourceKey]
                                                    .content || "",
                                              }}
                                              style={{
                                                height: "calc(100% - 60px)",
                                              }}
                                            />
                                          </div>
                                        )}

                                        {playingResources[resourceKey].type ===
                                          "pdf" && (
                                          <div
                                            className="relative w-full bg-white rounded-lg border overflow-hidden"
                                            style={{ height: "500px" }}
                                          >
                                            <div className="bg-gradient-to-r from-red-600 to-pink-600 p-3 text-white">
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                  <FileText className="w-5 h-5 mr-2" />
                                                  <span className="font-medium">
                                                    PDF Viewer
                                                  </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                  <button className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm hover:bg-opacity-30 transition-colors">
                                                    Zoom In
                                                  </button>
                                                  <button className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm hover:bg-opacity-30 transition-colors">
                                                    Zoom Out
                                                  </button>
                                                  <button className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm hover:bg-opacity-30 transition-colors">
                                                    Fullscreen
                                                  </button>
                                                  <a
                                                    href={
                                                      playingResources[
                                                        resourceKey
                                                      ].url
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm hover:bg-opacity-30 transition-colors"
                                                  >
                                                    Open PDF
                                                  </a>
                                                </div>
                                              </div>
                                            </div>
                                            <div
                                              className="flex items-center justify-center h-full text-gray-500 bg-gray-50"
                                              style={{
                                                height: "calc(100% - 60px)",
                                              }}
                                            >
                                              <div className="text-center">
                                                <FileText className="w-16 h-16 mx-auto mb-4 text-red-400" />
                                                <p className="text-lg font-medium text-gray-700 mb-2">
                                                  PDF Document
                                                </p>
                                                <p className="text-sm text-gray-600 mb-3">
                                                  {
                                                    playingResources[
                                                      resourceKey
                                                    ].description
                                                  }
                                                </p>
                                                <div className="bg-white p-3 rounded border shadow-sm max-w-xs mx-auto">
                                                  <p className="text-xs text-gray-500 break-all">
                                                    {
                                                      playingResources[
                                                        resourceKey
                                                      ].url
                                                    }
                                                  </p>
                                                </div>
                                                <div className="mt-4 space-y-2">
                                                  <div className="flex justify-center space-x-2 text-sm text-gray-600">
                                                    <span>📄 Scrollable</span>
                                                    <span>🔍 Zoomable</span>
                                                    <span>
                                                      📱 Mobile Friendly
                                                    </span>
                                                  </div>
                                                  <button className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                                                    Load PDF Viewer
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                        {playingResources[resourceKey].type ===
                                          "image" && (
                                          <div
                                            className="relative w-full bg-white rounded-lg border overflow-hidden"
                                            style={{ height: "400px" }}
                                          >
                                            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-3 text-white">
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                  <Image className="w-5 h-5 mr-2" />
                                                  <span className="font-medium">
                                                    Image Viewer
                                                  </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                  <button className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm hover:bg-opacity-30 transition-colors">
                                                    Zoom In
                                                  </button>
                                                  <button className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm hover:bg-opacity-30 transition-colors">
                                                    Zoom Out
                                                  </button>
                                                  <button className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm hover:bg-opacity-30 transition-colors">
                                                    Fullscreen
                                                  </button>
                                                  <a
                                                    href={
                                                      playingResources[
                                                        resourceKey
                                                      ].url
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm hover:bg-opacity-30 transition-colors"
                                                  >
                                                    Open Image
                                                  </a>
                                                </div>
                                              </div>
                                            </div>
                                            <div
                                              className="flex items-center justify-center h-full text-gray-500 bg-gray-50"
                                              style={{
                                                height: "calc(100% - 60px)",
                                              }}
                                            >
                                              <div className="text-center">
                                                <Image className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
                                                <p className="text-lg font-medium text-gray-700 mb-2">
                                                  Image Viewer
                                                </p>
                                                <p className="text-sm text-gray-600 mb-3">
                                                  {
                                                    playingResources[
                                                      resourceKey
                                                    ].description
                                                  }
                                                </p>
                                                <div className="bg-white p-3 rounded border shadow-sm max-w-xs mx-auto">
                                                  <p className="text-xs text-gray-500 break-all">
                                                    {
                                                      playingResources[
                                                        resourceKey
                                                      ].url
                                                    }
                                                  </p>
                                                </div>
                                                <div className="mt-4 space-y-2">
                                                  <div className="flex justify-center space-x-2 text-sm text-gray-600">
                                                    <span>🖼️ High Quality</span>
                                                    <span>🔍 Zoom & Pan</span>
                                                    <span>📱 Responsive</span>
                                                  </div>
                                                  <button className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                                                    Load Image Viewer
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                        {playingResources[resourceKey].type ===
                                          "interactive" &&
                                          playingResources[resourceKey]
                                            .embedUrl && (
                                            <div
                                              className="relative w-full bg-white rounded-lg border"
                                              style={{ height: "500px" }}
                                            >
                                              <iframe
                                                className="w-full h-full rounded-lg"
                                                src={
                                                  playingResources[resourceKey]
                                                    .embedUrl
                                                }
                                                title={
                                                  playingResources[resourceKey]
                                                    .title
                                                }
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                              />
                                            </div>
                                          )}

                                        {playingResources[resourceKey].type ===
                                          "interactive" &&
                                          !playingResources[resourceKey]
                                            .embedUrl && (
                                            <div
                                              className="relative w-full bg-white rounded-lg border"
                                              style={{ height: "350px" }}
                                            >
                                              <div className="flex items-center justify-center h-full text-gray-500">
                                                <div className="text-center">
                                                  <Monitor className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                                  <p className="text-sm font-medium">
                                                    Interactive Tool
                                                  </p>
                                                  <p className="text-xs">
                                                    Interactive content would be
                                                    embedded here
                                                  </p>
                                                  <p className="text-xs mt-1 text-blue-600">
                                                    {
                                                      playingResources[
                                                        resourceKey
                                                      ].url
                                                    }
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          )}

                                        {playingResources[resourceKey].type ===
                                          "content" && (
                                          <div
                                            className="relative w-full bg-white rounded-lg border"
                                            style={{ minHeight: "300px" }}
                                          >
                                            <div
                                              className="p-4 h-full overflow-auto"
                                              dangerouslySetInnerHTML={{
                                                __html:
                                                  playingResources[resourceKey]
                                                    .content || "",
                                              }}
                                            />
                                          </div>
                                        )}

                                        {playingResources[resourceKey].type ===
                                          "presentation" &&
                                          playingResources[resourceKey]
                                            .embedUrl && (
                                            <div
                                              className="relative w-full bg-white rounded-lg border overflow-hidden"
                                              style={{ height: "600px" }}
                                            >
                                              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 text-white">
                                                <div className="flex items-center justify-between">
                                                  <div className="flex items-center">
                                                    <FileText className="w-5 h-5 mr-2" />
                                                    <span className="font-medium">
                                                      Slide Presentation
                                                    </span>
                                                  </div>
                                                  <div className="flex items-center space-x-2">
                                                    <button className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm hover:bg-opacity-30 transition-colors">
                                                      Fullscreen
                                                    </button>
                                                    <a
                                                      href={
                                                        playingResources[
                                                          resourceKey
                                                        ].url
                                                      }
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm hover:bg-opacity-30 transition-colors"
                                                    >
                                                      Download
                                                    </a>
                                                  </div>
                                                </div>
                                              </div>
                                              <iframe
                                                className="w-full h-full"
                                                src={
                                                  playingResources[resourceKey]
                                                    .embedUrl
                                                }
                                                title={
                                                  playingResources[resourceKey]
                                                    .title
                                                }
                                                frameBorder="0"
                                                allowFullScreen
                                                style={{
                                                  height: "calc(100% - 60px)",
                                                }}
                                              />
                                            </div>
                                          )}

                                        {playingResources[resourceKey].type ===
                                          "presentation" &&
                                          !playingResources[resourceKey]
                                            .embedUrl && (
                                            <div
                                              className="relative w-full bg-white rounded-lg border overflow-hidden"
                                              style={{ minHeight: "600px" }}
                                            >
                                              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 text-white">
                                                <div className="flex items-center justify-between">
                                                  <div className="flex items-center">
                                                    <FileText className="w-5 h-5 mr-2" />
                                                    <span className="font-medium">
                                                      {
                                                        playingResources[
                                                          resourceKey
                                                        ].title
                                                      }
                                                    </span>
                                                  </div>
                                                  <div className="flex items-center space-x-2">
                                                    <button className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm hover:bg-opacity-30 transition-colors">
                                                      Fullscreen
                                                    </button>
                                                    <button
                                                      onClick={() =>
                                                        window.print()
                                                      }
                                                      className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm hover:bg-opacity-30 transition-colors"
                                                    >
                                                      Print
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                              <div
                                                className="w-full overflow-auto"
                                                style={{ maxHeight: "80vh" }}
                                              >
                                                <div
                                                  className="w-full p-4"
                                                  dangerouslySetInnerHTML={{
                                                    __html:
                                                      playingResources[
                                                        resourceKey
                                                      ].content || "",
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          )}

                                        {playingResources[resourceKey].type ===
                                          "whiteboard" && (
                                          <div
                                            className="relative w-full bg-white rounded-lg border overflow-hidden"
                                            style={{ height: "500px" }}
                                          >
                                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 text-white">
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                  <PenTool className="w-5 h-5 mr-2" />
                                                  <span className="font-medium">
                                                    Digital Whiteboard
                                                  </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                  <Link
                                                    to={`/academics/digital-whiteboard-fullscreen/${
                                                      session.session_plan_id
                                                    }?title=${encodeURIComponent(
                                                      playingResources[
                                                        resourceKey
                                                      ].title
                                                    )}`}
                                                    className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm hover:bg-opacity-30 transition-colors"
                                                  >
                                                    Open Whiteboard
                                                  </Link>
                                                </div>
                                              </div>
                                            </div>
                                            <div
                                              className="flex items-center justify-center h-full text-gray-500 bg-white"
                                              style={{
                                                height: "calc(100% - 60px)",
                                              }}
                                            >
                                              <div className="text-center">
                                                <PenTool className="w-16 h-16 mx-auto mb-4 text-indigo-400" />
                                                <p className="text-lg font-medium text-gray-700 mb-2">
                                                  Interactive Whiteboard
                                                </p>
                                                <p className="text-sm text-gray-600 mb-3">
                                                  {
                                                    playingResources[
                                                      resourceKey
                                                    ].description
                                                  }
                                                </p>
                                                <div className="mt-4 space-y-2">
                                                  <div className="flex justify-center space-x-2 text-sm text-gray-600">
                                                    <span>✏️ Draw & Write</span>
                                                    <span>
                                                      🎨 Multiple Colors
                                                    </span>
                                                    <span>
                                                      💾 Save & Export
                                                    </span>
                                                  </div>
                                                  <Link
                                                    to={`/academics/digital-whiteboard-fullscreen/${
                                                      session.session_plan_id
                                                    }?title=${encodeURIComponent(
                                                      playingResources[
                                                        resourceKey
                                                      ].title
                                                    )}`}
                                                    className="inline-block px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                                                  >
                                                    Launch Whiteboard
                                                  </Link>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                        {playingResources[resourceKey]
                                          .description && (
                                          <div className="mt-3 p-3 bg-white rounded border">
                                            <p className="text-sm text-gray-600">
                                              {
                                                playingResources[resourceKey]
                                                  .description
                                              }
                                            </p>
                                          </div>
                                        )}

                                        {/* Resource Navigation */}
                                        {resourceSection.items.length > 1 && (
                                          <div className="mt-3 flex justify-center gap-2 flex-wrap">
                                            {resourceSection.items.map(
                                              (item, itemIndex) => (
                                                <button
                                                  key={item.id}
                                                  onClick={() =>
                                                    playResource(
                                                      resourceKey,
                                                      item
                                                    )
                                                  }
                                                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                                    playingResources[
                                                      resourceKey
                                                    ]?.id === item.id
                                                      ? `${colors.bg} ${colors.text} ring-2 ring-opacity-50`
                                                      : `bg-white ${colors.text} border ${colors.border} hover:${colors.bg}`
                                                  }`}
                                                >
                                                  {itemIndex + 1}
                                                </button>
                                              )
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                            );
                          })()}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
