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
  Globe, Map, PlayCircle, PenTool, Layers, School, GraduationCap,
  Eye, MoreVertical, Filter, Search
} from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  item?: any;
  onSave?: (data: any) => void;
}

// Create New Curriculum Dialog
export function CreateNewCurriculumDialog({ isOpen, onClose, onSave }: DialogProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    programName: '',
    degree: '',
    department: '',
    duration: '4',
    totalCredits: '180',
    regulation: '',
    effectiveFrom: '',
    description: '',
    objectives: '',
    subjects: [],
    semesters: 8,
    creditStructure: 'cbcs',
    gradeScheme: 'relative'
  });

  const [subjects, setSubjects] = useState([
    { id: 1, name: '', code: '', credits: '', semester: '1', type: 'Core', hours: { theory: '', lab: '', tutorial: '' } }
  ]);

  const handleSave = () => {
    const curriculumData = {
      ...formData,
      subjects: subjects.filter(s => s.name && s.code),
      createdDate: new Date().toISOString().split('T')[0],
      status: 'Draft'
    };
    onSave?.(curriculumData);
    onClose();
  };

  const addSubject = () => {
    setSubjects([...subjects, {
      id: subjects.length + 1,
      name: '',
      code: '',
      credits: '',
      semester: '1',
      type: 'Core',
      hours: { theory: '', lab: '', tutorial: '' }
    }]);
  };

  const updateSubject = (index: number, field: string, value: string) => {
    const updated = [...subjects];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updated[index][parent][child] = value;
    } else {
      updated[index][field] = value;
    }
    setSubjects(updated);
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Curriculum</DialogTitle>
          <DialogDescription>Design a comprehensive curriculum with subjects, credits, and structure</DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="structure">Credit Structure</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Program Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Program Name *</Label>
                    <Input
                      placeholder="Bachelor of Technology in Computer Science"
                      value={formData.programName}
                      onChange={(e) => setFormData({...formData, programName: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Degree *</Label>
                      <Select value={formData.degree} onValueChange={(value) => setFormData({...formData, degree: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select degree" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="B.Tech">B.Tech</SelectItem>
                          <SelectItem value="B.E">B.E</SelectItem>
                          <SelectItem value="M.Tech">M.Tech</SelectItem>
                          <SelectItem value="MBA">MBA</SelectItem>
                          <SelectItem value="MCA">MCA</SelectItem>
                          <SelectItem value="PhD">PhD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Department *</Label>
                      <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CSE">Computer Science & Engineering</SelectItem>
                          <SelectItem value="ECE">Electronics & Communication</SelectItem>
                          <SelectItem value="ME">Mechanical Engineering</SelectItem>
                          <SelectItem value="EEE">Electrical & Electronics</SelectItem>
                          <SelectItem value="MANAGEMENT">Management Studies</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Duration (Years)</Label>
                      <Input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Total Credits</Label>
                      <Input
                        type="number"
                        value={formData.totalCredits}
                        onChange={(e) => setFormData({...formData, totalCredits: e.target.value})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Regulation & Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Regulation Year</Label>
                    <Input
                      placeholder="R-2024"
                      value={formData.regulation}
                      onChange={(e) => setFormData({...formData, regulation: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Effective From</Label>
                    <Input
                      type="date"
                      value={formData.effectiveFrom}
                      onChange={(e) => setFormData({...formData, effectiveFrom: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Credit System</Label>
                      <Select value={formData.creditStructure} onValueChange={(value) => setFormData({...formData, creditStructure: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cbcs">CBCS</SelectItem>
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
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Program Description</Label>
                <Textarea
                  placeholder="Describe the program objectives, scope, and career opportunities..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Learning Objectives</Label>
                <Textarea
                  placeholder="List the key learning objectives and outcomes..."
                  value={formData.objectives}
                  onChange={(e) => setFormData({...formData, objectives: e.target.value})}
                  rows={4}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="structure" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Credit Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { category: 'Core Subjects', credits: 90, color: 'blue' },
                    { category: 'Elective Subjects', credits: 54, color: 'green' },
                    { category: 'Project/Internship', credits: 36, color: 'purple' }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <Label>{item.category}</Label>
                        <span className="text-sm font-medium">{item.credits} credits</span>
                      </div>
                      <Progress value={(item.credits / 180) * 100} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Semester Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {Array.from({length: 8}, (_, i) => (
                      <div key={i} className="p-3 border rounded-lg text-center">
                        <div className="font-medium">Semester {i + 1}</div>
                        <div className="text-sm text-gray-600">20-24 credits</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Subject Configuration</h3>
              <Button onClick={addSubject}>
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {subjects.map((subject, index) => (
                <Card key={subject.id} className="p-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-2">
                      <Label className="text-xs">Subject Code</Label>
                      <Input
                        placeholder="CS101"
                        value={subject.code}
                        onChange={(e) => updateSubject(index, 'code', e.target.value)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Label className="text-xs">Subject Name</Label>
                      <Input
                        placeholder="Programming Fundamentals"
                        value={subject.name}
                        onChange={(e) => updateSubject(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="col-span-1">
                      <Label className="text-xs">Credits</Label>
                      <Input
                        type="number"
                        placeholder="4"
                        value={subject.credits}
                        onChange={(e) => updateSubject(index, 'credits', e.target.value)}
                      />
                    </div>
                    <div className="col-span-1">
                      <Label className="text-xs">Semester</Label>
                      <Select value={subject.semester} onValueChange={(value) => updateSubject(index, 'semester', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({length: 8}, (_, i) => (
                            <SelectItem key={i} value={`${i + 1}`}>{i + 1}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">Type</Label>
                      <Select value={subject.type} onValueChange={(value) => updateSubject(index, 'type', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Core">Core</SelectItem>
                          <SelectItem value="Elective">Elective</SelectItem>
                          <SelectItem value="Open Elective">Open Elective</SelectItem>
                          <SelectItem value="Project">Project</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">Hours (T-L-P)</Label>
                      <div className="flex gap-1">
                        <Input
                          className="w-12 text-xs"
                          placeholder="3"
                          value={subject.hours.theory}
                          onChange={(e) => updateSubject(index, 'hours.theory', e.target.value)}
                        />
                        <Input
                          className="w-12 text-xs"
                          placeholder="0"
                          value={subject.hours.lab}
                          onChange={(e) => updateSubject(index, 'hours.lab', e.target.value)}
                        />
                        <Input
                          className="w-12 text-xs"
                          placeholder="1"
                          value={subject.hours.tutorial}
                          onChange={(e) => updateSubject(index, 'hours.tutorial', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-span-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSubject(index)}
                        className="mt-4"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="review" className="space-y-6">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Review all curriculum details before creating. You can modify these later through the curriculum management system.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Program Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Program:</span>
                    <span className="font-medium">{formData.programName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Degree:</span>
                    <span className="font-medium">{formData.degree}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Department:</span>
                    <span className="font-medium">{formData.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{formData.duration} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Credits:</span>
                    <span className="font-medium">{formData.totalCredits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Regulation:</span>
                    <span className="font-medium">{formData.regulation}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subjects Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Subjects:</span>
                      <span className="font-medium">{subjects.filter(s => s.name).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Core Subjects:</span>
                      <span className="font-medium">{subjects.filter(s => s.type === 'Core' && s.name).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Elective Subjects:</span>
                      <span className="font-medium">{subjects.filter(s => s.type === 'Elective' && s.name).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Subject Credits:</span>
                      <span className="font-medium">
                        {subjects.filter(s => s.name).reduce((sum, s) => sum + (parseInt(s.credits) || 0), 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Create Curriculum
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Bulk Upload Dialog for Quick Actions
export function BulkUploadDialog({ isOpen, onClose, onSave }: DialogProps) {
  const [uploadType, setUploadType] = useState('subjects');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      // Mock preview data
      setPreview([
        { code: 'CS101', name: 'Programming Fundamentals', credits: 4, semester: 1 },
        { code: 'CS102', name: 'Data Structures', credits: 4, semester: 2 },
        { code: 'CS103', name: 'Algorithms', credits: 3, semester: 3 }
      ]);
    }
  };

  const handleSave = () => {
    const uploadData = {
      type: uploadType,
      file: file?.name,
      records: preview.length,
      data: preview
    };
    onSave?.(uploadData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload</DialogTitle>
          <DialogDescription>Upload multiple records using CSV or Excel files</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Upload Type</Label>
                  <Select value={uploadType} onValueChange={setUploadType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subjects">Subjects</SelectItem>
                      <SelectItem value="regulations">Regulations</SelectItem>
                      <SelectItem value="outcomes">Learning Outcomes</SelectItem>
                      <SelectItem value="mappings">CO-PLO Mappings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Upload File</Label>
                  <Input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                  />
                  <p className="text-sm text-gray-600">Supports CSV and Excel files</p>
                </div>

                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Records Found:</span>
                    <span className="font-medium">{preview.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valid Records:</span>
                    <span className="font-medium text-green-600">{preview.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Errors:</span>
                    <span className="font-medium text-red-600">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant="default">Ready to Import</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {preview.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Data Preview</CardTitle>
                <CardDescription>First 5 records from your upload</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.slice(0, 5).map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{record.code}</TableCell>
                        <TableCell>{record.name}</TableCell>
                        <TableCell>{record.credits}</TableCell>
                        <TableCell>{record.semester}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Valid</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={preview.length === 0}>
            <Upload className="h-4 w-4 mr-2" />
            Import Data
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
