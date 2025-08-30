import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  ChevronLeft, Plus, X, Target, Award, Network, BookOpen, Save, Eye, 
  Calendar, Users, Calculator, Clock, FileText, Trash2, Edit
} from 'lucide-react';
import { FormField } from '@/components/forms/FormField';

interface CourseFormData {
  // Basic Course Information
  code: string;
  name: string;
  courseName: string;
  courseCode: string;
  department: string;
  departmentCode: string;
  type: 'Theory' | 'Practical' | 'Lab' | 'Project';
  category: 'Core' | 'Professional Core' | 'Professional Elective' | 'Open Elective' | 'Mandatory';
  credits: number;
  lectureHours: number;
  tutorialHours: number;
  practicalHours: number;
  semester: number;
  regulationYear: string;
  marks: number;
  status: 'active' | 'inactive' | 'draft';
  description: string;
  
  // Course Planning
  objectives: string[];
  courseOutcomes: CourseOutcome[];
  prerequisites: string[];
  copoMappings: COPOMapping[];
  
  // Academic Content
  syllabus: string[];
  textbooks: string[];
  references: string[];
  assessmentMethods: AssessmentMethod[];
}

interface CourseOutcome {
  id: string;
  code: string;
  description: string;
  bloomsLevel: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
  assessmentMethods: string[];
  weightage: number;
}

interface COPOMapping {
  courseOutcomeId: string;
  programOutcomeId: string;
  correlationLevel: 1 | 2 | 3;
  justification: string;
}

interface AssessmentMethod {
  id: string;
  type: string;
  weightage: number;
  description: string;
}

interface ProgramOutcome {
  id: string;
  code: string;
  description: string;
  category: string;
}

