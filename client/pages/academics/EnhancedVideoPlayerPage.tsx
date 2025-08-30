import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  MessageCircle,
  User,
  Calendar,
  GraduationCap,
  Award,
  Target,
  Users,
  FileText,
  Wrench,
  Thermometer,
  MoreVertical,
  Volume1,
  PictureInPicture,
  SkipBack,
  SkipForward,
  AlertTriangle
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface VideoPlayerPageProps {
  courseId?: string;
  unitId?: string;
  topicId?: string;
}

interface LessonPlanItem {
  slNo: number;
  hours: number;
  topic: string;
  learningOutcome: string;
  deliveryMethod: string;
  handsOnTasks: string;
}

interface Unit {
  id: string;
  title: string;
  totalDuration: number;
  completedTopics: number;
  totalTopics: number;
  topics: Topic[];
  lessonPlan: LessonPlanItem[];
}

interface Topic {
  id: string;
  title: string;
  duration: number;
  videoUrl: string;
  completed: boolean;
  type: 'video' | 'quiz' | 'reading' | 'practical';
  description?: string;
  learningOutcomes?: string[];
  equipment?: string[];
  materials?: string[];
}

interface CourseInstructor {
  name: string;
  title: string;
  department: string;
  specialization: string[];
  experience: string;
  qualifications: string[];
  researchAreas: string[];
  contact: {
    email: string;
    phone: string;
    office: string;
  };
}

