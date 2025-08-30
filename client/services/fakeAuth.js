// Selected institutions based on actual entity.json data
export const selectedInstitutions = {
  101: {
    id: "101",
    code: "101",
    name: "CENTRAL POLYTECHNIC COLLEGE",
    type: "polytechnic",
    educationalAuthority: "DOTE",
    city: "Chennai",
    state: "Tamil Nadu",
    description: "One of the oldest and most reputed government polytechnic colleges in Tamil Nadu offering diploma courses in various disciplines.",
    established_year: 1916,
    num_faculties: 200,
    num_students: 3800,
    programs_offered: [
      "Civil Engineering",
      "Mechanical Engineering",
      "Electrical and Electronics Engineering",
      "Electronics and Communication Engineering",
      "Computer Engineering"
    ]
  },
  215: {
    id: "215",
    code: "215",
    name: "SAKTHI POLYTECHNIC COLLEGE",
    type: "polytechnic",
    educationalAuthority: "DOTE",
    city: "Chennai",
    state: "Tamil Nadu",
    description: "Government recognized institution offering quality education.",
    established_year: 2025,
    num_faculties: 50,
    num_students: 500,
    programs_offered: [
      "Engineering",
      "Technology",
      "Science"
    ]
  },
  320: {
    id: "320",
    code: "132",
    name: "KONGU POLYTECHNIC COLLEGE",
    type: "polytechnic",
    educationalAuthority: "DOTE",
    city: "Chennai",
    state: "Tamil Nadu",
    description: "Government recognized institution offering quality education.",
    established_year: 2025,
    num_faculties: 50,
    num_students: 500,
    programs_offered: [
      "Engineering",
      "Technology",
      "Science"
    ]
  }
};

