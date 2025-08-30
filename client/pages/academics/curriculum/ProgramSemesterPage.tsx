import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import {
  ChevronLeft,
  Eye,
  BookOpen,
  Clock,
  Users,
  Target,
  GraduationCap,
  Calculator,
  Award,
  Filter,
  Plus,
  Edit,
} from "lucide-react";

interface Program {
  id: string;
  name: string;
  code: string;
  level: string;
  type: string;
  department: string;
  duration: number;
  totalCredits: number;
  totalStudents: number;
  description: string;
  status: string;
  specializations: string[];
}

interface Subject {
  id: string;
  code: string;
  name: string;
  type:
    | "Theory"
    | "Practical"
    | "Lab"
    | "Project"
    | "Practicum"
    | "Advanced Skill Certification"
    | "Integrated Learning Experience"
    | "Internship";
  credits: number;
  lectureHours: number;
  tutorialHours: number;
  practicalHours: number;
  semester: number;
  regulationYear: string;
  programId: string;
  prerequisites: string[];
  courseOutcomes: string[];
  category:
    | "Core"
    | "Professional Core"
    | "Program Core"
    | "Professional Elective"
    | "Program Elective"
    | "Open Elective"
    | "Mandatory"
    | "Engineering Science"
    | "Audit Course"
    | "Humanities & Social Science"
    | "Project/Internship";
  marks: number;
  status: "active" | "inactive" | "draft";
  description?: string;
  syllabus?: string[];
  textbooks?: string[];
  references?: string[];
}

