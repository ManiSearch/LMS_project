import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Settings, Shield, Lock, Unlock, Users, Eye, Edit, Trash2, Plus, CheckCircle, XCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

interface PermissionData {
  id: string;
  module: string;
  permission: string;
  admin: boolean;
  faculty: boolean;
  student: boolean;
  parent: boolean;
  locked: boolean;
  canOverride: boolean;
}

type ViewType = 'list' | 'configure-role';

const initialPermissions: PermissionData[] = [
  { id: '1', module: 'Core System', permission: 'View', admin: true, faculty: false, student: false, parent: false, locked: true, canOverride: true },
  { id: '2', module: 'Core System', permission: 'Create', admin: true, faculty: false, student: false, parent: false, locked: true, canOverride: true },
  { id: '3', module: 'Core System', permission: 'Edit', admin: true, faculty: false, student: false, parent: false, locked: true, canOverride: true },
  { id: '4', module: 'Core System', permission: 'Delete', admin: true, faculty: false, student: false, parent: false, locked: true, canOverride: true },
  { id: '5', module: 'Academics', permission: 'View', admin: true, faculty: true, student: true, parent: true, locked: false, canOverride: true },
  { id: '6', module: 'Academics', permission: 'Create', admin: true, faculty: true, student: false, parent: false, locked: false, canOverride: true },
  { id: '7', module: 'Academics', permission: 'Edit', admin: true, faculty: true, student: false, parent: false, locked: false, canOverride: true },
  { id: '8', module: 'Academics', permission: 'Delete', admin: true, faculty: false, student: false, parent: false, locked: true, canOverride: true },
  { id: '9', module: 'LMS', permission: 'View', admin: true, faculty: true, student: true, parent: false, locked: false, canOverride: true },
  { id: '10', module: 'LMS', permission: 'Create', admin: true, faculty: true, student: false, parent: false, locked: false, canOverride: true },
  { id: '11', module: 'LMS', permission: 'Edit', admin: true, faculty: true, student: false, parent: false, locked: false, canOverride: true },
  { id: '12', module: 'LMS', permission: 'Delete', admin: true, faculty: false, student: false, parent: false, locked: true, canOverride: true },
  { id: '13', module: 'Examinations', permission: 'View', admin: true, faculty: true, student: true, parent: true, locked: false, canOverride: true },
  { id: '14', module: 'Examinations', permission: 'Create', admin: true, faculty: true, student: false, parent: false, locked: false, canOverride: true },
  { id: '15', module: 'Examinations', permission: 'Edit', admin: true, faculty: true, student: false, parent: false, locked: false, canOverride: true },
  { id: '16', module: 'Examinations', permission: 'Delete', admin: true, faculty: false, student: false, parent: false, locked: true, canOverride: true }
];

const roleStats = [
  { role: 'Admin', permissions: 16, modules: 4, color: 'text-red-600' },
  { role: 'Faculty', permissions: 12, modules: 3, color: 'text-blue-600' },
  { role: 'Student', permissions: 4, modules: 3, color: 'text-green-600' },
  { role: 'Parent', permissions: 2, modules: 2, color: 'text-purple-600' }
];

