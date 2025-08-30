import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Plus, Search, Edit, Eye, Users, School, Building, GraduationCap,
  Calculator, Clock, Target, Filter
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import {
  filterInstitutionsByRole,
  getRoleAccessDescription,
  getRoleDisplayName,
  canManageCurriculum,
  isReadOnlyAccess
} from '@/utils/institutionAccess';

interface Entity {
  id: number;
  name: string;
  code: string;
  type: string;
  educationalAuthority: string;
  programs_offered: string[];
  district: string;
  state: string;
  established_year: number;
  accreditation: string;
  status: string;
}

interface Program {
  id: string;
  name: string;
  code: string;
  level: string;
  type: string;
  department: string;
  duration: number;
  totalCredits: number;
  totalStudents: number;
  description: string;
  status: string;
  specializations: string[];
}

export default function Curriculum() {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [entities, setEntities] = useState<Entity[]>([]);
  const [filteredEntities, setFilteredEntities] = useState<Entity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');

  // Load entity data and filter by user role
  useEffect(() => {
    const loadEntities = async () => {
      try {
        const response = await fetch('/entity.json');
        const data = await response.json();
        
        const entitiesToShow = filterInstitutionsByRole(data, authUser);
        
        setEntities(data);
        setFilteredEntities(entitiesToShow);
        
        if (entitiesToShow.length > 0) {
          setSelectedEntity(entitiesToShow[0].code);
        }
      } catch (error) {
        console.error('Error loading entities:', error);
      } finally {
        setLoading(false);
      }
    };
    loadEntities();
  }, [authUser]);

  // Load programs
  useEffect(() => {
    const loadPrograms = async () => {
      if (!selectedEntity) return;
      
      try {
        const response = await fetch('/program.json');
        const programData = await response.json();
        
        // All programs are under R2023 regulation
        const programsWithRegulation = programData.map((program: Program) => ({
          ...program,
          regulationYear: 'R-2023'
        }));
        
        setPrograms(programsWithRegulation);
        
      } catch (error) {
        console.error('Error loading programs:', error);
      }
    };
    
    loadPrograms();
  }, [selectedEntity]);

  const currentEntity = filteredEntities.find(e => e.code === selectedEntity);

  const handleCreateNew = () => {
    if (!canManageCurriculum(authUser)) return;
    navigate('/academics/curriculum/programs/create');
  };

  const handleProgramView = (programId: string) => {
    navigate(`/academics/curriculum/program-semester/${programId}`);
  };

  const handleEdit = (programId: string) => {
    if (!canManageCurriculum(authUser)) return;
    navigate(`/academics/curriculum/programs/${programId}/edit`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter programs based on search and filters
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || program.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || program.department === filterDepartment;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Get unique departments for filter
  const departments = [...new Set(programs.map(p => p.department))];

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading curriculum data...</div>;
  }

  // Handle case where user has no institution access
  if (filteredEntities.length === 0 && authUser?.role !== 'super-admin') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Academic Programs</h1>
            <p className="text-muted-foreground mt-2">Access restricted to your institution</p>
          </div>
        </div>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Building className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900">Access Restricted</h3>
                <p className="text-red-700 mt-1">
                  You don't have access to any institution's curriculum data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Academic Programs</h1>
          <div className="mt-2 space-y-1">
            <p className="text-muted-foreground">
              Manage academic programs under R-2023 regulation
            </p>
            <div className="flex items-center gap-2">
              <Badge variant={authUser?.role === 'super-admin' ? 'default' : 'secondary'}>
                {getRoleDisplayName(authUser?.role || '')} - {getRoleAccessDescription(authUser)}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                R-2023 Regulation
              </Badge>
              {isReadOnlyAccess(authUser) && (
                <Badge variant="outline">Read Only</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select 
            value={selectedEntity} 
            onValueChange={setSelectedEntity}
            disabled={filteredEntities.length <= 1}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select Institution" />
            </SelectTrigger>
            <SelectContent>
              {filteredEntities.map((entity) => (
                <SelectItem key={entity.code} value={entity.code}>
                  {entity.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {canManageCurriculum(authUser) && (
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Program
            </Button>
          )}
        </div>
      </div>

      {/* Institution Info Card */}
      {currentEntity && (
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-blue-600">Institution</p>
                <p className="text-xl font-bold text-blue-900">{currentEntity.name}</p>
                <p className="text-sm text-blue-600">Code: {currentEntity.code}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">Type & Authority</p>
                <p className="text-lg font-semibold text-green-900">{currentEntity.type}</p>
                <p className="text-sm text-green-600">{currentEntity.educationalAuthority}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-purple-600">Location</p>
                <p className="text-lg font-semibold text-purple-900">{currentEntity.district}</p>
                <p className="text-sm text-purple-600">{currentEntity.state}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-orange-600">Programs</p>
                <p className="text-lg font-semibold text-orange-900">{programs.length}</p>
                <p className="text-sm text-orange-600">Total programs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Programs</p>
                <p className="text-3xl font-bold text-blue-900">{programs.length}</p>
                <p className="text-xs text-blue-600">Available programs</p>
              </div>
              <School className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Programs</p>
                <p className="text-3xl font-bold text-green-900">
                  {programs.filter(p => p.status === 'active').length}
                </p>
                <p className="text-xs text-green-600">Currently running</p>
              </div>
              <GraduationCap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Students</p>
                <p className="text-3xl font-bold text-purple-900">
                  {programs.reduce((acc, p) => acc + p.totalStudents, 0)}
                </p>
                <p className="text-xs text-purple-600">Enrolled students</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Departments</p>
                <p className="text-3xl font-bold text-orange-900">{departments.length}</p>
                <p className="text-xs text-orange-600">Academic departments</p>
              </div>
              <Building className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search and Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Showing {filteredPrograms.length} of {programs.length} programs
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Programs Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-blue-600" />
                Academic Programs
              </CardTitle>
              <CardDescription>
                All academic programs under R-2023 regulation
              </CardDescription>
            </div>
            {canManageCurriculum(authUser) && (
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add Program
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program Code</TableHead>
                <TableHead>Program Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrograms.map((program) => (
                <TableRow key={program.id} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-sm font-medium">
                    {program.code}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{program.name}</p>
                      <p className="text-xs text-gray-500">{program.type}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {program.department}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{program.level}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span>{program.duration} years</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calculator className="h-3 w-3 text-gray-500" />
                      <span className="font-semibold">{program.totalCredits}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-gray-500" />
                      <span>{program.totalStudents}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(program.status)}>
                      {program.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleProgramView(program.id)}
                        className="h-8 px-3"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {canManageCurriculum(authUser) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(program.id)}
                          className="h-8 px-3"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredPrograms.length === 0 && (
            <div className="text-center py-8">
              <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No programs found matching your criteria</p>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your search or filter settings
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
