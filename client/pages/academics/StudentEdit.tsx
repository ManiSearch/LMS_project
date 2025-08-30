import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { ArrowLeft, Save, X } from "lucide-react";
import { Student, mockStudents } from "@/mock/data";
import { useAuth } from "@/contexts/AuthContext";

type StudentFormData = Omit<Student, "id">;

export default function StudentEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<StudentFormData>({
    defaultValues: {
      name: "",
      email: "",
      rollNumber: "",
      institution: "",
      program: "",
      year: 1,
      semester: 1,
      status: "active",
    },
  });

  const watchedInstitution = form.watch("institution");

  // Institution and their available programs
  const institutionPrograms = {
    "Institution of Printing Technology": [
      "Printing Technology",
      "Graphic Design",
      "Digital Media",
      "Publishing"
    ],
    "Government Polytechnic College, Krishnagiri": [
      "Computer Science",
      "Electrical Engineering",
      "Mechanical Engineering",
      "Civil Engineering"
    ],
    "E I T Polytecnic College": [
      "Textile Engineering",
      "Fashion Technology",
      "Garment Technology",
      "Fabric Science"
    ],
    "Sakthi Polytechnic College": [
      "Computer Science",
      "Electronics",
      "Mechanical Engineering",
      "Civil Engineering"
    ]
  };

  const institutions = Object.keys(institutionPrograms);
  const statuses = ["active", "inactive", "graduated"];

  useEffect(() => {
    const loadStudent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to load from JSON file first
        let studentsData: any[] = [];
        try {
          const response = await fetch('/students.json');
          if (response.ok) {
            studentsData = await response.json();
          } else {
            throw new Error('Failed to fetch students.json');
          }
        } catch (fetchError) {
          console.warn('Failed to fetch students.json, using mock data as fallback...', fetchError);
          // Use mock data as fallback
          studentsData = mockStudents.map(mockStudent => ({
            student_id: mockStudent.id,
            personal_info: {
              full_name: mockStudent.name,
            },
            contact_info: {
              email: mockStudent.email,
            },
            academic_info: {
              institution: mockStudent.institution,
              program: mockStudent.program,
              year: mockStudent.year,
              semester: mockStudent.semester,
            },
            roll_number: mockStudent.rollNumber,
            status: mockStudent.status,
          }));
        }

        // Filter students based on user access
        const filteredStudents = filterStudentsByUserAccess(studentsData, user);
        
        // Transform and find the specific student
        const transformedStudents = filteredStudents.map(transformStudentData);
        const foundStudent = transformedStudents.find(s => s.id === id);

        if (!foundStudent) {
          setError('Student not found');
          return;
        }

        setStudent(foundStudent);
        
        // Populate form with student data
        form.reset({
          name: foundStudent.name,
          email: foundStudent.email,
          rollNumber: foundStudent.rollNumber,
          institution: foundStudent.institution,
          program: foundStudent.program,
          year: foundStudent.year,
          semester: foundStudent.semester,
          status: foundStudent.status,
        });

      } catch (err) {
        console.error('Error loading student:', err);
        setError('Failed to load student data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadStudent();
    }
  }, [id, user, form]);

  // Filter students based on user's role and institution
  const filterStudentsByUserAccess = (studentsData: any[], currentUser: any) => {
    if (!currentUser) return [];

    // Super admin can see all students
    if (currentUser.role === 'super-admin') {
      return studentsData;
    }

    // Get user's institution info
    const userInstitutionCode = currentUser.institutionCode;

    return studentsData.filter(student => {
      if (!student.academic_info) return false;

      const studentInstitutionCode = student.academic_info.institution_code;
      const studentInstitution = student.academic_info.institution;

      // Match by institution code (primary method)
      if (userInstitutionCode && studentInstitutionCode) {
        return String(studentInstitutionCode) === String(userInstitutionCode);
      }

      // Fallback: Match by institution name
      if (studentInstitution && currentUser.institution) {
        const institutionNameMap = {
          '102': 'Institution of Printing Technology',
          '110': 'Government Polytechnic College, Krishnagiri',
          '214': 'E I T Polytecnic College',
          '215': 'Sakthi Polytechnic College'
        };

        const expectedInstitutionName = institutionNameMap[userInstitutionCode as keyof typeof institutionNameMap];

        if (expectedInstitutionName) {
          return studentInstitution.toLowerCase().includes(expectedInstitutionName.toLowerCase()) ||
                 expectedInstitutionName.toLowerCase().includes(studentInstitution.toLowerCase());
        }
      }

      return false;
    });
  };

  // Transform JSON student data to Student interface
  const transformStudentData = (jsonStudent: any): Student => {
    const personal = jsonStudent.personal_info || {};
    const academic = jsonStudent.academic_info || {};
    const contact = jsonStudent.contact_info || {};

    return {
      id: jsonStudent.student_id?.toString() || 'Unknown',
      name: personal.full_name || personal.last_name || 'Unknown Name',
      email: contact.email || '',
      rollNumber: jsonStudent.roll_number || jsonStudent.registration_number || '',
      institution: academic.institution || 'Unknown Institution',
      program: academic.program || 'Unknown Program',
      year: academic.year || 1,
      semester: academic.semester || 1,
      status: jsonStudent.status?.toLowerCase() === 'active' ? 'active' :
               jsonStudent.status?.toLowerCase() === 'graduated' ? 'graduated' : 'inactive',
      avatar: jsonStudent.documents?.profile_photo || undefined,
      parentId: undefined,
      educationalAuthority: academic.educational_authority as "DOTE" | "DOCE" | "ANNA UNIVERSITY" | "BHARATHIAR UNIVERSITY" || "ANNA UNIVERSITY"
    };
  };

  // Get available programs for selected institution
  const getAvailablePrograms = (institution: string) => {
    return (
      institutionPrograms[institution as keyof typeof institutionPrograms] || []
    );
  };

  // Handle institution change - reset program if not available
  const handleInstitutionChange = (institution: string) => {
    const availablePrograms = getAvailablePrograms(institution);
    const currentProgram = form.getValues("program");

    if (currentProgram && !availablePrograms.includes(currentProgram)) {
      form.setValue("program", "");
    }
  };

  const handleSaveStudent = async (data: StudentFormData) => {
    if (!student) return;

    try {
      setSaving(true);
      
      // Mock API call - in real implementation, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would make the actual API call to update the student
      // await apiUpdateStudent(student.id, data);
      
      toast.success('Student updated successfully!');
      navigate(`/academics/students/${id}`);
    } catch (error) {
      toast.error('Failed to update student');
      console.error('Error updating student:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading student details...</p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Student</h1>
            <p className="text-muted-foreground">Update student information</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error || 'Student not found'}</p>
              <Button onClick={() => navigate('/academics/students')}>
                Return to Students List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Student</h1>
          <p className="text-muted-foreground">
            Update information for {student.name}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSaveStudent)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter student name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="rollNumber"
                  rules={{ required: "Roll number is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Roll Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter roll number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statuses.map((status) => (
                            <SelectItem
                              key={status}
                              value={status}
                              className="capitalize"
                            >
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="institution"
                rules={{ required: "Institution is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleInstitutionChange(value);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select institution" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {institutions.map((institution) => (
                          <SelectItem key={institution} value={institution}>
                            {institution}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="program"
                rules={{ required: "Program is required" }}
                render={({ field }) => {
                  const availablePrograms = getAvailablePrograms(watchedInstitution);
                  return (
                    <FormItem>
                      <FormLabel>Program</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!watchedInstitution}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                watchedInstitution
                                  ? "Select program"
                                  : "Select institution first"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availablePrograms.map((program) => (
                            <SelectItem key={program} value={program}>
                              {program}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="year"
                  rules={{
                    required: "Year is required",
                    min: { value: 1, message: "Year must be at least 1" },
                    max: { value: 4, message: "Year cannot exceed 4" },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1-4"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="semester"
                  rules={{
                    required: "Semester is required",
                    min: { value: 1, message: "Semester must be at least 1" },
                    max: { value: 2, message: "Semester cannot exceed 2" },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Semester</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1-2"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/academics/students/${id}`)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
