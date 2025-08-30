import React, { useState, Suspense } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowLeft, Plus, Search, Edit, Trash2, Download, Upload, 
  Eye, Calendar, Users, CheckCircle, AlertCircle, FileText
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function RegulationsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // If creating or editing, redirect to form page
  if (id === 'create' || (id && id.includes('edit'))) {
    // Import and render the form component
    const RegulationFormPage = React.lazy(() => import('./RegulationFormPage'));
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <RegulationFormPage />
      </Suspense>
    );
  }

  // Mock data - replace with actual API calls
  const regulations = [
    { 
      id: 'R-2024', 
      year: 'R-2024', 
      programs: ['B.Tech', 'M.Tech'], 
      status: 'Active', 
      effectiveFrom: '2024-06-01', 
      students: 1250,
      description: 'Latest regulation with updated NEP guidelines',
      approvedBy: 'Academic Council',
      approvalDate: '2024-05-15'
    },
    { 
      id: 'R-2023', 
      year: 'R-2023', 
      programs: ['B.Tech', 'MBA'], 
      status: 'Active', 
      effectiveFrom: '2023-06-01', 
      students: 980,
      description: 'Previous regulation with CBCS framework',
      approvedBy: 'Academic Council',
      approvalDate: '2023-05-10'
    },
    { 
      id: 'R-2022', 
      year: 'R-2022', 
      programs: ['B.Tech'], 
      status: 'Phasing Out', 
      effectiveFrom: '2022-06-01', 
      students: 450,
      description: 'Legacy regulation being phased out',
      approvedBy: 'Academic Council',
      approvalDate: '2022-05-20'
    }
  ];

  const filteredRegulations = regulations.filter(reg => {
    const matchesSearch = reg.year.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || reg.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (regulationId: string) => {
    if (confirm('Are you sure you want to delete this regulation?')) {
      console.log('Deleting regulation:', regulationId);
    }
  };

  // If viewing a specific regulation
  if (id) {
    const regulation = regulations.find(r => r.id === id);
    if (!regulation) {
      return <div>Regulation not found</div>;
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/academics/curriculum/regulations')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Regulations
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{regulation.year} Regulation</h1>
            <p className="text-muted-foreground">Detailed view and management</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Regulation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Regulation Year</Label>
                    <p className="font-medium">{regulation.year}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge variant={regulation.status === 'Active' ? 'default' : 'secondary'}>
                      {regulation.status}
                    </Badge>
                  </div>
                  <div>
                    <Label>Effective From</Label>
                    <p className="font-medium">{regulation.effectiveFrom}</p>
                  </div>
                  <div>
                    <Label>Students Affected</Label>
                    <p className="font-medium">{regulation.students.toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <p className="text-sm text-gray-600">{regulation.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Approved By</Label>
                    <p className="font-medium">{regulation.approvedBy}</p>
                  </div>
                  <div>
                    <Label>Approval Date</Label>
                    <p className="font-medium">{regulation.approvalDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Programs Under This Regulation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {regulation.programs.map((program, index) => (
                    <Card key={index} className="border border-gray-200">
                      <CardContent className="p-4">
                        <h4 className="font-medium">{program}</h4>
                        <p className="text-sm text-gray-600">Active program</p>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm">View Curriculum</Button>
                          <Button variant="outline" size="sm">View Subjects</Button>
                        </div>
                      </CardContent>
                    </Card>
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
                <Button className="w-full" onClick={() => navigate(`/academics/curriculum/regulations/${id}/edit`)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Regulation
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  View Documents
                </Button>
                <Button variant="destructive" className="w-full" onClick={() => handleDelete(regulation.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Regulation
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{regulation.students}</p>
                  <p className="text-sm text-gray-600">Students Enrolled</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{regulation.programs.length}</p>
                  <p className="text-sm text-gray-600">Programs</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Regulation Years</h1>
          <p className="text-muted-foreground">Manage academic regulation years and their configurations</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => navigate('/academics/curriculum/regulations/create')}>
            <Plus className="h-4 w-4 mr-2" />
            New Regulation
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search regulations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="phasing out">Phasing Out</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Regulation Years</CardTitle>
          <CardDescription>
            Configure and manage regulation years for academic programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Regulation Year</TableHead>
                <TableHead>Programs</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Effective From</TableHead>
                <TableHead>Students Affected</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegulations.map((regulation) => (
                <TableRow key={regulation.id}>
                  <TableCell>
                    <div>
                      <p className="font-mono font-medium">{regulation.year}</p>
                      <p className="text-sm text-gray-600">{regulation.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {regulation.programs.map((program, index) => (
                        <Badge key={index} variant="outline">{program}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={regulation.status === 'Active' ? 'default' : 'secondary'}>
                      {regulation.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{regulation.effectiveFrom}</TableCell>
                  <TableCell>{regulation.students.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/academics/curriculum/regulations/${regulation.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/academics/curriculum/regulations/${regulation.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(regulation.id)}
                      >
                        <Trash2 className="h-4 w-4" />
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
