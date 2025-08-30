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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Edit,
  Trash2,
  BookOpen,
  GraduationCap,
  UserCheck,
  AlertCircle,
  Eye,
  Download,
  ArrowLeft,
  User,
  MapPin,
  CreditCard,
  FileText,
  School,
  Building,
  Calendar,
  Award,
  CheckCircle,
  Clock,
  Home,
  Globe,
  Briefcase,
  HelpCircle,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { studentService, Student } from "@/services/studentServices";

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

// Program interface for program data
interface Program {
  id: string;
  name: string;
  code: string;
  level: string;
  type: string;
  department: string;
  duration: number;
  status: string;
}

// Form data interface for creating/editing students
interface StudentFormData {
  // Basic Info
  registration_number: string;
  admission_number: string;
  roll_number: string;
  status: string;
  date_of_admission: string;

  // Personal Info
  first_name: string;
  middle_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  blood_group: string;
  nationality: string;
  category: string;
  religion: string;

  // Contact Info
  email: string;
  phone_number: string;
  alternate_phone: string;
  address_line: string;
  address_city: string;
  address_state: string;
  address_zip_code: string;
  address_country: string;
  guardian_name: string;
  guardian_contact: string;

  // Academic Info
  institution: string;
  institution_code: string;
  educational_authority: string;
  program: string;
  year: number;
  semester: number;
  ncno: string;

  // Login credentials
  username: string;
  password_plain: string;
}

// Constants
const institutions = [
  "MIT",
  "Stanford", 
  "Harvard",
  "Caltech",
  "UC Berkeley",
  "Carnegie Mellon",
  "Princeton",
  "Yale",
  "Coimbatore Arts College"
];

const programs = [
  "Computer Science",
  "Electrical Engineering", 
  "Mathematics",
  "Physics",
  "Chemistry",
  "English Literature",
  "Commerce"
];

const educationalAuthorities = [
  "DOTE",
  "DOCE", 
  "ANNA UNIVERSITY",
  "BHARATHIAR UNIVERSITY"
];

