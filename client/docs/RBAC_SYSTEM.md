# Role-Based Access Control (RBAC) System

## Overview

The ERP system implements a comprehensive Role-Based Access Control (RBAC) system that governs user permissions across all modules and operations. The system supports four primary user roles with specific CRUD (Create, Read, Update, Delete) permissions for each resource.

## User Roles

### 1. Admin
- **Full System Access**: Complete CRUD operations on all resources
- **User Management**: Can create, modify, and delete all user accounts
- **System Configuration**: Access to all master setup and configuration modules
- **Reports & Analytics**: Full access to all reports and analytics
- **Audit Controls**: Can monitor all system activities

### 2. Faculty
- **Teaching Focused**: CRUD operations for educational content they manage
- **Student Management**: Can view and update students in their courses
- **Assessment & Evaluation**: Full control over assignments, assessments, and grading
- **Limited Administration**: Cannot access system configuration or user management
- **Reporting**: Access to reports related to their courses and students

### 3. Student
- **Self-Service**: Primarily read access with limited create/update for their own data
- **Learning Activities**: Can submit assignments, take assessments, participate in forums
- **Progress Monitoring**: View their own academic progress and performance
- **Service Requests**: Can create and track service requests
- **No Administrative Access**: Cannot access system configuration or other users' data

### 4. Parent
- **Monitoring Only**: Read-only access to monitor their child's academic progress
- **Limited Scope**: Can only view information related to their child
- **No CRUD Operations**: Cannot create, modify, or delete any data
- **Safety & Privacy**: Cannot access other students' information

## Resource-Based Permissions

### Core System (Admin Only)
- Entity Setup, Academic Year, Program Setup
- Stream & Course Mapping, Term & Semester Setup
- Subject Master, Registration Forms
- User Roles & Permissions, Staff Management

### User Management (Admin Only)
- Administrator accounts
- Faculty member accounts
- Student records
- System permissions

### Academic Resources
| Resource | Admin | Faculty | Student | Parent |
|----------|-------|---------|---------|--------|
| Students | CRUD | RU | - | - |
| Curriculum | CRUD | RU | - | - |
| Timetable | CRUD | R | R | R |
| Lesson Plans | CRUD | CRUD | - | - |
| Attendance | CRUD | CRU | - | - |
| Feedback | CRUD | CRU | CR | - |
| Scholarships | CRUD | - | CR | - |
| Calendar | CRUD | R | R | R |
| Notifications | CRUD | CR | - | - |

### Learning Management System (LMS)
| Resource | Admin | Faculty | Student | Parent |
|----------|-------|---------|---------|--------|
| Courses | CRUD | CRU | R | R |
| Assignments | CRUD | CRUD | RU | - |
| Assessments | CRUD | CRUD | RU | - |
| Progress | CRUD | RU | R | R |
| Lessons | CRUD | CRUD | R | - |
| Cohorts | CRUD | RU | - | - |
| Discussion Forums | CRUD | CRU | CRU | - |
| Certificates | CRUD | R | R | - |
| Virtual Classrooms | CRUD | CRU | R | - |
| Proctoring | CRUD | RU | - | - |

### Examination System
| Resource | Admin | Faculty | Student | Parent |
|----------|-------|---------|---------|--------|
| Exam Planning | CRUD | RU | - | - |
| Eligibility | CRUD | R | R | - |
| Hall Tickets | CRUD | R | R | R |
| Question Bank | CRUD | CRU | - | - |
| Results | CRUD | RU | R | R |
| Revaluation | CRUD | - | CR | - |
| Transcripts | CRUD | - | R | - |

*Legend: C=Create, R=Read, U=Update, D=Delete*

## Implementation Details

### Permission Checking
```typescript
// Check specific permission
const canEdit = hasPermission(userRole, 'students', 'update');

// Component-based permission guarding
<PermissionGuard resource="students" operation="create">
  <Button>Add Student</Button>
</PermissionGuard>

// Hook-based permission checking
const { canCreate, canUpdate } = usePermissions();
```

### Route Protection
All routes are protected using the `ProtectedRoute` component with specific role requirements:

```typescript
<Route path="/academics/students" element={
  <ProtectedLayout>
    <ProtectedRoute allowedRoles={['admin', 'faculty']}>
      <StudentsPage />
    </ProtectedRoute>
  </ProtectedLayout>
} />
```

### Menu Filtering
Navigation menus are automatically filtered based on user roles, ensuring users only see options they have access to.

## Security Features

### Authentication Security
- **No Role Switching**: Users cannot switch between roles - they must log in with proper credentials
- **Session Management**: Secure session handling with automatic logout
- **Credential Validation**: Proper authentication required for all operations

### Authorization Security
- **Resource-Level Protection**: Every resource has specific permission requirements
- **Operation-Level Control**: CRUD operations are individually controlled
- **Route-Level Security**: All routes are protected with role-based access
- **Component-Level Guards**: UI elements are conditionally rendered based on permissions

### Data Security
- **Data Isolation**: Users can only access data they're authorized to see
- **Audit Trails**: All operations are logged for security monitoring
- **Privacy Protection**: Parent access is limited to their child's information only
- **Role Segregation**: Clear separation of duties between different user types

## Usage Guidelines

### For Developers
1. Always use `PermissionGuard` for conditional UI rendering
2. Check permissions before performing any CRUD operations
3. Use the `usePermissions` hook for complex permission logic
4. Ensure all new routes are properly protected with `ProtectedRoute`

### For System Administrators
1. Regularly review user role assignments
2. Monitor access logs for unauthorized access attempts
3. Ensure proper role assignment during user creation
4. Maintain principle of least privilege

### For End Users
1. Users should only request access to resources they need for their role
2. Report any unauthorized access immediately
3. Use proper authentication credentials
4. Do not share login credentials

## Compliance & Standards

The RBAC system complies with:
- **FERPA**: Educational privacy regulations
- **GDPR**: Data protection and privacy
- **SOX**: Internal controls for educational institutions
- **Industry Best Practices**: Role-based security standards

## Troubleshooting

### Common Issues
1. **Access Denied**: Check user role assignment and resource permissions
2. **Missing Menu Items**: Verify role-based menu filtering is working correctly
3. **Unauthorized Actions**: Ensure proper permission checks are in place

### Support
For technical issues with the RBAC system, contact the system administrator or refer to the technical documentation.
