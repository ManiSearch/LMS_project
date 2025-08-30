export interface Institution {
  id: string;
  name: string;
  code: string;
  slug: string;
  type: string;
  parentId?: string | null;
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

// Institution data from the provided JSON
export const institutionsData: Institution[] = [
  {
    id: "INST1001",
    name: "Hindustan Institute of Technology and Science",
    code: "TN068",
    slug: "hindustan-institute-of-technology",
    type: "university",
    parentId: null,
    educationalAuthority: "UGC",
    affiliation_number: "AU/2023/TN/0488",
    recognized_by: ["UGC", "AICTE", "NAAC"],
    university_type: "Deemed University",
    description:
      "A premier institute offering engineering, management, and applied sciences programs.",
    address_line1: "Rajiv Gandhi Salai",
    address_line2: "Padur, OMR",
    city: "Chennai",
    district: "Chengalpattu",
    state: "Tamil Nadu",
    country: "India",
    pincode: "603103",
    latitude: "12.789456",
    longitude: "80.229876",
    contact_person: "Dr. Santhosh Kumar",
    designation: "Principal",
    email: "info@hindustanuniv.ac.in",
    phone: "+919876543210",
    alternate_phone: "+914427412310",
    website: "https://www.hindustanuniv.ac.in",
    capacity: 12000,
    established_year: 1985,
    num_departments: 14,
    num_faculties: 400,
    num_students: 10000,
    programs_offered: ["UG", "PG", "PhD"],
    accreditation: "NAAC A+",
    is_autonomous: true,
    is_verified: true,
    hostel_available: true,
    transport_available: true,
    digital_library_url: "https://dl.hindustanuniv.ac.in",
    learning_management_url: "https://lms.hindustanuniv.ac.in",
    placement_cell_contact: "+919845667788",
    alumni_association_url: "https://alumni.hindustanuniv.ac.in",
    status: "active",
    created_date: "2023-01-15",
    created_at: "2023-01-15T09:20:00Z",
    updated_at: "2025-08-07T10:00:00Z",
    remarks: "Top-ranked private technical university in Tamil Nadu.",
    logo_url: "https://hindustanuniv.ac.in/logo.png",
  },
  {
    id: "INST1002",
    name: "Anna University",
    code: "TN001",
    slug: "anna-university",
    type: "university",
    parentId: null,
    educationalAuthority: "Government of Tamil Nadu",
    affiliation_number: "GOV/2020/TN/0001",
    recognized_by: ["UGC", "AICTE", "NAAC"],
    university_type: "State University",
    description:
      "Premier technical university in Tamil Nadu offering engineering and technology programs.",
    address_line1: "Sardar Patel Road",
    address_line2: "Guindy",
    city: "Chennai",
    district: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    pincode: "600025",
    latitude: "13.0087",
    longitude: "80.2707",
    contact_person: "Dr. R. Velraj",
    designation: "Vice Chancellor",
    email: "registrar@annauniv.edu",
    phone: "+914422357070",
    alternate_phone: "+914422357080",
    website: "https://www.annauniv.edu",
    capacity: 25000,
    established_year: 1978,
    num_departments: 32,
    num_faculties: 850,
    num_students: 22000,
    programs_offered: ["UG", "PG", "PhD", "M.Tech"],
    accreditation: "NAAC A++",
    is_autonomous: true,
    is_verified: true,
    hostel_available: true,
    transport_available: true,
    digital_library_url: "https://library.annauniv.edu",
    learning_management_url: "https://lms.annauniv.edu",
    placement_cell_contact: "+914422357090",
    alumni_association_url: "https://alumni.annauniv.edu",
    status: "active",
    created_date: "2020-01-01",
    created_at: "2020-01-01T00:00:00Z",
    updated_at: "2025-01-15T12:00:00Z",
    remarks: "Leading technical university with excellent research facilities.",
    logo_url: "https://annauniv.edu/logo.png",
  },
  {
    id: "INST1004",
    name: "PSG College of Technology",
    code: "TN003",
    slug: "psg-college-technology",
    type: "college",
    parentId: null,
    educationalAuthority: "Government of Tamil Nadu",
    affiliation_number: "AICTE/2021/TN/0089",
    recognized_by: ["AICTE", "UGC", "NAAC"],
    university_type: "Autonomous College",
    description:
      "Leading engineering college with excellent industry connections and placement records.",
    address_line1: "Avinashi Road",
    address_line2: "Peelamedu",
    city: "Coimbatore",
    district: "Coimbatore",
    state: "Tamil Nadu",
    country: "India",
    pincode: "641004",
    latitude: "11.0168",
    longitude: "76.9558",
    contact_person: "Dr. R. Rudramoorthy",
    designation: "Principal",
    email: "principal@psgtech.edu",
    phone: "+914224572177",
    alternate_phone: "+914224572178",
    website: "https://www.psgtech.edu",
    capacity: 8000,
    established_year: 1951,
    num_departments: 18,
    num_faculties: 420,
    num_students: 7500,
    programs_offered: ["UG", "PG", "PhD"],
    accreditation: "NAAC A+",
    is_autonomous: true,
    is_verified: true,
    hostel_available: true,
    transport_available: true,
    digital_library_url: "https://library.psgtech.edu",
    learning_management_url: "https://lms.psgtech.edu",
    placement_cell_contact: "+914224572185",
    alumni_association_url: "https://alumni.psgtech.edu",
    status: "active",
    created_date: "2025-08-09",
    created_at: "2025-08-09T06:30:48.516Z",
    updated_at: "2025-08-09T06:31:48.141Z",
    remarks: "Excellent placement record with top MNCs.",
    logo_url: "https://psgtech.edu/logo.png",
  },
  {
    id: "101",
    name: "CENTRAL POLYTECHNIC COLLEGE",
    code: "IIT-D",
    slug: "iit-delhi",
    type: "university",
    parentId: null,
    educationalAuthority: "MHRD",
    affiliation_number: "AITD001",
    recognized_by: ["MHRD", "UGC", "AICTE"],
    university_type: "Institute of National Importance",
    description:
      "Premier technological institute offering world-class education in engineering and technology.",
    address_line1: "THARAMANI,CHENNAI",
    address_line2: "",
    city: "New Delhi",
    district: "CHENNAI",
    state: "Delhi",
    country: "India",
    pincode: "600113",
    latitude: "28.5449",
    longitude: "77.1929",
    contact_person: "Dr. V. Ramgopal Rao",
    designation: "Director",
    email: "director@iitd.ac.in",
    phone: "-3579",
    alternate_phone: "-3578",
    website: "https://home.iitd.ac.in",
    capacity: 8000,
    established_year: 1961,
    num_departments: 16,
    num_faculties: 850,
    num_students: 11000,
    programs_offered: [
      "Computer Science",
      "Electrical Engineering",
      "Mechanical Engineering",
      "Civil Engineering",
    ],
    accreditation: "NAAC A++",
    is_autonomous: false,
    is_verified: false,
    hostel_available: false,
    transport_available: false,
    digital_library_url: "https://library.iitd.ac.in",
    learning_management_url: "https://moodle.iitd.ac.in",
    placement_cell_contact: "placement@iitd.ac.in",
    alumni_association_url: "https://alumni.iitd.ac.in",
    status: "active",
    created_date: "2025-08-09",
    created_at: "2025-08-09T14:27:03.689Z",
    updated_at: "2025-08-09T14:27:03.689Z",
    remarks: "Top-ranked engineering institute in India",
    logo_url: "https://home.iitd.ac.in/images/logo.png",
  },
];

export class InstitutionService {
  /**
   * Get all institutions for dropdown display
   */
  static getAllInstitutions(): {
    id: string;
    code: string;
    displayText: string;
  }[] {
    return institutionsData.map((institution) => ({
      id: institution.id,
      code: institution.code,
      displayText: `${institution.id} - ${institution.code}`,
    }));
  }

  /**
   * Get institution details by ID
   */
  static getInstitutionById(id: string): Institution | null {
    return (
      institutionsData.find((institution) => institution.id === id) || null
    );
  }

  /**
   * Get institution details by code
   */
  static getInstitutionByCode(code: string): Institution | null {
    return (
      institutionsData.find((institution) => institution.code === code) || null
    );
  }

  /**
   * Search institutions by ID or code
   */
  static findInstitution(identifier: string): Institution | null {
    return (
      this.getInstitutionById(identifier) ||
      this.getInstitutionByCode(identifier)
    );
  }

  /**
   * Get institutions for login dropdown (simplified format)
   */
  static getLoginInstitutions(): {
    value: string;
    label: string;
    id: string;
    code: string;
  }[] {
    return institutionsData.map((institution) => ({
      value: institution.id,
      label: `${institution.code} - ${institution.name}`,
      id: institution.id,
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
}
