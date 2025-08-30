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
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import {
  FileText,
  Plus,
  Search,
  Calendar,
  Clock,
  Eye,
  Download,
  CheckCircle,
  Upload,
  BarChart3,
  Shield,
} from "lucide-react";

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
  course?: string;
  type?: string;
  graded?: number;
}

interface StudentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: string;
  status: "draft" | "submitted" | "graded";
  files: SubmissionFile[];
  grade?: number;
  feedback?: string;
  submissionText?: string;
}

interface SubmissionFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface Course {
  id: string;
  name: string;
  code: string;
  faculty: string;
}

const mockCourses: Course[] = [
  {
    id: "C001",
    name: "Data Structures & Algorithms",
    code: "CS301",
    faculty: "Madhan",
  },
  {
    id: "C002",
    name: "Machine Learning Fundamentals",
    code: "AI301",
    faculty: "Madhan",
  },
  {
    id: "C003",
    name: "Web Development with React",
    code: "WD401",
    faculty: "Madhan",
  },
  {
    id: "C004",
    name: "Database Management Systems",
    code: "DB301",
    faculty: "Madhan",
  },
];

const mockAssignments: Assignment[] = [
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
    course: "Data Structures & Algorithms",
    type: "Programming",
    graded: 35,
  },
  {
    id: "A002",
    courseId: "C002",
    title: "ML Model Training Project",
    description:
      "Train and evaluate a machine learning model on provided dataset",
    dueDate: "2024-03-05",
    maxPoints: 120,
    submissions: 15,
    plagiarismCheck: true,
    autoGrading: true,
    status: "active",
    course: "Machine Learning Fundamentals",
    type: "Project",
    graded: 10,
  },
  {
    id: "A003",
    courseId: "C003",
    title: "Portfolio Website Development",
    description:
      "Create a personal portfolio website using React and modern web technologies",
    dueDate: "2024-03-25",
    maxPoints: 200,
    submissions: 35,
    plagiarismCheck: true,
    autoGrading: false,
    status: "active",
    course: "Web Development with React",
    type: "Project",
    graded: 30,
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
    course: "Data Structures & Algorithms",
    type: "Report",
    graded: 0,
  },
];

// Mock student submissions
const mockStudentSubmissions: StudentSubmission[] = [
  {
    id: "SUB001",
    assignmentId: "A001",
    studentId: "student-1",
    submittedAt: "2024-02-20T10:30:00Z",
    status: "submitted",
    files: [
      {
        id: "FILE001",
        name: "bst_implementation.py",
        size: 2048,
        type: "text/python",
        url: "/uploads/bst_implementation.py",
      },
    ],
    grade: 85,
    feedback:
      "Good implementation with clear code structure. Consider adding more comments.",
    submissionText:
      "Implemented binary search tree with all required methods including insertion, deletion, and traversal. The code is well-structured and handles edge cases properly.",
  },
  {
    id: "SUB002",
    assignmentId: "A001",
    studentId: "student-2",
    submittedAt: "2024-02-21T14:15:00Z",
    status: "submitted",
    files: [
      {
        id: "FILE002",
        name: "binary_search_tree.java",
        size: 3145,
        type: "text/java",
        url: "/uploads/binary_search_tree.java",
      },
      {
        id: "FILE003",
        name: "test_cases.txt",
        size: 512,
        type: "text/plain",
        url: "/uploads/test_cases.txt",
      },
    ],
    grade: 92,
    feedback:
      "Excellent work! Clean code with comprehensive test cases. Great documentation.",
    submissionText:
      "Complete BST implementation in Java with unit tests. Includes proper error handling and optimization for balanced trees.",
  },
  {
    id: "SUB003",
    assignmentId: "A001",
    studentId: "student-3",
    submittedAt: "2024-02-22T09:45:00Z",
    status: "submitted",
    files: [
      {
        id: "FILE004",
        name: "bst.cpp",
        size: 2876,
        type: "text/cpp",
        url: "/uploads/bst.cpp",
      },
    ],
    grade: 78,
    feedback:
      "Good basic implementation. Missing some edge case handling and could use better variable naming.",
    submissionText:
      "Binary search tree implementation in C++. Covers all basic operations as required.",
  },
  {
    id: "SUB004",
    assignmentId: "A002",
    studentId: "student-1",
    submittedAt: "2024-03-01T16:20:00Z",
    status: "submitted",
    files: [
      {
        id: "FILE005",
        name: "ml_model.py",
        size: 4096,
        type: "text/python",
        url: "/uploads/ml_model.py",
      },
      {
        id: "FILE006",
        name: "dataset_analysis.pdf",
        size: 1048576,
        type: "application/pdf",
        url: "/uploads/dataset_analysis.pdf",
      },
    ],
    submissionText:
      "Implemented and trained a machine learning model using scikit-learn. Achieved 89% accuracy on the test dataset. Included detailed analysis of feature importance and model performance metrics.",
  },
  {
    id: "SUB005",
    assignmentId: "A003",
    studentId: "student-2",
    submittedAt: "2024-03-20T11:30:00Z",
    status: "submitted",
    files: [
      {
        id: "FILE007",
        name: "portfolio_website.zip",
        size: 2097152,
        type: "application/zip",
        url: "/uploads/portfolio_website.zip",
      },
    ],
    grade: 95,
    feedback:
      "Outstanding portfolio! Excellent use of React components, responsive design, and modern web technologies.",
    submissionText:
      "Created a fully responsive portfolio website using React, with modern design principles and interactive components. Includes dark/light mode toggle and smooth animations.",
  },
];

