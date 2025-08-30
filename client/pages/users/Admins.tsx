import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Plus, Search, Mail, Phone, Edit, Trash2, Eye, Users, Activity, Clock, Filter, Download, ArrowLeft } from 'lucide-react';

interface Admin {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: string;
  lastLogin: string;
  avatar: string;
  permissions: string[];
  createdDate: string;
  notes: string;
}

type ViewType = 'list' | 'add' | 'edit' | 'view';

const initialAdmins: Admin[] = [
  { 
    id: 1, 
    name: 'Jeeva', 
    email: 'jeeva@gmail.com', 
    phone: '+91 9123456701', 
    role: 'Super Admin', 
    department: 'Administration', 
    status: 'Active',
    lastLogin: '2024-01-15 09:30 AM',
    avatar: '',
    permissions: ['All Permissions'],
    createdDate: '2023-01-15',
    notes: 'Primary system administrator with full access.'
  },
  { 
    id: 2, 
    name: 'Anitha', 
    email: 'anitha@gmail.com', 
    phone: '+91 9123456704', 
    role: 'Admin', 
    department: 'Academic Affairs', 
    status: 'Active',
    lastLogin: '2024-01-15 08:45 AM',
    avatar: '',
    permissions: ['Academic Management', 'Student Records', 'Reports'],
    createdDate: '2023-03-20',
    notes: 'Manages academic operations and student affairs.'
  },
  { 
    id: 3, 
    name: 'Ajay', 
    email: 'ajay.raj@gmail.com', 
    phone: '+91 9123456707', 
    role: 'Admin', 
    department: 'Student Affairs', 
    status: 'Active',
    lastLogin: '2024-01-14 04:20 PM',
    avatar: '',
    permissions: ['Student Management', 'Attendance', 'Notifications'],
    createdDate: '2023-05-10',
    notes: 'Handles student enrollment and daily operations.'
  },
  { 
    id: 4, 
    name: 'Janani', 
    email: 'janani.pavi@gmail.com', 
    phone: '+91 9123456710', 
    role: 'Admin', 
    department: 'Finance', 
    status: 'Inactive',
    lastLogin: '2024-01-10 02:15 PM',
    avatar: '',
    permissions: ['Financial Management', 'Fee Collection', 'Reports'],
    createdDate: '2023-02-28',
    notes: 'Currently on leave. Responsible for financial operations.'
  }
];

const departments = ['Administration', 'Academic Affairs', 'Student Affairs', 'Finance', 'IT Department', 'Human Resources'];
const roles = ['Super Admin', 'Admin', 'Manager', 'Coordinator'];
const permissionOptions = ['All Permissions', 'Academic Management', 'Student Records', 'Financial Management', 'User Management', 'Reports', 'System Settings', 'Notifications', 'Attendance', 'Fee Collection', 'Student Management'];

