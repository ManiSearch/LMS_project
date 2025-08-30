// Central permissions configuration for role-based access control
export const PERMISSIONS = {
  // System Administration
  SYSTEM_ADMIN: "system_admin",
  USER_MANAGEMENT: "user_management",
  ROLE_MANAGEMENT: "role_management",
  SYSTEM_SETTINGS: "system_settings",

  // Academic Management
  ACADEMIC_ADMIN: "academic_admin",
  PROGRAM_MANAGEMENT: "program_management",
  CURRICULUM_MANAGEMENT: "curriculum_management",
  LESSON_PLAN_MANAGEMENT: "lesson_plan_management",

  // LMS Management
  LMS_ADMIN: "lms_admin",
  COURSE_MANAGEMENT: "course_management",
  CONTENT_MANAGEMENT: "content_management",
  ASSESSMENT_MANAGEMENT: "assessment_management",

  // Examination Management
  EXAM_ADMIN: "exam_admin",
  EXAM_PLANNING: "exam_planning",
  QUESTION_BANK: "question_bank",
  RESULT_MANAGEMENT: "result_management",

  // Student Management
  STUDENT_ADMIN: "student_admin",
  STUDENT_REGISTRATION: "student_registration",
  ATTENDANCE_MANAGEMENT: "attendance_management",
  GRADE_MANAGEMENT: "grade_management",

  // Staff Management
  STAFF_ADMIN: "staff_admin",
  STAFF_MANAGEMENT: "staff_management",
  FACULTY_MANAGEMENT: "faculty_management",

  // Reports and Analytics
  REPORTS_ADMIN: "reports_admin",
  ACADEMIC_REPORTS: "academic_reports",
  FINANCIAL_REPORTS: "financial_reports",

  // Basic Access Rights
  VIEW_DASHBOARD: "view_dashboard",
  VIEW_PROFILE: "view_profile",
  EDIT_PROFILE: "edit_profile",
  VIEW_LESSONS: "view_lessons",
  VIEW_ASSIGNMENTS: "view_assignments",
  SUBMIT_ASSIGNMENTS: "submit_assignments",
  TAKE_EXAMS: "take_exams",
  VIEW_RESULTS: "view_results",
  VIEW_ATTENDANCE: "view_attendance",

  // Content Access
  ACCESS_LMS: "access_lms",
  CREATE_CONTENT: "create_content",
  EDIT_CONTENT: "edit_content",
  DELETE_CONTENT: "delete_content",
  PUBLISH_CONTENT: "publish_content",
};

