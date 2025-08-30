// Enhanced program management with real file-based JSON storage

export interface Program {
  id: string;
  name: string;
  code: string;
  level: 'UG' | 'PG' | 'Diploma' | 'Certificate';
  type: 'Regular' | 'Distance' | 'Part-time' | 'Full-time' | 'Online';
  department: string;
  duration: number;
  totalCredits: number;
  totalStudents: number;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  specializations?: string[];
  created_at: string;
  updated_at: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface CreateProgramResponse {
  success: boolean;
  program?: Program;
  errors?: string[];
  message: string;
  latency?: number;
}

// File-based storage configuration
const PROGRAM_FILE_PATH = '/program.json';

// Enhanced program service with real file operations
class EnhancedProgramService {
  private startTime: number = 0;
  private programs: Program[] = [];

  // Start performance measurement
  private startTimer(): void {
    this.startTime = performance.now();
  }

  // Get elapsed time in milliseconds
  private getElapsedTime(): number {
    return Math.round(performance.now() - this.startTime);
  }

  // Validate program data
  private validateProgram(programData: any): ValidationResult {
    const errors: string[] = [];
    console.log('🔍 Starting validation for program:', programData?.name || 'Unknown');

    // Required field validation
    const requiredFields = [
      'name', 'code', 'level', 'type', 'department', 'duration', 'totalCredits', 'description'
    ];

    console.log('🔍 Checking required fields...');
    requiredFields.forEach(field => {
      const value = programData[field];
      const isEmpty = !value || (typeof value === 'string' && value.trim() === '');

      if (isEmpty) {
        const errorMsg = `${field.replace(/([A-Z])/g, ' $1')} is required`;
        console.log(`❌ Required field missing: ${field} = "${value}"`);
        errors.push(errorMsg);
      } else {
        console.log(`✅ Required field OK: ${field} = "${value}"`);
      }
    });

    // Level validation
    console.log('🔍 Checking program level...');
    const validLevels = ["UG", "PG", "Diploma", "Certificate"];
    if (programData.level && !validLevels.includes(programData.level)) {
      console.log(`❌ Invalid program level: ${programData.level}. Valid levels: ${validLevels.join(', ')}`);
      errors.push('Invalid program level');
    } else if (programData.level) {
      console.log(`✅ Valid program level: ${programData.level}`);
    }

    // Type validation
    console.log('🔍 Checking program type...');
    const validTypes = ["Regular", "Distance", "Part-time", "Full-time", "Online"];
    if (programData.type && !validTypes.includes(programData.type)) {
      console.log(`❌ Invalid program type: ${programData.type}. Valid types: ${validTypes.join(', ')}`);
      errors.push('Invalid program type');
    } else if (programData.type) {
      console.log(`✅ Valid program type: ${programData.type}`);
    }

    // Numeric field validation
    const numericFields = ['duration', 'totalCredits'];
    numericFields.forEach(field => {
      if (programData[field] !== undefined && (isNaN(programData[field]) || programData[field] < 0)) {
        errors.push(`${field.replace(/([A-Z])/g, ' $1')} must be a valid positive number`);
      }
    });

    const result = {
      isValid: errors.length === 0,
      errors
    };

    console.log(`🔍 Validation complete. Valid: ${result.isValid}, Errors: ${errors.length}`);
    if (errors.length > 0) {
      console.log('❌ All validation errors:', errors);
    }

    return result;
  }

  // Generate auto-incremented ID
  private generateId(programMap?: Map<string, Program>): string {
    let programs = this.programs; // Use in-memory array by default

    // If program map is provided (during import), use current state from map
    if (programMap) {
      programs = Array.from(programMap.values());
    }

    const existingIds = programs.map(p => {
      const id = String(p.id); // Convert to string first
      if (id.startsWith('PGM')) {
        return parseInt(id.replace('PGM', ''));
      } else {
        // Handle numeric IDs from legacy data
        return parseInt(id);
      }
    }).filter(id => !isNaN(id));
    const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1001;
    return `PGM${nextId.toString().padStart(4, '0')}`;
  }