const genders = ["Male", "Female", "Other"];
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const categories = ["General", "OBC", "SC", "ST", "EWS"];
const studentStatuses = ["Active", "Inactive", "Graduated", "Dropped"];

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [entitiesData, setEntitiesData] = useState<Entity[]>([]);
  const [programsData, setProgramsData] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [institutionFilter, setInstitutionFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "add" | "view" | "edit">("list");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editFormData, setEditFormData] = useState<StudentFormData | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Bulk selection state
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState<StudentFormData>({
    // Basic Info
    registration_number: "",
    admission_number: "",
    roll_number: "",
    status: "Active",
    date_of_admission: "",

    // Personal Info
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    blood_group: "",
    nationality: "Indian",
    category: "",
    religion: "",

    // Contact Info
    email: "",
    phone_number: "",
    alternate_phone: "",
    address_line: "",
    address_city: "",
    address_state: "",
    address_zip_code: "",
    address_country: "India",
    guardian_name: "",
    guardian_contact: "",

    // Academic Info
    institution: "",
    institution_code: "",
    educational_authority: "",
    program: "",
    year: 1,
    semester: 1,
    ncno: "",

    // Login credentials
    username: "",
    password_plain: "",
  });

  // Load student data from students.json on component mount
  useEffect(() => {
    loadStudentData();
    loadEntityData();
    loadProgramData();
  }, []);

  const loadEntityData = async () => {
    try {
      const response = await fetch('/entity.json');
      const entityData = await response.json();
      setEntitiesData(entityData);
    } catch (error) {
      console.error('Error loading entity data:', error);
    }
  };

  const loadProgramData = async () => {
    try {
      const response = await fetch('/program.json');
      const programData = await response.json();
      setProgramsData(programData);
    } catch (error) {
      console.error('Error loading program data:', error);
    }
  };

  const loadStudentData = async () => {
    try {
      setLoading(true);
      const studentData = await studentService.getAllStudents();
      setStudents(studentData);
      setSelectedStudents(new Set()); // Clear selections when data reloads
    } catch (error) {
      console.error('Error loading student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    // Safety check for required properties
    if (!student || !student.personal_info || !student.contact_info || !student.academic_info) {
      return false;
    }

    const matchesSearch =
      (student.personal_info.full_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (student.contact_info.email || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (student.roll_number || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.registration_number || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || (student.status || "").toLowerCase() === statusFilter;

    const matchesInstitution =
      institutionFilter === "all" || (student.academic_info.institution || "") === institutionFilter;

    const matchesProgram =
      programFilter === "all" || (student.academic_info.program || "") === programFilter;

    return matchesSearch && matchesStatus && matchesInstitution && matchesProgram;
  });

  const stats = {
    total: students?.length || 0,
    active: students?.filter((s) => s && s.status === "Active").length || 0,
    graduated: students?.filter((s) => s && s.status === "Graduated").length || 0,
    institutions: students?.length ? new Set(students.filter(s => s && s.academic_info).map((s) => s.academic_info.institution)).size : 0,
  };

  // Pagination logic with safety checks
  const totalPages = Math.max(1, Math.ceil((filteredStudents?.length || 0) / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = (filteredStudents || []).slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, institutionFilter, programFilter]);

  // Reset page when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // Bulk selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(paginatedStudents.map(s => s.student_id));
      setSelectedStudents(newSelected);
    } else {
      setSelectedStudents(new Set());
    }
  };

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    const newSelected = new Set(selectedStudents);
    if (checked) {
      newSelected.add(studentId);
    } else {
      newSelected.delete(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const isAllSelected = paginatedStudents.length > 0 && paginatedStudents.every(s => selectedStudents.has(s.student_id));
  const isIndeterminate = paginatedStudents.some(s => selectedStudents.has(s.student_id)) && !isAllSelected;

  const resetForm = () => {
    setFormData({
      registration_number: "",
      admission_number: "",
      roll_number: "",
      status: "Active",
      date_of_admission: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      date_of_birth: "",
      gender: "",
      blood_group: "",
      nationality: "Indian",
      category: "",
      religion: "",
      email: "",
      phone_number: "",
      alternate_phone: "",
      address_line: "",
      address_city: "",
      address_state: "",
      address_zip_code: "",
      address_country: "India",
      guardian_name: "",
      guardian_contact: "",
      institution: "",
      institution_code: "",
      educational_authority: "",
      program: "",
      year: 1,
      semester: 1,
      ncno: "",
      username: "",
      password_plain: "",
    });
  };

  const handleCreate = async () => {
    try {
      setLoading(true);

      const studentData = {
        registration_number: formData.registration_number,
        admission_number: formData.admission_number,
        roll_number: formData.roll_number,
        status: formData.status as "Active" | "Inactive" | "Graduated" | "Dropped",

        personal_info: {
          first_name: formData.first_name,
          middle_name: formData.middle_name,
          last_name: formData.last_name,
          full_name: `${formData.first_name} ${formData.middle_name} ${formData.last_name}`.trim(),
          date_of_birth: formData.date_of_birth,
          gender: formData.gender as "Male" | "Female" | "Other",
          blood_group: formData.blood_group,
          nationality: formData.nationality,
          category: formData.category,
          religion: formData.religion,
        },

        contact_info: {
          email: formData.email,
          phone_number: formData.phone_number,
          alternate_phone: formData.alternate_phone,
          address: {
            line: formData.address_line,
            city: formData.address_city,
            state: formData.address_state,
            zip_code: formData.address_zip_code,
            country: formData.address_country,
          },
          guardian_name: formData.guardian_name,
          guardian_contact: formData.guardian_contact,
        },

        academic_info: {
          institution: formData.institution,
          institution_code: formData.institution_code,
          educational_authority: formData.educational_authority,
          program: formData.program,
          year: formData.year,
          semester: formData.semester,
          ncno: formData.ncno,
          date_of_admission: formData.date_of_admission,
        },

        documents: {
          profile_photo: "",
          id_proof: "",
          marksheet_10: "",
          marksheet_12: "",
          transfer_certificate: "",
        },

        login_credentials: {
          username: formData.username,
          password_plain: formData.password_plain,
          otp_verified: false,
        },
      };

      await studentService.createStudent(studentData);
      await loadStudentData();
      setViewMode("list");
      resetForm();

      alert('Student created successfully! Data has been saved to students.json.');
    } catch (error) {
      console.error('Error creating student:', error);
      alert('Error creating student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;

    try {
      setLoading(true);
      await studentService.deleteStudent(studentToDelete.student_id);
      await loadStudentData();
      setIsDeleteDialogOpen(false);
      setStudentToDelete(null);

      alert('Student deleted successfully! Data has been updated in students.json.');
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Error deleting student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Bulk delete functionality
  const handleBulkDelete = () => {
    if (selectedStudents.size === 0) {
      alert('Please select at least one student to delete.');
      return;
    }
    setIsBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      setLoading(true);
      const studentsToDelete = Array.from(selectedStudents);

      // Delete each selected student
      for (const studentId of studentsToDelete) {
        await studentService.deleteStudent(studentId);
      }

      await loadStudentData();
      setSelectedStudents(new Set());
      setIsBulkDeleteDialogOpen(false);

      alert(`${studentsToDelete.length} student(s) deleted successfully! Data has been updated in students.json.`);
    } catch (error) {
      console.error('Error deleting students:', error);
      alert('Error deleting students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setViewMode("view");
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    const editData: StudentFormData = {
      registration_number: student.registration_number,
      admission_number: student.admission_number,
      roll_number: student.roll_number,
      status: student.status,
      date_of_admission: student.academic_info.date_of_admission,
      first_name: student.personal_info.first_name,
      middle_name: student.personal_info.middle_name,
      last_name: student.personal_info.last_name,
      date_of_birth: student.personal_info.date_of_birth,
      gender: student.personal_info.gender,
      blood_group: student.personal_info.blood_group,
      nationality: student.personal_info.nationality,
      category: student.personal_info.category,
      religion: student.personal_info.religion,
      email: student.contact_info.email,
      phone_number: student.contact_info.phone_number,
      alternate_phone: student.contact_info.alternate_phone,
      address_line: student.contact_info.address.line,
      address_city: student.contact_info.address.city,
      address_state: student.contact_info.address.state,
      address_zip_code: student.contact_info.address.zip_code,
      address_country: student.contact_info.address.country,
      guardian_name: student.contact_info.guardian_name,
      guardian_contact: student.contact_info.guardian_contact,
      institution: student.academic_info.institution,
      institution_code: student.academic_info.institution_code,
      educational_authority: student.academic_info.educational_authority,
      program: student.academic_info.program,
      year: student.academic_info.year,
      semester: student.academic_info.semester,
      ncno: student.academic_info.ncno,
      username: student.login_credentials.username,
      password_plain: student.login_credentials.password_plain,
    };
    setEditFormData(editData);
    setViewMode("edit");
  };

  const handleUpdateStudent = async () => {
    if (!selectedStudent || !editFormData) return;

    try {
      setLoading(true);

      const updatedStudentData = {
        registration_number: editFormData.registration_number,
        admission_number: editFormData.admission_number,
        roll_number: editFormData.roll_number,
        status: editFormData.status as "Active" | "Inactive" | "Graduated" | "Dropped",
        personal_info: {
          first_name: editFormData.first_name,
          middle_name: editFormData.middle_name,
          last_name: editFormData.last_name,
          full_name: `${editFormData.first_name} ${editFormData.middle_name} ${editFormData.last_name}`.trim(),
          date_of_birth: editFormData.date_of_birth,
          gender: editFormData.gender as "Male" | "Female" | "Other",
          blood_group: editFormData.blood_group,
          nationality: editFormData.nationality,
          category: editFormData.category,
          religion: editFormData.religion,
        },
        contact_info: {
          email: editFormData.email,
          phone_number: editFormData.phone_number,
          alternate_phone: editFormData.alternate_phone,
          address: {
            line: editFormData.address_line,
            city: editFormData.address_city,
            state: editFormData.address_state,
            zip_code: editFormData.address_zip_code,
            country: editFormData.address_country,
          },
          guardian_name: editFormData.guardian_name,
          guardian_contact: editFormData.guardian_contact,
        },
        academic_info: {
          institution: editFormData.institution,
          institution_code: editFormData.institution_code,
          educational_authority: editFormData.educational_authority,
          program: editFormData.program,
          year: editFormData.year,
          semester: editFormData.semester,
          ncno: editFormData.ncno,
          date_of_admission: editFormData.date_of_admission,
        },
        documents: {
          ...selectedStudent.documents,
        },
        login_credentials: {
          username: editFormData.username,
          password_plain: editFormData.password_plain,
          otp_verified: selectedStudent.login_credentials.otp_verified,
        },
      };

      await studentService.updateStudent(selectedStudent.student_id, updatedStudentData);
      await loadStudentData();
      setViewMode("list");
      setSelectedStudent(null);
      setEditFormData(null);

      alert('Student updated successfully! Data has been saved to students.json.');
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Error updating student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setViewMode("list");
    resetForm();
    setSelectedStudent(null);
    setEditFormData(null);
  };

  const openAddStudentForm = () => {
    resetForm();
    setViewMode("add");
  };

  // Enhanced export with format selection
  const handleExport = async (format: 'json' | 'csv' | 'excel') => {
    try {
      setLoading(true);
      await studentService.exportStudentFile(format);

      const formatName = format === 'excel' ? 'Excel' : format.toUpperCase();
      alert(`✅ Export successful! Student data exported as ${formatName} format.`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Download sample template
  const handleDownloadTemplate = () => {
    try {
      // Generate CSV template with correct flattened headers
      const templateHeaders = [
        'student_id',
        'registration_number',
        'admission_number',
        'roll_number',
        'status',
        'personal_info_first_name',
        'personal_info_middle_name',
        'personal_info_last_name',
        'personal_info_full_name',
        'personal_info_date_of_birth',
        'personal_info_gender',
        'personal_info_blood_group',
        'personal_info_nationality',
        'personal_info_category',
        'personal_info_religion',
        'contact_info_email',
        'contact_info_phone_number',
        'contact_info_alternate_phone',
        'contact_info_address_line',
        'contact_info_address_city',
        'contact_info_address_state',
        'contact_info_address_zip_code',
        'contact_info_address_country',
        'contact_info_guardian_name',
        'contact_info_guardian_contact',
        'academic_info_institution',
        'academic_info_institution_code',
        'academic_info_educational_authority',
        'academic_info_program',
        'academic_info_year',
        'academic_info_semester',
        'academic_info_ncno',
        'academic_info_date_of_admission',
        'login_credentials_username',
        'login_credentials_password_plain',
        'login_credentials_otp_verified'
      ];

      // Sample data rows with examples for Computer Engineering and ECE students
      const sampleRows = [
        [
          'STU2025001',
          '24101001',
          '24101001',
          '24101001',
          'Active',
          'John',
          'Kumar',
          'Doe',
          'John Kumar Doe',
          '2005-01-15',
          'Male',
          'O+',
          'Indian',
          'OC',
          'Hindu',
          'john.doe@gmail.com',
          '+91 9876543210',
          '+91 8765432109',
          '123, Main Street',
          'Chennai',
          'Tamil Nadu',
          '600001',
          'India',
          'Kumar Doe',
          '+91 9876543211',
          'CENTRAL POLYTECHNIC COLLEGE',
          '101',
          'DOTE',
          'COMPUTER ENGINEERING (FULL TIME)',
          '1',
          '1',
          '1001',
          '2025-07-15',
          'john.doe.25cs001',
          'John@2025',
          'false'
        ],
        [
          'STU2025002',
          '24101002',
          '24101002',
          '24101002',
          'Active',
          'Jane',
          'Priya',
          'Smith',
          'Jane Priya Smith',
          '2005-02-20',
          'Female',
          'A+',
          'Indian',
          'BC',
          'Hindu',
          'jane.smith@gmail.com',
          '+91 9876543212',
          '+91 8765432110',
          '456, Second Street',
          'Chennai',
          'Tamil Nadu',
          '600002',
          'India',
          'Priya Smith',
          '+91 9876543213',
          'SAKTHI POLYTECHNIC COLLEGE',
          '215',
          'DOTE',
          'ELECTRONICS AND COMMUNICATION ENGINEERING (FULL TIME)',
          '1',
          '1',
          '1002',
          '2025-07-15',
          'jane.smith.25ec001',
          'Jane@2025',
          'false'
        ]
      ];

      // Create CSV content
      const csvContent = [
        templateHeaders.map(h => `"${h}"`).join(','),
        ...sampleRows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', 'student_import_template.csv');
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('📄 Template downloaded! \n\nIncludes:\n• Correct flattened column headers\n• Sample data for Computer Engineering and ECE students\n• All required fields for import');
    } catch (error) {
      console.error('Error generating template:', error);
      alert('❌ Error generating template. Please try again.');
    }
  };

  // Download Excel template
  const handleDownloadExcelTemplate = async () => {
    try {
      setLoading(true);

      // Create sample data for template
      const templateData = [
        {
          student_id: 'STU2025001',
          registration_number: '24101001',
          admission_number: '24101001',
          roll_number: '24101001',
          status: 'Active',
          personal_info_first_name: 'John',
          personal_info_middle_name: 'Kumar',
          personal_info_last_name: 'Doe',
          personal_info_full_name: 'John Kumar Doe',
          personal_info_date_of_birth: '2005-01-15',
          personal_info_gender: 'Male',
          personal_info_blood_group: 'O+',
          personal_info_nationality: 'Indian',
          personal_info_category: 'OC',
          personal_info_religion: 'Hindu',
          contact_info_email: 'john.doe@gmail.com',
          contact_info_phone_number: '+91 9876543210',
          contact_info_alternate_phone: '+91 8765432109',
          contact_info_address_line: '123, Main Street',
          contact_info_address_city: 'Chennai',
          contact_info_address_state: 'Tamil Nadu',
          contact_info_address_zip_code: '600001',
          contact_info_address_country: 'India',
          contact_info_guardian_name: 'Kumar Doe',
          contact_info_guardian_contact: '+91 9876543211',
          academic_info_institution: 'CENTRAL POLYTECHNIC COLLEGE',
          academic_info_institution_code: '101',
          academic_info_educational_authority: 'DOTE',
          academic_info_program: 'COMPUTER ENGINEERING (FULL TIME)',
          academic_info_year: 1,
          academic_info_semester: 1,
          academic_info_ncno: '1001',
          academic_info_date_of_admission: '2025-07-15',
          login_credentials_username: 'john.doe.25cs001',
          login_credentials_password_plain: 'John@2025',
          login_credentials_otp_verified: false,
        },
        {
          student_id: 'STU2025002',
          registration_number: '24101002',
          admission_number: '24101002',
          roll_number: '24101002',
          status: 'Active',
          personal_info_first_name: 'Jane',
          personal_info_middle_name: 'Priya',
          personal_info_last_name: 'Smith',
          personal_info_full_name: 'Jane Priya Smith',
          personal_info_date_of_birth: '2005-02-20',
          personal_info_gender: 'Female',
          personal_info_blood_group: 'A+',
          personal_info_nationality: 'Indian',
          personal_info_category: 'BC',
          personal_info_religion: 'Hindu',
          contact_info_email: 'jane.smith@gmail.com',
          contact_info_phone_number: '+91 9876543212',
          contact_info_alternate_phone: '+91 8765432110',
          contact_info_address_line: '456, Second Street',
          contact_info_address_city: 'Chennai',
          contact_info_address_state: 'Tamil Nadu',
          contact_info_address_zip_code: '600002',
          contact_info_address_country: 'India',
          contact_info_guardian_name: 'Priya Smith',
          contact_info_guardian_contact: '+91 9876543213',
          academic_info_institution: 'SAKTHI POLYTECHNIC COLLEGE',
          academic_info_institution_code: '215',
          academic_info_educational_authority: 'DOTE',
          academic_info_program: 'ELECTRONICS AND COMMUNICATION ENGINEERING (FULL TIME)',
          academic_info_year: 1,
          academic_info_semester: 1,
          academic_info_ncno: '1002',
          academic_info_date_of_admission: '2025-07-15',
          login_credentials_username: 'jane.smith.25ec001',
          login_credentials_password_plain: 'Jane@2025',
          login_credentials_otp_verified: false,
        }
      ];

      // Dynamically import xlsx to create Excel file
      const XLSX = await import('xlsx');

      // Create worksheet from template data
      const worksheet = XLSX.utils.json_to_sheet(templateData);

      // Create workbook and add worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Import Template');

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `student_import_template_${timestamp}.xlsx`;

      // Write and download the file
      XLSX.writeFile(workbook, filename);

      alert('📄 Excel template downloaded! \n\nIncludes:\n• Correct flattened column headers\n• Sample data for Computer Engineering and ECE students\n• All required fields for import\n• Ready to use Excel format');
    } catch (error) {
      console.error('Error generating Excel template:', error);
      alert('❌ Error generating Excel template. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced import with support for both JSON and CSV/Excel files
  const handleImportStudents = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedExtensions = ['.json', '.csv', '.xlsx', '.xls'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

    if (!allowedExtensions.includes(fileExtension)) {
      alert(`❌ Unsupported file format: ${fileExtension}\nPlease use: ${allowedExtensions.join(', ')}`);
      event.target.value = '';
      return;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert(`❌ File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB\nMaximum allowed: 10MB`);
      event.target.value = '';
      return;
    }

    try {
      setLoading(true);
      const currentCount = students.length;

      console.log(`📥 Starting import: ${currentCount} existing students`);
      console.log(`📄 File: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`);

      // Use enhanced import method
      const result = await studentService.importStudentFile(file);

      // Update state with merged students
      setStudents(result.students);
      await loadStudentData(); // Refresh from server to ensure consistency

      const { added, updated, total } = result.summary;

      // Check for program distribution in imported data
      const programCheck = result.students.reduce((acc, student) => {
        const program = student.academic_info.program;
        acc[program] = (acc[program] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      let message = `✅ Import successful!\n\n`;
      message += `📄 File: ${file.name}\n`;
      message += `📊 Summary:\n`;
      if (added > 0) {
        message += `  🆕 Added: ${added} new students\n`;
      }
      if (updated > 0) {
        message += `  🔄 Updated: ${updated} existing students\n`;
      }
      message += `  📈 Total students: ${total}\n\n`;

      // Show program distribution if multiple programs
      const programs = Object.keys(programCheck);
      if (programs.length > 1) {
        message += `🎓 Program Distribution:\n`;
        Object.entries(programCheck).forEach(([program, count]) => {
          const shortProgram = program.includes('COMPUTER') ? 'Computer Engineering' :
                              program.includes('ELECTRONICS') ? 'Electronics & Communication' :
                              program.substring(0, 30) + '...';
          message += `  • ${shortProgram}: ${count} students\n`;
        });
        message += `\n`;
      }

      message += `💾 Data saved to students.json`;

      alert(message);
    } catch (error) {
      console.error('Import error:', error);
      let errorMessage = `❌ Import failed: ${error.message}\n\n`;

      if (fileExtension === '.json') {
        errorMessage += `💡 JSON files should contain an array of student objects with nested structure.`;
      } else {
        errorMessage += `💡 CSV/Excel files should have flattened column headers (e.g., personal_info_first_name).`;
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  // Render student details view with institutional profile design
  if (viewMode === "view" && selectedStudent) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Navigation */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={handleBackToList}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to List
              </Button>
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-900">{selectedStudent.academic_info.institution}</span> / <span className="text-gray-600">Student Profile</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Institution Header Card */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-0">
              {/* Header with Institution Branding */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="bg-white/10 p-4 rounded-full">
                      <Building className="h-12 w-12 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold">{selectedStudent.academic_info.institution}</h1>
                      <p className="text-blue-100 text-lg mt-1">Student Profile</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleEditStudent(selectedStudent)}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    variant="outline"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>

              {/* Student Information Section */}
              <div className="p-8">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                      <AvatarImage src={selectedStudent.documents.profile_photo} />
                      <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">
                        {selectedStudent.personal_info.first_name[0]}
                        {selectedStudent.personal_info.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedStudent.personal_info.full_name}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <span className="font-medium">ID: {selectedStudent.student_id}</span>
                        <span>•</span>
                        <span>Registration: {selectedStudent.registration_number}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={selectedStudent.status === 'Active' ? 'default' : 'secondary'}
                          className={selectedStudent.status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {selectedStudent.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Indicator Section */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                  <div className="flex items-center space-x-2">
                    <div className="bg-green-500 w-3 h-3 rounded-full"></div>
                    <span className="text-green-800 font-medium">Status</span>
                  </div>
                  <p className="text-green-700 mt-1">{selectedStudent.status}</p>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-600" />
                      Basic Information
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Institution Name</label>
                          <p className="text-gray-900 font-medium">{selectedStudent.academic_info.institution}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Code</label>
                          <p className="text-gray-900 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {selectedStudent.academic_info.institution_code}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Type</label>
                          <Badge variant="outline">{selectedStudent.personal_info.category}</Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Educational Authority</label>
                          <p className="text-gray-900">{selectedStudent.academic_info.educational_authority}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Description</label>
                        <p className="text-gray-700">
                          Student enrolled in {selectedStudent.academic_info.program} program with excellent academic record.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Program Type</label>
                          <p className="text-gray-900">{selectedStudent.academic_info.program}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Established Year</label>
                          <p className="text-gray-900">{new Date(selectedStudent.academic_info.date_of_admission).getFullYear()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Award className="h-5 w-5 mr-2 text-blue-600" />
                      Key Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">AFFILIATION/TN/009</label>
                        <p className="text-gray-900 font-medium">{selectedStudent.academic_info.ncno || 'Not Available'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Type</label>
                        <p className="text-gray-900">{selectedStudent.personal_info.category}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Current Date</label>
                        <p className="text-gray-900">{new Date().toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Last Updated</label>
                        <p className="text-gray-900">{selectedStudent.metadata?.updated_at ? new Date(selectedStudent.metadata.updated_at).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    Address Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Address Line 1</label>
                            <p className="text-gray-900">{selectedStudent.contact_info.address.line}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Address Line 2</label>
                            <p className="text-gray-900">{selectedStudent.contact_info.address.city}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">City</label>
                            <p className="text-gray-900">{selectedStudent.contact_info.address.city}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">District</label>
                            <p className="text-gray-900">{selectedStudent.contact_info.address.state}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">State</label>
                            <p className="text-gray-900">{selectedStudent.contact_info.address.state}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Pincode</label>
                            <p className="text-gray-900">{selectedStudent.contact_info.address.zip_code}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Contact */}
                <div className="mt-8 bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-blue-600" />
                    Quick Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-600 p-2 rounded-full">
                        <Phone className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-gray-900">{selectedStudent.contact_info.phone_number}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-600 p-2 rounded-full">
                        <Mail className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-blue-600">{selectedStudent.contact_info.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-600 p-2 rounded-full">
                        <Globe className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Guardian</p>
                        <p className="text-gray-900">{selectedStudent.contact_info.guardian_name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Render edit student form
  if (viewMode === "edit" && selectedStudent && editFormData) {
    return (
      <div className="space-y-8">
        {/* Header with Back Button */}
        <div className="page-header flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleBackToList}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Student List
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Edit Student - {selectedStudent.personal_info.full_name}
              </h1>
              <p className="text-muted-foreground mt-2">
                Update student information
              </p>
            </div>
          </div>
        </div>

        {/* Edit Student Form */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="credentials">Credentials</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_registration_number">Registration Number</Label>
                    <Input
                      id="edit_registration_number"
                      value={editFormData.registration_number}
                      onChange={(e) => setEditFormData({ ...editFormData, registration_number: e.target.value })}
                      placeholder="Enter registration number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_admission_number">Admission Number</Label>
                    <Input
                      id="edit_admission_number"
                      value={editFormData.admission_number}
                      onChange={(e) => setEditFormData({ ...editFormData, admission_number: e.target.value })}
                      placeholder="Enter admission number"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_roll_number">Roll Number</Label>
                    <Input
                      id="edit_roll_number"
                      value={editFormData.roll_number}
                      onChange={(e) => setEditFormData({ ...editFormData, roll_number: e.target.value })}
                      placeholder="Enter roll number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_status">Status</Label>
                    <Select
                      value={editFormData.status}
                      onValueChange={(value) => setEditFormData({ ...editFormData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {studentStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit_date_of_admission">Date of Admission</Label>
                  <Input
                    id="edit_date_of_admission"
                    type="date"
                    value={editFormData.date_of_admission}
                    onChange={(e) => setEditFormData({ ...editFormData, date_of_admission: e.target.value })}
                  />
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
                    <Label htmlFor="edit_category">Category</Label>
                    <Select
                      value={editFormData.category}
                      onValueChange={(value) => setEditFormData({ ...editFormData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit_religion">Religion</Label>
                    <Input
                      id="edit_religion"
                      value={editFormData.religion}
                      onChange={(e) => setEditFormData({ ...editFormData, religion: e.target.value })}
                      placeholder="Enter religion"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_email">Email Address</Label>
                    <Input
                      id="edit_email"
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_phone_number">Phone Number</Label>
                    <Input
                      id="edit_phone_number"
                      value={editFormData.phone_number}
                      onChange={(e) => setEditFormData({ ...editFormData, phone_number: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit_alternate_phone">Alternate Phone</Label>
                  <Input
                    id="edit_alternate_phone"
                    value={editFormData.alternate_phone}
                    onChange={(e) => setEditFormData({ ...editFormData, alternate_phone: e.target.value })}
                    placeholder="Enter alternate phone"
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Address Information</h4>
                  <div>
                    <Label htmlFor="edit_address_line">Address Line</Label>
                    <Input
                      id="edit_address_line"
                      value={editFormData.address_line}
                      onChange={(e) => setEditFormData({ ...editFormData, address_line: e.target.value })}
                      placeholder="Enter address line"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit_address_city">City</Label>
                      <Input
                        id="edit_address_city"
                        value={editFormData.address_city}
                        onChange={(e) => setEditFormData({ ...editFormData, address_city: e.target.value })}
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_address_state">State</Label>
                      <Input
                        id="edit_address_state"
                        value={editFormData.address_state}
                        onChange={(e) => setEditFormData({ ...editFormData, address_state: e.target.value })}
                        placeholder="Enter state"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit_address_zip_code">ZIP Code</Label>
                      <Input
                        id="edit_address_zip_code"
                        value={editFormData.address_zip_code}
                        onChange={(e) => setEditFormData({ ...editFormData, address_zip_code: e.target.value })}
                        placeholder="Enter ZIP code"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_address_country">Country</Label>
                      <Input
                        id="edit_address_country"
                        value={editFormData.address_country}
                        onChange={(e) => setEditFormData({ ...editFormData, address_country: e.target.value })}
                        placeholder="Enter country"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Guardian Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit_guardian_name">Guardian Name</Label>
                      <Input
                        id="edit_guardian_name"
                        value={editFormData.guardian_name}
                        onChange={(e) => setEditFormData({ ...editFormData, guardian_name: e.target.value })}
                        placeholder="Enter guardian name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_guardian_contact">Guardian Contact</Label>
                      <Input
                        id="edit_guardian_contact"
                        value={editFormData.guardian_contact}
                        onChange={(e) => setEditFormData({ ...editFormData, guardian_contact: e.target.value })}
                        placeholder="Enter guardian contact"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="academic" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_institution">Institution</Label>
                    <Select
                      value={editFormData.institution}
                      onValueChange={(value) => {
                        const institutionCode = value === 'MIT' ? 'MIT001' :
                                               value === 'Stanford' ? 'STF001' :
                                               value === 'Harvard' ? 'HRV001' :
                                               value === 'Caltech' ? 'CAL001' :
                                               value === 'UC Berkeley' ? 'UCB001' :
                                               value === 'Carnegie Mellon' ? 'CMU001' :
                                               value === 'Princeton' ? 'PRI001' :
                                               value === 'Yale' ? 'YAL001' :
                                               value === 'Coimbatore Arts College' ? 'CAC001' : 'UNK001';
                        setEditFormData({ ...editFormData, institution: value, institution_code: institutionCode });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select institution" />
                      </SelectTrigger>
                      <SelectContent>
                        {institutions.map((institution) => (
                          <SelectItem key={institution} value={institution}>
                            {institution}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit_institution_code">Institution Code</Label>
                    <Input
                      id="edit_institution_code"
                      value={editFormData.institution_code}
                      onChange={(e) => setEditFormData({ ...editFormData, institution_code: e.target.value })}
                      placeholder="Auto-generated"
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_educational_authority">Educational Authority</Label>
                    <Select
                      value={editFormData.educational_authority}
                      onValueChange={(value) => setEditFormData({ ...editFormData, educational_authority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select educational authority" />
                      </SelectTrigger>
                      <SelectContent>
                        {educationalAuthorities.map((authority) => (
                          <SelectItem key={authority} value={authority}>
                            {authority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit_program">Program</Label>
                    <Select
                      value={editFormData.program}
                      onValueChange={(value) => setEditFormData({ ...editFormData, program: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        {programs.map((program) => (
                          <SelectItem key={program} value={program}>
                            {program}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="edit_year">Year</Label>
                    <Input
                      id="edit_year"
                      type="number"
                      min="1"
                      max="4"
                      value={editFormData.year || 0}
                      onChange={(e) => setEditFormData({ ...editFormData, year: parseInt(e.target.value) || 1 })}
                      placeholder="Year"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_semester">Semester</Label>
                    <Input
                      id="edit_semester"
                      type="number"
                      min="1"
                      max="2"
                      value={editFormData.semester || 0}
                      onChange={(e) => setEditFormData({ ...editFormData, semester: parseInt(e.target.value) || 1 })}
                      placeholder="Semester"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_ncno">NCNO</Label>
                    <Input
                      id="edit_ncno"
                      value={editFormData.ncno}
                      onChange={(e) => setEditFormData({ ...editFormData, ncno: e.target.value })}
                      placeholder="Enter NCNO"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="credentials" className="space-y-6">
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
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4 mt-8">
              <Button variant="outline" onClick={handleBackToList}>
                Cancel
              </Button>
              <Button onClick={handleUpdateStudent} disabled={loading}>
                {loading ? 'Updating...' : 'Update Student'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render add student form
  if (viewMode === "add") {
    return (
      <div className="space-y-8">
        {/* Header with Back Button */}
        <div className="page-header flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleBackToList}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Student List
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Add New Student
              </h1>
              <p className="text-muted-foreground mt-2">
                Complete student registration form
              </p>
            </div>
          </div>
        </div>

        {/* Comprehensive Student Form */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="credentials">Credentials</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="registration_number">Registration Number</Label>
                    <Input
                      id="registration_number"
                      value={formData.registration_number}
                      onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                      placeholder="Enter registration number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="admission_number">Admission Number</Label>
                    <Input
                      id="admission_number"
                      value={formData.admission_number}
                      onChange={(e) => setFormData({ ...formData, admission_number: e.target.value })}
                      placeholder="Enter admission number"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="roll_number">Roll Number</Label>
                    <Input
                      id="roll_number"
                      value={formData.roll_number}
                      onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                      placeholder="Enter roll number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {studentStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="date_of_admission">Date of Admission</Label>
                  <Input
                    id="date_of_admission"
                    type="date"
                    value={formData.date_of_admission}
                    onChange={(e) => setFormData({ ...formData, date_of_admission: e.target.value })}
                  />
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
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="religion">Religion</Label>
                    <Input
                      id="religion"
                      value={formData.religion}
                      onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                      placeholder="Enter religion"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input
                      id="phone_number"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="alternate_phone">Alternate Phone</Label>
                  <Input
                    id="alternate_phone"
                    value={formData.alternate_phone}
                    onChange={(e) => setFormData({ ...formData, alternate_phone: e.target.value })}
                    placeholder="Enter alternate phone"
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Address Information</h4>
                  <div>
                    <Label htmlFor="address_line">Address Line</Label>
                    <Input
                      id="address_line"
                      value={formData.address_line}
                      onChange={(e) => setFormData({ ...formData, address_line: e.target.value })}
                      placeholder="Enter address line"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="address_city">City</Label>
                      <Input
                        id="address_city"
                        value={formData.address_city}
                        onChange={(e) => setFormData({ ...formData, address_city: e.target.value })}
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address_state">State</Label>
                      <Input
                        id="address_state"
                        value={formData.address_state}
                        onChange={(e) => setFormData({ ...formData, address_state: e.target.value })}
                        placeholder="Enter state"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="address_zip_code">ZIP Code</Label>
                      <Input
                        id="address_zip_code"
                        value={formData.address_zip_code}
                        onChange={(e) => setFormData({ ...formData, address_zip_code: e.target.value })}
                        placeholder="Enter ZIP code"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address_country">Country</Label>
                      <Input
                        id="address_country"
                        value={formData.address_country}
                        onChange={(e) => setFormData({ ...formData, address_country: e.target.value })}
                        placeholder="Enter country"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Guardian Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="guardian_name">Guardian Name</Label>
                      <Input
                        id="guardian_name"
                        value={formData.guardian_name}
                        onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
                        placeholder="Enter guardian name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="guardian_contact">Guardian Contact</Label>
                      <Input
                        id="guardian_contact"
                        value={formData.guardian_contact}
                        onChange={(e) => setFormData({ ...formData, guardian_contact: e.target.value })}
                        placeholder="Enter guardian contact"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="academic" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <SearchableSelect
                      label="Institution"
                      value={formData.institution}
                      onValueChange={(value) => {
                        const selectedEntity = entitiesData.find(e => e.name === value);
                        if (selectedEntity) {
                          setFormData({
                            ...formData,
                            institution: value,
                            institution_code: selectedEntity.code,
                            educational_authority: selectedEntity.educationalAuthority
                          });
                        } else {
                          setFormData({ ...formData, institution: value });
                        }
                      }}
                      placeholder="Search and select institution"
                      searchPlaceholder="Search institutions..."
                      emptyText="No institutions found"
                      loading={loading}
                      options={entitiesData
                        .filter(entity => entity && entity.name && entity.code && entity.code.trim() !== '')
                        .map(entity => ({
                          value: entity.name,
                          label: entity.name,
                          code: entity.code,
                          description: `${entity.educationalAuthority} | ${entity.city}, ${entity.state}`
                        }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="institution_code">Institution Code</Label>
                    <Input
                      id="institution_code"
                      value={formData.institution_code}
                      onChange={(e) => setFormData({ ...formData, institution_code: e.target.value })}
                      placeholder="Auto-filled from institution"
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="educational_authority">Educational Authority</Label>
                    <Input
                      id="educational_authority"
                      value={formData.educational_authority}
                      onChange={(e) => setFormData({ ...formData, educational_authority: e.target.value })}
                      placeholder="Auto-filled from institution"
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <SearchableSelect
                      label="Program"
                      value={formData.program}
                      onValueChange={(value) => setFormData({ ...formData, program: value })}
                      placeholder="Search and select program"
                      searchPlaceholder="Search programs..."
                      emptyText="No programs found"
                      loading={loading}
                      options={programsData
                        .filter(program => program && program.status === 'active' && program.name && program.level && program.department)
                        .map(program => ({
                          value: program.name,
                          label: program.name,
                          code: program.code,
                          description: `${program.level} | ${program.department} | Duration: ${program.duration} years`
                        }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      min="1"
                      max="4"
                      value={formData.year || 0}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 1 })}
                      placeholder="Year"
                    />
                  </div>
                  <div>
                    <Label htmlFor="semester">Semester</Label>
                    <Input
                      id="semester"
                      type="number"
                      min="1"
                      max="2"
                      value={formData.semester || 0}
                      onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) || 1 })}
                      placeholder="Semester"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ncno">NCNO</Label>
                    <Input
                      id="ncno"
                      value={formData.ncno}
                      onChange={(e) => setFormData({ ...formData, ncno: e.target.value })}
                      placeholder="Enter NCNO"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="credentials" className="space-y-6">
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
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4 mt-8">
              <Button variant="outline" onClick={handleBackToList}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={loading}>
                {loading ? 'Creating...' : 'Create Student'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render students list
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage student profiles and academic information
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Import & Merge with Format Support */}
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".json,.csv,.xlsx,.xls"
                onChange={handleImportStudents}
                className="hidden"
                id="import-students"
              />
              <label
                htmlFor="import-students"
                className="cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Import & Merge
              </label>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadTemplate}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  CSV Template
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadExcelTemplate}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Excel Template
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsHelpDialogOpen(true)}
                className="text-gray-500 hover:text-gray-700"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-xs text-gray-500">
              Supports: JSON (nested), CSV/Excel (flattened)
            </span>
          </div>

          {/* Export with Format Selection */}
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2">
              <Button onClick={() => handleExport('json')} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                JSON
              </Button>
              <Button onClick={() => handleExport('csv')} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button onClick={() => handleExport('excel')} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
            </div>
            <span className="text-xs text-gray-500">
              JSON preserves structure, CSV/Excel flattens data
            </span>
          </div>

          <Button onClick={openAddStudentForm}>
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isNaN(stats.total) ? 0 : stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Registered students
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isNaN(stats.active) ? 0 : stats.active}</div>
            <p className="text-xs text-muted-foreground">
              Currently enrolled
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Graduated</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isNaN(stats.graduated) ? 0 : stats.graduated}</div>
            <p className="text-xs text-muted-foreground">
              Completed studies
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Institutions</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isNaN(stats.institutions) ? 0 : stats.institutions}</div>
            <p className="text-xs text-muted-foreground">
              Different institutions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
          <CardDescription>
            Search and filter student records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                  <SelectItem value="dropped">Dropped</SelectItem>
                </SelectContent>
              </Select>
              <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Institution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Institutions</SelectItem>
                  {entitiesData
                    .filter(entity => entity && entity.name && entity.code && entity.code.trim() !== '')
                    .map((entity) => (
                      <SelectItem key={entity.id} value={entity.name}>
                        {entity.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Select value={programFilter} onValueChange={setProgramFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  {programsData
                    .filter(program => program && program.status === 'active' && program.name)
                    .map((program) => (
                      <SelectItem key={program.id} value={program.name}>
                        {program.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedStudents.size > 0 && (
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-blue-700 font-medium">
                  {selectedStudents.size} student(s) selected
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
                onClick={() => setSelectedStudents(new Set())}
              >
                Clear Selection
              </Button>
            </div>
          )}

          {/* Students Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all students"
                    />
                  </TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>ID & Registration</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Academic Info</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Loading students...
                    </TableCell>
                  </TableRow>
                ) : paginatedStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedStudents.map((student) => (
                    <TableRow key={student.student_id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedStudents.has(student.student_id)}
                          onCheckedChange={(checked) => handleSelectStudent(student.student_id, checked as boolean)}
                          aria-label={`Select ${student.personal_info.full_name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={student.documents.profile_photo} />
                            <AvatarFallback>
                              {student.personal_info.first_name[0]}
                              {student.personal_info.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{student.personal_info.full_name}</div>
                            <div className="text-sm text-gray-500">{student.roll_number}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{student.student_id}</div>
                          <div className="text-gray-500">{student.registration_number}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {student.contact_info.email}
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Phone className="h-3 w-3" />
                            {student.contact_info.phone_number}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{student.academic_info.institution}</div>
                          <div className="text-gray-500">
                            {student.academic_info.program} • Year {student.academic_info.year}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.status === "Active"
                              ? "default"
                              : student.status === "Graduated"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewStudent(student)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditStudent(student)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(student)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {filteredStudents.length > 0 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredStudents?.length || 0)} of {filteredStudents?.length || 0} students
                  {(filteredStudents?.length || 0) !== (students?.length || 0) && (
                    <span className="text-gray-500"> (filtered from {students?.length || 0} total)</span>
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
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the student
              record for {studentToDelete?.personal_info.full_name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Students</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedStudents.size} student record(s).
              Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete} className="bg-red-600 hover:bg-red-700">
              Delete {selectedStudents.size} Student(s)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Help Dialog for Import/Export Formats */}
      <Dialog open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Import & Export Format Guide
            </DialogTitle>
            <DialogDescription>
              Learn about the different file formats and data structures supported
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Import Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-700">���� Import & Merge</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* JSON Format */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">JSON Format (Nested Structure)</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="mb-2 text-gray-600">Preserves original nested data structure:</p>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`{
  "student_id": "STU2025001",
  "personal_info": {
    "first_name": "John",
    "last_name": "Doe",
    "full_name": "John Doe"
  },
  "contact_info": {
    "email": "john@example.com",
    "address": {
      "city": "Chennai",
      "state": "Tamil Nadu"
    }
  }
}`}
                    </pre>
                  </CardContent>
                </Card>

                {/* CSV/Excel Format */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">CSV/Excel Format (Flattened)</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="mb-2 text-gray-600">Flattened column structure:</p>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`student_id,personal_info_first_name,personal_info_last_name,contact_info_email,contact_info_address_city
STU2025001,John,Doe,john@example.com,Chennai`}
                    </pre>
                    <p className="mt-2 text-xs text-gray-500">
                      Nested fields use underscore notation (e.g., personal_info_first_name)
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Import Behavior:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <strong>Merge:</strong> Existing student records are updated, not replaced</li>
                  <li>• <strong>Add:</strong> New students with unique IDs are added</li>
                  <li>• <strong>Validate:</strong> File format and structure are validated before import</li>
                  <li>• <strong>Auto-Convert:</strong> CSV/Excel data is automatically converted to nested JSON structure</li>
                  <li>• <strong>Template:</strong> Download the CSV/Excel template to see the exact column format required</li>
                  <li>• <strong>Header Mapping:</strong> System automatically maps common header variations (e.g., "program" → "academic_info_program")</li>
                  <li>• <strong>Safe Merge:</strong> Empty import fields won't overwrite existing data</li>
                </ul>
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">🎓 Program Field Handling:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• <strong>Column Names:</strong> Use "academic_info_program", "program", or "course" in your Excel/CSV</li>
                  <li>• <strong>Examples:</strong> "COMPUTER ENGINEERING (FULL TIME)", "ELECTRONICS AND COMMUNICATION ENGINEERING (FULL TIME)"</li>
                  <li>• <strong>Validation:</strong> System warns if program field is missing or suspicious</li>
                  <li>• <strong>Preservation:</strong> Existing program data is preserved during import merges</li>
                </ul>
              </div>

              <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-800 mb-2">⚠️ Common Issues & Solutions:</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• <strong>Missing Programs:</strong> Ensure your Excel has "academic_info_program" or "program" column</li>
                  <li>• <strong>All Same Program:</strong> Check for column misalignment in your Excel file</li>
                  <li>• <strong>Empty Fields:</strong> Use templates to ensure all required fields are included</li>
                  <li>• <strong>File Format:</strong> Supports .xlsx, .xls, .csv, and .json files</li>
                  <li>• <strong>Character Encoding:</strong> CSV files should be UTF-8 encoded</li>
                </ul>
              </div>
            </div>

            {/* Export Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-blue-700">📤 Export</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">JSON Export</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="text-gray-600">Complete nested structure, perfect for backup and re-import</p>
                    <div className="mt-2 text-xs">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">✓ Full data</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded ml-1">✓ Preserves structure</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">CSV Export</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="text-gray-600">Flattened format, compatible with spreadsheet applications</p>
                    <div className="mt-2 text-xs">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">✓ Excel compatible</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded ml-1">✓ Flat structure</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Excel Export</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="text-gray-600">Native Excel format with proper formatting and data types</p>
                    <div className="mt-2 text-xs">
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">✓ Native Excel</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded ml-1">✓ Formatted</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Key Field Mappings */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-700">🔗 Key Field Mappings</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">JSON Structure →</h4>
                    <ul className="space-y-1 font-mono text-xs">
                      <li>personal_info.first_name</li>
                      <li>contact_info.email</li>
                      <li>academic_info.institution</li>
                      <li>contact_info.address.city</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">CSV/Excel Column Names</h4>
                    <ul className="space-y-1 font-mono text-xs">
                      <li>personal_info_first_name</li>
                      <li>contact_info_email</li>
                      <li>academic_info_institution</li>
                      <li>contact_info_address_city</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsHelpDialogOpen(false)}>
              Got it!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