export default function Admins() {
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    status: 'Active',
    permissions: [] as string[],
    notes: ''
  });

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || admin.status.toLowerCase() === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || admin.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const stats = {
    total: admins.length,
    active: admins.filter(a => a.status === 'Active').length,
    superAdmins: admins.filter(a => a.role === 'Super Admin').length,
    departments: new Set(admins.map(a => a.department)).size,
    activeSessions: admins.filter(a => a.status === 'Active').length
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      status: 'Active',
      permissions: [],
      notes: ''
    });
  };

  const handleCreate = () => {
    const newAdmin: Admin = {
      id: Math.max(...admins.map(a => a.id)) + 1,
      ...formData,
      avatar: '',
      lastLogin: 'Never',
      createdDate: new Date().toISOString().split('T')[0]
    };
    setAdmins([...admins, newAdmin]);
    setCurrentView('list');
    resetForm();
  };

  const handleEdit = () => {
    if (selectedAdmin) {
      setAdmins(admins.map(admin => 
        admin.id === selectedAdmin.id 
          ? { ...admin, ...formData }
          : admin
      ));
      setCurrentView('list');
      setSelectedAdmin(null);
      resetForm();
    }
  };

  const handleDelete = (adminId: number) => {
    setAdmins(admins.filter(admin => admin.id !== adminId));
  };

  const openAddView = () => {
    resetForm();
    setCurrentView('add');
  };

  const openEditView = (admin: Admin) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
      department: admin.department,
      status: admin.status,
      permissions: admin.permissions,
      notes: admin.notes
    });
    setCurrentView('edit');
  };

  const openViewDetails = (admin: Admin) => {
    setSelectedAdmin(admin);
    setCurrentView('view');
  };

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Role', 'Department', 'Status', 'Last Login', 'Created Date', 'Permissions', 'Notes'].join(','),
      ...filteredAdmins.map(admin => [
        admin.name,
        admin.email,
        admin.phone,
        admin.role,
        admin.department,
        admin.status,
        admin.lastLogin,
        admin.createdDate,
        admin.permissions.join('; '),
        admin.notes.replace(/,/g, ';')
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `administrators_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        permissions: [...prev.permissions, permission]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(p => p !== permission)
      }));
    }
  };

  const renderAddView = () => (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => setCurrentView('list')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Administrator Management
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Administrator</CardTitle>
          <CardDescription>
            Create a new administrator account with appropriate permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional notes or comments"
                  rows={3}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="permissions" className="space-y-4">
              <div>
                <Label>System Permissions</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {permissionOptions.map(permission => (
                    <div key={permission} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`create-${permission}`}
                        checked={formData.permissions.includes(permission)}
                        onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={`create-${permission}`} className="text-sm">
                        {permission}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setCurrentView('list')}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Administrator</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEditView = () => (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => setCurrentView('list')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Administrator Management
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Administrator</CardTitle>
          <CardDescription>
            Update administrator information and permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email Address</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-phone">Phone Number</Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-role">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-department">Department</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional notes or comments"
                  rows={3}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="permissions" className="space-y-4">
              <div>
                <Label>System Permissions</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {permissionOptions.map(permission => (
                    <div key={permission} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`edit-${permission}`}
                        checked={formData.permissions.includes(permission)}
                        onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={`edit-${permission}`} className="text-sm">
                        {permission}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setCurrentView('list')}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Update Administrator</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderViewDetails = () => (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => setCurrentView('list')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Administrator Management
        </Button>
      </div>

      {selectedAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Administrator Details</CardTitle>
            <CardDescription>
              View complete administrator information and permissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedAdmin.avatar} />
                  <AvatarFallback className="text-lg">
                    {selectedAdmin.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedAdmin.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedAdmin.role} • {selectedAdmin.department}</p>
                  <Badge variant={selectedAdmin.status === 'Active' ? 'default' : 'secondary'} className="mt-1">
                    {selectedAdmin.status}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">EMAIL</Label>
                  <div className="flex items-center gap-1 mt-1">
                    <Mail className="h-3 w-3" />
                    {selectedAdmin.email}
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">PHONE</Label>
                  <div className="flex items-center gap-1 mt-1">
                    <Phone className="h-3 w-3" />
                    {selectedAdmin.phone}
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">LAST LOGIN</Label>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    {selectedAdmin.lastLogin}
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">CREATED</Label>
                  <div className="mt-1">
                    {selectedAdmin.createdDate}
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-xs font-medium text-muted-foreground">PERMISSIONS</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedAdmin.permissions.map(permission => (
                    <Badge key={permission} variant="outline" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {selectedAdmin.notes && (
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">NOTES</Label>
                  <p className="text-sm mt-1 p-3 bg-muted rounded-md">
                    {selectedAdmin.notes}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Administrator Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage administrative users, their roles, and access permissions.
          </p>
        </div>
        <Button className="btn-primary" onClick={openAddView}>
          <Plus className="h-4 w-4 mr-2" />
          Add Admin
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Admins</p>
              <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              <p className="text-xs text-blue-600">{stats.active} active administrators</p>
            </div>
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Super Admins</p>
              <p className="text-3xl font-bold text-green-900">{stats.superAdmins}</p>
              <p className="text-xs text-green-600">Full system access</p>
            </div>
            <Shield className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Departments</p>
              <p className="text-3xl font-bold text-purple-900">{stats.departments}</p>
              <p className="text-xs text-purple-600">Admin departments</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Active Sessions</p>
              <p className="text-3xl font-bold text-orange-900">{stats.activeSessions}</p>
              <p className="text-xs text-orange-600">Currently logged in</p>
            </div>
            <Activity className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      <Card className="section-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Shield className="h-5 w-5" />
            </div>
            Administrator Directory
          </CardTitle>
          <CardDescription>
            View and manage all system administrators
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search administrators..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Administrator</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={admin.avatar} />
                        <AvatarFallback>{admin.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{admin.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {admin.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {admin.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {admin.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={admin.role === 'Super Admin' ? 'default' : 'secondary'}>
                      {admin.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{admin.department}</TableCell>
                  <TableCell className="text-sm">{admin.lastLogin}</TableCell>
                  <TableCell>
                    <Badge variant={admin.status === 'Active' ? 'default' : 'secondary'}>
                      {admin.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openViewDetails(admin)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openEditView(admin)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Administrator</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {admin.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(admin.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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

  // Main render logic
  if (currentView === 'add') {
    return renderAddView();
  }

  if (currentView === 'edit') {
    return renderEditView();
  }

  if (currentView === 'view') {
    return renderViewDetails();
  }

  return renderListView();
}