export default function CourseFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const programId = searchParams.get('programId');
  const semester = searchParams.get('semester');
  const courseId = searchParams.get('courseId');
  const isEdit = !!courseId;

  const [formData, setFormData] = useState<CourseFormData>({
    code: '',
    name: '',
    courseName: '',
    courseCode: '',
    department: '',
    departmentCode: '',
    type: 'Theory',
    category: 'Core',
    credits: 0,
    lectureHours: 0,
    tutorialHours: 0,
    practicalHours: 0,
    semester: parseInt(semester || '1'),
    regulationYear: 'R2023',
    marks: 100,
    status: 'draft',
    description: '',
    objectives: [''],
    courseOutcomes: [],
    prerequisites: [],
    copoMappings: [],
    syllabus: [''],
    textbooks: [''],
    references: [''],
    assessmentMethods: []
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [showCOPOMapping, setShowCOPOMapping] = useState(false);

  // Program Outcomes for CO-PO mapping
  const programOutcomes: ProgramOutcome[] = [
    {
      id: 'PO1',
      code: 'PO1',
      description: 'Engineering knowledge: Apply the knowledge of mathematics, science, engineering fundamentals.',
      category: 'Knowledge'
    },
    {
      id: 'PO2',
      code: 'PO2',
      description: 'Problem analysis: Identify, formulate, and analyze complex engineering problems.',
      category: 'Skills'
    },
    {
      id: 'PO3',
      code: 'PO3',
      description: 'Design/development of solutions: Design solutions for complex engineering problems.',
      category: 'Skills'
    },
    {
      id: 'PO4',
      code: 'PO4',
      description: 'Investigation: Use research-based knowledge and methods.',
      category: 'Research'
    },
    {
      id: 'PO5',
      code: 'PO5',
      description: 'Modern tool usage: Create, select, and apply appropriate techniques and tools.',
      category: 'Tools'
    },
    {
      id: 'PO6',
      code: 'PO6',
      description: 'Ethics: Apply ethical principles and commit to professional ethics.',
      category: 'Professional'
    }
  ];

  const departments = [
    { name: 'Computer Science', code: 'CS' },
    { name: 'Mathematics', code: 'MA' },
    { name: 'Physics', code: 'PH' },
    { name: 'Chemistry', code: 'CH' },
    { name: 'Mechanical Engineering', code: 'ME' },
    { name: 'Civil Engineering', code: 'CE' },
    { name: 'Electrical Engineering', code: 'EE' },
    { name: 'Electronics Engineering', code: 'EC' },
    { name: 'Information Technology', code: 'IT' }
  ];

  const bloomsLevels = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];
  const assessmentTypes = ['Written Exam', 'Assignment', 'Quiz', 'Project', 'Lab Report', 'Presentation', 'Case Study', 'Viva', 'Practical Exam'];

  useEffect(() => {
    // Load existing course data if editing
    if (isEdit && courseId) {
      // In a real implementation, this would fetch from an API
      // For now, we'll populate with sample data
      setFormData(prev => ({
        ...prev,
        code: '1051113110',
        name: 'ENGINEERING MATHEMATICS - I',
        description: 'Comprehensive course covering differential calculus, integral calculus, and matrices.',
        department: 'Mathematics',
        departmentCode: 'MA',
        credits: 4,
        lectureHours: 3,
        tutorialHours: 1,
        practicalHours: 0,
        objectives: [
          'To provide basic knowledge of differential calculus',
          'To understand the concepts of integration and its applications',
          'To solve problems involving matrices and determinants'
        ],
        courseOutcomes: [
          {
            id: 'CO1',
            code: 'CO1',
            description: 'Apply differential calculus techniques to solve engineering problems',
            bloomsLevel: 'Apply',
            assessmentMethods: ['Written Exam', 'Assignment'],
            weightage: 25
          }
        ]
      }));
    }

    // Load available courses for prerequisites
    loadAvailableCourses();
  }, [isEdit, courseId]);

  const loadAvailableCourses = async () => {
    // Mock data - in real implementation, this would fetch from API
    const mockCourses = [
      { id: 'SUB1001', name: 'Basic Mathematics', code: 'MA101' },
      { id: 'SUB1002', name: 'Physics Fundamentals', code: 'PH101' },
      { id: 'SUB1003', name: 'Programming Basics', code: 'CS101' }
    ];
    setAvailableCourses(mockCourses);
  };

  const handleArrayFieldChange = (field: keyof CourseFormData, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field: keyof CourseFormData) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), '']
    }));
  };

  const removeArrayField = (field: keyof CourseFormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const addCourseOutcome = () => {
    const newCO: CourseOutcome = {
      id: `CO${formData.courseOutcomes.length + 1}`,
      code: `CO${formData.courseOutcomes.length + 1}`,
      description: '',
      bloomsLevel: 'Understand',
      assessmentMethods: [],
      weightage: 0
    };
    setFormData(prev => ({
      ...prev,
      courseOutcomes: [...prev.courseOutcomes, newCO]
    }));
  };

  const updateCourseOutcome = (index: number, field: keyof CourseOutcome, value: any) => {
    setFormData(prev => ({
      ...prev,
      courseOutcomes: prev.courseOutcomes.map((co, i) => 
        i === index ? { ...co, [field]: value } : co
      )
    }));
  };

  const removeCourseOutcome = (index: number) => {
    setFormData(prev => ({
      ...prev,
      courseOutcomes: prev.courseOutcomes.filter((_, i) => i !== index)
    }));
  };

  const addCOPOMapping = (coId: string, poId: string, level: 1 | 2 | 3) => {
    const newMapping: COPOMapping = {
      courseOutcomeId: coId,
      programOutcomeId: poId,
      correlationLevel: level,
      justification: ''
    };
    setFormData(prev => ({
      ...prev,
      copoMappings: [...prev.copoMappings.filter(m => !(m.courseOutcomeId === coId && m.programOutcomeId === poId)), newMapping]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.name || !formData.code || !formData.department) {
        alert('Please fill in all required fields');
        return;
      }

      // In a real implementation, this would submit to an API
      console.log('Submitting course data:', formData);
      
      // Navigate back to semester page
      navigate(`/academics/curriculum/program-semester/${programId}`);
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error saving course. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate(`/academics/curriculum/program-semester/${programId}`);
  };

  const getCorrelationColor = (level: number) => {
    switch (level) {
      case 3: return 'bg-green-100 text-green-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 1: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleCancel}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Semester
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEdit ? 'Edit Course' : 'Add New Course'}
            </h1>
            <p className="text-muted-foreground">
              {isEdit ? 'Update course details and planning' : 'Create course with objectives, outcomes, and CO-PO mapping'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            {isEdit ? 'Update Course' : 'Save Course'}
          </Button>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="objectives">Objectives</TabsTrigger>
              <TabsTrigger value="outcomes">Course Outcomes</TabsTrigger>
              <TabsTrigger value="mapping">CO-PO Mapping</TabsTrigger>
              <TabsTrigger value="prerequisites">Prerequisites</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course Code */}
                <FormField label="Course Code" required>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="e.g., 1051113110"
                  />
                </FormField>

                {/* Course Name */}
                <FormField label="Course Name" required>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Engineering Mathematics - I"
                  />
                </FormField>

                {/* Department */}
                <FormField label="Department" required>
                  <Select value={formData.department} onValueChange={(value) => {
                    const dept = departments.find(d => d.name === value);
                    setFormData(prev => ({ 
                      ...prev, 
                      department: value,
                      departmentCode: dept?.code || ''
                    }));
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.code} value={dept.name}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                {/* Type */}
                <FormField label="Course Type" required>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Theory">Theory</SelectItem>
                      <SelectItem value="Practical">Practical</SelectItem>
                      <SelectItem value="Lab">Lab</SelectItem>
                      <SelectItem value="Project">Project</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                {/* Category */}
                <FormField label="Category" required>
                  <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Core">Core</SelectItem>
                      <SelectItem value="Professional Core">Professional Core</SelectItem>
                      <SelectItem value="Professional Elective">Professional Elective</SelectItem>
                      <SelectItem value="Open Elective">Open Elective</SelectItem>
                      <SelectItem value="Mandatory">Mandatory</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                {/* Credits */}
                <FormField label="Credits" required>
                  <Input
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData(prev => ({ ...prev, credits: parseInt(e.target.value) || 0 }))}
                    min="0"
                    max="10"
                  />
                </FormField>

                {/* Lecture Hours */}
                <FormField label="Lecture Hours">
                  <Input
                    type="number"
                    value={formData.lectureHours}
                    onChange={(e) => setFormData(prev => ({ ...prev, lectureHours: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </FormField>

                {/* Tutorial Hours */}
                <FormField label="Tutorial Hours">
                  <Input
                    type="number"
                    value={formData.tutorialHours}
                    onChange={(e) => setFormData(prev => ({ ...prev, tutorialHours: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </FormField>

                {/* Practical Hours */}
                <FormField label="Practical Hours">
                  <Input
                    type="number"
                    value={formData.practicalHours}
                    onChange={(e) => setFormData(prev => ({ ...prev, practicalHours: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </FormField>

                {/* Semester */}
                <FormField label="Semester" required>
                  <Input
                    type="number"
                    value={formData.semester}
                    onChange={(e) => setFormData(prev => ({ ...prev, semester: parseInt(e.target.value) || 1 }))}
                    min="1"
                    max="8"
                    disabled={!!semester}
                  />
                </FormField>

                {/* Marks */}
                <FormField label="Total Marks">
                  <Input
                    type="number"
                    value={formData.marks}
                    onChange={(e) => setFormData(prev => ({ ...prev, marks: parseInt(e.target.value) || 100 }))}
                    min="0"
                  />
                </FormField>

                {/* Status */}
                <FormField label="Status">
                  <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              {/* Description */}
              <FormField label="Course Description" required>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter detailed course description..."
                  rows={4}
                />
              </FormField>
            </TabsContent>

            <TabsContent value="objectives" className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Course Objectives</h3>
                  <p className="text-sm text-gray-600">Define what this course aims to achieve</p>
                </div>
                <Button onClick={() => addArrayField('objectives')} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Objective
                </Button>
              </div>

              <div className="space-y-4">
                {formData.objectives.map((objective, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mt-1">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <Textarea
                        value={objective}
                        onChange={(e) => handleArrayFieldChange('objectives', index, e.target.value)}
                        placeholder="Enter course objective..."
                        rows={2}
                      />
                    </div>
                    {formData.objectives.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayField('objectives', index)}
                        className="mt-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="outcomes" className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Course Outcomes (COs)</h3>
                  <p className="text-sm text-gray-600">Specific learning outcomes students should achieve</p>
                </div>
                <Button onClick={addCourseOutcome} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Course Outcome
                </Button>
              </div>

              <div className="space-y-6">
                {formData.courseOutcomes.map((co, index) => (
                  <Card key={co.id} className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold">{co.code}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCourseOutcome(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormField label="CO Code">
                          <Input
                            value={co.code}
                            onChange={(e) => updateCourseOutcome(index, 'code', e.target.value)}
                            placeholder="e.g., CO1"
                          />
                        </FormField>

                        <FormField label="Bloom's Level">
                          <Select 
                            value={co.bloomsLevel} 
                            onValueChange={(value: any) => updateCourseOutcome(index, 'bloomsLevel', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {bloomsLevels.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormField>
                      </div>

                      <FormField label="CO Description" className="mb-4">
                        <Textarea
                          value={co.description}
                          onChange={(e) => updateCourseOutcome(index, 'description', e.target.value)}
                          placeholder="Students will be able to..."
                          rows={3}
                        />
                      </FormField>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Assessment Methods">
                          <div className="grid grid-cols-2 gap-2">
                            {assessmentTypes.map((type) => (
                              <div key={type} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${co.id}-${type}`}
                                  checked={co.assessmentMethods.includes(type)}
                                  onCheckedChange={(checked) => {
                                    const methods = checked 
                                      ? [...co.assessmentMethods, type]
                                      : co.assessmentMethods.filter(m => m !== type);
                                    updateCourseOutcome(index, 'assessmentMethods', methods);
                                  }}
                                />
                                <label htmlFor={`${co.id}-${type}`} className="text-xs">
                                  {type}
                                </label>
                              </div>
                            ))}
                          </div>
                        </FormField>

                        <FormField label="Weightage (%)">
                          <Input
                            type="number"
                            value={co.weightage}
                            onChange={(e) => updateCourseOutcome(index, 'weightage', parseInt(e.target.value) || 0)}
                            min="0"
                            max="100"
                          />
                        </FormField>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="mapping" className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">CO-PO Mapping Matrix</h3>
                  <p className="text-sm text-gray-600">Map course outcomes to program outcomes</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getCorrelationColor(3)}>High (3)</Badge>
                  <Badge variant="outline" className={getCorrelationColor(2)}>Medium (2)</Badge>
                  <Badge variant="outline" className={getCorrelationColor(1)}>Low (1)</Badge>
                </div>
              </div>

              {formData.courseOutcomes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left">CO</th>
                        {programOutcomes.map((po) => (
                          <th key={po.id} className="border border-gray-300 p-3 text-center min-w-20">
                            {po.code}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {formData.courseOutcomes.map((co) => (
                        <tr key={co.id}>
                          <td className="border border-gray-300 p-3 font-medium bg-gray-50">
                            {co.code}
                          </td>
                          {programOutcomes.map((po) => {
                            const mapping = formData.copoMappings.find(
                              m => m.courseOutcomeId === co.id && m.programOutcomeId === po.id
                            );
                            return (
                              <td key={po.id} className="border border-gray-300 p-3 text-center">
                                <div className="flex flex-col gap-1">
                                  <div className="flex gap-1 justify-center">
                                    {[1, 2, 3].map((level) => (
                                      <Button
                                        key={level}
                                        variant={mapping?.correlationLevel === level ? "default" : "outline"}
                                        size="sm"
                                        className={`w-8 h-8 p-0 text-xs ${
                                          mapping?.correlationLevel === level ? getCorrelationColor(level) : ''
                                        }`}
                                        onClick={() => addCOPOMapping(co.id, po.id, level as 1 | 2 | 3)}
                                      >
                                        {level}
                                      </Button>
                                    ))}
                                  </div>
                                  {mapping && (
                                    <Badge
                                      variant="outline"
                                      className={getCorrelationColor(mapping.correlationLevel)}
                                      size="sm"
                                    >
                                      {mapping.correlationLevel}
                                    </Badge>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Network className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Add course outcomes first to enable CO-PO mapping</p>
                </div>
              )}

              {/* Program Outcomes Reference */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Program Outcomes Reference</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {programOutcomes.map((po) => (
                      <div key={po.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                        <Badge variant="outline">{po.code}</Badge>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">{po.description}</p>
                          <Badge variant="outline" className="mt-1" size="sm">{po.category}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prerequisites" className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Prerequisites</h3>
                  <p className="text-sm text-gray-600">Courses that students must complete before taking this course</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableCourses.map((course) => (
                  <div key={course.id} className="flex items-center space-x-2 p-3 border rounded">
                    <Checkbox
                      id={course.id}
                      checked={formData.prerequisites.includes(course.id)}
                      onCheckedChange={(checked) => {
                        const prerequisites = checked
                          ? [...formData.prerequisites, course.id]
                          : formData.prerequisites.filter(p => p !== course.id);
                        setFormData(prev => ({ ...prev, prerequisites }));
                      }}
                    />
                    <label htmlFor={course.id} className="flex-1">
                      <div className="font-medium">{course.name}</div>
                      <div className="text-sm text-gray-500">{course.code}</div>
                    </label>
                  </div>
                ))}
              </div>

              {formData.prerequisites.length > 0 && (
                <div className="p-4 bg-blue-50 rounded">
                  <h4 className="font-medium mb-2">Selected Prerequisites:</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.prerequisites.map((prereqId) => {
                      const course = availableCourses.find(c => c.id === prereqId);
                      return (
                        <Badge key={prereqId} variant="outline" className="bg-white">
                          {course?.name} ({course?.code})
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="content" className="space-y-6 mt-6">
              {/* Syllabus */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Course Syllabus</h3>
                  <Button onClick={() => addArrayField('syllabus')} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Module
                  </Button>
                </div>
                <div className="space-y-3">
                  {formData.syllabus.map((module, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="bg-green-100 text-green-800 rounded px-2 py-1 text-sm font-medium mt-1">
                        Module {index + 1}
                      </div>
                      <div className="flex-1">
                        <Textarea
                          value={module}
                          onChange={(e) => handleArrayFieldChange('syllabus', index, e.target.value)}
                          placeholder="Enter module content..."
                          rows={2}
                        />
                      </div>
                      {formData.syllabus.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayField('syllabus', index)}
                          className="mt-1"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Textbooks */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Textbooks</h3>
                  <Button onClick={() => addArrayField('textbooks')} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Textbook
                  </Button>
                </div>
                <div className="space-y-3">
                  {formData.textbooks.map((book, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Input
                        value={book}
                        onChange={(e) => handleArrayFieldChange('textbooks', index, e.target.value)}
                        placeholder="Enter textbook title and author..."
                        className="flex-1"
                      />
                      {formData.textbooks.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayField('textbooks', index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* References */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">References</h3>
                  <Button onClick={() => addArrayField('references')} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Reference
                  </Button>
                </div>
                <div className="space-y-3">
                  {formData.references.map((ref, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Input
                        value={ref}
                        onChange={(e) => handleArrayFieldChange('references', index, e.target.value)}
                        placeholder="Enter reference title and author..."
                        className="flex-1"
                      />
                      {formData.references.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayField('references', index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
