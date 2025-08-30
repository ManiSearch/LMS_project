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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/forms/FormField";
import { useFormHandler } from "@/hooks/useFormHandlers";
import {
  Award,
  Plus,
  Search,
  Edit,
  Eye,
  Download,
  DollarSign,
  Filter,
  FileText,
  Calendar,
  Trash2,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BookOpen,
  GraduationCap,
  IndianRupee,
  Star,
  Target,
  Upload,
  Shield,
  History,
  Phone,
  Mail,
  MapPin,
  Home,
  Building2,
  CreditCard,
} from "lucide-react";

// Role-based user contexts for demonstration
const userProfiles = {
  Student: {
    role: "Student",
    id: 1,
    name: "Raj Kumar",
    studentId: "STU2024001",
    childId: null,
    department: "Computer Science",
    program: "B.Tech CSE",
    semester: 3,
    academicYear: "2023-24",
    dob: "2002-05-15",
    gender: "Male",
    contact: "+91-9876543210",
    email: "raj.kumar@gmail.com",
    address: "123 Main Street, Chennai",
    permissions: [ "read"],
  },
  Admin: {
    role: "Admin",
    id: 2,
    name: "Dr. Manikandan S",
    studentId: null,
    childId: null,
    department: "Administration",
    program: null,
    semester: null,
    academicYear: "2023-24",
    dob: "1980-03-20",
    gender: "Male",
    contact: "+91-9876543200",
    email: "manikandan@gmail.com",
    address: "Admin Office, University Campus",
    permissions: ["create", "read", "update", "delete", "approve", "download"],
  },
  Faculty: {
    role: "Faculty",
    id: 3,
    name: "Prof. Sunita Sharma",
    studentId: null,
    childId: null,
    department: "Computer Science",
    program: null,
    semester: null,
    academicYear: "2023-24",
    dob: "1975-08-15",
    gender: "Female",
    contact: "+91-9876543201",
    email: "sunita.sharma@gmail.com",
    address: "Faculty Quarters, University Campus",
    permissions: ["read"],
  },
  Parent: {
    role: "Parent",
    id: 4,
    name: "Mrs. Priya Kumar",
    studentId: null,
    childId: "STU2024001", // Child's student ID
    department: null,
    program: null,
    semester: null,
    academicYear: "2023-24",
    dob: "1978-12-10",
    gender: "Female",
    contact: "+91-9876543202",
    email: "priya.kumar@gmail.com",
    address: "123 Main Street, Chennai",
    permissions: ["read"],
  },
};

// Role-based permissions matrix as per functional requirements
const permissions = {
  Admin: {
    viewAll: true,
    createScholarship: true,
    updateApproval: true,
    updateDisbursement: true,
    downloadApplications: true,
    trackByReference: true,
    viewPaymentStatus: true,
    manageSchemes: true,
    viewViolations: true,
    viewReapplications: true,
  },
  Faculty: {
    viewStudentStatus: true,
    validateAcademic: true,
    viewApplications: true, // Read-only if permitted
    trackByReference: true, // If permitted
    viewAll: false,
  },
  Student: {
    applyForScholarship: true,
    trackOwnApplication: true,
    viewOwnPaymentStatus: true,
    reapplyIfRejected: true,
    preventMultipleApplications: true,
    generateReferenceNumber: true,
    viewApplicationHistory: true,
  },
  Parent: {
    viewChildApplication: true,
    viewChildPaymentStatus: true,
    trackByReference: true, // Child only
  },
};

// hasPermission function will be defined inside the component

// Initial scholarship schemes data
const initialSchemes = [
  {
    id: 1,
    name: "Merit Scholarship",
    amount: 50000,
    type: "Merit Based",
    eligibility: "CGPA > 8.5, Family Income < 5 Lakh",
    deadline: "2024-03-15",
    status: "Active",
    maxApplications: 100,
    description: "For students with outstanding academic performance",
  },
  {
    id: 2,
    name: "SC/ST Scholarship",
    amount: 30000,
    type: "Reservation Based",
    eligibility: "SC/ST Category, Family Income < 8 Lakh",
    deadline: "2024-04-01",
    status: "Active",
    maxApplications: 200,
    description: "Government scholarship for SC/ST category students",
  },
  {
    id: 3,
    name: "Economic Weaker Section",
    amount: 25000,
    type: "Economic Based",
    eligibility: "Family Income < 3 Lakh, CGPA > 7.0",
    deadline: "2024-04-15",
    status: "Active",
    maxApplications: 150,
    description: "Financial assistance for economically weaker sections",
  },
  {
    id: 4,
    name: "Girl Child Education",
    amount: 35000,
    type: "Gender Based",
    eligibility: "Female Students, CGPA > 7.5",
    deadline: "2024-03-30",
    status: "Active",
    maxApplications: 80,
    description: "Promoting education for girl children",
  },
];

