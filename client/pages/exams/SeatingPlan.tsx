import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/contexts/AuthContext';
import { PermissionGuard } from '@/components/PermissionGuard';
import { cn } from '@/lib/utils';
import { 
  Plus, Search, Filter, Edit, Trash2, Eye, MapPin, Users, 
  Shuffle, Download, Upload, Settings, Grid3x3, RotateCcw,
  CheckCircle, AlertCircle, Copy, Share, Printer, FileText,
  Move, ZoomIn, ZoomOut, SquareCheck, UserCheck
} from 'lucide-react';

interface Seat {
  id: string;
  row: number;
  column: number;
  seatNumber: string;
  isOccupied: boolean;
  studentId?: string;
  studentName?: string;
  rollNumber?: string;
  status: 'available' | 'occupied' | 'blocked' | 'reserved';
  specialRequirement?: string;
}

interface ExamHall {
  id: string;
  hallName: string;
  building: string;
  floor: string;
  capacity: number;
  rows: number;
  columns: number;
  layout: string[][];
  facilities: string[];
  isAccessible: boolean;
  status: 'Active' | 'Maintenance' | 'Unavailable';
}

interface SeatingPlan {
  id: string;
  planName: string;
  examId: string;
  examName: string;
  examDate: string;
  examTime: string;
  hallId: string;
  hallName: string;
  totalSeats: number;
  occupiedSeats: number;
  availableSeats: number;
  blockedSeats: number;
  seats: Seat[];
  arrangement: 'random' | 'alphabetical' | 'rollNumber' | 'manual' | 'mixed_programs';
  specialInstructions: string;
  status: 'Draft' | 'Published' | 'Active' | 'Completed';
  createdBy: string;
  createdDate: string;
  lastModified: string;
}

const initialHalls: ExamHall[] = [
  {
    id: 'HALL001',
    hallName: 'Main Auditorium',
    building: 'Block A',
    floor: 'Ground Floor',
    capacity: 120,
    rows: 12,
    columns: 10,
    layout: Array(12).fill(null).map(() => Array(10).fill('seat')),
    facilities: ['Air Conditioning', 'CCTV', 'Public Address System', 'Emergency Exit'],
    isAccessible: true,
    status: 'Active'
  },
  {
    id: 'HALL002',
    hallName: 'Computer Lab 1',
    building: 'Block B',
    floor: '1st Floor',
    capacity: 60,
    rows: 10,
    columns: 6,
    layout: Array(10).fill(null).map(() => Array(6).fill('seat')),
    facilities: ['Air Conditioning', 'Computers', 'Projector'],
    isAccessible: false,
    status: 'Active'
  }
];

const initialPlans: SeatingPlan[] = [
  {
    id: 'PLAN001',
    planName: 'Mathematics End Semester - December 2024',
    examId: 'EX001',
    examName: 'Engineering Mathematics-III',
    examDate: '2024-12-10',
    examTime: '09:00 - 12:00',
    hallId: 'HALL001',
    hallName: 'Main Auditorium',
    totalSeats: 120,
    occupiedSeats: 85,
    availableSeats: 35,
    blockedSeats: 5,
    seats: [],
    arrangement: 'random',
    specialInstructions: 'Calculator allowed, separate seating for backlog students',
    status: 'Published',
    createdBy: 'Dr. Sarah Wilson',
    createdDate: '2024-11-15',
    lastModified: '2024-11-20'
  }
];

// Generate sample students for seating
const generateSampleStudents = (count: number) => {
  const students = [];
  for (let i = 1; i <= count; i++) {
    students.push({
      id: `ST${String(i).padStart(3, '0')}`,
      name: `Student ${i}`,
      rollNumber: `2024CSE${String(i).padStart(3, '0')}`,
      program: 'B.Tech Computer Science',
      semester: '3rd',
      specialRequirement: i % 20 === 0 ? 'Wheelchair accessible' : undefined
    });
  }
  return students;
};

