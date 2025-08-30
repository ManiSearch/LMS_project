import { UserRole } from '@/contexts/AuthContext';

// Evaluation-specific operation types
export type EvaluationOperation = 
  | 'upload_answer_sheets'
  | 'assign_evaluators'
  | 'create_zones'
  | 'manage_answer_keys'
  | 'evaluate_sheets'
  | 'view_own_assignments'
  | 'digital_annotation'
  | 'submit_marks'
  | 'view_own_results'
  | 'request_revaluation'
  | 'view_child_results'
  | 'publish_results'
  | 'align_dummy_numbers'
  | 'send_notifications'
  | 'download_answer_sheets'
  | 'access_evaluation_schedule';

// Evaluation-specific security context
export interface EvaluationSecurityContext {
  userId: string;
  userRole: UserRole;
  assignedZones?: string[];
  assignedSubjects?: string[];
  assignedStudents?: string[]; // For parents
  currentEvaluationSession?: string;
}

// Evaluation permissions matrix
export const evaluationPermissions: Record<UserRole, EvaluationOperation[]> = {
  admin: [
    'upload_answer_sheets',
    'assign_evaluators',
    'create_zones',
    'manage_answer_keys',
    'publish_results',
    'align_dummy_numbers',
    'send_notifications',
    'download_answer_sheets',
    'access_evaluation_schedule'
  ],
  
  faculty: [
    'evaluate_sheets',
    'view_own_assignments',
    'digital_annotation',
    'submit_marks',
    'download_answer_sheets',
    'access_evaluation_schedule'
  ],
  
  student: [
    'view_own_results',
    'request_revaluation',
    'download_answer_sheets' // Only their own evaluated sheets
  ],
  
  parent: [
    'view_child_results'
  ]
};

// Security rules for data access
export const evaluationSecurityRules = {
  // Answer sheet access rules
  canAccessAnswerSheet: (
    context: EvaluationSecurityContext,
    answerSheet: { studentId: string; assignedEvaluator?: string; dummyNumber: string }
  ): boolean => {
    switch (context.userRole) {
      case 'admin':
        return true; // Admin can access all sheets
      
      case 'faculty':
        return answerSheet.assignedEvaluator === context.userId;
      
      case 'student':
        return answerSheet.studentId === context.userId;
      
      case 'parent':
        return context.assignedStudents?.includes(answerSheet.studentId) || false;
      
      default:
        return false;
    }
  },

  // Result access rules
  canAccessResult: (
    context: EvaluationSecurityContext,
    result: { studentId: string; status: string }
  ): boolean => {
    // Results must be published for students/parents to see
    const isPublished = result.status === 'published';
    
    switch (context.userRole) {
      case 'admin':
        return true;
      
      case 'faculty':
        return true; // Faculty can see all results
      
      case 'student':
        return isPublished && result.studentId === context.userId;
      
      case 'parent':
        return isPublished && (context.assignedStudents?.includes(result.studentId) || false);
      
      default:
        return false;
    }
  },

  // Evaluation zone access rules
  canAccessZone: (
    context: EvaluationSecurityContext,
    zoneId: string
  ): boolean => {
    switch (context.userRole) {
      case 'admin':
        return true;
      
      case 'faculty':
        return context.assignedZones?.includes(zoneId) || false;
      
      default:
        return false;
    }
  },

  // Answer key access rules
  canAccessAnswerKey: (
    context: EvaluationSecurityContext,
    subjectCode: string
  ): boolean => {
    switch (context.userRole) {
      case 'admin':
        return true;
      
      case 'faculty':
        return context.assignedSubjects?.includes(subjectCode) || false;
      
      default:
        return false;
    }
  }
};

// Audit logging for security
export interface AuditLog {
  id: string;
  userId: string;
  userRole: UserRole;
  action: EvaluationOperation;
  resource: string;
  resourceId: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
  success: boolean;
  errorMessage?: string;
}

export const createAuditLog = (
  context: EvaluationSecurityContext,
  action: EvaluationOperation,
  resource: string,
  resourceId: string,
  success: boolean,
  details?: Record<string, any>,
  errorMessage?: string
): AuditLog => {
  return {
    id: Date.now().toString(),
    userId: context.userId,
    userRole: context.userRole,
    action,
    resource,
    resourceId,
    timestamp: new Date().toISOString(),
    details,
    success,
    errorMessage
  };
};

// Helper functions for permission checking
export const hasEvaluationPermission = (
  userRole: UserRole,
  operation: EvaluationOperation
): boolean => {
  return evaluationPermissions[userRole]?.includes(operation) || false;
};

export const canPerformEvaluationAction = (
  context: EvaluationSecurityContext,
  operation: EvaluationOperation
): boolean => {
  return hasEvaluationPermission(context.userRole, operation);
};

// Data anonymization utilities
export const anonymizeStudentData = (studentData: any) => {
  return {
    ...studentData,
    studentName: '[ANONYMIZED]',
    registrationNumber: '[ANONYMIZED]',
    email: '[ANONYMIZED]',
    phone: '[ANONYMIZED]'
  };
};

export const generateDummyNumber = (examId: string, sequence: number): string => {
  const prefix = examId.substring(0, 3).toUpperCase();
  const paddedSequence = sequence.toString().padStart(4, '0');
  return `${prefix}${paddedSequence}`;
};

// Session management for evaluation
export interface EvaluationSession {
  id: string;
  evaluatorId: string;
  startTime: string;
  endTime?: string;
  answerSheetIds: string[];
  status: 'active' | 'paused' | 'completed';
  lastActivity: string;
}

export const createEvaluationSession = (
  evaluatorId: string,
  answerSheetIds: string[]
): EvaluationSession => {
  return {
    id: `session_${Date.now()}`,
    evaluatorId,
    startTime: new Date().toISOString(),
    answerSheetIds,
    status: 'active',
    lastActivity: new Date().toISOString()
  };
};

// Validation rules
export const validationRules = {
  answerSheetUpload: {
    allowedFileTypes: ['.pdf', '.jpg', '.jpeg', '.png'],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    requiredFields: ['examId', 'subject', 'studentId']
  },
  
  markEntry: {
    minMarks: 0,
    maxMarksPercentage: 100,
    requiredFields: ['questionNumber', 'marks', 'comments']
  },
  
  revaluationRequest: {
    timeLimit: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    requiredFields: ['reason', 'specificConcerns'],
    minReasonLength: 50
  }
};

export default evaluationPermissions;
