import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Plus,
  Play,
  FileText,
  Video,
  Upload,
  Star,
  Clock,
  Users,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Camera,
  Monitor,
  Mic
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  instructor: string;
  rating?: number;
  enrollmentCount?: number;
  completionRate?: number;
  units: Unit[];
}

interface Unit {
  id: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  isPublished: boolean;
  topics: Topic[];
}

interface Topic {
  id: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  type: 'video' | 'document' | 'quiz' | 'assignment';
  isPublished: boolean;
  content?: string;
}

interface CourseContentViewProps {
  course?: Course;
  onBack?: () => void;
}

export default function CourseContentView({ course, onBack }: CourseContentViewProps) {
  const navigate = useNavigate();

  // Provide default course data if none is provided
  const defaultCourse: Course = {
    id: 'default-course',
    name: 'Data Structures & Algorithms',
    code: 'CS101',
    description: 'Comprehensive course covering fundamental data structures and algorithms',
    instructor: 'Computer Science Department',
    rating: 4.8,
    enrollmentCount: 45,
    completionRate: 75,
    units: []
  };

  // Use provided course or default
  const courseData = course || defaultCourse;

  // Default onBack handler
  const handleBack = (() => navigate('/academics/courses'));

  // Early return with loading state if something goes wrong
  if (!courseData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course content...</p>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('Course Structure');
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set(['unit-1']));
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);
  const [contentFilter, setContentFilter] = useState('all');
  const [contentLibrary, setContentLibrary] = useState([
    { id: 'v1', title: 'Introduction to Arrays', duration: 15, type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { id: 'v2', title: 'Linked Lists Explained', duration: 20, type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { id: 'v3', title: 'Sorting Algorithms', duration: 30, type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { id: 'p1', title: 'Data Structures Overview', pages: 25, type: 'ppt', url: 'https://docs.google.com/presentation/d/1example/embed' },
    { id: 'p2', title: 'Algorithm Complexity', pages: 18, type: 'ppt', url: 'https://docs.google.com/presentation/d/1example/embed' },
    { id: 'd1', title: 'Course Syllabus', type: 'document', url: 'https://docs.google.com/document/d/1example/edit' },
    { id: 'd2', title: 'Assignment Guidelines', type: 'document', url: 'https://docs.google.com/document/d/1example/edit' },
    { id: 'd3', title: 'Reading Materials', type: 'document', url: 'https://docs.google.com/document/d/1example/edit' }
  ]);
  const [newContent, setNewContent] = useState({
    title: '',
    type: 'video' as const,
    url: '',
    duration: 0,
  });


  // Sample data to match the first image structure
  const enhancedCourse = {
    ...courseData,
    units: courseData.units && courseData.units.length > 0 ? courseData.units : [
      {
        id: 'unit-1',
        title: 'Introduction to Data Structures',
        description: 'Basic concepts and fundamental data structures',
        order: 1,
        duration: 8,
        isPublished: true,
        topics: [
          {
            id: 'topic-1',
            title: 'Arrays and Linked Lists',
            description: 'Understanding arrays and linked list implementations',
            order: 1,
            duration: 15,
            type: 'video' as const,
            isPublished: true,
          },
        ],
      },
    ],
  };

  const toggleUnit = (unitId: string) => {
    const newExpanded = new Set(expandedUnits);
    if (newExpanded.has(unitId)) {
      newExpanded.delete(unitId);
    } else {
      newExpanded.add(unitId);
    }
    setExpandedUnits(newExpanded);
  };

  const handleAddUnit = () => {
    console.log('Adding unit:', newUnit);
    setIsAddUnitOpen(false);
    setNewUnit({ title: '', description: '', duration: 0 });
  };

  const handleAddTopic = () => {
    console.log('Adding topic:', newTopic, 'to unit:', selectedUnit?.id);
    setIsAddTopicOpen(false);
    setNewTopic({ title: '', description: '', duration: 0, type: 'video' });
  };

  const handlePlayContent = (content: any) => {
    // Navigate to enhanced video player page with comprehensive course info
    navigate('/academics/enhanced-video-player', {
      state: {
        content,
        course: enhancedCourse,
        topicId: content.id
      }
    });
  };

  const handleRecordForTopic = (topic: { id: string; title: string }, type: 'camera' | 'screen' | 'audio') => {
    // Add visual feedback
    const messages = {
      camera: 'Opening Camera Recording Studio...',
      screen: 'Opening Screen Recording Studio...',
      audio: 'Opening Audio Recording Studio...'
    };

    const icons = {
      camera: '📹',
      screen: '🖥️',
      audio: '🎙️'
    };

    toast.success(messages[type], {
      icon: icons[type],
      duration: 2000
    });

    const recordingUrl = `/academics/courses/record?topicId=${topic.id}&topicTitle=${encodeURIComponent(topic.title)}&unitId=unit-1&unitTitle=${encodeURIComponent('Introduction to Data Structures')}&courseId=${courseData.id}&type=${type}`;
    navigate(recordingUrl);
  };


  const handleAddContent = () => {
    const content = {
      id: `content-${Date.now()}`,
      ...newContent,
    };
    setContentLibrary([...contentLibrary, content]);
    setIsAddContentOpen(false);
    setNewContent({ title: '', type: 'video', url: '', duration: 0 });
  };

  const handleDeleteContent = (contentId: string) => {
    setContentLibrary(contentLibrary.filter(c => c.id !== contentId));
  };

  const handleEditContent = (content: any) => {
    setNewContent(content);
    setIsAddContentOpen(true);
  };

  return (
    <>
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleBack} className="hover:bg-gray-100">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{courseData.name}</h1>
                <p className="text-sm text-gray-600">{courseData.code} • {courseData.instructor}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="bg-white border-gray-300">
                <Upload className="h-4 w-4 mr-2" />
                Upload Content
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Preview Course
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="bg-blue-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Completion Rate</p>
                  <p className="text-3xl font-bold">75%</p>
                </div>
                <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">Course Rating</p>
                  <p className="text-3xl font-bold">4.8</p>
                </div>
                <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">Enrolled Students</p>
                  <p className="text-3xl font-bold">45</p>
                </div>
                <div className="w-12 h-12 bg-purple-400 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium mb-1">Total Units</p>
                  <p className="text-3xl font-bold">1</p>
                </div>
                <div className="w-12 h-12 bg-orange-400 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content with Horizontal Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="Overview">Overview</TabsTrigger>
            <TabsTrigger value="Course Structure">Course Structure</TabsTrigger>
            <TabsTrigger value="Content Library">Content Library</TabsTrigger>
            <TabsTrigger value="Analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="Course Structure">
            <Card className="border border-gray-200">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900">Course Structure</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      6 topics • 1h total duration
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to="/academics/courses/add-unit">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Unit
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {enhancedCourse.units.map((unit, index) => (
                    <div key={unit.id} className="border border-gray-200 rounded-lg bg-white">
                      <div 
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleUnit(unit.id)}
                      >
                        <div className="flex items-center gap-3">
                          {expandedUnits.has(unit.id) ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{unit.title}</h3>
                            <p className="text-sm text-gray-600">{unit.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={unit.isPublished ? "default" : "secondary"} className="text-xs">
                            {unit.isPublished ? "Published" : "Draft"}
                          </Badge>
                          <span className="text-sm text-gray-500">{unit.topics.length} topics</span>
                          <Link
                            to={`/academics/courses/add-topic?unitId=${unit.id}&unitTitle=${encodeURIComponent(unit.title)}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-300"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Topic
                            </Button>
                          </Link>
                        </div>
                      </div>
                      
                      {/* Topics Section */}
                      {expandedUnits.has(unit.id) && (
                        <div className="border-t border-gray-200 bg-gray-50">
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-medium text-gray-700">Topics ({unit.topics.length})</h4>
                              <Link
                                to={`/academics/courses/add-topic?unitId=${unit.id}&unitTitle=${encodeURIComponent(unit.title)}`}
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-300"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add Topic
                                </Button>
                              </Link>
                            </div>
                            <div className="space-y-2">
                              {unit.topics.map((topic, topicIndex) => (
                                <div key={topic.id} className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200">
                                  <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                      <Video className="h-3 w-3 text-blue-600" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{topic.title}</p>
                                      <p className="text-xs text-gray-500">{topic.duration} min • Lecture Video</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={topic.isPublished ? "default" : "secondary"} className="text-xs">
                                      {topic.isPublished ? "Published" : "Draft"}
                                    </Badge>

                                    {/* Recording Buttons */}
                                    <div className="flex items-center gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 hover:bg-blue-50"
                                        onClick={() => handleRecordForTopic({ id: topic.id, title: topic.title }, 'camera')}
                                        title="Record with Camera"
                                      >
                                        <Camera className="h-3 w-3 text-blue-600" />
                                      </Button>

                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 hover:bg-green-50"
                                        onClick={() => handleRecordForTopic({ id: topic.id, title: topic.title }, 'screen')}
                                        title="Record Screen"
                                      >
                                        <Monitor className="h-3 w-3 text-green-600" />
                                      </Button>

                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 hover:bg-purple-50"
                                        onClick={() => handleRecordForTopic({ id: topic.id, title: topic.title }, 'audio')}
                                        title="Record Audio"
                                      >
                                        <Mic className="h-3 w-3 text-purple-600" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="Content Library">
            <Card className="border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Content Library</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Manage course videos, documents, and presentations</p>
                </div>
                <Dialog open={isAddContentOpen} onOpenChange={setIsAddContentOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Content
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Content</DialogTitle>
                      <DialogDescription>
                        Add a new video, document, or presentation to the library.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="content-title">Content Title</Label>
                        <Input
                          id="content-title"
                          value={newContent.title}
                          onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                          placeholder="e.g., Introduction to Arrays"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="content-type">Type</Label>
                        <select
                          id="content-type"
                          value={newContent.type}
                          onChange={(e) => setNewContent({ ...newContent, type: e.target.value as any })}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="video">Video</option>
                          <option value="ppt">Presentation</option>
                          <option value="document">Document</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="content-url">URL</Label>
                        <Input
                          id="content-url"
                          value={newContent.url}
                          onChange={(e) => setNewContent({ ...newContent, url: e.target.value })}
                          placeholder="https://..."
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="content-duration">Duration (minutes)</Label>
                        <Input
                          id="content-duration"
                          type="number"
                          value={newContent.duration}
                          onChange={(e) => setNewContent({ ...newContent, duration: parseInt(e.target.value) || 0 })}
                          placeholder="0"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddContentOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddContent} className="bg-blue-600 hover:bg-blue-700">
                        Add Content
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Tabs value={contentFilter} onValueChange={setContentFilter} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="videos">Videos</TabsTrigger>
                    <TabsTrigger value="ppt">Presentations</TabsTrigger>
                    <TabsTrigger value="docs">Documents</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-3 mt-4">
                    {contentLibrary.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-md bg-white hover:bg-gray-50">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          {item.type === 'video' && <Video className="h-5 w-5 text-blue-600" />}
                          {item.type === 'ppt' && <FileText className="h-5 w-5 text-orange-600" />}
                          {item.type === 'document' && <FileText className="h-5 w-5 text-green-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-500">
                            {item.type === 'video' ? `${item.duration} min • Video` :
                             item.type === 'ppt' ? `${item.pages || 25} slides • Presentation` :
                             'Document'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePlayContent(item)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditContent(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteContent(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="videos" className="space-y-3 mt-4">
                    {contentLibrary.filter(item => item.type === 'video').map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-md bg-white hover:bg-gray-50">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Video className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.duration} min • Video</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePlayContent(item)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditContent(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteContent(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="ppt" className="space-y-3 mt-4">
                    {contentLibrary.filter(item => item.type === 'ppt').map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-md bg-white hover:bg-gray-50">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.pages || 25} slides • Presentation</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePlayContent(item)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditContent(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteContent(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="docs" className="space-y-3 mt-4">
                    {contentLibrary.filter(item => item.type === 'document').map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-md bg-white hover:bg-gray-50">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-500">Document</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePlayContent(item)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditContent(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteContent(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="Analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle>Course Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <span className="text-sm text-gray-600">Average Completion Time</span>
                      <span className="font-semibold">2.5h</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <span className="text-sm text-gray-600">Student Engagement</span>
                      <span className="font-semibold text-green-600">85%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <span className="text-sm text-gray-600">Quiz Average Score</span>
                      <span className="font-semibold text-blue-600">78%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <span className="text-sm text-gray-600">Video Watch Time</span>
                      <span className="font-semibold text-purple-600">92%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle>Student Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { student: 'John Doe', activity: 'Completed Unit 1', time: '2 hours ago' },
                      { student: 'Jane Smith', activity: 'Watched Arrays video', time: '4 hours ago' },
                      { student: 'Mike Johnson', activity: 'Submitted assignment', time: '1 day ago' },
                      { student: 'Sarah Wilson', activity: 'Started Unit 2', time: '2 days ago' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border border-gray-200 rounded-md">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.student}</p>
                          <p className="text-xs text-gray-600">{activity.activity}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="Overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Course Information */}
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Course Information</CardTitle>
                  <p className="text-sm text-gray-600">Basic details about the course</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Comprehensive course covering fundamental data structures and algorithms, concepts with hands-on programming assignments.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Assigned Faculty</h4>
                      <p className="text-sm text-gray-900">Dr. Kumar</p>
                      <p className="text-xs text-gray-500">Prof. Saraswathi</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Department</h4>
                      <p className="text-sm text-gray-900">Computer Science</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Last Modified</h4>
                    <p className="text-sm text-gray-600">30/1/2024</p>
                  </div>
                </CardContent>
              </Card>

              {/* Unit Progress */}
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Unit Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {enhancedCourse.units.map((unit, index) => (
                      <div key={unit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{unit.title}</p>
                            <p className="text-xs text-gray-500">{unit.topics.length} topics • {unit.duration}h</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${unit.isPublished ? 100 : 60}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{unit.isPublished ? '100%' : '60%'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border border-gray-200 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { action: 'Unit "Introduction to Data Structures" was published', time: '2 hours ago', type: 'publish' },
                      { action: 'New topic "Arrays and Linked Lists" added', time: '1 day ago', type: 'add' },
                      { action: 'Course content updated by Dr. Kumar', time: '3 days ago', type: 'update' },
                      { action: 'Student feedback received on Unit 1', time: '5 days ago', type: 'feedback' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === 'publish' ? 'bg-green-500' :
                          activity.type === 'add' ? 'bg-blue-500' :
                          activity.type === 'update' ? 'bg-orange-500' : 'bg-purple-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

      </div>

    </div>
    </>
  );
}
