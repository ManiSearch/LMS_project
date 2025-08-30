import React, { useState, Suspense } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft, Plus, Search, Edit, Trash2, Layers, 
  Eye, BookOpen, Users, CheckCircle, AlertCircle, FileText,
  Clock, Target, MessageSquare, Upload, Book, PlayCircle,
  Award, GraduationCap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function StructurePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // If creating or editing, redirect to form page
  if (id === 'create' || (id && id.includes('edit'))) {
    const StructureFormPage = React.lazy(() => import('./StructureFormPage'));
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <StructureFormPage />
      </Suspense>
    );
  }

  // Mock data - replace with actual API calls
  const subjects = [
    {
      id: 1,
      code: 'CS301',
      name: 'Data Structures & Algorithms',
      semester: 'Semester 3',
      credits: 4,
      type: 'Core',
      units: 5,
      topics: 24,
      completion: 75,
      faculty: 'Dr.Manikandan',
      lastUpdated: '2024-01-15',
      prerequisites: ['Programming Fundamentals', 'Mathematics II'],
      outcomes: 4,
      mapped: true
    },
    {
      id: 2,
      code: 'CS401',
      name: 'Database Management Systems',
      semester: 'Semester 4',
      credits: 4,
      type: 'Core',
      units: 4,
      topics: 18,
      completion: 60,
      faculty: 'Prof. Kumar',
      lastUpdated: '2024-01-10',
      prerequisites: ['Data Structures & Algorithms'],
      outcomes: 5,
      mapped: true
    },
    {
      id: 3,
      code: 'CS501',
      name: 'Operating Systems',
      semester: 'Semester 5',
      credits: 3,
      type: 'Core',
      units: 4,
      topics: 16,
      completion: 45,
      faculty: 'Dr. Meenakshi',
      lastUpdated: '2024-01-08',
      prerequisites: ['Computer Architecture'],
      outcomes: 4,
      mapped: false
    }
  ];

  const units = [
    {
      id: 1,
      subjectId: 1,
      name: 'Unit 1: Introduction to Data Structures',
      topics: ['Arrays', 'Linked Lists', 'Stacks', 'Queues'],
      hours: 12,
      completion: 100,
      outcomes: ['Understand basic data structures', 'Implement linear data structures']
    },
    {
      id: 2,
      subjectId: 1,
      name: 'Unit 2: Trees and Graphs',
      topics: ['Binary Trees', 'AVL Trees', 'Graph Traversal', 'Shortest Path'],
      hours: 15,
      completion: 80,
      outcomes: ['Implement tree structures', 'Apply graph algorithms']
    },
    {
      id: 3,
      subjectId: 1,
      name: 'Unit 3: Sorting and Searching',
      topics: ['Bubble Sort', 'Quick Sort', 'Binary Search', 'Hash Tables'],
      hours: 10,
      completion: 60,
      outcomes: ['Compare sorting algorithms', 'Implement search techniques']
    }
  ];

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = semesterFilter === 'all' || subject.semester.toLowerCase().includes(semesterFilter.toLowerCase());
    const matchesType = typeFilter === 'all' || subject.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesSemester && matchesType;
  });

  // If viewing a specific subject
  if (id) {
    const subject = subjects.find(s => s.id === parseInt(id));
    if (!subject) {
      return <div>Subject not found</div>;
    }

    const subjectUnits = units.filter(u => u.subjectId === subject.id);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/academics/curriculum/structure')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Academic Structure
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{subject.name}</h1>
            <p className="text-muted-foreground">{subject.code} • {subject.semester} • {subject.credits} Credits</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subject Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Subject Code</Label>
                    <p className="font-mono font-medium">{subject.code}</p>
                  </div>
                  <div>
                    <Label>Subject Name</Label>
                    <p className="font-medium">{subject.name}</p>
                  </div>
                  <div>
                    <Label>Semester</Label>
                    <Badge variant="outline">{subject.semester}</Badge>
                  </div>
                  <div>
                    <Label>Credits</Label>
                    <p className="font-medium">{subject.credits}</p>
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Badge variant={subject.type === 'Core' ? 'default' : 'secondary'}>
                      {subject.type}
                    </Badge>
                  </div>
                  <div>
                    <Label>Faculty</Label>
                    <p className="font-medium">{subject.faculty}</p>
                  </div>
                </div>
                <div>
                  <Label>Prerequisites</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {subject.prerequisites.map((prereq, index) => (
                      <Badge key={index} variant="outline" className="text-xs">{prereq}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Completion Status</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={subject.completion} className="flex-1" />
                    <span className="text-sm font-medium">{subject.completion}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="units" className="w-full">
              <TabsList>
                <TabsTrigger value="units">Units & Topics</TabsTrigger>
                <TabsTrigger value="outcomes">Learning Outcomes</TabsTrigger>
                <TabsTrigger value="mapping">CO-PLO Mapping</TabsTrigger>
              </TabsList>

              <TabsContent value="units" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Subject Units</CardTitle>
                    <CardDescription>Detailed breakdown of units and topics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {subjectUnits.map((unit, index) => (
                        <Card key={unit.id} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-semibold">{unit.name}</h4>
                                <p className="text-sm text-gray-600">{unit.hours} hours</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{unit.completion}% Complete</Badge>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="mb-3">
                              <Label className="text-sm font-medium">Topics</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {unit.topics.map((topic, topicIndex) => (
                                  <Badge key={topicIndex} variant="secondary" className="text-xs">
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Progress value={unit.completion} className="h-2" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="outcomes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Outcomes</CardTitle>
                    <CardDescription>Learning outcomes for this subject</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        'CO1: Understand and implement linear data structures',
                        'CO2: Analyze and design tree and graph algorithms',
                        'CO3: Compare and apply different sorting algorithms',
                        'CO4: Evaluate algorithm complexity and performance'
                      ].map((outcome, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Target className="h-5 w-5 text-blue-600" />
                          <p className="font-medium">{outcome}</p>
                          <Button variant="ghost" size="sm" className="ml-auto">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="mapping" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>CO-PLO Mapping</CardTitle>
                    <CardDescription>Course Outcome to Program Learning Outcome mapping</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course Outcome</TableHead>
                          <TableHead>PLO 1</TableHead>
                          <TableHead>PLO 2</TableHead>
                          <TableHead>PLO 3</TableHead>
                          <TableHead>PLO 4</TableHead>
                          <TableHead>PLO 5</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {['CO1', 'CO2', 'CO3', 'CO4'].map((co, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{co}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant={index === 0 ? 'default' : 'outline'}>
                                {index === 0 ? 'High' : index === 1 ? 'Medium' : ''}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant={index === 1 ? 'default' : 'outline'}>
                                {index === 1 ? 'High' : index === 2 ? 'Medium' : ''}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant={index === 2 ? 'default' : 'outline'}>
                                {index === 2 ? 'High' : index === 0 ? 'Low' : ''}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant={index === 3 ? 'default' : 'outline'}>
                                {index === 3 ? 'High' : ''}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant={index === 1 ? 'secondary' : 'outline'}>
                                {index === 1 ? 'Medium' : ''}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" onClick={() => navigate(`/academics/curriculum/structure/${id}/edit`)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Subject
                </Button>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Unit
                </Button>
                <Button variant="outline" className="w-full">
                  <Target className="h-4 w-4 mr-2" />
                  Add Outcome
                </Button>
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Content
                </Button>
                <Button variant="outline" className="w-full">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Preview Syllabus
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{subject.units}</p>
                  <p className="text-sm text-gray-600">Total Units</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{subject.topics}</p>
                  <p className="text-sm text-gray-600">Topics Covered</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{subject.outcomes}</p>
                  <p className="text-sm text-gray-600">Learning Outcomes</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Academic Structure</h1>
          <p className="text-muted-foreground">Manage subjects, units, topics, and lesson plans</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export Structure
          </Button>
          <Button onClick={() => navigate('/academics/curriculum/structure/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Subject
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={semesterFilter} onValueChange={setSemesterFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Semesters</SelectItem>
            <SelectItem value="1">Semester 1</SelectItem>
            <SelectItem value="2">Semester 2</SelectItem>
            <SelectItem value="3">Semester 3</SelectItem>
            <SelectItem value="4">Semester 4</SelectItem>
            <SelectItem value="5">Semester 5</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="core">Core</SelectItem>
            <SelectItem value="elective">Elective</SelectItem>
            <SelectItem value="lab">Lab</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subject Structure</CardTitle>
          <CardDescription>
            Academic subjects with their units, topics, and completion status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Completion</TableHead>
                <TableHead>Faculty</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{subject.name}</p>
                      <p className="text-sm text-gray-600 font-mono">{subject.code}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{subject.semester}</Badge>
                  </TableCell>
                  <TableCell>{subject.credits}</TableCell>
                  <TableCell>
                    <Badge variant={subject.type === 'Core' ? 'default' : 'secondary'}>
                      {subject.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <p className="font-medium">{subject.units}</p>
                      <p className="text-xs text-gray-600">{subject.topics} topics</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={subject.completion} className="w-16" />
                      <span className="text-sm">{subject.completion}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{subject.faculty}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/academics/curriculum/structure/${subject.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/academics/curriculum/structure/${subject.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={subject.mapped ? 'text-green-600' : 'text-gray-400'}
                      >
                        <Target className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
