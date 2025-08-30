import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  GraduationCap,
  Plus,
  Search,
  Mail,
  Phone,
  Edit,
  Trash2,
  BookOpen,
  Users,
  Award,
  Clock,
  Eye,
  Filter,
  Calendar,
  Download,
  ArrowLeft,
  User,
  MapPin,
  CreditCard,
  FileText,
  School,
  Building,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Info,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { facultyService } from "@/services/facultyService";

// Entity interface for institution data
interface Entity {
  id: number;
  name: string;
  code: string;
  type: string;
  educationalAuthority: string;
  city: string;
  state: string;
}

// Updated comprehensive faculty interface based on JSON structure
export interface Faculty {
  faculty_id: string;
  employee_number: string;
  joining_date: string;
  designation: string;
  department: string;
  specialization: string;
  employment_type: string;
  experience_years: number;
  employment_status: string;
  institution_code: string;
  institution_name: string;

  personal_info: {
    first_name: string;
    middle_name: string;
    last_name: string;
    full_name: string;
    date_of_birth: string;
    gender: string;
    blood_group: string;
    nationality: string;
    marital_status: string;
  };

  contact_info: {
    email: string;
    alternate_email: string;
    phone_number: string;
    alternate_phone_number: string;
    present_address: {
      line: string;
      city: string;
      state: string;
      zip_code: string;
      country: string;
    };
    permanent_address: {
      line: string;
      city: string;
      state: string;
      zip_code: string;
      country: string;
    };
    emergency_contact: {
      name: string;
      relationship: string;
      contact_number: string;
    };
  };

  qualification_info: {
    highest_qualification: string;
    discipline: string;
    ug_college: string;
    ug_year: number;
    pg_college: string;
    pg_year: number;
    phd_college?: string;
    phd_year?: number;
    phd_topic?: string;
  };

  professional_experience: Array<{
    institute: string;
    designation: string;
    from_year: number;
    to_year: number;
  }>;

  documents: {
    aadhaar_number: string;
    pan_number: string;
    resume: string;
    photo: string;
    highest_degree_certificate: string;
    experience_certificates: string[];
    offer_letter: string;
    appointment_letter: string;
  };

  bank_details: {
    bank_name: string;
    account_number: string;
    ifsc_code: string;
    branch: string;
  };

  login_account: {
    username: string;
    password_plain: string;
    role: string;
    otp_verified: boolean;
  };

  metadata: {
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
  };
}

// Interface for the comprehensive add faculty form
interface FacultyFormData {
  // Faculty Member details
  employee_number: string;
  joining_date: string;
  designation: string;
  department: string;
  specialization: string;
  employment_type: string;
  experience_years: number;
  employment_status: string;
  institution_code: string;
  institution_name: string;

  // Personal Info
  first_name: string;
  middle_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  blood_group: string;
  nationality: string;
  marital_status: string;

  // Contact Info
  email: string;
  alternate_email: string;
  phone_number: string;
  alternate_phone_number: string;
  present_address_line: string;
  present_address_city: string;
  present_address_state: string;
  present_address_zip: string;
  present_address_country: string;
  permanent_address_line: string;
  permanent_address_city: string;
  permanent_address_state: string;
  permanent_address_zip: string;
  permanent_address_country: string;
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_number: string;

  // Qualification Info
  highest_qualification: string;
  discipline: string;
  ug_college: string;
  ug_year: number;
  pg_college: string;
  pg_year: number;
  phd_college: string;
  phd_year: number;
  phd_topic: string;

  // Professional Experience
  experience_institute_1: string;
  experience_designation_1: string;
  experience_from_year_1: number;
  experience_to_year_1: number;
  experience_institute_2: string;
  experience_designation_2: string;
  experience_from_year_2: number;
  experience_to_year_2: number;

  // Documents
  aadhaar_number: string;
  pan_number: string;

  // Bank Details
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  branch: string;

  // Login Account
  username: string;
  password_plain: string;
  role: string;
}

// Sample faculty data based on your JSON structure
const initialFaculty: Faculty[] = [
  {
    faculty_id: "F2025001",
    employee_number: "EMP2025CSE001",
    joining_date: "2025-07-15",
    designation: "Assistant Professor",
    department: "Computer Science and Engineering",
    specialization: "Artificial Intelligence",
    employment_type: "Full-Time",
    experience_years: 4,
    employment_status: "Active",
    institution_code: "102",
    institution_name: "INSTITUTE OF PRINTING TECHNOLOGY",

    personal_info: {
      first_name: "Anjali",
      middle_name: "Meera",
      last_name: "",
      full_name: "Anjali Meera",
      date_of_birth: "1988-04-22",
      gender: "Female",
      blood_group: "O+",
      nationality: "Indian",
      marital_status: "Married",
    },

    contact_info: {
      email: "anjali.nair@college.edu",
      alternate_email: "anjalinair.personal@gmail.com",
      phone_number: "+919812345678",
      alternate_phone_number: "+919812345679",
      present_address: {
        line: "45 MG Road",
        city: "Chennai",
        state: "Tamil Nadu",
        zip_code: "600034",
        country: "India",
      },
      permanent_address: {
        line: "12 Beach Road",
        city: "Kochi",
        state: "Kerala",
        zip_code: "682001",
        country: "India",
      },
      emergency_contact: {
        name: "Ravi Nair",
        relationship: "Husband",
        contact_number: "+919812347890",
      },
    },

    qualification_info: {
      highest_qualification: "Ph.D.",
      discipline: "Computer Science",
      ug_college: "Anna University",
      ug_year: 2008,
      pg_college: "IIT Madras",
      pg_year: 2011,
      phd_college: "IIT Madras",
      phd_year: 2016,
      phd_topic: "Deep Learning in Medical Imaging",
    },

    professional_experience: [
      {
        institute: "XYZ Engineering College",
        designation: "Lecturer",
        from_year: 2016,
        to_year: 2019,
      },
      {
        institute: "ABC Institute of Tech",
        designation: "Assistant Professor",
        from_year: 2019,
        to_year: 2025,
      },
    ],

    documents: {
      aadhaar_number: "5678-9101-1234",
      pan_number: "ABCDE1234F",
      resume: "/uploads/docs/resume_F2025001.pdf",
      photo: "/uploads/photos/F2025001.jpg",
      highest_degree_certificate: "/uploads/docs/phd_cert_F2025001.pdf",
      experience_certificates: [
        "/uploads/docs/exp_XYZ.pdf",
        "/uploads/docs/exp_ABC.pdf",
      ],
      offer_letter: "/uploads/docs/offer_F2025001.pdf",
      appointment_letter: "/uploads/docs/appointment_F2025001.pdf",
    },

    bank_details: {
      bank_name: "State Bank of India",
      account_number: "123456789012",
      ifsc_code: "SBIN0001234",
      branch: "T. Nagar, Chennai",
    },

    login_account: {
      username: "anjali.nair",
      password_plain: "Anjali@123",
      role: "Faculty",
      otp_verified: true,
    },

    metadata: {
      created_at: "2025-07-15T09:00:00Z",
      created_by: "hr_admin",
      updated_at: "2025-08-01T12:00:00Z",
      updated_by: "hr_admin",
    },
  },
  {
    faculty_id: "F2025002",
    employee_number: "EMP2025ECE002",
    joining_date: "2023-08-10",
    designation: "Associate Professor",
    department: "Electronics and Communication Engineering",
    specialization: "VLSI Design",
    employment_type: "Full-Time",
    experience_years: 9,
    employment_status: "Active",
    personal_info: {
      first_name: "Rohit",
      middle_name: "Kumar",
      last_name: "",
      full_name: "Rohit Kumar",
      date_of_birth: "1984-09-12",
      gender: "Male",
      blood_group: "A+",
      nationality: "Indian",
      marital_status: "Married",
    },
    contact_info: {
      email: "rohit.verma@college.edu",
      alternate_email: "rkverma.ece@gmail.com",
      phone_number: "+919812345001",
      alternate_phone_number: "+919812345002",
      present_address: {
        line: "89 Tech Park",
        city: "Bangalore",
        state: "Karnataka",
        zip_code: "560037",
        country: "India",
      },
      permanent_address: {
        line: "45 Lake View",
        city: "Lucknow",
        state: "Uttar Pradesh",
        zip_code: "226001",
        country: "India",
      },
      emergency_contact: {
        name: "Priya Verma",
        relationship: "Wife",
        contact_number: "+919812345003",
      },
    },
    qualification_info: {
      highest_qualification: "Ph.D.",
      discipline: "Electronics",
      ug_college: "NIT Warangal",
      ug_year: 2006,
      pg_college: "IISc Bangalore",
      pg_year: 2008,
      phd_college: "IISc Bangalore",
      phd_year: 2014,
      phd_topic: "Low Power VLSI Architectures",
    },
    professional_experience: [
      {
        institute: "Techno India",
        designation: "Assistant Professor",
        from_year: 2014,
        to_year: 2018,
      },
      {
        institute: "BITS Pilani",
        designation: "Associate Professor",
        from_year: 2018,
        to_year: 2023,
      },
    ],
    documents: {
      aadhaar_number: "1234-5678-9012",
      pan_number: "FGHIJ5678K",
      resume: "/uploads/docs/resume_F2025002.pdf",
      photo: "/uploads/photos/F2025002.jpg",
      highest_degree_certificate: "/uploads/docs/phd_cert_F2025002.pdf",
      experience_certificates: [
        "/uploads/docs/exp_Techno.pdf",
        "/uploads/docs/exp_BITS.pdf",
      ],
      offer_letter: "/uploads/docs/offer_F2025002.pdf",
      appointment_letter: "/uploads/docs/appointment_F2025002.pdf",
    },
    bank_details: {
      bank_name: "HDFC Bank",
      account_number: "987654321098",
      ifsc_code: "HDFC0004567",
      branch: "Koramangala, Bangalore",
    },
    login_account: {
      username: "rohit.verma",
      password_plain: "Rohit@123",
      role: "Faculty",
      otp_verified: true,
    },
    metadata: {
      created_at: "2023-08-10T10:00:00Z",
      created_by: "hr_admin",
      updated_at: "2025-07-20T15:30:00Z",
      updated_by: "hr_admin",
    },
  },
  {
    faculty_id: "F2025003",
    employee_number: "EMP2025MECH003",
    joining_date: "2024-01-05",
    designation: "Professor",
    department: "Mechanical Engineering",
    specialization: "Robotics and Automation",
    employment_type: "Full-Time",
    experience_years: 15,
    employment_status: "Active",
    personal_info: {
      first_name: "Meena",
      middle_name: "",
      last_name: "kumari",
      full_name: "Meena kumari",
      date_of_birth: "1980-11-05",
      gender: "Female",
      blood_group: "B+",
      nationality: "Indian",
      marital_status: "Single",
    },
    contact_info: {
      email: "neha.singh@college.edu",
      alternate_email: "nehas.me@gmail.com",
      phone_number: "+919812340000",
      alternate_phone_number: "",
      present_address: {
        line: "150 Industrial Estate",
        city: "Pune",
        state: "Maharashtra",
        zip_code: "411038",
        country: "India",
      },
      permanent_address: {
        line: "20 Civil Lines",
        city: "Nagpur",
        state: "Maharashtra",
        zip_code: "440001",
        country: "India",
      },
      emergency_contact: {
        name: "Amit Singh",
        relationship: "Brother",
        contact_number: "+919812349999",
      },
    },
    qualification_info: {
      highest_qualification: "Ph.D.",
      discipline: "Mechanical Engineering",
      ug_college: "COEP",
      ug_year: 2001,
      pg_college: "IIT Bombay",
      pg_year: 2003,
      phd_college: "IIT Bombay",
      phd_year: 2008,
      phd_topic: "Autonomous Robotic Systems",
    },
    professional_experience: [
      {
        institute: "MIT Pune",
        designation: "Associate Professor",
        from_year: 2008,
        to_year: 2018,
      },
      {
        institute: "COEP Technological University",
        designation: "Professor",
        from_year: 2018,
        to_year: 2024,
      },
    ],
    documents: {
      aadhaar_number: "4321-8765-2109",
      pan_number: "LMNOP2345Q",
      resume: "/uploads/docs/resume_F2025003.pdf",
      photo: "/uploads/photos/F2025003.jpg",
      highest_degree_certificate: "/uploads/docs/phd_cert_F2025003.pdf",
      experience_certificates: [
        "/uploads/docs/exp_MIT.pdf",
        "/uploads/docs/exp_COEP.pdf",
      ],
      offer_letter: "/uploads/docs/offer_F2025003.pdf",
      appointment_letter: "/uploads/docs/appointment_F2025003.pdf",
    },
    bank_details: {
      bank_name: "ICICI Bank",
      account_number: "112233445566",
      ifsc_code: "ICIC0007890",
      branch: "Shivaji Nagar, Pune",
    },
    login_account: {
      username: "neha.singh",
      password_plain: "Neha@123",
      role: "Faculty",
      otp_verified: true,
    },
    metadata: {
      created_at: "2024-01-05T08:30:00Z",
      created_by: "hr_admin",
      updated_at: "2025-07-01T14:00:00Z",
      updated_by: "hr_admin",
    },
  },
  {
    faculty_id: "F2025004",
    employee_number: "EMP2025CIV004",
    joining_date: "2022-06-20",
    designation: "Assistant Professor",
    department: "Civil Engineering",
    specialization: "Structural Engineering",
    employment_type: "Full-Time",
    experience_years: 6,
    employment_status: "Active",
    personal_info: {
      first_name: "Arjun",
      middle_name: "",
      last_name: "Raj",
      full_name: "Arjun raj",
      date_of_birth: "1990-03-18",
      gender: "Male",
      blood_group: "AB+",
      nationality: "Indian",
      marital_status: "Married",
    },
    contact_info: {
      email: "arjun.reddy@college.edu",
      alternate_email: "arjunraj.ce@gmail.com",
      phone_number: "+919812347001",
      alternate_phone_number: "",
      present_address: {
        line: "76 Main Road",
        city: "Chennai",
        state: "Tamilnadu",
        zip_code: "500001",
        country: "India",
      },
      permanent_address: {
        line: "32 Temple Street",
        city: "Vijayawada",
        state: "Andhra Pradesh",
        zip_code: "520001",
        country: "India",
      },
      emergency_contact: {
        name: "Sneha Reddy",
        relationship: "Wife",
        contact_number: "+919812347002",
      },
    },
    qualification_info: {
      highest_qualification: "M.Tech",
      discipline: "Civil Engineering",
      ug_college: "JNTU Hyderabad",
      ug_year: 2011,
      pg_college: "IIT Roorkee",
      pg_year: 2013,
      phd_college: "",
      phd_year: null,
      phd_topic: "",
    },
    professional_experience: [
      {
        institute: "SRM University",
        designation: "Lecturer",
        from_year: 2013,
        to_year: 2017,
      },
      {
        institute: "BITS Hyderabad",
        designation: "Assistant Professor",
        from_year: 2017,
        to_year: 2022,
      },
    ],
    documents: {
      aadhaar_number: "1010-2020-3030",
      pan_number: "QRSTU6789L",
      resume: "/uploads/docs/resume_F2025004.pdf",
      photo: "/uploads/photos/F2025004.jpg",
      highest_degree_certificate: "/uploads/docs/pg_cert_F2025004.pdf",
      experience_certificates: [
        "/uploads/docs/exp_SRM.pdf",
        "/uploads/docs/exp_BITS_HYD.pdf",
      ],
      offer_letter: "/uploads/docs/offer_F2025004.pdf",
      appointment_letter: "/uploads/docs/appointment_F2025004.pdf",
    },
    bank_details: {
      bank_name: "Axis Bank",
      account_number: "556677889900",
      ifsc_code: "UTIB0001100",
      branch: "Hitech City, Hyderabad",
    },
    login_account: {
      username: "arjun.reddy",
      password_plain: "Arjun@123",
      role: "Faculty",
      otp_verified: true,
    },
    metadata: {
      created_at: "2022-06-20T11:00:00Z",
      created_by: "hr_admin",
      updated_at: "2025-07-10T10:15:00Z",
      updated_by: "hr_admin",
    },
  },
];

