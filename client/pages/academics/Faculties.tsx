import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  User,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  Building,
  Briefcase,
  Plus,
  Eye,
  Edit,
  Trash2
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

export default function Faculties() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterDesignation, setFilterDesignation] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  // Load faculty data
  useEffect(() => {
    const loadFaculties = async () => {
      try {
        // Fallback data in case fetch fails
        const fallbackFaculties: Faculty[] = [
          {
            faculty_id: 102001,
            employee_number: 102001,
            joining_date: "2022-07-15",
            designation: "Assistant Professor",
            department: "Computer Science and Engineering",
            specialization: "Artificial Intelligence",
            employment_type: "Full-Time",
            experience_years: 4,
            employment_status: "Active",
            personal_info: {
              first_name: "Dr",
              middle_name: "Sample",
              last_name: "Faculty",
              full_name: "Dr. Sample Faculty",
              date_of_birth: "1988-04-22",
              gender: "Female",
              blood_group: "O+",
              nationality: "Indian",
              marital_status: "Married",
              religion: "",
              category: ""
            },
            contact_info: {
              email: "sample.faculty@institute.edu",
              phone_number: "+919812345678",
              alternate_phone: "+919812345679",
              address: {
                line: "45 Institute Road",
                city: "Chennai",
                state: "Tamil Nadu",
                zip_code: "600034",
                country: "India"
              },
              emergency_contact: {
                name: "Emergency Contact",
                relationship: "Spouse",
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
              phd_subject: "Sample Research",
              phd_institution: "IIT Madras",
              phd_year: 2016,
              certifications: []
            },
            experience_info: {
              total_experience: 4,
              industry_experience: 0,
              research_experience: 4,
              previous_institutions: [],
              publications_count: 0,
              projects_handled: 0
            },
            documents: {
              profile_photo: "/uploads/photos/sample.jpg",
              resume_cv: "/uploads/docs/sample.pdf",
              degree_certificates: [],
              experience_letters: [],
              research_papers: []
            },
            financial_info: {
              salary: 0,
              bank_account: 123456789012,
              pan_number: "ABCDE1234F",
              provident_fund: ""
            },
            professional_info: {
              subjects_teaching: [],
              current_courses: [],
              research_areas: [],
              conference_attended: 0,
              awards_received: []
            },
            login_credentials: {
              username: "sample.faculty",
              password_plain: "Sample@123",
              last_login: "",
              account_status: "active"
            },
            metadata: {
              created_at: "2022-07-15T09:00:00Z",
              created_by: "hr_admin",
              updated_at: "2025-08-13T14:30:00Z",
              updated_by: "admin"
            },
            institution_code: user?.institutionCode ? parseInt(user.institutionCode) : 102,
            institution_name: user?.institution || "Sample Institution"
          }
        ];

        let facultyData: Faculty[] = fallbackFaculties;

        try {
          // Try to load faculty data from JSON
          const response = await fetch('/faculty.json');
          if (response.ok) {
            const allFaculties: Faculty[] = await response.json();
            
            // Filter faculty by institution
            const userInstitutionCode = user?.institutionCode || user?.selectedInstitutionCode;
            if (userInstitutionCode) {
              facultyData = allFaculties.filter(faculty => 
                faculty.institution_code === parseInt(userInstitutionCode)
              );
            } else {
              // If no institution code, show all faculties (fallback)
              facultyData = allFaculties;
            }
          }
        } catch (fetchError) {
          console.warn('Could not load faculty data, using fallback:', fetchError);
        }

        setFaculties(facultyData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading faculties:', error);
        // Use fallback data even if everything fails
        setFaculties([]);
        setLoading(false);
      }
    };

    loadFaculties();
  }, [user]);

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

  const getDepartments = () => {
    const departments = [...new Set(faculties.map(f => f.department))];
    return departments;
  };

  const getDesignations = () => {
    const designations = [...new Set(faculties.map(f => f.designation))];
    return designations;
  };

  const filteredFaculties = faculties.filter(faculty => {
    const matchesSearch = faculty.personal_info.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.specialization.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = filterDepartment === 'all' || faculty.department === filterDepartment;
    const matchesDesignation = filterDesignation === 'all' || faculty.designation === filterDesignation;
    const matchesStatus = filterStatus === 'all' || faculty.employment_status === filterStatus;

    return matchesSearch && matchesDepartment && matchesDesignation && matchesStatus;
  });

  const handleDeleteFaculty = (facultyId: number) => {
    if (window.confirm('Are you sure you want to delete this faculty member? This action cannot be undone.')) {
      // In real app, make API call to delete
      setFaculties(faculties.filter(f => f.faculty_id !== facultyId));
      console.log('Deleting faculty:', facultyId);
    }
  };

  const stats = {
    totalFaculties: faculties.length,
    activeFaculties: faculties.filter(f => f.employment_status === 'Active').length,
    departments: getDepartments().length,
    averageExperience: faculties.length > 0 ? Math.round(faculties.reduce((sum, f) => sum + f.experience_years, 0) / faculties.length) : 0
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center p-8">
          <div className="text-lg">Loading faculty data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Faculty Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage faculty members and their information for {user?.institution || 'your institution'}.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            onClick={() => navigate('/academics/faculties/create')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Faculty
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Faculty</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalFaculties}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Faculty</p>
                <p className="text-3xl font-bold text-green-900">{stats.activeFaculties}</p>
              </div>
              <User className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Departments</p>
                <p className="text-3xl font-bold text-purple-900">{stats.departments}</p>
              </div>
              <Building className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Avg Experience</p>
                <p className="text-3xl font-bold text-orange-900">{stats.averageExperience} years</p>
              </div>
              <Award className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search faculty by name, department, or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterDepartment} onValueChange={setFilterDepartment}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {getDepartments().map((dept) => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterDesignation} onValueChange={setFilterDesignation}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by designation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Designations</SelectItem>
            {getDesignations().map((designation) => (
              <SelectItem key={designation} value={designation}>{designation}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="On Leave">On Leave</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Faculty List */}
      <Card>
        <CardHeader>
          <CardTitle>Faculty Members</CardTitle>
          <CardDescription>
            {filteredFaculties.length} of {faculties.length} faculty members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {filteredFaculties.map((faculty) => (
              <Card key={faculty.faculty_id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Profile Section */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <GraduationCap className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{faculty.personal_info.full_name}</h3>
                        <p className="text-sm text-gray-600">Employee ID: {faculty.employee_number}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className={getDesignationColor(faculty.designation)}>
                            {faculty.designation}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(faculty.employment_status)}>
                            {faculty.employment_status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Information Grid */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          Department
                        </Label>
                        <p className="text-sm">{faculty.department}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          Specialization
                        </Label>
                        <p className="text-sm">{faculty.specialization}</p>
                      </div>
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
                      <div>
                        <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          Experience
                        </Label>
                        <p className="text-sm">{faculty.experience_years} years</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Joining Date
                        </Label>
                        <p className="text-sm">{new Date(faculty.joining_date).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Qualifications Section */}
                    <div className="lg:w-80">
                      <Label className="text-sm font-medium text-gray-500">Qualifications</Label>
                      <div className="mt-1 space-y-1">
                        {faculty.qualification_info.ug_degree && (
                          <p className="text-sm">{faculty.qualification_info.ug_degree} - {faculty.qualification_info.ug_institution} ({faculty.qualification_info.ug_year})</p>
                        )}
                        {faculty.qualification_info.pg_degree && (
                          <p className="text-sm">{faculty.qualification_info.pg_degree} - {faculty.qualification_info.pg_institution} ({faculty.qualification_info.pg_year})</p>
                        )}
                        {faculty.qualification_info.phd_subject && (
                          <p className="text-sm">Ph.D. in {faculty.qualification_info.phd_subject} - {faculty.qualification_info.phd_institution} ({faculty.qualification_info.phd_year})</p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex lg:flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/academics/faculties/${faculty.faculty_id}`)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/academics/faculties/${faculty.faculty_id}/edit`)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteFaculty(faculty.faculty_id)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFaculties.length === 0 && (
            <div className="text-center py-12">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No faculty found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