// Initial applications data
const initialApplications = [
  {
    id: 1,
    referenceNumber: "SCH2024001",
    studentId: "STU2024001",
    studentName: "Raj Kumar",
    schemeId: 1,
    schemeName: "Merit Scholarship",
    amount: 50000,
    applicationDate: "2024-01-15",
    submissionTime: "2024-01-15T09:30:00.000Z",
    status: "Approved",
    approvalDate: "2024-01-25",
    disbursementStatus: "Disbursed",
    disbursementDate: "2024-02-01",
    paymentMode: "Direct Bank Transfer",
    transactionId: "TXN1234567890",
    academicYear: "2023-24",
    semester: 3,
    program: "B.Tech CSE",
    cgpa: 8.8,
    attendancePercentage: 92,
    category: "General",
    familyIncome: 400000,
    personalDetails: {
      fullName: "Raj Kumar",
      dob: "2002-05-15",
      gender: "Male",
      phone: "+91-9876543210",
      email: "raj.kumar@gmail.com",
      address: "123 Main Street, Chennai",
      fatherName: "Mr. Suresh Kumar",
      motherName: "Mrs. Priya Kumar",
      fatherOccupation: "Private Employee",
      motherOccupation: "Teacher",
    },
    bankDetails: {
      accountHolderName: "Raj Kumar",
      accountNumber: "1234567890",
      ifscCode: "SBIN0001234",
      bankName: "State Bank of India",
      branch: "Chennai Main",
    },
    documents: ["Income Certificate", "Mark Sheet", "Caste Certificate"],
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-01-15T09:30:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Initial application submission",
      },
      {
        date: "2024-01-25T11:45:00.000Z",
        action: "Application Approved",
        status: "Approved",
        remarks:
          "Meets all eligibility criteria. Excellent academic performance.",
      },
      {
        date: "2024-02-01T15:20:00.000Z",
        action: "Payment Disbursed",
        status: "Disbursed",
        remarks: "Amount transferred to student bank account",
      },
    ],
  },
  {
    id: 2,
    referenceNumber: "SCH2024002",
    studentId: "STU2024002",
    studentName: "Priya",
    schemeId: 4,
    schemeName: "Girl Child Education",
    amount: 35000,
    applicationDate: "2024-01-20",
    submissionTime: "2024-01-20T16:45:00.000Z",
    status: "Under Review",
    approvalDate: null,
    disbursementStatus: "Pending",
    disbursementDate: null,
    paymentMode: null,
    academicYear: "2023-24",
    semester: 2,
    program: "B.Tech CSE",
    cgpa: 8.2,
    attendancePercentage: 89,
    category: "OBC",
    familyIncome: 350000,
    personalDetails: {
      fullName: "Priya Sharma",
      dob: "2003-08-22",
      gender: "Female",
      phone: "+91-9876543211",
      email: "priya.sharma@gmail.com",
      address: "456 Park Avenue, Mumbai",
      fatherName: "Mr. Ravi Sharma",
      motherName: "Mrs. Sunita Sharma",
      fatherOccupation: "Small Business Owner",
      motherOccupation: "Homemaker",
    },
    bankDetails: {
      accountHolderName: "Priya Sharma",
      accountNumber: "0987654321",
      ifscCode: "HDFC0001234",
      bankName: "HDFC Bank",
      branch: "Mumbai Central",
    },
    documents: ["Income Certificate", "Mark Sheet", "Caste Certificate"],
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-01-20T16:45:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks:
          "Initial application submission for Girl Child Education scholarship",
      },
    ],
  },
  {
    id: 3,
    referenceNumber: "SCH2024003",
    studentId: "STU2024003",
    studentName: "Kumar Raj",
    schemeId: 2,
    schemeName: "SC/ST Scholarship",
    amount: 30000,
    applicationDate: "2024-01-18",
    submissionTime: "2024-01-18T14:30:00.000Z",
    status: "Rejected",
    approvalDate: "2024-01-28",
    disbursementStatus: "Not Applicable",
    disbursementDate: null,
    paymentMode: null,
    academicYear: "2023-24",
    semester: 1,
    program: "B.Tech CSE",
    cgpa: 6.8,
    attendancePercentage: 78,
    category: "SC",
    familyIncome: 250000,
    personalDetails: {
      fullName: "Kumar Raj",
      dob: "2003-03-10",
      gender: "Male",
      phone: "+91-9876543212",
      email: "kumar.raj@gmail.com",
      address: "789 Gandhi Road, Delhi",
      fatherName: "Mr. Mohan Raj",
      motherName: "Mrs. Sita Raj",
      fatherOccupation: "Daily wage worker",
      motherOccupation: "Homemaker",
    },
    bankDetails: {
      accountHolderName: "Kumar Raj",
      accountNumber: "1122334455",
      ifscCode: "ICIC0001234",
      bankName: "ICICI Bank",
      branch: "Delhi Main",
    },
    documents: ["Income Certificate", "Mark Sheet", "Caste Certificate"],
    rejectionReason:
      "CGPA below minimum requirement (7.0 required for SC category)",
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-01-18T14:30:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Initial application submission",
      },
      {
        date: "2024-01-28T10:15:00.000Z",
        action: "Application Rejected",
        status: "Rejected",
        remarks:
          "CGPA below minimum requirement (7.0 required for SC category)",
      },
    ],
  },
  {
    id: 4,
    referenceNumber: "SCH2024004",
    studentId: "STU2024004",
    studentName: "Vignesh Kumar",
    schemeId: 2,
    schemeName: "SC/ST Scholarship",
    amount: 30000,
    applicationDate: "2024-01-20",
    submissionTime: "2024-01-20T11:00:00.000Z",
    status: "Rejected",
    approvalDate: "2024-01-30",
    disbursementStatus: "Not Applicable",
    disbursementDate: null,
    paymentMode: null,
    academicYear: "2023-24",
    semester: 2,
    program: "B.Tech ECE",
    cgpa: 6.5,
    attendancePercentage: 75,
    category: "SC",
    familyIncome: 240000,
    personalDetails: {
      fullName: "Vignesh Kumar",
      dob: "2003-04-14",
      gender: "Male",
      phone: "+91-9876543213",
      email: "vignesh.kumar@gmail.com",
      address: "456 Anna Salai, Chennai",
      fatherName: "Mr. Rajendran Kumar",
      motherName: "Mrs. Meena Kumar",
      fatherOccupation: "Farmer",
      motherOccupation: "Homemaker"
    },
    bankDetails: {
      accountHolderName: "Vignesh Kumar",
      accountNumber: "2233445566",
      ifscCode: "SBI0004321",
      bankName: "SBI",
      branch: "Chennai Main"
    },
    documents: ["Income Certificate", "Mark Sheet", "Caste Certificate"],
    rejectionReason: "CGPA below minimum requirement (7.0 required for SC category)",
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-01-20T11:00:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Initial submission"
      },
      {
        date: "2024-01-30T09:30:00.000Z",
        action: "Application Rejected",
        status: "Rejected",
        remarks: "CGPA below minimum requirement (7.0 required for SC category)"
      },
    ],
  },
  {
    id: 5,
    referenceNumber: "SCH2024005",
    studentId: "STU2024005",
    studentName: "Keerthana S",
    schemeId: 1,
    schemeName: "Merit-Based Scholarship",
    amount: 40000,
    applicationDate: "2024-01-22",
    submissionTime: "2024-01-22T10:00:00.000Z",
    status: "Approved",
    approvalDate: "2024-02-01",
    disbursementStatus: "Disbursed",
    disbursementDate: "2024-02-10",
    paymentMode: "Bank Transfer",
    academicYear: "2023-24",
    semester: 2,
    program: "B.Sc Mathematics",
    cgpa: 8.9,
    attendancePercentage: 92,
    category: "OBC",
    familyIncome: 180000,
    personalDetails: {
      fullName: "Keerthana S",
      dob: "2004-05-12",
      gender: "Female",
      phone: "+91-9876543214",
      email: "keerthana.s@gmail.com",
      address: "12 Bharathi Street, Madurai",
      fatherName: "Mr. Senthil Kumar",
      motherName: "Mrs. Latha Senthil",
      fatherOccupation: "School Teacher",
      motherOccupation: "Self-employed"
    },
    bankDetails: {
      accountHolderName: "Keerthana S",
      accountNumber: "3344556677",
      ifscCode: "HDFC0005678",
      bankName: "HDFC Bank",
      branch: "Madurai South"
    },
    documents: ["Income Certificate", "Mark Sheet", "Aadhar Card"],
    rejectionReason: null,
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-01-22T10:00:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Merit-based application"
      },
      {
        date: "2024-02-01T11:15:00.000Z",
        action: "Application Approved",
        status: "Approved",
        remarks: "Meets CGPA and attendance criteria"
      },
      {
        date: "2024-02-10T15:20:00.000Z",
        action: "Amount Disbursed",
        status: "Disbursed",
        remarks: "Transferred to student's bank account"
      }
    ]
  },
  {
    id: 6,
    referenceNumber: "SCH2024006",
    studentId: "STU2024006",
    studentName: "Dinesh R",
    schemeId: 3,
    schemeName: "First Graduate Scholarship",
    amount: 25000,
    applicationDate: "2024-01-25",
    submissionTime: "2024-01-25T09:30:00.000Z",
    status: "Approved",
    approvalDate: "2024-02-03",
    disbursementStatus: "Disbursed",
    disbursementDate: "2024-02-11",
    paymentMode: "Cheque",
    academicYear: "2023-24",
    semester: 1,
    program: "B.Com",
    cgpa: 7.5,
    attendancePercentage: 88,
    category: "BC",
    familyIncome: 200000,
    personalDetails: {
      fullName: "Dinesh R",
      dob: "2003-09-15",
      gender: "Male",
      phone: "+91-9876543215",
      email: "dinesh.r@gmail.com",
      address: "23 Kamarajar Road, Trichy",
      fatherName: "Mr. Ramasamy",
      motherName: "Mrs. Jayanthi",
      fatherOccupation: "Electrician",
      motherOccupation: "Housewife"
    },
    bankDetails: {
      accountHolderName: "Dinesh R",
      accountNumber: "4455667788",
      ifscCode: "INDB0006789",
      bankName: "IndusInd Bank",
      branch: "Trichy Central"
    },
    documents: ["First Graduate Certificate", "Income Certificate", "Mark Sheet"],
    rejectionReason: null,
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-01-25T09:30:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Verified first graduate eligibility"
      },
      {
        date: "2024-02-03T10:45:00.000Z",
        action: "Application Approved",
        status: "Approved",
        remarks: "All criteria met"
      },
      {
        date: "2024-02-11T12:20:00.000Z",
        action: "Amount Disbursed",
        status: "Disbursed",
        remarks: "Cheque issued and delivered"
      }
    ]
  },
  {
    id: 7,
    referenceNumber: "SCH2024007",
    studentId: "STU2024007",
    studentName: "Anjali M",
    schemeId: 2,
    schemeName: "SC/ST Scholarship",
    amount: 30000,
    applicationDate: "2024-01-26",
    submissionTime: "2024-01-26T13:20:00.000Z",
    status: "Rejected",
    approvalDate: "2024-02-05",
    disbursementStatus: "Not Applicable",
    disbursementDate: null,
    paymentMode: null,
    academicYear: "2023-24",
    semester: 1,
    program: "B.Sc Computer Science",
    cgpa: 6.3,
    attendancePercentage: 72,
    category: "SC",
    familyIncome: 260000,
    personalDetails: {
      fullName: "Anjali M",
      dob: "2004-02-11",
      gender: "Female",
      phone: "+91-9876543216",
      email: "anjali.m@gmail.com",
      address: "5 Periyar Nagar, Salem",
      fatherName: "Mr. Mani",
      motherName: "Mrs. Lakshmi Mani",
      fatherOccupation: "Auto Driver",
      motherOccupation: "Tailor"
    },
    bankDetails: {
      accountHolderName: "Anjali M",
      accountNumber: "5566778899",
      ifscCode: "SBIN0011223",
      bankName: "State Bank of India",
      branch: "Salem Main"
    },
    documents: ["Income Certificate", "Caste Certificate", "Mark Sheet"],
    rejectionReason: "CGPA and attendance below minimum eligibility",
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-01-26T13:20:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "SC category application"
      },
      {
        date: "2024-02-05T14:00:00.000Z",
        action: "Application Rejected",
        status: "Rejected",
        remarks: "Did not meet CGPA or attendance requirement"
      }
    ]
  },
  {
    id: 8,
    referenceNumber: "SCH2024008",
    studentId: "STU2024008",
    studentName: "Surya Prakash",
    schemeId: 4,
    schemeName: "Minority Welfare Scholarship",
    amount: 35000,
    applicationDate: "2024-01-27",
    submissionTime: "2024-01-27T08:00:00.000Z",
    status: "Approved",
    approvalDate: "2024-02-07",
    disbursementStatus: "Disbursed",
    disbursementDate: "2024-02-15",
    paymentMode: "Bank Transfer",
    academicYear: "2023-24",
    semester: 3,
    program: "B.A English",
    cgpa: 8.2,
    attendancePercentage: 89,
    category: "Minority",
    familyIncome: 180000,
    personalDetails: {
      fullName: "Surya Prakash",
      dob: "2002-12-20",
      gender: "Male",
      phone: "+91-9876543217",
      email: "surya.prakash@gmail.com",
      address: "88 MG Road, Coimbatore",
      fatherName: "Mr. Prakash",
      motherName: "Mrs. Anuradha",
      fatherOccupation: "Sales Executive",
      motherOccupation: "Teacher"
    },
    bankDetails: {
      accountHolderName: "Surya Prakash",
      accountNumber: "6677889900",
      ifscCode: "KKBK0003210",
      bankName: "Kotak Bank",
      branch: "Coimbatore East"
    },
    documents: ["Minority Certificate", "Income Proof", "Mark Sheet"],
    rejectionReason: null,
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-01-27T08:00:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Minority community proof attached"
      },
      {
        date: "2024-02-07T09:30:00.000Z",
        action: "Application Approved",
        status: "Approved",
        remarks: "Approved with full eligibility"
      },
      {
        date: "2024-02-15T10:10:00.000Z",
        action: "Amount Disbursed",
        status: "Disbursed",
        remarks: "Transfer successful"
      }
    ]
  },
  {
    id: 9,
    referenceNumber: "SCH2024009",
    studentId: "STU2024009",
    studentName: "Revathi G",
    schemeId: 3,
    schemeName: "First Graduate Scholarship",
    amount: 25000,
    applicationDate: "2024-01-28",
    submissionTime: "2024-01-28T10:20:00.000Z",
    status: "Approved",
    approvalDate: "2024-02-08",
    disbursementStatus: "Disbursed",
    disbursementDate: "2024-02-16",
    paymentMode: "UPI",
    academicYear: "2023-24",
    semester: 2,
    program: "BBA",
    cgpa: 7.6,
    attendancePercentage: 90,
    category: "MBC",
    familyIncome: 210000,
    personalDetails: {
      fullName: "Revathi G",
      dob: "2004-04-12",
      gender: "Female",
      phone: "+91-9876543218",
      email: "revathi.g@gmail.com",
      address: "54 Gandhi Nagar, Madurai",
      fatherName: "Mr. Gopal",
      motherName: "Mrs. Selvi",
      fatherOccupation: "Shopkeeper",
      motherOccupation: "Housewife"
    },
    bankDetails: {
      accountHolderName: "Revathi G",
      accountNumber: "7788990011",
      ifscCode: "HDFC0004567",
      bankName: "HDFC Bank",
      branch: "Madurai West"
    },
    documents: ["First Graduate Certificate", "Income Certificate", "Mark Sheet"],
    rejectionReason: null,
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-01-28T10:20:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "All required documents attached"
      },
      {
        date: "2024-02-08T11:15:00.000Z",
        action: "Application Approved",
        status: "Approved",
        remarks: "Eligible and approved"
      },
      {
        date: "2024-02-16T14:45:00.000Z",
        action: "Amount Disbursed",
        status: "Disbursed",
        remarks: "UPI transfer successful"
      }
    ]
  },
  {
    id: 10,
    referenceNumber: "SCH2024010",
    studentId: "STU2024010",
    studentName: "Rajasekar M",
    schemeId: 1,
    schemeName: "Merit-Based Scholarship",
    amount: 40000,
    applicationDate: "2024-01-29",
    submissionTime: "2024-01-29T14:00:00.000Z",
    status: "Approved",
    approvalDate: "2024-02-09",
    disbursementStatus: "Disbursed",
    disbursementDate: "2024-02-17",
    paymentMode: "Bank Transfer",
    academicYear: "2023-24",
    semester: 2,
    program: "B.Sc Physics",
    cgpa: 9.2,
    attendancePercentage: 95,
    category: "OC",
    familyIncome: 180000,
    personalDetails: {
      fullName: "Rajasekar M",
      dob: "2003-06-25",
      gender: "Male",
      phone: "+91-9876543219",
      email: "rajasekar.m@gmail.com",
      address: "22 Nehru Street, Erode",
      fatherName: "Mr. Murugan",
      motherName: "Mrs. Gomathi",
      fatherOccupation: "Bank Clerk",
      motherOccupation: "Librarian"
    },
    bankDetails: {
      accountHolderName: "Rajasekar M",
      accountNumber: "8899001122",
      ifscCode: "YESB0001234",
      bankName: "Yes Bank",
      branch: "Erode Central"
    },
    documents: ["Mark Sheet", "Income Certificate", "ID Proof"],
    rejectionReason: null,
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-01-29T14:00:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "High CGPA verified"
      },
      {
        date: "2024-02-09T16:30:00.000Z",
        action: "Application Approved",
        status: "Approved",
        remarks: "Merit criteria met"
      },
      {
        date: "2024-02-17T11:00:00.000Z",
        action: "Amount Disbursed",
        status: "Disbursed",
        remarks: "Bank transfer completed"
      }
    ]
  },
  {
    id: 11,
    referenceNumber: "SCH2024011",
    studentId: "STU2024011",
    studentName: "Lavanya S",
    schemeId: 4,
    schemeName: "Minority Scholarship",
    amount: 28000,
    applicationDate: "2024-01-30",
    submissionTime: "2024-01-30T13:15:00.000Z",
    status: "Approved",
    approvalDate: "2024-02-10",
    disbursementStatus: "Disbursed",
    disbursementDate: "2024-02-18",
    paymentMode: "Bank Transfer",
    academicYear: "2023-24",
    semester: 2,
    program: "B.Com",
    cgpa: 8.0,
    attendancePercentage: 89,
    category: "BCM",
    familyIncome: 230000,
    personalDetails: {
      fullName: "Lavanya S",
      dob: "2004-07-09",
      gender: "Female",
      phone: "+91-9876543220",
      email: "lavanya.s@gmail.com",
      address: "10 Park Road, Tirunelveli",
      fatherName: "Mr. Selvam",
      motherName: "Mrs. Meena Selvam",
      fatherOccupation: "Electrician",
      motherOccupation: "Tailor"
    },
    bankDetails: {
      accountHolderName: "Lavanya S",
      accountNumber: "6677889900",
      ifscCode: "KKBK0000987",
      bankName: "Kotak Bank",
      branch: "Tirunelveli East"
    },
    documents: ["Community Certificate", "Mark Sheet", "Income Certificate"],
    rejectionReason: null,
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-01-30T13:15:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Minority status verified"
      },
      {
        date: "2024-02-10T10:45:00.000Z",
        action: "Application Approved",
        status: "Approved",
        remarks: "Eligible and approved"
      },
      {
        date: "2024-02-18T09:30:00.000Z",
        action: "Amount Disbursed",
        status: "Disbursed",
        remarks: "Fund transferred successfully"
      }
    ]
  },
  {
    id: 12,
    referenceNumber: "SCH2024012",
    studentId: "STU2024012",
    studentName: "Vinoth K",
    schemeId: 2,
    schemeName: "SC/ST Scholarship",
    amount: 32000,
    applicationDate: "2024-02-01",
    submissionTime: "2024-02-01T11:45:00.000Z",
    status: "Rejected",
    approvalDate: "2024-02-11",
    disbursementStatus: "Not Applicable",
    disbursementDate: null,
    paymentMode: null,
    academicYear: "2023-24",
    semester: 2,
    program: "Diploma in Mechanical",
    cgpa: 6.2,
    attendancePercentage: 75,
    category: "SC",
    familyIncome: 150000,
    personalDetails: {
      fullName: "Vinoth K",
      dob: "2003-05-18",
      gender: "Male",
      phone: "+91-9876543221",
      email: "vinoth.k@gmail.com",
      address: "76 North Street, Trichy",
      fatherName: "Mr. Kanagaraj",
      motherName: "Mrs. Malarvizhi",
      fatherOccupation: "Coolie",
      motherOccupation: "Homemaker"
    },
    bankDetails: {
      accountHolderName: "Vinoth K",
      accountNumber: "9988776655",
      ifscCode: "SBIN0004321",
      bankName: "State Bank of India",
      branch: "Trichy Fort"
    },
    documents: ["Caste Certificate", "Income Proof", "Mark Sheet"],
    rejectionReason: "CGPA below required threshold (7.0)",
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-02-01T11:45:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Low academic performance"
      },
      {
        date: "2024-02-11T15:10:00.000Z",
        action: "Application Rejected",
        status: "Rejected",
        remarks: "Does not meet academic eligibility"
      }
    ]
  },
  {
    id: 13,
    referenceNumber: "SCH2024013",
    studentId: "STU2024013",
    studentName: "Bhuvana R",
    schemeId: 5,
    schemeName: "Orphan/Single Parent Support",
    amount: 35000,
    applicationDate: "2024-02-03",
    submissionTime: "2024-02-03T09:10:00.000Z",
    status: "Approved",
    approvalDate: "2024-02-13",
    disbursementStatus: "Disbursed",
    disbursementDate: "2024-02-22",
    paymentMode: "UPI",
    academicYear: "2023-24",
    semester: 1,
    program: "BA History",
    cgpa: 7.4,
    attendancePercentage: 92,
    category: "SC",
    familyIncome: 100000,
    personalDetails: {
      fullName: "Bhuvana R",
      dob: "2004-01-08",
      gender: "Female",
      phone: "+91-9876543222",
      email: "bhuvana.r@gmail.com",
      address: "3 Anna Salai, Chennai",
      fatherName: null,
      motherName: "Mrs. Radha",
      fatherOccupation: null,
      motherOccupation: "Clerk"
    },
    bankDetails: {
      accountHolderName: "Bhuvana R",
      accountNumber: "5544332211",
      ifscCode: "INDB0005432",
      bankName: "IndusInd Bank",
      branch: "Chennai Mount"
    },
    documents: ["Death Certificate", "Income Certificate", "Academic Records"],
    rejectionReason: null,
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-02-03T09:10:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Single parent verified"
      },
      {
        date: "2024-02-13T12:50:00.000Z",
        action: "Application Approved",
        status: "Approved",
        remarks: "Support granted"
      },
      {
        date: "2024-02-22T08:15:00.000Z",
        action: "Amount Disbursed",
        status: "Disbursed",
        remarks: "Transferred via UPI"
      }
    ]
  },
  {
    id: 14,
    referenceNumber: "SCH2024014",
    studentId: "STU2024014",
    studentName: "Karthik A",
    schemeId: 1,
    schemeName: "Merit-Based Scholarship",
    amount: 45000,
    applicationDate: "2024-02-04",
    submissionTime: "2024-02-04T10:30:00.000Z",
    status: "Approved",
    approvalDate: "2024-02-14",
    disbursementStatus: "Disbursed",
    disbursementDate: "2024-02-20",
    paymentMode: "Bank Transfer",
    academicYear: "2023-24",
    semester: 4,
    program: "B.Tech ECE",
    cgpa: 9.4,
    attendancePercentage: 96,
    category: "OC",
    familyIncome: 200000,
    personalDetails: {
      fullName: "Karthik A",
      dob: "2003-09-14",
      gender: "Male",
      phone: "+91-9876543223",
      email: "karthik.a@gmail.com",
      address: "45 MG Road, Coimbatore",
      fatherName: "Mr. Arumugam",
      motherName: "Mrs. Pushpa",
      fatherOccupation: "Professor",
      motherOccupation: "Bank Officer"
    },
    bankDetails: {
      accountHolderName: "Karthik A",
      accountNumber: "1122443355",
      ifscCode: "ICIC0000987",
      bankName: "ICICI Bank",
      branch: "Coimbatore RS Puram"
    },
    documents: ["Mark Sheet", "Income Certificate"],
    rejectionReason: null,
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-02-04T10:30:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Strong academic record"
      },
      {
        date: "2024-02-14T12:00:00.000Z",
        action: "Application Approved",
        status: "Approved",
        remarks: "Top CGPA"
      },
      {
        date: "2024-02-20T10:00:00.000Z",
        action: "Amount Disbursed",
        status: "Disbursed",
        remarks: "Transferred to ICICI Bank"
      }
    ]
  },
  {
    id: 15,
    referenceNumber: "SCH2024015",
    studentId: "STU2024015",
    studentName: "Mahalakshmi P",
    schemeId: 3,
    schemeName: "First Graduate Scholarship",
    amount: 25000,
    applicationDate: "2024-02-05",
    submissionTime: "2024-02-05T11:20:00.000Z",
    status: "Approved",
    approvalDate: "2024-02-15",
    disbursementStatus: "Disbursed",
    disbursementDate: "2024-02-22",
    paymentMode: "UPI",
    academicYear: "2023-24",
    semester: 2,
    program: "B.Sc Chemistry",
    cgpa: 8.2,
    attendancePercentage: 91,
    category: "BC",
    familyIncome: 180000,
    personalDetails: {
      fullName: "Mahalakshmi P",
      dob: "2004-11-02",
      gender: "Female",
      phone: "+91-9876543224",
      email: "mahalakshmi.p@gmail.com",
      address: "76 Periyar Street, Thanjavur",
      fatherName: "Mr. Prabhakar",
      motherName: "Mrs. Sudha",
      fatherOccupation: "Tailor",
      motherOccupation: "Vegetable Vendor"
    },
    bankDetails: {
      accountHolderName: "Mahalakshmi P",
      accountNumber: "3344556677",
      ifscCode: "SBIN0005678",
      bankName: "State Bank of India",
      branch: "Thanjavur Town"
    },
    documents: ["FG Certificate", "Income Proof", "Mark Sheet"],
    rejectionReason: null,
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-02-05T11:20:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Eligible for first graduate"
      },
      {
        date: "2024-02-15T09:30:00.000Z",
        action: "Application Approved",
        status: "Approved",
        remarks: "Verified documents"
      },
      {
        date: "2024-02-22T10:10:00.000Z",
        action: "Amount Disbursed",
        status: "Disbursed",
        remarks: "UPI credited"
      }
    ]
  },
  {
    id: 16,
    referenceNumber: "SCH2024016",
    studentId: "STU2024016",
    studentName: "Arunmozhi D",
    schemeId: 4,
    schemeName: "Minority Scholarship",
    amount: 30000,
    applicationDate: "2024-02-06",
    submissionTime: "2024-02-06T13:00:00.000Z",
    status: "Rejected",
    approvalDate: "2024-02-16",
    disbursementStatus: "Not Applicable",
    disbursementDate: null,
    paymentMode: null,
    academicYear: "2023-24",
    semester: 1,
    program: "BBA",
    cgpa: 6.3,
    attendancePercentage: 79,
    category: "BCM",
    familyIncome: 230000,
    personalDetails: {
      fullName: "Arunmozhi D",
      dob: "2004-06-14",
      gender: "Female",
      phone: "+91-9876543225",
      email: "arunmozhi.d@gmail.com",
      address: "88 Gandhi Street, Tiruppur",
      fatherName: "Mr. Dinesh",
      motherName: "Mrs. Kavitha",
      fatherOccupation: "Plumber",
      motherOccupation: "Housewife"
    },
    bankDetails: {
      accountHolderName: "Arunmozhi D",
      accountNumber: "7766554433",
      ifscCode: "UTIB0003456",
      bankName: "Axis Bank",
      branch: "Tiruppur South"
    },
    documents: ["Community Certificate", "Income Certificate", "Mark Sheet"],
    rejectionReason: "CGPA below required threshold (7.0)",
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-02-06T13:00:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Academic verification in progress"
      },
      {
        date: "2024-02-16T11:40:00.000Z",
        action: "Application Rejected",
        status: "Rejected",
        remarks: "Insufficient academic performance"
      }
    ]
  },
  {
    id: 17,
    referenceNumber: "SCH2024017",
    studentId: "STU2024017",
    studentName: "Vignesh S",
    schemeId: 1,
    schemeName: "Merit-Based Scholarship",
    amount: 40000,
    applicationDate: "2024-02-07",
    submissionTime: "2024-02-07T09:00:00.000Z",
    status: "Approved",
    approvalDate: "2024-02-17",
    disbursementStatus: "Disbursed",
    disbursementDate: "2024-02-22",
    paymentMode: "Bank Transfer",
    academicYear: "2023-24",
    semester: 4,
    program: "B.Com",
    cgpa: 9.0,
    attendancePercentage: 95,
    category: "MBC",
    familyIncome: 210000,
    personalDetails: {
      fullName: "Vignesh S",
      dob: "2003-08-25",
      gender: "Male",
      phone: "+91-9876543226",
      email: "vignesh.s@gmail.com",
      address: "21 VOC Nagar, Salem",
      fatherName: "Mr. Senthil",
      motherName: "Mrs. Radha",
      fatherOccupation: "Weaver",
      motherOccupation: "Tailor"
    },
    bankDetails: {
      accountHolderName: "Vignesh S",
      accountNumber: "9988776655",
      ifscCode: "HDFC0005566",
      bankName: "HDFC Bank",
      branch: "Salem Bazaar"
    },
    documents: ["Mark Sheet", "Income Certificate"],
    rejectionReason: null,
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-02-07T09:00:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Merit-based eligibility"
      },
      {
        date: "2024-02-17T11:30:00.000Z",
        action: "Application Approved",
        status: "Approved",
        remarks: "Academic record validated"
      },
      {
        date: "2024-02-22T14:00:00.000Z",
        action: "Amount Disbursed",
        status: "Disbursed",
        remarks: "Transferred to HDFC Bank"
      }
    ]
  },
  {
    id: 18,
    referenceNumber: "SCH2024018",
    studentId: "STU2024018",
    studentName: "Sowmya R",
    schemeId: 2,
    schemeName: "SC/ST Scholarship",
    amount: 35000,
    applicationDate: "2024-02-08",
    submissionTime: "2024-02-08T12:10:00.000Z",
    status: "Approved",
    approvalDate: "2024-02-18",
    disbursementStatus: "Disbursed",
    disbursementDate: "2024-02-25",
    paymentMode: "Bank Transfer",
    academicYear: "2023-24",
    semester: 3,
    program: "B.Sc Maths",
    cgpa: 8.7,
    attendancePercentage: 90,
    category: "SC",
    familyIncome: 190000,
    personalDetails: {
      fullName: "Sowmya R",
      dob: "2004-04-12",
      gender: "Female",
      phone: "+91-9876543227",
      email: "sowmya.r@gmail.com",
      address: "33 Rajaji Road, Erode",
      fatherName: "Mr. Ramalingam",
      motherName: "Mrs. Lalitha",
      fatherOccupation: "Electrician",
      motherOccupation: "Homemaker"
    },
    bankDetails: {
      accountHolderName: "Sowmya R",
      accountNumber: "8877665544",
      ifscCode: "SBIN0012345",
      bankName: "State Bank of India",
      branch: "Erode Fort"
    },
    documents: ["Caste Certificate", "Income Proof", "Mark Sheet"],
    rejectionReason: null,
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-02-08T12:10:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "SC/ST category verified"
      },
      {
        date: "2024-02-18T13:00:00.000Z",
        action: "Application Approved",
        status: "Approved",
        remarks: "All documents validated"
      },
      {
        date: "2024-02-25T09:40:00.000Z",
        action: "Amount Disbursed",
        status: "Disbursed",
        remarks: "SBI transfer successful"
      }
    ]
  },
  {
    id: 19,
    referenceNumber: "SCH2024019",
    studentId: "STU2024019",
    studentName: "Jeeva M",
    schemeId: 3,
    schemeName: "First Graduate Scholarship",
    amount: 25000,
    applicationDate: "2024-02-09",
    submissionTime: "2024-02-09T10:45:00.000Z",
    status: "Rejected",
    approvalDate: "2024-02-19",
    disbursementStatus: "Not Applicable",
    disbursementDate: null,
    paymentMode: null,
    academicYear: "2023-24",
    semester: 1,
    program: "B.A English",
    cgpa: 6.5,
    attendancePercentage: 81,
    category: "BC",
    familyIncome: 220000,
    personalDetails: {
      fullName: "Jeeva M",
      dob: "2004-07-19",
      gender: "Male",
      phone: "+91-9876543228",
      email: "jeeva.m@gmail.com",
      address: "100 North Street, Vellore",
      fatherName: "Mr. Murugan",
      motherName: "Mrs. Geetha",
      fatherOccupation: "Driver",
      motherOccupation: "Housemaid"
    },
    bankDetails: {
      accountHolderName: "Jeeva M",
      accountNumber: "6655443322",
      ifscCode: "KARB0008765",
      bankName: "Karnataka Bank",
      branch: "Vellore Market"
    },
    documents: ["FG Certificate", "Mark Sheet", "Income Proof"],
    rejectionReason: "CGPA does not meet minimum requirement (7.0)",
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-02-09T10:45:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Awaiting academic validation"
      },
      {
        date: "2024-02-19T15:00:00.000Z",
        action: "Application Rejected",
        status: "Rejected",
        remarks: "Below CGPA threshold"
      }
    ]
  },
  {
    id: 20,
    referenceNumber: "SCH2024020",
    studentId: "STU2024020",
    studentName: "Meena A",
    schemeId: 1,
    schemeName: "Merit-Based Scholarship",
    amount: 45000,
    applicationDate: "2024-02-10",
    submissionTime: "2024-02-10T11:20:00.000Z",
    status: "Approved",
    approvalDate: "2024-02-20",
    disbursementStatus: "Disbursed",
    disbursementDate: "2024-02-26",
    paymentMode: "Bank Transfer",
    academicYear: "2023-24",
    semester: 6,
    program: "B.Tech ECE",
    cgpa: 9.4,
    attendancePercentage: 96,
    category: "General",
    familyIncome: 320000,
    personalDetails: {
      fullName: "Meena A",
      dob: "2002-09-15",
      gender: "Female",
      phone: "+91-9876543229",
      email: "meena.a@gmail.com",
      address: "12 Anna Nagar, Tirunelveli",
      fatherName: "Mr. Arumugam",
      motherName: "Mrs. Kamala",
      fatherOccupation: "Farmer",
      motherOccupation: "Homemaker"
    },
    bankDetails: {
      accountHolderName: "Meena A",
      accountNumber: "5544332211",
      ifscCode: "UBIN0555555",
      bankName: "Union Bank of India",
      branch: "Tirunelveli Central"
    },
    documents: ["Mark Sheet", "Income Certificate"],
    rejectionReason: null,
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-02-10T11:20:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "High academic performance"
      },
      {
        date: "2024-02-20T13:45:00.000Z",
        action: "Application Approved",
        status: "Approved",
        remarks: "Verified and eligible"
      },
      {
        date: "2024-02-26T10:30:00.000Z",
        action: "Amount Disbursed",
        status: "Disbursed",
        remarks: "Funds sent to Union Bank"
      }
    ]
  },
  {
    id: 21,
    referenceNumber: "SCH2024021",
    studentId: "STU2024021",
    studentName: "Ragul D",
    schemeId: 2,
    schemeName: "SC/ST Scholarship",
    amount: 32000,
    applicationDate: "2024-02-11",
    submissionTime: "2024-02-11T10:15:00.000Z",
    status: "Approved",
    approvalDate: "2024-02-21",
    disbursementStatus: "Disbursed",
    disbursementDate: "2024-02-27",
    paymentMode: "Bank Transfer",
    academicYear: "2023-24",
    semester: 2,
    program: "B.Sc Physics",
    cgpa: 8.5,
    attendancePercentage: 88,
    category: "SC",
    familyIncome: 200000,
    personalDetails: {
      fullName: "Ragul D",
      dob: "2004-06-01",
      gender: "Male",
      phone: "+91-9876543230",
      email: "ragul.d@gmail.com",
      address: "45 Gandhi Nagar, Dindigul",
      fatherName: "Mr. Dinesh",
      motherName: "Mrs. Latha",
      fatherOccupation: "Electrician",
      motherOccupation: "Cook"
    },
    bankDetails: {
      accountHolderName: "Ragul D",
      accountNumber: "4433221100",
      ifscCode: "IOBA0004321",
      bankName: "Indian Overseas Bank",
      branch: "Dindigul Town"
    },
    documents: ["Caste Certificate", "Income Certificate", "Mark Sheet"],
    rejectionReason: null,
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-02-11T10:15:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Eligible under SC category"
      },
      {
        date: "2024-02-21T12:00:00.000Z",
        action: "Application Approved",
        status: "Approved",
        remarks: "Documentation complete"
      },
      {
        date: "2024-02-27T14:10:00.000Z",
        action: "Amount Disbursed",
        status: "Disbursed",
        remarks: "Transferred to IOB"
      }
    ]
  },
  {
    id: 22,
    referenceNumber: "SCH2024022",
    studentId: "STU2024022",
    studentName: "Divya P",
    schemeId: 3,
    schemeName: "First Graduate Scholarship",
    amount: 27000,
    applicationDate: "2024-02-12",
    submissionTime: "2024-02-12T08:30:00.000Z",
    status: "Rejected",
    approvalDate: "2024-02-22",
    disbursementStatus: "Not Applicable",
    disbursementDate: null,
    paymentMode: null,
    academicYear: "2023-24",
    semester: 5,
    program: "B.Com",
    cgpa: 6.2,
    attendancePercentage: 74,
    category: "BC",
    familyIncome: 210000,
    personalDetails: {
      fullName: "Divya P",
      dob: "2003-12-20",
      gender: "Female",
      phone: "+91-9876543231",
      email: "divya.p@gmail.com",
      address: "14 Bharathi Street, Karur",
      fatherName: "Mr. Prabhu",
      motherName: "Mrs. Shanthi",
      fatherOccupation: "Welder",
      motherOccupation: "Tailor"
    },
    bankDetails: {
      accountHolderName: "Divya P",
      accountNumber: "3344112200",
      ifscCode: "IDIB0000987",
      bankName: "Indian Bank",
      branch: "Karur Main"
    },
    documents: ["Income Proof", "Mark Sheet"],
    rejectionReason: "Low CGPA and attendance below threshold",
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-02-12T08:30:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Awaiting academic verification"
      },
      {
        date: "2024-02-22T10:45:00.000Z",
        action: "Application Rejected",
        status: "Rejected",
        remarks: "Academic criteria not met"
      }
    ]
  },
  {
    id: 23,
    referenceNumber: "SCH2024023",
    studentId: "STU2024023",
    studentName: "Nandhini R",
    schemeId: 1,
    schemeName: "Merit-Based Scholarship",
    amount: 50000,
    applicationDate: "2024-02-13",
    submissionTime: "2024-02-13T09:00:00.000Z",
    status: "Approved",
    approvalDate: "2024-02-23",
    disbursementStatus: "Disbursed",
    disbursementDate: "2024-03-01",
    paymentMode: "Bank Transfer",
    academicYear: "2023-24",
    semester: 3,
    program: "B.Sc Chemistry",
    cgpa: 9.5,
    attendancePercentage: 98,
    category: "General",
    familyIncome: 190000,
    personalDetails: {
      fullName: "Nandhini R",
      dob: "2004-04-08",
      gender: "Female",
      phone: "+91-9876543232",
      email: "nandhini.r@gmail.com",
      address: "22 Valluvar Street, Coimbatore",
      fatherName: "Mr. Rajendran",
      motherName: "Mrs. Mallika",
      fatherOccupation: "Bank Clerk",
      motherOccupation: "Teacher"
    },
    bankDetails: {
      accountHolderName: "Nandhini R",
      accountNumber: "2211003344",
      ifscCode: "SBIN0004567",
      bankName: "State Bank of India",
      branch: "Coimbatore Main"
    },
    documents: ["Mark Sheet", "Income Certificate", "ID Proof"],
    rejectionReason: null,
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-02-13T09:00:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Meritorious student"
      },
      {
        date: "2024-02-23T11:20:00.000Z",
        action: "Application Approved",
        status: "Approved",
        remarks: "Eligible and approved"
      },
      {
        date: "2024-03-01T15:00:00.000Z",
        action: "Amount Disbursed",
        status: "Disbursed",
        remarks: "Transferred to SBI"
      }
    ]
  },
  {
    id: 24,
    referenceNumber: "SCH2024024",
    studentId: "STU2024024",
    studentName: "Sathish K",
    schemeId: 2,
    schemeName: "SC/ST Scholarship",
    amount: 28000,
    applicationDate: "2024-02-14",
    submissionTime: "2024-02-14T10:45:00.000Z",
    status: "Approved",
    approvalDate: "2024-02-24",
    disbursementStatus: "Disbursed",
    disbursementDate: "2024-03-02",
    paymentMode: "Bank Transfer",
    academicYear: "2023-24",
    semester: 4,
    program: "B.A Economics",
    cgpa: 7.9,
    attendancePercentage: 84,
    category: "SC",
    familyIncome: 180000,
    personalDetails: {
      fullName: "Sathish K",
      dob: "2002-11-03",
      gender: "Male",
      phone: "+91-9876543233",
      email: "sathish.k@gmail.com",
      address: "9 Periyar Road, Madurai",
      fatherName: "Mr. Karuppasamy",
      motherName: "Mrs. Rani",
      fatherOccupation: "Mason",
      motherOccupation: "Housewife"
    },
    bankDetails: {
      accountHolderName: "Sathish K",
      accountNumber: "9988776655",
      ifscCode: "IOBA0001324",
      bankName: "Indian Overseas Bank",
      branch: "Madurai Central"
    },
    documents: ["Caste Certificate", "Mark Sheet", "Income Proof"],
    rejectionReason: null,
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-02-14T10:45:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Eligible under SC criteria"
      },
      {
        date: "2024-02-24T14:30:00.000Z",
        action: "Application Approved",
        status: "Approved",
        remarks: "Documentation complete"
      },
      {
        date: "2024-03-02T09:30:00.000Z",
        action: "Amount Disbursed",
        status: "Disbursed",
        remarks: "Fund sent to IOB"
      }
    ]
  },
  {
    id: 25,
    referenceNumber: "SCH2024025",
    studentId: "STU2024025",
    studentName: "Keerthana M",
    schemeId: 3,
    schemeName: "First Graduate Scholarship",
    amount: 30000,
    applicationDate: "2024-02-15",
    submissionTime: "2024-02-15T14:00:00.000Z",
    status: "Approved",
    approvalDate: "2024-02-25",
    disbursementStatus: "Disbursed",
    disbursementDate: "2024-03-03",
    paymentMode: "Bank Transfer",
    academicYear: "2023-24",
    semester: 1,
    program: "BBA",
    cgpa: 8.6,
    attendancePercentage: 93,
    category: "MBC",
    familyIncome: 160000,
    personalDetails: {
      fullName: "Keerthana M",
      dob: "2005-02-17",
      gender: "Female",
      phone: "+91-9876543234",
      email: "keerthana.m@gmail.com",
      address: "7 Gandhi Street, Salem",
      fatherName: "Mr. Murugan",
      motherName: "Mrs. Jaya",
      fatherOccupation: "Painter",
      motherOccupation: "Tailor"
    },
    bankDetails: {
      accountHolderName: "Keerthana M",
      accountNumber: "6677889900",
      ifscCode: "KARB0000456",
      bankName: "Karur Vysya Bank",
      branch: "Salem West"
    },
    documents: ["First Graduate Certificate", "Mark Sheet"],
    rejectionReason: null,
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-02-15T14:00:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "First graduate verified"
      },
      {
        date: "2024-02-25T11:45:00.000Z",
        action: "Application Approved",
        status: "Approved",
        remarks: "Eligibility confirmed"
      },
      {
        date: "2024-03-03T10:30:00.000Z",
        action: "Amount Disbursed",
        status: "Disbursed",
        remarks: "Sent to KVB"
      }
    ]
  },
  {
    id: 26,
    referenceNumber: "SCH2024026",
    studentId: "STU2024026",
    studentName: "Prakash V",
    schemeId: 1,
    schemeName: "Merit-Based Scholarship",
    amount: 40000,
    applicationDate: "2024-02-16",
    submissionTime: "2024-02-16T09:10:00.000Z",
    status: "Approved",
    approvalDate: "2024-02-26",
    disbursementStatus: "Disbursed",
    disbursementDate: "2024-03-05",
    paymentMode: "Bank Transfer",
    academicYear: "2023-24",
    semester: 5,
    program: "B.Com",
    cgpa: 9.2,
    attendancePercentage: 91,
    category: "General",
    familyIncome: 230000,
    personalDetails: {
      fullName: "Prakash V",
      dob: "2003-06-21",
      gender: "Male",
      phone: "+91-9876543235",
      email: "prakash.v@gmail.com",
      address: "16 Anna Nagar, Tirunelveli",
      fatherName: "Mr. Velu",
      motherName: "Mrs. Shanthi",
      fatherOccupation: "Shop Owner",
      motherOccupation: "Housewife"
    },
    bankDetails: {
      accountHolderName: "Prakash V",
      accountNumber: "5544332211",
      ifscCode: "HDFC0005678",
      bankName: "HDFC Bank",
      branch: "Tirunelveli Town"
    },
    documents: ["Mark Sheet", "Income Certificate", "ID Proof"],
    rejectionReason: null,
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-02-16T09:10:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "High academic performance"
      },
      {
        date: "2024-02-26T13:30:00.000Z",
        action: "Application Approved",
        status: "Approved",
        remarks: "Meets merit criteria"
      },
      {
        date: "2024-03-05T10:20:00.000Z",
        action: "Amount Disbursed",
        status: "Disbursed",
        remarks: "Funds sent to HDFC"
      }
    ]
  },
  {
    id: 27,
    referenceNumber: "SCH2024027",
    studentId: "STU2024027",
    studentName: "Revathi S",
    schemeId: 2,
    schemeName: "SC/ST Scholarship",
    amount: 30000,
    applicationDate: "2024-02-17",
    submissionTime: "2024-02-17T10:00:00.000Z",
    status: "Approved",
    approvalDate: "2024-02-27",
    disbursementStatus: "Disbursed",
    disbursementDate: "2024-03-06",
    paymentMode: "Bank Transfer",
    academicYear: "2023-24",
    semester: 6,
    program: "B.Sc Zoology",
    cgpa: 8.0,
    attendancePercentage: 88,
    category: "SC",
    familyIncome: 200000,
    personalDetails: {
      fullName: "Revathi S",
      dob: "2002-09-10",
      gender: "Female",
      phone: "+91-9876543236",
      email: "revathi.s@gmail.com",
      address: "23 Kamarajar Road, Erode",
      fatherName: "Mr. Suresh",
      motherName: "Mrs. Kavitha",
      fatherOccupation: "Driver",
      motherOccupation: "Tailor"
    },
    bankDetails: {
      accountHolderName: "Revathi S",
      accountNumber: "4433221100",
      ifscCode: "UBIN0554303",
      bankName: "Union Bank",
      branch: "Erode Branch"
    },
    documents: ["Caste Certificate", "Income Proof", "ID Card"],
    rejectionReason: null,
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-02-17T10:00:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Eligible under SC category"
      },
      {
        date: "2024-02-27T12:30:00.000Z",
        action: "Application Approved",
        status: "Approved",
        remarks: "Verified documents"
      },
      {
        date: "2024-03-06T11:00:00.000Z",
        action: "Amount Disbursed",
        status: "Disbursed",
        remarks: "Credited via Union Bank"
      }
    ]
  },
  {
    id: 28,
    referenceNumber: "SCH2024028",
    studentId: "STU2024028",
    studentName: "Madhan L",
    schemeId: 3,
    schemeName: "First Graduate Scholarship",
    amount: 32000,
    applicationDate: "2024-02-18",
    submissionTime: "2024-02-18T14:15:00.000Z",
    status: "Rejected",
    approvalDate: null,
    disbursementStatus: "Not Applicable",
    disbursementDate: null,
    paymentMode: null,
    academicYear: "2023-24",
    semester: 1,
    program: "BCA",
    cgpa: 6.5,
    attendancePercentage: 75,
    category: "BC",
    familyIncome: 210000,
    personalDetails: {
      fullName: "Madhan L",
      dob: "2004-10-18",
      gender: "Male",
      phone: "+91-9876543237",
      email: "madhan.l@gmail.com",
      address: "5 Natesan Street, Karur",
      fatherName: "Mr. Lakshmanan",
      motherName: "Mrs. Valli",
      fatherOccupation: "Security Guard",
      motherOccupation: "Housewife"
    },
    bankDetails: {
      accountHolderName: "Madhan L",
      accountNumber: "3214569870",
      ifscCode: "IDIB000K022",
      bankName: "Indian Bank",
      branch: "Karur Branch"
    },
    documents: ["First Graduate Proof", "Mark Sheet"],
    rejectionReason: "CGPA below minimum requirement (7.0 required)",
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-02-18T14:15:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Low CGPA warning"
      },
      {
        date: "2024-02-28T09:00:00.000Z",
        action: "Application Rejected",
        status: "Rejected",
        remarks: "CGPA less than 7.0"
      }
    ]
  },
  {
    id: 29,
    referenceNumber: "SCH2024029",
    studentId: "STU2024029",
    studentName: "Keerthana R",
    schemeId: 1,
    schemeName: "Merit-Based Scholarship",
    amount: 40000,
    applicationDate: "2024-02-19",
    submissionTime: "2024-02-19T09:45:00.000Z",
    status: "Approved",
    approvalDate: "2024-02-28",
    disbursementStatus: "Disbursed",
    disbursementDate: "2024-03-07",
    paymentMode: "Bank Transfer",
    academicYear: "2023-24",
    semester: 2,
    program: "B.Sc Physics",
    cgpa: 9.0,
    attendancePercentage: 94,
    category: "General",
    familyIncome: 190000,
    personalDetails: {
      fullName: "Keerthana R",
      dob: "2004-03-02",
      gender: "Female",
      phone: "+91-9876543238",
      email: "keerthana.r@gmail.com",
      address: "12 Gandhi Salai, Madurai",
      fatherName: "Mr. Rajagopal",
      motherName: "Mrs. Uma",
      fatherOccupation: "Electrician",
      motherOccupation: "Tailor"
    },
    bankDetails: {
      accountHolderName: "Keerthana R",
      accountNumber: "5678901234",
      ifscCode: "SBIN0001223",
      bankName: "State Bank of India",
      branch: "Madurai Main"
    },
    documents: ["Mark Sheet", "Income Certificate"],
    rejectionReason: null,
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-02-19T09:45:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Excellent academic record"
      },
      {
        date: "2024-02-28T11:00:00.000Z",
        action: "Application Approved",
        status: "Approved",
        remarks: "Approved for disbursement"
      },
      {
        date: "2024-03-07T12:15:00.000Z",
        action: "Amount Disbursed",
        status: "Disbursed",
        remarks: "Credited via SBI"
      }
    ]
  },
  {
    id: 30,
    referenceNumber: "SCH2024030",
    studentId: "STU2024030",
    studentName: "Aravind K",
    schemeId: 2,
    schemeName: "SC/ST Scholarship",
    amount: 30000,
    applicationDate: "2024-02-20",
    submissionTime: "2024-02-20T08:30:00.000Z",
    status: "Approved",
    approvalDate: "2024-03-01",
    disbursementStatus: "Disbursed",
    disbursementDate: "2024-03-09",
    paymentMode: "Bank Transfer",
    academicYear: "2023-24",
    semester: 3,
    program: "BA History",
    cgpa: 8.2,
    attendancePercentage: 86,
    category: "SC",
    familyIncome: 180000,
    personalDetails: {
      fullName: "Aravind K",
      dob: "2003-11-25",
      gender: "Male",
      phone: "+91-9876543239",
      email: "aravind.k@gmail.com",
      address: "34 VOC Street, Salem",
      fatherName: "Mr. Karunakaran",
      motherName: "Mrs. Selvi",
      fatherOccupation: "Bus Conductor",
      motherOccupation: "Housewife"
    },
    bankDetails: {
      accountHolderName: "Aravind K",
      accountNumber: "4433221199",
      ifscCode: "IOBA0000456",
      bankName: "Indian Overseas Bank",
      branch: "Salem Bazaar"
    },
    documents: ["Caste Certificate", "Mark Sheet"],
    rejectionReason: null,
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-02-20T08:30:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Under SC category"
      },
      {
        date: "2024-03-01T10:15:00.000Z",
        action: "Application Approved",
        status: "Approved",
        remarks: "Meets all criteria"
      },
      {
        date: "2024-03-09T13:00:00.000Z",
        action: "Amount Disbursed",
        status: "Disbursed",
        remarks: "Transferred to Indian Overseas Bank"
      }
    ]
  },
  {
    id: 31,
    referenceNumber: "SCH2024031",
    studentId: "STU2024031",
    studentName: "Sindhu M",
    schemeId: 3,
    schemeName: "First Graduate Scholarship",
    amount: 32000,
    applicationDate: "2024-02-21",
    submissionTime: "2024-02-21T14:00:00.000Z",
    status: "Pending",
    approvalDate: null,
    disbursementStatus: "Pending",
    disbursementDate: null,
    paymentMode: null,
    academicYear: "2023-24",
    semester: 4,
    program: "B.Sc Chemistry",
    cgpa: 8.1,
    attendancePercentage: 85,
    category: "BC",
    familyIncome: 220000,
    personalDetails: {
      fullName: "Sindhu M",
      dob: "2004-01-10",
      gender: "Female",
      phone: "+91-9876543240",
      email: "sindhu.m@gmail.com",
      address: "22 MGR Street, Dindigul",
      fatherName: "Mr. Murugan",
      motherName: "Mrs. Rani",
      fatherOccupation: "Farmer",
      motherOccupation: "Housewife"
    },
    bankDetails: {
      accountHolderName: "Sindhu M",
      accountNumber: "3344556677",
      ifscCode: "UTIB0000667",
      bankName: "Axis Bank",
      branch: "Dindigul"
    },
    documents: ["Income Certificate", "Mark Sheet"],
    rejectionReason: null,
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-02-21T14:00:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Under verification"
      }
    ]
  },
  {
    id: 32,
    referenceNumber: "SCH2024032",
    studentId: "STU2024032",
    studentName: "Prakash V",
    schemeId: 1,
    schemeName: "Merit-Based Scholarship",
    amount: 35000,
    applicationDate: "2024-02-22",
    submissionTime: "2024-02-22T10:30:00.000Z",
    status: "Approved",
    approvalDate: "2024-03-02",
    disbursementStatus: "Disbursed",
    disbursementDate: "2024-03-10",
    paymentMode: "Bank Transfer",
    academicYear: "2023-24",
    semester: 2,
    program: "BCA",
    cgpa: 9.1,
    attendancePercentage: 96,
    category: "General",
    familyIncome: 200000,
    personalDetails: {
      fullName: "Prakash V",
      dob: "2003-08-12",
      gender: "Male",
      phone: "+91-9876543241",
      email: "prakash.v@gmail.com",
      address: "45 Kamaraj Street, Trichy",
      fatherName: "Mr. Velu",
      motherName: "Mrs. Shanthi",
      fatherOccupation: "Private job",
      motherOccupation: "Housewife"
    },
    bankDetails: {
      accountHolderName: "Prakash V",
      accountNumber: "9988776655",
      ifscCode: "SBIN0000112",
      bankName: "State Bank of India",
      branch: "Trichy Town"
    },
    documents: ["Mark Sheet", "Income Certificate"],
    rejectionReason: null,
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-02-22T10:30:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Eligible by merit"
      },
      {
        date: "2024-03-02T11:00:00.000Z",
        action: "Application Approved",
        status: "Approved",
        remarks: "Approved and processed"
      },
      {
        date: "2024-03-10T13:00:00.000Z",
        action: "Amount Disbursed",
        status: "Disbursed",
        remarks: "SBI credited"
      }
    ]
  },
  {
    id: 33,
    referenceNumber: "SCH2024033",
    studentId: "STU2024033",
    studentName: "Meena L",
    schemeId: 2,
    schemeName: "SC/ST Scholarship",
    amount: 30000,
    applicationDate: "2024-02-23",
    submissionTime: "2024-02-23T09:20:00.000Z",
    status: "Rejected",
    approvalDate: null,
    disbursementStatus: "Not Applicable",
    disbursementDate: null,
    paymentMode: null,
    academicYear: "2023-24",
    semester: 1,
    program: "B.Com",
    cgpa: 6.2,
    attendancePercentage: 82,
    category: "SC",
    familyIncome: 230000,
    personalDetails: {
      fullName: "Meena L",
      dob: "2004-04-19",
      gender: "Female",
      phone: "+91-9876543242",
      email: "meena.l@gmail.com",
      address: "21 Bharathi Nagar, Coimbatore",
      fatherName: "Mr. Lakshmanan",
      motherName: "Mrs. Janaki",
      fatherOccupation: "Driver",
      motherOccupation: "Housewife"
    },
    bankDetails: {
      accountHolderName: "Meena L",
      accountNumber: "5544332211",
      ifscCode: "HDFC0000999",
      bankName: "HDFC Bank",
      branch: "Coimbatore Central"
    },
    documents: ["Caste Certificate", "Mark Sheet"],
    rejectionReason: "CGPA below 7.0 minimum requirement",
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-02-23T09:20:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Awaiting eligibility check"
      },
      {
        date: "2024-03-01T10:45:00.000Z",
        action: "Application Rejected",
        status: "Rejected",
        remarks: "Low academic score"
      }
    ]
  },
  {
    id: 34,
    referenceNumber: "SCH2024034",
    studentId: "STU2024034",
    studentName: "Sathish M",
    schemeId: 3,
    schemeName: "First Graduate Scholarship",
    amount: 33000,
    applicationDate: "2024-02-24",
    submissionTime: "2024-02-24T12:00:00.000Z",
    status: "Approved",
    approvalDate: "2024-03-04",
    disbursementStatus: "Disbursed",
    disbursementDate: "2024-03-12",
    paymentMode: "Bank Transfer",
    academicYear: "2023-24",
    semester: 4,
    program: "BE Mechanical",
    cgpa: 8.4,
    attendancePercentage: 91,
    category: "MBC",
    familyIncome: 240000,
    personalDetails: {
      fullName: "Sathish M",
      dob: "2002-10-10",
      gender: "Male",
      phone: "+91-9876543243",
      email: "sathish.m@gmail.com",
      address: "14 Anna Salai, Erode",
      fatherName: "Mr. Mani",
      motherName: "Mrs. Mallika",
      fatherOccupation: "Mechanic",
      motherOccupation: "Garment Worker"
    },
    bankDetails: {
      accountHolderName: "Sathish M",
      accountNumber: "7788991122",
      ifscCode: "IDIB0000234",
      bankName: "Indian Bank",
      branch: "Erode South"
    },
    documents: ["Mark Sheet", "Income Certificate", "First Graduate Certificate"],
    rejectionReason: null,
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-02-24T12:00:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "All documents valid"
      },
      {
        date: "2024-03-04T11:45:00.000Z",
        action: "Application Approved",
        status: "Approved",
        remarks: "Disbursement initiated"
      },
      {
        date: "2024-03-12T14:10:00.000Z",
        action: "Amount Disbursed",
        status: "Disbursed",
        remarks: "Credited to Indian Bank"
      }
    ]
  },
  {
    id: 35,
    referenceNumber: "SCH2024035",
    studentId: "STU2024035",
    studentName: "Kavitha R",
    schemeId: 2,
    schemeName: "SC/ST Scholarship",
    amount: 30000,
    applicationDate: "2024-02-25",
    submissionTime: "2024-02-25T11:00:00.000Z",
    status: "Approved",
    approvalDate: "2024-03-05",
    disbursementStatus: "Disbursed",
    disbursementDate: "2024-03-13",
    paymentMode: "Bank Transfer",
    academicYear: "2023-24",
    semester: 2,
    program: "B.Sc Physics",
    cgpa: 8.2,
    attendancePercentage: 94,
    category: "SC",
    familyIncome: 190000,
    personalDetails: {
      fullName: "Kavitha R",
      dob: "2003-07-21",
      gender: "Female",
      phone: "+91-9876543244",
      email: "kavitha.r@gmail.com",
      address: "123 North Street, Dindigul",
      fatherName: "Mr. Rajendran",
      motherName: "Mrs. Vasanthi",
      fatherOccupation: "Farmer",
      motherOccupation: "Homemaker"
    },
    bankDetails: {
      accountHolderName: "Kavitha R",
      accountNumber: "6677889900",
      ifscCode: "SBIN0001223",
      bankName: "State Bank of India",
      branch: "Dindigul Main"
    },
    documents: ["Caste Certificate", "Income Certificate", "Mark Sheet"],
    rejectionReason: null,
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-02-25T11:00:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Complete details provided"
      },
      {
        date: "2024-03-05T13:20:00.000Z",
        action: "Application Approved",
        status: "Approved",
        remarks: "Scholarship approved"
      },
      {
        date: "2024-03-13T12:00:00.000Z",
        action: "Amount Disbursed",
        status: "Disbursed",
        remarks: "Credited to SBI account"
      }
    ]
  },
  {
    id: 36,
    referenceNumber: "SCH2024036",
    studentId: "STU2024036",
    studentName: "Vignesh K",
    schemeId: 1,
    schemeName: "Merit-Based Scholarship",
    amount: 35000,
    applicationDate: "2024-02-26",
    submissionTime: "2024-02-26T10:45:00.000Z",
    status: "Approved",
    approvalDate: "2024-03-06",
    disbursementStatus: "Disbursed",
    disbursementDate: "2024-03-15",
    paymentMode: "Bank Transfer",
    academicYear: "2023-24",
    semester: 3,
    program: "BBA",
    cgpa: 9.4,
    attendancePercentage: 97,
    category: "General",
    familyIncome: 210000,
    personalDetails: {
      fullName: "Vignesh K",
      dob: "2002-12-01",
      gender: "Male",
      phone: "+91-9876543245",
      email: "vignesh.k@gmail.com",
      address: "5 Gandhi Street, Salem",
      fatherName: "Mr. Krishnan",
      motherName: "Mrs. Uma",
      fatherOccupation: "Shop Owner",
      motherOccupation: "Homemaker"
    },
    bankDetails: {
      accountHolderName: "Vignesh K",
      accountNumber: "7788990011",
      ifscCode: "IOBA0000123",
      bankName: "Indian Overseas Bank",
      branch: "Salem Town"
    },
    documents: ["Mark Sheet", "Income Certificate"],
    rejectionReason: null,
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-02-26T10:45:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Meets all eligibility"
      },
      {
        date: "2024-03-06T09:50:00.000Z",
        action: "Application Approved",
        status: "Approved",
        remarks: "Merit confirmed"
      },
      {
        date: "2024-03-15T13:30:00.000Z",
        action: "Amount Disbursed",
        status: "Disbursed",
        remarks: "Credited to IOB account"
      }
    ]
  },
  {
    id: 37,
    referenceNumber: "SCH2024037",
    studentId: "STU2024037",
    studentName: "Divya N",
    schemeId: 3,
    schemeName: "First Graduate Scholarship",
    amount: 32000,
    applicationDate: "2024-02-27",
    submissionTime: "2024-02-27T14:00:00.000Z",
    status: "Under Review",
    approvalDate: null,
    disbursementStatus: "Pending",
    disbursementDate: null,
    paymentMode: null,
    academicYear: "2023-24",
    semester: 1,
    program: "B.Sc Chemistry",
    cgpa: 8.7,
    attendancePercentage: 92,
    category: "BC",
    familyIncome: 180000,
    personalDetails: {
      fullName: "Divya N",
      dob: "2004-02-25",
      gender: "Female",
      phone: "+91-9876543246",
      email: "divya.n@gmail.com",
      address: "8 Thiru Vi Ka Street, Vellore",
      fatherName: "Mr. Natarajan",
      motherName: "Mrs. Valli",
      fatherOccupation: "Mason",
      motherOccupation: "Cook"
    },
    bankDetails: {
      accountHolderName: "Divya N",
      accountNumber: "3322114455",
      ifscCode: "UBIN0552123",
      bankName: "Union Bank",
      branch: "Vellore South"
    },
    documents: ["Mark Sheet", "Income Certificate", "First Graduate Proof"],
    rejectionReason: null,
    originalReference: null,
    isReapplication: false,
    applicationHistory: [
      {
        date: "2024-02-27T14:00:00.000Z",
        action: "Application Submitted",
        status: "Under Review",
        remarks: "Valid submission"
      }
    ]
  }

];

