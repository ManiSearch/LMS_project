import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowLeft, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface RegulationData {
  id?: string;
  year: string;
  programs: string[];
  status: string;
  effectiveFrom: string;
  description: string;
  approvedBy: string;
  approvalDate: string;
  totalCredits: number;
  departments: string[];
  subjects: number;
}

export default function RegulationFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEdit = id && id !== 'create';
  
  const [formData, setFormData] = useState<RegulationData>({
    year: '',
    programs: [],
    status: 'Draft',
    effectiveFrom: '',
    description: '',
    approvedBy: '',
    approvalDate: '',
    totalCredits: 160,
    departments: [],
    subjects: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState<Date>();
  const [approvalDate, setApprovalDate] = useState<Date>();

  const availablePrograms = [
    'B.Tech Computer Science',
    'B.Tech Electronics',
    'B.Tech Mechanical',
    'B.Tech Civil',
    'M.Tech Computer Science',
    'M.Tech Electronics',
    'MBA',
    'MCA'
  ];

  const availableDepartments = [
    'Computer Science & Engineering',
    'Electronics & Communication Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Management Studies'
  ];

  // Load existing data if editing
  useEffect(() => {
    if (isEdit) {
      // Simulate loading existing regulation data
      setLoading(true);
      setTimeout(() => {
        const mockData = {
          id,
          year: `R-${new Date().getFullYear()}`,
          programs: ['B.Tech Computer Science', 'M.Tech Computer Science'],
          status: 'Active',
          effectiveFrom: '2024-06-01',
          description: 'Updated regulation with NEP 2020 guidelines and industry-relevant curriculum modifications.',
          approvedBy: 'Academic Council',
          approvalDate: '2024-05-15',
          totalCredits: 160,
          departments: ['Computer Science & Engineering', 'Mathematics'],
          subjects: 45
        };
        setFormData(mockData);
        setEffectiveDate(new Date(mockData.effectiveFrom));
        setApprovalDate(new Date(mockData.approvalDate));
        setLoading(false);
      }, 1000);
    }
  }, [id, isEdit]);

  const handleInputChange = (field: keyof RegulationData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProgramToggle = (program: string) => {
    setFormData(prev => ({
      ...prev,
      programs: prev.programs.includes(program)
        ? prev.programs.filter(p => p !== program)
        : [...prev.programs, program]
    }));
  };

  const handleDepartmentToggle = (department: string) => {
    setFormData(prev => ({
      ...prev,
      departments: prev.departments.includes(department)
        ? prev.departments.filter(d => d !== department)
        : [...prev.departments, department]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.year || !formData.description || formData.programs.length === 0) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields and select at least one program.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Prepare data for submission
      const submitData = {
        ...formData,
        effectiveFrom: effectiveDate ? format(effectiveDate, 'yyyy-MM-dd') : '',
        approvalDate: approvalDate ? format(approvalDate, 'yyyy-MM-dd') : '',
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: isEdit ? "Regulation Updated" : "Regulation Created",
        description: `Regulation ${formData.year} has been ${isEdit ? 'updated' : 'created'} successfully.`,
      });

      navigate('/academics/curriculum/regulations');
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the regulation.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this regulation? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Regulation Deleted",
        description: `Regulation ${formData.year} has been deleted successfully.`,
      });

      navigate('/academics/curriculum/regulations');
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the regulation.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading regulation data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/academics/curriculum/regulations')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Regulations
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEdit ? 'Edit Regulation' : 'Create New Regulation'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? 'Update regulation details and configurations' : 'Configure a new regulation year'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Configure basic regulation details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="year">Regulation Year *</Label>
                    <Input
                      id="year"
                      value={formData.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      placeholder="e.g., R-2024"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Phasing Out">Phasing Out</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the regulation and its key features"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Effective From *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !effectiveDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {effectiveDate ? format(effectiveDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={effectiveDate}
                          onSelect={setEffectiveDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <Label htmlFor="totalCredits">Total Credits</Label>
                    <Input
                      id="totalCredits"
                      type="number"
                      value={formData.totalCredits}
                      onChange={(e) => handleInputChange('totalCredits', parseInt(e.target.value) || 0)}
                      placeholder="160"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Programs Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Programs *</CardTitle>
                <CardDescription>Select programs that will follow this regulation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {availablePrograms.map((program) => (
                    <div key={program} className="flex items-center space-x-2">
                      <Checkbox
                        id={program}
                        checked={formData.programs.includes(program)}
                        onCheckedChange={() => handleProgramToggle(program)}
                      />
                      <Label htmlFor={program} className="text-sm">
                        {program}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Departments */}
            <Card>
              <CardHeader>
                <CardTitle>Departments</CardTitle>
                <CardDescription>Select departments involved in this regulation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {availableDepartments.map((department) => (
                    <div key={department} className="flex items-center space-x-2">
                      <Checkbox
                        id={department}
                        checked={formData.departments.includes(department)}
                        onCheckedChange={() => handleDepartmentToggle(department)}
                      />
                      <Label htmlFor={department} className="text-sm">
                        {department}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Approval Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Approval Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="approvedBy">Approved By</Label>
                  <Select value={formData.approvedBy} onValueChange={(value) => handleInputChange('approvedBy', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select approver" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Academic Council">Academic Council</SelectItem>
                      <SelectItem value="Board of Studies">Board of Studies</SelectItem>
                      <SelectItem value="University Senate">University Senate</SelectItem>
                      <SelectItem value="AICTE">AICTE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Approval Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !approvalDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {approvalDate ? format(approvalDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={approvalDate}
                        onSelect={setApprovalDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="subjects">Number of Subjects</Label>
                  <Input
                    id="subjects"
                    type="number"
                    value={formData.subjects}
                    onChange={(e) => handleInputChange('subjects', parseInt(e.target.value) || 0)}
                    placeholder="45"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : (isEdit ? 'Update Regulation' : 'Create Regulation')}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/academics/curriculum/regulations')}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>

                {isEdit && (
                  <Button 
                    type="button" 
                    variant="destructive" 
                    className="w-full"
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    Delete Regulation
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
