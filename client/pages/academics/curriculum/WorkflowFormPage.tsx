import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { CalendarIcon, ArrowLeft, Save, X, GitBranch, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface WorkflowData {
  id?: number;
  title: string;
  program: string;
  stage: string;
  status: string;
  initiator: string;
  priority: string;
  dueDate: string;
  description: string;
  progress: number;
  comments: string[];
  attachments: string[];
  justification: string;
  expectedOutcome: string;
  impactAnalysis: string;
}

export default function WorkflowFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEdit = id && id !== 'create';
  
  const [formData, setFormData] = useState<WorkflowData>({
    title: '',
    program: '',
    stage: 'Gap Analysis',
    status: 'Draft',
    initiator: '',
    priority: 'Medium',
    dueDate: '',
    description: '',
    progress: 0,
    comments: [],
    attachments: [],
    justification: '',
    expectedOutcome: '',
    impactAnalysis: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [dueDate, setDueDate] = useState<Date>();

  const programs = [
    'B.Tech Computer Science',
    'B.Tech Electronics',
    'B.Tech Mechanical',
    'B.Tech Civil',
    'M.Tech Computer Science',
    'M.Tech Electronics',
    'MBA',
    'MCA'
  ];

  const stages = [
    'Gap Analysis',
    'Faculty Review',
    'Committee Review',
    'Department Head Approval',
    'Final Approval',
    'Implementation',
    'Evaluation'
  ];

  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  const statuses = ['Draft', 'In Progress', 'Pending', 'Approved', 'Rejected', 'Completed'];

  // Load existing data if editing
  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      setTimeout(() => {
        const mockData = {
          id: parseInt(id),
          title: 'AI & ML Curriculum Update',
          program: 'B.Tech Computer Science',
          stage: 'Faculty Review',
          status: 'In Progress',
          initiator: 'Dr. Manikandan',
          priority: 'High',
          dueDate: '2024-03-15',
          description: 'Comprehensive update to include latest AI and ML technologies, frameworks, and industry best practices.',
          progress: 35,
          comments: ['Initial review completed', 'Faculty feedback incorporated'],
          attachments: ['curriculum_draft.pdf', 'industry_requirements.docx'],
          justification: 'Industry demand for AI/ML skills has increased significantly. Current curriculum needs updating to match market requirements.',
          expectedOutcome: 'Students will be better prepared for AI/ML roles in the industry with hands-on experience in modern tools.',
          impactAnalysis: 'Positive impact on placement rates and industry readiness. Requires additional lab resources and faculty training.'
        };
        setFormData(mockData);
        setDueDate(new Date(mockData.dueDate));
        setLoading(false);
      }, 1000);
    }
  }, [id, isEdit]);

  const handleInputChange = (field: keyof WorkflowData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.program || !formData.description) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Prepare data for submission
      const submitData = {
        ...formData,
        dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : '',
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: isEdit ? "Workflow Updated" : "Workflow Created",
        description: `Workflow "${formData.title}" has been ${isEdit ? 'updated' : 'created'} successfully.`,
      });

      navigate('/academics/curriculum/workflows');
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the workflow.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this workflow? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Workflow Deleted",
        description: `Workflow "${formData.title}" has been deleted successfully.`,
      });

      navigate('/academics/curriculum/workflows');
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the workflow.",
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
          <p className="mt-2 text-gray-600">Loading workflow data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/academics/curriculum/workflows')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Workflows
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEdit ? 'Edit Workflow' : 'Create New Workflow'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? 'Update workflow details and progress' : 'Initiate a new curriculum revision workflow'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow Details</CardTitle>
                <CardDescription>Configure basic workflow information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Workflow Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., AI & ML Curriculum Update"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="program">Program *</Label>
                    <Select value={formData.program} onValueChange={(value) => handleInputChange('program', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        {programs.map((program) => (
                          <SelectItem key={program} value={program}>
                            {program}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="initiator">Initiator</Label>
                    <Input
                      id="initiator"
                      value={formData.initiator}
                      onChange={(e) => handleInputChange('initiator', e.target.value)}
                      placeholder="Dr. Name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the proposed changes and their purpose"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="justification">Justification</Label>
                  <Textarea
                    id="justification"
                    value={formData.justification}
                    onChange={(e) => handleInputChange('justification', e.target.value)}
                    placeholder="Explain why this change is necessary"
                  />
                </div>

                <div>
                  <Label htmlFor="expectedOutcome">Expected Outcome</Label>
                  <Textarea
                    id="expectedOutcome"
                    value={formData.expectedOutcome}
                    onChange={(e) => handleInputChange('expectedOutcome', e.target.value)}
                    placeholder="Describe the expected results and benefits"
                  />
                </div>

                <div>
                  <Label htmlFor="impactAnalysis">Impact Analysis</Label>
                  <Textarea
                    id="impactAnalysis"
                    value={formData.impactAnalysis}
                    onChange={(e) => handleInputChange('impactAnalysis', e.target.value)}
                    placeholder="Analyze the impact on students, faculty, and resources"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status and Progress */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status & Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="stage">Current Stage</Label>
                  <Select value={formData.stage} onValueChange={(value) => handleInputChange('stage', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {isEdit && (
                  <div>
                    <Label htmlFor="progress">Progress</Label>
                    <div className="space-y-2">
                      <Input
                        id="progress"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.progress}
                        onChange={(e) => handleInputChange('progress', parseInt(e.target.value) || 0)}
                      />
                      <Progress value={formData.progress} className="w-full" />
                    </div>
                  </div>
                )}
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
                  {loading ? 'Saving...' : (isEdit ? 'Update Workflow' : 'Create Workflow')}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/academics/curriculum/workflows')}
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
                    Delete Workflow
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Statistics */}
            {isEdit && (
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{formData.comments.length}</p>
                    <p className="text-sm text-gray-600">Comments</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{formData.attachments.length}</p>
                    <p className="text-sm text-gray-600">Attachments</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
