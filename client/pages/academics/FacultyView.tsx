import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  Edit, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  BookOpen,
  Award,
  Building,
  Briefcase,
  GraduationCap,
  Trash2,
  CreditCard
} from 'lucide-react';

interface Faculty {
  faculty_id: number;
  employee_number: number;
  joining_date: string;
  designation: string;
  department: string;
  specialization: string;
  employment_type: string;
  experience_years: number;
  employment_status: string;
  personal_info: {
    first_name: string;
    middle_name: string;
    last_name: string;
    full_name: string;
    date_of_birth: string;
    gender: string;
    blood_group: string;
    nationality: string;
    marital_status: string;
    religion: string;
    category: string;
  };
  contact_info: {
    email: string;
    phone_number: string;
    alternate_phone: string;
    address: {
      line: string;
      city: string;
      state: string;
      zip_code: string;
      country: string;
    };
    emergency_contact: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  qualification_info: {
    ug_degree: string;
    ug_institution: string;
    ug_year: number;
    pg_degree: string;
    pg_institution: string;
    pg_year: number;
    phd_subject: string;
    phd_institution: string;
    phd_year: number;
    certifications: any[];
  };
  experience_info: {
    total_experience: number;
    industry_experience: number;
    research_experience: number;
    previous_institutions: any[];
    publications_count: number;
    projects_handled: number;
  };
  documents: {
    profile_photo: string;
    resume_cv: string;
    degree_certificates: string[];
    experience_letters: any[];
    research_papers: any[];
  };
  financial_info: {
    salary: number;
    bank_account: number;
    pan_number: string;
    provident_fund: string;
  };
  professional_info: {
    subjects_teaching: any[];
    current_courses: any[];
    research_areas: any[];
    conference_attended: number;
    awards_received: any[];
  };
  login_credentials: {
    username: string;
    password_plain: string;
    last_login: string;
    account_status: string;
  };
  metadata: {
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
  };
  institution_code: number;
  institution_name: string;
}

export default function FacultyView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock faculty data - in real app this would come from API
  const mockFaculties: Faculty[] = [
    {
      faculty_id: 11028201,
      employee_number: 11028201,
      joining_date: "2022-07-15",
      designation: "Assistant Professor",
      department: "Computer Science and Engineering",
      specialization: "Artificial Intelligence",
      employment_type: "Full-Time",
      experience_years: 4,
      employment_status: "Active",
      personal_info: {
        first_name: "Anjali",
        middle_name: "Meera",
        last_name: "Nair",
        full_name: "Anjali Meera Nair",
        date_of_birth: "1988-04-22",
        gender: "Female",
        blood_group: "O+",
        nationality: "Indian",
        marital_status: "Married",
        religion: "",
        category: ""
      },
      contact_info: {
        email: "anjali.nair@gmail.com",
        phone_number: "+919812345678",
        alternate_phone: "+919812345679",
        address: {
          line: "45 MG Road",
          city: "Chennai",
          state: "Tamil Nadu",
          zip_code: "600034",
          country: "India"
        },
        emergency_contact: {
          name: "Ravi Nair",
          relationship: "Husband",
          phone: "+919812347890"
        }
      },
      qualification_info: {
        ug_degree: "B.E.",
        ug_institution: "Anna University",
        ug_year: 2008,
        pg_degree: "M.Tech",
        pg_institution: "IIT Madras",
        pg_year: 2011,
        phd_subject: "Deep Learning in Medical Imaging",
        phd_institution: "IIT Madras",
        phd_year: 2016,
        certifications: []
      },
      experience_info: {
        total_experience: 4,
        industry_experience: 0,
        research_experience: 4,
        previous_institutions: [],
        publications_count: 12,
        projects_handled: 8
      },
      documents: {
        profile_photo: "/uploads/photos/F2025001.jpg",
        resume_cv: "/uploads/docs/resume_F2025001.pdf",
        degree_certificates: ["/uploads/docs/phd_cert_F2025001.pdf"],
        experience_letters: [],
        research_papers: []
      },
      financial_info: {
        salary: 750000,
        bank_account: 123456789012,
        pan_number: "ABCDE1234F",
        provident_fund: ""
      },
      professional_info: {
        subjects_teaching: ["Machine Learning", "Data Structures", "Algorithms"],
        current_courses: ["CS301", "CS402"],
        research_areas: ["Artificial Intelligence", "Machine Learning", "Computer Vision"],
        conference_attended: 15,
        awards_received: ["Best Teacher Award 2023", "Research Excellence Award 2022"]
      },
      login_credentials: {
        username: "anjali.nair",
        password_plain: "Anjali@123",
        last_login: "2025-01-15T10:30:00Z",
        account_status: "active"
      },
      metadata: {
        created_at: "2022-07-15T09:00:00Z",
        created_by: "hr_admin",
        updated_at: "2025-08-13T14:30:00Z",
        updated_by: "admin"
      },
      institution_code: 102,
      institution_name: "INSTITUTE OF PRINTING TECHNOLOGY"
    }
  ];

