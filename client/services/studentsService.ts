import { Student } from "@/mock/data";

// Institution mapping for legacy data compatibility
const institutionMapping: Record<string, string> = {
  MIT: "INST1001",
  Stanford: "INST1002",
  Harvard: "INST1004",
  "UC Berkeley": "101",
  Caltech: "102",
  "Carnegie Mellon": "103",
  Princeton: "104",
  Yale: "105",
};

// Transform JSON student data to Student interface
const transformStudentData = (student: any): Student => {
  const originalInstitution = student.academic_info?.institution || "";
  const mappedInstitution =
    institutionMapping[originalInstitution] || originalInstitution;

  return {
    id: student.student_id?.toString() || "",
    name:
      student.personal_info?.full_name ||
      `${student.personal_info?.first_name || ""} ${student.personal_info?.last_name || ""}`.trim(),
    email: student.contact_info?.email || "",
    rollNumber: student.roll_number || student.registration_number || "",
    institution: mappedInstitution,
    educationalAuthority: student.academic_info?.educational_authority || "",
    program: student.academic_info?.program || "",
    year: student.academic_info?.year || 1,
    semester: student.academic_info?.semester || 1,
    status:
      student.status?.toLowerCase() === "active"
        ? ("active" as const)
        : student.status?.toLowerCase() === "graduated"
          ? ("graduated" as const)
          : ("inactive" as const),
    avatar: student.documents?.profile_photo || undefined,
  };
};

// Load students from JSON file
export const loadStudentsFromJSON = async (): Promise<Student[]> => {
  try {
    console.log("🔄 Loading students from /students.json...");
    const response = await fetch("/students.json");
    if (!response.ok) {
      throw new Error(`Failed to load students data: ${response.statusText}`);
    }
    const studentsData = await response.json();
    console.log(
      "📄 Raw students data loaded:",
      studentsData?.length,
      "records",
    );

    if (!Array.isArray(studentsData)) {
      console.warn("⚠️ Students data is not an array, returning empty array");
      return [];
    }

    // Transform and filter out invalid entries
    const transformedStudents = studentsData
      .map(transformStudentData)
      .filter((student) => {
        const isValid = student.id && student.name && student.email;
        if (!isValid) {
          console.log("❌ Filtered out invalid student:", student);
        }
        return isValid;
      });

    console.log(
      "✅ Transformed students:",
      transformedStudents.length,
      "valid records",
    );
    console.log("📋 Sample student:", transformedStudents[0]);

    // Log institution distribution
    const institutionCounts = transformedStudents.reduce(
      (acc, student) => {
        acc[student.institution] = (acc[student.institution] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    console.log("🏛️ Students by institution:", institutionCounts);

    return transformedStudents;
  } catch (error) {
    console.error("❌ Error loading students from JSON:", error);
    return [];
  }
};

// Filter students by institution
export const filterStudentsByInstitution = (
  students: Student[],
  institutionFilter: string | null,
): Student[] => {
  console.log("🔍 Filtering students by institution:", institutionFilter);
  console.log("📊 Total students before filtering:", students.length);

  if (!institutionFilter || institutionFilter === "ALL") {
    console.log("✅ No filter applied, returning all students");
    return students;
  }

  const filtered = students.filter((student) => {
    // Try to match by institution name or institution code/ID
    const institution = student.institution;
    const matches =
      institution === institutionFilter ||
      institution === institutionFilter.toString() ||
      student.educationalAuthority === institutionFilter;

    if (matches) {
      console.log(
        "✅ Student matches filter:",
        student.name,
        "from",
        institution,
      );
    }

    return matches;
  });

  console.log("📊 Students after filtering:", filtered.length);
  return filtered;
};

// Get user's institution for filtering
export const getUserInstitutionFilter = (user: any): string | null => {
  console.log("👤 Getting institution filter for user:", user);

  // Super admin can see all students
  if (user?.role === "super-admin") {
    console.log("👑 Super admin - showing all institutions");
    return null; // Show all
  }

  // For other roles, use their institution
  const institutionFilter =
    user?.institutionId ||
    user?.institution ||
    user?.selectedInstitutionId ||
    null;
  console.log("🏛️ User institution filter:", institutionFilter);

  return institutionFilter;
};

// Load entity data for institution mapping
export const loadEntitiesFromJSON = async () => {
  try {
    console.log("🔄 Loading entities from /entity.json...");
    // Add cache-busting parameter to ensure fresh data
    const response = await fetch(`/entity.json?v=${Date.now()}`);
    if (!response.ok) {
      throw new Error(`Failed to load entity data: ${response.statusText}`);
    }
    const entityData = await response.json();
    console.log("📄 Raw entity data loaded:", entityData?.length, "records");
    console.log("📋 Sample entity:", entityData[0]);
    return entityData;
  } catch (error) {
    console.error("❌ Error loading entities from JSON:", error);
    return [];
  }
};

// Transform entity data for use in form dropdowns
export interface InstitutionOption {
  id: string;
  name: string;
  code: string;
  educationalAuthority: string;
}

export const transformEntityDataForDropdown = (
  entities: any[],
): InstitutionOption[] => {
  console.log("🔄 Transforming entity data for dropdown...");
  console.log("📊 Input entities:", entities.length);

  const transformed = entities
    .filter((entity) => {
      const hasRequired = entity.name && entity.id;
      if (!hasRequired) {
        console.log("❌ Filtered out entity missing name/id:", entity);
      }
      return hasRequired;
    })
    .map((entity) => ({
      id: entity.id.toString(),
      name: entity.name,
      code: entity.code || "",
      educationalAuthority: entity.educationalAuthority || "",
    }));

  // Remove duplicates by name (keep first occurrence)
  const uniqueInstitutions = transformed.filter(
    (institution, index, array) =>
      index === array.findIndex((inst) => inst.name === institution.name),
  );

  // Sort alphabetically
  uniqueInstitutions.sort((a, b) => a.name.localeCompare(b.name));

  console.log("✅ Transformed institutions:", transformed.length);
  console.log("✅ Unique institutions:", uniqueInstitutions.length);
  console.log("📋 Sample transformed:", uniqueInstitutions[0]);
  return uniqueInstitutions;
};
