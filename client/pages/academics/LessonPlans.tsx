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
                        <Link to={`/academics/lesson/${plan.id}`} className="font-medium text-blue-600 hover:text-blue-800">
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
                    <Link to={`/academics/lesson/${plan.id}`} className="font-medium text-blue-600 hover:text-blue-800">
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
