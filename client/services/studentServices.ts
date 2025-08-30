interface Student {
  student_id: string;
  registration_number: string;
  admission_number: string;
  roll_number: string;
  status: "Active" | "Inactive" | "Graduated" | "Dropped";
  
  personal_info: {
    first_name: string;
    middle_name: string;
    last_name: string;
    full_name: string;
    date_of_birth: string;
    gender: "Male" | "Female" | "Other";
    blood_group: string;
    nationality: string;
    category: string;
    religion: string;
  };

  contact_info: {
    email: string;
    phone_number: string;
    alternate_phone: string;
    address: {
      line: string;
      city: string;
      state: string;
      zip_code: string;
      country: string;
    };
    guardian_name: string;
    guardian_contact: string;
  };

  academic_info: {
    institution: string;
    institution_code: string;
    educational_authority: string;
    program: string;
    year: number;
    semester: number;
    ncno: string;
    date_of_admission: string;
  };

  documents: {
    profile_photo: string;
    id_proof: string;
    marksheet_10: string;
    marksheet_12: string;
    transfer_certificate: string;
  };

  login_credentials: {
    username: string;
    password_plain: string;
    otp_verified: boolean;
  };

  metadata: {
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
  };
}

// Interface for flattened student data (used for CSV/Excel)
interface FlattenedStudent {
  student_id: string;
  registration_number: string;
  admission_number: string;
  roll_number: string;
  status: string;
  
  // Personal Info
  personal_info_first_name: string;
  personal_info_middle_name: string;
  personal_info_last_name: string;
  personal_info_full_name: string;
  personal_info_date_of_birth: string;
  personal_info_gender: string;
  personal_info_blood_group: string;
  personal_info_nationality: string;
  personal_info_category: string;
  personal_info_religion: string;

  // Contact Info
  contact_info_email: string;
  contact_info_phone_number: string;
  contact_info_alternate_phone: string;
  contact_info_address_line: string;
  contact_info_address_city: string;
  contact_info_address_state: string;
  contact_info_address_zip_code: string;
  contact_info_address_country: string;
  contact_info_guardian_name: string;
  contact_info_guardian_contact: string;

  // Academic Info
  academic_info_institution: string;
  academic_info_institution_code: string;
  academic_info_educational_authority: string;
  academic_info_program: string;
  academic_info_year: number;
  academic_info_semester: number;
  academic_info_ncno: string;
  academic_info_date_of_admission: string;

  // Documents
  documents_profile_photo: string;
  documents_id_proof: string;
  documents_marksheet_10: string;
  documents_marksheet_12: string;
  documents_transfer_certificate: string;

  // Login Credentials
  login_credentials_username: string;
  login_credentials_password_plain: string;
  login_credentials_otp_verified: boolean;

  // Metadata
  metadata_created_at: string;
  metadata_created_by: string;
  metadata_updated_at: string;
  metadata_updated_by: string;
}

class StudentService {
  private async readStudentFile(): Promise<Student[]> {
    try {
      const response = await fetch('/students.json');
      if (response.ok) {
        const data = await response.json();
        if (!Array.isArray(data)) {
          return [];
        }

        // Check if data is in flattened format and convert to nested structure
        return data.map(studentData => {
          // If data has flattened structure (contains underscore keys), unflatten it
          if (studentData.personal_info_first_name || studentData.contact_info_email || studentData.academic_info_institution) {
            return this.unflattenStudent(studentData);
          }
          // If data is already in nested format, return as is
          return studentData;
        });
      }
      return [];
    } catch (error) {
      console.error('Error reading student file:', error);
      return [];
    }
  }