// User credentials based on the three institutions from entity.json
export const fakeUsers = [
  // Super Admin - No institution restriction
  {
    id: "SA001",
    email: "superadmin@gmail.com",
    password: "admin123",
    role: "super-admin",
    name: "System Super Administrator",
    institution: null,
    institutionId: null,
    department: "System Administration",
  },

  // CENTRAL POLYTECHNIC COLLEGE (101) Users
  // Admin
  {
    id: "CPC_ADMIN_001",
    email: "admin@gmail.com",
    password: "admin123",
    role: "admin",
    name: "Central Polytechnic Administrator",
    institution: "101",
    institutionId: "101",
    institutionCode: "101",
    department: "Administration",
    designation: "Administrative Officer",
  },

  // Principal
  {
    id: "CPC_PRIN_001",
    email: "principal@gmail.com",
    password: "principal123",
    role: "principal",
    name: "Central Polytechnic Principal",
    institution: "101",
    institutionId: "101",
    institutionCode: "101",
    department: "Administration",
    designation: "Principal",
  },

  // HOD (Head of Department)
  {
    id: "CPC_HOD_001",
    email: "hod.cse@gmail.com",
    password: "hod123",
    role: "hod",
    name: "Dr. Rajesh Kumar",
    institution: "101",
    institutionId: "101",
    institutionCode: "101",
    department: "Computer Engineering",
    designation: "Head of Department",
  },
  {
    id: "CPC_HOD_002",
    email: "hod.mech@gmail.com",
    password: "hod123",
    role: "hod",
    name: "Dr. Suresh Babu",
    institution: "101",
    institutionId: "101",
    institutionCode: "101",
    department: "Mechanical Engineering",
    designation: "Head of Department",
  },

  // Faculty
  {
    id: "22142001",
    email: "blmurugank16@gmail.com",
    password: "faculty123",
    role: "faculty",
    name: "BALAMURUGAN",
    institution: "101",
    institutionId: "101",
    institutionCode: "101",
    faculty_id: 22142001,
    department: "COMPUTER ENGINEERING (FULL TIME)",
    designation: "Assistant Professor",
  },
  {
    id: "32142001",
    email: "ganesanmepgdmm@gmail.com",
    password: "faculty123",
    role: "faculty",
    name: "GANESAN",
    institution: "101",
    institutionId: "101",
    institutionCode: "101",
    faculty_id: 32142001,
    department: "COMPUTER ENGINEERING (FULL TIME)",
    designation: "Associate Professor",
  },
  {
    id: "11011001",
    email: "og.dharani@gmail.com",
    password: "faculty123",
    role: "faculty",
    name: "DHARANIPATHI",
    institution: "101",
    institutionId: "101",
    institutionCode: "101",
    faculty_id: 11011001,
    department: "ELECTRONICS AND COMMUNICATION ENGINEERING (FULL TIME)",
    designation: "Assistant Professor",
  },
  {
    id: "11011002",
    email: "bsinigo@gmail.com",
    password: "faculty123",
    role: "faculty",
    name: "INIGO",
    institution: "101",
    institutionId: "101",
    institutionCode: "101",
    faculty_id: 11011002,
    department: "ELECTRONICS AND COMMUNICATION ENGINEERING (FULL TIME)",
    designation: "Professor",
  },

  // Students
  {
    id: "22405531",
    email: "arun.kumar@gmail.com",
    password: "student123",
    role: "student",
    name: "ARUN KUMAR S",
    institution: "101",
    institutionId: "101",
    institutionCode: "101",
    student_id: 22405531,
    department: "COMPUTER ENGINEERING (FULL TIME)",
    year: 2,
    semester: 3,
  },
  {
    id: "22405547",
    email: "priya.r@gmail.com",
    password: "student123",
    role: "student",
    name: "PRIYA R",
    institution: "101",
    institutionId: "101",
    institutionCode: "101",
    student_id: 22405547,
    department: "COMPUTER ENGINEERING (FULL TIME)",
    year: 2,
    semester: 3,
  },
  {
    id: "23101223",
    email: "karthik.raja@gmail.com",
    password: "student123",
    role: "student",
    name: "KARTHIK RAJA M",
    institution: "101",
    institutionId: "101",
    institutionCode: "101",
    student_id: 23101223,
    department: "ELECTRONICS AND COMMUNICATION ENGINEERING (FULL TIME)",
    year: 2,
    semester: 3,
  },
  {
    id: "23202735",
    email: "kavitha.s@gmail.com",
    password: "student123",
    role: "student",
    name: "DIVYA SRI K",
    institution: "101",
    institutionId: "101",
    institutionCode: "101",
    student_id: 23202735,
    department: "ELECTRONICS AND COMMUNICATION ENGINEERING (FULL TIME)",
    year: 2,
    semester: 3,
  },

  // Parents
  {
    id: "23601901",
    email: "kumar.father@gmail.com",
    password: "parent123",
    role: "parent",
    name: "K. Raghavan",
    institution: "101",
    institutionId: "101",
    institutionCode: "101",
    studentId: 23601901,
    studentName: "Anand Raj K",
    relationship: "Father",
  },
  {
    id: "23601902",
    email: "deepika.mother@gmail.com",
    password: "parent123",
    role: "parent",
    name: "M. Priya",
    institution: "101",
    institutionId: "101",
    institutionCode: "101",
    studentId: 23601902,
    studentName: "Deepika M",
    relationship: "Mother",
  },
  {
    id: "23601903",
    email: "surya.father@gmail.com",
    password: "parent123",
    role: "parent",
    name: "T. Murugan",
    institution: "101",
    institutionId: "101",
    institutionCode: "101",
    studentId: 23601903,
    studentName: "Surya Prakash T",
    relationship: "Father",
  },

  // SAKTHI POLYTECHNIC COLLEGE (215) Users
  // Admin
  {
    id: "SPC_ADMIN_001",
    email: "admin@sakthi.edu.in",
    password: "admin123",
    role: "admin",
    name: "Sakthi Polytechnic Administrator",
    institution: "215",
    institutionId: "215",
    institutionCode: "215",
    department: "Administration",
    designation: "Administrative Officer",
  },

  // Principal
  {
    id: "SPC_PRIN_001",
    email: "principal@sakthi.edu.in",
    password: "principal123",
    role: "principal",
    name: "Sakthi Polytechnic Principal",
    institution: "215",
    institutionId: "215",
    institutionCode: "215",
    department: "Administration",
    designation: "Principal",
  },

  // HOD
  {
    id: "SPC_HOD_001",
    email: "hod.eng@sakthi.edu.in",
    password: "hod123",
    role: "hod",
    name: "Dr. Priya Sharma",
    institution: "215",
    institutionId: "215",
    institutionCode: "215",
    department: "Engineering",
    designation: "Head of Department",
  },

  // Faculty
  {
    id: "F_SPC_001",
    email: "faculty1@sakthi.edu.in",
    password: "faculty123",
    role: "faculty",
    name: "Mohan Kumar",
    institution: "215",
    institutionId: "215",
    institutionCode: "215",
    faculty_id: 21500101,
    department: "Engineering",
    designation: "Assistant Professor",
  },
  {
    id: "F_SPC_002",
    email: "faculty2@sakthi.edu.in",
    password: "faculty123",
    role: "faculty",
    name: "Priya Nair",
    institution: "215",
    institutionId: "215",
    institutionCode: "215",
    faculty_id: 21500102,
    department: "Technology",
    designation: "Associate Professor",
  },

  // Students
  {
    id: "S_SPC_001",
    email: "student1@sakthi.edu.in",
    password: "student123",
    role: "student",
    name: "Arjun Raj",
    institution: "215",
    institutionId: "215",
    institutionCode: "215",
    student_id: 21500201,
    department: "Engineering",
    year: 1,
    semester: 2,
  },
  {
    id: "S_SPC_002",
    email: "student2@sakthi.edu.in",
    password: "student123",
    role: "student",
    name: "Meera Krishna",
    institution: "215",
    institutionId: "215",
    institutionCode: "215",
    student_id: 21500202,
    department: "Technology",
    year: 1,
    semester: 2,
  },

  // Parent
  {
    id: "P_SPC_001",
    email: "arjun.father@sakthi.edu.in",
    password: "parent123",
    role: "parent",
    name: "Raj Kumar",
    institution: "215",
    institutionId: "215",
    institutionCode: "215",
    studentId: 21500201,
    studentName: "Arjun Raj",
    relationship: "Father",
  },

  // KONGU POLYTECHNIC COLLEGE (320) Users
  // Admin
  {
    id: "KPC_ADMIN_001",
    email: "admin@kongu.edu.in",
    password: "admin123",
    role: "admin",
    name: "Kongu Polytechnic Administrator",
    institution: "320",
    institutionId: "320",
    institutionCode: "132",
    department: "Administration",
    designation: "Administrative Officer",
  },

  // Principal
  {
    id: "KPC_PRIN_001",
    email: "principal@kongu.edu.in",
    password: "principal123",
    role: "principal",
    name: "Kongu Polytechnic Principal",
    institution: "320",
    institutionId: "320",
    institutionCode: "132",
    department: "Administration",
    designation: "Principal",
  },

  // HOD
  {
    id: "KPC_HOD_001",
    email: "hod.tech@kongu.edu.in",
    password: "hod123",
    role: "hod",
    name: "Dr. Karthik Mohan",
    institution: "320",
    institutionId: "320",
    institutionCode: "132",
    department: "Technology",
    designation: "Head of Department",
  },

  // Faculty
  {
    id: "F_KPC_001",
    email: "faculty1@kongu.edu.in",
    password: "faculty123",
    role: "faculty",
    name: "Raman Suresh",
    institution: "320",
    institutionId: "320",
    institutionCode: "132",
    faculty_id: 32000101,
    department: "Engineering",
    designation: "Assistant Professor",
  },
  {
    id: "F_KPC_002",
    email: "faculty2@kongu.edu.in",
    password: "faculty123",
    role: "faculty",
    name: "Divya Lakshmi",
    institution: "320",
    institutionId: "320",
    institutionCode: "132",
    faculty_id: 32000102,
    department: "Science",
    designation: "Associate Professor",
  },

  // Students
  {
    id: "S_KPC_001",
    email: "student1@kongu.edu.in",
    password: "student123",
    role: "student",
    name: "Gopal Krishna",
    institution: "320",
    institutionId: "320",
    institutionCode: "132",
    student_id: 32000201,
    department: "Engineering",
    year: 1,
    semester: 2,
  },
  {
    id: "S_KPC_002",
    email: "student2@kongu.edu.in",
    password: "student123",
    role: "student",
    name: "Kavya Sree",
    institution: "320",
    institutionId: "320",
    institutionCode: "132",
    student_id: 32000202,
    department: "Science",
    year: 1,
    semester: 2,
  },

  // Parent
  {
    id: "P_KPC_001",
    email: "gopal.father@kongu.edu.in",
    password: "parent123",
    role: "parent",
    name: "Krishna Murthy",
    institution: "320",
    institutionId: "320",
    institutionCode: "132",
    studentId: 32000201,
    studentName: "Gopal Krishna",
    relationship: "Father",
  },
];

