// Enhanced entity management with real file-based JSON storage

export interface Entity {
  id: string;
  name: string;
  code: string;
  slug: string;
  type: "university" | "college" | "institute" | "school" | "department" | "location" | "level";
  parentId?: string;
  educationalAuthority: string;
  affiliation_number: string;
  recognized_by: string[];
  university_type: string;
  description: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  district: string;
  state: string;
  country: string;
  pincode: string;
  latitude?: string;
  longitude?: string;
  contact_person: string;
  designation: string;
  email: string;
  phone: string;
  alternate_phone?: string;
  website: string;
  capacity: number;
  established_year: number;
  num_departments: number;
  num_faculties: number;
  num_students: number;
  programs_offered: string[];
  accreditation: string;
  is_autonomous: boolean;
  is_verified: boolean;
  hostel_available: boolean;
  transport_available: boolean;
  digital_library_url?: string;
  learning_management_url?: string;
  placement_cell_contact?: string;
  alumni_association_url?: string;
  status: "active" | "inactive";
  created_date: string;
  created_at: string;
  updated_at: string;
  remarks?: string;
  logo_url?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface CreateEntityResponse {
  success: boolean;
  entity?: Entity;
  errors?: string[];
  message: string;
  latency?: number;
}

// File-based storage configuration
const ENTITY_FILE_PATH = '/entity.json';

// Enhanced entity service with real file operations
class EnhancedEntityService {
  private startTime: number = 0;
  private entities: Entity[] = [];

  // Start performance measurement
  private startTimer(): void {
    this.startTime = performance.now();
  }

  // Get elapsed time in milliseconds
  private getElapsedTime(): number {
    return Math.round(performance.now() - this.startTime);
  }

  // Validate entity data
  private validateEntity(entityData: any): ValidationResult {
    const errors: string[] = [];
    console.log('🔍 Starting validation for entity:', entityData?.name || 'Unknown');

    // Required field validation
    const requiredFields = [
      'name', 'code', 'type', 'educationalAuthority', 'affiliation_number',
      'description', 'address_line1', 'city', 'district', 'state', 'country',
      'pincode', 'contact_person', 'designation', 'email', 'phone', 'website'
    ];

    console.log('🔍 Checking required fields...');
    requiredFields.forEach(field => {
      const value = entityData[field];
      const isEmpty = !value || (typeof value === 'string' && value.trim() === '');

      if (isEmpty) {
        const errorMsg = `${field.replace(/_/g, ' ')} is required`;
        console.log(`❌ Required field missing: ${field} = "${value}"`);
        errors.push(errorMsg);
      } else {
        console.log(`✅ Required field OK: ${field} = "${value}"`);
      }
    });

    // Data format validation
    console.log('🔍 Checking data formats...');

    if (entityData.email && !this.isValidEmail(entityData.email)) {
      console.log(`❌ Invalid email format: ${entityData.email}`);
      errors.push('Invalid email format');
    } else if (entityData.email) {
      console.log(`✅ Valid email: ${entityData.email}`);
    }

    if (entityData.phone && !this.isValidPhone(entityData.phone)) {
      console.log(`❌ Invalid phone format: ${entityData.phone}`);
      errors.push('Invalid phone format');
    } else if (entityData.phone) {
      console.log(`✅ Valid phone: ${entityData.phone}`);
    }

    if (entityData.website && !this.isValidUrl(entityData.website)) {
      console.log(`❌ Invalid website URL format: ${entityData.website}`);
      errors.push('Invalid website URL format');
    } else if (entityData.website) {
      console.log(`✅ Valid website: ${entityData.website}`);
    }

    if (entityData.pincode && !this.isValidPincode(entityData.pincode)) {
      console.log(`❌ Invalid pincode format: ${entityData.pincode}`);
      errors.push('Invalid pincode format');
    } else if (entityData.pincode) {
      console.log(`✅ Valid pincode: ${entityData.pincode}`);
    }

    // Numeric field validation
    const numericFields = ['capacity', 'established_year', 'num_departments', 'num_faculties', 'num_students'];
    numericFields.forEach(field => {
      if (entityData[field] !== undefined && (isNaN(entityData[field]) || entityData[field] < 0)) {
        errors.push(`${field.replace(/_/g, ' ')} must be a valid positive number`);
      }
    });

    // Type validation
    console.log('🔍 Checking entity type...');
    const validTypes = ["university", "college", "institute", "school", "department", "location", "level"];
    if (entityData.type && !validTypes.includes(entityData.type)) {
      console.log(`❌ Invalid entity type: ${entityData.type}. Valid types: ${validTypes.join(', ')}`);
      errors.push('Invalid entity type');
    } else if (entityData.type) {
      console.log(`✅ Valid entity type: ${entityData.type}`);
    }

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

  // Email validation
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Phone validation
  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  // URL validation
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Pincode validation
  private isValidPincode(pincode: string): boolean {
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(pincode);
  }

  // Generate auto-incremented ID
  private generateId(entityMap?: Map<string, Entity>): string {
    let entities = this.entities; // Use in-memory array by default

    // If entity map is provided (during import), use current state from map
    if (entityMap) {
      entities = Array.from(entityMap.values());
    }

    const existingIds = entities.map(e => {
      const id = String(e.id); // Convert to string first
      if (id.startsWith('INST')) {
        return parseInt(id.replace('INST', ''));
      } else {
        // Handle numeric IDs from legacy data
        return parseInt(id);
      }
    }).filter(id => !isNaN(id));
    const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1001;
    return `INST${nextId.toString().padStart(4, '0')}`;
  }

  // Generate slug from name
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }

