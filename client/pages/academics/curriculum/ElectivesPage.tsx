import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft, Plus, Search, Edit, Trash2, Star, 
  Eye, BookOpen, Users, CheckCircle, AlertCircle, FileText,
  Clock, Settings, BarChart3, Award
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function ElectivesPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [semesterFilter, setSemesterFilter] = useState('all');

  // Mock data - replace with actual API calls
  const electives = [
    {
      id: 1,
      code: 'CS-E01',
      name: 'Artificial Intelligence',
      category: 'Open Elective',
      semester: 'Semester 6',
      credits: 3,
      capacity: 40,
      enrolled: 35,
      faculty: 'Dr. AI Expert',
      prerequisites: ['Data Structures'],
      description: 'Introduction to AI concepts and applications'
    },
    {
      id: 2,
      code: 'CS-E02',
      name: 'Mobile App Development',
      category: 'Professional Elective',
      semester: 'Semester 7',
      credits: 4,
      capacity: 30,
      enrolled: 28,
      faculty: 'Prof. Mobile Dev',
      prerequisites: ['Object Oriented Programming'],
      description: 'Cross-platform mobile application development'
    },
    {
      id: 3,
      code: 'CS-E03',
      name: 'Cyber Security',
      category: 'Open Elective',
      semester: 'Semester 6',
      credits: 3,
      capacity: 35,
      enrolled: 22,
      faculty: 'Dr. Security',
      prerequisites: ['Computer Networks'],
      description: 'Fundamentals of cybersecurity and ethical hacking'
    }
  ];

  const electiveCategories = [
    { name: 'Open Elective', count: 12, description: 'Interdisciplinary subjects' },
    { name: 'Professional Elective', count: 8, description: 'Core domain specialization' },
    { name: 'MOOC Elective', count: 5, description: 'Online course integration' },
    { name: 'Industry Elective', count: 3, description: 'Industry-sponsored courses' }
  ];

  const filteredElectives = electives.filter(elective => {
    const matchesSearch = elective.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         elective.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || elective.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesSemester = semesterFilter === 'all' || elective.semester.toLowerCase().includes(semesterFilter.toLowerCase());
    return matchesSearch && matchesCategory && matchesSemester;
  });

  // If viewing a specific elective
  if (id && id !== 'create') {
    const elective = electives.find(e => e.id === parseInt(id));
    if (!elective) {
      return <div>Elective not found</div>;
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/academics/curriculum/electives')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Electives
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{elective.name}</h1>
            <p className="text-muted-foreground">{elective.code} • {elective.category}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Elective Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Code</Label>
                    <p className="font-mono font-medium">{elective.code}</p>
                  </div>
                  <div>
                    <Label>Name</Label>
                    <p className="font-medium">{elective.name}</p>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Badge variant="outline">{elective.category}</Badge>
                  </div>
                  <div>
                    <Label>Semester</Label>
                    <Badge variant="secondary">{elective.semester}</Badge>
                  </div>
                  <div>
                    <Label>Credits</Label>
                    <p className="font-medium">{elective.credits}</p>
                  </div>
                  <div>
                    <Label>Faculty</Label>
                    <p className="font-medium">{elective.faculty}</p>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <p className="text-sm text-gray-600">{elective.description}</p>
                </div>
                <div>
                  <Label>Prerequisites</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {elective.prerequisites.map((prereq, index) => (
                      <Badge key={index} variant="outline" className="text-xs">{prereq}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Enrollment Status</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={(elective.enrolled / elective.capacity) * 100} className="flex-1" />
                    <span className="text-sm font-medium">
                      {elective.enrolled}/{elective.capacity}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enrolled Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: '001', name: 'Arun Kumar', program: 'B.Tech CSE', semester: 'VI' },
                    { id: '002', name: 'Priya Sharma', program: 'B.Tech ECE', semester: 'VI' },
                    { id: '003', name: 'Rajesh M', program: 'B.Tech CSE', semester: 'VI' }
                  ].map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.id} • {student.program} • Sem {student.semester}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" onClick={() => navigate(`/academics/curriculum/electives/${id}/edit`)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Elective
                </Button>
                <Button variant="outline" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Enrollment
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Syllabus
                </Button>
                <Button variant="outline" className="w-full">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{elective.enrolled}</p>
                  <p className="text-sm text-gray-600">Students Enrolled</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round((elective.enrolled / elective.capacity) * 100)}%
                  </p>
                  <p className="text-sm text-gray-600">Capacity Filled</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Create new elective form
  if (id === 'create') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/academics/curriculum/electives')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Electives
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Elective</h1>
            <p className="text-muted-foreground">Configure a new elective subject</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Elective Configuration</CardTitle>
            <CardDescription>Set up a new elective subject for student selection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Subject Code</Label>
                <Input placeholder="e.g., CS-E04" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="name">Subject Name</Label>
                <Input placeholder="e.g., Machine Learning" className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open Elective</SelectItem>
                    <SelectItem value="professional">Professional Elective</SelectItem>
                    <SelectItem value="mooc">MOOC Elective</SelectItem>
                    <SelectItem value="industry">Industry Elective</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="semester">Semester</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">Semester 5</SelectItem>
                    <SelectItem value="6">Semester 6</SelectItem>
                    <SelectItem value="7">Semester 7</SelectItem>
                    <SelectItem value="8">Semester 8</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="credits">Credits</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select credits" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Credits</SelectItem>
                    <SelectItem value="3">3 Credits</SelectItem>
                    <SelectItem value="4">4 Credits</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input type="number" placeholder="Maximum students" className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input placeholder="Brief description of the elective" className="mt-1" />
            </div>
            <div className="flex gap-2 pt-4">
              <Button>Save Elective</Button>
              <Button variant="outline" onClick={() => navigate('/academics/curriculum/electives')}>
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
          <h1 className="text-3xl font-bold tracking-tight">Elective Management</h1>
          <p className="text-muted-foreground">Manage elective subjects and student selections</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button onClick={() => navigate('/academics/curriculum/electives/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Elective
          </Button>
        </div>
      </div>

      {/* Elective Categories Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {electiveCategories.map((category, index) => (
          <Card key={index} className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{category.count}</p>
                <p className="text-sm font-medium">{category.name}</p>
                <p className="text-xs text-gray-600">{category.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search electives..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="open">Open Elective</SelectItem>
            <SelectItem value="professional">Professional Elective</SelectItem>
            <SelectItem value="mooc">MOOC Elective</SelectItem>
            <SelectItem value="industry">Industry Elective</SelectItem>
          </SelectContent>
        </Select>
        <Select value={semesterFilter} onValueChange={setSemesterFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Semesters</SelectItem>
            <SelectItem value="5">Semester 5</SelectItem>
            <SelectItem value="6">Semester 6</SelectItem>
            <SelectItem value="7">Semester 7</SelectItem>
            <SelectItem value="8">Semester 8</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Electives</CardTitle>
          <CardDescription>Elective subjects available for student selection</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Enrollment</TableHead>
                <TableHead>Faculty</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredElectives.map((elective) => (
                <TableRow key={elective.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{elective.name}</p>
                      <p className="text-sm text-gray-600 font-mono">{elective.code}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{elective.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{elective.semester}</Badge>
                  </TableCell>
                  <TableCell>{elective.credits}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(elective.enrolled / elective.capacity) * 100} 
                        className="w-16" 
                      />
                      <span className="text-sm">
                        {elective.enrolled}/{elective.capacity}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{elective.faculty}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/academics/curriculum/electives/${elective.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/academics/curriculum/electives/${elective.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                      >
                        <Users className="h-4 w-4" />
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
