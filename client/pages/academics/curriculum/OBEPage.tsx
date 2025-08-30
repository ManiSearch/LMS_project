import React, { useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
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
  ArrowLeft, Plus, Search, Edit, Trash2, Target, 
  Eye, BookOpen, Users, CheckCircle, AlertCircle, FileText,
  Clock, MessageSquare, Upload, Book, PlayCircle,
  Award, GraduationCap, Settings, BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function OBEPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();

  // Check if we're in edit mode
  const isEditMode = location.pathname.includes('/edit');
  const outcomeId = isEditMode ? id : id;
  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Mock data - replace with actual API calls
  const courseOutcomes = [
    {
      id: 1,
      code: 'CO1',
      subject: 'Data Structures & Algorithms',
      program: 'B.Tech CSE',
      description: 'Understand and implement linear data structures',
      bloomLevel: 'Understand',
      mapped: true,
      plos: ['PLO1', 'PLO3']
    },
    {
      id: 2,
      code: 'CO2',
      subject: 'Data Structures & Algorithms',
      program: 'B.Tech CSE',
      description: 'Analyze and design tree and graph algorithms',
      bloomLevel: 'Analyze',
      mapped: true,
      plos: ['PLO2', 'PLO4']
    },
    {
      id: 3,
      code: 'CO3',
      subject: 'Database Management Systems',
      program: 'B.Tech CSE',
      description: 'Design and implement database systems',
      bloomLevel: 'Create',
      mapped: false,
      plos: []
    }
  ];

  const programLearningOutcomes = [
    {
      id: 'PLO1',
      description: 'Apply knowledge of mathematics, science, and engineering',
      courses: 12,
      mapped: 45
    },
    {
      id: 'PLO2',
      description: 'Design and conduct experiments and analyze data',
      courses: 8,
      mapped: 32
    },
    {
      id: 'PLO3',
      description: 'Design systems to meet desired needs',
      courses: 10,
      mapped: 38
    }
  ];

  const coploMapping = [
    { co: 'CO1', plo1: 'High', plo2: '', plo3: 'Medium', plo4: '', plo5: 'Low' },
    { co: 'CO2', plo1: 'Medium', plo2: 'High', plo3: '', plo4: 'High', plo5: '' },
    { co: 'CO3', plo1: '', plo2: 'Medium', plo3: 'High', plo4: 'Medium', plo5: 'Low' },
  ];

  const filteredOutcomes = courseOutcomes.filter(outcome => {
    const matchesSearch = outcome.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         outcome.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = programFilter === 'all' || outcome.program.toLowerCase().includes(programFilter.toLowerCase());
    return matchesSearch && matchesProgram;
  });

  // If editing a specific outcome
  if (isEditMode && id) {
    const outcome = courseOutcomes.find(o => o.id === parseInt(id));
    if (!outcome) {
      return <div>Course outcome not found</div>;
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(`/academics/curriculum/obe/${id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Outcome Details
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Course Outcome</h1>
            <p className="text-muted-foreground">{outcome.code} - {outcome.subject}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Course Outcome</CardTitle>
            <CardDescription>Update course outcome details and mappings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Outcome Code</Label>
                <Input defaultValue={outcome.code} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input defaultValue={outcome.subject} className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input defaultValue={outcome.description} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="bloom">Bloom's Taxonomy Level</Label>
              <Select defaultValue={outcome.bloomLevel.toLowerCase()}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remember">Remember</SelectItem>
                  <SelectItem value="understand">Understand</SelectItem>
                  <SelectItem value="apply">Apply</SelectItem>
                  <SelectItem value="analyze">Analyze</SelectItem>
                  <SelectItem value="evaluate">Evaluate</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button>Save Changes</Button>
              <Button variant="outline" onClick={() => navigate(`/academics/curriculum/obe/${id}`)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If viewing a specific outcome
  if (id && id !== 'create') {
    const outcome = courseOutcomes.find(o => o.id === parseInt(id));
    if (!outcome) {
      return <div>Course outcome not found</div>;
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/academics/curriculum/obe')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to OBE & CBCS
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{outcome.code} - Course Outcome</h1>
            <p className="text-muted-foreground">{outcome.subject} • {outcome.program}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Outcome Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Outcome Code</Label>
                    <p className="font-mono font-medium">{outcome.code}</p>
                  </div>
                  <div>
                    <Label>Subject</Label>
                    <p className="font-medium">{outcome.subject}</p>
                  </div>
                  <div>
                    <Label>Program</Label>
                    <Badge variant="outline">{outcome.program}</Badge>
                  </div>
                  <div>
                    <Label>Bloom's Taxonomy Level</Label>
                    <Badge variant="secondary">{outcome.bloomLevel}</Badge>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <p className="text-sm text-gray-600">{outcome.description}</p>
                </div>
                <div>
                  <Label>Mapped PLOs</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {outcome.plos.length > 0 ? outcome.plos.map((plo, index) => (
                      <Badge key={index} variant="default" className="text-xs">{plo}</Badge>
                    )) : (
                      <p className="text-sm text-gray-500">No PLOs mapped</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>PLO Mapping Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PLO</TableHead>
                      <TableHead>Mapping Level</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programLearningOutcomes.map((plo, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{plo.id}</TableCell>
                        <TableCell>
                          {outcome.plos.includes(plo.id) ? (
                            <Badge variant="default">Mapped</Badge>
                          ) : (
                            <Badge variant="outline">Not Mapped</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{plo.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" onClick={() => navigate(`/academics/curriculum/obe/${id}/edit`)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Outcome
                </Button>
                <Button variant="outline" className="w-full">
                  <Target className="h-4 w-4 mr-2" />
                  Map to PLOs
                </Button>
                <Button variant="outline" className="w-full">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Assessment Matrix
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mapping Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{outcome.plos.length}</p>
                  <p className="text-sm text-gray-600">PLOs Mapped</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{outcome.mapped ? '100' : '0'}%</p>
                  <p className="text-sm text-gray-600">Completion</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Create new outcome form
  if (id === 'create') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/academics/curriculum/obe')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to OBE & CBCS
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Configure OBE & CBCS</h1>
            <p className="text-muted-foreground">Set up course outcomes and program learning outcomes</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Course Outcome Configuration</CardTitle>
            <CardDescription>Define new course outcomes and map to program learning outcomes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dsa">Data Structures & Algorithms</SelectItem>
                    <SelectItem value="dbms">Database Management Systems</SelectItem>
                    <SelectItem value="os">Operating Systems</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="program">Program</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="btech-cse">B.Tech CSE</SelectItem>
                    <SelectItem value="btech-ece">B.Tech ECE</SelectItem>
                    <SelectItem value="mca">MCA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Outcome Description</Label>
              <Input 
                placeholder="Enter course outcome description" 
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="bloom">Bloom's Taxonomy Level</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remember">Remember</SelectItem>
                  <SelectItem value="understand">Understand</SelectItem>
                  <SelectItem value="apply">Apply</SelectItem>
                  <SelectItem value="analyze">Analyze</SelectItem>
                  <SelectItem value="evaluate">Evaluate</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button>Save Outcome</Button>
              <Button variant="outline" onClick={() => navigate('/academics/curriculum/obe')}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">OBE & CBCS Management</h1>
          <p className="text-muted-foreground">Outcome-Based Education and Choice-Based Credit System</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => navigate('/academics/curriculum/obe/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Configure Outcomes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="course-outcomes" className="w-full">
        <TabsList>
          <TabsTrigger value="course-outcomes">Course Outcomes</TabsTrigger>
          <TabsTrigger value="program-outcomes">Program Learning Outcomes</TabsTrigger>
          <TabsTrigger value="mapping">CO-PLO Mapping</TabsTrigger>
          <TabsTrigger value="assessment">Assessment Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="course-outcomes" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search outcomes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={programFilter} onValueChange={setProgramFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                <SelectItem value="cse">B.Tech CSE</SelectItem>
                <SelectItem value="ece">B.Tech ECE</SelectItem>
                <SelectItem value="mca">MCA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Course Outcomes</CardTitle>
              <CardDescription>Defined learning outcomes for individual courses</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Bloom Level</TableHead>
                    <TableHead>PLO Mapping</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOutcomes.map((outcome) => (
                    <TableRow key={outcome.id}>
                      <TableCell className="font-mono font-medium">{outcome.code}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{outcome.subject}</p>
                          <p className="text-sm text-gray-600">{outcome.program}</p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm truncate">{outcome.description}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{outcome.bloomLevel}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {outcome.mapped ? (
                            <Badge variant="default">Mapped</Badge>
                          ) : (
                            <Badge variant="outline">Not Mapped</Badge>
                          )}
                          <span className="text-sm text-gray-600">
                            {outcome.plos.length} PLOs
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/academics/curriculum/obe/${outcome.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/academics/curriculum/obe/${outcome.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={outcome.mapped ? 'text-green-600' : 'text-gray-400'}
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
        </TabsContent>

        <TabsContent value="program-outcomes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Program Learning Outcomes</CardTitle>
              <CardDescription>Overall learning outcomes for the academic program</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {programLearningOutcomes.map((plo, index) => (
                  <Card key={index} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{plo.id}</h4>
                          <p className="text-sm text-gray-600 mt-1">{plo.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-blue-600">{plo.courses} courses</span>
                            <span className="text-sm text-green-600">{plo.mapped} outcomes mapped</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CO-PLO Mapping Matrix</CardTitle>
              <CardDescription>Mapping between Course Outcomes and Program Learning Outcomes</CardDescription>
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
                  {coploMapping.map((mapping, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{mapping.co}</TableCell>
                      <TableCell className="text-center">
                        {mapping.plo1 && (
                          <Badge variant={mapping.plo1 === 'High' ? 'default' : 'secondary'}>
                            {mapping.plo1}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {mapping.plo2 && (
                          <Badge variant={mapping.plo2 === 'High' ? 'default' : 'secondary'}>
                            {mapping.plo2}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {mapping.plo3 && (
                          <Badge variant={mapping.plo3 === 'High' ? 'default' : 'secondary'}>
                            {mapping.plo3}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {mapping.plo4 && (
                          <Badge variant={mapping.plo4 === 'High' ? 'default' : 'secondary'}>
                            {mapping.plo4}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {mapping.plo5 && (
                          <Badge variant={mapping.plo5 === 'High' ? 'default' : 'secondary'}>
                            {mapping.plo5}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Matrix</CardTitle>
              <CardDescription>Course outcome assessment methods and weightage</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Assessment matrix configuration coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
