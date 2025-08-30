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

interface SessionPlanItem {
  id: string;
  sessionNumber: number;
  topic: string;
  courseTitle: string;
  courseCode: string;
  department: string;
  unitTitle: string;
  unitNumber: number;
  teacher: string;
  duration: number;
  scheduledDate: string;
  teachingMethod: string;
  teachingAids: string;
  assessmentActivity: string;
  sessionOutcome: string;
  status: "Published" | "Draft" | "Under Review";
  semester: number;
  academicYear: string;
}

// Import the same course data from LessonPlans
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
        { session_plan_id: 5, session_number: 5, topic: "Positive Clipper", teaching_aids: "PPT, Animation Video", teaching_method: "Lecture + Brainstorming", hours_allocated: 1, assessment_activity: "Case Study", session_outcome: "Construct and analyze Positive Clipper" }
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
        { session_plan_id: 3, session_number: 3, topic: "Components of Conventional Vehicle", teaching_aids: "Pictures, Diagrams", teaching_method: "Video + Map Activity", hours_allocated: 1, assessment_activity: "Assignment", session_outcome: "Identify pollution-causing components" }
      ]
    }
  ]
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
    "Byron Gottfried, Schaum's Outline of Programming with C"
  ],
  lesson_plans: [
    {
      lesson_plan_id: 1,
      unit_number: 1,
      unit_title: "Introduction to C Programming",
      hours_allotted: 10,
      learning_outcomes: "Understand the structure of C programs, identifiers, keywords, constants, variables, data types, and operators.",
      teaching_method: "Lecture + Hands-on Lab",
      assessment_method: "Quiz + Assignment + Lab",
      reference_materials: "PPT, Blackboard, Lab Sheets",
      session_plans: [
        { session_plan_id: 1, session_number: 1, topic: "Introduction to Programming and C Language Features", teaching_aids: "PPT, Blackboard", teaching_method: "Lecture + Demo", hours_allocated: 2, assessment_activity: "Quiz", session_outcome: "Explain features and applications of C language" },
        { session_plan_id: 2, session_number: 2, topic: "Identifiers, Keywords, Constants, Variables", teaching_aids: "Examples, Blackboard", teaching_method: "Lecture + Examples", hours_allocated: 2, assessment_activity: "Practice Problems", session_outcome: "Differentiate identifiers, keywords, and variables" },
        { session_plan_id: 3, session_number: 3, topic: "Data Types and Type Conversions", teaching_aids: "Examples, Lab Demo", teaching_method: "Lecture + Lab Demo", hours_allocated: 2, assessment_activity: "Assignment", session_outcome: "Understand data types and implicit/explicit conversions" },
        { session_plan_id: 4, session_number: 4, topic: "Operators and Expressions", teaching_aids: "PPT, Code Examples", teaching_method: "Lecture + Lab", hours_allocated: 2, assessment_activity: "Lab Exercise", session_outcome: "Apply various operators in C programming" },
        { session_plan_id: 5, session_number: 5, topic: "Input/Output Functions", teaching_aids: "Code Demo, Lab", teaching_method: "Hands-on Lab", hours_allocated: 2, assessment_activity: "Programming Assignment", session_outcome: "Use scanf and printf for input/output operations" }
      ]
    }
  ]
};

// Transform course data into lesson plan items (grouped by course)
const allCourses = [digitalLogicDesignCourse, cProgrammingCourse, electronicDevicesAndCircuitsCourse, eVehicleTechnologyCourse];

const sessionPlans: SessionPlanItem[] = allCourses.map(course => {
  const totalSessions = course.lesson_plans.reduce((total, unit) => total + unit.session_plans.length, 0);
  const totalHours = course.lesson_plans.reduce((total, unit) => total + unit.hours_allotted, 0);

  return {
    id: course.course_id.toString(),
    sessionNumber: totalSessions,
    topic: course.course_title,
    courseTitle: course.course_title,
    courseCode: course.course_code,
    department: course.department,
    unitTitle: `${course.lesson_plans.length} Units`,
    unitNumber: course.lesson_plans.length,
    teacher: course.faculty_name,
    duration: totalHours,
    scheduledDate: "2024-01-15", // Mock scheduled date
    teachingMethod: course.course_type,
    teachingAids: `${totalSessions} Sessions`,
    assessmentActivity: course.end_exam,
    sessionOutcome: `${course.credits} Credits`,
    status: "Published" as const,
    semester: course.semester,
    academicYear: course.academic_year
  };
});

export default function SessionPlans() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Lessons",
      value: sessionPlans.length.toString(),
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
      value: Math.round(sessionPlans.reduce((acc, lesson) => acc + lesson.duration, 0) / sessionPlans.length).toString(),
      subtitle: "Hours per lesson",
      icon: Clock,
      color: "bg-purple-500"
    }
  ];

  const filteredPlans = sessionPlans.filter(lesson => {
    const matchesSearch = lesson.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || lesson.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Session Plans</h1>
              <p className="text-gray-600 mt-1">Comprehensive lesson plans with detailed session management for all courses.</p>
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

        {/* Session Plans Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-semibold">Lesson Session Plans</CardTitle>
                <p className="text-gray-600 text-sm mt-1">View and manage lesson plans with detailed session information</p>
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by lesson title, course, teacher, or unit..."
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
                    <th className="text-left py-3 px-2 font-medium text-gray-900">Sessions</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-900">Units</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlans.map((lesson) => (
                    <tr key={lesson.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-2">
                        <Link to={`/academics/sessions/${lesson.id}`} className="font-medium text-blue-600 hover:text-blue-800">
                          {lesson.courseTitle}
                        </Link>
                        <div className="text-sm text-gray-500">Code: {lesson.courseCode}</div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="font-medium">{lesson.department}</div>
                        <div className="text-sm text-gray-500">Semester {lesson.semester}</div>
                      </td>
                      <td className="py-4 px-2 text-gray-900">{lesson.teacher}</td>
                      <td className="py-4 px-2 text-gray-900">{lesson.duration} hours</td>
                      <td className="py-4 px-2 text-gray-900">{lesson.scheduledDate}</td>
                      <td className="py-4 px-2">
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          {lesson.sessionNumber}
                        </div>
                      </td>
                      <td className="py-4 px-2 text-gray-900">{lesson.unitNumber}</td>
                      <td className="py-4 px-2">
                        <Badge
                          variant={lesson.status === "Published" ? "default" : lesson.status === "Draft" ? "secondary" : "outline"}
                          className={lesson.status === "Published" ? "bg-green-100 text-green-800" : ""}
                        >
                          {lesson.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filteredPlans.map((lesson) => (
                <Card key={lesson.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Link to={`/academics/sessions/${lesson.id}`} className="font-medium text-blue-600 hover:text-blue-800">
                      {lesson.courseTitle}
                    </Link>
                    <Badge
                      variant={lesson.status === "Published" ? "default" : lesson.status === "Draft" ? "secondary" : "outline"}
                      className={lesson.status === "Published" ? "bg-green-100 text-green-800" : ""}
                    >
                      {lesson.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Code: {lesson.courseCode}</div>
                    <div>Subject: {lesson.department} • Semester {lesson.semester}</div>
                    <div>Teacher: {lesson.teacher}</div>
                    <div>Duration: {lesson.duration} hours</div>
                    <div>Sessions: {lesson.sessionNumber} • Units: {lesson.unitNumber}</div>
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