export default function Permissions() {
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [permissions, setPermissions] = useState<PermissionData[]>(initialPermissions);
  const [selectedPermission, setSelectedPermission] = useState<PermissionData | null>(null);
  const [isPermissionOverrideModalOpen, setIsPermissionOverrideModalOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, Partial<PermissionData>>>({});

  const handleLockToggle = (permissionId: string) => {
    const permission = permissions.find(p => p.id === permissionId);
    if (!permission) return;

    if (permission.locked && permission.canOverride) {
      // If locked and can override, open override modal
      setSelectedPermission(permission);
      setIsPermissionOverrideModalOpen(true);
    } else {
      // Toggle lock state directly
      setPermissions(prev => prev.map(p =>
        p.id === permissionId ? { ...p, locked: !p.locked } : p
      ));
    }
  };

  const handlePermissionToggle = (permissionId: string, role: 'admin' | 'faculty' | 'student' | 'parent') => {
    const permission = permissions.find(p => p.id === permissionId);
    if (permission?.locked) return; // Cannot change if locked

    setPermissions(prev => prev.map(p =>
      p.id === permissionId ? { ...p, [role]: !p[role] } : p
    ));
  };

  const handleOverridePermission = () => {
    if (!selectedPermission) return;

    setPermissions(prev => prev.map(p =>
      p.id === selectedPermission.id ? { ...p, locked: false } : p
    ));

    setIsPermissionOverrideModalOpen(false);
    setSelectedPermission(null);
  };

  const handleConfigureRole = () => {
    setCurrentView('configure-role');
  };

  const getPermissionStats = () => {
    const stats = {
      totalPermissions: permissions.length,
      lockedPermissions: permissions.filter(p => p.locked).length,
      activeOverrides: Object.keys(pendingChanges).length
    };
    return stats;
  };

  const stats = getPermissionStats();

  const renderConfigureRoleView = () => (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => setCurrentView('list')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Permission Management
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configure Role Permissions
          </CardTitle>
          <CardDescription>
            Advanced role configuration with detailed permission management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1">
                <h3 className="font-semibold mb-3">Permission Statistics</h3>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Permissions</span>
                      <Badge variant="default">{stats.totalPermissions}</Badge>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Locked Permissions</span>
                      <Badge variant="destructive">{stats.lockedPermissions}</Badge>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Override Available</span>
                      <Badge variant="secondary">{permissions.filter(p => p.canOverride).length}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <h3 className="font-semibold mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => {
                      setPermissions(prev => prev.map(p => ({ ...p, locked: false })));
                    }}
                  >
                    <Unlock className="h-4 w-4" />
                    Unlock All
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => {
                      setPermissions(prev => prev.map(p => ({ ...p, locked: true })));
                    }}
                  >
                    <Lock className="h-4 w-4" />
                    Lock All
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Apply Template
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Reset Default
                  </Button>
                </div>
              </div>
            </div>

            {/* Advanced Role Configuration */}
            <div className="space-y-4">
              <h3 className="font-semibold">Advanced Role Configuration</h3>
              
              {/* Role-specific Permission Management */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {roleStats.map((role) => (
                  <Card key={role.role} className="border">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        <span className={role.color}>{role.role} Role</span>
                        <Badge variant="outline">{role.permissions} permissions</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Modules:</span>
                          <span className="ml-2 font-medium">{role.modules}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Permissions:</span>
                          <span className="ml-2 font-medium">{role.permissions}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Module Access Control</span>
                          <Switch defaultChecked={role.role !== 'Student'} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Advanced Features</span>
                          <Switch defaultChecked={['Admin', 'Faculty'].includes(role.role)} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Export Capabilities</span>
                          <Switch defaultChecked={role.role === 'Admin'} />
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Button size="sm" variant="outline" className="w-full">
                          Configure {role.role} Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Permission Matrix for Configure View */}
            <div className="space-y-4">
              <h3 className="font-semibold">Permission Matrix</h3>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Module</TableHead>
                      <TableHead>Permission</TableHead>
                      <TableHead className="text-center">Admin</TableHead>
                      <TableHead className="text-center">Faculty</TableHead>
                      <TableHead className="text-center">Student</TableHead>
                      <TableHead className="text-center">Parent</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.map((perm) => (
                      <TableRow key={perm.id}>
                        <TableCell className="font-medium">{perm.module}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {perm.permission === 'View' && <Eye className="h-3 w-3" />}
                            {perm.permission === 'Create' && <Users className="h-3 w-3" />}
                            {perm.permission === 'Edit' && <Edit className="h-3 w-3" />}
                            {perm.permission === 'Delete' && <Trash2 className="h-3 w-3" />}
                            {perm.permission}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={perm.admin}
                            onCheckedChange={() => handlePermissionToggle(perm.id, 'admin')}
                            disabled={perm.locked}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={perm.faculty}
                            onCheckedChange={() => handlePermissionToggle(perm.id, 'faculty')}
                            disabled={perm.locked}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={perm.student}
                            onCheckedChange={() => handlePermissionToggle(perm.id, 'student')}
                            disabled={perm.locked}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={perm.parent}
                            onCheckedChange={() => handlePermissionToggle(perm.id, 'parent')}
                            disabled={perm.locked}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLockToggle(perm.id)}
                              className={`transition-colors duration-200 ${
                                perm.locked
                                  ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                                  : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                              }`}
                              title={perm.locked ? 'Locked - Click to override' : 'Unlocked - Click to lock'}
                            >
                              {perm.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                            </Button>
                            {perm.canOverride && perm.locked && (
                              <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                                Override
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setCurrentView('list')}>
              Cancel
            </Button>
            <Button onClick={() => setCurrentView('list')}>
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderListView = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Permission Management</h1>
          <p className="text-muted-foreground mt-2">
            Configure role-based access control and system permissions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleConfigureRole}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-blue-600"
          >
            <Settings className="h-4 w-4 mr-2" />
            Configure Role
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Admin</p>
              <p className="text-3xl font-bold text-red-900">16</p>
              <p className="text-xs text-red-600">permissions across 4 modules</p>
            </div>
            <Shield className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="stat-card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Faculty</p>
              <p className="text-3xl font-bold text-blue-900">12</p>
              <p className="text-xs text-blue-600">permissions across 3 modules</p>
            </div>
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="stat-card bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Student</p>
              <p className="text-3xl font-bold text-green-900">4</p>
              <p className="text-xs text-green-600">permissions across 3 modules</p>
            </div>
            <Shield className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="stat-card bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Parent</p>
              <p className="text-3xl font-bold text-purple-900">2</p>
              <p className="text-xs text-purple-600">permissions across 2 modules</p>
            </div>
            <Shield className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="section-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Shield className="h-5 w-5" />
              </div>
              Permission Overview
            </CardTitle>
            <CardDescription>
              Summary of permissions by module and role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Core System', 'Academics', 'LMS', 'Examinations'].map((module) => (
                <div key={module} className="space-y-2">
                  <h4 className="font-medium">{module}</h4>
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <div className="text-center">
                      <Badge variant="destructive" className="w-full">Admin</Badge>
                    </div>
                    <div className="text-center">
                      <Badge variant={module === 'Core System' ? 'secondary' : 'default'} className="w-full">Faculty</Badge>
                    </div>
                    <div className="text-center">
                      <Badge variant={module === 'Core System' ? 'secondary' : 'default'} className="w-full">Student</Badge>
                    </div>
                    <div className="text-center">
                      <Badge variant={['Core System', 'LMS'].includes(module) ? 'secondary' : 'default'} className="w-full">Parent</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="section-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <Lock className="h-5 w-5" />
              </div>
              Security Settings
            </CardTitle>
            <CardDescription>
              System-wide security and access configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Two-Factor Authentication</div>
                  <div className="text-xs text-muted-foreground">Require 2FA for admin users</div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Session Timeout</div>
                  <div className="text-xs text-muted-foreground">Auto-logout after inactivity</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Audit Logging</div>
                  <div className="text-xs text-muted-foreground">Track all user actions</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">IP Restrictions</div>
                  <div className="text-xs text-muted-foreground">Limit access by IP address</div>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="section-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Users className="h-5 w-5" />
            </div>
            Detailed Permission Matrix
          </CardTitle>
          <CardDescription>
            Configure specific permissions for each role and module
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module</TableHead>
                <TableHead>Permission</TableHead>
                <TableHead className="text-center">Admin</TableHead>
                <TableHead className="text-center">Faculty</TableHead>
                <TableHead className="text-center">Student</TableHead>
                <TableHead className="text-center">Parent</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((perm, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{perm.module}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {perm.permission === 'View' && <Eye className="h-3 w-3" />}
                      {perm.permission === 'Create' && <Users className="h-3 w-3" />}
                      {perm.permission === 'Edit' && <Edit className="h-3 w-3" />}
                      {perm.permission === 'Delete' && <Trash2 className="h-3 w-3" />}
                      {perm.permission}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={perm.admin}
                      onCheckedChange={() => handlePermissionToggle(perm.id, 'admin')}
                      disabled={perm.locked}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={perm.faculty}
                      onCheckedChange={() => handlePermissionToggle(perm.id, 'faculty')}
                      disabled={perm.locked}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={perm.student}
                      onCheckedChange={() => handlePermissionToggle(perm.id, 'student')}
                      disabled={perm.locked}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={perm.parent}
                      onCheckedChange={() => handlePermissionToggle(perm.id, 'parent')}
                      disabled={perm.locked}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLockToggle(perm.id)}
                        className={`transition-colors duration-200 ${
                          perm.locked
                            ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                            : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                        }`}
                        title={perm.locked ? 'Locked - Click to override' : 'Unlocked - Click to lock'}
                      >
                        {perm.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      </Button>
                      {perm.canOverride && perm.locked && (
                        <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                          Override
                        </Badge>
                      )}
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
  if (currentView === 'configure-role') {
    return renderConfigureRoleView();
  }

  return (
    <>
      {renderListView()}

      {/* Permission Override Dialog */}
      <AlertDialog open={isPermissionOverrideModalOpen} onOpenChange={setIsPermissionOverrideModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Override Permission Lock
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to override the lock on "{selectedPermission?.module} - {selectedPermission?.permission}" permission.
              This will allow modifications to role assignments. Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleOverridePermission}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Override Lock
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