  // Read programs from actual program.json file
  private async readProgramFile(): Promise<Program[]> {
    try {
      // Add cache busting to ensure fresh data
      const cacheBuster = `?_t=${Date.now()}`;
      const url = `${PROGRAM_FILE_PATH}${cacheBuster}`;
      console.log('🔍 ReadProgramFile: Attempting to fetch from', url);

      // First try to fetch from the public folder with cache busting
      const response = await fetch(url, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      console.log('🔍 ReadProgramFile: Response status:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('🔍 ReadProgramFile: Data received:', data);
        console.log('🔍 ReadProgramFile: Is array?', Array.isArray(data), 'Length:', data?.length);
        return Array.isArray(data) ? data : [];
      } else {
        console.log('⚠️ Program.json file not found, initializing empty array');
        return [];
      }
    } catch (error) {
      console.error('❌ Error reading program.json:', error);
      return [];
    }
  }

  // Write programs to memory and actual program.json file (same pattern as entityService)
  public async writeProgramFile(programs: Program[]): Promise<void> {
    try {
      console.log('🔍 WriteProgramFile: Starting with', programs.length, 'programs');

      // Store in memory for immediate access
      this.programs = programs;

      // Create human-readable JSON formatting with 2-space indentation
      const jsonContent = JSON.stringify(programs, null, 2);

      console.log('🔍 WriteProgramFile: Updated program data:', jsonContent.substring(0, 200) + '...');

      // Try to write to actual file using API endpoint (same pattern as entityService)
      try {
        const response = await fetch('/api/programs/write', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonContent,
        });

        if (response.ok) {
          console.log(`✅ Successfully saved ${programs.length} programs to program.json file`);
        } else {
          throw new Error(`API response not ok: ${response.statusText}`);
        }
      } catch (apiError) {
        console.warn('⚠️ API write failed, falling back to download:', apiError);
        // Fallback: trigger download for manual replacement (same as entityService)
        this.triggerFileDownload(jsonContent, 'program.json');
        console.log('📥 Download triggered - please replace public/program.json manually');
      }

      // Create audit log entry
      this.createAuditLog('WRITE', programs.length);

      console.log('🔍 WriteProgramFile: Completed successfully');
    } catch (error) {
      console.error('❌ Error processing programs:', error);
      throw new Error(`Failed to process program data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Trigger file download for updating program.json
  private triggerFileDownload(content: string, filename: string): void {
    try {
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      console.log(`📥 File ${filename} download triggered for manual replacement`);
    } catch (error) {
      console.error('Error triggering file download:', error);
    }
  }

  // Create audit log entry (in memory only, no localStorage)
  private createAuditLog(operation: string, programCount: number): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      operation,
      programCount,
      file: 'program.json'
    };
    
    console.log('📋 Audit Log:', logEntry);
  }

  // Check for duplicate submissions
  private checkDuplicates(programData: any): string[] {
    const programs = this.programs.length > 0 ? this.programs : [];
    const errors: string[] = [];

    console.log('🔍 CheckDuplicates: Checking against', programs.length, 'existing programs');
    console.log('🔍 CheckDuplicates: New program name:', programData.name, 'code:', programData.code);

    // Check duplicate code
    const duplicateCode = programs.find(p => p.code === programData.code);
    if (duplicateCode) {
      console.log('❌ Duplicate code found:', duplicateCode);
      errors.push(`Program with code '${programData.code}' already exists`);
    }

    // Check duplicate name
    const duplicateName = programs.find(p => p.name.toLowerCase() === programData.name.toLowerCase());
    if (duplicateName) {
      console.log('❌ Duplicate name found:', duplicateName);
      errors.push(`Program with name '${programData.name}' already exists`);
    }

    console.log('�� CheckDuplicates: Found', errors.length, 'duplicate errors');
    return errors;
  }

  // Convert form data to clean JSON structure
  private convertToCleanJson(rawData: any): Program {
    return {
      id: rawData.id || this.generateId(),
      name: rawData.name ? String(rawData.name).trim() : '',
      code: rawData.code ? String(rawData.code).trim().toUpperCase() : '',
      level: rawData.level || 'UG',
      type: rawData.type || 'Regular',
      department: rawData.department ? String(rawData.department).trim() : '',
      duration: parseInt(rawData.duration) || 0,
      totalCredits: parseInt(rawData.totalCredits) || 0,
      totalStudents: parseInt(rawData.totalStudents) || 0,
      description: rawData.description ? String(rawData.description).trim() : '',
      status: rawData.status || 'draft',
      specializations: Array.isArray(rawData.specializations) ? rawData.specializations :
                      typeof rawData.specializations === 'string' ?
                      rawData.specializations.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      created_at: rawData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  // Main create program method with comprehensive validation and error handling
  async createProgram(rawProgramData: any): Promise<CreateProgramResponse> {
    this.startTimer();

    try {
      console.log('🔍 CreateProgram: Starting with data:', JSON.stringify(rawProgramData, null, 2));

      // Step 0: Load existing programs into memory first
      console.log('🔍 CreateProgram: Loading existing programs from file...');
      this.programs = await this.readProgramFile();
      console.log('🔍 CreateProgram: Loaded', this.programs.length, 'existing programs:', this.programs);

      // Step 1: Validate form data
      const validation = this.validateProgram(rawProgramData);
      console.log('🔍 CreateProgram: Validation result:', validation);

      if (!validation.isValid) {
        console.log('❌ CreateProgram: Validation failed:', validation.errors);
        return {
          success: false,
          errors: validation.errors,
          message: 'Validation failed',
          latency: this.getElapsedTime()
        };
      }

      // Step 2: Check for duplicates
      const duplicateErrors = this.checkDuplicates(rawProgramData);

      if (duplicateErrors.length > 0) {
        console.log('❌ CreateProgram: Duplicate program detected:', duplicateErrors);
        return {
          success: false,
          errors: duplicateErrors,
          message: 'Duplicate program detected',
          latency: this.getElapsedTime()
        };
      }

      // Step 3: Convert to clean JSON structure
      const cleanProgram = this.convertToCleanJson(rawProgramData);

      // Step 4: Assign unique auto-incremented ID if not provided
      if (!cleanProgram.id) {
        cleanProgram.id = this.generateId();
      }

      // Step 5: Append new program to existing records (maintain history)
      const updatedPrograms = [...this.programs, cleanProgram];

      // Step 6: Write to program.json file
      await this.writeProgramFile(updatedPrograms);

      const latency = this.getElapsedTime();
      console.log('�� CreateProgram: Success! ID:', cleanProgram.id, 'Latency:', latency + 'ms');

      // Step 8: Return success response with metrics
      return {
        success: true,
        program: cleanProgram,
        message: `Program created successfully with ID: ${cleanProgram.id}`,
        latency
      };

    } catch (error) {
      const latency = this.getElapsedTime();
      console.error('❌ CreateProgram: Unexpected error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      return {
        success: false,
        errors: [errorMessage],
        message: 'Program creation failed',
        latency
      };
    }
  }

  // Get all programs
  async getPrograms(): Promise<Program[]> {
    if (this.programs.length > 0) {
      return this.programs;
    }
    return await this.readProgramFile();
  }

  // Get program by ID
  async getProgramById(id: string): Promise<Program | null> {
    const programs = await this.getPrograms();
    return programs.find(p => p.id === id) || null;
  }

  // Update program
  async updateProgram(id: string, updateData: Partial<Program>): Promise<Program> {
    const programs = await this.getPrograms();
    const programIndex = programs.findIndex(p => p.id === id);

    if (programIndex === -1) {
      throw new Error('Program not found in program.json file');
    }

    const updatedProgram = {
      ...programs[programIndex],
      ...updateData,
      updated_at: new Date().toISOString(),
    };

    programs[programIndex] = updatedProgram;
    await this.writeProgramFile(programs);

    return updatedProgram;
  }

  // Delete program
  async deleteProgram(id: string): Promise<boolean> {
    const programs = await this.getPrograms();
    const programIndex = programs.findIndex(p => p.id === id);

    if (programIndex === -1) {
      throw new Error('Program not found in program.json file');
    }

    programs.splice(programIndex, 1);
    await this.writeProgramFile(programs);
    return true;
  }

  // Load programs from file (for initialization)
  async loadPrograms(): Promise<Program[]> {
    try {
      const filePrograms = await this.readProgramFile();
      this.programs = filePrograms;
      console.log('📁 LoadPrograms: Loaded', filePrograms.length, 'programs from program.json');
      return filePrograms;
    } catch (error) {
      console.error('Error loading programs:', error);
      this.programs = [];
      return [];
    }
  }

  // Clear all program data
  async clearProgramData(): Promise<void> {
    this.programs = []; // Clear in-memory cache
    await this.writeProgramFile([]);
  }

  // Reset service state (useful for debugging)
  resetServiceState(): void {
    this.programs = [];
    console.log('🔄 Program service state reset');
  }

  // Export programs (method compatible with existing export functionality)
  async exportProgramFileContent(): Promise<string> {
    const programs = await this.getPrograms();
    return JSON.stringify(programs, null, 2);
  }

  // Import programs (method compatible with existing import functionality)
  async importProgramFileContent(jsonContent: string): Promise<Program[]> {
    try {
      const importedPrograms = JSON.parse(jsonContent);
      if (!Array.isArray(importedPrograms)) {
        throw new Error('Invalid JSON format: expected array of programs');
      }

      // Get existing programs and load into memory for ID generation
      const existingPrograms = await this.getPrograms();
      this.programs = existingPrograms;
      console.log(`📁 Found ${existingPrograms.length} existing programs`);
      console.log(`📥 Importing ${importedPrograms.length} new programs`);

      // Create a map of existing programs by ID for quick lookup
      const existingProgramMap = new Map(existingPrograms.map(program => [program.id, program]));

      // Process imported programs
      const processedImports: Program[] = [];
      const conflicts: string[] = [];
      let newImports = 0;
      let updates = 0;

      for (const importedProgram of importedPrograms) {
        // Ensure imported program has all required fields
        let cleanImportedProgram = this.convertToCleanJson(importedProgram);

        if (existingProgramMap.has(cleanImportedProgram.id)) {
          // Check if this is the same program (by name and code) or a true conflict
          const existingProgram = existingProgramMap.get(cleanImportedProgram.id);
          const isSameProgram = existingProgram &&
            (existingProgram.name === cleanImportedProgram.name ||
             existingProgram.code === cleanImportedProgram.code);

          if (isSameProgram) {
            // Update existing program with imported data
            existingProgramMap.set(cleanImportedProgram.id, {
              ...cleanImportedProgram,
              updated_at: new Date().toISOString()
            });
            conflicts.push(`Updated: ${cleanImportedProgram.name} (${cleanImportedProgram.id})`);
            updates++;
          } else {
            // True conflict - generate new ID for imported program
            const originalId = cleanImportedProgram.id;
            cleanImportedProgram = {
              ...cleanImportedProgram,
              id: this.generateId(existingProgramMap),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            existingProgramMap.set(cleanImportedProgram.id, cleanImportedProgram);
            conflicts.push(`ID conflict resolved: ${cleanImportedProgram.name} (${originalId} → ${cleanImportedProgram.id})`);
            newImports++;
          }
        } else {
          // New program - add to map
          existingProgramMap.set(cleanImportedProgram.id, cleanImportedProgram);
          processedImports.push(cleanImportedProgram);
          newImports++;
        }
      }

      // Convert map back to array (maintains existing + adds new)
      const mergedPrograms = Array.from(existingProgramMap.values());

      // Write merged programs to file
      await this.writeProgramFile(mergedPrograms);

      console.log(`✅ Merge complete: ${newImports} new, ${updates} updated, ${mergedPrograms.length} total`);

      if (conflicts.length > 0) {
        console.log('🔄 Conflicts resolved (updated existing):', conflicts);
      }

      return mergedPrograms;
    } catch (error) {
      console.error('Import error:', error);
      throw new Error('Failed to import programs to program.json file');
    }
  }
}

// Export singleton instance
const programService = new EnhancedProgramService();
export default programService;