// Role-based permissions mapping
export const ROLE_PERMISSIONS = {
  super_admin: [
    // System Administration
    PERMISSIONS.SYSTEM_ADMIN,
    PERMISSIONS.USER_MANAGEMENT,
    PERMISSIONS.ROLE_MANAGEMENT,
    PERMISSIONS.SYSTEM_SETTINGS,

    // Academic Management
    PERMISSIONS.ACADEMIC_ADMIN,
    PERMISSIONS.PROGRAM_MANAGEMENT,
    PERMISSIONS.CURRICULUM_MANAGEMENT,
    PERMISSIONS.LESSON_PLAN_MANAGEMENT,

    // LMS Management
    PERMISSIONS.LMS_ADMIN,
    PERMISSIONS.COURSE_MANAGEMENT,
    PERMISSIONS.CONTENT_MANAGEMENT,
    PERMISSIONS.ASSESSMENT_MANAGEMENT,

    // Examination Management
    PERMISSIONS.EXAM_ADMIN,
    PERMISSIONS.EXAM_PLANNING,
    PERMISSIONS.QUESTION_BANK,
    PERMISSIONS.RESULT_MANAGEMENT,

    // Student Management
    PERMISSIONS.STUDENT_ADMIN,
    PERMISSIONS.STUDENT_REGISTRATION,
    PERMISSIONS.ATTENDANCE_MANAGEMENT,
    PERMISSIONS.GRADE_MANAGEMENT,

    // Staff Management
    PERMISSIONS.STAFF_ADMIN,
    PERMISSIONS.STAFF_MANAGEMENT,
    PERMISSIONS.FACULTY_MANAGEMENT,

    // Reports and Analytics
    PERMISSIONS.REPORTS_ADMIN,
    PERMISSIONS.ACADEMIC_REPORTS,
    PERMISSIONS.FINANCIAL_REPORTS,

    // Basic Access Rights
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_LESSONS,
    PERMISSIONS.VIEW_ASSIGNMENTS,
    PERMISSIONS.VIEW_RESULTS,
    PERMISSIONS.VIEW_ATTENDANCE,

    // Content Access
    PERMISSIONS.ACCESS_LMS,
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.EDIT_CONTENT,
    PERMISSIONS.DELETE_CONTENT,
    PERMISSIONS.PUBLISH_CONTENT,
  ],

  admin: [
    // Academic Management
    PERMISSIONS.ACADEMIC_ADMIN,
    PERMISSIONS.PROGRAM_MANAGEMENT,
    PERMISSIONS.CURRICULUM_MANAGEMENT,
    PERMISSIONS.LESSON_PLAN_MANAGEMENT,

    // LMS Management
    PERMISSIONS.LMS_ADMIN,
    PERMISSIONS.COURSE_MANAGEMENT,
    PERMISSIONS.CONTENT_MANAGEMENT,
    PERMISSIONS.ASSESSMENT_MANAGEMENT,

    // Examination Management
    PERMISSIONS.EXAM_ADMIN,
    PERMISSIONS.EXAM_PLANNING,
    PERMISSIONS.QUESTION_BANK,
    PERMISSIONS.RESULT_MANAGEMENT,

    // Student Management
    PERMISSIONS.STUDENT_ADMIN,
    PERMISSIONS.STUDENT_REGISTRATION,
    PERMISSIONS.ATTENDANCE_MANAGEMENT,
    PERMISSIONS.GRADE_MANAGEMENT,

    // Staff Management
    PERMISSIONS.STAFF_ADMIN,
    PERMISSIONS.STAFF_MANAGEMENT,
    PERMISSIONS.FACULTY_MANAGEMENT,

    // Reports and Analytics
    PERMISSIONS.ACADEMIC_REPORTS,

    // Basic Access Rights
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_LESSONS,
    PERMISSIONS.VIEW_ASSIGNMENTS,
    PERMISSIONS.VIEW_RESULTS,
    PERMISSIONS.VIEW_ATTENDANCE,

    // Content Access
    PERMISSIONS.ACCESS_LMS,
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.EDIT_CONTENT,
    PERMISSIONS.DELETE_CONTENT,
    PERMISSIONS.PUBLISH_CONTENT,
  ],

  principal: [
    // Academic Management
    PERMISSIONS.ACADEMIC_ADMIN,
    PERMISSIONS.PROGRAM_MANAGEMENT,
    PERMISSIONS.CURRICULUM_MANAGEMENT,

    // Student Management
    PERMISSIONS.STUDENT_ADMIN,
    PERMISSIONS.ATTENDANCE_MANAGEMENT,
    PERMISSIONS.GRADE_MANAGEMENT,

    // Staff Management
    PERMISSIONS.STAFF_ADMIN,
    PERMISSIONS.FACULTY_MANAGEMENT,

    // Reports and Analytics
    PERMISSIONS.ACADEMIC_REPORTS,

    // Examination Management
    PERMISSIONS.EXAM_ADMIN,
    PERMISSIONS.RESULT_MANAGEMENT,

    // Basic Access Rights
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_LESSONS,
    PERMISSIONS.VIEW_ASSIGNMENTS,
    PERMISSIONS.VIEW_RESULTS,
    PERMISSIONS.VIEW_ATTENDANCE,

    // Content Access
    PERMISSIONS.ACCESS_LMS,
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.EDIT_CONTENT,
    PERMISSIONS.PUBLISH_CONTENT,
  ],

  staff: [
    // Academic Management
    PERMISSIONS.LESSON_PLAN_MANAGEMENT,

    // LMS Management
    PERMISSIONS.COURSE_MANAGEMENT,
    PERMISSIONS.CONTENT_MANAGEMENT,
    PERMISSIONS.ASSESSMENT_MANAGEMENT,

    // Examination Management
    PERMISSIONS.QUESTION_BANK,
    PERMISSIONS.GRADE_MANAGEMENT,

    // Student Management
    PERMISSIONS.ATTENDANCE_MANAGEMENT,

    // Basic Access Rights
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_LESSONS,
    PERMISSIONS.VIEW_ASSIGNMENTS,
    PERMISSIONS.VIEW_RESULTS,
    PERMISSIONS.VIEW_ATTENDANCE,

    // Content Access
    PERMISSIONS.ACCESS_LMS,
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.EDIT_CONTENT,
    PERMISSIONS.PUBLISH_CONTENT,
  ],

  student: [
    // Basic Access Rights
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_LESSONS,
    PERMISSIONS.VIEW_ASSIGNMENTS,
    PERMISSIONS.SUBMIT_ASSIGNMENTS,
    PERMISSIONS.TAKE_EXAMS,
    PERMISSIONS.VIEW_RESULTS,
    PERMISSIONS.VIEW_ATTENDANCE,

    // Content Access
    PERMISSIONS.ACCESS_LMS,
  ],
};

