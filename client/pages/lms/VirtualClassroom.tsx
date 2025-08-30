import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Video, Plus, Users, Calendar, Clock, Settings, Play, Pause, Mic, MicOff,
  Camera, CameraOff, Monitor, MessageCircle, Hand, Share, FileText, 
  PenTool, Edit, Trash2, Eye, Search, Download, Upload, BarChart,
  Presentation, BookOpen, Volume2, VolumeX, RotateCcw, Maximize, ArrowLeft
} from 'lucide-react';

interface VirtualClassroom {
  id: string;
  title: string;
  description: string;
  instructor: string;
  courseId: string;
  courseName: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'Scheduled' | 'Live' | 'Completed' | 'Cancelled';
  participants: Participant[];
  maxParticipants: number;
  meetingUrl: string;
  roomCode: string;
  features: ClassroomFeatures;
  recordings: Recording[];
  attendance: AttendanceRecord[];
  createdDate: string;
}

interface Participant {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: 'Instructor' | 'Student' | 'Assistant';
  joinedAt?: string;
  leftAt?: string;
  status: 'Invited' | 'Joined' | 'Left' | 'Absent';
  permissions: ParticipantPermissions;
}

interface ParticipantPermissions {
  canShareScreen: boolean;
  canUseWhiteboard: boolean;
  canUseMic: boolean;
  canUseCamera: boolean;
  canChat: boolean;
  canRaiseHand: boolean;
}

interface ClassroomFeatures {
  videoConferencing: boolean;
  screenSharing: boolean;
  whiteboard: boolean;
  chat: boolean;
  handRaising: boolean;
  fileSharing: boolean;
  recording: boolean;
  attendance: boolean;
  breakoutRooms: boolean;
  polls: boolean;
  quiz: boolean;
  virtualBackground: boolean;
}

interface Recording {
  id: string;
  title: string;
  duration: number;
  fileSize: string;
  recordedDate: string;
  downloadUrl: string;
  participants: number;
}

interface AttendanceRecord {
  userId: string;
  userName: string;
  joinTime: string;
  leaveTime?: string;
  duration: number;
  status: 'Present' | 'Late' | 'Absent' | 'Partial';
}

const sampleClassrooms: VirtualClassroom[] = [
  {
    id: '1',
    title: 'Introduction to React Hooks',
    description: 'Deep dive into React Hooks with practical examples and best practices',
    instructor: 'Dr. Rajesh Kumar',
    courseId: 'CSE2024',
    courseName: 'B.E Computer Science Engineering',
    scheduledDate: '2024-02-15',
    startTime: '10:00',
    endTime: '11:30',
    duration: 90,
    status: 'Scheduled',
    participants: [],
    maxParticipants: 50,
    meetingUrl: 'https://classroom.app/room/react-hooks-intro',
    roomCode: 'RH2024-001',
    features: {
      videoConferencing: true,
      screenSharing: true,
      whiteboard: true,
      chat: true,
      handRaising: true,
      fileSharing: true,
      recording: true,
      attendance: true,
      breakoutRooms: true,
      polls: true,
      quiz: true,
      virtualBackground: true
    },
    recordings: [],
    attendance: [],
    createdDate: '2024-02-01'
  },
  {
    id: '2',
    title: 'Data Structures and Algorithms',
    description: 'Understanding fundamental data structures and algorithmic thinking',
    instructor: 'Prof. Priya Mohana',
    courseId: 'AIDS2024',
    courseName: 'B.E Artificial Intelligence & Data Science',
    scheduledDate: '2024-02-14',
    startTime: '14:00',
    endTime: '15:30',
    duration: 90,
    status: 'Live',
    participants: [],
    maxParticipants: 30,
    meetingUrl: 'https://classroom.app/room/data-structures',
    roomCode: 'DS2024-002',
    features: {
      videoConferencing: true,
      screenSharing: true,
      whiteboard: true,
      chat: true,
      handRaising: true,
      fileSharing: true,
      recording: true,
      attendance: true,
      breakoutRooms: false,
      polls: true,
      quiz: true,
      virtualBackground: true
    },
    recordings: [
      {
        id: 'rec-1',
        title: 'Arrays and Linked Lists Session',
        duration: 85,
        fileSize: '245 MB',
        recordedDate: '2024-02-07',
        downloadUrl: '/recordings/ds-arrays-session.mp4',
        participants: 28
      }
    ],
    attendance: [],
    createdDate: '2024-01-28'
  }
];

