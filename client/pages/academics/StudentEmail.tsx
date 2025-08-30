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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Send, 
  X, 
  Mail, 
  FileText,
  Clock,
  AlertCircle 
} from "lucide-react";
import { Student, mockStudents } from "@/mock/data";
import { useAuth } from "@/contexts/AuthContext";

interface EmailFormData {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  message: string;
  priority: 'low' | 'normal' | 'high';
  template?: string;
}

export default function StudentEmail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<EmailFormData>({
    defaultValues: {
      to: "",
      cc: "",
      bcc: "",
      subject: "",
      message: "",
      priority: "normal",
      template: "",
    },
  });

  // Email templates
  const emailTemplates = {
    academic_reminder: {
      subject: "Academic Reminder - {studentName}",
      message: `Dear {studentName},

This is a gentle reminder regarding your academic progress. Please ensure you are up to date with your coursework and assignments.

If you have any questions or need assistance, please don't hesitate to contact us.

Best regards,
{senderName}
{institution}`
    },
    attendance_notice: {
      subject: "Attendance Notice - {studentName}",
      message: `Dear {studentName},

We have noticed that your attendance has been below the required threshold. Please ensure regular attendance to maintain your academic standing.

Current attendance status: Please check your student portal for detailed information.

Best regards,
{senderName}
{institution}`
    },
    fee_reminder: {
      subject: "Fee Payment Reminder - {studentName}",
      message: `Dear {studentName},

This is a reminder regarding your pending fee payment. Please ensure timely payment to avoid any disruption in your academic activities.

For payment details, please contact the accounts department.

Best regards,
{senderName}
{institution}`
    },
    congratulations: {
      subject: "Congratulations on Your Achievement - {studentName}",
      message: `Dear {studentName},

Congratulations on your excellent academic performance! Your dedication and hard work have been recognized.

Keep up the great work and continue striving for excellence.

Best regards,
{senderName}
{institution}`
    },
    general: {
      subject: "Important Notice - {studentName}",
      message: `Dear {studentName},

I hope this message finds you well. 

[Your message content here]

If you have any questions, please feel free to reach out.

Best regards,
{senderName}
{institution}`
    }
  };

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
        
        // Set default email recipient
        form.setValue('to', foundStudent.email);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "graduated":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleTemplateChange = (templateKey: string) => {
    if (!templateKey || !student) return;

    // If "none" is selected, don't apply any template
    if (templateKey === 'none') {
      return;
    }

    const template = emailTemplates[templateKey as keyof typeof emailTemplates];
    if (template) {
      // Replace placeholders with actual values
      const subject = template.subject
        .replace('{studentName}', student.name)
        .replace('{senderName}', user?.name || 'Academic Office')
        .replace('{institution}', student.institution);

      const message = template.message
        .replace('{studentName}', student.name)
        .replace('{senderName}', user?.name || 'Academic Office')
        .replace('{institution}', student.institution);

      form.setValue('subject', subject);
      form.setValue('message', message);
    }
  };

  const handleSendEmail = async (data: EmailFormData) => {
    if (!student) return;

    try {
      setSending(true);
      
      // Mock API call - in real implementation, this would send the actual email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would make the actual API call to send the email
      // await apiSendEmail(data);
      
      toast.success('Email sent successfully!');
      navigate(`/academics/students/${id}`);
    } catch (error) {
      toast.error('Failed to send email');
      console.error('Error sending email:', error);
    } finally {
      setSending(false);
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
            <h1 className="text-3xl font-bold tracking-tight">Send Email</h1>
            <p className="text-muted-foreground">Send email to student</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Send Email</h1>
          <p className="text-muted-foreground">
            Send email to {student.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Info Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Recipient
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={student.avatar} />
                  <AvatarFallback>
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{student.name}</h3>
                  <p className="text-sm text-muted-foreground">{student.email}</p>
                  <Badge
                    className={getStatusColor(student.status)}
                    variant="secondary"
                  >
                    {student.status}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div>
                  <label className="font-medium text-muted-foreground">Roll Number:</label>
                  <p className="font-mono">{student.rollNumber}</p>
                </div>
                <div>
                  <label className="font-medium text-muted-foreground">Program:</label>
                  <p>{student.program}</p>
                </div>
                <div>
                  <label className="font-medium text-muted-foreground">Year/Semester:</label>
                  <p>Year {student.year}, Sem {student.semester}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Compose Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSendEmail)}
                  className="space-y-6"
                >
                  {/* Email Template */}
                  <div>
                    <label className="text-sm font-medium">Email Template</label>
                    <Select
                      onValueChange={(value) => {
                        form.setValue('template', value);
                        handleTemplateChange(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a template (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Template</SelectItem>
                        <SelectItem value="academic_reminder">Academic Reminder</SelectItem>
                        <SelectItem value="attendance_notice">Attendance Notice</SelectItem>
                        <SelectItem value="fee_reminder">Fee Reminder</SelectItem>
                        <SelectItem value="congratulations">Congratulations</SelectItem>
                        <SelectItem value="general">General Notice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Recipients */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="to"
                      rules={{ 
                        required: "Recipient email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To *</FormLabel>
                          <FormControl>
                            <Input placeholder="recipient@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CC</FormLabel>
                          <FormControl>
                            <Input placeholder="cc@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bcc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>BCC</FormLabel>
                          <FormControl>
                            <Input placeholder="bcc@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Subject and Priority */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-3">
                      <FormField
                        control={form.control}
                        name="subject"
                        rules={{ required: "Subject is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter email subject" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-green-600" />
                                  Low
                                </div>
                              </SelectItem>
                              <SelectItem value="normal">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-blue-600" />
                                  Normal
                                </div>
                              </SelectItem>
                              <SelectItem value="high">
                                <div className="flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4 text-red-600" />
                                  High
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Message */}
                  <FormField
                    control={form.control}
                    name="message"
                    rules={{ required: "Message is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your message..."
                            className="min-h-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6">
                    <Button type="submit" disabled={sending}>
                      {sending ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Email
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
      </div>
    </div>
  );
}