export default function SeatingPlan() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<SeatingPlan[]>(initialPlans);
  const [halls, setHalls] = useState<ExamHall[]>(initialHalls);
  const [selectedPlan, setSelectedPlan] = useState<SeatingPlan | null>(null);
  const [selectedHall, setSelectedHall] = useState<ExamHall | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterHall, setFilterHall] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('plans');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showHallDialog, setShowHallDialog] = useState(false);
  const [showSeatingView, setShowSeatingView] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [zoomLevel, setZoomLevel] = useState(100);

  // Seating arrangement states
  const [arrangementType, setArrangementType] = useState<'random' | 'alphabetical' | 'rollNumber' | 'mixed_programs'>('random');
  const [gapBetweenStudents, setGapBetweenStudents] = useState(1);
  const [blockCornerSeats, setBlockCornerSeats] = useState(false);
  const [blockFrontRow, setBlockFrontRow] = useState(false);
  const [separateBacklogStudents, setSeparateBacklogStudents] = useState(false);

  // Form states
  const [newPlan, setNewPlan] = useState({
    planName: '',
    examId: '',
    examName: '',
    examDate: '',
    examTime: '',
    hallId: '',
    specialInstructions: ''
  });

  const [newHall, setNewHall] = useState({
    hallName: '',
    building: '',
    floor: '',
    capacity: 100,
    rows: 10,
    columns: 10,
    facilities: [],
    isAccessible: false
  });

  const students = generateSampleStudents(85);

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.examName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || plan.status === filterStatus;
    const matchesHall = filterHall === 'all' || plan.hallId === filterHall;
    
    return matchesSearch && matchesStatus && matchesHall;
  });

  const generateSeatingArrangement = (hallId: string, studentList: any[], arrangement: string) => {
    const hall = halls.find(h => h.id === hallId);
    if (!hall) return [];

    const seats: Seat[] = [];
    let studentIndex = 0;
    
    // Sort students based on arrangement type
    let sortedStudents = [...studentList];
    switch (arrangement) {
      case 'alphabetical':
        sortedStudents.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rollNumber':
        sortedStudents.sort((a, b) => a.rollNumber.localeCompare(b.rollNumber));
        break;
      case 'random':
        sortedStudents = sortedStudents.sort(() => Math.random() - 0.5);
        break;
    }

    for (let row = 0; row < hall.rows; row++) {
      for (let col = 0; col < hall.columns; col++) {
        const seatNumber = `${String.fromCharCode(65 + row)}${col + 1}`;
        let status: 'available' | 'occupied' | 'blocked' | 'reserved' = 'available';
        let studentData = null;

        // Apply blocking rules
        if (blockCornerSeats && ((row === 0 || row === hall.rows - 1) && (col === 0 || col === hall.columns - 1))) {
          status = 'blocked';
        } else if (blockFrontRow && row === 0) {
          status = 'blocked';
        } else if (gapBetweenStudents > 0 && ((row + col) % (gapBetweenStudents + 1) !== 0)) {
          status = 'blocked';
        } else if (studentIndex < sortedStudents.length) {
          const student = sortedStudents[studentIndex];
          status = 'occupied';
          studentData = {
            studentId: student.id,
            studentName: student.name,
            rollNumber: student.rollNumber,
            specialRequirement: student.specialRequirement
          };
          studentIndex++;
        }

        seats.push({
          id: `${hallId}_${row}_${col}`,
          row,
          column: col,
          seatNumber,
          isOccupied: status === 'occupied',
          ...studentData,
          status,
          specialRequirement: studentData?.specialRequirement
        });
      }
    }

    return seats;
  };

  const handleCreatePlan = () => {
    const seats = generateSeatingArrangement(newPlan.hallId, students, arrangementType);
    const hall = halls.find(h => h.id === newPlan.hallId);
    
    const plan: SeatingPlan = {
      id: `PLAN${String(plans.length + 1).padStart(3, '0')}`,
      ...newPlan,
      hallName: hall?.hallName || '',
      totalSeats: hall?.capacity || 0,
      occupiedSeats: seats.filter(s => s.status === 'occupied').length,
      availableSeats: seats.filter(s => s.status === 'available').length,
      blockedSeats: seats.filter(s => s.status === 'blocked').length,
      seats,
      arrangement: arrangementType,
      status: 'Draft',
      createdBy: user?.name || 'Unknown User',
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    };
    
    setPlans([...plans, plan]);
    setShowCreateDialog(false);
    setNewPlan({
      planName: '',
      examId: '',
      examName: '',
      examDate: '',
      examTime: '',
      hallId: '',
      specialInstructions: ''
    });
  };

  const handleRegenerateSeating = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    const newSeats = generateSeatingArrangement(plan.hallId, students, plan.arrangement);
    setPlans(plans.map(p => 
      p.id === planId 
        ? {
            ...p,
            seats: newSeats,
            occupiedSeats: newSeats.filter(s => s.status === 'occupied').length,
            availableSeats: newSeats.filter(s => s.status === 'available').length,
            blockedSeats: newSeats.filter(s => s.status === 'blocked').length,
            lastModified: new Date().toISOString().split('T')[0]
          }
        : p
    ));
  };

  const handlePublishPlan = (planId: string) => {
    setPlans(plans.map(p => 
      p.id === planId ? { ...p, status: 'Published' as const } : p
    ));
  };

  const handleSwapSeats = (planId: string, seat1Id: string, seat2Id: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    const newSeats = [...plan.seats];
    const seat1Index = newSeats.findIndex(s => s.id === seat1Id);
    const seat2Index = newSeats.findIndex(s => s.id === seat2Id);

    if (seat1Index !== -1 && seat2Index !== -1) {
      const seat1Data = {
        studentId: newSeats[seat1Index].studentId,
        studentName: newSeats[seat1Index].studentName,
        rollNumber: newSeats[seat1Index].rollNumber,
        isOccupied: newSeats[seat1Index].isOccupied,
        status: newSeats[seat1Index].status
      };

      const seat2Data = {
        studentId: newSeats[seat2Index].studentId,
        studentName: newSeats[seat2Index].studentName,
        rollNumber: newSeats[seat2Index].rollNumber,
        isOccupied: newSeats[seat2Index].isOccupied,
        status: newSeats[seat2Index].status
      };

      newSeats[seat1Index] = { ...newSeats[seat1Index], ...seat2Data };
      newSeats[seat2Index] = { ...newSeats[seat2Index], ...seat1Data };

      setPlans(plans.map(p =>
        p.id === planId ? { ...p, seats: newSeats, lastModified: new Date().toISOString().split('T')[0] } : p
      ));
    }
  };

  const handlePrintSeatingLayout = () => {
    // Create a printable version of the seating layout
    const printWindow = window.open('', '_blank');
    if (printWindow && selectedPlan) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Seating Layout - ${selectedPlan.planName}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .seat-grid { display: grid; gap: 2px; justify-content: center; }
              .seat { width: 40px; height: 40px; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; font-size: 10px; }
              .occupied { background-color: #f87171; }
              .available { background-color: #86efac; }
              .blocked { background-color: #9ca3af; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${selectedPlan.planName}</h1>
              <p>Hall: ${selectedPlan.hallName} | Capacity: ${selectedPlan.totalSeats} | Date: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="seat-grid" style="grid-template-columns: repeat(${selectedPlan.layout.columns}, 1fr);">
              ${selectedPlan.seats.map(seat => `
                <div class="seat ${seat.status}" title="${seat.studentName || seat.seatNumber}">
                  ${seat.seatNumber}
                </div>
              `).join('')}
            </div>
            <script>window.print(); window.close();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleExportSeatingLayout = () => {
    if (!selectedPlan) return;

    const exportData = {
      planInfo: {
        name: selectedPlan.planName,
        hall: selectedPlan.hallName,
        capacity: selectedPlan.totalSeats,
        occupied: selectedPlan.occupiedSeats,
        available: selectedPlan.availableSeats,
        blocked: selectedPlan.blockedSeats,
        exportDate: new Date().toISOString()
      },
      layout: {
        rows: selectedPlan.layout.rows,
        columns: selectedPlan.layout.columns
      },
      seats: selectedPlan.seats.map(seat => ({
        seatNumber: seat.seatNumber,
        row: seat.row,
        column: seat.column,
        status: seat.status,
        studentName: seat.studentName,
        rollNumber: seat.rollNumber,
        studentId: seat.studentId
      }))
    };

    // Create CSV content
    const csvContent = [
      ['Seat Number', 'Row', 'Column', 'Status', 'Student Name', 'Roll Number', 'Student ID'],
      ...selectedPlan.seats.map(seat => [
        seat.seatNumber,
        seat.row,
        seat.column,
        seat.status,
        seat.studentName || '',
        seat.rollNumber || '',
        seat.studentId || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `seating-layout-${selectedPlan.planName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    alert('Seating layout exported successfully!');
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Published': 'bg-green-100 text-green-800',
      'Active': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-purple-100 text-purple-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const getSeatColor = (seat: Seat) => {
    switch (seat.status) {
      case 'occupied':
        return 'bg-blue-500 text-white';
      case 'blocked':
        return 'bg-red-500 text-white';
      case 'reserved':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-200 text-gray-800 border-2 border-dashed border-gray-400';
    }
  };

  const renderSeatingGrid = (plan: SeatingPlan) => {
    const hall = halls.find(h => h.id === plan.hallId);
    if (!hall) return null;

    const seatSize = Math.max(24, Math.min(48, (zoomLevel / 100) * 32));

    return (
      <div className="p-4 bg-gray-50 rounded-lg overflow-auto">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h4 className="font-medium">Seating Layout - {hall.hallName}</h4>
            <p className="text-sm text-muted-foreground">
              {plan.occupiedSeats} occupied • {plan.availableSeats} available • {plan.blockedSeats} blocked
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm">{zoomLevel}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="inline-block">
            <div className="mb-4 text-center">
              <div className="bg-gray-800 text-white px-4 py-2 rounded">
                Front (Invigilator Desk)
              </div>
            </div>
            
            <div 
              className="grid gap-1"
              style={{ 
                gridTemplateColumns: `repeat(${hall.columns}, ${seatSize}px)`,
                gridTemplateRows: `repeat(${hall.rows}, ${seatSize}px)`
              }}
            >
              {plan.seats.map((seat) => (
                <div
                  key={seat.id}
                  className={cn(
                    "flex items-center justify-center text-xs font-medium rounded cursor-pointer transition-all hover:scale-110",
                    getSeatColor(seat)
                  )}
                  style={{ width: seatSize, height: seatSize }}
                  title={
                    seat.isOccupied 
                      ? `${seat.seatNumber}: ${seat.studentName} (${seat.rollNumber})`
                      : `${seat.seatNumber}: ${seat.status}`
                  }
                  onClick={() => {
                    if (seat.isOccupied) {
                      // Handle seat selection for swapping
                      console.log('Seat selected:', seat.seatNumber);
                    }
                  }}
                >
                  {seat.seatNumber}
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <div className="bg-gray-800 text-white px-4 py-2 rounded">
                Back (Exit)
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex justify-center">
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 border-2 border-dashed border-gray-400 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Blocked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>Reserved</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seating Plan Management</h1>
          <p className="text-muted-foreground">
            Create, manage, and optimize seating arrangements for examinations.
          </p>
        </div>
        <div className="flex gap-2">
          <PermissionGuard permission="exams.seating.export" fallback={null}>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Plans
            </Button>
          </PermissionGuard>
          <PermissionGuard permission="exams.seating.create" fallback={null}>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Create Seating Plan</DialogTitle>
                  <DialogDescription>
                    Set up a new seating arrangement for an examination.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="planName">Plan Name</Label>
                      <Input
                        id="planName"
                        value={newPlan.planName}
                        onChange={(e) => setNewPlan({...newPlan, planName: e.target.value})}
                        placeholder="Mathematics End Semester - December 2024"
                      />
                    </div>
                    <div>
                      <Label htmlFor="examName">Exam Name</Label>
                      <Input
                        id="examName"
                        value={newPlan.examName}
                        onChange={(e) => setNewPlan({...newPlan, examName: e.target.value})}
                        placeholder="Engineering Mathematics-III"
                      />
                    </div>
                    <div>
                      <Label htmlFor="examId">Exam ID</Label>
                      <Input
                        id="examId"
                        value={newPlan.examId}
                        onChange={(e) => setNewPlan({...newPlan, examId: e.target.value})}
                        placeholder="EX001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="examDate">Exam Date</Label>
                      <Input
                        id="examDate"
                        type="date"
                        value={newPlan.examDate}
                        onChange={(e) => setNewPlan({...newPlan, examDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="examTime">Exam Time</Label>
                      <Input
                        id="examTime"
                        value={newPlan.examTime}
                        onChange={(e) => setNewPlan({...newPlan, examTime: e.target.value})}
                        placeholder="09:00 - 12:00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hallId">Exam Hall</Label>
                      <Select value={newPlan.hallId} onValueChange={(value) => setNewPlan({...newPlan, hallId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select exam hall" />
                        </SelectTrigger>
                        <SelectContent>
                          {halls.map(hall => (
                            <SelectItem key={hall.id} value={hall.id}>
                              {hall.hallName} - {hall.building} (Capacity: {hall.capacity})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="specialInstructions">Special Instructions</Label>
                      <Textarea
                        id="specialInstructions"
                        value={newPlan.specialInstructions}
                        onChange={(e) => setNewPlan({...newPlan, specialInstructions: e.target.value})}
                        placeholder="Calculator allowed, separate seating for backlog students..."
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Seating Arrangement Settings</h4>
                    
                    <div>
                      <Label htmlFor="arrangementType">Arrangement Type</Label>
                      <Select value={arrangementType} onValueChange={(value: any) => setArrangementType(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select arrangement type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="random">Random</SelectItem>
                          <SelectItem value="alphabetical">Alphabetical</SelectItem>
                          <SelectItem value="rollNumber">Roll Number</SelectItem>
                          <SelectItem value="mixed_programs">Mixed Programs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Gap Between Students: {gapBetweenStudents}</Label>
                      <Slider
                        value={[gapBetweenStudents]}
                        onValueChange={(value) => setGapBetweenStudents(value[0])}
                        max={3}
                        min={0}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="blockCornerSeats"
                          checked={blockCornerSeats}
                          onCheckedChange={setBlockCornerSeats}
                        />
                        <Label htmlFor="blockCornerSeats">Block corner seats</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="blockFrontRow"
                          checked={blockFrontRow}
                          onCheckedChange={setBlockFrontRow}
                        />
                        <Label htmlFor="blockFrontRow">Block front row</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="separateBacklogStudents"
                          checked={separateBacklogStudents}
                          onCheckedChange={setSeparateBacklogStudents}
                        />
                        <Label htmlFor="separateBacklogStudents">Separate backlog students</Label>
                      </div>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <h5 className="font-medium mb-2">Preview Settings</h5>
                      <div className="text-sm space-y-1">
                        <div>Arrangement: <span className="font-medium">{arrangementType}</span></div>
                        <div>Gap between students: <span className="font-medium">{gapBetweenStudents}</span></div>
                        <div>Corner seats blocked: <span className="font-medium">{blockCornerSeats ? 'Yes' : 'No'}</span></div>
                        <div>Front row blocked: <span className="font-medium">{blockFrontRow ? 'Yes' : 'No'}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePlan}>
                    Create Seating Plan
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </PermissionGuard>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="plans">Seating Plans</TabsTrigger>
          <TabsTrigger value="halls">Exam Halls</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
                <Grid3x3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{plans.length}</div>
                <p className="text-xs text-muted-foreground">
                  {plans.filter(p => p.status === 'Published').length} published
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Seats</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {plans.reduce((sum, p) => sum + p.totalSeats, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Across all plans</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {plans.length > 0 
                    ? Math.round((plans.reduce((sum, p) => sum + p.occupiedSeats, 0) / plans.reduce((sum, p) => sum + p.totalSeats, 0)) * 100)
                    : 0
                  }%
                </div>
                <p className="text-xs text-muted-foreground">Average utilization</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Halls</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {halls.filter(h => h.status === 'Active').length}
                </div>
                <p className="text-xs text-muted-foreground">Ready for use</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search seating plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterHall} onValueChange={setFilterHall}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by hall" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Halls</SelectItem>
                {halls.map(hall => (
                  <SelectItem key={hall.id} value={hall.id}>{hall.hallName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <FileText className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Seating Plans */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlans.map((plan) => (
                <Card key={plan.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{plan.planName}</CardTitle>
                        <CardDescription>{plan.examName}</CardDescription>
                      </div>
                      <Badge className={getStatusBadge(plan.status)}>
                        {plan.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{plan.hallName}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {plan.examDate} • {plan.examTime}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-sm">
                        <div>
                          <div className="font-medium text-blue-600">{plan.occupiedSeats}</div>
                          <div className="text-xs text-muted-foreground">Occupied</div>
                        </div>
                        <div>
                          <div className="font-medium text-green-600">{plan.availableSeats}</div>
                          <div className="text-xs text-muted-foreground">Available</div>
                        </div>
                        <div>
                          <div className="font-medium text-red-600">{plan.blockedSeats}</div>
                          <div className="text-xs text-muted-foreground">Blocked</div>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => {
                            setSelectedPlan(plan);
                            setShowSeatingView(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <PermissionGuard permission="exams.seating.edit" fallback={null}>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </PermissionGuard>
                        <PermissionGuard permission="exams.seating.regenerate" fallback={null}>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRegenerateSeating(plan.id)}
                          >
                            <Shuffle className="h-4 w-4" />
                          </Button>
                        </PermissionGuard>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan Details</TableHead>
                      <TableHead>Exam Info</TableHead>
                      <TableHead>Hall & Capacity</TableHead>
                      <TableHead>Utilization</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{plan.planName}</div>
                            <div className="text-sm text-muted-foreground">
                              Created by {plan.createdBy}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {plan.createdDate}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{plan.examName}</div>
                            <div className="text-sm text-muted-foreground">{plan.examId}</div>
                            <div className="text-sm text-muted-foreground">
                              {plan.examDate} • {plan.examTime}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="text-sm">{plan.hallName}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Capacity: {plan.totalSeats}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{plan.occupiedSeats}/{plan.totalSeats}</div>
                            <div className="text-muted-foreground">
                              {Math.round((plan.occupiedSeats / plan.totalSeats) * 100)}% occupied
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(plan.status)}>
                            {plan.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedPlan(plan);
                                setShowSeatingView(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <PermissionGuard permission="exams.seating.edit" fallback={null}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </PermissionGuard>
                            <PermissionGuard permission="exams.seating.regenerate" fallback={null}>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRegenerateSeating(plan.id)}
                              >
                                <Shuffle className="h-4 w-4" />
                              </Button>
                            </PermissionGuard>
                            {plan.status === 'Draft' && (
                              <PermissionGuard permission="exams.seating.publish" fallback={null}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handlePublishPlan(plan.id)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              </PermissionGuard>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="halls" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Exam Halls</h3>
              <p className="text-sm text-muted-foreground">
                Manage examination hall configurations and layouts
              </p>
            </div>
            <PermissionGuard permission="exams.halls.create" fallback={null}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Hall
              </Button>
            </PermissionGuard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {halls.map((hall) => (
              <Card key={hall.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{hall.hallName}</CardTitle>
                      <CardDescription>{hall.building} - {hall.floor}</CardDescription>
                    </div>
                    <Badge className={getStatusBadge(hall.status)}>
                      {hall.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="font-medium">Capacity</div>
                        <div className="text-muted-foreground">{hall.capacity} seats</div>
                      </div>
                      <div>
                        <div className="font-medium">Layout</div>
                        <div className="text-muted-foreground">{hall.rows} × {hall.columns}</div>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-sm mb-1">Facilities</div>
                      <div className="flex flex-wrap gap-1">
                        {hall.facilities.slice(0, 2).map((facility, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {facility}
                          </Badge>
                        ))}
                        {hall.facilities.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{hall.facilities.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    {hall.isAccessible && (
                      <div className="flex items-center gap-1 text-sm">
                        <UserCheck className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Wheelchair Accessible</span>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            View Layout
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Hall Layout - {hall.hallName}</DialogTitle>
                            <DialogDescription>
                              Visual representation of {hall.hallName} seating arrangement and facilities
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Hall Information */}
                            <div className="grid grid-cols-2 gap-6">
                              <Card>
                                <CardHeader>
                                  <CardTitle>Hall Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                  <div><strong>Building:</strong> {hall.building}</div>
                                  <div><strong>Floor:</strong> {hall.floor}</div>
                                  <div><strong>Capacity:</strong> {hall.capacity} seats</div>
                                  <div><strong>Dimensions:</strong> {hall.rows} rows × {hall.columns} columns</div>
                                  <div><strong>Status:</strong> <Badge className={getStatusBadge(hall.status)}>{hall.status}</Badge></div>
                                  <div><strong>Accessibility:</strong> {hall.isAccessible ? 'Yes' : 'No'}</div>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardHeader>
                                  <CardTitle>Facilities</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-2 gap-2">
                                    {hall.facilities.map((facility, index) => (
                                      <div key={index} className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span>{facility}</span>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            {/* Layout Visualization */}
                            <Card>
                              <CardHeader>
                                <CardTitle>Seating Layout</CardTitle>
                                <CardDescription>
                                  Interactive visualization of hall seating arrangement
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                  <div className="flex justify-center mb-4">
                                    <div className="bg-gray-800 text-white px-6 py-2 rounded text-center">
                                      <div className="font-medium">Front (Instructor/Invigilator Area)</div>
                                      <div className="text-xs">Projector Screen • Whiteboard</div>
                                    </div>
                                  </div>

                                  <div className="flex justify-center">
                                    <div
                                      className="grid gap-1 p-4"
                                      style={{
                                        gridTemplateColumns: `repeat(${hall.columns}, 32px)`,
                                        gridTemplateRows: `repeat(${hall.rows}, 32px)`
                                      }}
                                    >
                                      {Array.from({ length: hall.rows * hall.columns }, (_, index) => {
                                        const row = Math.floor(index / hall.columns);
                                        const col = index % hall.columns;
                                        const seatNumber = `${String.fromCharCode(65 + row)}${col + 1}`;

                                        return (
                                          <div
                                            key={index}
                                            className="w-8 h-8 bg-blue-100 border border-blue-300 rounded flex items-center justify-center text-xs font-medium cursor-pointer hover:bg-blue-200 transition-colors"
                                            title={`Seat ${seatNumber} - Row ${row + 1}, Column ${col + 1}`}
                                          >
                                            {seatNumber}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  <div className="flex justify-center mt-4">
                                    <div className="bg-gray-800 text-white px-6 py-2 rounded text-center">
                                      <div className="font-medium">Back (Emergency Exits)</div>
                                      <div className="text-xs">Multiple Exit Points</div>
                                    </div>
                                  </div>
                                </div>

                                {/* Legend */}
                                <div className="mt-4 flex justify-center">
                                  <div className="flex gap-6 text-sm">
                                    <div className="flex items-center gap-2">
                                      <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                                      <span>Available Seats</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                                      <span>Accessible Seats</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                                      <span>Restricted Areas</span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Hall Statistics */}
                            <Card>
                              <CardHeader>
                                <CardTitle>Usage Statistics</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-4 gap-4 text-center">
                                  <div>
                                    <div className="text-2xl font-bold text-blue-600">{hall.capacity}</div>
                                    <div className="text-sm text-muted-foreground">Total Capacity</div>
                                  </div>
                                  <div>
                                    <div className="text-2xl font-bold text-green-600">
                                      {Math.floor(hall.capacity * 0.85)}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Avg. Utilization</div>
                                  </div>
                                  <div>
                                    <div className="text-2xl font-bold text-orange-600">
                                      {Math.ceil(hall.capacity / 30)}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Min. Invigilators</div>
                                  </div>
                                  <div>
                                    <div className="text-2xl font-bold text-purple-600">
                                      {hall.isAccessible ? 'Yes' : 'No'}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Accessible</div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Emergency Information */}
                            <Card>
                              <CardHeader>
                                <CardTitle>Emergency & Safety Information</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Emergency Exits</h4>
                                    <ul className="text-sm space-y-1">
                                      <li>• Main exit at the back of the hall</li>
                                      <li>• Secondary exit on the left side</li>
                                      <li>• Emergency exit near the front (staff only)</li>
                                    </ul>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Safety Features</h4>
                                    <ul className="text-sm space-y-1">
                                      <li>• Fire detection and sprinkler system</li>
                                      <li>• Emergency lighting and exit signs</li>
                                      <li>• First aid station near main entrance</li>
                                      <li>• Wheelchair accessible seating areas</li>
                                    </ul>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          <div className="flex justify-end gap-2 pt-4 border-t">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline">
                                  <Download className="h-4 w-4 mr-2" />
                                  Export Layout
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Export Hall Layout</DialogTitle>
                                  <DialogDescription>
                                    Choose export format for {hall.hallName} layout
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-3">
                                    <Button
                                      onClick={() => {
                                        const data = JSON.stringify({
                                          hall: hall,
                                          timestamp: new Date().toISOString(),
                                          type: 'hall_layout'
                                        }, null, 2);
                                        const blob = new Blob([data], { type: 'application/json' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `${hall.hallName}_layout.json`;
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);
                                        URL.revokeObjectURL(url);
                                      }}
                                      className="h-20 flex-col"
                                    >
                                      <FileText className="h-6 w-6 mb-2" />
                                      <span className="text-sm">JSON</span>
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        const csv = `Hall Name,Building,Floor,Capacity,Rows,Columns,Status,Accessible\n${hall.hallName},"${hall.building}","${hall.floor}",${hall.capacity},${hall.rows},${hall.columns},"${hall.status}",${hall.isAccessible}`;
                                        const blob = new Blob([csv], { type: 'text/csv' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `${hall.hallName}_layout.csv`;
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);
                                        URL.revokeObjectURL(url);
                                      }}
                                      className="h-20 flex-col"
                                    >
                                      <Download className="h-6 w-6 mb-2" />
                                      <span className="text-sm">CSV</span>
                                    </Button>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Export includes hall details, seating layout, and facility information.
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              onClick={() => {
                                window.print();
                              }}
                            >
                              <Printer className="h-4 w-4 mr-2" />
                              Print Layout
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline">
                                  <Share className="h-4 w-4 mr-2" />
                                  Share
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Share Hall Layout</DialogTitle>
                                  <DialogDescription>
                                    Share {hall.hallName} layout with colleagues
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label>Share via Email</Label>
                                    <Input placeholder="Enter email addresses..." />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Message (Optional)</Label>
                                    <Textarea placeholder="Add a message..." rows={3} />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline">Cancel</Button>
                                    <Button>Send</Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Exam Hall - {hall.hallName}</DialogTitle>
                            <DialogDescription>
                              Modify exam hall configuration and facilities
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit-hallName">Hall Name</Label>
                              <Input
                                id="edit-hallName"
                                defaultValue={hall.hallName}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-building">Building</Label>
                              <Input
                                id="edit-building"
                                defaultValue={hall.building}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-floor">Floor</Label>
                              <Select defaultValue={hall.floor}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Ground Floor">Ground Floor</SelectItem>
                                  <SelectItem value="1st Floor">1st Floor</SelectItem>
                                  <SelectItem value="2nd Floor">2nd Floor</SelectItem>
                                  <SelectItem value="3rd Floor">3rd Floor</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="edit-capacity">Capacity</Label>
                              <Input
                                id="edit-capacity"
                                type="number"
                                defaultValue={hall.capacity}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-rows">Rows</Label>
                              <Input
                                id="edit-rows"
                                type="number"
                                defaultValue={hall.rows}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-columns">Columns</Label>
                              <Input
                                id="edit-columns"
                                type="number"
                                defaultValue={hall.columns}
                              />
                            </div>
                            <div className="col-span-2">
                              <Label>Facilities</Label>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                {['Air Conditioning', 'CCTV', 'Public Address System', 'Emergency Exit', 'Computers', 'Projector', 'Whiteboard', 'WiFi'].map(facility => (
                                  <div key={facility} className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      id={facility}
                                      defaultChecked={hall.facilities.includes(facility)}
                                    />
                                    <Label htmlFor={facility} className="text-sm">{facility}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="col-span-2">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="accessible"
                                  defaultChecked={hall.isAccessible}
                                />
                                <Label htmlFor="accessible" className="text-sm">Wheelchair Accessible</Label>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="edit-status">Status</Label>
                              <Select defaultValue={hall.status}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Active">Active</SelectItem>
                                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                                  <SelectItem value="Unavailable">Unavailable</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline">Cancel</Button>
                            <Button>Save Changes</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hall Utilization</CardTitle>
                <CardDescription>
                  Usage statistics for examination halls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {halls.map(hall => {
                    const hallPlans = plans.filter(p => p.hallId === hall.id);
                    const avgOccupancy = hallPlans.length > 0 
                      ? Math.round((hallPlans.reduce((sum, p) => sum + p.occupiedSeats, 0) / hallPlans.reduce((sum, p) => sum + p.totalSeats, 0)) * 100)
                      : 0;
                    
                    return (
                      <div key={hall.id} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{hall.hallName}</div>
                          <div className="text-sm text-muted-foreground">
                            {hallPlans.length} plans created
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{avgOccupancy}%</div>
                          <div className="text-sm text-muted-foreground">Avg. occupancy</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Arrangement Methods</CardTitle>
                <CardDescription>
                  Popular seating arrangement strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['random', 'alphabetical', 'rollNumber', 'mixed_programs'].map(method => {
                    const count = plans.filter(p => p.arrangement === method).length;
                    const percentage = plans.length > 0 ? Math.round((count / plans.length) * 100) : 0;
                    
                    return (
                      <div key={method} className="flex justify-between items-center">
                        <div className="capitalize">{method.replace('_', ' ')}</div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-full bg-blue-500 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Seating View Dialog */}
      <Dialog open={showSeatingView} onOpenChange={setShowSeatingView}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Seating Layout - {selectedPlan?.planName}
            </DialogTitle>
            <DialogDescription>
              Interactive seating arrangement for {selectedPlan?.examName}
            </DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Hall: {selectedPlan.hallName}</div>
                    <div className="text-muted-foreground">Exam: {selectedPlan.examName}</div>
                  </div>
                  <div>
                    <div className="font-medium">Date: {selectedPlan.examDate}</div>
                    <div className="text-muted-foreground">Time: {selectedPlan.examTime}</div>
                  </div>
                  <div>
                    <div className="font-medium">Occupied: {selectedPlan.occupiedSeats}</div>
                    <div className="text-muted-foreground">Available: {selectedPlan.availableSeats}</div>
                  </div>
                  <div>
                    <div className="font-medium">Blocked: {selectedPlan.blockedSeats}</div>
                    <div className="text-muted-foreground">Total: {selectedPlan.totalSeats}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrintSeatingLayout}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Export Seating Layout</DialogTitle>
                        <DialogDescription>
                          Export the seating layout in various formats for distribution or backup
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="export-format">Export Format</Label>
                          <Select defaultValue="pdf">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pdf">PDF Document</SelectItem>
                              <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                              <SelectItem value="csv">CSV Data</SelectItem>
                              <SelectItem value="json">JSON Data</SelectItem>
                              <SelectItem value="image">PNG Image</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Export Options</Label>
                          <div className="space-y-2 mt-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="include-layout" defaultChecked />
                              <Label htmlFor="include-layout" className="text-sm">Include seating layout</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="include-students" defaultChecked />
                              <Label htmlFor="include-students" className="text-sm">Include student assignments</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="include-hall-details" defaultChecked />
                              <Label htmlFor="include-hall-details" className="text-sm">Include hall details</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="include-exam-info" defaultChecked />
                              <Label htmlFor="include-exam-info" className="text-sm">Include exam information</Label>
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="layout-orientation">Layout Orientation</Label>
                          <Select defaultValue="landscape">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="landscape">Landscape</SelectItem>
                              <SelectItem value="portrait">Portrait</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button onClick={handleExportSeatingLayout}>
                            <Download className="h-4 w-4 mr-2" />
                            Export Layout
                          </Button>
                        </DialogClose>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              {renderSeatingGrid(selectedPlan)}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
