import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/forms/FormField';
import { useFormHandler } from '@/hooks/useFormHandlers';
import { 
  UserCheck, Calendar, Search, Edit, Download, Upload, CheckCircle, XCircle, Clock, 
  Settings, Wifi, Shield, AlertTriangle, Bell, FileText, Eye, Plus, 
  MoreHorizontal, Filter, RefreshCw, Scan, Fingerprint, CreditCard,
  Users, BookOpen, Send, MessageSquare, Check, X, CalendarDays,
  BarChart3, TrendingUp, Activity, Smartphone, Monitor, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// User role simulation - in real app this would come from auth context
const getCurrentUserRole = () => {
  // For demo purposes, you can change this to test different roles
  return 'admin'; // 'admin', 'faculty', 'student', 'parent'
};

const getCurrentUser = () => {
  const role = getCurrentUserRole();
  const users = {
    admin: { id: 'admin1', name: 'Manikandan', role: 'admin', department: 'Administration' },
    faculty: { id: 'faculty1', name: 'Dr.Sarasvathi', role: 'faculty', department: 'Computer Science', classes: ['CSE-5A', 'CSE-5B'] },
    student: { id: 'student1', name: 'Abishek', role: 'student', program: 'B.Tech CSE', semester: '5', section: 'A', rollNumber: 'CSE2021001' },
    parent: { id: 'parent1', name: 'Ravi', role: 'parent', children: [{ id: 'student1', name: 'Kumar', program: 'B.Tech CSE', semester: '5', rollNumber: 'CSE2021001' }] }
  };
  return users[role as keyof typeof users];
};

// Mock data
const attendanceData = [
  { 
    id: 'CSE2021001', 
    name: 'Abinesh', 
    course: 'B.Tech Computer Science', 
    year: '3rd Year', 
    semester: 'Semester 5',
    section: 'A',
    present: 85, 
    absent: 12, 
    excused: 3, 
    late: 5, 
    percentage: 85.0, 
    status: 'Present',
    lastMarked: '2024-01-15 09:30',
    rollNumber: 'CSE2021001',
    todayStatus: 'present',
    biometricId: 'BIO001'
  },
  { 
    id: 'CSE2021002', 
    name: 'Priya', 
    course: 'B.Tech Computer Science', 
    year: '3rd Year', 
    semester: 'Semester 5',
    section: 'A',
    present: 92, 
    absent: 5, 
    excused: 1, 
    late: 2, 
    percentage: 92.0, 
    status: 'Present',
    lastMarked: '2024-01-15 09:28',
    rollNumber: 'CSE2021002',
    todayStatus: 'present',
    biometricId: 'BIO002'
  },
  { 
    id: 'CSE2021003', 
    name: 'Rajesh Kumar', 
    course: 'B.Tech Computer Science', 
    year: '3rd Year', 
    semester: 'Semester 5',
    section: 'A',
    present: 78, 
    absent: 18, 
    excused: 2, 
    late: 2, 
    percentage: 78.0, 
    status: 'Absent',
    lastMarked: '2024-01-14 09:30',
    rollNumber: 'CSE2021003',
    todayStatus: 'absent',
    biometricId: 'BIO003'
  },
  {
    id: 'CSE2021004',
    name: 'Deepika S',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
    semester: 'Semester 5',
    section: 'B',
    present: 82,
    absent: 12,
    excused: 2,
    late: 4,
    percentage: 82.0,
    status: 'Present',
    lastMarked: '2024-01-15 09:30',
    rollNumber: 'CSE2021004',
    todayStatus: 'present',
    biometricId: 'BIO004'
  },
  {
    id: 'CSE2021005',
    name: 'Vignesh R',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
    semester: 'Semester 5',
    section: 'C',
    present: 74,
    absent: 18,
    excused: 3,
    late: 5,
    percentage: 74.0,
    status: 'Absent',
    lastMarked: '2024-01-16 09:30',
    rollNumber: 'CSE2021005',
    todayStatus: 'absent',
    biometricId: 'BIO005'
  },
  {
    id: 'CSE2021006',
    name: 'Meena P',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
    semester: 'Semester 5',
    section: 'A',
    present: 85,
    absent: 10,
    excused: 2,
    late: 3,
    percentage: 85.0,
    status: 'Present',
    lastMarked: '2024-01-17 09:30',
    rollNumber: 'CSE2021006',
    todayStatus: 'present',
    biometricId: 'BIO006'
  },
  {
    id: 'CSE2021007',
    name: 'Karthik M',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
    semester: 'Semester 5',
    section: 'B',
    present: 67,
    absent: 22,
    excused: 4,
    late: 2,
    percentage: 67.0,
    status: 'Absent',
    lastMarked: '2024-01-18 09:30',
    rollNumber: 'CSE2021007',
    todayStatus: 'absent',
    biometricId: 'BIO007'
  },
  {
    id: 'CSE2021008',
    name: 'Anitha L',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
    semester: 'Semester 5',
    section: 'C',
    present: 79,
    absent: 14,
    excused: 1,
    late: 2,
    percentage: 79.0,
    status: 'Present',
    lastMarked: '2024-01-19 09:30',
    rollNumber: 'CSE2021008',
    todayStatus: 'present',
    biometricId: 'BIO008'
  },
  {
    id: 'CSE2021009',
    name: 'Surya V',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
    semester: 'Semester 5',
    section: 'A',
    present: 88,
    absent: 8,
    excused: 1,
    late: 3,
    percentage: 88.0,
    status: 'Present',
    lastMarked: '2024-01-20 09:30',
    rollNumber: 'CSE2021009',
    todayStatus: 'present',
    biometricId: 'BIO009'
  },
  {
    id: 'CSE2021010',
    name: 'Kavya N',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
    semester: 'Semester 5',
    section: 'B',
    present: 72,
    absent: 19,
    excused: 3,
    late: 2,
    percentage: 72.0,
    status: 'Absent',
    lastMarked: '2024-01-21 09:30',
    rollNumber: 'CSE2021010',
    todayStatus: 'absent',
    biometricId: 'BIO010'
  },
  {
    id: 'CSE2021011',
    name: 'Ramesh D',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
    semester: 'Semester 5',
    section: 'C',
    present: 83,
    absent: 11,
    excused: 2,
    late: 4,
    percentage: 83.0,
    status: 'Present',
    lastMarked: '2024-01-22 09:30',
    rollNumber: 'CSE2021011',
    todayStatus: 'present',
    biometricId: 'BIO011'
  },
  {
    id: 'CSE2021012',
    name: 'Divya K',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
    semester: 'Semester 5',
    section: 'A',
    present: 70,
    absent: 22,
    excused: 1,
    late: 3,
    percentage: 70.0,
    status: 'Absent',
    lastMarked: '2024-01-23 09:30',
    rollNumber: 'CSE2021012',
    todayStatus: 'absent',
    biometricId: 'BIO012'
  },
  {
    id: 'CSE2021013',
    name: 'Santhosh B',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
    semester: 'Semester 5',
    section: 'B',
    present: 90,
    absent: 6,
    excused: 2,
    late: 2,
    percentage: 90.0,
    status: 'Present',
    lastMarked: '2024-01-24 09:30',
    rollNumber: 'CSE2021013',
    todayStatus: 'present',
    biometricId: 'BIO013'
  },
  {
    id: 'CSE2021014',
    name: 'Lavanya R',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
    semester: 'Semester 5',
    section: 'C',
    present: 76,
    absent: 18,
    excused: 3,
    late: 3,
    percentage: 76.0,
    status: 'Present',
    lastMarked: '2024-01-25 09:30',
    rollNumber: 'CSE2021014',
    todayStatus: 'present',
    biometricId: 'BIO014'
  },
  {
    id: 'CSE2021015',
    name: 'Arun Prasad',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
    semester: 'Semester 5',
    section: 'A',
    present: 69,
    absent: 20,
    excused: 4,
    late: 3,
    percentage: 69.0,
    status: 'Absent',
    lastMarked: '2024-01-26 09:30',
    rollNumber: 'CSE2021015',
    todayStatus: 'absent',
    biometricId: 'BIO015'
  },
  {
    id: 'CSE2021016',
    name: 'Priya M',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
    semester: 'Semester 5',
    section: 'B',
    present: 87,
    absent: 9,
    excused: 1,
    late: 3,
    percentage: 87.0,
    status: 'Present',
    lastMarked: '2024-01-27 09:30',
    rollNumber: 'CSE2021016',
    todayStatus: 'present',
    biometricId: 'BIO016'
  },
  {
    id: 'CSE2021017',
    name: 'Sathish K',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
    semester: 'Semester 5',
    section: 'C',
    present: 80,
    absent: 14,
    excused: 2,
    late: 4,
    percentage: 80.0,
    status: 'Present',
    lastMarked: '2024-01-28 09:30',
    rollNumber: 'CSE2021017',
    todayStatus: 'present',
    biometricId: 'BIO017'
  },
  {
    id: 'CSE2021018',
    name: 'Divyashree S',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
    semester: 'Semester 5',
    section: 'A',
    present: 65,
    absent: 25,
    excused: 3,
    late: 2,
    percentage: 65.0,
    status: 'Absent',
    lastMarked: '2024-01-29 09:30',
    rollNumber: 'CSE2021018',
    todayStatus: 'absent',
    biometricId: 'BIO018'
  },
  {
    id: 'CSE2021019',
    name: 'Ganesh R',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
    semester: 'Semester 5',
    section: 'B',
    present: 92,
    absent: 5,
    excused: 1,
    late: 2,
    percentage: 92.0,
    status: 'Present',
    lastMarked: '2024-01-30 09:30',
    rollNumber: 'CSE2021019',
    todayStatus: 'present',
    biometricId: 'BIO019'
  },
  {
    id: 'CSE2021020',
    name: 'Keerthana D',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
    semester: 'Semester 5',
    section: 'C',
    present: 81,
    absent: 13,
    excused: 2,
    late: 4,
    percentage: 81.0,
    status: 'Present',
    lastMarked: '2024-01-31 09:30',
    rollNumber: 'CSE2021020',
    todayStatus: 'present',
    biometricId: 'BIO020'
  }

];

const leaveApplications = [
  {
    id: 'LEAVE001',
    studentId: 'CSE2021001',
    studentName: 'Abinaya',
    rollNumber: 'CSE2021001',
    reason: 'Medical appointment',
    startDate: '2024-01-16',
    endDate: '2024-01-16',
    status: 'pending',
    appliedDate: '2024-01-15',
    document: 'medical_certificate.pdf',
    faculty: 'Dr. Sarah '
  },
  {
    id: 'LEAVE002',
    studentId: 'CSE2021002',
    studentName: 'Priya',
    rollNumber: 'CSE2021002',
    reason: 'Family emergency',
    startDate: '2024-01-18',
    endDate: '2024-01-20',
    status: 'approved',
    appliedDate: '2024-01-12',
    approvedBy: 'Dr. Sarah Johnson',
    approvedDate: '2024-01-13'
  },
  {
    id: 'LEAVE003',
    studentId: 'CSE2021003',
    studentName: 'Keerthi',
    rollNumber: 'CSE2021003',
    reason: 'Fever and cold',
    startDate: '2024-01-18',
    endDate: '2024-01-19',
    status: 'approved',
    appliedDate: '2024-01-17',
    document: 'doctor_note.pdf',
    faculty: 'Dr. Kavitha'
  },
  {
    id: 'LEAVE004',
    studentId: 'CSE2021004',
    studentName: 'Pranav',
    rollNumber: 'CSE2021004',
    reason: 'Travel to hometown',
    startDate: '2024-01-20',
    endDate: '2024-01-22',
    status: 'pending',
    appliedDate: '2024-01-18',
    document: 'train_ticket.pdf',
    faculty: 'Dr. Arul'
  },
  {
    id: 'LEAVE005',
    studentId: 'CSE2021005',
    studentName: 'Nivetha',
    rollNumber: 'CSE2021005',
    reason: 'Eye checkup',
    startDate: '2024-01-21',
    endDate: '2024-01-21',
    status: 'rejected',
    appliedDate: '2024-01-20',
    document: 'eye_test_report.pdf',
    faculty: 'Dr. Suresh'
  },
  {
    id: 'LEAVE006',
    studentId: 'CSE2021006',
    studentName: 'Vignesh',
    rollNumber: 'CSE2021006',
    reason: 'Personal work',
    startDate: '2024-01-23',
    endDate: '2024-01-23',
    status: 'approved',
    appliedDate: '2024-01-22',
    document: 'self_request.pdf',
    faculty: 'Dr. Priya'
  },
  {
    id: 'LEAVE007',
    studentId: 'CSE2021007',
    studentName: 'Divya',
    rollNumber: 'CSE2021007',
    reason: 'Headache and rest',
    startDate: '2024-01-24',
    endDate: '2024-01-24',
    status: 'pending',
    appliedDate: '2024-01-23',
    document: 'doctor_prescription.pdf',
    faculty: 'Dr. Ravi'
  },
  {
    id: 'LEAVE008',
    studentId: 'CSE2021008',
    studentName: 'Harish',
    rollNumber: 'CSE2021008',
    reason: 'Festival celebration',
    startDate: '2024-01-25',
    endDate: '2024-01-26',
    status: 'approved',
    appliedDate: '2024-01-24',
    document: 'festival_letter.pdf',
    faculty: 'Dr. Meena'
  },
  {
    id: 'LEAVE009',
    studentId: 'CSE2021009',
    studentName: 'Swathi',
    rollNumber: 'CSE2021009',
    reason: 'Hospital admission',
    startDate: '2024-01-27',
    endDate: '2024-01-30',
    status: 'approved',
    appliedDate: '2024-01-26',
    document: 'admission_slip.pdf',
    faculty: 'Dr. Naveen'
  },
  {
    id: 'LEAVE010',
    studentId: 'CSE2021010',
    studentName: 'Karthik',
    rollNumber: 'CSE2021010',
    reason: 'Family function',
    startDate: '2024-01-28',
    endDate: '2024-01-29',
    status: 'pending',
    appliedDate: '2024-01-27',
    document: 'invitation_card.pdf',
    faculty: 'Dr. Shalini'
  },
  {
    id: 'LEAVE011',
    studentId: 'CSE2021011',
    studentName: 'Anusha',
    rollNumber: 'CSE2021011',
    reason: 'Dental checkup',
    startDate: '2024-01-30',
    endDate: '2024-01-30',
    status: 'approved',
    appliedDate: '2024-01-29',
    document: 'dental_report.pdf',
    faculty: 'Dr. Gokul'
  },
  {
    id: 'LEAVE012',
    studentId: 'CSE2021012',
    studentName: 'Saravanan',
    rollNumber: 'CSE2021012',
    reason: 'Interview preparation',
    startDate: '2024-01-31',
    endDate: '2024-02-01',
    status: 'pending',
    appliedDate: '2024-01-30',
    document: 'interview_call_letter.pdf',
    faculty: 'Dr. Yamuna'
  },
  {
    id: 'LEAVE013',
    studentId: 'CSE2021013',
    studentName: 'Meena',
    rollNumber: 'CSE2021013',
    reason: 'Health issue',
    startDate: '2024-02-02',
    endDate: '2024-02-03',
    status: 'approved',
    appliedDate: '2024-02-01',
    document: 'medical_slip.pdf',
    faculty: 'Dr. Arvind'
  },
  {
    id: 'LEAVE014',
    studentId: 'CSE2021014',
    studentName: 'Bharath',
    rollNumber: 'CSE2021014',
    reason: 'Relative’s wedding',
    startDate: '2024-02-04',
    endDate: '2024-02-05',
    status: 'approved',
    appliedDate: '2024-02-02',
    document: 'wedding_invite.pdf',
    faculty: 'Dr. Sneha'
  },
  {
    id: 'LEAVE015',
    studentId: 'CSE2021015',
    studentName: 'Soundarya',
    rollNumber: 'CSE2021015',
    reason: 'Vaccination side effects',
    startDate: '2024-02-06',
    endDate: '2024-02-06',
    status: 'pending',
    appliedDate: '2024-02-05',
    document: 'vaccine_report.pdf',
    faculty: 'Dr. Nithya'
  },
  {
    id: 'LEAVE016',
    studentId: 'CSE2021016',
    studentName: 'Yuvan',
    rollNumber: 'CSE2021016',
    reason: 'Back pain',
    startDate: '2024-02-07',
    endDate: '2024-02-08',
    status: 'rejected',
    appliedDate: '2024-02-06',
    document: 'xray_report.pdf',
    faculty: 'Dr. Vikram'
  },
  {
    id: 'LEAVE017',
    studentId: 'CSE2021017',
    studentName: 'Sandhya',
    rollNumber: 'CSE2021017',
    reason: 'Exam preparation',
    startDate: '2024-02-09',
    endDate: '2024-02-10',
    status: 'approved',
    appliedDate: '2024-02-08',
    document: 'exam_schedule.pdf',
    faculty: 'Dr. Deepak'
  },
  {
    id: 'LEAVE018',
    studentId: 'CSE2021018',
    studentName: 'Naveen',
    rollNumber: 'CSE2021018',
    reason: 'Skin allergy',
    startDate: '2024-02-11',
    endDate: '2024-02-12',
    status: 'pending',
    appliedDate: '2024-02-10',
    document: 'skin_report.pdf',
    faculty: 'Dr. Latha'
  },
  {
    id: 'LEAVE019',
    studentId: 'CSE2021019',
    studentName: 'Revathi',
    rollNumber: 'CSE2021019',
    reason: 'Cold and cough',
    startDate: '2024-02-13',
    endDate: '2024-02-13',
    status: 'approved',
    appliedDate: '2024-02-12',
    document: 'clinic_slip.pdf',
    faculty: 'Dr. Kumar'
  },
  {
    id: 'LEAVE020',
    studentId: 'CSE2021020',
    studentName: 'Hariharan',
    rollNumber: 'CSE2021020',
    reason: 'Parent illness',
    startDate: '2024-02-14',
    endDate: '2024-02-15',
    status: 'pending',
    appliedDate: '2024-02-13',
    document: 'hospital_report.pdf',
    faculty: 'Dr. Gayathri'
  },
  {
    id: 'LEAVE021',
    studentId: 'CSE2021021',
    studentName: 'Anitha',
    rollNumber: 'CSE2021021',
    reason: 'Grandmother unwell',
    startDate: '2024-02-16',
    endDate: '2024-02-17',
    status: 'approved',
    appliedDate: '2024-02-15',
    document: 'medical_letter.pdf',
    faculty: 'Dr. Shankar'
  },
  {
    id: 'LEAVE022',
    studentId: 'CSE2021022',
    studentName: 'Gokul',
    rollNumber: 'CSE2021022',
    reason: 'Bike accident recovery',
    startDate: '2024-02-18',
    endDate: '2024-02-21',
    status: 'pending',
    appliedDate: '2024-02-17',
    document: 'accident_report.pdf',
    faculty: 'Dr. Kalpana'
  },
  {
    id: 'LEAVE023',
    studentId: 'CSE2021023',
    studentName: 'Deepika',
    rollNumber: 'CSE2021023',
    reason: 'Menstrual cramps',
    startDate: '2024-02-22',
    endDate: '2024-02-22',
    status: 'approved',
    appliedDate: '2024-02-21',
    document: 'self_note.pdf',
    faculty: 'Dr. Murali'
  },
  {
    id: 'LEAVE024',
    studentId: 'CSE2021024',
    studentName: 'Pradeep',
    rollNumber: 'CSE2021024',
    reason: 'Electrician appointment at home',
    startDate: '2024-02-23',
    endDate: '2024-02-23',
    status: 'rejected',
    appliedDate: '2024-02-22',
    document: 'appointment_receipt.pdf',
    faculty: 'Dr. Geetha'
  },
  {
    id: 'LEAVE025',
    studentId: 'CSE2021025',
    studentName: 'Ragini',
    rollNumber: 'CSE2021025',
    reason: 'Eye irritation',
    startDate: '2024-02-24',
    endDate: '2024-02-25',
    status: 'approved',
    appliedDate: '2024-02-23',
    document: 'eye_report.pdf',
    faculty: 'Dr. Elango'
  },
  {
    id: 'LEAVE026',
    studentId: 'CSE2021026',
    studentName: 'Vijay',
    rollNumber: 'CSE2021026',
    reason: 'Workshop attendance in Chennai',
    startDate: '2024-02-26',
    endDate: '2024-02-27',
    status: 'pending',
    appliedDate: '2024-02-24',
    document: 'workshop_letter.pdf',
    faculty: 'Dr. Latha'
  },
  {
    id: 'LEAVE027',
    studentId: 'CSE2021027',
    studentName: 'Sneha',
    rollNumber: 'CSE2021027',
    reason: 'Sister’s marriage',
    startDate: '2024-02-28',
    endDate: '2024-03-01',
    status: 'approved',
    appliedDate: '2024-02-26',
    document: 'wedding_invite.pdf',
    faculty: 'Dr. Baskar'
  },
  {
    id: 'LEAVE028',
    studentId: 'CSE2021028',
    studentName: 'Rajkumar',
    rollNumber: 'CSE2021028',
    reason: 'Bus strike',
    startDate: '2024-03-02',
    endDate: '2024-03-02',
    status: 'approved',
    appliedDate: '2024-03-01',
    document: 'news_cutting.pdf',
    faculty: 'Dr. Selvi'
  },
  {
    id: 'LEAVE029',
    studentId: 'CSE2021029',
    studentName: 'Lavanya',
    rollNumber: 'CSE2021029',
    reason: 'Leg pain due to long walk',
    startDate: '2024-03-03',
    endDate: '2024-03-04',
    status: 'pending',
    appliedDate: '2024-03-02',
    document: 'medical_note.pdf',
    faculty: 'Dr. Mohan'
  },
  {
    id: 'LEAVE030',
    studentId: 'CSE2021030',
    studentName: 'Karthika',
    rollNumber: 'CSE2021030',
    reason: 'Mobile service appointment',
    startDate: '2024-03-05',
    endDate: '2024-03-05',
    status: 'rejected',
    appliedDate: '2024-03-04',
    document: 'service_receipt.pdf',
    faculty: 'Dr. Preethi'
  },
  {
    id: 'LEAVE031',
    studentId: 'CSE2021031',
    studentName: 'Naveen',
    rollNumber: 'CSE2021031',
    reason: 'Dental check-up',
    startDate: '2024-03-06',
    endDate: '2024-03-06',
    status: 'approved',
    appliedDate: '2024-03-05',
    document: 'dental_report.pdf',
    faculty: 'Dr. Janani'
  },
  {
    id: 'LEAVE032',
    studentId: 'CSE2021032',
    studentName: 'Meena',
    rollNumber: 'CSE2021032',
    reason: 'Temple function at hometown',
    startDate: '2024-03-07',
    endDate: '2024-03-08',
    status: 'pending',
    appliedDate: '2024-03-06',
    document: 'invitation_letter.pdf',
    faculty: 'Dr. Ravi'
  },
  {
    id: 'LEAVE033',
    studentId: 'CSE2021033',
    studentName: 'Sathish',
    rollNumber: 'CSE2021033',
    reason: 'Hand fracture rest',
    startDate: '2024-03-09',
    endDate: '2024-03-12',
    status: 'approved',
    appliedDate: '2024-03-08',
    document: 'xray_report.pdf',
    faculty: 'Dr. Harini'
  },
  {
    id: 'LEAVE034',
    studentId: 'CSE2021034',
    studentName: 'Kavya',
    rollNumber: 'CSE2021034',
    reason: 'Religious ceremony',
    startDate: '2024-03-10',
    endDate: '2024-03-11',
    status: 'approved',
    appliedDate: '2024-03-09',
    document: 'family_event.pdf',
    faculty: 'Dr. Vignesh'
  },
  {
    id: 'LEAVE035',
    studentId: 'CSE2021035',
    studentName: 'Manoj',
    rollNumber: 'CSE2021035',
    reason: 'Laptop repair and assignment',
    startDate: '2024-03-12',
    endDate: '2024-03-12',
    status: 'rejected',
    appliedDate: '2024-03-11',
    document: 'service_receipt.pdf',
    faculty: 'Dr. Pavithra'
  },
  {
    id: 'LEAVE036',
    studentId: 'CSE2021036',
    studentName: 'Sowmya',
    rollNumber: 'CSE2021036',
    reason: 'Sibling’s exam drop-off',
    startDate: '2024-03-13',
    endDate: '2024-03-13',
    status: 'approved',
    appliedDate: '2024-03-12',
    document: 'exam_admit_card.pdf',
    faculty: 'Dr. Suresh'
  },
  {
    id: 'LEAVE037',
    studentId: 'CSE2021037',
    studentName: 'Balaji',
    rollNumber: 'CSE2021037',
    reason: 'Attending internship orientation',
    startDate: '2024-03-14',
    endDate: '2024-03-14',
    status: 'pending',
    appliedDate: '2024-03-13',
    document: 'intern_letter.pdf',
    faculty: 'Dr. Yamini'
  },
  {
    id: 'LEAVE038',
    studentId: 'CSE2021038',
    studentName: 'Divya',
    rollNumber: 'CSE2021038',
    reason: 'Flu and fever',
    startDate: '2024-03-15',
    endDate: '2024-03-17',
    status: 'approved',
    appliedDate: '2024-03-14',
    document: 'medical_certificate.pdf',
    faculty: 'Dr. Aravind'
  },
  {
    id: 'LEAVE039',
    studentId: 'CSE2021039',
    studentName: 'Vimal',
    rollNumber: 'CSE2021039',
    reason: 'Migration document processing',
    startDate: '2024-03-18',
    endDate: '2024-03-18',
    status: 'approved',
    appliedDate: '2024-03-17',
    document: 'document_proof.pdf',
    faculty: 'Dr. Renuka'
  },
  {
    id: 'LEAVE040',
    studentId: 'CSE2021040',
    studentName: 'Preethi',
    rollNumber: 'CSE2021040',
    reason: 'Festival celebration at native',
    startDate: '2024-03-19',
    endDate: '2024-03-20',
    status: 'approved',
    appliedDate: '2024-03-18',
    document: 'festival_notice.pdf',
    faculty: 'Dr. Gokul'
  },
  {
    id: 'LEAVE041',
    studentId: 'CSE2021041',
    studentName: 'Karthik',
    rollNumber: 'CSE2021041',
    reason: 'Medical leave - flu',
    startDate: '2024-03-21',
    endDate: '2024-03-23',
    status: 'approved',
    appliedDate: '2024-03-20',
    document: 'flu_report.pdf',
    faculty: 'Dr. Revathi'
  },
  {
    id: 'LEAVE042',
    studentId: 'CSE2021042',
    studentName: 'Janani',
    rollNumber: 'CSE2021042',
    reason: 'Marriage in family',
    startDate: '2024-03-24',
    endDate: '2024-03-26',
    status: 'pending',
    appliedDate: '2024-03-22',
    document: 'wedding_invite.pdf',
    faculty: 'Dr. Senthil'
  },
  {
    id: 'LEAVE043',
    studentId: 'CSE2021043',
    studentName: 'Saravanan',
    rollNumber: 'CSE2021043',
    reason: 'Eye check-up',
    startDate: '2024-03-27',
    endDate: '2024-03-27',
    status: 'approved',
    appliedDate: '2024-03-26',
    document: 'eye_report.pdf',
    faculty: 'Dr. Keerthana'
  },
  {
    id: 'LEAVE044',
    studentId: 'CSE2021044',
    studentName: 'Lavanya',
    rollNumber: 'CSE2021044',
    reason: 'Bank document work',
    startDate: '2024-03-28',
    endDate: '2024-03-28',
    status: 'rejected',
    appliedDate: '2024-03-27',
    document: 'bank_letter.pdf',
    faculty: 'Dr. Deepak'
  },
  {
    id: 'LEAVE045',
    studentId: 'CSE2021045',
    studentName: 'Vikram',
    rollNumber: 'CSE2021045',
    reason: 'Leg injury rest',
    startDate: '2024-03-29',
    endDate: '2024-04-01',
    status: 'approved',
    appliedDate: '2024-03-28',
    document: 'injury_report.pdf',
    faculty: 'Dr. Shalini'
  },
  {
    id: 'LEAVE046',
    studentId: 'CSE2021046',
    studentName: 'Anitha',
    rollNumber: 'CSE2021046',
    reason: 'Cousin’s wedding',
    startDate: '2024-04-02',
    endDate: '2024-04-03',
    status: 'approved',
    appliedDate: '2024-04-01',
    document: 'family_event.pdf',
    faculty: 'Dr. Dinesh'
  },
  {
    id: 'LEAVE047',
    studentId: 'CSE2021047',
    studentName: 'Arun',
    rollNumber: 'CSE2021047',
    reason: 'College sports event',
    startDate: '2024-04-04',
    endDate: '2024-04-05',
    status: 'approved',
    appliedDate: '2024-04-03',
    document: 'event_pass.pdf',
    faculty: 'Dr. Jaya'
  },
  {
    id: 'LEAVE048',
    studentId: 'CSE2021048',
    studentName: 'Harini',
    rollNumber: 'CSE2021048',
    reason: 'Mother���s health issue',
    startDate: '2024-04-06',
    endDate: '2024-04-06',
    status: 'approved',
    appliedDate: '2024-04-05',
    document: 'hospital_receipt.pdf',
    faculty: 'Dr. Ashok'
  },
  {
    id: 'LEAVE049',
    studentId: 'CSE2021049',
    studentName: 'Santhosh',
    rollNumber: 'CSE2021049',
    reason: 'Electrical maintenance at home',
    startDate: '2024-04-07',
    endDate: '2024-04-07',
    status: 'pending',
    appliedDate: '2024-04-06',
    document: 'electrician_bill.pdf',
    faculty: 'Dr. Priya'
  },
  {
    id: 'LEAVE050',
    studentId: 'CSE2021050',
    studentName: 'Sneha',
    rollNumber: 'CSE2021050',
    reason: 'Online exam from native',
    startDate: '2024-04-08',
    endDate: '2024-04-08',
    status: 'approved',
    appliedDate: '2024-04-07',
    document: 'exam_schedule.pdf',
    faculty: 'Dr. Naveen'
  }
];

const hardwareDevices = [
  {
    id: 'RFID001',
    name: 'Main Gate RFID Scanner',
    type: 'RFID',
    location: 'Main Entrance',
    status: 'online',
    lastSync: '2024-01-15 10:30:00',
    studentsScanned: 245,
    batteryLevel: 85
  },
  {
    id: 'BIO001',
    name: 'Library Biometric Scanner',
    type: 'Biometric',
    location: 'Library Entrance',
    status: 'online',
    lastSync: '2024-01-15 10:25:00',
    studentsScanned: 156,
    batteryLevel: 92
  },
  {
    id: 'CAM001',
    name: 'Classroom Camera System',
    type: 'Camera',
    location: 'Block A - Room 101',
    status: 'offline',
    lastSync: '2024-01-15 08:45:00',
    studentsScanned: 0,
    batteryLevel: 0
  }
];

export default function Attendance() {
  const { user: authUser } = useAuth();
  const [currentUser] = useState(() => {
    // Ensure we always have a valid currentUser object
    const user = authUser || getCurrentUser();
    if (!user || !user.name) {
      // Fallback user if both authUser and getCurrentUser fail
      return {
        id: 'fallback-user',
        name: 'Guest User',
        role: 'student',
        rollNumber: 'N/A',
        email: '',
        program: 'Unknown'
      };
    }
    return user;
  });

  // View-based navigation state
  const [currentView, setCurrentView] = useState<
    'list' | 'mark-attendance' | 'view-student' | 'edit-student' | 'view-leave' | 'edit-leave' | 'apply-for-leave'
  >('list');

  const [selectedClass, setSelectedClass] = useState('CSE-5A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLeaveApplicationOpen, setIsLeaveApplicationOpen] = useState(false);
  const [isHardwareConfigOpen, setIsHardwareConfigOpen] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filters, setFilters] = useState({
    class: 'all',
    status: 'all',
    date: selectedDate
  });
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [exportFormat, setExportFormat] = useState('csv');
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load students and faculty data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [studentsResponse, facultyResponse] = await Promise.all([
          fetch('/students.json'),
          fetch('/faculty.json')
        ]);

        if (!studentsResponse.ok || !facultyResponse.ok) {
          throw new Error('Failed to load data');
        }

        const studentsData = await studentsResponse.json();
        const facultyData = await facultyResponse.json();

        setStudents(studentsData);
        setFaculty(facultyData);

        // Filter students based on current user (faculty)
        if (currentUser?.role === 'faculty') {
          const currentFaculty = facultyData.find(
            (f: any) => f.personal_info?.full_name === currentUser?.name ||
                       f.faculty_id === currentUser?.faculty_id ||
                       f.contact_info?.email === currentUser?.email
          );

          if (currentFaculty) {
            const filteredStudents = studentsData.filter((student: any) => {
              const matchesInstitution = student.academic_info?.institution_code === currentFaculty.institution_code;
              const matchesDepartment = student.department_id === currentFaculty.department_id;
              return matchesInstitution && matchesDepartment && student.status === "Active";
            });

            // Convert student data to attendance records format
            const attendanceData = filteredStudents.map((student: any) => ({
              id: student.student_id.toString(),
              name: student.personal_info?.full_name || 'Unknown',
              course: student.academic_info?.program || 'Unknown',
              year: `${student.academic_info?.year || 1} Year`,
              semester: `Semester ${student.academic_info?.semester || 1}`,
              section: 'A', // Default section
              present: Math.floor(Math.random() * 50) + 40, // Mock data
              absent: Math.floor(Math.random() * 10),
              excused: Math.floor(Math.random() * 5),
              late: Math.floor(Math.random() * 8),
              percentage: 85 + Math.floor(Math.random() * 15), // 85-100%
              status: Math.random() > 0.2 ? 'Present' : 'Absent',
              lastMarked: new Date().toISOString().substring(0, 16).replace('T', ' '),
              rollNumber: student.roll_number?.toString() || student.student_id.toString(),
              todayStatus: Math.random() > 0.2 ? 'present' : 'absent',
              biometricId: `BIO${student.student_id.toString().slice(-3)}`,
              email: student.contact_info?.email || '',
              phone: student.contact_info?.phone_number || '',
              department: student.academic_info?.program || 'Unknown',
              institution: student.academic_info?.institution || 'Unknown'
            }));

            setAttendanceRecords(attendanceData);

            // Generate leave applications from attendance records for faculty
            const facultyLeaveApplications = attendanceData.filter(student => student.todayStatus === 'absent')
              .map((student, index) => ({
                id: `LEAVE_${student.id}_${Date.now() + index}`,
                studentId: student.id,
                studentName: student.name,
                rollNumber: student.rollNumber,
                reason: ['Medical appointment', 'Family emergency', 'Personal work', 'Fever and cold'][index % 4],
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0],
                status: 'pending',
                appliedDate: new Date().toISOString().split('T')[0],
                document: `${student.rollNumber}_leave_document.pdf`,
                faculty: currentUser?.name || 'Faculty',
                attendanceRecordId: student.id
              }));
            setLeaveRequests(facultyLeaveApplications);
          }
        } else if (currentUser?.role === 'student') {
          // For student role, find their own record
          console.log('Student login detected. CurrentUser:', currentUser);
          console.log('Looking for student in data:', studentsData.length, 'students');

          const studentRecord = studentsData.find((student: any) =>
            student.student_id.toString() === currentUser?.id ||
            student.roll_number?.toString() === currentUser?.rollNumber ||
            student.personal_info?.full_name === currentUser?.name ||
            student.contact_info?.email === currentUser?.email
          );

          console.log('Student record found:', studentRecord ? 'Yes' : 'No');

          let attendanceData;

          if (studentRecord) {
            console.log('Using real student data for:', studentRecord.personal_info?.full_name);
            attendanceData = [{
              id: studentRecord.student_id.toString(),
              name: studentRecord.personal_info?.full_name || currentUser?.name || 'Unknown Student',
              course: studentRecord.academic_info?.program || 'Unknown',
              year: `${studentRecord.academic_info?.year || 1} Year`,
              semester: `Semester ${studentRecord.academic_info?.semester || 1}`,
              section: 'A',
              present: Math.floor(Math.random() * 50) + 40,
              absent: Math.floor(Math.random() * 10),
              excused: Math.floor(Math.random() * 5),
              late: Math.floor(Math.random() * 8),
              percentage: 85 + Math.floor(Math.random() * 15),
              status: Math.random() > 0.2 ? 'Present' : 'Absent',
              lastMarked: new Date().toISOString().substring(0, 16).replace('T', ' '),
              rollNumber: studentRecord.roll_number?.toString() || studentRecord.student_id.toString(),
              todayStatus: Math.random() > 0.2 ? 'present' : 'absent',
              biometricId: `BIO${studentRecord.student_id.toString().slice(-3)}`,
              email: studentRecord.contact_info?.email || '',
              phone: studentRecord.contact_info?.phone_number || '',
              department: studentRecord.academic_info?.program || 'Unknown',
              institution: studentRecord.academic_info?.institution || 'Unknown'
            }];
          } else {
            // If student not found in JSON, create a mock record
            console.log('Creating mock student data for:', currentUser?.name);
            attendanceData = [{
              id: currentUser?.id || 'student-mock',
              name: currentUser?.name || 'Student',
              course: currentUser?.program || 'B.Tech Computer Science',
              year: '3rd Year',
              semester: 'Semester 5',
              section: 'A',
              present: 94,
              absent: 9,
              excused: 3,
              late: 5,
              percentage: 87.0,
              status: 'Present',
              lastMarked: new Date().toISOString().substring(0, 16).replace('T', ' '),
              rollNumber: currentUser?.rollNumber || currentUser?.id || 'MOCK001',
              todayStatus: 'present',
              biometricId: 'BIO001',
              email: currentUser?.email || '',
              phone: '',
              department: currentUser?.program || 'Computer Science',
              institution: 'Institute of Technology'
            }];
          }

          console.log('Setting attendance records for student:', attendanceData);
          setAttendanceRecords(attendanceData);

          // Generate student's own leave applications from their absence data
          const studentLeaveApplications = [{
            id: `LEAVE_${currentUser?.id}_${Date.now()}`,
            studentId: currentUser?.id || 'student-1',
            studentName: currentUser?.name || 'Student',
            rollNumber: currentUser?.rollNumber || 'MOCK001',
            reason: 'Medical appointment',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            status: 'pending',
            appliedDate: new Date().toISOString().split('T')[0],
            document: `${currentUser?.rollNumber || 'MOCK001'}_leave_document.pdf`,
            faculty: 'Dr. Sarasvathi',
            attendanceRecordId: attendanceData[0]?.id
          }];
          setLeaveRequests(studentLeaveApplications);
        } else {
          // For admin/other roles, show all students
          const attendanceData = studentsData.slice(0, 20).map((student: any) => ({
            id: student.student_id.toString(),
            name: student.personal_info?.full_name || 'Unknown',
            course: student.academic_info?.program || 'Unknown',
            year: `${student.academic_info?.year || 1} Year`,
            semester: `Semester ${student.academic_info?.semester || 1}`,
            section: 'A',
            present: Math.floor(Math.random() * 50) + 40,
            absent: Math.floor(Math.random() * 10),
            excused: Math.floor(Math.random() * 5),
            late: Math.floor(Math.random() * 8),
            percentage: 85 + Math.floor(Math.random() * 15),
            status: Math.random() > 0.2 ? 'Present' : 'Absent',
            lastMarked: new Date().toISOString().substring(0, 16).replace('T', ' '),
            rollNumber: student.roll_number?.toString() || student.student_id.toString(),
            todayStatus: Math.random() > 0.2 ? 'present' : 'absent',
            biometricId: `BIO${student.student_id.toString().slice(-3)}`,
            email: student.contact_info?.email || '',
            phone: student.contact_info?.phone_number || '',
            department: student.academic_info?.program || 'Unknown',
            institution: student.academic_info?.institution || 'Unknown'
          }));

          setAttendanceRecords(attendanceData);

          // Generate leave applications from attendance records for admin
          const adminLeaveApplications = attendanceData.filter(student => student.todayStatus === 'absent')
            .map((student, index) => ({
              id: `LEAVE_${student.id}_${Date.now() + index}`,
              studentId: student.id,
              studentName: student.name,
              rollNumber: student.rollNumber,
              reason: ['Medical appointment', 'Family emergency', 'Personal work', 'Fever and cold'][index % 4],
              startDate: new Date().toISOString().split('T')[0],
              endDate: new Date().toISOString().split('T')[0],
              status: 'pending',
              appliedDate: new Date().toISOString().split('T')[0],
              document: `${student.rollNumber}_leave_document.pdf`,
              faculty: 'Dr. Sarasvathi',
              attendanceRecordId: student.id
            }));
          setLeaveRequests(adminLeaveApplications);
        }

      } catch (err: any) {
        setError(err.message);
        console.error('Error loading data:', err);
        // Fallback to mock data if loading fails
        setAttendanceRecords(attendanceData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser]);

  const leaveFormHandler = useFormHandler(
    ['reason', 'startDate', 'endDate', 'description'],
    {
      reason: '',
      startDate: '',
      endDate: '',
      description: ''
    }
  );

  const getFormData = (handler: any) => {
    return Object.keys(handler.formState).reduce((acc, key) => {
      acc[key] = handler.formState[key].value;
      return acc;
    }, {} as Record<string, any>);
  };

  const handleInputChange = (handler: any) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    handler.updateField(e.target.name, e.target.value);
  };

  const handleSubmit = (handler: any, onSubmit: (data: any) => Promise<void>) => (e: React.FormEvent) => {
    e.preventDefault();
    handler.submitForm(onSubmit);
  };

  const onSubmitLeave = async (data: any) => {
    const newLeave = {
      id: `LEAVE${Date.now()}`,
      studentId: currentUser?.id || 'unknown',
      studentName: currentUser?.name || 'Unknown Student',
      rollNumber: currentUser?.rollNumber || 'N/A',
      reason: data.reason,
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };
    setLeaveRequests(prev => [...prev, newLeave]);
    setIsLeaveApplicationOpen(false);
    leaveFormHandler.resetForm();
  };

  const handleAttendanceUpdate = (studentId: string, status: 'present' | 'absent' | 'excused' | 'late') => {
    setAttendanceRecords(prev => prev.map(record => 
      record.id === studentId ? { ...record, todayStatus: status } : record
    ));
  };

  const handleLeaveApproval = (leaveId: string, status: 'approved' | 'rejected') => {
    setLeaveRequests(prev => prev.map(leave =>
      leave.id === leaveId ? {
        ...leave,
        status,
        approvedBy: currentUser?.name || 'Administrator',
        approvedDate: new Date().toISOString().split('T')[0]
      } : leave
    ));
  };

  const handleExportReport = (format: 'csv' | 'pdf' | 'excel' = 'csv') => {
    const data = attendanceRecords.filter(student => {
      if (currentUser?.role === 'student') return (
        student.id === currentUser?.id ||
        student.rollNumber === currentUser?.rollNumber ||
        student.name === currentUser?.name
      );
      if (currentUser?.role === 'parent') return student.id === currentUser?.children?.[0]?.id;
      return true;
    });

    if (format === 'csv') {
      const csvContent = [
        ['Name', 'Roll Number', 'Course', 'Present', 'Absent', 'Excused', 'Late', 'Percentage', 'Status'].join(','),
        ...data.map(student => [
          student.name,
          student.rollNumber,
          student.course,
          student.present,
          student.absent,
          student.excused,
          student.late,
          student.percentage + '%',
          student.todayStatus
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `attendance_report_${selectedDate}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else if (format === 'pdf') {
      // PDF export functionality would be implemented here
      console.log('Exporting as PDF...');
      alert('PDF export functionality will be implemented with a PDF library.');
    } else if (format === 'excel') {
      // Excel export functionality would be implemented here
      console.log('Exporting as Excel...');
      alert('Excel export functionality will be implemented with an Excel library.');
    }
  };

  const handleViewStudent = (student: any) => {
    setSelectedStudent(student);
    setCurrentView('view-student');
  };

  const handleEditStudent = (student: any) => {
    setSelectedStudent(student);
    setCurrentView('edit-student');
  };

  const handleUpdateAttendanceRecord = (studentId: string, updates: any) => {
    setAttendanceRecords(prev => prev.map(record =>
      record.id === studentId ? { ...record, ...updates } : record
    ));
    setCurrentView('list');
    setSelectedStudent(null);
  };

  // Navigation helper functions
  const goToView = (view: typeof currentView) => {
    setCurrentView(view);
  };

  const goBack = () => {
    setCurrentView('list');
    setSelectedStudent(null);
    setSelectedLeave(null);
  };

  const handleApplyForLeave = () => {
    setCurrentView('apply-for-leave');
  };

  // Mark Attendance Page View
  const renderMarkAttendancePage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={goBack}>
            <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
            Back to List
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mark Attendance</h1>
            <p className="text-muted-foreground mt-2">
              Mark attendance for today's class session - {selectedClass}
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CSE-5A">CSE-5A</SelectItem>
                <SelectItem value="CSE-5B">CSE-5B</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-48"
            />
            <Button className="ml-auto">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Roll Number</TableHead>
                  <TableHead className="text-center">Present</TableHead>
                  <TableHead className="text-center">Absent</TableHead>
                  <TableHead className="text-center">Excused</TableHead>
                  <TableHead className="text-center">Late</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="font-medium">{student.name}</div>
                    </TableCell>
                    <TableCell>{student.rollNumber}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant={student.todayStatus === 'present' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleAttendanceUpdate(student.id, 'present')}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant={student.todayStatus === 'absent' ? 'destructive' : 'outline'}
                        size="sm"
                        onClick={() => handleAttendanceUpdate(student.id, 'absent')}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant={student.todayStatus === 'excused' ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => handleAttendanceUpdate(student.id, 'excused')}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant={student.todayStatus === 'late' ? 'outline' : 'outline'}
                        size="sm"
                        onClick={() => handleAttendanceUpdate(student.id, 'late')}
                        className={student.todayStatus === 'late' ? 'border-yellow-500 text-yellow-600' : ''}
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedStudent(student);
                            setCurrentView('view-student');
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedStudent(student);
                            setCurrentView('edit-student');
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between">
            <Button variant="outline" onClick={goBack}>
              Cancel
            </Button>
            <Button>Save Attendance</Button>
          </div>
        </div>
      </Card>
    </div>
  );

  // View Student Page
  const renderViewStudentPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={goBack}>
            <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Attendance
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Details</h1>
            <p className="text-muted-foreground mt-2">
              View detailed attendance information for {selectedStudent?.name}
            </p>
          </div>
        </div>
        <Button
          onClick={() => setCurrentView('edit-student')}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Student
        </Button>
      </div>

      {selectedStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p className="text-sm text-gray-600">{selectedStudent.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Roll Number</label>
                  <p className="text-sm text-gray-600">{selectedStudent.rollNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Course</label>
                  <p className="text-sm text-gray-600">{selectedStudent.course}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Year & Semester</label>
                  <p className="text-sm text-gray-600">{selectedStudent.year}, {selectedStudent.semester}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Section</label>
                  <p className="text-sm text-gray-600">{selectedStudent.section}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Biometric ID</label>
                  <p className="text-sm text-gray-600">{selectedStudent.biometricId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-gray-600">{selectedStudent.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <p className="text-sm text-gray-600">{selectedStudent.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">{selectedStudent.present}</div>
                  <div className="text-sm text-green-600">Present Classes</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-900">{selectedStudent.absent}</div>
                  <div className="text-sm text-red-600">Absent Classes</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-900">{selectedStudent.excused}</div>
                  <div className="text-sm text-yellow-600">Excused</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-900">{selectedStudent.late}</div>
                  <div className="text-sm text-purple-600">Late</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Overall Percentage:</span>
                  <span className={`font-semibold ${selectedStudent.percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedStudent.percentage}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Today's Status:</span>
                  <Badge variant={selectedStudent.todayStatus === 'present' ? 'default' : 'destructive'}>
                    {selectedStudent.todayStatus}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Last Marked:</span>
                  <span className="text-sm text-gray-600">{selectedStudent.lastMarked}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // Edit Student Page
  const renderEditStudentPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={goBack}>
            <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Attendance
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Student</h1>
            <p className="text-muted-foreground mt-2">
              Edit attendance record for {selectedStudent?.name}
            </p>
          </div>
        </div>
      </div>

      {selectedStudent && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Attendance Record</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  label="Present Classes"
                  name="present"
                  type="number"
                  value={selectedStudent.present.toString()}
                  onChange={(e) => setSelectedStudent({...selectedStudent, present: parseInt(e.target.value) || 0})}
                />
                <FormField
                  label="Absent Classes"
                  name="absent"
                  type="number"
                  value={selectedStudent.absent.toString()}
                  onChange={(e) => setSelectedStudent({...selectedStudent, absent: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  label="Excused Classes"
                  name="excused"
                  type="number"
                  value={selectedStudent.excused.toString()}
                  onChange={(e) => setSelectedStudent({...selectedStudent, excused: parseInt(e.target.value) || 0})}
                />
                <FormField
                  label="Late Classes"
                  name="late"
                  type="number"
                  value={selectedStudent.late.toString()}
                  onChange={(e) => setSelectedStudent({...selectedStudent, late: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Today's Status"
                name="todayStatus"
                type="select"
                value={selectedStudent.todayStatus}
                onChange={(e) => setSelectedStudent({...selectedStudent, todayStatus: e.target.value})}
                options={[
                  { label: 'Present', value: 'present' },
                  { label: 'Absent', value: 'absent' },
                  { label: 'Excused', value: 'excused' },
                  { label: 'Late', value: 'late' }
                ]}
              />
              <FormField
                label="Percentage"
                name="percentage"
                type="number"
                value={selectedStudent.percentage.toString()}
                onChange={(e) => setSelectedStudent({...selectedStudent, percentage: parseFloat(e.target.value) || 0})}
                step="0.1"
                min="0"
                max="100"
              />
            </div>
          </CardContent>
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between">
              <Button variant="outline" onClick={goBack}>
                Cancel
              </Button>
              <Button onClick={() => {
                handleUpdateAttendanceRecord(selectedStudent.id, selectedStudent);
                goBack();
              }}>
                Update Record
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  // View Leave Application Page
  const renderViewLeavePage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={goBack}>
            <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Attendance
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leave Application Details</h1>
            <p className="text-muted-foreground mt-2">
              View leave application for {selectedLeave?.studentName}
            </p>
          </div>
        </div>
        <Button
          onClick={() => setCurrentView('edit-leave')}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Application
        </Button>
      </div>

      {selectedLeave && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Leave Application Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Student Name</label>
                  <p className="text-sm text-gray-600">{selectedLeave.studentName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Roll Number</label>
                  <p className="text-sm text-gray-600">{selectedLeave.rollNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Reason</label>
                  <p className="text-sm text-gray-600">{selectedLeave.reason}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Badge variant={selectedLeave.status === 'approved' ? 'default' : selectedLeave.status === 'pending' ? 'secondary' : 'destructive'}>
                    {selectedLeave.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Start Date</label>
                  <p className="text-sm text-gray-600">{selectedLeave.startDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">End Date</label>
                  <p className="text-sm text-gray-600">{selectedLeave.endDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Applied Date</label>
                  <p className="text-sm text-gray-600">{selectedLeave.appliedDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Faculty</label>
                  <p className="text-sm text-gray-600">{selectedLeave.faculty}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Document</label>
                  <p className="text-sm text-gray-600">{selectedLeave.document}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Attendance Record</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const attendanceRecord = attendanceRecords.find(record => record.id === selectedLeave.attendanceRecordId);
                return attendanceRecord ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="text-sm font-medium">Course</label>
                        <p className="text-sm text-gray-600">{attendanceRecord.course}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Section</label>
                        <p className="text-sm text-gray-600">{attendanceRecord.section}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Current Status</label>
                        <Badge variant={attendanceRecord.todayStatus === 'present' ? 'default' : 'destructive'}>
                          {attendanceRecord.todayStatus}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Overall Percentage</label>
                        <p className={`text-sm font-semibold ${attendanceRecord.percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                          {attendanceRecord.percentage}%
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-900">{attendanceRecord.present}</div>
                        <div className="text-xs text-green-600">Present</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-lg font-bold text-red-900">{attendanceRecord.absent}</div>
                        <div className="text-xs text-red-600">Absent</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-lg font-bold text-yellow-900">{attendanceRecord.excused}</div>
                        <div className="text-xs text-yellow-600">Excused</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-900">{attendanceRecord.late}</div>
                        <div className="text-xs text-purple-600">Late</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No related attendance record found</p>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // Edit Leave Application Page
  const renderEditLeavePage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={goBack}>
            <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Attendance
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Leave Application</h1>
            <p className="text-muted-foreground mt-2">
              Edit leave application for {selectedLeave?.studentName}
            </p>
          </div>
        </div>
      </div>

      {selectedLeave && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Leave Application Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Student Name"
                name="studentName"
                type="text"
                value={selectedLeave.studentName}
                onChange={(e) => setSelectedLeave({...selectedLeave, studentName: e.target.value})}
                disabled
              />
              <FormField
                label="Roll Number"
                name="rollNumber"
                type="text"
                value={selectedLeave.rollNumber}
                onChange={(e) => setSelectedLeave({...selectedLeave, rollNumber: e.target.value})}
                disabled
              />
              <FormField
                label="Reason"
                name="reason"
                type="select"
                value={selectedLeave.reason}
                onChange={(e) => setSelectedLeave({...selectedLeave, reason: e.target.value})}
                options={[
                  { label: 'Medical appointment', value: 'Medical appointment' },
                  { label: 'Family emergency', value: 'Family emergency' },
                  { label: 'Personal work', value: 'Personal work' },
                  { label: 'Fever and cold', value: 'Fever and cold' },
                  { label: 'Other', value: 'Other' }
                ]}
              />
              <FormField
                label="Status"
                name="status"
                type="select"
                value={selectedLeave.status}
                onChange={(e) => setSelectedLeave({...selectedLeave, status: e.target.value})}
                options={[
                  { label: 'Pending', value: 'pending' },
                  { label: 'Approved', value: 'approved' },
                  { label: 'Rejected', value: 'rejected' }
                ]}
              />
              <FormField
                label="Start Date"
                name="startDate"
                type="date"
                value={selectedLeave.startDate}
                onChange={(e) => setSelectedLeave({...selectedLeave, startDate: e.target.value})}
              />
              <FormField
                label="End Date"
                name="endDate"
                type="date"
                value={selectedLeave.endDate}
                onChange={(e) => setSelectedLeave({...selectedLeave, endDate: e.target.value})}
              />
              <FormField
                label="Faculty"
                name="faculty"
                type="text"
                value={selectedLeave.faculty}
                onChange={(e) => setSelectedLeave({...selectedLeave, faculty: e.target.value})}
              />
              <FormField
                label="Document"
                name="document"
                type="text"
                value={selectedLeave.document}
                onChange={(e) => setSelectedLeave({...selectedLeave, document: e.target.value})}
              />
            </div>
          </CardContent>
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between">
              <Button variant="outline" onClick={goBack}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Update the leave request
                setLeaveRequests(prev => prev.map(leave =>
                  leave.id === selectedLeave.id ? selectedLeave : leave
                ));
                goBack();
              }}>
                Update Application
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  const renderApplyForLeavePage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={goBack}>
            <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Attendance
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Apply for Leave</h1>
            <p className="text-muted-foreground mt-2">
              Submit a leave application for approval
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave Application</CardTitle>
          <CardDescription>
            Fill out the form below to request leave. Your application will be reviewed by the faculty.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(leaveFormHandler, onSubmitLeave)} className="space-y-4">
            <FormField
              label="Reason for Leave"
              name="reason"
              type="select"
              value={getFormData(leaveFormHandler).reason}
              onChange={handleInputChange(leaveFormHandler)}
              options={[
                { label: 'Medical appointment', value: 'Medical appointment' },
                { label: 'Family emergency', value: 'Family emergency' },
                { label: 'Personal work', value: 'Personal work' },
                { label: 'Fever and cold', value: 'Fever and cold' },
                { label: 'Other', value: 'Other' }
              ]}
              placeholder="Select a reason..."
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Start Date"
                name="startDate"
                type="date"
                value={getFormData(leaveFormHandler).startDate}
                onChange={handleInputChange(leaveFormHandler)}
                required
              />

              <FormField
                label="End Date"
                name="endDate"
                type="date"
                value={getFormData(leaveFormHandler).endDate}
                onChange={handleInputChange(leaveFormHandler)}
                required
              />
            </div>

            <FormField
              label="Additional Details"
              name="description"
              type="textarea"
              value={getFormData(leaveFormHandler).description}
              onChange={handleInputChange(leaveFormHandler)}
              placeholder="Provide additional details about your leave request..."
              rows={4}
            />

            <div className="border-t pt-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-blue-900 mb-2">Important Notes:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Submit your application at least 24 hours in advance</li>
                  <li>• Attach medical certificate for medical leave (if applicable)</li>
                  <li>• Emergency applications will be processed immediately</li>
                  <li>• You will receive notification once your application is reviewed</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={goBack}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={leaveFormHandler.isSubmitting}>
                <Send className="h-4 w-4 mr-2" />
                Submit Application
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  const getAttendanceStats = () => {
    if (currentUser?.role === 'admin') {
      return {
        totalStudents: 2456,
        presentToday: 2189,
        absentToday: 267,
        overallPercentage: 89.1
      };
    } else if (currentUser?.role === 'faculty') {
      const classSize = attendanceRecords.length;
      const presentCount = attendanceRecords.filter(s => s.todayStatus === 'present').length;
      const avgPercentage = attendanceRecords.length > 0
        ? attendanceRecords.reduce((sum, s) => sum + s.percentage, 0) / attendanceRecords.length
        : 0;
      return {
        totalStudents: classSize,
        presentToday: presentCount,
        absentToday: classSize - presentCount,
        overallPercentage: avgPercentage
      };
    } else if (currentUser?.role === 'student') {
      const studentRecord = attendanceRecords.find(r =>
        r.id === currentUser?.id ||
        r.rollNumber === currentUser?.rollNumber
      ) || attendanceRecords[0];

      if (studentRecord) {
        return {
          totalClasses: studentRecord.present + studentRecord.absent + studentRecord.excused,
          presentClasses: studentRecord.present,
          absentClasses: studentRecord.absent,
          percentage: studentRecord.percentage
        };
      } else {
        // Default values if no record found
        return {
          totalClasses: 100,
          presentClasses: 85,
          absentClasses: 15,
          percentage: 85.0
        };
      }
    } else { // parent
      const childRecord = attendanceRecords.find(r => r.id === currentUser?.children?.[0]?.id) || attendanceRecords[0];
      return {
        totalClasses: childRecord.present + childRecord.absent + childRecord.excused,
        presentClasses: childRecord.present,
        absentClasses: childRecord.absent,
        percentage: childRecord.percentage
      };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Error loading data: {error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

  const renderAdminView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive attendance tracking with hardware integration
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isHardwareConfigOpen} onOpenChange={setIsHardwareConfigOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Hardware Config
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Hardware Integration Settings
                </DialogTitle>
                <DialogDescription>
                  Configure and monitor external attendance hardware devices
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {hardwareDevices.map((device) => (
                    <Card key={device.id} className="relative">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {device.type === 'RFID' && <CreditCard className="h-5 w-5 text-blue-600" />}
                            {device.type === 'Biometric' && <Fingerprint className="h-5 w-5 text-green-600" />}
                            {device.type === 'Camera' && <Monitor className="h-5 w-5 text-purple-600" />}
                          </div>
                          <Badge variant={device.status === 'online' ? 'default' : 'destructive'}>
                            {device.status}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-sm mb-1">{device.name}</h4>
                        <p className="text-xs text-gray-600 mb-3">{device.location}</p>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span>Last Sync:</span>
                            <span>{device.lastSync}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Students Scanned:</span>
                            <span className="font-semibold">{device.studentsScanned}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Battery:</span>
                            <span className={device.batteryLevel > 20 ? 'text-green-600' : 'text-red-600'}>
                              {device.batteryLevel}%
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-1">
                          <Button size="sm" variant="outline" className="flex-1">Configure</Button>
                          <Button size="sm" variant="outline" className="flex-1">Test</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Add New Device</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" className="flex flex-col gap-1 h-16">
                      <CreditCard className="h-5 w-5" />
                      <span className="text-xs">RFID Reader</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col gap-1 h-16">
                      <Fingerprint className="h-5 w-5" />
                      <span className="text-xs">Biometric Scanner</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col gap-1 h-16">
                      <Monitor className="h-5 w-5" />
                      <span className="text-xs">Camera System</span>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsHardwareConfigOpen(false)}>
                  Close
                </Button>
                <Button>Save Configuration</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Attendance Report</DialogTitle>
                <DialogDescription>
                  Choose the format for your attendance report export
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Export Format</label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV Format</SelectItem>
                      <SelectItem value="excel">Excel Format</SelectItem>
                      <SelectItem value="pdf">PDF Format</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" onClick={() => handleExportReport('csv')} className="flex flex-col gap-1 h-16">
                    <FileText className="h-5 w-5" />
                    <span className="text-xs">CSV</span>
                  </Button>
                  <Button variant="outline" onClick={() => handleExportReport('excel')} className="flex flex-col gap-1 h-16">
                    <Download className="h-5 w-5" />
                    <span className="text-xs">Excel</span>
                  </Button>
                  <Button variant="outline" onClick={() => handleExportReport('pdf')} className="flex flex-col gap-1 h-16">
                    <FileText className="h-5 w-5" />
                    <span className="text-xs">PDF</span>
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isAnalyticsOpen} onOpenChange={setIsAnalyticsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Attendance Analytics Dashboard
                </DialogTitle>
                <DialogDescription>
                  Comprehensive attendance insights and trends analysis
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-bold text-green-900">89.2%</div>
                      <div className="text-sm text-green-600">Overall Rate</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-bold text-blue-900">156</div>
                      <div className="text-sm text-blue-600">Days Tracked</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <div className="text-2xl font-bold text-purple-900">2,456</div>
                      <div className="text-sm text-purple-600">Total Students</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                      <div className="text-2xl font-bold text-red-900">47</div>
                      <div className="text-sm text-red-600">At Risk</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Weekly Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Monday</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{width: '92%'}}></div>
                            </div>
                            <span className="text-sm font-medium">92%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Tuesday</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{width: '89%'}}></div>
                            </div>
                            <span className="text-sm font-medium">89%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Wednesday</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-yellow-500 h-2 rounded-full" style={{width: '85%'}}></div>
                            </div>
                            <span className="text-sm font-medium">85%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Thursday</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{width: '91%'}}></div>
                            </div>
                            <span className="text-sm font-medium">91%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Friday</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-red-500 h-2 rounded-full" style={{width: '78%'}}></div>
                            </div>
                            <span className="text-sm font-medium">78%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Department Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Computer Science</span>
                          <span className="text-sm font-medium text-green-600">94.2%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Electronics</span>
                          <span className="text-sm font-medium text-blue-600">91.8%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Mechanical</span>
                          <span className="text-sm font-medium text-green-600">89.5%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Civil</span>
                          <span className="text-sm font-medium text-yellow-600">87.3%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Electrical</span>
                          <span className="text-sm font-medium text-red-600">84.1%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleExportReport('pdf')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Analytics
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Data
                  </Button>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsAnalyticsOpen(false)}>
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Hardware Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">RFID Devices</p>
                <p className="text-2xl font-bold text-green-900">
                  {hardwareDevices.filter(d => d.type === 'RFID' && d.status === 'online').length}/
                  {hardwareDevices.filter(d => d.type === 'RFID').length}
                </p>
                <p className="text-xs text-green-600">Online</p>
              </div>
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Biometric</p>
                <p className="text-2xl font-bold text-blue-900">
                  {hardwareDevices.filter(d => d.type === 'Biometric' && d.status === 'online').length}/
                  {hardwareDevices.filter(d => d.type === 'Biometric').length}
                </p>
                <p className="text-xs text-blue-600">Active</p>
              </div>
              <Fingerprint className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Camera Systems</p>
                <p className="text-2xl font-bold text-purple-900">
                  {hardwareDevices.filter(d => d.type === 'Camera' && d.status === 'online').length}/
                  {hardwareDevices.filter(d => d.type === 'Camera').length}
                </p>
                <p className="text-xs text-purple-600">Monitoring</p>
              </div>
              <Monitor className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Total Scans</p>
                <p className="text-2xl font-bold text-orange-900">
                  {hardwareDevices.reduce((sum, d) => sum + d.studentsScanned, 0)}
                </p>
                <p className="text-xs text-orange-600">Today</p>
              </div>
              <Scan className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderFacultyView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Class Attendance</h1>
          <p className="text-muted-foreground mt-2">
            Manage attendance for your classes and review leave applications
          </p>
          {attendanceRecords.length > 0 && (
            <div className="mt-2 flex gap-4 text-sm text-blue-600">
              <span>Institution: {attendanceRecords[0]?.institution}</span>
              <span>Department: {attendanceRecords[0]?.department}</span>
              <span>Students: {attendanceRecords.length}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            onClick={() => setCurrentView('mark-attendance')}
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Mark Attendance
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
        </div>
      </div>

      {/* Leave Applications Panel - Connected to Class Attendance Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Pending Leave Applications (From Class Attendance)
            <Badge variant="destructive">{leaveRequests.filter(l => l.status === 'pending').length}</Badge>
          </CardTitle>
          <CardDescription>
            Leave applications automatically generated from students marked absent in class attendance records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaveRequests.filter(leave => leave.status === 'pending').map((leave) => {
              // Find corresponding attendance record
              const attendanceRecord = attendanceRecords.find(record => record.id === leave.attendanceRecordId);
              return (
                <div key={leave.id} className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{leave.studentName}</h4>
                      <p className="text-sm text-gray-600">Roll: {leave.rollNumber}</p>
                      {attendanceRecord && (
                        <p className="text-xs text-blue-600">
                          From Attendance Record: {attendanceRecord.course} - {attendanceRecord.section}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">Pending</Badge>
                      <Badge variant="outline" className="text-xs">From Attendance</Badge>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Reason:</span> {leave.reason}</div>
                    <div><span className="font-medium">Duration:</span> {leave.startDate} to {leave.endDate}</div>
                    <div><span className="font-medium">Applied:</span> {leave.appliedDate}</div>
                    {attendanceRecord && (
                      <div><span className="font-medium">Current Attendance:</span> {attendanceRecord.percentage}% ({attendanceRecord.present} present, {attendanceRecord.absent} absent)</div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" onClick={() => handleLeaveApproval(leave.id, 'approved')}>
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleLeaveApproval(leave.id, 'rejected')}>
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedLeave(leave);
                        setCurrentView('view-leave');
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedLeave(leave);
                        setCurrentView('edit-leave');
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              );
            })}
            {leaveRequests.filter(l => l.status === 'pending').length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No pending leave applications</p>
                <p className="text-xs">Leave applications will appear here when students are marked absent</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStudentView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Attendance</h1>
          <p className="text-muted-foreground mt-2">
            View your attendance records and apply for leave
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
          onClick={handleApplyForLeave}
        >
          <CalendarDays className="h-4 w-4 mr-2" />
          Apply for Leave
        </Button>
      </div>

      {/* Student's Attendance Record */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            My Attendance Record
          </CardTitle>
          <div className="flex items-center justify-between">
            <CardDescription>
              View your attendance records and performance
            </CardDescription>
            <Button variant="outline" onClick={() => handleExportReport('csv')}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {attendanceRecords.filter(record => record.id === currentUser?.id || record.rollNumber === currentUser?.rollNumber || record.name === currentUser?.name).length > 0 ? (
            <div className="space-y-4">
              {attendanceRecords
                .filter(record => record.id === currentUser?.id || record.rollNumber === currentUser?.rollNumber || record.name === currentUser?.name)
                .map((record) => (
                <div key={record.id} className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-900">{record.present}</div>
                      <div className="text-sm text-blue-600">Present Classes</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-900">{record.absent}</div>
                      <div className="text-sm text-red-600">Absent Classes</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-900">{record.excused}</div>
                      <div className="text-sm text-yellow-600">Excused</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-900">{record.late}</div>
                      <div className="text-sm text-purple-600">Late</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Student:</strong> {record.name}
                    </div>
                    <div>
                      <strong>Roll Number:</strong> {record.rollNumber}
                    </div>
                    <div>
                      <strong>Course:</strong> {record.course}
                    </div>
                    <div>
                      <strong>Year & Semester:</strong> {record.year}, {record.semester}
                    </div>
                    <div>
                      <strong>Overall Percentage:</strong>
                      <span className={`ml-2 font-semibold ${record.percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                        {record.percentage}%
                      </span>
                    </div>
                    <div>
                      <strong>Today's Status:</strong>
                      <Badge
                        variant={record.todayStatus === 'present' ? 'default' : 'destructive'}
                        className="ml-2"
                      >
                        {record.todayStatus}
                      </Badge>
                    </div>
                    <div>
                      <strong>Last Marked:</strong> {record.lastMarked}
                    </div>
                    <div>
                      <strong>Institution:</strong> {record.institution}
                    </div>
                  </div>

                  {record.percentage < 75 && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <AlertTriangle className="h-4 w-4" />
                        <strong>Attendance Warning</strong>
                      </div>
                      <div className="text-sm text-yellow-700 mt-1">
                        Your attendance is below 75%. Please ensure regular attendance to meet academic requirements.
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No attendance records found for your account.</p>
              <p className="text-sm mt-2">Please contact your faculty if you believe this is an error.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student's Leave Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            My Leave Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaveRequests.filter(leave => leave.studentId === currentUser?.id).map((leave) => (
              <div key={leave.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{leave.reason}</h4>
                  <Badge variant={
                    leave.status === 'approved' ? 'default' :
                    leave.status === 'rejected' ? 'destructive' : 'secondary'
                  }>
                    {leave.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Duration: {leave.startDate} to {leave.endDate}</div>
                  <div>Applied: {leave.appliedDate}</div>
                  {leave.status === 'approved' && leave.approvedBy && (
                    <div>Approved by: {leave.approvedBy} on {leave.approvedDate}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderParentView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Child's Attendance</h1>
          <p className="text-muted-foreground mt-2">
            Monitor your child's attendance and leave status
          </p>
        </div>
        {currentUser.children && currentUser.children.length > 1 && (
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Child" />
            </SelectTrigger>
            <SelectContent>
              {currentUser.children.map((child: any) => (
                <SelectItem key={child.id} value={child.id}>
                  {child.name} - {child.program}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Recent Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <div className="font-medium">Absence Alert</div>
              <div className="text-sm text-gray-600">Alex was absent from Computer Networks class on Jan 14, 2024</div>
              <div className="text-xs text-gray-500">2 days ago</div>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <div className="font-medium">Leave Approved</div>
              <div className="text-sm text-gray-600">Medical leave application approved for Jan 16, 2024</div>
              <div className="text-xs text-gray-500">3 days ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const stats = getAttendanceStats();

  // Handle view-based navigation
  if (currentView === 'mark-attendance') {
    return renderMarkAttendancePage();
  }

  if (currentView === 'view-student') {
    return renderViewStudentPage();
  }

  if (currentView === 'edit-student') {
    return renderEditStudentPage();
  }

  if (currentView === 'view-leave') {
    return renderViewLeavePage();
  }

  if (currentView === 'edit-leave') {
    return renderEditLeavePage();
  }

  if (currentView === 'apply-for-leave') {
    return renderApplyForLeavePage();
  }

  return (
    <div className="space-y-6">
      {/* Render role-specific header */}
      {currentUser?.role === 'admin' && renderAdminView()}
      {currentUser?.role === 'faculty' && renderFacultyView()}
      {currentUser?.role === 'student' && renderStudentView()}
      {currentUser?.role === 'parent' && renderParentView()}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  {currentUser?.role === 'admin' ? 'Total Students' :
                   currentUser?.role === 'faculty' ? 'Class Size' :
                   'Total Classes'}
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {currentUser?.role === 'admin' ? stats.totalStudents :
                   currentUser?.role === 'faculty' ? stats.totalStudents :
                   stats.totalClasses}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">
                  {currentUser.role === 'admin' || currentUser.role === 'faculty' ? 'Present Today' : 'Present Classes'}
                </p>
                <p className="text-3xl font-bold text-green-900">
                  {currentUser.role === 'admin' || currentUser.role === 'faculty' ? stats.presentToday : stats.presentClasses}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">
                  {currentUser.role === 'admin' || currentUser.role === 'faculty' ? 'Absent Today' : 'Absent Classes'}
                </p>
                <p className="text-3xl font-bold text-red-900">
                  {currentUser.role === 'admin' || currentUser.role === 'faculty' ? stats.absentToday : stats.absentClasses}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Attendance %</p>
                <p className="text-3xl font-bold text-purple-900">
                  {currentUser.role === 'admin' ? stats.overallPercentage : 
                   currentUser.role === 'faculty' ? stats.overallPercentage : 
                   stats.percentage}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              {currentUser.role === 'admin' && 'All Students Attendance'}
              {currentUser.role === 'faculty' && 'Class Attendance Records'}
              {currentUser.role === 'student' && 'My Attendance Record'}
              {currentUser.role === 'parent' && "Child's Attendance Record"}
            </CardTitle>
            <div className="flex items-center gap-2">
              {(currentUser.role === 'admin' || currentUser.role === 'faculty') && (
                <div className="flex items-center gap-2">
                  <Select value={filters.class} onValueChange={(value) => setFilters({...filters, class: value})}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="CSE-5A">CSE-5A</SelectItem>
                      <SelectItem value="CSE-5B">CSE-5B</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input 
                    type="date" 
                    value={filters.date} 
                    onChange={(e) => setFilters({...filters, date: e.target.value})}
                    className="w-40"
                  />
                </div>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Export Student Records</DialogTitle>
                    <DialogDescription>
                      Export filtered attendance records
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" onClick={() => handleExportReport('csv')} className="flex flex-col gap-1 h-16">
                        <FileText className="h-5 w-5" />
                        <span className="text-xs">CSV Export</span>
                      </Button>
                      <Button variant="outline" onClick={() => handleExportReport('excel')} className="flex flex-col gap-1 h-16">
                        <Download className="h-5 w-5" />
                        <span className="text-xs">Excel Export</span>
                      </Button>
                      <Button variant="outline" onClick={() => handleExportReport('pdf')} className="flex flex-col gap-1 h-16">
                        <FileText className="h-5 w-5" />
                        <span className="text-xs">PDF Export</span>
                      </Button>
                    </div>
                    <div className="text-sm text-gray-600">
                      Export will include: {attendanceRecords.filter(student => {
                        if (currentUser?.role === 'student') return (
                          student.id === currentUser?.id ||
                          student.rollNumber === currentUser?.rollNumber ||
                          student.name === currentUser?.name
                        );
                        if (currentUser?.role === 'parent') return student.id === currentUser?.children?.[0]?.id;
                        return true;
                      }).length} records
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Details</TableHead>
                  <TableHead>Course & Year</TableHead>
                  <TableHead className="text-center">Present</TableHead>
                  <TableHead className="text-center">Absent</TableHead>
                  <TableHead className="text-center">Excused</TableHead>
                  <TableHead className="text-center">Late</TableHead>
                  <TableHead className="text-center">Percentage</TableHead>
                  <TableHead className="text-center">Today's Status</TableHead>
                  {(currentUser.role === 'admin' || currentUser.role === 'faculty') && (
                    <TableHead>Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords
                  .filter(student => {
                    if (currentUser?.role === 'student') return (
                      student.id === currentUser?.id ||
                      student.rollNumber === currentUser?.rollNumber ||
                      student.name === currentUser?.name
                    );
                    if (currentUser?.role === 'parent') return student.id === currentUser?.children?.[0]?.id;
                    return true;
                  })
                  .map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Roll: {student.rollNumber}
                        </div>
                        {currentUser.role === 'admin' && student.biometricId && (
                          <div className="text-xs text-muted-foreground">
                            Biometric: {student.biometricId}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="outline" className="mb-1 block w-fit text-xs">
                          {student.course}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {student.year} • {student.semester}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="font-semibold">{student.present}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <XCircle className="h-3 w-3 text-red-600" />
                        <span className="font-semibold">{student.absent}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FileText className="h-3 w-3 text-blue-600" />
                        <span className="font-semibold">{student.excused}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-3 w-3 text-yellow-600" />
                        <span className="font-semibold">{student.late}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-semibold">{student.percentage}%</span>
                        <div className={`w-2 h-2 rounded-full ${
                          student.percentage >= 90 ? 'bg-green-500' : 
                          student.percentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={
                        student.todayStatus === 'present' ? 'default' : 
                        student.todayStatus === 'excused' ? 'secondary' :
                        student.todayStatus === 'late' ? 'outline' : 'destructive'
                      }>
                        {student.todayStatus}
                      </Badge>
                    </TableCell>
                    {(currentUser.role === 'admin' || currentUser.role === 'faculty') && (
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditStudent(student)}
                            title="Edit student attendance"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewStudent(student)}
                            title="View student details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Role-specific additional features */}
      {currentUser.role === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Hardware Integration Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Wifi className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-green-800">System Integration</div>
                      <div className="text-sm text-green-600">All devices synchronized</div>
                    </div>
                  </div>
                  <Badge variant="default">Online</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-blue-800">Mobile App Sync</div>
                      <div className="text-sm text-blue-600">Real-time attendance updates</div>
                    </div>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Attendance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Today's Attendance Rate</span>
                  <span className="font-semibold text-green-600">89.1%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Weekly Average</span>
                  <span className="font-semibold text-blue-600">87.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Monthly Trend</span>
                  <span className="font-semibold text-purple-600">↗ +2.3%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Hardware Efficiency</span>
                  <span className="font-semibold text-orange-600">95.8%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Old dialog components removed - now using page-based navigation */}
    </div>
  );
}
