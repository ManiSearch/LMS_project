import React, { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FileText,
  Plus,
  CheckCircle,
  Upload,
  Calendar,
  Edit3,
  Eye,
  Copy,
  Trash2,
  Download,
  Users,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

// Mock courses data - in real app this would come from context/API
const courses = [
  {
    id: "CS301",
    name: "Data Structures & Algorithms",
    faculty: ["Dr. John Smith", "Prof. Jane Doe"],
  },
  {
    id: "CS302",
    name: "Database Management Systems",
    faculty: ["Dr. John Smith"],
  },
  { id: "CS303", name: "Software Engineering", faculty: ["Prof. Jane Doe"] },
];

interface Question {
  id: string;
  question: string;
  type: string;
  difficulty: "Easy" | "Medium" | "Hard";
  subject: string;
  points: number;
  usage: number;
  options?: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer?: string;
  expectedAnswer?: string;
  rubric?: string;
  maxLength?: number;
  minLength?: number;
  tolerance?: number;
  unit?: string;
  columnA?: string[];
  columnB?: string[];
  pointsPerMatch?: number;
  allowFormulas?: boolean;
}

interface Assessment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  type: "Quiz" | "Midterm" | "Final" | "Assignment Test";
  description: string;
  startDate: string;
  endDate: string;
  duration: number; // in minutes
  totalPoints: number;
  totalQuestions: number;
  attempts: number;
  allowedAttempts: number;
  status: "upcoming" | "active" | "completed" | "closed";
  instructions: string;
  showResults: boolean;
  shuffleQuestions: boolean;
  timeLimit: boolean;
  autoSubmit: boolean;
  proctoring: boolean;
  questions: string[]; // question IDs
}

// Mock student enrollments - which courses the student is enrolled in
const mockStudentEnrollments = [
  {
    studentId: "student-1",
    courseId: "CS301",
    courseName: "Data Structures & Algorithms",
    enrollmentDate: "2024-01-15",
  },
  {
    studentId: "student-1",
    courseId: "CS302",
    courseName: "Database Management Systems",
    enrollmentDate: "2024-01-15",
  },
  // Add more enrollments for other students as needed
];

// Mock assessments data
const mockAssessments: Assessment[] = [
  {
    id: "ASSESS001",
    title: "Midterm Examination - Data Structures",
    courseId: "CS301",
    courseName: "Data Structures & Algorithms",
    type: "Midterm",
    description:
      "Comprehensive test covering arrays, linked lists, stacks, queues, and trees",
    startDate: "2024-02-15T09:00:00Z",
    endDate: "2024-02-15T11:00:00Z",
    duration: 120,
    totalPoints: 100,
    totalQuestions: 25,
    attempts: 1,
    allowedAttempts: 1,
    status: "completed",
    instructions:
      "Read all questions carefully. Manage your time wisely. No external resources allowed.",
    showResults: true,
    shuffleQuestions: true,
    timeLimit: true,
    autoSubmit: true,
    proctoring: true,
    questions: ["Q001", "Q002"],
  },
  {
    id: "ASSESS002",
    title: "Quiz 1 - Basic Algorithms",
    courseId: "CS301",
    courseName: "Data Structures & Algorithms",
    type: "Quiz",
    description: "Quick quiz on sorting and searching algorithms",
    startDate: "2024-02-20T14:00:00Z",
    endDate: "2024-02-20T14:30:00Z",
    duration: 30,
    totalPoints: 25,
    totalQuestions: 10,
    attempts: 2,
    allowedAttempts: 3,
    status: "active",
    instructions: "Multiple attempts allowed. Best score will be considered.",
    showResults: true,
    shuffleQuestions: false,
    timeLimit: true,
    autoSubmit: true,
    proctoring: false,
    questions: ["Q001", "Q003"],
  },
  {
    id: "ASSESS003",
    title: "Database Design Final Exam",
    courseId: "CS302",
    courseName: "Database Management Systems",
    type: "Final",
    description:
      "Final examination covering normalization, SQL, and database design principles",
    startDate: "2024-03-15T10:00:00Z",
    endDate: "2024-03-15T13:00:00Z",
    duration: 180,
    totalPoints: 150,
    totalQuestions: 30,
    attempts: 0,
    allowedAttempts: 1,
    status: "upcoming",
    instructions:
      "Comprehensive final exam. Covers all topics from the semester.",
    showResults: false,
    shuffleQuestions: true,
    timeLimit: true,
    autoSubmit: true,
    proctoring: true,
    questions: ["Q002", "Q004"],
  },
  {
    id: "ASSESS004",
    title: "SQL Practice Test",
    courseId: "CS302",
    courseName: "Database Management Systems",
    type: "Assignment Test",
    description: "Practical SQL queries and database operations",
    startDate: "2024-02-10T09:00:00Z",
    endDate: "2024-02-12T23:59:00Z",
    duration: 60,
    totalPoints: 50,
    totalQuestions: 15,
    attempts: 1,
    allowedAttempts: 2,
    status: "completed",
    instructions: "Practice your SQL skills with real-world scenarios.",
    showResults: true,
    shuffleQuestions: false,
    timeLimit: false,
    autoSubmit: false,
    proctoring: false,
    questions: ["Q003", "Q004"],
  },
  {
    id: "ASSESS005",
    title: "Software Engineering Quiz",
    courseId: "CS303",
    courseName: "Software Engineering",
    type: "Quiz",
    description: "Quiz on SDLC models and software design patterns",
    startDate: "2024-02-25T15:00:00Z",
    endDate: "2024-02-25T15:45:00Z",
    duration: 45,
    totalPoints: 30,
    totalQuestions: 12,
    attempts: 0,
    allowedAttempts: 1,
    status: "upcoming",
    instructions: "Focus on understanding concepts rather than memorization.",
    showResults: true,
    shuffleQuestions: true,
    timeLimit: true,
    autoSubmit: true,
    proctoring: false,
    questions: ["Q001", "Q002"],
  },
];