const departments = [
  "Computer Science and Engineering",
  "Electronics and Communication Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical and Electronics Engineering",
  "Information Technology",
  "Biomedical Engineering",
  "Chemical Engineering",
];

const qualifications = [
  "Ph.D",
  "M.Tech",
  "M.E",
  "M.Sc",
  "M.A",
  "MBA",
  "B.Tech",
  "B.E",
  "B.Sc",
  "B.A",
];

const designations = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Lecturer",
  "Senior Lecturer",
];

const employmentTypes = [
  "Full-Time",
  "Part-Time",
  "Contract",
  "Visiting",
];

const genders = ["Male", "Female", "Other"];
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const maritalStatuses = ["Single", "Married", "Divorced", "Widowed"];
const employmentStatuses = ["Active", "On Leave", "Inactive", "Retired"];

export default function Faculty() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState<Faculty | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "add" | "view" | "edit">("list");
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [editFormData, setEditFormData] = useState<FacultyFormData | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Bulk selection state
  const [selectedFacultyIds, setSelectedFacultyIds] = useState<Set<string>>(new Set());
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FacultyFormData>({
    // Faculty Member details
    employee_number: "",
    joining_date: "",
    designation: "",
    department: "",
    specialization: "",
    employment_type: "Full-Time",
    experience_years: 0,
    employment_status: "Active",
    institution_code: "",
    institution_name: "",

    // Personal Info
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    blood_group: "",
    nationality: "Indian",
    marital_status: "",

    // Contact Info
    email: "",
    alternate_email: "",
    phone_number: "",
    alternate_phone_number: "",
    present_address_line: "",
    present_address_city: "",
    present_address_state: "",
    present_address_zip: "",
    present_address_country: "India",
    permanent_address_line: "",
    permanent_address_city: "",
    permanent_address_state: "",
    permanent_address_zip: "",
    permanent_address_country: "India",
    emergency_contact_name: "",
    emergency_contact_relationship: "",
    emergency_contact_number: "",

    // Qualification Info
    highest_qualification: "",
    discipline: "",
    ug_college: "",
    ug_year: 0,
    pg_college: "",
    pg_year: 0,
    phd_college: "",
    phd_year: 0,
    phd_topic: "",

    // Professional Experience
    experience_institute_1: "",
    experience_designation_1: "",
    experience_from_year_1: 0,
    experience_to_year_1: 0,
    experience_institute_2: "",
    experience_designation_2: "",
    experience_from_year_2: 0,
    experience_to_year_2: 0,

    // Documents
    aadhaar_number: "",
    pan_number: "",

    // Bank Details
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    branch: "",

    // Login Account
    username: "",
    password_plain: "",
    role: "Faculty",
  });

  // Load faculty data from faculty.json on component mount
  useEffect(() => {
    loadFacultyData();
    loadEntityData();
  }, []);

  const loadEntityData = async () => {
    try {
      const response = await fetch('/entity.json');
      const entityData = await response.json();
      setEntities(entityData);
    } catch (error) {
      console.error('Error loading entity data:', error);
    }
  };

  const loadFacultyData = async () => {
    try {
      setLoading(true);
      const facultyData = await facultyService.getAllFaculty();
      setFaculty(facultyData);
      setSelectedFacultyIds(new Set()); // Clear selections when data reloads
    } catch (error) {
      console.error('Error loading faculty data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFaculty = faculty.filter((member) => {
    const matchesSearch =
      (member.personal_info?.full_name || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (member.contact_info?.email || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (member.department || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.specialization || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (member.employment_status || '').toLowerCase() === statusFilter;
    const matchesDepartment =
      departmentFilter === "all" || member.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const stats = {
    total: faculty.length,
    active: faculty.filter((f) => (f.employment_status || '') === "Active").length,
    departments: new Set(faculty.map((f) => f.department).filter(Boolean)).size,
    phdHolders: faculty.filter((f) =>
      (f.qualification_info?.highest_qualification || '').includes("Ph.D")
    ).length,
    avgExperience:
      faculty.length > 0 ? Math.round(
        (faculty.reduce((sum, f) => sum + (f.experience_years || 0), 0) /
          faculty.length) *
          10
      ) / 10 : 0,
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredFaculty.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFaculty = filteredFaculty.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, departmentFilter]);

  // Reset page when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // Bulk selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(paginatedFaculty.map(f => f.faculty_id));
      setSelectedFacultyIds(newSelected);
    } else {
      setSelectedFacultyIds(new Set());
    }
  };

  const handleSelectFaculty = (facultyId: string, checked: boolean) => {
    const newSelected = new Set(selectedFacultyIds);
    if (checked) {
      newSelected.add(facultyId);
    } else {
      newSelected.delete(facultyId);
    }
    setSelectedFacultyIds(newSelected);
  };

  const isAllSelected = paginatedFaculty.length > 0 && paginatedFaculty.every(f => selectedFacultyIds.has(f.faculty_id));

  const resetForm = () => {
    setFormData({
      // Faculty Member details
      employee_number: "",
      joining_date: "",
      designation: "",
      department: "",
      specialization: "",
      employment_type: "Full-Time",
      experience_years: 0,
      employment_status: "Active",
      institution_code: "",
      institution_name: "",

      // Personal Info
      first_name: "",
      middle_name: "",
      last_name: "",
      date_of_birth: "",
      gender: "",
      blood_group: "",
      nationality: "Indian",
      marital_status: "",

      // Contact Info
      email: "",
      alternate_email: "",
      phone_number: "",
      alternate_phone_number: "",
      present_address_line: "",
      present_address_city: "",
      present_address_state: "",
      present_address_zip: "",
      present_address_country: "India",
      permanent_address_line: "",
      permanent_address_city: "",
      permanent_address_state: "",
      permanent_address_zip: "",
      permanent_address_country: "India",
      emergency_contact_name: "",
      emergency_contact_relationship: "",
      emergency_contact_number: "",

      // Qualification Info
      highest_qualification: "",
      discipline: "",
      ug_college: "",
      ug_year: 0,
      pg_college: "",
      pg_year: 0,
      phd_college: "",
      phd_year: 0,
      phd_topic: "",

      // Professional Experience
      experience_institute_1: "",
      experience_designation_1: "",
      experience_from_year_1: 0,
      experience_to_year_1: 0,
      experience_institute_2: "",
      experience_designation_2: "",
      experience_from_year_2: 0,
      experience_to_year_2: 0,

      // Documents
      aadhaar_number: "",
      pan_number: "",

      // Bank Details
      bank_name: "",
      account_number: "",
      ifsc_code: "",
      branch: "",

      // Login Account
      username: "",
      password_plain: "",
      role: "Faculty",
    });
  };

  const handleCreate = async () => {
    try {
      setLoading(true);

      const facultyData = {
        employee_number: formData.employee_number,
        joining_date: formData.joining_date,
        designation: formData.designation,
        department: formData.department,
        specialization: formData.specialization,
        employment_type: formData.employment_type,
        experience_years: formData.experience_years,
        employment_status: formData.employment_status,
        institution_code: formData.institution_code,
        institution_name: formData.institution_name,

        personal_info: {
          first_name: formData.first_name,
          middle_name: formData.middle_name,
          last_name: formData.last_name,
          full_name: `${formData.first_name} ${formData.middle_name} ${formData.last_name}`.trim(),
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          blood_group: formData.blood_group,
          nationality: formData.nationality,
          marital_status: formData.marital_status,
        },

        contact_info: {
          email: formData.email,
          alternate_email: formData.alternate_email,
          phone_number: formData.phone_number,
          alternate_phone_number: formData.alternate_phone_number,
          present_address: {
            line: formData.present_address_line,
            city: formData.present_address_city,
            state: formData.present_address_state,
            zip_code: formData.present_address_zip,
            country: formData.present_address_country,
          },
          permanent_address: {
            line: formData.permanent_address_line,
            city: formData.permanent_address_city,
            state: formData.permanent_address_state,
            zip_code: formData.permanent_address_zip,
            country: formData.permanent_address_country,
          },
          emergency_contact: {
            name: formData.emergency_contact_name,
            relationship: formData.emergency_contact_relationship,
            contact_number: formData.emergency_contact_number,
          },
        },

        qualification_info: {
          highest_qualification: formData.highest_qualification,
          discipline: formData.discipline,
          ug_college: formData.ug_college,
          ug_year: formData.ug_year,
          pg_college: formData.pg_college,
          pg_year: formData.pg_year,
          phd_college: formData.phd_college || undefined,
          phd_year: formData.phd_year || undefined,
          phd_topic: formData.phd_topic || undefined,
        },

        professional_experience: [
          {
            institute: formData.experience_institute_1,
            designation: formData.experience_designation_1,
            from_year: formData.experience_from_year_1,
            to_year: formData.experience_to_year_1,
          },
          {
            institute: formData.experience_institute_2,
            designation: formData.experience_designation_2,
            from_year: formData.experience_from_year_2,
            to_year: formData.experience_to_year_2,
          },
        ].filter(exp => exp.institute), // Only include experiences with institute names

        documents: {
          aadhaar_number: formData.aadhaar_number,
          pan_number: formData.pan_number,
          resume: "",
          photo: "",
          highest_degree_certificate: "",
          experience_certificates: [],
          offer_letter: "",
          appointment_letter: "",
        },

        bank_details: {
          bank_name: formData.bank_name,
          account_number: formData.account_number,
          ifsc_code: formData.ifsc_code,
          branch: formData.branch,
        },

        login_account: {
          username: formData.username,
          password_plain: formData.password_plain,
          role: formData.role,
          otp_verified: false,
        },
      };

      await facultyService.createFaculty(facultyData);
      await loadFacultyData(); // Reload faculty data
      setViewMode("list");
      resetForm();

      // Show success message
      alert('Faculty member created successfully! Data has been saved to faculty.json.');
    } catch (error) {
      console.error('Error creating faculty:', error);
      alert('Error creating faculty member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (faculty: Faculty) => {
    setFacultyToDelete(faculty);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!facultyToDelete) return;

    try {
      setLoading(true);
      await facultyService.deleteFaculty(facultyToDelete.faculty_id);
      await loadFacultyData(); // Reload faculty data
      setIsDeleteDialogOpen(false);
      setFacultyToDelete(null);

      // Show success message
      alert('Faculty member deleted successfully! Data has been updated in faculty.json.');
    } catch (error) {
      console.error('Error deleting faculty:', error);
      alert('Error deleting faculty member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Bulk delete functionality
  const handleBulkDelete = () => {
    if (selectedFacultyIds.size === 0) {
      console.log('Please select at least one faculty member to delete.');
      return;
    }
    setIsBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      setLoading(true);
      const facultyToDelete = Array.from(selectedFacultyIds);

      // Delete each selected faculty member
      for (const facultyId of facultyToDelete) {
        await facultyService.deleteFaculty(facultyId);
      }

      await loadFacultyData();
      setSelectedFacultyIds(new Set());
      setIsBulkDeleteDialogOpen(false);

      console.log(`${facultyToDelete.length} faculty member(s) deleted successfully! Data has been updated in faculty.json.`);
    } catch (error) {
      console.error('Error deleting faculty members:', error);
      console.log('Error deleting faculty members. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Download sample template
  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/sample_faculty_template.csv';
    link.download = 'faculty_import_template.csv';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('📄 Template downloaded! Use this CSV format for importing faculty data.');
  };

  const openAddFacultyForm = () => {
    resetForm();
    setViewMode("add");
  };

  const handleBackToList = () => {
    setViewMode("list");
    resetForm();
    setSelectedFaculty(null);
    setEditFormData(null);
  };

  const handleViewFaculty = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setViewMode("view");
  };

  const handleEditFaculty = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    // Convert Faculty to FacultyFormData for editing
    const editData: FacultyFormData = {
      employee_number: faculty.employee_number,
      joining_date: faculty.joining_date,
      designation: faculty.designation,
      department: faculty.department,
      specialization: faculty.specialization,
      employment_type: faculty.employment_type,
      experience_years: faculty.experience_years,
      employment_status: faculty.employment_status,
      institution_code: faculty.institution_code || '',
      institution_name: faculty.institution_name || '',
      first_name: faculty.personal_info?.first_name || '',
      middle_name: faculty.personal_info?.middle_name || '',
      last_name: faculty.personal_info?.last_name || '',
      date_of_birth: faculty.personal_info?.date_of_birth || '',
      gender: faculty.personal_info?.gender || '',
      blood_group: faculty.personal_info?.blood_group || '',
      nationality: faculty.personal_info?.nationality || '',
      marital_status: faculty.personal_info?.marital_status || '',
      email: faculty.contact_info?.email || '',
      alternate_email: faculty.contact_info?.alternate_email || '',
      phone_number: faculty.contact_info?.phone_number || '',
      alternate_phone_number: faculty.contact_info?.alternate_phone_number || '',
      present_address_line: faculty.contact_info?.present_address?.line || '',
      present_address_city: faculty.contact_info?.present_address?.city || '',
      present_address_state: faculty.contact_info?.present_address?.state || '',
      present_address_zip: faculty.contact_info?.present_address?.zip_code || '',
      present_address_country: faculty.contact_info?.present_address?.country || '',
      permanent_address_line: faculty.contact_info?.permanent_address?.line || '',
      permanent_address_city: faculty.contact_info?.permanent_address?.city || '',
      permanent_address_state: faculty.contact_info?.permanent_address?.state || '',
      permanent_address_zip: faculty.contact_info?.permanent_address?.zip_code || '',
      permanent_address_country: faculty.contact_info?.permanent_address?.country || '',
      emergency_contact_name: faculty.contact_info?.emergency_contact?.name || '',
      emergency_contact_relationship: faculty.contact_info?.emergency_contact?.relationship || '',
      emergency_contact_number: faculty.contact_info?.emergency_contact?.contact_number || '',
      highest_qualification: faculty.qualification_info?.highest_qualification || '',
      discipline: faculty.qualification_info?.discipline || '',
      ug_college: faculty.qualification_info?.ug_college || '',
      ug_year: faculty.qualification_info?.ug_year || '',
      pg_college: faculty.qualification_info?.pg_college || '',
      pg_year: faculty.qualification_info?.pg_year || '',
      phd_college: faculty.qualification_info?.phd_college || "",
      phd_year: faculty.qualification_info?.phd_year || 0,
      phd_topic: faculty.qualification_info?.phd_topic || "",
      experience_institute_1: faculty.professional_experience?.[0]?.institute || "",
      experience_designation_1: faculty.professional_experience?.[0]?.designation || "",
      experience_from_year_1: faculty.professional_experience?.[0]?.from_year || 0,
      experience_to_year_1: faculty.professional_experience?.[0]?.to_year || 0,
      experience_institute_2: faculty.professional_experience?.[1]?.institute || "",
      experience_designation_2: faculty.professional_experience?.[1]?.designation || "",
      experience_from_year_2: faculty.professional_experience?.[1]?.from_year || 0,
      experience_to_year_2: faculty.professional_experience?.[1]?.to_year || 0,
      aadhaar_number: faculty.documents?.aadhaar_number || '',
      pan_number: faculty.documents?.pan_number || '',
      bank_name: faculty.bank_details?.bank_name || '',
      account_number: faculty.bank_details?.account_number || '',
      ifsc_code: faculty.bank_details?.ifsc_code || '',
      branch: faculty.bank_details?.branch || '',
      username: faculty.login_account?.username || '',
      password_plain: faculty.login_account?.password_plain || '',
      role: faculty.login_account?.role || 'Faculty',
    };
    setEditFormData(editData);
    setViewMode("edit");
  };

  const handleUpdateFaculty = async () => {
    if (!selectedFaculty || !editFormData) return;

    try {
      setLoading(true);

      const updatedFacultyData = {
        employee_number: editFormData.employee_number,
        joining_date: editFormData.joining_date,
        designation: editFormData.designation,
        department: editFormData.department,
        specialization: editFormData.specialization,
        employment_type: editFormData.employment_type,
        experience_years: editFormData.experience_years,
        employment_status: editFormData.employment_status,
        institution_code: editFormData.institution_code,
        institution_name: editFormData.institution_name,
        personal_info: {
          first_name: editFormData.first_name,
          middle_name: editFormData.middle_name,
          last_name: editFormData.last_name,
          full_name: `${editFormData.first_name} ${editFormData.middle_name} ${editFormData.last_name}`.trim(),
          date_of_birth: editFormData.date_of_birth,
          gender: editFormData.gender,
          blood_group: editFormData.blood_group,
          nationality: editFormData.nationality,
          marital_status: editFormData.marital_status,
        },
        contact_info: {
          email: editFormData.email,
          alternate_email: editFormData.alternate_email,
          phone_number: editFormData.phone_number,
          alternate_phone_number: editFormData.alternate_phone_number,
          present_address: {
            line: editFormData.present_address_line,
            city: editFormData.present_address_city,
            state: editFormData.present_address_state,
            zip_code: editFormData.present_address_zip,
            country: editFormData.present_address_country,
          },
          permanent_address: {
            line: editFormData.permanent_address_line,
            city: editFormData.permanent_address_city,
            state: editFormData.permanent_address_state,
            zip_code: editFormData.permanent_address_zip,
            country: editFormData.permanent_address_country,
          },
          emergency_contact: {
            name: editFormData.emergency_contact_name,
            relationship: editFormData.emergency_contact_relationship,
            contact_number: editFormData.emergency_contact_number,
          },
        },
        qualification_info: {
          highest_qualification: editFormData.highest_qualification,
          discipline: editFormData.discipline,
          ug_college: editFormData.ug_college,
          ug_year: editFormData.ug_year,
          pg_college: editFormData.pg_college,
          pg_year: editFormData.pg_year,
          phd_college: editFormData.phd_college || undefined,
          phd_year: editFormData.phd_year || undefined,
          phd_topic: editFormData.phd_topic || undefined,
        },
        professional_experience: [
          {
            institute: editFormData.experience_institute_1,
            designation: editFormData.experience_designation_1,
            from_year: editFormData.experience_from_year_1,
            to_year: editFormData.experience_to_year_1,
          },
          {
            institute: editFormData.experience_institute_2,
            designation: editFormData.experience_designation_2,
            from_year: editFormData.experience_from_year_2,
            to_year: editFormData.experience_to_year_2,
          },
        ].filter(exp => exp.institute),
        documents: {
          ...(selectedFaculty.documents || {}),
          aadhaar_number: editFormData.aadhaar_number,
          pan_number: editFormData.pan_number,
        },
        bank_details: {
          bank_name: editFormData.bank_name,
          account_number: editFormData.account_number,
          ifsc_code: editFormData.ifsc_code,
          branch: editFormData.branch,
        },
        login_account: {
          username: editFormData.username,
          password_plain: editFormData.password_plain,
          role: editFormData.role,
          otp_verified: selectedFaculty.login_account?.otp_verified || false,
        },
      };

      await facultyService.updateFaculty(selectedFaculty.faculty_id, updatedFacultyData);
      await loadFacultyData();
      setViewMode("list");
      setSelectedFaculty(null);
      setEditFormData(null);

      // Show success message
      alert('Faculty member updated successfully! Data has been saved to faculty.json.');
    } catch (error) {
      console.error('Error updating faculty:', error);
      alert('Error updating faculty member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced export with format selection
  const handleExport = async (format: 'json' | 'csv' | 'excel') => {
    try {
      setLoading(true);
      await facultyService.exportFacultyFile(format);

      const formatName = format === 'excel' ? 'Excel' : format.toUpperCase();
      console.log(`✅ Export successful! Faculty data exported as ${formatName} format.`);
    } catch (error) {
      console.error('Export error:', error);
      console.log('Failed to export faculty. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Legacy export function
  const handleExportOld = () => {
    const csvContent = [
      [
        "Faculty ID",
        "Employee Number",
        "Name",
        "Email",
        "Phone",
        "Department",
        "Designation",
        "Qualification",
        "Experience Years",
        "Specialization",
        "Employment Type",
        "Status",
        "Joining Date",
      ].join(","),
      ...filteredFaculty.map((member) =>
        [
          member.faculty_id,
          member.employee_number,
          member.personal_info.full_name,
          member.contact_info.email,
          member.contact_info.phone_number,
          member.department,
          member.designation,
          member.qualification_info.highest_qualification,
          member.experience_years.toString(),
          member.specialization,
          member.employment_type,
          member.employment_status,
          member.joining_date,
        ]
          .map((field) => `"${field}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `faculty_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Enhanced import with support for both JSON and CSV/Excel files
  const handleImportFaculty = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedExtensions = ['.json', '.csv', '.xlsx', '.xls'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

    if (!allowedExtensions.includes(fileExtension)) {
      console.log(`❌ Unsupported file format: ${fileExtension}\nPlease use: ${allowedExtensions.join(', ')}`);
      event.target.value = '';
      return;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.log(`❌ File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB\nMaximum allowed: 10MB`);
      event.target.value = '';
      return;
    }

    try {
      setLoading(true);
      const currentCount = faculty.length;

      console.log(`📥 Starting import: ${currentCount} existing faculty`);
      console.log(`📄 File: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`);

      // Use enhanced import method
      const result = await facultyService.importFacultyFileEnhanced(file);

      // Update state with merged faculty
      setFaculty(result.faculty);
      await loadFacultyData(); // Refresh from server to ensure consistency

      const { added, updated, total } = result.summary;

      let message = `✅ Import successful!\n\n`;
      message += `📄 File: ${file.name}\n`;
      if (added > 0) {
        message += `🆕 Added: ${added} new faculty\n`;
      }
      if (updated > 0) {
        message += `🔄 Updated: ${updated} existing faculty\n`;
      }
      message += `📊 Total faculty: ${total}\n\n`;
      message += `💾 Data saved to faculty.json`;

      console.log(message);
    } catch (error) {
      console.error('Import error:', error);
      let errorMessage = `❌ Import failed: ${error.message}\n\n`;

      if (fileExtension === '.json') {
        errorMessage += `💡 JSON files should contain an array of faculty objects with nested structure.`;
      } else {
        errorMessage += `�� CSV/Excel files should have flattened column headers.`;
      }

      console.log(errorMessage);
    } finally {
      setLoading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  // Legacy import handler
  const handleImportFacultyOld = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const currentCount = faculty.length;

        console.log(`📥 Starting import: ${currentCount} existing faculty`);

        // Check if file is Excel/CSV and handle accordingly
        if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
          // Use enhanced import method for Excel/CSV files
          const result = await facultyService.importFacultyFileEnhanced(file);
          setFaculty(result.faculty);

          const { added, updated, total } = result.summary;
          let message = `✅ Import successful!\n\n`;
          message += `📄 File: ${file.name}\n`;
          if (added > 0) {
            message += `🆕 Added: ${added} new faculty\n`;
          }
          if (updated > 0) {
            message += `🔄 Updated: ${updated} existing faculty\n`;
          }
          message += `📊 Total faculty: ${total}`;
          console.log(message);
          return;
        }

        // For JSON files, use the original method
        const mergedFaculty = await facultyService.importFacultyFile(content);

        // Update state with merged faculty (preserves existing + adds new)
        setFaculty(mergedFaculty);

        const newCount = mergedFaculty.length;
        const addedCount = newCount - currentCount;

        // Parse original import data to get import count for feedback
        let importCount = 0;
        try {
          const importData = JSON.parse(content);
          importCount = Array.isArray(importData) ? importData.length : 0;
        } catch (e) {
          importCount = 0;
        }
        const updatedCount = Math.max(0, importCount - addedCount);

        let message = `✅ Import successful!\n`;
        if (addedCount > 0) {
          message += `���� Added: ${addedCount} new faculty\n`;
        }
        if (updatedCount > 0) {
          message += `🔄 Updated: ${updatedCount} existing faculty\n`;
        }
        message += `📊 Total faculty: ${newCount}`;

        alert(message);
      } catch (error) {
        console.error('Import error:', error);
        alert('Failed to import faculty. Please check the JSON format and try again.');
      }
    };
    reader.readAsText(file);

    // Reset file input
    event.target.value = '';
  };

  // Render faculty details view
  if (viewMode === "view" && selectedFaculty) {
    return (
      <div className="space-y-8">
        {/* Header with Back Button */}
        <div className="page-header flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleBackToList}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Faculty List
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Faculty Details - {selectedFaculty.personal_info?.full_name || 'N/A'}
              </h1>
              <p className="text-muted-foreground mt-2">
                Faculty information in form format
              </p>
            </div>
          </div>
          <Button onClick={() => handleEditFaculty(selectedFaculty)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Faculty
          </Button>
        </div>

        {/* Comprehensive Faculty Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Faculty ID</Label>
                  <div className="text-sm text-gray-900">{selectedFaculty.faculty_id}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Employee Number</Label>
                  <div className="text-sm text-gray-900">{selectedFaculty.employee_number}</div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Full Name</Label>
                <div className="text-sm text-gray-900">{selectedFaculty.personal_info?.full_name || 'N/A'}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Date of Birth</Label>
                  <div className="text-sm text-gray-900">{selectedFaculty.personal_info?.date_of_birth ? new Date(selectedFaculty.personal_info.date_of_birth).toLocaleDateString() : 'N/A'}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Gender</Label>
                  <div className="text-sm text-gray-900">{selectedFaculty.personal_info?.gender || 'N/A'}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Blood Group</Label>
                  <div className="text-sm text-gray-900">{selectedFaculty.personal_info?.blood_group || 'N/A'}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Marital Status</Label>
                  <div className="text-sm text-gray-900">{selectedFaculty.personal_info?.marital_status || 'N/A'}</div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Nationality</Label>
                <div className="text-sm text-gray-900">{selectedFaculty.personal_info?.nationality || 'N/A'}</div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Primary Email</Label>
                <div className="text-sm text-gray-900">{selectedFaculty.contact_info?.email || 'N/A'}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Alternate Email</Label>
                <div className="text-sm text-gray-900">{selectedFaculty.contact_info?.alternate_email || 'N/A'}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Phone Number</Label>
                  <div className="text-sm text-gray-900">{selectedFaculty.contact_info?.phone_number || 'N/A'}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Alternate Phone</Label>
                  <div className="text-sm text-gray-900">{selectedFaculty.contact_info?.alternate_phone_number || 'N/A'}</div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Present Address</Label>
                <div className="text-sm text-gray-900">
                  {selectedFaculty.contact_info?.present_address ?
                    `${selectedFaculty.contact_info.present_address.line || ''}, ${selectedFaculty.contact_info.present_address.city || ''}, ${selectedFaculty.contact_info.present_address.state || ''} - ${selectedFaculty.contact_info.present_address.zip_code || ''}`
                    : 'N/A'}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Emergency Contact</Label>
                <div className="text-sm text-gray-900">
                  {selectedFaculty.contact_info?.emergency_contact ?
                    `${selectedFaculty.contact_info.emergency_contact.name || 'N/A'} (${selectedFaculty.contact_info.emergency_contact.relationship || 'N/A'}) - ${selectedFaculty.contact_info.emergency_contact.contact_number || 'N/A'}`
                    : 'N/A'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Employment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Designation</Label>
                <div className="text-sm text-gray-900">{selectedFaculty.designation}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Department</Label>
                <div className="text-sm text-gray-900">{selectedFaculty.department}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Specialization</Label>
                <div className="text-sm text-gray-900">{selectedFaculty.specialization}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Employment Type</Label>
                  <div className="text-sm text-gray-900">{selectedFaculty.employment_type}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant={selectedFaculty.employment_status === 'Active' ? 'default' : 'secondary'}>
                    {selectedFaculty.employment_status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Joining Date</Label>
                  <div className="text-sm text-gray-900">{new Date(selectedFaculty.joining_date).toLocaleDateString()}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Experience</Label>
                  <div className="text-sm text-gray-900">{selectedFaculty.experience_years || 0} years</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Institution Code</Label>
                  <div className="text-sm text-gray-900">{selectedFaculty.institution_code || 'N/A'}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Institution Name</Label>
                  <div className="text-sm text-gray-900">{selectedFaculty.institution_name || 'N/A'}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Qualifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Educational Qualifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label className="text-sm font-medium">Highest Qualification</Label>
                <div className="text-sm text-gray-900 font-semibold">{selectedFaculty.qualification_info?.highest_qualification || 'N/A'}</div>
                <div className="text-sm text-gray-600">{selectedFaculty.qualification_info?.discipline || 'N/A'}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Undergraduate</Label>
                <div className="text-sm text-gray-900">{selectedFaculty.qualification_info?.ug_college || 'N/A'}</div>
                <div className="text-sm text-gray-600">Year: {selectedFaculty.qualification_info?.ug_year || 'N/A'}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Postgraduate</Label>
                <div className="text-sm text-gray-900">{selectedFaculty.qualification_info?.pg_college || 'N/A'}</div>
                <div className="text-sm text-gray-600">Year: {selectedFaculty.qualification_info?.pg_year || 'N/A'}</div>
              </div>
              {selectedFaculty.qualification_info?.phd_college && (
                <div className="md:col-span-3">
                  <Label className="text-sm font-medium">Ph.D.</Label>
                  <div className="text-sm text-gray-900">{selectedFaculty.qualification_info.phd_college}</div>
                  <div className="text-sm text-gray-600">Year: {selectedFaculty.qualification_info.phd_year || 'N/A'}</div>
                  <div className="text-sm text-gray-600 mt-1">Topic: {selectedFaculty.qualification_info.phd_topic || 'N/A'}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Professional Experience */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Professional Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(selectedFaculty.professional_experience || []).map((exp, index) => (
                <div key={index} className="border-l-2 border-blue-200 pl-4">
                  <div className="font-medium text-gray-900">{exp.designation}</div>
                  <div className="text-sm text-gray-600">{exp.institute}</div>
                  <div className="text-xs text-gray-500">{exp.from_year || 'N/A'} - {exp.to_year || 'N/A'}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bank Details & Documents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Bank Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Bank Name</Label>
                <div className="text-sm text-gray-900">{selectedFaculty.bank_details?.bank_name || 'N/A'}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Account Number</Label>
                <div className="text-sm text-gray-900">{selectedFaculty.bank_details?.account_number || 'N/A'}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">IFSC Code</Label>
                  <div className="text-sm text-gray-900">{selectedFaculty.bank_details?.ifsc_code || 'N/A'}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Branch</Label>
                  <div className="text-sm text-gray-900">{selectedFaculty.bank_details?.branch || 'N/A'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents & Login
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Aadhaar Number</Label>
                  <div className="text-sm text-gray-900">{selectedFaculty.documents?.aadhaar_number || 'N/A'}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">PAN Number</Label>
                  <div className="text-sm text-gray-900">{selectedFaculty.documents?.pan_number || 'N/A'}</div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Username</Label>
                <div className="text-sm text-gray-900">{selectedFaculty.login_account?.username || 'N/A'}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Role</Label>
                <Badge variant="outline">{selectedFaculty.login_account?.role || 'N/A'}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Render edit faculty form
  if (viewMode === "edit" && selectedFaculty && editFormData) {
    return (
      <div className="space-y-8">
        {/* Header with Back Button */}
        <div className="page-header flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleBackToList}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Faculty List
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Edit Faculty - {selectedFaculty.personal_info?.full_name || 'N/A'}
              </h1>
              <p className="text-muted-foreground mt-2">
                Update faculty member information
              </p>
            </div>
          </div>
        </div>

        {/* Edit Faculty Form */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="employment" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="employment">Employment</TabsTrigger>
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="qualification">Education</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="other">Other Details</TabsTrigger>
              </TabsList>

              <TabsContent value="employment" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_employee_number">Employee Number</Label>
                    <Input
                      id="edit_employee_number"
                      value={editFormData.employee_number}
                      onChange={(e) => setEditFormData({ ...editFormData, employee_number: e.target.value })}
                      placeholder="Enter employee number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_joining_date">Joining Date</Label>
                    <Input
                      id="edit_joining_date"
                      type="date"
                      value={editFormData.joining_date}
                      onChange={(e) => setEditFormData({ ...editFormData, joining_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_designation">Designation</Label>
                    <Select
                      value={editFormData.designation}
                      onValueChange={(value) => setEditFormData({ ...editFormData, designation: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select designation" />
                      </SelectTrigger>
                      <SelectContent>
                        {designations.map((designation) => (
                          <SelectItem key={designation} value={designation}>
                            {designation}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit_department">Department</Label>
                    <Select
                      value={editFormData.department}
                      onValueChange={(value) => setEditFormData({ ...editFormData, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_specialization">Specialization</Label>
                    <Input
                      id="edit_specialization"
                      value={editFormData.specialization}
                      onChange={(e) => setEditFormData({ ...editFormData, specialization: e.target.value })}
                      placeholder="Enter specialization"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_employment_type">Employment Type</Label>
                    <Select
                      value={editFormData.employment_type}
                      onValueChange={(value) => setEditFormData({ ...editFormData, employment_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        {employmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_experience_years">Experience Years</Label>
                    <Input
                      id="edit_experience_years"
                      type="number"
                      value={editFormData.experience_years || 0}
                      onChange={(e) => setEditFormData({ ...editFormData, experience_years: parseInt(e.target.value) || 0 })}
                      placeholder="Enter years of experience"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_employment_status">Employment Status</Label>
                    <Select
                      value={editFormData.employment_status}
                      onValueChange={(value) => setEditFormData({ ...editFormData, employment_status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {employmentStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_institution_code">Institution Code</Label>
                    <Select
                      value={editFormData.institution_code}
                      onValueChange={(value) => {
                        const selectedEntity = entities.find(e => e.code === value);
                        setEditFormData({
                          ...editFormData,
                          institution_code: value,
                          institution_name: selectedEntity?.name || ''
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select institution" />
                      </SelectTrigger>
                      <SelectContent>
                        {entities
                          .filter(entity => entity.code && entity.code.trim() !== '')
                          .map((entity) => (
                            <SelectItem key={entity.id} value={entity.code}>
                              {entity.code} - {entity.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit_institution_name">Institution Name</Label>
                    <Input
                      id="edit_institution_name"
                      value={editFormData.institution_name}
                      onChange={(e) => setEditFormData({ ...editFormData, institution_name: e.target.value })}
                      placeholder="Institution name (auto-filled)"
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="personal" className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="edit_first_name">First Name</Label>
                    <Input
                      id="edit_first_name"
                      value={editFormData.first_name}
                      onChange={(e) => setEditFormData({ ...editFormData, first_name: e.target.value })}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_middle_name">Middle Name</Label>
                    <Input
                      id="edit_middle_name"
                      value={editFormData.middle_name}
                      onChange={(e) => setEditFormData({ ...editFormData, middle_name: e.target.value })}
                      placeholder="Enter middle name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_last_name">Last Name</Label>
                    <Input
                      id="edit_last_name"
                      value={editFormData.last_name}
                      onChange={(e) => setEditFormData({ ...editFormData, last_name: e.target.value })}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_date_of_birth">Date of Birth</Label>
                    <Input
                      id="edit_date_of_birth"
                      type="date"
                      value={editFormData.date_of_birth}
                      onChange={(e) => setEditFormData({ ...editFormData, date_of_birth: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_gender">Gender</Label>
                    <Select
                      value={editFormData.gender}
                      onValueChange={(value) => setEditFormData({ ...editFormData, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {genders.map((gender) => (
                          <SelectItem key={gender} value={gender}>
                            {gender}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="edit_blood_group">Blood Group</Label>
                    <Select
                      value={editFormData.blood_group}
                      onValueChange={(value) => setEditFormData({ ...editFormData, blood_group: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodGroups.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit_nationality">Nationality</Label>
                    <Input
                      id="edit_nationality"
                      value={editFormData.nationality}
                      onChange={(e) => setEditFormData({ ...editFormData, nationality: e.target.value })}
                      placeholder="Enter nationality"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_marital_status">Marital Status</Label>
                    <Select
                      value={editFormData.marital_status}
                      onValueChange={(value) => setEditFormData({ ...editFormData, marital_status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select marital status" />
                      </SelectTrigger>
                      <SelectContent>
                        {maritalStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_email">Primary Email</Label>
                    <Input
                      id="edit_email"
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      placeholder="Enter primary email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_alternate_email">Alternate Email</Label>
                    <Input
                      id="edit_alternate_email"
                      type="email"
                      value={editFormData.alternate_email}
                      onChange={(e) => setEditFormData({ ...editFormData, alternate_email: e.target.value })}
                      placeholder="Enter alternate email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_phone_number">Phone Number</Label>
                    <Input
                      id="edit_phone_number"
                      value={editFormData.phone_number}
                      onChange={(e) => setEditFormData({ ...editFormData, phone_number: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_alternate_phone_number">Alternate Phone</Label>
                    <Input
                      id="edit_alternate_phone_number"
                      value={editFormData.alternate_phone_number}
                      onChange={(e) => setEditFormData({ ...editFormData, alternate_phone_number: e.target.value })}
                      placeholder="Enter alternate phone"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Present Address</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit_present_address_line">Address Line</Label>
                      <Input
                        id="edit_present_address_line"
                        value={editFormData.present_address_line}
                        onChange={(e) => setEditFormData({ ...editFormData, present_address_line: e.target.value })}
                        placeholder="Enter address line"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_present_address_city">City</Label>
                      <Input
                        id="edit_present_address_city"
                        value={editFormData.present_address_city}
                        onChange={(e) => setEditFormData({ ...editFormData, present_address_city: e.target.value })}
                        placeholder="Enter city"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="edit_present_address_state">State</Label>
                      <Input
                        id="edit_present_address_state"
                        value={editFormData.present_address_state}
                        onChange={(e) => setEditFormData({ ...editFormData, present_address_state: e.target.value })}
                        placeholder="Enter state"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_present_address_zip">ZIP Code</Label>
                      <Input
                        id="edit_present_address_zip"
                        value={editFormData.present_address_zip}
                        onChange={(e) => setEditFormData({ ...editFormData, present_address_zip: e.target.value })}
                        placeholder="Enter ZIP code"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_present_address_country">Country</Label>
                      <Input
                        id="edit_present_address_country"
                        value={editFormData.present_address_country}
                        onChange={(e) => setEditFormData({ ...editFormData, present_address_country: e.target.value })}
                        placeholder="Enter country"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Permanent Address</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit_permanent_address_line">Address Line</Label>
                      <Input
                        id="edit_permanent_address_line"
                        value={editFormData.permanent_address_line}
                        onChange={(e) => setEditFormData({ ...editFormData, permanent_address_line: e.target.value })}
                        placeholder="Enter address line"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_permanent_address_city">City</Label>
                      <Input
                        id="edit_permanent_address_city"
                        value={editFormData.permanent_address_city}
                        onChange={(e) => setEditFormData({ ...editFormData, permanent_address_city: e.target.value })}
                        placeholder="Enter city"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="edit_permanent_address_state">State</Label>
                      <Input
                        id="edit_permanent_address_state"
                        value={editFormData.permanent_address_state}
                        onChange={(e) => setEditFormData({ ...editFormData, permanent_address_state: e.target.value })}
                        placeholder="Enter state"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_permanent_address_zip">ZIP Code</Label>
                      <Input
                        id="edit_permanent_address_zip"
                        value={editFormData.permanent_address_zip}
                        onChange={(e) => setEditFormData({ ...editFormData, permanent_address_zip: e.target.value })}
                        placeholder="Enter ZIP code"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_permanent_address_country">Country</Label>
                      <Input
                        id="edit_permanent_address_country"
                        value={editFormData.permanent_address_country}
                        onChange={(e) => setEditFormData({ ...editFormData, permanent_address_country: e.target.value })}
                        placeholder="Enter country"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Emergency Contact</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="edit_emergency_contact_name">Contact Name</Label>
                      <Input
                        id="edit_emergency_contact_name"
                        value={editFormData.emergency_contact_name}
                        onChange={(e) => setEditFormData({ ...editFormData, emergency_contact_name: e.target.value })}
                        placeholder="Enter contact name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_emergency_contact_relationship">Relationship</Label>
                      <Input
                        id="edit_emergency_contact_relationship"
                        value={editFormData.emergency_contact_relationship}
                        onChange={(e) => setEditFormData({ ...editFormData, emergency_contact_relationship: e.target.value })}
                        placeholder="Enter relationship"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_emergency_contact_number">Contact Number</Label>
                      <Input
                        id="edit_emergency_contact_number"
                        value={editFormData.emergency_contact_number}
                        onChange={(e) => setEditFormData({ ...editFormData, emergency_contact_number: e.target.value })}
                        placeholder="Enter contact number"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="qualification" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_highest_qualification">Highest Qualification</Label>
                    <Select
                      value={editFormData.highest_qualification}
                      onValueChange={(value) => setEditFormData({ ...editFormData, highest_qualification: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select qualification" />
                      </SelectTrigger>
                      <SelectContent>
                        {qualifications.map((qual) => (
                          <SelectItem key={qual} value={qual}>
                            {qual}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit_discipline">Discipline</Label>
                    <Input
                      id="edit_discipline"
                      value={editFormData.discipline}
                      onChange={(e) => setEditFormData({ ...editFormData, discipline: e.target.value })}
                      placeholder="Enter discipline"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Undergraduate Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit_ug_college">UG College</Label>
                      <Input
                        id="edit_ug_college"
                        value={editFormData.ug_college}
                        onChange={(e) => setEditFormData({ ...editFormData, ug_college: e.target.value })}
                        placeholder="Enter UG college"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_ug_year">UG Year</Label>
                      <Input
                        id="edit_ug_year"
                        type="number"
                        value={editFormData.ug_year || 0}
                        onChange={(e) => setEditFormData({ ...editFormData, ug_year: parseInt(e.target.value) || 0 })}
                        placeholder="Enter UG year"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Postgraduate Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit_pg_college">PG College</Label>
                      <Input
                        id="edit_pg_college"
                        value={editFormData.pg_college}
                        onChange={(e) => setEditFormData({ ...editFormData, pg_college: e.target.value })}
                        placeholder="Enter PG college"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_pg_year">PG Year</Label>
                      <Input
                        id="edit_pg_year"
                        type="number"
                        value={editFormData.pg_year || 0}
                        onChange={(e) => setEditFormData({ ...editFormData, pg_year: parseInt(e.target.value) || 0 })}
                        placeholder="Enter PG year"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Ph.D. Details (Optional)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit_phd_college">Ph.D. College</Label>
                      <Input
                        id="edit_phd_college"
                        value={editFormData.phd_college}
                        onChange={(e) => setEditFormData({ ...editFormData, phd_college: e.target.value })}
                        placeholder="Enter Ph.D. college"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_phd_year">Ph.D. Year</Label>
                      <Input
                        id="edit_phd_year"
                        type="number"
                        value={editFormData.phd_year || 0}
                        onChange={(e) => setEditFormData({ ...editFormData, phd_year: parseInt(e.target.value) || 0 })}
                        placeholder="Enter Ph.D. year"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit_phd_topic">Ph.D. Topic</Label>
                    <Input
                      id="edit_phd_topic"
                      value={editFormData.phd_topic}
                      onChange={(e) => setEditFormData({ ...editFormData, phd_topic: e.target.value })}
                      placeholder="Enter Ph.D. topic"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="experience" className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Experience 1</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit_experience_institute_1">Institute</Label>
                      <Input
                        id="edit_experience_institute_1"
                        value={editFormData.experience_institute_1}
                        onChange={(e) => setEditFormData({ ...editFormData, experience_institute_1: e.target.value })}
                        placeholder="Enter institute name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_experience_designation_1">Designation</Label>
                      <Input
                        id="edit_experience_designation_1"
                        value={editFormData.experience_designation_1}
                        onChange={(e) => setEditFormData({ ...editFormData, experience_designation_1: e.target.value })}
                        placeholder="Enter designation"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit_experience_from_year_1">From Year</Label>
                      <Input
                        id="edit_experience_from_year_1"
                        type="number"
                        value={editFormData.experience_from_year_1 || 0}
                        onChange={(e) => setEditFormData({ ...editFormData, experience_from_year_1: parseInt(e.target.value) || 0 })}
                        placeholder="Enter from year"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_experience_to_year_1">To Year</Label>
                      <Input
                        id="edit_experience_to_year_1"
                        type="number"
                        value={editFormData.experience_to_year_1 || 0}
                        onChange={(e) => setEditFormData({ ...editFormData, experience_to_year_1: parseInt(e.target.value) || 0 })}
                        placeholder="Enter to year"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Experience 2 (Optional)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit_experience_institute_2">Institute</Label>
                      <Input
                        id="edit_experience_institute_2"
                        value={editFormData.experience_institute_2}
                        onChange={(e) => setEditFormData({ ...editFormData, experience_institute_2: e.target.value })}
                        placeholder="Enter institute name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_experience_designation_2">Designation</Label>
                      <Input
                        id="edit_experience_designation_2"
                        value={editFormData.experience_designation_2}
                        onChange={(e) => setEditFormData({ ...editFormData, experience_designation_2: e.target.value })}
                        placeholder="Enter designation"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit_experience_from_year_2">From Year</Label>
                      <Input
                        id="edit_experience_from_year_2"
                        type="number"
                        value={editFormData.experience_from_year_2 || 0}
                        onChange={(e) => setEditFormData({ ...editFormData, experience_from_year_2: parseInt(e.target.value) || 0 })}
                        placeholder="Enter from year"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_experience_to_year_2">To Year</Label>
                      <Input
                        id="edit_experience_to_year_2"
                        type="number"
                        value={editFormData.experience_to_year_2 || 0}
                        onChange={(e) => setEditFormData({ ...editFormData, experience_to_year_2: parseInt(e.target.value) || 0 })}
                        placeholder="Enter to year"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="other" className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Documents</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit_aadhaar_number">Aadhaar Number</Label>
                      <Input
                        id="edit_aadhaar_number"
                        value={editFormData.aadhaar_number}
                        onChange={(e) => setEditFormData({ ...editFormData, aadhaar_number: e.target.value })}
                        placeholder="Enter Aadhaar number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_pan_number">PAN Number</Label>
                      <Input
                        id="edit_pan_number"
                        value={editFormData.pan_number}
                        onChange={(e) => setEditFormData({ ...editFormData, pan_number: e.target.value })}
                        placeholder="Enter PAN number"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Bank Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit_bank_name">Bank Name</Label>
                      <Input
                        id="edit_bank_name"
                        value={editFormData.bank_name}
                        onChange={(e) => setEditFormData({ ...editFormData, bank_name: e.target.value })}
                        placeholder="Enter bank name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_branch">Branch</Label>
                      <Input
                        id="edit_branch"
                        value={editFormData.branch}
                        onChange={(e) => setEditFormData({ ...editFormData, branch: e.target.value })}
                        placeholder="Enter branch"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit_account_number">Account Number</Label>
                      <Input
                        id="edit_account_number"
                        value={editFormData.account_number}
                        onChange={(e) => setEditFormData({ ...editFormData, account_number: e.target.value })}
                        placeholder="Enter account number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_ifsc_code">IFSC Code</Label>
                      <Input
                        id="edit_ifsc_code"
                        value={editFormData.ifsc_code}
                        onChange={(e) => setEditFormData({ ...editFormData, ifsc_code: e.target.value })}
                        placeholder="Enter IFSC code"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Login Account</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit_username">Username</Label>
                      <Input
                        id="edit_username"
                        value={editFormData.username}
                        onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                        placeholder="Enter username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_password_plain">Password</Label>
                      <Input
                        id="edit_password_plain"
                        type="password"
                        value={editFormData.password_plain}
                        onChange={(e) => setEditFormData({ ...editFormData, password_plain: e.target.value })}
                        placeholder="Enter password"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4 mt-8">
              <Button variant="outline" onClick={() => setViewMode("view")}>
                Cancel
              </Button>
              <Button onClick={handleUpdateFaculty}>
                Update Faculty Member
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render add faculty form
  if (viewMode === "add") {
    return (
      <div className="space-y-8">
        {/* Header with Back Button */}
        <div className="page-header flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleBackToList}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Faculty List
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Add New Faculty Member
              </h1>
              <p className="text-muted-foreground mt-2">
                Enter complete information for the new faculty member
              </p>
            </div>
          </div>
        </div>

        {/* Add Faculty Form */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="employment" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="employment">Employment</TabsTrigger>
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="qualification">Education</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="other">Other Details</TabsTrigger>
              </TabsList>

              <TabsContent value="employment" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employee_number">Employee Number</Label>
                    <Input
                      id="employee_number"
                      value={formData.employee_number}
                      onChange={(e) => setFormData({ ...formData, employee_number: e.target.value })}
                      placeholder="Enter employee number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="joining_date">Joining Date</Label>
                    <Input
                      id="joining_date"
                      type="date"
                      value={formData.joining_date}
                      onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="designation">Designation</Label>
                    <Select
                      value={formData.designation}
                      onValueChange={(value) => setFormData({ ...formData, designation: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select designation" />
                      </SelectTrigger>
                      <SelectContent>
                        {designations.map((designation) => (
                          <SelectItem key={designation} value={designation}>
                            {designation}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      placeholder="Enter specialization"
                    />
                  </div>
                  <div>
                    <Label htmlFor="employment_type">Employment Type</Label>
                    <Select
                      value={formData.employment_type}
                      onValueChange={(value) => setFormData({ ...formData, employment_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        {employmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="experience_years">Experience Years</Label>
                    <Input
                      id="experience_years"
                      type="number"
                      value={formData.experience_years || 0}
                      onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
                      placeholder="Enter years of experience"
                    />
                  </div>
                  <div>
                    <Label htmlFor="employment_status">Employment Status</Label>
                    <Select
                      value={formData.employment_status}
                      onValueChange={(value) => setFormData({ ...formData, employment_status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {employmentStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="institution_code">Institution Code</Label>
                    <Select
                      value={formData.institution_code}
                      onValueChange={(value) => {
                        const selectedEntity = entities.find(e => e.code === value);
                        setFormData({
                          ...formData,
                          institution_code: value,
                          institution_name: selectedEntity?.name || ''
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select institution" />
                      </SelectTrigger>
                      <SelectContent>
                        {entities
                          .filter(entity => entity.code && entity.code.trim() !== '')
                          .map((entity) => (
                            <SelectItem key={entity.id} value={entity.code}>
                              {entity.code} - {entity.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="institution_name">Institution Name</Label>
                    <Input
                      id="institution_name"
                      value={formData.institution_name}
                      onChange={(e) => setFormData({ ...formData, institution_name: e.target.value })}
                      placeholder="Institution name (auto-filled)"
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="personal" className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="middle_name">Middle Name</Label>
                    <Input
                      id="middle_name"
                      value={formData.middle_name}
                      onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
                      placeholder="Enter middle name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {genders.map((gender) => (
                          <SelectItem key={gender} value={gender}>
                            {gender}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="blood_group">Blood Group</Label>
                    <Select
                      value={formData.blood_group}
                      onValueChange={(value) => setFormData({ ...formData, blood_group: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodGroups.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                      id="nationality"
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                      placeholder="Enter nationality"
                    />
                  </div>
                  <div>
                    <Label htmlFor="marital_status">Marital Status</Label>
                    <Select
                      value={formData.marital_status}
                      onValueChange={(value) => setFormData({ ...formData, marital_status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select marital status" />
                      </SelectTrigger>
                      <SelectContent>
                        {maritalStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Primary Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter primary email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="alternate_email">Alternate Email</Label>
                    <Input
                      id="alternate_email"
                      type="email"
                      value={formData.alternate_email}
                      onChange={(e) => setFormData({ ...formData, alternate_email: e.target.value })}
                      placeholder="Enter alternate email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input
                      id="phone_number"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="alternate_phone_number">Alternate Phone</Label>
                    <Input
                      id="alternate_phone_number"
                      value={formData.alternate_phone_number}
                      onChange={(e) => setFormData({ ...formData, alternate_phone_number: e.target.value })}
                      placeholder="Enter alternate phone"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Present Address</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="present_address_line">Address Line</Label>
                      <Input
                        id="present_address_line"
                        value={formData.present_address_line}
                        onChange={(e) => setFormData({ ...formData, present_address_line: e.target.value })}
                        placeholder="Enter address line"
                      />
                    </div>
                    <div>
                      <Label htmlFor="present_address_city">City</Label>
                      <Input
                        id="present_address_city"
                        value={formData.present_address_city}
                        onChange={(e) => setFormData({ ...formData, present_address_city: e.target.value })}
                        placeholder="Enter city"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="present_address_state">State</Label>
                      <Input
                        id="present_address_state"
                        value={formData.present_address_state}
                        onChange={(e) => setFormData({ ...formData, present_address_state: e.target.value })}
                        placeholder="Enter state"
                      />
                    </div>
                    <div>
                      <Label htmlFor="present_address_zip">ZIP Code</Label>
                      <Input
                        id="present_address_zip"
                        value={formData.present_address_zip}
                        onChange={(e) => setFormData({ ...formData, present_address_zip: e.target.value })}
                        placeholder="Enter ZIP code"
                      />
                    </div>
                    <div>
                      <Label htmlFor="present_address_country">Country</Label>
                      <Input
                        id="present_address_country"
                        value={formData.present_address_country}
                        onChange={(e) => setFormData({ ...formData, present_address_country: e.target.value })}
                        placeholder="Enter country"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Permanent Address</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="permanent_address_line">Address Line</Label>
                      <Input
                        id="permanent_address_line"
                        value={formData.permanent_address_line}
                        onChange={(e) => setFormData({ ...formData, permanent_address_line: e.target.value })}
                        placeholder="Enter address line"
                      />
                    </div>
                    <div>
                      <Label htmlFor="permanent_address_city">City</Label>
                      <Input
                        id="permanent_address_city"
                        value={formData.permanent_address_city}
                        onChange={(e) => setFormData({ ...formData, permanent_address_city: e.target.value })}
                        placeholder="Enter city"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="permanent_address_state">State</Label>
                      <Input
                        id="permanent_address_state"
                        value={formData.permanent_address_state}
                        onChange={(e) => setFormData({ ...formData, permanent_address_state: e.target.value })}
                        placeholder="Enter state"
                      />
                    </div>
                    <div>
                      <Label htmlFor="permanent_address_zip">ZIP Code</Label>
                      <Input
                        id="permanent_address_zip"
                        value={formData.permanent_address_zip}
                        onChange={(e) => setFormData({ ...formData, permanent_address_zip: e.target.value })}
                        placeholder="Enter ZIP code"
                      />
                    </div>
                    <div>
                      <Label htmlFor="permanent_address_country">Country</Label>
                      <Input
                        id="permanent_address_country"
                        value={formData.permanent_address_country}
                        onChange={(e) => setFormData({ ...formData, permanent_address_country: e.target.value })}
                        placeholder="Enter country"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Emergency Contact</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="emergency_contact_name">Contact Name</Label>
                      <Input
                        id="emergency_contact_name"
                        value={formData.emergency_contact_name}
                        onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                        placeholder="Enter contact name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergency_contact_relationship">Relationship</Label>
                      <Input
                        id="emergency_contact_relationship"
                        value={formData.emergency_contact_relationship}
                        onChange={(e) => setFormData({ ...formData, emergency_contact_relationship: e.target.value })}
                        placeholder="Enter relationship"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergency_contact_number">Contact Number</Label>
                      <Input
                        id="emergency_contact_number"
                        value={formData.emergency_contact_number}
                        onChange={(e) => setFormData({ ...formData, emergency_contact_number: e.target.value })}
                        placeholder="Enter contact number"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="qualification" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="highest_qualification">Highest Qualification</Label>
                    <Select
                      value={formData.highest_qualification}
                      onValueChange={(value) => setFormData({ ...formData, highest_qualification: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select qualification" />
                      </SelectTrigger>
                      <SelectContent>
                        {qualifications.map((qual) => (
                          <SelectItem key={qual} value={qual}>
                            {qual}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="discipline">Discipline</Label>
                    <Input
                      id="discipline"
                      value={formData.discipline}
                      onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                      placeholder="Enter discipline"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Undergraduate Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ug_college">UG College</Label>
                      <Input
                        id="ug_college"
                        value={formData.ug_college}
                        onChange={(e) => setFormData({ ...formData, ug_college: e.target.value })}
                        placeholder="Enter UG college"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ug_year">UG Year</Label>
                      <Input
                        id="ug_year"
                        type="number"
                        value={formData.ug_year || 0}
                        onChange={(e) => setFormData({ ...formData, ug_year: parseInt(e.target.value) || 0 })}
                        placeholder="Enter UG year"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Postgraduate Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pg_college">PG College</Label>
                      <Input
                        id="pg_college"
                        value={formData.pg_college}
                        onChange={(e) => setFormData({ ...formData, pg_college: e.target.value })}
                        placeholder="Enter PG college"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pg_year">PG Year</Label>
                      <Input
                        id="pg_year"
                        type="number"
                        value={formData.pg_year || 0}
                        onChange={(e) => setFormData({ ...formData, pg_year: parseInt(e.target.value) || 0 })}
                        placeholder="Enter PG year"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Ph.D. Details (Optional)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phd_college">Ph.D. College</Label>
                      <Input
                        id="phd_college"
                        value={formData.phd_college}
                        onChange={(e) => setFormData({ ...formData, phd_college: e.target.value })}
                        placeholder="Enter Ph.D. college"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phd_year">Ph.D. Year</Label>
                      <Input
                        id="phd_year"
                        type="number"
                        value={formData.phd_year || 0}
                        onChange={(e) => setFormData({ ...formData, phd_year: parseInt(e.target.value) || 0 })}
                        placeholder="Enter Ph.D. year"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phd_topic">Ph.D. Topic</Label>
                    <Input
                      id="phd_topic"
                      value={formData.phd_topic}
                      onChange={(e) => setFormData({ ...formData, phd_topic: e.target.value })}
                      placeholder="Enter Ph.D. topic"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="experience" className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Experience 1</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="experience_institute_1">Institute</Label>
                      <Input
                        id="experience_institute_1"
                        value={formData.experience_institute_1}
                        onChange={(e) => setFormData({ ...formData, experience_institute_1: e.target.value })}
                        placeholder="Enter institute name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience_designation_1">Designation</Label>
                      <Input
                        id="experience_designation_1"
                        value={formData.experience_designation_1}
                        onChange={(e) => setFormData({ ...formData, experience_designation_1: e.target.value })}
                        placeholder="Enter designation"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="experience_from_year_1">From Year</Label>
                      <Input
                        id="experience_from_year_1"
                        type="number"
                        value={formData.experience_from_year_1 || 0}
                        onChange={(e) => setFormData({ ...formData, experience_from_year_1: parseInt(e.target.value) || 0 })}
                        placeholder="Enter from year"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience_to_year_1">To Year</Label>
                      <Input
                        id="experience_to_year_1"
                        type="number"
                        value={formData.experience_to_year_1 || 0}
                        onChange={(e) => setFormData({ ...formData, experience_to_year_1: parseInt(e.target.value) || 0 })}
                        placeholder="Enter to year"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Experience 2 (Optional)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="experience_institute_2">Institute</Label>
                      <Input
                        id="experience_institute_2"
                        value={formData.experience_institute_2}
                        onChange={(e) => setFormData({ ...formData, experience_institute_2: e.target.value })}
                        placeholder="Enter institute name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience_designation_2">Designation</Label>
                      <Input
                        id="experience_designation_2"
                        value={formData.experience_designation_2}
                        onChange={(e) => setFormData({ ...formData, experience_designation_2: e.target.value })}
                        placeholder="Enter designation"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="experience_from_year_2">From Year</Label>
                      <Input
                        id="experience_from_year_2"
                        type="number"
                        value={formData.experience_from_year_2 || 0}
                        onChange={(e) => setFormData({ ...formData, experience_from_year_2: parseInt(e.target.value) || 0 })}
                        placeholder="Enter from year"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience_to_year_2">To Year</Label>
                      <Input
                        id="experience_to_year_2"
                        type="number"
                        value={formData.experience_to_year_2 || 0}
                        onChange={(e) => setFormData({ ...formData, experience_to_year_2: parseInt(e.target.value) || 0 })}
                        placeholder="Enter to year"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="other" className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Documents</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="aadhaar_number">Aadhaar Number</Label>
                      <Input
                        id="aadhaar_number"
                        value={formData.aadhaar_number}
                        onChange={(e) => setFormData({ ...formData, aadhaar_number: e.target.value })}
                        placeholder="Enter Aadhaar number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pan_number">PAN Number</Label>
                      <Input
                        id="pan_number"
                        value={formData.pan_number}
                        onChange={(e) => setFormData({ ...formData, pan_number: e.target.value })}
                        placeholder="Enter PAN number"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Bank Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bank_name">Bank Name</Label>
                      <Input
                        id="bank_name"
                        value={formData.bank_name}
                        onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                        placeholder="Enter bank name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="branch">Branch</Label>
                      <Input
                        id="branch"
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        placeholder="Enter branch"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="account_number">Account Number</Label>
                      <Input
                        id="account_number"
                        value={formData.account_number}
                        onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                        placeholder="Enter account number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ifsc_code">IFSC Code</Label>
                      <Input
                        id="ifsc_code"
                        value={formData.ifsc_code}
                        onChange={(e) => setFormData({ ...formData, ifsc_code: e.target.value })}
                        placeholder="Enter IFSC code"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Login Account</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="Enter username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password_plain">Password</Label>
                      <Input
                        id="password_plain"
                        type="password"
                        value={formData.password_plain}
                        onChange={(e) => setFormData({ ...formData, password_plain: e.target.value })}
                        placeholder="Enter password"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4 mt-8">
              <Button variant="outline" onClick={handleBackToList}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>
                Create Faculty Member
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Faculty Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage faculty members, their assignments, and academic information.
          </p>
        </div>
        <div className="flex gap-2">
          {/* Export with Format Selection */}
          <div className="flex items-center gap-2">
            <Button onClick={() => handleExport('json')} variant="outline" size="sm" disabled={faculty.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              JSON
            </Button>
            <Button onClick={() => handleExport('csv')} variant="outline" size="sm" disabled={faculty.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button onClick={() => handleExport('excel')} variant="outline" size="sm" disabled={faculty.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Excel
            </Button>
          </div>
          <Button className="btn-primary" onClick={openAddFacultyForm}>
            <Plus className="h-4 w-4 mr-2" />
            Add Faculty
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Faculty</p>
              <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              <p className="text-xs text-blue-600">
                {stats.active} active faculty
              </p>
            </div>
            <GraduationCap className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Departments</p>
              <p className="text-3xl font-bold text-green-900">
                {stats.departments}
              </p>
              <p className="text-xs text-green-600">Academic departments</p>
            </div>
            <BookOpen className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">PhD Holders</p>
              <p className="text-3xl font-bold text-purple-900">
                {stats.phdHolders}
              </p>
              <p className="text-xs text-purple-600">
                {Math.round((stats.phdHolders / stats.total) * 100)}% of faculty
              </p>
            </div>
            <Award className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="stat-card bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">
                Avg Experience
              </p>
              <p className="text-3xl font-bold text-orange-900">
                {stats.avgExperience}
              </p>
              <p className="text-xs text-orange-600">Years of experience</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      <Card className="section-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <GraduationCap className="h-5 w-5" />
            </div>
            Faculty Directory
          </CardTitle>
          <CardDescription>
            View and manage all faculty members and their academic assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search faculty members..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on leave">On Leave</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Import & Merge with Format Support */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="file"
                  accept=".json,.csv,.xlsx,.xls"
                  onChange={handleImportFaculty}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="json-import-faculty"
                />
                <Button variant="outline" asChild>
                  <label htmlFor="json-import-faculty" className="cursor-pointer flex items-center" title="Import and merge faculty with existing data (JSON, CSV, Excel)">
                    <FileText className="h-4 w-4 mr-2" />
                    Import & Merge
                  </label>
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadTemplate}
                className="text-gray-600 hover:text-gray-800"
              >
                <FileText className="h-4 w-4 mr-2" />
                Template
              </Button>
            </div>

            {/* Export with Format Selection */}
            <div className="flex items-center gap-2">
              <Button onClick={() => handleExport('json')} variant="outline" size="sm" disabled={faculty.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                JSON
              </Button>
              <Button onClick={() => handleExport('csv')} variant="outline" size="sm" disabled={faculty.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button onClick={() => handleExport('excel')} variant="outline" size="sm" disabled={faculty.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedFacultyIds.size > 0 && (
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-blue-700 font-medium">
                  {selectedFacultyIds.size} faculty member(s) selected
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFacultyIds(new Set())}
              >
                Clear Selection
              </Button>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all faculty"
                  />
                </TableHead>
                <TableHead>Faculty ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Qualification</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>DOB</TableHead>
                <TableHead>Institution</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedFaculty.map((member) => (
                <TableRow key={member.faculty_id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedFacultyIds.has(member.faculty_id)}
                      onCheckedChange={(checked) => handleSelectFaculty(member.faculty_id, checked as boolean)}
                      aria-label={`Select ${member.personal_info.full_name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {member.faculty_id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.documents?.photo} />
                        <AvatarFallback>
                          {member.personal_info?.first_name?.[0] || 'N'}
                          {member.personal_info?.last_name?.[0] || 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">
                        {member.personal_info?.full_name || 'N/A'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {member.qualification_info?.highest_qualification || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={member.personal_info?.gender === "Male" ? "default" : member.personal_info?.gender === "Female" ? "destructive" : "outline"}
                      className="text-xs"
                    >
                      {member.personal_info?.gender || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {member.personal_info?.date_of_birth ? new Date(member.personal_info.date_of_birth).toLocaleDateString('en-GB') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        {(member as any).institution_name || 'N/A'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Code: {(member as any).institution_code || 'N/A'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        <span className="truncate max-w-[150px]" title={member.contact_info?.email || 'N/A'}>
                          {member.contact_info?.email || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{member.contact_info?.phone_number || 'N/A'}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewFaculty(member)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditFaculty(member)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteClick(member)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {filteredFaculty.length > 0 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredFaculty.length)} of {filteredFaculty.length} faculty
                  {filteredFaculty.length !== faculty.length && (
                    <span className="text-gray-500"> (filtered from {faculty.length} total)</span>
                  )}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-700">Rows per page:</p>
                  <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                    <SelectTrigger className="h-8 w-16">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="text-muted-foreground">Loading faculty data...</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Faculty Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {facultyToDelete?.personal_info.full_name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Faculty Members</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedFacultyIds.size} faculty member(s).
              Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete} className="bg-red-600 hover:bg-red-700">
              Delete {selectedFacultyIds.size} Faculty Member(s)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
