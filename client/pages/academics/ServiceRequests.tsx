import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import { Pagination, usePagination } from '../../components/ui/pagination';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  Calendar,
  MessageSquare,
  Settings,
  FileText,
  Users,
  Laptop,
  BookOpen,
  Bell
} from 'lucide-react';

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  type: 'Academic' | 'Administrative' | 'Technical' | 'Infrastructure' | 'HR';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed' | 'Escalated' | 'Scheduled';
  assignedTo: string;
  createdBy: string;
  createdDate: string;
  dueDate: string;
  category: string;
  resolution?: string;
  followUps: number;
  lastUpdate: string;
}

const ServiceRequests: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'new-request' | 'view-request'>('list');
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [requests, setRequests] = useState<ServiceRequest[]>([
    {
      id: 'REQ001',
      title: 'Student Portal Login Issues',
      description: 'Multiple students reporting difficulty logging into the student portal',
      type: 'Technical',
      priority: 'High',
      status: 'In Progress',
      assignedTo: 'IT Support Team',
      createdBy: 'Dr.sarasvathi',
      createdDate: '2024-12-20',
      dueDate: '2024-12-22',
      category: 'System Access',
      followUps: 2,
      lastUpdate: '2024-12-21'
    },
    {
      id: 'REQ002',
      title: 'Grade Submission Deadline Extension',
      description: 'Request to extend grade submission deadline for CSE Department',
      type: 'Academic',
      priority: 'Medium',
      status: 'Open',
      assignedTo: 'Academic Office',
      createdBy: 'Prof. Kumar',
      createdDate: '2024-12-19',
      dueDate: '2024-12-23',
      category: 'Academic Policy',
      followUps: 0,
      lastUpdate: '2024-12-19'
    },
    {
      id: 'REQ003',
      title: 'Classroom AC Repair',
      description: 'Air conditioning unit in Room 101 needs repair',
      type: 'Infrastructure',
      priority: 'Medium',
      status: 'Resolved',
      assignedTo: 'Maintenance Team',
      createdBy: 'Facilities Manager',
      createdDate: '2024-12-18',
      dueDate: '2024-12-20',
      category: 'Equipment',
      resolution: 'AC unit repaired and tested. Working normally.',
      followUps: 1,
      lastUpdate: '2024-12-20'
    },
    {
      id: 'REQ004',
      title: 'New Faculty Onboarding',
      description: 'Setup accounts and access for 3 new faculty members',
      type: 'HR',
      priority: 'High',
      status: 'In Progress',
      assignedTo: 'HR Department',
      createdBy: 'HR Manager',
      createdDate: '2024-12-21',
      dueDate: '2024-12-24',
      category: 'Employee Setup',
      followUps: 0,
      lastUpdate: '2024-12-21'
    },
    {
      id: 'REQ005',
      title: 'Library Book Purchase Request',
      description: 'Request for purchasing new Computer Science textbooks',
      type: 'Administrative',
      priority: 'Low',
      status: 'Open',
      assignedTo: 'Procurement Team',
      createdBy: 'Librarian',
      createdDate: '2024-12-17',
      dueDate: '2024-12-30',
      category: 'Procurement',
      followUps: 0,
      lastUpdate: '2024-12-17'
    },
    {
      id: 'REQ006',
      title: 'Network Connectivity Issues',
      description: 'Wi-Fi connectivity problems in Lab Building',
      type: 'Technical',
      priority: 'High',
      status: 'Open',
      assignedTo: 'IT Support Team',
      createdBy: 'Lab Manager',
      createdDate: '2024-12-16',
      dueDate: '2024-12-25',
      category: 'Network',
      followUps: 1,
      lastUpdate: '2024-12-18'
    },
    {
      id: 'REQ007',
      title: 'Exam Hall Setup Request',
      description: 'Setup examination halls for mid-term exams',
      type: 'Administrative',
      priority: 'Medium',
      status: 'Resolved',
      assignedTo: 'Facilities Team',
      createdBy: 'Exam Controller',
      createdDate: '2024-12-15',
      dueDate: '2024-12-20',
      category: 'Event Setup',
      resolution: 'All exam halls have been setup and tested.',
      followUps: 0,
      lastUpdate: '2024-12-19'
    },
    {
      id: 'REQ008',
      title: 'Laboratory Equipment Maintenance',
      description: 'Regular maintenance for chemistry lab equipment',
      type: 'Infrastructure',
      priority: 'Low',
      status: 'Scheduled',
      assignedTo: 'Maintenance Team',
      createdBy: 'Chemistry Lab Head',
      createdDate: '2024-12-14',
      dueDate: '2024-12-28',
      category: 'Maintenance',
      followUps: 0,
      lastUpdate: '2024-12-14'
    }
  ]);

  const [filteredRequestsState, setFilteredRequestsState] = useState<ServiceRequest[]>([]);

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    handlePageChange,
    totalItems,
    pageSize
  } = usePagination(filteredRequestsState, 5);

  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    type: 'Academic',
    priority: 'Medium',
    category: '',
    dueDate: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      case 'Escalated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Academic': return <BookOpen className="h-4 w-4" />;
      case 'Administrative': return <FileText className="h-4 w-4" />;
      case 'Technical': return <Laptop className="h-4 w-4" />;
      case 'Infrastructure': return <Settings className="h-4 w-4" />;
      case 'HR': return <Users className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  // Update filtered requests
  useEffect(() => {
    const filtered = requests.filter(request => {
      const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || request.type === filterType;
      const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
      const matchesTab = activeTab === 'all' ||
                        (activeTab === 'open' && request.status === 'Open') ||
                        (activeTab === 'in-progress' && request.status === 'In Progress') ||
                        (activeTab === 'resolved' && ['Resolved', 'Closed'].includes(request.status));

      return matchesSearch && matchesType && matchesStatus && matchesTab;
    });
    setFilteredRequestsState(filtered);
  }, [requests, searchTerm, filterType, filterStatus, activeTab]);

  const stats = {
    total: requests.length,
    open: requests.filter(r => r.status === 'Open').length,
    inProgress: requests.filter(r => r.status === 'In Progress').length,
    resolved: requests.filter(r => ['Resolved', 'Closed'].includes(r.status)).length,
    overdue: requests.filter(r => new Date(r.dueDate) < new Date() && !['Resolved', 'Closed'].includes(r.status)).length
  };

  // Navigation handlers
  const goToNewRequest = () => {
    setCurrentView('new-request');
  };

  const goBackToList = () => {
    setCurrentView('list');
    setSelectedRequest(null);
  };

  const goToViewRequest = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setCurrentView('view-request');
  };

  const handleCreateRequest = () => {
    const request: ServiceRequest = {
      id: `REQ${String(requests.length + 1).padStart(3, '0')}`,
      ...newRequest,
      status: 'Open',
      assignedTo: 'Unassigned',
      createdBy: 'Current User',
      createdDate: new Date().toISOString().split('T')[0],
      followUps: 0,
      lastUpdate: new Date().toISOString().split('T')[0]
    };

    setRequests([...requests, request]);
    setNewRequest({
      title: '',
      description: '',
      type: 'Academic',
      priority: 'Medium',
      category: '',
      dueDate: ''
    });
    goBackToList();
  };

  const handleDeleteRequest = () => {
    if (selectedRequest) {
      setRequests(requests.filter(r => r.id !== selectedRequest.id));
      setSelectedRequest(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const renderNewRequestPage = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={goBackToList}
            className="flex items-center gap-2"
          >
            ← Back to Service Requests
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Service Request</h1>
            <p className="text-muted-foreground mt-2">
              Submit a new service request for processing
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Service Request Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={newRequest.title}
              onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
              placeholder="Brief description of the request"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type *</Label>
              <Select value={newRequest.type} onValueChange={(value) => setNewRequest({ ...newRequest, type: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Administrative">Administrative</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority *</Label>
              <Select value={newRequest.priority} onValueChange={(value) => setNewRequest({ ...newRequest, priority: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={newRequest.category}
                onChange={(e) => setNewRequest({ ...newRequest, category: e.target.value })}
                placeholder="e.g., System Access, Equipment, Policy"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={newRequest.dueDate}
                onChange={(e) => setNewRequest({ ...newRequest, dueDate: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={newRequest.description}
              onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
              placeholder="Detailed description of the request"
              rows={4}
              className="mt-1"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={goBackToList}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateRequest}
              disabled={!newRequest.title || !newRequest.description}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Create Request
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderViewRequestPage = () => {
    if (!selectedRequest) return null;

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={goBackToList}
              className="flex items-center gap-2"
            >
              ← Back to Service Requests
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                {getTypeIcon(selectedRequest.type)}
                {selectedRequest.title}
              </h1>
              <p className="text-muted-foreground mt-2">
                Request ID: {selectedRequest.id} • {selectedRequest.category}
              </p>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {getTypeIcon(selectedRequest.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <Badge variant="outline" className={getPriorityColor(selectedRequest.type)}>
                    {selectedRequest.type}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Priority</p>
                  <Badge variant="outline" className={getPriorityColor(selectedRequest.priority)}>
                    {selectedRequest.priority}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge variant="outline" className={getStatusColor(selectedRequest.status)}>
                    {selectedRequest.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Bell className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Follow-ups</p>
                  <p className="text-xl font-bold">{selectedRequest.followUps}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Request Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Request Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Description</Label>
                  <p className="text-sm mt-2 p-4 bg-gray-50 rounded-lg">{selectedRequest.description}</p>
                </div>

                {selectedRequest.resolution && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Resolution</Label>
                    <p className="text-sm mt-2 p-4 bg-green-50 rounded-lg border border-green-200">
                      {selectedRequest.resolution}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Request Information */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Request Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Created By</p>
                      <p className="text-sm">{selectedRequest.createdBy}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Settings className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Assigned To</p>
                      <p className="text-sm">{selectedRequest.assignedTo}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Created Date</p>
                      <p className="text-sm">{selectedRequest.createdDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Due Date</p>
                      <p className="text-sm">{selectedRequest.dueDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last Updated</p>
                      <p className="text-sm">{selectedRequest.lastUpdate}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  // Conditional rendering based on current view
  if (currentView === 'new-request') {
    return renderNewRequestPage();
  }

  if (currentView === 'view-request') {
    return renderViewRequestPage();
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Requests</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track service requests across all departments
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={goToNewRequest}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Requests</p>
                <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Open</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.open}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">In Progress</p>
                <p className="text-3xl font-bold text-orange-900">{stats.inProgress}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Resolved</p>
                <p className="text-3xl font-bold text-green-900">{stats.resolved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Overdue</p>
                <p className="text-3xl font-bold text-red-900">{stats.overdue}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Academic">Academic</SelectItem>
            <SelectItem value="Administrative">Administrative</SelectItem>
            <SelectItem value="Technical">Technical</SelectItem>
            <SelectItem value="Infrastructure">Infrastructure</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
            <SelectItem value="Escalated">Escalated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs and Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-4 font-medium">Request</th>
                      <th className="text-left p-4 font-medium">Type</th>
                      <th className="text-left p-4 font-medium">Priority</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Assigned To</th>
                      <th className="text-left p-4 font-medium">Due Date</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((request) => (
                      <tr key={request.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-start gap-3">
                            {getTypeIcon(request.type)}
                            <div>
                              <div className="font-medium">{request.title}</div>
                              <div className="text-sm text-gray-500 max-w-md truncate">
                                {request.description}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {request.id} • {request.category}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={getPriorityColor(request.type)}>
                            {request.type}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={getPriorityColor(request.priority)}>
                            {request.priority}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{request.assignedTo}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{request.dueDate}</span>
                          </div>
                          {request.followUps > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <Bell className="h-3 w-3 text-orange-500" />
                              <span className="text-xs text-orange-600">{request.followUps} follow-ups</span>
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => goToViewRequest(request)}
                            >
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredRequestsState.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                  </div>
                )}

                {/* Pagination */}
                {filteredRequestsState.length > 0 && (
                  <div className="px-4 py-4">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      totalItems={totalItems}
                      pageSize={pageSize}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>


      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the service request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRequest} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ServiceRequests;
