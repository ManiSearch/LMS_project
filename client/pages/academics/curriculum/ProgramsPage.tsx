import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, GraduationCap, Users, Calendar, Award, Save, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ProgramsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  // Determine the current mode based on the URL path
  const isEditMode = location.pathname.includes('/edit');
  const isCreateMode = location.pathname.includes('/create');
  const isViewMode = !isEditMode && !isCreateMode;

  // Form state for edit/create modes
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    duration: '',
    totalCredits: '',
    semesters: '',
    description: '',
    status: 'active',
    department: '',
    regulation: '',
    startDate: '',
    endDate: ''
  });

  // Mock data - this would come from entity.json or API
  const defaultProgramDetails = {
    name: id || 'Engineering',
    code: id || 'ENG',
    duration: '4 Years',
    totalCredits: 170,
    semesters: 8,
    students: 240,
    description: 'Comprehensive engineering program with industry focus',
    status: 'active',
    department: 'Engineering',
    regulation: 'R23',
    startDate: '2023-07-01',
    endDate: '2027-06-30'
  };

  // Load data when component mounts or when ID changes
  useEffect(() => {
    if (isCreateMode) {
      // Reset form for create mode
      setFormData({
        name: '',
        code: '',
        duration: '',
        totalCredits: '',
        semesters: '',
        description: '',
        status: 'active',
        department: '',
        regulation: '',
        startDate: '',
        endDate: ''
      });
    } else if (id) {
      // Load existing data for edit/view mode
      setFormData({
        name: defaultProgramDetails.name,
        code: defaultProgramDetails.code,
        duration: defaultProgramDetails.duration,
        totalCredits: defaultProgramDetails.totalCredits.toString(),
        semesters: defaultProgramDetails.semesters.toString(),
        description: defaultProgramDetails.description,
        status: defaultProgramDetails.status,
        department: defaultProgramDetails.department,
        regulation: defaultProgramDetails.regulation,
        startDate: defaultProgramDetails.startDate,
        endDate: defaultProgramDetails.endDate
      });
    }
  }, [id, isCreateMode]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.name || !formData.code || !formData.duration) {
        toast.error('Please fill in all required fields');
        return;
      }

      // In a real implementation, this would be an API call
      console.log('Saving program data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(isCreateMode ? 'Program created successfully!' : 'Program updated successfully!');
      
      // Navigate back to view mode or programs list
      if (isCreateMode) {
        navigate('/academics/curriculum');
      } else {
        navigate(`/academics/curriculum/programs/${id}`);
      }
    } catch (error) {
      toast.error('Failed to save program. Please try again.');
    }
  };

  const handleCancel = () => {
    if (isCreateMode) {
      navigate('/academics/curriculum');
    } else {
      navigate(`/academics/curriculum/programs/${id}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/academics/curriculum')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Curriculum
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isCreateMode ? 'Create New Program' : 
               isEditMode ? `Edit ${formData.name || 'Program'}` : 
               `${defaultProgramDetails.name} Program`}
            </h1>
            <p className="text-muted-foreground">
              {isCreateMode ? 'Add a new program to the curriculum' :
               isEditMode ? 'Modify program details and structure' :
               'Program curriculum and structure overview'}
            </p>
          </div>
        </div>
        
        {isViewMode && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/academics/curriculum/programs/${id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Program
            </Button>
            <Button onClick={() => navigate('/academics/curriculum/programs/create')}>
              Create New Program
            </Button>
          </div>
        )}
        
        {(isEditMode || isCreateMode) && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              {isCreateMode ? 'Create Program' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      {/* Form interface for edit/create modes */}
      {(isEditMode || isCreateMode) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Core program details and identification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Program Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Computer Science Engineering"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Program Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    placeholder="e.g., CSE"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="e.g., 4 Years"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semesters">Number of Semesters</Label>
                  <Input
                    id="semesters"
                    type="number"
                    value={formData.semesters}
                    onChange={(e) => handleInputChange('semesters', e.target.value)}
                    placeholder="e.g., 8"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalCredits">Total Credits</Label>
                  <Input
                    id="totalCredits"
                    type="number"
                    value={formData.totalCredits}
                    onChange={(e) => handleInputChange('totalCredits', e.target.value)}
                    placeholder="e.g., 160"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the program objectives and structure..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>Department and regulation information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  placeholder="e.g., Computer Science & Engineering"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="regulation">Regulation</Label>
                <Input
                  id="regulation"
                  value={formData.regulation}
                  onChange={(e) => handleInputChange('regulation', e.target.value)}
                  placeholder="e.g., R23"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View interface for view mode */}
      {isViewMode && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Duration</p>
                    <p className="text-3xl font-bold text-blue-900">{defaultProgramDetails.duration}</p>
                    <p className="text-xs text-blue-600">{defaultProgramDetails.semesters} semesters</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Total Credits</p>
                    <p className="text-3xl font-bold text-green-900">{defaultProgramDetails.totalCredits}</p>
                    <p className="text-xs text-green-600">Required for graduation</p>
                  </div>
                  <Award className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Enrolled Students</p>
                    <p className="text-3xl font-bold text-purple-900">{defaultProgramDetails.students}</p>
                    <p className="text-xs text-purple-600">Active enrollment</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Program Status</p>
                    <p className="text-2xl font-bold text-orange-900">Active</p>
                    <p className="text-xs text-orange-600">Current regulation</p>
                  </div>
                  <GraduationCap className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Program Overview</CardTitle>
              <CardDescription>Detailed information about the {defaultProgramDetails.name} program</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Program Description</h4>
                  <p className="text-sm text-gray-600">{defaultProgramDetails.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Semester Structure</h4>
                    <div className="space-y-2">
                      {Array.from({ length: 8 }, (_, i) => (
                        <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Semester {i + 1}</span>
                          <Badge variant="outline">
                            {i < 6 ? '20-22 Credits' : '18-20 Credits'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        View Curriculum Structure
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Manage Subjects
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Configure Electives
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        View Student Progress
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