// Global debug function for testing
if (typeof window !== 'undefined') {
  window.debugParentLogin = async () => {
    console.log("🧪 Debug Parent Login Test");
    try {
      const result = await fakeAuth.login("kumar.father@gmail.com", "parent123", { role: "parent", institution: "101" });
      console.log("✅ Parent login successful:", result);
      return result;
    } catch (error) {
      console.log("❌ Parent login failed:", error.message);
      return { error: error.message };
    }
  };

  window.debugParentUser = () => {
    const parentUser = fakeUsers.find(u => u.email === "kumar.father@gmail.com");
    console.log("👨‍👩‍👧‍👦 Parent user data:", parentUser);
    return parentUser;
  };
}

export const fakeAuth = {
  // Simulate login with email, password, and optional context (role, institution)
  login: async (email, password, context = {}) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.group("🔐 Institution-Based Login Attempt");
        console.log("Input email:", email);
        console.log("Input password:", password);
        console.log("Context:", context);

        // Check for null/undefined inputs
        if (!email || !password) {
          console.log("❌ Missing email or password");
          console.groupEnd();
          reject(new Error("Email and password are required"));
          return;
        }

        // Normalize inputs
        const normalizedEmail = String(email).trim().toLowerCase();
        const normalizedPassword = String(password).trim();
        const { role: selectedRole, institution: selectedInstitution } = context;

        console.log("Normalized email:", normalizedEmail);
        console.log("Selected role:", selectedRole);
        console.log("Selected institution:", selectedInstitution);

        // Find matching user by email and password
        console.log("🔍 Searching for user with:");
        console.log("  Normalized email:", normalizedEmail);
        console.log("  Normalized password:", normalizedPassword);

        console.log("📋 Available users:");
        fakeUsers.forEach((u, index) => {
          console.log(`  ${index + 1}. ${u.email} (${u.role}) - Institution: ${u.institutionId || 'ALL'}`);
        });

        const user = fakeUsers.find((u) => {
          const userEmailLower = u.email.toLowerCase();
          const emailMatch = userEmailLower === normalizedEmail;
          const passwordMatch = u.password === normalizedPassword;

          console.log(`🔎 Checking user ${u.email}:`);
          console.log(`  Email match: ${emailMatch} (${userEmailLower} === ${normalizedEmail})`);
          console.log(`  Password match: ${passwordMatch} (${u.password} === ${normalizedPassword})`);

          return emailMatch && passwordMatch;
        });

        if (!user) {
          console.log("❌ No matching user found after checking all users");
          console.log("💡 DEMO CREDENTIALS BY INSTITUTION:");
          console.log("CENTRAL POLYTECHNIC COLLEGE (101):");
          console.log("  admin@gmail.com / admin123 (Admin)");
          console.log("  principal@gmail.com / principal123 (Principal)");
          console.log("  hod.cse@gmail.com / hod123 (HOD - Computer Engineering)");
          console.log("  hod.mech@gmail.com / hod123 (HOD - Mechanical Engineering)");
          console.log("  vijay.kumar@gmail.com / faculty123 (Faculty - Computer Engineering)");
          console.log("  lakshmi.devi@gmail.com / faculty123 (Faculty - ECE)");
          console.log("  anand.raj@gmail.com / student123 (Student - Computer Engineering)");
          console.log("  deepika.m@gmail.com / student123 (Student - Computer Engineering)");
          console.log("  kumar.father@gmail.com / parent123 (Parent - Anand Raj K)");
          console.log("  deepika.mother@gmail.com / parent123 (Parent - Deepika M)");
          console.log("SAKTHI POLYTECHNIC COLLEGE (215):");
          console.log("  admin@sakthi.edu.in / admin123 (Admin)");
          console.log("  principal@sakthi.edu.in / principal123 (Principal)");
          console.log("  hod.eng@sakthi.edu.in / hod123 (HOD - Engineering)");
          console.log("  faculty1@sakthi.edu.in / faculty123 (Faculty - Engineering)");
          console.log("  faculty2@sakthi.edu.in / faculty123 (Faculty - Technology)");
          console.log("  student1@sakthi.edu.in / student123 (Student - Engineering)");
          console.log("  student2@sakthi.edu.in / student123 (Student - Technology)");
          console.log("  arjun.father@sakthi.edu.in / parent123 (Parent - Arjun Raj)");
          console.log("KONGU POLYTECHNIC COLLEGE (320):");
          console.log("  admin@kongu.edu.in / admin123 (Admin)");
          console.log("  principal@kongu.edu.in / principal123 (Principal)");
          console.log("  hod.tech@kongu.edu.in / hod123 (HOD - Technology)");
          console.log("  faculty1@kongu.edu.in / faculty123 (Faculty - Engineering)");
          console.log("  faculty2@kongu.edu.in / faculty123 (Faculty - Science)");
          console.log("  student1@kongu.edu.in / student123 (Student - Engineering)");
          console.log("  student2@kongu.edu.in / student123 (Student - Science)");
          console.log("  gopal.father@kongu.edu.in / parent123 (Parent - Gopal Krishna)");
          console.log("Super Admin:");
          console.log("  superadmin@gmail.com / admin123 (Super Admin)");
          console.groupEnd();
          reject(new Error("Invalid email or password. Check console for demo credentials."));
          return;
        }

        // Validate role and institution constraints
        console.log("🔍 Role validation check:");
        console.log("  selectedRole:", selectedRole, typeof selectedRole, `'${selectedRole}'`);
        console.log("  user.role:", user.role, typeof user.role, `'${user.role}'`);
        console.log("  roles match:", user.role === selectedRole);
        console.log("  selectedRole length:", selectedRole ? selectedRole.length : 'null');
        console.log("  user.role length:", user.role ? user.role.length : 'null');
        console.log("  selectedRole char codes:", selectedRole ? [...selectedRole].map(c => c.charCodeAt(0)) : 'null');
        console.log("  user.role char codes:", user.role ? [...user.role].map(c => c.charCodeAt(0)) : 'null');

        // Temporarily disable role validation to test
        console.log("⚠️ ROLE VALIDATION TEMPORARILY DISABLED FOR DEBUGGING");

        // if (selectedRole && user.role !== selectedRole) {
        //   console.log(`❌ Role mismatch: User is '${user.role}' (${typeof user.role}), but '${selectedRole}' (${typeof selectedRole}) was selected`);
        //   console.groupEnd();
        //   reject(new Error(`This account is not authorized for ${selectedRole} role.`));
        //   return;
        // }

        // Super admin doesn't need institution validation
        if (user.role === "super-admin") {
          console.log("✅ Super admin login - no institution restrictions");
        } else {
          // Non-super-admin users must match institution by ID
          if (selectedInstitution && user.institutionId !== selectedInstitution) {
            console.log(`❌ Institution mismatch: User belongs to ${user.institutionId}, but ${selectedInstitution} was selected`);
            console.groupEnd();
            reject(new Error(`This account is not authorized for institution ${selectedInstitution}.`));
            return;
          }

          if (!selectedInstitution) {
            console.log("❌ Institution required for non-super-admin users");
            console.groupEnd();
            reject(new Error("Institution selection is required for this role."));
            return;
          }
        }

        console.log("✅ Login successful for user:", {
          email: user.email,
          role: user.role,
          institution: user.institution,
          institutionId: user.institutionId,
        });
        console.groupEnd();

        // Store user data in localStorage with institution info
        const userData = { ...user };
        delete userData.password; // Don't store password in localStorage

        // Add selected institution info for super admin if they selected one
        if (user.role === "super-admin" && selectedInstitution) {
          userData.selectedInstitution = selectedInstitution;
          userData.selectedInstitutionId = selectedInstitution;
          const institutionInfo = selectedInstitutions[selectedInstitution];
          if (institutionInfo) {
            userData.selectedInstitutionCode = institutionInfo.code;
            userData.selectedInstitutionName = institutionInfo.name;
          }
        }

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userInstitution", user.institutionId || selectedInstitution || "ALL");
        localStorage.setItem("userInstitutionCode", user.institutionCode || (user.role === "super-admin" && selectedInstitution ? selectedInstitutions[selectedInstitution]?.code : "") || "ALL");
        localStorage.setItem("isAuthenticated", "true");
        resolve(userData);
      }, 1000); // Simulate network delay
    });
  },

  // Simulate logout
  logout: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem("user");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userInstitution");
        localStorage.removeItem("userInstitutionCode");
        localStorage.removeItem("isAuthenticated");
        resolve();
      }, 500);
    });
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (user && isAuthenticated === "true") {
      return JSON.parse(user);
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem("isAuthenticated") === "true";
  },

  // Get current user role
  getCurrentUserRole: () => {
    return localStorage.getItem("userRole");
  },

  // Simulate password reset
  resetPassword: async (email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = fakeUsers.find((u) => u.email === email);
        if (user) {
          resolve({ message: "Password reset link sent to your email" });
        } else {
          reject(new Error("Email not found"));
        }
      }, 1000);
    });
  },

  // Clear all authentication data (useful for debugging)
  clearAuth: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userInstitution");
    localStorage.removeItem("userInstitutionCode");
    localStorage.removeItem("isAuthenticated");
    console.log("✅ Authentication data cleared from localStorage");
  },

  // Get selected institutions
  getSelectedInstitutions: () => {
    return selectedInstitutions;
  },

  // Get institution details by ID
  getInstitutionById: (id) => {
    return selectedInstitutions[id] || null;
  },
};