  // Read entities from actual entity.json file
  private async readEntityFile(): Promise<Entity[]> {
    try {
      // First try to fetch from the public folder
      const response = await fetch(ENTITY_FILE_PATH);
      if (response.ok) {
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } else {
        console.log('Entity.json file not found, initializing empty array');
        return [];
      }
    } catch (error) {
      console.error('Error reading entity.json:', error);
      return [];
    }
  }

  // Write entities to memory and actual entity.json file
  public async writeEntityFile(entities: Entity[]): Promise<void> {
    try {
      console.log('🔍 WriteEntityFile: Starting with', entities.length, 'entities');

      // Store in memory for immediate access
      this.entities = entities;

      // Create human-readable JSON formatting with 2-space indentation
      const jsonContent = JSON.stringify(entities, null, 2);

      // Try to write to actual file using API endpoint
      try {
        const response = await fetch('/api/entities/write', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonContent,
        });

        if (response.ok) {
          console.log(`✅ Successfully saved ${entities.length} entities to entity.json file`);
        } else {
          throw new Error(`API response not ok: ${response.statusText}`);
        }
      } catch (apiError) {
        console.warn('⚠️ API write failed, falling back to download:', apiError);
        // Fallback: trigger download for manual replacement
        this.triggerFileDownload(jsonContent, 'entity.json');
        console.log('📥 Download triggered - please replace public/entity.json manually');
      }

      // Create audit log entry
      this.createAuditLog('WRITE', entities.length);

      console.log('🔍 WriteEntityFile: Completed successfully');
    } catch (error) {
      console.error('❌ Error processing entities:', error);
      throw new Error(`Failed to process entity data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Trigger file download for updating entity.json
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
  private createAuditLog(operation: string, entityCount: number): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      operation,
      entityCount,
      file: 'entity.json'
    };
    
    console.log('📋 Audit Log:', logEntry);
  }

  // Check for duplicate submissions
  private checkDuplicates(entityData: any): string[] {
    const entities = this.entities.length > 0 ? this.entities : [];
    const errors: string[] = [];

    // Check duplicate code
    if (entities.some(e => e.code === entityData.code)) {
      errors.push(`Entity with code '${entityData.code}' already exists`);
    }

    // Check duplicate name
    if (entities.some(e => e.name.toLowerCase() === entityData.name.toLowerCase())) {
      errors.push(`Entity with name '${entityData.name}' already exists`);
    }

    // Check duplicate email
    if (entities.some(e => e.email.toLowerCase() === entityData.email.toLowerCase())) {
      errors.push(`Entity with email '${entityData.email}' already exists`);
    }

    return errors;
  }

  // Convert form data to clean JSON structure
  private convertToCleanJson(rawData: any): Entity {
    return {
      id: rawData.id || this.generateId(),
      name: rawData.name ? String(rawData.name).trim() : '',
      code: rawData.code ? String(rawData.code).trim() : '',
      slug: rawData.slug ? String(rawData.slug).trim() : this.generateSlug(rawData.name || ''),
      type: rawData.type || 'institute',
      parentId: rawData.parentId === 'none' ? undefined : rawData.parentId,
      educationalAuthority: rawData.educationalAuthority ? String(rawData.educationalAuthority).trim() : '',
      affiliation_number: rawData.affiliation_number ? String(rawData.affiliation_number).trim() : '',
      recognized_by: Array.isArray(rawData.recognized_by) ? rawData.recognized_by :
                     typeof rawData.recognized_by === 'string' ? rawData.recognized_by.split(',').map(s => s.trim()) : [],
      university_type: rawData.university_type ? String(rawData.university_type).trim() : '',
      description: rawData.description ? String(rawData.description).trim() : '',
      address_line1: rawData.address_line1 ? String(rawData.address_line1).trim() : '',
      address_line2: rawData.address_line2 ? String(rawData.address_line2).trim() : undefined,
      city: rawData.city ? String(rawData.city).trim() : '',
      district: rawData.district ? String(rawData.district).trim() : '',
      state: rawData.state ? String(rawData.state).trim() : '',
      country: rawData.country ? String(rawData.country).trim() : 'India',
      pincode: rawData.pincode ? String(rawData.pincode).trim() : '',
      latitude: rawData.latitude ? String(rawData.latitude).trim() : undefined,
      longitude: rawData.longitude ? String(rawData.longitude).trim() : undefined,
      contact_person: rawData.contact_person ? String(rawData.contact_person).trim() : '',
      designation: rawData.designation ? String(rawData.designation).trim() : '',
      email: rawData.email ? String(rawData.email).trim().toLowerCase() : '',
      phone: rawData.phone ? String(rawData.phone).trim() : '',
      alternate_phone: rawData.alternate_phone ? String(rawData.alternate_phone).trim() : undefined,
      website: rawData.website ? String(rawData.website).trim() : '',
      capacity: parseInt(rawData.capacity) || 0,
      established_year: parseInt(rawData.established_year) || new Date().getFullYear(),
      num_departments: parseInt(rawData.num_departments) || 0,
      num_faculties: parseInt(rawData.num_faculties) || 0,
      num_students: parseInt(rawData.num_students) || 0,
      programs_offered: Array.isArray(rawData.programs_offered) ? rawData.programs_offered :
                       typeof rawData.programs_offered === 'string' ? rawData.programs_offered.split(',').map(s => s.trim()) : [],
      accreditation: rawData.accreditation ? String(rawData.accreditation).trim() : '',
      is_autonomous: Boolean(rawData.is_autonomous),
      is_verified: Boolean(rawData.is_verified),
      hostel_available: Boolean(rawData.hostel_available),
      transport_available: Boolean(rawData.transport_available),
      digital_library_url: rawData.digital_library_url ? String(rawData.digital_library_url).trim() : undefined,
      learning_management_url: rawData.learning_management_url ? String(rawData.learning_management_url).trim() : undefined,
      placement_cell_contact: rawData.placement_cell_contact ? String(rawData.placement_cell_contact).trim() : undefined,
      alumni_association_url: rawData.alumni_association_url ? String(rawData.alumni_association_url).trim() : undefined,
      status: 'active',
      created_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      remarks: rawData.remarks ? String(rawData.remarks).trim() : undefined,
      logo_url: rawData.logo_url ? String(rawData.logo_url).trim() : undefined
    };
  }

  // Main create entity method with comprehensive validation and error handling
  async createEntity(rawEntityData: any): Promise<CreateEntityResponse> {
    this.startTimer();

    try {
      console.log('🔍 CreateEntity: Starting with data:', JSON.stringify(rawEntityData, null, 2));

      // Step 0: Load existing entities into memory first
      this.entities = await this.readEntityFile();
      console.log('🔍 CreateEntity: Loaded', this.entities.length, 'existing entities');

      // Step 1: Validate form data
      const validation = this.validateEntity(rawEntityData);
      console.log('🔍 CreateEntity: Validation result:', validation);

      if (!validation.isValid) {
        console.log('❌ CreateEntity: Validation failed:', validation.errors);
        return {
          success: false,
          errors: validation.errors,
          message: 'Validation failed',
          latency: this.getElapsedTime()
        };
      }

      // Step 2: Check for duplicates
      const duplicateErrors = this.checkDuplicates(rawEntityData);

      if (duplicateErrors.length > 0) {
        console.log('❌ CreateEntity: Duplicate entity detected:', duplicateErrors);
        return {
          success: false,
          errors: duplicateErrors,
          message: 'Duplicate entity detected',
          latency: this.getElapsedTime()
        };
      }

      // Step 3: Convert to clean JSON structure
      const cleanEntity = this.convertToCleanJson(rawEntityData);

      // Step 4: Assign unique auto-incremented ID if not provided
      if (!cleanEntity.id) {
        cleanEntity.id = this.generateId();
      }

      // Step 5: Append new entity to existing records (maintain history)
      const updatedEntities = [...this.entities, cleanEntity];

      // Step 6: Write to entity.json file
      await this.writeEntityFile(updatedEntities);

      const latency = this.getElapsedTime();
      console.log('✅ CreateEntity: Success! ID:', cleanEntity.id, 'Latency:', latency + 'ms');

      // Step 8: Return success response with metrics
      return {
        success: true,
        entity: cleanEntity,
        message: `Entity created successfully with ID: ${cleanEntity.id}`,
        latency
      };

    } catch (error) {
      const latency = this.getElapsedTime();
      console.error('❌ CreateEntity: Unexpected error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      return {
        success: false,
        errors: [errorMessage],
        message: 'Entity creation failed',
        latency
      };
    }
  }

  // Get all entities
  async getEntities(): Promise<Entity[]> {
    if (this.entities.length > 0) {
      return this.entities;
    }
    return await this.readEntityFile();
  }

  // Get entity by ID
  async getEntityById(id: string): Promise<Entity | null> {
    const entities = await this.getEntities();
    return entities.find(e => e.id === id) || null;
  }

  // Update entity
  async updateEntity(id: string, updateData: Partial<Entity>): Promise<Entity> {
    const entities = await this.getEntities();
    const entityIndex = entities.findIndex(e => e.id === id);

    if (entityIndex === -1) {
      throw new Error('Entity not found in entity.json file');
    }

    const updatedEntity = {
      ...entities[entityIndex],
      ...updateData,
      updated_at: new Date().toISOString(),
    };

    entities[entityIndex] = updatedEntity;
    await this.writeEntityFile(entities);

    return updatedEntity;
  }

  // Delete entity
  async deleteEntity(id: string): Promise<boolean> {
    const entities = await this.getEntities();
    const entityIndex = entities.findIndex(e => e.id === id);

    if (entityIndex === -1) {
      throw new Error('Entity not found in entity.json file');
    }

    entities.splice(entityIndex, 1);
    await this.writeEntityFile(entities);
    return true;
  }

  // Enhanced export method supporting JSON, CSV, and Excel formats
  async exportEntityFile(format: 'json' | 'csv' | 'excel' = 'json'): Promise<void> {
    const entities = await this.getEntities();
    const timestamp = new Date().toISOString().split('T')[0];

    if (format === 'json') {
      // Export as JSON with nested structure
      const jsonData = JSON.stringify(entities, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      this.downloadFile(blob, `entities_export_${timestamp}.json`);
    } else if (format === 'csv') {
      // Export as CSV with flattened structure
      const flattenedEntities = entities.map(e => this.flattenEntity(e));
      const csvContent = this.generateCSV(flattenedEntities);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      this.downloadFile(blob, `entities_export_${timestamp}.csv`);
    } else if (format === 'excel') {
      // Export as Excel with flattened structure
      await this.exportAsExcel(entities, `entities_export_${timestamp}.xlsx`);
    }
  }

  // Legacy export method for backward compatibility
  async exportEntityFileContent(): Promise<string> {
    const entities = await this.getEntities();
    return JSON.stringify(entities, null, 2);
  }

  // Enhanced import method supporting both JSON and CSV/Excel files
  async importEntityFile(file: File): Promise<{ entities: Entity[], summary: { added: number, updated: number, total: number } }> {
    try {
      console.log(`📥 Starting import process for file: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`);

      const existingEntities = await this.getEntities();
      console.log(`📊 Found ${existingEntities.length} existing entities`);
      const existingEntityMap = new Map(existingEntities.map(e => [e.id, e]));

      let importedEntities: Entity[] = [];

      if (file.name.endsWith('.json')) {
        // Handle JSON import
        console.log('🔍 Processing JSON file...');
        const content = await this.readFileContent(file);
        const parsedData = JSON.parse(content);
        if (!Array.isArray(parsedData)) {
          throw new Error('JSON file must contain an array of entity objects');
        }
        importedEntities = parsedData;
        console.log(`✅ JSON parsed successfully: ${importedEntities.length} entities found`);
      } else if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        // Handle CSV/Excel import
        console.log(`🔍 Processing ${file.name.endsWith('.csv') ? 'CSV' : 'Excel'} file...`);
        const flatData = await this.parseFileContent(file);
        console.log(`✅ File parsed successfully: ${flatData.length} rows found`);

        console.log('🔄 Converting flat data to entity structure...');
        importedEntities = flatData.map((data, index) => {
          try {
            return this.unflattenEntity(data);
          } catch (error) {
            throw new Error(`Error processing row ${index + 2}: ${error.message}`);
          }
        });
        console.log(`✅ Data conversion completed: ${importedEntities.length} entities structured`);
      } else {
        throw new Error('Unsupported file format. Please use .json, .csv, or .xlsx files');
      }

      console.log('🔄 Processing and validating entities...');
      let addedCount = 0;
      let updatedCount = 0;
      const finalEntities = [...existingEntities];

      for (let i = 0; i < importedEntities.length; i++) {
        const importedEntity = importedEntities[i];
        try {
          let cleanImportedEntity = this.convertToCleanJson(importedEntity);

          if (!cleanImportedEntity.id) {
            cleanImportedEntity.id = this.generateId(new Map(finalEntities.map(e => [e.id, e])));
          }

          const existingIndex = finalEntities.findIndex(e => e.id === cleanImportedEntity.id);

          if (existingIndex >= 0) {
            // Update existing entity (merge)
            finalEntities[existingIndex] = {
              ...finalEntities[existingIndex],
              ...cleanImportedEntity,
              updated_at: new Date().toISOString(),
            };
            updatedCount++;
          } else {
            // Add new entity
            cleanImportedEntity.created_at = new Date().toISOString();
            cleanImportedEntity.updated_at = new Date().toISOString();
            finalEntities.push(cleanImportedEntity);
            addedCount++;
          }
        } catch (error) {
          throw new Error(`Error processing entity ${i + 1} (${importedEntity.name || 'unnamed'}): ${error.message}`);
        }
      }

      console.log(`📊 Processing complete: ${addedCount} added, ${updatedCount} updated`);
      console.log('💾 Saving to entity.json...');
      await this.writeEntityFile(finalEntities);
      console.log('✅ File saved successfully');

      return {
        entities: finalEntities,
        summary: {
          added: addedCount,
          updated: updatedCount,
          total: finalEntities.length
        }
      };
    } catch (error) {
      console.error('Error importing entity file:', error);
      throw new Error(`Import failed: ${error.message}`);
    }
  }

  // Legacy import method for backward compatibility
  async importEntityFileContent(jsonContent: string): Promise<Entity[]> {
    try {
      const importedEntities = JSON.parse(jsonContent);
      if (!Array.isArray(importedEntities)) {
        throw new Error('Invalid JSON format: expected array of entities');
      }

      // Get existing entities and load into memory for ID generation
      const existingEntities = await this.getEntities();
      this.entities = existingEntities; // Ensure in-memory state is current
      console.log(`📁 Found ${existingEntities.length} existing entities`);
      console.log(`📥 Importing ${importedEntities.length} new entities`);

      // Create a map of existing entities by ID for quick lookup
      const existingEntityMap = new Map(existingEntities.map(entity => [entity.id, entity]));

      // Process imported entities
      const processedImports: Entity[] = [];
      const conflicts: string[] = [];
      let newImports = 0;
      let updates = 0;

      for (const importedEntity of importedEntities) {
        // Ensure imported entity has all required fields
        let cleanImportedEntity = this.convertToCleanJson(importedEntity);

        if (existingEntityMap.has(cleanImportedEntity.id)) {
          // Check if this is the same entity (by name and code) or a true conflict
          const existingEntity = existingEntityMap.get(cleanImportedEntity.id);
          const isSameEntity = existingEntity &&
            (existingEntity.name === cleanImportedEntity.name ||
             existingEntity.code === cleanImportedEntity.code);

          if (isSameEntity) {
            // Update existing entity with imported data
            existingEntityMap.set(cleanImportedEntity.id, {
              ...cleanImportedEntity,
              updated_at: new Date().toISOString()
            });
            conflicts.push(`Updated: ${cleanImportedEntity.name} (${cleanImportedEntity.id})`);
            updates++;
          } else {
            // True conflict - generate new ID for imported entity
            const originalId = cleanImportedEntity.id;
            cleanImportedEntity = {
              ...cleanImportedEntity,
              id: this.generateId(existingEntityMap),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            existingEntityMap.set(cleanImportedEntity.id, cleanImportedEntity);
            conflicts.push(`ID conflict resolved: ${cleanImportedEntity.name} (${originalId} → ${cleanImportedEntity.id})`);
            newImports++;
          }
        } else {
          // New entity - add to map
          existingEntityMap.set(cleanImportedEntity.id, cleanImportedEntity);
          processedImports.push(cleanImportedEntity);
          newImports++;
        }
      }

      // Convert map back to array (maintains existing + adds new)
      const mergedEntities = Array.from(existingEntityMap.values());

      // Write merged entities to file
      await this.writeEntityFile(mergedEntities);

      console.log(`✅ Merge complete: ${newImports} new, ${updates} updated, ${mergedEntities.length} total`);

      if (conflicts.length > 0) {
        console.log('🔄 Conflicts resolved (updated existing):', conflicts);
      }

      return mergedEntities;
    } catch (error) {
      console.error('Import error:', error);
      throw new Error('Failed to import entities to entity.json file');
    }
  }

  // Get audit logs (no localStorage, return empty array)
  getAuditLogs(): any[] {
    return [];
  }

  // Clear all entity data
  async clearEntityData(): Promise<void> {
    await this.writeEntityFile([]);
  }

  // Load entities from file (for initialization)
  async loadEntities(): Promise<Entity[]> {
    try {
      this.entities = await this.readEntityFile();
      return this.entities;
    } catch (error) {
      console.error('Error loading entities:', error);
      this.entities = [];
      return [];
    }
  }

  // Flatten nested entity object for CSV/Excel export
  private flattenEntity(entity: Entity): Record<string, any> {
    return {
      id: entity.id,
      name: entity.name,
      code: entity.code,
      slug: entity.slug,
      type: entity.type,
      parentId: entity.parentId || '',
      educationalAuthority: entity.educationalAuthority,
      affiliation_number: entity.affiliation_number,
      recognized_by: entity.recognized_by.join(';'), // Join array with semicolon
      university_type: entity.university_type,
      description: entity.description,
      address_line1: entity.address_line1,
      address_line2: entity.address_line2 || '',
      city: entity.city,
      district: entity.district,
      state: entity.state,
      country: entity.country,
      pincode: entity.pincode,
      latitude: entity.latitude || '',
      longitude: entity.longitude || '',
      contact_person: entity.contact_person,
      designation: entity.designation,
      email: entity.email,
      phone: entity.phone,
      alternate_phone: entity.alternate_phone || '',
      website: entity.website,
      capacity: entity.capacity,
      established_year: entity.established_year,
      num_departments: entity.num_departments,
      num_faculties: entity.num_faculties,
      num_students: entity.num_students,
      programs_offered: entity.programs_offered.join(';'), // Join array with semicolon
      accreditation: entity.accreditation,
      is_autonomous: entity.is_autonomous,
      is_verified: entity.is_verified,
      hostel_available: entity.hostel_available,
      transport_available: entity.transport_available,
      digital_library_url: entity.digital_library_url || '',
      learning_management_url: entity.learning_management_url || '',
      placement_cell_contact: entity.placement_cell_contact || '',
      alumni_association_url: entity.alumni_association_url || '',
      status: entity.status,
      created_date: entity.created_date,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      remarks: entity.remarks || '',
      logo_url: entity.logo_url || '',
    };
  }

  // Unflatten CSV/Excel data back to nested entity structure
  private unflattenEntity(flatData: Record<string, any>): Entity {
    return {
      id: flatData.id || '',
      name: flatData.name || '',
      code: flatData.code || '',
      slug: flatData.slug || '',
      type: flatData.type || 'college',
      parentId: flatData.parentId || undefined,
      educationalAuthority: flatData.educationalAuthority || '',
      affiliation_number: flatData.affiliation_number || '',
      recognized_by: flatData.recognized_by ? flatData.recognized_by.split(';').filter(Boolean) : [],
      university_type: flatData.university_type || '',
      description: flatData.description || '',
      address_line1: flatData.address_line1 || '',
      address_line2: flatData.address_line2 || undefined,
      city: flatData.city || '',
      district: flatData.district || '',
      state: flatData.state || '',
      country: flatData.country || 'India',
      pincode: flatData.pincode || '',
      latitude: flatData.latitude || undefined,
      longitude: flatData.longitude || undefined,
      contact_person: flatData.contact_person || '',
      designation: flatData.designation || '',
      email: flatData.email || '',
      phone: flatData.phone || '',
      alternate_phone: flatData.alternate_phone || undefined,
      website: flatData.website || '',
      capacity: parseInt(flatData.capacity) || 0,
      established_year: parseInt(flatData.established_year) || new Date().getFullYear(),
      num_departments: parseInt(flatData.num_departments) || 0,
      num_faculties: parseInt(flatData.num_faculties) || 0,
      num_students: parseInt(flatData.num_students) || 0,
      programs_offered: flatData.programs_offered ? flatData.programs_offered.split(';').filter(Boolean) : [],
      accreditation: flatData.accreditation || '',
      is_autonomous: flatData.is_autonomous === true || flatData.is_autonomous === 'true',
      is_verified: flatData.is_verified === true || flatData.is_verified === 'true',
      hostel_available: flatData.hostel_available === true || flatData.hostel_available === 'true',
      transport_available: flatData.transport_available === true || flatData.transport_available === 'true',
      digital_library_url: flatData.digital_library_url || undefined,
      learning_management_url: flatData.learning_management_url || undefined,
      placement_cell_contact: flatData.placement_cell_contact || undefined,
      alumni_association_url: flatData.alumni_association_url || undefined,
      status: flatData.status || 'active',
      created_date: flatData.created_date || new Date().toISOString().split('T')[0],
      created_at: flatData.created_at || new Date().toISOString(),
      updated_at: flatData.updated_at || new Date().toISOString(),
      remarks: flatData.remarks || undefined,
      logo_url: flatData.logo_url || undefined,
    } as Entity;
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

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data: Record<string, any>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const row: Record<string, any> = {};

      headers.forEach((header, index) => {
        let value: any = values[index] || '';

        // Convert numeric values
        if (header.includes('capacity') || header.includes('established_year') ||
            header.includes('num_departments') || header.includes('num_faculties') ||
            header.includes('num_students')) {
          value = parseInt(value) || 0;
        } else if (header.includes('is_') || header.includes('_available')) {
          value = value === 'true' || value === 'TRUE' || value === '1';
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
          import('xlsx').then((XLSX) => {
            try {
              console.log('📊 Reading Excel file data...');
              const data = new Uint8Array(e.target?.result as ArrayBuffer);
              const workbook = XLSX.read(data, { type: 'array' });

              if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
                reject(new Error('Excel file contains no worksheets. Please ensure the file has at least one worksheet with data.'));
                return;
              }

              console.log(`📄 Found ${workbook.SheetNames.length} worksheet(s): ${workbook.SheetNames.join(', ')}`);
              const sheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[sheetName];

              if (!worksheet) {
                reject(new Error(`Failed to read worksheet "${sheetName}". The worksheet may be empty or corrupted.`));
                return;
              }

              console.log('🔄 Converting worksheet to JSON...');
              const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

              if (jsonData.length < 2) {
                reject(new Error(`Excel file must have at least a header row and one data row. Found ${jsonData.length} rows total.`));
                return;
              }

              console.log(`✅ Excel converted: ${jsonData.length} rows (1 header + ${jsonData.length - 1} data rows)`);

              const headers = jsonData[0] as string[];
              console.log(`📋 Headers found: ${headers.length} columns`);

              // Validate headers
              if (!headers || headers.length === 0) {
                reject(new Error('Excel file header row is empty. Please ensure the first row contains column headers.'));
                return;
              }

              // Check for required fields
              const requiredFields = ['name', 'code'];
              const missingFields = requiredFields.filter(field => !headers.some(h => h && h.toLowerCase().includes(field)));
              if (missingFields.length > 0) {
                console.warn(`⚠️ Missing recommended fields: ${missingFields.join(', ')}`);
              }

              const rows: Record<string, any>[] = [];
              console.log('🔄 Processing data rows...');

              for (let i = 1; i < jsonData.length; i++) {
                const values = jsonData[i] as any[];
                if (!values || values.length === 0) {
                  console.log(`⏭️ Skipping empty row ${i + 1}`);
                  continue; // Skip empty rows
                }

                try {
                  const row: Record<string, any> = {};

                  headers.forEach((header, index) => {
                    let value: any = values[index] || '';

                    // Convert numeric values
                    if (header && (header.includes('capacity') || header.includes('established_year') ||
                        header.includes('num_departments') || header.includes('num_faculties') ||
                        header.includes('num_students'))) {
                      value = parseInt(value) || 0;
                    } else if (header && (header.includes('is_') || header.includes('_available'))) {
                      value = value === 'true' || value === 'TRUE' || value === '1' || value === 1;
                    }

                    row[header] = value;
                  });

                  // Basic validation - check if row has some data
                  const hasData = Object.values(row).some(val => val !== '' && val !== null && val !== undefined);
                  if (hasData) {
                    rows.push(row);
                  } else {
                    console.log(`⏭️ Skipping empty row ${i + 1}`);
                  }
                } catch (rowError) {
                  console.error(`❌ Error processing row ${i + 1}:`, rowError);
                  reject(new Error(`Error processing row ${i + 1}: ${rowError.message}. Please check the data in this row.`));
                  return;
                }
              }

              console.log(`✅ Excel processing complete: ${rows.length} valid data rows extracted`);
              if (rows.length === 0) {
                reject(new Error('No valid data rows found in Excel file. Please check that your data is properly formatted.'));
                return;
              }

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

  // Convert array of objects to CSV content
  private generateCSV(data: Record<string, any>[]): string {
    if (data.length === 0) {
      return '';
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.map(h => `"${h}"`).join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          return `"${value}"`;
        }).join(',')
      )
    ].join('\n');

    return csvContent;
  }

  // Export as Excel file
  private async exportAsExcel(entities: Entity[], filename: string): Promise<void> {
    try {
      const XLSX = await import('xlsx');
      const flattenedEntities = entities.map(e => this.flattenEntity(e));

      // Create worksheet from flattened data
      const worksheet = XLSX.utils.json_to_sheet(flattenedEntities);

      // Create workbook and add worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Entities');

      // Write the file
      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw new Error('Failed to export to Excel format');
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
}

// Export singleton instance
const entityService = new EnhancedEntityService();
export default entityService;