export default function Assignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [courses] = useState<Course[]>(mockCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [view, setView] = useState("list"); // list, create, details, submit
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Student submission states
  const [studentSubmissions, setStudentSubmissions] = useState<
    StudentSubmission[]
  >(mockStudentSubmissions);
  const [submissionFiles, setSubmissionFiles] = useState<File[]>([]);
  const [submissionText, setSubmissionText] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    courseId: "",
    description: "",
    dueDate: "",
    maxPoints: 100,
    type: "individual",
    plagiarismCheck: true,
    autoGrading: false,
    instructions: "",
  });

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesStatus = true;
    if (user?.role === "student") {
      // Student-specific status filtering
      if (statusFilter === "pending") {
        matchesStatus =
          assignment.status === "active" &&
          !isAssignmentSubmitted(assignment.id);
      } else if (statusFilter === "submitted") {
        matchesStatus = isAssignmentSubmitted(assignment.id);
      } else if (statusFilter !== "all") {
        matchesStatus = assignment.status === statusFilter;
      }
    } else {
      // Faculty/admin status filtering
      matchesStatus =
        statusFilter === "all" || assignment.status === statusFilter;
    }

    const matchesCourse =
      courseFilter === "all" || assignment.courseId === courseFilter;

    // For students, only show active assignments (hide drafts)
    const isStudentEligible =
      user?.role !== "student" || assignment.status === "active";

    return matchesSearch && matchesStatus && matchesCourse && isStudentEligible;
  });

  const resetForm = () => {
    setFormData({
      title: "",
      courseId: "",
      description: "",
      dueDate: "",
      maxPoints: 100,
      type: "individual",
      plagiarismCheck: true,
      autoGrading: false,
      instructions: "",
    });
  };

  const handleCreate = () => {
    const newAssignment: Assignment = {
      id: `A${String(assignments.length + 1).padStart(3, "0")}`,
      courseId: formData.courseId,
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      maxPoints: formData.maxPoints,
      submissions: 0,
      plagiarismCheck: formData.plagiarismCheck,
      autoGrading: formData.autoGrading,
      status: "draft",
      course: courses.find((c) => c.id === formData.courseId)?.name || "",
      type: formData.type,
      graded: 0,
    };
    setAssignments([...assignments, newAssignment]);
    setView("list");
    resetForm();
  };

  const openViewDialog = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setView("details");
  };

  const openSubmissionDialog = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setView("submit");
    // Load existing submission if any
    const existingSubmission = studentSubmissions.find(
      (s) => s.assignmentId === assignment.id && s.studentId === user?.id,
    );
    if (existingSubmission) {
      setSubmissionText(existingSubmission.submissionText || "");
    } else {
      setSubmissionText("");
      setSubmissionFiles([]);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSubmissionFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSubmissionFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitAssignment = () => {
    if (!selectedAssignment || !user?.id) return;

    const submissionFiles: SubmissionFile[] = submissionFiles.map(
      (file, index) => ({
        id: `FILE_${Date.now()}_${index}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: `/uploads/${file.name}`,
      }),
    );

    const newSubmission: StudentSubmission = {
      id: `SUB_${Date.now()}`,
      assignmentId: selectedAssignment.id,
      studentId: user.id,
      submittedAt: new Date().toISOString(),
      status: "submitted",
      files: submissionFiles,
      submissionText: submissionText,
    };

    setStudentSubmissions((prev) => {
      // Remove existing submission if any
      const filtered = prev.filter(
        (s) =>
          !(
            s.assignmentId === selectedAssignment.id && s.studentId === user.id
          ),
      );
      return [...filtered, newSubmission];
    });

    // Update assignment submission count
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === selectedAssignment.id
          ? { ...a, submissions: a.submissions + 1 }
          : a,
      ),
    );

    setView("list");
    setSubmissionText("");
    setSubmissionFiles([]);
  };

  const getStudentSubmission = (assignmentId: string) => {
    return studentSubmissions.find(
      (s) => s.assignmentId === assignmentId && s.studentId === user?.id,
    );
  };

  const isAssignmentSubmitted = (assignmentId: string) => {
    const submission = getStudentSubmission(assignmentId);
    return submission && submission.status === "submitted";
  };

  const handleViewSubmissions = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setView("submissions");
  };

  const handleGradeAnalytics = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setView("analytics");
  };

  const handleExportResults = (assignment: Assignment) => {
    if (!assignment) return;

    // Get submissions for this assignment
    const assignmentSubmissions = studentSubmissions.filter(
      (s) => s.assignmentId === assignment.id,
    );

    const exportData = assignmentSubmissions.map((submission) => ({
      AssignmentID: assignment.id,
      AssignmentTitle: assignment.title,
      StudentID: submission.studentId,
      SubmittedAt: new Date(submission.submittedAt).toLocaleDateString(),
      Status: submission.status,
      Grade: submission.grade || "Not Graded",
      MaxPoints: assignment.maxPoints,
      Percentage: submission.grade
        ? ((submission.grade / assignment.maxPoints) * 100).toFixed(1) + "%"
        : "N/A",
      Files: submission.files.map((f) => f.name).join(", "),
      Feedback: submission.feedback || "No feedback",
    }));

    if (exportData.length === 0) {
      alert("No submissions found for this assignment.");
      return;
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      Object.keys(exportData[0]).join(",") +
      "\n" +
      exportData
        .map((row) =>
          Object.values(row)
            .map((val) => `"${val}"`)
            .join(","),
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${assignment.title.replace(/[^a-z0-9]/gi, "_")}_results_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = () => {
    const exportData = assignments.map((assignment) => ({
      ID: assignment.id,
      Title: assignment.title,
      Course: assignment.course,
      DueDate: assignment.dueDate,
      MaxPoints: assignment.maxPoints,
      Submissions: assignment.submissions,
      Graded: assignment.graded || 0,
      Status: assignment.status,
      Type: assignment.type,
      PlagiarismCheck: assignment.plagiarismCheck ? "Yes" : "No",
      AutoGrading: assignment.autoGrading ? "Yes" : "No",
    }));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      Object.keys(exportData[0]).join(",") +
      "\n" +
      exportData.map((row) => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `assignments_export_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "draft":
        return "secondary";
      case "closed":
        return "outline";
      default:
        return "secondary";
    }
  };

  const stats =
    user?.role === "student"
      ? {
          total: assignments.filter((a) => a.status === "active").length,
          submitted: studentSubmissions.filter(
            (s) => s.studentId === user?.id && s.status === "submitted",
          ).length,
          pending: assignments.filter(
            (a) => a.status === "active" && !isAssignmentSubmitted(a.id),
          ).length,
          graded: studentSubmissions.filter(
            (s) => s.studentId === user?.id && s.grade !== undefined,
          ).length,
        }
      : {
          total: assignments.length,
          active: assignments.filter((a) => a.status === "active").length,
          submitted: assignments.reduce((sum, a) => sum + a.submissions, 0),
          graded: assignments.reduce((sum, a) => sum + (a.graded || 0), 0),
        };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {user?.role === "student" ? "My Assignments" : "Assignments"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {user?.role === "student"
              ? "View and submit your course assignments"
              : "Create, manage, and grade assignments with plagiarism detection and rubric-based grading"}
          </p>
        </div>
        {user?.role !== "student" && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setView("create")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {user?.role === "student"
                    ? "Available Assignments"
                    : "Total Assignments"}
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {user?.role === "student" ? "Submitted" : "Active"}
                </p>
                <p className="text-2xl font-bold">
                  {user?.role === "student" ? stats.submitted : stats.active}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {user?.role === "student" ? "Pending" : "Submissions"}
                </p>
                <p className="text-2xl font-bold">
                  {user?.role === "student" ? stats.pending : stats.submitted}
                </p>
              </div>
              <Upload className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Graded
                </p>
                <p className="text-2xl font-bold">{stats.graded}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Assignment View - Hidden for students */}
      {view === "create" && user?.role !== "student" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Create New Assignment</CardTitle>
                <CardDescription>
                  Create a new assignment with detailed requirements and grading
                  criteria
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => setView("list")}>
                Back to List
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Assignment Title</Label>
                  <Input
                    placeholder="Enter assignment title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Course</Label>
                  <Select
                    value={formData.courseId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, courseId: value })
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
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="Provide detailed assignment description and requirements"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Max Points</Label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={formData.maxPoints}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxPoints: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Assignment Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="group">Group Project</SelectItem>
                      <SelectItem value="presentation">Presentation</SelectItem>
                      <SelectItem value="research">Research Paper</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Submission Guidelines</Label>
                <Textarea
                  placeholder="Specify file formats, submission instructions, etc."
                  rows={2}
                  value={formData.instructions}
                  onChange={(e) =>
                    setFormData({ ...formData, instructions: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="plagiarism"
                  checked={formData.plagiarismCheck}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      plagiarismCheck: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="plagiarism">Enable plagiarism detection</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auto-grade"
                  checked={formData.autoGrading}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      autoGrading: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="auto-grade">Enable auto grading</Label>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setView("list")}>
                  Cancel
                </Button>
                <Button onClick={handleCreate}>Create Assignment</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Student Submission View */}
      {view === "submit" && user?.role === "student" && selectedAssignment && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  Submit Assignment: {selectedAssignment.title}
                </CardTitle>
                <CardDescription>
                  Complete and submit your assignment work
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => setView("list")}>
                Back to List
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Assignment Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Course
                  </Label>
                  <p className="font-semibold">{selectedAssignment.course}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Due Date
                  </Label>
                  <p className="font-semibold">{selectedAssignment.dueDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Max Points
                  </Label>
                  <p className="font-semibold">
                    {selectedAssignment.maxPoints}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Type
                  </Label>
                  <p className="font-semibold">{selectedAssignment.type}</p>
                </div>
              </div>

              {/* Assignment Description */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Assignment Description
                </Label>
                <p className="mt-2 p-4 bg-background border rounded-lg">
                  {selectedAssignment.description}
                </p>
              </div>

              {/* Submission Text */}
              <div>
                <Label htmlFor="submission-text">Your Work/Answer</Label>
                <Textarea
                  id="submission-text"
                  placeholder="Type your assignment work, answers, or explanations here..."
                  rows={8}
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* File Upload */}
              <div>
                <Label htmlFor="file-upload">Attach Files (Optional)</Label>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="mt-2"
                  accept=".pdf,.doc,.docx,.txt,.zip,.py,.java,.cpp,.js,.html,.css"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Supported formats: PDF, DOC, DOCX, TXT, ZIP, code files
                </p>
              </div>

              {/* Uploaded Files */}
              {submissionFiles.length > 0 && (
                <div>
                  <Label>Attached Files</Label>
                  <div className="mt-2 space-y-2">
                    {submissionFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Submission Info */}
              {getStudentSubmission(selectedAssignment.id) && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">
                    Previous Submission
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    You have already submitted this assignment. Submitting again
                    will replace your previous submission.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setView("list")}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitAssignment}
                  disabled={
                    !submissionText.trim() && submissionFiles.length === 0
                  }
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Submit Assignment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assignment Details View */}
      {view === "details" && selectedAssignment && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedAssignment.title}</CardTitle>
                <CardDescription>
                  Assignment details and submission information
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => setView("list")}>
                Back to List
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Course
                  </Label>
                  <p className="font-semibold">{selectedAssignment.course}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Due Date
                  </Label>
                  <p className="font-semibold">{selectedAssignment.dueDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Max Points
                  </Label>
                  <p className="font-semibold">
                    {selectedAssignment.maxPoints}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Status
                  </Label>
                  <Badge variant={getStatusColor(selectedAssignment.status)}>
                    {selectedAssignment.status}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Description
                </Label>
                <p className="mt-1">{selectedAssignment.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {selectedAssignment.submissions}
                  </p>
                  <p className="text-sm text-muted-foreground">Submissions</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {selectedAssignment.graded || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Graded</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {selectedAssignment.submissions > 0
                      ? Math.round(
                          ((selectedAssignment.graded || 0) /
                            selectedAssignment.submissions) *
                            100,
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-sm text-muted-foreground">Completion</p>
                </div>
              </div>

              {/* Student Submission Status */}
              {user?.role === "student" && (
                <div className="border-t pt-6">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Your Submission
                  </Label>
                  {getStudentSubmission(selectedAssignment.id) ? (
                    <div className="mt-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-green-800">
                            Submitted
                          </p>
                          <p className="text-sm text-green-600">
                            Submitted on{" "}
                            {new Date(
                              getStudentSubmission(
                                selectedAssignment.id,
                              )!.submittedAt,
                            ).toLocaleDateString()}
                          </p>
                          {getStudentSubmission(selectedAssignment.id)!
                            .grade && (
                            <p className="text-sm text-green-600">
                              Grade:{" "}
                              {
                                getStudentSubmission(selectedAssignment.id)!
                                  .grade
                              }
                              /{selectedAssignment.maxPoints}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          onClick={() =>
                            openSubmissionDialog(selectedAssignment)
                          }
                        >
                          Update Submission
                        </Button>
                      </div>
                    </div>
                  ) : selectedAssignment.status === "active" ? (
                    <div className="mt-2 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-orange-800">
                            Not Submitted
                          </p>
                          <p className="text-sm text-orange-600">
                            Due: {selectedAssignment.dueDate}
                          </p>
                        </div>
                        <Button
                          onClick={() =>
                            openSubmissionDialog(selectedAssignment)
                          }
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Submit Assignment
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="font-medium text-gray-800">
                        Assignment Closed
                      </p>
                      <p className="text-sm text-gray-600">
                        This assignment is no longer accepting submissions.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Faculty/Admin Actions */}
              {user?.role !== "student" && (
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleViewSubmissions(selectedAssignment)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Submissions
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleGradeAnalytics(selectedAssignment)}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Grade Analytics
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExportResults(selectedAssignment)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Results
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submissions View */}
      {view === "submissions" &&
        selectedAssignment &&
        user?.role !== "student" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Submissions: {selectedAssignment.title}</CardTitle>
                  <CardDescription>
                    View and grade student submissions for this assignment
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={() => setView("details")}>
                  Back to Assignment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Submission Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {
                        studentSubmissions.filter(
                          (s) => s.assignmentId === selectedAssignment.id,
                        ).length
                      }
                    </p>
                    <p className="text-sm text-blue-600">Total Submissions</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {
                        studentSubmissions.filter(
                          (s) =>
                            s.assignmentId === selectedAssignment.id &&
                            s.grade !== undefined,
                        ).length
                      }
                    </p>
                    <p className="text-sm text-green-600">Graded</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">
                      {
                        studentSubmissions.filter(
                          (s) =>
                            s.assignmentId === selectedAssignment.id &&
                            s.grade === undefined,
                        ).length
                      }
                    </p>
                    <p className="text-sm text-orange-600">Pending Review</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {selectedAssignment.maxPoints}
                    </p>
                    <p className="text-sm text-purple-600">Max Points</p>
                  </div>
                </div>

                {/* Submissions List */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Student Submissions
                  </h3>
                  {studentSubmissions.filter(
                    (s) => s.assignmentId === selectedAssignment.id,
                  ).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No submissions yet for this assignment.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {studentSubmissions
                        .filter((s) => s.assignmentId === selectedAssignment.id)
                        .map((submission) => (
                          <Card key={submission.id} className="p-4">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">
                                    Student ID: {submission.studentId}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    Submitted:{" "}
                                    {new Date(
                                      submission.submittedAt,
                                    ).toLocaleString()}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant={
                                      submission.grade ? "default" : "outline"
                                    }
                                  >
                                    {submission.grade
                                      ? `${submission.grade}/${selectedAssignment.maxPoints}`
                                      : "Not Graded"}
                                  </Badge>
                                  <Badge variant="outline">
                                    {submission.status}
                                  </Badge>
                                </div>
                              </div>

                              {submission.submissionText && (
                                <div>
                                  <Label className="text-sm font-medium">
                                    Submission Text:
                                  </Label>
                                  <p className="mt-1 p-3 bg-muted rounded text-sm">
                                    {submission.submissionText}
                                  </p>
                                </div>
                              )}

                              {submission.files.length > 0 && (
                                <div>
                                  <Label className="text-sm font-medium">
                                    Attached Files:
                                  </Label>
                                  <div className="mt-2 space-y-1">
                                    {submission.files.map((file) => (
                                      <div
                                        key={file.id}
                                        className="flex items-center gap-2 p-2 bg-muted rounded"
                                      >
                                        <FileText className="h-4 w-4" />
                                        <span className="text-sm">
                                          {file.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          ({(file.size / 1024).toFixed(1)} KB)
                                        </span>
                                        <Button variant="ghost" size="sm">
                                          <Download className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {submission.feedback && (
                                <div>
                                  <Label className="text-sm font-medium">
                                    Feedback:
                                  </Label>
                                  <p className="mt-1 p-3 bg-green-50 border border-green-200 rounded text-sm">
                                    {submission.feedback}
                                  </p>
                                </div>
                              )}

                              <div className="flex gap-2 pt-2 border-t">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4 mr-1" />
                                  Grade
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Button>
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
        )}

      {/* Grade Analytics View */}
      {view === "analytics" &&
        selectedAssignment &&
        user?.role !== "student" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    Grade Analytics: {selectedAssignment.title}
                  </CardTitle>
                  <CardDescription>
                    Statistical analysis and performance metrics for this
                    assignment
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={() => setView("details")}>
                  Back to Assignment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Analytics Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {studentSubmissions
                          .filter(
                            (s) =>
                              s.assignmentId === selectedAssignment.id &&
                              s.grade,
                          )
                          .reduce(
                            (avg, s, _, arr) => avg + s.grade! / arr.length,
                            0,
                          )
                          .toFixed(1) || "0"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Average Grade
                      </p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {Math.max(
                          ...studentSubmissions
                            .filter(
                              (s) =>
                                s.assignmentId === selectedAssignment.id &&
                                s.grade,
                            )
                            .map((s) => s.grade!),
                          0,
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Highest Grade
                      </p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">
                        {Math.min(
                          ...studentSubmissions
                            .filter(
                              (s) =>
                                s.assignmentId === selectedAssignment.id &&
                                s.grade,
                            )
                            .map((s) => s.grade!),
                          selectedAssignment.maxPoints,
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Lowest Grade
                      </p>
                    </div>
                  </Card>
                </div>

                {/* Grade Distribution */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Grade Distribution
                  </h3>
                  <div className="space-y-2">
                    {[
                      "A (90-100)",
                      "B (80-89)",
                      "C (70-79)",
                      "D (60-69)",
                      "F (0-59)",
                    ].map((grade, index) => {
                      const ranges = [
                        [90, 100],
                        [80, 89],
                        [70, 79],
                        [60, 69],
                        [0, 59],
                      ];
                      const [min, max] = ranges[index];
                      const count = studentSubmissions
                        .filter(
                          (s) =>
                            s.assignmentId === selectedAssignment.id && s.grade,
                        )
                        .filter((s) => {
                          const percentage =
                            (s.grade! / selectedAssignment.maxPoints) * 100;
                          return percentage >= min && percentage <= max;
                        }).length;
                      const total = studentSubmissions.filter(
                        (s) =>
                          s.assignmentId === selectedAssignment.id && s.grade,
                      ).length;
                      const percentage = total > 0 ? (count / total) * 100 : 0;

                      return (
                        <div key={grade} className="flex items-center gap-3">
                          <div className="w-16 text-sm">{grade}</div>
                          <div className="flex-1 bg-muted rounded-full h-6 relative">
                            <div
                              className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                              style={{ width: `${percentage}%` }}
                            >
                              {count > 0 && (
                                <span className="text-white text-xs font-medium">
                                  {count}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="w-12 text-sm text-muted-foreground">
                            {percentage.toFixed(0)}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Submission Timeline */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Submission Timeline
                  </h3>
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Submission timeline chart would be displayed here</p>
                    <p className="text-sm">
                      Visual timeline showing when students submitted their work
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      {/* Assignments Table */}
      {view === "list" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Assignment Management
            </CardTitle>
            <CardDescription>
              Manage assignments with grading, plagiarism detection, and
              submission tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assignments..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Courses" />
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
              {user?.role !== "student" && (
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {user?.role === "student" && (
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Assignments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignments</SelectItem>
                    <SelectItem value="pending">Not Submitted</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments
                  .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                  .map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{assignment.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {assignment.type} • ID: {assignment.id}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {assignment.plagiarismCheck && (
                              <Badge variant="outline" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Plagiarism Check
                              </Badge>
                            )}
                            {assignment.autoGrading && (
                              <Badge variant="outline" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Auto Grade
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{assignment.course}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {assignment.dueDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {assignment.maxPoints} pts
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            {assignment.submissions} submitted
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {assignment.graded || 0} graded
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant={getStatusColor(assignment.status)}>
                            {assignment.status}
                          </Badge>
                          {user?.role === "student" && (
                            <div>
                              {isAssignmentSubmitted(assignment.id) ? (
                                <Badge
                                  variant="outline"
                                  className="text-green-600 border-green-600"
                                >
                                  Submitted
                                </Badge>
                              ) : assignment.status === "active" ? (
                                <Badge
                                  variant="outline"
                                  className="text-orange-600 border-orange-600"
                                >
                                  Pending
                                </Badge>
                              ) : null}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openViewDialog(assignment)}
                            title="View Assignment"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {user?.role === "student" &&
                            assignment.status === "active" && (
                              <>
                                {isAssignmentSubmitted(assignment.id) ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      openSubmissionDialog(assignment)
                                    }
                                    title="Update Submission"
                                    className="text-orange-600"
                                  >
                                    <Upload className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      openSubmissionDialog(assignment)
                                    }
                                    title="Submit Assignment"
                                    className="text-green-600"
                                  >
                                    <Upload className="h-4 w-4" />
                                  </Button>
                                )}
                              </>
                            )}
                          {user?.role !== "student" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleViewSubmissions(assignment)
                                }
                                title="View Submissions"
                                className="text-blue-600"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleGradeAnalytics(assignment)}
                                title="Grade Analytics"
                                className="text-purple-600"
                              >
                                <BarChart3 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleExportResults(assignment)}
                                title="Export Results"
                                className="text-green-600"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                {Math.min(
                  (currentPage - 1) * pageSize + 1,
                  filteredAssignments.length,
                )}{" "}
                to{" "}
                {Math.min(currentPage * pageSize, filteredAssignments.length)}{" "}
                of {filteredAssignments.length} assignments
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(
                      Math.min(
                        Math.ceil(filteredAssignments.length / pageSize),
                        currentPage + 1,
                      ),
                    )
                  }
                  disabled={
                    currentPage ===
                    Math.ceil(filteredAssignments.length / pageSize)
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