// Quick login functions for testing
export const quickLogin = {
  superAdmin: () => fakeAuth.login("superadmin@gmail.com", "admin123", { role: "super-admin" }),

  // Central Polytechnic College (101)
  cpcAdmin: () => fakeAuth.login("admin@gmail.com", "admin123", { role: "admin", institution: "101" }),
  cpcPrincipal: () => fakeAuth.login("principal@gmail.com", "principal123", { role: "principal", institution: "101" }),
  cpcHodCSE: () => fakeAuth.login("hod.cse@gmail.com", "hod123", { role: "hod", institution: "101" }),
  cpcHodMech: () => fakeAuth.login("hod.mech@gmail.com", "hod123", { role: "hod", institution: "101" }),
  cpcFaculty: () => fakeAuth.login("vijay.kumar@gmail.com", "faculty123", { role: "faculty", institution: "101" }),
  cpcStudent: () => fakeAuth.login("anand.raj@gmail.com", "student123", { role: "student", institution: "101" }),
  cpcParent: () => fakeAuth.login("kumar.father@gmail.com", "parent123", { role: "parent", institution: "101" }),

  // Sakthi Polytechnic College (215)
  spcAdmin: () => fakeAuth.login("admin@sakthi.edu.in", "admin123", { role: "admin", institution: "215" }),
  spcPrincipal: () => fakeAuth.login("principal@sakthi.edu.in", "principal123", { role: "principal", institution: "215" }),
  spcHod: () => fakeAuth.login("hod.eng@sakthi.edu.in", "hod123", { role: "hod", institution: "215" }),
  spcFaculty: () => fakeAuth.login("faculty1@sakthi.edu.in", "faculty123", { role: "faculty", institution: "215" }),
  spcStudent: () => fakeAuth.login("student1@sakthi.edu.in", "student123", { role: "student", institution: "215" }),
  spcParent: () => fakeAuth.login("arjun.father@sakthi.edu.in", "parent123", { role: "parent", institution: "215" }),

  // Kongu Polytechnic College (320)
  kpcAdmin: () => fakeAuth.login("admin@kongu.edu.in", "admin123", { role: "admin", institution: "320" }),
  kpcPrincipal: () => fakeAuth.login("principal@kongu.edu.in", "principal123", { role: "principal", institution: "320" }),
  kpcHod: () => fakeAuth.login("hod.tech@kongu.edu.in", "hod123", { role: "hod", institution: "320" }),
  kpcFaculty: () => fakeAuth.login("faculty1@kongu.edu.in", "faculty123", { role: "faculty", institution: "320" }),
  kpcStudent: () => fakeAuth.login("student1@kongu.edu.in", "student123", { role: "student", institution: "320" }),
  kpcParent: () => fakeAuth.login("gopal.father@kongu.edu.in", "parent123", { role: "parent", institution: "320" }),

  // Test function for debugging parent login
  testParentLogin: async () => {
    console.log("🧪 Testing parent login...");
    try {
      const result = await fakeAuth.login("kumar.father@gmail.com", "parent123", { role: "parent", institution: "101" });
      console.log("✅ Parent login successful:", result);
      return result;
    } catch (error) {
      console.log("❌ Parent login failed:", error);
      throw error;
    }
  },
};

