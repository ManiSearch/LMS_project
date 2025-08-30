import { UserRole } from "@/contexts/AuthContext";

// Define CRUD operations
export type CRUDOperation = "create" | "read" | "update" | "delete";

// Define resource types in the ERP system
export type ResourceType =
  // Core System Resources
  | "entity_setup"
  | "academic_year"
  | "program_setup"
  | "stream_course_mapping"
  | "term_semester"
  | "subject_master"
  | "registration_form"
  | "user_roles"
  | "staff_roles"
  | "staff_allotment"

  // User Management Resources
  | "administrators"
  | "faculty_members"
  | "student_records"
  | "system_permissions"

  // Academic Resources
  | "students"
  | "curriculum"
  | "timetable"
  | "lesson_plans"
  | "attendance"
  | "feedback"
  | "scholarships"
  | "dropouts"
  | "calendar"
  | "notifications"
  | "service_requests"

  // LMS Resources
  | "courses"
  | "assignments"
  | "assessments"
  | "progress"
  | "lessons"
  | "cohorts"
  | "discussion_forums"
  | "certificates"
  | "virtual_classrooms"
  | "lms_reports"

  // Examination Resources
  | "exam_planning"
  | "exam_eligibility"
  | "hall_tickets"
  | "question_bank"
  | "paper_blueprint"
  | "paper_generation"
  | "invigilators"
  | "seating_plan"
  | "evaluation"
  | "results"
  | "revaluation"
  | "transcripts"
  | "exam_reports"

  // Special Resources
  | "proctoring"
  | "analytics"
  | "reports";

// Define permission structure
export interface Permission {
  resource: ResourceType;
  operations: CRUDOperation[];
}

