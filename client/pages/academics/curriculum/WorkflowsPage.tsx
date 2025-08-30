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
import {
  ArrowLeft, Plus, Search, Edit, Trash2, GitBranch, 
  Eye, Calendar, Users, CheckCircle, AlertCircle, FileText,
  Clock, Target, MessageSquare, Upload
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function WorkflowsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');

  // If creating or editing, redirect to form page
  if (id === 'create' || (id && id.includes('edit'))) {
    const WorkflowFormPage = React.lazy(() => import('./WorkflowFormPage'));
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <WorkflowFormPage />
      </Suspense>
    );
  }

  // Mock data - replace with actual API calls
  const workflows = [
    {
      id: 1,
      title: 'AI & ML Curriculum Update',
      program: 'B.Tech CSE',
      stage: 'Gap Analysis',
      status: 'In Progress',
      initiator: 'Dr.Manikandan',
      priority: 'High',
      dueDate: '2024-02-15',
      description: 'Comprehensive update to include latest AI and ML technologies',
      progress: 30,
      comments: 12,
      attachments: 5
    },
    {
      id: 2,
      title: 'Elective Basket Revision',
      program: 'B.Tech ECE',
      stage: 'Faculty Review',
      status: 'Pending',
      initiator: 'Prof.Kumar',
      priority: 'Medium',
      dueDate: '2024-02-20',
      description: 'Review and update elective subject offerings',
      progress: 60,
      comments: 8,
      attachments: 3
    },
    {
      id: 3,
      title: 'Lab Curriculum Restructure',
      program: 'B.Tech CSE',
      stage: 'Department Head Approval',
      status: 'In Progress',
      initiator: 'Dr. Meenakshi',
      priority: 'High',
      dueDate: '2024-03-01',
      description: 'Restructure lab curriculum to include modern tools',
      progress: 80,
      comments: 15,
      attachments: 7
    }
  ];

  const stages = [
    { name: 'Gap Analysis', count: 2, color: 'blue' },
    { name: 'Faculty Review', count: 3, color: 'yellow' },
    { name: 'Committee Review', count: 1, color: 'purple' },
    { name: 'Department Head Approval', count: 2, color: 'green' },
    { name: 'Final Approval', count: 1, color: 'gray' }
  ];

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.program.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || workflow.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesStage = stageFilter === 'all' || workflow.stage.toLowerCase() === stageFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesStage;
  });

  const handleApprove = (workflowId: number) => {
    console.log('Approving workflow:', workflowId);
  };

  const handleReject = (workflowId: number) => {
    console.log('Rejecting workflow:', workflowId);
  };

  // If viewing a specific workflow
  if (id) {
    const workflow = workflows.find(w => w.id === parseInt(id));
    if (!workflow) {
      return <div>Workflow not found</div>;
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/academics/curriculum/workflows')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workflows
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{workflow.title}</h1>
            <p className="text-muted-foreground">{workflow.program} • {workflow.stage}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Title</Label>
                    <p className="font-medium">{workflow.title}</p>
                  </div>
                  <div>
                    <Label>Program</Label>
                    <Badge variant="outline">{workflow.program}</Badge>
                  </div>
                  <div>
                    <Label>Current Stage</Label>
                    <Badge variant="secondary">{workflow.stage}</Badge>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge variant={workflow.status === 'In Progress' ? 'default' : 'secondary'}>
                      {workflow.status}
                    </Badge>
                  </div>
                  <div>
                    <Label>Initiator</Label>
                    <p className="font-medium">{workflow.initiator}</p>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Badge variant={workflow.priority === 'High' ? 'destructive' : 'secondary'}>
                      {workflow.priority}
                    </Badge>
                  </div>
                  <div>
                    <Label>Due Date</Label>
                    <p className="font-medium">{workflow.dueDate}</p>
                  </div>
                  <div>
                    <Label>Progress</Label>
                    <div className="flex items-center gap-2">
                      <Progress value={workflow.progress} className="flex-1" />
                      <span className="text-sm font-medium">{workflow.progress}%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <p className="text-sm text-gray-600">{workflow.description}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Workflow Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { stage: 'Initiated', date: '2024-01-15', user: workflow.initiator, status: 'completed' },
                    { stage: 'Gap Analysis', date: '2024-01-20', user: 'Analysis Team', status: 'completed' },
                    { stage: 'Faculty Review', date: '2024-02-01', user: 'Faculty Committee', status: 'current' },
                    { stage: 'Department Head Approval', date: 'Pending', user: 'Department Head', status: 'pending' },
                    { stage: 'Final Approval', date: 'Pending', user: 'Academic Council', status: 'pending' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'completed' ? 'bg-green-500' :
                        item.status === 'current' ? 'bg-blue-500' : 'bg-gray-300'
                      }`}></div>
                      <div className="flex-1">
                        <p className="font-medium">{item.stage}</p>
                        <p className="text-sm text-gray-600">{item.user} • {item.date}</p>
                      </div>
                      {item.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {item.status === 'current' && <Clock className="h-4 w-4 text-blue-500" />}
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
                <Button className="w-full" onClick={() => navigate(`/academics/curriculum/workflows/${id}/edit`)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Workflow
                </Button>
                <Button variant="outline" className="w-full" onClick={() => handleApprove(workflow.id)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Comment
                </Button>
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Add Attachment
                </Button>
                <Button variant="destructive" className="w-full" onClick={() => handleReject(workflow.id)}>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">{workflow.comments} Comments</p>
                    <p className="text-xs text-gray-600">Latest: 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">{workflow.attachments} Attachments</p>
                    <p className="text-xs text-gray-600">Latest: 1 day ago</p>
                  </div>
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
          <h1 className="text-3xl font-bold tracking-tight">Curriculum Revision Workflows</h1>
          <p className="text-muted-foreground">Track and manage curriculum revision requests and approvals</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => navigate('/academics/curriculum/workflows/create')}>
            <Plus className="h-4 w-4 mr-2" />
            New Workflow
          </Button>
        </div>
      </div>

      {/* Workflow Pipeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Revision Pipeline</CardTitle>
          <CardDescription>Current status of curriculum revision workflows by stage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {stages.map((stage, index) => (
              <div key={index} className={`p-4 rounded-lg bg-${stage.color}-50 border border-${stage.color}-200`}>
                <div className="text-center">
                  <div className={`text-2xl font-bold text-${stage.color}-700`}>{stage.count}</div>
                  <div className={`text-sm text-${stage.color}-600`}>{stage.name}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search workflows..."
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
            <SelectItem value="in progress">In Progress</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value="gap analysis">Gap Analysis</SelectItem>
            <SelectItem value="faculty review">Faculty Review</SelectItem>
            <SelectItem value="committee review">Committee Review</SelectItem>
            <SelectItem value="department head approval">Department Head Approval</SelectItem>
            <SelectItem value="final approval">Final Approval</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Workflows</CardTitle>
          <CardDescription>
            Curriculum revision requests currently in the approval process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkflows.map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{workflow.title}</p>
                      <p className="text-sm text-gray-600">by {workflow.initiator}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{workflow.program}</Badge>
                  </TableCell>
                  <TableCell>{workflow.stage}</TableCell>
                  <TableCell>
                    <Badge variant={workflow.status === 'In Progress' ? 'default' : 'secondary'}>
                      {workflow.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={workflow.priority === 'High' ? 'destructive' : 'secondary'}>
                      {workflow.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={workflow.progress} className="w-16" />
                      <span className="text-sm">{workflow.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{workflow.dueDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/academics/curriculum/workflows/${workflow.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/academics/curriculum/workflows/${workflow.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApprove(workflow.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
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
