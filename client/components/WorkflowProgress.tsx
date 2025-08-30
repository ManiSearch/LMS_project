import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, 
  BookOpen, 
  FileText, 
  ClipboardCheck, 
  MessageSquare, 
  Target, 
  Award,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowStage {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  status: 'completed' | 'in-progress' | 'pending' | 'locked';
  progress: number;
  color: string;
  bgColor: string;
  description?: string;
}

interface WorkflowProgressProps {
  studentData?: {
    courseProgress: number;
    assignmentsCompleted: number;
    totalAssignments: number;
    assessmentsCompleted: number;
    totalAssessments: number;
    videosWatched: number;
    totalVideos: number;
    overallScore: number;
    isEnrolled: boolean;
    hasFeedback: boolean;
    isCertified: boolean;
  };
  userRole: string;
  compact?: boolean;
  showDetails?: boolean;
}

export default function WorkflowProgress({ 
  studentData, 
  userRole, 
  compact = false, 
  showDetails = true 
}: WorkflowProgressProps) {
  
  // Calculate workflow stages based on student data
  const calculateWorkflowStages = (): WorkflowStage[] => {
    if (!studentData) {
      // Default stages for overview
      return [
        {
          id: 'enrollment',
          title: 'Course Enrollment',
          subtitle: 'Get Started',
          icon: GraduationCap,
          status: 'pending',
          progress: 0,
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          description: 'Enroll in courses'
        },
        {
          id: 'content',
          title: 'Accessing Course Content',
          subtitle: 'Learn',
          icon: BookOpen,
          status: 'locked',
          progress: 0,
          color: 'text-gray-400',
          bgColor: 'bg-gray-50',
          description: 'Access learning materials'
        },
        {
          id: 'assignments',
          title: 'Assignments & Practice',
          subtitle: 'Practice',
          icon: FileText,
          status: 'locked',
          progress: 0,
          color: 'text-gray-400',
          bgColor: 'bg-gray-50',
          description: 'Complete assignments'
        },
        {
          id: 'assessments',
          title: 'Assessments & Quizzes',
          subtitle: 'Evaluate',
          icon: ClipboardCheck,
          status: 'locked',
          progress: 0,
          color: 'text-gray-400',
          bgColor: 'bg-gray-50',
          description: 'Take assessments'
        },
        {
          id: 'feedback',
          title: 'Feedback & Evaluation',
          subtitle: 'Review',
          icon: MessageSquare,
          status: 'locked',
          progress: 0,
          color: 'text-gray-400',
          bgColor: 'bg-gray-50',
          description: 'Receive feedback'
        },
        {
          id: 'tracking',
          title: 'Progress Tracking',
          subtitle: 'Monitor',
          icon: Target,
          status: 'locked',
          progress: 0,
          color: 'text-gray-400',
          bgColor: 'bg-gray-50',
          description: 'Track progress'
        },
        {
          id: 'certification',
          title: 'Certification / Course Completion',
          subtitle: 'Achieve',
          icon: Award,
          status: 'locked',
          progress: 0,
          color: 'text-gray-400',
          bgColor: 'bg-gray-50',
          description: 'Earn certification'
        }
      ];
    }

    const {
      isEnrolled,
      courseProgress,
      assignmentsCompleted,
      totalAssignments,
      assessmentsCompleted,
      totalAssessments,
      videosWatched,
      totalVideos,
      hasFeedback,
      isCertified,
      overallScore
    } = studentData;

    const assignmentProgress = totalAssignments > 0 ? (assignmentsCompleted / totalAssignments) * 100 : 0;
    const assessmentProgress = totalAssessments > 0 ? (assessmentsCompleted / totalAssessments) * 100 : 0;
    const videoProgress = totalVideos > 0 ? (videosWatched / totalVideos) * 100 : 0;

    return [
      {
        id: 'enrollment',
        title: 'Course Enrollment',
        subtitle: 'Get Started',
        icon: GraduationCap,
        status: isEnrolled ? 'completed' : 'pending',
        progress: isEnrolled ? 100 : 0,
        color: isEnrolled ? 'text-white' : 'text-red-600',
        bgColor: isEnrolled ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-red-100',
        description: 'Successfully enrolled in course'
      },
      {
        id: 'content',
        title: 'Accessing Course Content',
        subtitle: 'Learn',
        icon: BookOpen,
        status: !isEnrolled ? 'locked' : videoProgress >= 80 ? 'completed' : videoProgress > 0 ? 'in-progress' : 'pending',
        progress: videoProgress,
        color: !isEnrolled ? 'text-gray-400' : videoProgress >= 80 ? 'text-white' : videoProgress > 0 ? 'text-orange-600' : 'text-orange-500',
        bgColor: !isEnrolled ? 'bg-gray-50' : videoProgress >= 80 ? 'bg-gradient-to-r from-orange-500 to-yellow-500' : videoProgress > 0 ? 'bg-orange-100' : 'bg-orange-50',
        description: `${videosWatched}/${totalVideos} videos watched`
      },
      {
        id: 'assignments',
        title: 'Assignments & Practice',
        subtitle: 'Practice',
        icon: FileText,
        status: !isEnrolled ? 'locked' : assignmentProgress >= 80 ? 'completed' : assignmentProgress > 0 ? 'in-progress' : videoProgress >= 20 ? 'pending' : 'locked',
        progress: assignmentProgress,
        color: !isEnrolled ? 'text-gray-400' : assignmentProgress >= 80 ? 'text-white' : assignmentProgress > 0 ? 'text-yellow-600' : videoProgress >= 20 ? 'text-yellow-500' : 'text-gray-400',
        bgColor: !isEnrolled ? 'bg-gray-50' : assignmentProgress >= 80 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : assignmentProgress > 0 ? 'bg-yellow-100' : videoProgress >= 20 ? 'bg-yellow-50' : 'bg-gray-50',
        description: `${assignmentsCompleted}/${totalAssignments} assignments completed`
      },
      {
        id: 'assessments',
        title: 'Assessments & Quizzes',
        subtitle: 'Evaluate',
        icon: ClipboardCheck,
        status: !isEnrolled ? 'locked' : assessmentProgress >= 80 ? 'completed' : assessmentProgress > 0 ? 'in-progress' : assignmentProgress >= 50 ? 'pending' : 'locked',
        progress: assessmentProgress,
        color: !isEnrolled ? 'text-gray-400' : assessmentProgress >= 80 ? 'text-white' : assessmentProgress > 0 ? 'text-purple-600' : assignmentProgress >= 50 ? 'text-purple-500' : 'text-gray-400',
        bgColor: !isEnrolled ? 'bg-gray-50' : assessmentProgress >= 80 ? 'bg-gradient-to-r from-purple-500 to-blue-500' : assessmentProgress > 0 ? 'bg-purple-100' : assignmentProgress >= 50 ? 'bg-purple-50' : 'bg-gray-50',
        description: `${assessmentsCompleted}/${totalAssessments} assessments completed`
      },
      {
        id: 'feedback',
        title: 'Feedback & Evaluation',
        subtitle: 'Review',
        icon: MessageSquare,
        status: !isEnrolled ? 'locked' : hasFeedback ? 'completed' : assessmentProgress >= 60 ? 'in-progress' : assessmentProgress >= 30 ? 'pending' : 'locked',
        progress: hasFeedback ? 100 : assessmentProgress >= 60 ? 70 : assessmentProgress >= 30 ? 30 : 0,
        color: !isEnrolled ? 'text-gray-400' : hasFeedback ? 'text-white' : assessmentProgress >= 60 ? 'text-blue-600' : assessmentProgress >= 30 ? 'text-blue-500' : 'text-gray-400',
        bgColor: !isEnrolled ? 'bg-gray-50' : hasFeedback ? 'bg-gradient-to-r from-blue-500 to-purple-500' : assessmentProgress >= 60 ? 'bg-blue-100' : assessmentProgress >= 30 ? 'bg-blue-50' : 'bg-gray-50',
        description: hasFeedback ? 'Feedback received' : 'Awaiting feedback'
      },
      {
        id: 'tracking',
        title: 'Progress Tracking',
        subtitle: 'Monitor',
        icon: Target,
        status: !isEnrolled ? 'locked' : courseProgress >= 90 ? 'completed' : courseProgress >= 50 ? 'in-progress' : courseProgress > 0 ? 'pending' : 'locked',
        progress: courseProgress,
        color: !isEnrolled ? 'text-gray-400' : courseProgress >= 90 ? 'text-white' : courseProgress >= 50 ? 'text-blue-600' : courseProgress > 0 ? 'text-blue-500' : 'text-gray-400',
        bgColor: !isEnrolled ? 'bg-gray-50' : courseProgress >= 90 ? 'bg-gradient-to-r from-blue-500 to-green-500' : courseProgress >= 50 ? 'bg-blue-100' : courseProgress > 0 ? 'bg-blue-50' : 'bg-gray-50',
        description: `${courseProgress}% course progress`
      },
      {
        id: 'certification',
        title: 'Certification / Course Completion',
        subtitle: 'Achieve',
        icon: Award,
        status: !isEnrolled ? 'locked' : isCertified ? 'completed' : overallScore >= 85 && courseProgress >= 95 ? 'in-progress' : courseProgress >= 80 ? 'pending' : 'locked',
        progress: isCertified ? 100 : overallScore >= 85 && courseProgress >= 95 ? 80 : courseProgress >= 80 ? 40 : 0,
        color: !isEnrolled ? 'text-gray-400' : isCertified ? 'text-white' : overallScore >= 85 && courseProgress >= 95 ? 'text-green-600' : courseProgress >= 80 ? 'text-green-500' : 'text-gray-400',
        bgColor: !isEnrolled ? 'bg-gray-50' : isCertified ? 'bg-gradient-to-r from-green-500 to-blue-500' : overallScore >= 85 && courseProgress >= 95 ? 'bg-green-100' : courseProgress >= 80 ? 'bg-green-50' : 'bg-gray-50',
        description: isCertified ? 'Certificate earned!' : overallScore >= 85 && courseProgress >= 95 ? 'Certification pending' : 'Complete course to earn certificate'
      }
    ];
  };

  const stages = calculateWorkflowStages();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'completed': 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'locked': 'bg-gray-100 text-gray-600'
    };
    
    return (
      <Badge className={cn('text-xs', variants[status as keyof typeof variants])}>
        {status === 'completed' ? 'Completed' :
         status === 'in-progress' ? 'In Progress' :
         status === 'pending' ? 'Available' : 'Locked'}
      </Badge>
    );
  };

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            Learning Workflow Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 justify-center">
            {stages.map((stage, index) => (
              <div key={stage.id} className="flex items-center">
                <div className={cn(
                  "relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300",
                  stage.bgColor
                )}>
                  <stage.icon className={cn("h-6 w-6", stage.color)} />
                  <div className="absolute -top-1 -right-1">
                    {getStatusIcon(stage.status)}
                  </div>
                </div>
                {index < stages.length - 1 && (
                  <div className="w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 mx-2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <CardTitle className="text-2xl flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Target className="h-6 w-6 text-blue-600" />
          </div>
          Learning Workflow Progress
        </CardTitle>
        <p className="text-muted-foreground">
          Track your learning journey from enrollment to certification
        </p>
      </CardHeader>
      <CardContent className="p-0">
        {/* Workflow Visualization */}
        <div className="relative overflow-x-auto p-8 bg-gradient-to-br from-gray-50 to-white">
          <div className="flex items-center justify-between min-w-[1200px] relative">
            {/* Connecting Flow Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-red-200 via-orange-200 via-yellow-200 via-purple-200 via-blue-200 to-green-200 transform -translate-y-1/2 z-0" />
            
            {stages.map((stage, index) => (
              <div key={stage.id} className="relative z-10 flex flex-col items-center group">
                {/* Stage Circle */}
                <div className={cn(
                  "relative flex items-center justify-center w-20 h-20 rounded-full shadow-lg transition-all duration-500 hover:scale-110 cursor-pointer",
                  stage.bgColor,
                  stage.status === 'completed' && "shadow-xl shadow-green-200",
                  stage.status === 'in-progress' && "shadow-xl shadow-blue-200 animate-pulse",
                  stage.status === 'pending' && "shadow-lg shadow-yellow-200"
                )}>
                  <stage.icon className={cn("h-8 w-8 transition-all duration-300", stage.color)} />
                  
                  {/* Status indicator */}
                  <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md">
                    {getStatusIcon(stage.status)}
                  </div>

                  {/* Progress ring for in-progress items */}
                  {stage.status === 'in-progress' && (
                    <div className="absolute inset-0 rounded-full">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="4"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="white"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${stage.progress * 2.83} 283`}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Stage Info */}
                <div className="mt-4 text-center min-h-[80px] max-w-[140px]">
                  <h3 className="font-semibold text-sm text-gray-900 mb-1 leading-tight">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {stage.subtitle}
                  </p>
                  {getStatusBadge(stage.status)}
                  
                  {/* Progress details */}
                  {showDetails && stage.progress > 0 && (
                    <div className="mt-2">
                      <div className="text-xs font-medium text-gray-700 mb-1">
                        {Math.round(stage.progress)}%
                      </div>
                      <Progress value={stage.progress} className="h-1.5 bg-gray-200" />
                    </div>
                  )}
                </div>

                {/* Hover tooltip */}
                <div className="absolute top-full mt-2 bg-black text-white text-xs rounded-md px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                  {stage.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Statistics */}
        {showDetails && studentData && (
          <div className="border-t bg-gray-50 p-6">
            <h4 className="font-semibold text-lg mb-4 text-center">Detailed Progress Statistics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-blue-600">{studentData.courseProgress}%</div>
                <div className="text-sm text-muted-foreground">Course Progress</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  {studentData.assignmentsCompleted}/{studentData.totalAssignments}
                </div>
                <div className="text-sm text-muted-foreground">Assignments</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-purple-600">
                  {studentData.assessmentsCompleted}/{studentData.totalAssessments}
                </div>
                <div className="text-sm text-muted-foreground">Assessments</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-orange-600">{studentData.overallScore}%</div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