// Expose fakeAuth globally for debugging in development
if (typeof window !== "undefined") {
  window.fakeAuth = fakeAuth;
  window.quickLogin = quickLogin;
  window.selectedInstitutions = selectedInstitutions;

  window.testLogin = (email, password, role, institution) => {
    console.log("🧪 Testing login with:", { email, password, role, institution });
    return fakeAuth.login(email, password, { role, institution });
  };

  window.listUsers = () => {
    console.log("👥 Available users:");
    fakeUsers.forEach((u, index) => {
      console.log(`${index + 1}. ${u.email} / ${u.password} (${u.role}) - Institution: ${u.institutionId || "ALL"} (${u.institutionCode || "ALL"})`);
    });
  };

  window.listInstitutions = () => {
    console.log("🏛️ Selected institutions:");
    Object.values(selectedInstitutions).forEach((inst, index) => {
      console.log(`${index + 1}. ${inst.id}: ${inst.name} (${inst.code}) - ${inst.type}`);
    });
  };

  console.log("🔧 Debug: fakeAuth service available at window.fakeAuth");
  console.log("🔧 Available commands:");
  console.log("  - window.fakeAuth.clearAuth()");
  console.log('  - window.testLogin("email", "password", "role", "institution")');
  console.log("  - window.listUsers() - shows all available users");
  console.log("  - window.listInstitutions() - shows selected institutions");
  console.log("  - window.quickLogin.cpcAdmin() - Central Polytechnic College (101)");
  console.log("  - window.quickLogin.spcAdmin() - Sakthi Polytechnic College (215)");
  console.log("  - window.quickLogin.kpcAdmin() - Kongu Polytechnic College (320)");
}
