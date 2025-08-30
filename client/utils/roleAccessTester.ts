import { UserRole } from "@/contexts/AuthContext";
import { hasModuleAccess, ModuleType } from "@/utils/modulePermissions";
// import { hasPermission, ResourceType } from "@/utils/permissions";

// Test all role-based access for debugging
export interface AccessTestResult {
  role: UserRole;
  module: ModuleType | null;
  resource: ResourceType | null;
  route: string;
  moduleAccess: boolean;
  resourceAccess: boolean;
  shouldHaveAccess: boolean;
  actualAccess: boolean;
  status: "PASS" | "FAIL" | "UNKNOWN";
}

// Key routes to test for each role
const testRoutes = [
  {
    route: "/lms/courses",
    module: "lms",
    resource: "courses",
    superAdminOnly: true,
  },
  { route: "/lms/assignments", module: "lms", resource: "assignments" },
  {
    route: "/academics/students",
    module: "academic-operation",
    resource: "students",
  },
  {
    route: "/exams/planning",
    module: "examination",
    resource: "exam_planning",
  },
  {
    route: "/master/entity-setup",
    module: "master-setup",
    resource: "entity_setup",
  },
] as const;

const allRoles: UserRole[] = [
  "super-admin",
  "admin",
  "institution",
  "principal",
  "hod",
  "faculty",
  "staff",
  "student",
  "parent",
];

export function testRoleAccess(role: UserRole): AccessTestResult[] {
  const results: AccessTestResult[] = [];

  for (const test of testRoutes) {
    const moduleAccess = hasModuleAccess(role, test.module as ModuleType);
    const resourceAccess = hasPermission(
      role,
      test.resource as ResourceType,
      "read",
    );
    const shouldHaveAccess = moduleAccess && resourceAccess;

    const result: AccessTestResult = {
      role,
      module: test.module as ModuleType,
      resource: test.resource as ResourceType,
      route: test.route,
      moduleAccess,
      resourceAccess,
      shouldHaveAccess,
      actualAccess: shouldHaveAccess, // We'll assume this matches for now
      status: shouldHaveAccess ? "PASS" : "FAIL",
    };

    results.push(result);
  }

  return results;
}

export function testAllRoles(): Record<UserRole, AccessTestResult[]> {
  const allResults: Record<UserRole, AccessTestResult[]> = {} as any;

  for (const role of allRoles) {
    allResults[role] = testRoleAccess(role);
  }

  return allResults;
}

export function generateAccessReport(): string {
  const allResults = testAllRoles();
  let report = "=== ROLE-BASED ACCESS TEST REPORT ===\n\n";

  for (const [role, results] of Object.entries(allResults)) {
    report += `Role: ${role.toUpperCase()}\n`;
    report += "".padEnd(40, "-") + "\n";

    for (const result of results) {
      const status = result.status === "PASS" ? "✅" : "❌";
      report += `${status} ${result.route}\n`;
      report += `   Module: ${result.module} (${result.moduleAccess ? "ALLOWED" : "DENIED"})\n`;
      report += `   Resource: ${result.resource} (${result.resourceAccess ? "ALLOWED" : "DENIED"})\n`;
      report += `   Overall: ${result.shouldHaveAccess ? "ALLOWED" : "DENIED"}\n\n`;
    }
    report += "\n";
  }

  return report;
}

// Specific test for super-admin LMS courses access
export function testSuperAdminCoursesAccess(): AccessTestResult {
  const role: UserRole = "super-admin";
  const module: ModuleType = "lms";
  const resource: ResourceType = "courses";
  const route = "/lms/courses";

  const moduleAccess = hasModuleAccess(role, module);
  const resourceAccess = hasPermission(role, resource, "read");
  const shouldHaveAccess = moduleAccess && resourceAccess;

  console.log("🔍 SUPER-ADMIN COURSES ACCESS TEST:");
  console.log("Module Access (LMS):", moduleAccess);
  console.log("Resource Access (courses.read):", resourceAccess);
  console.log("Should Have Access:", shouldHaveAccess);

  return {
    role,
    module,
    resource,
    route,
    moduleAccess,
    resourceAccess,
    shouldHaveAccess,
    actualAccess: shouldHaveAccess,
    status: shouldHaveAccess ? "PASS" : "FAIL",
  };
}

// Add these functions to window for easy debugging
if (typeof window !== "undefined") {
  (window as any).roleAccessTester = {
    testRoleAccess,
    testAllRoles,
    generateAccessReport,
    testSuperAdminCoursesAccess,
  };

  console.log("🧪 Role Access Tester available at window.roleAccessTester");
  console.log("Available commands:");
  console.log("- window.roleAccessTester.testSuperAdminCoursesAccess()");
  console.log("- window.roleAccessTester.generateAccessReport()");
  console.log("- window.roleAccessTester.testAllRoles()");
}
