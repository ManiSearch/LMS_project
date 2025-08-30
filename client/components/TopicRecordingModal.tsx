import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  X
} from 'lucide-react';

interface TopicRecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicId: string;
  topicTitle: string;
  recordingType: 'camera' | 'screen' | 'audio';
  onSave?: (blob: Blob, mimeType: string, filename: string) => void;
}

export default function TopicRecordingModal({
  isOpen,
  onClose,
  topicId,
  topicTitle,
  recordingType,
  onSave
}: TopicRecordingModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check feature support on component mount
  useEffect(() => {
    const checkSupport = () => {
      if (!window.isSecureContext) {
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
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRecordingTypeConfig = () => {
    switch (recordingType) {
      case 'camera':
        return {
          title: 'Camera Recording',
          icon: Camera,
          color: 'blue',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-600'
        };
      case 'screen':
        return {
          title: 'Screen Recording',
          icon: Monitor,
          color: 'green',
          bgColor: 'bg-green-100',
          textColor: 'text-green-600'
        };
      case 'audio':
        return {
          title: 'Audio Recording',
          icon: Mic,
          color: 'purple',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-600'
        };
    }
  };

  const config = getRecordingTypeConfig();
  const IconComponent = config.icon;

  const startRecording = async () => {
    try {
      let mediaStream: MediaStream;

      if (recordingType === 'camera') {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: true
        });
      } else if (recordingType === 'screen') {
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
      } else if (recordingType === 'audio') {
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

      if (videoRef.current && recordingType !== 'audio') {
        videoRef.current.srcObject = mediaStream;
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
    } catch (error: any) {
      console.error('Error starting recording:', error);
      let errorMessage = `Unable to start ${recordingType} recording.`;
      
      if (error.name === 'NotAllowedError') {
        errorMessage = `${recordingType.charAt(0).toUpperCase() + recordingType.slice(1)} access denied. Please allow permissions and try again.`;
      } else if (error.name === 'NotFoundError') {
        errorMessage = `No ${recordingType} device found.`;
      }
      
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
      a.download = `${topicTitle}-${recordingType}-${Date.now()}.${recordingType === 'audio' ? 'webm' : 'webm'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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
  };

  const handleClose = () => {
    resetRecording();
    onClose();
  };

  const handleSaveAndClose = () => {
    if (recordedBlob && onSave) {
      const mimeType = recordedBlob.type || (recordingType === 'audio' ? 'audio/webm' : 'video/webm');
      const extension = recordingType === 'audio' ? 'webm' : 'webm';
      const filename = `${topicTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${recordingType}_${Date.now()}.${extension}`;
      onSave(recordedBlob, mimeType, filename);
    }
    resetRecording();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.bgColor}`}>
                  <IconComponent className={`h-4 w-4 ${config.textColor}`} />
                </div>
                {config.title} - {topicTitle}
              </DialogTitle>
              <DialogDescription>
                Record {recordingType} content for this topic
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {!isSupported ? (
            <div className="text-center py-8">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gray-200`}>
                <IconComponent className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Recording Not Available</h3>
              <p className="text-gray-600 mb-4">
                {recordingType.charAt(0).toUpperCase() + recordingType.slice(1)} recording is not supported in this environment.
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
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload {recordingType.charAt(0).toUpperCase() + recordingType.slice(1)} File
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{config.title}</span>
                  {isRecording && (
                    <Badge variant="destructive" className="animate-pulse">
                      Recording {formatTime(recordingTime)}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Video Preview */}
              {recordingType !== 'audio' && (
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
              {recordingType === 'audio' && (
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

                    <Button
                      onClick={handleSaveAndClose}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                    >
                      Save & Close
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