export default function ProgramSemesterPage() {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();

  const [program, setProgram] = useState<Program | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(
    null
  );

  useEffect(() => {
    const loadProgramData = async () => {
      try {
        // Load program data with proper base URL (relative path) and safe fallback
        const baseUrl =
          typeof import.meta !== "undefined" && import.meta.env
            ? import.meta.env.BASE_URL || "/"
            : "/";
        const programUrl = `${baseUrl}program.json`;
        let programData: Program[] = [];
        try {
          const res = await fetch(programUrl, {
            headers: { "Cache-Control": "no-cache" },
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          programData = await res.json();
        } catch (e1) {
          try {
            const resRoot = await fetch("/program.json", {
              headers: { "Cache-Control": "no-cache" },
            });
            if (!resRoot.ok) throw new Error(`HTTP ${resRoot.status}`);
            programData = await resRoot.json();
          } catch (e2) {
            console.warn(
              "Failed to fetch program.json, using fallback data",
              e1,
              e2
            );
            programData = [
              {
                id: "C025",
                name: "ELECTRONICS AND COMMUNICATION ENGINEERING (FULL TIME)",
                code: "1040",
                level: "UG",
                type: "Full-time",
                department: "Electronics Engineering",
                duration: 4,
                totalCredits: 120,
                totalStudents: 1000,
                description:
                  "Electronics and communication engineering with digital systems focus.",
                status: "active",
                specializations: [],
              },
              {
                id: "C037",
                name: "COMPUTER ENGINEERING (FULL TIME)",
                code: "1052",
                level: "UG",
                type: "Full-time",
                department: "Computer Science",
                duration: 4,
                totalCredits: 120,
                totalStudents: 900,
                description:
                  "Computer engineering with embedded systems and hardware focus.",
                status: "active",
                specializations: [],
              },
            ];
          }
        }
        const foundProgram = programData.find(
          (p: Program) => p.id === programId
        );

        if (foundProgram) {
          setProgram(foundProgram);

          // Check if this is Electronics and Communication Engineering program
          const isECEProgram =
            foundProgram.name.toLowerCase().includes("electronics") &&
            foundProgram.name.toLowerCase().includes("communication");

          if (isECEProgram) {
            // ECE All Semesters (3-8) course data
            const eceAllSubjects: Subject[] = [
              {
                id: "SUB301",
                code: "1040233110",
                name: "Electronic Devices and Circuits",
                type: "Theory",
                credits: 4,
                lectureHours: 4,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: ["SUB2010"],
                courseOutcomes: ["CO311", "CO312", "CO313"],
                category: "Program Core",
                marks: 100,
                status: "active",
              },
              {
                id: "SUB302",
                code: "1040233210",
                name: "Digital Electronics",
                type: "Theory",
                credits: 4,
                lectureHours: 4,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: ["SUB2020"],
                courseOutcomes: ["CO321", "CO322", "CO323"],
                category: "Program Core",
                marks: 100,
                status: "active",
              },
              {
                id: "SUB303",
                code: "1040233320",
                name: "Electronic Devices and Circuits Practical",
                type: "Practical",
                credits: 2,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 4,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: ["SUB301"],
                courseOutcomes: ["CO331", "CO332", "CO333"],
                category: "Program Core",
                marks: 100,
                status: "active",
              },
              {
                id: "SUB304",
                code: "1040233420",
                name: "Digital Electronics Practical",
                type: "Practical",
                credits: 2,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 4,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: ["SUB302"],
                courseOutcomes: ["CO341", "CO342", "CO343"],
                category: "Program Core",
                marks: 100,
                status: "active",
              },
              {
                id: "SUB305",
                code: "1040233540",
                name: "Linear Integrated Circuits",
                type: "Practical",
                credits: 3,
                lectureHours: 1,
                tutorialHours: 0,
                practicalHours: 4,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: ["SUB302"],
                courseOutcomes: ["CO351", "CO352", "CO353"],
                category: "Program Core",
                marks: 100,
                status: "active",
              },
              {
                id: "SUB306",
                code: "1040233640",
                name: "Electrical Circuits and Machines",
                type: "Practical",
                credits: 2,
                lectureHours: 1,
                tutorialHours: 0,
                practicalHours: 2,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: ["SUB2040"],
                courseOutcomes: ["CO361", "CO362", "CO363"],
                category: "Engineering Science",
                marks: 100,
                status: "active",
              },
              {
                id: "SUB307",
                code: "1040233760",
                name: "Advanced Skills Certification-3",
                type: "Advanced Skill Certification",
                credits: 2,
                lectureHours: 2,
                tutorialHours: 0,
                practicalHours: 2,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO371", "CO372", "CO373"],
                category: "Open Elective",
                marks: 100,
                status: "active",
                description:
                  "Certification-based elective course focusing on advanced technical and professional skills.",
                syllabus: [
                  "Module 1: Advanced Concepts",
                  "Module 2: Tools and Technologies",
                  "Module 3: Case Studies",
                  "Module 4: Industry Projects",
                  "Module 5: Certification Assessment",
                ],
                textbooks: ["Skill Development Certification Material"],
                references: ["Industry Standard Guides"],
              },
              {
                id: "SUB308",
                code: "1040233880",
                name: "Growth Lab",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 3,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO381", "CO382"],
                category: "Humanities & Social Science",
                marks: 0,
                status: "active",
                description:
                  "Interactive lab fostering personal growth, leadership, and collaboration.",
                syllabus: [
                  "Module 1: Self Development",
                  "Module 2: Communication Skills",
                  "Module 3: Team Activities",
                  "Module 4: Leadership Exercises",
                  "Module 5: Reflection and Feedback",
                ],
                textbooks: ["Personal Development Handbooks"],
                references: ["Soft Skills Training Materials"],
              },
              {
                id: "SUB309",
                code: "1040233981",
                name: "Induction Program-II",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO391", "CO392"],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description:
                  "Orientation and induction program to integrate students with institutional culture and values.",
                syllabus: [
                  "Module 1: Orientation",
                  "Module 2: Academic Resources",
                  "Module 3: Institutional Values",
                  "Module 4: Student Engagement",
                  "Module 5: Reflection",
                ],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB310",
                code: "1040233982",
                name: "I&E/ Club Activity / Community Initiatives",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO3101", "CO3102"],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description:
                  "Engagement in innovation, entrepreneurship, clubs, or community-driven activities.",
                syllabus: [
                  "Module 1: Community Initiatives",
                  "Module 2: Club Engagement",
                  "Module 3: Innovation Activities",
                  "Module 4: Leadership Participation",
                ],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB311",
                code: "1040233985",
                name: "Emerging Technology Seminars",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO3111", "CO3112"],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description:
                  "Seminar series exploring cutting-edge technologies and research trends.",
                syllabus: [
                  "Module 1: Guest Lectures",
                  "Module 2: Research Presentations",
                  "Module 3: Industry Interaction",
                ],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB312",
                code: "1040233983",
                name: "Shop floor Immersion",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO3121", "CO3122"],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description:
                  "Immersive program providing exposure to industrial shop floor practices.",
                syllabus: [
                  "Module 1: Industry Introduction",
                  "Module 2: Safety Training",
                  "Module 3: Process Observation",
                  "Module 4: Reporting",
                ],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB313",
                code: "1040233986",
                name: "Health & Wellness",
                type: "Integrated Learning Experience",
                credits: 1,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 2,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO3131", "CO3132"],
                category: "Audit Course",
                marks: 100,
                status: "active",
                description:
                  "Promotes physical fitness and wellness through structured activities.",
                syllabus: [
                  "Module 1: Physical Fitness",
                  "Module 2: Yoga and Meditation",
                  "Module 3: Lifestyle Awareness",
                  "Module 4: Wellness Activities",
                ],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB314",
                code: "1040233984",
                name: "Student-Led Initiative",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO3141", "CO3142"],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description:
                  "Student-driven projects and activities fostering leadership and creativity.",
                syllabus: [
                  "Module 1: Idea Proposal",
                  "Module 2: Planning",
                  "Module 3: Execution",
                  "Module 4: Presentation",
                ],
                textbooks: [],
                references: [],
              },

              // Semester 4 courses (ECE)
              {
                id: "SUB401",
                code: "1040234110",
                name: "Microcontroller",
                type: "Theory",
                credits: 4,
                lectureHours: 4,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 4,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: ["SUB301"],
                courseOutcomes: ["CO411", "CO412", "CO413"],
                category: "Program Core",
                marks: 100,
                status: "active",
                description:
                  "Covers architecture, programming, and applications of microcontrollers.",
                syllabus: [
                  "Module 1: Microcontroller Architecture",
                  "Module 2: Assembly Language Programming",
                  "Module 3: Interfacing Techniques",
                  "Module 4: Embedded Applications",
                  "Module 5: Case Studies",
                ],
                textbooks: [
                  "The 8051 Microcontroller - Mazidi",
                  "Embedded Systems - Raj Kamal",
                ],
                references: [
                  "IEEE Transactions on Embedded Systems",
                  "Microcontroller Application Notes",
                ],
              },
              {
                id: "SUB402",
                code: "1040234210",
                name: "Data Communication and Networking",
                type: "Theory",
                credits: 3,
                lectureHours: 3,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 4,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: ["SUB302"],
                courseOutcomes: ["CO421", "CO422", "CO423"],
                category: "Program Core",
                marks: 100,
                status: "active",
                description:
                  "Introduces principles of data communication, networking protocols, and technologies.",
                syllabus: [
                  "Module 1: Introduction to Data Communication",
                  "Module 2: Network Models",
                  "Module 3: Transmission Media",
                  "Module 4: Switching and Routing",
                  "Module 5: Network Security",
                ],
                textbooks: [
                  "Data Communications and Networking - Behrouz A. Forouzan",
                  "Computer Networking - Andrew S. Tanenbaum",
                ],
                references: [
                  "IEEE Communications Magazine",
                  "Network Protocol Standards",
                ],
              },
              {
                id: "SUB403",
                code: "1040234340",
                name: "Basics of Communication Engineering",
                type: "Practicum",
                credits: 3,
                lectureHours: 1,
                tutorialHours: 0,
                practicalHours: 4,
                semester: 4,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: ["SUB302"],
                courseOutcomes: ["CO431", "CO432", "CO433"],
                category: "Program Core",
                marks: 100,
                status: "active",
                description:
                  "Provides practical knowledge of communication systems and signal transmission.",
                syllabus: [
                  "Module 1: Analog Communication Basics",
                  "Module 2: Modulation Techniques",
                  "Module 3: Demodulation Methods",
                  "Module 4: Signal Transmission",
                  "Module 5: Case Studies",
                ],
                textbooks: [
                  "Communication Systems - Simon Haykin",
                  "Principles of Communication Engineering - Taub & Schilling",
                ],
                references: [
                  "IEEE Transactions on Communication",
                  "Modern Communication Systems Handbooks",
                ],
              },
              {
                id: "SUB404",
                code: "1040234440",
                name: "Measuring Instruments and Sensors",
                type: "Practicum",
                credits: 3,
                lectureHours: 1,
                tutorialHours: 0,
                practicalHours: 4,
                semester: 4,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: ["SUB305"],
                courseOutcomes: ["CO441", "CO442", "CO443"],
                category: "Program Core",
                marks: 100,
                status: "active",
                description:
                  "Covers fundamentals and applications of measurement systems and sensors.",
                syllabus: [
                  "Module 1: Measurement Basics",
                  "Module 2: Sensors and Transducers",
                  "Module 3: Signal Conditioning",
                  "Module 4: Digital Instruments",
                  "Module 5: Case Studies",
                ],
                textbooks: [
                  "A Course in Electrical and Electronic Measurements - A.K. Sawhney",
                  "Sensor Technology Handbook",
                ],
                references: [
                  "IEEE Transactions on Instrumentation",
                  "Measurement Standards and Guidelines",
                ],
              },
              {
                id: "SUB405",
                code: "1040234540",
                name: "Programming in C",
                type: "Practicum",
                credits: 3,
                lectureHours: 1,
                tutorialHours: 0,
                practicalHours: 4,
                semester: 4,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO451", "CO452", "CO453"],
                category: "Engineering Science",
                marks: 100,
                status: "active",
                description:
                  "Introduces structured programming in C with practical exposure.",
                syllabus: [
                  "Module 1: Basics of C Language",
                  "Module 2: Control Structures",
                  "Module 3: Functions and Arrays",
                  "Module 4: Pointers and Structures",
                  "Module 5: File Handling",
                ],
                textbooks: [
                  "Programming in ANSI C - E. Balagurusamy",
                  "The C Programming Language - Kernighan & Ritchie",
                ],
                references: [
                  "ACM Digital Library C Programming Papers",
                  "C Programming Practice Guides",
                ],
              },
              {
                id: "SUB406",
                code: "1040234652",
                name: "Microcontroller Practical",
                type: "Project",
                credits: 2,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 4,
                semester: 4,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: ["SUB401"],
                courseOutcomes: ["CO461", "CO462", "CO463"],
                category: "Program Core",
                marks: 100,
                status: "active",
                description:
                  "Hands-on project-based training with microcontroller programming and applications.",
                syllabus: [
                  "Module 1: Microcontroller Programming",
                  "Module 2: Interfacing Experiments",
                  "Module 3: Embedded Applications",
                  "Module 4: Project Development",
                ],
                textbooks: ["Embedded C Programming - Michael J. Pont"],
                references: [
                  "IEEE Transactions on Embedded Systems",
                  "Microcontroller Lab Manuals",
                ],
              },
              {
                id: "SUB407",
                code: "1040234760",
                name: "Advanced Skills Certification-4",
                type: "Advanced Skill Certification",
                credits: 2,
                lectureHours: 2,
                tutorialHours: 0,
                practicalHours: 2,
                semester: 4,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO471", "CO472", "CO473"],
                category: "Open Elective",
                marks: 100,
                status: "active",
                description:
                  "Certification-based elective course focusing on advanced emerging skills.",
                syllabus: [
                  "Module 1: Advanced Skill Concepts",
                  "Module 2: Industry Tools",
                  "Module 3: Practical Implementation",
                  "Module 4: Case Studies",
                  "Module 5: Certification Assessment",
                ],
                textbooks: ["Skill Development Module"],
                references: ["Industry Training Guides"],
              },
              {
                id: "SUB409",
                code: "1040234882",
                name: "I&E/Club Activity/Community Initiatives",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 4,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO491", "CO492"],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description:
                  "Engagement in innovation, entrepreneurship, clubs, or community-driven initiatives.",
                syllabus: [
                  "Module 1: Community Work",
                  "Module 2: Club Activities",
                  "Module 3: Innovation Activities",
                ],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB410",
                code: "1040234887",
                name: "Special Interest Groups (Placement Training)",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 4,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO4101", "CO4102"],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description:
                  "Special interest or placement-oriented training sessions.",
                syllabus: [
                  "Module 1: Placement Preparation",
                  "Module 2: Technical Training",
                  "Module 3: Mock Tests",
                ],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB411",
                code: "1040234885",
                name: "Emerging Technology Seminars",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 4,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO4111", "CO4112"],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description:
                  "Seminar series exploring new and emerging technologies.",
                syllabus: [
                  "Module 1: Research Seminars",
                  "Module 2: Industry Lectures",
                ],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB412",
                code: "1040234883",
                name: "Shop Floor Immersion",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 4,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO4121", "CO4122"],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description:
                  "Industrial immersion program offering practical shop floor exposure.",
                syllabus: [
                  "Module 1: Industry Visits",
                  "Module 2: Safety Training",
                  "Module 3: Process Understanding",
                ],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB413",
                code: "1040234886",
                name: "Health & Wellness",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 4,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO4131", "CO4132"],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description:
                  "Wellness course for physical fitness, yoga, and mindfulness practices.",
                syllabus: [
                  "Module 1: Physical Exercises",
                  "Module 2: Yoga and Meditation",
                  "Module 3: Wellness Awareness",
                ],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB414",
                code: "1040234884",
                name: "Student Led Initiative",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 4,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO4141", "CO4142"],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description:
                  "Student-driven initiatives and projects focusing on leadership and innovation.",
                syllabus: [
                  "Module 1: Idea Generation",
                  "Module 2: Team Collaboration",
                  "Module 3: Project Execution",
                  "Module 4: Presentation",
                ],
                textbooks: [],
                references: [],
              },
            ];

            // Semester 5 courses - Real data
            const semester5Subjects: Subject[] = [
              {
                id: "SUB501",
                code: "1040235130",
                name: "Advanced Communication Systems",
                type: "Practicum",
                credits: 3,
                lectureHours: 2,
                tutorialHours: 0,
                practicalHours: 2,
                semester: 5,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO511", "CO512", "CO513"],
                category: "Program Core",
                marks: 100,
                status: "active",
                description:
                  "Covers the fundamentals of advanced communication techniques and practical implementations.",
                syllabus: [
                  "Module 1: Communication Theory",
                  "Module 2: Digital Modulation",
                  "Module 3: Multiplexing Techniques",
                  "Module 4: Error Control Coding",
                  "Module 5: Case Studies",
                ],
                textbooks: [
                  "Digital and Analog Communication Systems - Leon W. Couch",
                  "Communication Systems - Simon Haykin",
                ],
                references: [
                  "IEEE Transactions on Communications",
                  "International Journal of Communication Systems",
                ],
              },
              {
                id: "SUB502",
                code: "1040235230",
                name: "Mobile Communication",
                type: "Practicum",
                credits: 3,
                lectureHours: 2,
                tutorialHours: 0,
                practicalHours: 2,
                semester: 5,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO521", "CO522", "CO523"],
                category: "Program Core",
                marks: 100,
                status: "active",
                description:
                  "Introduction to mobile communication systems, cellular technologies and applications.",
                syllabus: [
                  "Module 1: Cellular Concepts",
                  "Module 2: GSM and CDMA Systems",
                  "Module 3: LTE and 5G Networks",
                  "Module 4: Mobile Data Services",
                  "Module 5: Case Studies",
                ],
                textbooks: [
                  "Mobile Communications - Jochen Schiller",
                  "Wireless Communications - Theodore Rappaport",
                ],
                references: [
                  "IEEE Transactions on Mobile Computing",
                  "Wireless Personal Communications Journal",
                ],
              },
              {
                id: "SUB503",
                code: "104023531X",
                name: "Elective - 1",
                type: "Theory",
                credits: 3,
                lectureHours: 3,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 5,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO531", "CO532", "CO533"],
                category: "Program Elective",
                marks: 100,
                status: "active",
                description:
                  "Elective subject chosen by the student in consultation with department.",
                syllabus: ["Defined by department based on elective chosen"],
                textbooks: ["As per elective selection"],
                references: ["As per elective selection"],
              },
              {
                id: "SUB504",
                code: "1040235440",
                name: "Embedded Systems",
                type: "Practicum",
                credits: 4,
                lectureHours: 2,
                tutorialHours: 0,
                practicalHours: 4,
                semester: 5,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO541", "CO542", "CO543"],
                category: "Program Core",
                marks: 100,
                status: "active",
                description:
                  "Introduction to embedded system design and real-time applications.",
                syllabus: [
                  "Module 1: Embedded System Basics",
                  "Module 2: Microcontrollers",
                  "Module 3: Real-Time Operating Systems",
                  "Module 4: Interfaces and Peripherals",
                  "Module 5: Case Studies",
                ],
                textbooks: [
                  "Embedded Systems - Raj Kamal",
                  "Introduction to Embedded Systems - Shibu K V",
                ],
                references: [
                  "IEEE Embedded Systems Letters",
                  "Microprocessors and Microsystems Journal",
                ],
              },
              {
                id: "SUB505",
                code: "104023554X",
                name: "Elective - 2",
                type: "Practicum",
                credits: 3,
                lectureHours: 1,
                tutorialHours: 0,
                practicalHours: 4,
                semester: 5,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO551", "CO552", "CO553"],
                category: "Program Elective",
                marks: 100,
                status: "active",
                description:
                  "Practical elective subject chosen by the student.",
                syllabus: ["Defined by department based on elective chosen"],
                textbooks: ["As per elective selection"],
                references: ["As per elective selection"],
              },
              {
                id: "SUB506",
                code: "1040235660",
                name: "Advanced Skills Certification – 5",
                type: "Advanced Skill Certification",
                credits: 2,
                lectureHours: 2,
                tutorialHours: 0,
                practicalHours: 2,
                semester: 5,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO561", "CO562"],
                category: "Open Elective",
                marks: 0,
                status: "active",
                description:
                  "Skill-oriented elective certification to enhance employability.",
                syllabus: ["Defined by certifying authority"],
                textbooks: ["As provided by certification partner"],
                references: ["Industry manuals", "Skill training resources"],
              },
              {
                id: "SUB507",
                code: "1040235752",
                name: "Innovation & Startup",
                type: "Practicum",
                credits: 2,
                lectureHours: 1,
                tutorialHours: 0,
                practicalHours: 2,
                semester: 5,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO571", "CO572"],
                category: "Humanities & Social Science",
                marks: 100,
                status: "active",
                description:
                  "Course designed to promote entrepreneurship, innovation and startup culture.",
                syllabus: [
                  "Module 1: Innovation Principles",
                  "Module 2: Startup Models",
                  "Module 3: Business Plan Development",
                  "Module 4: Case Studies",
                ],
                textbooks: ["Entrepreneurship Development - S.S. Khanka"],
                references: [
                  "Harvard Business Review on Innovation",
                  "Journal of Entrepreneurship",
                ],
              },
              {
                id: "SUB508",
                code: "1040235873",
                name: "Industrial Training (Summer Vacation - 90 Hours)",
                type: "Internship",
                credits: 2,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 5,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO581", "CO582"],
                category: "Project/Internship",
                marks: 100,
                status: "active",
                description:
                  "Hands-on industrial training for real-world exposure.",
                syllabus: ["Training modules as per industry placement"],
                textbooks: ["Provided by industry partner"],
                references: ["Industry standards and manuals"],
              },
              {
                id: "SUB509",
                code: "1040235981",
                name: "Induction program III",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 5,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: [],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description: "Audit course for student induction.",
                syllabus: ["As defined by institute"],
                textbooks: ["As assigned by faculty"],
                references: ["NA"],
              },
              {
                id: "SUB510",
                code: "1040235987",
                name: "Special Interest Groups (Placement Training)",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 5,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: [],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description:
                  "Placement training and special interest activities.",
                syllabus: ["Training as per placement cell"],
                textbooks: ["NA"],
                references: ["NA"],
              },
              {
                id: "SUB511",
                code: "1040235986",
                name: "Health & Wellness",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 5,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: [],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description:
                  "Audit course promoting health awareness and fitness.",
                syllabus: ["Defined by institute"],
                textbooks: ["NA"],
                references: ["NA"],
              },
              {
                id: "SUB512",
                code: "1040235984",
                name: "Student-Led Initiative",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 5,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: [],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description:
                  "Student initiative activity to build leadership skills.",
                syllabus: ["Planned and executed by students"],
                textbooks: ["NA"],
                references: ["NA"],
              },
            ];

            // Semester 6 courses - Real data
            const semester6Subjects: any[] = [
              {
                CourseCategory: "Open Elective",
                CourseType: "Theory",
                Code: "600023611X",
                CourseTitle: "Elective-3 (Pathway)",
                LTP: "3-0-0",
                Period: 45,
                Credit: 3,
                EndExam: "Theory",
              },
              {
                CourseCategory: "Open Elective",
                CourseType: "Practicum",
                Code: "104023624X",
                CourseTitle: "Elective-4 (Specialization)",
                LTP: "1-0-4",
                Period: 75,
                Credit: 3,
                EndExam: "Practical",
              },
              {
                CourseCategory: "Project / Internship",
                CourseType: "Project / Internship",
                Code: "1040236351",
                CourseTitle: "Internship",
                LTP: "-",
                Period: 540,
                Credit: 12,
                EndExam: "Project",
              },
              {
                CourseCategory: "Project / Internship",
                CourseType: "Project / Internship",
                Code: "1040236353",
                CourseTitle: "Fellowship",
                LTP: "-",
                Period: 540,
                Credit: 12,
                EndExam: "Project",
              },
              {
                CourseCategory: "Project / Internship",
                CourseType: "Project / Internship",
                Code: "1040236374",
                CourseTitle: "In-house Project",
                LTP: "-",
                Period: 540,
                Credit: 12,
                EndExam: "Project",
              },
              {
                CourseCategory: "Project / Internship",
                CourseType: "Project / Internship",
                Code: "2040236374",
                CourseTitle: "Industrial Training (SW)",
                LTP: "-",
                Period: 540,
                Credit: 12,
                EndExam: "Project",
              },
            ];

            eceAllSubjects.push(...(semester6Subjects as any));

            setSubjects(eceAllSubjects);
            setSelectedSemester(null); // Show all semesters for ECE
          } else if (
            (foundProgram.name || "").toLowerCase().includes("computer") &&
            (foundProgram.name || "").toLowerCase().includes("engineering") &&
            ((foundProgram.name || "").toLowerCase().includes("full time") ||
              (foundProgram.type || "").toLowerCase().includes("full"))
          ) {
            // Computer Engineering (Full Time) - Use provided Semester 3 and 4 data and hide Sem 1 & 2
            const ceSubjects: Subject[] = [
              {
                id: "SUB301",
                code: "1052233110",
                name: "Digital Logic Design",
                type: "Theory",
                credits: 3,
                lectureHours: 3,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO311", "CO312", "CO313"],
                category: "Program Core",
                marks: 100,
                status: "active",
                description:
                  "Covers fundamentals of logic gates, combinational and sequential circuits, and digital system design.",
                syllabus: [
                  "Module 1: Number Systems and Logic Gates",
                  "Module 2: Boolean Algebra and Simplification",
                  "Module 3: Combinational Circuits",
                  "Module 4: Sequential Circuits",
                  "Module 5: Digital Applications",
                ],
                textbooks: ["Digital Design - M. Morris Mano"],
                references: ["IEEE Transactions on Computers"],
              },
              {
                id: "SUB302",
                code: "1052233220",
                name: "RDBMS",
                type: "Practicum",
                credits: 4,
                lectureHours: 3,
                tutorialHours: 0,
                practicalHours: 2,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO321", "CO322", "CO323"],
                category: "Program Core",
                marks: 100,
                status: "active",
                description:
                  "Introduces relational database concepts, SQL, normalization, and transaction management.",
                syllabus: [
                  "Module 1: Introduction to Databases",
                  "Module 2: ER Modeling",
                  "Module 3: SQL Queries",
                  "Module 4: Normalization",
                  "Module 5: Transactions & Security",
                ],
                textbooks: ["Database System Concepts - Silberschatz"],
                references: ["ACM Transactions on Database Systems"],
              },
              {
                id: "SUB303",
                code: "1052233320",
                name: "Digital Logic Design Lab",
                type: "Practical",
                credits: 2,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 4,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: ["SUB301"],
                courseOutcomes: ["CO331", "CO332"],
                category: "Program Core",
                marks: 100,
                status: "active",
                description:
                  "Hands-on experiments with digital logic design, gates, flip-flops, and counters.",
                syllabus: [
                  "Module 1: Logic Gate Experiments",
                  "Module 2: Adder/Subtractor",
                  "Module 3: Multiplexers/Demultiplexers",
                  "Module 4: Flip-Flops",
                  "Module 5: Counters and Registers",
                ],
                textbooks: ["Digital Design - M. Morris Mano"],
                references: [],
              },
              {
                id: "SUB304",
                code: "1052233440",
                name: "C Programming",
                type: "Practicum",
                credits: 3,
                lectureHours: 1,
                tutorialHours: 0,
                practicalHours: 4,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO341", "CO342", "CO343"],
                category: "Program Core",
                marks: 100,
                status: "active",
                description:
                  "Covers programming fundamentals including control structures, arrays, functions, and pointers.",
                syllabus: [
                  "Module 1: Basics of C",
                  "Module 2: Control Structures",
                  "Module 3: Functions",
                  "Module 4: Arrays & Strings",
                  "Module 5: Pointers",
                ],
                textbooks: ["Let Us C - Yashavant Kanetkar"],
                references: [],
              },
              {
                id: "SUB305",
                code: "1052233540",
                name: "Web Designing",
                type: "Practicum",
                credits: 3,
                lectureHours: 1,
                tutorialHours: 0,
                practicalHours: 4,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO351", "CO352"],
                category: "Program Core",
                marks: 100,
                status: "active",
                description:
                  "Introduces HTML, CSS, JavaScript, and basics of responsive design.",
                syllabus: [
                  "Module 1: HTML Basics",
                  "Module 2: CSS Styling",
                  "Module 3: JavaScript Basics",
                  "Module 4: Forms and Validation",
                  "Module 5: Responsive Design",
                ],
                textbooks: ["HTML & CSS - Jon Duckett"],
                references: [],
              },
              {
                id: "SUB306",
                code: "1052233640",
                name: "Operating Systems",
                type: "Practicum",
                credits: 2,
                lectureHours: 1,
                tutorialHours: 0,
                practicalHours: 2,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO361", "CO362"],
                category: "Program Core",
                marks: 100,
                status: "active",
                description:
                  "Covers process management, memory management, file systems, and OS design principles.",
                syllabus: [
                  "Module 1: Introduction to OS",
                  "Module 2: Process Management",
                  "Module 3: Memory Management",
                  "Module 4: File Systems",
                  "Module 5: OS Case Studies",
                ],
                textbooks: ["Operating System Concepts - Silberschatz"],
                references: [],
              },
              {
                id: "SUB307",
                code: "1052233760",
                name: "Advanced Skills Certification - 3",
                type: "Advanced Skill Certification",
                credits: 2,
                lectureHours: 1,
                tutorialHours: 0,
                practicalHours: 3,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO371"],
                category: "Open Elective",
                marks: 100,
                status: "active",
                description:
                  "Skill-based elective focusing on practical applications.",
                syllabus: [
                  "Module 1: Certification Topic Overview",
                  "Module 2: Practical Training",
                  "Module 3: Case Studies",
                ],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB308",
                code: "1052233880",
                name: "Growth Lab",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 2,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO381"],
                category: "Humanities & Social Science",
                marks: 0,
                status: "active",
                description:
                  "Growth-oriented interdisciplinary lab activities.",
                syllabus: [
                  "Module 1: Team Activities",
                  "Module 2: Soft Skills",
                  "Module 3: Innovation Practices",
                ],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB309",
                code: "1052233881",
                name: "Induction Program II",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: [],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description: "Orientation and induction program for students.",
                syllabus: [],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB310",
                code: "1052233882",
                name: "I&E/ Club Activity / Community Initiatives",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: [],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description:
                  "Participation in innovation, entrepreneurship, and community activities.",
                syllabus: [],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB311",
                code: "1052233883",
                name: "Shop Floor Immersion",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: [],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description:
                  "Practical exposure to shop floor and industry practices.",
                syllabus: [],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB312",
                code: "1052233884",
                name: "Student-Led Initiative",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: [],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description: "Projects and initiatives led by students.",
                syllabus: [],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB313",
                code: "1052233885",
                name: "Emerging Technology Seminars",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: [],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description: "Seminars on latest technology trends.",
                syllabus: [],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB314",
                code: "1052233886",
                name: "Health & Wellness",
                type: "Integrated Learning Experience",
                credits: 1,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 2,
                semester: 3,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: [],
                category: "Audit Course",
                marks: 100,
                status: "active",
                description: "Health and wellness activities.",
                syllabus: [],
                textbooks: [],
                references: [],
              },
            ];

            // Semester 4 (CE) - Provided JSON courses
            const ceSem4Subjects: Subject[] = [
              {
                id: "SUB401",
                code: "1052234110",
                name: "Computer Networks and Security",
                type: "Theory",
                credits: 3,
                lectureHours: 3,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 4,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO411", "CO412", "CO413"],
                category: "Program Core",
                marks: 100,
                status: "active",
                description:
                  "Covers fundamentals of computer networking and cybersecurity principles.",
                syllabus: [
                  "Module 1: Network Basics",
                  "Module 2: Data Link and Network Layer",
                  "Module 3: Transport and Application Layer",
                  "Module 4: Network Security",
                  "Module 5: Case Studies",
                ],
                textbooks: ["Computer Networks - Andrew Tanenbaum"],
                references: ["IEEE Communications Magazine"],
              },
              {
                id: "SUB402",
                code: "1052234230",
                name: "Data Structures Using Python",
                type: "Practicum",
                credits: 4,
                lectureHours: 3,
                tutorialHours: 0,
                practicalHours: 2,
                semester: 4,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO421", "CO422", "CO423"],
                category: "Program Core",
                marks: 100,
                status: "active",
                description:
                  "Covers linear and non-linear data structures implementation using Python.",
                syllabus: [
                  "Module 1: Arrays and Strings",
                  "Module 2: Stacks and Queues",
                  "Module 3: Linked Lists",
                  "Module 4: Trees",
                  "Module 5: Graphs",
                ],
                textbooks: [
                  "Data Structures and Algorithms in Python - Goodrich",
                ],
                references: [],
              },
              {
                id: "SUB403",
                code: "1052234340",
                name: "Java Programming",
                type: "Practicum",
                credits: 4,
                lectureHours: 2,
                tutorialHours: 0,
                practicalHours: 4,
                semester: 4,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO431", "CO432", "CO433"],
                category: "Program Core",
                marks: 100,
                status: "active",
                description:
                  "Object-oriented programming concepts and advanced features using Java.",
                syllabus: [
                  "Module 1: Basics of Java",
                  "Module 2: OOP Concepts",
                  "Module 3: Exception Handling",
                  "Module 4: Multithreading",
                  "Module 5: JavaFX / GUI Programming",
                ],
                textbooks: ["Core Java - Cay S. Horstmann"],
                references: [],
              },
              {
                id: "SUB404",
                code: "1052234440",
                name: "Python Programming",
                type: "Practicum",
                credits: 3,
                lectureHours: 1,
                tutorialHours: 0,
                practicalHours: 4,
                semester: 4,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO441", "CO442"],
                category: "Program Core",
                marks: 100,
                status: "active",
                description:
                  "Practical introduction to Python programming with problem solving.",
                syllabus: [
                  "Module 1: Basics of Python",
                  "Module 2: Control Structures",
                  "Module 3: Functions and Modules",
                  "Module 4: File Handling",
                  "Module 5: Case Studies",
                ],
                textbooks: ["Learning Python - Mark Lutz"],
                references: [],
              },
              {
                id: "SUB405",
                code: "1052234540",
                name: "E-Publishing Tools",
                type: "Practicum",
                credits: 3,
                lectureHours: 1,
                tutorialHours: 0,
                practicalHours: 4,
                semester: 4,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO451", "CO452"],
                category: "Program Core",
                marks: 100,
                status: "active",
                description:
                  "Hands-on training on digital publishing and content management tools.",
                syllabus: [
                  "Module 1: Introduction to E-Publishing",
                  "Module 2: Tools for Publishing",
                  "Module 3: Layout & Design",
                  "Module 4: Multimedia Integration",
                  "Module 5: Case Studies",
                ],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB406",
                code: "1052234640",
                name: "Scripting Languages",
                type: "Project",
                credits: 3,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 6,
                semester: 4,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO461", "CO462"],
                category: "Program Core",
                marks: 100,
                status: "active",
                description:
                  "Covers scripting languages like JavaScript, PHP, and Python with mini projects.",
                syllabus: [
                  "Module 1: Introduction to Scripting",
                  "Module 2: JavaScript Basics",
                  "Module 3: Python Scripts",
                  "Module 4: PHP Basics",
                  "Module 5: Project Implementation",
                ],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB407",
                code: "1052234760",
                name: "Advanced Skills Certification - 4",
                type: "Advanced Skill Certification",
                credits: 2,
                lectureHours: 1,
                tutorialHours: 0,
                practicalHours: 3,
                semester: 4,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO471"],
                category: "Open Elective",
                marks: 100,
                status: "active",
                description:
                  "Skill-based elective with practical certification training.",
                syllabus: [],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB408",
                code: "1052234882",
                name: "I&E/ Club Activity / Community Initiatives",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 4,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: [],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description:
                  "Participation in innovation, entrepreneurship, and community activities.",
                syllabus: [],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB409",
                code: "1052234883",
                name: "Shop Floor Immersion",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 4,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: [],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description:
                  "Practical exposure to shop floor and industry practices.",
                syllabus: [],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB410",
                code: "1052234884",
                name: "Student-Led Initiative",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 4,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: [],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description: "Projects and initiatives led by students.",
                syllabus: [],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB411",
                code: "1052234885",
                name: "Emerging Technology Seminars",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 4,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: [],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description: "Seminars on latest technology trends.",
                syllabus: [],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB412",
                code: "1052234886",
                name: "Health & Wellness",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 4,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: [],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description: "Health and wellness activities.",
                syllabus: [],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB413",
                code: "1052234887",
                name: "Special Interest Groups (Placement Training)",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 4,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: [],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description: "Training activities for placements.",
                syllabus: [],
                textbooks: [],
                references: [],
              },
            ];

            ceSubjects.push(...ceSem4Subjects);

            // Semester 5 (CE) - Provided JSON courses
            const ceSem5Subjects: Subject[] = [
              {
                id: "SUB501",
                code: "1052235130",
                name: "Cloud Computing",
                type: "Practicum",
                credits: 3,
                lectureHours: 2,
                tutorialHours: 0,
                practicalHours: 2,
                semester: 5,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO511", "CO512"],
                category: "Program Core",
                marks: 100,
                status: "active",
                description:
                  "Introduction to cloud computing concepts, services, and deployment models.",
                syllabus: [
                  "Module 1: Cloud Fundamentals",
                  "Module 2: Virtualization",
                  "Module 3: Cloud Services",
                  "Module 4: Security in Cloud",
                  "Module 5: Case Studies",
                ],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB502",
                code: "Elective-1",
                name: "Elective-1",
                type: "Theory",
                credits: 3,
                lectureHours: 3,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 5,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: [],
                category: "Program Elective",
                marks: 100,
                status: "active",
                description:
                  "Elective course selected by student from approved elective list.",
                syllabus: [],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB503",
                code: "1052235320",
                name: "Internet of Things & Digital Twins",
                type: "Lab",
                credits: 2,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 4,
                semester: 5,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO531", "CO532"],
                category: "Program Core",
                marks: 100,
                status: "active",
                description:
                  "Practical implementation of IoT concepts and digital twin technology.",
                syllabus: [],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB504",
                code: "1052235440",
                name: "Computer Hardware and Networking",
                type: "Practicum",
                credits: 3,
                lectureHours: 1,
                tutorialHours: 0,
                practicalHours: 4,
                semester: 5,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: ["CO541", "CO542"],
                category: "Program Core",
                marks: 100,
                status: "active",
                description:
                  "Covers hardware architecture and networking concepts with practical exposure.",
                syllabus: [],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB505",
                code: "Elective-2",
                name: "Elective-2",
                type: "Practicum",
                credits: 3,
                lectureHours: 1,
                tutorialHours: 0,
                practicalHours: 4,
                semester: 5,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: [],
                category: "Program Elective",
                marks: 100,
                status: "active",
                description:
                  "Elective course selected by student from approved elective list.",
                syllabus: [],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB506",
                code: "1052235654",
                name: "Innovation and Startup",
                type: "Practicum",
                credits: 2,
                lectureHours: 1,
                tutorialHours: 0,
                practicalHours: 2,
                semester: 5,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: [],
                category: "Humanities & Social Science",
                marks: 100,
                status: "active",
                description:
                  "Encourages innovation, entrepreneurship, and startup culture.",
                syllabus: [],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB507",
                code: "1052235773",
                name: "Industrial Training (Summer Vacation - 90 Hours)",
                type: "Internship",
                credits: 2,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 5,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: [],
                category: "Project/Internship",
                marks: 100,
                status: "active",
                description:
                  "Industrial exposure and practical training during summer vacation.",
                syllabus: [],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB508",
                code: "1052235860",
                name: "Advanced Skills Certification - 5",
                type: "Advanced Skill Certification",
                credits: 2,
                lectureHours: 1,
                tutorialHours: 0,
                practicalHours: 3,
                semester: 5,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: [],
                category: "Open Elective",
                marks: 100,
                status: "active",
                description: "Skill-based elective certification program.",
                syllabus: [],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB509",
                code: "1052234882",
                name: "I&E/ Club Activity / Community Initiatives",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 5,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: [],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description:
                  "Participation in innovation, entrepreneurship and community initiatives.",
                syllabus: [],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB510",
                code: "1052234883",
                name: "Shop Floor Immersion",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 5,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: [],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description: "Industry-based shop floor learning immersion.",
                syllabus: [],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB511",
                code: "1052234884",
                name: "Student-Led Initiative",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 5,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: [],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description: "Projects and initiatives led by students.",
                syllabus: [],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB512",
                code: "1052234885",
                name: "Emerging Technology Seminars",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 5,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: [],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description: "Seminars on emerging technologies.",
                syllabus: [],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB513",
                code: "1052234886",
                name: "Health & Wellness",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 5,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: [],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description: "Activities for health and wellness.",
                syllabus: [],
                textbooks: [],
                references: [],
              },
              {
                id: "SUB514",
                code: "1052234887",
                name: "Special Interest Groups",
                type: "Integrated Learning Experience",
                credits: 0,
                lectureHours: 0,
                tutorialHours: 0,
                practicalHours: 0,
                semester: 5,
                regulationYear: "R2024",
                programId: foundProgram.id,
                prerequisites: [],
                courseOutcomes: [],
                category: "Audit Course",
                marks: 0,
                status: "active",
                description:
                  "Special interest training or placement preparation activities.",
                syllabus: [],
                textbooks: [],
                references: [],
              },
            ];

            ceSubjects.push(...ceSem5Subjects);

            setSubjects(ceSubjects);
            setSelectedSemester(5); // default to Semester 5
          } else {
            // Generate sample subjects for other programs (existing logic)
            const sampleSubjects: Subject[] = [];
            for (let sem = 1; sem <= foundProgram.duration * 2; sem++) {
              const semesterSubjects = [
                {
                  id: `SUB${sem}001`,
                  code: `2MA${sem}01`,
                  name: `Mathematics - ${sem}`,
                  type: "Theory" as const,
                  credits: 4,
                  lectureHours: 3,
                  tutorialHours: 1,
                  practicalHours: 0,
                  semester: sem,
                  regulationYear: "R2023",
                  programId: foundProgram.id,
                  prerequisites: sem > 1 ? [`SUB${sem - 1}001`] : [],
                  courseOutcomes: [`CO${sem}1`, `CO${sem}2`, `CO${sem}3`],
                  category: "Core" as const,
                  marks: 100,
                  status: "active" as const,
                },
                {
                  id: `SUB${sem}002`,
                  code: `2CS${sem}01`,
                  name: `Computer Science - ${sem}`,
                  type: "Theory" as const,
                  credits: 3,
                  lectureHours: 3,
                  tutorialHours: 0,
                  practicalHours: 0,
                  semester: sem,
                  regulationYear: "R2023",
                  programId: foundProgram.id,
                  prerequisites: [],
                  courseOutcomes: [`CO${sem}4`, `CO${sem}5`],
                  category: "Professional Core" as const,
                  marks: 100,
                  status: "active" as const,
                },
                {
                  id: `SUB${sem}003`,
                  code: `2CS${sem}02`,
                  name: `Programming Lab - ${sem}`,
                  type: "Lab" as const,
                  credits: 2,
                  lectureHours: 0,
                  tutorialHours: 0,
                  practicalHours: 4,
                  semester: sem,
                  regulationYear: "R2023",
                  programId: foundProgram.id,
                  prerequisites: [],
                  courseOutcomes: [`CO${sem}6`],
                  category: "Professional Core" as const,
                  marks: 100,
                  status: "active" as const,
                },
                {
                  id: `SUB${sem}004`,
                  code: `2EE${sem}01`,
                  name: `Electrical Engineering - ${sem}`,
                  type: "Theory" as const,
                  credits: 3,
                  lectureHours: 3,
                  tutorialHours: 0,
                  practicalHours: 0,
                  semester: sem,
                  regulationYear: "R2023",
                  programId: foundProgram.id,
                  prerequisites: [],
                  courseOutcomes: [`CO${sem}7`, `CO${sem}8`],
                  category: "Professional Elective" as const,
                  marks: 100,
                  status: "active" as const,
                },
                {
                  id: `SUB${sem}005`,
                  code: `2HS${sem}01`,
                  name: `Humanities - ${sem}`,
                  type: "Theory" as const,
                  credits: 2,
                  lectureHours: 2,
                  tutorialHours: 0,
                  practicalHours: 0,
                  semester: sem,
                  regulationYear: "R2023",
                  programId: foundProgram.id,
                  prerequisites: [],
                  courseOutcomes: [`CO${sem}9`],
                  category: "Mandatory" as const,
                  marks: 100,
                  status: "active" as const,
                },
              ];
              sampleSubjects.push(...semesterSubjects);
            }
            setSubjects(sampleSubjects);
          }
        }
      } catch (error) {
        console.error("Error loading program data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProgramData();
  }, [programId]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Core":
        return "bg-blue-100 text-blue-800";
      case "Professional Core":
      case "Program Core":
        return "bg-green-100 text-green-800";
      case "Professional Elective":
        return "bg-purple-100 text-purple-800";
      case "Open Elective":
        return "bg-orange-100 text-orange-800";
      case "Mandatory":
        return "bg-red-100 text-red-800";
      case "Engineering Science":
        return "bg-cyan-100 text-cyan-800";
      case "Audit Course":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCourseView = (courseId: string) => {
    navigate(`/academics/curriculum/course-detail/${courseId}`);
  };

  const handleBackToCurriculum = () => {
    navigate("/academics/curriculum");
  };

  const handleAddCourse = (semester: number) => {
    navigate(
      `/academics/curriculum/course-form?programId=${programId}&semester=${semester}`
    );
  };

  const handleEditCourse = (courseId: string) => {
    navigate(
      `/academics/curriculum/course-form?courseId=${courseId}&programId=${programId}`
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading program data...
      </div>
    );
  }

  if (!program) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBackToCurriculum}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Curriculum
          </Button>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Program not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isECEProgram =
    program.name.toLowerCase().includes("electronics") &&
    program.name.toLowerCase().includes("communication");
  const isCEFullTime =
    (program.name || "").toLowerCase().includes("computer") &&
    (program.name || "").toLowerCase().includes("engineering") &&
    ((program.name || "").toLowerCase().includes("full time") ||
      (program.type || "").toLowerCase().includes("full"));
  const totalSemesters = isECEProgram ? 3 : program.duration * 2;
  const semesterNumbers = isECEProgram
    ? [3, 4, 5]
    : isCEFullTime
    ? [3, 4, 5]
    : Array.from({ length: totalSemesters }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBackToCurriculum}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Curriculum
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {program.name}
            </h1>
            <p className="text-muted-foreground">
              Semester-wise Course Structure
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Program Code</p>
          <p className="text-xl font-mono font-semibold">{program.code}</p>
        </div>
      </div>

      {/* Program Information Card */}
      <Card className="border-l-4 border-l-green-500">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-green-600">Duration</p>
              <p className="text-xl font-bold text-green-900">
                {program.duration} Years
              </p>
              <p className="text-sm text-green-600">
                {isECEProgram ? `Semesters 3-5` : `${totalSemesters} Semesters`}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600">Total Credits</p>
              <p className="text-xl font-bold text-blue-900">
                {program.totalCredits}
              </p>
              <p className="text-sm text-blue-600">Credit Hours</p>
            </div>
            <div>
              <p className="text-sm font-medium text-purple-600">Department</p>
              <p className="text-xl font-bold text-purple-900">
                {program.department}
              </p>
              <p className="text-sm text-purple-600">{program.level}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-orange-600">Students</p>
              <p className="text-xl font-bold text-orange-900">
                {program.totalStudents}
              </p>
              <p className="text-sm text-orange-600">Enrolled</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Semester Filter Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter by Semester
          </CardTitle>
          <CardDescription>
            Select a semester to view its courses or view all
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedSemester === null ? "default" : "outline"}
              onClick={() => setSelectedSemester(null)}
              size="sm"
            >
              All Semesters
            </Button>
            {semesterNumbers.map((sem) => (
              <Button
                key={sem}
                variant={selectedSemester === sem ? "default" : "outline"}
                onClick={() => setSelectedSemester(sem)}
                size="sm"
              >
                Semester {sem}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Semester-wise Course List */}
      <div className="space-y-6">
        {semesterNumbers
          .filter(
            (sem) => selectedSemester === null || sem === selectedSemester
          )
          .map((semester) => {
            const semesterSubjects = subjects.filter(
              (s) => s.semester === semester
            );

            if (semesterSubjects.length === 0) return null;

            const totalCredits = semesterSubjects.reduce(
              (acc, s) => acc + (s.credits || 0),
              0
            );
            const totalHours = semesterSubjects.reduce(
              (acc, s) =>
                acc +
                (s.lectureHours || 0) +
                (s.tutorialHours || 0) +
                (s.practicalHours || 0),
              0
            );

            return (
              <Card key={semester} className="overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-blue-900">
                        Semester {semester}
                      </h3>
                      <p className="text-sm text-blue-700">
                        {semesterSubjects.length} courses • {totalCredits}{" "}
                        credits • {totalHours} hours
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-blue-600">Credits</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {totalCredits}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleAddCourse(semester)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Course
                      </Button>
                    </div>
                  </div>
                </div>

                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course Code</TableHead>
                        <TableHead>Course Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>L-T-P</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead>COs</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {semesterSubjects.map((subject) => (
                        <TableRow key={subject.id} className="hover:bg-gray-50">
                          <TableCell className="font-mono text-sm font-medium">
                            {subject.code}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{subject.name}</p>
                              <p className="text-xs text-gray-500">
                                {subject.marks} marks
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{subject.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getCategoryColor(subject.category)}
                            >
                              {subject.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {subject.lectureHours || 0}-
                            {subject.tutorialHours || 0}-
                            {subject.practicalHours || 0}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calculator className="h-3 w-3 text-gray-500" />
                              <span className="font-semibold">
                                {subject.credits || 0}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Target className="h-3 w-3 text-purple-500" />
                              <span className="text-sm">
                                {subject.courseOutcomes?.length || 0}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getStatusColor(subject.status)}
                            >
                              {subject.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCourseView(subject.id)}
                                className="h-8 px-3"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditCourse(subject.id)}
                                className="h-8 px-3"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
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
          })}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{subjects.length}</p>
                <p className="text-sm text-muted-foreground">Total Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calculator className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {subjects.reduce((acc, s) => acc + (s.credits || 0), 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Credits</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {subjects.reduce(
                    (acc, s) =>
                      acc +
                      (s.lectureHours || 0) +
                      (s.tutorialHours || 0) +
                      (s.practicalHours || 0),
                    0
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Total Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {subjects.reduce(
                    (acc, s) => acc + (s.courseOutcomes?.length || 0),
                    0
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Course Outcomes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
