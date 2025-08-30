export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  filePath?: string;
  fileName?: string;
  fileSize?: number;
  duration?: number; // For video/audio files
  error?: string;
}

export interface FileUploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: string) => void;
}

export class FileUploadService {
  private static instance: FileUploadService;
  private uploadBaseUrl = '/api/uploads'; // This would be your actual upload endpoint

  public static getInstance(): FileUploadService {
    if (!FileUploadService.instance) {
      FileUploadService.instance = new FileUploadService();
    }
    return FileUploadService.instance;
  }

  async uploadFile(file: File, options?: FileUploadOptions): Promise<UploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('originalName', file.name);
      formData.append('contentType', file.type);

      // Simulate upload for demo (in real app, this would be actual API call)
      const result = await this.simulateUpload(file, options);
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      options?.onError?.(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  private validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 500 * 1024 * 1024; // 500MB
    
    if (file.size > maxSize) {
      return { valid: false, error: 'File size exceeds 500MB limit' };
    }

    const allowedTypes = [
      // Video files
      'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm',
      // Audio files
      'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a',
      // Document files
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      // Image files
      'image/jpeg', 'image/png', 'image/gif', 'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'File type not supported' };
    }

    return { valid: true };
  }

  private async simulateUpload(file: File, options?: FileUploadOptions): Promise<UploadResult> {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 100) progress = 100;

        options?.onProgress?.({
          loaded: (progress / 100) * file.size,
          total: file.size,
          percentage: progress
        });

        if (progress >= 100) {
          clearInterval(interval);
          
          // Generate mock file path and URL
          const timestamp = Date.now();
          const extension = file.name.split('.').pop();
          const fileName = `${timestamp}_${file.name}`;
          const filePath = `/uploads/${this.getFileCategory(file.type)}/${fileName}`;
          const url = `${window.location.origin}${filePath}`;

          const result: UploadResult = {
            success: true,
            url,
            filePath,
            fileName,
            fileSize: file.size,
            duration: this.isVideoOrAudio(file.type) ? this.estimateDuration(file.size) : undefined
          };

          options?.onSuccess?.(result);
          resolve(result);
        }
      }, 200);
    });
  }

  private getFileCategory(mimeType: string): string {
    if (mimeType.startsWith('video/')) return 'videos';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf')) return 'documents';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'presentations';
    if (mimeType.startsWith('image/')) return 'images';
    return 'misc';
  }

  private isVideoOrAudio(mimeType: string): boolean {
    return mimeType.startsWith('video/') || mimeType.startsWith('audio/');
  }

  private estimateDuration(fileSize: number): number {
    // Very rough estimation: assume 1MB per minute for video/audio
    return Math.floor(fileSize / (1024 * 1024)) * 60;
  }

  async uploadMultipleFiles(files: File[], options?: FileUploadOptions): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    
    for (const file of files) {
      const result = await this.uploadFile(file, options);
      results.push(result);
    }
    
    return results;
  }

  // YouTube URL validation and metadata extraction
  async validateYouTubeUrl(url: string): Promise<{ valid: boolean; videoId?: string; embedUrl?: string; error?: string }> {
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    
    if (!match) {
      return { valid: false, error: 'Invalid YouTube URL' };
    }

    const videoId = match[1];
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    
    return {
      valid: true,
      videoId,
      embedUrl
    };
  }

  // Screen recording utilities
  async startScreenRecording(): Promise<MediaRecorder | null> {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: 'screen'
        },
        audio: true
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8,opus'
      });

      return mediaRecorder;
    } catch (error) {
      console.error('Error starting screen recording:', error);
      return null;
    }
  }

  // Audio recording utilities  
  async startAudioRecording(): Promise<MediaRecorder | null> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      return mediaRecorder;
    } catch (error) {
      console.error('Error starting audio recording:', error);
      return null;
    }
  }
}

export const fileUploadService = FileUploadService.getInstance();