  private async writeStudentFile(students: Student[]): Promise<void> {
    try {
      const jsonData = JSON.stringify(students, null, 2);

      // Try to write to actual file using API endpoint (like EntitySetup)
      try {
        const response = await fetch('/api/students/write', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonData,
        });

        if (response.ok) {
          console.log(`✅ Successfully saved ${students.length} student records to students.json file`);
          return;
        } else {
          throw new Error(`API response not ok: ${response.statusText}`);
        }
      } catch (apiError) {
        console.warn('⚠️ API write failed, falling back to download:', apiError);
        // Fallback: trigger download for manual replacement
        this.downloadUpdatedFile(jsonData);
        console.log('📥 Download triggered - please replace public/students.json manually');
      }

    } catch (error) {
      console.error('Error writing student file:', error);
      throw error;
    }
  }

  private downloadUpdatedFile(jsonData: string): void {
    try {
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'students.json';
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log('📥 Students.json download triggered for manual replacement');
    } catch (error) {
      console.error('Error triggering file download:', error);
    }
  }

  // Flatten nested student object for CSV/Excel export
  private flattenStudent(student: Student): FlattenedStudent {
    return {
      student_id: student.student_id,
      registration_number: student.registration_number,
      admission_number: student.admission_number,
      roll_number: student.roll_number,
      status: student.status,
      
      // Personal Info
      personal_info_first_name: student.personal_info.first_name,
      personal_info_middle_name: student.personal_info.middle_name,
      personal_info_last_name: student.personal_info.last_name,
      personal_info_full_name: student.personal_info.full_name,
      personal_info_date_of_birth: student.personal_info.date_of_birth,
      personal_info_gender: student.personal_info.gender,
      personal_info_blood_group: student.personal_info.blood_group,
      personal_info_nationality: student.personal_info.nationality,
      personal_info_category: student.personal_info.category,
      personal_info_religion: student.personal_info.religion,

      // Contact Info
      contact_info_email: student.contact_info.email,
      contact_info_phone_number: student.contact_info.phone_number,
      contact_info_alternate_phone: student.contact_info.alternate_phone,
      contact_info_address_line: student.contact_info.address.line,
      contact_info_address_city: student.contact_info.address.city,
      contact_info_address_state: student.contact_info.address.state,
      contact_info_address_zip_code: student.contact_info.address.zip_code,
      contact_info_address_country: student.contact_info.address.country,
      contact_info_guardian_name: student.contact_info.guardian_name,
      contact_info_guardian_contact: student.contact_info.guardian_contact,

      // Academic Info
      academic_info_institution: student.academic_info.institution,
      academic_info_institution_code: student.academic_info.institution_code,
      academic_info_educational_authority: student.academic_info.educational_authority,
      academic_info_program: student.academic_info.program,
      academic_info_year: student.academic_info.year,
      academic_info_semester: student.academic_info.semester,
      academic_info_ncno: student.academic_info.ncno,
      academic_info_date_of_admission: student.academic_info.date_of_admission,

      // Documents
      documents_profile_photo: student.documents.profile_photo,
      documents_id_proof: student.documents.id_proof,
      documents_marksheet_10: student.documents.marksheet_10,
      documents_marksheet_12: student.documents.marksheet_12,
      documents_transfer_certificate: student.documents.transfer_certificate,

      // Login Credentials
      login_credentials_username: student.login_credentials.username,
      login_credentials_password_plain: student.login_credentials.password_plain,
      login_credentials_otp_verified: student.login_credentials.otp_verified,

      // Metadata
      metadata_created_at: student.metadata.created_at,
      metadata_created_by: student.metadata.created_by,
      metadata_updated_at: student.metadata.updated_at,
      metadata_updated_by: student.metadata.updated_by,
    };
  }

  // Unflatten CSV/Excel data back to nested student structure
  private unflattenStudent(flatData: Record<string, any>): Student {
    // Helper function to safely get string values
    const safeString = (value: any): string => {
      if (value === null || value === undefined) return '';
      return String(value).trim();
    };

    // Generate full_name if not provided
    const firstName = safeString(flatData.personal_info_first_name);
    const middleName = safeString(flatData.personal_info_middle_name);
    const lastName = safeString(flatData.personal_info_last_name);
    const providedFullName = safeString(flatData.personal_info_full_name);

    const generatedFullName = [firstName, middleName, lastName]
      .filter(name => name.length > 0)
      .join(' ');

    return {
      student_id: safeString(flatData.student_id),
      registration_number: safeString(flatData.registration_number),
      admission_number: safeString(flatData.admission_number),
      roll_number: safeString(flatData.roll_number),
      status: (flatData.status as "Active" | "Inactive" | "Graduated" | "Dropped") || 'Active',

      personal_info: {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        full_name: providedFullName || generatedFullName,
        date_of_birth: safeString(flatData.personal_info_date_of_birth),
        gender: (flatData.personal_info_gender as "Male" | "Female" | "Other") || 'Male',
        blood_group: safeString(flatData.personal_info_blood_group),
        nationality: safeString(flatData.personal_info_nationality) || 'Indian',
        category: safeString(flatData.personal_info_category),
        religion: safeString(flatData.personal_info_religion),
      },

      contact_info: {
        email: safeString(flatData.contact_info_email),
        phone_number: safeString(flatData.contact_info_phone_number),
        alternate_phone: safeString(flatData.contact_info_alternate_phone),
        address: {
          line: safeString(flatData.contact_info_address_line),
          city: safeString(flatData.contact_info_address_city),
          state: safeString(flatData.contact_info_address_state),
          zip_code: safeString(flatData.contact_info_address_zip_code),
          country: safeString(flatData.contact_info_address_country) || 'India',
        },
        guardian_name: safeString(flatData.contact_info_guardian_name),
        guardian_contact: safeString(flatData.contact_info_guardian_contact),
      },

      academic_info: {
        institution: safeString(flatData.academic_info_institution),
        institution_code: safeString(flatData.academic_info_institution_code),
        educational_authority: safeString(flatData.academic_info_educational_authority),
        program: safeString(flatData.academic_info_program),
        year: parseInt(flatData.academic_info_year) || 1,
        semester: parseInt(flatData.academic_info_semester) || 1,
        ncno: safeString(flatData.academic_info_ncno),
        date_of_admission: safeString(flatData.academic_info_date_of_admission),
      },

      documents: {
        profile_photo: safeString(flatData.documents_profile_photo),
        id_proof: safeString(flatData.documents_id_proof),
        marksheet_10: safeString(flatData.documents_marksheet_10),
        marksheet_12: safeString(flatData.documents_marksheet_12),
        transfer_certificate: safeString(flatData.documents_transfer_certificate),
      },

      login_credentials: {
        username: safeString(flatData.login_credentials_username),
        password_plain: safeString(flatData.login_credentials_password_plain),
        otp_verified: flatData.login_credentials_otp_verified === true ||
                     flatData.login_credentials_otp_verified === 'true' ||
                     flatData.login_credentials_otp_verified === 'TRUE',
      },

      metadata: {
        created_at: safeString(flatData.metadata_created_at) || new Date().toISOString(),
        created_by: safeString(flatData.metadata_created_by) || 'admin',
        updated_at: safeString(flatData.metadata_updated_at) || new Date().toISOString(),
        updated_by: safeString(flatData.metadata_updated_by) || 'admin',
      },
    };
  }

  // Parse CSV or Excel content to array of objects
  private async parseFileContent(file: File): Promise<Record<string, any>[]> {
    if (file.name.endsWith('.csv')) {
      const content = await this.readFileContent(file);
      return this.parseCSV(content);
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      return this.parseExcel(file);
    } else {
      throw new Error('Unsupported file format');
    }
  }

  // Convert CSV content to array of objects
  private parseCSV(csvContent: string): Record<string, any>[] {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header row and one data row');
    }

    const rawHeaders = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const normalizedHeaders = this.normalizeHeaders(rawHeaders);
    const data: Record<string, any>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const row: Record<string, any> = {};

      normalizedHeaders.forEach((header, index) => {
        let value: any = values[index] || '';

        // Convert numeric values
        if (header.includes('year') || header.includes('semester')) {
          value = parseInt(value) || (header.includes('year') ? 1 : 1);
        } else if (header.includes('otp_verified')) {
          value = value === 'true' || value === 'TRUE' || value === '1';
        }

        row[header] = value;
      });

      data.push(row);
    }

    console.log('🔍 CSV parsing complete:', {
      rawHeaders,
      normalizedHeaders,
      rowCount: data.length,
      sampleRow: data[0]
    });

    return data;
  }

  // Parse Excel file to array of objects
  private async parseExcel(file: File): Promise<Record<string, any>[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          // Dynamically import xlsx to avoid build issues
          import('xlsx').then((XLSX) => {
            try {
              const data = new Uint8Array(e.target?.result as ArrayBuffer);
              const workbook = XLSX.read(data, { type: 'array' });

              if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
                reject(new Error('Excel file contains no worksheets'));
                return;
              }

              const sheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[sheetName];

              if (!worksheet) {
                reject(new Error('Failed to read worksheet data'));
                return;
              }

              const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

              if (jsonData.length < 2) {
                reject(new Error('Excel file must have at least a header row and one data row'));
                return;
              }

              const rawHeaders = jsonData[0] as string[];
              const normalizedHeaders = this.normalizeHeaders(rawHeaders);
              const rows: Record<string, any>[] = [];

              for (let i = 1; i < jsonData.length; i++) {
                const values = jsonData[i] as any[];
                if (!values || values.length === 0) continue; // Skip empty rows

                const row: Record<string, any> = {};

                normalizedHeaders.forEach((header, index) => {
                  let value: any = values[index] || '';

                  // Convert numeric values
                  if (header && (header.includes('year') || header.includes('semester'))) {
                    value = parseInt(value) || (header.includes('year') ? 1 : 1);
                  } else if (header && header.includes('otp_verified')) {
                    value = value === 'true' || value === 'TRUE' || value === '1' || value === 1;
                  }

                  row[header] = value;
                });

                rows.push(row);
              }

              console.log('🔍 Excel parsing complete:', {
                rawHeaders,
                normalizedHeaders,
                rowCount: rows.length,
                sampleRow: rows[0]
              });

              resolve(rows);
            } catch (parseError) {
              reject(new Error(`Failed to parse Excel file: ${parseError.message}`));
            }
          }).catch((importError) => {
            reject(new Error(`Failed to load Excel library: ${importError.message}`));
          });
        } catch (error) {
          reject(new Error(`Excel processing error: ${error.message}`));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read Excel file'));
      reader.readAsArrayBuffer(file);
    });
  }

  // Normalize Excel headers to match expected flattened keys
  private normalizeHeaders(rawHeaders: string[]): string[] {
    const headerMap = new Map<string, string>([
      // Program field aliases
      ['program', 'academic_info_program'],
      ['course', 'academic_info_program'],
      ['academic_info.program', 'academic_info_program'],
      ['academic_program', 'academic_info_program'],
      ['academic_info_programme', 'academic_info_program'],

      // Institution field aliases
      ['institution', 'academic_info_institution'],
      ['college', 'academic_info_institution'],
      ['academic_info.institution', 'academic_info_institution'],

      // Personal info aliases
      ['first_name', 'personal_info_first_name'],
      ['firstname', 'personal_info_first_name'],
      ['personal_info.first_name', 'personal_info_first_name'],
      ['last_name', 'personal_info_last_name'],
      ['lastname', 'personal_info_last_name'],
      ['personal_info.last_name', 'personal_info_last_name'],
      ['full_name', 'personal_info_full_name'],
      ['name', 'personal_info_full_name'],
      ['personal_info.full_name', 'personal_info_full_name'],

      // Contact info aliases
      ['email', 'contact_info_email'],
      ['email_address', 'contact_info_email'],
      ['contact_info.email', 'contact_info_email'],
      ['phone', 'contact_info_phone_number'],
      ['phone_number', 'contact_info_phone_number'],
      ['contact_info.phone_number', 'contact_info_phone_number'],

      // Basic info aliases
      ['reg_no', 'registration_number'],
      ['registration_no', 'registration_number'],
      ['reg_number', 'registration_number'],
      ['admission_no', 'admission_number'],
      ['roll_no', 'roll_number'],
    ]);

    return rawHeaders.map((rawHeader) => {
      if (!rawHeader) return '';

      // Clean the header: trim, lowercase, replace spaces and dots with underscores
      const cleanHeader = String(rawHeader)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/\./g, '_')
        .replace(/[-]/g, '_')
        .replace(/[^a-zA-Z0-9_]/g, '');

      // Return mapped header or cleaned header
      return headerMap.get(cleanHeader) || cleanHeader;
    });
  }

  // Convert array of objects to CSV content
  private generateCSV(data: FlattenedStudent[]): string {
    if (data.length === 0) {
      return '';
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.map(h => `"${h}"`).join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header as keyof FlattenedStudent];
          return `"${value}"`;
        }).join(',')
      )
    ].join('\n');

    return csvContent;
  }

  async getAllStudents(): Promise<Student[]> {
    // Read directly from students.json file only
    return await this.readStudentFile();
  }

  async createStudent(studentData: Omit<Student, 'student_id' | 'metadata'>): Promise<Student> {
    const students = await this.getAllStudents();
    
    // Generate new student ID
    const studentId = `STU${new Date().getFullYear()}${String(students.length + 1).padStart(3, '0')}`;
    
    const newStudent: Student = {
      ...studentData,
      student_id: studentId,
      metadata: {
        created_at: new Date().toISOString(),
        created_by: 'admin',
        updated_at: new Date().toISOString(),
        updated_by: 'admin',
      },
    };

    const updatedStudents = [...students, newStudent];
    await this.writeStudentFile(updatedStudents);
    
    return newStudent;
  }

  async updateStudent(studentId: string, studentData: Partial<Student>): Promise<Student | null> {
    const students = await this.getAllStudents();
    const index = students.findIndex(s => s.student_id === studentId);
    
    if (index === -1) {
      throw new Error('Student not found');
    }

    const updatedStudent = {
      ...students[index],
      ...studentData,
      student_id: studentId, // Ensure ID doesn't change
      metadata: {
        ...students[index].metadata,
        updated_at: new Date().toISOString(),
        updated_by: 'admin',
      },
    };

    students[index] = updatedStudent;
    await this.writeStudentFile(students);
    
    return updatedStudent;
  }

  async deleteStudent(studentId: string): Promise<boolean> {
    const students = await this.getAllStudents();
    const filteredStudents = students.filter(s => s.student_id !== studentId);
    
    if (filteredStudents.length === students.length) {
      throw new Error('Student not found');
    }

    await this.writeStudentFile(filteredStudents);
    return true;
  }

  async getStudentById(studentId: string): Promise<Student | null> {
    const students = await this.getAllStudents();
    return students.find(s => s.student_id === studentId) || null;
  }

  // Enhanced import method supporting both JSON and CSV files
  async importStudentFile(file: File): Promise<{ students: Student[], summary: { added: number, updated: number, total: number } }> {
    try {
      const content = await this.readFileContent(file);
      const existingStudents = await this.getAllStudents();
      const existingStudentsMap = new Map(existingStudents.map(s => [s.student_id, s]));
      
      let importedStudents: Student[] = [];
      
      if (file.name.endsWith('.json')) {
        // Handle JSON import
        const parsedData = JSON.parse(content);
        if (!Array.isArray(parsedData)) {
          throw new Error('JSON file must contain an array of student objects');
        }
        importedStudents = parsedData;
      } else if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        // Handle CSV/Excel import
        const flatData = await this.parseFileContent(file);

        // Validate program data before processing
        this.validateProgramData(flatData, file.name);

        importedStudents = flatData.map(data => this.unflattenStudent(data));
      } else {
        throw new Error('Unsupported file format. Please use .json, .csv, or .xlsx files');
      }

      let addedCount = 0;
      let updatedCount = 0;
      const finalStudents = [...existingStudents];

      for (const importedStudent of importedStudents) {
        if (!importedStudent.student_id) {
          // Generate ID for new students
          importedStudent.student_id = `STU${new Date().getFullYear()}${String(finalStudents.length + 1).padStart(3, '0')}`;
        }

        const existingIndex = finalStudents.findIndex(s => s.student_id === importedStudent.student_id);
        
        if (existingIndex >= 0) {
          // Update existing student (safe merge - don't overwrite with empty values)
          finalStudents[existingIndex] = this.safelyMergeStudents(
            finalStudents[existingIndex],
            importedStudent
          );
          updatedCount++;
        } else {
          // Add new student
          if (!importedStudent.metadata) {
            importedStudent.metadata = {
              created_at: new Date().toISOString(),
              created_by: 'admin',
              updated_at: new Date().toISOString(),
              updated_by: 'admin',
            };
          }
          finalStudents.push(importedStudent);
          addedCount++;
        }
      }

      await this.writeStudentFile(finalStudents);
      
      return {
        students: finalStudents,
        summary: {
          added: addedCount,
          updated: updatedCount,
          total: finalStudents.length
        }
      };
    } catch (error) {
      console.error('Error importing student file:', error);
      throw new Error(`Import failed: ${error.message}`);
    }
  }

  // Helper method to read file content
  private readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  // Enhanced export method supporting JSON, CSV, and Excel formats
  async exportStudentFile(format: 'json' | 'csv' | 'excel' = 'json'): Promise<void> {
    const students = await this.getAllStudents();
    const timestamp = new Date().toISOString().split('T')[0];

    if (format === 'json') {
      // Export as JSON with nested structure
      const jsonData = JSON.stringify(students, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      this.downloadFile(blob, `students_export_${timestamp}.json`);
    } else if (format === 'csv') {
      // Export as CSV with flattened structure
      const flattenedStudents = students.map(s => this.flattenStudent(s));
      const csvContent = this.generateCSV(flattenedStudents);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      this.downloadFile(blob, `students_export_${timestamp}.csv`);
    } else if (format === 'excel') {
      // Export as Excel with flattened structure
      await this.exportAsExcel(students, `students_export_${timestamp}.xlsx`);
    }
  }

  // Export as Excel file
  private async exportAsExcel(students: Student[], filename: string): Promise<void> {
    try {
      const XLSX = await import('xlsx');
      const flattenedStudents = students.map(s => this.flattenStudent(s));

      // Create worksheet from flattened data
      const worksheet = XLSX.utils.json_to_sheet(flattenedStudents);

      // Create workbook and add worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

      // Write the file
      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw new Error('Failed to export to Excel format');
    }
  }

  // Validate program data to detect potential issues
  private validateProgramData(flatData: Record<string, any>[], filename: string): void {
    if (flatData.length === 0) return;

    const programFields = ['academic_info_program', 'program', 'course'];
    let programField = '';

    // Find which program field exists in the data
    for (const field of programFields) {
      if (flatData[0].hasOwnProperty(field)) {
        programField = field;
        break;
      }
    }

    if (!programField) {
      console.warn(`⚠️ Program field not found in ${filename}. Available fields:`, Object.keys(flatData[0]));
      // Don't throw error, but log warning
      return;
    }

    // Check for suspicious program distribution
    const programCounts = new Map<string, number>();
    let emptyProgramCount = 0;

    flatData.forEach(row => {
      const program = row[programField];
      if (!program || String(program).trim() === '') {
        emptyProgramCount++;
      } else {
        const programKey = String(program).trim().toUpperCase();
        programCounts.set(programKey, (programCounts.get(programKey) || 0) + 1);
      }
    });

    const totalRows = flatData.length;
    const uniquePrograms = Array.from(programCounts.keys());

    console.log(`🔍 Program validation for ${filename}:`, {
      totalStudents: totalRows,
      emptyPrograms: emptyProgramCount,
      uniquePrograms: uniquePrograms.length,
      programDistribution: Object.fromEntries(programCounts),
      programField
    });

    // Warn if too many empty programs
    if (emptyProgramCount > totalRows * 0.1) {
      console.warn(`⚠️ ${filename}: ${emptyProgramCount}/${totalRows} students have empty program field`);
    }

    // Warn if all students have the same program (might indicate column misalignment)
    if (uniquePrograms.length === 1 && totalRows > 5) {
      console.warn(`⚠️ ${filename}: All ${totalRows} students have the same program (${uniquePrograms[0]}). Check for column misalignment.`);
    }

    // Warn if only ECE students (might indicate missing CE students)
    if (uniquePrograms.length === 1 && uniquePrograms[0].includes('ELECTRONICS')) {
      console.warn(`⚠️ ${filename}: Only Electronics & Communication Engineering students found. Computer Engineering students may be missing.`);
    }
  }

  // Safely merge student data without overwriting existing non-empty fields with empty values
  private safelyMergeStudents(existing: Student, imported: Student): Student {
    const isNonEmpty = (value: any): boolean => {
      return value !== undefined && value !== null && String(value).trim() !== '';
    };

    const safelyMergeObject = (existingObj: any, importedObj: any): any => {
      const merged = { ...existingObj };

      for (const key in importedObj) {
        if (importedObj.hasOwnProperty(key)) {
          const importedValue = importedObj[key];

          if (typeof importedValue === 'object' && importedValue !== null && !Array.isArray(importedValue)) {
            // Recursively merge nested objects
            merged[key] = safelyMergeObject(merged[key] || {}, importedValue);
          } else if (isNonEmpty(importedValue)) {
            // Only overwrite if imported value is non-empty
            merged[key] = importedValue;
          }
          // If imported value is empty, keep existing value (don't overwrite)
        }
      }

      return merged;
    };

    const merged = safelyMergeObject(existing, imported);

    // Always update metadata
    merged.metadata = {
      ...existing.metadata,
      updated_at: new Date().toISOString(),
      updated_by: 'admin',
    };

    console.log('🔄 Safe merge completed:', {
      existingProgram: existing.academic_info.program,
      importedProgram: imported.academic_info.program,
      resultProgram: merged.academic_info.program,
      studentId: existing.student_id
    });

    return merged;
  }

  // Helper method to download files
  private downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Legacy method for backward compatibility
  async importStudentFromContent(content: string): Promise<Student[]> {
    try {
      const importedStudents = JSON.parse(content);
      if (!Array.isArray(importedStudents)) {
        throw new Error('Invalid file format: expected array of student objects');
      }

      const existingStudents = await this.getAllStudents();
      const existingIds = new Set(existingStudents.map(s => s.student_id));

      // Merge imported students with existing ones, avoiding duplicates
      const newStudents = importedStudents.filter(student => 
        student.student_id && !existingIds.has(student.student_id)
      );

      const mergedStudents = [...existingStudents, ...newStudents];
      await this.writeStudentFile(mergedStudents);
      
      return mergedStudents;
    } catch (error) {
      console.error('Error importing student file:', error);
      throw new Error('Invalid JSON format: ' + error.message);
    }
  }
}

export const studentService = new StudentService();
export default studentService;
export type { Student, FlattenedStudent };
