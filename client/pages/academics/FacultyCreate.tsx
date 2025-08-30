import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, X } from 'lucide-react';

export default function FacultyCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Personal Information
    first_name: '',
    middle_name: '',
    last_name: '',
    full_name: '',
    date_of_birth: '',
    gender: '',
    blood_group: '',
    nationality: 'Indian',
    marital_status: '',
    religion: '',
    category: '',
    
    // Contact Information
    email: '',
    phone_number: '',
    alternate_phone: '',
    address_line: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'India',
    emergency_contact_name: '',
    emergency_relationship: '',
    emergency_phone: '',
    
    // Professional Information
    employee_number: '',
    designation: '',
    department: '',
    specialization: '',
    employment_type: 'Full-Time',
    employment_status: 'Active',
    joining_date: '',
    
    // Qualification Information
    ug_degree: '',
    ug_institution: '',
    ug_year: '',
    pg_degree: '',
    pg_institution: '',
    pg_year: '',
    phd_subject: '',
    phd_institution: '',
    phd_year: '',
    
    // Experience Information
    total_experience: '',
    industry_experience: '',
    research_experience: '',
    
    // Financial Information
    salary: '',
    bank_account: '',
    pan_number: '',
    
    // Login Credentials
    username: '',
    password: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.full_name || !formData.email || !formData.employee_number || !formData.department) {
      alert('Please fill in all required fields');
      return;
    }

    // In a real application, this would make an API call
    console.log('Creating faculty:', formData);
    
    // Navigate back to faculties list
    navigate('/academics/faculties');
  };

  const departments = [
    'Computer Science and Engineering',
    'Information Technology',
    'Electronics and Communication Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Electrical Engineering',
    'Textile Engineering',
    'Leather Technology',
    'Commerce',
    'Economics'
  ];

  const designations = [
    'Professor',
    'Associate Professor',
    'Assistant Professor',
    'Senior Lecturer',
    'Lecturer'
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
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
          <h1 className="text-3xl font-bold tracking-tight">Add New Faculty</h1>
          <p className="text-muted-foreground mt-2">
            Create a new faculty member profile with complete information.
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Faculty Information</CardTitle>
          <CardDescription>Fill in the details for the new faculty member</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="qualification">Qualification</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label htmlFor="middle_name">Middle Name</Label>
                  <Input
                    id="middle_name"
                    value={formData.middle_name}
                    onChange={(e) => handleInputChange('middle_name', e.target.value)}
                    placeholder="Enter middle name"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="blood_group">Blood Group</Label>
                  <Select value={formData.blood_group} onValueChange={(value) => handleInputChange('blood_group', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    value={formData.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    placeholder="Enter nationality"
                  />
                </div>
                <div>
                  <Label htmlFor="marital_status">Marital Status</Label>
                  <Select value={formData.marital_status} onValueChange={(value) => handleInputChange('marital_status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Contact Information Tab */}
            <TabsContent value="contact" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="alternate_phone">Alternate Phone</Label>
                  <Input
                    id="alternate_phone"
                    value={formData.alternate_phone}
                    onChange={(e) => handleInputChange('alternate_phone', e.target.value)}
                    placeholder="Enter alternate phone"
                  />
                </div>
                <div>
                  <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                  <Input
                    id="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                    placeholder="Enter emergency contact name"
                  />
                </div>
                <div>
                  <Label htmlFor="emergency_relationship">Emergency Contact Relationship</Label>
                  <Input
                    id="emergency_relationship"
                    value={formData.emergency_relationship}
                    onChange={(e) => handleInputChange('emergency_relationship', e.target.value)}
                    placeholder="Enter relationship"
                  />
                </div>
                <div>
                  <Label htmlFor="emergency_phone">Emergency Contact Phone</Label>
                  <Input
                    id="emergency_phone"
                    value={formData.emergency_phone}
                    onChange={(e) => handleInputChange('emergency_phone', e.target.value)}
                    placeholder="Enter emergency phone"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address_line">Address</Label>
                <Textarea
                  id="address_line"
                  value={formData.address_line}
                  onChange={(e) => handleInputChange('address_line', e.target.value)}
                  placeholder="Enter full address"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <Label htmlFor="zip_code">ZIP Code</Label>
                  <Input
                    id="zip_code"
                    value={formData.zip_code}
                    onChange={(e) => handleInputChange('zip_code', e.target.value)}
                    placeholder="Enter ZIP code"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Professional Information Tab */}
            <TabsContent value="professional" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="employee_number">Employee Number *</Label>
                  <Input
                    id="employee_number"
                    value={formData.employee_number}
                    onChange={(e) => handleInputChange('employee_number', e.target.value)}
                    placeholder="Enter employee number"
                  />
                </div>
                <div>
                  <Label htmlFor="designation">Designation</Label>
                  <Select value={formData.designation} onValueChange={(value) => handleInputChange('designation', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                    <SelectContent>
                      {designations.map((designation) => (
                        <SelectItem key={designation} value={designation}>
                          {designation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem key={department} value={department}>
                          {department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                    placeholder="Enter specialization"
                  />
                </div>
                <div>
                  <Label htmlFor="employment_type">Employment Type</Label>
                  <Select value={formData.employment_type} onValueChange={(value) => handleInputChange('employment_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-Time">Full-Time</SelectItem>
                      <SelectItem value="Part-Time">Part-Time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Visiting">Visiting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="employment_status">Employment Status</Label>
                  <Select value={formData.employment_status} onValueChange={(value) => handleInputChange('employment_status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="On Leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="joining_date">Joining Date</Label>
                  <Input
                    id="joining_date"
                    type="date"
                    value={formData.joining_date}
                    onChange={(e) => handleInputChange('joining_date', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="total_experience">Total Experience (years)</Label>
                  <Input
                    id="total_experience"
                    type="number"
                    value={formData.total_experience}
                    onChange={(e) => handleInputChange('total_experience', e.target.value)}
                    placeholder="Enter total experience"
                  />
                </div>
                <div>
                  <Label htmlFor="industry_experience">Industry Experience (years)</Label>
                  <Input
                    id="industry_experience"
                    type="number"
                    value={formData.industry_experience}
                    onChange={(e) => handleInputChange('industry_experience', e.target.value)}
                    placeholder="Enter industry experience"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Qualification Information Tab */}
            <TabsContent value="qualification" className="space-y-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Undergraduate Degree</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div>
                      <Label htmlFor="ug_degree">Degree</Label>
                      <Input
                        id="ug_degree"
                        value={formData.ug_degree}
                        onChange={(e) => handleInputChange('ug_degree', e.target.value)}
                        placeholder="e.g., B.E., B.Tech"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ug_institution">Institution</Label>
                      <Input
                        id="ug_institution"
                        value={formData.ug_institution}
                        onChange={(e) => handleInputChange('ug_institution', e.target.value)}
                        placeholder="Enter institution name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ug_year">Year of Graduation</Label>
                      <Input
                        id="ug_year"
                        type="number"
                        value={formData.ug_year}
                        onChange={(e) => handleInputChange('ug_year', e.target.value)}
                        placeholder="e.g., 2015"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Postgraduate Degree</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div>
                      <Label htmlFor="pg_degree">Degree</Label>
                      <Input
                        id="pg_degree"
                        value={formData.pg_degree}
                        onChange={(e) => handleInputChange('pg_degree', e.target.value)}
                        placeholder="e.g., M.E., M.Tech"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pg_institution">Institution</Label>
                      <Input
                        id="pg_institution"
                        value={formData.pg_institution}
                        onChange={(e) => handleInputChange('pg_institution', e.target.value)}
                        placeholder="Enter institution name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pg_year">Year of Graduation</Label>
                      <Input
                        id="pg_year"
                        type="number"
                        value={formData.pg_year}
                        onChange={(e) => handleInputChange('pg_year', e.target.value)}
                        placeholder="e.g., 2017"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Doctoral Degree</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div>
                      <Label htmlFor="phd_subject">Ph.D. Subject</Label>
                      <Input
                        id="phd_subject"
                        value={formData.phd_subject}
                        onChange={(e) => handleInputChange('phd_subject', e.target.value)}
                        placeholder="Enter Ph.D. subject"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phd_institution">Institution</Label>
                      <Input
                        id="phd_institution"
                        value={formData.phd_institution}
                        onChange={(e) => handleInputChange('phd_institution', e.target.value)}
                        placeholder="Enter institution name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phd_year">Year of Completion</Label>
                      <Input
                        id="phd_year"
                        type="number"
                        value={formData.phd_year}
                        onChange={(e) => handleInputChange('phd_year', e.target.value)}
                        placeholder="e.g., 2020"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Other Information Tab */}
            <TabsContent value="other" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    type="number"
                    value={formData.salary}
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                    placeholder="Enter salary amount"
                  />
                </div>
                <div>
                  <Label htmlFor="bank_account">Bank Account Number</Label>
                  <Input
                    id="bank_account"
                    value={formData.bank_account}
                    onChange={(e) => handleInputChange('bank_account', e.target.value)}
                    placeholder="Enter bank account number"
                  />
                </div>
                <div>
                  <Label htmlFor="pan_number">PAN Number</Label>
                  <Input
                    id="pan_number"
                    value={formData.pan_number}
                    onChange={(e) => handleInputChange('pan_number', e.target.value)}
                    placeholder="Enter PAN number"
                  />
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Login Credentials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="Enter username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Enter password"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-6 border-t">
            <Button 
              variant="outline" 
              onClick={() => navigate('/academics/faculties')}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Create Faculty
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