// Role-based permissions matrix for ERP system
export const rolePermissions: Record<UserRole, Permission[]> = {
  "super-admin": [
    // Super Admin - Full CRUD access to everything
    {
      resource: "entity_setup",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "academic_year",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "program_setup",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "stream_course_mapping",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "term_semester",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "subject_master",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "registration_form",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "user_roles",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "staff_roles",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "staff_allotment",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "administrators",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "faculty_members",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "student_records",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "system_permissions",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "students",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "curriculum",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "timetable",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "lesson_plans",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "attendance",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "feedback",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "scholarships",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "dropouts",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "calendar",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "notifications",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "service_requests",
      operations: ["create", "read", "update", "delete"],
    },
    { resource: "courses", operations: ["create", "read", "update", "delete"] },
    {
      resource: "assignments",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "assessments",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "progress",
      operations: ["create", "read", "update", "delete"],
    },
    { resource: "lessons", operations: ["create", "read", "update", "delete"] },
    { resource: "cohorts", operations: ["create", "read", "update", "delete"] },
    {
      resource: "discussion_forums",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "certificates",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "virtual_classrooms",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "lms_reports",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "exam_planning",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "exam_eligibility",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "hall_tickets",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "question_bank",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "paper_blueprint",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "paper_generation",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "invigilators",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "seating_plan",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "evaluation",
      operations: ["create", "read", "update", "delete"],
    },
    { resource: "results", operations: ["create", "read", "update", "delete"] },
    {
      resource: "revaluation",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "transcripts",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "exam_reports",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "proctoring",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "analytics",
      operations: ["create", "read", "update", "delete"],
    },
    { resource: "reports", operations: ["create", "read", "update", "delete"] },
  ],

  admin: [
    // Core System - Full CRUD access
    {
      resource: "entity_setup",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "academic_year",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "program_setup",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "stream_course_mapping",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "term_semester",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "subject_master",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "registration_form",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "user_roles",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "staff_roles",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "staff_allotment",
      operations: ["create", "read", "update", "delete"],
    },

    // User Management - Full CRUD access
    {
      resource: "administrators",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "faculty_members",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "student_records",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "system_permissions",
      operations: ["create", "read", "update", "delete"],
    },

    // Academic Resources - Full CRUD access
    {
      resource: "students",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "curriculum",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "timetable",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "lesson_plans",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "attendance",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "feedback",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "scholarships",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "dropouts",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "calendar",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "notifications",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "service_requests",
      operations: ["create", "read", "update", "delete"],
    },

    // LMS Resources - Full CRUD access
    { resource: "courses", operations: ["create", "read", "update", "delete"] },
    {
      resource: "assignments",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "assessments",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "progress",
      operations: ["create", "read", "update", "delete"],
    },
    { resource: "lessons", operations: ["create", "read", "update", "delete"] },
    { resource: "cohorts", operations: ["create", "read", "update", "delete"] },
    {
      resource: "discussion_forums",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "certificates",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "virtual_classrooms",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "lms_reports",
      operations: ["create", "read", "update", "delete"],
    },

    // Examination Resources - Full CRUD access
    {
      resource: "exam_planning",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "exam_eligibility",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "hall_tickets",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "question_bank",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "paper_blueprint",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "paper_generation",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "invigilators",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "seating_plan",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "evaluation",
      operations: ["create", "read", "update", "delete"],
    },
    { resource: "results", operations: ["create", "read", "update", "delete"] },
    {
      resource: "revaluation",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "transcripts",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "exam_reports",
      operations: ["create", "read", "update", "delete"],
    },

    // Special Resources
    {
      resource: "proctoring",
      operations: ["create", "read", "update", "delete"],
    },
    { resource: "analytics", operations: ["read"] },
    { resource: "reports", operations: ["read"] },
  ],

  faculty: [
    // Academic Resources - Limited CRUD based on responsibility
    { resource: "students", operations: ["read", "update"] }, // Can view and update assigned students
    { resource: "curriculum", operations: ["read", "update"] }, // Can update curriculum for their subjects
    { resource: "timetable", operations: ["read"] }, // View only
    {
      resource: "lesson_plans",
      operations: ["create", "read", "update", "delete"],
    }, // Full access to their lesson plans
    { resource: "attendance", operations: ["create", "read", "update"] }, // Can mark and update attendance
    { resource: "feedback", operations: ["create", "read", "update"] }, // Can provide feedback
    { resource: "calendar", operations: ["read"] }, // View only
    { resource: "notifications", operations: ["create", "read"] }, // Can send notifications
    { resource: "service_requests", operations: ["read", "update"] }, // Can respond to requests

    // LMS Resources - Teaching focused (excluding courses - super-admin only)
    { resource: "courses", operations: ["create", "read", "update", "delete"] },
    {
      resource: "assignments",
      operations: ["create", "read", "update", "delete"],
    }, // Full access to assignments
    {
      resource: "assessments",
      operations: ["create", "read", "update", "delete"],
    }, // Full access to assessments
    { resource: "progress", operations: ["read", "update"] }, // Can view and update progress
    { resource: "lessons", operations: ["create", "read", "update", "delete"] }, // Full access to lessons
    { resource: "cohorts", operations: ["read", "update"] }, // Can manage assigned cohorts
    { resource: "discussion_forums", operations: ["create", "read", "update"] }, // Can moderate forums
    { resource: "certificates", operations: ["read"] }, // View only
    {
      resource: "virtual_classrooms",
      operations: ["create", "read", "update"],
    }, // Can manage classrooms
    { resource: "lms_reports", operations: ["read"] }, // View reports for their classes

    // Examination Resources - Limited to their subjects
    { resource: "exam_planning", operations: ["read", "update"] }, // Can contribute to planning
    { resource: "exam_eligibility", operations: ["read"] }, // View only
    { resource: "hall_tickets", operations: ["read"] }, // View only
    { resource: "question_bank", operations: ["create", "read", "update"] }, // Can manage questions for their subjects
    { resource: "paper_blueprint", operations: ["create", "read", "update"] }, // Can create blueprints
    { resource: "paper_generation", operations: ["create", "read"] }, // Can generate papers
    { resource: "seating_plan", operations: ["read"] }, // View only
    { resource: "evaluation", operations: ["create", "read", "update"] }, // Can evaluate their subjects
    { resource: "results", operations: ["read", "update"] }, // Can update results for their subjects
    { resource: "exam_reports", operations: ["read"] }, // View reports for their subjects

    // Special Resources
    { resource: "proctoring", operations: ["read", "update"] }, // Can monitor exams
    { resource: "analytics", operations: ["read"] }, // Limited analytics
    { resource: "reports", operations: ["read"] }, // Limited reports
  ],

  student: [
    // Academic Resources - Self-service only
    { resource: "timetable", operations: ["read"] }, // View their timetable
    { resource: "feedback", operations: ["create", "read"] }, // Can provide feedback
    { resource: "scholarships", operations: ["create", "read"] }, // Can apply for scholarships
    { resource: "calendar", operations: ["read"] }, // View academic calendar
    { resource: "service_requests", operations: ["create", "read"] }, // Can raise service requests

    // LMS Resources - Learning focused (excluding courses - super-admin only)
    { resource: "courses", operations: ["create", "read", "update", "delete"] },
    { resource: "assignments", operations: ["read", "update"] }, // View and submit assignments
    { resource: "assessments", operations: ["read", "update"] }, // Take assessments
    { resource: "progress", operations: ["read"] }, // View their progress
    { resource: "lessons", operations: ["read"] }, // Access lesson content
    { resource: "discussion_forums", operations: ["create", "read", "update"] }, // Participate in discussions
    { resource: "certificates", operations: ["read"] }, // View their certificates
    { resource: "virtual_classrooms", operations: ["read"] }, // Join virtual classrooms

    // Examination Resources - Limited to their exams
    { resource: "exam_eligibility", operations: ["read"] }, // Check eligibility
    { resource: "hall_tickets", operations: ["read"] }, // Download hall tickets
    { resource: "results", operations: ["read"] }, // View their results
    { resource: "revaluation", operations: ["create", "read"] }, // Apply for revaluation
    { resource: "transcripts", operations: ["read"] }, // View/download transcripts

    // No access to administrative functions
  ],

  institution: [
    // Institution Head - Full administrative access like admin
    {
      resource: "entity_setup",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "academic_year",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "program_setup",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "stream_course_mapping",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "term_semester",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "subject_master",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "registration_form",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "user_roles",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "staff_roles",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "staff_allotment",
      operations: ["create", "read", "update", "delete"],
    },

    // User Management - Full CRUD access
    {
      resource: "administrators",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "faculty_members",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "student_records",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "system_permissions",
      operations: ["create", "read", "update", "delete"],
    },

    // Academic Resources - Full CRUD access
    {
      resource: "students",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "curriculum",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "timetable",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "lesson_plans",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "attendance",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "feedback",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "scholarships",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "dropouts",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "calendar",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "notifications",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "service_requests",
      operations: ["create", "read", "update", "delete"],
    },

    // LMS Resources - Full CRUD access
    { resource: "courses", operations: ["create", "read", "update", "delete"] },
    {
      resource: "assignments",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "assessments",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "progress",
      operations: ["create", "read", "update", "delete"],
    },
    { resource: "lessons", operations: ["create", "read", "update", "delete"] },
    { resource: "cohorts", operations: ["create", "read", "update", "delete"] },
    {
      resource: "discussion_forums",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "certificates",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "virtual_classrooms",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "lms_reports",
      operations: ["create", "read", "update", "delete"],
    },

    // Examination Resources - Full CRUD access
    {
      resource: "exam_planning",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "exam_eligibility",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "hall_tickets",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "question_bank",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "paper_blueprint",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "paper_generation",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "invigilators",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "seating_plan",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "evaluation",
      operations: ["create", "read", "update", "delete"],
    },
    { resource: "results", operations: ["create", "read", "update", "delete"] },
    {
      resource: "revaluation",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "transcripts",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "exam_reports",
      operations: ["create", "read", "update", "delete"],
    },

    // Special Resources
    {
      resource: "proctoring",
      operations: ["create", "read", "update", "delete"],
    },
    { resource: "analytics", operations: ["read"] },
    { resource: "reports", operations: ["read"] },
  ],

  principal: [
    // Principal - Full administrative access like admin
    {
      resource: "entity_setup",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "academic_year",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "program_setup",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "stream_course_mapping",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "term_semester",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "subject_master",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "registration_form",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "user_roles",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "staff_roles",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "staff_allotment",
      operations: ["create", "read", "update", "delete"],
    },

    // User Management - Full CRUD access
    {
      resource: "administrators",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "faculty_members",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "student_records",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "system_permissions",
      operations: ["create", "read", "update", "delete"],
    },

    // Academic Resources - Full CRUD access
    {
      resource: "students",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "curriculum",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "timetable",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "lesson_plans",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "attendance",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "feedback",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "scholarships",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "dropouts",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "calendar",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "notifications",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "service_requests",
      operations: ["create", "read", "update", "delete"],
    },

    // LMS Resources - Full CRUD access
    { resource: "courses", operations: ["create", "read", "update", "delete"] },
    {
      resource: "assignments",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "assessments",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "progress",
      operations: ["create", "read", "update", "delete"],
    },
    { resource: "lessons", operations: ["create", "read", "update", "delete"] },
    { resource: "cohorts", operations: ["create", "read", "update", "delete"] },
    {
      resource: "discussion_forums",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "certificates",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "virtual_classrooms",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "lms_reports",
      operations: ["create", "read", "update", "delete"],
    },

    // Examination Resources - Full CRUD access
    {
      resource: "exam_planning",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "exam_eligibility",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "hall_tickets",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "question_bank",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "paper_blueprint",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "paper_generation",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "invigilators",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "seating_plan",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "evaluation",
      operations: ["create", "read", "update", "delete"],
    },
    { resource: "results", operations: ["create", "read", "update", "delete"] },
    {
      resource: "revaluation",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "transcripts",
      operations: ["create", "read", "update", "delete"],
    },
    {
      resource: "exam_reports",
      operations: ["create", "read", "update", "delete"],
    },

    // Special Resources
    {
      resource: "proctoring",
      operations: ["create", "read", "update", "delete"],
    },
    { resource: "analytics", operations: ["read"] },
    { resource: "reports", operations: ["read"] },
  ],

  hod: [
    // Head of Department - Department-level management with full LMS access
    { resource: "students", operations: ["read", "update"] },
    { resource: "curriculum", operations: ["create", "read", "update"] },
    { resource: "timetable", operations: ["create", "read", "update"] },
    { resource: "lesson_plans", operations: ["create", "read", "update"] },
    { resource: "attendance", operations: ["read", "update"] },
    { resource: "faculty_members", operations: ["read"] },

    // Full LMS access for department management (excluding courses - super-admin only)
    { resource: "courses", operations: ["create", "read", "update", "delete"] },
    { resource: "assignments", operations: ["create", "read", "update"] },
    { resource: "assessments", operations: ["create", "read", "update"] },
    { resource: "progress", operations: ["read", "update"] },
    { resource: "lessons", operations: ["create", "read", "update"] },
    { resource: "cohorts", operations: ["read", "update"] },
    { resource: "discussion_forums", operations: ["create", "read", "update"] },
    { resource: "certificates", operations: ["read"] },
    {
      resource: "virtual_classrooms",
      operations: ["create", "read", "update"],
    },
    { resource: "lms_reports", operations: ["read"] },

    { resource: "exam_planning", operations: ["read", "update"] },
    { resource: "question_bank", operations: ["create", "read", "update"] },
    { resource: "results", operations: ["read"] },
    { resource: "reports", operations: ["read"] },
  ],

  staff: [
    // Staff - Limited administrative access
    { resource: "students", operations: ["read"] },
    { resource: "timetable", operations: ["read"] },
    { resource: "calendar", operations: ["read"] },
    { resource: "attendance", operations: ["read"] },
    { resource: "service_requests", operations: ["create", "read", "update"] },
    { resource: "notifications", operations: ["read"] },
  ],

  parent: [
    // Academic Resources - Child monitoring only
    { resource: "timetable", operations: ["read"] }, // View child's timetable
    { resource: "calendar", operations: ["read"] }, // View academic calendar

    // Limited LMS access for monitoring
    { resource: "progress", operations: ["read"] }, // View child's progress

    // Examination Resources - Child's exam info
    { resource: "results", operations: ["read"] }, // View child's results
    { resource: "hall_tickets", operations: ["read"] }, // View child's hall tickets

    // No CRUD operations - read-only access for monitoring child's progress
  ],
};

