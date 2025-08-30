import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Save, X, Plus, Trash2, BookOpen, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SubjectData {
  id?: number;
  code: string;
  name: string;
  semester: string;
  credits: number;
  type: string;
  faculty: string;
  prerequisites: string[];
  description: string;
  objectives: string[];
  units: Unit[];
  outcomes: string[];
  references: string[];
  evaluationScheme: EvaluationScheme;
}

interface Unit {
  id: number;
  name: string;
  topics: string[];
  hours: number;
  outcomes: string[];
}

interface EvaluationScheme {
  theory: {
    internal: number;
    external: number;
  };
  practical: {
    internal: number;
    external: number;
  };
  assignments: number;
  projects: number;
}

export default function StructureFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEdit = id && id !== 'create';
  
  const [formData, setFormData] = useState<SubjectData>({
    code: '',
    name: '',
    semester: '',
    credits: 3,
    type: 'Core',
    faculty: '',
    prerequisites: [],
    description: '',
    objectives: [''],
    units: [{ id: 1, name: '', topics: [''], hours: 10, outcomes: [''] }],
    outcomes: [''],
    references: [''],
    evaluationScheme: {
      theory: { internal: 30, external: 70 },
      practical: { internal: 50, external: 50 },
      assignments: 10,
      projects: 15
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const semesters = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];
  const subjectTypes = ['Core', 'Elective', 'Lab', 'Project', 'Internship'];
  const availablePrerequisites = [
    'Programming Fundamentals',
    'Mathematics I',
    'Mathematics II',
    'Physics',
    'Chemistry',
    'Data Structures',
    'Computer Architecture',
    'Database Systems'
  ];

  // Load existing data if editing
  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      setTimeout(() => {
        const mockData: SubjectData = {
          id: parseInt(id),
          code: 'CS301',
          name: 'Data Structures & Algorithms',
          semester: 'Semester 3',
          credits: 4,
          type: 'Core',
          faculty: 'Dr. Manikandan',
          prerequisites: ['Programming Fundamentals', 'Mathematics II'],
          description: 'This course provides an in-depth understanding of fundamental data structures and algorithms.',
          objectives: [
            'Understand the concept of data structures and their applications',
            'Learn various sorting and searching algorithms',
            'Analyze time and space complexity of algorithms'
          ],
          units: [
            {
              id: 1,
              name: 'Introduction to Data Structures',
              topics: ['Arrays', 'Linked Lists', 'Stacks', 'Queues'],
              hours: 12,
              outcomes: ['Understand basic data structures', 'Implement linear data structures']
            },
            {
              id: 2,
              name: 'Trees and Graphs',
              topics: ['Binary Trees', 'AVL Trees', 'Graph Traversal', 'Shortest Path'],
              hours: 15,
              outcomes: ['Implement tree structures', 'Apply graph algorithms']
            }
          ],
          outcomes: [
            'Students will be able to implement basic data structures',
            'Students will be able to analyze algorithm complexity',
            'Students will be able to choose appropriate data structures for problems'
          ],
          references: [
            'Introduction to Algorithms by Cormen',
            'Data Structures and Algorithms by Aho',
            'Algorithms by Sedgewick'
          ],
          evaluationScheme: {
            theory: { internal: 30, external: 70 },
            practical: { internal: 60, external: 40 },
            assignments: 15,
            projects: 20
          }
        };
        setFormData(mockData);
        setLoading(false);
      }, 1000);
    }
  }, [id, isEdit]);

  const handleInputChange = (field: keyof SubjectData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePrerequisiteToggle = (prereq: string) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.includes(prereq)
        ? prev.prerequisites.filter(p => p !== prereq)
        : [...prev.prerequisites, prereq]
    }));
  };

  const handleArrayFieldChange = (field: 'objectives' | 'outcomes' | 'references', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field: 'objectives' | 'outcomes' | 'references') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field: 'objectives' | 'outcomes' | 'references', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleUnitChange = (unitIndex: number, field: keyof Unit, value: any) => {
    setFormData(prev => ({
      ...prev,
      units: prev.units.map((unit, i) => 
        i === unitIndex ? { ...unit, [field]: value } : unit
      )
    }));
  };

  const addUnit = () => {
    setFormData(prev => ({
      ...prev,
      units: [...prev.units, {
        id: prev.units.length + 1,
        name: '',
        topics: [''],
        hours: 10,
        outcomes: ['']
      }]
    }));
  };

  const removeUnit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      units: prev.units.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.code || !formData.name || !formData.semester) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: isEdit ? "Subject Updated" : "Subject Created",
        description: `Subject "${formData.name}" has been ${isEdit ? 'updated' : 'created'} successfully.`,
      });

      navigate('/academics/curriculum/structure');
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the subject.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this subject? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Subject Deleted",
        description: `Subject "${formData.name}" has been deleted successfully.`,
      });

      navigate('/academics/curriculum/structure');
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the subject.",
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
          <p className="mt-2 text-gray-600">Loading subject data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/academics/curriculum/structure')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Academic Structure
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEdit ? 'Edit Subject' : 'Create New Subject'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? 'Update subject details and curriculum structure' : 'Configure a new subject for the academic program'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="units">Units & Topics</TabsTrigger>
            <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
            <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
            <TabsTrigger value="references">References</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Configure basic subject details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="code">Subject Code *</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => handleInputChange('code', e.target.value)}
                      placeholder="e.g., CS301"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Subject Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Data Structures & Algorithms"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="semester">Semester *</Label>
                    <Select value={formData.semester} onValueChange={(value) => handleInputChange('semester', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map((sem) => (
                          <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="credits">Credits</Label>
                    <Input
                      id="credits"
                      type="number"
                      value={formData.credits}
                      onChange={(e) => handleInputChange('credits', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {subjectTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="faculty">Faculty</Label>
                  <Input
                    id="faculty"
                    value={formData.faculty}
                    onChange={(e) => handleInputChange('faculty', e.target.value)}
                    placeholder="Dr. Name"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the subject and its scope"
                  />
                </div>

                <div>
                  <Label>Prerequisites</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {availablePrerequisites.map((prereq) => (
                      <div key={prereq} className="flex items-center space-x-2">
                        <Checkbox
                          id={prereq}
                          checked={formData.prerequisites.includes(prereq)}
                          onCheckedChange={() => handlePrerequisiteToggle(prereq)}
                        />
                        <Label htmlFor={prereq} className="text-sm">{prereq}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Course Objectives</Label>
                  <div className="space-y-2 mt-2">
                    {formData.objectives.map((objective, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={objective}
                          onChange={(e) => handleArrayFieldChange('objectives', index, e.target.value)}
                          placeholder="Enter course objective"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayField('objectives', index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addArrayField('objectives')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Objective
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="units" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Units and Topics</CardTitle>
                <CardDescription>Configure subject units and their topics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.units.map((unit, unitIndex) => (
                  <Card key={unit.id} className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Unit {unit.id}</CardTitle>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeUnit(unitIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Unit Name</Label>
                          <Input
                            value={unit.name}
                            onChange={(e) => handleUnitChange(unitIndex, 'name', e.target.value)}
                            placeholder="e.g., Introduction to Data Structures"
                          />
                        </div>
                        <div>
                          <Label>Hours</Label>
                          <Input
                            type="number"
                            value={unit.hours}
                            onChange={(e) => handleUnitChange(unitIndex, 'hours', parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Topics</Label>
                        <div className="space-y-2 mt-2">
                          {unit.topics.map((topic, topicIndex) => (
                            <div key={topicIndex} className="flex gap-2">
                              <Input
                                value={topic}
                                onChange={(e) => {
                                  const newTopics = [...unit.topics];
                                  newTopics[topicIndex] = e.target.value;
                                  handleUnitChange(unitIndex, 'topics', newTopics);
                                }}
                                placeholder="Enter topic"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newTopics = unit.topics.filter((_, i) => i !== topicIndex);
                                  handleUnitChange(unitIndex, 'topics', newTopics);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnitChange(unitIndex, 'topics', [...unit.topics, ''])}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Topic
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addUnit}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Unit
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="outcomes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Outcomes</CardTitle>
                <CardDescription>Define learning outcomes for this subject</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {formData.outcomes.map((outcome, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={outcome}
                        onChange={(e) => handleArrayFieldChange('outcomes', index, e.target.value)}
                        placeholder="Enter course outcome"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayField('outcomes', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayField('outcomes')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Outcome
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evaluation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Evaluation Scheme</CardTitle>
                <CardDescription>Configure assessment and evaluation criteria</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-base font-medium">Theory</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center gap-2">
                        <Label className="w-20">Internal:</Label>
                        <Input
                          type="number"
                          value={formData.evaluationScheme.theory.internal}
                          onChange={(e) => handleInputChange('evaluationScheme', {
                            ...formData.evaluationScheme,
                            theory: { ...formData.evaluationScheme.theory, internal: parseInt(e.target.value) || 0 }
                          })}
                        />
                        <span>%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="w-20">External:</Label>
                        <Input
                          type="number"
                          value={formData.evaluationScheme.theory.external}
                          onChange={(e) => handleInputChange('evaluationScheme', {
                            ...formData.evaluationScheme,
                            theory: { ...formData.evaluationScheme.theory, external: parseInt(e.target.value) || 0 }
                          })}
                        />
                        <span>%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Practical</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center gap-2">
                        <Label className="w-20">Internal:</Label>
                        <Input
                          type="number"
                          value={formData.evaluationScheme.practical.internal}
                          onChange={(e) => handleInputChange('evaluationScheme', {
                            ...formData.evaluationScheme,
                            practical: { ...formData.evaluationScheme.practical, internal: parseInt(e.target.value) || 0 }
                          })}
                        />
                        <span>%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="w-20">External:</Label>
                        <Input
                          type="number"
                          value={formData.evaluationScheme.practical.external}
                          onChange={(e) => handleInputChange('evaluationScheme', {
                            ...formData.evaluationScheme,
                            practical: { ...formData.evaluationScheme.practical, external: parseInt(e.target.value) || 0 }
                          })}
                        />
                        <span>%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="w-32">Assignments:</Label>
                    <Input
                      type="number"
                      value={formData.evaluationScheme.assignments}
                      onChange={(e) => handleInputChange('evaluationScheme', {
                        ...formData.evaluationScheme,
                        assignments: parseInt(e.target.value) || 0
                      })}
                    />
                    <span>%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-32">Projects:</Label>
                    <Input
                      type="number"
                      value={formData.evaluationScheme.projects}
                      onChange={(e) => handleInputChange('evaluationScheme', {
                        ...formData.evaluationScheme,
                        projects: parseInt(e.target.value) || 0
                      })}
                    />
                    <span>%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="references" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>References</CardTitle>
                <CardDescription>Add textbooks and reference materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {formData.references.map((reference, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={reference}
                        onChange={(e) => handleArrayFieldChange('references', index, e.target.value)}
                        placeholder="Enter reference book or material"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayField('references', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayField('references')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Reference
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-6">
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : (isEdit ? 'Update Subject' : 'Create Subject')}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate('/academics/curriculum/structure')}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>

          {isEdit && (
            <Button 
              type="button" 
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete Subject
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