  useEffect(() => {
    const loadFaculty = async () => {
      try {
        let facultyData: Faculty[] = mockFaculties;

        try {
          // Try to load faculty data from JSON
          const response = await fetch('/faculty.json');
          if (response.ok) {
            facultyData = await response.json();
          }
        } catch (fetchError) {
          console.warn('Could not load faculty data, using fallback:', fetchError);
        }

        // Find the faculty by ID
        const foundFaculty = facultyData.find(f => f.faculty_id.toString() === id);
        setFaculty(foundFaculty || null);
        setLoading(false);
      } catch (error) {
        console.error('Error loading faculty:', error);
        setFaculty(null);
        setLoading(false);
      }
    };

    loadFaculty();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      case 'On Leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDesignationColor = (designation: string) => {
    switch (designation) {
      case 'Professor': return 'bg-purple-100 text-purple-800';
      case 'Associate Professor': return 'bg-blue-100 text-blue-800';
      case 'Assistant Professor': return 'bg-green-100 text-green-800';
      case 'Senior Lecturer': return 'bg-orange-100 text-orange-800';
      case 'Lecturer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this faculty member? This action cannot be undone.')) {
      // In real app, make API call to delete
      console.log('Deleting faculty:', id);
      navigate('/academics/faculties');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center p-8">
          <div className="text-lg">Loading faculty details...</div>
        </div>
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/academics/faculties')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Faculties
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Faculty Not Found</h1>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">The requested faculty member could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/academics/faculties')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Faculties
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Faculty Details</h1>
            <p className="text-muted-foreground mt-2">
              Complete information for {faculty.personal_info.full_name}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => navigate(`/academics/faculties/${id}/edit`)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button 
            variant="outline"
            onClick={handleDelete}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Faculty Overview Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Profile Section */}
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{faculty.personal_info.full_name}</h2>
                <p className="text-gray-600">Employee ID: {faculty.employee_number}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge className={getDesignationColor(faculty.designation)}>
                    {faculty.designation}
                  </Badge>
                  <Badge className={getStatusColor(faculty.employment_status)}>
                    {faculty.employment_status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{faculty.experience_years}</p>
                <p className="text-sm text-gray-500">Years Experience</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{faculty.experience_info.publications_count}</p>
                <p className="text-sm text-gray-500">Publications</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{faculty.experience_info.projects_handled}</p>
                <p className="text-sm text-gray-500">Projects</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{faculty.professional_info.conference_attended}</p>
                <p className="text-sm text-gray-500">Conferences</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="qualification">Qualification</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                  <p className="text-sm font-medium">{faculty.personal_info.full_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Date of Birth</Label>
                  <p className="text-sm">{new Date(faculty.personal_info.date_of_birth).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Gender</Label>
                  <p className="text-sm">{faculty.personal_info.gender}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Blood Group</Label>
                  <p className="text-sm">{faculty.personal_info.blood_group}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Nationality</Label>
                  <p className="text-sm">{faculty.personal_info.nationality}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Marital Status</Label>
                  <p className="text-sm">{faculty.personal_info.marital_status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Information Tab */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Primary Contact</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        Email
                      </Label>
                      <p className="text-sm">{faculty.contact_info.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        Phone
                      </Label>
                      <p className="text-sm">{faculty.contact_info.phone_number}</p>
                    </div>
                    {faculty.contact_info.alternate_phone && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          Alternate Phone
                        </Label>
                        <p className="text-sm">{faculty.contact_info.alternate_phone}</p>
                      </div>
                    )}
                    <div>
                      <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Address
                      </Label>
                      <p className="text-sm">
                        {faculty.contact_info.address.line}<br />
                        {faculty.contact_info.address.city}, {faculty.contact_info.address.state} {faculty.contact_info.address.zip_code}<br />
                        {faculty.contact_info.address.country}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">Emergency Contact</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Name</Label>
                      <p className="text-sm">{faculty.contact_info.emergency_contact.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Relationship</Label>
                      <p className="text-sm">{faculty.contact_info.emergency_contact.relationship}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Phone</Label>
                      <p className="text-sm">{faculty.contact_info.emergency_contact.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Professional Information Tab */}
        <TabsContent value="professional">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      Department
                    </Label>
                    <p className="text-sm font-medium">{faculty.department}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Specialization</Label>
                    <p className="text-sm">{faculty.specialization}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Employment Type</Label>
                    <p className="text-sm">{faculty.employment_type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Joining Date
                    </Label>
                    <p className="text-sm">{new Date(faculty.joining_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Institution</Label>
                    <p className="text-sm">{faculty.institution_name}</p>
                  </div>
                </div>

                {faculty.professional_info.subjects_teaching.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Subjects Teaching</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {faculty.professional_info.subjects_teaching.map((subject, index) => (
                        <Badge key={index} variant="outline">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {faculty.professional_info.research_areas.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Research Areas</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {faculty.professional_info.research_areas.map((area, index) => (
                        <Badge key={index} variant="outline">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {faculty.professional_info.awards_received.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Awards & Recognition</Label>
                    <div className="space-y-1 mt-1">
                      {faculty.professional_info.awards_received.map((award, index) => (
                        <p key={index} className="text-sm flex items-center gap-1">
                          <Award className="h-3 w-3 text-yellow-500" />
                          {award}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Qualification Information Tab */}
        <TabsContent value="qualification">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Educational Qualifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {faculty.qualification_info.ug_degree && (
                  <div>
                    <h3 className="font-medium text-green-700">Undergraduate Degree</h3>
                    <div className="mt-2 p-4 bg-green-50 rounded-lg">
                      <p className="font-medium">{faculty.qualification_info.ug_degree}</p>
                      <p className="text-sm text-gray-600">{faculty.qualification_info.ug_institution}</p>
                      <p className="text-sm text-gray-500">Year: {faculty.qualification_info.ug_year}</p>
                    </div>
                  </div>
                )}

                {faculty.qualification_info.pg_degree && (
                  <div>
                    <h3 className="font-medium text-blue-700">Postgraduate Degree</h3>
                    <div className="mt-2 p-4 bg-blue-50 rounded-lg">
                      <p className="font-medium">{faculty.qualification_info.pg_degree}</p>
                      <p className="text-sm text-gray-600">{faculty.qualification_info.pg_institution}</p>
                      <p className="text-sm text-gray-500">Year: {faculty.qualification_info.pg_year}</p>
                    </div>
                  </div>
                )}

                {faculty.qualification_info.phd_subject && (
                  <div>
                    <h3 className="font-medium text-purple-700">Doctoral Degree</h3>
                    <div className="mt-2 p-4 bg-purple-50 rounded-lg">
                      <p className="font-medium">Ph.D. in {faculty.qualification_info.phd_subject}</p>
                      <p className="text-sm text-gray-600">{faculty.qualification_info.phd_institution}</p>
                      <p className="text-sm text-gray-500">Year: {faculty.qualification_info.phd_year}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experience Information Tab */}
        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Experience & Research
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{faculty.experience_info.total_experience}</p>
                  <p className="text-sm text-gray-600">Total Experience (Years)</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{faculty.experience_info.industry_experience}</p>
                  <p className="text-sm text-gray-600">Industry Experience (Years)</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{faculty.experience_info.research_experience}</p>
                  <p className="text-sm text-gray-600">Research Experience (Years)</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{faculty.experience_info.publications_count}</p>
                  <p className="text-sm text-gray-600">Publications</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other Information Tab */}
        <TabsContent value="other">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Financial & Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Salary</Label>
                  <p className="text-sm">₹{faculty.financial_info.salary.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">PAN Number</Label>
                  <p className="text-sm">{faculty.financial_info.pan_number}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Username</Label>
                  <p className="text-sm">{faculty.login_credentials.username}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Account Status</Label>
                  <Badge className={faculty.login_credentials.account_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {faculty.login_credentials.account_status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Last Login</Label>
                  <p className="text-sm">
                    {faculty.login_credentials.last_login 
                      ? new Date(faculty.login_credentials.last_login).toLocaleString()
                      : 'Never'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