// Helper function to check if a role has a specific permission
export const can = (role, permission) => {
  if (!role || !permission) return false;

  const rolePermissions = ROLE_PERMISSIONS[role];
  if (!rolePermissions) return false;

  return rolePermissions.includes(permission);
};

// Helper function to check if current user has a specific permission
export const currentUserCan = (permission) => {
  const role = localStorage.getItem("userRole");
  return can(role, permission);
};

// Helper function to get all permissions for a role
export const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

// Helper function to check if user has any of the provided permissions
export const canAny = (role, permissions = []) => {
  return permissions.some((permission) => can(role, permission));
};

// Helper function to check if user has all of the provided permissions
export const canAll = (role, permissions = []) => {
  return permissions.every((permission) => can(role, permission));
};

// Navigation menu items based on permissions
export const getMenuItems = (role) => {
  const menuItems = [];

  if (can(role, PERMISSIONS.VIEW_DASHBOARD)) {
    menuItems.push({
      name: "Dashboard",
      href: "/dashboard",
      icon: "dashboard",
      permission: PERMISSIONS.VIEW_DASHBOARD,
    });
  }

  if (can(role, PERMISSIONS.ACADEMIC_ADMIN)) {
    menuItems.push({
      name: "Academics",
      href: "/academics",
      icon: "academic",
      permission: PERMISSIONS.ACADEMIC_ADMIN,
      subItems: [
        ...(can(role, PERMISSIONS.LESSON_PLAN_MANAGEMENT)
          ? [
              {
                name: "Lesson Plans",
                href: "/academics/lesson-plans",
                permission: PERMISSIONS.LESSON_PLAN_MANAGEMENT,
              },
            ]
          : []),
        ...(can(role, PERMISSIONS.CURRICULUM_MANAGEMENT)
          ? [
              {
                name: "Curriculum",
                href: "/academics/curriculum",
                permission: PERMISSIONS.CURRICULUM_MANAGEMENT,
              },
            ]
          : []),
        ...(can(role, PERMISSIONS.ATTENDANCE_MANAGEMENT)
          ? [
              {
                name: "Attendance",
                href: "/academics/attendance",
                permission: PERMISSIONS.ATTENDANCE_MANAGEMENT,
              },
            ]
          : []),
      ],
    });
  }

  if (can(role, PERMISSIONS.ACCESS_LMS)) {
    menuItems.push({
      name: "LMS",
      href: "/lms",
      icon: "lms",
      permission: PERMISSIONS.ACCESS_LMS,
      subItems: [
        ...(can(role, PERMISSIONS.COURSE_MANAGEMENT)
          ? [
              {
                name: "Courses",
                href: "/lms/courses",
                permission: PERMISSIONS.COURSE_MANAGEMENT,
              },
            ]
          : []),
        {
          name: "Lessons",
          href: "/lms/lessons",
          permission: PERMISSIONS.VIEW_LESSONS,
        },
        ...(can(role, PERMISSIONS.ASSESSMENT_MANAGEMENT)
          ? [
              {
                name: "Assessments",
                href: "/lms/assessments",
                permission: PERMISSIONS.ASSESSMENT_MANAGEMENT,
              },
            ]
          : []),
      ],
    });
  }

  if (can(role, PERMISSIONS.EXAM_ADMIN)) {
    menuItems.push({
      name: "Examinations",
      href: "/exams",
      icon: "exam",
      permission: PERMISSIONS.EXAM_ADMIN,
    });
  }

  if (can(role, PERMISSIONS.STUDENT_ADMIN)) {
    menuItems.push({
      name: "Students",
      href: "/users/students",
      icon: "students",
      permission: PERMISSIONS.STUDENT_ADMIN,
    });
  }

  if (can(role, PERMISSIONS.STAFF_ADMIN)) {
    menuItems.push({
      name: "Staff",
      href: "/staff",
      icon: "staff",
      permission: PERMISSIONS.STAFF_ADMIN,
    });
  }

  if (can(role, PERMISSIONS.PROGRAM_MANAGEMENT)) {
    menuItems.push({
      name: "Master Setup",
      href: "/master",
      icon: "settings",
      permission: PERMISSIONS.PROGRAM_MANAGEMENT,
    });
  }

  return menuItems;
};