export default function VirtualClassroom() {
  const [classrooms, setClassrooms] = useState<VirtualClassroom[]>(sampleClassrooms);
  const [selectedClassroom, setSelectedClassroom] = useState<VirtualClassroom | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [view, setView] = useState<'list' | 'create-session' | 'classroom-details' | 'join-classroom' | 'schedule-classroom' | 'edit-classroom'>('list');

  const handleCreateClassroom = (formData: any) => {
    const newClassroom: VirtualClassroom = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      instructor: formData.instructor,
      courseId: formData.courseId,
      courseName: formData.courseName,
      scheduledDate: formData.scheduledDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      duration: formData.duration,
      status: 'Scheduled',
      participants: [],
      maxParticipants: parseInt(formData.maxParticipants),
      meetingUrl: `https://classroom.app/room/${Date.now()}`,
      roomCode: `VC${Date.now().toString().slice(-6)}`,
      features: formData.features,
      recordings: [],
      attendance: [],
      createdDate: new Date().toISOString().split('T')[0]
    };
    
    setClassrooms([...classrooms, newClassroom]);
    setView('list');
  };

  const filteredClassrooms = classrooms.filter(classroom => {
    const matchesSearch = classroom.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classroom.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classroom.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || classroom.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live': return 'bg-red-500';
      case 'Scheduled': return 'bg-blue-500';
      case 'Completed': return 'bg-green-500';
      case 'Cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const openClassroomDetails = (classroom: VirtualClassroom) => {
    setSelectedClassroom(classroom);
    setView('classroom-details');
  };

  const openJoinClassroom = (classroom: VirtualClassroom) => {
    setSelectedClassroom(classroom);
    setView('join-classroom');
  };

  const openScheduleClassroom = (classroom: VirtualClassroom) => {
    setSelectedClassroom(classroom);
    setView('schedule-classroom');
  };

  const openEditClassroom = (classroom: VirtualClassroom) => {
    setSelectedClassroom(classroom);
    setView('edit-classroom');
  };

  const renderBackButton = () => (
    <Button variant="outline" onClick={() => setView('list')} className="mb-4">
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Classrooms
    </Button>
  );

  const renderCreateSessionView = () => (
    <div className="space-y-6">
      {renderBackButton()}
      <div>
        <h2 className="text-2xl font-bold">Create Virtual Classroom Session</h2>
        <p className="text-muted-foreground">Set up a new virtual classroom with interactive features</p>
      </div>
      <CreateClassroomForm onSubmit={handleCreateClassroom} onCancel={() => setView('list')} />
    </div>
  );

  const renderClassroomDetailsView = () => (
    selectedClassroom && (
      <div className="space-y-6">
        {renderBackButton()}
        <div>
          <h2 className="text-2xl font-bold">{selectedClassroom.title}</h2>
          <p className="text-muted-foreground">Virtual classroom session details</p>
        </div>
        <ClassroomDetailView classroom={selectedClassroom} />
      </div>
    )
  );

  const renderJoinClassroomView = () => (
    selectedClassroom && (
      <div className="space-y-6">
        {renderBackButton()}
        <div>
          <h2 className="text-2xl font-bold">Join Virtual Classroom</h2>
          <p className="text-muted-foreground">Join the live session: {selectedClassroom.title}</p>
        </div>
        <JoinClassroomDialog classroom={selectedClassroom} />
      </div>
    )
  );

  const renderScheduleClassroomView = () => (
    selectedClassroom && (
      <div className="space-y-6">
        {renderBackButton()}
        <div>
          <h2 className="text-2xl font-bold">Update Schedule</h2>
          <p className="text-muted-foreground">Modify the schedule for: {selectedClassroom.title}</p>
        </div>
        <ScheduleClassroomDialog classroom={selectedClassroom} onCancel={() => setView('list')} />
      </div>
    )
  );

  const renderEditClassroomView = () => (
    selectedClassroom && (
      <div className="space-y-6">
        {renderBackButton()}
        <div>
          <h2 className="text-2xl font-bold">Edit Classroom Session</h2>
          <p className="text-muted-foreground">Update session details and settings</p>
        </div>
        <EditClassroomDialog classroom={selectedClassroom} onCancel={() => setView('list')} />
      </div>
    )
  );

  if (view !== 'list') {
    switch (view) {
      case 'create-session':
        return renderCreateSessionView();
      case 'classroom-details':
        return renderClassroomDetailsView();
      case 'join-classroom':
        return renderJoinClassroomView();
      case 'schedule-classroom':
        return renderScheduleClassroomView();
      case 'edit-classroom':
        return renderEditClassroomView();
      default:
        return renderCreateSessionView();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Virtual Classroom</h1>
          <p className="text-muted-foreground">
            Conduct live interactive sessions with video conferencing and collaboration tools
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setView('create-session')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Session
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Sessions</CardTitle>
            <Video className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {classrooms.filter(c => c.status === 'Live').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {classrooms.filter(c => c.status === 'Scheduled').length}
            </div>
            <p className="text-xs text-muted-foreground">Upcoming sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {classrooms.reduce((sum, c) => sum + c.participants.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recordings</CardTitle>
            <BarChart className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">
              {classrooms.reduce((sum, c) => sum + c.recordings.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Available recordings</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sessions..."
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
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Classrooms Table */}
      <Card>
        <CardHeader>
          <CardTitle>Virtual Classroom Sessions</CardTitle>
          <CardDescription>
            Manage your live and scheduled virtual classroom sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClassrooms.map((classroom) => (
                <TableRow key={classroom.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{classroom.title}</div>
                      <div className="text-sm text-muted-foreground">{classroom.courseName}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {classroom.instructor}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {classroom.scheduledDate}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {classroom.startTime} - {classroom.endTime}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {classroom.participants.length}/{classroom.maxParticipants}
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                        <div 
                          className="bg-blue-600 h-1 rounded-full" 
                          style={{ width: `${(classroom.participants.length / classroom.maxParticipants) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(classroom.status)}`}></div>
                      <Badge variant={
                        classroom.status === 'Live' ? 'destructive' :
                        classroom.status === 'Scheduled' ? 'default' :
                        classroom.status === 'Completed' ? 'secondary' : 'outline'
                      }>
                        {classroom.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {classroom.features.videoConferencing && (
                        <Badge variant="outline" className="text-xs">
                          <Video className="h-3 w-3 mr-1" />
                          Video
                        </Badge>
                      )}
                      {classroom.features.recording && (
                        <Badge variant="outline" className="text-xs">
                          Recording
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {classroom.status === 'Live' && (
                        <Button variant="default" size="sm" onClick={() => openJoinClassroom(classroom)}>
                          <Play className="h-4 w-4 mr-1" />
                          Join
                        </Button>
                      )}
                      {classroom.status === 'Scheduled' && (
                        <Button variant="outline" size="sm" onClick={() => openScheduleClassroom(classroom)}>
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule
                        </Button>
                      )}

                      <Button variant="outline" size="sm" onClick={() => openClassroomDetails(classroom)}>
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button variant="outline" size="sm" onClick={() => openEditClassroom(classroom)}>
                        <Edit className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Session</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this classroom session?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction>Delete</AlertDialogAction>
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
}

function CreateClassroomForm({ onSubmit, onCancel }: { onSubmit: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    courseId: '',
    courseName: '',
    scheduledDate: '',
    startTime: '',
    endTime: '',
    duration: 60,
    maxParticipants: '30',
    features: {
      videoConferencing: true,
      screenSharing: true,
      whiteboard: true,
      chat: true,
      handRaising: true,
      fileSharing: true,
      recording: true,
      attendance: true,
      breakoutRooms: false,
      polls: true,
      quiz: false,
      virtualBackground: true
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFeatureToggle = (feature: string, enabled: boolean) => {
    setFormData({
      ...formData,
      features: {
        ...formData.features,
        [feature]: enabled
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="schedule">Schedule & Settings</TabsTrigger>
          <TabsTrigger value="features">Features & Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Session Title</Label>
            <Input 
              id="title" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter session title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the session objectives and content"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Select value={formData.courseId} onValueChange={(value) => setFormData({...formData, courseId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSE2024">B.E Computer Science Engineering</SelectItem>
                  <SelectItem value="AIDS2024">B.E Artificial Intelligence & Data Science</SelectItem>
                  <SelectItem value="DCE2024">Diploma in Computer Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor</Label>
              <Select value={formData.instructor} onValueChange={(value) => setFormData({...formData, instructor: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select instructor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr. Rajesh Kumar">Dr. Rajesh Kumar</SelectItem>
                  <SelectItem value="Prof. Priya Menon">Prof. Priya Menon</SelectItem>
                  <SelectItem value="Dr. Vikram Singh">Dr. Vikram Singh</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input 
                id="start-time" 
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input 
                id="end-time" 
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="participants">Maximum Participants</Label>
            <Input 
              id="participants" 
              type="number"
              value={formData.maxParticipants}
              onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
              placeholder="Maximum number of participants"
              min="1"
              max="500"
              required
            />
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Communication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    <Label htmlFor="video">Video Conferencing</Label>
                  </div>
                  <Switch
                    id="video"
                    checked={formData.features.videoConferencing}
                    onCheckedChange={(checked) => handleFeatureToggle('videoConferencing', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <Label htmlFor="chat">Text Chat</Label>
                  </div>
                  <Switch
                    id="chat"
                    checked={formData.features.chat}
                    onCheckedChange={(checked) => handleFeatureToggle('chat', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Hand className="h-4 w-4" />
                    <Label htmlFor="hand">Hand Raising</Label>
                  </div>
                  <Switch
                    id="hand"
                    checked={formData.features.handRaising}
                    onCheckedChange={(checked) => handleFeatureToggle('handRaising', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Collaboration Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    <Label htmlFor="screen">Screen Sharing</Label>
                  </div>
                  <Switch
                    id="screen"
                    checked={formData.features.screenSharing}
                    onCheckedChange={(checked) => handleFeatureToggle('screenSharing', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PenTool className="h-4 w-4" />
                    <Label htmlFor="whiteboard">Whiteboard</Label>
                  </div>
                  <Switch
                    id="whiteboard"
                    checked={formData.features.whiteboard}
                    onCheckedChange={(checked) => handleFeatureToggle('whiteboard', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <Label htmlFor="files">File Sharing</Label>
                  </div>
                  <Switch
                    id="files"
                    checked={formData.features.fileSharing}
                    onCheckedChange={(checked) => handleFeatureToggle('fileSharing', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recording & Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart className="h-4 w-4" />
                    <Label htmlFor="recording">Session Recording</Label>
                  </div>
                  <Switch
                    id="recording"
                    checked={formData.features.recording}
                    onCheckedChange={(checked) => handleFeatureToggle('recording', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <Label htmlFor="attendance">Attendance Tracking</Label>
                  </div>
                  <Switch
                    id="attendance"
                    checked={formData.features.attendance}
                    onCheckedChange={(checked) => handleFeatureToggle('attendance', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <Label htmlFor="polls">Polls & Quizzes</Label>
                  </div>
                  <Switch
                    id="polls"
                    checked={formData.features.polls}
                    onCheckedChange={(checked) => handleFeatureToggle('polls', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Advanced Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <Label htmlFor="breakout">Breakout Rooms</Label>
                  </div>
                  <Switch
                    id="breakout"
                    checked={formData.features.breakoutRooms}
                    onCheckedChange={(checked) => handleFeatureToggle('breakoutRooms', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Presentation className="h-4 w-4" />
                    <Label htmlFor="virtual-bg">Virtual Background</Label>
                  </div>
                  <Switch
                    id="virtual-bg"
                    checked={formData.features.virtualBackground}
                    onCheckedChange={(checked) => handleFeatureToggle('virtualBackground', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Create Session</Button>
      </div>
    </form>
  );
}

function ClassroomDetailView({ classroom }: { classroom: VirtualClassroom }) {
  const [isLive, setIsLive] = useState(classroom.status === 'Live');
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="session" className="space-y-4">
        <TabsList>
          <TabsTrigger value="session">Session Control</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="recordings">Recordings</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="session" className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Session Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Course</Label>
                  <p className="text-sm">{classroom.courseName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Instructor</Label>
                  <p className="text-sm">{classroom.instructor}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Schedule</Label>
                  <p className="text-sm">{classroom.scheduledDate} at {classroom.startTime}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Room Code</Label>
                  <p className="text-sm font-mono">{classroom.roomCode}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Meeting URL</Label>
                  <p className="text-sm text-blue-600 truncate">{classroom.meetingUrl}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Session Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant={micEnabled ? "default" : "outline"} onClick={() => setMicEnabled(!micEnabled)}>
                    {micEnabled ? <Mic className="h-4 w-4 mr-2" /> : <MicOff className="h-4 w-4 mr-2" />}
                    {micEnabled ? "Mute" : "Unmute"}
                  </Button>
                  
                  <Button variant={cameraEnabled ? "default" : "outline"} onClick={() => setCameraEnabled(!cameraEnabled)}>
                    {cameraEnabled ? <Camera className="h-4 w-4 mr-2" /> : <CameraOff className="h-4 w-4 mr-2" />}
                    {cameraEnabled ? "Camera Off" : "Camera On"}
                  </Button>

                  <Button variant={screenSharing ? "default" : "outline"} onClick={() => setScreenSharing(!screenSharing)}>
                    <Monitor className="h-4 w-4 mr-2" />
                    {screenSharing ? "Stop Share" : "Share Screen"}
                  </Button>

                  <Button variant="outline">
                    <PenTool className="h-4 w-4 mr-2" />
                    Whiteboard
                  </Button>

                  <Button variant="outline" className="col-span-2">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Open Chat
                  </Button>
                </div>

                <div className="flex gap-2">
                  {classroom.status === 'Scheduled' && (
                    <Button className="flex-1">
                      <Play className="h-4 w-4 mr-2" />
                      Start Session
                    </Button>
                  )}
                  
                  {classroom.status === 'Live' && (
                    <Button variant="destructive" className="flex-1">
                      <Pause className="h-4 w-4 mr-2" />
                      End Session
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Enabled Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {Object.entries(classroom.features).map(([feature, enabled]) => (
                  enabled && (
                    <div key={feature} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm capitalize">{feature.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                  )
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participants" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Participants ({classroom.participants.length}/{classroom.maxParticipants})</h3>
            <Button>
              <Users className="h-4 w-4 mr-2" />
              Invite Participants
            </Button>
          </div>

          {classroom.participants.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Participants Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Invite students to join this virtual classroom session
                </p>
                <Button>
                  <Users className="h-4 w-4 mr-2" />
                  Invite Participants
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              Participants list would be displayed here
            </div>
          )}
        </TabsContent>

        <TabsContent value="recordings" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Session Recordings</h3>
            <div className="flex gap-2">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload Recording
              </Button>
              <Button>
                <BarChart className="h-4 w-4 mr-2" />
                Start Recording
              </Button>
            </div>
          </div>

          {classroom.recordings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Recordings Available</h3>
                <p className="text-muted-foreground mb-4">
                  Start recording to capture this session for later viewing
                </p>
                <Button>
                  <BarChart className="h-4 w-4 mr-2" />
                  Start Recording
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {classroom.recordings.map((recording) => (
                <Card key={recording.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{recording.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Duration: {recording.duration} minutes</span>
                          <span>Size: {recording.fileSize}</span>
                          <span>Participants: {recording.participants}</span>
                          <span>Date: {recording.recordedDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Play
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Attendance Report</h3>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline">
                <BarChart className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>

          {classroom.attendance.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Attendance Data</h3>
                <p className="text-muted-foreground mb-4">
                  Attendance will be tracked when the session starts
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              Attendance data would be displayed here
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function JoinClassroomDialog({ classroom }: { classroom: VirtualClassroom }) {
  const [deviceSettings, setDeviceSettings] = useState({
    microphone: true,
    camera: true,
    speaker: true
  });

  const handleJoinSession = () => {
    // Simulate joining the session
    console.log('Joining session with settings:', deviceSettings);
    // In a real implementation, this would redirect to the meeting URL
    window.open(classroom.meetingUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Ready to Join?</h3>
        <p className="text-sm text-blue-700">
          Session: <strong>{classroom.title}</strong>
        </p>
        <p className="text-sm text-blue-700">
          Room Code: <strong>{classroom.roomCode}</strong>
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Device Settings</h4>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Mic className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium">Microphone</div>
                <div className="text-sm text-muted-foreground">Allow audio input</div>
              </div>
            </div>
            <Switch
              checked={deviceSettings.microphone}
              onCheckedChange={(checked) => setDeviceSettings({...deviceSettings, microphone: checked})}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Camera className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium">Camera</div>
                <div className="text-sm text-muted-foreground">Allow video input</div>
              </div>
            </div>
            <Switch
              checked={deviceSettings.camera}
              onCheckedChange={(checked) => setDeviceSettings({...deviceSettings, camera: checked})}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Volume2 className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium">Speaker</div>
                <div className="text-sm text-muted-foreground">Allow audio output</div>
              </div>
            </div>
            <Switch
              checked={deviceSettings.speaker}
              onCheckedChange={(checked) => setDeviceSettings({...deviceSettings, speaker: checked})}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Available Features</h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(classroom.features).map(([feature, enabled]) => (
            enabled && (
              <div key={feature} className="flex items-center gap-2 p-2 bg-green-50 rounded text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="capitalize">{feature.replace(/([A-Z])/g, ' $1').trim()}</span>
              </div>
            )
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1">
          <MessageCircle className="h-4 w-4 mr-2" />
          Join Audio Only
        </Button>
        <Button onClick={handleJoinSession} className="flex-1">
          <Video className="h-4 w-4 mr-2" />
          Join with Video
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Having trouble? Try refreshing your browser or check your network connection.
      </div>
    </div>
  );
}

function ScheduleClassroomDialog({ classroom, onCancel }: { classroom: VirtualClassroom; onCancel?: () => void }) {
  const [scheduleData, setScheduleData] = useState({
    scheduledDate: classroom.scheduledDate,
    startTime: classroom.startTime,
    endTime: classroom.endTime,
    recurring: false,
    recurrencePattern: 'weekly',
    recurrenceEnd: '',
    timezone: 'Asia/Kolkata',
    sendReminders: true,
    reminderTime: '15' // minutes before
  });

  const handleUpdateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating schedule:', scheduleData);
  };

  return (
    <form onSubmit={handleUpdateSchedule} className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={scheduleData.scheduledDate}
            onChange={(e) => setScheduleData({...scheduleData, scheduledDate: e.target.value})}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="start-time">Start Time</Label>
          <Input
            id="start-time"
            type="time"
            value={scheduleData.startTime}
            onChange={(e) => setScheduleData({...scheduleData, startTime: e.target.value})}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end-time">End Time</Label>
          <Input
            id="end-time"
            type="time"
            value={scheduleData.endTime}
            onChange={(e) => setScheduleData({...scheduleData, endTime: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="timezone">Timezone</Label>
        <Select value={scheduleData.timezone} onValueChange={(value) => setScheduleData({...scheduleData, timezone: value})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
            <SelectItem value="UTC">UTC</SelectItem>
            <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
            <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Recurring Session</Label>
            <p className="text-sm text-muted-foreground">Repeat this session at regular intervals</p>
          </div>
          <Switch
            checked={scheduleData.recurring}
            onCheckedChange={(checked) => setScheduleData({...scheduleData, recurring: checked})}
          />
        </div>

        {scheduleData.recurring && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pattern">Recurrence Pattern</Label>
              <Select value={scheduleData.recurrencePattern} onValueChange={(value) => setScheduleData({...scheduleData, recurrencePattern: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recurrence-end">End Recurrence</Label>
              <Input
                id="recurrence-end"
                type="date"
                value={scheduleData.recurrenceEnd}
                onChange={(e) => setScheduleData({...scheduleData, recurrenceEnd: e.target.value})}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Send Reminders</Label>
            <p className="text-sm text-muted-foreground">Email reminders to participants</p>
          </div>
          <Switch
            checked={scheduleData.sendReminders}
            onCheckedChange={(checked) => setScheduleData({...scheduleData, sendReminders: checked})}
          />
        </div>

        {scheduleData.sendReminders && (
          <div className="space-y-2">
            <Label htmlFor="reminder-time">Reminder Time</Label>
            <Select value={scheduleData.reminderTime} onValueChange={(value) => setScheduleData({...scheduleData, reminderTime: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 minutes before</SelectItem>
                <SelectItem value="15">15 minutes before</SelectItem>
                <SelectItem value="30">30 minutes before</SelectItem>
                <SelectItem value="60">1 hour before</SelectItem>
                <SelectItem value="1440">1 day before</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => onCancel?.()}>Cancel</Button>
        <Button type="submit">
          <Calendar className="h-4 w-4 mr-2" />
          Update Schedule
        </Button>
      </div>
    </form>
  );
}

function EditClassroomDialog({ classroom, onCancel }: { classroom: VirtualClassroom; onCancel?: () => void }) {
  const [formData, setFormData] = useState({
    title: classroom.title,
    description: classroom.description,
    instructor: classroom.instructor,
    courseId: classroom.courseId,
    courseName: classroom.courseName,
    scheduledDate: classroom.scheduledDate,
    startTime: classroom.startTime,
    endTime: classroom.endTime,
    maxParticipants: classroom.maxParticipants.toString(),
    features: { ...classroom.features }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating classroom:', formData);
  };

  const handleFeatureToggle = (feature: string, enabled: boolean) => {
    setFormData({
      ...formData,
      features: {
        ...formData.features,
        [feature]: enabled
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="schedule">Schedule & Settings</TabsTrigger>
          <TabsTrigger value="features">Features & Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Session Title</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter session title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the session objectives and content"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-instructor">Instructor</Label>
              <Select value={formData.instructor} onValueChange={(value) => setFormData({...formData, instructor: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr. Rajesh Kumar">Dr. Rajesh Kumar</SelectItem>
                  <SelectItem value="Prof. Priya Menon">Prof. Priya Menon</SelectItem>
                  <SelectItem value="Dr. Vikram Singh">Dr. Vikram Singh</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-course">Course</Label>
              <Select value={formData.courseId} onValueChange={(value) => setFormData({...formData, courseId: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSE2024">B.E Computer Science Engineering</SelectItem>
                  <SelectItem value="AIDS2024">B.E Artificial Intelligence & Data Science</SelectItem>
                  <SelectItem value="DCE2024">Diploma in Computer Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-start-time">Start Time</Label>
              <Input
                id="edit-start-time"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-end-time">End Time</Label>
              <Input
                id="edit-end-time"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-participants">Maximum Participants</Label>
            <Input
              id="edit-participants"
              type="number"
              value={formData.maxParticipants}
              onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
              placeholder="Maximum number of participants"
              min="1"
              max="500"
              required
            />
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Communication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    <Label>Video Conferencing</Label>
                  </div>
                  <Switch
                    checked={formData.features.videoConferencing}
                    onCheckedChange={(checked) => handleFeatureToggle('videoConferencing', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <Label>Text Chat</Label>
                  </div>
                  <Switch
                    checked={formData.features.chat}
                    onCheckedChange={(checked) => handleFeatureToggle('chat', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Hand className="h-4 w-4" />
                    <Label>Hand Raising</Label>
                  </div>
                  <Switch
                    checked={formData.features.handRaising}
                    onCheckedChange={(checked) => handleFeatureToggle('handRaising', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Collaboration Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    <Label>Screen Sharing</Label>
                  </div>
                  <Switch
                    checked={formData.features.screenSharing}
                    onCheckedChange={(checked) => handleFeatureToggle('screenSharing', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PenTool className="h-4 w-4" />
                    <Label>Whiteboard</Label>
                  </div>
                  <Switch
                    checked={formData.features.whiteboard}
                    onCheckedChange={(checked) => handleFeatureToggle('whiteboard', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <Label>File Sharing</Label>
                  </div>
                  <Switch
                    checked={formData.features.fileSharing}
                    onCheckedChange={(checked) => handleFeatureToggle('fileSharing', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recording & Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart className="h-4 w-4" />
                    <Label>Session Recording</Label>
                  </div>
                  <Switch
                    checked={formData.features.recording}
                    onCheckedChange={(checked) => handleFeatureToggle('recording', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <Label>Attendance Tracking</Label>
                  </div>
                  <Switch
                    checked={formData.features.attendance}
                    onCheckedChange={(checked) => handleFeatureToggle('attendance', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <Label>Polls & Quizzes</Label>
                  </div>
                  <Switch
                    checked={formData.features.polls}
                    onCheckedChange={(checked) => handleFeatureToggle('polls', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Advanced Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <Label>Breakout Rooms</Label>
                  </div>
                  <Switch
                    checked={formData.features.breakoutRooms}
                    onCheckedChange={(checked) => handleFeatureToggle('breakoutRooms', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Presentation className="h-4 w-4" />
                    <Label>Virtual Background</Label>
                  </div>
                  <Switch
                    checked={formData.features.virtualBackground}
                    onCheckedChange={(checked) => handleFeatureToggle('virtualBackground', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => onCancel?.()}>Cancel</Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
