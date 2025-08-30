import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, X, Users, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Faculty {
  faculty_id: number;
  employee_number: number;
  designation: string;
  department: string;
  specialization: string;
  employment_status: string;
  personal_info: {
    full_name: string;
  };
  contact_info: {
    email: string;
    phone_number: string;
  };
  institution_code: number;
  institution_name: string;
  department_id: number;
}

interface Student {
  student_id: number;
  registration_number: number;
  status: string;
  personal_info: {
    full_name: string;
    gender: string;
  };
  contact_info: {
    email: string;
    phone_number: string;
  };
  academic_info: {
    institution: string;
    institution_code: number;
    program: string;
    year: number;
    semester: number;
  };
  department_id: number;
}

export default function FacultyStudentAllotmentCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentSearch, setStudentSearch] = useState("");

  // Form state
  const [assignmentForm, setAssignmentForm] = useState({
    facultyId: "",
    selectedStudentIds: [] as number[],
    className: "",
    section: "",
    academicYear: "2024-2025",
    semester: "1",
    assignmentType: "class_teacher",
    startDate: "",
    endDate: "",
    notes: "",
  });

  // Load faculty and student data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log(
          "🚀 Loading faculty and student data for assignment creation...",
        );
        console.log("User context:", {
          institutionCode: user?.institutionCode,
          selectedInstitutionCode: user?.selectedInstitutionCode,
          institution: user?.institution,
          role: user?.role,
        });

        // Enhanced fallback data based on user's institution
        const userInstitutionCode =
          user?.institutionCode || user?.selectedInstitutionCode || "102";
        const userInstitution = user?.institution || "Sample Institution";

        const fallbackFaculty: Faculty[] = [
          {
            faculty_id: 102001,
            employee_number: 102001,
            designation: "Assistant Professor",
            department: "Computer Science and Engineering",
            specialization: "Artificial Intelligence",
            employment_status: "Active",
            personal_info: {
              full_name: "Dr. Sample Faculty",
            },
            contact_info: {
              email: "faculty@institute.edu",
              phone_number: "+919812345678",
            },
            institution_code: parseInt(userInstitutionCode),
            institution_name: userInstitution,
            department_id: 101,
          },
          {
            faculty_id: 102002,
            employee_number: 102002,
            designation: "Associate Professor",
            department: "Mechanical Engineering",
            specialization: "Manufacturing Technology",
            employment_status: "Active",
            personal_info: {
              full_name: "Dr. Sample Faculty 2",
            },
            contact_info: {
              email: "faculty2@institute.edu",
              phone_number: "+919812345679",
            },
            institution_code: parseInt(userInstitutionCode),
            institution_name: userInstitution,
            department_id: 102,
          },
        ];

        const fallbackStudents: Student[] = [
          {
            student_id: 102001,
            registration_number: 102001,
            status: "Active",
            personal_info: {
              full_name: "Sample Student 1",
              gender: "Male",
            },
            contact_info: {
              email: "student1@institute.edu",
              phone_number: "+919876543210",
            },
            academic_info: {
              institution: userInstitution,
              institution_code: parseInt(userInstitutionCode),
              program: "Computer Science",
              year: 1,
              semester: 1,
            },
            department_id: 101,
          },
          {
            student_id: 102002,
            registration_number: 102002,
            status: "Active",
            personal_info: {
              full_name: "Sample Student 2",
              gender: "Female",
            },
            contact_info: {
              email: "student2@institute.edu",
              phone_number: "+919876543211",
            },
            academic_info: {
              institution: userInstitution,
              institution_code: parseInt(userInstitutionCode),
              program: "Mechanical Engineering",
              year: 1,
              semester: 1,
            },
            department_id: 102,
          },
        ];

        let facultyData: Faculty[] = [];
        let studentData: Student[] = [];

        // Load faculty data from JSON
        try {
          console.log("📂 Attempting to load faculty.json...");
          const facultyResponse = await fetch("/faculty.json");

          if (facultyResponse.ok) {
            const allFaculty: Faculty[] = await facultyResponse.json();
            console.log(
              `✅ Faculty JSON loaded successfully: ${allFaculty.length} total faculty members`,
            );

            const filterInstitutionCode =
              user?.institutionCode || user?.selectedInstitutionCode;

            if (filterInstitutionCode) {
              facultyData = allFaculty.filter(
                (f) =>
                  f.institution_code === parseInt(filterInstitutionCode) &&
                  f.employment_status === "Active",
              );
              console.log(
                `🔍 Filtered faculty by institution ${filterInstitutionCode}: ${facultyData.length} faculty members`,
              );
            } else {
              // If no institution filter, show active faculty from all institutions
              facultyData = allFaculty.filter(
                (f) => f.employment_status === "Active",
              );
              console.log(
                `🔍 No institution filter, showing all active faculty: ${facultyData.length} faculty members`,
              );
            }
          } else {
            console.warn(
              `❌ Faculty response not OK: ${facultyResponse.status} ${facultyResponse.statusText}`,
            );
            facultyData = fallbackFaculty;
          }
        } catch (facultyError) {
          console.warn(
            "❌ Could not load faculty data, using fallback:",
            facultyError,
          );
          facultyData = fallbackFaculty;
        }

        // Load student data from JSON
        try {
          console.log("📂 Attempting to load students.json...");
          const studentResponse = await fetch("/students.json");

          if (studentResponse.ok) {
            const allStudents: Student[] = await studentResponse.json();
            console.log(
              `✅ Student JSON loaded successfully: ${allStudents.length} total students`,
            );

            const filterInstitutionCode =
              user?.institutionCode || user?.selectedInstitutionCode;

            if (filterInstitutionCode) {
              studentData = allStudents.filter(
                (s) =>
                  s.academic_info.institution_code ===
                    parseInt(filterInstitutionCode) && s.status === "Active",
              );
              console.log(
                `🔍 Filtered students by institution ${filterInstitutionCode}: ${studentData.length} students`,
              );
            } else {
              // If no institution filter, show active students from all institutions
              studentData = allStudents.filter((s) => s.status === "Active");
              console.log(
                `🔍 No institution filter, showing all active students: ${studentData.length} students`,
              );
            }
          } else {
            console.warn(
              `❌ Student response not OK: ${studentResponse.status} ${studentResponse.statusText}`,
            );
            studentData = fallbackStudents;
          }
        } catch (studentError) {
          console.warn(
            "❌ Could not load student data, using fallback:",
            studentError,
          );
          studentData = fallbackStudents;
        }

        // Ensure we always have some data to work with
        if (facultyData.length === 0) {
          console.log("⚠️ No faculty data found, using fallback data");
          facultyData = fallbackFaculty;
        }

        if (studentData.length === 0) {
          console.log("⚠️ No student data found, using fallback data");
          studentData = fallbackStudents;
        }

        console.log("📊 Final data summary:", {
          facultyCount: facultyData.length,
          studentCount: studentData.length,
          facultyList: facultyData.map((f) => ({
            id: f.faculty_id,
            name: f.personal_info.full_name,
            dept: f.department,
          })),
          studentList: studentData.map((s) => ({
            id: s.student_id,
            name: s.personal_info.full_name,
            dept_id: s.department_id,
          })),
        });

        setFaculty(facultyData);
        setStudents(studentData);
        setLoading(false);
      } catch (error) {
        console.error("💥 Critical error loading data:", error);

        // Use fallback data even in case of critical error
        const userInstitutionCode =
          user?.institutionCode || user?.selectedInstitutionCode || "102";
        const userInstitution = user?.institution || "Sample Institution";

        setFaculty([
          {
            faculty_id: 102001,
            employee_number: 102001,
            designation: "Assistant Professor",
            department: "Computer Science and Engineering",
            specialization: "Artificial Intelligence",
            employment_status: "Active",
            personal_info: { full_name: "Dr. Sample Faculty" },
            contact_info: {
              email: "faculty@institute.edu",
              phone_number: "+919812345678",
            },
            institution_code: parseInt(userInstitutionCode),
            institution_name: userInstitution,
            department_id: 101,
          },
        ]);

        setStudents([
          {
            student_id: 102001,
            registration_number: 102001,
            status: "Active",
            personal_info: { full_name: "Sample Student", gender: "Male" },
            contact_info: {
              email: "student@institute.edu",
              phone_number: "+919876543210",
            },
            academic_info: {
              institution: userInstitution,
              institution_code: parseInt(userInstitutionCode),
              program: "Computer Science",
              year: 1,
              semester: 1,
            },
            department_id: 101,
          },
        ]);

        setLoading(false);
      }
    };

    if (user) {
      loadData();
    } else {
      console.log("⏳ Waiting for user context...");
      setLoading(false);
    }
  }, [user]);

  const handleCreateAssignment = () => {
    // Validate required fields
    if (
      !assignmentForm.facultyId ||
      !assignmentForm.className ||
      assignmentForm.selectedStudentIds.length === 0
    ) {
      alert(
        "Please fill in all required fields and select at least one student",
      );
      return;
    }

    // In a real application, this would make an API call
    console.log("Creating faculty-student assignment:", assignmentForm);

    // Navigate back to assignments list
    navigate("/staff/allotment");
  };

  const handleStudentToggle = (studentId: number) => {
    setAssignmentForm((prev) => ({
      ...prev,
      selectedStudentIds: prev.selectedStudentIds.includes(studentId)
        ? prev.selectedStudentIds.filter((id) => id !== studentId)
        : [...prev.selectedStudentIds, studentId],
    }));
  };

  const getSelectedFaculty = () => {
    return faculty.find(
      (f) => f.faculty_id.toString() === assignmentForm.facultyId,
    );
  };

  const getFilteredStudents = () => {
    const selectedFaculty = getSelectedFaculty();
    if (!selectedFaculty) return students;

    // Filter students by department and search term
    return students.filter((student) => {
      const matchesDepartment =
        student.department_id === selectedFaculty.department_id;
      const matchesSearch =
        studentSearch === "" ||
        student.personal_info.full_name
          .toLowerCase()
          .includes(studentSearch.toLowerCase()) ||
        student.registration_number.toString().includes(studentSearch);
      return matchesDepartment && matchesSearch;
    });
  };

  const autoSelectStudentsByDepartment = () => {
    const selectedFaculty = getSelectedFaculty();
    if (!selectedFaculty) {
      alert("Please select a faculty member first");
      return;
    }

    const departmentStudents = students.filter(
      (s) => s.department_id === selectedFaculty.department_id,
    );
    setAssignmentForm((prev) => ({
      ...prev,
      selectedStudentIds: departmentStudents.map((s) => s.student_id),
    }));
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <div className="text-lg">Loading faculty and student data...</div>
            <div className="text-sm text-gray-500 mt-2">
              Fetching data from faculty.json and students.json
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate("/staff/allotment")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Assignments
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create Faculty-Student Assignment
          </h1>
          <p className="text-muted-foreground mt-2">
            Assign faculty members to supervise groups of students.
          </p>
          {/* Debug Info */}
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {faculty.length} Faculty Members
            </Badge>
            <Badge variant="outline" className="text-xs">
              {students.length} Students
            </Badge>
            {user?.institutionCode && (
              <Badge variant="secondary" className="text-xs">
                Institution: {user.institutionCode}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Assignment Details */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
            <CardDescription>
              Configure the faculty-student assignment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="faculty">Faculty Member *</Label>
              <Select
                value={assignmentForm.facultyId}
                onValueChange={(value) =>
                  setAssignmentForm({ ...assignmentForm, facultyId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select faculty member" />
                </SelectTrigger>
                <SelectContent>
                  {faculty.length > 0 ? (
                    faculty.map((member) => (
                      <SelectItem
                        key={member.faculty_id}
                        value={member.faculty_id.toString()}
                      >
                        {member.personal_info.full_name} - {member.designation}{" "}
                        ({member.department})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-faculty" disabled>
                      No faculty members available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="className">Class Name *</Label>
                <Input
                  id="className"
                  value={assignmentForm.className}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      className: e.target.value,
                    })
                  }
                  placeholder="e.g., Computer Science Batch A"
                />
              </div>
              <div>
                <Label htmlFor="section">Section</Label>
                <Input
                  id="section"
                  value={assignmentForm.section}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      section: e.target.value,
                    })
                  }
                  placeholder="e.g., A"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="semester">Semester</Label>
                <Select
                  value={assignmentForm.semester}
                  onValueChange={(value) =>
                    setAssignmentForm({ ...assignmentForm, semester: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <SelectItem key={sem} value={sem.toString()}>
                        Semester {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="academicYear">Academic Year</Label>
                <Input
                  id="academicYear"
                  value={assignmentForm.academicYear}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      academicYear: e.target.value,
                    })
                  }
                  placeholder="2024-2025"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="assignmentType">Assignment Type</Label>
              <Select
                value={assignmentForm.assignmentType}
                onValueChange={(value) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    assignmentType: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class_teacher">Class Teacher</SelectItem>
                  <SelectItem value="advisor">Academic Advisor</SelectItem>
                  <SelectItem value="mentor">Mentor</SelectItem>
                  <SelectItem value="subject_guide">Subject Guide</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={assignmentForm.startDate}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={assignmentForm.endDate}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={assignmentForm.notes}
                onChange={(e) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    notes: e.target.value,
                  })
                }
                placeholder="Additional notes about this assignment..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Student Selection */}
        <Card>
          <CardHeader>
            <CardTitle>
              Select Students ({assignmentForm.selectedStudentIds.length}{" "}
              selected)
            </CardTitle>
            <CardDescription>
              Choose students to assign to the selected faculty
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search students..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={autoSelectStudentsByDepartment}
                disabled={!assignmentForm.facultyId}
              >
                Auto-select by Department
              </Button>
            </div>

            {getSelectedFaculty() && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800">
                  Showing students from: {getSelectedFaculty()?.department}
                </p>
                <p className="text-xs text-blue-600">
                  Students under this department will be assigned to the faculty
                  member
                </p>
              </div>
            )}

            <div className="max-h-96 overflow-y-auto space-y-2">
              {getFilteredStudents().map((student) => (
                <div
                  key={student.student_id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={assignmentForm.selectedStudentIds.includes(
                        student.student_id,
                      )}
                      onCheckedChange={() =>
                        handleStudentToggle(student.student_id)
                      }
                    />
                    <div>
                      <p className="font-medium">
                        {student.personal_info.full_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        ID: {student.registration_number} |{" "}
                        {student.academic_info.program} | Year{" "}
                        {student.academic_info.year}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {student.personal_info.gender}
                  </Badge>
                </div>
              ))}

              {getFilteredStudents().length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {assignmentForm.facultyId
                    ? "No students found for the selected department"
                    : "Please select a faculty member first"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                <strong>{assignmentForm.selectedStudentIds.length}</strong>{" "}
                students selected for assignment
              </p>
              {getSelectedFaculty() && (
                <p className="text-sm text-gray-500">
                  Faculty: {getSelectedFaculty()?.personal_info.full_name} (
                  {getSelectedFaculty()?.department})
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/staff/allotment")}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleCreateAssignment}
                disabled={
                  !assignmentForm.facultyId ||
                  !assignmentForm.className ||
                  assignmentForm.selectedStudentIds.length === 0
                }
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Create Assignment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
