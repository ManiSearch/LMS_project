import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Save, X, Plus, Edit, Trash2, Upload, Download, Settings, Network,
  Shield, Target, FileText, Calendar, Users, Clock, CheckCircle,
  AlertCircle, BookOpen, Award, Star, GitBranch, Code, Database,
  Globe, Map, PlayCircle, PenTool, Layers, School, GraduationCap,
  Eye
} from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  item?: any;
  onSave?: (data: any) => void;
}

// Quick Action Dialog
export function QuickActionDialog({ isOpen, onClose, onSave }: DialogProps) {
  const [activeCategory, setActiveCategory] = useState('create');

  const handleAction = (action: string) => {
    onSave?.(action);
    onClose();
  };

  const actionCategories = {
    create: [
      { action: 'newRegulation', icon: FileText, label: 'Create New Curriculum', description: 'Design a complete curriculum structure' },
      { action: 'newRegulation', icon: Calendar, label: 'Create Regulation Year', description: 'Set up new academic regulation' },
      { action: 'createLessonPlan', icon: BookOpen, label: 'Create Lesson Plan', description: 'Design subject lesson plan' },
      { action: 'addUnit', icon: Plus, label: 'Add Academic Unit', description: 'Add new unit to curriculum' }
    ],
    manage: [
      { action: 'initiateRevision', icon: GitBranch, label: 'Initiate Revision', description: 'Start curriculum revision workflow' },
      { action: 'configureOutcomes', icon: Target, label: 'Configure Outcomes', description: 'Set learning outcomes and mappings' },
      { action: 'manageElectivePolicies', icon: Settings, label: 'Manage Electives', description: 'Configure elective policies' },
      { action: 'apiIntegrations', icon: Network, label: 'API Integrations', description: 'Manage external integrations' }
    ],
    upload: [
      { action: 'createLessonPlan', icon: Upload, label: 'Upload Syllabus', description: 'Upload syllabus content' },
      { action: 'bulkUpload', icon: Database, label: 'Bulk Upload', description: 'Import multiple records via CSV/Excel' },
      { action: 'createLessonPlan', icon: FileText, label: 'Import Documents', description: 'Upload curriculum documents' }
    ],
    review: [
      { action: 'pendingApprovals', icon: Shield, label: 'Pending Approvals', description: 'Review approval queue' },
      { action: 'revisionView', icon: Eye, label: 'Review Revisions', description: 'Check revision progress' },
      { action: 'regulationView', icon: CheckCircle, label: 'Regulation Status', description: 'View regulation details' }
    ]
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quick Actions</DialogTitle>
          <DialogDescription>Select a category and action to perform curriculum operations</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {Object.keys(actionCategories).map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              onClick={() => setActiveCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {actionCategories[activeCategory].map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Card key={index} className="cursor-pointer hover:bg-gray-50 transition-colors">
                <CardContent className="p-4">
                  <Button
                    variant="ghost"
                    className="w-full h-auto p-0 justify-start"
                    onClick={() => handleAction(item.action)}
                  >
                    <div className="flex items-start space-x-3 text-left">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mt-1">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// New Regulation Dialog
export function NewRegulationDialog({ isOpen, onClose, onSave }: DialogProps) {
  const [formData, setFormData] = useState({
    year: '',
    programs: [],
    effectiveFrom: '',
    description: '',
    creditStructure: 'cbcs',
    academicCalendar: '',
    gradeScheme: 'relative'
  });

  const handleSave = () => {
    onSave?.(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure New Regulation Year</DialogTitle>
          <DialogDescription>Set up a new regulation with program specifications</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Regulation Year *</Label>
              <Input
                placeholder="e.g., R-2025"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Effective From *</Label>
              <Input
                type="date"
                value={formData.effectiveFrom}
                onChange={(e) => setFormData({...formData, effectiveFrom: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Brief description of this regulation..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Credit Structure</Label>
              <Select value={formData.creditStructure} onValueChange={(value) => setFormData({...formData, creditStructure: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cbcs">CBCS (Choice Based Credit System)</SelectItem>
                  <SelectItem value="traditional">Traditional</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Grade Scheme</Label>
              <Select value={formData.gradeScheme} onValueChange={(value) => setFormData({...formData, gradeScheme: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relative">Relative Grading</SelectItem>
                  <SelectItem value="absolute">Absolute Grading</SelectItem>
                  <SelectItem value="hybrid">Hybrid Grading</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Program Selection</CardTitle>
              <CardDescription>Select programs that will follow this regulation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {['B.Tech CSE', 'B.Tech ECE', 'B.Tech ME', 'B.Tech EEE', 'MBA', 'MCA', 'M.Tech', 'PhD'].map((program) => (
                  <div key={program} className="flex items-center space-x-2">
                    <Switch />
                    <label className="text-sm">{program}</label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Create Regulation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Regulation View Dialog
export function RegulationViewDialog({ isOpen, onClose, item }: DialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Regulation Details - {item?.year}</DialogTitle>
          <DialogDescription>Complete regulation information and statistics</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Regulation Year:</span>
                  <Badge variant="outline">{item?.year}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant={item?.status === 'Active' ? 'default' : 'secondary'}>
                    {item?.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Effective From:</span>
                  <span>{item?.effectiveFrom}</span>
                </div>
                <div className="flex justify-between">
                  <span>Students Affected:</span>
                  <span className="font-medium">{item?.students?.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {item?.programs?.map((program, index) => (
                    <Badge key={index} variant="outline" className="mr-2 mb-2">
                      {program}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Credit Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">180</div>
                  <div className="text-sm text-blue-600">Total Credits</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className="text-sm text-green-600">Semesters</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">45</div>
                  <div className="text-sm text-purple-600">Subjects</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Regulation Edit Dialog
export function RegulationEditDialog({ isOpen, onClose, item, onSave }: DialogProps) {
  const [formData, setFormData] = useState({
    year: item?.year || '',
    status: item?.status || 'Active',
    effectiveFrom: item?.effectiveFrom || '',
    programs: item?.programs || [],
    description: ''
  });

  const handleSave = () => {
    onSave?.(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Regulation - {item?.year}</DialogTitle>
          <DialogDescription>Update regulation details and configuration</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Regulation Year</Label>
              <Input
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Phasing Out">Phasing Out</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Effective From</Label>
            <Input
              type="date"
              value={formData.effectiveFrom}
              onChange={(e) => setFormData({...formData, effectiveFrom: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Update description..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Update Regulation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Initiate Revision Dialog
export function InitiateRevisionDialog({ isOpen, onClose, onSave }: DialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    program: '',
    reason: '',
    priority: 'Medium',
    targetDate: '',
    description: '',
    impactAreas: []
  });

  const handleSave = () => {
    onSave?.(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Initiate Curriculum Revision</DialogTitle>
          <DialogDescription>Start a new curriculum revision workflow</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Revision Title *</Label>
            <Input
              placeholder="e.g., AI & ML Curriculum Update"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Program *</Label>
              <Select value={formData.program} onValueChange={(value) => setFormData({...formData, program: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="B.Tech CSE">B.Tech CSE</SelectItem>
                  <SelectItem value="B.Tech ECE">B.Tech ECE</SelectItem>
                  <SelectItem value="MBA">MBA</SelectItem>
                  <SelectItem value="MCA">MCA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Reason for Revision *</Label>
            <Select value={formData.reason} onValueChange={(value) => setFormData({...formData, reason: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="industry-requirements">Industry Requirements Update</SelectItem>
                <SelectItem value="technology-advancement">Technology Advancement</SelectItem>
                <SelectItem value="accreditation-requirements">Accreditation Requirements</SelectItem>
                <SelectItem value="faculty-feedback">Faculty Feedback</SelectItem>
                <SelectItem value="student-feedback">Student Feedback</SelectItem>
                <SelectItem value="university-guidelines">University Guidelines</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Target Completion Date</Label>
            <Input
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>Detailed Description</Label>
            <Textarea
              placeholder="Describe the proposed changes and their rationale..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Impact Areas</CardTitle>
              <CardDescription>Select areas that will be affected by this revision</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Core Subjects',
                  'Elective Subjects',
                  'Credit Structure',
                  'Learning Outcomes',
                  'Assessment Methods',
                  'Laboratory Components',
                  'Project Components',
                  'Internship Requirements'
                ].map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Switch />
                    <label className="text-sm">{area}</label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            <GitBranch className="h-4 w-4 mr-2" />
            Initiate Revision
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Revision View Dialog
export function RevisionViewDialog({ isOpen, onClose, item }: DialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Revision Details - {item?.title}</DialogTitle>
          <DialogDescription>Complete revision workflow information</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Title:</span>
                  <span className="font-medium">{item?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Program:</span>
                  <Badge variant="outline">{item?.program}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Initiator:</span>
                  <span>{item?.initiator}</span>
                </div>
                <div className="flex justify-between">
                  <span>Priority:</span>
                  <Badge variant={item?.priority === 'High' ? 'destructive' : 'secondary'}>
                    {item?.priority}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Due Date:</span>
                  <span>{item?.dueDate}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Workflow Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Current Stage:</span>
                  <Badge variant="outline">{item?.stage}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant={
                    item?.status === 'Approved' ? 'default' : 
                    item?.status === 'In Progress' ? 'secondary' : 'outline'
                  }>
                    {item?.status}
                  </Badge>
                </div>
                <Progress value={75} className="h-2" />
                <div className="text-sm text-gray-600">75% Complete</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Revision Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { stage: 'Gap Analysis', status: 'Completed', date: '2024-01-10', responsible: 'Dr.Manikandan' },
                  { stage: 'Faculty Review', status: 'In Progress', date: '2024-01-15', responsible: 'Faculty Committee' },
                  { stage: 'Committee Review', status: 'Pending', date: '2024-01-20', responsible: 'Academic Committee' },
                  { stage: 'Final Approval', status: 'Pending', date: '2024-01-25', responsible: 'Dean' },
                  { stage: 'Implementation', status: 'Pending', date: '2024-02-01', responsible: 'Admin Team' }
                ].map((stage, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        stage.status === 'Completed' ? 'bg-green-500' :
                        stage.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-300'
                      }`}></div>
                      <div>
                        <div className="font-medium">{stage.stage}</div>
                        <div className="text-sm text-gray-600">{stage.responsible}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{stage.date}</div>
                      <Badge variant={
                        stage.status === 'Completed' ? 'default' :
                        stage.status === 'In Progress' ? 'secondary' : 'outline'
                      } className="text-xs">
                        {stage.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Create Lesson Plan Dialog
export function CreateLessonPlanDialog({ isOpen, onClose, onSave }: DialogProps) {
  const [formData, setFormData] = useState({
    subject: '',
    semester: '',
    faculty: '',
    totalUnits: '',
    totalHours: '',
    description: '',
    objectives: '',
    prerequisites: ''
  });

  const handleSave = () => {
    onSave?.(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Lesson Plan</DialogTitle>
          <DialogDescription>Set up a comprehensive lesson plan for a subject</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Subject *</Label>
              <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dsa">Data Structures & Algorithms</SelectItem>
                  <SelectItem value="dbms">Database Management Systems</SelectItem>
                  <SelectItem value="os">Operating Systems</SelectItem>
                  <SelectItem value="cn">Computer Networks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Semester *</Label>
              <Select value={formData.semester} onValueChange={(value) => setFormData({...formData, semester: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({length: 8}, (_, i) => (
                    <SelectItem key={i} value={`semester-${i+1}`}>Semester {i+1}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Faculty *</Label>
              <Input
                placeholder="Faculty name"
                value={formData.faculty}
                onChange={(e) => setFormData({...formData, faculty: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Total Units</Label>
              <Input
                type="number"
                placeholder="5"
                value={formData.totalUnits}
                onChange={(e) => setFormData({...formData, totalUnits: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Total Hours</Label>
              <Input
                type="number"
                placeholder="60"
                value={formData.totalHours}
                onChange={(e) => setFormData({...formData, totalHours: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Subject Description</Label>
            <Textarea
              placeholder="Brief description of the subject..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Learning Objectives</Label>
            <Textarea
              placeholder="List the key learning objectives..."
              value={formData.objectives}
              onChange={(e) => setFormData({...formData, objectives: e.target.value})}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Prerequisites</Label>
            <Input
              placeholder="Required prerequisite subjects"
              value={formData.prerequisites}
              onChange={(e) => setFormData({...formData, prerequisites: e.target.value})}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Create Lesson Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Add Unit Dialog
export function AddUnitDialog({ isOpen, onClose, onSave }: DialogProps) {
  const [formData, setFormData] = useState({
    unitNumber: '',
    title: '',
    description: '',
    hours: '',
    topics: '',
    learningOutcomes: ''
  });

  const handleSave = () => {
    onSave?.(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Unit</DialogTitle>
          <DialogDescription>Define a new unit for the selected subject</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Unit Number *</Label>
              <Input
                placeholder="1"
                value={formData.unitNumber}
                onChange={(e) => setFormData({...formData, unitNumber: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Hours</Label>
              <Input
                type="number"
                placeholder="12"
                value={formData.hours}
                onChange={(e) => setFormData({...formData, hours: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Unit Title *</Label>
            <Input
              placeholder="Introduction to Data Structures"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Detailed description of the unit..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Topics Covered</Label>
            <Textarea
              placeholder="List of topics covered in this unit..."
              value={formData.topics}
              onChange={(e) => setFormData({...formData, topics: e.target.value})}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            <Plus className="h-4 w-4 mr-2" />
            Add Unit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Configure Outcomes Dialog
export function ConfigureOutcomesDialog({ isOpen, onClose, onSave }: DialogProps) {
  const [activeTab, setActiveTab] = useState('course');
  const [courseOutcomes, setCourseOutcomes] = useState([
    { id: 'CO1', description: '', bloomsLevel: 'Remember' },
    { id: 'CO2', description: '', bloomsLevel: 'Understand' },
    { id: 'CO3', description: '', bloomsLevel: 'Apply' }
  ]);

  const handleSave = () => {
    onSave?.(courseOutcomes);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Learning Outcomes</DialogTitle>
          <DialogDescription>Set up course outcomes and program learning outcomes</DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="course">Course Outcomes</TabsTrigger>
            <TabsTrigger value="program">Program Learning Outcomes</TabsTrigger>
            <TabsTrigger value="mapping">CO-PLO Mapping</TabsTrigger>
          </TabsList>

          <TabsContent value="course" className="space-y-4">
            <div className="space-y-4">
              {courseOutcomes.map((outcome, index) => (
                <Card key={outcome.id} className="p-4">
                  <div className="grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-2">
                      <Label>Outcome ID</Label>
                      <Input value={outcome.id} readOnly />
                    </div>
                    <div className="col-span-6">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Students will be able to..."
                        value={outcome.description}
                        onChange={(e) => {
                          const updated = [...courseOutcomes];
                          updated[index].description = e.target.value;
                          setCourseOutcomes(updated);
                        }}
                      />
                    </div>
                    <div className="col-span-3">
                      <Label>Bloom's Level</Label>
                      <Select
                        value={outcome.bloomsLevel}
                        onValueChange={(value) => {
                          const updated = [...courseOutcomes];
                          updated[index].bloomsLevel = value;
                          setCourseOutcomes(updated);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Remember">Remember</SelectItem>
                          <SelectItem value="Understand">Understand</SelectItem>
                          <SelectItem value="Apply">Apply</SelectItem>
                          <SelectItem value="Analyze">Analyze</SelectItem>
                          <SelectItem value="Evaluate">Evaluate</SelectItem>
                          <SelectItem value="Create">Create</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-1">
                      <Button variant="ghost" size="sm" className="mt-6">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <Button
              variant="outline"
              onClick={() => {
                setCourseOutcomes([...courseOutcomes, {
                  id: `CO${courseOutcomes.length + 1}`,
                  description: '',
                  bloomsLevel: 'Remember'
                }]);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Course Outcome
            </Button>
          </TabsContent>

          <TabsContent value="program" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Program Learning Outcomes are defined at program level and shared across subjects.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              {[
                'Apply knowledge of mathematics, science, and engineering fundamentals',
                'Design and conduct experiments to analyze and interpret data',
                'Design systems and processes to meet specified requirements'
              ].map((plo, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="outline" className="mr-2">PLO{index + 1}</Badge>
                      <span>{plo}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mapping" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>CO-PLO Mapping Matrix</CardTitle>
                <CardDescription>Map course outcomes to program learning outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-2">CO</th>
                        <th className="border border-gray-300 p-2">PLO1</th>
                        <th className="border border-gray-300 p-2">PLO2</th>
                        <th className="border border-gray-300 p-2">PLO3</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courseOutcomes.map((co) => (
                        <tr key={co.id}>
                          <td className="border border-gray-300 p-2 font-medium">{co.id}</td>
                          {[1, 2, 3].map((plo) => (
                            <td key={plo} className="border border-gray-300 p-2 text-center">
                              <Select defaultValue="0">
                                <SelectTrigger className="w-16">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="0">0</SelectItem>
                                  <SelectItem value="1">1</SelectItem>
                                  <SelectItem value="2">2</SelectItem>
                                  <SelectItem value="3">3</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// API Integrations Dialog
export function APIIntegrationsDialog({ isOpen, onClose }: DialogProps) {
  const [integrations, setIntegrations] = useState([
    { name: 'University ERP', status: 'Connected', endpoint: 'https://erp.university.edu/api', lastSync: '2024-01-15 10:30' },
    { name: 'LMS Platform', status: 'Connected', endpoint: 'https://lms.university.edu/api', lastSync: '2024-01-15 09:15' },
    { name: 'External Assessment', status: 'Disconnected', endpoint: 'https://assessment.external.com/api', lastSync: 'Never' }
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>API Integrations Management</DialogTitle>
          <DialogDescription>Manage external system integrations for curriculum data</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">2</div>
                <div className="text-sm text-green-600">Active Connections</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">1</div>
                <div className="text-sm text-red-600">Failed Connections</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">3</div>
                <div className="text-sm text-blue-600">Total Integrations</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {integrations.map((integration, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        integration.status === 'Connected' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        <p className="text-sm text-gray-600">{integration.endpoint}</p>
                        <p className="text-xs text-gray-500">Last sync: {integration.lastSync}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={integration.status === 'Connected' ? 'default' : 'destructive'}>
                        {integration.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button variant="outline" size="sm">
                        <Network className="h-4 w-4 mr-2" />
                        Test
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button className="w-full" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add New Integration
          </Button>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Pending Approvals Dialog
export function PendingApprovalsDialog({ isOpen, onClose }: DialogProps) {
  const [approvals, setApprovals] = useState([
    { id: 1, type: 'Curriculum Revision', title: 'AI & ML Update', program: 'B.Tech CSE', submittedBy: 'Dr.Manikandan', date: '2024-01-10', priority: 'High' },
    { id: 2, type: 'New Subject', title: 'Quantum Computing', program: 'B.Tech CSE', submittedBy: 'Prof.Kumar', date: '2024-01-12', priority: 'Medium' },
    { id: 3, type: 'Credit Change', title: 'Lab Credit Update', program: 'B.Tech ECE', submittedBy: 'Dr.Priya', date: '2024-01-14', priority: 'Low' }
  ]);

  const handleApprove = (id: number) => {
    setApprovals(approvals.filter(item => item.id !== id));
  };

  const handleReject = (id: number) => {
    setApprovals(approvals.filter(item => item.id !== id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pending Approvals</DialogTitle>
          <DialogDescription>Review and approve curriculum-related requests</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {approvals.map((approval) => (
            <Card key={approval.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline">{approval.type}</Badge>
                      <Badge variant={approval.priority === 'High' ? 'destructive' : approval.priority === 'Medium' ? 'secondary' : 'outline'}>
                        {approval.priority}
                      </Badge>
                    </div>
                    <h4 className="font-semibold">{approval.title}</h4>
                    <p className="text-sm text-gray-600 mb-1">{approval.program}</p>
                    <p className="text-xs text-gray-500">
                      Submitted by {approval.submittedBy} on {approval.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(approval.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReject(approval.id)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {approvals.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">All Caught Up!</h3>
                <p className="text-gray-600">No pending approvals at this time.</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Manage Elective Policies Dialog
export function ManageElectivePoliciesDialog({ isOpen, onClose, onSave }: DialogProps) {
  const [policies, setPolicies] = useState({
    minElectives: '2',
    maxElectives: '4',
    selectionDeadline: '30',
    changeAllowed: true,
    prerequisites: true,
    seatAllocation: 'fcfs'
  });

  const handleSave = () => {
    onSave?.(policies);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Elective Policies</DialogTitle>
          <DialogDescription>Configure elective selection rules and constraints</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Selection Constraints</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Minimum Electives</Label>
                  <Input
                    type="number"
                    value={policies.minElectives}
                    onChange={(e) => setPolicies({...policies, minElectives: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Electives</Label>
                  <Input
                    type="number"
                    value={policies.maxElectives}
                    onChange={(e) => setPolicies({...policies, maxElectives: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Selection Deadline (days before semester)</Label>
                <Input
                  type="number"
                  value={policies.selectionDeadline}
                  onChange={(e) => setPolicies({...policies, selectionDeadline: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Selection Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Selection Changes</Label>
                  <p className="text-sm text-gray-600">Students can modify selections before deadline</p>
                </div>
                <Switch
                  checked={policies.changeAllowed}
                  onCheckedChange={(checked) => setPolicies({...policies, changeAllowed: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Enforce Prerequisites</Label>
                  <p className="text-sm text-gray-600">Check prerequisite subjects before allowing selection</p>
                </div>
                <Switch
                  checked={policies.prerequisites}
                  onCheckedChange={(checked) => setPolicies({...policies, prerequisites: checked})}
                />
              </div>

              <div className="space-y-2">
                <Label>Seat Allocation Method</Label>
                <Select value={policies.seatAllocation} onValueChange={(value) => setPolicies({...policies, seatAllocation: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fcfs">First Come First Serve</SelectItem>
                    <SelectItem value="cgpa">CGPA Based</SelectItem>
                    <SelectItem value="lottery">Random Lottery</SelectItem>
                    <SelectItem value="preference">Preference Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Policies
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