export default function Scholarships() {
  const currentUser = userProfiles["Admin"]; // Use current logged-in user - Changed to Admin for testing Create Scholarship

  // Debug log to verify currentUser is properly set
  if (process.env.NODE_ENV === "development") {
    console.log("Current User:", currentUser);
    console.log("Current Role:", currentUser.role);
  }
  const [schemes, setSchemes] = useState(initialSchemes);
  const [applications, setApplications] = useState(initialApplications);
  const [filteredApplications, setFilteredApplications] =
    useState(initialApplications);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(
    currentUser.role === "Student" ? "apply" : "dashboard"
  );

  // Check permissions function
  const hasPermission = (action: string) => {
    const hasAccess = permissions[currentUser.role]?.[action] || false;
    // Debug log for verification
    if (process.env.NODE_ENV === "development") {
      console.log(
        `Permission check: ${currentUser.role} -> ${action} = ${hasAccess}`
      );
    }
    return hasAccess;
  };

  // Dialog states
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [isViewApplicationOpen, setIsViewApplicationOpen] = useState(false);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [isUpdateDisbursementOpen, setIsUpdateDisbursementOpen] =
    useState(false);
  const [isTrackDialogOpen, setIsTrackDialogOpen] = useState(false);
  const [isReapplyDialogOpen, setIsReapplyDialogOpen] = useState(false);
  const [isCreateScholarshipOpen, setIsCreateScholarshipOpen] = useState(false);

  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [selectedScheme, setSelectedScheme] = useState<any>(null);
  const [trackingReference, setTrackingReference] = useState("");

  // Form handlers
  const applicationFormHandler = useFormHandler(
    [
      "schemeId",
      "personalDetails",
      "academicDetails",
      "familyIncome",
      "category",
      "bankDetails",
      "documents",
    ],
    {
      schemeId: "",
      personalDetails: {
        phone: "",
        email: "",
        address: "",
        fatherName: "",
        motherName: "",
      },
      academicDetails: {
        semester: "",
        cgpa: "",
        program: "",
        department: "",
      },
      familyIncome: "",
      category: "",
      bankDetails: {
        accountNumber: "",
        ifscCode: "",
        bankName: "",
        branch: "",
      },
      documents: [],
    }
  );

  const statusUpdateHandler = useFormHandler(["status", "remarks"], {
    status: "",
    remarks: "",
  });

  const disbursementHandler = useFormHandler(
    [
      "disbursementStatus",
      "disbursementDate",
      "paymentMode",
      "transactionId",
      "remarks",
    ],
    {
      disbursementStatus: "",
      disbursementDate: "",
      paymentMode: "",
      transactionId: "",
      remarks: "",
    }
  );

  const createScholarshipHandler = useFormHandler(
    [
      "name",
      "amount",
      "type",
      "eligibility",
      "deadline",
      "description",
      "maxApplications",
      "status",
    ],
    {
      name: "",
      amount: "",
      type: "Merit Based",
      eligibility: "",
      deadline: "",
      description: "",
      maxApplications: "100",
      status: "Active",
    }
  );

  // Utility functions
  const getFormData = (handler: any) => {
    return Object.keys(handler.formState).reduce((acc, key) => {
      acc[key] = handler.formState[key].value;
      return acc;
    }, {} as Record<string, any>);
  };

  const handleInputChange =
    (handler: any) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      handler.updateField(e.target.name, e.target.value);
    };

  const handleSelectChange =
    (handler: any, fieldName: string) => (value: string) => {
      handler.updateField(fieldName, value);
    };

  const handleSubmit =
    (handler: any, onSubmit: (data: any) => Promise<void>) =>
    (e: React.FormEvent) => {
      e.preventDefault();
      handler.submitForm(onSubmit);
    };

  // Generate reference number
  const generateReferenceNumber = () => {
    const year = new Date().getFullYear();
    const sequence = (applications.length + 1).toString().padStart(3, "0");
    return `SCH${year}${sequence}`;
  };

  // AM38: Check if student can apply (One Application per Academic Year per Program)
  const canStudentApply = (schemeId: number) => {
    if (
      !currentUser.studentId ||
      !currentUser.academicYear ||
      !currentUser.program
    ) {
      return false;
    }

    const existingApplication = applications.find(
      (app) =>
        app.studentId === currentUser.studentId &&
        app.schemeId === schemeId &&
        app.academicYear === currentUser.academicYear &&
        app.program === currentUser.program
    );

    if (!existingApplication) return true;
    // AM39: Allow reapplication only if previous was rejected
    if (existingApplication.status === "Rejected") return true;
    return false;
  };

  // Check for existing applications in same academic year (violation detection)
  const hasViolation = (studentId: string) => {
    const studentApplications = applications.filter(
      (app) =>
        app.studentId === studentId &&
        app.academicYear === currentUser.academicYear
    );
    return studentApplications.length > 1;
  };

  // Get reapplication count
  const getReapplicationCount = (originalRefNumber: string) => {
    return applications.filter(
      (app) => app.originalReference === originalRefNumber
    ).length;
  };

  // Filter applications based on role
  useEffect(() => {
    let filtered = applications;

    if (currentUser.role === "Student") {
      filtered = applications.filter(
        (app) => app.studentId === currentUser.studentId
      );
    } else if (currentUser.role === "Parent") {
      filtered = applications.filter(
        (app) => app.studentId === currentUser.childId
      );
    } else if (currentUser.role === "Faculty") {
      // Faculty can see applications from their department (if permission assigned)
      filtered = applications.filter((app) =>
        app.personalDetails?.email?.includes(
          currentUser.department?.toLowerCase() || ""
        )
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.referenceNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.schemeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
  }, [searchTerm, applications, currentUser]);

  // AM36 & AM37: CRUD Operations with Reference Number Generation
  const onApplyForScholarship = async (data: any) => {
    // AM38: Check for existing application in same academic year
    if (!canStudentApply(parseInt(data.schemeId))) {
      alert(
        "You have already applied for this scholarship in current academic year!"
      );
      return;
    }

    const referenceNumber = generateReferenceNumber();
    const selectedSchemeData = schemes.find(
      (s) => s.id === parseInt(data.schemeId)
    );

    const newApplication = {
      id: applications.length + 1,
      referenceNumber,
      studentId: currentUser.studentId,
      studentName: currentUser.name,
      schemeId: parseInt(data.schemeId),
      schemeName: selectedSchemeData?.name || "",
      amount: selectedSchemeData?.amount || 0,
      applicationDate: new Date().toISOString().split("T")[0],
      submissionTime: new Date().toISOString(),
      status: "Under Review",
      approvalDate: null,
      disbursementStatus: "Pending",
      disbursementDate: null,
      paymentMode: null,
      academicYear: currentUser.academicYear || "2023-24",
      semester: currentUser.semester || 1,
      program: currentUser.program || "Unknown",
      cgpa: parseFloat(data.academicDetails?.cgpa || "0"),
      attendancePercentage: parseFloat(data.academicDetails?.attendance || "0"),
      category: data.category,
      familyIncome: parseInt(data.familyIncome),
      personalDetails: {
        ...data.personalDetails,
        dob: data.personalDetails?.dob || currentUser.dob,
        gender: data.personalDetails?.gender || currentUser.gender,
      },
      bankDetails: data.bankDetails,
      documents: data.documents || [],
      proofDocuments: data.proofDocuments || [],
      originalReference: data.originalReference || null, // For reapplications
      isReapplication: data.isReapplication || false,
      applicationHistory: [
        {
          date: new Date().toISOString(),
          action: "Application Submitted",
          status: "Under Review",
          remarks: "Initial application submission",
        },
      ],
    };

    setApplications((prev) => [newApplication, ...prev]);
    setIsApplyDialogOpen(false);
    applicationFormHandler.resetForm();

    // AM37: Confirmation with reference number
    alert(
      `✅ Application submitted successfully!\n\nReference Number: ${referenceNumber}\n\nPlease save this reference number for tracking your application.\n\n📧 Confirmation email will be sent to: ${data.personalDetails.email}\n📱 SMS notification will be sent to: ${data.personalDetails.phone}`
    );
  };

  const onUpdateApprovalStatus = async (data: any) => {
    if (!selectedApplication) return;

    const newHistoryEntry = {
      date: new Date().toISOString(),
      action:
        data.status === "Approved"
          ? "Application Approved"
          : data.status === "Rejected"
          ? "Application Rejected"
          : "Status Updated",
      status: data.status,
      remarks: data.remarks || `Status changed to ${data.status}`,
    };

    setApplications((prev) =>
      prev.map((app) =>
        app.id === selectedApplication.id
          ? {
              ...app,
              status: data.status,
              approvalDate:
                data.status === "Approved"
                  ? new Date().toISOString().split("T")[0]
                  : data.status === "Rejected"
                  ? new Date().toISOString().split("T")[0]
                  : app.approvalDate,
              rejectionReason: data.status === "Rejected" ? data.remarks : null,
              applicationHistory: [
                ...(app.applicationHistory || []),
                newHistoryEntry,
              ],
            }
          : app
      )
    );

    setIsUpdateStatusOpen(false);
    setSelectedApplication(null);
    statusUpdateHandler.resetForm();

    alert(`✅ Application status updated to: ${data.status}`);
  };

  const onUpdateDisbursement = async (data: any) => {
    if (!selectedApplication) return;

    const newHistoryEntry = {
      date: new Date().toISOString(),
      action:
        data.disbursementStatus === "Disbursed"
          ? "Payment Disbursed"
          : data.disbursementStatus === "Processing"
          ? "Payment Processing"
          : "Payment Status Updated",
      status: data.disbursementStatus,
      remarks:
        data.remarks ||
        `Payment status: ${data.disbursementStatus}${
          data.transactionId ? ` (Txn: ${data.transactionId})` : ""
        }`,
    };

    setApplications((prev) =>
      prev.map((app) =>
        app.id === selectedApplication.id
          ? {
              ...app,
              disbursementStatus: data.disbursementStatus,
              disbursementDate: data.disbursementDate,
              paymentMode: data.paymentMode,
              transactionId: data.transactionId,
              applicationHistory: [
                ...(app.applicationHistory || []),
                newHistoryEntry,
              ],
            }
          : app
      )
    );

    setIsUpdateDisbursementOpen(false);
    setSelectedApplication(null);
    disbursementHandler.resetForm();

    alert(`💰 Payment status updated: ${data.disbursementStatus}`);
  };

  // Track application by reference number
  const trackApplication = () => {
    const found = applications.find(
      (app) => app.referenceNumber === trackingReference
    );
    if (found) {
      setSelectedApplication(found);
      setIsViewApplicationOpen(true);
      setIsTrackDialogOpen(false);
    } else {
      alert("Application not found with this reference number");
    }
  };

  // Create new scholarship scheme
  const onCreateScholarship = async (data: any) => {
    const newScheme = {
      id: schemes.length + 1,
      name: data.name,
      amount: parseInt(data.amount),
      type: data.type,
      eligibility: data.eligibility,
      deadline: data.deadline,
      status: data.status,
      maxApplications: parseInt(data.maxApplications),
      description: data.description,
    };

    setSchemes((prev) => [newScheme, ...prev]);
    setIsCreateScholarshipOpen(false);
    createScholarshipHandler.resetForm();

    alert(
      `✅ Scholarship scheme "${
        data.name
      }" created successfully!\n\nAmount: ₹${parseInt(
        data.amount
      ).toLocaleString("en-IN")}\nType: ${data.type}\nMax Applications: ${
        data.maxApplications
      }`
    );
  };

  // Export functionality
  const handleExport = (format: string) => {
    if (!hasPermission("downloadApplications")) {
      alert("You do not have permission to download applications");
      return;
    }

    if (format === "excel") {
      // Mock Excel export
      const blob = new Blob(["Application Data (Excel format)"], {
        type: "application/vnd.ms-excel",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `scholarship-applications-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      a.click();
    } else if (format === "pdf") {
      // Mock PDF export
      const blob = new Blob(["Application Data (PDF format)"], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `scholarship-applications-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      a.click();
    } else if (format === "zip") {
      // Mock ZIP export
      const blob = new Blob(["Application Data (ZIP format)"], {
        type: "application/zip",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `scholarship-applications-${
        new Date().toISOString().split("T")[0]
      }.zip`;
      a.click();
    }
  };

  // Status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "Under Review":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDisbursementBadge = (status: string) => {
    switch (status) {
      case "Disbursed":
        return <Badge className="bg-green-100 text-green-800">Disbursed</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "Not Applicable":
        return <Badge className="bg-gray-100 text-gray-800">N/A</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Scholarship Management System
          </h1>
          {/* <p className="text-muted-foreground mt-2">
            Complete role-based scholarship application and management • Logged
            in as:{" "}
            <span className="font-semibold text-blue-600">
              {currentUser.role} - {currentUser.name}
            </span>
          </p> */}
        </div>
        <div className="flex gap-2">
          {hasPermission("createScholarship") && (
            <Dialog
              open={isCreateScholarshipOpen}
              onOpenChange={setIsCreateScholarshipOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Scholarship
                </Button>
              </DialogTrigger>
            </Dialog>
          )}

          {hasPermission("downloadApplications") && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Download Applications</DialogTitle>
                  <DialogDescription>Choose download format</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleExport("excel")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Excel Format
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleExport("pdf")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    PDF Format
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleExport("zip")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    ZIP Archive
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {hasPermission("trackByReference") && (
            <Button
              variant="outline"
              onClick={() => setIsTrackDialogOpen(true)}
            >
              <Search className="h-4 w-4 mr-2" />
              Track Application
            </Button>
          )}

          {hasPermission("viewViolations") && (
            <Button
              variant="outline"
              className="text-orange-600 border-orange-300"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Violations (
              {applications.filter((app) => hasViolation(app.studentId)).length}
              )
            </Button>
          )}

          {hasPermission("viewReapplications") && (
            <Button variant="outline" className="text-blue-600 border-blue-300">
              <History className="h-4 w-4 mr-2" />
              Reapplications (
              {applications.filter((app) => app.isReapplication).length})
            </Button>
          )}
        </div>
      </div>

      {/* Role-Specific Welcome & Features */}
      <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  {currentUser.role === "Student" && (
                    <GraduationCap className="h-4 w-4 text-green-600" />
                  )}
                  {currentUser.role === "Admin" && (
                    <Shield className="h-4 w-4 text-green-600" />
                  )}
                  {currentUser.role === "Faculty" && (
                    <BookOpen className="h-4 w-4 text-green-600" />
                  )}
                  {currentUser.role === "Parent" && (
                    <Users className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-green-900">
                  Welcome, {currentUser.name}!
                </h3>
              </div>

              {currentUser.role === "Student" && (
                <div className="space-y-2">
                  <p className="text-green-800">
                    🎓 <strong>Student Portal:</strong> Apply for scholarships,
                    track your applications, and view payment status.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge className="bg-green-200 text-green-800">
                      Apply for Scholarships
                    </Badge>
                    <Badge className="bg-blue-200 text-blue-800">
                      Track Applications
                    </Badge>
                    <Badge className="bg-purple-200 text-purple-800">
                      View Payment Status
                    </Badge>
                    <Badge className="bg-orange-200 text-orange-800">
                      Reapply if Rejected
                    </Badge>
                  </div>
                </div>
              )}

              {currentUser.role === "Admin" && (
                <div className="space-y-2">
                  <p className="text-green-800">
                    👨‍💼 <strong>Administrator Portal:</strong> Manage all
                    scholarship applications, approve/reject, and handle
                    disbursements.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge className="bg-green-200 text-green-800">
                      View All Applications
                    </Badge>
                    <Badge className="bg-blue-200 text-blue-800">
                      Approve/Reject
                    </Badge>
                    <Badge className="bg-purple-200 text-purple-800">
                      Download Reports
                    </Badge>
                    <Badge className="bg-orange-200 text-orange-800">
                      Track by Reference
                    </Badge>
                    <Badge className="bg-red-200 text-red-800">
                      Manage Disbursements
                    </Badge>
                  </div>
                </div>
              )}

              {currentUser.role === "Faculty" && (
                <div className="space-y-2">
                  <p className="text-green-800">
                    👩‍🏫 <strong>Faculty Portal:</strong> View student application
                    status and validate academic details (if permitted).
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge className="bg-green-200 text-green-800">
                      View Student Status
                    </Badge>
                    <Badge className="bg-blue-200 text-blue-800">
                      Read-Only Access
                    </Badge>
                    <Badge className="bg-purple-200 text-purple-800">
                      Academic Validation
                    </Badge>
                  </div>
                </div>
              )}

              {currentUser.role === "Parent" && (
                <div className="space-y-2">
                  <p className="text-green-800">
                    👨‍👩‍👧‍��� <strong>Parent Portal:</strong> View your child's
                    scholarship application status and payment details.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge className="bg-green-200 text-green-800">
                      Child's Applications
                    </Badge>
                    <Badge className="bg-blue-200 text-blue-800">
                      Payment Status
                    </Badge>
                    <Badge className="bg-purple-200 text-purple-800">
                      Track by Reference
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-green-700">
                {filteredApplications.length}
              </div>
              <div className="text-sm text-green-600">
                {currentUser.role === "Student"
                  ? "My Applications"
                  : currentUser.role === "Parent"
                  ? "Child's Applications"
                  : "Total Applications"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  {currentUser.role === "Student"
                    ? "My Applications"
                    : "Total Applications"}
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {filteredApplications.length}
                </p>
                <p className="text-xs text-blue-600">This academic year</p>
              </div>
              <Award className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Approved</p>
                <p className="text-3xl font-bold text-green-900">
                  {
                    filteredApplications.filter(
                      (app) => app.status === "Approved"
                    ).length
                  }
                </p>
                <p className="text-xs text-green-600">Scholarship awards</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">
                  Under Review
                </p>
                <p className="text-3xl font-bold text-orange-900">
                  {
                    filteredApplications.filter(
                      (app) => app.status === "Under Review"
                    ).length
                  }
                </p>
                <p className="text-xs text-orange-600">Pending approval</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">
                  {currentUser.role === "Student"
                    ? "Amount Received"
                    : "Total Disbursed"}
                </p>
                <p className="text-3xl font-bold text-purple-900">
                  ₹
                  {filteredApplications
                    .filter((app) => app.disbursementStatus === "Disbursed")
                    .reduce((sum, app) => sum + app.amount, 0)
                    .toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-purple-600">Scholarship amount</p>
              </div>
              <IndianRupee className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full h-14 bg-gradient-to-r from-blue-50 to-purple-50 rounded-none border-b">
              <TabsTrigger value="dashboard" className="flex-1 h-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>

              {hasPermission("applyForScholarship") && (
                <TabsTrigger value="apply" className="flex-1 h-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Apply
                </TabsTrigger>
              )}

              <TabsTrigger value="applications" className="flex-1 h-full">
                <FileText className="h-4 w-4 mr-2" />
                Applications
              </TabsTrigger>

              <TabsTrigger value="schemes" className="flex-1 h-full">
                <Award className="h-4 w-4 mr-2" />
                Schemes
              </TabsTrigger>

              <TabsTrigger value="testing" className="flex-1 h-full">
                <Target className="h-4 w-4 mr-2" />
                Test Functions
              </TabsTrigger>

              {(hasPermission("viewOwnPaymentStatus") ||
                hasPermission("viewChildPaymentStatus") ||
                hasPermission("viewPaymentStatus")) && (
                <TabsTrigger value="payments" className="flex-1 h-full">
                  <IndianRupee className="h-4 w-4 mr-2" />
                  Payments
                </TabsTrigger>
              )}
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Application Status Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {["Approved", "Under Review", "Rejected"].map(
                        (status) => {
                          const count = filteredApplications.filter(
                            (app) => app.status === status
                          ).length;
                          const percentage =
                            filteredApplications.length > 0
                              ? (count / filteredApplications.length) * 100
                              : 0;
                          return (
                            <div key={status} className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium">
                                  {status}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {count} applications
                                </span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                            </div>
                          );
                        }
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Applications */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Applications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredApplications.slice(0, 5).map((app) => (
                        <div
                          key={app.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <div className="font-medium">{app.schemeName}</div>
                            <div className="text-sm text-gray-600">
                              {app.referenceNumber}
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(app.status)}
                            <div className="text-sm text-gray-600 mt-1">
                              ₹{app.amount.toLocaleString("en-IN")}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Apply Tab */}
            {hasPermission("applyForScholarship") && (
              <TabsContent value="apply" className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {schemes
                    .filter((scheme) => scheme.status === "Active")
                    .map((scheme) => {
                      const canApply = canStudentApply(scheme.id);
                      return (
                        <Card
                          key={scheme.id}
                          className={`border ${
                            canApply
                              ? "border-green-200 bg-green-50"
                              : "border-gray-200"
                          }`}
                        >
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">
                                  {scheme.name}
                                </CardTitle>
                                <CardDescription>{scheme.type}</CardDescription>
                              </div>
                              <Badge
                                variant={canApply ? "default" : "secondary"}
                              >
                                ₹{scheme.amount.toLocaleString("en-IN")}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <p className="text-sm">{scheme.description}</p>
                              <div className="text-sm">
                                <strong>Eligibility:</strong>{" "}
                                {scheme.eligibility}
                              </div>
                              <div className="text-sm">
                                <strong>Deadline:</strong> {scheme.deadline}
                              </div>
                              <Button
                                className="w-full"
                                disabled={!canApply}
                                onClick={() => {
                                  setSelectedScheme(scheme);
                                  setIsApplyDialogOpen(true);
                                }}
                              >
                                {canApply ? "Apply Now" : "Already Applied"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </TabsContent>
            )}

            {/* Applications Tab */}
            <TabsContent value="applications" className="p-6 space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by reference number, name, or scheme..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference No.</TableHead>
                    {hasPermission("viewAll") && (
                      <TableHead>Student Name</TableHead>
                    )}
                    <TableHead>Scheme</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Disbursement</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-mono text-sm">
                        {app.referenceNumber}
                      </TableCell>
                      {hasPermission("viewAll") && (
                        <TableCell>{app.studentName}</TableCell>
                      )}
                      <TableCell>{app.schemeName}</TableCell>
                      <TableCell>
                        ₹{app.amount.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>{getStatusBadge(app.status)}</TableCell>
                      <TableCell>
                        {getDisbursementBadge(app.disbursementStatus)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedApplication(app);
                              setIsViewApplicationOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {hasPermission("updateApproval") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedApplication(app);
                                setIsUpdateStatusOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {hasPermission("updateDisbursement") &&
                            app.status === "Approved" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedApplication(app);
                                  setIsUpdateDisbursementOpen(true);
                                }}
                              >
                                <IndianRupee className="h-4 w-4" />
                              </Button>
                            )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredApplications.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No applications found</p>
                </div>
              )}
            </TabsContent>

            {/* Schemes Tab */}
            <TabsContent value="schemes" className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {schemes.map((scheme) => (
                  <Card key={scheme.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{scheme.name}</CardTitle>
                          <CardDescription>{scheme.type}</CardDescription>
                        </div>
                        <Badge
                          variant={
                            scheme.status === "Active" ? "default" : "secondary"
                          }
                        >
                          {scheme.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium">Amount:</span>
                          <span className="text-green-600 font-bold">
                            ₹{scheme.amount.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Eligibility:</span>
                          <p className="text-sm text-gray-600 mt-1">
                            {scheme.eligibility}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Deadline:</span>
                          <span className="text-red-600">
                            {scheme.deadline}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Max Applications:</span>
                          <span>{scheme.maxApplications}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {scheme.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Payments Tab */}
            {(hasPermission("viewOwnPaymentStatus") ||
              hasPermission("viewChildPaymentStatus") ||
              hasPermission("viewPaymentStatus")) && (
              <TabsContent value="payments" className="p-6 space-y-6">
                <div className="space-y-6">
                  {filteredApplications
                    .filter((app) => app.status === "Approved")
                    .map((app) => (
                      <Card key={app.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">
                                {app.schemeName}
                              </CardTitle>
                              <CardDescription>
                                Reference: {app.referenceNumber}
                              </CardDescription>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">
                                ₹{app.amount.toLocaleString("en-IN")}
                              </div>
                              {getDisbursementBadge(app.disbursementStatus)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Approval Date
                              </Label>
                              <div className="mt-1">
                                {app.approvalDate || "Not Available"}
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Disbursement Date
                              </Label>
                              <div className="mt-1">
                                {app.disbursementDate || "Pending"}
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Payment Mode
                              </Label>
                              <div className="mt-1">
                                {app.paymentMode || "Not Assigned"}
                              </div>
                            </div>
                          </div>

                          {app.disbursementStatus === "Disbursed" &&
                            app.bankDetails && (
                              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <h4 className="font-medium text-green-900 mb-2">
                                  Payment Details
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <strong>Bank:</strong>{" "}
                                    {app.bankDetails.bankName}
                                  </div>
                                  <div>
                                    <strong>Account:</strong> ****
                                    {app.bankDetails.accountNumber.slice(-4)}
                                  </div>
                                  {app.transactionId && (
                                    <div className="col-span-2">
                                      <strong>Transaction ID:</strong>{" "}
                                      {app.transactionId}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            )}

            {/* Functionality Testing Tab */}
            <TabsContent value="testing" className="p-6 space-y-6">
              <Card className="border-2 border-dashed border-purple-300 bg-purple-50">
                <CardHeader>
                  <CardTitle className="text-purple-900">
                    🧪 Role-Based Functionality Testing
                  </CardTitle>
                  <CardDescription className="text-purple-700">
                    Test and verify all scholarship management features based on
                    current role: <strong>{currentUser.role}</strong>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Student Functions */}
                    {currentUser.role === "Student" && (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-green-700 flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          Student Functions
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-white rounded border">
                            <span className="text-sm">
                              ✅ Apply for Scholarship
                            </span>
                            <Button
                              size="sm"
                              onClick={() => setActiveTab("apply")}
                            >
                              Test Apply
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded border">
                            <span className="text-sm">
                              ✅ View Own Applications
                            </span>
                            <Button
                              size="sm"
                              onClick={() => setActiveTab("applications")}
                            >
                              View Apps
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded border">
                            <span className="text-sm">
                              ✅ Track by Reference
                            </span>
                            <Button
                              size="sm"
                              onClick={() => setIsTrackDialogOpen(true)}
                            >
                              Track
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded border">
                            <span className="text-sm">
                              ✅ View Payment Status
                            </span>
                            <Button
                              size="sm"
                              onClick={() => setActiveTab("payments")}
                            >
                              Payments
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded border">
                            <span className="text-sm">
                              ✅ Reapply if Rejected
                            </span>
                            <Badge
                              variant="outline"
                              className="text-orange-600"
                            >
                              Auto-enabled
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Admin Functions */}
                    {currentUser.role === "Admin" && (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Admin Functions
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-white rounded border">
                            <span className="text-sm">
                              ✅ View All Applications
                            </span>
                            <Button
                              size="sm"
                              onClick={() => setActiveTab("applications")}
                            >
                              View All
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded border">
                            <span className="text-sm">✅ Download Reports</span>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Download
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded border">
                            <span className="text-sm">✅ Approve/Reject</span>
                            <Badge variant="outline" className="text-blue-600">
                              Edit Actions
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded border">
                            <span className="text-sm">
                              ✅ Update Disbursement
                            </span>
                            <Badge
                              variant="outline"
                              className="text-purple-600"
                            >
                              Payment Actions
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded border">
                            <span className="text-sm">✅ Track Violations</span>
                            <Badge variant="outline" className="text-red-600">
                              Monitoring
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Faculty Functions */}
                    {currentUser.role === "Faculty" && (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-purple-700 flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Faculty Functions
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-white rounded border">
                            <span className="text-sm">
                              ✅ View Student Status
                            </span>
                            <Button
                              size="sm"
                              onClick={() => setActiveTab("applications")}
                            >
                              View Status
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded border">
                            <span className="text-sm">✅ Read-Only Access</span>
                            <Badge variant="outline" className="text-gray-600">
                              View Only
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded border">
                            <span className="text-sm">
                              ✅ Academic Validation
                            </span>
                            <Badge variant="outline" className="text-green-600">
                              If Permitted
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Parent Functions */}
                    {currentUser.role === "Parent" && (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-orange-700 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Parent Functions
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-white rounded border">
                            <span className="text-sm">
                              ✅ View Child's Applications
                            </span>
                            <Button
                              size="sm"
                              onClick={() => setActiveTab("applications")}
                            >
                              View Child's
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded border">
                            <span className="text-sm">
                              ✅ Track Child's Reference
                            </span>
                            <Button
                              size="sm"
                              onClick={() => setIsTrackDialogOpen(true)}
                            >
                              Track
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded border">
                            <span className="text-sm">
                              ✅ View Payment Status
                            </span>
                            <Button
                              size="sm"
                              onClick={() => setActiveTab("payments")}
                            >
                              Payments
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* System Features */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        System Features (All Roles)
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <span className="text-sm">
                            ✅ Auto Reference Generation
                          </span>
                          <Badge variant="outline" className="text-blue-600">
                            SCH2024XXX
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <span className="text-sm">
                            ✅ One App per Academic Year
                          </span>
                          <Badge variant="outline" className="text-green-600">
                            Enforced
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <span className="text-sm">
                            ✅ Application History
                          </span>
                          <Badge variant="outline" className="text-purple-600">
                            Full Timeline
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <span className="text-sm">✅ Real-time Status</span>
                          <Badge variant="outline" className="text-orange-600">
                            Live Updates
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      💡 Testing Instructions
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>
                        • Switch between roles using the dropdown at the top
                      </li>
                      <li>
                        • Test role-specific features using the buttons above
                      </li>
                      <li>
                        • Notice how the interface changes based on permissions
                      </li>
                      <li>
                        • Verify that restricted features are hidden/disabled
                      </li>
                      <li>• Test the complete application workflow</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Apply for Scholarship Dialog */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Apply for Scholarship: {selectedScheme?.name}
            </DialogTitle>
            <DialogDescription>
              Fill out the complete application form
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(
              applicationFormHandler,
              onApplyForScholarship
            )}
            className="space-y-6"
          >
            <Tabs defaultValue="personal">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="reservation">Reservation</TabsTrigger>
                <TabsTrigger value="economic">Economic</TabsTrigger>
                <TabsTrigger value="scheme">Scheme</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <h3 className="text-lg font-medium">Personal Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    label="Full Name"
                    name="personalDetails.fullName"
                    value={
                      getFormData(applicationFormHandler).personalDetails
                        ?.fullName || currentUser.name
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    required
                    disabled
                  />
                  <FormField
                    label="Date of Birth"
                    name="personalDetails.dob"
                    type="date"
                    value={
                      getFormData(applicationFormHandler).personalDetails
                        ?.dob || currentUser.dob
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    required
                  />
                  <FormField
                    label="Gender"
                    name="personalDetails.gender"
                    type="select"
                    value={
                      getFormData(applicationFormHandler).personalDetails
                        ?.gender || currentUser.gender
                    }
                    onChange={handleSelectChange(
                      applicationFormHandler,
                      "personalDetails.gender"
                    )}
                    options={[
                      { label: "Male", value: "Male" },
                      { label: "Female", value: "Female" },
                      { label: "Other", value: "Other" },
                    ]}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Phone Number"
                    name="personalDetails.phone"
                    value={
                      getFormData(applicationFormHandler).personalDetails
                        ?.phone || currentUser.contact
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    placeholder="+91-9876543210"
                    required
                  />
                  <FormField
                    label="Email Address"
                    name="personalDetails.email"
                    type="email"
                    value={
                      getFormData(applicationFormHandler).personalDetails
                        ?.email || currentUser.email
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    placeholder="student@university.edu"
                    required
                  />
                </div>
                <FormField
                  label="Complete Residential Address"
                  name="personalDetails.address"
                  type="textarea"
                  value={
                    getFormData(applicationFormHandler).personalDetails
                      ?.address || currentUser.address
                  }
                  onChange={handleInputChange(applicationFormHandler)}
                  placeholder="House/Flat No., Street, Area, City, State, PIN Code"
                  rows={3}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Father's Name"
                    name="personalDetails.fatherName"
                    value={
                      getFormData(applicationFormHandler).personalDetails
                        ?.fatherName || ""
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    required
                  />
                  <FormField
                    label="Mother's Name"
                    name="personalDetails.motherName"
                    value={
                      getFormData(applicationFormHandler).personalDetails
                        ?.motherName || ""
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Father's Occupation"
                    name="personalDetails.fatherOccupation"
                    value={
                      getFormData(applicationFormHandler).personalDetails
                        ?.fatherOccupation || ""
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    required
                  />
                  <FormField
                    label="Mother's Occupation"
                    name="personalDetails.motherOccupation"
                    value={
                      getFormData(applicationFormHandler).personalDetails
                        ?.motherOccupation || ""
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="academic" className="space-y-4">
                <h3 className="text-lg font-medium">Academic Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    label="Course/Program"
                    name="academicDetails.program"
                    value={
                      getFormData(applicationFormHandler).academicDetails
                        ?.program || currentUser.program
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    disabled
                    required
                  />
                  <FormField
                    label="Current Semester"
                    name="academicDetails.semester"
                    type="select"
                    value={
                      getFormData(applicationFormHandler).academicDetails
                        ?.semester ||
                      (currentUser.semester
                        ? currentUser.semester.toString()
                        : "1")
                    }
                    onChange={handleSelectChange(
                      applicationFormHandler,
                      "academicDetails.semester"
                    )}
                    options={[
                      { label: "Semester 1", value: "1" },
                      { label: "Semester 2", value: "2" },
                      { label: "Semester 3", value: "3" },
                      { label: "Semester 4", value: "4" },
                      { label: "Semester 5", value: "5" },
                      { label: "Semester 6", value: "6" },
                      { label: "Semester 7", value: "7" },
                      { label: "Semester 8", value: "8" },
                    ]}
                    required
                  />
                  <FormField
                    label="Department"
                    name="academicDetails.department"
                    value={
                      getFormData(applicationFormHandler).academicDetails
                        ?.department || currentUser.department
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    disabled
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Current CGPA"
                    name="academicDetails.cgpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={
                      getFormData(applicationFormHandler).academicDetails
                        ?.cgpa || ""
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    placeholder="8.50"
                    required
                  />
                  <FormField
                    label="Attendance Percentage (%)"
                    name="academicDetails.attendance"
                    type="number"
                    min="0"
                    max="100"
                    value={
                      getFormData(applicationFormHandler).academicDetails
                        ?.attendance || ""
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    placeholder="85"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Academic Year"
                    name="academicDetails.academicYear"
                    value={
                      getFormData(applicationFormHandler).academicDetails
                        ?.academicYear || currentUser.academicYear
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    disabled
                    required
                  />
                  <FormField
                    label="Student Roll Number"
                    name="academicDetails.rollNumber"
                    value={
                      getFormData(applicationFormHandler).academicDetails
                        ?.rollNumber || currentUser.studentId
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    disabled
                    required
                  />
                </div>
              </TabsContent>

              <TabsContent value="reservation" className="space-y-4">
                <h3 className="text-lg font-medium">
                  Caste/Community & Reservation Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Category"
                    name="category"
                    type="select"
                    value={getFormData(applicationFormHandler).category || ""}
                    onChange={handleSelectChange(
                      applicationFormHandler,
                      "category"
                    )}
                    options={[
                      { label: "General", value: "General" },
                      { label: "OBC (Other Backward Class)", value: "OBC" },
                      { label: "SC (Scheduled Caste)", value: "SC" },
                      { label: "ST (Scheduled Tribe)", value: "ST" },
                      {
                        label: "EWS (Economically Weaker Section)",
                        value: "EWS",
                      },
                    ]}
                    required
                  />
                  <FormField
                    label="Sub-Category (if applicable)"
                    name="subCategory"
                    value={
                      getFormData(applicationFormHandler).subCategory || ""
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    placeholder="e.g., 2A, 2B, 3A, 3B"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Caste/Community"
                    name="caste"
                    value={getFormData(applicationFormHandler).caste || ""}
                    onChange={handleInputChange(applicationFormHandler)}
                    placeholder="Your caste/community name"
                    required
                  />
                  <FormField
                    label="Religion"
                    name="religion"
                    type="select"
                    value={getFormData(applicationFormHandler).religion || ""}
                    onChange={handleSelectChange(
                      applicationFormHandler,
                      "religion"
                    )}
                    options={[
                      { label: "Hindu", value: "Hindu" },
                      { label: "Muslim", value: "Muslim" },
                      { label: "Christian", value: "Christian" },
                      { label: "Sikh", value: "Sikh" },
                      { label: "Buddhist", value: "Buddhist" },
                      { label: "Jain", value: "Jain" },
                      { label: "Other", value: "Other" },
                    ]}
                    required
                  />
                </div>
                <FormField
                  label="Caste Certificate Number (if applicable)"
                  name="casteCertificateNumber"
                  value={
                    getFormData(applicationFormHandler)
                      .casteCertificateNumber || ""
                  }
                  onChange={handleInputChange(applicationFormHandler)}
                  placeholder="Certificate number for verification"
                />
              </TabsContent>

              <TabsContent value="economic" className="space-y-4">
                <h3 className="text-lg font-medium">
                  Economic Background & Proof
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Family Annual Income (₹)"
                    name="familyIncome"
                    type="number"
                    value={
                      getFormData(applicationFormHandler).familyIncome || ""
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    placeholder="500000"
                    required
                  />
                  <FormField
                    label="Father's Annual Income (₹)"
                    name="fatherIncome"
                    type="number"
                    value={
                      getFormData(applicationFormHandler).fatherIncome || ""
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    placeholder="300000"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Mother's Annual Income (₹)"
                    name="motherIncome"
                    type="number"
                    value={
                      getFormData(applicationFormHandler).motherIncome || ""
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    placeholder="200000"
                  />
                  <FormField
                    label="Income Source"
                    name="incomeSource"
                    type="select"
                    value={
                      getFormData(applicationFormHandler).incomeSource || ""
                    }
                    onChange={handleSelectChange(
                      applicationFormHandler,
                      "incomeSource"
                    )}
                    options={[
                      { label: "Salary/Employment", value: "Salary" },
                      { label: "Business", value: "Business" },
                      { label: "Agriculture", value: "Agriculture" },
                      { label: "Pension", value: "Pension" },
                      { label: "Other", value: "Other" },
                    ]}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Income Proof Documents</h4>
                  <FormField
                    label="Income Certificate Number"
                    name="incomeCertificateNumber"
                    value={
                      getFormData(applicationFormHandler)
                        .incomeCertificateNumber || ""
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    placeholder="Income certificate number"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">
                    Bank Details for Scholarship Disbursement
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Account Holder Name"
                      name="bankDetails.accountHolderName"
                      value={
                        getFormData(applicationFormHandler).bankDetails
                          ?.accountHolderName || currentUser.name
                      }
                      onChange={handleInputChange(applicationFormHandler)}
                      required
                    />
                    <FormField
                      label="Account Number"
                      name="bankDetails.accountNumber"
                      value={
                        getFormData(applicationFormHandler).bankDetails
                          ?.accountNumber || ""
                      }
                      onChange={handleInputChange(applicationFormHandler)}
                      placeholder="Enter bank account number"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Confirm Account Number"
                      name="bankDetails.confirmAccountNumber"
                      value={
                        getFormData(applicationFormHandler).bankDetails
                          ?.confirmAccountNumber || ""
                      }
                      onChange={handleInputChange(applicationFormHandler)}
                      placeholder="Re-enter account number"
                      required
                    />
                    <FormField
                      label="IFSC Code"
                      name="bankDetails.ifscCode"
                      value={
                        getFormData(applicationFormHandler).bankDetails
                          ?.ifscCode || ""
                      }
                      onChange={handleInputChange(applicationFormHandler)}
                      placeholder="e.g., SBIN0001234"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Bank Name"
                      name="bankDetails.bankName"
                      value={
                        getFormData(applicationFormHandler).bankDetails
                          ?.bankName || ""
                      }
                      onChange={handleInputChange(applicationFormHandler)}
                      required
                    />
                    <FormField
                      label="Branch Name & Location"
                      name="bankDetails.branch"
                      value={
                        getFormData(applicationFormHandler).bankDetails
                          ?.branch || ""
                      }
                      onChange={handleInputChange(applicationFormHandler)}
                      placeholder="Branch name and city"
                      required
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="scheme" className="space-y-4">
                <h3 className="text-lg font-medium">
                  Scholarship Scheme Selection
                </h3>
                {selectedScheme && (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-lg">
                            Selected Scheme:
                          </span>
                          <Badge className="bg-blue-600 text-white">
                            {selectedScheme.name}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">
                            Scholarship Amount:
                          </span>
                          <span className="text-green-600 font-bold text-xl">
                            ₹{selectedScheme.amount.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Scheme Type:</span>
                          <span className="text-blue-600 font-medium">
                            {selectedScheme.type}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">
                            Eligibility Criteria:
                          </span>
                          <p className="text-sm text-gray-700 mt-1 p-2 bg-white rounded border">
                            {selectedScheme.eligibility}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">
                            Application Deadline:
                          </span>
                          <span className="text-red-600 font-medium">
                            {selectedScheme.deadline}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Description:</span>
                          <span className="text-sm text-gray-600">
                            {selectedScheme.description}
                          </span>
                        </div>
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                          <p className="text-sm text-yellow-800">
                            <strong>Important:</strong> Once submitted, you
                            cannot apply for another scholarship in the same
                            academic year for this program. Make sure all
                            details are correct before submission.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                <input
                  type="hidden"
                  name="schemeId"
                  value={selectedScheme?.id || ""}
                />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsApplyDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={applicationFormHandler.isSubmitting}
              >
                Submit Application
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Scholarship Dialog */}
      <Dialog
        open={isCreateScholarshipOpen}
        onOpenChange={setIsCreateScholarshipOpen}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Scholarship Scheme</DialogTitle>
            <DialogDescription>
              Add a new scholarship scheme for students to apply
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(
              createScholarshipHandler,
              onCreateScholarship
            )}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Scholarship Name"
                name="name"
                value={getFormData(createScholarshipHandler).name}
                onChange={handleInputChange(createScholarshipHandler)}
                placeholder="e.g., Merit Excellence Scholarship"
                required
              />
              <FormField
                label="Scholarship Type"
                name="type"
                type="select"
                value={getFormData(createScholarshipHandler).type}
                onChange={handleSelectChange(createScholarshipHandler, "type")}
                options={[
                  { label: "Merit Based", value: "Merit Based" },
                  { label: "Economic Based", value: "Economic Based" },
                  { label: "Reservation Based", value: "Reservation Based" },
                  { label: "Gender Based", value: "Gender Based" },
                  { label: "Sports Excellence", value: "Sports Excellence" },
                  {
                    label: "Cultural Excellence",
                    value: "Cultural Excellence",
                  },
                  {
                    label: "Research Excellence",
                    value: "Research Excellence",
                  },
                ]}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                label="Scholarship Amount (₹)"
                name="amount"
                type="number"
                min="1000"
                max="500000"
                value={getFormData(createScholarshipHandler).amount}
                onChange={handleInputChange(createScholarshipHandler)}
                placeholder="50000"
                required
              />
              <FormField
                label="Maximum Applications"
                name="maxApplications"
                type="number"
                min="1"
                max="1000"
                value={getFormData(createScholarshipHandler).maxApplications}
                onChange={handleInputChange(createScholarshipHandler)}
                placeholder="100"
                required
              />
              <FormField
                label="Status"
                name="status"
                type="select"
                value={getFormData(createScholarshipHandler).status}
                onChange={handleSelectChange(
                  createScholarshipHandler,
                  "status"
                )}
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                  { label: "Draft", value: "Draft" },
                ]}
                required
              />
            </div>

            <FormField
              label="Application Deadline"
              name="deadline"
              type="date"
              value={getFormData(createScholarshipHandler).deadline}
              onChange={handleInputChange(createScholarshipHandler)}
              required
            />

            <FormField
              label="Eligibility Criteria"
              name="eligibility"
              type="textarea"
              value={getFormData(createScholarshipHandler).eligibility}
              onChange={handleInputChange(createScholarshipHandler)}
              placeholder="e.g., CGPA > 8.0, Family Income < 5 Lakh, Category: General/OBC/SC/ST"
              rows={3}
              required
            />

            <FormField
              label="Description"
              name="description"
              type="textarea"
              value={getFormData(createScholarshipHandler).description}
              onChange={handleInputChange(createScholarshipHandler)}
              placeholder="Brief description of the scholarship purpose and benefits"
              rows={3}
              required
            />

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                📋 Scholarship Creation Guidelines
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ensure all eligibility criteria are clearly defined</li>
                <li>
                  • Set realistic deadlines allowing adequate application time
                </li>
                <li>• Amount should be within university scholarship budget</li>
                <li>
                  • Maximum applications should align with available budget
                </li>
                <li>
                  • Status 'Active' makes it visible to students immediately
                </li>
              </ul>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateScholarshipOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createScholarshipHandler.isSubmitting}
              >
                Create Scholarship
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Application Dialog */}
      <Dialog
        open={isViewApplicationOpen}
        onOpenChange={setIsViewApplicationOpen}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Reference: {selectedApplication?.referenceNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Student Name
                  </Label>
                  <div className="font-medium mt-1">
                    {selectedApplication.studentName}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Scheme
                  </Label>
                  <div className="font-medium mt-1">
                    {selectedApplication.schemeName}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Amount
                  </Label>
                  <div className="font-medium mt-1 text-green-600">
                    ₹{selectedApplication.amount.toLocaleString("en-IN")}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Status
                  </Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedApplication.status)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Disbursement
                  </Label>
                  <div className="mt-1">
                    {getDisbursementBadge(
                      selectedApplication.disbursementStatus
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Application Date
                  </Label>
                  <div className="font-medium mt-1">
                    {selectedApplication.applicationDate}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Academic Year
                  </Label>
                  <div className="font-medium mt-1">
                    {selectedApplication.academicYear}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Personal Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Phone:</strong>{" "}
                    {selectedApplication.personalDetails?.phone}
                  </div>
                  <div>
                    <strong>Email:</strong>{" "}
                    {selectedApplication.personalDetails?.email}
                  </div>
                  <div className="col-span-2">
                    <strong>Address:</strong>{" "}
                    {selectedApplication.personalDetails?.address}
                  </div>
                  <div>
                    <strong>Father's Name:</strong>{" "}
                    {selectedApplication.personalDetails?.fatherName}
                  </div>
                  <div>
                    <strong>Mother's Name:</strong>{" "}
                    {selectedApplication.personalDetails?.motherName}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Academic Details</h4>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <strong>Semester:</strong> {selectedApplication.semester}
                  </div>
                  <div>
                    <strong>CGPA:</strong> {selectedApplication.cgpa}
                  </div>
                  <div>
                    <strong>Attendance:</strong>{" "}
                    {selectedApplication.attendancePercentage}%
                  </div>
                  <div>
                    <strong>Category:</strong> {selectedApplication.category}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Economic Details</h4>
                <div className="text-sm">
                  <strong>Family Income:</strong> ₹
                  {selectedApplication.familyIncome?.toLocaleString("en-IN")}
                </div>
              </div>

              {selectedApplication.bankDetails && (
                <div className="space-y-4">
                  <h4 className="font-medium">Bank Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Bank:</strong>{" "}
                      {selectedApplication.bankDetails.bankName}
                    </div>
                    <div>
                      <strong>Branch:</strong>{" "}
                      {selectedApplication.bankDetails.branch}
                    </div>
                    <div>
                      <strong>Account Number:</strong> ****
                      {selectedApplication.bankDetails.accountNumber?.slice(-4)}
                    </div>
                    <div>
                      <strong>IFSC Code:</strong>{" "}
                      {selectedApplication.bankDetails.ifscCode}
                    </div>
                  </div>
                </div>
              )}

              {selectedApplication.rejectionReason && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-900">Rejection Reason</h4>
                  <p className="text-sm text-red-800 mt-1">
                    {selectedApplication.rejectionReason}
                  </p>
                </div>
              )}

              {/* AM42: Application History Tracking */}
              {selectedApplication.applicationHistory &&
                selectedApplication.applicationHistory.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Application History & Status Timeline
                    </h4>
                    <div className="space-y-3">
                      {selectedApplication.applicationHistory.map(
                        (history, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500"
                          >
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-blue-600">
                                  {index + 1}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-medium text-gray-900">
                                    {history.action}
                                  </h5>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {history.remarks}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-medium text-gray-900">
                                    {history.status}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(history.date).toLocaleDateString(
                                      "en-IN",
                                      {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Additional Information for Admin */}
              {hasPermission("viewAll") && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700 border-t pt-4">
                    Administrative Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Student ID:</strong>{" "}
                      {selectedApplication.studentId}
                    </div>
                    <div>
                      <strong>Submission Time:</strong>{" "}
                      {selectedApplication.submissionTime
                        ? new Date(
                            selectedApplication.submissionTime
                          ).toLocaleString("en-IN")
                        : "Not Available"}
                    </div>
                    <div>
                      <strong>Academic Year:</strong>{" "}
                      {selectedApplication.academicYear}
                    </div>
                    <div>
                      <strong>Program:</strong> {selectedApplication.program}
                    </div>
                    {selectedApplication.attendancePercentage && (
                      <div>
                        <strong>Attendance:</strong>{" "}
                        {selectedApplication.attendancePercentage}%
                      </div>
                    )}
                    {selectedApplication.isReapplication && (
                      <div className="col-span-2">
                        <strong>Reapplication:</strong>
                        <span className="ml-2 text-orange-600">
                          Yes (Original Ref:{" "}
                          {selectedApplication.originalReference})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsViewApplicationOpen(false)}
            >
              Close
            </Button>
            {currentUser.role === "Student" &&
              selectedApplication?.status === "Rejected" &&
              canStudentApply(selectedApplication.schemeId) && (
                <Button
                  onClick={() => {
                    setSelectedScheme(
                      schemes.find((s) => s.id === selectedApplication.schemeId)
                    );
                    setIsViewApplicationOpen(false);
                    setIsReapplyDialogOpen(true);
                  }}
                >
                  🔄 Reapply (Referencing: {selectedApplication.referenceNumber}
                  )
                </Button>
              )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Approval Status Dialog */}
      <Dialog open={isUpdateStatusOpen} onOpenChange={setIsUpdateStatusOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Approval Status</DialogTitle>
            <DialogDescription>
              Update the application approval status
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(statusUpdateHandler, onUpdateApprovalStatus)}
            className="space-y-4"
          >
            <FormField
              label="Status"
              name="status"
              type="select"
              value={getFormData(statusUpdateHandler).status}
              onChange={handleSelectChange(statusUpdateHandler, "status")}
              options={[
                { label: "Approved", value: "Approved" },
                { label: "Rejected", value: "Rejected" },
                { label: "Under Review", value: "Under Review" },
              ]}
              required
            />
            <FormField
              label="Remarks"
              name="remarks"
              type="textarea"
              value={getFormData(statusUpdateHandler).remarks}
              onChange={handleInputChange(statusUpdateHandler)}
              placeholder="Add remarks or rejection reason"
              rows={3}
            />
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUpdateStatusOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={statusUpdateHandler.isSubmitting}>
                Update Status
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Update Disbursement Dialog */}
      <Dialog
        open={isUpdateDisbursementOpen}
        onOpenChange={setIsUpdateDisbursementOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Disbursement Details</DialogTitle>
            <DialogDescription>
              Update payment and disbursement information
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(disbursementHandler, onUpdateDisbursement)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Disbursement Status"
                name="disbursementStatus"
                type="select"
                value={getFormData(disbursementHandler).disbursementStatus}
                onChange={handleSelectChange(
                  disbursementHandler,
                  "disbursementStatus"
                )}
                options={[
                  { label: "Disbursed", value: "Disbursed" },
                  { label: "Pending", value: "Pending" },
                  { label: "Processing", value: "Processing" },
                ]}
                required
              />
              <FormField
                label="Disbursement Date"
                name="disbursementDate"
                type="date"
                value={getFormData(disbursementHandler).disbursementDate}
                onChange={handleInputChange(disbursementHandler)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Payment Mode"
                name="paymentMode"
                type="select"
                value={getFormData(disbursementHandler).paymentMode}
                onChange={handleSelectChange(
                  disbursementHandler,
                  "paymentMode"
                )}
                options={[
                  {
                    label: "Direct Bank Transfer",
                    value: "Direct Bank Transfer",
                  },
                  { label: "Cheque", value: "Cheque" },
                  { label: "UPI", value: "UPI" },
                  { label: "NEFT/RTGS", value: "NEFT/RTGS" },
                ]}
              />
              <FormField
                label="Transaction ID"
                name="transactionId"
                value={getFormData(disbursementHandler).transactionId}
                onChange={handleInputChange(disbursementHandler)}
                placeholder="TXN123456789"
              />
            </div>
            <FormField
              label="Remarks"
              name="remarks"
              type="textarea"
              value={getFormData(disbursementHandler).remarks}
              onChange={handleInputChange(disbursementHandler)}
              placeholder="Payment processing notes"
              rows={3}
            />
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUpdateDisbursementOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={disbursementHandler.isSubmitting}>
                Update Payment
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Track Application Dialog */}
      <Dialog open={isTrackDialogOpen} onOpenChange={setIsTrackDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Track Application</DialogTitle>
            <DialogDescription>
              Enter application reference number to track status
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="SCH2024001"
              value={trackingReference}
              onChange={(e) => setTrackingReference(e.target.value)}
              className="font-mono"
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsTrackDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={trackApplication} disabled={!trackingReference}>
                Track Application
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reapplication Dialog */}
      <Dialog open={isReapplyDialogOpen} onOpenChange={setIsReapplyDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Reapply for Scholarship: {selectedScheme?.name}
            </DialogTitle>
            <DialogDescription>
              🔄 This is a reapplication for a previously rejected scholarship.
              Reference to original application:{" "}
              {selectedApplication?.referenceNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="font-medium text-orange-900 mb-2">
              Previous Application Details
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Original Reference:</strong>{" "}
                {selectedApplication?.referenceNumber}
              </div>
              <div>
                <strong>Rejection Date:</strong>{" "}
                {selectedApplication?.approvalDate}
              </div>
              <div className="col-span-2">
                <strong>Rejection Reason:</strong>{" "}
                {selectedApplication?.rejectionReason}
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(applicationFormHandler, (data) =>
              onApplyForScholarship({
                ...data,
                isReapplication: true,
                originalReference: selectedApplication?.referenceNumber,
              })
            )}
            className="space-y-6"
          >
            <Tabs defaultValue="personal">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="reservation">Reservation</TabsTrigger>
                <TabsTrigger value="economic">Economic</TabsTrigger>
                <TabsTrigger value="scheme">Scheme</TabsTrigger>
              </TabsList>

              {/* Same form content as apply dialog but with pre-filled data from previous application */}
              <TabsContent value="personal" className="space-y-4">
                <h3 className="text-lg font-medium">
                  Personal Details (Update if needed)
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    label="Full Name"
                    name="personalDetails.fullName"
                    value={
                      getFormData(applicationFormHandler).personalDetails
                        ?.fullName ||
                      selectedApplication?.personalDetails?.fullName ||
                      currentUser.name
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    required
                    disabled
                  />
                  <FormField
                    label="Date of Birth"
                    name="personalDetails.dob"
                    type="date"
                    value={
                      getFormData(applicationFormHandler).personalDetails
                        ?.dob || currentUser.dob
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    required
                  />
                  <FormField
                    label="Gender"
                    name="personalDetails.gender"
                    type="select"
                    value={
                      getFormData(applicationFormHandler).personalDetails
                        ?.gender || currentUser.gender
                    }
                    onChange={handleSelectChange(
                      applicationFormHandler,
                      "personalDetails.gender"
                    )}
                    options={[
                      { label: "Male", value: "Male" },
                      { label: "Female", value: "Female" },
                      { label: "Other", value: "Other" },
                    ]}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Phone Number"
                    name="personalDetails.phone"
                    value={
                      getFormData(applicationFormHandler).personalDetails
                        ?.phone ||
                      selectedApplication?.personalDetails?.phone ||
                      currentUser.contact
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    placeholder="+91-9876543210"
                    required
                  />
                  <FormField
                    label="Email Address"
                    name="personalDetails.email"
                    type="email"
                    value={
                      getFormData(applicationFormHandler).personalDetails
                        ?.email ||
                      selectedApplication?.personalDetails?.email ||
                      currentUser.email
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    placeholder="student@university.edu"
                    required
                  />
                </div>
                <FormField
                  label="Complete Residential Address"
                  name="personalDetails.address"
                  type="textarea"
                  value={
                    getFormData(applicationFormHandler).personalDetails
                      ?.address ||
                    selectedApplication?.personalDetails?.address ||
                    currentUser.address
                  }
                  onChange={handleInputChange(applicationFormHandler)}
                  placeholder="House/Flat No., Street, Area, City, State, PIN Code"
                  rows={3}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Father's Name"
                    name="personalDetails.fatherName"
                    value={
                      getFormData(applicationFormHandler).personalDetails
                        ?.fatherName ||
                      selectedApplication?.personalDetails?.fatherName ||
                      ""
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    required
                  />
                  <FormField
                    label="Mother's Name"
                    name="personalDetails.motherName"
                    value={
                      getFormData(applicationFormHandler).personalDetails
                        ?.motherName ||
                      selectedApplication?.personalDetails?.motherName ||
                      ""
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    required
                  />
                </div>
              </TabsContent>

              <TabsContent value="academic" className="space-y-4">
                <h3 className="text-lg font-medium">
                  Updated Academic Information
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    label="Course/Program"
                    name="academicDetails.program"
                    value={
                      getFormData(applicationFormHandler).academicDetails
                        ?.program || currentUser.program
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    disabled
                    required
                  />
                  <FormField
                    label="Current Semester"
                    name="academicDetails.semester"
                    type="select"
                    value={
                      getFormData(applicationFormHandler).academicDetails
                        ?.semester ||
                      (currentUser.semester
                        ? currentUser.semester.toString()
                        : "1")
                    }
                    onChange={handleSelectChange(
                      applicationFormHandler,
                      "academicDetails.semester"
                    )}
                    options={[
                      { label: "Semester 1", value: "1" },
                      { label: "Semester 2", value: "2" },
                      { label: "Semester 3", value: "3" },
                      { label: "Semester 4", value: "4" },
                      { label: "Semester 5", value: "5" },
                      { label: "Semester 6", value: "6" },
                      { label: "Semester 7", value: "7" },
                      { label: "Semester 8", value: "8" },
                    ]}
                    required
                  />
                  <FormField
                    label="Department"
                    name="academicDetails.department"
                    value={
                      getFormData(applicationFormHandler).academicDetails
                        ?.department || currentUser.department
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    disabled
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Updated CGPA"
                    name="academicDetails.cgpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={
                      getFormData(applicationFormHandler).academicDetails
                        ?.cgpa || ""
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    placeholder="8.50 (improved from previous)"
                    required
                  />
                  <FormField
                    label="Current Attendance Percentage (%)"
                    name="academicDetails.attendance"
                    type="number"
                    min="0"
                    max="100"
                    value={
                      getFormData(applicationFormHandler).academicDetails
                        ?.attendance || ""
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    placeholder="85 (improved attendance)"
                    required
                  />
                </div>
              </TabsContent>

              <TabsContent value="reservation" className="space-y-4">
                <h3 className="text-lg font-medium">Caste/Community Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Category"
                    name="category"
                    type="select"
                    value={
                      getFormData(applicationFormHandler).category ||
                      selectedApplication?.category ||
                      ""
                    }
                    onChange={handleSelectChange(
                      applicationFormHandler,
                      "category"
                    )}
                    options={[
                      { label: "General", value: "General" },
                      { label: "OBC (Other Backward Class)", value: "OBC" },
                      { label: "SC (Scheduled Caste)", value: "SC" },
                      { label: "ST (Scheduled Tribe)", value: "ST" },
                      {
                        label: "EWS (Economically Weaker Section)",
                        value: "EWS",
                      },
                    ]}
                    required
                  />
                  <FormField
                    label="Sub-Category (if applicable)"
                    name="subCategory"
                    value={
                      getFormData(applicationFormHandler).subCategory || ""
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    placeholder="e.g., 2A, 2B, 3A, 3B"
                  />
                </div>
              </TabsContent>

              <TabsContent value="economic" className="space-y-4">
                <h3 className="text-lg font-medium">
                  Updated Economic Background
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Current Family Annual Income (₹)"
                    name="familyIncome"
                    type="number"
                    value={
                      getFormData(applicationFormHandler).familyIncome || ""
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    placeholder="Updated income amount"
                    required
                  />
                  <FormField
                    label="Income Change Reason"
                    name="incomeChangeReason"
                    value={
                      getFormData(applicationFormHandler).incomeChangeReason ||
                      ""
                    }
                    onChange={handleInputChange(applicationFormHandler)}
                    placeholder="Reason for income change (if any)"
                  />
                </div>
              </TabsContent>

              <TabsContent value="scheme" className="space-y-4">
                <h3 className="text-lg font-medium">
                  Reapplication for Same Scheme
                </h3>
                {selectedScheme && (
                  <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-lg">
                            Reapplying for:
                          </span>
                          <Badge className="bg-orange-600 text-white">
                            {selectedScheme.name}
                          </Badge>
                        </div>
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-sm text-red-800">
                            <strong>Previous Rejection Reason:</strong>{" "}
                            {selectedApplication?.rejectionReason}
                          </p>
                        </div>
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                          <p className="text-sm text-green-800">
                            <strong>What to improve:</strong> Please ensure you
                            meet all eligibility criteria and provide
                            updated/corrected information.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                <input
                  type="hidden"
                  name="schemeId"
                  value={selectedScheme?.id || ""}
                />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsReapplyDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={applicationFormHandler.isSubmitting}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Submit Reapplication
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
