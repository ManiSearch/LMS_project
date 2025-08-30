import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Camera,
  Monitor,
  Mic,
  Square,
  Play,
  Pause,
  Download,
  Upload,
  Save,
  Settings,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileVideo,
  FileAudio
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

const TopicRecordingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get parameters from URL
  const topicId = searchParams.get('topicId') || 'new-topic';
  const topicTitle = searchParams.get('topicTitle') || 'New Topic';
  const unitId = searchParams.get('unitId') || '';
  const unitTitle = searchParams.get('unitTitle') || '';
  const courseId = searchParams.get('courseId') || '';
  const recordingType = (searchParams.get('type') as 'camera' | 'screen' | 'audio') || 'camera';

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Recording settings
  const [recordingQuality, setRecordingQuality] = useState('720p');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Content metadata
  const [contentTitle, setContentTitle] = useState(topicTitle);
  const [contentDescription, setContentDescription] = useState('');
  const [contentTags, setContentTags] = useState('');

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check feature support on component mount
  useEffect(() => {
    const checkSupport = () => {
      if (!window.isSecureContext && window.location.protocol !== 'http:') {
        setIsSupported(false);
        return;
      }

      let supported = false;
      if (recordingType === 'camera' || recordingType === 'audio') {
        supported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      } else if (recordingType === 'screen') {
        supported = !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia);
      }
      
      setIsSupported(supported && !!(window.MediaRecorder));
    };

    checkSupport();
  }, [recordingType]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [stream]);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRecordingTypeConfig = () => {
    switch (recordingType) {
      case 'camera':
        return {
          title: 'Camera Recording',
          icon: Camera,
          color: 'blue',
          bgColor: 'bg-blue-500',
          description: 'Record yourself using your webcam'
        };
      case 'screen':
        return {
          title: 'Screen Recording',
          icon: Monitor,
          color: 'green',
          bgColor: 'bg-green-500',
          description: 'Record your screen and applications'
        };
      case 'audio':
        return {
          title: 'Audio Recording',
          icon: Mic,
          color: 'purple',
          bgColor: 'bg-purple-500',
          description: 'Record audio narration or lecture'
        };
    }
  };

  const config = getRecordingTypeConfig();
  const IconComponent = config.icon;

  const getVideoConstraints = () => {
    switch (recordingQuality) {
      case '480p':
        return { width: 640, height: 480 };
      case '720p':
        return { width: 1280, height: 720 };
      case '1080p':
        return { width: 1920, height: 1080 };
      default:
        return { width: 1280, height: 720 };
    }
  };

  const startRecording = async () => {
    try {
      let mediaStream: MediaStream;

      if (recordingType === 'camera') {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: getVideoConstraints(),
          audio: audioEnabled
        });
      } else if (recordingType === 'screen') {
        try {
          mediaStream = await navigator.mediaDevices.getDisplayMedia({
            video: {
              ...getVideoConstraints(),
              frameRate: 30
            },
            audio: audioEnabled
          });
        } catch (screenError) {
          mediaStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: false
          });
        }
      } else if (recordingType === 'audio') {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 44100
          }
        });
      } else {
        return;
      }

      setStream(mediaStream);

      if (videoRef.current && recordingType !== 'audio') {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.muted = isMuted;
      }

      const options: MediaRecorderOptions = {};
      if (recordingType === 'audio') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          options.mimeType = 'audio/webm;codecs=opus';
        }
      } else {
        if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
          options.mimeType = 'video/webm;codecs=vp9';
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
          options.mimeType = 'video/webm;codecs=vp8';
        }
      }

      const mediaRecorder = new MediaRecorder(mediaStream, options);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = options.mimeType || (recordingType === 'audio' ? 'audio/webm' : 'video/webm');
        const blob = new Blob(chunks, { type: mimeType });
        setRecordedBlob(blob);
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);
      startTimer();

      toast.success(`Started ${recordingType} recording`);
    } catch (error: any) {
      console.error('Error starting recording:', error);
      let errorMessage = `Unable to start ${recordingType} recording.`;
      
      if (error.name === 'NotAllowedError') {
        errorMessage = `${recordingType.charAt(0).toUpperCase() + recordingType.slice(1)} access denied. Please allow permissions and try again.`;
      } else if (error.name === 'NotFoundError') {
        errorMessage = `No ${recordingType} device found.`;
      }
      
      toast.error(errorMessage);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopTimer();
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }

      toast.success('Recording stopped successfully');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        startTimer();
        setIsPaused(false);
        toast.success('Recording resumed');
      } else {
        mediaRecorderRef.current.pause();
        stopTimer();
        setIsPaused(true);
        toast.success('Recording paused');
      }
    }
  };

  const downloadRecording = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.href = url;
      const extension = recordingType === 'audio' ? 'webm' : 'webm';
      a.download = `${contentTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${recordingType}_${Date.now()}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Recording downloaded');
    }
  };

  const resetRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    setRecordedBlob(null);
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    stopTimer();
    toast.success('Recording reset');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSaveAndReturn = () => {
    if (recordedBlob) {
      // In a real implementation, you would upload the blob to your server here
      const mimeType = recordedBlob.type || (recordingType === 'audio' ? 'audio/webm' : 'video/webm');
      const extension = recordingType === 'audio' ? 'webm' : 'webm';
      const filename = `${contentTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${recordingType}_${Date.now()}.${extension}`;

      // For demo purposes, we'll show a success message
      toast.success('Recording saved successfully to topic content!');

      // Navigate back to course structure page
      const courseContentUrl = courseId
        ? `/academics/course-content/${courseId}`
        : '/academics/courses';
      navigate(courseContentUrl);
    } else {
      // Navigate back to course structure page
      const courseContentUrl = courseId
        ? `/academics/course-content/${courseId}`
        : '/academics/courses';
      navigate(courseContentUrl);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => {
                  // Navigate back to course structure page instead of using browser history
                  // const courseContentUrl = courseId
                  //   ? `/academics/course-content/${courseId}`
                  //   : '/academics/courses';
                  navigate("/academics/courses");
                }}
                className="text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Course Structure
              </Button>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bgColor}`}>
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">{config.title}</h1>
                  <p className="text-sm text-gray-400">{topicTitle}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {isRecording && (
                <Badge variant="destructive" className="animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                  REC {formatTime(recordingTime)}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-gray-300 hover:text-white hover:bg-gray-700"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Recording Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recording Preview */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                {!isSupported ? (
                  <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
                      <h3 className="text-lg font-medium mb-2 text-white">Recording Not Available</h3>
                      <p className="text-gray-400 mb-4">
                        {config.title} is not supported in this environment.
                      </p>
                      <input
                        type="file"
                        accept={recordingType === 'audio' ? 'audio/*' : 'video/*,audio/*'}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setRecordedBlob(file);
                          }
                        }}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button
                        onClick={() => document.getElementById('file-upload')?.click()}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload File Instead
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Video Preview for camera and screen recording */}
                    {recordingType !== 'audio' ? (
                      <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                        <video
                          ref={videoRef}
                          autoPlay
                          className="w-full h-full object-cover"
                        />
                        {recordingType !== 'audio' && (
                          <div className="absolute bottom-4 right-4 flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={toggleMute}
                              className="bg-black/50 hover:bg-black/70 text-white"
                            >
                              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                            </Button>
                          </div>
                        )}
                        {!stream && !isRecording && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <div className="text-center">
                              <IconComponent className="h-16 w-16 mx-auto mb-4 text-white opacity-60" />
                              <p className="text-white text-lg">Ready to record {recordingType}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Audio Recording Visualization */
                      <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Mic className={`h-20 w-20 mx-auto mb-6 ${isRecording ? 'text-red-500' : 'text-gray-400'}`} />
                          <p className="text-white text-xl mb-4">Audio Recording</p>
                          {isRecording && (
                            <div className="flex justify-center space-x-1">
                              {[...Array(8)].map((_, i) => (
                                <div
                                  key={i}
                                  className="w-3 bg-green-500 rounded-full animate-pulse"
                                  style={{
                                    height: `${Math.random() * 60 + 20}px`,
                                    animationDelay: `${i * 0.1}s`
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recording Controls */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-4">
                  {!isRecording && !recordedBlob && (
                    <Button
                      onClick={startRecording}
                      disabled={!isSupported}
                      className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
                    >
                      <div className="w-3 h-3 bg-white rounded-full mr-3"></div>
                      Start Recording
                    </Button>
                  )}

                  {isRecording && (
                    <>
                      <Button
                        onClick={pauseRecording}
                        variant="outline"
                        className="px-6 py-3 border-gray-600 text-white hover:bg-gray-700"
                      >
                        {isPaused ? <Play className="h-5 w-5 mr-2" /> : <Pause className="h-5 w-5 mr-2" />}
                        {isPaused ? 'Resume' : 'Pause'}
                      </Button>
                      
                      <Button
                        onClick={stopRecording}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
                      >
                        <Square className="h-5 w-5 mr-2" />
                        Stop Recording
                      </Button>
                    </>
                  )}

                  {recordedBlob && (
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span>Recording Complete ({formatTime(recordingTime)})</span>
                      </div>
                      
                      <Button
                        onClick={downloadRecording}
                        className="bg-green-600 hover:bg-green-700 text-white px-6"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>

                      <Button
                        onClick={resetRecording}
                        variant="outline"
                        className="border-gray-600 text-white hover:bg-gray-700 px-6"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Record Again
                      </Button>

                      <Button
                        onClick={handleSaveAndReturn}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save & Return
                      </Button>
                    </div>
                  )}
                </div>

                {/* Recording Info */}
                {isRecording && (
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full">
                      <div className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></div>
                      Recording in progress... {formatTime(recordingTime)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings and Content Info Sidebar */}
          <div className="space-y-6">
            {/* Recording Settings */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Settings className="h-5 w-5 mr-2" />
                  Recording Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recordingType !== 'audio' && (
                  <div className="space-y-2">
                    <Label className="text-gray-300">Video Quality</Label>
                    <Select value={recordingQuality} onValueChange={setRecordingQuality} disabled={isRecording}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="480p">480p (SD)</SelectItem>
                        <SelectItem value="720p">720p (HD)</SelectItem>
                        <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Label className="text-gray-300">Enable Audio</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    disabled={isRecording}
                    className={`${audioEnabled ? 'text-green-400' : 'text-gray-500'} hover:bg-gray-700`}
                  >
                    {audioEnabled ? <Mic className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                </div>

                <Separator className="bg-gray-600" />

                <div className="space-y-3">
                  <div className="flex items-center text-gray-400">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">Duration: {formatTime(recordingTime)}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    {recordingType === 'audio' ? <FileAudio className="h-4 w-4 mr-2" /> : <FileVideo className="h-4 w-4 mr-2" />}
                    <span className="text-sm">Format: WebM</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Metadata */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Content Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Content Title</Label>
                  <Input
                    value={contentTitle}
                    onChange={(e) => setContentTitle(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    disabled={isRecording}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Description</Label>
                  <Textarea
                    value={contentDescription}
                    onChange={(e) => setContentDescription(e.target.value)}
                    placeholder="Describe the content of this recording..."
                    className="bg-gray-700 border-gray-600 text-white min-h-[80px]"
                    disabled={isRecording}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Tags</Label>
                  <Input
                    value={contentTags}
                    onChange={(e) => setContentTags(e.target.value)}
                    placeholder="e.g., lecture, demo, tutorial"
                    className="bg-gray-700 border-gray-600 text-white"
                    disabled={isRecording}
                  />
                </div>

                <Separator className="bg-gray-600" />

                <div className="text-sm text-gray-400 space-y-1">
                  <p><span className="font-medium">Unit:</span> {unitTitle}</p>
                  <p><span className="font-medium">Topic:</span> {topicTitle}</p>
                  <p><span className="font-medium">Type:</span> {config.title}</p>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recording Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-400">
                  {recordingType === 'camera' && (
                    <>
                      <p>• Ensure good lighting on your face</p>
                      <p>• Look directly at the camera</p>
                      <p>• Minimize background distractions</p>
                    </>
                  )}
                  {recordingType === 'screen' && (
                    <>
                      <p>• Close unnecessary applications</p>
                      <p>• Use a clean desktop background</p>
                      <p>• Speak clearly while demonstrating</p>
                    </>
                  )}
                  {recordingType === 'audio' && (
                    <>
                      <p>• Use a quiet environment</p>
                      <p>• Speak at a steady pace</p>
                      <p>• Test audio levels before recording</p>
                    </>
                  )}
                  <p>• Keep recordings focused and concise</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicRecordingPage;