export default function EnhancedVideoPlayerPage({ courseId, unitId, topicId }: VideoPlayerPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
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
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);

  // Enhanced course data based on HVAC lesson plan
  const courseData = {
    id: 'course-hvac-001',
    name: 'HVAC Systems and Components',
    code: '1020235546',
    courseType: 'Practicum',
    credits: 4,
    duration: '120 hours',
    description: 'Comprehensive course covering HVAC (Heating, Ventilation, and Air Conditioning) systems, components, and practical applications including compressors, condensers, expansion devices, evaporators, and system controls.',
    objectives: [
      'Understand the functions and working principles of HVAC components',
      'Gain hands-on experience with refrigeration systems',
      'Learn proper maintenance and troubleshooting techniques',
      'Master system installation and commissioning procedures'
    ],
    prerequisites: [
      'Basic Electrical Engineering',
      'Thermodynamics Fundamentals',
      'Mechanical Engineering Basics'
    ],
    instructors: [
      {
        name: 'Dr. Rajesh Kumar',
        title: 'Professor & Head',
        department: 'Mechanical Engineering',
        specialization: ['HVAC Systems', 'Refrigeration Technology', 'Energy Efficiency'],
        experience: '15+ years in HVAC industry and academia',
        qualifications: [
          'Ph.D. in Mechanical Engineering (Thermal Sciences)',
          'M.Tech in Refrigeration and Air Conditioning',
          'Certified Energy Manager (CEM)',
          'ASHRAE Professional Member'
        ],
        researchAreas: [
          'Energy Efficient HVAC Systems',
          'Renewable Energy Integration',
          'Building Automation Systems',
          'Sustainable Cooling Technologies'
        ],
        contact: {
          email: 'rajesh.kumar@institution.edu',
          phone: '+91-9876543210',
          office: 'Room 204, Mechanical Engineering Block'
        }
      },
      {
        name: 'Prof. Sunita Reddy',
        title: 'Associate Professor',
        department: 'Mechanical Engineering',
        specialization: ['Industrial Refrigeration', 'Heat Transfer', 'Fluid Mechanics'],
        experience: '12+ years in thermal systems design',
        qualifications: [
          'M.Tech in Thermal Engineering',
          'B.Tech in Mechanical Engineering',
          'Certified HVAC Designer',
          'Six Sigma Green Belt'
        ],
        researchAreas: [
          'Heat Exchanger Design',
          'CFD Analysis of HVAC Systems',
          'Thermal Comfort Studies'
        ],
        contact: {
          email: 'sunita.reddy@institution.edu',
          phone: '+91-9876543211',
          office: 'Room 108, Mechanical Engineering Block'
        }
      }
    ] as CourseInstructor[],
    progress: 35,
    totalStudents: 45,
    rating: 4.8,
    reviews: 156,
    lastUpdated: '2024-01-30',
    practicalHours: 80,
    theoryHours: 40,
    assessmentMethods: [
      'Practical Demonstrations (40%)',
      'Written Examinations (30%)',
      'Laboratory Reports (20%)',
      'Project Work (10%)'
    ],
    units: [
      {
        id: 'unit-1',
        title: 'Unit I: Compressor Systems',
        totalDuration: 180, // minutes
        completedTopics: 2,
        totalTopics: 3,
        lessonPlan: [
          {
            slNo: 1,
            hours: 1,
            topic: 'Functions of a compressor',
            learningOutcome: 'Understand the Functions of the Compressor',
            deliveryMethod: 'Lecture with PPT + Discussion',
            handsOnTasks: 'Hands on experience in compressor'
          },
          {
            slNo: 2,
            hours: 1,
            topic: 'Construction and working of open type reciprocating compressor',
            learningOutcome: 'Explain the construction and working of open type reciprocating compressor',
            deliveryMethod: 'Whiteboard explanation + Q&A',
            handsOnTasks: 'Hands on experience with reciprocating compressor'
          },
          {
            slNo: 3,
            hours: 1,
            topic: 'Construction and working of Hermetically sealed compressors',
            learningOutcome: 'Explain the construction and working of Hermetically sealed compressor',
            deliveryMethod: 'Whiteboard explanation + Q&A',
            handsOnTasks: 'Hands on experience in Hermetically sealed compressor'
          }
        ],
        topics: [
          {
            id: 'topic-1',
            title: 'Compressor Functions and Types',
            duration: 60,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            completed: true,
            type: 'video' as const,
            description: 'Comprehensive overview of compressor functions, types, and applications in HVAC systems',
            learningOutcomes: [
              'Identify different types of compressors',
              'Understand compression cycles',
              'Analyze performance characteristics'
            ],
            equipment: ['Reciprocating compressor model', 'Pressure gauges', 'Temperature sensors'],
            materials: ['Refrigerant samples', 'Lubricating oils', 'Safety equipment']
          },
          {
            id: 'topic-2',
            title: 'Open Type Reciprocating Compressors',
            duration: 75,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            completed: true,
            type: 'video' as const,
            description: 'Detailed study of open type reciprocating compressor construction, operation, and maintenance',
            learningOutcomes: [
              'Explain construction details',
              'Perform maintenance procedures',
              'Troubleshoot common issues'
            ],
            equipment: ['Open type compressor unit', 'Disassembly tools', 'Measuring instruments'],
            materials: ['Gasket sets', 'Valve plates', 'Piston rings']
          },
          {
            id: 'topic-3',
            title: 'Hermetically Sealed Compressors',
            duration: 45,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            completed: false,
            type: 'video' as const,
            description: 'Understanding hermetically sealed compressor design, advantages, and testing procedures',
            learningOutcomes: [
              'Compare sealed vs open designs',
              'Test compressor performance',
              'Identify failure modes'
            ],
            equipment: ['Sealed compressor units', 'Testing equipment', 'Safety tools'],
            materials: ['Refrigerants', 'Testing gases', 'Safety gear']
          }
        ]
      },
      {
        id: 'unit-2',
        title: 'Unit II: Condenser Systems',
        totalDuration: 180,
        completedTopics: 0,
        totalTopics: 3,
        lessonPlan: [
          {
            slNo: 4,
            hours: 1,
            topic: 'Functions of a Condenser',
            learningOutcome: 'Understand the Functions of the Condenser',
            deliveryMethod: 'Lecture with PPT + Discussion',
            handsOnTasks: 'Hands on experience on Condenser'
          },
          {
            slNo: 5,
            hours: 1,
            topic: 'Construction and working of Air cooled condenser',
            learningOutcome: 'Explain the construction and working of Air cooled condenser',
            deliveryMethod: 'Whiteboard explanation + Q&A',
            handsOnTasks: 'Hands on experience in air cooled condenser'
          },
          {
            slNo: 6,
            hours: 1,
            topic: 'Construction and working of Water cooled condenser',
            learningOutcome: 'Explain the construction and working of Water cooled condenser',
            deliveryMethod: 'Whiteboard explanation + Q&A',
            handsOnTasks: 'Hands on experience in water cooled condenser'
          }
        ],
        topics: [
          {
            id: 'topic-4',
            title: 'Condenser Functions and Heat Transfer',
            duration: 60,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            completed: false,
            type: 'video' as const,
            description: 'Study of condenser functions, heat transfer principles, and performance evaluation',
            learningOutcomes: [
              'Understand heat rejection process',
              'Calculate heat transfer rates',
              'Evaluate condenser efficiency'
            ],
            equipment: ['Condenser units', 'Heat transfer measurement tools', 'Flow meters'],
            materials: ['Cooling water', 'Refrigerant samples', 'Cleaning chemicals']
          },
          {
            id: 'topic-5',
            title: 'Air Cooled Condensers',
            duration: 60,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            completed: false,
            type: 'video' as const,
            description: 'Design, installation, and maintenance of air cooled condenser systems',
            learningOutcomes: [
              'Design air cooled systems',
              'Install and commission',
              'Perform routine maintenance'
            ],
            equipment: ['Air cooled condenser units', 'Fan motors', 'Control systems'],
            materials: ['Fin cleaning tools', 'Motor lubricants', 'Electrical components']
          },
          {
            id: 'topic-6',
            title: 'Water Cooled Condensers',
            duration: 60,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            completed: false,
            type: 'video' as const,
            description: 'Water cooled condenser systems, cooling tower integration, and water treatment',
            learningOutcomes: [
              'Design water cooling systems',
              'Integrate with cooling towers',
              'Implement water treatment'
            ],
            equipment: ['Water cooled condensers', 'Cooling towers', 'Water pumps'],
            materials: ['Water treatment chemicals', 'Pipe fittings', 'Insulation materials']
          }
        ]
      },
      {
        id: 'unit-3',
        title: 'Unit III: Expansion Devices',
        totalDuration: 120,
        completedTopics: 0,
        totalTopics: 3,
        lessonPlan: [
          {
            slNo: 7,
            hours: 1,
            topic: 'Functions of Expansion device',
            learningOutcome: 'Understand the Functions of the Expansion device',
            deliveryMethod: 'Lecture with PPT + Discussion',
            handsOnTasks: 'Hands on experience on expansion valve'
          },
          {
            slNo: 8,
            hours: 1,
            topic: 'Construction and working of Automatic expansion valve',
            learningOutcome: 'Explain the construction and working of Automatic expansion valve',
            deliveryMethod: 'Whiteboard explanation + Q&A',
            handsOnTasks: 'Hands on experience on automatic expansion valve'
          },
          {
            slNo: 9,
            hours: 1,
            topic: 'Construction and working of Thermostatic expansion valve',
            learningOutcome: 'Explain the construction and working of Thermostatic expansion valve',
            deliveryMethod: 'Whiteboard explanation + Q&A',
            handsOnTasks: 'Hands on experience on Thermostatic expansion valve'
          }
        ],
        topics: [
          {
            id: 'topic-7',
            title: 'Expansion Device Principles',
            duration: 40,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            completed: false,
            type: 'video' as const
          },
          {
            id: 'topic-8',
            title: 'Automatic Expansion Valves',
            duration: 40,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            completed: false,
            type: 'video' as const
          },
          {
            id: 'topic-9',
            title: 'Thermostatic Expansion Valves',
            duration: 40,
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
    const updateDuration = () => {
      setDuration(video.duration);
      console.log('Video duration loaded:', video.duration);
    };
    const handlePlay = () => {
      setIsPlaying(true);
      console.log('Video started playing');
    };
    const handlePause = () => {
      setIsPlaying(false);
      console.log('Video paused');
    };
    const handleLoadedData = () => {
      setVideoLoaded(true);
      setVideoError(null);
      console.log('Video data loaded successfully');
      // Hide loading overlay
      const loadingElement = document.getElementById('video-loading');
      if (loadingElement) {
        loadingElement.style.opacity = '0';
        setTimeout(() => {
          loadingElement.style.display = 'none';
        }, 300);
      }
    };
    const handleError = (e: Event) => {
      setVideoError('Failed to load video. Please try refreshing the page.');
      setVideoLoaded(false);
      console.error('Video error:', e);
    };
    const handleCanPlay = () => {
      console.log('Video can play');
      setVideoError(null);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);

    // Test video loading on mount
    if (video.readyState >= 2) {
      handleLoadedData();
    }

    // Fullscreen change event handlers
    const handleFullscreenChange = () => {
      const isFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isFullscreen);
      console.log('Fullscreen state changed:', isFullscreen);
    };

    // Add fullscreen event listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Keyboard shortcuts for fullscreen
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if the video player area is focused or if the target is the video
      const videoContainer = video.parentElement;
      const isVideoFocused = document.activeElement === video ||
                           (videoContainer && videoContainer.contains(document.activeElement as Node));

      if (event.key === 'f' || event.key === 'F') {
        if (isVideoFocused || event.target === video) {
          event.preventDefault();
          toggleFullscreen();
        }
      }

      if (event.key === 'Escape' && isFullscreen) {
        // ESC key handled by browser, but we can add custom logic here if needed
        console.log('ESC pressed - fullscreen will exit');
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);

      // Remove fullscreen event listeners
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedTopic]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(error => {
        console.error('Error playing video:', error);
      });
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (!document.fullscreenElement) {
        // Try to make the video element fullscreen
        let fullscreenPromise: Promise<void> | undefined;

        if (video.requestFullscreen) {
          fullscreenPromise = video.requestFullscreen();
        } else if ((video as any).webkitRequestFullscreen) {
          fullscreenPromise = (video as any).webkitRequestFullscreen();
        } else if ((video as any).mozRequestFullScreen) {
          fullscreenPromise = (video as any).mozRequestFullScreen();
        } else if ((video as any).msRequestFullscreen) {
          fullscreenPromise = (video as any).msRequestFullscreen();
        }

        if (fullscreenPromise) {
          await fullscreenPromise;
          setIsFullscreen(true);
          console.log('Entered fullscreen mode');
        } else {
          console.warn('Fullscreen API not supported');
        }
      } else {
        // Exit fullscreen
        let exitPromise: Promise<void> | undefined;

        if (document.exitFullscreen) {
          exitPromise = document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          exitPromise = (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          exitPromise = (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          exitPromise = (document as any).msExitFullscreen();
        }

        if (exitPromise) {
          await exitPromise;
          setIsFullscreen(false);
          console.log('Exited fullscreen mode');
        }
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
      // Fallback: try to make the video container fullscreen instead
      try {
        const videoContainer = video.parentElement;
        if (videoContainer && !document.fullscreenElement) {
          if (videoContainer.requestFullscreen) {
            await videoContainer.requestFullscreen();
            setIsFullscreen(true);
            console.log('Fallback: Container fullscreen successful');
          }
        }
      } catch (fallbackError) {
        console.error('Fallback fullscreen failed:', fallbackError);
        alert('Fullscreen not supported in this browser. Please try using F11 key or browser fullscreen option.');
      }
    }
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = value[0];
    setCurrentTime(value[0]);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header with Course Info */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/academics/courses')}
                className="text-gray-700 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Button>
              <div className="border-l border-gray-300 pl-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Thermometer className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{courseData.name}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {courseData.code}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {courseData.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        {courseData.credits} Credits
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Progress</div>
                <div className="flex items-center gap-2">
                  <Progress value={courseData.progress} className="w-32" />
                  <span className="text-sm font-medium text-gray-900">{courseData.progress}%</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        {/* Enhanced Video Player */}
        <div className="flex-1 bg-white p-6">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
            {currentTopic && currentTopic.type === 'video' ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain bg-black cursor-pointer"
                  controls
                  preload="metadata"
                  playsInline
                  autoPlay={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onDoubleClick={toggleFullscreen}
                  onLoadStart={() => {
                    console.log('Video loading started');
                  }}
                  onCanPlay={() => {
                    console.log('Video can play');
                    const loadingElement = document.getElementById('video-loading');
                    if (loadingElement) loadingElement.style.opacity = '0';
                  }}
                  onError={(e) => {
                    console.error('Video error:', e);
                  }}
                >
                  {/* Primary video source - Big Buck Bunny (reliable test video) */}
                  <source
                    src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                    type="video/mp4"
                  />
                  {/* Fallback video source */}
                  <source
                    src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
                    type="video/mp4"
                  />
                  {/* Additional fallback */}
                  <source
                    src="https://file-examples.com/storage/fe8b5d17a37b8e2e6b5282a/2017/10/file_example_MP4_480_1_5MG.mp4"
                    type="video/mp4"
                  />
                  <track
                    kind="subtitles"
                    src=""
                    srcLang="en"
                    label="English"
                    default
                  />
                  Your browser does not support the video tag.
                </video>

                {/* Enhanced Control Overlay */}
                <div className="absolute top-4 right-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-2 bg-black/70 rounded-lg p-2">
                    {/* Fullscreen Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleFullscreen}
                      className={`text-white hover:bg-white/20 p-2 transition-all duration-200 ${
                        isFullscreen ? 'bg-white/20 ring-1 ring-white/30' : ''
                      }`}
                      title={isFullscreen ? "Exit Fullscreen (Double-click video or press ESC)" : "Enter Fullscreen (Double-click video or click here)"}
                    >
                      <Maximize className={`h-4 w-4 transition-transform duration-200 ${
                        isFullscreen ? 'rotate-180' : ''
                      }`} />
                    </Button>

                    {/* Speed Control */}
                    <select
                      value={playbackSpeed}
                      onChange={(e) => changePlaybackSpeed(Number(e.target.value))}
                      className="bg-black/50 text-white text-xs rounded px-2 py-1 border border-white/20"
                      title="Playback Speed"
                    >
                      <option value={0.5}>0.5x</option>
                      <option value={0.75}>0.75x</option>
                      <option value={1}>Normal</option>
                      <option value={1.25}>1.25x</option>
                      <option value={1.5}>1.5x</option>
                      <option value={2}>2x</option>
                    </select>

                    {/* Three-Dot Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20 p-2"
                          title="More Options"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48 bg-black/90 text-white border-gray-600">
                        <DropdownMenuItem
                          onClick={() => {
                            const video = videoRef.current;
                            if (video) {
                              if (document.pictureInPictureEnabled && !document.pictureInPictureElement) {
                                video.requestPictureInPicture();
                              }
                            }
                          }}
                          className="flex items-center gap-2 text-white hover:bg-white/20"
                        >
                          <PictureInPicture className="h-4 w-4" />
                          Picture in Picture
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            const video = videoRef.current;
                            if (video) {
                              video.currentTime = Math.max(0, video.currentTime - 10);
                            }
                          }}
                          className="flex items-center gap-2 text-white hover:bg-white/20"
                        >
                          <SkipBack className="h-4 w-4" />
                          Rewind 10s
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            const video = videoRef.current;
                            if (video) {
                              video.currentTime = Math.min(video.duration, video.currentTime + 10);
                            }
                          }}
                          className="flex items-center gap-2 text-white hover:bg-white/20"
                        >
                          <SkipForward className="h-4 w-4" />
                          Forward 10s
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-600" />
                        <DropdownMenuItem
                          onClick={() => {
                            const video = videoRef.current;
                            if (video) {
                              video.currentTime = 0;
                            }
                          }}
                          className="flex items-center gap-2 text-white hover:bg-white/20"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Restart Video
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            const video = videoRef.current;
                            if (video) {
                              const link = document.createElement('a');
                              link.href = video.src;
                              link.download = `${currentTopic?.title || 'video'}.mp4`;
                              link.click();
                            }
                          }}
                          className="flex items-center gap-2 text-white hover:bg-white/20"
                        >
                          <Download className="h-4 w-4" />
                          Download Video
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Video Title and Progress Overlay */}
                <div className="absolute top-4 left-4 bg-black/70 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium text-sm">{currentTopic.title}</h3>
                    {isFullscreen && (
                      <Badge variant="secondary" className="bg-blue-600 text-white text-xs px-2 py-0.5">
                        Fullscreen
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <Clock className="h-3 w-3" />
                    <span>{currentTopic.duration} minutes</span>
                    <span>•</span>
                    <span>{currentUnit?.title}</span>
                    {isFullscreen && (
                      <>
                        <span>•</span>
                        <span>Press F or double-click to exit</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Play Button Overlay for Manual Start */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-100 hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => {
                      const video = videoRef.current;
                      if (video) {
                        if (video.paused) {
                          video.play();
                        } else {
                          video.pause();
                        }
                      }
                    }}
                    className="text-white hover:bg-white/20 w-16 h-16 rounded-full pointer-events-auto"
                    title="Play/Pause Video"
                  >
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                  </Button>
                </div>

                {/* Loading State */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-100 transition-opacity duration-300" id="video-loading">
                  <div className="bg-black/70 rounded-lg px-4 py-2">
                    <div className="text-white text-sm flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Loading video...
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center text-gray-600">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-60" />
                  <p className="text-lg">Content Loading...</p>
                  <p className="text-sm text-gray-500">Please check your internet connection</p>
                </div>
              </div>
            )}

            {/* Video Error Display */}
            {videoError && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg">
                <div className="text-center text-red-600 p-6">
                  <AlertTriangle className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Video Error</p>
                  <p className="text-sm mb-4">{videoError}</p>
                  <Button
                    onClick={() => {
                      setVideoError(null);
                      const video = videoRef.current;
                      if (video) {
                        video.load(); // Reload video
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Retry Video
                  </Button>
                </div>
              </div>
            )}

            {/* Video Test Controls */}
            <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg p-2 opacity-0 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const video = videoRef.current;
                    if (video) {
                      video.play().then(() => {
                        console.log('Video play successful');
                      }).catch((error) => {
                        console.error('Video play failed:', error);
                        setVideoError('Failed to play video. Click to retry.');
                      });
                    }
                  }}
                  className="text-white hover:bg-white/20 text-xs px-2 py-1"
                  title="Test Video Play"
                >
                  Test Play
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const video = videoRef.current;
                    if (video) {
                      console.log('Video state:', {
                        src: video.currentSrc,
                        readyState: video.readyState,
                        networkState: video.networkState,
                        error: video.error,
                        canPlay: video.readyState >= 2
                      });
                    }
                  }}
                  className="text-white hover:bg-white/20 text-xs px-2 py-1"
                  title="Debug Video"
                >
                  Debug
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Topic Information */}
          <div className="mt-6 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentTopic?.title}</h2>
                  <p className="text-gray-600 mb-3">{currentTopic?.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {currentTopic?.duration} minutes
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {currentUnit?.title}
                    </span>
                    <Badge variant="secondary">{currentTopic?.type}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Resources
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete
                  </Button>
                </div>
              </div>

              {/* Learning Outcomes */}
              {currentTopic?.learningOutcomes && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Learning Outcomes</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {currentTopic.learningOutcomes.map((outcome, index) => (
                      <li key={index}>{outcome}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Equipment and Materials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentTopic?.equipment && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      Equipment Required
                    </h3>
                    <ul className="space-y-1 text-gray-600">
                      {currentTopic.equipment.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Settings className="h-3 w-3 text-gray-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentTopic?.materials && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Materials Needed
                    </h3>
                    <ul className="space-y-1 text-gray-600">
                      {currentTopic.materials.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Circle className="h-3 w-3 text-gray-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Instructor Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Course Instructors
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {courseData.instructors.map((instructor, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{instructor.name}</h4>
                        <p className="text-sm text-gray-600">{instructor.title}</p>
                        <p className="text-xs text-gray-500">{instructor.department}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-medium text-gray-700">Experience</p>
                        <p className="text-gray-600">{instructor.experience}</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-700">Specialization</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {instructor.specialization.map((spec, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="font-medium text-gray-700">Contact</p>
                        <p className="text-gray-600">{instructor.contact.email}</p>
                        <p className="text-gray-600">{instructor.contact.office}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Syllabus & Lesson Plan */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Course Syllabus & Lesson Plan
              </h3>

              {/* Course Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Course Objectives</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {courseData.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Target className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Prerequisites</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {courseData.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <BookOpen className="h-3 w-3 text-green-500" />
                        {prereq}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Assessment Methods */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Assessment Methods</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {courseData.assessmentMethods.map((method, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                      <Award className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">{method}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Unit Lesson Plan */}
              {currentUnit?.lessonPlan && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {currentUnit.title} - Lesson Plan
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-gray-200 rounded-lg">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Sl.No</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Hours</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Topic</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Learning Outcome</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Delivery Method</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Hands-on Tasks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentUnit.lessonPlan.map((lesson, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-3 py-2 text-center font-medium">{lesson.slNo}</td>
                            <td className="px-3 py-2 text-center">{lesson.hours}hr</td>
                            <td className="px-3 py-2 font-medium">{lesson.topic}</td>
                            <td className="px-3 py-2 text-gray-600">{lesson.learningOutcome}</td>
                            <td className="px-3 py-2 text-gray-600">{lesson.deliveryMethod}</td>
                            <td className="px-3 py-2 text-gray-600">{lesson.handsOnTasks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Course Content Sidebar */}
        <div className="w-96 bg-white border-l border-gray-200 max-h-screen overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">Course Content</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Progress:</span>
                <span className="font-medium">{courseData.progress}% Complete</span>
              </div>
              <div className="flex justify-between">
                <span>Total Duration:</span>
                <span className="font-medium">{courseData.duration}</span>
              </div>
              <div className="flex justify-between">
                <span>Students Enrolled:</span>
                <span className="font-medium">{courseData.totalStudents}</span>
              </div>
            </div>
          </div>

          <Accordion type="multiple" defaultValue={courseData.units.map(unit => unit.id)}>
            {courseData.units.map((unit) => (
              <AccordionItem key={unit.id} value={unit.id}>
                <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between w-full">
                    <div className="text-left">
                      <h4 className="font-medium">{unit.title}</h4>
                      <p className="text-sm text-gray-600">
                        {unit.completedTopics}/{unit.totalTopics} topics • {unit.totalDuration}min
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

          {/* Course Rating and Additional Info */}
          <div className="p-4 border-t border-gray-200">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="font-semibold">{courseData.rating}</span>
                <span className="text-sm text-gray-600">({courseData.reviews} reviews)</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Practical Hours:</span>
                  <span className="font-medium">{courseData.practicalHours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Theory Hours:</span>
                  <span className="font-medium">{courseData.theoryHours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">{courseData.lastUpdated}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Discussion Forum
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Materials
                </Button>
                <Button variant="outline" className="w-full">
                  <Star className="h-4 w-4 mr-2" />
                  Rate Course
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