// Utility functions for permission checking
export const hasPermission = (
  userRole: UserRole,
  resource: ResourceType,
  operation: CRUDOperation,
): boolean => {
  const permissions = rolePermissions[userRole];
  if (!permissions) {
    console.warn(`No permissions defined for role: ${userRole}`);
    return false;
  }
  const resourcePermission = permissions.find((p) => p.resource === resource);
  return resourcePermission?.operations.includes(operation) || false;
};

export const getResourcePermissions = (
  userRole: UserRole,
  resource: ResourceType,
): CRUDOperation[] => {
  const permissions = rolePermissions[userRole];
  if (!permissions) {
    console.warn(`No permissions defined for role: ${userRole}`);
    return [];
  }
  const resourcePermission = permissions.find((p) => p.resource === resource);
  return resourcePermission?.operations || [];
};

export const canCreate = (
  userRole: UserRole,
  resource: ResourceType,
): boolean => hasPermission(userRole, resource, "create");

export const canRead = (userRole: UserRole, resource: ResourceType): boolean =>
  hasPermission(userRole, resource, "read");

export const canUpdate = (
  userRole: UserRole,
  resource: ResourceType,
): boolean => hasPermission(userRole, resource, "update");

export const canDelete = (
  userRole: UserRole,
  resource: ResourceType,
): boolean => hasPermission(userRole, resource, "delete");

