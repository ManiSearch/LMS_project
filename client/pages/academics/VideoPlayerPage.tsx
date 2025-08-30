import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  ArrowLeft, 
  Play, 
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  RotateCcw,
  RotateCw,
  Clock,
  CheckCircle,
  Circle,
  BookOpen,
  Download,
  Share2,
  Star,
  MessageCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VideoPlayerPageProps {
  courseId?: string;
  unitId?: string;
  topicId?: string;
}

interface Topic {
  id: string;
  title: string;
  duration: number;
  videoUrl: string;
  completed: boolean;
  type: 'video' | 'quiz' | 'reading';
}

interface Unit {
  id: string;
  title: string;
  totalDuration: number;
  completedTopics: number;
  totalTopics: number;
  topics: Topic[];
}

export default function VideoPlayerPage({ courseId, unitId, topicId }: VideoPlayerPageProps) {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string>('topic-1');

  // Sample course data
  const courseData = {
    id: 'course-1',
    name: 'Data Structures & Algorithms',
    instructor: 'Dr. Kumar',
    progress: 65,
    units: [
      {
        id: 'unit-1',
        title: 'Introduction to Data Structures',
        totalDuration: 120, // minutes
        completedTopics: 2,
        totalTopics: 4,
        topics: [
          {
            id: 'topic-1',
            title: 'What are Data Structures?',
            duration: 15,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            completed: true,
            type: 'video' as const
          },
          {
            id: 'topic-2',
            title: 'Types of Data Structures',
            duration: 20,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            completed: true,
            type: 'video' as const
          },
          {
            id: 'topic-3',
            title: 'Arrays Introduction',
            duration: 25,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            completed: false,
            type: 'video' as const
          },
          {
            id: 'topic-4',
            title: 'Knowledge Check Quiz',
            duration: 10,
            videoUrl: '',
            completed: false,
            type: 'quiz' as const
          }
        ]
      },
      {
        id: 'unit-2',
        title: 'Arrays and Linked Lists',
        totalDuration: 180,
        completedTopics: 0,
        totalTopics: 5,
        topics: [
          {
            id: 'topic-5',
            title: 'Array Operations',
            duration: 30,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            completed: false,
            type: 'video' as const
          },
          {
            id: 'topic-6',
            title: 'Dynamic Arrays',
            duration: 25,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            completed: false,
            type: 'video' as const
          }
        ]
      }
    ] as Unit[]
  };

  const currentTopic = courseData.units
    .flatMap(unit => unit.topics)
    .find(topic => topic.id === selectedTopic);

  const currentUnit = courseData.units.find(unit => 
    unit.topics.some(topic => topic.id === selectedTopic)
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', () => setIsPlaying(true));
    video.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', () => setIsPlaying(true));
      video.removeEventListener('pause', () => setIsPlaying(false));
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = value[0];
    setVolume(value[0]);
  };

  const changePlaybackSpeed = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    setCurrentTime(0);
  };

  const markTopicComplete = (topicId: string) => {
    // Mark topic as completed
    console.log('Marking topic as complete:', topicId);
  };

  const getNextTopic = () => {
    const allTopics = courseData.units.flatMap(unit => unit.topics);
    const currentIndex = allTopics.findIndex(topic => topic.id === selectedTopic);
    return currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;
  };

  const getPreviousTopic = () => {
    const allTopics = courseData.units.flatMap(unit => unit.topics);
    const currentIndex = allTopics.findIndex(topic => topic.id === selectedTopic);
    return currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/academics/courses')}
                className="text-gray-700 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Course
              </Button>
              <div className="text-gray-900">
                <h1 className="text-lg font-semibold">{courseData.name}</h1>
                <p className="text-sm text-gray-600">by {courseData.instructor}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-gray-700 text-sm">
                Progress: {courseData.progress}%
              </div>
              <Progress value={courseData.progress} className="w-32" />
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        {/* Video Player */}
        <div className="flex-1 bg-white">
          <div className="relative aspect-video bg-white rounded-lg overflow-hidden shadow-lg">
            {currentTopic && currentTopic.type === 'video' ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain bg-black"
                  controls
                  preload="metadata"
                  playsInline
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <source
                    src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                    type="video/mp4"
                  />
                  <source
                    src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>

                {/* Custom Control Overlay (optional - browser controls are already present) */}
                <div className="absolute top-4 right-4 bg-black/50 rounded-lg p-2 opacity-0 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const video = videoRef.current;
                        if (!video) return;

                        if (!document.fullscreenElement) {
                          video.requestFullscreen?.() ||
                          (video as any).webkitRequestFullscreen?.() ||
                          (video as any).mozRequestFullScreen?.() ||
                          (video as any).msRequestFullscreen?.();
                          setIsFullscreen(true);
                        } else {
                          document.exitFullscreen?.() ||
                          (document as any).webkitExitFullscreen?.() ||
                          (document as any).mozCancelFullScreen?.() ||
                          (document as any).msExitFullscreen?.();
                          setIsFullscreen(false);
                        }
                      }}
                      className="text-white hover:bg-white/20 p-2"
                      title="Toggle Fullscreen"
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Video Title Overlay */}
                <div className="absolute top-4 left-4 bg-black/50 rounded-lg px-3 py-2">
                  <h3 className="text-white font-medium text-sm">{currentTopic.title}</h3>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-600">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-60" />
                  <p className="text-lg">Non-video content</p>
                  <p className="text-sm text-gray-500">
                    {currentTopic?.type === 'quiz' ? 'Quiz Content' : 'Reading Material'}
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Video Info */}
          <div className="bg-white p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-gray-900">
                <h2 className="text-xl font-semibold">{currentTopic?.title}</h2>
                <p className="text-gray-600 text-sm">
                  {currentUnit?.title} • {currentTopic?.duration} minutes
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const prev = getPreviousTopic();
                    if (prev) handleTopicSelect(prev.id);
                  }}
                  className="text-gray-600 hover:bg-gray-100"
                  disabled={!getPreviousTopic()}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const next = getNextTopic();
                    if (next) handleTopicSelect(next.id);
                  }}
                  className="text-gray-600 hover:bg-gray-100"
                  disabled={!getNextTopic()}
                >
                  Next
                  <RotateCw className="h-4 w-4 ml-2" />
                </Button>

                <Button
                  onClick={() => markTopicComplete(selectedTopic)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content Sidebar */}
        <div className="w-96 bg-white border-l border-gray-200 max-h-screen overflow-y-auto shadow-lg">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-lg text-gray-900">Course Content</h3>
            <p className="text-sm text-gray-600">
              {courseData.units.reduce((acc, unit) => acc + unit.completedTopics, 0)} / {' '}
              {courseData.units.reduce((acc, unit) => acc + unit.totalTopics, 0)} lessons completed
            </p>
          </div>

          <Accordion type="multiple" defaultValue={courseData.units.map(unit => unit.id)}>
            {courseData.units.map((unit) => (
              <AccordionItem key={unit.id} value={unit.id}>
                <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between w-full">
                    <div className="text-left">
                      <h4 className="font-medium">{unit.title}</h4>
                      <p className="text-sm text-gray-600">
                        {unit.completedTopics}/{unit.totalTopics} lessons • {unit.totalDuration}min
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(unit.completedTopics / unit.totalTopics) * 100} 
                        className="w-16 h-2"
                      />
                      <span className="text-xs text-gray-500">
                        {Math.round((unit.completedTopics / unit.totalTopics) * 100)}%
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-2">
                    {unit.topics.map((topic) => (
                      <div
                        key={topic.id}
                        onClick={() => handleTopicSelect(topic.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedTopic === topic.id 
                            ? 'bg-blue-50 border border-blue-200' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {topic.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {topic.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{topic.duration} min</span>
                            <Badge 
                              variant={topic.type === 'video' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {topic.type}
                            </Badge>
                          </div>
                        </div>
                        {selectedTopic === topic.id && (
                          <div className="flex-shrink-0">
                            <Play className="h-4 w-4 text-blue-600" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Course Rating and Reviews */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <span className="font-semibold">4.8</span>
              <span className="text-sm text-gray-600">(1,234 reviews)</span>
            </div>
            <Button variant="outline" className="w-full mb-3">
              <MessageCircle className="h-4 w-4 mr-2" />
              Ask a Question
            </Button>
            <Button variant="outline" className="w-full">
              <Star className="h-4 w-4 mr-2" />
              Rate this Course
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
