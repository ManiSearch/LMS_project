import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCheck, Shield, Plus, Edit, Trash2, Eye, Search, Filter, Users, Lock, Settings, ChevronRight } from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  module: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  description: string;
}

interface StaffRole {
  id: string;
  name: string;
  description: string;
  department: string;
  level: 'junior' | 'senior' | 'management' | 'executive';
  permissions: string[];
  userCount: number;
  status: 'active' | 'inactive';
  createdDate: string;
  maxUsers?: number;
  salary?: {
    min: number;
    max: number;
  };
}

export default function StaffRoles() {
  // View-based navigation state
  const [currentView, setCurrentView] = useState<
    'list' | 'create-role' | 'view-role' | 'edit-role'
  >('list');

  const [roles, setRoles] = useState<StaffRole[]>([
    {
      id: '1',
      name: 'Principal',
      description: 'Chief executive of the institution with full administrative authority',
      department: 'Administration',
      level: 'executive',
      permissions: ['admin_full', 'academic_manage', 'staff_manage', 'finance_manage'],
      userCount: 1,
      status: 'active',
      createdDate: '2024-01-15',
      maxUsers: 1,
      salary: { min: 80000, max: 120000 }
    },
    {
      id: '2',
      name: 'Vice Principal',
      description: 'Deputy head with administrative and academic oversight',
      department: 'Administration',
      level: 'executive',
      permissions: ['admin_manage', 'academic_manage', 'staff_read'],
      userCount: 2,
      status: 'active',
      createdDate: '2024-01-15',
      maxUsers: 3,
      salary: { min: 60000, max: 90000 }
    },
    {
      id: '3',
      name: 'Head of Department',
      description: 'Department head responsible for academic programs and faculty',
      department: 'Academic',
      level: 'management',
      permissions: ['academic_manage', 'curriculum_manage', 'faculty_manage'],
      userCount: 5,
      status: 'active',
      createdDate: '2024-01-20',
      maxUsers: 10,
      salary: { min: 45000, max: 70000 }
    },
    {
      id: '4',
      name: 'Senior Faculty',
      description: 'Experienced teaching staff with mentoring responsibilities',
      department: 'Academic',
      level: 'senior',
      permissions: ['teaching_full', 'student_manage', 'grade_manage'],
      userCount: 12,
      status: 'active',
      createdDate: '2024-01-25',
      maxUsers: 20,
      salary: { min: 35000, max: 55000 }
    },
    {
      id: '5',
      name: 'Junior Faculty',
      description: 'Teaching staff focused on instruction and student support',
      department: 'Academic',
      level: 'junior',
      permissions: ['teaching_basic', 'student_read', 'grade_update'],
      userCount: 25,
      status: 'active',
      createdDate: '2024-02-01',
      maxUsers: 50,
      salary: { min: 25000, max: 40000 }
    },
    {
      id: '6',
      name: 'Librarian',
      description: 'Library management and resource coordination',
      department: 'Support Services',
      level: 'senior',
      permissions: ['library_manage', 'resources_manage'],
      userCount: 2,
      status: 'active',
      createdDate: '2024-02-05',
      maxUsers: 5,
      salary: { min: 30000, max: 45000 }
    },
    {
      id: '7',
      name: 'Lab Assistant',
      description: 'Laboratory support and equipment maintenance',
      department: 'Support Services',
      level: 'junior',
      permissions: ['lab_manage', 'equipment_maintain'],
      userCount: 8,
      status: 'inactive',
      createdDate: '2024-02-10',
      maxUsers: 15,
      salary: { min: 20000, max: 30000 }
    }
  ]);

  const [permissions] = useState<Permission[]>([
    { id: 'admin_full', name: 'Full Administration', module: 'Admin', action: 'manage', description: 'Complete administrative access' },
    { id: 'admin_manage', name: 'Administration Management', module: 'Admin', action: 'manage', description: 'Manage administrative functions' },
    { id: 'academic_manage', name: 'Academic Management', module: 'Academic', action: 'manage', description: 'Manage academic programs' },
    { id: 'staff_manage', name: 'Staff Management', module: 'Staff', action: 'manage', description: 'Manage staff and roles' },
    { id: 'staff_read', name: 'Staff View', module: 'Staff', action: 'read', description: 'View staff information' },
    { id: 'finance_manage', name: 'Finance Management', module: 'Finance', action: 'manage', description: 'Manage financial operations' },
    { id: 'curriculum_manage', name: 'Curriculum Management', module: 'Academic', action: 'manage', description: 'Manage curriculum and courses' },
    { id: 'faculty_manage', name: 'Faculty Management', module: 'Faculty', action: 'manage', description: 'Manage faculty assignments' },
    { id: 'teaching_full', name: 'Full Teaching Access', module: 'Teaching', action: 'manage', description: 'Complete teaching functionality' },
    { id: 'teaching_basic', name: 'Basic Teaching Access', module: 'Teaching', action: 'update', description: 'Basic teaching functions' },
    { id: 'student_manage', name: 'Student Management', module: 'Student', action: 'manage', description: 'Manage student records' },
    { id: 'student_read', name: 'Student View', module: 'Student', action: 'read', description: 'View student information' },
    { id: 'grade_manage', name: 'Grade Management', module: 'Grades', action: 'manage', description: 'Manage student grades' },
    { id: 'grade_update', name: 'Grade Update', module: 'Grades', action: 'update', description: 'Update student grades' },
    { id: 'library_manage', name: 'Library Management', module: 'Library', action: 'manage', description: 'Manage library resources' },
    { id: 'resources_manage', name: 'Resource Management', module: 'Resources', action: 'manage', description: 'Manage institutional resources' },
    { id: 'lab_manage', name: 'Lab Management', module: 'Laboratory', action: 'manage', description: 'Manage laboratory operations' },
    { id: 'equipment_maintain', name: 'Equipment Maintenance', module: 'Equipment', action: 'update', description: 'Maintain equipment' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('roles');
  const [selectedRole, setSelectedRole] = useState<StaffRole | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Navigation helper functions
  const goToView = (view: typeof currentView) => {
    setCurrentView(view);
  };

  const goBack = () => {
    setCurrentView('list');
    setSelectedRole(null);
    resetForm();
  };

  // Form state
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    department: '',
    level: 'junior',
    permissions: [] as string[],
    maxUsers: '',
    salaryMin: '',
    salaryMax: ''
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'executive': return 'bg-purple-100 text-purple-800';
      case 'management': return 'bg-blue-100 text-blue-800';
      case 'senior': return 'bg-green-100 text-green-800';
      case 'junior': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || role.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || role.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const departments = [...new Set(roles.map(role => role.department))];

  const stats = {
    totalRoles: roles.length,
    activeRoles: roles.filter(r => r.status === 'active').length,
    totalUsers: roles.reduce((sum, r) => sum + r.userCount, 0),
    departments: departments.length
  };

  // CRUD Operations
  const handleCreateRole = () => {
    const newRole: StaffRole = {
      id: Date.now().toString(),
      ...roleForm,
      permissions: roleForm.permissions,
      userCount: 0,
      status: 'active',
      createdDate: new Date().toISOString().split('T')[0],
      maxUsers: roleForm.maxUsers ? parseInt(roleForm.maxUsers) : undefined,
      salary: roleForm.salaryMin && roleForm.salaryMax ? {
        min: parseInt(roleForm.salaryMin),
        max: parseInt(roleForm.salaryMax)
      } : undefined
    };

    setRoles([...roles, newRole]);
    goBack();
  };

  const handleEditRole = () => {
    if (selectedRole) {
      const updatedRole = {
        ...selectedRole,
        ...roleForm,
        permissions: roleForm.permissions,
        maxUsers: roleForm.maxUsers ? parseInt(roleForm.maxUsers) : undefined,
        salary: roleForm.salaryMin && roleForm.salaryMax ? {
          min: parseInt(roleForm.salaryMin),
          max: parseInt(roleForm.salaryMax)
        } : undefined
      };

      setRoles(roles.map(r => r.id === selectedRole.id ? updatedRole : r));
      goBack();
    }
  };

  const handleDeleteRole = () => {
    if (selectedRole) {
      setRoles(roles.filter(r => r.id !== selectedRole.id));
      setSelectedRole(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openEditPage = (role: StaffRole) => {
    setSelectedRole(role);
    setRoleForm({
      name: role.name,
      description: role.description,
      department: role.department,
      level: role.level,
      permissions: [...role.permissions],
      maxUsers: role.maxUsers?.toString() || '',
      salaryMin: role.salary?.min.toString() || '',
      salaryMax: role.salary?.max.toString() || ''
    });
    setCurrentView('edit-role');
  };

  const openViewPage = (role: StaffRole) => {
    setSelectedRole(role);
    setCurrentView('view-role');
  };

  const resetForm = () => {
    setRoleForm({
      name: '',
      description: '',
      department: '',
      level: 'junior',
      permissions: [],
      maxUsers: '',
      salaryMin: '',
      salaryMax: ''
    });
  };

  const togglePermission = (permissionId: string) => {
    setRoleForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  // Create Role Page
  const renderCreateRolePage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={goBack}>
            <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Roles
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Staff Role</h1>
            <p className="text-muted-foreground mt-2">
              Define a new staff role with specific permissions and access levels
            </p>
          </div>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Role Information</CardTitle>
          <CardDescription>Enter the basic details for the new role</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role-name">Role Name</Label>
              <Input
                id="role-name"
                value={roleForm.name}
                onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                placeholder="Senior Faculty"
              />
            </div>
            <div>
              <Label htmlFor="role-department">Department</Label>
              <Select value={roleForm.department} onValueChange={(value) => setRoleForm({ ...roleForm, department: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administration">Administration</SelectItem>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Support Services">Support Services</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role-level">Role Level</Label>
              <Select value={roleForm.level} onValueChange={(value) => setRoleForm({ ...roleForm, level: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="role-max-users">Max Users</Label>
              <Input
                id="role-max-users"
                type="number"
                value={roleForm.maxUsers}
                onChange={(e) => setRoleForm({ ...roleForm, maxUsers: e.target.value })}
                placeholder="10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="role-description">Description</Label>
            <Textarea
              id="role-description"
              value={roleForm.description}
              onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
              placeholder="Role description and responsibilities"
              rows={3}
            />
          </div>
          <div>
            <Label>Permissions</Label>
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
              {permissions.map((permission) => (
                <div key={permission.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission.id}
                    checked={roleForm.permissions.includes(permission.id)}
                    onCheckedChange={() => togglePermission(permission.id)}
                  />
                  <Label htmlFor={permission.id} className="text-sm">
                    {permission.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between">
            <Button variant="outline" onClick={goBack}>
              Cancel
            </Button>
            <Button onClick={handleCreateRole} disabled={!roleForm.name || !roleForm.department}>
              Create Role
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  // View Role Page
  const renderViewRolePage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={goBack}>
            <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Roles
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{selectedRole?.name}</h1>
            <p className="text-muted-foreground mt-2">
              Role details and permissions overview
            </p>
          </div>
        </div>
        <Button onClick={() => setCurrentView('edit-role')}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Role
        </Button>
      </div>

      {selectedRole && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Department</Label>
                  <p className="text-sm">{selectedRole.department}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Level</Label>
                  <Badge className={getLevelColor(selectedRole.level)}>
                    {selectedRole.level}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Description</Label>
                <p className="text-sm mt-1">{selectedRole.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Current Users</Label>
                  <p className="text-sm">{selectedRole.userCount}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Max Users</Label>
                  <p className="text-sm">{selectedRole.maxUsers || 'Unlimited'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <Badge className={getStatusColor(selectedRole.status)}>
                    {selectedRole.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Created Date</Label>
                  <p className="text-sm">{selectedRole.createdDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedRole.permissions.map((permId) => {
                  const permission = permissions.find(p => p.id === permId);
                  return permission ? (
                    <div key={permId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">{permission.name}</h4>
                        <p className="text-xs text-gray-600">{permission.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {permission.module}
                        </Badge>
                        <Badge variant="outline" className={
                          permission.action === 'manage' ? 'bg-red-50 text-red-700' :
                          permission.action === 'update' ? 'bg-yellow-50 text-yellow-700' :
                          'bg-green-50 text-green-700'
                        }>
                          {permission.action}
                        </Badge>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // Edit Role Page
  const renderEditRolePage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={goBack}>
            <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Roles
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Staff Role</h1>
            <p className="text-muted-foreground mt-2">
              Update role information and permissions for {selectedRole?.name}
            </p>
          </div>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Role Details</CardTitle>
          <CardDescription>Update the role information and permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-role-name">Role Name</Label>
              <Input
                id="edit-role-name"
                value={roleForm.name}
                onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-role-department">Department</Label>
              <Select value={roleForm.department} onValueChange={(value) => setRoleForm({ ...roleForm, department: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administration">Administration</SelectItem>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Support Services">Support Services</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-role-level">Role Level</Label>
              <Select value={roleForm.level} onValueChange={(value) => setRoleForm({ ...roleForm, level: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-role-max-users">Max Users</Label>
              <Input
                id="edit-role-max-users"
                type="number"
                value={roleForm.maxUsers}
                onChange={(e) => setRoleForm({ ...roleForm, maxUsers: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="edit-role-description">Description</Label>
            <Textarea
              id="edit-role-description"
              value={roleForm.description}
              onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
              rows={3}
            />
          </div>
          <div>
            <Label>Permissions</Label>
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
              {permissions.map((permission) => (
                <div key={permission.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-${permission.id}`}
                    checked={roleForm.permissions.includes(permission.id)}
                    onCheckedChange={() => togglePermission(permission.id)}
                  />
                  <Label htmlFor={`edit-${permission.id}`} className="text-sm">
                    {permission.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between">
            <Button variant="outline" onClick={goBack}>
              Cancel
            </Button>
            <Button onClick={handleEditRole}>
              Update Role
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  // Handle view-based navigation
  if (currentView === 'create-role') {
    return renderCreateRolePage();
  }

  if (currentView === 'view-role') {
    return renderViewRolePage();
  }

  if (currentView === 'edit-role') {
    return renderEditRolePage();
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Roles</h1>
          <p className="text-muted-foreground mt-2">
            Define and manage staff roles, permissions, and access levels.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            onClick={() => {
              resetForm();
              setCurrentView('create-role');
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Role
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Roles</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalRoles}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Roles</p>
                <p className="text-3xl font-bold text-green-900">{stats.activeRoles}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Users</p>
                <p className="text-3xl font-bold text-purple-900">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Departments</p>
                <p className="text-3xl font-bold text-orange-900">{stats.departments}</p>
              </div>
              <Settings className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterDepartment} onValueChange={setFilterDepartment}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="roles">Staff Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-4 font-medium">Role</th>
                      <th className="text-left p-4 font-medium">Department</th>
                      <th className="text-left p-4 font-medium">Level</th>
                      <th className="text-left p-4 font-medium">Users</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      {/* <th className="text-left p-4 font-medium">Salary Range</th> */}
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRoles.map((role) => (
                      <tr key={role.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <Shield className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">{role.name}</div>
                              <div className="text-sm text-gray-500 max-w-xs truncate">
                                {role.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm">{role.department}</span>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={getLevelColor(role.level)}>
                            {role.level}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <span className="font-medium">{role.userCount}</span>
                            {role.maxUsers && <span className="text-gray-500">/{role.maxUsers}</span>}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={getStatusColor(role.status)}>
                            {role.status}
                          </Badge>
                        </td>
                        {/* <td className="p-4">
                          <div className="text-sm">
                            {role.salary ? 
                              `$${role.salary.min.toLocaleString()} - $${role.salary.max.toLocaleString()}` :
                              'Not specified'
                            }
                          </div>
                        </td> */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openViewPage(role)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditPage(role)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRole(role);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredRoles.length === 0 && (
                  <div className="text-center py-12">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No roles found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Permissions</CardTitle>
              <CardDescription>Available permissions in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <Lock className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{permission.name}</h3>
                        <p className="text-sm text-gray-500">{permission.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {permission.module}
                      </Badge>
                      <Badge variant="outline" className={
                        permission.action === 'manage' ? 'bg-red-50 text-red-700' :
                        permission.action === 'update' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-green-50 text-green-700'
                      }>
                        {permission.action}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Old dialog components removed - now using page-based navigation */}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the role
              "{selectedRole?.name}" and may affect users assigned to this role.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRole} className="bg-red-600 hover:bg-red-700">
              Delete Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
