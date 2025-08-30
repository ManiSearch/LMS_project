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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Save, X, Plus, Edit, Trash2, Upload, Download, Settings, Network,
  Shield, Target, FileText, Calendar, Users, Clock, CheckCircle,
  AlertCircle, BookOpen, Award, Star, GitBranch, Code, Database,
  Globe, Map, PlayCircle, PenTool, Layers, School, GraduationCap
} from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  item?: any;
  onSave?: (data: any) => void;
}

// Add Topic Dialog
export function AddTopicDialog({ isOpen, onClose, onSave }: DialogProps) {
  const [formData, setFormData] = useState({
    topicName: '',
    unit: '',
    description: '',
    hours: '',
    difficulty: 'Medium',
    resources: '',
    assessment: ''
  });

  const handleSave = () => {
    onSave?.(formData);
    onClose();
    setFormData({
      topicName: '',
      unit: '',
      description: '',
      hours: '',
      difficulty: 'Medium',
      resources: '',
      assessment: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Topic</DialogTitle>
          <DialogDescription>Add a new topic to the selected unit</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Topic Name *</Label>
              <Input
                placeholder="Array Operations"
                value={formData.topicName}
                onChange={(e) => setFormData({...formData, topicName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unit1">Unit 1</SelectItem>
                  <SelectItem value="unit2">Unit 2</SelectItem>
                  <SelectItem value="unit3">Unit 3</SelectItem>
                  <SelectItem value="unit4">Unit 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hours Allocated</Label>
              <Input
                type="number"
                placeholder="3"
                value={formData.hours}
                onChange={(e) => setFormData({...formData, hours: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <Select value={formData.difficulty} onValueChange={(value) => setFormData({...formData, difficulty: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Detailed description of the topic..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Learning Resources</Label>
            <Textarea
              placeholder="Books, articles, videos, etc..."
              value={formData.resources}
              onChange={(e) => setFormData({...formData, resources: e.target.value})}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Assessment Methods</Label>
            <Input
              placeholder="Quiz, Assignment, Lab Exercise"
              value={formData.assessment}
              onChange={(e) => setFormData({...formData, assessment: e.target.value})}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            <Plus className="h-4 w-4 mr-2" />
            Add Topic
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Add Learning Outcome Dialog
export function AddLearningOutcomeDialog({ isOpen, onClose, onSave }: DialogProps) {
  const [formData, setFormData] = useState({
    outcomeId: '',
    description: '',
    bloomsLevel: 'Understand',
    assessmentMethod: '',
    weightage: '',
    mappedPLO: '',
    cognitiveLevel: 'Factual'
  });

  const handleSave = () => {
    onSave?.(formData);
    onClose();
    setFormData({
      outcomeId: '',
      description: '',
      bloomsLevel: 'Understand',
      assessmentMethod: '',
      weightage: '',
      mappedPLO: '',
      cognitiveLevel: 'Factual'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Learning Outcome</DialogTitle>
          <DialogDescription>Define a new learning outcome for the subject</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Outcome ID *</Label>
              <Input
                placeholder="CO1, CO2, etc."
                value={formData.outcomeId}
                onChange={(e) => setFormData({...formData, outcomeId: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Weightage (%)</Label>
              <Input
                type="number"
                placeholder="20"
                value={formData.weightage}
                onChange={(e) => setFormData({...formData, weightage: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Learning Outcome Description *</Label>
            <Textarea
              placeholder="Students will be able to..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bloom's Taxonomy Level</Label>
              <Select value={formData.bloomsLevel} onValueChange={(value) => setFormData({...formData, bloomsLevel: value})}>
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
            <div className="space-y-2">
              <Label>Cognitive Level</Label>
              <Select value={formData.cognitiveLevel} onValueChange={(value) => setFormData({...formData, cognitiveLevel: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Factual">Factual Knowledge</SelectItem>
                  <SelectItem value="Conceptual">Conceptual Knowledge</SelectItem>
                  <SelectItem value="Procedural">Procedural Knowledge</SelectItem>
                  <SelectItem value="Metacognitive">Metacognitive Knowledge</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Assessment Method</Label>
              <Select value={formData.assessmentMethod} onValueChange={(value) => setFormData({...formData, assessmentMethod: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="written-exam">Written Examination</SelectItem>
                  <SelectItem value="practical-exam">Practical Examination</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="project">Project Work</SelectItem>
                  <SelectItem value="presentation">Presentation</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Mapped PLO</Label>
              <Select value={formData.mappedPLO} onValueChange={(value) => setFormData({...formData, mappedPLO: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select PLO" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PLO1">PLO1 - Engineering Knowledge</SelectItem>
                  <SelectItem value="PLO2">PLO2 - Problem Analysis</SelectItem>
                  <SelectItem value="PLO3">PLO3 - Design/Development</SelectItem>
                  <SelectItem value="PLO4">PLO4 - Investigation</SelectItem>
                  <SelectItem value="PLO5">PLO5 - Modern Tool Usage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            <Target className="h-4 w-4 mr-2" />
            Add Learning Outcome
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Edit Lesson Plan Dialog
export function EditLessonPlanDialog({ isOpen, onClose, item, onSave }: DialogProps) {
  const [formData, setFormData] = useState({
    subject: item?.subject || '',
    faculty: item?.faculty || '',
    totalUnits: item?.units?.toString() || '',
    completedUnits: '',
    description: '',
    objectives: ''
  });

  const handleSave = () => {
    onSave?.(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lesson Plan - {item?.subject}</DialogTitle>
          <DialogDescription>Update lesson plan details and progress</DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Basic Details</TabsTrigger>
            <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
            <TabsTrigger value="units">Units & Topics</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Faculty</Label>
                <Input
                  value={formData.faculty}
                  onChange={(e) => setFormData({...formData, faculty: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Subject description..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Learning Objectives</Label>
              <Textarea
                placeholder="Learning objectives..."
                value={formData.objectives}
                onChange={(e) => setFormData({...formData, objectives: e.target.value})}
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{item?.completion}%</div>
                    <div className="text-sm text-gray-600">Overall Completion</div>
                  </div>
                  <Progress value={item?.completion} className="h-3" />
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{item?.units}</div>
                      <div className="text-xs text-green-600">Total Units</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{item?.topics}</div>
                      <div className="text-xs text-blue-600">Total Topics</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Update Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Completed Units</Label>
                    <Input
                      type="number"
                      placeholder="3"
                      value={formData.completedUnits}
                      onChange={(e) => setFormData({...formData, completedUnits: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select defaultValue="on-track">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on-track">On Track</SelectItem>
                        <SelectItem value="ahead">Ahead of Schedule</SelectItem>
                        <SelectItem value="behind">Behind Schedule</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Progress Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="units" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Units & Topics</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Unit
              </Button>
            </div>

            <div className="space-y-4">
              {[
                { unit: 'Unit 1', title: 'Introduction to Data Structures', topics: 4, hours: 12, status: 'Completed' },
                { unit: 'Unit 2', title: 'Arrays and Linked Lists', topics: 6, hours: 15, status: 'In Progress' },
                { unit: 'Unit 3', title: 'Stacks and Queues', topics: 5, hours: 12, status: 'Not Started' },
                { unit: 'Unit 4', title: 'Trees and Graphs', topics: 8, hours: 18, status: 'Not Started' }
              ].map((unit, index) => (
                <Card key={index} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{unit.unit}: {unit.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>{unit.topics} topics</span>
                          <span>{unit.hours} hours</span>
                          <Badge variant={
                            unit.status === 'Completed' ? 'default' :
                            unit.status === 'In Progress' ? 'secondary' : 'outline'
                          }>
                            {unit.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Update Lesson Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Edit Course Outcome Dialog
export function EditCourseOutcomeDialog({ isOpen, onClose, item, onSave }: DialogProps) {
  const [formData, setFormData] = useState({
    id: item?.id || '',
    description: item?.description || '',
    bloomsLevel: item?.level || 'Understand',
    subject: item?.subject || '',
    assessmentMethod: '',
    weightage: ''
  });

  const handleSave = () => {
    onSave?.(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Course Outcome - {item?.id}</DialogTitle>
          <DialogDescription>Update course outcome details and mapping</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Outcome ID</Label>
              <Input
                value={formData.id}
                onChange={(e) => setFormData({...formData, id: e.target.value})}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                readOnly
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Students will be able to..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bloom's Level</Label>
              <Select value={formData.bloomsLevel} onValueChange={(value) => setFormData({...formData, bloomsLevel: value})}>
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
            <div className="space-y-2">
              <Label>Weightage (%)</Label>
              <Input
                type="number"
                placeholder="25"
                value={formData.weightage}
                onChange={(e) => setFormData({...formData, weightage: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Assessment Method</Label>
            <Select value={formData.assessmentMethod} onValueChange={(value) => setFormData({...formData, assessmentMethod: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select assessment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exam">Written Examination</SelectItem>
                <SelectItem value="practical">Practical Examination</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
                <SelectItem value="project">Project Work</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Update Outcome
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Program Learning Outcomes Dialog
export function ProgramLearningOutcomesDialog({ isOpen, onClose, onSave }: DialogProps) {
  const [formData, setFormData] = useState({
    id: '',
    description: '',
    domain: '',
    level: '',
    graduate: '',
    assessmentCriteria: ''
  });

  const handleSave = () => {
    onSave?.(formData);
    onClose();
    setFormData({
      id: '',
      description: '',
      domain: '',
      level: '',
      graduate: '',
      assessmentCriteria: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Program Learning Outcome</DialogTitle>
          <DialogDescription>Define a new program-level learning outcome</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>PLO ID *</Label>
              <Input
                placeholder="PLO1, PLO2, etc."
                value={formData.id}
                onChange={(e) => setFormData({...formData, id: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Graduate Attribute</Label>
              <Select value={formData.graduate} onValueChange={(value) => setFormData({...formData, graduate: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select attribute" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering-knowledge">Engineering Knowledge</SelectItem>
                  <SelectItem value="problem-analysis">Problem Analysis</SelectItem>
                  <SelectItem value="design-development">Design/Development of Solutions</SelectItem>
                  <SelectItem value="investigation">Conduct Investigations</SelectItem>
                  <SelectItem value="modern-tools">Modern Tool Usage</SelectItem>
                  <SelectItem value="engineer-society">The Engineer and Society</SelectItem>
                  <SelectItem value="environment">Environment and Sustainability</SelectItem>
                  <SelectItem value="ethics">Ethics</SelectItem>
                  <SelectItem value="individual-team">Individual and Team Work</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="project-management">Project Management</SelectItem>
                  <SelectItem value="life-long-learning">Life-long Learning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>PLO Description *</Label>
            <Textarea
              placeholder="Graduates will be able to..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Knowledge Domain</Label>
              <Select value={formData.domain} onValueChange={(value) => setFormData({...formData, domain: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select domain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Knowledge</SelectItem>
                  <SelectItem value="analytical">Analytical Skills</SelectItem>
                  <SelectItem value="design">Design Skills</SelectItem>
                  <SelectItem value="professional">Professional Skills</SelectItem>
                  <SelectItem value="communication">Communication Skills</SelectItem>
                  <SelectItem value="ethics">Ethics & Values</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Competency Level</Label>
              <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="introductory">Introductory (I)</SelectItem>
                  <SelectItem value="reinforcing">Reinforcing (R)</SelectItem>
                  <SelectItem value="proficient">Proficient (P)</SelectItem>
                  <SelectItem value="advanced">Advanced (A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Assessment Criteria</Label>
            <Textarea
              placeholder="How this PLO will be assessed..."
              value={formData.assessmentCriteria}
              onChange={(e) => setFormData({...formData, assessmentCriteria: e.target.value})}
              rows={3}
            />
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Program Learning Outcomes should align with NBA/NAAC accreditation requirements and industry standards.
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            <Plus className="h-4 w-4 mr-2" />
            Add PLO
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// CO-PLO Mapping Dialog
export function COPLOMappingDialog({ isOpen, onClose, item, onSave }: DialogProps) {
  const [mappingData, setMappingData] = useState({
    courseOutcome: item?.co || '',
    mappings: {
      PLO1: 0,
      PLO2: 0,
      PLO3: 0,
      PLO4: 0,
      PLO5: 0
    }
  });

  const handleMappingChange = (plo: string, value: string) => {
    setMappingData({
      ...mappingData,
      mappings: {
        ...mappingData.mappings,
        [plo]: parseInt(value)
      }
    });
  };

  const handleSave = () => {
    onSave?.(mappingData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>CO-PLO Mapping - {item?.co || item?.id}</DialogTitle>
          <DialogDescription>Map course outcome to program learning outcomes</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Outcome Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{item?.co || item?.id}</Badge>
                  <span className="font-medium">{item?.description}</span>
                </div>
                <p className="text-sm text-gray-600">Subject: {item?.subject || 'Data Structures & Algorithms'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">PLO Mapping Matrix</CardTitle>
              <CardDescription>Rate the correlation strength (0-3) between this CO and each PLO</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Program Learning Outcome</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Correlation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: 'PLO1', description: 'Apply knowledge of mathematics, science, and engineering fundamentals' },
                    { id: 'PLO2', description: 'Design and conduct experiments to analyze and interpret data' },
                    { id: 'PLO3', description: 'Design systems and processes to meet specified requirements' },
                    { id: 'PLO4', description: 'Work effectively in multidisciplinary teams' },
                    { id: 'PLO5', description: 'Communicate effectively with diverse audiences' }
                  ].map((plo) => (
                    <TableRow key={plo.id}>
                      <TableCell className="font-medium">{plo.id}</TableCell>
                      <TableCell className="text-sm">{plo.description}</TableCell>
                      <TableCell className="text-center">
                        <Select 
                          value={mappingData.mappings[plo.id].toString()} 
                          onValueChange={(value) => handleMappingChange(plo.id, value)}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">0</SelectItem>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">Mapping Scale:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>3:</strong> High Correlation - Directly addresses the PLO</div>
                  <div><strong>2:</strong> Medium Correlation - Partially addresses the PLO</div>
                  <div><strong>1:</strong> Low Correlation - Minimally addresses the PLO</div>
                  <div><strong>0:</strong> No Correlation - Does not address the PLO</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Mapping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Revision Edit Dialog
export function RevisionEditDialog({ isOpen, onClose, item, onSave }: DialogProps) {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    priority: item?.priority || 'Medium',
    dueDate: item?.dueDate || '',
    status: item?.status || 'In Progress',
    stage: item?.stage || 'Gap Analysis',
    description: '',
    comments: ''
  });

  const handleSave = () => {
    onSave?.(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Revision - {item?.title}</DialogTitle>
          <DialogDescription>Update revision workflow details and status</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Revision Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
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
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Current Stage</Label>
              <Select value={formData.stage} onValueChange={(value) => setFormData({...formData, stage: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gap Analysis">Gap Analysis</SelectItem>
                  <SelectItem value="Faculty Review">Faculty Review</SelectItem>
                  <SelectItem value="Committee Review">Committee Review</SelectItem>
                  <SelectItem value="Final Approval">Final Approval</SelectItem>
                  <SelectItem value="Implementation">Implementation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Update description..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Comments</Label>
            <Textarea
              placeholder="Add comments or notes..."
              value={formData.comments}
              onChange={(e) => setFormData({...formData, comments: e.target.value})}
              rows={2}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Update Revision
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