export default function Assessments() {
  const { user } = useAuth();
  const [view, setView] = useState("list"); // list, questions, bulk-import, create-assessment, create-question, edit-question, view-question, take-assessment

  // Assessment taking state
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(
    null,
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock assessment questions
  const getAssessmentQuestions = (assessmentId: string) => {
    // In a real app, this would fetch questions from API
    return [
      {
        id: "Q1",
        question:
          "What is the time complexity of binary search in a sorted array?",
        type: "MCQ",
        options: {
          A: "O(n)",
          B: "O(log n)",
          C: "O(n²)",
          D: "O(1)",
        },
        points: 5,
      },
      {
        id: "Q2",
        question:
          "Explain the concept of inheritance in object-oriented programming.",
        type: "Long Answer",
        points: 10,
        minLength: 50,
      },
      {
        id: "Q3",
        question: "What is the capital of France?",
        type: "Short Answer",
        points: 2,
      },
      {
        id: "Q4",
        question: "Calculate the area of a circle with radius 5 cm.",
        type: "Numerical",
        points: 3,
        unit: "cm²",
      },
      {
        id: "Q5",
        question: "Which data structure follows LIFO principle?",
        type: "MCQ",
        options: {
          A: "Queue",
          B: "Stack",
          C: "Array",
          D: "Linked List",
        },
        points: 4,
      },
    ];
  };

  // Questions management state
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "Q001",
      question: "What is the time complexity of binary search?",
      type: "MCQ",
      difficulty: "Medium",
      subject: "Data Structures",
      points: 2,
      usage: 15,
      options: { A: "O(n)", B: "O(log n)", C: "O(n²)", D: "O(1)" },
      correctAnswer: "B",
    },
    {
      id: "Q002",
      question: "Explain the concept of polymorphism in OOP",
      type: "Long Answer",
      difficulty: "Hard",
      subject: "OOP",
      points: 5,
      usage: 8,
      rubric:
        "Should cover inheritance, method overriding, and runtime polymorphism",
    },
    {
      id: "Q003",
      question: "Calculate the derivative of f(x) = x²",
      type: "Numerical",
      difficulty: "Easy",
      subject: "Mathematics",
      points: 3,
      usage: 22,
      correctAnswer: "2x",
      tolerance: 0.1,
    },
    {
      id: "Q004",
      question: "What is the capital of France?",
      type: "Short Answer",
      difficulty: "Easy",
      subject: "Geography",
      points: 1,
      usage: 5,
      expectedAnswer: "Paris",
    },
  ]);

  // Assessment management state
  const [assessments, setAssessments] = useState<Assessment[]>(mockAssessments);
  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all-difficulty");

  // Form state for creating/editing questions
  const [questionForm, setQuestionForm] = useState<Partial<Question>>({
    question: "",
    type: "MCQ",
    difficulty: "Easy",
    subject: "",
    points: 1,
    options: { A: "", B: "", C: "", D: "" },
    correctAnswer: "",
    expectedAnswer: "",
    rubric: "",
    maxLength: 500,
    minLength: 100,
    tolerance: 0.1,
    unit: "",
    allowFormulas: false,
  });

  const handleChooseFile = () => {
    // File upload logic would go here
    console.log("Choose file clicked");
  };

  const handleCreateAssessmentComplete = () => {
    // Assessment creation logic would go here
    console.log("Assessment created");
    setView("list");
  };

  // Question CRUD operations
  const handleViewQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setView("view-question");
  };

  const handleEditQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setQuestionForm(question);
    setView("edit-question");
  };

  const handleCopyQuestion = (question: Question) => {
    const newId = `Q${String(questions.length + 1).padStart(3, "0")}`;
    const copiedQuestion = { ...question, id: newId, usage: 0 };
    setQuestions((prev) => [...prev, copiedQuestion]);
    alert(
      `Question copied successfully!\nNew ID: ${newId}\nOriginal ID: ${question.id}`,
    );
  };

  const handleDeleteQuestion = (question: Question) => {
    if (
      window.confirm(
        `Are you sure you want to delete this question?\n\nQuestion: ${question.question}\nID: ${question.id}\n\nThis action cannot be undone.`,
      )
    ) {
      setQuestions((prev) => prev.filter((q) => q.id !== question.id));
      alert(`Question ${question.id} has been deleted successfully.`);
    }
  };

  const handleCreateQuestion = () => {
    setQuestionForm({
      question: "",
      type: "MCQ",
      difficulty: "Easy",
      subject: "",
      points: 1,
      options: { A: "", B: "", C: "", D: "" },
      correctAnswer: "",
      expectedAnswer: "",
      rubric: "",
      maxLength: 500,
      minLength: 100,
      tolerance: 0.1,
      unit: "",
      allowFormulas: false,
    });
    setSelectedQuestion(null);
    setView("create-question");
  };

  const handleSaveQuestion = () => {
    if (!questionForm.question?.trim()) {
      alert("Please enter a question");
      return;
    }

    if (!questionForm.subject?.trim()) {
      alert("Please enter a subject");
      return;
    }

    if (
      questionForm.type === "MCQ" &&
      (!questionForm.options?.A || !questionForm.options?.B)
    ) {
      alert("Please provide at least options A and B for MCQ");
      return;
    }

    const newQuestion: Question = {
      id: selectedQuestion
        ? selectedQuestion.id
        : `Q${String(questions.length + 1).padStart(3, "0")}`,
      question: questionForm.question!,
      type: questionForm.type!,
      difficulty: questionForm.difficulty!,
      subject: questionForm.subject!,
      points: questionForm.points || 1,
      usage: selectedQuestion ? selectedQuestion.usage : 0,
      ...(questionForm.type === "MCQ" && {
        options: questionForm.options,
        correctAnswer: questionForm.correctAnswer,
      }),
      ...(questionForm.type === "Short Answer" && {
        expectedAnswer: questionForm.expectedAnswer,
        maxLength: questionForm.maxLength,
      }),
      ...(questionForm.type === "Long Answer" && {
        rubric: questionForm.rubric,
        minLength: questionForm.minLength,
        maxLength: questionForm.maxLength,
      }),
      ...(questionForm.type === "Numerical" && {
        correctAnswer: questionForm.correctAnswer,
        tolerance: questionForm.tolerance,
        unit: questionForm.unit,
        allowFormulas: questionForm.allowFormulas,
      }),
    };

    if (selectedQuestion) {
      // Update existing question
      setQuestions((prev) =>
        prev.map((q) => (q.id === selectedQuestion.id ? newQuestion : q)),
      );
      alert(`Question ${newQuestion.id} updated successfully!`);
    } else {
      // Create new question
      setQuestions((prev) => [...prev, newQuestion]);
      alert(`Question ${newQuestion.id} created successfully!`);
    }

    setView("questions");
    setSelectedQuestion(null);
  };

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch =
      question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || question.type === typeFilter;
    const matchesDifficulty =
      difficultyFilter === "all-difficulty" ||
      question.difficulty === difficultyFilter;

    return matchesSearch && matchesType && matchesDifficulty;
  });

  // Get student's enrolled courses
  const getStudentEnrolledCourses = () => {
    if (user?.role !== "student") return [];
    return mockStudentEnrollments
      .filter(
        (enrollment) =>
          enrollment.studentId === user?.id ||
          enrollment.studentId === "student-1",
      ) // fallback for demo
      .map((enrollment) => enrollment.courseId);
  };

  // Get assessments for student (only for enrolled courses)
  const getStudentAssessments = () => {
    if (user?.role !== "student") return assessments;
    const enrolledCourses = getStudentEnrolledCourses();
    return assessments.filter((assessment) =>
      enrolledCourses.includes(assessment.courseId),
    );
  };

  // Handle viewing assessment details for students
  const handleViewAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setView("view-assessment");
  };

  // Handle starting an assessment (for students)
  const handleStartAssessment = (assessment: Assessment) => {
    if (assessment.status !== "active") {
      alert(
        `This assessment is ${assessment.status}. You cannot start it now.`,
      );
      return;
    }

    if (assessment.attempts >= assessment.allowedAttempts) {
      alert("You have exhausted all allowed attempts for this assessment.");
      return;
    }

    setCurrentAssessment(assessment);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining(assessment.duration * 60); // Convert minutes to seconds
    setAssessmentStarted(true);
    setView("take-assessment");
  };

  // Timer effect for assessment
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (assessmentStarted && timeRemaining > 0 && view === "take-assessment") {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Auto-submit when time is up
            handleSubmitAssessment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [assessmentStarted, timeRemaining, view]);

  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle answer change
  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  // Navigate between questions
  const goToQuestion = (index: number) => {
    if (
      index >= 0 &&
      index < getAssessmentQuestions(currentAssessment?.id || "").length
    ) {
      setCurrentQuestionIndex(index);
    }
  };

  // Submit assessment
  const handleSubmitAssessment = async () => {
    setIsSubmitting(true);

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Calculate score (mock calculation)
    const questions = getAssessmentQuestions(currentAssessment?.id || "");
    const answeredQuestions = Object.keys(answers).length;
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const earnedPoints = Math.floor(totalPoints * 0.85); // Mock 85% score

    alert(
      `Assessment Submitted Successfully!\n\nAnswered: ${answeredQuestions}/${questions.length} questions\nScore: ${earnedPoints}/${totalPoints} points\nPercentage: ${Math.round((earnedPoints / totalPoints) * 100)}%\n\nYour results have been saved.`,
    );

    // Reset state and return to list
    setCurrentAssessment(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining(0);
    setAssessmentStarted(false);
    setIsSubmitting(false);
    setView("list");
  };

  // Confirm assessment exit
  const handleExitAssessment = () => {
    if (
      window.confirm(
        "Are you sure you want to exit the assessment?\n\nYour progress will be lost.",
      )
    ) {
      setCurrentAssessment(null);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setTimeRemaining(0);
      setAssessmentStarted(false);
      setView("list");
    }
  };

  // Get status color for assessment badges
  const getAssessmentStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "upcoming":
        return "secondary";
      case "completed":
        return "outline";
      case "closed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderQuestionsView = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Question Bank Management</CardTitle>
            <CardDescription>
              Create, edit, and organize your questions for assessments
            </CardDescription>
          </div>
          <Button variant="outline" onClick={() => setView("list")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Question Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card className="p-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {questions.length}
                </p>
                <p className="text-xs text-muted-foreground">Total Questions</p>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {questions.filter((q) => q.type === "MCQ").length}
                </p>
                <p className="text-xs text-muted-foreground">MCQ</p>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {questions.filter((q) => q.type === "Short Answer").length}
                </p>
                <p className="text-xs text-muted-foreground">Short Answer</p>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {questions.filter((q) => q.type === "Long Answer").length}
                </p>
                <p className="text-xs text-muted-foreground">Long Answer</p>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {questions.filter((q) => q.type === "Numerical").length}
                </p>
                <p className="text-xs text-muted-foreground">Numerical</p>
              </div>
            </Card>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <Input
                placeholder="Search questions..."
                className="w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="MCQ">Multiple Choice</SelectItem>
                  <SelectItem value="Short Answer">Short Answer</SelectItem>
                  <SelectItem value="Long Answer">Long Answer</SelectItem>
                  <SelectItem value="Numerical">Numerical</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={difficultyFilter}
                onValueChange={setDifficultyFilter}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-difficulty">All Levels</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button size="sm" onClick={handleCreateQuestion}>
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
              {filteredQuestions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {searchTerm ||
                    typeFilter !== "all" ||
                    difficultyFilter !== "all-difficulty"
                      ? "No questions found matching your filters"
                      : 'No questions available. Click "Add Question" to create your first question.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredQuestions.map((question) => (
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
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewQuestion(question)}
                          title="View Question Details"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditQuestion(question)}
                          title="Edit Question"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopyQuestion(question)}
                          title="Copy Question"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteQuestion(question)}
                          title="Delete Question"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="flex gap-2 mt-4">
            <Button variant="outline">Export Questions</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCreateEditQuestionView = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              {selectedQuestion ? "Edit Question" : "Create New Question"}
            </CardTitle>
            <CardDescription>
              {selectedQuestion
                ? "Modify question details and settings"
                : "Add a new question to your question bank"}
            </CardDescription>
          </div>
          <Button variant="outline" onClick={() => setView("questions")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Questions
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Basic Question Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Question Type</Label>
              <Select
                value={questionForm.type}
                onValueChange={(value) =>
                  setQuestionForm((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MCQ">Multiple Choice</SelectItem>
                  <SelectItem value="Short Answer">Short Answer</SelectItem>
                  <SelectItem value="Long Answer">Long Answer</SelectItem>
                  <SelectItem value="Numerical">Numerical</SelectItem>
                  <SelectItem value="Match Following">
                    Match Following
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Difficulty</Label>
              <Select
                value={questionForm.difficulty}
                onValueChange={(value: "Easy" | "Medium" | "Hard") =>
                  setQuestionForm((prev) => ({ ...prev, difficulty: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Points</Label>
              <Input
                type="number"
                value={questionForm.points}
                onChange={(e) =>
                  setQuestionForm((prev) => ({
                    ...prev,
                    points: parseInt(e.target.value) || 1,
                  }))
                }
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Subject</Label>
              <Input
                value={questionForm.subject}
                onChange={(e) =>
                  setQuestionForm((prev) => ({
                    ...prev,
                    subject: e.target.value,
                  }))
                }
                placeholder="e.g., Mathematics, Computer Science"
              />
            </div>
          </div>

          {/* Question Text */}
          <div>
            <Label>Question</Label>
            <Textarea
              value={questionForm.question}
              onChange={(e) =>
                setQuestionForm((prev) => ({
                  ...prev,
                  question: e.target.value,
                }))
              }
              placeholder="Enter your question here..."
              rows={4}
            />
          </div>

          {/* Type-specific fields */}
          {questionForm.type === "MCQ" && (
            <div className="space-y-4">
              <Label>Options</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">Option A</Label>
                  <Input
                    value={questionForm.options?.A || ""}
                    onChange={(e) =>
                      setQuestionForm((prev) => ({
                        ...prev,
                        options: {
                          ...(prev.options || { A: "", B: "", C: "", D: "" }),
                          A: e.target.value,
                        },
                      }))
                    }
                    placeholder="Option A"
                  />
                </div>
                <div>
                  <Label className="text-sm">Option B</Label>
                  <Input
                    value={questionForm.options?.B || ""}
                    onChange={(e) =>
                      setQuestionForm((prev) => ({
                        ...prev,
                        options: {
                          ...(prev.options || { A: "", B: "", C: "", D: "" }),
                          B: e.target.value,
                        },
                      }))
                    }
                    placeholder="Option B"
                  />
                </div>
                <div>
                  <Label className="text-sm">Option C</Label>
                  <Input
                    value={questionForm.options?.C || ""}
                    onChange={(e) =>
                      setQuestionForm((prev) => ({
                        ...prev,
                        options: {
                          ...(prev.options || { A: "", B: "", C: "", D: "" }),
                          C: e.target.value,
                        },
                      }))
                    }
                    placeholder="Option C"
                  />
                </div>
                <div>
                  <Label className="text-sm">Option D</Label>
                  <Input
                    value={questionForm.options?.D || ""}
                    onChange={(e) =>
                      setQuestionForm((prev) => ({
                        ...prev,
                        options: {
                          ...(prev.options || { A: "", B: "", C: "", D: "" }),
                          D: e.target.value,
                        },
                      }))
                    }
                    placeholder="Option D"
                  />
                </div>
              </div>
              <div>
                <Label>Correct Answer</Label>
                <Select
                  value={questionForm.correctAnswer}
                  onValueChange={(value) =>
                    setQuestionForm((prev) => ({
                      ...prev,
                      correctAnswer: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select correct answer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {questionForm.type === "Short Answer" && (
            <div className="space-y-4">
              <div>
                <Label>Expected Answer (for auto-grading)</Label>
                <Input
                  value={questionForm.expectedAnswer}
                  onChange={(e) =>
                    setQuestionForm((prev) => ({
                      ...prev,
                      expectedAnswer: e.target.value,
                    }))
                  }
                  placeholder="Expected answer keywords..."
                />
              </div>
              <div>
                <Label>Max Length (words)</Label>
                <Input
                  type="number"
                  value={questionForm.maxLength}
                  onChange={(e) =>
                    setQuestionForm((prev) => ({
                      ...prev,
                      maxLength: parseInt(e.target.value) || 100,
                    }))
                  }
                  placeholder="100"
                />
              </div>
            </div>
          )}

          {questionForm.type === "Long Answer" && (
            <div className="space-y-4">
              <div>
                <Label>Grading Rubric</Label>
                <Textarea
                  value={questionForm.rubric}
                  onChange={(e) =>
                    setQuestionForm((prev) => ({
                      ...prev,
                      rubric: e.target.value,
                    }))
                  }
                  placeholder="Define grading criteria..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Min Length (words)</Label>
                  <Input
                    type="number"
                    value={questionForm.minLength}
                    onChange={(e) =>
                      setQuestionForm((prev) => ({
                        ...prev,
                        minLength: parseInt(e.target.value) || 100,
                      }))
                    }
                    placeholder="100"
                  />
                </div>
                <div>
                  <Label>Max Length (words)</Label>
                  <Input
                    type="number"
                    value={questionForm.maxLength}
                    onChange={(e) =>
                      setQuestionForm((prev) => ({
                        ...prev,
                        maxLength: parseInt(e.target.value) || 500,
                      }))
                    }
                    placeholder="500"
                  />
                </div>
              </div>
            </div>
          )}

          {questionForm.type === "Numerical" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Correct Answer</Label>
                  <Input
                    value={questionForm.correctAnswer}
                    onChange={(e) =>
                      setQuestionForm((prev) => ({
                        ...prev,
                        correctAnswer: e.target.value,
                      }))
                    }
                    placeholder="42.5"
                  />
                </div>
                <div>
                  <Label>Tolerance (±)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={questionForm.tolerance}
                    onChange={(e) =>
                      setQuestionForm((prev) => ({
                        ...prev,
                        tolerance: parseFloat(e.target.value) || 0.1,
                      }))
                    }
                    placeholder="0.1"
                  />
                </div>
                <div>
                  <Label>Unit</Label>
                  <Input
                    value={questionForm.unit}
                    onChange={(e) =>
                      setQuestionForm((prev) => ({
                        ...prev,
                        unit: e.target.value,
                      }))
                    }
                    placeholder="meters"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allow-formulas"
                  checked={questionForm.allowFormulas}
                  onCheckedChange={(checked) =>
                    setQuestionForm((prev) => ({
                      ...prev,
                      allowFormulas: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="allow-formulas">
                  Allow mathematical formulas
                </Label>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setView("questions")}>
              Cancel
            </Button>
            <Button onClick={handleSaveQuestion}>
              {selectedQuestion ? "Update Question" : "Create Question"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderViewQuestionView = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Question Details</CardTitle>
            <CardDescription>
              View complete question information and statistics
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditQuestion(selectedQuestion!)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" onClick={() => setView("questions")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {selectedQuestion && (
          <div className="space-y-6">
            {/* Question Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Question ID
                </Label>
                <p className="font-semibold">{selectedQuestion.id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Type
                </Label>
                <Badge variant="outline">{selectedQuestion.type}</Badge>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Difficulty
                </Label>
                <Badge
                  variant={
                    selectedQuestion.difficulty === "Easy"
                      ? "secondary"
                      : selectedQuestion.difficulty === "Medium"
                        ? "default"
                        : "destructive"
                  }
                >
                  {selectedQuestion.difficulty}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Points
                </Label>
                <p className="font-semibold">{selectedQuestion.points}</p>
              </div>
            </div>

            {/* Question Content */}
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Question
              </Label>
              <p className="mt-2 p-4 bg-background border rounded-lg">
                {selectedQuestion.question}
              </p>
            </div>

            {/* Type-specific content */}
            {selectedQuestion.type === "MCQ" && selectedQuestion.options && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Options
                </Label>
                <div className="mt-2 space-y-2">
                  {Object.entries(selectedQuestion.options).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className={`p-3 border rounded ${selectedQuestion.correctAnswer === key ? "bg-green-50 border-green-200" : ""}`}
                      >
                        <span className="font-medium">{key})</span> {value}
                        {selectedQuestion.correctAnswer === key && (
                          <Badge
                            variant="outline"
                            className="ml-2 text-green-600 border-green-600"
                          >
                            Correct
                          </Badge>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {selectedQuestion.type === "Short Answer" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Expected Answer
                  </Label>
                  <p className="mt-1 p-3 bg-background border rounded">
                    {selectedQuestion.expectedAnswer || "Not specified"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Max Length
                  </Label>
                  <p className="mt-1 p-3 bg-background border rounded">
                    {selectedQuestion.maxLength || 100} words
                  </p>
                </div>
              </div>
            )}

            {selectedQuestion.type === "Long Answer" && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Grading Rubric
                </Label>
                <p className="mt-1 p-3 bg-background border rounded">
                  {selectedQuestion.rubric || "No rubric specified"}
                </p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Min Length
                    </Label>
                    <p className="font-semibold">
                      {selectedQuestion.minLength || 100} words
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Max Length
                    </Label>
                    <p className="font-semibold">
                      {selectedQuestion.maxLength || 500} words
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedQuestion.type === "Numerical" && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Correct Answer
                  </Label>
                  <p className="mt-1 p-3 bg-background border rounded font-mono">
                    {selectedQuestion.correctAnswer}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Tolerance
                  </Label>
                  <p className="mt-1 p-3 bg-background border rounded">
                    ±{selectedQuestion.tolerance || 0.1}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Unit
                  </Label>
                  <p className="mt-1 p-3 bg-background border rounded">
                    {selectedQuestion.unit || "No unit"}
                  </p>
                </div>
              </div>
            )}

            {/* Usage Statistics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {selectedQuestion.usage}
                </p>
                <p className="text-sm text-muted-foreground">Times Used</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {selectedQuestion.subject}
                </p>
                <p className="text-sm text-muted-foreground">Subject</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {selectedQuestion.points}
                </p>
                <p className="text-sm text-muted-foreground">Points</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderStudentAssessmentsView = () => {
    const studentAssessments = getStudentAssessments();
    const enrolledCourses = getStudentEnrolledCourses();

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <FileText className="h-5 w-5" />
            </div>
            My Assessments
          </CardTitle>
          <CardDescription>
            View and take assessments for your enrolled courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Assessment Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {studentAssessments.length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Assessments
                  </p>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {
                      studentAssessments.filter((a) => a.status === "active")
                        .length
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {
                      studentAssessments.filter((a) => a.status === "upcoming")
                        .length
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {
                      studentAssessments.filter((a) => a.status === "completed")
                        .length
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </Card>
            </div>

            {/* Enrolled Courses Info */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Enrolled Courses</h3>
              <div className="flex gap-2 flex-wrap">
                {enrolledCourses.map((courseId) => {
                  const course = courses.find((c) => c.id === courseId);
                  return (
                    <Badge
                      key={courseId}
                      variant="outline"
                      className="px-3 py-1"
                    >
                      {course?.name || courseId}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Assessments List */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Available Assessments
              </h3>
              {studentAssessments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No assessments available for your enrolled courses.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {studentAssessments.map((assessment) => (
                    <Card key={assessment.id} className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">
                              {assessment.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {assessment.courseName}
                            </p>
                            <p className="text-sm mt-2">
                              {assessment.description}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge
                              variant={getAssessmentStatusColor(
                                assessment.status,
                              )}
                            >
                              {assessment.status}
                            </Badge>
                            <Badge variant="outline">{assessment.type}</Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Duration</p>
                            <p className="font-medium">
                              {assessment.duration} min
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Questions</p>
                            <p className="font-medium">
                              {assessment.totalQuestions}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Points</p>
                            <p className="font-medium">
                              {assessment.totalPoints}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Attempts</p>
                            <p className="font-medium">
                              {assessment.attempts}/{assessment.allowedAttempts}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Start Date</p>
                            <p className="font-medium">
                              {formatDate(assessment.startDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">End Date</p>
                            <p className="font-medium">
                              {formatDate(assessment.endDate)}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewAssessment(assessment)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {assessment.status === "active" &&
                            assessment.attempts <
                              assessment.allowedAttempts && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleStartAssessment(assessment)
                                }
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Start Assessment
                              </Button>
                            )}
                          {assessment.status === "completed" &&
                            assessment.showResults && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  alert(
                                    `Results for ${assessment.title}\n\nYour Score: 85/${assessment.totalPoints}\nPercentage: 85%\nGrade: A\n\nWell done!`,
                                  )
                                }
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                View Results
                              </Button>
                            )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderStudentAssessmentDetailsView = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Assessment Details</CardTitle>
            <CardDescription>
              Complete information about the assessment
            </CardDescription>
          </div>
          <Button variant="outline" onClick={() => setView("list")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assessments
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {selectedAssessment && (
          <div className="space-y-6">
            {/* Assessment Header */}
            <div className="p-4 bg-muted rounded-lg">
              <h2 className="text-xl font-semibold">
                {selectedAssessment.title}
              </h2>
              <p className="text-muted-foreground mt-1">
                {selectedAssessment.courseName}
              </p>
              <div className="flex gap-2 mt-3">
                <Badge
                  variant={getAssessmentStatusColor(selectedAssessment.status)}
                >
                  {selectedAssessment.status}
                </Badge>
                <Badge variant="outline">{selectedAssessment.type}</Badge>
              </div>
            </div>

            {/* Assessment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Description
                  </Label>
                  <p className="mt-1">{selectedAssessment.description}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Instructions
                  </Label>
                  <p className="mt-1">{selectedAssessment.instructions}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Duration
                    </Label>
                    <p className="font-semibold">
                      {selectedAssessment.duration} minutes
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Total Questions
                    </Label>
                    <p className="font-semibold">
                      {selectedAssessment.totalQuestions}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Total Points
                    </Label>
                    <p className="font-semibold">
                      {selectedAssessment.totalPoints}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Attempts
                    </Label>
                    <p className="font-semibold">
                      {selectedAssessment.attempts}/
                      {selectedAssessment.allowedAttempts}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment Schedule */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 border rounded">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Start Date & Time
                  </Label>
                  <p className="font-semibold">
                    {formatDate(selectedAssessment.startDate)}
                  </p>
                </div>
                <div className="p-3 border rounded">
                  <Label className="text-sm font-medium text-muted-foreground">
                    End Date & Time
                  </Label>
                  <p className="font-semibold">
                    {formatDate(selectedAssessment.endDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Assessment Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Assessment Settings
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className={`h-4 w-4 ${selectedAssessment.timeLimit ? "text-green-600" : "text-gray-400"}`}
                  />
                  <span className="text-sm">Time Limit</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className={`h-4 w-4 ${selectedAssessment.shuffleQuestions ? "text-green-600" : "text-gray-400"}`}
                  />
                  <span className="text-sm">Shuffle Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className={`h-4 w-4 ${selectedAssessment.autoSubmit ? "text-green-600" : "text-gray-400"}`}
                  />
                  <span className="text-sm">Auto Submit</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className={`h-4 w-4 ${selectedAssessment.proctoring ? "text-green-600" : "text-gray-400"}`}
                  />
                  <span className="text-sm">Proctoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className={`h-4 w-4 ${selectedAssessment.showResults ? "text-green-600" : "text-gray-400"}`}
                  />
                  <span className="text-sm">Show Results</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              {selectedAssessment.status === "active" &&
                selectedAssessment.attempts <
                  selectedAssessment.allowedAttempts && (
                  <Button
                    onClick={() => handleStartAssessment(selectedAssessment)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Start Assessment
                  </Button>
                )}
              {selectedAssessment.status === "completed" &&
                selectedAssessment.showResults && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      alert(
                        `Results for ${selectedAssessment.title}\n\nYour Score: 85/${selectedAssessment.totalPoints}\nPercentage: 85%\nGrade: A\n\nWell done!`,
                      )
                    }
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Results
                  </Button>
                )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderTakeAssessmentView = () => {
    if (!currentAssessment) return null;

    const questions = getAssessmentQuestions(currentAssessment.id);
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const timeWarning = timeRemaining < 300; // Less than 5 minutes

    return (
      <div className="space-y-6">
        {/* Assessment Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  {currentAssessment.title}
                </CardTitle>
                <CardDescription>
                  {currentAssessment.courseName} • Question{" "}
                  {currentQuestionIndex + 1} of {questions.length}
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                    timeWarning
                      ? "bg-red-50 border-red-200 text-red-600"
                      : "bg-green-50 border-green-200 text-green-600"
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  <span className="font-mono font-semibold">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExitAssessment}
                >
                  Exit Assessment
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {timeWarning && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Warning: Less than 5 minutes remaining! The assessment will
                    auto-submit when time runs out.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current Question */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  Question {currentQuestionIndex + 1}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{currentQuestion.type}</Badge>
                  <Badge variant="secondary">
                    {currentQuestion.points} points
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <p className="text-lg leading-relaxed">
                  {currentQuestion.question}
                </p>
              </div>

              {/* Answer input based on question type */}
              <div className="space-y-4">
                {currentQuestion.type === "MCQ" && (
                  <RadioGroup
                    value={answers[currentQuestion.id] || ""}
                    onValueChange={(value) =>
                      handleAnswerChange(currentQuestion.id, value)
                    }
                  >
                    {Object.entries(currentQuestion.options || {}).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50"
                        >
                          <RadioGroupItem
                            value={key}
                            id={`${currentQuestion.id}-${key}`}
                          />
                          <Label
                            htmlFor={`${currentQuestion.id}-${key}`}
                            className="flex-1 cursor-pointer"
                          >
                            <span className="font-medium mr-2">{key})</span>{" "}
                            {value}
                          </Label>
                        </div>
                      ),
                    )}
                  </RadioGroup>
                )}

                {currentQuestion.type === "Short Answer" && (
                  <div>
                    <Input
                      placeholder="Enter your answer..."
                      value={answers[currentQuestion.id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(currentQuestion.id, e.target.value)
                      }
                      className="text-base"
                    />
                  </div>
                )}

                {currentQuestion.type === "Long Answer" && (
                  <div>
                    <Textarea
                      placeholder="Write your detailed answer here..."
                      value={answers[currentQuestion.id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(currentQuestion.id, e.target.value)
                      }
                      rows={8}
                      className="text-base"
                    />
                    {currentQuestion.minLength && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Minimum {currentQuestion.minLength} words required
                      </p>
                    )}
                  </div>
                )}

                {currentQuestion.type === "Numerical" && (
                  <div>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        step="any"
                        placeholder="Enter numerical answer"
                        value={answers[currentQuestion.id] || ""}
                        onChange={(e) =>
                          handleAnswerChange(currentQuestion.id, e.target.value)
                        }
                        className="text-base"
                      />
                      {currentQuestion.unit && (
                        <span className="text-muted-foreground">
                          {currentQuestion.unit}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation and Submit */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => goToQuestion(currentQuestionIndex - 1)}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {Object.keys(answers).length} of {questions.length} answered
                  </span>
                </div>

                <div className="flex gap-2">
                  {currentQuestionIndex === questions.length - 1 ? (
                    <Button
                      onClick={handleSubmitAssessment}
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Assessment"}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => goToQuestion(currentQuestionIndex + 1)}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Navigator */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Question Navigator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-2">
              {questions.map((_, index) => {
                const isAnswered = answers[questions[index].id] !== undefined;
                const isCurrent = index === currentQuestionIndex;

                return (
                  <Button
                    key={index}
                    variant={
                      isCurrent
                        ? "default"
                        : isAnswered
                          ? "secondary"
                          : "outline"
                    }
                    size="sm"
                    className={`h-10 w-10 p-0 ${
                      isCurrent ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => goToQuestion(index)}
                  >
                    {index + 1}
                  </Button>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-secondary rounded"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                <span>Not Answered</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderBulkImportView = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Bulk Import Questions</CardTitle>
            <CardDescription>
              Upload questions from Excel, CSV, or QTI files
            </CardDescription>
          </div>
          <Button variant="outline" onClick={() => setView("list")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h4 className="font-medium mb-2">Drag & Drop Files Here</h4>
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
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setView("list")}>
              Cancel
            </Button>
            <Button>Start Import</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCreateAssessmentView = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Create New Assessment</CardTitle>
            <CardDescription>
              Set up a new quiz, test, or examination with questions from your
              bank
            </CardDescription>
          </div>
          <Button variant="outline" onClick={() => setView("list")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </CardHeader>
      <CardContent>
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
                    .filter((c) => c.faculty.includes(user?.name || ""))
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
                  <SelectItem value="midterm">Midterm Exam</SelectItem>
                  <SelectItem value="final">Final Exam</SelectItem>
                  <SelectItem value="assignment">Assignment Test</SelectItem>
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
                  <Label htmlFor="shuffle-questions">Shuffle questions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="show-results" defaultChecked />
                  <Label htmlFor="show-results">Show results immediately</Label>
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
                  <Label htmlFor="time-limit">Enable time limit</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="proctoring" />
                  <Label htmlFor="proctoring">Enable proctoring</Label>
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
                  question: "What is the time complexity of binary search?",
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
                      <p className="font-medium text-sm">{q.question}</p>
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
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setView("list")}>
              Cancel
            </Button>
            <Button variant="outline">Save as Draft</Button>
            <Button onClick={() => handleCreateAssessmentComplete()}>
              Create Assessment
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Redirect students away from faculty-only views
  if (
    user?.role === "student" &&
    [
      "questions",
      "bulk-import",
      "create-assessment",
      "create-question",
      "edit-question",
      "view-question",
    ].includes(view)
  ) {
    setView("list");
  }

  if (view === "view-assessment" && user?.role === "student") {
    return (
      <div className="space-y-6">
        <div className="page-header">
          <h1 className="text-3xl font-bold tracking-tight">
            {user?.role === "student" ? "My Assessments" : "Assessments"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {user?.role === "student"
              ? "View and take assessments for your enrolled courses"
              : "Advanced assessment and question bank management system"}
          </p>
        </div>
        {renderStudentAssessmentDetailsView()}
      </div>
    );
  }

  if (view === "take-assessment" && user?.role === "student") {
    return (
      <div className="space-y-6">
        <div className="page-header">
          <h1 className="text-3xl font-bold tracking-tight">
            Taking Assessment
          </h1>
          <p className="text-muted-foreground mt-2">
            Complete your assessment within the time limit
          </p>
        </div>
        {renderTakeAssessmentView()}
      </div>
    );
  }

  if (view === "questions") {
    return (
      <div className="space-y-6">
        <div className="page-header">
          <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
          <p className="text-muted-foreground mt-2">
            Advanced assessment and question bank management system
          </p>
        </div>
        {renderQuestionsView()}
      </div>
    );
  }

  if (view === "create-question" || view === "edit-question") {
    return (
      <div className="space-y-6">
        <div className="page-header">
          <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
          <p className="text-muted-foreground mt-2">
            Advanced assessment and question bank management system
          </p>
        </div>
        {renderCreateEditQuestionView()}
      </div>
    );
  }

  if (view === "view-question") {
    return (
      <div className="space-y-6">
        <div className="page-header">
          <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
          <p className="text-muted-foreground mt-2">
            Advanced assessment and question bank management system
          </p>
        </div>
        {renderViewQuestionView()}
      </div>
    );
  }

  if (view === "bulk-import") {
    return (
      <div className="space-y-6">
        <div className="page-header">
          <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
          <p className="text-muted-foreground mt-2">
            Advanced assessment and question bank management system
          </p>
        </div>
        {renderBulkImportView()}
      </div>
    );
  }

  if (view === "create-assessment") {
    return (
      <div className="space-y-6">
        <div className="page-header">
          <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
          <p className="text-muted-foreground mt-2">
            Advanced assessment and question bank management system
          </p>
        </div>
        {renderCreateAssessmentView()}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-3xl font-bold tracking-tight">
          {user?.role === "student" ? "My Assessments" : "Assessments"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {user?.role === "student"
            ? "View and take assessments for your enrolled courses"
            : "Advanced assessment and question bank management system"}
        </p>
      </div>

      {/* Show student assessments view for students */}
      {user?.role === "student" ? (
        renderStudentAssessmentsView()
      ) : (
        /* Faculty/Admin view */
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
                  <Button
                    className="w-full"
                    onClick={() => setView("questions")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Manage Questions
                  </Button>
                </div>
              </Card>

              <Card className="p-4 border-2 border-dashed border-green-200 hover:border-green-400 transition-colors">
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto mb-3 text-green-600" />
                  <h4 className="font-medium mb-2">Bulk Upload</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Import questions from files
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setView("bulk-import")}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Bulk Import
                  </Button>
                </div>
              </Card>

              <Card className="p-4 border-2 border-dashed border-purple-200 hover:border-purple-400 transition-colors">
                <div className="text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                  <h4 className="font-medium mb-2">Create Assessment</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure and schedule assessments
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setView("create-assessment")}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    New Assessment
                  </Button>
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
                          <Button
                            size="sm"
                            onClick={() => {
                              const question = document.querySelector(
                                'textarea[placeholder="Enter your question..."]',
                              ) as HTMLTextAreaElement;
                              const optionA = document.querySelector(
                                'input[placeholder="Option A"]',
                              ) as HTMLInputElement;
                              const optionB = document.querySelector(
                                'input[placeholder="Option B"]',
                              ) as HTMLInputElement;
                              const optionC = document.querySelector(
                                'input[placeholder="Option C"]',
                              ) as HTMLInputElement;
                              const optionD = document.querySelector(
                                'input[placeholder="Option D"]',
                              ) as HTMLInputElement;
                              const points = document.querySelector(
                                'input[placeholder="10"]',
                              ) as HTMLInputElement;

                              if (!question?.value.trim()) {
                                alert("Please enter a question");
                                return;
                              }

                              const questionData = {
                                question: question.value,
                                options: {
                                  A: optionA?.value || "",
                                  B: optionB?.value || "",
                                  C: optionC?.value || "",
                                  D: optionD?.value || "",
                                },
                                points: points?.value || "10",
                              };

                              alert(
                                `MCQ Question Added Successfully!\n\nQuestion: ${questionData.question}\nOptions:\nA) ${questionData.options.A}\nB) ${questionData.options.B}\nC) ${questionData.options.C}\nD) ${questionData.options.D}\nPoints: ${questionData.points}\n\nThe question has been added to the question bank.`,
                              );

                              // Clear form
                              if (question) question.value = "";
                              if (optionA) optionA.value = "";
                              if (optionB) optionB.value = "";
                              if (optionC) optionC.value = "";
                              if (optionD) optionD.value = "";
                              if (points) points.value = "";
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Question
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="short" className="space-y-4">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">
                        Short Answer Questions
                      </h4>
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
                            <Label className="text-sm">
                              Max Length (words)
                            </Label>
                            <Input placeholder="100" className="mt-1" />
                          </div>
                          <div>
                            <Label className="text-sm">Points</Label>
                            <Input placeholder="15" className="mt-1" />
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            const question = document.querySelector(
                              'textarea[placeholder="Enter your short answer question..."]',
                            ) as HTMLTextAreaElement;
                            const expectedAnswer = document.querySelector(
                              'input[placeholder="Expected answer keywords..."]',
                            ) as HTMLInputElement;
                            const maxLength = document.querySelector(
                              'input[placeholder="100"]',
                            ) as HTMLInputElement;
                            const points = document.querySelector(
                              'input[placeholder="15"]',
                            ) as HTMLInputElement;

                            if (!question?.value.trim()) {
                              alert("Please enter a question");
                              return;
                            }

                            const questionData = {
                              question: question.value,
                              expectedAnswer: expectedAnswer?.value || "",
                              maxLength: maxLength?.value || "100",
                              points: points?.value || "15",
                            };

                            alert(
                              `Short Answer Question Added Successfully!\n\nQuestion: ${questionData.question}\nExpected Answer: ${questionData.expectedAnswer}\nMax Length: ${questionData.maxLength} words\nPoints: ${questionData.points}\n\nThe question has been added to the question bank.`,
                            );

                            // Clear form
                            if (question) question.value = "";
                            if (expectedAnswer) expectedAnswer.value = "";
                            if (maxLength) maxLength.value = "";
                            if (points) points.value = "";
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Question
                        </Button>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="long" className="space-y-4">
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">
                        Long Answer Questions
                      </h4>
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
                            <Label className="text-sm">
                              Min Length (words)
                            </Label>
                            <Input placeholder="200" className="mt-1" />
                          </div>
                          <div>
                            <Label className="text-sm">
                              Max Length (words)
                            </Label>
                            <Input placeholder="500" className="mt-1" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Label className="text-sm">Points:</Label>
                            <Input className="w-20" placeholder="25" />
                          </div>
                          <Button
                            size="sm"
                            onClick={() => {
                              const question = document.querySelector(
                                'textarea[placeholder="Enter your essay question..."]',
                              ) as HTMLTextAreaElement;
                              const rubric = document.querySelector(
                                'textarea[placeholder="Define grading criteria..."]',
                              ) as HTMLTextAreaElement;
                              const minLength = document.querySelector(
                                'input[placeholder="200"]',
                              ) as HTMLInputElement;
                              const maxLength = document.querySelector(
                                'input[placeholder="500"]',
                              ) as HTMLInputElement;
                              const points = document.querySelector(
                                'input[placeholder="25"]',
                              ) as HTMLInputElement;

                              if (!question?.value.trim()) {
                                alert("Please enter a question");
                                return;
                              }

                              const questionData = {
                                question: question.value,
                                rubric: rubric?.value || "",
                                minLength: minLength?.value || "200",
                                maxLength: maxLength?.value || "500",
                                points: points?.value || "25",
                              };

                              alert(
                                `Long Answer Question Added Successfully!\n\nQuestion: ${questionData.question}\nGrading Rubric: ${questionData.rubric}\nLength: ${questionData.minLength}-${questionData.maxLength} words\nPoints: ${questionData.points}\n\nThe question has been added to the question bank.`,
                              );

                              // Clear form
                              if (question) question.value = "";
                              if (rubric) rubric.value = "";
                              if (minLength) minLength.value = "";
                              if (maxLength) maxLength.value = "";
                              if (points) points.value = "";
                            }}
                          >
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
                          <Button
                            size="sm"
                            onClick={() => {
                              const instructions = document.querySelector(
                                'input[placeholder="Match items from Column A with Column B"]',
                              ) as HTMLInputElement;
                              const pointsPerMatch = document.querySelector(
                                'input[placeholder="2"]',
                              ) as HTMLInputElement;

                              const columnA = Array.from(
                                document.querySelectorAll(
                                  'input[placeholder^="Item"]',
                                ),
                              )
                                .map((input: any) => input.value)
                                .filter(Boolean);
                              const columnB = Array.from(
                                document.querySelectorAll(
                                  'input[placeholder^="Match"]',
                                ),
                              )
                                .map((input: any) => input.value)
                                .filter(Boolean);

                              if (
                                columnA.length === 0 ||
                                columnB.length === 0
                              ) {
                                alert("Please enter items in both columns");
                                return;
                              }

                              const questionData = {
                                instructions:
                                  instructions?.value ||
                                  "Match items from Column A with Column B",
                                columnA,
                                columnB,
                                pointsPerMatch: pointsPerMatch?.value || "2",
                              };

                              alert(
                                `Match Following Question Added Successfully!\n\nInstructions: ${questionData.instructions}\nColumn A: ${questionData.columnA.join(", ")}\nColumn B: ${questionData.columnB.join(", ")}\nPoints per match: ${questionData.pointsPerMatch}\n\nThe question has been added to the question bank.`,
                              );

                              // Clear form
                              if (instructions) instructions.value = "";
                              if (pointsPerMatch) pointsPerMatch.value = "";
                              document
                                .querySelectorAll(
                                  'input[placeholder^="Item"], input[placeholder^="Match"]',
                                )
                                .forEach((input: any) => (input.value = ""));
                            }}
                          >
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
                          <Button
                            size="sm"
                            onClick={() => {
                              const question = document.querySelector(
                                'textarea[placeholder="Enter numerical problem..."]',
                              ) as HTMLTextAreaElement;
                              const correctAnswer = document.querySelector(
                                'input[placeholder="42.5"]',
                              ) as HTMLInputElement;
                              const tolerance = document.querySelector(
                                'input[placeholder="0.1"]',
                              ) as HTMLInputElement;
                              const unit = document.querySelector(
                                'input[placeholder="meters"]',
                              ) as HTMLInputElement;
                              const points = document.querySelector(
                                'input[placeholder="10"]',
                              ) as HTMLInputElement;
                              const allowFormulas = document.querySelector(
                                "#formulas",
                              ) as HTMLInputElement;

                              if (!question?.value.trim()) {
                                alert("Please enter a question");
                                return;
                              }

                              if (!correctAnswer?.value.trim()) {
                                alert("Please enter the correct answer");
                                return;
                              }

                              const questionData = {
                                question: question.value,
                                correctAnswer: correctAnswer.value,
                                tolerance: tolerance?.value || "0.1",
                                unit: unit?.value || "",
                                points: points?.value || "10",
                                allowFormulas: allowFormulas?.checked || false,
                              };

                              alert(
                                `Numerical Question Added Successfully!\n\nQuestion: ${questionData.question}\nCorrect Answer: ${questionData.correctAnswer}\nTolerance: ±${questionData.tolerance}\nUnit: ${questionData.unit}\nPoints: ${questionData.points}\nAllow Formulas: ${questionData.allowFormulas ? "Yes" : "No"}\n\nThe question has been added to the question bank.`,
                              );

                              // Clear form
                              if (question) question.value = "";
                              if (correctAnswer) correctAnswer.value = "";
                              if (tolerance) tolerance.value = "";
                              if (unit) unit.value = "";
                              if (points) points.value = "";
                              if (allowFormulas) allowFormulas.checked = false;
                            }}
                          >
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
                            <SelectItem value="manual">
                              Manual Grading
                            </SelectItem>
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
                    <TabsTrigger value="evaluation">
                      Auto Evaluation
                    </TabsTrigger>
                    <TabsTrigger value="manual">Manual Review</TabsTrigger>
                    <TabsTrigger value="regrade">Re-grading</TabsTrigger>
                  </TabsList>

                  <TabsContent value="evaluation" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4">
                        <h4 className="font-medium mb-3">
                          Automated Evaluation
                        </h4>
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
                        <Button
                          className="w-full mt-3"
                          onClick={() => {
                            const confirmed = confirm(
                              "Run Auto Evaluation?\n\nThis will automatically grade all MCQ questions and short answers using keyword matching. Long answer questions will still require manual review.\n\nProceed with auto evaluation?",
                            );

                            if (confirmed) {
                              // Simulate auto evaluation process
                              const steps = [
                                "Initializing auto evaluation system...",
                                "Processing MCQ responses...",
                                "Evaluating short answer questions...",
                                "Applying keyword matching algorithms...",
                                "Calculating preliminary scores...",
                                "Identifying questions requiring manual review...",
                                "Generating evaluation report...",
                                "Auto evaluation completed successfully!",
                              ];

                              let currentStep = 0;
                              const interval = setInterval(() => {
                                if (currentStep < steps.length) {
                                  console.log(
                                    `Step ${currentStep + 1}: ${steps[currentStep]}`,
                                  );
                                  currentStep++;
                                } else {
                                  clearInterval(interval);
                                  alert(
                                    "Auto Evaluation Completed!\n\nResults:\n• 40 submissions auto-graded\n• 5 submissions require manual review\n• Average score: 78.5%\n• Completion rate: 89%\n\nLong answer questions and flagged responses are available in the Manual Review queue.",
                                  );
                                }
                              }, 800);
                            }
                          }}
                        >
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
                        <h4 className="font-medium mb-3">
                          Manual Review Queue
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">Student: John Doe</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                alert(`Manual Review for John Doe

Assessment: Midterm Examination
Submission Time: 2024-01-15 14:30
Questions Requiring Review:

1. Long Answer Question: Explain polymorphism in OOP
   Student Answer: Polymorphism allows objects of different types...

2. Short Answer: What is encapsulation?
   Student Answer: Data hiding technique

Click Submit Grade to finalize the score after review.`);
                              }}
                            >
                              Review
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">Student: Jane Smith</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                alert(`Manual Review for Jane Smith

Assessment: Midterm Examination
Submission Time: 2024-01-15 15:45
Questions Requiring Review:

1. Long Answer Question: Describe database normalization
   Student Answer: Process of organizing data to reduce redundancy...

2. Numerical Question: Calculate the area of a circle with radius 5m
   Student Answer: 78.5 (Expected: 78.54)

Click Submit Grade to finalize the score after review.`);
                              }}
                            >
                              Review
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">
                              Student: Mike Johnson
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                alert(`Manual Review for Mike Johnson

Assessment: Midterm Examination
Submission Time: 2024-01-15 16:20
Questions Requiring Review:

1. Long Answer Question: Analyze time complexity
   Student Answer: O(n) means linear time complexity...

2. Short Answer: Define recursion
   Student Answer: Function calling itself

Click Submit Grade to finalize the score after review.`);
                              }}
                            >
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
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              const scoreInput = document.querySelector(
                                'input[placeholder="Score"]',
                              ) as HTMLInputElement;
                              const score = scoreInput?.value || "0";

                              if (
                                confirm(
                                  `Submit Grade?\n\nScore: ${score}/25\n\nThis grade will be recorded and the student will be notified.`,
                                )
                              ) {
                                alert(
                                  `Grade Submitted Successfully!\n\nStudent: Current Review\nScore: ${score}/25\nPercentage: ${Math.round((parseFloat(score) / 25) * 100)}%\nDate: ${new Date().toLocaleDateString()}\n\nThe student has been notified of their grade via email.`,
                                );

                                // Clear the score input
                                if (scoreInput) scoreInput.value = "";
                              }
                            }}
                          >
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
                          <Button
                            className="w-full"
                            onClick={() => {
                              const studentInput = document.querySelector(
                                'input[placeholder="Enter student ID or name"]',
                              ) as HTMLInputElement;
                              const scoreInput = document.querySelector(
                                'input[placeholder="85"]',
                              ) as HTMLInputElement;
                              const reasonInput = document.querySelector(
                                'textarea[placeholder="Explain reason for re-grading..."]',
                              ) as HTMLTextAreaElement;

                              const student = studentInput?.value.trim();
                              const newScore = scoreInput?.value.trim();
                              const reason = reasonInput?.value.trim();

                              if (!student) {
                                alert("Please enter student ID or name");
                                return;
                              }

                              if (!newScore) {
                                alert("Please enter new score");
                                return;
                              }

                              if (!reason) {
                                alert("Please provide reason for re-grading");
                                return;
                              }

                              if (
                                confirm(
                                  `Update Grade?\n\nStudent: ${student}\nNew Score: ${newScore}/100\nReason: ${reason}\n\nThis will update the student's grade and send a notification.`,
                                )
                              ) {
                                alert(
                                  `Grade Updated Successfully!\n\nStudent: ${student}\nNew Score: ${newScore}/100\nReason: ${reason}\nUpdated By: Faculty\nDate: ${new Date().toLocaleDateString()}\n\nThe student has been notified of the grade change.`,
                                );

                                // Clear form
                                if (studentInput) studentInput.value = "";
                                if (scoreInput) scoreInput.value = "";
                                if (reasonInput) reasonInput.value = "";
                              }
                            }}
                          >
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
                                <SelectItem value="all">
                                  All Students
                                </SelectItem>
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
                                <SelectItem value="curve">
                                  Apply Curve
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-sm">Value</Label>
                            <Input placeholder="5" className="mt-1" />
                          </div>
                          <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => {
                              const groupSelect = document.querySelector(
                                "select",
                              ) as HTMLSelectElement;
                              const adjustmentSelect =
                                document.querySelectorAll(
                                  "select",
                                )[1] as HTMLSelectElement;
                              const valueInput = document.querySelector(
                                'input[placeholder="5"]',
                              ) as HTMLInputElement;

                              const group = groupSelect?.value || "all";
                              const adjustment =
                                adjustmentSelect?.value || "add";
                              const value = valueInput?.value || "5";

                              const groupText =
                                group === "all"
                                  ? "All Students"
                                  : group === "failed"
                                    ? "Failed Students"
                                    : "Custom Selection";
                              const adjustmentText =
                                adjustment === "add"
                                  ? "Add Points"
                                  : adjustment === "multiply"
                                    ? "Multiply by Factor"
                                    : "Apply Curve";

                              if (
                                confirm(
                                  `Apply Bulk Changes?\n\nTarget: ${groupText}\nAdjustment: ${adjustmentText}\nValue: ${value}\n\nThis will affect multiple student grades. Continue?`,
                                )
                              ) {
                                // Simulate bulk operation
                                const studentsAffected =
                                  group === "all"
                                    ? 45
                                    : group === "failed"
                                      ? 12
                                      : 8;

                                alert(
                                  `Bulk Grade Changes Applied Successfully!\n\nOperation: ${adjustmentText}\nValue: ${value}\nTarget Group: ${groupText}\nStudents Affected: ${studentsAffected}\n\nSummary:\n• ${studentsAffected} grades updated\n• Average change: +${adjustment === "add" ? value : Math.round(parseFloat(value) * 10)}%\n• All affected students have been notified\n\nGrade change log has been updated.`,
                                );

                                // Clear form
                                if (valueInput) valueInput.value = "";
                              }
                            }}
                          >
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
      )}
    </div>
  );
}