// Map routes to resources for easy permission checking
export const routeToResourceMap: Record<string, ResourceType> = {
  // Core System
  "/master/entity-setup": "entity_setup",
  "/master/academic-year-setup": "academic_year",
  "/master/program-setup": "program_setup",
  "/master/stream-course-mapping": "stream_course_mapping",
  "/master/term-semester-setup": "term_semester",
  "/master/subject-master-setup": "subject_master",
  "/master/registration-form-setup": "registration_form",
  "/master/user-role-permissions-setup": "user_roles",
  "/staff/roles": "staff_roles",
  "/staff/allotment": "staff_allotment",

  // User Management
  "/users/admins": "administrators",
  "/users/faculty": "faculty_members",
  "/users/students": "student_records",
  "/settings/permissions": "system_permissions",

  // Academics
  "/academics/students": "students",
  "/academics/curriculum": "curriculum",
  "/academics/timetable": "timetable",
  "/academics/lesson-plans": "lesson_plans",
  "/academics/attendance": "attendance",
  "/academics/feedback": "feedback",
  "/academics/scholarships": "scholarships",
  "/academics/dropouts": "dropouts",
  "/academics/calendar": "calendar",
  "/academics/notifications": "notifications",
  "/academics/service-requests": "service_requests",

  // LMS
  "/lms/courses": "courses",
  "/lms/assignments": "assignments",
  "/lms/assessments": "assessments",
  "/lms/progress": "progress",
  "/lms/lessons": "lessons",
  "/lms/cohorts": "cohorts",
  "/lms/discussion-forums": "discussion_forums",
  "/lms/certificates": "certificates",
  "/lms/virtual-classrooms": "virtual_classrooms",
  "/lms/reports": "lms_reports",

  // Examinations
  "/exams/planning": "exam_planning",
  "/exams/eligibility": "exam_eligibility",
  "/exams/halltickets": "hall_tickets",
  "/exams/question-bank": "question_bank",
  "/exams/paper-blueprint": "paper_blueprint",
  "/exams/paper-generation": "paper_generation",
  "/exams/invigilators": "invigilators",
  "/exams/seating-plan": "seating_plan",
  "/exams/evaluation": "evaluation",
  "/exams/results": "results",
  "/exams/revaluation": "revaluation",
  "/exams/transcripts": "transcripts",
  "/exams/reports": "exam_reports",
};

export const getResourceFromRoute = (route: string): ResourceType | null => {
  return routeToResourceMap[route] || null;
};

export const canAccessRoute = (userRole: UserRole, route: string): boolean => {
  const resource = getResourceFromRoute(route);
  if (!resource) return false;
  return hasPermission(userRole, resource, "read");
};
