import { useState, useEffect } from 'react';

export interface Institution {
  id: number;
  name: string;
  code: string;
  slug: string;
  type: string;
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
  latitude: string;
  longitude: string;
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
  status: string;
  created_date: string;
  created_at: string;
  updated_at: string;
  remarks?: string;
  logo_url?: string;
}

let cachedInstitutions: Institution[] = [];
let isDataLoaded = false;

export class InstitutionService {
  /**
   * Load institutions from entity.json file
   */
  static async loadInstitutions(): Promise<Institution[]> {
    if (isDataLoaded && cachedInstitutions.length > 0) {
      return cachedInstitutions;
    }

    try {
      const response = await fetch('/entity.json');
      if (!response.ok) {
        throw new Error('Failed to fetch entity data');
      }
      const data = await response.json();
      cachedInstitutions = data;
      isDataLoaded = true;
      return cachedInstitutions;
    } catch (error) {
      console.error('Error loading institutions:', error);
      return [];
    }
  }

  /**
   * Get all institutions for dropdown display
   */
  static async getAllInstitutions(): Promise<{
    id: string;
    code: string;
    displayText: string;
  }[]> {
    const institutions = await this.loadInstitutions();
    return institutions.map((institution) => ({
      id: institution.id.toString(),
      code: institution.code,
      displayText: `${institution.code} - ${institution.name}`,
    }));
  }

  /**
   * Get institution details by ID
   */
  static async getInstitutionById(id: string): Promise<Institution | null> {
    const institutions = await this.loadInstitutions();
    return institutions.find((institution) => institution.id.toString() === id) || null;
  }

  /**
   * Get institution details by code
   */
  static async getInstitutionByCode(code: string): Promise<Institution | null> {
    const institutions = await this.loadInstitutions();
    return institutions.find((institution) => institution.code === code) || null;
  }

  /**
   * Search institutions by ID or code
   */
  static async findInstitution(identifier: string): Promise<Institution | null> {
    const byId = await this.getInstitutionById(identifier);
    if (byId) return byId;
    return await this.getInstitutionByCode(identifier);
  }

  /**
   * Get institutions for login dropdown (simplified format)
   */
  static async getLoginInstitutions(): Promise<{
    value: string;
    label: string;
    id: string;
    code: string;
  }[]> {
    const institutions = await this.loadInstitutions();
    return institutions.map((institution) => ({
      value: institution.id.toString(),
      label: institution.name,
      id: institution.id.toString(),
      code: institution.code,
    }));
  }

  /**
   * Validate if user belongs to selected institution
   */
  static validateUserInstitution(
    userInstitutionId: string,
    selectedInstitutionId: string,
  ): boolean {
    return userInstitutionId === selectedInstitutionId;
  }

  /**
   * Get cached institutions (synchronous access to loaded data)
   */
  static getCachedInstitutions(): Institution[] {
    return cachedInstitutions;
  }

  /**
   * Check if data is loaded
   */
  static isDataLoaded(): boolean {
    return isDataLoaded && cachedInstitutions.length > 0;
  }
}

/**
 * React hook to use institutions data
 */
export function useInstitutions() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await InstitutionService.loadInstitutions();
        setInstitutions(data);
        setError(null);
      } catch (err) {
        setError('Failed to load institutions');
        console.error('Error loading institutions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { institutions, loading, error };
}
