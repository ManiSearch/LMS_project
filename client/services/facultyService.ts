import { Faculty } from "../pages/users/Faculty";

const FACULTY_FILE_PATH = "/public/faculty.json";

class FacultyService {
  private async readFacultyFile(): Promise<Faculty[]> {
    try {
      const response = await fetch("/faculty.json");
      if (response.ok) {
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      }
      return [];
    } catch (error) {
      console.error("Error reading faculty file:", error);
      return [];
    }
  }

  private async writeFacultyFile(faculty: Faculty[]): Promise<void> {
    try {
      const jsonData = JSON.stringify(faculty, null, 2);

      // Try to write to actual file using API endpoint (like EntitySetup)
      try {
        const response = await fetch("/api/faculty/write", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: jsonData,
        });

        if (response.ok) {
          console.log(
            `✅ Successfully saved ${faculty.length} faculty records to faculty.json file`,
          );
          return;
        } else {
          throw new Error(`API response not ok: ${response.statusText}`);
        }
      } catch (apiError) {
        console.warn(
          "⚠️ API write failed, falling back to download:",
          apiError,
        );
        // Fallback: trigger download for manual replacement
        this.downloadUpdatedFile(jsonData);
        console.log(
          "📥 Download triggered - please replace public/faculty.json manually",
        );
      }
    } catch (error) {
      console.error("Error writing faculty file:", error);
      throw error;
    }
  }

  private downloadUpdatedFile(jsonData: string): void {
    try {
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "faculty.json";
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log("📥 Faculty.json download triggered for manual replacement");
    } catch (error) {
      console.error("Error triggering file download:", error);
    }
  }

  // Method to manually download current faculty data for placement in public folder
  async downloadFacultyFile(): Promise<void> {
    const faculty = await this.getAllFaculty();
    const jsonData = JSON.stringify(faculty, null, 2);

    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "faculty.json";
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(
      "Downloaded faculty.json - Please place this file in the /public folder for persistence",
    );
  }

  // Get data source information
  async getDataSourceInfo(): Promise<{ source: string; count: number }> {
    try {
      const faculty = await this.readFacultyFile();
      return {
        source: "faculty.json",
        count: faculty.length,
      };
    } catch (error) {
      return { source: "faculty.json", count: 0 };
    }
  }

  async getAllFaculty(): Promise<Faculty[]> {
    // Read directly from faculty.json file only
    return await this.readFacultyFile();
  }

  async createFaculty(
    facultyData: Omit<Faculty, "faculty_id" | "metadata">,
  ): Promise<Faculty> {
    const faculty = await this.getAllFaculty();

    // Generate new faculty ID
    const facultyId = `F${new Date().getFullYear()}${String(faculty.length + 1).padStart(3, "0")}`;

    const newFaculty: Faculty = {
      ...facultyData,
      faculty_id: facultyId,
      metadata: {
        created_at: new Date().toISOString(),
        created_by: "admin",
        updated_at: new Date().toISOString(),
        updated_by: "admin",
      },
    };

    const updatedFaculty = [...faculty, newFaculty];
    await this.writeFacultyFile(updatedFaculty);

    return newFaculty;
  }

  async updateFaculty(
    facultyId: string,
    facultyData: Partial<Faculty>,
  ): Promise<Faculty | null> {
    const faculty = await this.getAllFaculty();
    const index = faculty.findIndex((f) => f.faculty_id === facultyId);

    if (index === -1) {
      throw new Error("Faculty member not found");
    }

    const updatedFaculty = {
      ...faculty[index],
      ...facultyData,
      faculty_id: facultyId, // Ensure ID doesn't change
      metadata: {
        ...faculty[index].metadata,
        updated_at: new Date().toISOString(),
        updated_by: "admin",
      },
    };

    faculty[index] = updatedFaculty;
    await this.writeFacultyFile(faculty);

    return updatedFaculty;
  }

  async deleteFaculty(facultyId: string): Promise<boolean> {
    const faculty = await this.getAllFaculty();
    const filteredFaculty = faculty.filter((f) => f.faculty_id !== facultyId);

    if (filteredFaculty.length === faculty.length) {
      throw new Error("Faculty member not found");
    }

    await this.writeFacultyFile(filteredFaculty);
    return true;
  }

  async getFacultyById(facultyId: string): Promise<Faculty | null> {
    const faculty = await this.getAllFaculty();
    return faculty.find((f) => f.faculty_id === facultyId) || null;
  }

  // Method to import faculty data from a JSON file
  async importFacultyFile(content: string): Promise<Faculty[]> {
    try {
      const importedFaculty = JSON.parse(content);
      if (!Array.isArray(importedFaculty)) {
        throw new Error(
          "Invalid file format: expected array of faculty objects",
        );
      }

      const existingFaculty = await this.getAllFaculty();
      const existingIds = new Set(existingFaculty.map((f) => f.faculty_id));

      // Merge imported faculty with existing ones, avoiding duplicates
      const newFaculty = importedFaculty.filter(
        (faculty) => faculty.faculty_id && !existingIds.has(faculty.faculty_id),
      );

      const mergedFaculty = [...existingFaculty, ...newFaculty];
      await this.writeFacultyFile(mergedFaculty);

      return mergedFaculty;
    } catch (error) {
      console.error("Error importing faculty file:", error);
      throw new Error("Invalid JSON format: " + error.message);
    }
  }

  // Enhanced export method supporting JSON, CSV, and Excel formats
  async exportFacultyFile(
    format: "json" | "csv" | "excel" = "json",
  ): Promise<void> {
    const faculty = await this.getAllFaculty();
    const timestamp = new Date().toISOString().split("T")[0];

    if (format === "json") {
      // Export as JSON with nested structure
      const jsonData = JSON.stringify(faculty, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });
      this.downloadFile(blob, `faculty_export_${timestamp}.json`);
    } else if (format === "csv") {
      // Export as CSV with flattened structure
      const flattenedFaculty = faculty.map((f) => this.flattenFaculty(f));
      const csvContent = this.generateCSVFromFlat(flattenedFaculty);
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      this.downloadFile(blob, `faculty_export_${timestamp}.csv`);
    } else if (format === "excel") {
      // Export as Excel with flattened structure
      await this.exportAsExcel(faculty, `faculty_export_${timestamp}.xlsx`);
    }
  }

  // Enhanced import method supporting both JSON and CSV/Excel files
  async importFacultyFileEnhanced(
    file: File,
  ): Promise<{
    faculty: Faculty[];
    summary: { added: number; updated: number; total: number };
  }> {
    try {
      const existingFaculty = await this.getAllFaculty();
      const existingFacultyMap = new Map(
        existingFaculty.map((f) => [f.faculty_id, f]),
      );

      let importedFaculty: Faculty[] = [];

      if (file.name.endsWith(".json")) {
        // Handle JSON import
        const content = await this.readFileContent(file);
        const parsedData = JSON.parse(content);
        if (!Array.isArray(parsedData)) {
          throw new Error("JSON file must contain an array of faculty objects");
        }
        importedFaculty = parsedData;
      } else if (
        file.name.endsWith(".csv") ||
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls")
      ) {
        // Handle CSV/Excel import
        const flatData = await this.parseFileContent(file);
        importedFaculty = flatData.map((data) => this.unflattenFaculty(data));
      } else {
        throw new Error(
          "Unsupported file format. Please use .json, .csv, or .xlsx files",
        );
      }

      let addedCount = 0;
      let updatedCount = 0;
      const finalFaculty = [...existingFaculty];

      for (const importedFac of importedFaculty) {
        if (!importedFac.faculty_id) {
          // Generate ID for new faculty
          importedFac.faculty_id = `FAC${new Date().getFullYear()}${String(finalFaculty.length + 1).padStart(3, "0")}`;
        }

        const existingIndex = finalFaculty.findIndex(
          (f) => f.faculty_id === importedFac.faculty_id,
        );

        if (existingIndex >= 0) {
          // Update existing faculty (merge)
          finalFaculty[existingIndex] = {
            ...finalFaculty[existingIndex],
            ...importedFac,
          };
          updatedCount++;
        } else {
          // Add new faculty
          finalFaculty.push(importedFac);
          addedCount++;
        }
      }

      await this.writeFacultyFile(finalFaculty);

      return {
        faculty: finalFaculty,
        summary: {
          added: addedCount,
          updated: updatedCount,
          total: finalFaculty.length,
        },
      };
    } catch (error) {
      console.error("Error importing faculty file:", error);
      throw new Error(`Import failed: ${error.message}`);
    }
  }

  // Flatten nested faculty object for CSV/Excel export
  private flattenFaculty(faculty: Faculty): Record<string, any> {
    return {
      faculty_id: faculty.faculty_id,
      employee_number: faculty.employee_number,
      joining_date: faculty.joining_date,
      designation: faculty.designation,
      department: faculty.department,
      specialization: faculty.specialization,
      employment_type: faculty.employment_type,
      experience_years: faculty.experience_years,
      employment_status: faculty.employment_status,

      // Personal Info
      personal_info_first_name: faculty.personal_info.first_name,
      personal_info_middle_name: faculty.personal_info.middle_name,
      personal_info_last_name: faculty.personal_info.last_name,
      personal_info_full_name: faculty.personal_info.full_name,
      personal_info_date_of_birth: faculty.personal_info.date_of_birth,
      personal_info_gender: faculty.personal_info.gender,
      personal_info_blood_group: faculty.personal_info.blood_group,
      personal_info_nationality: faculty.personal_info.nationality,
      personal_info_marital_status: faculty.personal_info.marital_status,
      personal_info_religion: faculty.personal_info.religion,
      personal_info_category: faculty.personal_info.category,

      // Contact Info
      contact_info_email: faculty.contact_info.email,
      contact_info_phone_number: faculty.contact_info.phone_number,
      contact_info_alternate_phone: faculty.contact_info.alternate_phone,
      contact_info_address_line: faculty.contact_info.address.line,
      contact_info_address_city: faculty.contact_info.address.city,
      contact_info_address_state: faculty.contact_info.address.state,
      contact_info_address_zip_code: faculty.contact_info.address.zip_code,
      contact_info_address_country: faculty.contact_info.address.country,
      contact_info_emergency_contact_name:
        faculty.contact_info.emergency_contact.name,
      contact_info_emergency_contact_relationship:
        faculty.contact_info.emergency_contact.relationship,
      contact_info_emergency_contact_phone:
        faculty.contact_info.emergency_contact.phone,

      // Qualification Info
      qualification_info_ug_degree: faculty.qualification_info.ug_degree,
      qualification_info_ug_institution:
        faculty.qualification_info.ug_institution,
      qualification_info_ug_year: faculty.qualification_info.ug_year,
      qualification_info_pg_degree: faculty.qualification_info.pg_degree,
      qualification_info_pg_institution:
        faculty.qualification_info.pg_institution,
      qualification_info_pg_year: faculty.qualification_info.pg_year,
      qualification_info_phd_subject: faculty.qualification_info.phd_subject,
      qualification_info_phd_institution:
        faculty.qualification_info.phd_institution,
      qualification_info_phd_year: faculty.qualification_info.phd_year,
      qualification_info_certifications:
        faculty.qualification_info.certifications.join(";"),

      // Experience Info
      experience_info_total_experience:
        faculty.experience_info.total_experience,
      experience_info_industry_experience:
        faculty.experience_info.industry_experience,
      experience_info_research_experience:
        faculty.experience_info.research_experience,
      experience_info_previous_institutions:
        faculty.experience_info.previous_institutions.join(";"),
      experience_info_publications_count:
        faculty.experience_info.publications_count,
      experience_info_projects_handled:
        faculty.experience_info.projects_handled,

      // Documents
      documents_profile_photo: faculty.documents.profile_photo,
      documents_resume_cv: faculty.documents.resume_cv,
      documents_degree_certificates:
        faculty.documents.degree_certificates.join(";"),
      documents_experience_letters:
        faculty.documents.experience_letters.join(";"),
      documents_research_papers: faculty.documents.research_papers.join(";"),

      // Financial Info
      financial_info_salary: faculty.financial_info.salary,
      financial_info_bank_account: faculty.financial_info.bank_account,
      financial_info_pan_number: faculty.financial_info.pan_number,
      financial_info_provident_fund: faculty.financial_info.provident_fund,

      // Professional Info
      professional_info_subjects_teaching:
        faculty.professional_info.subjects_teaching.join(";"),
      professional_info_current_courses:
        faculty.professional_info.current_courses.join(";"),
      professional_info_research_areas:
        faculty.professional_info.research_areas.join(";"),
      professional_info_conference_attended:
        faculty.professional_info.conference_attended,
      professional_info_awards_received:
        faculty.professional_info.awards_received.join(";"),

      // Login Credentials
      login_credentials_username: faculty.login_credentials.username,
      login_credentials_password_plain:
        faculty.login_credentials.password_plain,
      login_credentials_last_login: faculty.login_credentials.last_login,
      login_credentials_account_status:
        faculty.login_credentials.account_status,

      // Metadata
      metadata_created_at: faculty.metadata?.created_at || "",
      metadata_created_by: faculty.metadata?.created_by || "",
      metadata_updated_at: faculty.metadata?.updated_at || "",
      metadata_updated_by: faculty.metadata?.updated_by || "",

      // Institution Info
      institution_code: faculty.institution_code || "",
      institution_name: faculty.institution_name || "",
    };
  }

  // Unflatten CSV/Excel data back to nested faculty structure
  private unflattenFaculty(flatData: Record<string, any>): Faculty {
    return {
      faculty_id: flatData.faculty_id || "",
      employee_number: flatData.employee_number || "",
      joining_date: flatData.joining_date || "",
      designation: flatData.designation || "",
      department: flatData.department || "",
      specialization: flatData.specialization || "",
      employment_type: flatData.employment_type || "",
      experience_years: parseInt(flatData.experience_years) || 0,
      employment_status: flatData.employment_status || "Active",

      personal_info: {
        first_name: flatData.personal_info_first_name || "",
        middle_name: flatData.personal_info_middle_name || "",
        last_name: flatData.personal_info_last_name || "",
        full_name: flatData.personal_info_full_name || "",
        date_of_birth: flatData.personal_info_date_of_birth || "",
        gender: flatData.personal_info_gender || "",
        blood_group: flatData.personal_info_blood_group || "",
        nationality: flatData.personal_info_nationality || "Indian",
        marital_status: flatData.personal_info_marital_status || "",
        religion: flatData.personal_info_religion || "",
        category: flatData.personal_info_category || "",
      },

      contact_info: {
        email: flatData.contact_info_email || "",
        phone_number: flatData.contact_info_phone_number || "",
        alternate_phone: flatData.contact_info_alternate_phone || "",
        address: {
          line: flatData.contact_info_address_line || "",
          city: flatData.contact_info_address_city || "",
          state: flatData.contact_info_address_state || "",
          zip_code: flatData.contact_info_address_zip_code || "",
          country: flatData.contact_info_address_country || "India",
        },
        emergency_contact: {
          name: flatData.contact_info_emergency_contact_name || "",
          relationship:
            flatData.contact_info_emergency_contact_relationship || "",
          phone: flatData.contact_info_emergency_contact_phone || "",
        },
      },

      qualification_info: {
        ug_degree: flatData.qualification_info_ug_degree || "",
        ug_institution: flatData.qualification_info_ug_institution || "",
        ug_year: parseInt(flatData.qualification_info_ug_year) || 0,
        pg_degree: flatData.qualification_info_pg_degree || "",
        pg_institution: flatData.qualification_info_pg_institution || "",
        pg_year: parseInt(flatData.qualification_info_pg_year) || 0,
        phd_subject: flatData.qualification_info_phd_subject || "",
        phd_institution: flatData.qualification_info_phd_institution || "",
        phd_year: parseInt(flatData.qualification_info_phd_year) || 0,
        certifications: flatData.qualification_info_certifications
          ? flatData.qualification_info_certifications
              .split(";")
              .filter(Boolean)
          : [],
      },

      experience_info: {
        total_experience:
          parseInt(flatData.experience_info_total_experience) || 0,
        industry_experience:
          parseInt(flatData.experience_info_industry_experience) || 0,
        research_experience:
          parseInt(flatData.experience_info_research_experience) || 0,
        previous_institutions: flatData.experience_info_previous_institutions
          ? flatData.experience_info_previous_institutions
              .split(";")
              .filter(Boolean)
          : [],
        publications_count:
          parseInt(flatData.experience_info_publications_count) || 0,
        projects_handled:
          parseInt(flatData.experience_info_projects_handled) || 0,
      },

      documents: {
        profile_photo: flatData.documents_profile_photo || "",
        resume_cv: flatData.documents_resume_cv || "",
        degree_certificates: flatData.documents_degree_certificates
          ? flatData.documents_degree_certificates.split(";").filter(Boolean)
          : [],
        experience_letters: flatData.documents_experience_letters
          ? flatData.documents_experience_letters.split(";").filter(Boolean)
          : [],
        research_papers: flatData.documents_research_papers
          ? flatData.documents_research_papers.split(";").filter(Boolean)
          : [],
      },

      financial_info: {
        salary: parseFloat(flatData.financial_info_salary) || 0,
        bank_account: flatData.financial_info_bank_account || "",
        pan_number: flatData.financial_info_pan_number || "",
        provident_fund: flatData.financial_info_provident_fund || "",
      },

      professional_info: {
        subjects_teaching: flatData.professional_info_subjects_teaching
          ? flatData.professional_info_subjects_teaching
              .split(";")
              .filter(Boolean)
          : [],
        current_courses: flatData.professional_info_current_courses
          ? flatData.professional_info_current_courses
              .split(";")
              .filter(Boolean)
          : [],
        research_areas: flatData.professional_info_research_areas
          ? flatData.professional_info_research_areas.split(";").filter(Boolean)
          : [],
        conference_attended:
          parseInt(flatData.professional_info_conference_attended) || 0,
        awards_received: flatData.professional_info_awards_received
          ? flatData.professional_info_awards_received
              .split(";")
              .filter(Boolean)
          : [],
      },

      login_credentials: {
        username: flatData.login_credentials_username || "",
        password_plain: flatData.login_credentials_password_plain || "",
        last_login: flatData.login_credentials_last_login || "",
        account_status: flatData.login_credentials_account_status || "active",
      },

      metadata: {
        created_at: flatData.metadata_created_at || new Date().toISOString(),
        created_by: flatData.metadata_created_by || "admin",
        updated_at: flatData.metadata_updated_at || new Date().toISOString(),
        updated_by: flatData.metadata_updated_by || "admin",
      },

      institution_code: flatData.institution_code || "",
      institution_name: flatData.institution_name || "",
    } as Faculty;
  }

  // Parse CSV or Excel content to array of objects
  private async parseFileContent(file: File): Promise<Record<string, any>[]> {
    if (file.name.endsWith(".csv")) {
      const content = await this.readFileContent(file);
      return this.parseCSV(content);
    } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      return this.parseExcel(file);
    } else {
      throw new Error("Unsupported file format");
    }
  }

  // Convert CSV content to array of objects
  private parseCSV(csvContent: string): Record<string, any>[] {
    const lines = csvContent.trim().split("\n");
    if (lines.length < 2) {
      throw new Error(
        "CSV file must have at least a header row and one data row",
      );
    }

    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
    const data: Record<string, any>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""));
      const row: Record<string, any> = {};

      headers.forEach((header, index) => {
        let value: any = values[index] || "";

        // Convert numeric values
        if (
          header.includes("year") ||
          header.includes("experience") ||
          header.includes("count") ||
          header.includes("salary") ||
          header.includes("handled") ||
          header.includes("attended")
        ) {
          value = parseFloat(value) || 0;
        }

        row[header] = value;
      });

      data.push(row);
    }

    return data;
  }

  // Parse Excel file to array of objects
  private async parseExcel(file: File): Promise<Record<string, any>[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          // Dynamically import xlsx to avoid build issues
          import("xlsx")
            .then((XLSX) => {
              try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });

                if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
                  reject(new Error("Excel file contains no worksheets"));
                  return;
                }

                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                if (!worksheet) {
                  reject(new Error("Failed to read worksheet data"));
                  return;
                }

                const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                  header: 1,
                });

                if (jsonData.length < 2) {
                  reject(
                    new Error(
                      "Excel file must have at least a header row and one data row",
                    ),
                  );
                  return;
                }

                const headers = jsonData[0] as string[];
                const rows: Record<string, any>[] = [];

                for (let i = 1; i < jsonData.length; i++) {
                  const values = jsonData[i] as any[];
                  if (!values || values.length === 0) continue;

                  const row: Record<string, any> = {};

                  headers.forEach((header, index) => {
                    let value: any = values[index] || "";

                    // Convert numeric values
                    if (
                      header &&
                      (header.includes("year") ||
                        header.includes("experience") ||
                        header.includes("count") ||
                        header.includes("salary") ||
                        header.includes("handled") ||
                        header.includes("attended"))
                    ) {
                      value = parseFloat(value) || 0;
                    }

                    row[header] = value;
                  });

                  rows.push(row);
                }

                resolve(rows);
              } catch (parseError) {
                reject(
                  new Error(
                    `Failed to parse Excel file: ${parseError.message}`,
                  ),
                );
              }
            })
            .catch((importError) => {
              reject(
                new Error(
                  `Failed to load Excel library: ${importError.message}`,
                ),
              );
            });
        } catch (error) {
          reject(new Error(`Excel processing error: ${error.message}`));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read Excel file"));
      reader.readAsArrayBuffer(file);
    });
  }

  // Convert array of objects to CSV content
  private generateCSVFromFlat(data: Record<string, any>[]): string {
    if (data.length === 0) {
      return "";
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.map((h) => `"${h}"`).join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            return `"${value}"`;
          })
          .join(","),
      ),
    ].join("\n");

    return csvContent;
  }

  // Export as Excel file
  private async exportAsExcel(
    faculty: Faculty[],
    filename: string,
  ): Promise<void> {
    try {
      const XLSX = await import("xlsx");
      const flattenedFaculty = faculty.map((f) => this.flattenFaculty(f));

      // Create worksheet from flattened data
      const worksheet = XLSX.utils.json_to_sheet(flattenedFaculty);

      // Create workbook and add worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Faculty");

      // Write the file
      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      throw new Error("Failed to export to Excel format");
    }
  }

  // Helper method to read file content
  private readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  }

  // Helper method to download files
  private downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const facultyService = new FacultyService();
export default facultyService;
