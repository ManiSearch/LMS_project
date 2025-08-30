import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  Monitor,
  Mic,
  Square,
  Play,
  Pause,
  Download,
  Upload,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type RecordingType = 'camera' | 'screen' | 'audio' | null;

export default function RecordContentPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<RecordingType>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [supportedFeatures, setSupportedFeatures] = useState({
    camera: false,
    screen: false,
    audio: false,
    mediaRecorder: false
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check feature support on component mount
  useEffect(() => {
    const checkFeatureSupport = async () => {
      const features = {
        camera: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        screen: !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia),
        audio: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        mediaRecorder: !!(window.MediaRecorder)
      };

      // Additional check for secure context (HTTPS)
      if (!window.isSecureContext) {
        features.camera = false;
        features.screen = false;
        features.audio = false;
      }

      setSupportedFeatures(features);
    };

    checkFeatureSupport();
  }, []);

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
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const checkPermissions = async (type: RecordingType) => {
    try {
      if (type === 'camera') {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        return permission.state !== 'denied';
      } else if (type === 'audio') {
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        return permission.state !== 'denied';
      }
      return true;
    } catch (error) {
      return true;
    }
  };

  const getErrorMessage = (error: any, type: RecordingType) => {
    if (error.name === 'NotAllowedError') {
      if (type === 'screen') {
        return 'Screen recording is not allowed in this environment. This may be due to browser security policies or running in an embedded iframe. Please try opening this page in a new tab or use camera recording instead.';
      } else if (type === 'camera') {
        return 'Camera access denied. Please allow camera permissions in your browser settings and try again.';
      } else if (type === 'audio') {
        return 'Microphone access denied. Please allow microphone permissions in your browser settings and try again.';
      }
    } else if (error.name === 'NotFoundError') {
      return `No ${type} device found. Please connect a ${type} device and try again.`;
    } else if (error.name === 'NotSupportedError') {
      return `${type.charAt(0).toUpperCase() + type.slice(1)} recording is not supported in this browser.`;
    }
    return `Unable to start ${type} recording. Please check your device and browser settings.`;
  };

  const startRecording = async () => {
    try {
      if (!selectedType) return;

      const hasPermission = await checkPermissions(selectedType);
      if (!hasPermission) {
        alert(`${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} access is denied. Please check your browser permissions.`);
        return;
      }

      let mediaStream: MediaStream;

      if (selectedType === 'camera') {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera API not supported in this browser');
        }
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: true
        });
      } else if (selectedType === 'screen') {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
          throw new Error('Screen capture API not supported in this browser');
        }

        try {
          mediaStream = await navigator.mediaDevices.getDisplayMedia({
            video: {
              width: 1920,
              height: 1080,
              frameRate: 30
            },
            audio: true
          });
        } catch (screenError) {
          mediaStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: false
          });
        }
      } else if (selectedType === 'audio') {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Audio API not supported in this browser');
        }
        mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
      } else {
        return;
      }

      setStream(mediaStream);

      if (videoRef.current && selectedType !== 'audio') {
        videoRef.current.srcObject = mediaStream;
      }

      if (!MediaRecorder.isTypeSupported('video/webm') && !MediaRecorder.isTypeSupported('audio/webm')) {
        throw new Error('Recording format not supported in this browser');
      }

      const options: MediaRecorderOptions = {};
      if (selectedType === 'audio') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          options.mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          options.mimeType = 'audio/mp4';
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
        const mimeType = options.mimeType || (selectedType === 'audio' ? 'audio/webm' : 'video/webm');
        const blob = new Blob(chunks, { type: mimeType });
        setRecordedBlob(blob);
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        alert('Recording error occurred. Please try again.');
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);
      startTimer();
    } catch (error: any) {
      console.error('Error starting recording:', error);
      const errorMessage = getErrorMessage(error, selectedType);
      alert(errorMessage);
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
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        startTimer();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        stopTimer();
        setIsPaused(true);
      }
    }
  };

  const downloadRecording = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording-${selectedType}-${Date.now()}.${selectedType === 'audio' ? 'webm' : 'webm'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const resetRecording = () => {
    setSelectedType(null);
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    setRecordedBlob(null);
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    stopTimer();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/academics/courses")} className="hover:bg-gray-100">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Course
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Record Content</h1>
                <p className="text-sm text-gray-600">Record video, audio, or screen content for your course</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Create New Recording</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Recording Type Selection */}
            {!selectedType && (
              <div className="space-y-4">
                {/* Feature Support Warning */}
                {!window.isSecureContext && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-yellow-800">Secure Connection Required</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Recording features require HTTPS. Some features may not work properly.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card
                    className={`border-2 transition-all ${
                      supportedFeatures.camera
                        ? "cursor-pointer hover:shadow-md border-gray-200 hover:border-blue-300"
                        : "border-gray-300 bg-gray-50 cursor-not-allowed opacity-60"
                    }`}
                    onClick={() => supportedFeatures.camera && setSelectedType('camera')}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                        supportedFeatures.camera ? "bg-blue-100" : "bg-gray-200"
                      }`}>
                        <Camera className={`h-8 w-8 ${
                          supportedFeatures.camera ? "text-blue-600" : "text-gray-400"
                        }`} />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Camera</h3>
                      <p className="text-sm text-gray-600">Record using your webcamera</p>
                      {!supportedFeatures.camera && (
                        <p className="text-xs text-red-500 mt-2">Not available</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card
                    className={`border-2 transition-all ${
                      supportedFeatures.screen
                        ? "cursor-pointer hover:shadow-md border-gray-200 hover:border-green-300"
                        : "border-gray-300 bg-gray-50 cursor-not-allowed opacity-60"
                    }`}
                    onClick={() => supportedFeatures.screen && setSelectedType('screen')}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                        supportedFeatures.screen ? "bg-green-100" : "bg-gray-200"
                      }`}>
                        <Monitor className={`h-8 w-8 ${
                          supportedFeatures.screen ? "text-green-600" : "text-gray-400"
                        }`} />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Screen</h3>
                      <p className="text-sm text-gray-600">Record your screen</p>
                      {!supportedFeatures.screen && (
                        <p className="text-xs text-red-500 mt-2">Not available in this environment</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card
                    className={`border-2 transition-all ${
                      supportedFeatures.audio
                        ? "cursor-pointer hover:shadow-md border-gray-200 hover:border-purple-300"
                        : "border-gray-300 bg-gray-50 cursor-not-allowed opacity-60"
                    }`}
                    onClick={() => supportedFeatures.audio && setSelectedType('audio')}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                        supportedFeatures.audio ? "bg-purple-100" : "bg-gray-200"
                      }`}>
                        <Mic className={`h-8 w-8 ${
                          supportedFeatures.audio ? "text-purple-600" : "text-gray-400"
                        }`} />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Audio</h3>
                      <p className="text-sm text-gray-600">Record audio only</p>
                      {!supportedFeatures.audio && (
                        <p className="text-xs text-red-500 mt-2">Not available</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Alternative Options */}
                {(!supportedFeatures.screen || !supportedFeatures.camera) && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Alternative Options</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      {!supportedFeatures.screen && (
                        <p>• For screen recording, try opening this page in a new tab or use a desktop browser</p>
                      )}
                      {!supportedFeatures.camera && (
                        <p>• Camera recording requires browser permissions and HTTPS connection</p>
                      )}
                      <p>• You can also upload pre-recorded content using the "Upload Content" button</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Recording Interface */}
            {selectedType && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      selectedType === 'camera' ? 'bg-blue-100' :
                      selectedType === 'screen' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      {selectedType === 'camera' && <Camera className="h-4 w-4 text-blue-600" />}
                      {selectedType === 'screen' && <Monitor className="h-4 w-4 text-green-600" />}
                      {selectedType === 'audio' && <Mic className="h-4 w-4 text-purple-600" />}
                    </div>
                    <span className="font-medium capitalize">{selectedType} Recording</span>
                    {isRecording && (
                      <Badge variant="destructive" className="animate-pulse">
                        Recording {formatTime(recordingTime)}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetRecording}
                  >
                    Change Type
                  </Button>
                </div>

                {/* Video Preview */}
                {selectedType !== 'audio' && (
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Audio Recording Visualization */}
                {selectedType === 'audio' && (
                  <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <Mic className="h-16 w-16 mx-auto mb-4 opacity-60" />
                      <p className="text-lg">Audio Recording</p>
                      {isRecording && (
                        <div className="mt-4 flex justify-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="w-2 bg-green-500 rounded animate-pulse"
                              style={{
                                height: `${Math.random() * 40 + 10}px`,
                                animationDelay: `${i * 0.1}s`
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Recording Controls */}
                <div className="flex items-center justify-center gap-4">
                  {!isRecording && !recordedBlob && (
                    <Button
                      onClick={startRecording}
                      className="bg-red-600 hover:bg-red-700 text-white px-8"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Recording
                    </Button>
                  )}

                  {isRecording && (
                    <>
                      <Button
                        onClick={pauseRecording}
                        variant="outline"
                        className="px-6"
                      >
                        {isPaused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
                        {isPaused ? 'Resume' : 'Pause'}
                      </Button>
                      
                      <Button
                        onClick={stopRecording}
                        className="bg-red-600 hover:bg-red-700 text-white px-6"
                      >
                        <Square className="h-4 w-4 mr-2" />
                        Stop Recording
                      </Button>
                    </>
                  )}

                  {recordedBlob && (
                    <div className="flex gap-4">
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
                        className="px-6"
                      >
                        Record Again
                      </Button>
                    </div>
                  )}

                  {/* File Upload Fallback */}
                  {!Object.values(supportedFeatures).some(Boolean) && (
                    <div className="text-center space-y-4">
                      <p className="text-gray-600">Recording not available in this environment</p>
                      <input
                        type="file"
                        accept="video/*,audio/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setRecordedBlob(file);
                            alert('File selected! You can now download or use this content.');
                          }
                        }}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button
                        onClick={() => document.getElementById('file-upload')?.click()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Content Instead
                      </Button>
                    </div>
                  )}
                </div>

                {recordedBlob && (
                  <div className="text-center text-sm text-green-600">
                    ✓ Recording completed! Duration: {formatTime(recordingTime)}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
